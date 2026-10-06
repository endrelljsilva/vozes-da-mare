export type MapPointType =
  'fishing_point' | 'river' | 'mangrove' | 'health' | 'risk' | 'boat_point' | 'other'

export interface MapPoint {
  id: string
  name: string
  type: MapPointType
  description?: string
  latitude: number
  longitude: number
}

export const mapPointTypeMeta: Record<MapPointType, { label: string; emoji: string }> = {
  fishing_point: { label: 'Ponto de pesca', emoji: '🐟' },
  river: { label: 'Rios / Canais', emoji: '🌊' },
  mangrove: { label: 'Mangue', emoji: '🌳' },
  health: { label: 'Posto de saúde', emoji: '🏥' },
  risk: { label: 'Área de risco', emoji: '⚠️' },
  boat_point: { label: 'Ponto de embarque', emoji: '⚓' },
  other: { label: 'Outro', emoji: '📍' },
}
