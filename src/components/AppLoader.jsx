import { motion } from 'framer-motion'
import { HotelStars } from './HotelStars'
import './AppLoader.css'

/**
 * Splash iniziale in stile Bijou — animazione/uscita gestita dall’AnimatePresence nel parent.
 */
export default function AppLoader({ reduceMotion }) {
  return (
    <motion.div
      className="app-boot"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Caricamento sito Hotel Bijou tre stelle"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{
        opacity: 1,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0.26 } }
          : {
              opacity: 0,
              transition: {
                duration: 0.62,
                ease: [0.22, 1, 0.36, 1],
              },
            }
      }
    >
      <div className="app-boot__inner">
        <div className="app-boot__line" aria-hidden="true" />
        <div className="app-boot__mark">Hotel Bijou</div>
        <HotelStars className="hotel-stars--boot" size={16} decorative />
        <p className="app-boot__sub">Boutique hotel · Saint-Vincent</p>
        <p className="app-boot__tag">Valle d&apos;Aosta</p>
        <div className="app-boot__progress" aria-hidden="true">
          <span className="app-boot__progress-bar" />
        </div>
      </div>
    </motion.div>
  )
}
