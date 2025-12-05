import { useAtomStore } from '../hooks/useAtomStore'
import { atomsDatabase } from '../data/atoms'

export default function AtomSelector() {
  const setAtom = useAtomStore((state) => state.setAtom)
  const currentAtom = useAtomStore((state) => state.currentAtom)

  const atoms = Object.keys(atomsDatabase)

  // Separate stable and radioactive atoms
  const stableAtoms = atoms.filter(key => !atomsDatabase[key].isRadioactive)
  const radioactiveAtoms = atoms.filter(key => atomsDatabase[key].isRadioactive)

  const renderAtomButton = (atomKey: string) => {
    const atom = atomsDatabase[atomKey]
    const isActive = atom.symbol === currentAtom.symbol &&
      atom.name === currentAtom.name
    const isRadioactive = atom.isRadioactive

    return (
      <button
        key={atomKey}
        onClick={() => setAtom(atomKey)}
        style={{
          padding: '10px 15px',
          background: isActive
            ? (isRadioactive ? 'linear-gradient(135deg, #ff8800, #ffcc00)' : '#4488ff')
            : (isRadioactive ? 'rgba(255, 200, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'),
          border: isActive
            ? (isRadioactive ? '2px solid #ffdd44' : '2px solid #66aaff')
            : (isRadioactive ? '2px solid rgba(255, 200, 0, 0.4)' : '2px solid rgba(255, 255, 255, 0.2)'),
          borderRadius: '8px',
          color: isActive && isRadioactive ? '#000' : '#fff',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          boxShadow: isActive && isRadioactive ? '0 0 15px rgba(255, 200, 0, 0.4)' : 'none',
        }}
      >
        {isRadioactive && '☢️ '}{atom.symbol}
        {atom.massNumber && <sup style={{ fontSize: '0.6rem', marginLeft: '1px' }}>{atom.massNumber}</sup>}
      </button>
    )
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
    }}>
      {/* Stable Atoms */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {stableAtoms.map(renderAtomButton)}
      </div>

      {/* Radioactive Isotopes */}
      {radioactiveAtoms.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 200, 0, 0.3)'
        }}>
          <span style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#ffcc00',
            opacity: 0.8,
            fontFamily: 'monospace'
          }}>
            ☢️ Radioactive Isotopes
          </span>
          {radioactiveAtoms.map(renderAtomButton)}
        </div>
      )}
    </div>
  )
}

