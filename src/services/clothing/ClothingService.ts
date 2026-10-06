import type { RoupaItem, SugestaoRoupa } from '../../types/clothing'
import type { WeatherReport } from '../../types/weather'

/**
 * Vestuário do dia (§12).
 *
 * ── O que este serviço faz, e o que ele não faz ──────────────────────────
 * Cruza a leitura real do dia (temperatura aparente, índice uv, chance de
 * chuva, vento) e monta uma lista de roupa. É **recomendação de roupa**, não
 * orientação médica: não diz o que a pessoa tem, nem o que deve comprar, e
 * nunca promete que a roupa evita qualquer coisa (§13/§14).
 *
 * Dois itens são permanentes — sapato fechado e manga longa — porque valem
 * para qualquer dia de pesca em água salgada e mangue. Os outros só entram
 * quando o céu pede.
 *
 * Faixas de temperatura aparente:
 *   ≤ 12  frio        12–17  ameno       17–24  leve
 *   24–28  quente     > 28   muito quente
 */

type Faixa = {
  nome: string
  base: string
  ate: number
}

/** Faixas em ordem: a primeira cujo limite cobre a temperatura vence. */
const FAIXAS: Faixa[] = [
  {
    nome: 'frio',
    ate: 12,
    base: 'Roupa fechada: camisa de manga comprida, calça e um casaco ou colete.',
  },
  {
    nome: 'ameno',
    ate: 17,
    base: 'Camisa de manga longa com calça. De manhã e no fim da tarde leve um colete.',
  },
  {
    nome: 'leve',
    ate: 24,
    base: 'Camisa leve com bermuda ou calça de moletom.',
  },
  {
    nome: 'quente',
    ate: 28,
    base: 'Roupa leve e solta, de tecido que deixa o corpo respirar.',
  },
  {
    nome: 'muito quente',
    ate: Number.POSITIVE_INFINITY,
    base: 'Roupa bem leve e folgada. Prefira paninho de secagem rápida.',
  },
]

const faixaDe = (temperatura: number): Faixa =>
  FAIXAS.find((f) => temperatura <= f.ate) ?? FAIXAS[FAIXAS.length - 1]

/**
 * Monta a sugestão do dia.
 *
 * Sem leitura do clima devolve `null` — a tela mostra "precisamos do clima"
 * em vez de uma lista genérica que valeria para qualquer dia.
 */
