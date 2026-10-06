import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useHistoricoInterno } from '../hooks/useHistoricoInterno'

interface TopoProps {
  titulo: string
  /** Seta de voltar. Quando ausente, mostra a marca à esquerda. */
  voltar?: boolean
  acao?: ReactNode
}

const setaEsquerda = (
  <svg
    viewBox="0 0 24 24"
    width={22}
    height={22}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

/**
 * Cabeçere padrão das telas internas: voltar, título e uma ação à direita.
 * Altura fixa para que o conteúdo não "pule" ao navegar.
 */
const Topo: FC<TopoProps> = ({ titulo, voltar = true, acao }) => {
  const { voltar: voltarParaTelaAnterior } = useHistoricoInterno()

  return (
    <header
      className="sticky top-0 z-40 border-b border-areia-200/70 bg-areia-100/90 backdrop-blur-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-center gap-2 px-3">
        {voltar ? (
          <button
            type="button"
            onClick={voltarParaTelaAnterior}
            aria-label="Voltar para a tela anterior"
            className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-mare-100 active:scale-95"
          >
            {setaEsquerda}
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Ir para o início"
            className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tinta hover:bg-mare-100"
          >
            <span className="text-xl leading-none" aria-hidden="true">
              🌊
            </span>
          </Link>
        )}

        <h1 className="flex-1 truncate text-center font-titulo text-lg font-bold text-tinta">
          {titulo}
        </h1>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center">
          {acao ?? (
            <span className="text-tinta-suave" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width={21}
                height={21}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 9.5h3l4.5-3.5v12L8 14.5H5z" />
                <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.8a7.5 7.5 0 0 1 0 10.4" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topo
