import { useEffect, useState } from 'react'

import type { HTMLAttributes } from 'react'

import { getScores } from '../data'
import { useStore } from '../store'

import type { SavedScore } from '../data'

export function LeaderBoard(): JSX.Element {
  const [scores, setScores] = useState<SavedScore[]>([])
  const [last, setLast] = useState(0)
  const [leaderboard, set] = useStore((state) => [state.leaderboard, state.set])
  const close = () => set((state) => ({ ...state, leaderboard: false }))

  useEffect(() => {
    if (!leaderboard || Date.now() - last < 3000) return
    getScores(10).then(setScores)
    setLast(Date.now())
  }, [leaderboard])

  return (
    <div className={`leaderboard popup ${leaderboard ? 'open' : ''}`}>
      <button className="popup-close" onClick={close}>
        L
      </button>
      <Scores className="popup-content leaderboard-bottom" scores={scores} />
    </div>
  )
}

const standingToImage: Record<1 | 2 | 3, string> = {
  1: 'images/gold.png',
  2: 'images/silver.png',
  3: 'images/bronze.png',
}

interface ScoreProps {
  name: string
  standing: number
  time: number
}

export const readableTime = (time: number): string => (time / 1000).toFixed(2)

interface ScoresProps extends HTMLAttributes<HTMLUListElement> {
  scores: SavedScore[]
}

const Score = ({ name, standing, time }: ScoreProps): JSX.Element => (
  <li className="popup-item">
    <span className="leaderboard-name">
      {standing === 1 || standing === 2 || standing === 3 ? (
        <>
          <img src={standingToImage[standing]} width={13} height={13} />
          {name}
        </>
      ) : (
        `${standing} ${name}`
      )}
    </span>
    <span className="popup-item-key">
      <span>{readableTime(time)}</span>
    </span>
  </li>
)

export const Scores = ({ scores, ...props }: ScoresProps): JSX.Element => (
  <ul {...props}>
    {scores.map((score, index) => (
      <Score {...score} standing={index + 1} key={index} />
    ))}
  </ul>
)
