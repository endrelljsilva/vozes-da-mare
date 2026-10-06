import type { FC } from 'react'
import type { Expression } from './types'

/**
 * Personagem "Dona de Maré" — pescadora artesanal que guia a usuária.
 * Ilustração 100% SVG: mesma paleta pastel da logo, formas arredondadas.
 * Nenhuma imagem externa, nenhum emoji no lugar do desenho.
 *
 * ── Anatomia (viewBox 0 0 240 240) ────────────────────────────────
 * Regra da casa: as peças se encaixam por **sobreposição**, nunca por
 * borda encostada. Se o queixo termina em 125 e o pescoço começa em 112,
 * os 13 px de interseção garantem que não abra um vão e a cabeça pareça
 * solta flutuando sobre o corpo.
 *
 *   chapéu (aba)   y  41 … 63
 *   cabeça         y  51 … 125   (cy 88, ry 37)
 *   cabelo         y  44 … 164   (laterais caem sobre os ombros)
 *   pescoço        y 112 … 150   → 13 px dentro da cabeça
 *   ombros         y 146 …       →  4 px por cima do pescoço
 *   cintura        y 240         (borda inferior do quadro)
 * ───────────────────────────────────────────────────────────────────
 */

/** Malha do rosto. Tudo abaixo é calculado a partir daqui. */
const ROSTO = {
  cy: 88,
  olhoY: 93,
  sobrancelhaY: 79,
  narizY: 100,
  bocaY: 110,
  bochechaY: 106,
  olhoEsq: 106,
  olhoDir: 134,
} as const

/** Pontos de apoio do corpo. */
const CORPO = {
  ombroY: 146,
  ombroEsq: 62,
  ombroDir: 178,
  pescocoTopo: 112,
  maoY: 218,
  maoEsq: 58,
  maoDir: 182,
} as const

const P = {
  pele: '#B0754E',
  peleEscura: '#8F5C3A',
  cabelo: '#3A2A20',
  coral: '#F48653',
  coralEscuro: '#E1703C',
  mare: '#82B6CB',
  mareEscuro: '#6BA2B9',
  areia: '#FCDCBD',
  areiaEscura: '#F0BF85',
  tinta: '#22414F',
  branco: '#FFFFFF',
}

/** Olhos por expressão: caminhos desenhados à mão para dar vida ao rosto. */
function Olhos({ expression }: { expression: Expression }) {
  const { olhoY: y, olhoEsq: esquerdo, olhoDir: direito } = ROSTO

  const arcoSorriso = (cx: number) => (
    <path
      d={`M${cx - 7} ${y + 1} q7 -9 14 0`}
      stroke={P.tinta}
      strokeWidth={3.4}
      strokeLinecap="round"
      fill="none"
    />
  )

  const olhoAberto = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={y} rx={4.6} ry={5.2} fill={P.tinta} />
      <circle cx={cx + 1.6} cy={y - 1.8} r={1.5} fill={P.branco} />
    </g>
  )

  const olhoPreocupado = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={y + 1.5} rx={4.4} ry={4.6} fill={P.tinta} />
      <circle cx={cx + 1.4} cy={y} r={1.3} fill={P.branco} />
      <path
        d={`M${cx - 8} ${y - 9} q8 -4 15 1`}
        stroke={P.tinta}
        strokeWidth={2.8}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )

  switch (expression) {
    case 'feliz':
    case 'saude':
      return (
        <g>
          {arcoSorriso(esquerdo)}
          {arcoSorriso(direito)}
        </g>
      )
    case 'risco':
      return (
        <g>
          {olhoPreocupado(esquerdo)}
          {olhoPreocupado(direito)}
        </g>
      )
    default:
      return (
        <g>
          {olhoAberto(esquerdo)}
          {olhoAberto(direito)}
        </g>
      )
  }
}

function Sobrancelhas({ expression }: { expression: Expression }) {
  if (expression === 'risco') return null
  const y = ROSTO.sobrancelhaY

  if (expression === 'atencao') {
    return (
      <g stroke={P.tinta} strokeWidth={2.8} strokeLinecap="round" fill="none">
        <path d={`M99 ${y - 5} q7 -4 13 0`} />
        <path d={`M128 ${y - 5} q7 -4 13 0`} />
      </g>
    )
  }

  return (
    <g stroke={P.cabelo} strokeWidth={3} strokeLinecap="round" fill="none">
      <path d={`M99 ${y} q7 -3 13 0`} />
      <path d={`M128 ${y} q7 -3 13 0`} />
    </g>
  )
}

