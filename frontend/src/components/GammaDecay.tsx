import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { DecayParticle } from '../hooks/useAtomStore'

interface GammaDecayProps {
    particle: DecayParticle
    onComplete: () => void
}

// Gamma decay: nucleus releases high-energy photon, no particle change
export default function GammaDecay({ particle, onComplete }: GammaDecayProps) {
    const flashRef = useRef<THREE.Mesh>(null)
    const ring1Ref = useRef<THREE.Mesh>(null)
    const ring2Ref = useRef<THREE.Mesh>(null)
    const ring3Ref = useRef<THREE.Mesh>(null)
    const photonRef = useRef<THREE.Mesh>(null)
    const startTime = useRef(Date.now())

    const ANIMATION_DURATION = 2500 // 2.5 seconds

    useFrame(() => {
        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Central flash (bright and quick)
        if (flashRef.current) {
            const flashProgress = Math.min(elapsed / 200, 1)
            const flashScale = flashProgress < 0.5
                ? flashProgress * 2 * 15
                : (1 - (flashProgress - 0.5) * 2) * 15
            flashRef.current.scale.setScalar(Math.max(0.1, flashScale))

            const mat = flashRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = flashProgress < 0.5 ? 1 : (1 - (flashProgress - 0.5) * 2) * 0.8
        }

        // Expanding rings at different speeds (gamma ray wave visualization)
        const rings = [ring1Ref, ring2Ref, ring3Ref]
        rings.forEach((ringRef, i) => {
            if (ringRef.current) {
                const delay = i * 150 // Stagger the rings
                const ringElapsed = Math.max(0, elapsed - delay)
                const ringProgress = Math.min(ringElapsed / 1500, 1)

                const scale = ringProgress * 30 * (1 + i * 0.3)
                ringRef.current.scale.set(scale, scale, 1)

                const mat = ringRef.current.material as THREE.MeshBasicMaterial
                mat.opacity = (1 - ringProgress) * (0.8 - i * 0.2)
            }
        })

        // Photon particle shooting outward
        if (photonRef.current) {
            const photonProgress = Math.min(elapsed / 1500, 1)
            const distance = photonProgress * 60
            const velocity = particle.velocity

            photonRef.current.position.set(
                velocity[0] * distance,
                velocity[1] * distance,
                velocity[2] * distance
            )

            // Pulse effect
            const pulse = Math.sin(elapsed * 0.05) * 0.3 + 1
            photonRef.current.scale.setScalar(pulse)

            const mat = photonRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = (1 - photonProgress * 0.5)
        }
    })

    return (
        <>
            {/* Central flash */}
            <mesh ref={flashRef}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={1}
                    toneMapped={false}
                />
            </mesh>

            {/* Expanding gamma ray rings */}
            <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 1, 64]} />
                <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>

            <mesh ref={ring2Ref} rotation={[0, 0, 0]}>
                <ringGeometry args={[0.9, 1, 64]} />
                <meshBasicMaterial
                    color="#00ff88"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>

            <mesh ref={ring3Ref} rotation={[0, Math.PI / 2, 0]}>
                <ringGeometry args={[0.9, 1, 64]} />
                <meshBasicMaterial
                    color="#88ff00"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>

            {/* Gamma photon */}
            <mesh ref={photonRef}>
                <octahedronGeometry args={[0.4, 0]} />
                <meshBasicMaterial
                    color="#00ff44"
                    transparent
                    opacity={0.9}
                    toneMapped={false}
                />
                <pointLight color="#00ff00" intensity={15} distance={10} decay={2} />
            </mesh>
        </>
    )
}
