export interface TideEvent {
  type: 'high' | 'low'
  time: string
  height_m: number
  source: string
}

export interface TideStation {
  id: string
  name: string
  lat: number
  lon: number
  source: string
}

export interface TideProvider {
  name: string
  isDemo: boolean
  supportsLocation: (lat: number, lon: number) => boolean
  getNextTides: (
    lat: number,
    lon: number,
    days: number,
    signal?: AbortSignal,
  ) => Promise<TideEvent[]>
  getStation?: (lat: number, lon: number) => Promise<TideStation | null>
  getAttribution: () => string
}
