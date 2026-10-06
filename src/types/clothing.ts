import type { GlifoNome } from '../components/illustrations/Glifo'

/**
 * Contracts for "what to wear today" (§12).
 *
 * This is a **clothing recommendation, not medical guidance**. It computes
 * from the day's forecast and never diagnoses anything (§14).
 */

/** What a piece of clothing is for. Determines order and grouping on screen. */
export type RoupaMotivo = 'frio' | 'calor' | 'sol' | 'chuva' | 'vento' | 'mao' | 'pe'

export interface RoupaItem {
  motivo: RoupaMotivo
  titulo: string
  /** Why today specifically — always cites the number behind the advice. */
  porque: string
  /** Worn on the body, versus carried in the bag. */
  essencial: boolean
  glifo: GlifoNome
}

export interface SugestaoRoupa {
  /** Apparent temperature the advice is based on. */
  temperaturaAparenteC: number
  /** One line: "hot day with strong sun". */
  resumo: string
  /** The base garment, separated from the add-ons. */
  base: string
  /** Order matters: essentials first, then the items for the day's weather. */
  itens: RoupaItem[]
}