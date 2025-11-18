export type ElectronShell = {
  electrons: number
  radius: number
  angularVelocity: number
  tilt: number
}

export type AtomProfile = {
  name: string
  symbol: string
  atomicNumber: number
  neutrons: number
  shells: ElectronShell[]
}

const BOHR_RADIUS = 5
const BASE_ANGULAR_VELOCITY = 0.45

const shells: ElectronShell[] = [
  { electrons: 2, radius: BOHR_RADIUS * 1, angularVelocity: BASE_ANGULAR_VELOCITY / 1 ** 2, tilt: 0.15 },
  { electrons: 8, radius: BOHR_RADIUS * 1.8, angularVelocity: BASE_ANGULAR_VELOCITY / 2 ** 2, tilt: -0.25 },
  { electrons: 14, radius: BOHR_RADIUS * 2.6, angularVelocity: BASE_ANGULAR_VELOCITY / 3 ** 2, tilt: 0.35 },
  { electrons: 2, radius: BOHR_RADIUS * 3.6, angularVelocity: BASE_ANGULAR_VELOCITY / 4 ** 2, tilt: -0.45 },
]

export const ironAtom: AtomProfile = {
  name: 'Iron',
  symbol: 'Fe',
  atomicNumber: 26,
  neutrons: 30,
  shells,
}
