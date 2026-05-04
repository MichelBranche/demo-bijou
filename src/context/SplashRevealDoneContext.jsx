import { createContext } from 'react'

/** `true` solo dopo exit completo dell’AppLoader (`onExitComplete`). Default per montaggi senza Provider. */
export const SplashRevealDoneContext = createContext(true)
