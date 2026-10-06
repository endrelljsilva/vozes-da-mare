/**
 * Contratos da central de riscos (§13).
 *
 * `sem-dados` existe por um motivo: enquanto não houver fonte verificada para
 * maré e correnteza, o aplicativo precisa **dizer que não sabe** — nunca
 * preencher com um nível inventado para a tela ficar bonita.
 */

export type RiskLevel = 'low' | 'attention' | 'high' | 'sem-dados'

export interface RiskCategory {
  id: string
  label: string
  emoji: string
}

export interface RiskAssessment {
  categoryId: string
  level: RiskLevel
  message: string
}

export const riskLevelMeta: Record<RiskLevel, { label: string; emoji: string; tone: string }> = {
  low: {
    label: 'SEM ALERTA',
    emoji: '🟢',
    // Nada aqui promete que é seguro: diz apenas que não há alerta do dia.
    tone: 'Nenhum alerta do dia para este item. A orientação continua valendo.',
  },
  attention: {
    label: 'ATENÇÃO',
    emoji: '🟡',
    tone: 'Alguma condição pede cuidado hoje.',
  },
  high: {
    label: 'ALTO RISCO',
    emoji: '🔴',
    tone: 'Evite se expor. Procure local seguro.',
  },
  'sem-dados': {
    label: 'SEM DADOS',
    emoji: '⚪',
    tone: 'Ainda não temos fonte verificada para avaliar este item.',
  },
}

/** Ordem de gravidade — usada para escolher o pior risco do dia. */
export const ordemRisco: RiskLevel[] = ['sem-dados', 'low', 'attention', 'high']

export const riskCategories: RiskCategory[] = [
  { id: 'sun', label: 'Sol', emoji: '☀️' },
  { id: 'rain', label: 'Chuva', emoji: '🌧️' },
  { id: 'wind', label: 'Vento', emoji: '💨' },
  { id: 'lightning', label: 'Raios', emoji: '⚡' },
  { id: 'tide', label: 'Maré', emoji: '🌊' },
  { id: 'current', label: 'Correnteza', emoji: '🌀' },
  { id: 'animals', label: 'Animais', emoji: '🐟' },
  { id: 'injuries', label: 'Ferimentos', emoji: '🩹' },
  { id: 'dehydration', label: 'Desidratação', emoji: '💧' },
]
