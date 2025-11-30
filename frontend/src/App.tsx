import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useControls } from 'leva'
import AtomVisualization from './components/AtomVisualization'
import ParticleField from './components/ParticleField'
import AtomSelector from './components/AtomSelector'
import { useAtomStore } from './hooks/useAtomStore'
import './App.css'

function App() {
  const { rotationSpeed, glowIntensity, showParticles } = useControls({
    rotationSpeed: { value: 1, min: 0, max: 3, step: 0.1 },
    glowIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    showParticles: { value: true }
  })

  const currentAtom = useAtomStore((state) => state.currentAtom)
  const totalElectrons = currentAtom.shells.reduce((sum, shell) => sum + shell.electrons, 0)

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
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          {currentAtom.name} Atom ({currentAtom.symbol})
        </h1>
        <p style={{ margin: '5px 0', opacity: 0.8 }}>
          {currentAtom.atomicNumber} Protons • {currentAtom.neutrons} Neutrons • {totalElectrons} Electrons
        </p>
        <p style={{ margin: '5px 0', opacity: 0.6, fontSize: '0.9rem' }}>
          Drag to rotate • Scroll to zoom
        </p>
        <div style={{
          marginTop: '6px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          fontSize: '0.8rem',
          opacity: 0.85,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ff2255',
                display: 'inline-block',
              }}
            />
            <span>Proton</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#2255ff',
                display: 'inline-block',
              }}
            />
            <span>Neutron</span>
          </div>
        </div>
      </div>

      <AtomSelector />
      
      <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <Suspense fallback={null}>
          <Stars radius={300} depth={60} count={5000} factor={7} fade speed={1} />
        </Suspense>
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />
        
        {showParticles && <ParticleField />}
        <AtomVisualization rotationSpeed={rotationSpeed} glowIntensity={glowIntensity} />
        
        <OrbitControls 
          enablePan={false}
          minDistance={20}
          maxDistance={100}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

export default App
