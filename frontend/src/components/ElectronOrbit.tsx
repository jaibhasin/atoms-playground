import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import type { ElectronShell } from '../data/iron'

interface ElectronOrbitProps {
  shell: ElectronShell
  shellIndex: number
  rotationSpeed: number
  glowIntensity: number
  electronsToShow?: number  // Optional: if specified, only show this many electrons
}

export default function ElectronOrbit({ shell, shellIndex, rotationSpeed, glowIntensity, electronsToShow }: ElectronOrbitProps) {
  const orbitRef = useRef<Group>(null)

  // Use electronsToShow if provided, otherwise show all electrons in the shell
  const visibleElectrons = electronsToShow !== undefined ? electronsToShow : shell.electrons

  const electronPositions = useMemo(() => {
    const positions: Vector3[] = []
    // Still distribute based on full shell capacity for proper spacing
    for (let i = 0; i < visibleElectrons; i++) {
      const angle = (i / shell.electrons) * Math.PI * 2
      const x = Math.cos(angle) * shell.radius
      const z = Math.sin(angle) * shell.radius
      positions.push(new Vector3(x, 0, z))
    }
    return positions
  }, [shell, visibleElectrons])

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * shell.angularVelocity * rotationSpeed
    }
  })

  const orbitColor = ['#00ffff', '#00ff88', '#ffff00', '#ff8800'][shellIndex % 4]

  // Show dimmed orbit ring if shell is partially or fully empty
  const orbitOpacity = visibleElectrons === 0 ? 0.1 : 0.3

  return (
    <group rotation={[shell.tilt, 0, 0]}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[shell.radius, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={orbitColor}
          transparent
          opacity={orbitOpacity}
        />
      </mesh>

      {/* Electrons */}
      <group ref={orbitRef}>
        {electronPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={orbitColor}
              emissive={orbitColor}
              emissiveIntensity={glowIntensity}
              metalness={0.5}
              roughness={0.1}
            />

            {/* Electron glow */}
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshBasicMaterial
                color={orbitColor}
                transparent
                opacity={0.3 * glowIntensity}
              />
            </mesh>
          </mesh>
        ))}
      </group>
    </group>
  )
}
