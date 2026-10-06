import { fetchWeather, weatherCodeToLabel } from '../weather/WeatherService'
import { detectarIntencao, type Intent } from './intents'

export { detectarIntencao }

export class AssistantEngine {
  private cacheWeather: { data: Awaited<ReturnType<typeof fetchWeather>>; time: number } | null = null
  private _ultimoAssunto: Intent | null = null

  get assuntoAtual(): Intent | null {
    return this._ultimoAssunto
  }

  private async getWeather() {
    const agora = Date.now()
    if (this.cacheWeather && agora - this.cacheWeather.time < 60000) {
      return this.cacheWeather.data
    }
    const data = await fetchWeather()
    this.cacheWeather = { data, time: agora }
    return data
  }

  async perguntar(pergunta: string): Promise<string> {
    const intent = detectarIntencao(pergunta)
    this._ultimoAssunto = intent !== 'desconhecido' ? intent : this._ultimoAssunto

    switch (intent) {
      case 'saudacao':
        return 'Oi, companheira de maré! Sou a Dona Maré. Pode me perguntar da água, do tempo ou de cuidados no mangue!'

      case 'agradecimento':
        return 'De nada, de coração! Vá com Deus, boa mariscagem e volte em segurança!'

      case 'despedida':
        return 'Até logo, pescadora! Se cuide no mangue e qualquer dúvida é só chamar!'

      case 'capacidade':
        return 'Posso falar sobre o clima de hoje, vento, peixes da região, riscos no mangue, roupa recomendada e postos de saúde de Itapissuma.'

      case 'pescar_agora': {
        const horaAtual = new Date().getHours()
        const isNoite = horaAtual >= 18 || horaAtual < 5
        const isFimDeTarde = horaAtual >= 17 && horaAtual < 18

        if (isNoite) {
          return 'Atenção, companheira! Já está de noite e não é um bom horário para pescar nem mariscar. No escuro o manguezal é muito perigoso. Prefira não sair agora.'
        }
        if (isFimDeTarde) {
          return 'Fique atenta: já está no fim de tarde e o sol vai se pôr logo. Não é seguro continuar no manguezal no escuro. Prefira não sair agora.'
        }

        try {
          const clima = await this.getWeather()
          const ventoForte = clima.current.windKmh >= 28
          const tempestade = clima.current.weatherCode >= 95
          const chovendo = clima.current.precipitationMm > 0

          if (tempestade || ventoForte) {
            return 'Com esse vento forte e risco de tempo ruim, prefira não sair hoje para pescar.'
          }
          if (chovendo) {
            return 'Está molhado: leve uma capa ou guarda-chuva se for sair para o mangue.'
          }
          return `O vento está tranquilo com ${Math.round(clima.current.temperatureC)} graus. As condições estão favoráveis para a pescaria hoje.`
        } catch {
          return 'Não consegui buscar o clima agora por falta de conexão. Tente novamente mais tarde.'
        }
      }

      case 'mare':
        return 'Ainda não tenho dados de maré confiáveis de estação oficial para Itapissuma. Na tela da maré do aplicativo você pode ver a estimativa astronômica do dia.'

      case 'clima': {
        try {
          const clima = await this.getWeather()
          const condicao = weatherCodeToLabel(clima.current.weatherCode).toLowerCase()
          return `Em Itapissuma está ${condicao}, com ${Math.round(clima.current.temperatureC)} graus. Vento tranquilo a ${Math.round(clima.current.windKmh)} quilômetros por hora.`
        } catch {
          return 'Não consegui buscar a previsão agora por problema de conexão. Tente em instantes.'
        }
      }

      case 'peixes':
        return 'No Canal de Santa Cruz dá carapicu, tainha, robalo, camurim, além de sururu e marisco na maré seca.'

      case 'sintoma':
      case 'saude':
        return 'Não faço diagnóstico médico. Se estiver sentindo dor, coceira ou ferida, procure uma avaliação na unidade de saúde mais próxima.'

      case 'unidade':
        return 'Em Itapissuma temos a UBS Central no Centro da cidade e o Hospital Municipal. Para urgências, chame o SAMU no 192.'

      case 'risco':
        return 'Fique atenta ao vento forte, pedras escorregadias, conchas de ostra cortantes e raios se o céu fechar.'

      case 'roupa':
        return 'Recomendamos usar camisa de manga comprida, calça comprida, chapéu ou boné e botina ou sapato fechado para o mangue.'

      case 'local':
        return 'O município de Itapissuma tem o Canal de Santa Cruz, manguezais e pontos de pesca artesanal. Veja no mapa do app.'

      default:
        return 'Ainda não sei responder a essa pergunta. Mas posso falar sobre clima, vento, peixes da região, riscos e postos de saúde de Itapissuma.'
    }
  }
}

export const criarAssistente = () => new AssistantEngine()

export const answer = async (pergunta: string): Promise<string> => {
  const engine = criarAssistente()
  return engine.perguntar(pergunta)
}