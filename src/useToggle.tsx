import { useStore } from './store'

import type { ComponentType, PropsWithChildren } from 'react'
import type { IState } from './store'

export const useToggle =
  <P extends {}>(ToggledComponent: ComponentType<P>, toggle: keyof IState) =>
  (props: PropsWithChildren<P>) => {
    const value = useStore((state) => state[toggle])
    return value ? <ToggledComponent {...props} /> : props.children ? <>{props.children}</> : null
  }
