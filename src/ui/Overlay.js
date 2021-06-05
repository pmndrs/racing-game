import { Suspense, useEffect, useState } from 'react'
import { Footer } from '@pmndrs/branding'
import { useProgress, Html } from '@react-three/drei'
import { Keys } from './Help'
import { useStore } from '../store'

function Ready({ setReady }) {
  const { progress } = useProgress();
  return (
    <>
      <div
        className="fullscreen"
        style={{
          backgroundImage: 'url(/graphics/loadingscreen.png)',
          backgroundSize: 'cover',
        }}>
        <div className="loading-title">
          <h1>POIMANDRES RACING GAME</h1>
          <h2>{progress}%</h2>
        </div>
      </div>
    </>
  )
}

export function Overlay({ children }) {
  const [clicked, setClicked] = useState(false)
  const set = useStore((state) => state.set)

  useEffect(() => {
    if (clicked) set({ ready: true })
  }, [clicked])

  return (
    <>
      <Suspense fallback={<Ready />}>{children}</Suspense>
      <div className={`fullscreen bg ready ${clicked && 'clicked'}`}>
        <div className="stack">
          <Keys style={{ paddingBottom: 20 }} />
          <a href="#" onClick={() => setClicked(true)}>
            Click to continue
          </a>
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
