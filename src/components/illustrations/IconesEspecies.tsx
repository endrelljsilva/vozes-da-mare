import type { FC } from 'react'

interface IconeProps {
  size?: number
  className?: string
}

/** Ilustração artesanal de Concha para mariscos, sururu e ostras */
export const IlustracaoConcha: FC<IconeProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Base da concha */}
    <path
      d="M24 6 C12 6 6 18 8 32 C9 38 14 42 24 42 C34 42 39 38 40 32 C42 18 36 6 24 6 Z"
      fill="#FCDCBD"
      stroke="#E1703C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Frisos / ranhuras da concha */}
    <path d="M24 42 L24 6" stroke="#E1703C" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 42 Q18 24 14 12" stroke="#E1703C" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 42 Q30 24 34 12" stroke="#E1703C" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 42 Q14 30 10 22" stroke="#E1703C" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M24 42 Q34 30 38 22" stroke="#E1703C" strokeWidth="1.8" strokeLinecap="round" />
    {/* Dobradiça da concha */}
    <path d="M18 42 Q24 45 30 42" stroke="#E1703C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/** Ilustração artesanal de Peixinho para peixes de Itapissuma */
export const IlustracaoPeixinho: FC<IconeProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Cauda */}
    <path d="M12 24 L2 14 Q6 24 2 34 Z" fill="#82B6CB" stroke="#417085" strokeWidth="2.5" />
    {/* Corpo */}
    <path
      d="M10 24 C14 12 34 10 44 24 C34 38 14 36 10 24 Z"
      fill="#CFE6EE"
      stroke="#417085"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Nadadeira dorsal */}
    <path d="M22 13 Q27 8 32 12" stroke="#417085" strokeWidth="2.5" strokeLinecap="round" />
    {/* Olho */}
    <circle cx="37" cy="21" r="2.5" fill="#22414F" />
    <circle cx="36" cy="20" r="0.8" fill="#FFFFFF" />
    {/* Guelra */}
    <path d="M31 18 Q28 24 31 30" stroke="#417085" strokeWidth="2" strokeLinecap="round" />
    {/* Escamas suaves */}
    <path d="M22 20 Q20 24 22 28" stroke="#82B6CB" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

/** Ilustração artesanal de Caranguejo para caranguejos, aratus e siris */
export const IlustracaoCaranguejo: FC<IconeProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Patas esquerdas */}
    <path d="M14 26 Q6 26 4 34 M14 28 Q8 32 8 40 M16 30 Q12 36 14 42" stroke="#E1703C" strokeWidth="2" strokeLinecap="round" />
    {/* Patas direitas */}
    <path d="M34 26 Q42 26 44 34 M34 28 Q40 32 40 40 M32 30 Q36 36 34 42" stroke="#E1703C" strokeWidth="2" strokeLinecap="round" />
    {/* Garra esquerda */}
    <path d="M12 20 Q8 12 14 8 Q18 10 16 16" stroke="#E1703C" strokeWidth="2.5" strokeLinecap="round" fill="#F48653" />
    {/* Garra direita */}
    <path d="M36 20 Q40 12 34 8 Q30 10 32 16" stroke="#E1703C" strokeWidth="2.5" strokeLinecap="round" fill="#F48653" />
    {/* Carapaça / Casco */}
    <ellipse cx="24" cy="28" rx="12" ry="9" fill="#F48653" stroke="#E1703C" strokeWidth="2.5" />
    {/* Olhos esbugalhados no topo */}
    <circle cx="20" cy="18" r="2.5" fill="#22414F" />
    <circle cx="28" cy="18" r="2.5" fill="#22414F" />
    <path d="M20 20 L20 22 M28 20 L28 22" stroke="#E1703C" strokeWidth="2" />
  </svg>
)