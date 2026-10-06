/**
 * Síntese de voz — Web Speech API.
 *
 * A Web Speech API **não tem vozes próprias**: ela usa as vozes instaladas no
 * sistema. No Windows vêm só vozes em inglês por padrão, e sem uma voz pt-BR o
 * navegador lê o português com a voz americana — foi o que aconteceu.
 *
 * Por isso `listarVozes()` e `temVozPortugues()` existem: sem elas o aplicativo
 * não tem como explicar o problema, e a usuária ouve um sotaque errado sem
 * saber por quê.
 *
 * Outro detalhe: as vozes chegam de forma assíncrona. Em alguns aparelhos
 * `getVoices()` devolve lista vazia até o evento `voiceschanged`. Por isso a
 * lista é memorizada assim que chega e `speak()` tenta de novo se a primeira
 * chamada não encontrou voz.
 */

let vozesCarregadas = false

/** Dispara quando as vozes do sistema ficarem disponíveis. */
const marcarVozesCarregadas = (): void => {
  vozesCarregadas = true
  window.speechSynthesis.addEventListener('voiceschanged', marcarVozesCarregadas, {
    once: true,
  })
}

const aoTerVozes = (): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  if (vozesCarregadas) return
  if (window.speechSynthesis.getVoices().length > 0) {
    marcarVozesCarregadas()
    return
  }
  window.speechSynthesis.addEventListener('voiceschanged', marcarVozesCarregadas, {
    once: true,
  })
}

export const temSinteseDeVoz = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

/** Todas as vozes que o aparelho oferece. */
export const listarVozes = (): SpeechSynthesisVoice[] => {
  if (!temSinteseDeVoz()) return []
  aoTerVozes()
  return window.speechSynthesis.getVoices()
}

/**
 * Voz brasileira, quando existir.
 *
 * A busca ignora o campo `lang` de propósito: algumas vozes do Windows
 * aparecem como `pt-BR` e outras trazem o nome falando "Português (Brasil)"
 * com o idioma marcado de forma inconsistente. Procurar os dois evita perder
 * uma voz boa por causa de metadado.
 */
export const vozBrasileira = (): SpeechSynthesisVoice | null => {
  const vozes = listarVozes()
  if (vozes.length === 0) return null

  const normalizar = (texto: string) => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

  const exata = vozes.find((voz) => normalizar(voz.lang).replace('_', '-') === 'pt-br')
  if (exata) return exata

  const brasileiraPeloNome = vozes.find((voz) => {
    const nome = normalizar(voz.name)
    return nome.includes('portugues') && (nome.includes('brasil') || nome.includes('brazil'))
  })
  if (brasileiraPeloNome) return brasileiraPeloNome

  const qualquerPortugues = vozes.find((voz) => normalizar(voz.lang).startsWith('pt'))
  if (qualquerPortugues) return qualquerPortugues

  return null
}

/** O aparelho tem uma voz para falar português? */
export const temVozBrasileira = (): boolean => vozBrasileira() !== null

/**
 * Como fica o sotaque sem voz pt-BR:
 * `brasileira` quando existe; `sem-pt-br` quando existe voz mas nenhuma é
 * brasileira (aí o texto sai com sotaque estranho); `mudo` quando o aparelho
 * não sintetiza nada.
 */
export type QualidadeVoz = 'brasileira' | 'sem-pt-br' | 'mudo'

export const avaliarVoz = (): QualidadeVoz => {
  if (!temSinteseDeVoz()) return 'mudo'
  if (vozBrasileira()) return 'brasileira'
  return 'sem-pt-br'
}

/**
 * Fala o texto. Devolve `false` quando o aparelho não sintetiza — a tela usa
 * isso para avisar que a resposta está só no texto, em vez de fingir que a
 * Maré falou.
 *
 * `aoTerminar` é chamado quando a fala acaba (ou falha), para a tela voltar a
 * mostrar o botão de microfone.
 */
export const speak = (texto: string, aoTerminar?: () => void): boolean => {
  if (!temSinteseDeVoz()) return false

  aoTerVozes()
  const falar = () => {
    const fala = new SpeechSynthesisUtterance(texto)
    fala.lang = 'pt-BR'
    // Um pouco mais devagar que o padrão: as usuárias ouvem em ambiente
    // aberto, com barulho de rio e vento. Leitura rápido não se ouve na beira.
    fala.rate = 0.92
    fala.pitch = 1

    const voz = vozBrasileira()
    if (voz) fala.voice = voz

    if (aoTerminar) {
      fala.onend = aoTerminar
      fala.onerror = aoTerminar
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(fala)
  }

  // As vozes podem ainda não ter chegado: tenta, e se a primeira tentativa
  // rodou sem voz alguma, repete quando o evento chegar.
  const semVozNaLista = listarVozes().length === 0
  falar()

  if (semVozNaLista) {
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) falar()
      },
      { once: true },
    )
  }

  return true
}

/** Interrompe a fala atual (usado quando a usuária começa a falar de novo). */
export const pararFala = (): void => {
  if (!temSinteseDeVoz()) return
  window.speechSynthesis.cancel()
}
