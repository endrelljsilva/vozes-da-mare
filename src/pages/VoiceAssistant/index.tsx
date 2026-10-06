import { useState, useRef, useEffect, useCallback, type FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import { DonaMareAvatar } from '../../components/DonaMareAvatar'
import { AudioButton } from '../../components/AudioButton'
import { audioFeedback } from '../../services/audio/AudioFeedback'
import { criarAssistente } from '../../services/assistant/AssistantEngine'

interface MensagemConversa {
  autor: 'marisqueira' | 'dona_mare'
  texto: string
}

const PERGUNTAS_RAPIDAS = [
  'A maré tá secando agora?',
  'Que horas a maré fica mais seca?',
  'Posso mariscar hoje?',
  'O que fazer se pisar em arraia?',
  'Cortei o pé na ostra, o que faço?',
  'Vai chover hoje no mangue?',
  'Que roupa vestir pra mariscar?',
]

const VoiceAssistant: FC = () => {
  const [ouvindo, setOuvindo] = useState(false)
  const [pensando, setPensando] = useState(false)
  const [textoOuvido, setTextoOuvido] = useState('')
  const [ultimaResposta, setUltimaResposta] = useState(
    'Oi, minha querida! Aperte o microfone grande abaixo e me faça sua pergunta falando!',
  )
  const [historico, setHistorico] = useState<MensagemConversa[]>([])
  const [erro, setErro] = useState('')
  const [microfoneBloqueado, setMicrofoneBloqueado] = useState(false)

  const recognitionRef = useRef<any>(null)
  const assistente = useRef(criarAssistente()).current

  const responder = useCallback(
    async (perguntaTexto: string) => {
      setPensando(true)
      setErro('')

      try {
        const resposta = await assistente.perguntar(perguntaTexto)
        setUltimaResposta(resposta)
        setHistorico((prev) => [
          ...prev,
          { autor: 'marisqueira', texto: perguntaTexto },
          { autor: 'dona_mare', texto: resposta },
        ])
        setPensando(false)
        audioFeedback.falar(resposta)
      } catch {
        const falha = 'Não consegui responder agora, tente de novo em instantes!'
        setUltimaResposta(falha)
        setPensando(false)
        audioFeedback.falar(falha)
      }
    },
    [assistente],
  )

  const iniciarEscuta = async () => {
    audioFeedback.pararFala()
    setErro('')
    setTextoOuvido('')
    setMicrofoneBloqueado(false)

    // 1. Tentar solicitar permissão explicitamente via getUserMedia primeiro
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Sucesso: fecha as tracks para liberar o microfone para o reconhecimento de fala
        stream.getTracks().forEach((t) => t.stop())
      } catch (err: any) {
        setMicrofoneBloqueado(true)
        setErro(
          'O microfone está bloqueado pelo navegador. Veja as instruções abaixo para desbloquear.',
        )
        audioFeedback.tocarAviso()
        return
      }
    }

    const SpeechClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechClass) {
      setErro('Seu navegador não suporta microfone. Use as perguntas prontas abaixo!')
      audioFeedback.tocarAviso()
      return
    }

    try {
      audioFeedback.tocarAberturaMicrofone()
      const rec = new SpeechClass()
      rec.lang = 'pt-BR'
      rec.interimResults = true
      rec.continuous = false

      rec.onstart = () => {
        setOuvindo(true)
      }

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('')
        setTextoOuvido(transcript)

        if (event.results[0].isFinal) {
          rec.stop()
          setOuvindo(false)
          void responder(transcript)
        }
      }

      rec.onerror = (e: any) => {
        setOuvindo(false)
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setMicrofoneBloqueado(true)
          setErro(
            'O microfone está bloqueado no seu navegador. Siga os passos abaixo para permitir.',
          )
        } else if (e.error === 'no-speech') {
          setErro('Não ouvi nada. Toque no microfone e fale perto do celular!')
        } else {
          setErro('Não consegui ouvir. Tente tocar novamente no microfone!')
        }
      }

      rec.onend = () => {
        setOuvindo(false)
      }

      recognitionRef.current = rec
      rec.start()
    } catch {
      setOuvindo(false)
      setErro('Não consegui ligar o microfone. Toque em uma pergunta pronta abaixo!')
    }
  }

  const pararEscuta = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setOuvindo(false)
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      audioFeedback.pararFala()
    }
  }, [])

  return (
    <Tela>
      <Topo titulo="Falar com a Maré" />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 pt-4">
        {/* Avatar grande e expressivo da Dona Maré */}
        <div className="flex flex-col items-center">
          <DonaMareAvatar fala={ultimaResposta} tamanho={140} />
        </div>

        {/* Botão de Repetir Fala Atual */}
        <div className="flex justify-center">
          <AudioButton
            textoParaFalar={ultimaResposta}
            rotulo="Ouvir Resposta de Novo"
            tamanho="medio"
            className="!bg-white !text-tinta border border-areia-300 shadow-md font-black"
          />
        </div>

        {/* BOTÃO GIGANTE DE MICROFONE (Foco Central para Analfabetas) */}
        <div className="flex flex-col items-center justify-center my-2">
          <button
            type="button"
            onClick={ouvindo ? pararEscuta : () => void iniciarEscuta()}
            disabled={pensando}
            aria-label={ouvindo ? 'Parar de ouvir' : 'Toque para falar no microfone'}
            className={`group relative flex h-28 w-28 items-center justify-center rounded-full transition-all active:scale-90 shadow-2xl ${
              ouvindo
                ? 'bg-rose-600 ring-8 ring-rose-300 animate-pulse'
                : pensando
                  ? 'bg-amber-500 ring-4 ring-amber-300 animate-spin'
                  : 'bg-gradient-to-tr from-laranja-600 to-amber-500 hover:scale-105 ring-8 ring-amber-200'
            }`}
          >
            <span className="text-5xl drop-shadow">
              {ouvindo ? '⏹️' : pensando ? '⏳' : '🎙️'}
            </span>
          </button>

          <p className="mt-3 font-titulo text-base font-black text-tinta text-center">
            {ouvindo
              ? 'Estou ouvindo... Fale agora!'
              : pensando
                ? 'Deixa eu pensar...'
                : 'TOQUE NO MICROFONE E PERGUNTE'}
          </p>

          {textoOuvido && (
            <p className="mt-1 rounded-2xl bg-white border border-areia-200 px-4 py-2 text-sm font-bold text-mare-800 shadow-sm max-w-xs text-center">
              "{textoOuvido}"
            </p>
          )}

          {erro && (
            <p className="mt-2 rounded-2xl bg-rose-50 border border-rose-300 px-4 py-2 text-xs font-bold text-rose-800 text-center">
              {erro}
            </p>
          )}
        </div>

        {/* Guia Visual e Audível de Como Desbloquear o Microfone se estiver bloqueado */}
        {microfoneBloqueado && (
          <div className="rounded-3xl border-2 border-amber-400 bg-amber-50 p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔓</span>
                <h3 className="font-titulo text-base font-black text-amber-900">
                  Como Desbloquear o Microfone
                </h3>
              </div>
              <AudioButton
                textoParaFalar="Se o microfone estiver bloqueado, faça o seguinte: No alto da tela do navegador, clique no ícone do cadeado ou configurações ao lado do link do site. Depois toque em Permissões, procure Microfone e mude para Permitir. Depois toque no botão verde para tentar de novo."
                rotulo="Ouvir Ajuda"
                tamanho="pequeno"
              />
            </div>

            <ol className="mt-3 flex flex-col gap-2.5 text-xs font-bold text-amber-950">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[11px] font-black">
                  1
                </span>
                <span>
                  No topo da tela do navegador, toque no <strong>ícone do cadeado 🔒</strong> ou configurações ao lado do endereço do site.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[11px] font-black">
                  2
                </span>
                <span>
                  Toque em <strong>Permissões</strong> ou <strong>Configurações do site</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[11px] font-black">
                  3
                </span>
                <span>
                  Encontre a opção <strong>Microfone</strong> e marque <strong>Permitir</strong>.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => void iniciarEscuta()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md hover:bg-emerald-700 active:scale-95"
            >
              🔄 Tentar Ligar o Microfone Novamente
            </button>
          </div>
        )}

        {/* Atalhos Rápidos com Áudio: Toque em qualquer pergunta frequente */}
        <section aria-label="Perguntas rápidas sugeridas" className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-titulo text-sm font-black text-tinta flex items-center gap-1.5">
              <span>💬</span> Ou toque numa pergunta pronta:
            </h2>
            <span className="text-[11px] font-bold text-tinta-suave">Responde por voz</span>
          </div>

          <div className="flex flex-col gap-2">
            {PERGUNTAS_RAPIDAS.map((pergunta) => (
              <button
                key={pergunta}
                type="button"
                onClick={() => void responder(pergunta)}
                className="flex items-center justify-between rounded-2xl border-2 border-areia-200 bg-white p-3.5 text-left shadow-sm hover:border-mare-300 hover:bg-mare-50/50 transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌊</span>
                  <span className="font-titulo text-sm font-black text-tinta">{pergunta}</span>
                </div>
                <span className="text-xs font-bold text-mare-700 shrink-0">Ouvir 🔊</span>
              </button>
            ))}
          </div>
        </section>

        {/* Histórico Recente de Conversa */}
        {historico.length > 0 && (
          <section aria-label="Histórico da conversa" className="mt-2 flex flex-col gap-3">
            <h3 className="font-titulo text-xs font-black uppercase tracking-wider text-tinta-suave px-1">
              Conversa Recente
            </h3>
            {historico.slice(-4).map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.autor === 'marisqueira' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-3.5 text-xs font-bold shadow-sm ${
                    msg.autor === 'marisqueira'
                      ? 'bg-mare-600 text-white rounded-br-none'
                      : 'bg-white text-tinta border border-areia-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-[10px] uppercase font-black opacity-75 mb-0.5">
                    {msg.autor === 'marisqueira' ? 'Você perguntou:' : 'Dona Maré respondeu:'}
                  </p>
                  {msg.texto}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </Tela>
  )
}

export default VoiceAssistant