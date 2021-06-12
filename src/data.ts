import { createClient } from '@supabase/supabase-js'

const config = {
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzMyMTAxOCwiZXhwIjoxOTM4ODk3MDE4fQ.YISggSEzSk6WsMNkvN2a5MHYWBVjQ84nHwWYne9sTA0',
  url: 'https://tfvnrohsjcgsekfnggks.supabase.co',
}

const key = (import.meta as any).env['VITE_SUPABASE_ANON_KEY'] || config.key
const url = (import.meta as any).env['VITE_SUPABASE_URL'] || config.url

const client = createClient(url, key)

export interface Score {
  time: number;
  name: string;
}
export const getScores = (limit = 50) =>
  client
    .from('scores')
    .select()
    .limit(limit)
    .order('time')
    .then<Score[]>(({ data }) => data as Score[])

export const insertScore = ({ time, name }: Score) =>
  client
    .from('scores')
    .insert({ time, name })
    .then(({ data }) => data)
