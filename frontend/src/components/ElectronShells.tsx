import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import type { ElectronShell } from '../data/iron'
import ElectronOrbit from './ElectronOrbit'

interface ElectronShellsProps {
  shells: ElectronShell[]
  rotationSpeed: number
  glowIntensity: number
}

export default function ElectronShells({ shells, rotationSpeed, glowIntensity }: ElectronShellsProps) {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05 * rotationSpeed
    }
  })

  return (
    <group ref={groupRef}>
      {shells.map((shell, index) => (
        <ElectronOrbit 
          key={index}
          shell={shell}
          shellIndex={index}
          rotationSpeed={rotationSpeed}
          glowIntensity={glowIntensity}
        />
      ))}
    </group>
  )
}
