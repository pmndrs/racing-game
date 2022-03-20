import { useStore } from '../store'

import { Keys } from './Keys'

export function Help(): JSX.Element {
  const [set, help, sound] = useStore((state) => [state.set, state.help, state.sound])

  return (
    <>
      <div className={`${sound ? 'sound' : 'nosound'}`}></div>
      <div className="help">
        {!help && <button onClick={() => set({ help: true })}>i</button>}
        <div className={`popup ${help ? 'open' : ''}`}>
          <button className="popup-close" onClick={() => set({ help: false })}>
            i
          </button>
          <div className="popup-content">
            <Keys />
          </div>
        </div>
      </div>
    </>
  )
}
