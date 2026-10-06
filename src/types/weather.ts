export interface CurrentWeather {
  temperatureC: number
  feelsLikeC: number
  humidityPercent: number
  precipitationMm: number
  windKmh: number
  windDirectionDeg: number
  weatherCode: number
  /** Hora da observação, no fuso de Itapissuma. Não é a hora do download. */
  updatedAt: string
}

export interface HourlyForecast {
  time: string
  temperatureC: number
  precipitationProbabilityPercent: number
  weatherCode: number
}

export interface DailyForecast {
  date: string
  temperatureMaxC: number
  temperatureMinC: number
  precipitationProbabilityMaxPercent: number
  weatherCode: number
  /** Índice uv máximo do dia — é o que dá sentido ao alerta de sol. */
  uvIndexMax: number | null
  /** Rajada máxima do dia, em km/h. */
  windMaxKmh: number | null
}

/** Resumo do dia de hoje, que alimenta a avaliação de riscos. */
export interface ResumoDoDia {
  uvIndexMax: number | null
  windMaxKmh: number | null
  precipitationProbabilityMaxPercent: number
  temperatureMaxC: number
}

export interface WeatherReport {
  locationName: string
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  hoje: ResumoDoDia
  source: string
  /** Momento em que esta leitura foi baixada (não a hora da observação). */
  baixadoEm: string
}
