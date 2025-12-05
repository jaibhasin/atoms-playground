import { useEffect, useRef } from 'react'
import { useAtomStore } from '../hooks/useAtomStore'
import { radioactiveIsotopes } from '../data/decay-data'

// Time speed presets with human-readable labels
const TIME_SPEEDS = [
    { value: 1, label: '1 year/sec' },
    { value: 100, label: '100 years/sec' },
    { value: 1000, label: '1K years/sec' },
    { value: 100000, label: '100K years/sec' },
    { value: 1000000, label: '1M years/sec' },
    { value: 100000000, label: '100M years/sec' },
    { value: 1000000000, label: '1B years/sec' },
]

function formatYears(years: number): string {
    if (years < 1000) return `${years.toFixed(0)} years`
    if (years < 1000000) return `${(years / 1000).toFixed(1)}K years`
    if (years < 1000000000) return `${(years / 1000000).toFixed(1)}M years`
    return `${(years / 1000000000).toFixed(2)}B years`
}

export default function TimeWarpControl() {
    const {
        currentAtom,
        decayState,
        toggleAutoDecay,
        setTimeSpeed,
        addSimulatedTime,
        triggerDecay,
        addDecayParticle
    } = useAtomStore()

    const lastFrameTime = useRef(Date.now())

    // Get decay info for current atom
    const atomKey = `${currentAtom.name.toLowerCase().replace(' ', '-')}`
    const isotopeData = radioactiveIsotopes[atomKey]
    const isRadioactive = currentAtom.isRadioactive && isotopeData

    // Calculate half-life in years for display
    const halfLifeYears = isotopeData?.decayModes[0]?.halfLife
        ? isotopeData.decayModes[0].halfLife / (365.25 * 24 * 60 * 60)
        : 0

    // Auto-decay simulation loop
    useEffect(() => {
        if (!decayState.autoDecayEnabled || !isRadioactive || decayState.isDecaying) return

        const interval = setInterval(() => {
            const now = Date.now()
            const deltaSeconds = (now - lastFrameTime.current) / 1000
            lastFrameTime.current = now

            // Add simulated time
            const yearsElapsed = deltaSeconds * decayState.timeSpeed
            addSimulatedTime(yearsElapsed)

            // Calculate decay probability using half-life formula
            // P(decay in Δt) = 1 - e^(-λ * Δt) where λ = ln(2) / half-life
            const primaryDecay = isotopeData.decayModes[0]
            const halfLifeInYears = primaryDecay.halfLife / (365.25 * 24 * 60 * 60)
            const lambda = Math.log(2) / halfLifeInYears
            const decayProbability = 1 - Math.exp(-lambda * yearsElapsed)

            // Roll for decay
            if (Math.random() < decayProbability) {
                // Generate random ejection direction
                const randomAngle = Math.random() * Math.PI * 2
                const randomPolar = Math.random() * Math.PI

                addDecayParticle({
                    id: `decay-${Date.now()}`,
                    type: primaryDecay.type,
                    position: [0, 0, 0],
                    velocity: [
                        Math.sin(randomPolar) * Math.cos(randomAngle),
                        Math.sin(randomPolar) * Math.sin(randomAngle),
                        Math.cos(randomPolar)
                    ],
                    timestamp: Date.now()
                })

                // Find daughter atom key
                const daughterKey = Object.keys(radioactiveIsotopes).find(
                    key => radioactiveIsotopes[key].name === primaryDecay.daughterName
                ) || primaryDecay.daughterName.toLowerCase().replace(' ', '-')

                triggerDecay(primaryDecay.type, daughterKey, {
                    id: `event-${Date.now()}`,
                    type: primaryDecay.type,
                    parentName: currentAtom.name,
                    daughterName: primaryDecay.daughterName,
                    energyReleased: primaryDecay.energyReleased,
                    timestamp: Date.now()
                })
            }
        }, 100) // Update every 100ms

        return () => clearInterval(interval)
    }, [decayState.autoDecayEnabled, decayState.timeSpeed, decayState.isDecaying, isRadioactive, isotopeData, currentAtom])

    if (!isRadioactive) return null

    // Find current speed index
    const currentSpeedIndex = TIME_SPEEDS.findIndex(s => s.value <= decayState.timeSpeed)
    const effectiveIndex = currentSpeedIndex === -1 ? TIME_SPEEDS.length - 1 : currentSpeedIndex

    return (
        <div style={{
            position: 'absolute',
            top: 120,
            left: 20,
            background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(20, 40, 60, 0.95))',
            padding: '16px 20px',
            borderRadius: '14px',
            color: '#fff',
            fontFamily: 'monospace',
            minWidth: '280px',
            border: '1px solid rgba(100, 200, 255, 0.3)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 150, 255, 0.1)',
            zIndex: 100,
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(100, 200, 255, 0.2)'
            }}>
                <span style={{ fontSize: '1.3rem' }}>⏱️</span>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Time Warp</div>
                    <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>
                        Fast-forward radioactive decay
                    </div>
                </div>
            </div>

            {/* Auto-Decay Toggle */}
            <button
                onClick={toggleAutoDecay}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    marginBottom: '14px',
                    background: decayState.autoDecayEnabled
                        ? 'linear-gradient(135deg, rgba(100, 255, 150, 0.3), rgba(50, 200, 100, 0.3))'
                        : 'rgba(80, 80, 100, 0.3)',
                    border: decayState.autoDecayEnabled
                        ? '1px solid rgba(100, 255, 150, 0.5)'
                        : '1px solid rgba(100, 100, 120, 0.4)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                }}
            >
                {decayState.autoDecayEnabled ? '⏸️ Pause Auto-Decay' : '▶️ Start Auto-Decay'}
            </button>

            {/* Time Speed Slider */}
            <div style={{ marginBottom: '14px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Time Speed</span>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        color: '#66ddff',
                        background: 'rgba(100, 200, 255, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                    }}>
                        {TIME_SPEEDS.find(s => s.value === decayState.timeSpeed)?.label || formatYears(decayState.timeSpeed) + '/sec'}
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={TIME_SPEEDS.length - 1}
                    value={effectiveIndex}
                    onChange={(e) => setTimeSpeed(TIME_SPEEDS[parseInt(e.target.value)].value)}
                    style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: `linear-gradient(to right, #0088ff 0%, #00ddff ${effectiveIndex / (TIME_SPEEDS.length - 1) * 100}%, #333 ${effectiveIndex / (TIME_SPEEDS.length - 1) * 100}%, #333 100%)`,
                        outline: 'none',
                        cursor: 'pointer',
                        WebkitAppearance: 'none',
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.65rem',
                    opacity: 0.5,
                    marginTop: '4px'
                }}>
                    <span>1 year/s</span>
                    <span>1B years/s</span>
                </div>
            </div>

            {/* Simulated Time Display */}
            <div style={{
                background: 'rgba(0, 100, 150, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
                textAlign: 'center',
                border: '1px solid rgba(0, 200, 255, 0.2)'
            }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>
                    Simulated Time Elapsed
                </div>
                <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#00ddff',
                    textShadow: '0 0 10px rgba(0, 200, 255, 0.5)'
                }}>
                    {formatYears(decayState.simulatedYears)}
                </div>
            </div>

            {/* Half-Life Reference */}
            <div style={{
                background: 'rgba(255, 200, 0, 0.1)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: '3px solid #ffcc00'
            }}>
                <span style={{ opacity: 0.7 }}>Half-life of {currentAtom.symbol}:</span>
                <span style={{ fontWeight: 'bold', color: '#ffcc66' }}>
                    {isotopeData?.decayModes[0]?.halfLifeDisplay || 'N/A'}
                </span>
            </div>

            {/* Progress towards half-life */}
            {decayState.simulatedYears > 0 && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        opacity: 0.6,
                        marginBottom: '4px',
                        textAlign: 'center'
                    }}>
                        {((decayState.simulatedYears / halfLifeYears) * 100).toFixed(1)}% of half-life elapsed
                    </div>
                    <div style={{
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min((decayState.simulatedYears / halfLifeYears) * 100, 100)}%`,
                            background: 'linear-gradient(90deg, #ffcc00, #ff8800)',
                            borderRadius: '2px',
                            transition: 'width 0.2s ease'
                        }} />
                    </div>
                </div>
            )}
        </div>
    )
}
