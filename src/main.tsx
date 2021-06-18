import ReactDOM from 'react-dom'
import { useGLTF, useTexture } from '@react-three/drei'
import 'inter-ui'
import './styles.css'
import { App } from './App'

useTexture.preload('/textures/heightmap_1024.png')
useGLTF.preload('/models/track-draco.glb')
useGLTF.preload('/models/chassis-draco.glb')
useGLTF.preload('/models/wheel-draco.glb')

ReactDOM.render(<App />, document.getElementById('root'))
