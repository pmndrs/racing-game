import { useEffect, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei'

import type { PositionalAudio as PositionalAudioImpl } from 'three'

import { useStore } from '../../store'

export const HonkAudio = () => {
  const ref = useRef<PositionalAudioImpl>(null)
  const [honk, sound] = useStore(({ controls: { honk }, sound }) => [honk, sound])

  useEffect(() => {
    if (ref.current && sound) {
      if (honk && !ref.current.isPlaying) ref.current.play()
      if (!honk && ref.current.isPlaying) ref.current.stop()
    }
    return () => {
      if (ref.current && ref.current.isPlaying) ref.current.stop()
    }
  }, [honk, sound])

  return <PositionalAudio ref={ref} url="/sounds/honk.mp3" distance={10} />
}
