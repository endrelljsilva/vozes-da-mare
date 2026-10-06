/**
 * Página de laboratório da personagem (uso interno da equipe).
 * Existe para inspecionar as seis expressões lado a lado em qualquer tamanho
 * durante o ajuste do desenho. Não faz parte do aplicativo publicado.
 */
import { createRoot } from 'react-dom/client'
import { createElement, type FC } from 'react'
import '../index.css'
import Personagem from '../components/Character/Personagem'
import type { Expression } from '../components/Character/types'

const expressoes: Expression[] = ['feliz', 'normal', 'atencao', 'risco', 'saude', 'falando']

const Celula: FC<{ expression: Expression; size: number }> = ({ expression, size }) =>
  createElement(
    'div',
    { style: { textAlign: 'center' } },
    createElement(Personagem, {
      expression,
      size,
      comCelular: expression === 'falando',
    }),
    createElement(
      'div',
      { style: { fontSize: 12, fontWeight: 700, color: '#22414F' } },
      expression,
    ),
  )

createRoot(document.getElementById('root')!).render(
  createElement(
    'div',
    null,
    createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
      ...expressoes.map((e) => createElement(Celula, { key: `g-${e}`, expression: e, size: 210 })),
    ),
    createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 } },
      ...expressoes.map((e) => createElement(Celula, { key: `p-${e}`, expression: e, size: 100 })),
    ),
  ),
)
