import type { FC } from 'react'
import type { MapPointType } from '../../types/mapPoint'

/**
 * Glifos dos marcadores — fonte única de verdade.
 *
 * O mesmo desenho é usado em dois lugares: dentro do `divIcon` do Leaflet
 * (que exige HTML em string) e nos chips de filtro da tela (que é React).
 * Ter duas versões faria os ícones divergirem com o tempo; aqui o markup vive
 * uma vez só e os dois consumidores o renderizam.
 *
 * Grade 24×24, traço arredondado, glifo branco. O preenchimento é sempre
 * explícito: um `<path>` aberto sem `fill` é fechado e pintado pelo navegador.
 */

export const coresMarcador: Record<MapPointType, string> = {
  river: '#4E7F97',
  mangrove: '#4E9159',
  fishing_point: '#6BA2B9',
  health: '#D9635F',
  risk: '#E2703C',
  boat_point: '#F48653',
  other: '#4C6B79',
}

type Glifo = (cor: string) => string

export const glifoMarcador: Record<MapPointType, Glifo> = {
  // Rios e canais: duas ondulações
  river: () => `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round">
      <path d="M3 9q4.5-3.6 9 0t9 0"/>
      <path d="M3 15.6q4.5-3.6 9 0t9 0"/>
    </g>`,

  // Manguezal: copa cheia com tronco visível
  mangrove: () => `<g fill="#fff">
      <path d="M12 2.8c-1.3 0-2.5.6-3.3 1.4A4.6 4.6 0 0 0 5.4 9.5c0 .5.1 1 .2 1.5A4.3 4.3 0 0 0 8.3 19.6h7.4a4.3 4.3 0 0 0 2.7-8.6c.1-.5.2-1 .2-1.5a4.6 4.6 0 0 0-3.3-5.3 4.5 4.5 0 0 0-3.3-1.4z"/>
      <path d="M10.2 18.8h3.6v3.4h-3.6z"/>
    </g>`,

  // Ponto de pesca: peixe com cauda e olho na cor do marcador
  fishing_point: (cor) => `<g>
      <path d="M2.8 12c2.3-3.6 5.4-5.4 8-5.4s5.7 1.8 8 5.4c-2.3 3.6-5.4 5.4-8 5.4s-5.7-1.8-8-5.4z" fill="#fff"/>
      <path d="M19.2 12l3.6-3.2v6.4z" fill="#fff"/>
      <circle cx="7" cy="10.7" r="1.2" fill="${cor}"/>
    </g>`,

  // Unidade de saúde: cruz
  health: () => `<path d="M9.9 2.4h4.2v7.5h7.5v4.2h-7.5v7.5H9.9v-7.5H2.4V9.9h7.5z" fill="#fff"/>`,

  // Área de risco: triângulo com exclamação
  risk: () => `<g>
      <path d="M12 3.2 22.4 20.8H1.6z" fill="#fff"/>
      <path d="M12 9.6v4.8" fill="none" stroke="#E2703C" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="12" cy="17.6" r="1.5" fill="#E2703C"/>
    </g>`,

  // Ponto de embarque: casco e duas velas
  boat_point: () => `<g>
      <path d="M2.4 16.6h19.2l-3.1 4.8H5.5z" fill="#fff"/>
      <path d="M13 15.4V3.2l7 4.3z" fill="#fff"/>
      <path d="M11 15.4V4.4l-6.4 3.9z" fill="#fff" opacity=".85"/>
    </g>`,

  // Outros pontos: alvo
  other: (cor) => `<circle cx="12" cy="12" r="6.4" fill="#fff"/>
      <circle cx="12" cy="12" r="2.4" fill="${cor}"/>`,
}

interface GlifoMarcadorProps {
  tipo: MapPointType
  /** Cor do glifo quando ele "vaza" para o fundo (olho do peixe, miolo do alvo). */
  cor?: string
  size?: number
  className?: string
}

/** Versão React do mesmo glifo, para os chips de filtro da tela. */
export const GlifoMarcador: FC<GlifoMarcadorProps> = ({
  tipo,
  cor = coresMarcador[tipo],
  size = 22,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
    dangerouslySetInnerHTML={{ __html: glifoMarcador[tipo](cor) }}
  />
)
