import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { getScores } from '../data'
import { gameState } from '../store'

export function LeaderBoard() {
  const [scores, setScores] = useState([])
  const [last, setLast] = useState(0)
  const { leaderboard } = useSnapshot(gameState)
  useEffect(() => {
    // this is false positive (no problem because leaderboard is boolean)
    // eslint-disable-next-line valtio/state-snapshot-rule
    if (!leaderboard || Date.now() - last < 3000) return
    getScores(10).then(setScores)
    setLast(Date.now())
  }, [leaderboard])
  const close = () => {
    gameState.leaderboard = false
  }
  return (
    <div className="controls">
      <div className={`popup ${leaderboard ? 'open' : ''}`}>
        <button className="popup-close" onClick={close}>
          L
        </button>
        <ul className="popup-content leaderboard-bottom">
          {scores.map((score, key) => (
            <Score {...score} standing={key} key={key} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const standingToImage = {
  1: 'images/gold.png',
  2: 'images/silver.png',
  3: 'images/bronze.png',
}

export const Score = ({ name, time, standing }) => {
  const isTop = standing < 3

  return (
    <li className="popup-item">
      <span className="leaderboard-name">
        {isTop ? (
          <>
            <img src={standingToImage[String(standing + 1)]} width={13} height={13} />
            {name}
          </>
        ) : (
          `${standing + 1} ${name}`
        )}
      </span>
      <span className="popup-item-key">
        <span>{time}</span>
      </span>
    </li>
  )
}
