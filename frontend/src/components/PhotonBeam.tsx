import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAtomStore } from '../hooks/useAtomStore'
import { wavelengthToRGB } from '../utils/photon-physics'
import * as THREE from 'three'

export default function PhotonBeam() {
    const { photonState } = useAtomStore()
    const { wavelength, intensity, isLightOn } = photonState

    const beamRef = useRef<THREE.Mesh>(null)
    const particlesRef = useRef<THREE.Points>(null)

    // Get color from wavelength
    const [r, g, b] = wavelengthToRGB(wavelength)
    const color = useMemo(() => new THREE.Color(r, g, b), [r, g, b])

    // Create photon particles
    const particleCount = isLightOn ? Math.floor(intensity * 100) : 0
    const particlePositions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = -30 + Math.random() * 10      // x
            positions[i * 3 + 1] = 25 + Math.random() * 10   // y
            positions[i * 3 + 2] = -5 + Math.random() * 10   // z
        }
        return positions
    }, [particleCount])

    // Animate particles flowing toward atom
    useFrame((state) => {
        if (particlesRef.current && isLightOn) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

            for (let i = 0; i < particleCount; i++) {
                // Move toward center (0, 0, 0)
                positions[i * 3] += 0.3      // x
                positions[i * 3 + 1] -= 0.3  // y

                // Reset if particle reaches atom
                if (positions[i * 3] > -5 && positions[i * 3 + 1] < 5) {
                    positions[i * 3] = -30 + Math.random() * 10
                    positions[i * 3 + 1] = 25 + Math.random() * 10
                    positions[i * 3 + 2] = -5 + Math.random() * 10
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true
        }

        // Pulse effect
        if (beamRef.current && isLightOn) {
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9
            const material = beamRef.current.material as THREE.MeshBasicMaterial
            material.opacity = intensity * pulse * 0.3
        }
    })

    if (!isLightOn || !photonState.photonModeEnabled) return null

    return (
        <group>
            {/* Cone beam  */}
            <mesh ref={beamRef} position={[-15, 12, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[8, 30, 32, 1, true]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={intensity * 0.2}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Photon particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={particlePositions}
                        itemSize={3}
                        args={[particlePositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.3}
                    color={color}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>

            {/* Directional  light matching photon color */}
            <directionalLight
                position={[-20, 15, 0]}
                intensity={intensity * 2}
                color={color}
            />
        </group>
    )
}
