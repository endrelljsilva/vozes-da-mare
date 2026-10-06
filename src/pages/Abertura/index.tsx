import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface AberturaProps {
  /** Chamado ao tocar "Começar" **ou** ao seguir pelo atalho de voz. */
  onEntrar: () => void
}

/**
 * Tela de abertura — o primeiro contato da usuária.
 * Logo oficial, uma frase de acolhimento e um único botão. Nada de menu.
 */
const Abertura: FC<AberturaProps> = ({ onEntrar }) => (
  <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mare-50 via-areia-50 to-areia-100 px-6 pb-24 text-center">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
      <OndasAbertura />
    </div>

    <img
      src="/logo.png"
      alt="Vozes da Maré"
      width={220}
      height={198}
      className="animate-flutuar object-contain drop-shadow-[0_8px_20px_rgba(43,76,92,0.12)]"
    />

    {/* `w-full` é obrigatório aqui: em coluna com `items-center`, um texto sem
        largura definida é medido pelo `max-content` e acaba esticando a página
        inteira num celular estreito. */}
    <h1 className="mt-7 w-full text-center font-titulo text-3xl font-bold text-tinta sm:text-4xl">
      Bem-vinda à Maré
    </h1>

    <p className="mt-3 w-full max-w-sm text-center text-[15px] leading-relaxed font-semibold text-tinta-suave">
      Clima, maré, pesca e saúde para quem vive a água de Itapissuma.
    </p>

    <button
      type="button"
      onClick={onEntrar}
      className="relative z-10 mt-10 inline-flex min-h-14 w-full max-w-xs items-center justify-center rounded-full bg-laranja-500 px-8 text-lg font-bold text-white shadow-botao transition-all hover:bg-laranja-600 active:scale-97"
    >
      Começar
    </button>

    <Link
      to="/voz"
      // Sem isto, o link trocava a URL mas a tela de abertura continuava
      // por cima — e a usuária achava que o botão estava quebrado.
      onClick={onEntrar}
      className="relative z-10 mt-4 text-sm font-bold text-mare-700 underline underline-offset-4"
    >
      Falar com a Maré
    </Link>
  </div>
)

/**
 * Cena de abertura da água: mesmas camadas e mesma espuma de `Ondas`, porém
 * paradas. Anima a logo enquanto a água fica quieta evita duas coisas se
 * brigando pelo olhar.
 */
const OndasAbertura: FC = () => (
  <svg viewBox="0 0 1440 260" className="w-full" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="abertura-fundo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E6F1F6" />
        <stop offset="100%" stopColor="#CFE6EE" />
      </linearGradient>
      <linearGradient id="abertura-frente" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#AED2E0" />
        <stop offset="100%" stopColor="#82B6CB" />
      </linearGradient>
    </defs>

    <path
      d="M0 152 q180 -38 360 4 t360 -16 t360 12 t360 -8 v116 H0 Z"
      fill="url(#abertura-fundo)"
    />
    <path d="M0 184 q180 -28 360 8 t360 -13 t360 10 t360 -6 v92 H0 Z" fill="#CFE6EE" />
    <path
      d="M0 212 q180 -24 360 6 t360 -11 t360 10 t360 -5 v64 H0 Z"
      fill="url(#abertura-frente)"
    />

    {/* espuma na crista da água da frente */}
    <path
      d="M0 212 q180 -24 360 6 t360 -11 t360 10 t360 -5"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity="0.5"
      strokeWidth="4"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)

export default Abertura
