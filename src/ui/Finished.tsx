import { useState } from 'react'
import { reset, useStore } from '../store'
import { getScores, insertScore, ScoreInterface } from '../data'
import { Score } from './LeaderBoard'
import { Auth } from './Auth'
import { Session } from '@supabase/supabase-js'

export const Finished = () => {
  const LOCAL_STORAGE_KEY = 'racing-pmndrs-name'

  const [finished, session] = useStore((state) => [state.finished, state.session]) as  [number, Session | null]
  const readableTime = (finished / 1000).toFixed(2)

  const [name, setName] = useState(window.localStorage.getItem(LOCAL_STORAGE_KEY)) as [string, React.Dispatch<React.SetStateAction<string>>]
  const [scores, setScores] = useState<Score[]>(null!)
  const [position, setPosition] = useState<number>(null!)

  const sendScore = async () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, name as string)
    const [{ id }] = await insertScore({ time: finished as number, name }) as ScoreInterface[]
    const scores: Score[] = await (getScores() as PromiseLike<Score[]>)
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
              <form className="name-form" onSubmit={sendScore}>
                <h2>You belong on our leaderboard! </h2>
                <label htmlFor="name">Enter your username</label>
                <div>
                  <input required maxLength={10} minLength={2} id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                  <button className="popup-item-key">Add my score</button>
                </div>
              </form>
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
