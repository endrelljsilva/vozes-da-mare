import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWeather } from '../services/weather/WeatherService'
import type { WeatherReport } from '../types/weather'

export interface LeituraClima {
  /** Última leitura que deu certo. `null` só antes da primeira resposta. */
  report: WeatherReport | null
  /** Existe uma busca em andamento agora. */
  carregando: boolean
  /** A última busca falhou — pode haver ou não uma leitura antiga. */
  falhou: boolean
  /** true só na primeira carga, quando ainda não há nada na tela. */
  primeiraCarga: boolean
  /** Pede uma releitura com o cache do navegador quebrado. */
  atualizar: () => void
}

/**
 * Leitura do clima compartilhada pelas telas que precisam dela.
 *
 * Antes, Clima, Riscos e Saúde carregavam o céu cada um com seu próprio
 * efeito — três cópias da mesma lógica de carregamento, erro e releitura.
 * Aqui ela mora num lugar só.
 *
 * Uma decisão que vem junto: **a releitura não limpa a tela**. A leitura
 * anterior continua visível com o horário dela enquanto a nova chega; se a
 * nova falhar, `falhou` fica `true` e a tela avisa que o dado é anterior.
 * Vazio na tela a cada releitura seria pior do que um número velho com a hora
 * ao lado — e o §17 pede honestidade sobre a origem do número.
 */
export const useLeituraClima = (): LeituraClima => {
  const [report, setReport] = useState<WeatherReport | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [falhou, setFalhou] = useState(false)
  const [tentativa, setTentativa] = useState(0)

  // Depois da primeira releitura forçada, continuar quebrando o cache é
  // inofensivo e mais simples que tentar lembrar se o usuário já apertou.
  const forcar = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    fetchWeather(controller.signal, forcar.current)
      .then((dados) => {
        setReport(dados)
        setFalhou(false)
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setFalhou(true)
      })
      .finally(() => setCarregando(false))

    return () => controller.abort()
  }, [tentativa])

  const atualizar = useCallback(() => {
    forcar.current = true
    setCarregando(true)
    setTentativa((t) => t + 1)
  }, [])

  return {
    report,
    carregando,
    falhou,
    primeiraCarga: carregando && report === null,
    atualizar,
  }
}