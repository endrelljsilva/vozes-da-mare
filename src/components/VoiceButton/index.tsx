import type { FC } from 'react'

interface VoiceButtonProps {
  /** true enquanto o navegador está ouvindo. */
  ouvindo: boolean
  /** Motivo da indisponibilidade, se houver. */
  semSuporte?: boolean
  onClick: () => void
  /** Interrompe a escuta. Só aparece (e só existe) enquanto `ouvindo`. */
  onParar?: () => void
  tamanho?: 'normal' | 'grande'
  rotulo?: string
  /** Frase curta de quem não tem voz — vale mais que "não funciona". */
  aviso?: string
}

const Microfone = () => (
  <svg
    viewBox="0 0 24 24"
    width={30}
    height={30}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
    <path d="M12 18v3.5" />
  </svg>
)

const Parar = () => (
  <svg
    viewBox="0 0 24 24"
    width={28}
    height={28}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="6" y="6" width="12" height="12" rx="3" />
  </svg>
)

/**
 * Botão de voz — o ponto de entrada mais importante do aplicativo.
 * Alvo de 96 px, rótulo sempre visível e estado anunciado por leitores de tela.
 *
 * Quando a voz não está disponível, o botão **não some**: fica desabilitado e
 * explica o motivo logo abaixo, com o caminho para resolver. Some só o
 * desenho, nunca a informação.
 */
const VoiceButton: FC<VoiceButtonProps> = ({
  ouvindo,
  semSuporte = false,
  onClick,
  onParar,
  tamanho = 'normal',
  rotulo = 'Falar com a Maré',
  aviso,
}) => {
  const grande = tamanho === 'grande'
  const dim = grande ? 'h-24 w-24' : 'h-16 w-16'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {ouvindo && (
          <>
            <span
              className="absolute h-24 w-24 animate-ping rounded-full bg-laranja-500/25"
              aria-hidden="true"
            />
            <span
              className="absolute h-32 w-32 animate-ping rounded-full bg-laranja-500/15"
              style={{ animationDelay: '0.35s' }}
              aria-hidden="true"
            />
          </>
        )}

        {ouvindo ? (
          <button
            type="button"
            onClick={onParar}
            aria-label="Parar de ouvir"
            className={`relative flex ${dim} items-center justify-center rounded-full bg-tinta text-white shadow-card transition-transform active:scale-95`}
          >
            <Parar />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClick}
            disabled={semSuporte}
            aria-label={semSuporte ? 'Microfone indisponível' : rotulo}
            aria-pressed={ouvindo}
            className={`relative flex ${dim} items-center justify-center rounded-full bg-laranja-500 text-white shadow-botao transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-tinta-tenue disabled:shadow-none`}
          >
            <Microfone />
          </button>
        )}
      </div>

      <div className="max-w-72 text-center" role="status" aria-live="polite">
        <p className="text-base font-bold text-tinta">
          {ouvindo ? 'Estou ouvindo…' : semSuporte ? 'Voz indisponível aqui' : rotulo}
        </p>

        {!semSuporte && !ouvindo && (
          <p className="text-[11px] font-semibold text-tinta-suave">Toque e fale</p>
        )}

        {semSuporte && aviso && (
          <p className="mt-1.5 text-[12px] leading-relaxed font-semibold text-laranja-700">
            {aviso}
          </p>
        )}
      </div>
    </div>
  )
}

export default VoiceButton
