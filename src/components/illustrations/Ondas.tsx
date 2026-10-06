import type { FC, ReactNode } from 'react'

interface OndasProps {
  /** Altura da faixa de ondas, em px. */
  altura?: number
  className?: string
}

/**
 * Faixa de ondas do rodapé — a assinatura visual de "Vozes da Maré".
 *
 * Quatro camadas em profundidades diferentes, cada uma rolando com velocidade
 * própria: é o deslocamento relativo que cria a sensação de água. A da frente
 * leva espuma na crista e pontos de brilho.
 *
 * ── A matemática do ladrilho ─────────────────────────────────────────
 * O SVG tem `width: 200%` e rola com `translateX(-50%)`. Metade de "200% do
 * container" vale **um container inteiro**. Logo o desenho precisa se repetir
 * a cada **720 unidades** do viewBox, não a cada 1440.
 *
 * Daí saem os números: 2 segmentos por ladrilho (onda de 360 unidades, cerca
 * de 3 cristas numa tela de celular) e a amplitude alternando a cada segmento.
 * Como o par [amplitude alternada + 2 segmentos por ladrilho] fecha em 720, a
 * emenda cai sempre num ponto idêntico e não aparece degrau ao rolar.
 */
const CAMPO = 1440
const FUNDO = 260
const LADRILHO = CAMPO / 2
const SEGMENTOS = 4

const larguraDoSegmento = CAMPO / SEGMENTOS

/** Onda cheia, com o fundo fechado — para preencher. */
const caminhoCheio = (y: number, amplitude: number): string => {
  const partes = [`M0 ${y}`]

  for (let i = 0; i < SEGMENTOS; i++) {
    // Alternar a amplitude tira a simetria de "seno de régua".
    const a = amplitude * (i % 2 === 0 ? 1 : 0.82)
    partes.push(`q ${larguraDoSegmento / 4} ${-a} ${larguraDoSegmento / 2} 0`)
    partes.push(`q ${larguraDoSegmento / 4} ${a} ${larguraDoSegmento / 2} 0`)
  }

  partes.push(`V ${FUNDO} H 0 Z`)
  return partes.join(' ')
}

/** Só a linha da crista — para a espuma, sem preenchimento. */
const linhaDaCrista = (y: number, amplitude: number): string => {
  const partes = [`M0 ${y}`]

  for (let i = 0; i < SEGMENTOS; i++) {
    const a = amplitude * (i % 2 === 0 ? 1 : 0.82)
    partes.push(`q ${larguraDoSegmento / 4} ${-a} ${larguraDoSegmento / 2} 0`)
    partes.push(`q ${larguraDoSegmento / 4} ${a} ${larguraDoSegmento / 2} 0`)
  }

  return partes.join(' ')
}

interface CamadaProps {
  y: number
  amplitude: number
  /** Cor na crista. */
  corTopo: string
  /** Cor no fundo — mais funda dá volume à água. */
  corFundo: string
  /** Segundos de um ciclo completo. Menor é mais rápido. */
  duracao: number
  atraso?: number
  id: string
  children?: ReactNode
}

const Camada: FC<CamadaProps> = ({
  y,
  amplitude,
  corTopo,
  corFundo,
  duracao,
  atraso = 0,
  id,
  children,
}) => (
  <svg
    className="animate-onda"
    style={{
      // Geometria por estilo inline, e não por classe utilitária: `w-[200%]`
      // é valor arbitrário e depende da varredura do Tailwind achar a classe.
      // Se ela some, o SVG fica com 0px de largura e a onda não aparece — sem
      // erro nenhum no console. Inline não tem como falhar.
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '200%',
      height: '100%',
      animationDuration: `${duracao}s`,
      animationDelay: `-${atraso}s`,
    }}
    viewBox={`0 0 ${CAMPO} ${FUNDO}`}
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={corTopo} stopOpacity="0.95" />
        <stop offset="100%" stopColor={corFundo} />
      </linearGradient>
    </defs>
    <path d={caminhoCheio(y, amplitude)} fill={`url(#${id})`} />
    {children}
  </svg>
)

/**
 * Pontinhos de brilho acima da crista da água.
 *
 * Posições geradas dentro de **um** ladrilho (720 unidades) e repetidas na
 * segunda metade. Sortear direto por 1440 faria a concentração de brilho não
 * repetir junto com a onda, e os pontos "piscariam" de lugar ao rolar.
 */
const Brilhos: FC<{ y: number; amplitude: number }> = ({ y, amplitude }) => {
  const base = [0.35, 1.15, 1.75].map((pos, i) => ({
    x: pos * larguraDoSegmento,
    a: amplitude * (Math.round(pos) % 2 === 0 ? 1 : 0.82),
    dy: 7 + (i % 2) * 6,
    r: 1.8 + (i % 3) * 0.9,
  }))

  const pontos = [...base, ...base.map((p) => ({ ...p, x: p.x + LADRILHO }))]

  return (
    <g fill="#FFFFFF" opacity="0.9">
      {pontos.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={y - p.a * 0.8 - p.dy}
          r={p.r}
          className="animate-brilho"
          style={{ animationDelay: `${(i % 3) * 0.5}s` }}
        />
      ))}
    </g>
  )
}

const Ondas: FC<OndasProps> = ({ altura = 72, className = '' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none relative w-full overflow-hidden ${className}`}
    style={{ height: altura }}
  >
    {/* Brilho de horizonte: evita que a água "corte" a página com uma borda seca. */}
    <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-mare-100 via-mare-50 to-transparent" />

    <Camada
      id="onda-fundo"
      y={96}
      amplitude={28}
      corTopo="#E6F1F6"
      corFundo="#D4EAF1"
      duracao={30}
    />
    <Camada
      id="onda-meio"
      y={124}
      amplitude={22}
      corTopo="#CFE6EE"
      corFundo="#BFDDE8"
      duracao={22}
      atraso={4}
    />

    {/* Terceira camada: um fio de luz na crista, para a água "brilhar". */}
    <Camada
      id="onda-clara"
      y={150}
      amplitude={17}
      corTopo="#AED2E0"
      corFundo="#9BC9DB"
      duracao={16}
      atraso={7}
    >
      <path
        d={linhaDaCrista(150, 17)}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
    </Camada>

    {/* Frente: mais escura, com espuma e brilho. */}
    <Camada
      id="onda-frente"
      y={176}
      amplitude={12}
      corTopo="#82B6CB"
      corFundo="#6BA2B9"
      duracao={11}
      atraso={2}
    >
      <Brilhos y={176} amplitude={12} />
      <path
        d={linhaDaCrista(176, 12)}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.6"
        strokeWidth="4.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </Camada>
  </div>
)

export default Ondas
