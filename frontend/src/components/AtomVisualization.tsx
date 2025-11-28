import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import Nucleus from './Nucleus'
import ElectronShells from './ElectronShells'
import { useAtomStore } from '../hooks/useAtomStore'

interface AtomVisualizationProps {
  rotationSpeed: number
  glowIntensity: number
}

export default function AtomVisualization({ rotationSpeed, glowIntensity }: AtomVisualizationProps) {
  const groupRef = useRef<Group>(null)
  const currentAtom = useAtomStore((state) => state.currentAtom)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 * rotationSpeed
    }
  })

  return (
    <group ref={groupRef}>
      <Nucleus 
        protons={currentAtom.atomicNumber} 
        neutrons={currentAtom.neutrons}
        glowIntensity={glowIntensity}
      />
      <ElectronShells 
        shells={currentAtom.shells} 
        rotationSpeed={rotationSpeed}
        glowIntensity={glowIntensity}
      />
    </group>
  )
}
