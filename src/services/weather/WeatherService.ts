import type { DailyForecast, HourlyForecast, ResumoDoDia, WeatherReport } from '../../types/weather'

const ITAPISSUMA = {
  latitude: -7.665,
  longitude: -34.83,
  name: 'Itapissuma, PE',
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

interface OpenMeteoResponse {
  current?: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: (number | null)[]
    weather_code: number[]
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: (number | null)[]
    /** Índice uv máximo do dia. */
    uv_index_max?: (number | null)[]
    /** Rajada máxima do dia. */
    wind_speed_10m_max?: (number | null)[]
  }
}

/**
 * `forcarAtualizacao` quebra o cache do navegador.
 *
 * Sem isso, uma releitura dentro da janela de cache do navegador devolveria a
 * mesma leitura antiga — e num aplicativo de pesca isso é pior que_errar:
 * a usuária confia em um número velho. A Open-Meteo não manda `Cache-Control`,
 * então essa proteção não é garantida por ela.
 */
const buildUrl = (forcarAtualizacao = false): string => {
  const params = new URLSearchParams({
    latitude: String(ITAPISSUMA.latitude),
    longitude: String(ITAPISSUMA.longitude),
    timezone: 'America/Recife',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
      'wind_speed_10m_max',
    ].join(','),
    forecast_days: '7',
  })
  // Marca-hora só na releitura forçada: sem isso a URL seria idêntica e o
  // navegador poderia responder com a leitura em cache.
  if (forcarAtualizacao) params.set('_', String(Date.now()))
  return `${BASE_URL}?${params.toString()}`
}

/** Rótulo curto do código WMO. A escolha do ícone vive na camada de UI (§3). */
export const weatherCodeToLabel = (code: number): string => {
  if (code === 0) return 'Céu limpo'
  if (code <= 2) return 'Parcialmente nublado'
  if (code === 3) return 'Nublado'
  if (code <= 48) return 'Neblina'
  if (code <= 57) return 'Garoa'
  if (code <= 67) return 'Chuva'
  if (code <= 77) return 'Neve'
  if (code <= 82) return 'Pancadas de chuva'
  if (code <= 86) return 'Neve forte'
  return 'Tempestade'
}

const toHourly = (response: OpenMeteoResponse): HourlyForecast[] => {
  const hourly = response.hourly
  if (!hourly) return []
  return hourly.time.slice(0, 24).map((time, i) => ({
    time,
    temperatureC: hourly.temperature_2m[i],
    precipitationProbabilityPercent: hourly.precipitation_probability[i] ?? 0,
    weatherCode: hourly.weather_code[i],
  }))
}

const toDaily = (response: OpenMeteoResponse): DailyForecast[] => {
  const daily = response.daily
  if (!daily) return []
  return daily.time.map((date, i) => ({
    date,
    temperatureMaxC: daily.temperature_2m_max[i],
    temperatureMinC: daily.temperature_2m_min[i],
    precipitationProbabilityMaxPercent: daily.precipitation_probability_max[i] ?? 0,
    weatherCode: daily.weather_code[i],
    uvIndexMax: daily.uv_index_max?.[i] ?? null,
    windMaxKmh: daily.wind_speed_10m_max?.[i] ?? null,
  }))
}

/**
 * Resumo do primeiro dia (hoje no fuso de Itapissuma).
 * É o que a avaliação de riscos consome — por isso um resumo só, e não a
 * previsão inteira: a decisão é "como está hoje", não "como vai ficar".
 */
const toHoje = (daily: DailyForecast[]): ResumoDoDia => {
  const hoje = daily[0]
  return {
    uvIndexMax: hoje?.uvIndexMax ?? null,
    windMaxKmh: hoje?.windMaxKmh ?? null,
    precipitationProbabilityMaxPercent: hoje?.precipitationProbabilityMaxPercent ?? 0,
    temperatureMaxC: hoje?.temperatureMaxC ?? 0,
  }
}

export const fetchWeather = async (
  signal?: AbortSignal,
  forcarAtualizacao = false,
): Promise<WeatherReport> => {
  let response: Response
  try {
    response = await fetch(buildUrl(forcarAtualizacao), {
      signal,
      cache: forcarAtualizacao ? 'no-store' : 'default',
    })
  } catch {
    throw new Error('Sem conexão ou serviço indisponível.')
  }
  if (!response.ok) {
    throw new Error('Serviço de clima indisponível no momento.')
  }
  const data = (await response.json()) as OpenMeteoResponse
  if (!data.current) {
    throw new Error('Resposta de clima incompleta.')
  }
  return {
    locationName: ITAPISSUMA.name,
    current: {
      temperatureC: data.current.temperature_2m,
      feelsLikeC: data.current.apparent_temperature,
      humidityPercent: data.current.relative_humidity_2m,
      precipitationMm: data.current.precipitation,
      windKmh: data.current.wind_speed_10m,
      windDirectionDeg: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
      updatedAt: data.current.time,
    },
    hourly: toHourly(data),
    daily: toDaily(data),
    hoje: toHoje(toDaily(data)),
    source: 'Open-Meteo',
    baixadoEm: new Date().toISOString(),
  }
}
