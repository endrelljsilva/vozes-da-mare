import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { irParaInicio as irParaInicioPuro, registrarRota, rotaAnterior } from '../lib/historico'

export interface HistoricoInterno {
  /** Volta uma tela. Sem histórico anterior, vai para o Início. */
  voltar: () => void
  /** Vai para o Início e descarta o que ficou antes dele. */
  irParaInicio: () => void
}

/**
 * Liga a pilha de navegação interna ao router. Ver `src/lib/historico.ts`
 * para o motivo de não usarmos `navigate(-1)`.
 */
export const useHistoricoInterno = (): HistoricoInterno => {
  const { pathname } = useLocation()
  const navegar = useNavigate()

  useEffect(() => {
    registrarRota(pathname)
  }, [pathname])

  const voltar = useCallback(() => {
    navegar(rotaAnterior(pathname))
  }, [navegar, pathname])

  const irParaInicio = useCallback(() => {
    navegar(irParaInicioPuro())
  }, [navegar])

  return { voltar, irParaInicio }
}
