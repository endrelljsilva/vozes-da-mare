import type { FC } from 'react'
import { AudioButton } from './AudioButton'

export type NivelSemaforo = 'verde' | 'amarelo' | 'vermelho'

interface SemaforoCardProps {
  nivel: NivelSemaforo
  titulo: string
  subtitulo: string
  falaAudio: string
}

export const SemaforoCard: FC<SemaforoCardProps> = ({
  nivel,
  titulo,
  subtitulo,
  falaAudio,
}) => {
  const configs = {
    verde: {
      bg: 'bg-emerald-500',
      borda: 'border-emerald-600',
      iconeFundo: 'bg-emerald-600',
      textoBadge: 'TÁ BOM DE IR PRO MANGUE',
      icone: '✅',
    },
    amarelo: {
      bg: 'bg-amber-500',
      borda: 'border-amber-600',
      iconeFundo: 'bg-amber-600',
      textoBadge: 'ATENÇÃO NO MANGUE HOJE',
      icone: '⚠️',
    },
    vermelho: {
      bg: 'bg-rose-600',
      borda: 'border-rose-700',
      iconeFundo: 'bg-rose-700',
      textoBadge: 'PERIGO: NÃO VÁ AO MANGUE',
      icone: '⛔',
    },
  }[nivel]

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${configs.bg} p-5 text-white shadow-xl border-4 ${configs.borda} transition-transform`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${configs.iconeFundo} text-2xl shadow-inner`}
          >
            {configs.icone}
          </span>
          <div>
            <span className="inline-block rounded-full bg-black/25 px-3 py-0.5 text-xs font-black tracking-wider uppercase">
              {configs.textoBadge}
            </span>
            <h2 className="mt-0.5 font-titulo text-xl font-black leading-tight sm:text-2xl drop-shadow-sm">
              {titulo}
            </h2>
          </div>
        </div>

        <div className="shrink-0">
          <AudioButton
            textoParaFalar={falaAudio}
            tamanho="medio"
            className="!bg-white !text-tinta hover:!bg-areia-100 shadow-lg font-black"
          />
        </div>
      </div>

      <p className="mt-3.5 text-sm font-bold text-white/95 leading-snug drop-shadow-sm border-t border-white/20 pt-2.5">
        {subtitulo}
      </p>
    </div>
  )
}
