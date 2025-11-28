import { useMemo } from 'react'
import { Vector3 } from 'three'

interface NucleusProps {
  protons: number
  neutrons: number
  glowIntensity: number
}

export default function Nucleus({ protons, neutrons, glowIntensity }: NucleusProps) {
  const particles = useMemo(() => {
    const positions: { pos: Vector3; isProton: boolean }[] = []
    const total = protons + neutrons
    const radius = 2
    
    // Distribute particles in a sphere
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

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.pos}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color={particle.isProton ? '#ff3366' : '#3366ff'}
            emissive={particle.isProton ? '#ff3366' : '#3366ff'}
            emissiveIntensity={0.5 * glowIntensity}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Nucleus glow */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#ff6699" 
          transparent 
          opacity={0.1 * glowIntensity}
        />
      </mesh>
    </group>
  )
}
