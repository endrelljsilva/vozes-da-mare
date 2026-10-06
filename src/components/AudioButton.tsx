import { useState, type FC } from 'react'
import { audioFeedback } from '../services/audio/AudioFeedback'

interface AudioButtonProps {
  textoParaFalar: string
  rotulo?: string
  tamanho?: 'pequeno' | 'medio' | 'grande'
  className?: string
  iconeApenas?: boolean
}

export const AudioButton: FC<AudioButtonProps> = ({
  textoParaFalar,
  rotulo = 'Ouvir',
  tamanho = 'medio',
  className = '',
  iconeApenas = false,
}) => {
  const [falando, setFalando] = useState(false)

  const aoClicar = (e: React.MouseEvent) => {
    e.stopPropagation()
    audioFeedback.tocarCliqueAgua()

    if (falando) {
      audioFeedback.pararFala()
      setFalando(false)
      return
    }

    setFalando(true)
    audioFeedback.falar(textoParaFalar, () => {
      setFalando(false)
    })
  }

  const tamanhoClasses = {
    pequeno: 'p-2 text-xs',
    medio: 'px-3.5 py-2.5 text-sm',
    grande: 'px-5 py-3.5 text-base',
  }[tamanho]

  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={`Ouvir em voz alta: ${textoParaFalar}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95 shadow-md ${
        falando
          ? 'bg-laranja-500 text-white animate-pulse ring-4 ring-laranja-300'
          : 'bg-mare-600 text-white hover:bg-mare-700 hover:shadow-lg'
      } ${tamanhoClasses} ${className}`}
    >
      {/* Ícone de Alto-falante com ondas */}
      <svg
        viewBox="0 0 24 24"
        width={tamanho === 'grande' ? 28 : tamanho === 'pequeno' ? 18 : 22}
        height={tamanho === 'grande' ? 28 : tamanho === 'pequeno' ? 18 : 22}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path
          d="M15.54 8.46a5 5 0 0 1 0 7.07"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M19.07 4.93a10 10 0 0 1 0 14.14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {!iconeApenas && (
        <span className="font-titulo tracking-wide">
          {falando ? 'Falando...' : rotulo}
        </span>
      )}
    </button>
  )
}
