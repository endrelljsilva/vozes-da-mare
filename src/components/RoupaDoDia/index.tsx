import type { FC } from 'react'
import Glifo from '../illustrations/Glifo'
import type { SugestaoRoupa } from '../../types/clothing'

const rotulos: Record<SugestaoRoupa['itens'][number]['motivo'], string> = {
  frio: 'Frio',
  calor: 'Calor',
  sol: 'Sol',
  chuva: 'Chuva',
  vento: 'Vento',
  mao: 'Mãos e braços',
  pe: 'Pés',
}

/**
 * "O que vestir hoje" (§12).
 *
 * Recebe a sugestão já calculada — este componente não decide nada, só
 * desenha. Cada item mostra **por que** ele entrou na lista hoje, sempre
 * citando o número do céu, para a pessoa conferir no aplicativo do clima.
 */
const RoupaDoDia: FC<{ sugestao: SugestaoRoupa | null; baixadoEm?: string }> = ({
  sugestao,
  baixadoEm,
}) => {
  if (!sugestao) {
    return (
      <p className="rounded-2xl border border-areia-200 bg-areia-50 px-4 py-4 text-[13px] font-semibold text-tinta-suave">
        Para montar a lista de roupa, precisamos do clima de hoje. Tente atualizar em instantes.
      </p>
    )
  }

  const essenciais = sugestao.itens.filter((i) => i.essencial)
  // Complementares: os dois últimos só quando o dia pede mesmo.
  const extras = sugestao.itens.filter((i) => !i.essencial)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Glifo nome="sol" size={30} />
        <div className="min-w-0 flex-1">
          <h3 className="font-titulo text-base leading-tight font-bold text-tinta">
            {sugestao.resumo}
          </h3>
          <p className="mt-0.5 text-[12px] font-semibold text-tinta-suave">
            Sensação de {Math.round(sugestao.temperaturaAparenteC)}°
            {baixadoEm ? ` · baixada às ${baixadoEm}` : ''}
          </p>
        </div>
      </div>

      <p className="rounded-2xl bg-mare-100 px-3.5 py-3 text-[13px] leading-relaxed font-semibold text-tinta">
        <strong>Roupa de base:</strong> {sugestao.base}
      </p>

      {essenciais.length > 0 && (
        <ul className="flex flex-col gap-2.5">
          {essenciais.map((item) => (
            <li key={`${item.motivo}-${item.titulo}`} className="flex items-start gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-areia-100"
                aria-hidden="true"
              >
                <Glifo nome={item.glifo} size={24} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] leading-tight font-bold text-tinta">{item.titulo}</p>
                <p className="text-[12px] leading-snug font-semibold text-tinta-suave">
                  {item.porque}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {extras.length > 0 && (
        <details className="rounded-2xl border border-areia-200 bg-areia-50 px-3.5 py-3">
          <summary className="cursor-pointer text-[13px] font-bold text-tinta">
            Leve também, se estiver na bolsa ({extras.length})
          </summary>
          <ul className="mt-3 flex flex-col gap-2.5">
            {extras.map((item) => (
              <li key={`${item.motivo}-${item.titulo}`} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  <Glifo nome={item.glifo} size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] leading-tight font-bold text-tinta">{item.titulo}</p>
                  <p className="text-[12px] leading-snug font-semibold text-tinta-suave">
                    <span className="text-tinta-tenue">{rotulos[item.motivo]}:</span> {item.porque}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

export default RoupaDoDia