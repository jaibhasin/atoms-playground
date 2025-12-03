import { useRef } from 'react'
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
    const trailRef = useRef<THREE.Line>(null)
    const startTime = useRef(Date.now())
    const EJECTION_DURATION = 3000 // 3 seconds before fading

    const velocity = ejectedElectron.velocity || [1, 1, 1]
    const initialPosition = ejectedElectron.position || [0, 0, 0]

    // Trail points
    const trailPoints = useRef<THREE.Vector3[]>([])
    const maxTrailLength = 20

    useFrame(() => {
        if (!meshRef.current) return

        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / EJECTION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Move electron outward
        const t = elapsed / 1000
        meshRef.current.position.x = initialPosition[0] + velocity[0] * t * 5
        meshRef.current.position.y = initialPosition[1] + velocity[1] * t * 5
        meshRef.current.position.z = initialPosition[2] + velocity[2] * t * 5

        // Fade out
        const material = meshRef.current.material as THREE.MeshStandardMaterial
        material.opacity = 1 - progress

        // Update trail
        trailPoints.current.push(meshRef.current.position.clone())
        if (trailPoints.current.length > maxTrailLength) {
            trailPoints.current.shift()
        }

        // Update trail geometry
        if (trailRef.current && trailPoints.current.length > 1) {
            const geometry = new THREE.BufferGeometry().setFromPoints(trailPoints.current)
            trailRef.current.geometry = geometry
        }
    })

    return (
        <group>
            {/* Ejected electron */}
            <mesh ref={meshRef} position={initialPosition as [number, number, number]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                    color="#ff4444"
                    emissive="#ff2222"
                    emissiveIntensity={3}
                    transparent
                    opacity={1}
                    toneMapped={false}
                />
                <pointLight color="#ff4444" intensity={3} distance={3} />
            </mesh>

            {/* Trail */}
            {trailPoints.current.length > 1 && (
                <primitive object={new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(trailPoints.current),
                    new THREE.LineBasicMaterial({ color: '#ff4444', transparent: true, opacity: 0.5 })
                )} />
            )}
        </group>
    )
}
