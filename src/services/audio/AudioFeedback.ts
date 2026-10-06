/**
 * Sistema de Áudio e Fala para Acessibilidade Total (Audio-First)
 * Voltado para marisqueiras com baixa escolaridade e analfabetismo funcional.
 *
 * Inclui:
 * 1. Web Audio API para efeitos táteis sonoros nativos (clique d'água, concha, sino, erro)
 * 2. Web Speech API com busca inteligente e prioritária de vozes em pt-BR naturais
 * 3. Leitor instantâneo de interface (qualquer texto ou card pode ser lido imediatamente)
 */

class AudioFeedbackService {
  private audioCtx: AudioContext | null = null
  private vozesCarregadas = false
  private vozSelecionada: SpeechSynthesisVoice | null = null
  private estaFalando = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices()
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume()
    }
    return this.audioCtx
  }

  private initVoices(): void {
    if (!('speechSynthesis' in window)) return

    const carregar = () => {
      const vozes = window.speechSynthesis.getVoices()
      if (vozes.length > 0) {
        this.vozesCarregadas = true
        this.vozSelecionada = this.encontrarMelhorVoz(vozes)
      }
    }

    carregar()
    if (!this.vozesCarregadas) {
      window.speechSynthesis.onvoiceschanged = carregar
    }
  }

  private encontrarMelhorVoz(vozes: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // 1. Vozes pt-BR de alta qualidade conhecidas (Google, Microsoft, Natural)
    const brasileiraNatural = vozes.find((v) => {
      const lang = normalizar(v.lang).replace('_', '-')
      const nome = normalizar(v.name)
      return (
        lang === 'pt-br' &&
        (nome.includes('natural') || nome.includes('google') || nome.includes('francisca') || nome.includes('luciana') || nome.includes('antonio'))
      )
    })
    if (brasileiraNatural) return brasileiraNatural

    // 2. Qualquer voz estritamente pt-BR
    const qualquerPtBr = vozes.find((v) => normalizar(v.lang).replace('_', '-') === 'pt-br')
    if (qualquerPtBr) return qualquerPtBr

    // 3. Qualquer voz que contenha Brasil ou Português no nome
    const brasilNome = vozes.find((v) => {
      const n = normalizar(v.name)
      return n.includes('brasil') || n.includes('brazil') || (n.includes('portugues') && !n.includes('portugal'))
    })
    if (brasilNome) return brasilNome

    // 4. Qualquer português
    const qualquerPt = vozes.find((v) => normalizar(v.lang).startsWith('pt'))
    if (qualquerPt) return qualquerPt

    return null
  }

  /** Toca um som suave de gota d'água ao tocar na tela */
  tocarCliqueAgua(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // Frequência modulada imitando gota d'água caindo na maré
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // Ignora erro em navegadores que bloqueiam áudio sem interação
    }
  }

  /** Toca um sino aconchegante ao iniciar a fala ou microfone */
  tocarAberturaMicrofone(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime) // Lá
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.08) // Mi

      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } catch {
      // Ignora erro
    }
  }

  /** Toca som de aviso suave para situações de atenção/perigo */
  tocarAviso(): void {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.setValueAtTime(260, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch {
      // Ignora erro
    }
  }

  /** Fala um texto em voz alta com clareza, ritmo pausado e acolhedor */
  falar(texto: string, aoTerminar?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (aoTerminar) aoTerminar()
      return false
    }

    try {
      window.speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(texto)
      utter.lang = 'pt-BR'
      // 0.88x: ritmo cadenciado e compreensível em ambientes com vento ou ruído do mangue
      utter.rate = 0.88
      utter.pitch = 1.05 // tom acolhedor feminino amigável

      if (!this.vozSelecionada) {
        this.initVoices()
      }
      if (this.vozSelecionada) {
        utter.voice = this.vozSelecionada
      }

      this.estaFalando = true

      utter.onend = () => {
        this.estaFalando = false
        if (aoTerminar) aoTerminar()
      }

      utter.onerror = () => {
        this.estaFalando = false
        if (aoTerminar) aoTerminar()
      }

      window.speechSynthesis.speak(utter)
      return true
    } catch {
      this.estaFalando = false
      if (aoTerminar) aoTerminar()
      return false
    }
  }

  pararFala(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    this.estaFalando = false
  }

  isFalando(): boolean {
    return this.estaFalando
  }
}

export const audioFeedback = new AudioFeedbackService()