function Boca({ expression }: { expression: Expression }) {
  const y = ROSTO.bocaY

  switch (expression) {
    case 'feliz':
      return (
        <g>
          <path d={`M107 ${y} q13 15 26 0 z`} fill={P.coralEscuro} />
          <path d={`M110 ${y + 2} q10 6 20 0 z`} fill="#F7A9A0" />
        </g>
      )
    case 'saude':
      return (
        <path
          d={`M109 ${y} q11 11 22 0`}
          stroke={P.coralEscuro}
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
        />
      )
    case 'atencao':
      return <ellipse cx={120} cy={y + 1} rx={6.5} ry={7.5} fill={P.coralEscuro} />
    case 'risco':
      return (
        <path
          d={`M108 ${y + 3} q12 -9 24 0`}
          stroke={P.coralEscuro}
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
        />
      )
    case 'falando':
      return (
        <g>
          <ellipse cx={120} cy={y + 1} rx={8} ry={10} fill="#8B4A3A" />
          <ellipse cx={120} cy={y + 6} rx={5} ry={4} fill="#F0908C" />
        </g>
      )
    default:
      return (
        <path
          d={`M110 ${y} q10 10 20 0`}
          stroke={P.coralEscuro}
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
        />
      )
  }
}

/** Selo flutuante que dá a "situação" da personagem: emoji apenas como apoio visual. */
function Selo({ expression }: { expression: Expression }) {
  if (expression === 'feliz') return null
  const mapa: Partial<Record<Expression, { emoji: string; cor: string }>> = {
    normal: { emoji: '🙂', cor: P.mare },
    atencao: { emoji: '⚠️', cor: '#F2C75E' },
    risco: { emoji: '😟', cor: '#E57878' },
    saude: { emoji: '❤️', cor: '#E57878' },
    falando: { emoji: '🎙️', cor: P.coral },
  }
  const selo = mapa[expression]
  if (!selo) return null
  return (
    <g>
      <circle cx={188} cy={50} r={19} fill={P.branco} stroke={selo.cor} strokeWidth={3} />
      <text x={188} y={57} textAnchor="middle" fontSize={19} aria-hidden="true">
        {selo.emoji}
      </text>
    </g>
  )
}

interface PersonagemProps {
  expression?: Expression
  /** Largura de referência em px. Quem chama pode sobrescrever com className. */
  size?: number
  /** Mostra o celular na mão (contexto de "pergunte para a Maré") */
  comCelular?: boolean
  className?: string
}

