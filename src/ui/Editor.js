import { useControls, folder } from 'leva'
import { gameState, vehicleConfig, wheelInfo } from '../store'

const { directionLocal, axleLocal, chassisConnectionPointLocal, rollInfluence, ...filteredWheelInfo } = wheelInfo

export function Editor() {
  const { radius, width, height, front, back, steer, force, maxBrake, maxSpeed } = vehicleConfig
  const {
    suspensionStiffness,
    suspensionRestLength,
    useCustomSlidingRotationalSpeed,
    customSlidingRotationalSpeed,
    suspensionForce,
    frictionSlip,
    sideAcceleration,
  } = gameState.raycast.wheelInfos[0] // this is not reactive

  const [, setVehicleEditor] = useControls(() => ({
    Performance: folder({
      shadows: { value: true, onChange: (shadows) => void (gameState.shadows = shadows) },
      dpr: { value: 1.5, min: 1, max: 2, step: 0.5, onChange: (dpr) => void (gameState.dpr = dpr) },
    }),
    Vehicle: folder(
      {
        radius: {
          value: radius,
          min: 0.1,
          max: 2,
          step: 0.01,
          onChange: (value) => {
            gameState.vehicleConfig.radius = value
            gameState.raycast.wheelInfos[0].radius = value
            gameState.raycast.wheelInfos[1].radius = value
            gameState.raycast.wheelInfos[2].radius = value
            gameState.raycast.wheelInfos[3].radius = value
          },
        },
        width: {
          value: width,
          min: 0.1,
          max: 10,
          step: 0.01,
          onChange: (value) => {
            gameState.vehicleConfig.width = value
            for (let i = 0; i < 4; ++i) {
              gameState.raycast.wheelInfos[i].chassisConnectionPointLocal[0] =
                gameState.raycast.wheelInfos[0].chassisConnectionPointLocal[0] < 0 ? -value / 2 : value / 2
            }
          },
        },
        height: {
          value: height,
          min: -5,
          max: 5,
          step: 0.01,
          onChange: (value) => {
            gameState.vehicleConfig.height = value
            gameState.raycast.wheelInfos[0].chassisConnectionPointLocal[1] = value
            gameState.raycast.wheelInfos[1].chassisConnectionPointLocal[1] = value
            gameState.raycast.wheelInfos[2].chassisConnectionPointLocal[1] = value
            gameState.raycast.wheelInfos[3].chassisConnectionPointLocal[1] = value
          },
        },
        front: {
          value: front,
          min: -10,
          max: 10,
          step: 0.05,
          onChange: (value) => {
            gameState.vehicleConfig.front = value
            gameState.raycast.wheelInfos[0].chassisConnectionPointLocal[2] = value
            gameState.raycast.wheelInfos[1].chassisConnectionPointLocal[2] = value
          },
        },
        back: {
          value: back,
          min: -10,
          max: 10,
          step: 0.05,
          onChange: (value) => {
            gameState.vehicleConfig.back = value
            gameState.raycast.wheelInfos[0].chassisConnectionPointLocal[2] = value
            gameState.raycast.wheelInfos[1].chassisConnectionPointLocal[2] = value
          },
        },
        steer: {
          value: steer,
          min: 0.1,
          max: 1,
          step: 0.01,
          onChange: (value) => {
            gameState.vehicleConfig.steer = value
          },
        },
        force: {
          value: force,
          min: 0,
          max: 3000,
          step: 1,
          onChange: (value) => {
            gameState.vehicleConfig.force = value
          },
        },
        maxBrake: {
          value: maxBrake,
          min: 0.1,
          max: 100,
          step: 0.01,
          onChange: (value) => {
            gameState.vehicleConfig.maxBrake = value
          },
        },
        maxSpeed: {
          value: maxSpeed,
          min: 1,
          max: 150,
          step: 1,
          onChange: (value) => {
            gameState.vehicleConfig.maxSpeed = value
          },
        },
      },
      { collapsed: true },
    ),
    Suspension: folder(
      {
        suspensionStiffness: {
          value: suspensionStiffness,
          min: 0,
          max: 500,
          step: 1,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].suspensionStiffness = value
            gameState.raycast.wheelInfos[1].suspensionStiffness = value
            gameState.raycast.wheelInfos[2].suspensionStiffness = value
            gameState.raycast.wheelInfos[3].suspensionStiffness = value
          },
        },
        suspensionRestLength: {
          value: suspensionRestLength,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].suspensionRestLength = value
            gameState.raycast.wheelInfos[1].suspensionRestLength = value
            gameState.raycast.wheelInfos[2].suspensionRestLength = value
            gameState.raycast.wheelInfos[3].suspensionRestLength = value
          },
        },
        useCustomSlidingRotationalSpeed: {
          value: useCustomSlidingRotationalSpeed,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].useCustomSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[1].useCustomSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[2].useCustomSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[3].useCustomSlidingRotationalSpeed = value
          },
        },
        customSlidingRotationalSpeed: {
          value: customSlidingRotationalSpeed,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].customSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[1].customSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[2].customSlidingRotationalSpeed = value
            gameState.raycast.wheelInfos[3].customSlidingRotationalSpeed = value
          },
        },
        suspensionForce: {
          value: suspensionForce,
          min: 0,
          max: 500,
          step: 0.01,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].suspensionForce = value
            gameState.raycast.wheelInfos[1].suspensionForce = value
            gameState.raycast.wheelInfos[2].suspensionForce = value
            gameState.raycast.wheelInfos[3].suspensionForce = value
          },
        },
        frictionSlip: {
          value: frictionSlip,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].frictionSlip = value
            gameState.raycast.wheelInfos[1].frictionSlip = value
            gameState.raycast.wheelInfos[2].frictionSlip = value
            gameState.raycast.wheelInfos[3].frictionSlip = value
          },
        },
        sideAcceleration: {
          value: sideAcceleration,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) => {
            gameState.raycast.wheelInfos[0].sideAcceleration = value
            gameState.raycast.wheelInfos[1].sideAcceleration = value
            gameState.raycast.wheelInfos[2].sideAcceleration = value
            gameState.raycast.wheelInfos[3].sideAcceleration = value
          },
        },
      },
      { collapsed: true },
    ),
    Debug: folder(
      {
        reset: {
          value: false,
          onChange: () => setVehicleEditor({ debug: false, reset: false, ...vehicleConfig, ...filteredWheelInfo }),
        },
        stats: { value: false, onChange: (stats) => void (gameState.stats = stats) },
        debug: { value: false, onChange: (debug) => void (gameState.debug = debug) },
      },
      { collapsed: true },
    ),
  }))
  return null
}
