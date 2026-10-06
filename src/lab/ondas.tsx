/**
 * Laboratório das ondas do rodapé (uso interno da equipe).
 * Mostra a faixa em duas larguras e imprime as medidas do SVG — se o desenho
 * não aparecer, dá para ver na hora se o problema é tamanho, posição ou caminho.
 * Não faz parte do aplicativo publicado.
 */
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Ondas from '../components/illustrations/Ondas'

const Faixa = ({
  largura,
  altura,
  rotulo,
}: {
  largura: number
  altura: number
  rotulo: string
}) => (
  <div style={{ padding: '14px 0' }}>
    <p style={{ fontSize: 12, fontWeight: 700, color: '#22414F', margin: '0 0 4px 14px' }}>
      {rotulo}
    </p>
    <div style={{ width: largura, height: 300, background: '#FBEAD6', position: 'relative' }}>
      {/* `left/right` explícitos: `insetX` é classe do Tailwind, não
          propriedade de estilo — usá-la aqui deixaria a div com largura 0. */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <Ondas altura={altura} />
      </div>
    </div>
  </div>
)

const App = () => {
  const [medida, setMedida] = useState('medindo…')

  useEffect(() => {
    const t = setTimeout(() => {
      const svgs = Array.from(document.querySelectorAll('svg'))
      const caixa = svgs[0]?.getBoundingClientRect()
      const caminho = svgs[0]?.querySelector('path')?.getAttribute('d') ?? '(sem path)'
      setMedida(
        [
          `svgs na pagina: ${svgs.length}`,
          `primeiro svg: ${caixa ? `${Math.round(caixa.width)}x${Math.round(caixa.height)}` : 'sem caixa'}`,
          `caminho (inicio): ${caminho.slice(0, 64)}`,
        ].join('\n'),
      )
    }, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <Faixa largura={430} altura={84} rotulo="celular 430px · 84px" />
      <Faixa largura={780} altura={110} rotulo="tablet 780px · 110px" />
      <pre
        style={{
          fontSize: 11,
          background: '#fff',
          padding: 10,
          whiteSpace: 'pre-wrap',
          borderRadius: 8,
          margin: 12,
        }}
      >
        {medida}
      </pre>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
