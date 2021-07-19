import { useEffect, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import type { PositionalAudio as PositionalAudioImpl } from 'three'

import { mutation, useStore } from '../../store'

const { lerp } = MathUtils

export const EngineAudio = () => {
  const ref = useRef<PositionalAudioImpl>(null)
  const [maxSpeed, sound] = useStore(({ sound, vehicleConfig: { maxSpeed } }) => [maxSpeed, sound])

  useFrame((_, delta) => {
    ref.current?.setVolume(1 - mutation.speed / maxSpeed)
    ref.current?.setPlaybackRate(lerp(ref.current.playbackRate, mutation.rpmTarget + 1, delta * 10))
  })

  useEffect(() => {
    if (ref.current && sound && !ref.current.isPlaying) ref.current.play()
    return () => {
      if (ref.current && ref.current.isPlaying) ref.current.stop()
    }
  }, [sound])

  return <PositionalAudio ref={ref} url="/sounds/engine.mp3" autoplay loop distance={5} />
}
