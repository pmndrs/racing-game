import { useBox } from '@react-three/cannon'

import type { BoxProps } from '@react-three/cannon'

export function Goal({ args = [1, 1, 1], ...props }: BoxProps): null {
  useBox(() => ({ isTrigger: true, args, userData: { trigger: true }, ...props }), undefined, [args, props])
  return null
}
