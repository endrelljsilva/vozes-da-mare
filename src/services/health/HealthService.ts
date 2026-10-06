import { getSupabase } from '../../lib/supabase'
import { localHealthUnits } from '../../data/healthUnits'
import type { HealthUnit } from '../../types/healthUnit'

interface HealthUnitRow {
  id: string
  name: string
  type: string
  address: string
  phone?: string | null
  latitude: number
  longitude: number
  opening_hours?: string | null
}

const mapRow = (row: HealthUnitRow): HealthUnit => ({
  id: String(row.id),
  name: row.name,
  type: row.type,
  address: row.address,
  phone: row.phone ?? undefined,
  openingHours: row.opening_hours ?? undefined,
  latitude: row.latitude,
  longitude: row.longitude,
})

export const fetchHealthUnits = async (): Promise<{ units: HealthUnit[]; source: string }> => {
  const supabase = getSupabase()
  if (!supabase) {
    return { units: localHealthUnits, source: 'Dados locais (Supabase não configurado)' }
  }
  try {
    const { data, error } = await supabase.from('health_units').select('*').order('name')
    if (error || !data || data.length === 0) {
      return { units: localHealthUnits, source: 'Dados locais (Supabase indisponível)' }
    }
    return { units: (data as HealthUnitRow[]).map(mapRow), source: 'Supabase' }
  } catch {
    return { units: localHealthUnits, source: 'Dados locais (sem conexão)' }
  }
}
