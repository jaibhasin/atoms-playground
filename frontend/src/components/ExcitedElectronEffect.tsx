import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAtomStore } from '../hooks/useAtomStore'
import * as THREE from 'three'

export default function ExcitedElectronEffect() {
    const { photonState, currentAtom, removeExcitedElectron, addEmittedPhoton } = useAtomStore()
    const { excitedElectrons } = photonState

    return (
        <>
            {excitedElectrons.map((excitedElectron) => (
                <ExcitedElectronParticle
                    key={excitedElectron.id}
                    excitedElectron={excitedElectron}
                    currentAtom={currentAtom}
                    onComplete={() => {
                        removeExcitedElectron(excitedElectron.id)
                        // Add emitted photon when electron drops back down
                        addEmittedPhoton({
                            id: `photon-${Date.now()}-${Math.random()}`,
                            wavelength: 500, // Simplified - should match transition
                            position: [0, 0, 0],
                            direction: [
                                Math.random() - 0.5,
                                Math.random() - 0.5,
                                Math.random() - 0.5
                            ],
                            timestamp: Date.now()
                        })
                    }}
                />
            ))}
        </>
    )
}

interface ExcitedElectronParticleProps {
    excitedElectron: any
    currentAtom: any
    onComplete: () => void
}

function ExcitedElectronParticle({ excitedElectron, currentAtom, onComplete }: ExcitedElectronParticleProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const startTime = useRef(Date.now())
    const EXCITATION_DURATION = 2000 // 2 seconds in excited state

    const toShell = currentAtom.shells[excitedElectron.toShell - 1]

    useFrame((state) => {
        if (!meshRef.current) return

        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / EXCITATION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Pulse effect
        const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.2 + 1
        meshRef.current.scale.setScalar(pulse)

        // Orbit in excited state
        const angle = state.clock.elapsedTime * 2
        const radius = toShell?.radius || 10
        meshRef.current.position.x = Math.cos(angle) * radius
        meshRef.current.position.z = Math.sin(angle) * radius
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
                color="#ffaa00"
                emissive="#ff8800"
                emissiveIntensity={2}
                toneMapped={false}
            />
            {/* Glow effect */}
            <pointLight color="#ffaa00" intensity={2} distance={5} />
        </mesh>
    )
}
