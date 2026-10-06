import type { FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import Character from '../../components/Character'
import RiskCard from '../../components/RiskCard'
import Glifo from '../../components/illustrations/Glifo'
import { assessRisks, alertaPrincipal, piorRisco } from '../../services/risks/RiskService'
import { useLeituraClima } from '../../hooks/useLeituraClima'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { riskLevelMeta } from '../../types/risk'
import type { Expression } from '../../components/Character/types'

const formatarHora = (iso: string): string => iso.slice(11, 16)

/** Expressão da personagem a partir do pior risco **com dado**. */
const expressaoDoDia = (pior: ReturnType<typeof piorRisco>): Expression => {
  if (pior === 'high') return 'risco'
  if (pior === 'attention') return 'atencao'
  if (pior === 'sem-dados') return 'normal'
  return 'feliz'
}

const fraseDoDia = (
  pior: ReturnType<typeof piorRisco>,
  alerta: ReturnType<typeof alertaPrincipal>,
  carregando: boolean,
): string => {
  if (carregando) return 'Vou olhar o céu para você…'
  if (pior === 'sem-dados') return 'Ainda não consegui o clima de hoje.'
  if (!alerta) return 'Nada levantou alerta no céu agora. Ainda assim, fique atenta.'
  if (pior === 'high') return `Hoje pisa leve: ${alerta.message}`
  return `Um ponto de atenção: ${alerta.message}`
}

/**
 * Central de riscos (§13).
 *
 * Todos os níveis vêm da leitura real do clima do dia. Onde não existe fonte
 * verificada (maré, correnteza), o cartão diz "sem dados" — não um nível
 * inventado para a tela parecer completa.
 */
const Riscos: FC = () => {
  const status = useOnlineStatus()
  // Mesma leitura que Clima e Saúde usam — uma fonte só para o céu.
  const { report, carregando, falhou, atualizar } = useLeituraClima()


  const avaliacoes = assessRisks(report)
  const pior = piorRisco(avaliacoes)
  const alerta = alertaPrincipal(avaliacoes)

  return (
    <Tela>
      <Topo titulo="Riscos" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 pt-5">
        <Character
          expression={expressaoDoDia(pior)}
          size={132}
          fala={fraseDoDia(pior, alerta, carregando)}
        />

        {/* De onde vieram os números — e como pedir leitura nova. */}
        <div className="flex items-center gap-3 rounded-2xl border border-areia-200 bg-white px-4 py-3 shadow-card">
          <Glifo nome={pior === 'high' ? 'risco' : 'sol'} size={24} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-tinta">
              {carregando
                ? 'Lendo o céu…'
                : report
                  ? `Previsão de Itapissuma · baixada às ${formatarHora(report.baixadoEm)}`
                  : 'Sem leitura do céu'}
            </p>
            {report && (
              <p className="text-[11px] font-semibold text-tinta-suave">Fonte: {report.source}</p>
            )}
          </div>
          <button
            type="button"
            onClick={atualizar}
            disabled={carregando}
            className="min-h-11 shrink-0 rounded-full bg-mare-400 px-4 text-[13px] font-bold text-white transition-colors hover:bg-mare-500 active:scale-95 disabled:opacity-60"
          >
            {carregando ? '…' : 'Atualizar'}
          </button>
        </div>

        {falhou && (
          <p className="rounded-2xl border border-atencao/60 bg-atencao-suave px-4 py-3 text-[13px] font-semibold text-tinta">
            {status === 'online'
              ? 'Não conseguimos atualizar o clima agora. Os riscos abaixo ficam sem dados até a leitura voltar.'
              : 'Você está offline. Os números abaixo são da última leitura que deu certo.'}
          </p>
        )}

        {/* Legenda: não depende só de cor — cada nível tem nome e símbolo. */}
        <section
          aria-labelledby="legenda-risco"
          className="rounded-3xl border border-areia-200 bg-white p-4 shadow-card"
        >
          <h2 id="legenda-risco" className="font-titulo text-base font-bold text-tinta">
            Como ler
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {(['low', 'attention', 'high', 'sem-dados'] as const).map((nivel) => (
              <li key={nivel} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">
                  {riskLevelMeta[nivel].emoji}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-tinta">{riskLevelMeta[nivel].label}</p>
                  <p className="text-[12px] font-semibold text-tinta-suave">
                    {riskLevelMeta[nivel].tone}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {avaliacoes.map((avaliacao) => (
            <li key={avaliacao.categoryId}>
              <RiskCard assessment={avaliacao} />
            </li>
          ))}
        </ul>

        <p className="rounded-2xl bg-mare-100 px-4 py-3 text-[12px] leading-relaxed font-semibold text-tinta">
          Isto é <strong>previsão do tempo</strong>, não medição dentro do rio. Nenhum aplicativo
          prevê correnteza e maré com certeza — para isso, quem conhece a água da região. Em
          tempestade, o caminho seguro é ficar em casa.
        </p>
      </div>
    </Tela>
  )
}

export default Riscos