const Personagem: FC<PersonagemProps> = ({
  expression = 'normal',
  size = 200,
  comCelular = false,
  className = '',
}) => (
  <svg
    viewBox="0 0 240 240"
    width={size}
    height={size}
    className={className}
    role="img"
    aria-label={`Ilustração da pescadora assistente, expressão ${expression}`}
  >
    <defs>
      <linearGradient id="fundo-personagem" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F8" />
        <stop offset="100%" stopColor="#FDF1E3" />
      </linearGradient>
      <clipPath id="recorte-fundo">
        <circle cx={120} cy={120} r={112} />
      </clipPath>
    </defs>

    {/* ---- Fundo redondo com mar e mangue ao longe ---- */}
    <circle cx={120} cy={120} r={112} fill="url(#fundo-personagem)" />
    <g clipPath="url(#recorte-fundo)">
      <path d="M-10 162 q40 -22 80 -6 t90 -8 t90 10 v98 h-260z" fill={P.mare} opacity={0.18} />
      <path d="M-10 180 q46 -18 86 -4 t94 -6 t80 8 v88 h-260z" fill={P.mare} opacity={0.14} />
      <g opacity={0.24} fill={P.mareEscuro}>
        <path d="M24 162c0-16 6-26 12-26s12 10 12 26z" />
        <rect x={33} y={160} width={6} height={16} rx={3} />
        <path d="M196 158c0-14 5-23 11-23s11 9 11 23z" />
        <rect x={204} y={156} width={6} height={15} rx={3} />
      </g>
    </g>

    {/* ---- Pescoço (antes do corpo: a gola cobre a base dele) ---- */}
    <path d="M107 112 h26 v38 h-26 z" fill={P.peleEscura} />

    {/* ---- Blusa coral: ombros largos para sustentar a cabeça grande ---- */}
    <g>
      <path
        d={`M${CORPO.ombroEsq} 240 V186 C${CORPO.ombroEsq} 160 88 ${CORPO.ombroY} 120 ${CORPO.ombroY} C152 ${CORPO.ombroY} ${CORPO.ombroDir} 160 ${CORPO.ombroDir} 186 V240 Z`}
        fill={P.coral}
      />
      {/* gola, para o pescoço não sumir dentro da blusa */}
      <path d="M102 148 q18 14 36 0 q-6 12 -18 12 t-18 -12 z" fill={P.coralEscuro} />
    </g>

    {/* ---- Macacão azul sobre a blusa ---- */}
    <g>
      <path d="M100 156 l-9 34 h21 l7 -34 z" fill={P.mare} />
      <path d="M140 156 l9 34 h-21 l-7 -34 z" fill={P.mare} />
      <path d="M92 190 q0 -14 14 -14 h28 q14 0 14 14 v50 h-56 z" fill={P.mareEscuro} />
      <circle cx={120} cy={196} r={3.4} fill={P.areiaEscura} />
      <circle cx={120} cy={210} r={3.4} fill={P.areiaEscura} />
      <path d="M104 222 h32 v18 h-32 z" fill={P.mare} />
    </g>

    {/* ---- Braços: coral mais escuro para destacar do busto ---- */}
    <g>
      <path
        d={`M${CORPO.ombroEsq + 12} 184 c-10 16 -14 28 -13 36`}
        stroke={P.coralEscuro}
        strokeWidth={17}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${CORPO.ombroDir - 12} 184 c10 16 14 28 13 36`}
        stroke={P.coralEscuro}
        strokeWidth={17}
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Celular na mão esquerda — dentro do quadro, sem ser cortado */}
    {comCelular && (
      <g transform="rotate(-14 50 224)">
        <rect x={39} y={208} width={22} height={32} rx={5} fill={P.tinta} />
        <rect x={42} y={212} width={16} height={24} rx={3} fill={P.mare} />
        <circle cx={50} cy={220} r={3.6} fill={P.branco} />
        <path
          d="M47 220h6M50 217v6"
          stroke={P.mareEscuro}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </g>
    )}
    <circle cx={CORPO.maoEsq} cy={CORPO.maoY} r={8.5} fill={P.pele} />
    <circle cx={CORPO.maoDir} cy={CORPO.maoY} r={8.5} fill={P.pele} />

    {/* ---- Cabelo ----
        Fica DEPOIS do busto e ANTES do rosto: assim o volume de cima e as
        mechas laterais são uma peça só, colada nas bochechas, sem aquele vão
        claro entre a franja e o rosto que fazia o cabelo parecer fone. */}
    <g fill={P.cabelo}>
      <path d="M120 44 c-24 0 -39 17 -39 42 0 9 1 16 4 22 1-22 13-32 35-32 s34 10 35 32 c3-6 4-13 4-22 0-25-15-42-39-42z" />
      <path d="M95 78 C90 104 90 132 96 158 L82 164 C74 132 76 100 84 78 Z" />
      <path d="M145 78 C150 104 150 132 144 158 L158 164 C166 132 164 100 156 78 Z" />
    </g>

    {/* ---- Rosto ---- */}
    <circle cx={85} cy={92} r={7.5} fill={P.pele} />
    <circle cx={155} cy={92} r={7.5} fill={P.pele} />
    <ellipse cx={120} cy={ROSTO.cy} rx={35} ry={37} fill={P.pele} />
    <ellipse cx={96} cy={ROSTO.bochechaY} rx={7} ry={4.5} fill="#E8907A" opacity={0.45} />
    <ellipse cx={144} cy={ROSTO.bochechaY} rx={7} ry={4.5} fill="#E8907A" opacity={0.45} />

    {/* nariz */}
    <path
      d={`M118 ${ROSTO.narizY - 1} q4 7 8 5`}
      stroke={P.peleEscura}
      strokeWidth={2.6}
      strokeLinecap="round"
      fill="none"
    />

    <Sobrancelhas expression={expression} />
    <Olhos expression={expression} />
    <Boca expression={expression} />

    {/* ---- Chapéu de palha com faixa laranja ---- */}
    <g>
      <ellipse cx={120} cy={52} rx={52} ry={11} fill={P.areiaEscura} />
      <ellipse cx={120} cy={50} rx={52} ry={10.5} fill={P.areia} />
      <path d="M88 52 c1-22 14-32 32-32 s31 10 32 32z" fill={P.areia} />
      <path d="M89 42 h62 v10 h-62z" fill={P.coral} />
      <ellipse
        cx={120}
        cy={50}
        rx={52}
        ry={10.5}
        fill="none"
        stroke={P.areiaEscura}
        strokeWidth={2}
      />
    </g>

    {/* Ondas de voz quando ela está falando */}
    {expression === 'falando' && (
      <g stroke={P.coral} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9}>
        <path d="M186 92 q13 14 0 28" className="animate-brilho" />
        <path
          d="M200 82 q22 24 0 48"
          className="animate-brilho"
          style={{ animationDelay: '0.25s' }}
        />
      </g>
    )}

    {/* Gota de suor no risco */}
    {expression === 'risco' && (
      <path
        d="M168 82 q9 13 9 18 a9 9 0 0 1 -18 0 q0 -5 9 -18z"
        fill={P.mare}
        stroke={P.branco}
        strokeWidth={2}
      />
    )}

    <Selo expression={expression} />
  </svg>
)

export default Personagem
