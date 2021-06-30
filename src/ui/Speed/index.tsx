import { Boost } from './Boost'
import { Gauge } from './Gauge'
import { Text } from './Text'

export function Speed(): JSX.Element {
  return (
    <div className="speed">
      <Gauge />
      <Text />
      <Boost />
    </div>
  )
}
