import { mutation, useStore } from '../store'

const formatCheckpointDifference = (diffMs: number, negative: boolean) => {
  return `${!negative ? '+' : ''}${diffMs / 1000}`
}

export function Checkpoint() {
  const checkpoint = useStore(({ checkpoint }) => checkpoint)
  const improved = mutation.checkpointDifference < 0

  return (
    <div className={`checkpoint ${checkpoint ? '' : 'hide'}`}>
      <p>{mutation.tempCheckpoint1 / 1000}</p>
      <p className={improved ? 'green' : 'red'}>{formatCheckpointDifference(mutation.checkpointDifference, improved)}</p>
    </div>
  )
}
