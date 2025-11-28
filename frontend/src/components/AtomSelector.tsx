import { useAtomStore } from '../hooks/useAtomStore'
import { atomsDatabase } from '../data/atoms'

export default function AtomSelector() {
  const setAtom = useAtomStore((state) => state.setAtom)
  const currentAtom = useAtomStore((state) => state.currentAtom)

  const atoms = Object.keys(atomsDatabase)

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10,
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      maxWidth: '300px'
    }}>
      {atoms.map((atomKey) => {
        const atom = atomsDatabase[atomKey]
        const isActive = atom.symbol === currentAtom.symbol
        
        return (
          <button
            key={atomKey}
            onClick={() => setAtom(atomKey)}
            style={{
              padding: '10px 15px',
              background: isActive ? '#4488ff' : 'rgba(255, 255, 255, 0.1)',
              border: isActive ? '2px solid #66aaff' : '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {atom.symbol}
          </button>
        )
      })}
    </div>
  )
}
