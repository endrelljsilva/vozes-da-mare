import { useEffect, useState, type FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import { GUIAS_SOCORRO, TELEFONES_EMERGENCIA, type GuiaSocorro } from '../../data/socorro'
import { AudioButton } from '../../components/AudioButton'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'
import { fetchWeather, weatherCodeToLabel } from '../../services/weather/WeatherService'

const Saude: FC = () => {
  const [clima, setClima] = useState<Awaited<ReturnType<typeof fetchWeather>> | null>(null)

  useEffect(() => {
    fetchWeather().then(setClima).catch(() => {})
  }, [])

  const temp = clima ? Math.round(clima.current.temperatureC) : 29
  const vento = clima ? Math.round(clima.current.windKmh) : 15
  const condicao = clima ? weatherCodeToLabel(clima.current.weatherCode) : 'Sol'
  const temChuva = clima ? clima.current.precipitationMm > 0 : false

  const horaAtual = new Date().getHours()
  const isNoite = horaAtual >= 18 || horaAtual < 5
  const isFimDeTarde = horaAtual >= 17 && horaAtual < 18

  const falaRoupasHoje = `Dicas de roupas para sua saúde no mangue hoje: Em Itapissuma está fazendo ${temp} graus, com vento de ${vento} quilômetros por hora. Para se proteger do sol, use camisa de manga comprida e chapéu ou boné para evitar queimaduras de pele, insolação e desmaio. E nunca vá de pé descalço: use botina ou calçado fechado para se proteger de corte fundo de ostra e ferrão de arraia. Beba bastante água limpa durante o trabalho.`

  return (
    <Tela>
      <Topo titulo="Saúde & Socorro" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 pt-4">
        {/* Aviso de Horário Tarde / Noite */}
        {isNoite && (
          <div className="rounded-3xl border-2 border-rose-500 bg-rose-50 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌙</span>
                <div>
                  <h2 className="font-titulo text-sm font-black text-rose-900">
                    Aviso: Horário Noturno Perigoso
                  </h2>
                  <p className="text-xs font-bold text-rose-800">
                    Não entre no mangue à noite. Risco de acidentes e escuridão.
                  </p>
                </div>
              </div>
              <AudioButton
                textoParaFalar="Aviso de segurança: Já é noite. Não é recomendado pescar nem mariscar neste horário. O manguezal no escuro é muito perigoso por causa da falta de visibilidade, maré subindo e risco de se perder. Espere o amanhecer."
                rotulo="Ouvir"
                tamanho="pequeno"
                className="!bg-rose-600"
              />
            </div>
          </div>
        )}

        {isFimDeTarde && (
          <div className="rounded-3xl border-2 border-amber-500 bg-amber-50 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌇</span>
                <div>
                  <h2 className="font-titulo text-sm font-black text-amber-900">
                    Fim de Tarde: Hora de Retornar
                  </h2>
                  <p className="text-xs font-bold text-amber-800">
                    O sol vai se pôr logo. Saia do manguezal antes de anoitecer.
                  </p>
                </div>
              </div>
              <AudioButton
                textoParaFalar="Atenção: Já está no fim de tarde e o sol vai se pôr em breve. Não fique no manguezal no escuro. Comece a voltar para casa com segurança."
                rotulo="Ouvir"
                tamanho="pequeno"
              />
            </div>
          </div>
        )}

        {/* Guia com Dona Maré */}
        <DonaMareAvatar
          fala={
            isNoite
              ? 'Já anoiteceu, minha companheira. No escuro não se deve mariscar por segurança!'
              : 'Sua saúde no mangue vem em primeiro lugar! Veja aqui as roupas certas para vestir hoje e o que fazer em caso de acidentes.'
          }
          tamanho={110}
        />

        {/* Telefones de Emergência com Discagem com 1 Toque */}
        <section aria-label="Contatos de Emergência" className="flex flex-col gap-2.5">
          <h2 className="font-titulo text-base font-black text-rose-800 flex items-center gap-1.5 px-1">
            <span>🚨</span> Números de Socorro Imediato
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TELEFONES_EMERGENCIA.map((tel) => (
              <a
                key={tel.numero}
                href={tel.link}
                className="flex items-center justify-between rounded-2xl border-2 border-rose-300 bg-rose-50 p-3.5 shadow-sm hover:bg-rose-100 transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tel.icone}</span>
                  <div>
                    <h3 className="font-titulo text-sm font-black text-tinta">{tel.nome}</h3>
                    <p className="text-xs font-bold text-rose-700">{tel.numero}</p>
                  </div>
                </div>
                <span className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-black text-white shadow">
                  Ligar
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* SEÇÃO: Roupas Adequadas para a Saúde no Mangue dependendo do Dia */}
        <section
          aria-label="Roupas de proteção para o dia"
          className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 shadow-card"
        >
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🧢</span>
              <div>
                <h2 className="font-titulo text-base font-black text-amber-950">
                  Roupas de Proteção para Hoje
                </h2>
                <span className="text-[11px] font-bold text-amber-800">
                  Tempo hoje: {temp}°C • {condicao} • Vento: {vento} km/h {temChuva ? '• Chuva' : '• Sem chuva'}
                </span>
              </div>
            </div>

            <AudioButton textoParaFalar={falaRoupasHoje} rotulo="Ouvir Dicas" tamanho="pequeno" />
          </div>

          <div className="mt-3.5 flex flex-col gap-2.5 text-xs font-bold text-tinta">
            {/* Dica 1: Pés (Proteção mais crítica no mangue) */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3 flex items-start gap-3">
              <span className="text-2xl shrink-0">👢</span>
              <div>
                <strong className="block text-rose-900 font-titulo text-sm font-black">
                  Calçado Fechado ou Botina Velha (Urgente)
                </strong>
                <p className="text-gray-700 mt-0.5 leading-snug">
                  <strong>Saúde dos Pés:</strong> Nunca entre descalça no manguezal! Evita cortes graves por casca de ostra (que causam infecção bacteriana profunda e tétano) e protege contra ferrão de arraia na água rasa.
                </p>
              </div>
            </div>

            {/* Dica 2: Tronco e Braços (Sol ou Chuva do dia) */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 flex items-start gap-3">
              <span className="text-2xl shrink-0">👕</span>
              <div>
                <strong className="block text-amber-950 font-titulo text-sm font-black">
                  Camisa de Manga Comprida (Proteção Solar)
                </strong>
                <p className="text-gray-700 mt-0.5 leading-snug">
                  Com {temp}°C e sol forte, o tecido cobre os braços e o peito, prevenindo queimaduras solares, câncer de pele e picadas de muriçocas transmissoras de doenças.
                  {temChuva ? ' Hoje leve também uma capa impermeável para não tomar friagem.' : ''}
                </p>
              </div>
            </div>

            {/* Dica 3: Cabeça e Rosto (Chapéu ou boné) */}
            <div className="rounded-2xl border border-areia-300 bg-areia-50 p-3 flex items-start gap-3">
              <span className="text-2xl shrink-0">🧢</span>
              <div>
                <strong className="block text-tinta font-titulo text-sm font-black">
                  Chapéu ou Boné
                </strong>
                <p className="text-gray-700 mt-0.5 leading-snug">
                  Protege o rosto, o couro cabeludo e os olhos do reflexo forte do sol na água salgada, prevenindo insolação e dor de cabeça.
                </p>
              </div>
            </div>

            {/* Dica 4: Pernas */}
            <div className="rounded-2xl border border-areia-300 bg-areia-50 p-3 flex items-start gap-3">
              <span className="text-2xl shrink-0">👖</span>
              <div>
                <strong className="block text-tinta font-titulo text-sm font-black">
                  Calça Comprida Confortável
                </strong>
                <p className="text-gray-700 mt-0.5 leading-snug">
                  Protege as pernas e joelhos de arranhões em galhos pontiagudos de mangue e de picadas de insetos da lama.
                </p>
              </div>
            </div>

            {/* Dica 5: Hidratação */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 flex items-start gap-3">
              <span className="text-2xl shrink-0">💧</span>
              <div>
                <strong className="block text-sky-900 font-titulo text-sm font-black">
                  Garrafa com Água Potável
                </strong>
                <p className="text-gray-700 mt-0.5 leading-snug">
                  Trabalhar curvada na lama sob calor desidrata o corpo rapidamente. Beba água aos poucos para proteger os rins e não ter cãibras.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guias Práticos de Primeiros Socorros */}
        <section aria-label="O que fazer em acidentes" className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-titulo text-base font-black text-tinta flex items-center gap-1.5">
              <span>🩺</span> Primeiros Socorros no Mangue
            </h2>
            <span className="text-xs font-bold text-tinta-suave">Toque para ouvir</span>
          </div>

          {GUIAS_SOCORRO.map((guia: GuiaSocorro) => {
            const isUrgente = guia.urgencia === 'urgente'
            return (
              <div
                key={guia.id}
                className={`overflow-hidden rounded-3xl border-2 p-4 shadow-card ${
                  isUrgente
                    ? 'border-rose-300 bg-rose-50/50'
                    : 'border-areia-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm border border-areia-200">
                      {guia.icone}
                    </span>
                    <div>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          isUrgente
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {isUrgente ? 'Cuidado Imediato' : 'Prevenção'}
                      </span>
                      <h3 className="mt-0.5 font-titulo text-base font-black text-tinta">
                        {guia.titulo}
                      </h3>
                    </div>
                  </div>

                  <AudioButton textoParaFalar={guia.falaAudio} tamanho="medio" />
                </div>

                <div className="mt-3.5 flex flex-col gap-2 border-t border-areia-100 pt-3 text-xs font-bold text-tinta-suave">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-950">
                    <strong className="block text-emerald-800 mb-0.5">✅ O QUE FAZER:</strong>
                    {guia.oQueFazer}
                  </div>
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-rose-950">
                    <strong className="block text-rose-800 mb-0.5">❌ NUNCA FAÇA:</strong>
                    {guia.oQueNaoFazer}
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Postos de Saúde de Itapissuma */}
        <section aria-label="Postos de Saúde de Itapissuma" className="rounded-3xl border border-areia-200 bg-white p-4 shadow-card">
          <h2 className="font-titulo text-base font-black text-tinta flex items-center gap-1.5 mb-2">
            <span>🏥</span> Postos de Saúde em Itapissuma
          </h2>
          <p className="text-xs font-bold text-tinta-suave leading-relaxed">
            A <strong>UBS Central</strong> fica no Centro de Itapissuma e atende marisqueiras para vacina antitetânica, curativos e consultas de rotina. O <strong>Hospital Municipal</strong> atende urgências 24h.
          </p>
          <div className="mt-3 flex gap-2">
            <a
              href="https://www.google.com/maps/search/posto+de+saude+itapissuma"
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-mare-600 py-2.5 text-xs font-black text-white hover:bg-mare-700 shadow"
            >
              📍 Ver no Mapa
            </a>
            <AudioButton
              textoParaFalar="A Unidade Básica de Saúde Central de Itapissuma fica no Centro da cidade. Lá você pode tomar a vacina do tétano caso se corte com ostra e fazer curativos. O Hospital Municipal atende urgências e emergências 24 horas."
              rotulo="Ouvir Endereço"
              tamanho="pequeno"
            />
          </div>
        </section>
      </div>
    </Tela>
  )
}

export default Saude