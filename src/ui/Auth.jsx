import { authenticateUser } from '../data'

const providers = [
  {
    provider: 'google',
    label: 'Sign in with Google',
    Logo: () => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Google</title>
        <path
          fill="#fff"
          d="M12.5 11v3.2h7.8a7 7 0 0 1-1.8 4.1 8 8 0 0 1-6 2.4c-4.8 0-8.6-3.9-8.6-8.7a8.6 8.6 0 0 1 14.5-6.4l2.3-2.3C18.7 1.4 16 0 12.5 0 5.9 0 .3 5.4.3 12S6 24 12.5 24a11 11 0 0 0 8.4-3.4c2.1-2.1 2.8-5.2 2.8-7.6 0-.8 0-1.5-.2-2h-11z"
        />
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
          fill="#fff"
          d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2a4 4 0 0 1 1.3 3.2c0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"
        />
      </svg>
    ),
  },
]

export function Auth() {
  const signIn = async (provider) => {
    try {
      await authenticateUser(provider)
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  return (
    <div>
      <h2 className="auth-header">Want to save your score?</h2>
      <div className="auth-providers">
        {providers.map(({ provider, label, Logo }) => (
          <button key={provider} className="auth-provider" onClick={() => signIn(provider)}>
            <Logo />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
