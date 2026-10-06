import type { FC } from 'react'
import type { Fish } from '../../types/fish'
import Glifo from '../illustrations/Glifo'

/**
 * Card ilustrado de uma espécie (§12).
 * A ilustração é sempre a mesma — um peixe em perfil, no traço da marca —
 * porque o desenho communicates "isto é um peixe" antes de qualquer texto.
 */
const FishCard: FC<{ fish: Fish }> = ({ fish }) => (
  <article className="overflow-hidden rounded-3xl border border-areia-200 bg-white shadow-card">
    <div className="flex items-center gap-4 bg-gradient-to-r from-mare-100 to-areia-50 px-4 py-4">
      <span
        className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/80"
        aria-hidden="true"
      >
        <Glifo nome="peixe" size={54} />
      </span>
      <div className="min-w-0">
        <h3 className="font-titulo text-xl leading-tight font-bold text-tinta">{fish.name}</h3>
        <p className="truncate text-[12px] font-semibold text-tinta-suave italic">
          {fish.scientificName}
        </p>
      </div>
    </div>

    <div className="px-4 py-4">
      <p className="text-[14px] leading-relaxed font-semibold text-tinta">{fish.description}</p>

      <dl className="mt-3 flex flex-col gap-2">
        {[
          { icone: 'canal' as const, rotulo: 'Habitat', valor: fish.habitat },
          { icone: 'pesca' as const, rotulo: 'Pesca', valor: fish.fishingInfo },
        ].map((linha) => (
          <div key={linha.rotulo} className="flex items-start gap-2.5">
            <Glifo nome={linha.icone} size={20} />
            <div>
              <dt className="text-[11px] font-bold text-tinta-tenue">{linha.rotulo}</dt>
              <dd className="text-[13px] font-semibold text-tinta-suave">{linha.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  </article>
)

export default FishCard
