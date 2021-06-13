import { Suspense, useEffect, useState } from 'react'
import { Footer } from '@pmndrs/branding'
import { useProgress } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { Keys } from './Help'
import { Auth } from './Auth'
import { gameState } from '../store'
import { setupSession } from '../data'

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
  const { session } = useSnapshot(gameState)

  useEffect(() => {
    if (clicked && ready) {
      gameState.ready = true
    }
  }, [ready, clicked])

  useEffect(() => {
    setupSession((nextSession) => {
      gameState.session = nextSession
    })
  }, [])

  return (
    <>
      <Suspense fallback={<Ready setReady={setReady} />}>{children}</Suspense>
      <div className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}>
        <div className="stack">
          <Keys style={{ paddingBottom: 20 }} />
          <a href="#" onClick={() => ready && setClicked(true)}>
            {!ready ? <Loader /> : 'Click to continue'}
          </a>
          {session?.user.aud !== 'authenticated' && <Auth />}
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
