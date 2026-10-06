import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

let client: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient | null => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return null
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  }
  return client
}
