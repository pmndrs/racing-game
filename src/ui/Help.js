import { useState } from 'react'

const controlOptions = [
  { keys: ['↑', 'W'], action: 'Forward' },
  { keys: ['←', 'A'], action: 'Left' },
  { keys: ['→', 'D'], action: 'Right' },
  { keys: ['↓', 'S'], action: 'Backward' },
  { keys: ['space'], action: 'Drift' },
  { keys: ['H'], action: 'Honk' },
  { keys: ['Shift'], action: 'Turbo Boost' },
  { keys: ['C'], action: 'Toggle Camera' },
  { keys: ['R'], action: 'Reset' },
]

export function Help() {
  const [open, setOpen] = useState(false)
  return (
    <div className="controls">
      {!open && <button onClick={() => setOpen(true)}>i</button>}
      <div className={`popup ${open ? 'open' : ''}`}>
        <button className="popup-close" onClick={() => setOpen(false)}>
          x
        </button>
        <div className="popup-content">
          <Keys />
        </div>
      </div>
    </div>
  )
}

export function Keys(props) {
  return (
    <div {...props}>
      {controlOptions.map(({ keys, action }) => (
        <div className="popup-item" key={action}>
          <div>{action}</div>
          <div>
            {keys.map((key) => (
              <span className="popup-item-key" key={key}>
                {key}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
