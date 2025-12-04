import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAtomStore } from '../hooks/useAtomStore'
import * as THREE from 'three'

export default function PhotoelectricEffect() {
    const { photonState, removeEjectedElectron } = useAtomStore()
    const { ejectedElectrons } = photonState

    return (
        <>
            {ejectedElectrons.map((ejectedElectron) => (
                <EjectedElectronParticle
                    key={ejectedElectron.id}
                    ejectedElectron={ejectedElectron}
                    onComplete={() => removeEjectedElectron(ejectedElectron.id)}
                />
            ))}
        </>
    )
}

interface EjectedElectronParticleProps {
    ejectedElectron: any
    onComplete: () => void
}

function EjectedElectronParticle({ ejectedElectron, onComplete }: EjectedElectronParticleProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const burstRef = useRef<THREE.Mesh>(null)
    const shockwaveRef = useRef<THREE.Mesh>(null)
    const startTime = useRef(Date.now())
    const EJECTION_DURATION = 3000 // 3 seconds before fading
    const [trailPoints] = useState<THREE.Vector3[]>([])

    const velocity = ejectedElectron.velocity || [1, 1, 1]
    const initialPosition = ejectedElectron.position || [0, 0, 0]

    useFrame(() => {
        if (!meshRef.current) return

        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / EJECTION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Move electron outward with acceleration
        const t = elapsed / 1000
        const accel = 1 + t * 0.5 // Accelerates over time
        meshRef.current.position.x = initialPosition[0] + velocity[0] * t * 8 * accel
        meshRef.current.position.y = initialPosition[1] + velocity[1] * t * 8 * accel
        meshRef.current.position.z = initialPosition[2] + velocity[2] * t * 8 * accel

        // Fade out
        const material = meshRef.current.material as THREE.MeshStandardMaterial
        material.opacity = 1 - progress

        // Pulse effect
        const pulse = Math.sin(t * 10) * 0.2 + 1
        meshRef.current.scale.setScalar(pulse)

        // Update trail
        if (trailPoints.length < 30) {
            trailPoints.push(meshRef.current.position.clone())
        }

        // Initial burst effect (first 0.5 seconds)
        if (burstRef.current && t < 0.5) {
            const burstScale = (t / 0.5) * 8
            burstRef.current.scale.setScalar(burstScale)
            const burstMat = burstRef.current.material as THREE.MeshBasicMaterial
            burstMat.opacity = 1 - (t / 0.5)
        }

        // Shockwave ring effect (first 1 second)
        if (shockwaveRef.current && t < 1) {
            const ringScale = (t / 1) * 15
            shockwaveRef.current.scale.set(ringScale, ringScale, 1)
            const ringMat = shockwaveRef.current.material as THREE.MeshBasicMaterial
            ringMat.opacity = (1 - (t / 1)) * 0.5
        }
    })

    return (
        <group>
            {/* Initial flash burst */}
            <mesh ref={burstRef} position={initialPosition as [number, number, number]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color="#ff0000"
                    transparent
                    opacity={1}
                    toneMapped={false}
                />
            </mesh>

            {/* Expanding shockwave ring */}
            <mesh ref={shockwaveRef} position={initialPosition as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1, 32]} />
                <meshBasicMaterial
                    color="#ff4444"
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>

            {/* Ejected electron with trail */}
            <mesh ref={meshRef} position={initialPosition as [number, number, number]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial
                    color="#ff4444"
                    emissive="#ff0000"
                    emissiveIntensity={5}
                    transparent
                    opacity={1}
                    toneMapped={false}
                />
                {/* Bright point light */}
                <pointLight color="#ff0000" intensity={8} distance={5} decay={2} />
            </mesh>

            {/* Particle trail */}
            {trailPoints.length > 1 && (
                <primitive
                    object={
                        new THREE.Line(
                            new THREE.BufferGeometry().setFromPoints(trailPoints),
                            new THREE.LineBasicMaterial({
                                color: '#ff4444',
                                transparent: true,
                                opacity: 0.6,
                                linewidth: 3,
                            })
                        )
                    }
                />
            )}

            {/* Spark particles along trail */}
            {trailPoints.slice(-10).map((point, i) => (
                <mesh key={i} position={point.toArray() as [number, number, number]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial
                        color="#ffaa00"
                        transparent
                        opacity={0.8 - i * 0.08}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    )
}
