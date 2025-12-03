import { useAtomStore } from '../hooks/useAtomStore'
import { formatEnergy, wavelengthToEnergy } from '../utils/photon-physics'
import '../styles/EnergyLevelDiagram.css'

export default function EnergyLevelDiagram() {
    const { currentAtom, photonState } = useAtomStore()
    const { showEnergyDiagram, wavelength, currentEffect } = photonState

    if (!showEnergyDiagram || !photonState.photonModeEnabled || !currentAtom.energyData) {
        return null
    }

    const energyData = currentAtom.energyData
    const photonEnergy = wavelengthToEnergy(wavelength)
    const ionizationEnergy = energyData.ionizationEnergy

    // Get energy levels sorted by energy (most negative first)
    const levels = [...energyData.energyLevels].sort((a, b) => a.energy - b.energy)

    // Calculate vertical positions (0 = bottom, 100 = top)
    const minEnergy = levels[0].energy
    const maxEnergy = 0 // Ionization level
    const energyRange = maxEnergy - minEnergy

    const getLevelPosition = (energy: number) => {
        return ((energy - minEnergy) / energyRange) * 85 + 5 // 5-90% range
    }

    const shellLabels = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

    return (
        <div className="energy-level-diagram">
            <div className="diagram-header">
                <h3>Energy Level Diagram</h3>
                <div className="element-label">{currentAtom.symbol}</div>
            </div>

            <div className="diagram-container">
                {/* Y-axis (energy scale) */}
                <div className="energy-axis">
                    <div className="axis-label top">0 eV</div>
                    <div className="axis-label middle">{formatEnergy(minEnergy / 2)}</div>
                    <div className="axis-label bottom">{formatEnergy(minEnergy)}</div>
                </div>

                {/* Energy levels */}
                <div className="levels-area">
                    {/* Ionization threshold */}
                    <div
                        className="ionization-line"
                        style={{ bottom: `${getLevelPosition(0)}%` }}
                    >
                        <div className="level-line ionization"></div>
                        <div className="level-label">
                            Ionization ({formatEnergy(ionizationEnergy)})
                        </div>
                    </div>

                    {/* Individual energy levels */}
                    {levels.map((level, idx) => (
                        <div
                            key={idx}
                            className="energy-level"
                            style={{ bottom: `${getLevelPosition(level.energy)}%` }}
                        >
                            <div className="level-line"></div>
                            <div className="level-info">
                                <span className="shell-name">
                                    {shellLabels[level.shell - 1] || `n=${level.shell}`}
                                </span>
                                <span className="level-energy">{formatEnergy(level.energy)}</span>
                            </div>
                            <div className="electron-dots">
                                {Array.from({ length: level.electrons }).map((_, i) => (
                                    <div key={i} className="electron-dot" />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Photon energy indicator */}
                    {photonState.isLightOn && (
                        <div
                            className="photon-indicator"
                            style={{ bottom: `${getLevelPosition(minEnergy + photonEnergy)}%` }}
                        >
                            <div className="photon-arrow">
                                <span>Photon: {formatEnergy(photonEnergy)}</span>
                            </div>
                        </div>
                    )}

                    {/* Effect indicators */}
                    {currentEffect === 'excitation' && (
                        <div className="transition-arrows">
                            {energyData.allowedTransitions
                                .filter(t => Math.abs(t.energy - photonEnergy) < 0.5)
                                .map((transition, idx) => {
                                    const fromLevel = levels.find(l => l.shell === transition.fromShell)
                                    const toLevel = levels.find(l => l.shell === transition.toShell)
                                    if (!fromLevel || !toLevel) return null

                                    return (
                                        <div
                                            key={idx}
                                            className="transition-arrow excitation"
                                            style={{
                                                bottom: `${getLevelPosition(fromLevel.energy)}%`,
                                                height: `${getLevelPosition(toLevel.energy) - getLevelPosition(fromLevel.energy)}%`
                                            }}
                                        >
                                            <div className="arrow-line"></div>
                                            <div className="arrow-head">↑</div>
                                        </div>
                                    )
                                })}
                        </div>
                    )}

                    {currentEffect === 'photoelectric' && (
                        <div
                            className="ejection-indicator"
                            style={{ bottom: `${getLevelPosition(levels[levels.length - 1].energy)}%` }}
                        >
                            <div className="ejection-arrow">⚡ Electron Ejected</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="diagram-legend">
                <div className="legend-item">
                    <div className="legend-dot electron"></div>
                    <span>Electron</span>
                </div>
                <div className="legend-item">
                    <div className="legend-line excitation"></div>
                    <span>Excitation</span>
                </div>
                <div className="legend-item">
                    <div className="legend-line ionization"></div>
                    <span>Ionization</span>
                </div>
            </div>
        </div>
    )
}
