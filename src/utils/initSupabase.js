import { createClient } from '@supabase/supabase-js'
import noop from 'lodash-es/noop'

export const supabase = () => {
  const url = import.meta.env['VITE_SUPABASE_URL']
  const key = import.meta.env['VITE_SUPABASE_ANON_KEY']
  if (!key || !url) {
    console.error('Missing Environment keys. Please join our discord to have access')
    return noop
  } else return createClient(url, key)
}
