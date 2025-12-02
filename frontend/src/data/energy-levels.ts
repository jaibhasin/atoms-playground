export interface EnergyLevel {
  shell: number          // Principal quantum number (n = 1, 2, 3...)
  subshell: string       // 's', 'p', 'd', 'f'
  energy: number         // Energy in eV (negative, relative to ionization)
  electrons: number      // Number of electrons in this level
}

export interface Transition {
  fromShell: number
  toShell: number
  wavelength: number     // in nanometers
  energy: number         // in eV
}

export interface AtomEnergyData {
  symbol: string
  groundStateEnergy: number      // Lowest energy state in eV
  ionizationEnergy: number       // Work function (energy to remove electron) in eV
  energyLevels: EnergyLevel[]
  allowedTransitions: Transition[]
}

// Energy level data for supported elements
// Values are approximations based on spectroscopic data

export const hydrogenEnergyData: AtomEnergyData = {
  symbol: 'H',
  groundStateEnergy: -13.6,      // eV
  ionizationEnergy: 13.6,        // eV
  energyLevels: [
    { shell: 1, subshell: 's', energy: -13.6, electrons: 1 }
  ],
  allowedTransitions: [
    // Lyman series (UV)
    { fromShell: 2, toShell: 1, wavelength: 121.6, energy: 10.2 },
    { fromShell: 3, toShell: 1, wavelength: 102.6, energy: 12.1 },
    // Balmer series (visible)
    { fromShell: 3, toShell: 2, wavelength: 656.3, energy: 1.89 },  // H-alpha (red)
    { fromShell: 4, toShell: 2, wavelength: 486.1, energy: 2.55 },  // H-beta (blue-green)
    { fromShell: 5, toShell: 2, wavelength: 434.0, energy: 2.86 },  // H-gamma (blue)
  ]
}

export const heliumEnergyData: AtomEnergyData = {
  symbol: 'He',
  groundStateEnergy: -24.6,
  ionizationEnergy: 24.6,        // First ionization energy
  energyLevels: [
    { shell: 1, subshell: 's', energy: -24.6, electrons: 2 }
  ],
  allowedTransitions: [
    { fromShell: 2, toShell: 1, wavelength: 58.4, energy: 21.2 },
    { fromShell: 3, toShell: 2, wavelength: 587.6, energy: 2.11 },  // Yellow line
    { fromShell: 4, toShell: 2, wavelength: 471.3, energy: 2.63 },  // Blue line
  ]
}

export const carbonEnergyData: AtomEnergyData = {
  symbol: 'C',
  groundStateEnergy: -11.3,
  ionizationEnergy: 11.3,
  energyLevels: [
    { shell: 1, subshell: 's', energy: -11.3, electrons: 2 },
    { shell: 2, subshell: 's', energy: -4.6, electrons: 2 },
    { shell: 2, subshell: 'p', energy: -3.2, electrons: 2 }
  ],
  allowedTransitions: [
    { fromShell: 2, toShell: 1, wavelength: 165.7, energy: 7.48 },  // UV
    { fromShell: 3, toShell: 2, wavelength: 247.9, energy: 5.0 },   // UV
  ]
}

export const oxygenEnergyData: AtomEnergyData = {
  symbol: 'O',
  groundStateEnergy: -13.6,
  ionizationEnergy: 13.6,
  energyLevels: [
    { shell: 1, subshell: 's', energy: -13.6, electrons: 2 },
    { shell: 2, subshell: 's', energy: -5.2, electrons: 2 },
    { shell: 2, subshell: 'p', energy: -3.1, electrons: 4 }
  ],
  allowedTransitions: [
    { fromShell: 2, toShell: 1, wavelength: 130.4, energy: 9.5 },   // UV
    { fromShell: 3, toShell: 2, wavelength: 777.4, energy: 1.59 },  // Near IR (red)
    { fromShell: 3, toShell: 2, wavelength: 844.6, energy: 1.47 },  // Near IR
  ]
}

export const ironEnergyData: AtomEnergyData = {
  symbol: 'Fe',
  groundStateEnergy: -7.9,
  ionizationEnergy: 7.9,
  energyLevels: [
    { shell: 1, subshell: 's', energy: -7.9, electrons: 2 },
    { shell: 2, subshell: 's', energy: -4.8, electrons: 2 },
    { shell: 2, subshell: 'p', energy: -4.2, electrons: 6 },
    { shell: 3, subshell: 's', energy: -2.3, electrons: 2 },
    { shell: 3, subshell: 'p', energy: -1.8, electrons: 6 },
    { shell: 3, subshell: 'd', energy: -1.2, electrons: 6 },
    { shell: 4, subshell: 's', energy: -0.6, electrons: 2 }
  ],
  allowedTransitions: [
    { fromShell: 2, toShell: 1, wavelength: 248.3, energy: 4.99 },  // UV
    { fromShell: 3, toShell: 2, wavelength: 371.9, energy: 3.33 },  // UV
    { fromShell: 4, toShell: 3, wavelength: 438.4, energy: 2.83 },  // Blue
    { fromShell: 4, toShell: 3, wavelength: 527.0, energy: 2.35 },  // Green
  ]
}

export const goldEnergyData: AtomEnergyData = {
  symbol: 'Au',
  groundStateEnergy: -9.2,
  ionizationEnergy: 9.2,
  energyLevels: [
    { shell: 1, subshell: 's', energy: -9.2, electrons: 2 },
    { shell: 2, subshell: 's', energy: -5.5, electrons: 2 },
    { shell: 2, subshell: 'p', energy: -4.9, electrons: 6 },
    { shell: 3, subshell: 's', energy: -3.2, electrons: 2 },
    { shell: 3, subshell: 'p', energy: -2.8, electrons: 6 },
    { shell: 3, subshell: 'd', energy: -2.1, electrons: 10 },
    { shell: 4, subshell: 's', energy: -1.5, electrons: 2 },
    { shell: 4, subshell: 'p', energy: -1.2, electrons: 6 },
    { shell: 4, subshell: 'd', energy: -0.8, electrons: 10 },
    { shell: 5, subshell: 's', energy: -0.5, electrons: 2 },
    { shell: 5, subshell: 'p', energy: -0.3, electrons: 6 },
    { shell: 6, subshell: 's', energy: -0.1, electrons: 1 }
  ],
  allowedTransitions: [
    { fromShell: 2, toShell: 1, wavelength: 242.8, energy: 5.1 },   // UV
    { fromShell: 3, toShell: 2, wavelength: 267.6, energy: 4.63 },  // UV
    { fromShell: 4, toShell: 3, wavelength: 627.8, energy: 1.98 },  // Red-orange
  ]
}

// Map of all energy data by element symbol
export const energyDatabase: Record<string, AtomEnergyData> = {
  h: hydrogenEnergyData,
  hydrogen: hydrogenEnergyData,
  he: heliumEnergyData,
  helium: heliumEnergyData,
  c: carbonEnergyData,
  carbon: carbonEnergyData,
  o: oxygenEnergyData,
  oxygen: oxygenEnergyData,
  fe: ironEnergyData,
  iron: ironEnergyData,
  au: goldEnergyData,
  gold: goldEnergyData,
}

// Get energy data for a specific element
export const getEnergyData = (symbol: string): AtomEnergyData | undefined => {
  return energyDatabase[symbol.toLowerCase()]
}
