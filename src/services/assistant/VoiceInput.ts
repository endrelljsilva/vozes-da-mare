/**
 * Reconhecimento de voz — Web Speech API do navegador.
 *
 * Três restrições que precisam ser explicadas à usuária, porque nenhuma delas
 * aparece como erro bonito — todas as falhas são silenciosas:
 *
 *  1. **Só funciona em contexto seguro.** Em `http://` num IP da rede (por
 *     exemplo `http://192.168.0.110:5173`) o navegador bloqueia o microfone sem
 *     aviso. Só `https://` ou `localhost` funcionam.
 *  2. **A permissão precisa ser concedida.** O app pede o microfone com uma
 *     explicação antes de iniciar, senão a usuária recusa sem saber o motivo.
 *  3. **O reconhecimento do Chrome envia o áudio para servidores do Google.**
 *     Sem internet ele falha com `network` — e isso é justamente o cenário de
 *     quem vive onde a internet cai.
 *
 * Por isso `diagnosticar()` existe: devolve o motivo real da falha, em vez de
 * uma mensagem genérica que não ajuda ninguém a resolver.
 */

type CodigoErro =
  | 'not-allowed'
  | 'service-not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'aborted'
  | 'language-not-supported'

export type Motivo =
  'ok' | 'sem-navegador' | 'sem-https' | 'sem-microfone' | 'sem-permissao' | 'indisponivel'

export interface Diagnostico {
  podeUsar: boolean
  motivo: Motivo
  /** Mensagem curta, em português, com o que fazer — nunca jargão técnico. */
  mensagem: string
}

interface ResultadoVoz {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>
  resultIndex: number
}

