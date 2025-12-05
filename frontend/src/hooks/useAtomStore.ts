import { create } from 'zustand'
import type { AtomProfile } from '../data/iron'
import { atomsDatabase } from '../data/atoms'
import type { InteractionType } from '../utils/photon-physics'

export interface ExcitedElectron {
  id: string
  shellIndex: number
  electronIndex: number
  fromShell: number
  toShell: number
  timestamp: number
}

export interface EjectedElectron {
  id: string
  shellIndex: number
  electronIndex: number
  kineticEnergy: number
  position: [number, number, number]
  velocity: [number, number, number]
  timestamp: number
}

export interface EmittedPhoton {
  id: string
  wavelength: number
  position: [number, number, number]
  direction: [number, number, number]
  timestamp: number
}

export interface PhotonState {
  // Light source controls
  wavelength: number           // in nanometers (default 500nm - green)
  intensity: number            // 0-1 scale
  isLightOn: boolean

  // Current interaction state
  currentEffect: InteractionType
  excitedElectrons: ExcitedElectron[]
  ejectedElectrons: EjectedElectron[]
  emittedPhotons: EmittedPhoton[]

  // Ionization state - tracks permanently ejected electrons
  ionizationCount: number      // Number of electrons permanently removed from the atom

  // Display options
  showEnergyDiagram: boolean
  showSpectrum: boolean
  showCalculations: boolean

  // Photon mode enabled
  photonModeEnabled: boolean
}

interface AtomStore {
  currentAtom: AtomProfile
  setAtom: (symbol: string) => void

  // Photon state
  photonState: PhotonState
  setWavelength: (wavelength: number) => void
  setIntensity: (intensity: number) => void
  toggleLight: () => void
  setCurrentEffect: (effect: InteractionType) => void
  addExcitedElectron: (electron: ExcitedElectron) => void
  removeExcitedElectron: (id: string) => void
  addEjectedElectron: (electron: EjectedElectron) => void
  removeEjectedElectron: (id: string) => void
  addEmittedPhoton: (photon: EmittedPhoton) => void
  removeEmittedPhoton: (id: string) => void
  toggleEnergyDiagram: () => void
  toggleSpectrum: () => void
  toggleCalculations: () => void
  togglePhotonMode: () => void
  resetPhotonState: () => void

  // Ionization actions
  incrementIonization: () => void
  resetAtom: () => void
}

const initialPhotonState: PhotonState = {
  wavelength: 500,
  intensity: 0.5,
  isLightOn: false,
  currentEffect: 'none',
  excitedElectrons: [],
  ejectedElectrons: [],
  emittedPhotons: [],
  ionizationCount: 0,
  showEnergyDiagram: false,
  showSpectrum: false,
  showCalculations: true,
  photonModeEnabled: false,
}

export const useAtomStore = create<AtomStore>((set) => ({
  currentAtom: atomsDatabase.iron,
  setAtom: (symbol: string) => {
    const atom = atomsDatabase[symbol.toLowerCase()]
    if (atom) {
      set((state) => ({
        currentAtom: atom,
        // Reset ionization when switching atoms
        photonState: {
          ...state.photonState,
          ionizationCount: 0,
          ejectedElectrons: [],
          excitedElectrons: [],
          emittedPhotons: []
        }
      }))
    }
  },

  // Photon state
  photonState: initialPhotonState,

  setWavelength: (wavelength: number) =>
    set((state) => ({
      photonState: { ...state.photonState, wavelength }
    })),

  setIntensity: (intensity: number) =>
    set((state) => ({
      photonState: { ...state.photonState, intensity }
    })),

  toggleLight: () =>
    set((state) => ({
      photonState: { ...state.photonState, isLightOn: !state.photonState.isLightOn }
    })),

  setCurrentEffect: (effect: InteractionType) =>
    set((state) => ({
      photonState: { ...state.photonState, currentEffect: effect }
    })),

  addExcitedElectron: (electron: ExcitedElectron) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        excitedElectrons: [...state.photonState.excitedElectrons, electron]
      }
    })),

  removeExcitedElectron: (id: string) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        excitedElectrons: state.photonState.excitedElectrons.filter(e => e.id !== id)
      }
    })),

  addEjectedElectron: (electron: EjectedElectron) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        ejectedElectrons: [...state.photonState.ejectedElectrons, electron]
      }
    })),

  removeEjectedElectron: (id: string) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        ejectedElectrons: state.photonState.ejectedElectrons.filter(e => e.id !== id)
      }
    })),

  addEmittedPhoton: (photon: EmittedPhoton) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        emittedPhotons: [...state.photonState.emittedPhotons, photon]
      }
    })),

  removeEmittedPhoton: (id: string) =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        emittedPhotons: state.photonState.emittedPhotons.filter(p => p.id !== id)
      }
    })),

  toggleEnergyDiagram: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        showEnergyDiagram: !state.photonState.showEnergyDiagram
      }
    })),

  toggleSpectrum: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        showSpectrum: !state.photonState.showSpectrum
      }
    })),

  toggleCalculations: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        showCalculations: !state.photonState.showCalculations
      }
    })),

  togglePhotonMode: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        photonModeEnabled: !state.photonState.photonModeEnabled
      }
    })),

  resetPhotonState: () =>
    set({ photonState: initialPhotonState }),

  // Ionization actions
  incrementIonization: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        ionizationCount: state.photonState.ionizationCount + 1
      }
    })),

  resetAtom: () =>
    set((state) => ({
      photonState: {
        ...state.photonState,
        ionizationCount: 0,
        ejectedElectrons: [],
        excitedElectrons: [],
        emittedPhotons: []
      }
    })),
}))
