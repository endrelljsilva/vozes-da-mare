import type { FC } from 'react'

export type GlifoNome =
  | 'sol'
  | 'nublado'
  | 'chuva'
  | 'vento'
  | 'umidade'
  | 'lua'
  | 'peixe'
  | 'mangue'
  | 'canal'
  | 'pesca'
  | 'barco'
  | 'saude'
  | 'risco'
  | 'sol-forte'
  | 'frio'
  | 'bota'

interface GlifoProps {
  nome: GlifoNome
  size?: number
  className?: string
}

const MARE = '#82B6CB'
const MARE_ESCURO = '#558AA3'
const AREIA = '#FCDCBD'
const CORAL = '#F48653'
const TINTA = '#22414F'
const CREME = '#FBEAD6'

/**
 * Biblioteca de ícones desenhados à mão (SVG). Mesmo traço arredondado e mesma
 * paleta em toda a aplicação, para que a interface pareça um só desenho.
 */
const Glifo: FC<GlifoProps> = ({ nome, size = 28, className = '' }) => {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none' as const,
    className,
    'aria-hidden': true,
    focusable: false as const,
  }

  switch (nome) {
    case 'sol':
      return (
        <svg {...p}>
          <circle cx="24" cy="24" r="10" fill={AREIA} stroke={CORAL} strokeWidth="3" />
          <g stroke={CORAL} strokeWidth="3" strokeLinecap="round">
            <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.5 11.5l3.5 3.5M33 33l3.5 3.5M36.5 11.5L33 15M15 33l-3.5 3.5" />
          </g>
        </svg>
      )

    case 'sol-forte':
      return (
        <svg {...p}>
          <circle cx="24" cy="24" r="9" fill={CORAL} />
          <g stroke={CORAL} strokeWidth="3.5" strokeLinecap="round">
            <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.8 10.8l4.2 4.2M33 33l4.2 4.2M37.2 10.8L33 15M15 33l-4.2 4.2" />
          </g>
        </svg>
      )

    case 'nublado':
      return (
        <svg {...p}>
          <circle cx="17" cy="18" r="7" fill={AREIA} stroke={CORAL} strokeWidth="2.5" />
          <path
            d="M12 34h24a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0-5 11z"
            fill={CREME}
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'chuva':
      return (
        <svg {...p}>
          <path
            d="M13 28h22a6.5 6.5 0 0 0 0-13 9.5 9.5 0 0 0-18 3 5.5 5.5 0 0 0-4 10z"
            fill={CREME}
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g stroke={MARE} strokeWidth="3.4" strokeLinecap="round">
            <path d="M16 34l-2 6M24 34l-2 6M32 34l-2 6" />
          </g>
        </svg>
      )

    case 'vento':
      return (
        <svg {...p}>
          <g stroke={MARE_ESCURO} strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M6 17h22a5 5 0 1 0-5-5" />
            <path d="M6 26h28a5 5 0 1 1-5 5" />
            <path d="M6 35h14" />
          </g>
        </svg>
      )

    case 'umidade':
      return (
        <svg {...p}>
          <path
            d="M24 6c7 9 11 14 11 19a11 11 0 0 1-22 0c0-5 4-10 11-19z"
            fill={CREME}
            stroke={MARE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M19 27a5 5 0 0 0 4 6"
            stroke={MARE_ESCURO}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )

    case 'lua':
      return (
        <svg {...p}>
          <path
            d="M32 30a13 13 0 0 1-14-16 14 14 0 1 0 17 17z"
            fill={AREIA}
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="12" r="2.6" fill={AREIA} />
          <circle cx="42" cy="20" r="1.8" fill={AREIA} />
        </svg>
      )

    case 'peixe':
      return (
        <svg {...p}>
          <path d="M8 24c6-9 16-13 24-13s14 5 14 13-6 13-14 13-18-4-24-13z" fill={MARE} />
          <path d="M42 24l6-8v16z" fill={MARE_ESCURO} />
          <path d="M22 12c-2-5 0-8 2-8 3 0 4 4 2 8" fill={MARE_ESCURO} />
          <circle cx="18" cy="21" r="3" fill={CREME} />
          <circle cx="18" cy="21" r="1.4" fill={TINTA} />
          <path
            d="M30 18a8 8 0 0 1 0 12"
            stroke={CREME}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'mangue':
      return (
        <svg {...p}>
          <path d="M24 44V26" stroke="#8F5C3A" strokeWidth="4" strokeLinecap="round" />
          <g fill="#7FB87C">
            <circle cx="24" cy="16" r="11" />
            <circle cx="13" cy="22" r="7" />
            <circle cx="35" cy="22" r="7" />
          </g>
          <path
            d="M24 30l-6 6M24 32l6 4"
            stroke="#8F5C3A"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'canal':
      return (
        <svg {...p}>
          <path
            d="M6 30q8-6 16 0t16 0 8-3"
            stroke={MARE}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 38q8-6 16 0t16 0 8-3"
            stroke={MARE_ESCURO}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 24V12M14 12l-5 5M14 12l5 5"
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )

    case 'pesca':
      return (
        <svg {...p}>
          <path d="M40 8L16 32" stroke="#8F5C3A" strokeWidth="3.4" strokeLinecap="round" />
          <path
            d="M40 8c2 6-2 10-8 10"
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 8c6 2 8 6 8 10"
            stroke={CORAL}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M16 32c-5 0-8 3-8 8 5 0 8-3 8-8z" fill={MARE} />
        </svg>
      )

    case 'barco':
      return (
        <svg {...p}>
          <path d="M6 30h36l-6 12H12z" fill={CORAL} />
          <path
            d="M24 30V8l14 8z"
            fill={CREME}
            stroke={MARE_ESCURO}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M4 42q6-4 12 0t12 0 12 0 6-2"
            stroke={MARE}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )

    case 'saude':
      return (
        <svg {...p}>
          <path
            d="M24 42S8 32 8 20a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 12-16 22-16 22z"
            fill="#F0908C"
            stroke="#E57878"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M14 24h6l3-6 4 12 3-6h4"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )

    case 'risco':
      return (
        <svg {...p}>
          <path
            d="M24 7l17 30H7z"
            fill={CREME}
            stroke={CORAL}
            strokeWidth="3.4"
            strokeLinejoin="round"
          />
          <path d="M24 19v10" stroke={TINTA} strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="24" cy="33" r="2.4" fill={TINTA} />
        </svg>
      )

    case 'frio':
      return (
        <svg {...p}>
          <rect
            x="19"
            y="5"
            width="10"
            height="27"
            rx="5"
            fill={CREME}
            stroke={MARE_ESCURO}
            strokeWidth="3"
          />
          <circle cx="24" cy="33" r="7" fill={MARE} stroke={MARE_ESCURO} strokeWidth="3" />
          <path d="M24 14v14" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />
          <g stroke={MARE_ESCURO} strokeWidth="3" strokeLinecap="round">
            <path d="M34 12h6M34 19h6" />
          </g>
        </svg>
      )

    case 'bota':
      return (
        <svg {...p}>
          <path
            d="M15 7h10v17l14 6a5 5 0 0 1 3 5v5H15z"
            fill={CREME}
            stroke={MARE_ESCURO}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M11 40h31" stroke={MARE_ESCURO} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M25 17h8" stroke={MARE} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )

    default:
      return null
  }
}

export default Glifo