interface Reconhecimento {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: ResultadoVoz) => void) | null
  onerror: ((event: { error?: string; message?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type ConstrutorReconhecimento = new () => Reconhecimento

const getRecognition = (): ConstrutorReconhecimento | null => {
  // Sem `window` (SSR, testes, ou navegador muito antigo) tratamos como não suportado.
  if (typeof window === 'undefined') return null
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ??
    w.webkitSpeechRecognition ??
    null) as ConstrutorReconhecimento | null
}

const semNavegador: Diagnostico = {
  podeUsar: false,
  motivo: 'sem-navegador',
  mensagem:
    'Este navegador não tem reconhecimento de voz. Os botões abaixo respondem às mesmas perguntas.',
}

const semHttps: Diagnostico = {
  podeUsar: false,
  motivo: 'sem-https',
  mensagem:
    'O microfone só funciona em conexão segura. Abra o app por um endereço https:// (ou por localhost). Enquanto isso, use os botões abaixo.',
}

const semMicrofone: Diagnostico = {
  podeUsar: false,
  motivo: 'sem-microfone',
  mensagem: 'Não encontramos um microfone neste aparelho. Os botões abaixo funcionam igual.',
}

const semPermissao: Diagnostico = {
  podeUsar: false,
  motivo: 'sem-permissao',
  mensagem:
    'O microfone está bloqueado. Abra o menu do navegador, procure "microfone" e permita o uso neste site. Enquanto isso, use os botões abaixo.',
}

const semInternet: Diagnostico = {
  podeUsar: false,
  motivo: 'indisponivel',
  mensagem:
    'O reconhecimento de voz precisa de internet. Conecte-se e tente de novo — ou use os botões abaixo.',
}

export const ok: Diagnostico = { podeUsar: true, motivo: 'ok', mensagem: '' }

/**
 * Verifica o que é possível *sem* pedir permissão ao usuário.
 * Seguro para chamar no carregamento da tela.
 */
export const diagnosticar = (): Diagnostico => {
  if (typeof window === 'undefined') return semNavegador
  if (!getRecognition()) return semNavegador

  // A Web Speech API só existe em HTTPS ou localhost. Fora disso, `start()`
  // falha sem mensagem útil.
  if (window.isSecureContext === false) return semHttps

  if (!navigator.mediaDevices?.getUserMedia) return semMicrofone

  return ok
}

/** Atalho usado antes, por compatibilidade com chamadas antigas. */
export const isVoiceInputSupported = (): boolean => diagnosticar().podeUsar

/**
 * Pede a autorização do microfone com uma explicação antes do pedido.
 * Devolve o diagnóstico já com a resposta do navegador.
 *
 * A permissão é conferida com `getUserMedia` e o stream é **desligado na
 * mesma hora**: serve só para descobrir se o navegador autoriza. Pedir
 * permissão com `SpeechRecognition` direto é mais rápido, mas aí a usuária
 * recebe um prompt sem contexto e recusa sem saber por quê.
 */
export const pedirPermissao = async (): Promise<Diagnostico> => {
  const base = diagnosticar()
  if (!base.podeUsar) return base

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
    return ok
  } catch (erro) {
    const nome = (erro as { name?: string })?.name
    if (nome === 'NotFoundError' || nome === 'OverconstrainedError') return semMicrofone
    return semPermissao
  }
}

/** Traduz o código de erro do navegador para uma ação concreta. */
const explicarErro = (codigo?: string): Diagnostico => {
  switch (codigo as CodigoErro) {
    case 'not-allowed':
    case 'service-not-allowed':
      return semPermissao
    case 'no-speech':
      return {
        podeUsar: false,
        motivo: 'indisponivel',
        mensagem:
          'Não ouvi nada dessa vez. Tente de novo, falando um pouco mais perto do microfone.',
      }
    case 'audio-capture':
      return {
        podeUsar: false,
        motivo: 'indisponivel',
        mensagem:
          'Não consegui acessar o microfone. Feche outros aplicativos que estejam usando a câmera ou o áudio e tente de novo.',
      }
    case 'network':
      return semInternet
    case 'language-not-supported':
      return {
        podeUsar: false,
        motivo: 'indisponivel',
        mensagem: 'Este navegador não reconhece português. Os botões abaixo funcionam igual.',
      }
    default:
      return {
        podeUsar: false,
        motivo: 'indisponivel',
        mensagem: 'Não consegui ouvir. Tente de novo — ou use os botões abaixo.',
      }
  }
}

export interface OpcoesOuvir {
  /** `final` é false enquanto a pessoa ainda fala — mostra que está funcionando. */
  aoTexto: (texto: string, final: boolean) => void
  aoErro: (mensagem: string) => void
  aoEncerrar: () => void
}

export interface SessaoVoz {
  /** Interrompe a escuta. Sem isso não há como cancelar pelo botão. */
  parar: () => void
}

/**
 * Escuta uma frase. Retorna imediatamente a sessão para que a tela possa
 * interromper — antes não havia como parar uma escuta já iniciada.
 */
export const listenOnce = ({ aoTexto, aoErro, aoEncerrar }: OpcoesOuvir): SessaoVoz => {
  const Recognition = getRecognition()
  if (!Recognition) {
    aoErro(semNavegador.mensagem)
    aoEncerrar()
    return { parar: () => undefined }
  }

  const base = diagnosticar()
  if (!base.podeUsar) {
    aoErro(base.mensagem)
    aoEncerrar()
    return { parar: () => undefined }
  }

  const recognition = new Recognition()
  recognition.lang = 'pt-BR'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const resultado = event.results[event.resultIndex]
    if (!resultado) return
    aoTexto(resultado[0].transcript, resultado.isFinal)
  }

  recognition.onerror = (event) => {
    // `aborted` é o cancelamento esperado quando a usuária toca em "Parar".
    if (event.error === 'aborted') return
    aoErro(explicarErro(event.error).mensagem)
  }

  recognition.onend = aoEncerrar

  try {
    recognition.start()
  } catch {
    aoErro('Não consegui iniciar a escuta. Tente de novo — ou use os botões abaixo.')
    aoEncerrar()
  }

  return {
    parar: () => {
      try {
        recognition.abort()
      } catch {
        recognition.stop()
      }
    },
  }
}
