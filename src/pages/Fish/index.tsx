import { useState, useMemo, type FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import { LISTA_MARISCOS, type MariscoItem } from '../../data/mariscos'
import { AudioButton } from '../../components/AudioButton'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'
import {
  IlustracaoConcha,
  IlustracaoPeixinho,
  IlustracaoCaranguejo,
} from '../../components/illustrations/IconesEspecies'

const Peixes: FC = () => {
  const [filtroMare, setFiltroMare] = useState<'todas' | 'seca' | 'enchendo' | 'cheia'>('todas')

  const itensFiltrados = useMemo(() => {
    if (filtroMare === 'todas') return LISTA_MARISCOS
    return LISTA_MARISCOS.filter(
      (m) =>
        m.mareIdeal === filtroMare ||
        (filtroMare === 'seca' && m.mareIdeal === 'vazando'),
    )
  }, [filtroMare])

  const renderIlustracao = (item: MariscoItem) => {
    if (item.categoria === 'marisco') {
      return (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-areia-100 border-2 border-amber-300 shadow-sm">
          <IlustracaoConcha size={36} />
        </span>
      )
    }
    if (item.categoria === 'peixe') {
      return (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 border-2 border-sky-300 shadow-sm">
          <IlustracaoPeixinho size={36} />
        </span>
      )
    }
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 border-2 border-orange-300 shadow-sm">
        <IlustracaoCaranguejo size={36} />
      </span>
    )
  }

  return (
    <Tela>
      <Topo titulo="Mariscos & Peixes por Maré" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 pt-4">
        {/* Guia com Dona Maré */}
        <DonaMareAvatar
          fala="Aqui você vê o que dá para catar e pescar em cada maré: conchas de sururu e marisco na maré seca, tainha e siri na maré enchendo, e peixe robalo na maré cheia!"
          tamanho={110}
        />

        {/* Filtros de Maré */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black text-tinta px-1">
            Escolha a maré para ver o que pegar:
          </span>
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-white border border-areia-200 p-1.5 shadow-sm">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'seca', label: 'Maré Seca' },
              { id: 'enchendo', label: 'Enchendo' },
              { id: 'cheia', label: 'Maré Cheia' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFiltroMare(m.id as typeof filtroMare)}
                className={`rounded-xl py-2.5 text-xs font-black transition-all ${
                  filtroMare === m.id
                    ? 'bg-mare-600 text-white shadow'
                    : 'text-tinta-suave hover:bg-areia-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Espécies com Pequena Ilustração de Concha/Peixinho */}
        <div className="flex flex-col gap-3.5">
          {itensFiltrados.map((item: MariscoItem) => {
            const corTag =
              item.mareIdeal === 'seca' || item.mareIdeal === 'vazando'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : item.mareIdeal === 'enchendo'
                  ? 'bg-sky-100 text-sky-950 border-sky-300'
                  : 'bg-indigo-100 text-indigo-950 border-indigo-300'

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border-2 border-areia-200 bg-white p-5 shadow-card transition-all hover:border-mare-400"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Pequena Ilustração ao lado (Concha para marisco, Peixinho para peixes) */}
                    {renderIlustracao(item)}

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${corTag}`}
                        >
                          {item.rotuloMare}
                        </span>
                        <span className="text-[11px] font-bold text-tinta-suave uppercase">
                          • {item.categoria}
                        </span>
                      </div>

                      <h3 className="mt-1 font-titulo text-lg font-black text-tinta leading-tight">
                        {item.nome}
                      </h3>
                      <p className="text-xs font-bold text-mare-800 mt-0.5">
                        📍 {item.ondeEncontrar}
                      </p>
                    </div>
                  </div>

                  <AudioButton textoParaFalar={item.falaAudio} tamanho="medio" />
                </div>

                {/* Explicação da Maré */}
                <div className="mt-3.5 rounded-2xl bg-areia-50 border border-areia-200 p-3 text-xs font-bold text-tinta">
                  <strong className="block text-mare-900 mb-0.5">
                    🌊 Por que dá nesta maré:
                  </strong>
                  {item.explicacaoMare}
                </div>

                {/* Dica de Segurança */}
                <div className="mt-2.5 rounded-2xl bg-amber-50 border border-amber-200 p-2.5 text-xs font-bold text-amber-950">
                  <strong className="block text-amber-800 mb-0.5">
                    ⚠️ Cuidado:
                  </strong>
                  {item.dicaSeguranca}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Tela>
  )
}

export default Peixes