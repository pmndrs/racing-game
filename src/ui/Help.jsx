import { useStore } from '../store'

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
  { keys: ['X'], action: 'Sfx' },
  { keys: ['I'], action: 'Help' },
]

export function Help() {
  const set = useStore((state) => state.set)
  const open = useStore((state) => state.help)
  const sfx = useStore((state) => state.controls.sfx)

  return (
    <>
      <div className={`${sfx ? 'sound' : 'nosound'}`}></div>
      <div className="controls">
        {!open && <button onClick={() => set({ help: true })}>i</button>}
        <div className={`popup ${open ? 'open' : ''}`}>
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
