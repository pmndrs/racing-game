import { supabase } from '../initSupabase'

export const getLeaderBoardData = async (limit = 50) => {
  const { data: leaderboardData } = await supabase().from('scores').select().limit(limit).order('time')

  return leaderboardData
}

export const insertTime = async ({ time, name }) => {
  const { data } = await supabase().from('scores').insert({
    time,
    name,
  })

  return data
}
