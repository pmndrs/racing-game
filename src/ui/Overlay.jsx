import { Suspense, useEffect, useState } from 'react'
import { Footer } from '@pmndrs/branding'
import { useProgress } from '@react-three/drei'
import { Keys } from './Help'
import { useStore } from '../store'

function Ready({ setReady }) {
  useEffect(() => () => void setReady(true), [])
  return null
}

function Loader() {
  const { progress } = useProgress()
  return <div>loading {progress.toFixed()} %</div>
}

export function Overlay({ children }) {
  const [ready, setReady] = useState(false)
  const [clicked, setClicked] = useState(false)
  const set = useStore((state) => state.set)
  const isMenu = useStore((state) => state.menu)

  useEffect(() => {
    if (clicked && ready) set({ ready: true })
  }, [ready, clicked])

  return (
    <>
      <Suspense fallback={<Ready setReady={setReady} />}>{children}</Suspense>
      {isMenu && (
        <div className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}>
          <div className="stack">
            <Keys style={{ paddingBottom: 20 }} className="keys" />
            <a
              href="#"
              onClick={() => {
                if (ready) {
                  setClicked(true)
                  set({ menu: false })
                }
              }}>
              {!ready ? <Loader /> : 'Click to continue'}
            </a>
          </div>
          <Footer
            date="2. June"
            year="2021"
            link1={<a href="https://github.com/pmndrs/react-three-fiber">@react-three/fiber</a>}
            link2={<a href="https://github.com/pmndrs/racing-game">/racing-game</a>}
          />
        </div>
      )}
    </>
  )
}
