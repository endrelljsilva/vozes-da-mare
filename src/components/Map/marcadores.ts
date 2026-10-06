import L from 'leaflet'
import type { MapPointType } from '../../types/mapPoint'
import { coresMarcador, glifoMarcador } from './glifos'

/**
 * Marcadores do mapa (§11).
 *
 * Tudo é SVG desenhado por nós, no mesmo traço arredondado da identidade.
 * Três decisões que evitam os erros comuns:
 *
 *  1. **Sem `<filter>` com `id` dentro do HTML do ícone.** Cada `divIcon` injeta
 *     HTML no DOM; um `id="sombra"` repetido em sete marcadores é HTML
 *     inválido, e o navegador usaria só a primeira definição. A sombra é CSS.
 *  2. **Glifos desenhados uma única vez** em `glifos.tsx`, reusados aqui e
 *     nos chips de filtro — assim os dois não divergem.
 *  3. **Alvo de toque maior que o desenho:** 40×48 px, bem acima dos glifos de
 *     22 px, para o dedo acertar na tela pequena.
 */

const TAMANHO: L.PointTuple = [40, 48]

/** Escala e posição que centralizam o glifo de 24×24 na cabeça do marcador. */
const ESCALA = 22 / 24
const DESLOCAMENTO = 20 - ESCALA * 12

export const criarIcone = (tipo: MapPointType): L.DivIcon => {
  const cor = coresMarcador[tipo]

  return L.divIcon({
    className: 'marcador-mapa',
    iconSize: TAMANHO,
    iconAnchor: [20, 48],
    popupAnchor: [0, -44],
    html: `
      <svg viewBox="0 0 40 48" width="40" height="48" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
        <path d="M20 2c-8.8 0-16 7.2-16 16 0 11 9.5 20 16 28 6.5-8 16-17 16-28 0-8.8-7.2-16-16-16z"
              fill="${cor}" stroke="#fff" stroke-width="2.8" stroke-linejoin="round"/>
        <g transform="translate(${DESLOCAMENTO} ${DESLOCAMENTO}) scale(${ESCALA})">${glifoMarcador[tipo](cor)}</g>
      </svg>`,
  })
}
