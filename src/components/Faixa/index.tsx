import type { FC, ReactNode } from 'react'

interface FaixaProps {
  titulo: string
  children: ReactNode
  acao?: ReactNode
  className?: string
}

/** Cabeçalho de seção: título claro + conteúdo em cards. Evita texto em bloco. */
const Faixa: FC<FaixaProps> = ({ titulo, children, acao, className = '' }) => (
  <section
    className={className}
    aria-labelledby={`secao-${titulo.replace(/\s+/g, '-').toLowerCase()}`}
  >
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <h2
        id={`secao-${titulo.replace(/\s+/g, '-').toLowerCase()}`}
        className="font-titulo text-lg font-bold text-tinta"
      >
        {titulo}
      </h2>
      {acao}
    </div>
    {children}
  </section>
)

export default Faixa
