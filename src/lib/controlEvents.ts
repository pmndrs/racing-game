import { controlConfig, controlFunctions } from './controlConfig'

interface KeyMap {
  action: (pressed: boolean) => void
  up?: boolean
  pressed?: boolean
}

export const parseActionConfig = () =>
  controlConfig.reduce<{ [actionValue: string]: KeyMap }>((out, { actionValues, actionType, up = true }) => {
    actionValues.forEach(
      (actionValue) =>
        (out[actionValue] = {
          action: controlFunctions[actionType],
          pressed: false,
          up,
        }),
    )
    return out
  }, {})

export function downHandler(event: KeyboardEvent | TouchEvent, actionMap: any) {
  let actionType
  if (event instanceof TouchEvent) {
    const target = event.target as HTMLButtonElement
    actionType = target.value
  } else {
    actionType = event.key
  }

  if (!actionMap[actionType]) return

  const { action, pressed, up } = actionMap[actionType]
  actionMap[actionType].pressed = true
  if (up || !pressed) action(true)
}

export function upHandler(event: KeyboardEvent | TouchEvent, actionMap: any) {
  let actionType
  if (event instanceof TouchEvent) {
    const target = event.target as HTMLButtonElement
    actionType = target.value
  } else {
    actionType = event.key
  }

  if (!actionMap[actionType]) return

  const { action, pressed, up } = actionMap[actionType]
  actionMap[actionType].pressed = false
  if (up || !pressed) action(false)
}
