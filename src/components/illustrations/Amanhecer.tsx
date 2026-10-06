import type { FC } from 'react'

interface AmanhecerProps {
  className?: string
}

/**
 * Cena de abertura: nascer do sol sobre o rio, barco de pesca e palmeira.
 * Usada na tela inicial para dar acolhimento antes de qualquer informação.
 */
const Amanhecer: FC<AmanhecerProps> = ({ className = '' }) => (
  <svg
    viewBox="0 0 360 200"
    className={className}
    role="img"
    aria-label="Nascer do sol sobre o rio, com um barco de pesca e palmeiras"
  >
    {/* Sol */}
    <circle cx="252" cy="82" r="34" fill="#FCDCBD" />
    <circle cx="252" cy="82" r="34" fill="none" stroke="#F48653" strokeWidth="2.5" opacity="0.5" />

    {/* Nuvens */}
    <g fill="#FFFFFF" opacity="0.85">
      <ellipse cx="96" cy="52" rx="26" ry="13" />
      <ellipse cx="118" cy="48" rx="18" ry="11" />
      <ellipse cx="72" cy="48" rx="14" ry="9" />
      <ellipse cx="300" cy="34" rx="20" ry="10" />
    </g>

    {/* Palmeiras */}
    <g>
      <path
        d="M28 148 q-3-34 5-52"
        stroke="#8F5C3A"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="#7FB87C">
        <path d="M33 96q-22-12-33-2 16-2 33 6z" />
        <path d="M33 96q-16-18-32-16 14 6 30 20z" />
        <path d="M33 96q14-20 30-20-16 8-28 24z" />
        <path d="M33 96q22-8 32 2-18-2-31 2z" />
      </g>
    </g>
    <g opacity="0.7">
      <path
        d="M330 152 q2-26 7-40"
        stroke="#8F5C3A"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="#7FB87C">
        <path d="M337 112q-17-9-25-1 12-1 24 5z" />
        <path d="M337 112q-12-14-25-12 11 4 24 16z" />
        <path d="M337 112q11-15 23-15-12 6-22 19z" />
      </g>
    </g>

    {/* Rio */}
    <path d="M0 148 h360 v52 h-360z" fill="#AED2E0" />
    <g stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
      <path d="M20 164 q16-6 32 0" />
      <path d="M84 178 q16-6 32 0" />
      <path d="M150 164 q16-6 32 0" />
      <path d="M232 182 q16-6 32 0" />
      <path d="M296 166 q16-6 32 0" />
    </g>

    {/* Barco de pesca */}
    <g>
      <path d="M150 138 q22 14 46 0 l-8 16 h-30z" fill="#F48653" />
      <rect x="170" y="104" width="3" height="34" rx="1.5" fill="#8F5C3A" />
      <path d="M173 106 l26 10 -26 12z" fill="#FCDCBD" />
      <circle cx="166" cy="136" r="4" fill="#22414F" />
      <path d="M150 132 q22-10 46 0" stroke="#8F5C3A" strokeWidth="2" fill="none" />
    </g>
  </svg>
)

export default Amanhecer
