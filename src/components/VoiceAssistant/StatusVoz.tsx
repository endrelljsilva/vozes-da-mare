import type { FC } from 'react'
import { avaliarVoz, listarVozes, type QualidadeVoz } from '../../services/assistant/VoiceOutput'

/**
 * Mostra como a Maré está "falando" e o que fazer se o sotaque estiver errado.
 *
 * A Web Speech API usa as vozes do sistema. Se não houver voz em português, o
 * navegador lê o texto com voz inglesa — e a usuária não tem como saber por
 * quê. Este cartão transforma um bug em uma instrução de dois cliques.
 */

const instrucoes: Record<
  Exclude<QualidadeVoz, 'brasileira'>,
  { titulo: string; passos: string[] }
> = {
  'sem-pt-br': {
    titulo: 'Sua voz está em inglês',
    passos: [
      'No Windows: Configurações → Hora e Idioma → Fala → Adicionar vozes → Português (Brasil).',
      'No Android: Configurações → Sistema → Idiomas e entrada → Saída de texto → instalar português.',
      'No iPhone: Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Português (Brasil).',
    ],
  },
  mudo: {
    titulo: 'Este aparelho não lê as respostas em voz',
    passos: [
      'As respostas aparecem em texto na tela, e funciona do mesmo jeito.',
      'Se quiser ouvir, verifique se o seu navegador tem a Voz do sistema ativada.',
    ],
  },
}

interface Props {
  /** Reavalia quando muda, para o cartão sumir assim que a voz é instalada. */
  aoReavaliar?: () => void
}

const StatusVoz: FC<Props> = ({ aoReavaliar }) => {
  const qualidade = avaliarVoz()

  if (qualidade === 'brasileira') {
    const nome = listarVozes().find((v) => v.lang.replace('_', '-') === 'pt-BR')?.name
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-seguro/45 bg-seguro-suave px-4 py-3 text-[13px] font-semibold text-tinta">
        <span aria-hidden="true">✅</span>
        Falando em português{nome ? ` — voz ${nome}` : ''}.
      </p>
    )
  }

  const info = instrucoes[qualidade]

  return (
    <section
      aria-label="Configuração da voz"
      className="rounded-3xl border-2 border-atencao bg-atencao-suave p-4"
    >
      <p className="flex items-center gap-2 font-titulo text-[15px] font-bold text-tinta">
        <span aria-hidden="true">🗣️</span>
        {info.titulo}
      </p>

      <ul className="mt-2.5 flex flex-col gap-1.5">
        {info.passos.map((passo) => (
          <li
            key={passo}
            className="flex gap-2 text-[12.5px] leading-snug font-semibold text-tinta"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-laranja-600"
              aria-hidden="true"
            />
            {passo}
          </li>
        ))}
      </ul>

      {aoReavaliar && (
        <button
          type="button"
          onClick={aoReavaliar}
          className="mt-3 min-h-11 rounded-full bg-white px-4 text-[13px] font-bold text-tinta shadow-card transition-colors hover:bg-areia-50 active:scale-95"
        >
          Já instalei, testar de novo
        </button>
      )}
    </section>
  )
}

export default StatusVoz
