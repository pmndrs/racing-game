import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { getLeaderBoardData } from '../utils/data/leaderboard'

export function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([])
  const [set, leaderboard] = useStore((state) => [state.set, state.leaderboard])

  const loadLeaderBoard = async () => {
    const leaderboardData = await getLeaderBoardData(10)
    setLeaderBoard(leaderboardData)
  }
  useEffect(() => {
    loadLeaderBoard()
  }, [])
  return (
    <>
      <div className="controls">
        <div className={`popup ${leaderboard ? 'open' : ''}`}>
          <button className="popup-close" onClick={() => set({ leaderboard: false })}>
            L
          </button>
          <ul className="popup-content leaderboard-bottom">
            {leaderBoard.map((item) => (
              <Item {...item} key={item.id} />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export const Item = ({ name, time }) => (
  <li className="popup-item">
    <span className="leaderboard-name">{name}</span>
    <span className="popup-item-key">
      <span>{time}</span>
    </span>
  </li>
)
