import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useControls } from 'leva'
import AtomVisualization from './components/AtomVisualization'
import './App.css'

function App() {
  const { rotationSpeed, glowIntensity } = useControls({
    rotationSpeed: { value: 1, min: 0, max: 3, step: 0.1 },
    glowIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 }
  })

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        color: '#fff', 
        zIndex: 10,
        fontFamily: 'monospace'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Iron Atom (Fe)</h1>
        <p style={{ margin: '5px 0', opacity: 0.8 }}>26 Protons • 30 Neutrons • 26 Electrons</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <Stars radius={300} depth={60} count={5000} factor={7} fade speed={1} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <AtomVisualization rotationSpeed={rotationSpeed} glowIntensity={glowIntensity} />
        
        <OrbitControls 
          enablePan={false}
          minDistance={20}
          maxDistance={100}
        />
      </Canvas>
    </div>
  )
}

export default App
