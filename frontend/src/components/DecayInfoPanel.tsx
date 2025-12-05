import { useAtomStore } from '../hooks/useAtomStore'
import { radioactiveIsotopes, decayTypeNames, decayTypeColors } from '../data/decay-data'

export default function DecayInfoPanel() {
    const { currentAtom, decayState } = useAtomStore()

    // Get decay info for current atom
    const atomKey = `${currentAtom.name.toLowerCase().replace(' ', '-')}`
    const isotopeData = radioactiveIsotopes[atomKey]

    if (!currentAtom.isRadioactive || !isotopeData) return null

    const primaryDecay = isotopeData.decayModes[0]

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(30, 25, 20, 0.95))',
            padding: '16px 20px',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'monospace',
            minWidth: '280px',
            border: '1px solid rgba(255, 200, 0, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: 100,
        }}>
            {/* Isotope Notation */}
            <div style={{
                textAlign: 'center',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 200, 0, 0.15)'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    <sup style={{ fontSize: '1rem', verticalAlign: 'super' }}>{isotopeData.massNumber}</sup>
                    <sub style={{ fontSize: '0.8rem', verticalAlign: 'sub' }}>{isotopeData.atomicNumber}</sub>
                    {isotopeData.symbol}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    {isotopeData.neutrons} neutrons
                </div>
            </div>

            {/* Decay Equation */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '12px',
                borderLeft: `3px solid ${decayTypeColors[primaryDecay.type]}`,
            }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>
                    Decay Equation
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: '#ffcc66' }}>{isotopeData.name}</span>
                    <span style={{
                        color: decayTypeColors[primaryDecay.type],
                        margin: '0 8px',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}>→</span>
                    <span style={{ color: '#88ff88' }}>{primaryDecay.daughterName}</span>
                    <span style={{ opacity: 0.5 }}> + </span>
                    <span style={{ color: decayTypeColors[primaryDecay.type] }}>
                        {primaryDecay.type === 'alpha' ? 'α' :
                            primaryDecay.type === 'beta-minus' ? 'β⁻' :
                                primaryDecay.type === 'beta-plus' ? 'β⁺' : 'γ'}
                    </span>
                </div>
            </div>

            {/* Half-life Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.8rem'
            }}>
                <div style={{
                    background: 'rgba(255, 200, 0, 0.1)',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ opacity: 0.6, fontSize: '0.7rem' }}>Half-Life</div>
                    <div style={{ fontWeight: 'bold', color: '#ffcc66' }}>
                        {primaryDecay.halfLifeDisplay}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(255, 100, 100, 0.1)',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ opacity: 0.6, fontSize: '0.7rem' }}>Energy</div>
                    <div style={{ fontWeight: 'bold', color: '#ff8866' }}>
                        {primaryDecay.energyReleased} MeV
                    </div>
                </div>
            </div>

            {/* Description */}
            <div style={{
                marginTop: '12px',
                fontSize: '0.75rem',
                opacity: 0.7,
                lineHeight: 1.4,
                fontStyle: 'italic'
            }}>
                {primaryDecay.description}
            </div>

            {/* Decay Status */}
            {decayState.isDecaying && (
                <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: `linear-gradient(90deg, ${decayTypeColors[decayState.currentDecayType || 'alpha']}22, transparent)`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'pulse 1s ease-in-out infinite'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {decayTypeNames[decayState.currentDecayType || 'alpha']} Decay in Progress...
                    </span>
                </div>
            )}
        </div>
    )
}
