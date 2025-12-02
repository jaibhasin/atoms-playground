import type { AtomEnergyData, Transition } from '../data/energy-levels'

// Physical constants
export const PLANCK_CONSTANT = 6.62607015e-34  // J·s
export const SPEED_OF_LIGHT = 299792458        // m/s
export const ELECTRON_VOLT = 1.602176634e-19   // J/eV

/**
 * Convert wavelength (nm) to frequency (Hz)
 */
export function wavelengthToFrequency(wavelength: number): number {
    const wavelengthMeters = wavelength * 1e-9
    return SPEED_OF_LIGHT / wavelengthMeters
}

/**
 * Convert frequency (Hz) to photon energy (eV)
 */
export function frequencyToEnergy(frequency: number): number {
    const energyJoules = PLANCK_CONSTANT * frequency
    return energyJoules / ELECTRON_VOLT
}

/**
 * Convert wavelength (nm) to photon energy (eV)
 */
export function wavelengthToEnergy(wavelength: number): number {
    const frequency = wavelengthToFrequency(wavelength)
    return frequencyToEnergy(frequency)
}

/**
 * Convert photon energy (eV) to wavelength (nm)
 */
export function energyToWavelength(energy: number): number {
    const energyJoules = energy * ELECTRON_VOLT
    const frequency = energyJoules / PLANCK_CONSTANT
    const wavelengthMeters = SPEED_OF_LIGHT / frequency
    return wavelengthMeters * 1e9
}

/**
 * Convert wavelength (nm) to RGB color
 * Based on wavelength to color approximation
 */
export function wavelengthToRGB(wavelength: number): [number, number, number] {
    let r = 0, g = 0, b = 0

    if (wavelength >= 380 && wavelength < 440) {
        r = -(wavelength - 440) / (440 - 380)
        g = 0
        b = 1
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0
        g = (wavelength - 440) / (490 - 440)
        b = 1
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0
        g = 1
        b = -(wavelength - 510) / (510 - 490)
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510)
        g = 1
        b = 0
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1
        g = -(wavelength - 645) / (645 - 580)
        b = 0
    } else if (wavelength >= 645 && wavelength <= 780) {
        r = 1
        g = 0
        b = 0
    } else if (wavelength < 380) {
        // UV and below - show as violet
        r = 0.5
        g = 0
        b = 1
    } else {
        // IR and above - show as dark red
        r = 0.5
        g = 0
        b = 0
    }

    // Apply intensity fade near edges of visible spectrum
    let factor = 1.0
    if (wavelength >= 380 && wavelength < 420) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
    } else if (wavelength >= 700 && wavelength <= 780) {
        factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700)
    }

    r *= factor
    g *= factor
    b *= factor

    return [r, g, b]
}

/**
 * Check if photon energy can excite an electron in the atom
 */
export function canExciteElectron(photonEnergy: number, atom: AtomEnergyData): boolean {
    // Check if photon energy matches any allowed transition
    const tolerance = 0.1 // eV tolerance for matching
    return atom.allowedTransitions.some(
        transition => Math.abs(transition.energy - photonEnergy) < tolerance
    )
}

/**
 * Check if photon energy can cause photoelectric effect
 */
export function canCausePhotoelectricEffect(photonEnergy: number, atom: AtomEnergyData): boolean {
    return photonEnergy >= atom.ionizationEnergy
}

/**
 * Calculate kinetic energy of ejected electron (photoelectric effect)
 */
export function calculateKineticEnergy(photonEnergy: number, workFunction: number): number {
    return Math.max(0, photonEnergy - workFunction)
}

/**
 * Find possible transitions for a given photon energy
 */
export function findPossibleTransitions(
    photonEnergy: number,
    atom: AtomEnergyData,
    tolerance: number = 0.2
): Transition[] {
    return atom.allowedTransitions.filter(
        transition => Math.abs(transition.energy - photonEnergy) < tolerance
    )
}

/**
 * Get all emission wavelengths for an element (characteristic spectrum)
 */
export function getEmissionWavelengths(atom: AtomEnergyData): number[] {
    return atom.allowedTransitions.map(t => t.wavelength)
}

/**
 * Determine the type of photon-atom interaction
 */
export type InteractionType = 'none' | 'excitation' | 'photoelectric'

export function determineInteractionType(
    photonEnergy: number,
    atom: AtomEnergyData
): InteractionType {
    if (canCausePhotoelectricEffect(photonEnergy, atom)) {
        return 'photoelectric'
    } else if (canExciteElectron(photonEnergy, atom)) {
        return 'excitation'
    }
    return 'none'
}

/**
 * Get wavelength region name
 */
export function getWavelengthRegion(wavelength: number): string {
    if (wavelength < 0.01) return 'Gamma Ray'
    if (wavelength < 10) return 'X-Ray'
    if (wavelength < 380) return 'Ultraviolet'
    if (wavelength < 450) return 'Violet'
    if (wavelength < 495) return 'Blue'
    if (wavelength < 570) return 'Green'
    if (wavelength < 590) return 'Yellow'
    if (wavelength < 620) return 'Orange'
    if (wavelength < 750) return 'Red'
    if (wavelength < 1000000) return 'Infrared'
    if (wavelength < 1000000000) return 'Microwave'
    return 'Radio'
}

/**
 * Format energy value with appropriate units
 */
export function formatEnergy(energy: number): string {
    if (energy >= 1000) {
        return `${(energy / 1000).toFixed(2)} keV`
    }
    return `${energy.toFixed(2)} eV`
}

/**
 * Format wavelength with appropriate units
 */
export function formatWavelength(wavelength: number): string {
    if (wavelength < 1) {
        return `${(wavelength * 1000).toFixed(2)} pm`
    } else if (wavelength < 1000) {
        return `${wavelength.toFixed(1)} nm`
    } else if (wavelength < 1000000) {
        return `${(wavelength / 1000).toFixed(2)} μm`
    }
    return `${(wavelength / 1000000).toFixed(2)} mm`
}
