import { ordemRisco, riskCategories, type RiskAssessment, type RiskLevel } from '../../types/risk'
import type { WeatherReport } from '../../types/weather'

/**
 * Avaliação de riscos (§13).
 *
 * ── O que mudou, e por que ──────────────────────────────────────────────
 * Antes esta função não recebia nada e devolvia "atenção" para as nove
 * categorias, todo dia. A tela dizia "Hoje há pontos de atenção" sem que
 * houvesse qualquer dado por trás — e o §17 proíbe exatamente isso.
 *
 * Agora cada categoria é classificada a partir da leitura real do dia. E
 * quando **não existe** dado para avaliar, a resposta é `sem-dados`, com a
 * mensagem dizendo isso. Preferimos um cartão honesto a um cartão bonito e
 * falso.
 *
 * Limites que valem lembrar: índice uv e rajada vêm da previsão do dia; o
 * vento do momento vem da observação. Nada aqui é medido no mar — é previsão,
 * e a tela fala "previsão".
 */

const SEM_CLIMA = 'Precisamos do clima de hoje para avaliar. Tente atualizar em instantes.'

/** Escolhe o nível a partir de três faixas. */
const nivel = (
  fraco: RiskLevel,
  medio: RiskLevel,
  forte: RiskLevel,
  passouMedio: boolean,
  passouForte: boolean,
): RiskLevel => {
  if (passouForte) return forte
  if (passouMedio) return medio
  return fraco
}

const semRiscoDeRaio = (codigo: number): boolean => codigo < 80

/**
 * Avalia as nove categorias a partir da leitura do dia.
 * Sem leitura, tudo volta como `sem-dados` — nunca como "baixo risco".
 */
export const assessRisks = (report?: WeatherReport | null): RiskAssessment[] => {
  if (!report) {
    return riskCategories.map((c) => ({
      categoryId: c.id,
      level: 'sem-dados' as const,
      message: SEM_CLIMA,
    }))
  }

  const { current, hoje } = report
  const uv = hoje.uvIndexMax
  const rajada = hoje.windMaxKmh ?? 0
  const chuvaAgora = current.precipitationMm
  const chanceChuva = hoje.precipitationProbabilityMaxPercent
  const temperatura = hoje.temperatureMaxC || current.temperatureC
  const codigo = current.weatherCode

  const porId: Record<string, RiskAssessment> = {
    sun: {
      categoryId: 'sun',
      level: uv === null ? 'sem-dados' : nivel('low', 'attention', 'attention', uv >= 8, false),
      message:
        uv === null
          ? SEM_CLIMA
          : uv >= 8
            ? `Índice uv até ${Math.round(uv)}. Use proteção solar, chapéu e beba água.`
            : uv >= 5
              ? `Índice uv até ${Math.round(uv)}. Protetor solar ajuda.`
              : `Índice uv baixo hoje (${Math.round(uv)}). Ainda assim, sol de praia queima.`,
    },

    rain: {
      categoryId: 'rain',
      level: nivel(
        'low',
        'attention',
        'high',
        chuvaAgora >= 0.5 || chanceChuva >= 50,
        chuvaAgora >= 2.5 || chanceChuva >= 85,
      ),
      message:
        chuvaAgora >= 0.5
          ? `Está chovendo agora (${chuvaAgora.toFixed(1)} mm).`
          : chanceChuva >= 60
            ? `${Math.round(chanceChuva)}% de chance de chuva hoje. Leve guarda-chuva.`
            : `Chuva com ${Math.round(chanceChuva)}% de chance hoje.`,
    },

    wind: {
      categoryId: 'wind',
      level: nivel(
        'low',
        'attention',
        'high',
        current.windKmh >= 17 || rajada >= 25,
        current.windKmh >= 28 || rajada >= 38,
      ),
      message:
        current.windKmh >= 28
          ? `Vento forte agora: ${Math.round(current.windKmh)} km/h. Torna a navegação difícil.`
          : rajada >= 32
            ? `Rajadas de até ${Math.round(rajada)} km/h hoje.`
            : `Vento de ${Math.round(current.windKmh)} km/h agora.`,
    },

    lightning: {
      categoryId: 'lightning',
      level: nivel('low', 'attention', 'high', codigo >= 80, codigo >= 95),
      message:
        codigo >= 95
          ? 'Há risco de raio agora. Evite água aberta e o contacto com metal.'
          : semRiscoDeRaio(codigo)
            ? 'Sem alerta de raio na previsão de hoje.'
            : 'Raios formam-se em nuvens de tempestade. Se escutar trovão, saia da água.',
    },

    // Maré e correnteza: sem fonte verificada, não inventamos (§10).
    tide: {
      categoryId: 'tide',
      level: 'sem-dados',
      message: 'Ainda não temos fonte de maré verificada para Itapissuma.',
    },
    current: {
      categoryId: 'current',
      level: 'sem-dados',
      message: 'A correnteza muda de ponto a ponto. Só quem conhece o canal diz com certeza.',
    },

    // Orientações permanentes: não são "condição do dia", por isso não sobem
    // nem descem de nível.
    animals: {
      categoryId: 'animals',
      level: 'low',
      message: 'Muita coisa do mar pica: uria, cavalo-marinho, arraia. Olhe antes de puxar a rede.',
    },
    injuries: {
      categoryId: 'injuries',
      level: 'low',
      message: 'Leve o kit de primeiros socorros e confira as ferramentas antes de sair.',
    },

    dehydration: {
      categoryId: 'dehydration',
      level: nivel('low', 'attention', 'attention', temperatura >= 28, temperatura >= 33),
      message:
        temperatura >= 33
          ? 'Dia muito quente. Leve bastante água e descanse sob sombra.'
          : `Máxima de ${Math.round(temperatura)}° hoje. Beba água com regularidade.`,
    },
  }

  return riskCategories.map((c) => porId[c.id])
}

/** Pior nível entre os que **têm** dado. */
export const piorRisco = (avaliacoes: RiskAssessment[]): RiskLevel => {
  const comDado = avaliacoes.filter((a) => a.level !== 'sem-dados')
  if (comDado.length === 0) return 'sem-dados'

  return comDado.reduce<RiskLevel>(
    (pior, a) => (ordemRisco.indexOf(a.level) > ordemRisco.indexOf(pior) ? a.level : pior),
    'low',
  )
}

/** Primeiro item no nível mais alto — é o que o app fala em voz alta. */
export const alertaPrincipal = (avaliacoes: RiskAssessment[]): RiskAssessment | null => {
  const alvo = piorRisco(avaliacoes)
  if (alvo === 'sem-dados' || alvo === 'low') return null
  return avaliacoes.find((a) => a.level === alvo) ?? null
}

export { riskCategories, riskLevelMeta, ordemRisco } from '../../types/risk'
export type { RiskAssessment, RiskCategory, RiskLevel } from '../../types/risk'
