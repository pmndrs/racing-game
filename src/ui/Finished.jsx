import { useStore, mutation } from '../store'
import { useState } from 'react'
import { getLeaderBoardData, insertTime } from '../utils/data/leaderboard'
import { Item } from './LeaderBoard'
import { Auth } from './Auth'

export const Finished = () => {
  const LOCAL_STORAGE_KEY = 'racing-pmndrs-name'

  const [finished, session] = useStore((state) => [state.finished, state.session])
  const readableTime = (finished / 1000).toFixed(2)

  const [name, setName] = useState(window.localStorage.getItem(LOCAL_STORAGE_KEY))
  const [leaderBoard, setLeaderBoard] = useState(null)
  const [position, setPosition] = useState(null)

  const sendTime = async () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, name)
    const newTime = await insertTime({ time: finished, name: name })
    const leaderboardData = await getLeaderBoardData()
    setLeaderBoard(leaderboardData)
    setPosition(leaderboardData.findIndex((l) => l.id === newTime[0].id) + 1)
  }

  return (
    <div className="finished">
      {leaderBoard ? (
        <>
          <h1> You are number #{position}</h1>
          <ul className="leaderboard">
            {leaderBoard.map((score) => (
              <Item {...score} key={score.id} />
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>Good job! Your time was {readableTime}</h1>
          {session?.user.aud !== 'authenticated' ? (
            <Auth />
          ) : (
            <>
              <form className="name-form" onSubmit={sendTime}>
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
  const cleanState = () =>
    set((state) => ((mutation.start = 0), (mutation.finish = 0), { ...state, finished: false, controls: { ...state.controls, reset: true } }))
  return (
    <button className="restart" onClick={cleanState}>
      <div>Restart</div>
    </button>
  )
}
