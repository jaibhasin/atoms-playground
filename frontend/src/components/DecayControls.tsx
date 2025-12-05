import { useAtomStore } from '../hooks/useAtomStore'
import { radioactiveIsotopes, decayTypeNames, decayTypeColors } from '../data/decay-data'

export default function DecayControls() {
    const {
        currentAtom,
        decayState,
        triggerDecay,
        addDecayParticle,
        resetDecay
    } = useAtomStore()

    // Get decay info for current atom
    const atomKey = `${currentAtom.name.toLowerCase().replace(' ', '-')}`
    const isotopeData = radioactiveIsotopes[atomKey]

    const isRadioactive = currentAtom.isRadioactive && isotopeData

    const handleTriggerDecay = (decayMode: typeof isotopeData.decayModes[0]) => {
        if (!isotopeData || decayState.isDecaying) return

        // Generate random direction for particle ejection
        const randomAngle = Math.random() * Math.PI * 2
        const randomPolar = Math.random() * Math.PI
        const speed = 1

        const velocity: [number, number, number] = [
            Math.sin(randomPolar) * Math.cos(randomAngle) * speed,
            Math.sin(randomPolar) * Math.sin(randomAngle) * speed,
            Math.cos(randomPolar) * speed
        ]

        // Add decay particle for animation
        addDecayParticle({
            id: `decay-${Date.now()}`,
            type: decayMode.type,
            position: [0, 0, 0],
            velocity,
            timestamp: Date.now()
        })

        // Find daughter atom key
        const daughterKey = Object.keys(radioactiveIsotopes).find(
            key => radioactiveIsotopes[key].name === decayMode.daughterName
        ) || decayMode.daughterName.toLowerCase().replace(' ', '-')

        // Trigger decay in store
        triggerDecay(decayMode.type, daughterKey, {
            id: `event-${Date.now()}`,
            type: decayMode.type,
            parentName: currentAtom.name,
            daughterName: decayMode.daughterName,
            energyReleased: decayMode.energyReleased,
            timestamp: Date.now()
        })
    }

    if (!isRadioactive) {
        return (
            <div style={{
                position: 'absolute',
                top: 120,
                right: 20,
                background: 'rgba(50, 50, 50, 0.9)',
                padding: '16px 20px',
                borderRadius: '12px',
                color: '#888',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                maxWidth: '280px',
                border: '1px solid rgba(100, 100, 100, 0.3)',
                zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚛️</span>
                    <span style={{ fontWeight: 'bold' }}>Stable Atom</span>
                </div>
                <p style={{ margin: 0, opacity: 0.7 }}>
                    {currentAtom.name} is a stable element and does not undergo radioactive decay.
                </p>
                <p style={{ margin: '8px 0 0', opacity: 0.5, fontSize: '0.75rem' }}>
                    Select a radioactive isotope (U-238, Ra-226, C-14, etc.) to see decay.
                </p>
            </div>
        )
    }

    return (
        <div style={{
            position: 'absolute',
            top: 120,
            right: 20,
            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(50, 40, 30, 0.95))',
            padding: '20px',
            borderRadius: '16px',
            color: '#fff',
            fontFamily: 'monospace',
            minWidth: '300px',
            border: '1px solid rgba(255, 200, 0, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 150, 0, 0.1)',
            zIndex: 100,
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 200, 0, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>☢️</span>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {isotopeData.name}
                        </div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                            Mass: {isotopeData.massNumber} | Z: {isotopeData.atomicNumber}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decay Modes */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '10px' }}>
                    Available Decay Modes:
                </div>
                {isotopeData.decayModes.map((mode, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            borderLeft: `3px solid ${decayTypeColors[mode.type]}`,
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px'
                        }}>
                            <span style={{
                                color: decayTypeColors[mode.type],
                                fontWeight: 'bold'
                            }}>
                                {decayTypeNames[mode.type]}
                            </span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                {mode.halfLifeDisplay}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '8px' }}>
                            → {mode.daughterName} + {mode.energyReleased} MeV
                        </div>
                        <button
                            onClick={() => handleTriggerDecay(mode)}
                            disabled={decayState.isDecaying}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: decayState.isDecaying
                                    ? 'rgba(100, 100, 100, 0.3)'
                                    : `linear-gradient(135deg, ${decayTypeColors[mode.type]}33, ${decayTypeColors[mode.type]}66)`,
                                border: `1px solid ${decayTypeColors[mode.type]}88`,
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '0.85rem',
                                cursor: decayState.isDecaying ? 'not-allowed' : 'pointer',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {decayState.isDecaying ? '⏳ Decaying...' : `⚡ Trigger ${decayTypeNames[mode.type]} Decay`}
                        </button>
                    </div>
                ))}
            </div>

            {/* Decay History */}
            {decayState.decayHistory.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>
                        Decay Chain:
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        alignItems: 'center'
                    }}>
                        {decayState.decayHistory.map((event, i) => (
                            <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {i === 0 && (
                                    <span style={{
                                        background: 'rgba(255, 200, 0, 0.2)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem'
                                    }}>
                                        {event.parentName}
                                    </span>
                                )}
                                <span style={{ color: decayTypeColors[event.type], fontSize: '0.8rem' }}>
                                    →{decayTypeNames[event.type].split(' ')[0]}→
                                </span>
                                <span style={{
                                    background: 'rgba(100, 255, 150, 0.2)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                }}>
                                    {event.daughterName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reset Button */}
            <button
                onClick={resetDecay}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(100, 150, 255, 0.2)',
                    border: '1px solid rgba(100, 150, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#88aaff',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'all 0.2s ease',
                }}
            >
                🔄 Reset to Original Isotope
            </button>
        </div>
    )
}
