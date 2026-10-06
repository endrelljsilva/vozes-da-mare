import type { FC, ReactNode } from 'react'
import Ondas from './illustrations/Ondas'

interface TelaProps {
  children: ReactNode
  /** Esconde as ondas do rodapé nas telas de mapa, que ocupa 100% da altura. */
  semOndas?: boolean
}

/**
 * Moldura comum das telas: fundo creme, ondas no rodapé e respiro para a
 * navegação inferior. Mobile first — a largura máxima é a de um celular largo.
 */
const Tela: FC<TelaProps> = ({ children, semOndas = false }) => (
  <div className="relative flex min-h-dvh flex-col overflow-hidden bg-areia-100">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-mare-100/70 to-transparent"
    />

    <div className="relative z-10 flex-1 pb-28">{children}</div>

    {!semOndas && (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-16 z-0">
        <Ondas altura={84} />
      </div>
    )}
  </div>
)

export default Tela
