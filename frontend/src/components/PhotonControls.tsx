import { useAtomStore } from '../hooks/useAtomStore'
import {
    wavelengthToEnergy,
    getWavelengthRegion,
    formatEnergy,
    formatWavelength,
    wavelengthToRGB,
} from '../utils/photon-physics'
import '../styles/PhotonControls.css'

export default function PhotonControls() {
    const {
        photonState,
        setWavelength,
        setIntensity,
        toggleLight,
        toggleEnergyDiagram,
        toggleSpectrum,
        toggleCalculations,
    } = useAtomStore()

    const { wavelength, intensity, isLightOn } = photonState

    const photonEnergy = wavelengthToEnergy(wavelength)
    const region = getWavelengthRegion(wavelength)
    const [r, g, b] = wavelengthToRGB(wavelength)

    // Preset wavelengths - better coverage for photoelectric effect
    const presets = [
        { name: 'X-ray', wavelength: 0.1 },
        { name: 'UV', wavelength: 100 },
        { name: 'Violet', wavelength: 400 },
        { name: 'Blue', wavelength: 470 },
        { name: 'Green', wavelength: 520 },
        { name: 'Yellow', wavelength: 580 },
        { name: 'Red', wavelength: 650 },
        { name: 'IR', wavelength: 900 },
    ]

    // Use logarithmic scale for better control
    const minLog = Math.log(0.1) // 0.1nm (X-ray)
    const maxLog = Math.log(1000) // 1000nm (IR)
    const scale = (maxLog - minLog) / 100

    const handleSliderChange = (value: number) => {
        const wavelength = Math.exp(minLog + scale * value)
        setWavelength(wavelength)
    }

    const getSliderValue = () => {
        return (Math.log(wavelength) - minLog) / scale
    }

    return (
        <div className="photon-controls">
            <h3>Photon Source</h3>

            {/* Light on/off toggle */}
            <div className="control-group">
                <button
                    className={`light-toggle ${isLightOn ? 'active' : ''}`}
                    onClick={toggleLight}
                >
                    {isLightOn ? '💡 Light ON' : '🌑 Light OFF'}
                </button>
            </div>

            {/* Wavelength control */}
            <div className="control-group">
                <label>
                    Wavelength: {formatWavelength(wavelength)}
                    <span className="region-label">{region}</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={getSliderValue()}
                    onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                    className="wavelength-slider"
                    style={{
                        background: `linear-gradient(to right, 
              rgb(${r * 255}, ${g * 255}, ${b * 255}), 
              rgb(${r * 255}, ${g * 255}, ${b * 255}))`
                    }}
                />
                <div className="wavelength-scale">
                    <span>0.1nm (X-ray)</span>
                    <span>1000nm (IR)</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>
                    💡 Tip: Use X-ray preset (0.1nm) for photoelectric effect
                </div>
            </div>

            {/* Energy display */}
            <div className="info-display">
                <div className="info-row">
                    <span>Photon Energy:</span>
                    <strong>{formatEnergy(photonEnergy)}</strong>
                </div>
                <div className="info-row">
                    <span>Frequency:</span>
                    <strong>{(3e17 / wavelength).toExponential(2)} Hz</strong>
                </div>
            </div>

            {/* Intensity control */}
            <div className="control-group">
                <label>Intensity: {(intensity * 100).toFixed(0)}%</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="intensity-slider"
                />
            </div>

            {/* Wavelength presets */}
            <div className="presets">
                <label>Quick Presets:</label>
                <div className="preset-buttons">
                    {presets.map((preset) => (
                        <button
                            key={preset.name}
                            className="preset-btn"
                            onClick={() => setWavelength(preset.wavelength)}
                            title={`${preset.name}: ${preset.wavelength}nm`}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display options */}
            <div className="display-options">
                <h4>Display</h4>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={photonState.showEnergyDiagram}
                        onChange={toggleEnergyDiagram}
                    />
                    Energy Level Diagram
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={photonState.showSpectrum}
                        onChange={toggleSpectrum}
                    />
                    Emission Spectrum
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={photonState.showCalculations}
                        onChange={toggleCalculations}
                    />
                    Show Calculations
                </label>
            </div>

            {/* Color indicator */}
            <div className="color-indicator">
                <div className="color-label">Light Color:</div>
                <div
                    className="color-box"
                    style={{
                        backgroundColor: `rgb(${r * 255}, ${g * 255}, ${b * 255})`,
                        boxShadow: isLightOn
                            ? `0 0 20px rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.8)`
                            : 'none',
                    }}
                />
            </div>
        </div>
    )
}
