import { useState } from 'react'
import { reset, useStore } from '../store'
import { getScores, insertScore } from '../data'
import type { IScore } from '../data'
import { Score } from './LeaderBoard'
import { Auth } from './Auth'

export const Finished = () => {
  const [finished, session] = useStore((state) => [state.finished, state.session])
  const readableTime = (finished / 1000).toFixed(2)

  const [scores, setScores] = useState<IScore[]>(null!)
  const [position, setPosition] = useState<number>(null!)

  const sendScore = async () => {
    const user = session?.user?.user_metadata
    const [{ id }] = (await insertScore({ time: finished, name: user?.full_name, thumbnail: user?.avatar_url })) || [{}]
    if (!id) {
      return
    }
    const scores = await getScores()
    if (!scores) {
      return
    }
    setScores(scores)
    setPosition(scores.findIndex((score) => score.id === id) + 1)
  }

  return (
    <div className="finished">
      {scores ? (
        <>
          <h1> You are number #{position}</h1>
          <ul className="leaderboard">
            {scores.map((score, key) => (
              <Score {...score} standing={key} key={key} />
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>Good job! Your time was {readableTime}</h1>
          {session?.user?.aud !== 'authenticated' ? (
            <Auth />
          ) : (
            <>
              <h2>You belong on our leaderboard {session.user.user_metadata.full_name}! </h2>
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

const Restart = () => {
  const set = useStore((state) => state.set)
  return (
    <button className="restart" onClick={() => reset(set)}>
      <div>Restart</div>
    </button>
  )
}
