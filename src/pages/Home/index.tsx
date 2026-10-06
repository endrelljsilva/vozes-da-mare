import { useEffect, useState, type FC } from 'react'
import { Link } from 'react-router-dom'
import Tela from '../../components/Tela'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'
import { SemaforoCard, type NivelSemaforo } from '../../components/SemaforoCard'
import { TideVisualizer } from '../../components/TideVisualizer'
import { AudioButton } from '../../components/AudioButton'
import { audioFeedback } from '../../services/audio/AudioFeedback'
import { fetchWeather } from '../../services/weather/WeatherService'
import { obterStatusMareMomento } from '../../services/tide/TideEngine'
import MapView from '../../components/Map/MapView'

const Home: FC = () => {
  const [nivelSemaforo, setNivelSemaforo] = useState<NivelSemaforo>('verde')
  const [tituloSemaforo, setTituloSemaforo] = useState('Dia favorável para mariscar')
  const [subtituloSemaforo, setSubtituloSemaforo] = useState('Maré descendo e tempo calmo em Itapissuma.')
  const [falaSemaforo, setFalaSemaforo] = useState(
    'Olá, companheira! Hoje as condições estão boas para entrar no mangue. A maré tá secando e não tem risco de tempestade. Fique atenta à hora da maré seca.',
  )
  const [falaDonaMare, setFalaDonaMare] = useState('Quer saber se tá bom de catar marisco hoje? Toque em mim ou fale no microfone!')

  useEffect(() => {
    const carregarCondicoes = async () => {
      const horaAtual = new Date().getHours()
      const isNoite = horaAtual >= 18 || horaAtual < 5
      const isFimDeTarde = horaAtual >= 17 && horaAtual < 18

      // Prioridade 1: Segurança Noturna e Horário Tarde
      if (isNoite) {
        setNivelSemaforo('vermelho')
        setTituloSemaforo('Atenção: Horário Noturno Perigoso')
        setSubtituloSemaforo('Não é recomendado pescar nem mariscar no escuro. Alto risco de acidentes e correnteza.')
        const fala = 'Atenção, pescadora! Já é noite e este não é um bom horário para pescar nem mariscar. No escuro o manguezal é muito perigoso devido à falta de visão, animais e risco de se perder. Espere o dia amanhecer para sua segurança!'
        setFalaSemaforo(fala)
        setFalaDonaMare('Já anoiteceu! Não vá pro mangue no escuro, é muito perigoso.')
        return
      }

      if (isFimDeTarde) {
        setNivelSemaforo('amarelo')
        setTituloSemaforo('Fim de Tarde: Hora de Retornar')
        setSubtituloSemaforo('O sol vai se pôr logo. Saia do manguezal antes de anoitecer.')
        const fala = 'Fique atenta ao relógio! Já está no fim de tarde e o sol vai se pôr logo. Não é seguro continuar no manguezal no escuro. Comece a recolher suas coisas e volte para casa em segurança!'
        setFalaSemaforo(fala)
        setFalaDonaMare('Fim de tarde! Hora de voltar pra casa antes de escurecer.')
        return
      }

      try {
        const clima = await fetchWeather()
        const mare = obterStatusMareMomento()

        const tempestade = clima.current.weatherCode >= 95
        const chuvaForte = clima.current.precipitationMm >= 2
        const ventoForte = clima.current.windKmh >= 28

        if (tempestade || chuvaForte) {
          setNivelSemaforo('vermelho')
          setTituloSemaforo('Cuidado: Risco de Tempestade')
          setSubtituloSemaforo('Chuva forte no manguezal. Não vá para a água hoje!')
          const fala = 'Atenção, pescadora! Hoje não é dia de ir pro mangue. Tem previsão de chuva forte ou trovoada. Fique em casa por segurança!'
          setFalaSemaforo(fala)
          setFalaDonaMare('Hoje o tempo tá feio no mangue. Fique em casa!')
        } else if (ventoForte || mare.fase === 'enchendo') {
          setNivelSemaforo('amarelo')
          setTituloSemaforo('Atenção: Maré enchendo ou vento puxado')
          setSubtituloSemaforo(`Vento a ${Math.round(clima.current.windKmh)} km/h. Água subindo no canal.`)
          const fala = `Fique atenta hoje! A maré tá enchendo e o vento sopra a ${Math.round(clima.current.windKmh)} quilômetros por hora. Não se afaste muito no manguezal.`
          setFalaSemaforo(fala)
          setFalaDonaMare('Fique atenta que a maré tá enchendo e tem vento!')
        } else {
          setNivelSemaforo('verde')
          setTituloSemaforo('Maré favorável pra mariscar')
          setSubtituloSemaforo(`Maré secando. A hora mais baixa é às ${mare.proximaBaixaMar.horario}.`)
          const fala = `Dia muito bom! A maré tá secando com ${mare.alturaAtual} metros. A hora de ouro pra catar marisco é às ${mare.proximaBaixaMar.horario}. Bom trabalho no mangue!`
          setFalaSemaforo(fala)
          setFalaDonaMare(`Hoje tá bom de mariscar! A maré seca às ${mare.proximaBaixaMar.horario}.`)
        }
      } catch {
        const mare = obterStatusMareMomento()
        setNivelSemaforo('verde')
        setTituloSemaforo('Maré de Itapissuma calculada')
        setSubtituloSemaforo(`Próxima maré seca às ${mare.proximaBaixaMar.horario}.`)
      }
    }

    void carregarCondicoes()
  }, [])

  return (
    <Tela>
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 pt-5">
        {/* Cabeçalho acolhedor com botão de Ouvir Tudo */}
        <header className="flex items-center justify-between gap-3 bg-white/80 backdrop-blur rounded-3xl p-4 border border-areia-200 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Vozes da Maré"
              width={54}
              height={50}
              className="object-contain drop-shadow"
            />
            <div>
              <h1 className="font-titulo text-xl font-black text-tinta leading-tight">
                Vozes da Maré
              </h1>
              <p className="text-xs font-bold text-tinta-suave">
                Itapissuma, Pernambuco
              </p>
            </div>
          </div>

          <AudioButton
            textoParaFalar="Bem-vinda ao Vozes da Maré! Aqui você ouve tudo sobre maré, chuva, sururu, ostra e cuidados de saúde no manguezal."
            rotulo="Ouvir Guia"
            tamanho="pequeno"
          />
        </header>

        {/* Semáforo Gigante do Dia com Checagem de Horário Noturno */}
        <section aria-label="Recomendação geral do dia">
          <SemaforoCard
            nivel={nivelSemaforo}
            titulo={tituloSemaforo}
            subtitulo={subtituloSemaforo}
            falaAudio={falaSemaforo}
          />
        </section>

        {/* Dona Maré: Personagem com Fala e Áudio */}
        <section aria-label="Conselho da Dona Maré" className="my-1">
          <DonaMareAvatar fala={falaDonaMare} tamanho={130} />
        </section>

        {/* Atalho Principal: BOTÃO GIGANTE DE FALAR POR VOZ */}
        <section aria-label="Falar com a assistente de voz">
          <Link
            to="/voz"
            onClick={() => audioFeedback.tocarAberturaMicrofone()}
            className="group relative flex min-h-20 w-full items-center justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-r from-laranja-500 to-amber-500 px-6 py-4 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 border-3 border-amber-300"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🎙️
              </span>
              <div className="text-left">
                <span className="block font-titulo text-xl font-black leading-tight sm:text-2xl drop-shadow">
                  FALAR COM A MARÉ
                </span>
                <span className="block text-xs font-bold text-white/90">
                  Toque aqui e pergunte com sua voz
                </span>
              </div>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-laranja-700 shadow uppercase tracking-wider shrink-0">
              Conversar
            </span>
          </Link>
        </section>

        {/* Visualizador Animado da Maré */}
        <section aria-label="Medidor de Maré em Tempo Real">
          <TideVisualizer />
        </section>

        {/* SEÇÃO PRINCIPAL SOLICITADA: MAPA DE ITAPISSUMA DIRETO NA TELA INICIAL */}
        <section aria-label="Mapa de Itapissuma" className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-titulo text-lg font-black text-tinta flex items-center gap-2">
                <span>🗺️</span> Mapa de Itapissuma
              </h2>
              <p className="text-xs font-bold text-tinta-suave">
                Postos de saúde, Canal de Santa Cruz, riachos e manguezais
              </p>
            </div>
            <AudioButton
              textoParaFalar="Este é o mapa de Itapissuma. Toque nos pontos para ouvir onde fica a UBS Central, o Hospital, o Canal de Santa Cruz, riachos e onde catar sururu e mariscos."
              rotulo="Ouvir Mapa"
              tamanho="pequeno"
            />
          </div>

          <MapView />
        </section>

        {/* Grade de Atalhos Ilustrados Grandes com Áudio Próprio */}
        <section aria-label="Assuntos e Guias">
          <h2 className="font-titulo text-lg font-black text-tinta px-1 mb-3 flex items-center justify-between">
            <span>Mais Informações</span>
            <span className="text-xs font-semibold text-tinta-suave">Toque no cartão</span>
          </h2>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Cartão 1: Maré */}
            <Link
              to="/mare"
              onClick={() => audioFeedback.tocarCliqueAgua()}
              className="group flex flex-col justify-between rounded-3xl border-2 border-mare-200 bg-white p-4 shadow-card hover:border-mare-400 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">🌊</span>
                <AudioButton
                  textoParaFalar="Tábua de maré completa de hoje e dos próximos dias em Itapissuma."
                  iconeApenas
                  tamanho="pequeno"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-titulo text-base font-black text-tinta">Tábua da Maré</h3>
                <p className="text-xs font-semibold text-tinta-suave mt-0.5">
                  Horas da maré seca e cheia
                </p>
              </div>
            </Link>

            {/* Cartão 2: Mariscos e Pesca com Conchas e Peixinhos */}
            <Link
              to="/peixes"
              onClick={() => audioFeedback.tocarCliqueAgua()}
              className="group flex flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-white p-4 shadow-card hover:border-emerald-400 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">🦪</span>
                <AudioButton
                  textoParaFalar="Guia de mariscos e peixes por maré: conchas de sururu, ostra, marisco de coroa e peixes de Itapissuma."
                  iconeApenas
                  tamanho="pequeno"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-titulo text-base font-black text-tinta">Mariscos & Pesca</h3>
                <p className="text-xs font-semibold text-tinta-suave mt-0.5">
                  O que dá em cada maré
                </p>
              </div>
            </Link>

            {/* Cartão 3: Tempo e Chuva */}
            <Link
              to="/clima"
              onClick={() => audioFeedback.tocarCliqueAgua()}
              className="group flex flex-col justify-between rounded-3xl border-2 border-amber-200 bg-white p-4 shadow-card hover:border-amber-400 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">☀️</span>
                <AudioButton
                  textoParaFalar="Previsão do tempo, calor, vento e chance de chuva em Itapissuma."
                  iconeApenas
                  tamanho="pequeno"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-titulo text-base font-black text-tinta">Tempo & Chuva</h3>
                <p className="text-xs font-semibold text-tinta-suave mt-0.5">
                  Sol, vento e roupas
                </p>
              </div>
            </Link>

            {/* Cartão 4: Saúde & Roupas de Proteção */}
            <Link
              to="/saude"
              onClick={() => audioFeedback.tocarCliqueAgua()}
              className="group flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-white p-4 shadow-card hover:border-rose-400 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">🩺</span>
                <AudioButton
                  textoParaFalar="Saúde e socorro no manguezal: roupas de proteção para o dia, o que fazer em caso de arraia ou corte de ostra e telefones do SAMU e hospital."
                  iconeApenas
                  tamanho="pequeno"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-titulo text-base font-black text-tinta">Saúde & Roupas</h3>
                <p className="text-xs font-semibold text-tinta-suave mt-0.5">
                  Roupas do dia e socorro
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Cartão de Emergência Rápida: Ligar SAMU 192 */}
        <section aria-label="Emergência rápida" className="mt-2">
          <div className="flex items-center justify-between rounded-3xl bg-rose-50 border-2 border-rose-300 p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚑</span>
              <div>
                <span className="text-[11px] font-black uppercase text-rose-800">
                  Emergência de Saúde
                </span>
                <p className="font-titulo text-sm font-bold text-tinta">
                  Precisa de socorro imediato?
                </p>
              </div>
            </div>

            <a
              href="tel:192"
              className="rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-rose-700 active:scale-95"
            >
              📞 Ligar 192
            </a>
          </div>
        </section>
      </div>
    </Tela>
  )
}

export default Home