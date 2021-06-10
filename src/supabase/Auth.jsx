import { useState } from 'react'
import { supabase } from './supabaseClient'
import googleLogo from '../icons/google-logo.png'
import githubLogo from '../icons/github-logo.png'

const providers = [
  {
    provider: 'goggle',
    label: 'Sign in with Google',
    logo: googleLogo,
  },
  {
    provider: 'github',
    label: 'Sign in with Github',
    logo: githubLogo,
  },
]

export function Auth() {
  const [loading, setLoading] = useState(false)

  const signIn = async (provider) => {
    try {
      setLoading(true)
      await supabase.auth.signIn({ provider })
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <h1 className="auth-header">@pmndrs/racing-game</h1>
      <div className="auth-providers">
        {loading ? (
          <span>Loading</span>
        ) : (
          providers.map(({ provider, label, logo }) => (
            <button key={provider} className="auth-provider" onClick={() => signIn(provider)}>
              <img src={logo} />
              <span>{label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
