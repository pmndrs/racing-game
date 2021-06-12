import { supabase } from '../initSupabase'

export const authenticateUser = async (provider) => {
  const data = await supabase().auth.signIn({ provider })
  return data
}

export const unAuthenticateUser = async () => {
  const { error } = await supabase.auth.signOut()
  return error
}
