import { useAtomStore } from '../hooks/useAtomStore'
import { wavelengthToRGB, getEmissionWavelengths } from '../utils/photon-physics'
import '../styles/SpectrumDisplay.css'

export default function SpectrumDisplay() {
    const { currentAtom, photonState } = useAtomStore()
    const { showSpectrum } = photonState

    if (!showSpectrum || !photonState.photonModeEnabled || !currentAtom.energyData) {
        return null
    }

    const emissionWavelengths = getEmissionWavelengths(currentAtom.energyData)

    // Visible spectrum range (380-750 nm)
    const spectrumStart = 380
    const spectrumEnd = 750
    const spectrumRange = spectrumEnd - spectrumStart

    // Generate continuous spectrum gradient
    const generateSpectrumGradient = () => {
        const steps = 50
        const colors: string[] = []

        for (let i = 0; i <= steps; i++) {
            const wavelength = spectrumStart + (i / steps) * spectrumRange
            const [r, g, b] = wavelengthToRGB(wavelength)
            colors.push(`rgb(${r * 255}, ${g * 255}, ${b * 255})`)
        }

        return `linear-gradient(to right, ${colors.join(', ')})`
    }

    // Get position percentage for a wavelength
    const getPosition = (wavelength: number) => {
        if (wavelength < spectrumStart) return -10 // Off screen left
        if (wavelength > spectrumEnd) return 110 // Off screen right
        return ((wavelength - spectrumStart) / spectrumRange) * 100
    }

    // Group wavelengths by region
    const visibleLines = emissionWavelengths.filter(w => w >= spectrumStart && w <= spectrumEnd)
    const uvLines = emissionWavelengths.filter(w => w < spectrumStart)
    const irLines = emissionWavelengths.filter(w => w > spectrumEnd)

    return (
        <div className="spectrum-display">
            <div className="spectrum-header">
                <h3>Emission Spectrum - {currentAtom.name}</h3>
                <div className="spectrum-info">
                    {visibleLines.length} visible lines • {uvLines.length} UV • {irLines.length} IR
                </div>
            </div>

            <div className="spectrum-container">
                {/* Continuous spectrum background */}
                <div
                    className="spectrum-bar"
                    style={{ background: generateSpectrumGradient() }}
                />

                {/* Emission lines */}
                <div className="emission-lines">
                    {emissionWavelengths.map((wavelength, idx) => {
                        const position = getPosition(wavelength)
                        const [r, g, b] = wavelengthToRGB(wavelength)
                        const isVisible = wavelength >= spectrumStart && wavelength <= spectrumEnd

                        if (!isVisible) return null

                        return (
                            <div
                                key={idx}
                                className="emission-line"
                                style={{
                                    left: `${position}%`,
                                    background: `rgb(${r * 255}, ${g * 255}, ${b * 255})`,
                                    boxShadow: `0 0 10px rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.8)`
                                }}
                            >
                                <div className="line-label">{wavelength.toFixed(1)}nm</div>
                            </div>
                        )
                    })}
                </div>

                {/* Wavelength scale */}
                <div className="wavelength-scale">
                    <span>380nm</span>
                    <span>450nm</span>
                    <span>500nm</span>
                    <span>550nm</span>
                    <span>600nm</span>
                    <span>650nm</span>
                    <span>700nm</span>
                    <span>750nm</span>
                </div>

                {/* Region labels */}
                <div className="region-labels">
                    <span className="region violet">Violet</span>
                    <span className="region blue">Blue</span>
                    <span className="region green">Green</span>
                    <span className="region yellow">Yellow</span>
                    <span className="region orange">Orange</span>
                    <span className="region red">Red</span>
                </div>
            </div>

            {/* Non-visible lines summary */}
            {(uvLines.length > 0 || irLines.length > 0) && (
                <div className="non-visible-summary">
                    {uvLines.length > 0 && (
                        <div className="summary-item uv">
                            <span className="count">{uvLines.length}</span> UV lines ({Math.min(...uvLines).toFixed(1)} - {Math.max(...uvLines).toFixed(1)} nm)
                        </div>
                    )}
                    {irLines.length > 0 && (
                        <div className="summary-item ir">
                            <span className="count">{irLines.length}</span> IR lines ({Math.min(...irLines).toFixed(1)} - {Math.max(...irLines).toFixed(1)} nm)
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
