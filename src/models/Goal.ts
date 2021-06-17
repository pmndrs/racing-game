import { useBox } from '@react-three/cannon'
import { mutation, useStore } from '../store'

import type { BoxProps } from '@react-three/cannon'

interface GoalProps extends BoxProps {
  which: 'finish' | 'start'
}

export function Goal({ which, args = [1, 1, 1], ...props }: GoalProps): null {
  const set = useStore((state) => state.set)
  const onCollide = () => {
    if (which === 'start') {
      mutation.start = Date.now()
      mutation.finish = 0
    }
    if (which === 'finish' && mutation.start && !mutation.finish) {
      mutation.finish = Date.now()
      set({ finished: mutation.finish - mutation.start })
    }
  }
  useBox(() => ({ isTrigger: true, args, userData: { trigger: true }, onCollide, ...props }), undefined, [args, props])
  return null
}
