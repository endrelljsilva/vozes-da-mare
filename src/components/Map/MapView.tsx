import { useEffect, useMemo, useState, type FC } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { mapPoints } from '../../data/mapPoints'
import { mapPointTypeMeta, type MapPointType } from '../../types/mapPoint'
import { coresMarcador, GlifoMarcador } from './glifos'
import { criarIcone } from './marcadores'
import { AudioButton } from '../AudioButton'

const ITAPISSUMA_CENTER: [number, number] = [-7.662, -34.832]

const MapView: FC = () => {
  const [filtro, setFiltro] = useState<MapPointType | 'todos'>('todos')

  useEffect(() => {
    const timer = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
    return () => window.clearTimeout(timer)
  }, [])

  const visiveis = useMemo(
    () => (filtro === 'todos' ? mapPoints : mapPoints.filter((p) => p.type === filtro)),
    [filtro],
  )

  const tipos = Object.entries(mapPointTypeMeta) as [
    MapPointType,
    (typeof mapPointTypeMeta)[MapPointType],
  ][]

  return (
    <div className="flex flex-col gap-4">
      {/* Guia Falado do Mapa */}
      <div className="flex items-center justify-between rounded-3xl bg-white border-2 border-mare-200 p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🗺️</span>
          <div>
            <h3 className="font-titulo text-sm font-black text-tinta">
              Mapa de Maré & Saúde
            </h3>
            <p className="text-[11px] font-bold text-tinta-suave">
              Toque nos pontos para ouvir o lugar
            </p>
          </div>
        </div>

        <AudioButton
          textoParaFalar="Este é o mapa de Itapissuma. Aqui você vê onde fica a UBS Central e o Hospital Municipal para atendimento de saúde, e onde ficam os manguezais de sururu, o Canal de Santa Cruz, riachos e pontos de pesca."
          rotulo="Ouvir Guia"
          tamanho="pequeno"
        />
      </div>

      {/* Filtro por tipo com botões grandes táteis */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <ul className="flex w-max gap-2">
          <li>
            <button
              type="button"
              onClick={() => setFiltro('todos')}
              aria-pressed={filtro === 'todos'}
              className={`min-h-11 rounded-2xl border-2 px-4 text-xs font-black transition-all ${
                filtro === 'todos'
                  ? 'border-mare-500 bg-mare-600 text-white shadow-md'
                  : 'border-areia-200 bg-white text-tinta-suave hover:bg-areia-50'
              }`}
            >
              📍 Mostrar Todos
            </button>
          </li>
          {tipos.map(([tipo, meta]) => (
            <li key={tipo}>
              <button
                type="button"
                onClick={() => setFiltro(tipo)}
                aria-pressed={filtro === tipo}
                className={`flex min-h-11 items-center gap-2 rounded-2xl border-2 px-3.5 text-xs font-black transition-all ${
                  filtro === tipo
                    ? 'border-mare-500 bg-mare-600 text-white shadow-md'
                    : 'border-areia-200 bg-white text-tinta-suave hover:bg-areia-50'
                }`}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: filtro === tipo ? 'rgba(255,255,255,.3)' : coresMarcador[tipo],
                  }}
                >
                  <GlifoMarcador tipo={tipo} size={14} />
                </span>
                {meta.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Container do Mapa Leaflet */}
      <div className="overflow-hidden rounded-3xl border-2 border-mare-300 shadow-xl">
        <MapContainer
          center={ITAPISSUMA_CENTER}
          zoom={13}
          style={{ height: '55vh', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visiveis.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[ponto.latitude, ponto.longitude]}
              icon={criarIcone(ponto.type)}
            >
              <Popup>
                <div className="p-1 max-w-[220px]">
                  <strong className="block font-titulo text-sm text-tinta font-black">
                    {ponto.name}
                  </strong>
                  <span className="block text-[11px] font-bold text-mare-800 uppercase mt-0.5">
                    {mapPointTypeMeta[ponto.type].label}
                  </span>
                  {ponto.description && (
                    <p className="mt-1.5 text-xs font-semibold leading-relaxed text-gray-700">
                      {ponto.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-col gap-1.5 border-t border-gray-200 pt-2">
                    <AudioButton
                      textoParaFalar={`${ponto.name}. ${mapPointTypeMeta[ponto.type].label}. ${ponto.description || ''}`}
                      rotulo="Ouvir este ponto"
                      tamanho="pequeno"
                    />

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${ponto.latitude},${ponto.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700 shadow"
                    >
                      🧭 Como Chegar (Rota)
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Lista Rápida dos Pontos Mais Importantes Abaixo do Mapa */}
      <section aria-label="Pontos principais" className="flex flex-col gap-2 mt-1">
        <h4 className="font-titulo text-xs font-black uppercase tracking-wider text-tinta-suave px-1">
          Locais de Destaque em Itapissuma
        </h4>

        {visiveis.slice(0, 4).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-2xl bg-white border border-areia-200 p-3 shadow-sm"
          >
            <div>
              <h5 className="font-titulo text-xs font-black text-tinta">{p.name}</h5>
              <span className="text-[11px] font-bold text-tinta-suave">
                {mapPointTypeMeta[p.type].label}
              </span>
            </div>
            <AudioButton
              textoParaFalar={`${p.name}. ${p.description || ''}`}
              iconeApenas
              tamanho="pequeno"
            />
          </div>
        ))}
      </section>
    </div>
  )
}

export default MapView