import { useStore } from './store'

import type { ComponentType } from 'react'
import type { IState } from './store'

export const useToggle =
  <P extends {}>(ToggledComponent: ComponentType<P>, toggle: keyof IState) =>
  (props: P) => {
    const value = useStore((state) => state[toggle])
    return value ? <ToggledComponent {...props} /> : null
  }
