import { useAtomStore } from '../hooks/useAtomStore'
import AlphaDecay from './AlphaDecay'
import BetaDecay from './BetaDecay'
import GammaDecay from './GammaDecay'

// Wrapper component that renders the appropriate decay animation
export default function DecayAnimation() {
    const { decayState, removeDecayParticle, completeDecay } = useAtomStore()

    const handleParticleComplete = (particleId: string) => {
        removeDecayParticle(particleId)

        // If no more particles, mark decay as complete
        const remainingParticles = decayState.activeParticles.filter(p => p.id !== particleId)
        if (remainingParticles.length === 0) {
            completeDecay()
        }
    }

    return (
        <>
            {decayState.activeParticles.map((particle) => {
                switch (particle.type) {
                    case 'alpha':
                        return (
                            <AlphaDecay
                                key={particle.id}
                                particle={particle}
                                onComplete={() => handleParticleComplete(particle.id)}
                            />
                        )
                    case 'beta-minus':
                    case 'beta-plus':
                        return (
                            <BetaDecay
                                key={particle.id}
                                particle={particle}
                                onComplete={() => handleParticleComplete(particle.id)}
                            />
                        )
                    case 'gamma':
                        return (
                            <GammaDecay
                                key={particle.id}
                                particle={particle}
                                onComplete={() => handleParticleComplete(particle.id)}
                            />
                        )
                    default:
                        return null
                }
            })}
        </>
    )
}
