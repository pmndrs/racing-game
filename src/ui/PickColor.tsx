import { HexColorPicker } from 'react-colorful'
import { setState, useStore } from '../store'

export function PickColor(): JSX.Element {
  const setColor = (color: string) => setState({ color })
  const [color, pickcolor] = useStore((state) => [state.color, state.pickcolor])
  const close = () => setState({ pickcolor: false })

  return (
    <div className={`pickcolor popup ${pickcolor ? 'open' : ''}`}>
      <button className="popup-close" onClick={close}>
        P
      </button>
      <div className="pickcolor-container popup-content">
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  )
}
