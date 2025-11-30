import { create } from 'zustand'
import type { AtomProfile } from '../data/iron'
import { atomsDatabase } from '../data/atoms'

interface AtomStore {
  currentAtom: AtomProfile
  setAtom: (symbol: string) => void
}

export const useAtomStore = create<AtomStore>((set) => ({
  currentAtom: atomsDatabase.iron,
  setAtom: (symbol: string) => {
    const atom = atomsDatabase[symbol.toLowerCase()]
    if (atom) {
      set({ currentAtom: atom })
    }
  }
}))