export const sugerirRoupa = (report?: WeatherReport | null): SugestaoRoupa | null => {
  if (!report) return null

  const { current, hoje } = report
  const aparente = current.feelsLikeC
  const faixa = faixaDe(aparente)
  const uv = hoje.uvIndexMax
  const rajada = hoje.windMaxKmh ?? 0
  const chuvaAgora = current.precipitationMm
  const chanceChuva = hoje.precipitationProbabilityMaxPercent
  const maxDia = hoje.temperatureMaxC || current.temperatureC

  const itens: RoupaItem[] = []

  // ── Permanentes: valem para qualquer dia de água ──────────────────────────
  itens.push({
    motivo: 'pe',
    titulo: 'Sapato fechado, de sola firme',
    porque: 'Barco, pedra e lodo escorregam — e o pé fechado protege de uria e arraia.',
    essencial: true,
    glifo: 'bota',
  })

  itens.push({
    motivo: 'mao',
    titulo: 'Manga longa que não gruda',
    porque: 'Protege o braço do sol e das coisas do mar que pica, e seca mais rápido.',
    essencial: true,
    glifo: 'sol',
  })

  // ── Calor ────────────────────────────────────────────────────────────────
  if (aparente >= 28 || maxDia >= 30) {
    itens.push({
      motivo: 'calor',
      titulo: 'Roupa leve e folgada',
      porque: `Está sentindo ${Math.round(aparente)}°. Roupa apertada esquenta e incomoda.`,
      essencial: true,
      glifo: 'sol',
    })
  }

  if (maxDia >= 33) {
    itens.push({
      motivo: 'calor',
      titulo: 'Boné ou chapéu de aba larga',
      porque: `A máxima do dia é ${Math.round(maxDia)}°. Boné mantém o sol fora do rosto e do pescoço.`,
      essencial: false,
      glifo: 'sol',
    })
  }

  // ── Sol ──────────────────────────────────────────────────────────────────
  if (uv !== null && uv >= 6) {
    itens.push({
      motivo: 'sol',
      titulo: uv >= 9 ? 'Protetor solar no rosto, pescoço e braço' : 'Protetor solar no rosto e no pescoço',
      porque: `Índice uv até ${Math.round(uv)} hoje${uv >= 9 ? ' — forte' : ''}.`,
      essencial: uv >= 9,
      glifo: 'sol-forte',
    })
  }

  if (uv !== null && uv >= 3 && uv < 6) {
    itens.push({
      motivo: 'sol',
      titulo: 'Chapéu de aba larga',
      porque: `Índice uv até ${Math.round(uv)}: sol de meio dia ainda cansa.`,
      essencial: false,
      glifo: 'sol',
    })
  }

  // ── Chuva ────────────────────────────────────────────────────────────────
  const chuvaForte = chuvaAgora >= 2.5 || chanceChuva >= 85
  const chanceDeChuva = chuvaAgora >= 0.5 || chanceChuva >= 50

  if (chuvaForte) {
    itens.push({
      motivo: 'chuva',
      titulo: 'Roupa de chuva de verdade',
      porque: chuvaAgora >= 0.5
        ? `Está chovendo agora (${chuvaAgora.toFixed(1)} mm).`
        : `${Math.round(chanceChuva)}% de chance de chuva forte hoje.`,
      essencial: true,
      glifo: 'chuva',
    })
  } else if (chanceDeChuva) {
    itens.push({
      motivo: 'chuva',
      titulo: 'Capa de chuva ou jaleco impermeável',
      porque: `${Math.round(chanceChuva)}% de chance de chuva hoje. Leve mesmo que o céu esteja aberto.`,
      essencial: false,
      glifo: 'chuva',
    })
  }

  // ── Vento ────────────────────────────────────────────────────────────────
  if (current.windKmh >= 28 || rajada >= 38) {
    itens.push({
      motivo: 'vento',
      titulo: 'Corta-vento — e pense duas vezes em sair',
      porque: rajada >= 38
        ? `Rajadas de até ${Math.round(rajada)} km/h hoje. Vento assim dificulta a navegação.`
        : `Vento de ${Math.round(current.windKmh)} km/h agora.`,
      essencial: true,
      glifo: 'vento',
    })
  } else if (current.windKmh >= 18 || rajada >= 25) {
    itens.push({
      motivo: 'vento',
      titulo: 'Camisa de vento por cima',
      porque: rajada >= 25
        ? `Rajadas de até ${Math.round(rajada)} km/h hoje.`
        : `Vento de ${Math.round(current.windKmh)} km/h agora.`,
      essencial: false,
      glifo: 'vento',
    })
  }

  // ── Frio ─────────────────────────────────────────────────────────────────
  if (aparente <= 17) {
    itens.push({
      motivo: 'frio',
      titulo: 'Casaco ou colete de corpo',
      porque: `Sensação de ${Math.round(aparente)}°. O vento do mar gelado entra na manga se ela estiver curta.`,
      essencial: true,
      glifo: 'frio',
    })
  }

  // ── Resumo ───────────────────────────────────────────────────────────────
  const partes: string[] = []
  if (chuvaForte) partes.push('com chuva')
  else if (chanceDeChuva) partes.push('com chuva à vista')
  if (current.windKmh >= 18 || rajada >= 25) partes.push('com vento')
  if (uv !== null && uv >= 8) partes.push('de sol forte')
  else if (uv !== null && uv >= 5) partes.push('de sol')
  if (aparente >= 28) partes.push('bem quente')
  else if (aparente <= 12) partes.push('bem frio')

  const resumo = partes.length > 0 ? `Dia ${faixa.nome}, ${partes.join(', ')}.` : `Dia ${faixa.nome}.`

  return {
    temperaturaAparenteC: aparente,
    resumo,
    base: faixa.base,
    itens,
  }
}