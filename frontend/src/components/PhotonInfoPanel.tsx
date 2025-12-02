import { useAtomStore } from '../hooks/useAtomStore'
import {
    wavelengthToEnergy,
    formatEnergy,
    formatWavelength,
    calculateKineticEnergy,
    findPossibleTransitions,
} from '../utils/photon-physics'
import '../styles/PhotonInfoPanel.css'

export default function PhotonInfoPanel() {
    const { currentAtom, photonState } = useAtomStore()
    const { wavelength, currentEffect, showCalculations } = photonState

    if (!showCalculations || !photonState.photonModeEnabled) return null

    const photonEnergy = wavelengthToEnergy(wavelength)
    const workFunction = currentAtom.energyData?.ionizationEnergy || 0
    const kineticEnergy = calculateKineticEnergy(photonEnergy, workFunction)
    const possibleTransitions = currentAtom.energyData
        ? findPossibleTransitions(photonEnergy, currentAtom.energyData)
        : []

    return (
        <div className="photon-info-panel">
            <div className="info-header">
                <h3>⚛️ Photon Interaction</h3>
            </div>

            <div className="calculation-section">
                <div className="calc-row">
                    <span className="calc-label">Wavelength (λ):</span>
                    <span className="calc-value">{formatWavelength(wavelength)}</span>
                </div>

                <div className="calc-row">
                    <span className="calc-label">Photon Energy (E):</span>
                    <span className="calc-value">{formatEnergy(photonEnergy)}</span>
                </div>

                <div className="calc-formula">
                    E = hc/λ = {formatEnergy(photonEnergy)}
                </div>
            </div>

            <div className="effect-section">
                <div className="effect-indicator">
                    <span className="effect-label">Current Effect:</span>
                    <span className={`effect-badge ${currentEffect}`}>
                        {currentEffect === 'none' && '⚪ No Interaction'}
                        {currentEffect === 'excitation' && '🟢 Electron Excitation'}
                        {currentEffect === 'photoelectric' && '🔴 Photoelectric Effect'}
                    </span>
                </div>

                {currentEffect === 'excitation' && possibleTransitions.length > 0 && (
                    <div className="transition-info">
                        <div className="info-subheader">Possible Transitions:</div>
                        {possibleTransitions.map((transition, idx) => (
                            <div key={idx} className="transition-item">
                                Shell {transition.fromShell} → {transition.toShell} ({formatEnergy(transition.energy)})
                            </div>
                        ))}
                    </div>
                )}

                {currentEffect === 'photoelectric' && (
                    <div className="photoelectric-info">
                        <div className="calc-row">
                            <span className="calc-label">Work Function (Φ):</span>
                            <span className="calc-value">{formatEnergy(workFunction)}</span>
                        </div>
                        <div className="calc-row">
                            <span className="calc-label">Kinetic Energy:</span>
                            <span className="calc-value highlight">{formatEnergy(kineticEnergy)}</span>
                        </div>
                        <div className="calc-formula">
                            KE = hf - Φ = {formatEnergy(photonEnergy)} - {formatEnergy(workFunction)} = {formatEnergy(kineticEnergy)}
                        </div>
                    </div>
                )}

                {currentEffect === 'none' && (
                    <div className="no-effect-info">
                        {photonEnergy < workFunction ? (
                            <p>Photon energy too low for ionization. Increase frequency or decrease wavelength.</p>
                        ) : (
                            <p>No resonant transitions at this energy level.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
