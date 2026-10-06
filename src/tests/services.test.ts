import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { answer, criarAssistente, detectarIntencao } from '../services/assistant/AssistantEngine'
import { diagnosticar, isVoiceInputSupported, listenOnce } from '../services/assistant/VoiceInput'
import { pararFala, speak, temSinteseDeVoz } from '../services/assistant/VoiceOutput'
import { fetchWeather, weatherCodeToLabel } from '../services/weather/WeatherService'
import { alertaPrincipal, assessRisks, piorRisco } from '../services/risks/RiskService'
import { fetchFish } from '../services/fish/FishService'
import { fetchHealthUnits } from '../services/health/HealthService'
import { TideProviderDemo } from '../services/tide/TideProviderDemo'
import { irParaInicio, registrarRota, reiniciarHistorico, rotaAnterior } from '../lib/historico'
import { riskCategories, type RiskAssessment } from '../types/risk'

/* ------------------------------------------------------------------ *
 * Reconhecimento de intenção
 * ------------------------------------------------------------------ */
describe('Detecção de intenção', () => {
  it('reconhece clima com acentos, maiúsculas e pontuação', () => {
    expect(detectarIntencao('Como está o tempo hoje?')).toBe('clima')
    expect(detectarIntencao('VAI CHOVER?')).toBe('clima')
    expect(detectarIntencao('tá com muito vento')).toBe('clima')
  })

  it('separa maré de clima', () => {
    expect(detectarIntencao('Como está a maré?')).toBe('mare')
    expect(detectarIntencao('A preamar é quando?')).toBe('mare')
  })

  it('entende a pergunta principal do projeto: "posso pescar?"', () => {
    expect(detectarIntencao('Posso sair para pescar?')).toBe('pescar_agora')
    expect(detectarIntencao('dá pra pescar agora')).toBe('pescar_agora')
    expect(detectarIntencao('vale a pena pescar hoje')).toBe('pescar_agora')
  })

  it('distingue unidade de saúde de sintoma', () => {
    expect(detectarIntencao('Onde fica o posto de saúde?')).toBe('unidade')
    expect(detectarIntencao('Estou com coceira')).toBe('sintoma')
    expect(detectarIntencao('estou com dor de cabeça')).toBe('sintoma')
  })

  it('reconhece conversa de cortesia', () => {
    expect(detectarIntencao('oi')).toBe('saudacao')
    expect(detectarIntencao('obrigada')).toBe('agradecimento')
    expect(detectarIntencao('tchau')).toBe('despedida')
  })

  it('sabe explicar o que ela faz', () => {
    expect(detectarIntencao('o que você sabe?')).toBe('capacidade')
  })

  it('devolve desconhecido quando não entende', () => {
    expect(detectarIntencao('qual seu nome?')).toBe('desconhecido')
    expect(detectarIntencao('')).toBe('desconhecido')
  })
})

/** Payload de clima limpo, reaproveitado nos testes. */
const climaBom = {
  current: {
    time: '2026-10-04T12:00',
    temperature_2m: 27,
    relative_humidity_2m: 62,
    apparent_temperature: 28,
    precipitation: 0,
    weather_code: 0,
    wind_speed_10m: 18,
    wind_direction_10m: 90,
  },
  hourly: {
    time: ['2026-10-04T12:00'],
    temperature_2m: [27],
    precipitation_probability: [30],
    weather_code: [0],
  },
  daily: {
    time: [],
    weather_code: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    precipitation_probability_max: [],
  },
}

/* ------------------------------------------------------------------ *
 * A assistente nunca inventa (§17)
 * ------------------------------------------------------------------ */
describe('Assistente — nunca inventa', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('admite quando não sabe, e diz o que sabe fazer', async () => {
    const resposta = await answer('quem é você mesmo?')
    expect(resposta).toMatch(/não sei responder/i)
    expect(resposta).toMatch(/posso falar/i)
  })

  it('não promete maré enquanto não houver fonte verificada', async () => {
    const resposta = await answer('como está a maré?')
    expect(resposta).toMatch(/não tenho dados de maré confiáveis/i)
    // Nenhum número pode aparecer como se fosse medição real
    expect(resposta).not.toMatch(/\d+[,.]\d+\s*m/)
  })

  it('não dá diagnóstico médico nem probabilidade de doença', async () => {
    const resposta = await answer('estou com dor, o que eu tenho?')
    expect(resposta).not.toMatch(/\d+\s*%/)
    expect(resposta).toMatch(/não faço diagnóstico/i)
    expect(resposta).toMatch(/avaliação/i)
  })

  it('orienta pelo sintoma citado, sem diagnosticar', async () => {
    const resposta = await answer('estou com coceira, o que faço?')
    expect(resposta).toMatch(/avaliação/i)
  })

  it('nunca promete segurança absoluta', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => climaBom,
    } as unknown as Response)

    const resposta = await answer('posso pescar?')
    expect(resposta).not.toMatch(/100% seguro|é seguro|garantido/i)
    expect(resposta).toMatch(/favoráveis|não sair|guarda-chuva/i)
  })

  it('não quebra quando a API de clima está fora do ar', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('failed to fetch'))
    const resposta = await answer('como está o tempo?')
    expect(resposta).toMatch(/não consegui buscar|conexão/i)
  })

  it('responde clima com dados reais quando a API responde', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => climaBom,
    } as unknown as Response)

    const resposta = await answer('como está o tempo?')
    expect(resposta).toContain('27')
    expect(resposta).toContain('Itapissuma')
  })
})

