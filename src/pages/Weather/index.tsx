import { useEffect, useState, type FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import { AudioButton } from '../../components/AudioButton'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'
import { fetchWeather, weatherCodeToLabel } from '../../services/weather/WeatherService'

const Clima: FC = () => {
  const [clima, setClima] = useState<Awaited<ReturnType<typeof fetchWeather>> | null>(null)

  useEffect(() => {
    fetchWeather().then(setClima).catch(() => {})
  }, [])

  const temp = clima ? Math.round(clima.current.temperatureC) : 29
  const condicao = clima ? weatherCodeToLabel(clima.current.weatherCode) : 'Ensolarado'
  const vento = clima ? Math.round(clima.current.windKmh) : 14
  const chuva = clima ? (clima.current.precipitationMm > 0 ? 'Chovendo agora' : 'Sem chuva agora') : 'Sem chuva'

  const audioResumo = `Previsão do tempo para Itapissuma: Está fazendo ${temp} graus, tempo ${condicao.toLowerCase()}. Vento a ${vento} quilômetros por hora. ${chuva}. Recomendamos usar camisa de manga comprida, chapéu ou boné e calça para se proteger do sol forte e mosquitos no mangue.`

  return (
    <Tela>
      <Topo titulo="Tempo & Chuva" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 pt-4">
        {/* Banner Grande do Clima de Hoje */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-tr from-amber-400 to-amber-500 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="rounded-full bg-white/25 px-3 py-0.5 text-xs font-black uppercase tracking-wider">
                Itapissuma Hoje
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-titulo text-5xl font-black drop-shadow-md">
                  {temp}°
                </span>
                <span className="text-xl font-bold drop-shadow">
                  {condicao}
                </span>
              </div>
            </div>

            <span className="text-5xl drop-shadow">☀️</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <span className="text-xs font-bold text-white/90">
              Vento: {vento} km/h • {chuva}
            </span>
            <AudioButton
              textoParaFalar={audioResumo}
              rotulo="Ouvir Tempo"
              tamanho="pequeno"
              className="!bg-white !text-tinta font-black shadow"
            />
          </div>
        </div>

        {/* Dona Maré comentando o clima */}
        <DonaMareAvatar
          fala={
            vento >= 28
              ? 'Hoje o vento tá bem puxado! Cuidado com marola no canal.'
              : 'O sol tá quente hoje! Beba água e não esqueça do chapéu ou boné.'
          }
          tamanho={110}
        />

        {/* Três Cards Táteis: Sol, Vento e Chuva */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-3xl border-2 border-areia-200 bg-white p-4 shadow-card text-center">
            <span className="text-3xl">🌡️</span>
            <h3 className="font-titulo text-sm font-black text-tinta mt-1">Calor</h3>
            <p className="font-titulo text-2xl font-black text-amber-700">{temp}°C</p>
            <p className="text-[11px] font-bold text-tinta-suave mt-0.5">Sol forte</p>
          </div>

          <div className="rounded-3xl border-2 border-areia-200 bg-white p-4 shadow-card text-center">
            <span className="text-3xl">💨</span>
            <h3 className="font-titulo text-sm font-black text-tinta mt-1">Vento</h3>
            <p className="font-titulo text-2xl font-black text-sky-700">{vento} km/h</p>
            <p className="text-[11px] font-bold text-tinta-suave mt-0.5">
              {vento >= 28 ? 'Vento Forte' : 'Vento Manso'}
            </p>
          </div>

          <div className="rounded-3xl border-2 border-areia-200 bg-white p-4 shadow-card text-center">
            <span className="text-3xl">🌧️</span>
            <h3 className="font-titulo text-sm font-black text-tinta mt-1">Chuva</h3>
            <p className="font-titulo text-lg font-black text-emerald-700 mt-1">{chuva}</p>
            <p className="text-[11px] font-bold text-tinta-suave mt-0.5">Sem risco agora</p>
          </div>
        </div>

        {/* O Que Vestir pro Mangue (Roupa do Dia) */}
        <div className="rounded-3xl border-2 border-mare-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-areia-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧢</span>
              <h3 className="font-titulo text-base font-black text-tinta">
                Roupa Recomendada pro Mangue
              </h3>
            </div>
            <AudioButton
              textoParaFalar="Recomendação de roupa: use camisa de manga comprida e calça para proteger do sol e mosquitos. Chapéu ou boné para a cabeça e sapato fechado ou botina velha para não cortar o pé nas conchas de ostra."
              rotulo="Ouvir"
              tamanho="pequeno"
            />
          </div>

          <ul className="mt-3 flex flex-col gap-2.5 text-xs font-bold text-tinta">
            <li className="flex items-center gap-2.5 rounded-2xl bg-areia-50 p-2.5 border border-areia-200">
              <span className="text-lg">👕</span>
              <span><strong>Camisa de manga comprida:</strong> protege do sol e muriçoca.</span>
            </li>
            <li className="flex items-center gap-2.5 rounded-2xl bg-areia-50 p-2.5 border border-areia-200">
              <span className="text-lg">🧢</span>
              <span><strong>Chapéu ou boné:</strong> protege o rosto da insolação e do sol.</span>
            </li>
            <li className="flex items-center gap-2.5 rounded-2xl bg-areia-50 p-2.5 border border-areia-200">
              <span className="text-lg">👢</span>
              <span><strong>Botina velha ou sapato fechado:</strong> protege de ostra e ferrão de arraia.</span>
            </li>
            <li className="flex items-center gap-2.5 rounded-2xl bg-areia-50 p-2.5 border border-areia-200">
              <span className="text-lg">💧</span>
              <span><strong>Garrafa com água limpa:</strong> beba água sempre para não passar mal.</span>
            </li>
          </ul>
        </div>
      </div>
    </Tela>
  )
}

export default Clima