import { useState } from 'react'
import { reset, useStore } from '../store'
import { getScores, insertScore } from '../data'
import { readableTime, Scores } from './LeaderBoard'
import { Auth } from './Auth'
import type { SavedScore } from '../data'

const Restart = (): JSX.Element => {
  const set = useStore((state) => state.set)
  return (
    <button className="restart" onClick={() => reset(set)}>
      <div>Restart</div>
    </button>
  )
}

export const Finished = (): JSX.Element => {
  const [time, session] = useStore((state) => [state.finished, state.session])
  const [scores, setScores] = useState<SavedScore[]>([])
  const [position, setPosition] = useState<number>(0)

  const user = session?.user?.user_metadata
  const name: string = user?.full_name
  const thumbnail: string = user?.avatar_url

  const sendScore = async () => {
    const [{ id }] = await insertScore({ name, thumbnail, time })
    const scores = await getScores()
    setScores(scores)
    const index = scores.findIndex((score) => score.id === id)
    setPosition(index && index + 1)
  }

  return (
    <div className="finished">
      {scores ? (
        <>
          {position && <h1>You are number #{position}</h1>}
          <Scores className="leaderboard" scores={scores} />
        </>
      ) : (
        <>
          <h1>Good job! Your time was {readableTime(time)}</h1>
          {session?.user?.aud !== 'authenticated' ? (
            <Auth />
          ) : (
            <>
              <h2>You belong on our leaderboard {name}! </h2>
              <button onClick={sendScore} style={{ margin: '0 auto', width: 'auto' }} className="popup-item-key">
                Add my score
              </button>
            </>
          )}
        </>
      )}
      <Restart />
    </div>
  )
}
