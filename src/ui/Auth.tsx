import { authenticateUser } from '../data'
import type { Provider } from '@supabase/supabase-js'

const providers: readonly {
  readonly provider: Provider
  readonly label: string
  readonly Logo: () => JSX.Element
}[] = [
  {
    provider: 'google',
    label: 'Sign in with Google',
    Logo: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 70 72">
        <path fill="#4285F4" d="m70 37-1-7H36v14h19c-1 4-3 8-7 10v9h11c7-6 11-15 11-26z" />
        <path fill="#34A853" d="M36 72c9 0 17-3 23-9l-11-9a21 21 0 0 1-32-11H4v9c6 12 18 20 32 20z" />
        <path fill="#FBBC05" d="M16 43a21 21 0 0 1 0-13V20H4a36 36 0 0 0 0 32l12-9z" />
        <path fill="#EA4335" d="M36 15c5 0 10 2 13 5l11-10A36.6 36.6 0 0 0 4 20l12 10c3-9 10-15 20-15z" />
      </svg>
    ),
  },
  {
    provider: 'github',
    label: 'Sign in with Github',
    Logo: () => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>GitHub</title>
        <path
          fill="#181717"
          d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2a4 4 0 0 1 1.3 3.2c0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"
        />
      </svg>
    ),
  },
] as const

export function Auth() {
  const signIn = async (provider: Provider) => {
    try {
      await authenticateUser(provider)
    } catch (error: any) {
      alert(error.error_description || error.message)
    }
  }

  return (
    <div>
      <h2 className="auth-header">Want to save your score?</h2>
      <div className="auth-providers">
        {providers.map(({ provider, label, Logo }, key) => (
          <button key={key} className="auth-provider" onClick={() => signIn(provider)}>
            <Logo />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
