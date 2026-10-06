import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { audioFeedback } from '../services/audio/AudioFeedback'

export const BottomNav: FC = () => {
  const location = useLocation()

  const abas = [
    { rota: '/', rotulo: 'Início', icone: '🏠' },
    { rota: '/mare', rotulo: 'Maré', icone: '🌊' },
    { rota: '/voz', rotulo: 'Falar', icone: '🎙️', destaque: true },
    { rota: '/mapa', rotulo: 'Mapa', icone: '🗺️' },
    { rota: '/saude', rotulo: 'Saúde', icone: '🩺' },
  ]

  const aoTocarAba = () => {
    audioFeedback.tocarCliqueAgua()
  }

  return (
    <nav
      aria-label="Navegação Principal"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-areia-200 px-2 py-1.5 shadow-2xl"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {abas.map((aba) => {
          const ativo = location.pathname === aba.rota

          if (aba.destaque) {
            return (
              <Link
                key={aba.rota}
                to={aba.rota}
                onClick={aoTocarAba}
                className={`relative -top-5 flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-laranja-600 to-amber-500 p-4 text-white shadow-xl ring-4 ring-white transition-transform active:scale-90 ${
                  ativo ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <span className="text-2xl drop-shadow">{aba.icone}</span>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {aba.rotulo}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={aba.rota}
              to={aba.rota}
              onClick={aoTocarAba}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                ativo
                  ? 'text-mare-700 font-black'
                  : 'text-tinta-suave hover:text-tinta font-bold'
              }`}
            >
              <span className={`text-xl transition-transform ${ativo ? 'scale-125' : ''}`}>
                {aba.icone}
              </span>
              <span className={`text-[11px] mt-0.5 ${ativo ? 'font-black text-mare-800' : ''}`}>
                {aba.rotulo}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav