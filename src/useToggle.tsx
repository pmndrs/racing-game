import { useStore } from './store'

import type { ComponentType, PropsWithChildren } from 'react'
import type { IState } from './store'

type IStateKey = keyof IState

export const useToggle =
  <P extends {}>(ToggledComponent: ComponentType<P>, toggle: IStateKey | IStateKey[]) =>
  (props: PropsWithChildren<P>) => {
    const keys = Array.isArray(toggle) ? toggle : [toggle]
    const values = useStore((state) => keys.map((key) => state[key]))
    return values.every((v) => !!v) ? <ToggledComponent {...props} /> : props.children ? <>{props.children}</> : null
  }
