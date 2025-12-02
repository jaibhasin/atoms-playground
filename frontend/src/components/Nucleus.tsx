import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Group } from 'three'

interface NucleusProps {
  protons: number
  neutrons: number
  glowIntensity: number
}

export default function Nucleus({ protons, neutrons, glowIntensity }: NucleusProps) {
  const groupRef = useRef<Group>(null)

  const particles = useMemo(() => {
    const positions: { pos: Vector3; isProton: boolean }[] = []
    const total = protons + neutrons
    const radius = Math.max(1.5, Math.log(total) * 0.8)

    // Fibonacci sphere distribution for even particle placement
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(-1 + (2 * i) / total)
      const theta = Math.sqrt(total * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      positions.push({
        pos: new Vector3(x, y, z),
        isProton: i < protons
      })
    }

    return positions
  }, [protons, neutrons])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  const nucleusRadius = Math.max(2, Math.log(protons + neutrons) * 1.2)

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.pos}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color={particle.isProton ? '#ff2255' : '#2255ff'}
            emissive={particle.isProton ? '#ff2255' : '#2255ff'}
            emissiveIntensity={0.8 * glowIntensity}
            metalness={0.9}
            roughness={0.1}
            toneMapped={false}
            envMapIntensity={1}
          />
          {/* Individual particle glow */}
          <mesh>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshBasicMaterial
              color={particle.isProton ? '#ff4477' : '#4477ff'}
              transparent
              opacity={0.2 * glowIntensity}
            />
          </mesh>
        </mesh>
      ))}

      {/* Nucleus energy field */}
      <mesh>
        <sphereGeometry args={[nucleusRadius, 32, 32]} />
        <meshBasicMaterial
          color="#ff44aa"
          transparent
          opacity={0.08 * glowIntensity}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[nucleusRadius * 0.6, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.15 * glowIntensity}
        />
      </mesh>
    </group>
  )
}
