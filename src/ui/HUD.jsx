import { Stats } from '@react-three/drei'
import { Clock } from './Clock'
import { Editor } from './Editor'
import { Finished } from './Finished'
import { Help } from './Help'
import { Speed } from './Speed'
import { useStore } from '../store'
import { LeaderBoard } from './LeaderBoard'

export const HUD = () => {
  const { editor, finished, stats } = useStore(({ editor, finished, stats }) => ({ editor, finished, stats }))

  return (
    <>
      <Clock />
      {editor && <Editor />}
      {finished && <Finished />}
      <Help />
      <Speed />
      {stats && <Stats />}
      <LeaderBoard />
    </>
  )
}
