import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useControls } from 'leva'
import AtomVisualization from './components/AtomVisualization'
import ParticleField from './components/ParticleField'
import AtomSelector from './components/AtomSelector'
import PhotonControls from './components/PhotonControls'
import PhotonInfoPanel from './components/PhotonInfoPanel'
import PhotonBeam from './components/PhotonBeam'
import { useAtomStore } from './hooks/useAtomStore'
import { wavelengthToEnergy, determineInteractionType } from './utils/photon-physics'
import './App.css'

function App() {
  const { rotationSpeed, glowIntensity, showParticles } = useControls({
    rotationSpeed: { value: 1, min: 0, max: 3, step: 0.1 },
    glowIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    showParticles: { value: true }
  })

  const currentAtom = useAtomStore((state) => state.currentAtom)
  const { photonState, togglePhotonMode, setCurrentEffect } = useAtomStore()
  const totalElectrons = currentAtom.shells.reduce((sum, shell) => sum + shell.electrons, 0)

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'] as const
  const shellDescription = currentAtom.shells
    .map((shell, index) => {
      const label = shellNames[index] ?? `Shell ${index + 1}`
      return `${label} shell: ${shell.electrons} electrons`
    })
    .join(' • ')

  // Update current effect based on wavelength
  useEffect(() => {
    if (photonState.photonModeEnabled && photonState.isLightOn && currentAtom.energyData) {
      const photonEnergy = wavelengthToEnergy(photonState.wavelength)
      const effect = determineInteractionType(photonEnergy, currentAtom.energyData)
      setCurrentEffect(effect)
    } else {
      setCurrentEffect('none')
    }
  }, [photonState.wavelength, photonState.isLightOn, photonState.photonModeEnabled, currentAtom, setCurrentEffect])

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
        <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: '0.8rem', maxWidth: '360px' }}>
          Electron shells (inner to outer): {shellDescription}
        </p>
      </div>

      {/* Photon Mode Toggle */}
      <button
        onClick={togglePhotonMode}
        style={{
          position: 'absolute',
          top: 20,
          right: photonState.photonModeEnabled ? 360 : 20,
          padding: '12px 20px',
          background: photonState.photonModeEnabled
            ? 'rgba(100, 255, 200, 0.3)'
            : 'rgba(100, 100, 255, 0.2)',
          border: photonState.photonModeEnabled
            ? '2px solid rgba(100, 255, 200, 0.6)'
            : '2px solid rgba(100, 100, 255, 0.4)',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          zIndex: 101,
          transition: 'all 0.3s ease',
          boxShadow: photonState.photonModeEnabled
            ? '0 0 20px rgba(100, 255, 200, 0.4)'
            : 'none',
        }}
      >
        {photonState.photonModeEnabled ? '⚛️ Photon Mode ON' : '🔬 Enable Photon Mode'}
      </button>

      {/* Photon Mode UI */}
      {photonState.photonModeEnabled && <PhotonControls />}
      {photonState.photonModeEnabled && <PhotonInfoPanel />}

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
        {photonState.photonModeEnabled && <PhotonBeam />}

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
