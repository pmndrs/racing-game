import { button, folder, useControls } from 'leva'
import { booleans, dpr, useStore, vehicleConfig, wheelInfo } from '../store'

const { directionLocal, axleLocal, rollInfluence, ...filteredWheelInfo } = wheelInfo
const { debug, shadows, stats } = booleans
const initialValues = {
  debug,
  dpr,
  shadows,
  stats,
  ...filteredWheelInfo,
  ...vehicleConfig,
}

export function Editor() {
  const [get, set, debug, dpr, shadows, stats] = useStore((state) => [state.get, state.set, state.debug, state.dpr, state.shadows, state.stats])
  const { back, force, front, height, maxBrake, maxSpeed, steer, width } = vehicleConfig
  const { customSlidingRotationalSpeed, frictionSlip, radius, sideAcceleration, suspensionStiffness, suspensionRestLength, useCustomSlidingRotationalSpeed } =
    wheelInfo

  const [, setVehicleEditor] = useControls(() => ({
    Performance: folder({
      dpr: { value: dpr, min: 1, max: 2, step: 0.5, onChange: (dpr) => set({ dpr }) },
      shadows: { value: shadows, onChange: (shadows) => set({ shadows }) },
    }),
    Vehicle: folder(
      {
        radius: {
          value: radius,
          min: 0.1,
          max: 2,
          step: 0.01,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, radius: value },
            }),
        },
        width: {
          value: width,
          min: 0.1,
          max: 10,
          step: 0.01,
          onChange: (value) =>
            set({
              vehicleConfig: { ...get().vehicleConfig, width: value },
            }),
        },
        height: {
          value: height,
          min: -5,
          max: 5,
          step: 0.01,
          onChange: (value) =>
            set({
              vehicleConfig: { ...get().vehicleConfig, height: value },
            }),
        },
        front: {
          value: front,
          min: -10,
          max: 10,
          step: 0.05,
          onChange: (value) =>
            set({
              vehicleConfig: { ...get().vehicleConfig, front: value },
            }),
        },
        back: {
          value: back,
          min: -10,
          max: 10,
          step: 0.05,
          onChange: (value) =>
            set({
              vehicleConfig: { ...get().vehicleConfig, back: value },
            }),
        },
        steer: {
          value: steer,
          min: 0.1,
          max: 1,
          step: 0.01,
          onChange: (value) => set({ vehicleConfig: { ...get().vehicleConfig, steer: value } }),
        },
        force: {
          value: force,
          min: 0,
          max: 3000,
          step: 1,
          onChange: (value) => set({ vehicleConfig: { ...get().vehicleConfig, force: value } }),
        },
        maxBrake: {
          value: maxBrake,
          min: 0.1,
          max: 100,
          step: 0.01,
          onChange: (value) => set({ vehicleConfig: { ...get().vehicleConfig, maxBrake: value } }),
        },
        maxSpeed: {
          value: maxSpeed,
          min: 1,
          max: 150,
          step: 1,
          onChange: (value) => set({ vehicleConfig: { ...get().vehicleConfig, maxSpeed: value } }),
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
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, suspensionStiffness: value },
            }),
        },
        suspensionRestLength: {
          value: suspensionRestLength,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, suspensionRestLength: value },
            }),
        },
        useCustomSlidingRotationalSpeed: {
          value: useCustomSlidingRotationalSpeed,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, useCustomSlidingRotationalSpeed: value },
            }),
        },
        customSlidingRotationalSpeed: {
          value: customSlidingRotationalSpeed,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, customSlidingRotationalSpeed: value },
            }),
        },
        frictionSlip: {
          value: frictionSlip,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, frictionSlip: value },
            }),
        },
        sideAcceleration: {
          value: sideAcceleration,
          min: -10,
          max: 10,
          step: 0.01,
          onChange: (value) =>
            set({
              wheelInfo: { ...get().wheelInfo, sideAcceleration: value },
            }),
        },
      },
      { collapsed: true },
    ),
    Debug: folder(
      {
        debug: { value: debug, onChange: (debug) => set({ debug }) },
        stats: { value: stats, onChange: (stats) => set({ stats }) },
      },
      { collapsed: true },
    ),
    reset: button(() => {
      // @ts-expect-error -- FIXME: types when using folders seem to be broken
      setVehicleEditor(initialValues)
    }),
  }))
  return null
}
