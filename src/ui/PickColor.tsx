import { HexColorPicker } from 'react-colorful'
import { setState, useStore } from '../store'
import { useToggle } from '../useToggle'

export function PickColor(): JSX.Element {
  const [color, pickcolor] = useStore((state) => [state.color, state.pickcolor])

  const setColor = (color: string) => setState({ color })
  const close = () => setState({ pickcolor: false })

  const ToggledColorPicker = useToggle(HexColorPicker, 'pickcolor')

  return (
    <div className={`pickcolor popup ${pickcolor ? 'open' : ''}`}>
      <button className="popup-close" onClick={close}>
        P
      </button>
      <div className="pickcolor-container popup-content">
        <ToggledColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  )
}
