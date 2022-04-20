import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { getScores, insertScore } from '../data'
import { readableTime, Scores } from './LeaderBoard'
import { Auth } from './Auth'
import type { SavedScore } from '../data'

export const Finished = (): JSX.Element => {
  const [reset, session, time] = useStore(({ actions: { reset }, finished, session }) => [reset, session, finished])
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
      <div className="finished-header">
        <h1>Good job! Your time was {readableTime(time)} seconds</h1>
      </div>
      <div className="finished-leaderboard">
        <Scores className="leaderboard" scores={scores} />
      </div>
      <div className="finished-auth">
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
      </div>
      <div className="finished-restart">
        <button className="restart-btn" onClick={reset}>
          Restart
        </button>
      </div>
    </div>
  )
}
