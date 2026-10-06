import type { FC } from 'react'
import Personagem from './Personagem'
import type { Expression } from './types'

interface CharacterProps {
  expression?: Expression
  /** Frase curta da assistente — regra §3: uma linha, nunca um parágrafo. */
  fala?: string
  /** Largura máxima da ilustração em px. A largura real é fluida. */
  size?: number
  /** Posiciona o balão à esquerda (padrão) ou à direita do personagem. */
  lado?: 'esquerda' | 'direita'
  className?: string
}

/**
 * Personagem + balão de fala. É o bloco que substitui parágrafos de texto
 * nas telas: a informação chega visual e, se a usuária quiser, também falada.
 *
 * A ilustração é fluida (`w-full h-auto`) dentro de uma coluna limitada, e o
 * balão ocupa o resto com `min-w-0`. Sem isso, em telas estreitas a soma
 * illustration + balão estoura a largura e empurra os cards para fora.
 */
const Character: FC<CharacterProps> = ({
  expression = 'normal',
  fala,
  size = 168,
  lado = 'esquerda',
  className = '',
}) => {
  // A largura máxima vai por `style`, e não por classe: o Tailwind só gera
  // classes que ele enxerga no código-fonte, e `max-w-[${size}px]` montado em
  // template string nunca é gerado — a regra silenciosamente não existiria.
  const largura = { maxWidth: `${size}px` }

  const personagem = (
    <div className={`w-[42%] min-w-24 shrink-0 ${className}`} style={largura}>
      <div className="animate-flutuar">
        <Personagem
          expression={expression}
          className="h-auto w-full"
          comCelular={expression === 'falando'}
        />
      </div>
    </div>
  )

  if (!fala) return <div className="flex justify-center">{personagem}</div>

  const balão = (
    <div
      className={`relative min-w-0 flex-1 rounded-3xl border-2 border-mare-200 bg-white px-4 py-3.5 text-center shadow-card ${
        lado === 'esquerda' ? 'rounded-bl-lg' : 'rounded-br-lg'
      }`}
    >
      <p className="text-[14px] leading-snug font-semibold text-balance text-tinta">{fala}</p>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 h-4 w-4 border-mare-200 bg-white ${
          lado === 'esquerda' ? '-right-2 border-r-2 border-b-2' : '-left-2 border-l-2 border-b-2'
        }`}
        style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
      />
    </div>
  )

  return (
    <div className="flex items-center gap-2.5 sm:gap-4">
      {lado === 'esquerda' ? (
        <>
          {balão}
          {personagem}
        </>
      ) : (
        <>
          {personagem}
          {balão}
        </>
      )}
    </div>
  )
}

export default Character
export type { Expression }
