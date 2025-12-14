import { describe, it, expect } from 'vitest'
import {
    wavelengthToEnergy,
    energyToWavelength,
    determineInteractionType
} from './photon-physics'
import { atomsDatabase } from '../data/atoms'

describe('Photon Physics Utils', () => {
    describe('wavelengthToEnergy', () => {
        it('calculates energy correctly for visible light (500nm)', () => {
            const energy = wavelengthToEnergy(500)
            // 500nm is cyan/green, approx 2.48 eV
            expect(energy).toBeCloseTo(2.48, 1)
        })

        it('calculates energy correctly for UV (200nm)', () => {
            const energy = wavelengthToEnergy(200)
            // 200nm should have higher energy
            expect(energy).toBeCloseTo(6.20, 1)
        })
    })

    describe('energyToWavelength', () => {
        it('converts energy back to wavelength', () => {
            const originalWavelength = 550 // nm
            const energy = wavelengthToEnergy(originalWavelength)
            const calculatedWavelength = energyToWavelength(energy)

            expect(calculatedWavelength).toBeCloseTo(originalWavelength, 3)
        })
    })

    describe('determineInteractionType', () => {
        // Hydrogen ionization energy is ~13.6 eV
        const hydrogenAtom = atomsDatabase.hydrogen.energyData!

        it('identifies photoelectric effect when energy > ionization', () => {
            const highEnergy = 15.0 // eV
            const type = determineInteractionType(highEnergy, hydrogenAtom)
            expect(type).toBe('photoelectric')
        })

        it('identifies excitation when energy matches a transition', () => {
            // H: n=1 to n=2 is ~10.2 eV (Lyman-alpha, 121.6nm)
            // Check the exact value in our data if possible, or assume standard physics
            // Our determineInteractionType uses a tolerance of 0.1 eV

            // Let's find a valid transition from the data
            const transition = hydrogenAtom.allowedTransitions[0]
            const type = determineInteractionType(transition.energy, hydrogenAtom)
            expect(type).toBe('excitation')
        })

        it('returns none for non-matching energy', () => {
            const mismatchEnergy = 5.0 // eV, too low for H excitation
            const type = determineInteractionType(mismatchEnergy, hydrogenAtom)
            expect(type).toBe('none')
        })
    })
})
