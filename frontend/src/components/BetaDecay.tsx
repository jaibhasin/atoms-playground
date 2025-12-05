import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { DecayParticle } from '../hooks/useAtomStore'

interface BetaDecayProps {
    particle: DecayParticle
    onComplete: () => void
}

// Beta-minus decay: neutron → proton + electron + antineutrino
export default function BetaDecay({ particle, onComplete }: BetaDecayProps) {
    const electronRef = useRef<THREE.Group>(null)
    const antineutrinoRef = useRef<THREE.Mesh>(null)
    const burstRef = useRef<THREE.Mesh>(null)
    const spiralRef = useRef<THREE.Group>(null)
    const startTime = useRef(Date.now())

    const ANIMATION_DURATION = 3500 // 3.5 seconds

    useFrame(() => {
        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Easing for smooth motion
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
        const easedProgress = easeOutCubic(progress)

        // Electron moves outward with spiral motion
        if (electronRef.current) {
            const distance = easedProgress * 50
            const spiralRadius = 3 * (1 - easedProgress) // Spiral radius decreases as it moves
            const spiralAngle = elapsed * 0.015

            const velocity = particle.velocity
            electronRef.current.position.set(
                velocity[0] * distance + Math.cos(spiralAngle) * spiralRadius,
                velocity[1] * distance + Math.sin(spiralAngle) * spiralRadius,
                velocity[2] * distance
            )

            // Fade out
            electronRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                    child.material.opacity = 1 - progress * 0.5
                }
            })
        }

        // Antineutrino (ghost particle) moves in opposite direction
        if (antineutrinoRef.current) {
            const distance = easedProgress * 35
            const velocity = particle.velocity
            antineutrinoRef.current.position.set(
                -velocity[0] * distance * 0.7,
                -velocity[1] * distance * 0.7,
                -velocity[2] * distance * 0.7
            )

            // Ghostly fade effect
            const mat = antineutrinoRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = (1 - progress) * 0.3

            // Pulse effect
            const pulse = Math.sin(elapsed * 0.02) * 0.3 + 1
            antineutrinoRef.current.scale.setScalar(pulse)
        }

        // Initial burst
        if (burstRef.current) {
            const burstProgress = Math.min(elapsed / 400, 1)
            burstRef.current.scale.setScalar(burstProgress * 6)
            const mat = burstRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = (1 - burstProgress) * 0.7
        }

        // Spiral trail
        if (spiralRef.current) {
            spiralRef.current.rotation.z = elapsed * 0.01
        }
    })

    return (
        <>
            {/* Initial burst at conversion point */}
            <mesh ref={burstRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color="#00ccff"
                    transparent
                    opacity={0.7}
                    toneMapped={false}
                />
            </mesh>

            {/* Electron with energy spiral trail */}
            <group ref={electronRef}>
                {/* Electron core */}
                <mesh>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial
                        color="#00ccff"
                        emissive="#00ccff"
                        emissiveIntensity={5}
                        toneMapped={false}
                    />
                </mesh>

                {/* Electron glow */}
                <mesh>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial
                        color="#00ddff"
                        transparent
                        opacity={0.4}
                        toneMapped={false}
                    />
                </mesh>

                {/* Spiral energy trail */}
                <group ref={spiralRef}>
                    {[...Array(8)].map((_, i) => {
                        const angle = (i / 8) * Math.PI * 2
                        const radius = 0.8
                        return (
                            <mesh
                                key={i}
                                position={[
                                    Math.cos(angle) * radius,
                                    Math.sin(angle) * radius,
                                    -i * 0.3
                                ]}
                            >
                                <sphereGeometry args={[0.08, 8, 8]} />
                                <meshBasicMaterial
                                    color="#00aaff"
                                    transparent
                                    opacity={0.6 - i * 0.07}
                                    toneMapped={false}
                                />
                            </mesh>
                        )
                    })}
                </group>

                <pointLight color="#00ccff" intensity={8} distance={6} decay={2} />
            </group>

            {/* Antineutrino (ghost particle) */}
            <mesh ref={antineutrinoRef}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    toneMapped={false}
                />
            </mesh>
        </>
    )
}
