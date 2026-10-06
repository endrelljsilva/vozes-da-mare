import { useState, useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import { obterStatusMareMomento, type StatusMareMomento } from '../services/tide/TideEngine'
import { AudioButton } from './AudioButton'

export const TideVisualizer: FC = () => {
  const [status, setStatus] = useState<StatusMareMomento>(() => obterStatusMareMomento())

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(obterStatusMareMomento())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Altura varia de 0.2m (0%) a 2.6m (100%)
  const percentualAgua = Math.max(15, Math.min(95, Math.round(((status.alturaAtual - 0.2) / 2.4) * 100)))

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-mare-300 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between border-b border-areia-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="Onda">
            🌊
          </span>
          <div>
            <h3 className="font-titulo text-lg font-bold text-tinta">Maré em Itapissuma</h3>
            <span className="text-xs font-semibold text-tinta-suave flex items-center gap-1">
              <span>{status.iconeLua}</span> {status.faseLua} • {status.tipoDia}
            </span>
          </div>
        </div>

        <AudioButton textoParaFalar={status.mensagemVoz} rotulo="Ouvir Maré" tamanho="pequeno" />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Nível visual animado da água */}
        <div className="relative h-28 rounded-2xl bg-areia-100 overflow-hidden border border-mare-200 flex flex-col justify-end">
          {/* Fundo do mangue (lama e raízes) */}
          <div className="absolute top-2 left-3 z-10 text-[11px] font-bold text-tinta-suave">
            {status.fase === 'secando' || status.fase === 'estofa-baixa' ? (
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ⬇️ SECANDO (VAZANDO)
              </span>
            ) : (
              <span className="text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                ⬆️ ENCHENDO (SUBINDO)
              </span>
            )}
          </div>

          {/* Água animada */}
          <div
            className="w-full bg-gradient-to-t from-mare-600 to-mare-400 transition-all duration-1000 relative flex items-center justify-center text-white font-black text-xl drop-shadow"
            style={{ height: `${percentualAgua}%` }}
          >
            <div className="absolute -top-3 inset-x-0 h-3 bg-white/40 animate-pulse rounded-t-full" />
            <span>{status.alturaAtual}m</span>
          </div>
        </div>

        {/* Informação prática da maré seca */}
        <div className="flex flex-col gap-2">
          <div className="rounded-2xl bg-areia-50 border border-areia-200 p-3">
            <span className="text-[11px] font-bold uppercase text-tinta-suave tracking-wider">
              Melhor Hora pra Marisco:
            </span>
            <p className="font-titulo text-xl font-black text-emerald-800">
              {status.proximaBaixaMar.horario} (Maré Seca)
            </p>
            <p className="text-xs font-semibold text-tinta-suave">
              Água desce até {status.proximaBaixaMar.alturaMetros}m
            </p>
          </div>

          <Link
            to="/mare"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-mare-100 py-2.5 text-xs font-bold text-mare-900 hover:bg-mare-200 transition-colors"
          >
            Ver horários de amanhã e da semana →
          </Link>
        </div>
      </div>
    </div>
  )
}