/* ------------------------------------------------------------------ *
 * Conversa — memória entre turnos
 * ------------------------------------------------------------------ */
describe('Assistente — memória de conversa', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => climaBom,
    } as unknown as Response)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('guarda o assunto em foco', async () => {
    const maré = criarAssistente()
    await maré.perguntar('como está a maré?')
    expect(maré.assuntoAtual).toBe('mare')
  })

  it('reaproveita o clima: a segunda pergunta não busca de novo', async () => {
    const maré = criarAssistente()
    await maré.perguntar('como está o tempo?')
    const primeira = vi.mocked(fetch).mock.calls.length

    await maré.perguntar('e o vento agora?')
    expect(vi.mocked(fetch).mock.calls.length).toBe(primeira)
  })

  it('cada assistente tem a sua memória', async () => {
    const a = criarAssistente()
    const b = criarAssistente()
    await a.perguntar('como está a maré?')
    expect(b.assuntoAtual).toBeNull()
  })

  it('toda resposta cabe numa frase falada', async () => {
    const maré = criarAssistente()
    const resposta = await maré.perguntar('o que você sabe?')
    expect(resposta.length).toBeLessThanOrEqual(321)
  })
})

/* ------------------------------------------------------------------ *
 * WeatherService — internet, API, dado vazio (§33)
 * ------------------------------------------------------------------ */
describe('WeatherService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('traduz códigos WMO para rótulos em português', () => {
    expect(weatherCodeToLabel(0)).toBe('Céu limpo')
    expect(weatherCodeToLabel(95)).toBe('Tempestade')
  })

  it('avisa quando não há internet', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('network error'))
    await expect(fetchWeather()).rejects.toThrow(/conexão/i)
  })

  it('avisa quando o serviço responde erro', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response)
    await expect(fetchWeather()).rejects.toThrow(/indisponível/i)
  })

  it('avisa quando a resposta vem incompleta', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({}) } as unknown as Response)
    await expect(fetchWeather()).rejects.toThrow(/incompleta/i)
  })

  it('aceita payload sem previsão por hora (não quebra a tela)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-10-04T12:00',
          temperature_2m: 27,
          relative_humidity_2m: 62,
          apparent_temperature: 28,
          precipitation: 0,
          weather_code: 0,
          wind_speed_10m: 18,
          wind_direction_10m: 90,
        },
      }),
    } as unknown as Response)

    const report = await fetchWeather()
    expect(report.hourly).toEqual([])
    expect(report.daily).toEqual([])
    expect(report.source).toBe('Open-Meteo')
  })
})

/* ------------------------------------------------------------------ *
 * FishService e HealthService — banco fora do ar (§33)
 * ------------------------------------------------------------------ */
describe('FishService', () => {
  it('cai para os dados locais quando o Supabase não está configurado', async () => {
    const { fish, source } = await fetchFish()
    expect(fish.length).toBeGreaterThan(0)
    expect(source).toMatch(/locais/i)
  })

  it('toda espécie tem nome e nome científico', async () => {
    const { fish } = await fetchFish()
    for (const item of fish) {
      expect(item.name).toBeTruthy()
      expect(item.scientificName).toBeTruthy()
    }
  })
})

describe('HealthService', () => {
  it('cai para os dados locais quando o Supabase não está configurado', async () => {
    const { units, source } = await fetchHealthUnits()
    expect(units.length).toBeGreaterThan(0)
    expect(source).toMatch(/locais/i)
  })

  it('não inventa telefone: campo vazio fica indefinido', async () => {
    const { units } = await fetchHealthUnits()
    for (const unit of units) {
      if (unit.phone !== undefined) expect(unit.phone).toMatch(/\d/)
    }
  })
})

/* ------------------------------------------------------------------ *
 * RiskService — os níveis dependem do clima real
 * ------------------------------------------------------------------ */

/** Fabrica uma leitura de clima, sobrescrevendo só o que o teste muda. */
const leitura = (
  mudancas: {
    weatherCode?: number
    windKmh?: number
    precip?: number
    uv?: number | null
    rajada?: number | null
    chanceChuva?: number
    tempMax?: number
    /** Sensação térmica — é por ela que a faixa de roupa é escolhida. */
    sensacao?: number
  } = {},
) => ({
  locationName: 'Itapissuma, PE',
  current: {
    temperatureC: mudancas.sensacao ?? 27,
    feelsLikeC: mudancas.sensacao ?? 28,
    humidityPercent: 62,
    precipitationMm: mudancas.precip ?? 0,
    windKmh: mudancas.windKmh ?? 12,
    windDirectionDeg: 90,
    weatherCode: mudancas.weatherCode ?? 0,
    updatedAt: '2026-10-06T12:00',
  },
  hourly: [],
  daily: [],
  hoje: {
    uvIndexMax: mudancas.uv === undefined ? 9 : mudancas.uv,
    windMaxKmh: mudancas.rajada === undefined ? 20 : mudancas.rajada,
    precipitationProbabilityMaxPercent: mudancas.chanceChuva ?? 10,
    temperatureMaxC: mudancas.tempMax ?? 30,
  },
  source: 'Open-Meteo',
  baixadoEm: '2026-10-06T12:05:00.000Z',
})

const nivel = (avaliacoes: RiskAssessment[], id: string) =>
  avaliacoes.find((a) => a.categoryId === id)?.level

describe('RiskService', () => {
  it('avalia todas as categorias com um nível válido', () => {
    const avaliacoes = assessRisks(leitura())
    expect(avaliacoes).toHaveLength(riskCategories.length)
    for (const a of avaliacoes) {
      expect(['low', 'attention', 'high', 'sem-dados']).toContain(a.level)
      expect(a.message.length).toBeGreaterThan(0)
    }
  })

  it('sem leitura do clima, devolve "sem dados" — nunca "baixo risco"', () => {
    const avaliacoes = assessRisks(null)
    for (const a of avaliacoes) {
      expect(a.level).toBe('sem-dados')
    }
    // Um cartão bonito e falso é pior que um cartão honesto.
    expect(avaliacoes.some((a) => a.level === 'low')).toBe(false)
  })

  it('maré e correnteza ficam sem dados: não temos fonte verificada', () => {
    const avaliacoes = assessRisks(leitura())
    expect(nivel(avaliacoes, 'tide')).toBe('sem-dados')
    expect(nivel(avaliacoes, 'current')).toBe('sem-dados')
  })

  it('sol forte sobe para atenção; uv baixo fica sem alerta', () => {
    expect(nivel(assessRisks(leitura({ uv: 11 })), 'sun')).toBe('attention')
    expect(nivel(assessRisks(leitura({ uv: 1 })), 'sun')).toBe('low')
  })

  it('chuva forte vira alto risco', () => {
    const avaliacoes = assessRisks(leitura({ precip: 6, chanceChuva: 95 }))
    expect(nivel(avaliacoes, 'rain')).toBe('high')
  })

  it('rajada forte vira alto risco mesmo com o vento calmo agora', () => {
    // O risco vem da rajada do dia, não só da observação do instante.
    const avaliacoes = assessRisks(leitura({ windKmh: 8, rajada: 45 }))
    expect(nivel(avaliacoes, 'wind')).toBe('high')
  })

  it('tempestade marca raio como alto risco', () => {
    expect(nivel(assessRisks(leitura({ weatherCode: 95 })), 'lightning')).toBe('high')
    expect(nivel(assessRisks(leitura({ weatherCode: 3 })), 'lightning')).toBe('low')
  })

  it('os níveis mudam conforme o dia muda', () => {
    const bom = assessRisks(
      leitura({ weatherCode: 0, windKmh: 8, precip: 0, uv: 2, chanceChuva: 5, tempMax: 27 }),
    )
    const ruim = assessRisks(
      leitura({ weatherCode: 95, windKmh: 35, precip: 8, uv: 10, chanceChuva: 95, tempMax: 36 }),
    )

    expect(piorRisco(bom)).toBe('low')
    expect(piorRisco(ruim)).toBe('high')
  })

  it('escolhe o alerta principal e não promete segurança', () => {
    const avaliacoes = assessRisks(leitura({ weatherCode: 95 }))
    const alerta = alertaPrincipal(avaliacoes)
    expect(alerta).not.toBeNull()
    expect(alerta?.level).toBe('high')

    const tranquilo = assessRisks(
      leitura({ uv: 1, weatherCode: 0, windKmh: 8, chanceChuva: 0, tempMax: 27, precip: 0 }),
    )
    expect(alertaPrincipal(tranquilo)).toBeNull()
  })

  it('nenhuma mensagem promete segurança absoluta', () => {
    const cenarios = [
      leitura(),
      leitura({ weatherCode: 95 }),
      leitura({ uv: 11, precip: 6, chanceChuva: 95, windKmh: 30, rajada: 45, tempMax: 36 }),
    ]
    for (const c of cenarios) {
      for (const a of assessRisks(c)) {
        expect(a.message).not.toMatch(/100%|é seguro|garantido|sem risco/i)
      }
    }
  })
})

