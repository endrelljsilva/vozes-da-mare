import { useState, useMemo, type FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import {
  calcularEventosDoDia,
  obterStatusMareMomento,
  type EventoMare,
} from '../../services/tide/TideEngine'
import { AudioButton } from '../../components/AudioButton'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'

const Mare: FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<'hoje' | 'amanha'>('hoje')
  const statusAtual = useMemo(() => obterStatusMareMomento(), [])

  const horaAtual = new Date().getHours()
  const isNoite = horaAtual >= 18 || horaAtual < 5

  const eventosHoje = useMemo(() => calcularEventosDoDia(new Date()), [])
  const eventosAmanha = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return calcularEventosDoDia(d)
  }, [])

  const eventosExibidos = diaSelecionado === 'hoje' ? eventosHoje : eventosAmanha

  // Resumo em áudio do dia
  const textoAudioDia = useMemo(() => {
    if (diaSelecionado === 'hoje') {
      const secas = eventosHoje.filter((e) => e.tipo === 'baixa-mar')
      const cheias = eventosHoje.filter((e) => e.tipo === 'preamar')
      const secasTexto = secas.map((s) => `${s.horario} com ${s.alturaMetros} metros`).join(' e às ')
      const cheiasTexto = cheias.map((c) => `${c.horario} com ${c.alturaMetros} metros`).join(' e às ')
      return `Tábua de maré de hoje em Itapissuma: A maré seca acontece às ${secasTexto}. A maré cheia acontece às ${cheiasTexto}. O dia é de ${statusAtual.tipoDia}.`
    } else {
      const secas = eventosAmanha.filter((e) => e.tipo === 'baixa-mar')
      const cheias = eventosAmanha.filter((e) => e.tipo === 'preamar')
      const secasTexto = secas.map((s) => `${s.horario} com ${s.alturaMetros} metros`).join(' e às ')
      const cheiasTexto = cheias.map((c) => `${c.horario} com ${c.alturaMetros} metros`).join(' e às ')
      return `Tábua de maré de amanhã em Itapissuma: A maré mais seca vai ser às ${secasTexto}. E a maré cheia vai ser às ${cheiasTexto}.`
    }
  }, [diaSelecionado, eventosHoje, eventosAmanha, statusAtual])

  return (
    <Tela>
      <Topo titulo="Tábua da Maré" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 pt-4">
        {/* Banner do Momento */}
        <div className="overflow-hidden rounded-3xl border-2 border-mare-400 bg-gradient-to-r from-mare-500 to-mare-600 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-black uppercase">
                Agora na Água
              </span>
              <h2 className="mt-1 font-titulo text-2xl font-black drop-shadow">
                {statusAtual.alturaAtual}m • {statusAtual.fase === 'secando' ? 'Secando ⬇️' : 'Enchendo ⬆️'}
              </h2>
            </div>
            <AudioButton
              textoParaFalar={statusAtual.mensagemVoz}
              rotulo="Ouvir Agora"
              tamanho="pequeno"
              className="!bg-white !text-mare-900"
            />
          </div>

          <p className="mt-3 text-xs font-bold text-white/90 border-t border-white/20 pt-2">
            Lua: {statusAtual.faseLua} {statusAtual.iconeLua} • {statusAtual.tipoDia}
          </p>
        </div>

        {/* Alerta de Horário Noturno se for Noite */}
        {isNoite && (
          <div className="rounded-3xl border-2 border-rose-400 bg-rose-50 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌙</span>
                <div>
                  <h3 className="font-titulo text-sm font-black text-rose-900">
                    Aviso: Cuidado com a Noite
                  </h3>
                  <p className="text-xs font-bold text-rose-800">
                    Mesmo com maré baixa, não marisque no escuro por segurança.
                  </p>
                </div>
              </div>
              <AudioButton
                textoParaFalar="Atenção, marisqueira: Mesmo que a maré seque durante a noite, não entre no manguezal no escuro. A falta de visão e a escuridão aumentam muito o risco de se perder e de acidentes. Espere o dia clarear."
                rotulo="Ouvir"
                tamanho="pequeno"
                className="!bg-rose-600"
              />
            </div>
          </div>
        )}

        {/* Dona Maré orientando sobre maré */}
        <DonaMareAvatar
          fala={
            isNoite
              ? 'Já anoiteceu! Descanse hoje e veja os horários da maré de amanhã para se planejar.'
              : statusAtual.fase === 'secando'
                ? `A maré tá secando agora! A hora de ouro é às ${statusAtual.proximaBaixaMar.horario}.`
                : `A maré tá subindo agora. Cuidado pra não ficar ilhada no mangueçal!`
          }
          tamanho={110}
        />

        {/* Alternador Hoje / Amanhã em botões grandes */}
        <div className="flex rounded-2xl bg-areia-200 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setDiaSelecionado('hoje')}
            className={`flex-1 rounded-xl py-3 text-sm font-black transition-all ${
              diaSelecionado === 'hoje'
                ? 'bg-white text-tinta shadow-md scale-[1.02]'
                : 'text-tinta-suave hover:text-tinta'
            }`}
          >
            📅 Maré de Hoje
          </button>
          <button
            type="button"
            onClick={() => setDiaSelecionado('amanha')}
            className={`flex-1 rounded-xl py-3 text-sm font-black transition-all ${
              diaSelecionado === 'amanha'
                ? 'bg-white text-tinta shadow-md scale-[1.02]'
                : 'text-tinta-suave hover:text-tinta'
            }`}
          >
            🌅 Maré de Amanhã
          </button>
        </div>

        {/* Botão de Ouvir Toda a Tábua do Dia */}
        <div className="flex items-center justify-between rounded-2xl bg-white border border-areia-200 p-3 shadow-sm">
          <span className="text-xs font-extrabold text-tinta">
            Ouvir horários de {diaSelecionado === 'hoje' ? 'hoje' : 'amanhã'}:
          </span>
          <AudioButton textoParaFalar={textoAudioDia} rotulo="Ouvir Horários" tamanho="pequeno" />
        </div>

        {/* Lista de Eventos de Maré em Cards Táteis */}
        <section aria-label="Horários das marés" className="flex flex-col gap-3">
          {eventosExibidos.map((evento: EventoMare, idx) => {
            const isSeca = evento.tipo === 'baixa-mar'
            return (
              <div
                key={`${evento.horario}-${idx}`}
                className={`flex items-center justify-between rounded-3xl border-2 p-4 shadow-card transition-all ${
                  isSeca
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-sky-300 bg-sky-50/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${
                      isSeca ? 'bg-emerald-200 text-emerald-800' : 'bg-sky-200 text-sky-800'
                    }`}
                  >
                    {isSeca ? '🦀' : '🌊'}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-titulo text-2xl font-black text-tinta">
                        {evento.horario}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${
                          isSeca ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'
                        }`}
                      >
                        {isSeca ? 'Maré Seca' : 'Maré Cheia'}
                      </span>
                    </div>

                    <p className="text-xs font-extrabold text-tinta-suave mt-0.5">
                      Altura: {evento.alturaMetros} metros • {isSeca ? 'Boa pra catar' : 'Água alta'}
                    </p>
                  </div>
                </div>

                <AudioButton
                  textoParaFalar={`${isSeca ? 'Maré seca' : 'Maré cheia'} às ${evento.horario}, com ${evento.alturaMetros} metros. ${evento.descricao}`}
                  iconeApenas
                  tamanho="pequeno"
                  className={isSeca ? '!bg-emerald-600' : '!bg-sky-600'}
                />
              </div>
            )
          })}
        </section>

        {/* Dica da Maré de Sizígia / Quadratura */}
        <div className="rounded-3xl border border-areia-200 bg-white p-4 shadow-card">
          <h3 className="font-titulo text-sm font-black text-tinta flex items-center gap-1.5">
            <span>💡</span> Segredo da Maré pra Marisqueira
          </h3>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-tinta-suave">
            Na <strong>Lua Cheia e Lua Nova</strong> (maré de sizígia), a maré seca muito e enche muito.
            É a melhor maré pra sururu e marisco na lama, mas tem que sair antes dela subir com força!
          </p>
          <div className="mt-2 text-right">
            <AudioButton
              textoParaFalar="Na lua cheia e na lua nova a maré é de sizígia. Ela seca muito e enche muito. É o melhor momento pra tirar sururu e marisco na lama funda, mas fique atenta para sair do manguezal antes da água subir rápido."
              rotulo="Ouvir Dica"
              tamanho="pequeno"
            />
          </div>
        </div>
      </div>
    </Tela>
  )
}

export default Mare