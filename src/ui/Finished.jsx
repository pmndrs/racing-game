import { useState } from 'react'
import { reset, useStore } from '../store'
import { getScores, insertScore } from '../data'
import { Score } from './LeaderBoard'

export const Finished = () => {
  const LOCAL_STORAGE_KEY = 'racing-pmndrs-name'
  const [name, setName] = useState('')
  const finished = useStore((state) => state.finished)
  const readableTime = (finished / 1000).toFixed(2)
  const [savedName, setSavedName] = useState(window.localStorage.getItem(LOCAL_STORAGE_KEY))
  const [scores, setScores] = useState(null)
  const [position, setPosition] = useState(null)

  const addMe = async () => {
    const [{ id }] = await insertScore({ time: finished, name: savedName })
    const scores = await getScores()
    setScores(scores)
    setPosition(scores.findIndex((score) => score.id === id) + 1)
  }

  const setUsername = (e) => {
    e.preventDefault()
    window.localStorage.setItem(LOCAL_STORAGE_KEY, name)
    setSavedName(name)
  }

  if (scores) {
    return (
      <div className="finished">
        <h1> You are number #{position}</h1>
        <ul className="leaderboard">
          {scores.map((score, key) => (
            <Score {...score} standing={key} key={key} />
          ))}
        </ul>
        <Restart />
      </div>
    )
  }

  return (
    <div className="finished">
      <h1>Good job! Your time was {readableTime}</h1>
      {!savedName ? (
        <form className="name-form" onSubmit={setUsername}>
          <h2>You belong on our leaderboard! </h2>
          <label htmlFor="name">What is your name?</label>
          <div>
            <input required maxLength={10} minLength={2} id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="popup-item-key">Add me</button>
          </div>
        </form>
      ) : (
        <button className="popup-item-key add-me" onClick={addMe}>
          Add me to the leaderboard
        </button>
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
