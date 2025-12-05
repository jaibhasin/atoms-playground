// Radioactive decay data for isotopes
// Includes alpha, beta, and gamma decay modes

export type DecayType = 'alpha' | 'beta-minus' | 'beta-plus' | 'gamma'

export interface DecayMode {
    type: DecayType
    probability: number           // Branching ratio (0-1)
    halfLife: number              // In seconds (for calculations)
    halfLifeDisplay: string       // Human-readable format
    energyReleased: number        // Energy in MeV
    daughterSymbol: string        // Resulting element symbol
    daughterName: string          // Resulting element name
    description: string           // Educational description
}

export interface RadioactiveIsotope {
    symbol: string
    name: string
    massNumber: number            // A = protons + neutrons
    atomicNumber: number          // Z = protons
    neutrons: number
    isRadioactive: boolean
    decayModes: DecayMode[]
}

// Decay mode definitions for each radioactive isotope
export const radioactiveIsotopes: Record<string, RadioactiveIsotope> = {
    // Uranium-238: Classic alpha emitter
    'uranium-238': {
        symbol: 'U',
        name: 'Uranium-238',
        massNumber: 238,
        atomicNumber: 92,
        neutrons: 146,
        isRadioactive: true,
        decayModes: [
            {
                type: 'alpha',
                probability: 1.0,
                halfLife: 1.41e17,  // 4.468 billion years in seconds
                halfLifeDisplay: '4.5 billion years',
                energyReleased: 4.27,
                daughterSymbol: 'Th',
                daughterName: 'Thorium-234',
                description: 'Emits an alpha particle (2 protons + 2 neutrons), transforming into Thorium-234'
            }
        ]
    },

    // Thorium-234: Daughter of U-238, beta emitter
    'thorium-234': {
        symbol: 'Th',
        name: 'Thorium-234',
        massNumber: 234,
        atomicNumber: 90,
        neutrons: 144,
        isRadioactive: true,
        decayModes: [
            {
                type: 'beta-minus',
                probability: 1.0,
                halfLife: 2.08e6,  // 24.1 days in seconds
                halfLifeDisplay: '24.1 days',
                energyReleased: 0.27,
                daughterSymbol: 'Pa',
                daughterName: 'Protactinium-234',
                description: 'A neutron converts to a proton, emitting an electron (beta particle) and antineutrino'
            }
        ]
    },

    // Radium-226: Famous alpha emitter discovered by Marie Curie
    'radium-226': {
        symbol: 'Ra',
        name: 'Radium-226',
        massNumber: 226,
        atomicNumber: 88,
        neutrons: 138,
        isRadioactive: true,
        decayModes: [
            {
                type: 'alpha',
                probability: 1.0,
                halfLife: 5.05e10,  // 1,600 years in seconds
                halfLifeDisplay: '1,600 years',
                energyReleased: 4.87,
                daughterSymbol: 'Rn',
                daughterName: 'Radon-222',
                description: 'Emits an alpha particle, transforming into radioactive Radon gas'
            }
        ]
    },

    // Carbon-14: Used in radiocarbon dating
    'carbon-14': {
        symbol: 'C',
        name: 'Carbon-14',
        massNumber: 14,
        atomicNumber: 6,
        neutrons: 8,
        isRadioactive: true,
        decayModes: [
            {
                type: 'beta-minus',
                probability: 1.0,
                halfLife: 1.81e11,  // 5,730 years in seconds
                halfLifeDisplay: '5,730 years',
                energyReleased: 0.156,
                daughterSymbol: 'N',
                daughterName: 'Nitrogen-14',
                description: 'Used in radiocarbon dating - a neutron becomes a proton, emitting an electron'
            }
        ]
    },

    // Cobalt-60: Medical/industrial isotope with gamma emission
    'cobalt-60': {
        symbol: 'Co',
        name: 'Cobalt-60',
        massNumber: 60,
        atomicNumber: 27,
        neutrons: 33,
        isRadioactive: true,
        decayModes: [
            {
                type: 'beta-minus',
                probability: 0.999,
                halfLife: 1.66e8,  // 5.27 years in seconds
                halfLifeDisplay: '5.27 years',
                energyReleased: 0.318,
                daughterSymbol: 'Ni',
                daughterName: 'Nickel-60*',
                description: 'Beta decay followed by gamma ray emission - used in cancer treatment'
            },
            {
                type: 'gamma',
                probability: 1.0,  // Always follows beta decay
                halfLife: 1.66e8,
                halfLifeDisplay: '5.27 years',
                energyReleased: 2.50,  // Two gamma rays: 1.17 + 1.33 MeV
                daughterSymbol: 'Ni',
                daughterName: 'Nickel-60',
                description: 'High-energy gamma rays emitted as nucleus de-excites'
            }
        ]
    },

    // Polonium-210: Highly radioactive alpha emitter
    'polonium-210': {
        symbol: 'Po',
        name: 'Polonium-210',
        massNumber: 210,
        atomicNumber: 84,
        neutrons: 126,
        isRadioactive: true,
        decayModes: [
            {
                type: 'alpha',
                probability: 1.0,
                halfLife: 1.20e7,  // 138.4 days in seconds
                halfLifeDisplay: '138 days',
                energyReleased: 5.41,
                daughterSymbol: 'Pb',
                daughterName: 'Lead-206',
                description: 'Emits a high-energy alpha particle, becoming stable Lead-206'
            }
        ]
    }
}

// Helper to get decay info
export function getDecayInfo(isotope: string): RadioactiveIsotope | undefined {
    return radioactiveIsotopes[isotope.toLowerCase()]
}

// Get primary decay mode for an isotope
export function getPrimaryDecay(isotope: string): DecayMode | undefined {
    const data = radioactiveIsotopes[isotope.toLowerCase()]
    if (!data || data.decayModes.length === 0) return undefined
    return data.decayModes.reduce((primary, mode) =>
        mode.probability > primary.probability ? mode : primary
    )
}

// Decay type display names
export const decayTypeNames: Record<DecayType, string> = {
    'alpha': 'Alpha (α)',
    'beta-minus': 'Beta⁻ (β⁻)',
    'beta-plus': 'Beta⁺ (β⁺)',
    'gamma': 'Gamma (γ)'
}

// Decay type colors for visualization
export const decayTypeColors: Record<DecayType, string> = {
    'alpha': '#ffcc00',      // Yellow/gold for alpha
    'beta-minus': '#00ccff', // Cyan for beta-minus
    'beta-plus': '#ff66ff',  // Magenta for beta-plus
    'gamma': '#00ff00'       // Green for gamma
}
