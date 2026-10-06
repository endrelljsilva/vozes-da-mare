import { useState, useEffect, type FC } from 'react'
import { audioFeedback } from '../services/audio/AudioFeedback'

interface DonaMareAvatarProps {
  tamanho?: number
  fala?: string
  aoClicarFala?: boolean
  className?: string
}

export const DonaMareAvatar: FC<DonaMareAvatarProps> = ({
  tamanho = 120,
  fala,
  aoClicarFala = true,
  className = '',
}) => {
  const [estaFalando, setEstaFalando] = useState(false)

  useEffect(() => {
    const checar = setInterval(() => {
      setEstaFalando(audioFeedback.isFalando())
    }, 150)
    return () => clearInterval(checar)
  }, [])

  const aoClicar = () => {
    if (!aoClicarFala || !fala) return
    audioFeedback.tocarCliqueAgua()
    if (estaFalando) {
      audioFeedback.pararFala()
      setEstaFalando(false)
    } else {
      audioFeedback.falar(fala)
      setEstaFalando(true)
    }
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Balão de fala amigável no topo */}
      {fala && (
        <div
          onClick={aoClicar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && aoClicar()}
          aria-label={`Ouvir conselho da Dona Maré: ${fala}`}
          className="relative mb-3 max-w-xs cursor-pointer rounded-3xl border-2 border-mare-300 bg-white px-4 py-3 shadow-card transition-transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <p className="font-titulo text-sm font-bold text-tinta leading-snug">
              {fala}
            </p>
          </div>
          <span className="mt-1 block text-[11px] font-extrabold text-mare-700">
            {estaFalando ? '🔊 Falando...' : '👉 Toque para ouvir'}
          </span>
          {/* Ponta do balão */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-mare-300" />
        </div>
      )}

      {/* Ilustração SVG de Dona Maré: marisqueira acolhedora com chapéu de palha */}
      <div
        onClick={aoClicar}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && aoClicar()}
        aria-label="Dona Maré - assistente de voz"
        className={`cursor-pointer transition-transform ${
          estaFalando ? 'scale-105 animate-bounce' : 'hover:scale-102'
        }`}
        style={{ width: tamanho, height: tamanho }}
      >
        <svg
          viewBox="0 0 200 200"
          width={tamanho}
          height={tamanho}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Círculo de fundo brilhante */}
          <circle cx="100" cy="100" r="95" fill="#E6F1F6" stroke="#82B6CB" strokeWidth="4" />

          {/* Roupa / camisa azul de marisqueira */}
          <path
            d="M50 190 Q100 160 150 190 L160 200 L40 200 Z"
            fill="#558AA3"
          />
          {/* Gola da camisa */}
          <path d="M85 165 L100 180 L115 165 Z" fill="#FBEAD6" />

          {/* Pescoço */}
          <rect x="88" y="130" width="24" height="30" rx="4" fill="#B0754E" />

          {/* Rosto / Cabeça */}
          <ellipse cx="100" cy="105" rx="38" ry="42" fill="#B0754E" />

          {/* Cabelo crespo / cacheado preso */}
          <ellipse cx="100" cy="72" rx="42" ry="25" fill="#3A2A20" />
          <ellipse cx="62" cy="105" rx="14" ry="22" fill="#3A2A20" />
          <ellipse cx="138" cy="105" rx="14" ry="22" fill="#3A2A20" />

          {/* Chapéu de Palha de Marisqueira */}
          <ellipse cx="100" cy="74" rx="66" ry="16" fill="#F4D06F" stroke="#D4A33B" strokeWidth="3" />
          <path
            d="M65 72 Q100 35 135 72 Z"
            fill="#F4D06F"
            stroke="#D4A33B"
            strokeWidth="3"
          />
          {/* Fita do chapéu (laranja da marca) */}
          <path d="M68 70 Q100 58 132 70" stroke="#F48653" strokeWidth="6" strokeLinecap="round" />

          {/* Olhos gentis e acolhedores */}
          <ellipse cx="85" cy="102" rx="4" ry="5" fill="#22414F" />
          <ellipse cx="115" cy="102" rx="4" ry="5" fill="#22414F" />
          {/* Brilho nos olhos */}
          <circle cx="83.5" cy="100.5" r="1.5" fill="#FFFFFF" />
          <circle cx="113.5" cy="100.5" r="1.5" fill="#FFFFFF" />

          {/* Sobrancelhas */}
          <path d="M78 94 Q85 91 92 94" stroke="#3A2A20" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M108 94 Q115 91 122 94" stroke="#3A2A20" strokeWidth="2.5" strokeLinecap="round" />

          {/* Nariz */}
          <path d="M97 106 Q100 112 103 106" stroke="#8F5C3A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bochechas coradas com sol */}
          <circle cx="75" cy="112" r="7" fill="#F48653" fillOpacity="0.3" />
          <circle cx="125" cy="112" r="7" fill="#F48653" fillOpacity="0.3" />

          {/* Boca animada: mexe quando está falando */}
          {estaFalando ? (
            <ellipse cx="100" cy="124" rx="8" ry="6" fill="#7D2020" stroke="#22414F" strokeWidth="1.5" />
          ) : (
            <path
              d="M90 122 Q100 130 110 122"
              stroke="#22414F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Brincos de concha */}
          <circle cx="60" cy="120" r="3.5" fill="#FBEAD6" stroke="#82B6CB" strokeWidth="1.5" />
          <circle cx="140" cy="120" r="3.5" fill="#FBEAD6" stroke="#82B6CB" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
