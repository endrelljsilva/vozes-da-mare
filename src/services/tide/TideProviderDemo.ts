import type { TideEvent, TideProvider, TideStation } from '../../types/tide'

const ITAPISSUMA_LAT = -7.665
const ITAPISSUMA_LON = -34.83

/**
 * Provider de maré em modo DEMONSTRAÇÃO.
 *
 * Regra do projeto (§10): nunca apresentar número fictício como real.
 * Este provider não gera marés — devolve uma lista vazia de propósito,
 * e a interface usa isso para mostrar o aviso "Demonstração" em vez de
 * um valor inventado. Serve de contrato para o provider real:
 * implemente `TideProvider` com dados de fonte verificada e a tela troca
 * de aviso para maré real sem nenhuma alteração de layout.
 */
export class TideProviderDemo implements TideProvider {
  name = 'Demonstração (não verificado)'
  isDemo = true

  supportsLocation(lat: number, lon: number): boolean {
    return Math.abs(lat - ITAPISSUMA_LAT) < 2 && Math.abs(lon - ITAPISSUMA_LON) < 2
  }

  async getNextTides(
    _lat: number,
    _lon: number,
    _days: number,
    _signal?: AbortSignal,
  ): Promise<TideEvent[]> {
    return []
  }

  async getStation(_lat: number, _lon: number): Promise<TideStation | null> {
    return null
  }

  getAttribution(): string {
    return 'DEMONSTRAÇÃO — dados não verificados. Fonte gratuita em verificação [PRECISA SER VERIFICADO].'
  }
}
