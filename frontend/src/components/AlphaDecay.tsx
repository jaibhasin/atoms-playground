import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAtomStore, type DecayParticle } from '../hooks/useAtomStore'

interface AlphaDecayProps {
    particle: DecayParticle
    onComplete: () => void
}

// Alpha particle: 2 protons (red) + 2 neutrons (blue) = Helium-4 nucleus
export default function AlphaDecay({ particle, onComplete }: AlphaDecayProps) {
    const groupRef = useRef<THREE.Group>(null)
    const burstRef = useRef<THREE.Mesh>(null)
    const shockwaveRef = useRef<THREE.Mesh>(null)
    const trailRef = useRef<THREE.Mesh>(null)
    const startTime = useRef(Date.now())

    const ANIMATION_DURATION = 4000 // 4 seconds

    // Create positions for the 4 nucleons (2 protons + 2 neutrons)
    const nucleonPositions = useMemo(() => [
        { pos: new THREE.Vector3(0.3, 0.3, 0), isProton: true },
        { pos: new THREE.Vector3(-0.3, 0.3, 0), isProton: false },
        { pos: new THREE.Vector3(0.3, -0.3, 0), isProton: true },
        { pos: new THREE.Vector3(-0.3, -0.3, 0), isProton: false },
    ], [])

    useFrame(() => {
        if (!groupRef.current) return

        const elapsed = Date.now() - startTime.current
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

        if (progress >= 1) {
            onComplete()
            return
        }

        // Easing function for smooth motion
        const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)
        const easedProgress = easeOutQuad(progress)

        // Move outward with acceleration
        const distance = easedProgress * 40
        const velocity = particle.velocity
        groupRef.current.position.set(
            velocity[0] * distance,
            velocity[1] * distance,
            velocity[2] * distance
        )

        // Rotate the alpha particle cluster
        groupRef.current.rotation.y = elapsed * 0.003
        groupRef.current.rotation.x = elapsed * 0.002

        // Scale down and fade as it moves away
        const scale = 1 - progress * 0.3
        groupRef.current.scale.setScalar(scale)

        // Initial burst effect (first 0.3 seconds)
        if (burstRef.current) {
            const burstProgress = Math.min(elapsed / 300, 1)
            burstRef.current.scale.setScalar(burstProgress * 8)
            const burstMat = burstRef.current.material as THREE.MeshBasicMaterial
            burstMat.opacity = (1 - burstProgress) * 0.8
        }

        // Shockwave ring (first 1 second)
        if (shockwaveRef.current) {
            const ringProgress = Math.min(elapsed / 1000, 1)
            shockwaveRef.current.scale.set(ringProgress * 12, ringProgress * 12, 1)
            const ringMat = shockwaveRef.current.material as THREE.MeshBasicMaterial
            ringMat.opacity = (1 - ringProgress) * 0.6
        }

        // Energy trail
        if (trailRef.current) {
            const trailMat = trailRef.current.material as THREE.MeshBasicMaterial
            trailMat.opacity = (1 - progress) * 0.4
            trailRef.current.scale.set(1, Math.max(0.1, distance / 2), 1)
            // Point trail in the direction of motion
            trailRef.current.lookAt(
                velocity[0] * 100,
                velocity[1] * 100,
                velocity[2] * 100
            )
        }
    })

    return (
        <>
            {/* Initial energy burst at ejection point */}
            <mesh ref={burstRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color="#ffcc00"
                    transparent
                    opacity={0.8}
                    toneMapped={false}
                />
            </mesh>

            {/* Expanding shockwave ring */}
            <mesh ref={shockwaveRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1, 32]} />
                <meshBasicMaterial
                    color="#ffaa00"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>

            {/* Energy trail */}
            <mesh ref={trailRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.4, 1, 8]} />
                <meshBasicMaterial
                    color="#ffdd44"
                    transparent
                    opacity={0.4}
                    toneMapped={false}
                />
            </mesh>

            {/* Alpha particle cluster (He-4 nucleus) */}
            <group ref={groupRef}>
                {/* Core glow */}
                <mesh>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshBasicMaterial
                        color="#ffcc00"
                        transparent
                        opacity={0.3}
                        toneMapped={false}
                    />
                </mesh>

                {/* Individual nucleons */}
                {nucleonPositions.map((nucleon, i) => (
                    <mesh key={i} position={nucleon.pos}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial
                            color={nucleon.isProton ? '#ff2255' : '#2255ff'}
                            emissive={nucleon.isProton ? '#ff2255' : '#2255ff'}
                            emissiveIntensity={3}
                            metalness={0.8}
                            roughness={0.2}
                            toneMapped={false}
                        />
                    </mesh>
                ))}

                {/* Point light for glow effect */}
                <pointLight color="#ffcc00" intensity={10} distance={8} decay={2} />
            </group>
        </>
    )
}
