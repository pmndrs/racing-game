import type { HTMLAttributes } from 'react'

import { useStore } from '../store'

const controlOptions = [
  { keys: ['↑', 'W', 'Z'], action: 'Forward' },
  { keys: ['←', 'A', 'Q'], action: 'Left' },
  { keys: ['→', 'D'], action: 'Right' },
  { keys: ['↓', 'S'], action: 'Backward' },
  { keys: ['Space'], action: 'Drift' },
  { keys: ['Shift'], action: 'Turbo Boost' },
  { keys: ['H'], action: 'Honk' },
  { keys: ['M'], action: 'Map' },
  { keys: ['C'], action: 'Toggle Camera' },
  { keys: ['R'], action: 'Reset' },
  { keys: ['.'], action: 'Editor' },
  { keys: ['U'], action: 'Toggle Mute' },
  { keys: ['I'], action: 'Help' },
  { keys: ['L'], action: 'Leaderboards' },
]

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

export function Keys(props: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div {...props}>
      {controlOptions.map(({ keys, action }) => (
        <div className="popup-item" key={action}>
          <div>{action}</div>
          <div className="popup-item-keys">
            {keys.map((key) => (
              <span className="popup-item-key" key={key}>
                <span>{key}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
