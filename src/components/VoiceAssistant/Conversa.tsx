import type { FC, ReactNode } from 'react'

interface ConversaProps {
  /** Frases que a Maré já falou, em ordem. */
  falas: string[]
  /** Pergunta transcrita da usuária, se houver. */
  pergunta?: string
  children?: ReactNode
}

/**
 * Transcrição da conversa com a assistente.
 * Existe como texto **por acessibilidade** (§23): quem não pode ouvir a
 * resposta em voz alta precisa conseguir lê-la na tela.
 */
const Conversa: FC<ConversaProps> = ({ falas, pergunta, children }) => {
  if (!pergunta && falas.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {pergunta && (
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-mare-400 px-4 py-3 text-[15px] leading-snug font-semibold text-white shadow-card">
            {pergunta}
          </p>
        </div>
      )}

      {falas.map((fala, i) => (
        <div key={`${fala}-${i}`} className="flex justify-start">
          <p
            className={`max-w-[88%] rounded-3xl rounded-bl-lg px-4 py-3 text-[15px] leading-snug font-semibold shadow-card ${
              i === falas.length - 1 ? 'bg-white text-tinta' : 'bg-areia-50 text-tinta-suave'
            }`}
          >
            {fala}
          </p>
        </div>
      ))}

      {children}
    </div>
  )
}

export default Conversa
