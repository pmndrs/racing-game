import { useBox } from '@react-three/cannon'
import { mutation, gameState } from '../store'

export function Goal({ start, args = [1, 1, 1], ...props }) {
  const onCollide = () => {
    if (start) {
      mutation.start = Date.now()
      mutation.finish = 0
    } else {
      mutation.finish = Date.now()
      const time = !mutation.start && !mutation.finish ? 0 : mutation.finish ? mutation.finish - mutation.start : Date.now() - mutation.start
      gameState.finished = time
    }
  }
  useBox(() => ({ isTrigger: true, args, userData: { trigger: true }, onCollide, ...props }), undefined, [args, props])
  return null
}
