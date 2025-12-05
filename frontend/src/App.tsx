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
import EnergyLevelDiagram from './components/EnergyLevelDiagram'
import SpectrumDisplay from './components/SpectrumDisplay'
import ExcitedElectronEffect from './components/ExcitedElectronEffect'
import PhotoelectricEffect from './components/PhotoelectricEffect'
import DecayControls from './components/DecayControls'
import DecayInfoPanel from './components/DecayInfoPanel'
import DecayAnimation from './components/DecayAnimation'
import TimeWarpControl from './components/TimeWarpControl'
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
  const { photonState, togglePhotonMode, setCurrentEffect, addEjectedElectron, incrementIonization, resetAtom, decayState, toggleDecayMode } = useAtomStore()
  const baseElectrons = currentAtom.shells.reduce((sum, shell) => sum + shell.electrons, 0)
  const currentElectrons = baseElectrons - photonState.ionizationCount
  const ionCharge = photonState.ionizationCount

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'] as const
  const shellDescription = currentAtom.shells
    .map((shell, index) => {
      const label = shellNames[index] ?? `Shell ${index + 1}`
      return `${label} shell: ${shell.electrons} electrons`
    })
    .join(' • ')

  // Update current effect based on wavelength and trigger animations
  useEffect(() => {
    if (photonState.photonModeEnabled && photonState.isLightOn && currentAtom.energyData) {
      const photonEnergy = wavelengthToEnergy(photonState.wavelength)
      const effect = determineInteractionType(photonEnergy, currentAtom.energyData)
      setCurrentEffect(effect)

      // Automatically trigger electron ejection for photoelectric effect
      if (effect === 'photoelectric' && currentAtom.energyData) {
        // Trigger ejection every 2 seconds while light is on (only if electrons remain)
        const interval = setInterval(() => {
          if (!currentAtom.energyData) return

          // Check if there are electrons left to eject
          const state = useAtomStore.getState()
          const remainingElectrons = baseElectrons - state.photonState.ionizationCount
          if (remainingElectrons <= 0) return

          const randomAngle = Math.random() * Math.PI * 2
          const randomPolar = Math.random() * Math.PI
          const speed = Math.sqrt(photonEnergy - currentAtom.energyData.ionizationEnergy) / 10

          addEjectedElectron({
            id: `electron-${Date.now()}-${Math.random()}`,
            shellIndex: 0,
            electronIndex: 0,
            kineticEnergy: photonEnergy - currentAtom.energyData.ionizationEnergy,
            position: [0, 0, 0],
            velocity: [
              Math.sin(randomPolar) * Math.cos(randomAngle) * speed,
              Math.sin(randomPolar) * Math.sin(randomAngle) * speed,
              Math.cos(randomPolar) * speed
            ],
            timestamp: Date.now()
          })

          // Increment ionization count - this electron is permanently gone
          incrementIonization()
        }, 2000)

        return () => clearInterval(interval)
      }
    } else {
      setCurrentEffect('none')
    }
  }, [photonState.wavelength, photonState.isLightOn, photonState.photonModeEnabled, currentAtom, setCurrentEffect, addEjectedElectron, incrementIonization, baseElectrons])

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
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentAtom.name} Atom ({currentAtom.symbol})
          {ionCharge > 0 && (
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
              color: '#000',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              animation: 'pulse 1.5s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
            }}>
              {ionCharge === 1 ? '⁺' : ionCharge === 2 ? '²⁺' : ionCharge === 3 ? '³⁺' : `${ionCharge}⁺`} ION
            </span>
          )}
        </h1>
        <p style={{ margin: '5px 0', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentAtom.atomicNumber} Protons • {currentAtom.neutrons} Neutrons •
          <span style={{
            color: ionCharge > 0 ? '#ff6b6b' : '#fff',
            fontWeight: ionCharge > 0 ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            {currentElectrons} Electrons
          </span>
          {ionCharge > 0 && (
            <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              ({ionCharge} ejected)
            </span>
          )}
        </p>

        {/* Ionization Status Panel */}
        {ionCharge > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 217, 61, 0.1))',
            border: '1px solid rgba(255, 107, 107, 0.4)',
            borderRadius: '10px',
            maxWidth: '320px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>⚡ Ionized State</span>
              <button
                onClick={resetAtom}
                style={{
                  background: 'rgba(100, 255, 150, 0.2)',
                  border: '1px solid rgba(100, 255, 150, 0.5)',
                  color: '#64ff96',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 255, 150, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 255, 150, 0.2)'
                }}
              >
                🔄 Reset Atom
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
              This atom has lost {ionCharge} electron{ionCharge > 1 ? 's' : ''} and now carries a +{ionCharge} charge.
              {currentElectrons === 0 && ' Fully ionized - no more electrons to eject!'}
            </p>
          </div>
        )}

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
      {photonState.photonModeEnabled && <EnergyLevelDiagram />}
      {photonState.photonModeEnabled && <SpectrumDisplay />}

      {/* Decay Mode Toggle */}
      <button
        onClick={toggleDecayMode}
        style={{
          position: 'absolute',
          top: 60,
          right: decayState.decayModeEnabled ? 340 : (photonState.photonModeEnabled ? 360 : 20),
          padding: '12px 20px',
          background: decayState.decayModeEnabled
            ? 'linear-gradient(135deg, rgba(255, 200, 0, 0.3), rgba(255, 100, 0, 0.3))'
            : 'rgba(255, 200, 0, 0.15)',
          border: decayState.decayModeEnabled
            ? '2px solid rgba(255, 200, 0, 0.6)'
            : '2px solid rgba(255, 200, 0, 0.3)',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          zIndex: 101,
          transition: 'all 0.3s ease',
          boxShadow: decayState.decayModeEnabled
            ? '0 0 25px rgba(255, 200, 0, 0.4)'
            : 'none',
        }}
      >
        {decayState.decayModeEnabled ? '☢️ Decay Mode ON' : '☢️ Enable Decay Mode'}
      </button>

      {/* Decay Mode UI */}
      {decayState.decayModeEnabled && <DecayControls />}
      {decayState.decayModeEnabled && <DecayInfoPanel />}
      {decayState.decayModeEnabled && <TimeWarpControl />}

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
        {photonState.photonModeEnabled && <ExcitedElectronEffect />}
        {photonState.photonModeEnabled && <PhotoelectricEffect />}

        {/* Decay Animations */}
        {decayState.decayModeEnabled && <DecayAnimation />}

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
