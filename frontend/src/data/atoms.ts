import type { AtomProfile } from './iron'
import {
  hydrogenEnergyData,
  heliumEnergyData,
  carbonEnergyData,
  oxygenEnergyData,
  ironEnergyData,
  goldEnergyData
} from './energy-levels'

const BOHR_RADIUS = 5
const BASE_ANGULAR_VELOCITY = 0.45

export const atomsDatabase: Record<string, AtomProfile> = {
  hydrogen: {
    name: 'Hydrogen',
    symbol: 'H',
    atomicNumber: 1,
    neutrons: 0,
    shells: [
      { electrons: 1, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY, tilt: 0 }
    ],
    energyData: hydrogenEnergyData
  },

  helium: {
    name: 'Helium',
    symbol: 'He',
    atomicNumber: 2,
    neutrons: 2,
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY, tilt: 0 }
    ],
    energyData: heliumEnergyData
  },

  carbon: {
    name: 'Carbon',
    symbol: 'C',
    atomicNumber: 6,
    neutrons: 6,
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 4, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 }
    ],
    energyData: carbonEnergyData
  },

  oxygen: {
    name: 'Oxygen',
    symbol: 'O',
    atomicNumber: 8,
    neutrons: 8,
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 6, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 }
    ],
    energyData: oxygenEnergyData
  },

  iron: {
    name: 'Iron',
    symbol: 'Fe',
    atomicNumber: 26,
    neutrons: 30,
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 8, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 },
      { electrons: 14, radius: BOHR_RADIUS * 2.6, angularVelocity: BASE_ANGULAR_VELOCITY / 3 ** 2, tilt: 0.35 },
      { electrons: 2, radius: BOHR_RADIUS * 3.6, angularVelocity: BASE_ANGULAR_VELOCITY / 4 ** 2, tilt: -0.45 }
    ],
    energyData: ironEnergyData
  },

  gold: {
    name: 'Gold',
    symbol: 'Au',
    atomicNumber: 79,
    neutrons: 118,
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 0.8, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.1 },
      { electrons: 8, radius: BOHR_RADIUS * 1.4, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.2 },
      { electrons: 18, radius: BOHR_RADIUS * 2.0, angularVelocity: BASE_ANGULAR_VELOCITY / 3 ** 2, tilt: 0.3 },
      { electrons: 32, radius: BOHR_RADIUS * 2.8, angularVelocity: BASE_ANGULAR_VELOCITY / 4 ** 2, tilt: -0.4 },
      { electrons: 18, radius: BOHR_RADIUS * 3.6, angularVelocity: BASE_ANGULAR_VELOCITY / 5 ** 2, tilt: 0.5 },
      { electrons: 1, radius: BOHR_RADIUS * 4.4, angularVelocity: BASE_ANGULAR_VELOCITY / 6 ** 2, tilt: -0.6 }
    ],
    energyData: goldEnergyData
  }
}

export const getAtom = (symbol: string): AtomProfile | undefined => {
  return atomsDatabase[symbol.toLowerCase()]
}
