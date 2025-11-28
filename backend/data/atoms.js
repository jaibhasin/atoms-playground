const BOHR_RADIUS = 5
const BASE_ANGULAR_VELOCITY = 0.45

export const atomsData = {
  hydrogen: {
    name: 'Hydrogen',
    symbol: 'H',
    atomicNumber: 1,
    neutrons: 0,
    mass: 1.008,
    category: 'nonmetal',
    shells: [
      { electrons: 1, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY, tilt: 0 }
    ]
  },
  
  helium: {
    name: 'Helium',
    symbol: 'He',
    atomicNumber: 2,
    neutrons: 2,
    mass: 4.003,
    category: 'noble gas',
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY, tilt: 0 }
    ]
  },
  
  carbon: {
    name: 'Carbon',
    symbol: 'C',
    atomicNumber: 6,
    neutrons: 6,
    mass: 12.011,
    category: 'nonmetal',
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 4, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 }
    ]
  },
  
  oxygen: {
    name: 'Oxygen',
    symbol: 'O',
    atomicNumber: 8,
    neutrons: 8,
    mass: 15.999,
    category: 'nonmetal',
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 6, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 }
    ]
  },
  
  iron: {
    name: 'Iron',
    symbol: 'Fe',
    atomicNumber: 26,
    neutrons: 30,
    mass: 55.845,
    category: 'transition metal',
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
      { electrons: 8, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 },
      { electrons: 14, radius: BOHR_RADIUS * 2.6, angularVelocity: BASE_ANGULAR_VELOCITY / 3 ** 2, tilt: 0.35 },
      { electrons: 2, radius: BOHR_RADIUS * 3.6, angularVelocity: BASE_ANGULAR_VELOCITY / 4 ** 2, tilt: -0.45 }
    ]
  },
  
  gold: {
    name: 'Gold',
    symbol: 'Au',
    atomicNumber: 79,
    neutrons: 118,
    mass: 196.967,
    category: 'transition metal',
    shells: [
      { electrons: 2, radius: BOHR_RADIUS * 0.8, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.1 },
      { electrons: 8, radius: BOHR_RADIUS * 1.4, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.2 },
      { electrons: 18, radius: BOHR_RADIUS * 2.0, angularVelocity: BASE_ANGULAR_VELOCITY / 3 ** 2, tilt: 0.3 },
      { electrons: 32, radius: BOHR_RADIUS * 2.8, angularVelocity: BASE_ANGULAR_VELOCITY / 4 ** 2, tilt: -0.4 },
      { electrons: 18, radius: BOHR_RADIUS * 3.6, angularVelocity: BASE_ANGULAR_VELOCITY / 5 ** 2, tilt: 0.5 },
      { electrons: 1, radius: BOHR_RADIUS * 4.4, angularVelocity: BASE_ANGULAR_VELOCITY / 6 ** 2, tilt: -0.6 }
    ]
  }
}
