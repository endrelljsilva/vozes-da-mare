import { getSupabase } from '../../lib/supabase'
import { localFish } from '../../data/fish'
import type { Fish } from '../../types/fish'

interface FishRow {
  id: string
  name: string
  scientific_name: string
  description: string
  habitat: string
  fishing_information: string
  image_url?: string | null
}

const mapRow = (row: FishRow): Fish => ({
  id: String(row.id),
  name: row.name,
  scientificName: row.scientific_name,
  description: row.description,
  habitat: row.habitat,
  fishingInfo: row.fishing_information,
  imageUrl: row.image_url ?? undefined,
})

export const fetchFish = async (): Promise<{ fish: Fish[]; source: string }> => {
  const supabase = getSupabase()
  if (!supabase) {
    return { fish: localFish, source: 'Dados locais (Supabase não configurado)' }
  }
  try {
    const { data, error } = await supabase.from('fish').select('*').order('name')
    if (error || !data || data.length === 0) {
      return { fish: localFish, source: 'Dados locais (Supabase indisponível)' }
    }
    return { fish: (data as FishRow[]).map(mapRow), source: 'Supabase' }
  } catch {
    return { fish: localFish, source: 'Dados locais (sem conexão)' }
  }
}
