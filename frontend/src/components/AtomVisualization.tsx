import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import Nucleus from './Nucleus'
import ElectronShells from './ElectronShells'
import { ironAtom } from '../data/iron'

interface AtomVisualizationProps {
  rotationSpeed: number
  glowIntensity: number
}

export default function AtomVisualization({ rotationSpeed, glowIntensity }: AtomVisualizationProps) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 * rotationSpeed
    }
  })

  return (
    <group ref={groupRef}>
      <Nucleus 
        protons={ironAtom.atomicNumber} 
        neutrons={ironAtom.neutrons}
        glowIntensity={glowIntensity}
      />
      <ElectronShells 
        shells={ironAtom.shells} 
        rotationSpeed={rotationSpeed}
        glowIntensity={glowIntensity}
      />
    </group>
  )
}
