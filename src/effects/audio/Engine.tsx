import { useEffect, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import type { PositionalAudio as PositionalAudioImpl } from 'three'

import { mutation, useStore } from '../../store'

const { lerp } = MathUtils

export const EngineAudio = () => {
  const ref = useRef<PositionalAudioImpl>(null)
  const maxSpeed = useStore(({ vehicleConfig: { maxSpeed } }) => maxSpeed)

  const getVolume = () => 1 - mutation.speed / maxSpeed

  useFrame((_, delta) => {
    ref.current?.setVolume(getVolume())
    ref.current?.setPlaybackRate(lerp(ref.current.playbackRate, mutation.rpmTarget + 1, delta * 10))
  })

  useEffect(() => {
    if (ref.current && !ref.current.isPlaying) {
      ref.current.setVolume(getVolume())
      ref.current.play()
    }
    return () => {
      if (ref.current && ref.current.isPlaying) ref.current.stop()
    }
  }, [])

  return <PositionalAudio autoplay ref={ref} url="/sounds/engine.mp3" loop distance={5} />
}
