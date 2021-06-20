import { mutation, useStore } from '../store'

const formatCheckpointDifference = (diffMs: number, negative: boolean) => {
  return `${!negative ? '+' : ''}${diffMs / 1000}`
}

export function Checkpoint() {
  const [showCheckpoint] = useStore((s) => [s.showCheckpoint])
  const improved = mutation.checkpointDifference < 0

  return (
    <div className={`checkpoint ${showCheckpoint ? '' : 'hide'}`}>
      <p>{mutation.tempCheckpoint1 / 1000}</p>
      <p className={improved ? 'green' : 'red'}>{formatCheckpointDifference(mutation.checkpointDifference, improved)}</p>
    </div>
  )
}
