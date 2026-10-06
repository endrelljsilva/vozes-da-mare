import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variante = 'primaria' | 'secundaria' | 'voz' | 'contorno'

interface BotaoProps {
  children: ReactNode
  onClick?: () => void
  to?: string
  variante?: Variante
  /** Linha de apoio — ajuda quem não consegue ler rápido. */
  apoio?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  'aria-label'?: string
  'aria-expanded'?: boolean
}

const estilos: Record<Variante, string> = {
  primaria: 'bg-laranja-500 text-white shadow-botao hover:bg-laranja-600',
  secundaria: 'bg-mare-400 text-white shadow-card hover:bg-mare-500',
  voz: 'bg-laranja-500 text-white shadow-botao hover:bg-laranja-600',
  contorno: 'bg-white text-tinta border-2 border-mare-200 hover:bg-mare-50',
}

/**
 * Botão com área de toque confortável e foco visível.
 * `apoio` é opcional de propósito: regra §3 é "visual primeiro".
 */
const Botao: FC<BotaoProps> = ({
  children,
  onClick,
  to,
  variante = 'primaria',
  apoio,
  className = '',
  disabled = false,
  type = 'button',
  ...aria
}) => {
  const base = `inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-7 text-base font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55 ${estilos[variante]} ${className}`

  const conteudo = (
    <>
      <span>{children}</span>
      {apoio && <span className="text-[11px] font-semibold opacity-90">{apoio}</span>}
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={`${base} flex-col`} {...aria}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} flex-col`}
      {...aria}
    >
      {conteudo}
    </button>
  )
}

export default Botao
