import { Suspense, useEffect, useState } from 'react'
import { Footer } from '@pmndrs/branding'
import { useProgress } from '@react-three/drei'
import { Keys } from './Help'
import { Auth } from './Auth'
import { useStore } from '../store'
import { setupSession, signOut } from '../data'

function Ready({ setReady }) {
  useEffect(() => () => void setReady(true), [])
  return null
}

function Loader() {
  const { progress } = useProgress()
  return <div>loading {progress.toFixed()} %</div>
}

export function Intro({ children }) {
  const [ready, setReady] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [session, set] = useStore((state) => [state.session, state.set])

  useEffect(() => {
    if (clicked && ready) set({ ready: true })
  }, [ready, clicked])

  useEffect(() => {
    setupSession(set)
  }, [])

  return (
    <>
      <Suspense fallback={<Ready setReady={setReady} />}>{children}</Suspense>
      <div className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}>
        <div className="stack">
          <div className="intro-keys">
            <Keys style={{ paddingBottom: 20 }} />
            <a className="continue-link" href="#" onClick={() => ready && setClicked(true)}>
              {!ready ? <Loader /> : 'Click to continue'}
            </a>
          </div>
          {session?.user.aud !== 'authenticated' ? (
            <Auth />
          ) : (
            <div>
              Hello {session.user.user_metadata.full_name}
              <button className="logout" onClick={signOut}>
                Logout
              </button>{' '}
            </div>
          )}
        </div>
        <Footer
          date="2. June"
          year="2021"
          link1={<a href="https://github.com/pmndrs/react-three-fiber">@react-three/fiber</a>}
          link2={<a href="https://github.com/pmndrs/racing-game">/racing-game</a>}
        />
      </div>
    </>
  )
}
