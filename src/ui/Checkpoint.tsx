import { mutation, useStore } from '../store'

export function Checkpoint() {
  const [checkpoint1, showCheckpoint] = useStore((s) => [s.checkpoint1, s.showCheckpoint])
  return (
    <div className={`checkpoint ${showCheckpoint ? '' : 'hide'}`}>
      <p>{checkpoint1 / 1000}</p>
      <p>{mutation.checkpointDifference / 1000}</p>
    </div>
  )
}
