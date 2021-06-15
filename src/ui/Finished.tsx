import { useEffect, useState } from 'react'
import { reset, useStore } from '../store'
import { getScores, insertScore } from '../data'
import { readableTime, Scores } from './LeaderBoard'
import { Auth } from './Auth'
import type { SavedScore } from '../data'

export const Finished = (): JSX.Element => {
  const [time, session, set] = useStore((state) => [state.finished, state.session, state.set])
  const [scoreId, setScoreId] = useState<SavedScore['id']>('')
  const [scores, setScores] = useState<SavedScore[]>([])
  const [position, setPosition] = useState<number>(0)

  const isAuthenticated = session?.user?.aud === 'authenticated'

  const user = session?.user?.user_metadata
  const name: string = user?.full_name
  const thumbnail: string = user?.avatar_url

  const updatePosition = () => {
    const index = scores.findIndex((score) => score.id === scoreId)
    setPosition(index && index + 1)
  }

  const updateScores = () => {
    getScores().then(setScores)
  }

  const sendScore = () => {
    insertScore({ name, thumbnail, time })
      .then(([{ id }]) => setScoreId(id))
      .then(updateScores)
      .then(updatePosition)
  }

  useEffect(updateScores, [time])
  useEffect(updatePosition, [scoreId, scores])

  return (
    <div className="finished">
      <h1>Good job! Your time was {readableTime(time)} seconds</h1>
      <Scores className="leaderboard" scores={scores} />
      {isAuthenticated ? (
        <>
          {scoreId ? (
            position ? (
              <h1>You are number #{position}</h1>
            ) : null
          ) : (
            <>
              <h2>You belong on our leaderboard, {name}! </h2>
              <button onClick={sendScore} style={{ margin: '0 auto', width: 'auto' }} className="popup-item-key">
                Add my score
              </button>
            </>
          )}
        </>
      ) : (
        <Auth />
      )}
      <button className="restart" onClick={() => reset(set)}>
        <div>Restart</div>
      </button>
    </div>
  )
}
