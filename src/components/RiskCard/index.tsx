import type { FC } from 'react'
import type { RiskAssessment } from '../../types/risk'
import { riskCategories, riskLevelMeta } from '../../types/risk'
import Glifo, { type GlifoNome } from '../illustrations/Glifo'

/** Cada categoria de risco tem um ícone desenhado — não emoji solto. */
const icones: Record<string, GlifoNome> = {
  sun: 'sol-forte',
  rain: 'chuva',
  wind: 'vento',
  lightning: 'risco',
  tide: 'canal',
  current: 'canal',
  animals: 'peixe',
  injuries: 'risco',
  dehydration: 'umidade',
}

const tons: Record<RiskAssessment['level'], { card: string; selo: string }> = {
  low: { card: 'border-seguro/45 bg-seguro-suave', selo: 'bg-seguro text-white' },
  attention: { card: 'border-atencao/60 bg-atencao-suave', selo: 'bg-atencao text-tinta' },
  high: { card: 'border-perigo/55 bg-perigo-suave', selo: 'bg-perigo text-white' },
  'sem-dados': { card: 'border-areia-300 bg-areia-50', selo: 'bg-tinta-tenue text-white' },
}

/**
 * Card grande de risco (§13): ícone, nível com nome e uma frase de orientação.
 * O nível aparece como texto **e** como cor, para quem não distingue cores.
 */
const RiskCard: FC<{ assessment: RiskAssessment }> = ({ assessment }) => {
  const categoria = riskCategories.find((c) => c.id === assessment.categoryId)
  if (!categoria) return null

  const meta = riskLevelMeta[assessment.level]
  const tom = tons[assessment.level]

  return (
    <article className={`flex h-full flex-col gap-2.5 rounded-3xl border-2 p-4 ${tom.card}`}>
      <div className="flex items-start justify-between gap-2">
        <Glifo nome={icones[categoria.id] ?? 'risco'} size={34} />
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${tom.selo}`}
        >
          {meta.emoji} {meta.label}
        </span>
      </div>

      <h3 className="font-titulo text-[15px] leading-tight font-bold text-tinta">
        {categoria.label}
      </h3>
      <p className="text-[12px] leading-snug font-semibold text-tinta-suave">
        {assessment.message}
      </p>
    </article>
  )
}

export default RiskCard
