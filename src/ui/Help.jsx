import { useSnapshot } from 'valtio'
import { gameState } from '../store'

const controlOptions = [
  { keys: ['↑', 'W'], action: 'Forward' },
  { keys: ['←', 'A'], action: 'Left' },
  { keys: ['→', 'D'], action: 'Right' },
  { keys: ['↓', 'S'], action: 'Backward' },
  { keys: ['Space'], action: 'Drift' },
  { keys: ['Shift'], action: 'Turbo Boost' },
  { keys: ['H'], action: 'Honk' },
  { keys: ['M'], action: 'Map' },
  { keys: ['C'], action: 'Toggle Camera' },
  { keys: ['R'], action: 'Reset' },
  { keys: ['E'], action: 'Editor' },
  { keys: ['U'], action: 'Toggle Mute' },
  { keys: ['I'], action: 'Help' },
  { keys: ['L'], action: 'Leaderboards' },
]

export function Help() {
  const { help, sound } = useSnapshot(gameState)
  return (
    <>
      <div className={`${sound ? 'sound' : 'nosound'}`}></div>
      <div className="controls">
        {!help && <button onClick={() => void (gameState.help = true)}>i</button>}
        <div className={`popup ${help ? 'open' : ''}`}>
          <button className="popup-close" onClick={() => void (gameState.help = false)}>
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

export function Keys(props) {
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
