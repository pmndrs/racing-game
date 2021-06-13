import { useBox } from '@react-three/cannon'
import { mutation, useStore } from '../store'

export function Goal({ start = false, args = [1, 1, 1], ...props }) {
  const set = useStore((state) => state.set)
  const onCollide = () => {
    if (start) {
      mutation.start = Date.now()
      mutation.finish = 0
    } else {
      mutation.finish = Date.now()
      const time = !mutation.start && !mutation.finish ? 0 : mutation.finish ? mutation.finish - mutation.start : Date.now() - mutation.start
      set({ finished: time })
    }
  }
  useBox(() => ({ isTrigger: true, args, userData: { trigger: true }, onCollide, ...props }), undefined, [args, props])
  return null
}