/* ------------------------------------------------------------------ *
 * Voz — navegador sem suporte, sem HTTPS, sem permissão (§33)
 * ------------------------------------------------------------------ */
describe('Assistente de voz — diagnóstico', () => {
  it('detecta que não há suporte a reconhecimento', () => {
    expect(isVoiceInputSupported()).toBe(false)
    expect(diagnosticar()).toMatchObject({ podeUsar: false, motivo: 'sem-navegador' })
  })

  it('avisa e libera a interface quando o microfone não existe', () => {
    const aoTexto = vi.fn()
    const aoErro = vi.fn()
    const aoEncerrar = vi.fn()

    const sessao = listenOnce({ aoTexto, aoErro, aoEncerrar })

    expect(aoTexto).not.toHaveBeenCalled()
    expect(aoErro).toHaveBeenCalledWith(expect.stringMatching(/não tem reconhecimento de voz/i))
    expect(aoEncerrar).toHaveBeenCalled()
    // A sessão existe mesmo sem suporte, para a tela nunca ficar sem callback.
    expect(() => sessao.parar()).not.toThrow()
  })

  it('oferece um caminho quando o navegador não suporta voz', () => {
    // §33: a mensagem precisa dizer o que fazer, não apenas que falhou.
    expect(diagnosticar().mensagem).toMatch(/botões/i)
  })

  it('speak() não lança exceção quando não há síntese de voz', () => {
    expect(() => speak('teste')).not.toThrow()
  })

  it('speak() avisa que não falou quando o aparelho é mudo', () => {
    // Em Node não existe speechSynthesis: a tela precisa saber para não
    // fingir que a Maré falou.
    expect(speak('teste')).toBe(false)
    expect(temSinteseDeVoz()).toBe(false)
  })

  it('pararFala() é seguro sem síntese de voz', () => {
    expect(() => pararFala()).not.toThrow()
  })

  it('explica o caso mais provável no campo: endereço sem https', () => {
    const { mensagem } = diagnosticar()
    expect(mensagem.length).toBeGreaterThan(20)
    expect(mensagem).toMatch(/botões/i)
  })
})

/* ------------------------------------------------------------------ *
 * Histórico interno — o botão Voltar não pode sair do app (§33)
 * ------------------------------------------------------------------ */
describe('Histórico de navegação', () => {
  beforeEach(() => reiniciarHistorico())

  it('volta para a tela anterior', () => {
    registrarRota('/')
    registrarRota('/clima')
    registrarRota('/saude')
    expect(rotaAnterior('/saude')).toBe('/clima')
  })

  it('vai para o Início quando o app foi aberto direto numa tela', () => {
    registrarRota('/clima')
    expect(rotaAnterior('/clima')).toBe('/')
  })

  it('não fica preso em ida e volta infinita', () => {
    registrarRota('/')
    registrarRota('/peixes')
    registrarRota('/voz')
    expect(rotaAnterior('/voz')).toBe('/peixes')
    // usuário volta: a pilha é truncada, não duplicada
    registrarRota('/peixes')
    expect(rotaAnterior('/peixes')).toBe('/')
  })

  it('ir para o Início descarta o caminho anterior', () => {
    registrarRota('/')
    registrarRota('/clima')
    registrarRota('/riscos')
    irParaInicio()
    registrarRota('/')
    expect(rotaAnterior('/')).toBe('/')
  })

  it('nunca devolve uma rota fora do aplicativo', () => {
    registrarRota('/mapa')
    const destino = rotaAnterior('/mapa')
    expect(destino).toMatch(/^\//)
    expect(destino).toBe('/')
  })
})

/* ------------------------------------------------------------------ *
 * Maré — provider em modo demonstração (§10)
 * ------------------------------------------------------------------ */
describe('TideProviderDemo', () => {
  const provider = new TideProviderDemo()

  it('se declara como demonstração', () => {
    expect(provider.isDemo).toBe(true)
    expect(provider.getAttribution()).toMatch(/DEMONSTRAÇÃO/i)
  })

  it('não devolve maré inventada', async () => {
    await expect(provider.getNextTides(-7.665, -34.83, 2)).resolves.toEqual([])
  })

  it('só cobre a região de Itapissuma', () => {
    expect(provider.supportsLocation(-7.665, -34.83)).toBe(true)
    expect(provider.supportsLocation(-23.55, -46.63)).toBe(false)
  })
})
