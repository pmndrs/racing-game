import { mutation, useStore } from '../store'

const formatCheckpointDifference = (diffMs: number, negative: boolean) => {
  return `${!negative ? '+' : ''}${diffMs / 1000}`
}

export function Checkpoint() {
  const [checkpoint1, showCheckpoint] = useStore((s) => [s.checkpoint1, s.showCheckpoint])
  const improved = mutation.checkpointDifference < 0

  return (
    <div className={`checkpoint ${showCheckpoint ? '' : 'hide'}`}>
      <p>{checkpoint1 / 1000}</p>
      <p className={improved ? 'green' : 'red'}>{formatCheckpointDifference(mutation.checkpointDifference, improved)}</p>
    </div>
  )
}
