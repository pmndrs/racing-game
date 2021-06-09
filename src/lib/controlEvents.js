import { controlConfig, controlFunctions } from './controlConfig'

export const parseActionConfig = () =>
  controlConfig.reduce((out, { actionValues, actionType, up = true }) => {
    actionValues.forEach((actionValue) => (out[actionValue] = { action: controlFunctions[actionType], pressed: false, up }))
    return out
  }, {})

export function downHandler(event, actionMap) {
  const actionType = event.target.value ? event.target.value : event.key

  if (!actionMap[actionType]) return

  const { action, pressed, up } = actionMap[actionType]
  actionMap[actionType].pressed = true
  if (up || !pressed) action(true)
}

export function upHandler(event, actionMap) {
  const actionType = event.target.value ? event.target.value : event.key

  if (!actionMap[actionType]) return

  const { action, pressed, up } = actionMap[actionType]
  actionMap[actionType].pressed = false
  if (up || !pressed) action(false)
}
