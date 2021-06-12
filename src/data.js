import { createClient } from '@supabase/supabase-js'

const config = {
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzMyMTAxOCwiZXhwIjoxOTM4ODk3MDE4fQ.YISggSEzSk6WsMNkvN2a5MHYWBVjQ84nHwWYne9sTA0',
  url: 'https://tfvnrohsjcgsekfnggks.supabase.co',
}

const key = import.meta.env['VITE_SUPABASE_ANON_KEY'] || config.key
const url = import.meta.env['VITE_SUPABASE_URL'] || config.url

export const client = createClient(url, key)

export const getScores = (limit = 50) =>
  client
    .from('scores')
    .select()
    .limit(limit)
    .order('time')
    .then(({ data }) => data)

export const insertScore = ({ time, name }) =>
  client
    .from('scores')
    .insert({ time, name })
    .then(({ data }) => data)

export const authenticateUser = async (provider) => {
  const data = await client.auth.signIn({ provider })
  return data
}

export const unAuthenticateUser = async () => {
  const { error } = client.auth.signOut()
  return error
}
