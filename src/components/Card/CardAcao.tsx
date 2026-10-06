import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CardAcaoProps {
  to: string
  rotulo: string
  descricao: string
  icone: ReactNode
  /** Cor de fundo do ícone — pastel da paleta da marca. */
  tom?: 'mare' | 'areia' | 'coral' | 'verde' | 'atencao'
  className?: string
}

const tons: Record<NonNullable<CardAcaoProps['tom']>, string> = {
  mare: 'bg-mare-100 text-mare-700',
  areia: 'bg-areia-100 text-laranja-600',
  coral: 'bg-laranja-200 text-laranja-700',
  verde: 'bg-seguro-suave text-seguro',
  atencao: 'bg-atencao-suave text-laranja-600',
}

/**
 * Card de atalho da tela inicial. O alvo de toque tem 44 px+ (WCAG 2.5.5)
 * e o rótulo sempre aparece junto do ícone — nunca só cor.
 */
const CardAcao: FC<CardAcaoProps> = ({
  to,
  rotulo,
  descricao,
  icone,
  tom = 'mare',
  className = '',
}) => (
  <Link
    to={to}
    className={`group flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl border border-areia-200 bg-white px-3 py-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0 active:scale-[0.97] ${className}`}
  >
    <span
      className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${tons[tom]}`}
      aria-hidden="true"
    >
      {icone}
    </span>
    <span className="text-[15px] font-bold text-tinta">{rotulo}</span>
    <span className="text-[11px] leading-tight font-semibold text-tinta-suave">{descricao}</span>
  </Link>
)

export default CardAcao
