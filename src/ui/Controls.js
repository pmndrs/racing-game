import { useState } from 'react'

const controlOptions = [
  {
    key: '↑ | w',
    action: 'forward'
  },
  {
    key: '← | a',
    action: 'left'
  },
  {
    key: '→ | d',
    action: 'right'
  },
  {
    key: '↓ | s',
    action: 'backward'
  },
  {
    key: 'space',
    action: 'drift'
  },
  {
    key: 'r',
    action: 'reset'
  }
]

export function Controls() {
  const [open, setOpen] = useState(true)

  return (
    <div className="controls">
      {!open && <button onClick={() => setOpen(true)}>i</button>}
      <div className={`popup ${open ? 'open' : ''}`}>
        <button className="popup-close" onClick={() => setOpen(false)}>x</button>
        <div className="popup-content">
          {controlOptions.map(({key, action}) => (
            <div className="popup-item" key={`control-item-${key}`}>
              <div>{action}</div>
              <div style={{ fontFamily: 'monospace' }}>{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
