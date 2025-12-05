import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import type { ElectronShell } from '../data/iron'
import ElectronOrbit from './ElectronOrbit'
import { useAtomStore } from '../hooks/useAtomStore'

interface ElectronShellsProps {
  shells: ElectronShell[]
  rotationSpeed: number
  glowIntensity: number
}

export default function ElectronShells({ shells, rotationSpeed, glowIntensity }: ElectronShellsProps) {
  const groupRef = useRef<Group>(null)
  const ionizationCount = useAtomStore((state) => state.photonState.ionizationCount)

  // Calculate electrons per shell after ionization
  // Electrons are removed from outermost shells first (like in real atoms)
  const shellElectronCounts = useMemo(() => {
    let remainingToRemove = ionizationCount
    const counts = [...shells.map(s => s.electrons)]

    // Remove from outer shells first (iterate in reverse)
    for (let i = counts.length - 1; i >= 0 && remainingToRemove > 0; i--) {
      const toRemove = Math.min(counts[i], remainingToRemove)
      counts[i] -= toRemove
      remainingToRemove -= toRemove
    }

    return counts
  }, [shells, ionizationCount])

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
          electronsToShow={shellElectronCounts[index]}
        />
      ))}
    </group>
  )
}
