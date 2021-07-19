import { useEffect, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import type { PositionalAudio as PositionalAudioImpl } from 'three'

import { getState, mutation, useStore } from '../store'

import type { Controls } from '../store'

const { lerp } = MathUtils

const gears = 10

export function Audio() {
  const engineAudio = useRef<PositionalAudioImpl>(null!)
  const boostAudio = useRef<PositionalAudioImpl>(null!)

  const honkAudio = useRef<PositionalAudioImpl>(null!)
  const brakeAudio = useRef<PositionalAudioImpl>(null!)
  const [sound, maxSpeed] = useStore((state) => [state.sound, state.vehicleConfig.maxSpeed])

  let rpmTarget = 0
  let controls: Controls
  let speed = 0
  let isBoosting = false

  useFrame((_, delta) => {
    speed = mutation.speed
    controls = getState().controls
    isBoosting = controls.boost && mutation.boost > 0

    boostAudio.current.setVolume(sound ? (isBoosting ? Math.pow(speed / maxSpeed, 1.5) + 0.5 : 0) * 5 : 0)
    boostAudio.current.setPlaybackRate(Math.pow(speed / maxSpeed, 1.5) + 0.5)
    engineAudio.current.setVolume(sound ? 1 - speed / maxSpeed : 0)

    const gearPosition = speed / (maxSpeed / gears)
    rpmTarget = ((gearPosition % 1) + Math.log(gearPosition)) / 6
    if (rpmTarget < 0) rpmTarget = 0
    if (isBoosting) rpmTarget += 0.1
    engineAudio.current.setPlaybackRate(lerp(engineAudio.current.playbackRate, rpmTarget + 1, delta * 10))

    brakeAudio.current.setVolume(sound ? (controls.brake ? 1 : 0.5) : 0)

    if (sound) {
      if (controls.honk) {
        if (!honkAudio.current.isPlaying) honkAudio.current.play()
      } else honkAudio.current.isPlaying && honkAudio.current.stop()
      if (controls.brake && speed > 20) {
        if (!brakeAudio.current.isPlaying) brakeAudio.current.play()
      } else brakeAudio.current.isPlaying && brakeAudio.current.stop()
    }
  })

  useEffect(() => {
    const engine = engineAudio.current
    const honk = honkAudio.current
    const brake = brakeAudio.current
    return () => [engine, honk, brake].forEach((audio) => audio && audio.isPlaying && audio.stop())
  }, [])

  return (
    <>
      <PositionalAudio ref={engineAudio} url="/sounds/engine.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={boostAudio} url="/sounds/boost.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" distance={10} />
    </>
  )
}

const AccelerateAudio = () => {
  const ref = useRef<PositionalAudioImpl>(null)
  useFrame((_, delta) => {
    ref.current?.setVolume(sound ? (speed / maxSpeed) * 2 : 0)
    ref.current?.setPlaybackRate(lerp(ref.current.playbackRate, rpmTarget + 0.5, delta * 10))
  })
  return (
    <PositionalAudio ref={ref} url="/sounds/accelerate.mp3" autoplay loop distance={5} />
  )
}
