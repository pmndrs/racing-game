import { createClient } from '@supabase/supabase-js'
import type { Provider } from '@supabase/supabase-js'
import type { Setter } from './store'

export interface IScore {
  name: string
  time: number
  id?: number
}

const { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } = import.meta.env

const config = {
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzMyMTAxOCwiZXhwIjoxOTM4ODk3MDE4fQ.YISggSEzSk6WsMNkvN2a5MHYWBVjQ84nHwWYne9sTA0',
  url: 'https://tfvnrohsjcgsekfnggks.supabase.co',
}

const isString = (v: unknown): v is string => typeof v === 'string'

const key = isString(VITE_SUPABASE_URL) ? VITE_SUPABASE_URL : config.key
const url = isString(VITE_SUPABASE_ANON_KEY) ? VITE_SUPABASE_ANON_KEY : config.url

const client = createClient(url, key)

export const getScores = (limit = 50): PromiseLike<IScore[] | null> =>
  client
    .from('scores')
    .select()
    .limit(limit)
    .order('time')
    .then(({ data }) => data)

export const insertScore = ({ time, name }: IScore): PromiseLike<IScore[] | null> =>
  client
    .from('scores')
    .insert({ time, name })
    .then(({ data }) => data)

export const setupSession = (set: Setter) => {
  set({ session: client.auth.session() })

  client.auth.onAuthStateChange((_event, session) => {
    set({ session })
  })
}

export const authenticateUser = (provider: Provider) => client.auth.signIn({ provider })

export const unAuthenticateUser = () => client.auth.signOut()
