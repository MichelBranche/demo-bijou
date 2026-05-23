# Hotel Bijou · Saint-Vincent

![Hero Section](preview.png)

Front-end demo per l’**Hotel Bijou** di **Saint-Vincent** (Valle d’Aosta): home, struttura, camere, territorio e contatti, con intro loader, navigazione e animazioni curate.

## Tech stack

| Area | Tecnologia |
| --- | --- |
| Runtime UI | **React** 19 |
| Bundler & dev server | **Vite** 8 |
| Routing | **react-router-dom** 7 |
| Styling | **Tailwind CSS** 4 (plugin Vite `@tailwindcss/vite`) |
| Animazioni | **Framer Motion** 12 · **GSAP** 3 |
| Scroll fluido | **Lenis** |
| Icone | **lucide-react** |
| Qualità codice | **ESLint** · **typescript-eslint** (dipendenze Typescript anche per JSX/TSX misti) |

Alias di import: `@/` → cartella `src/` (vedi `vite.config.js`).

## Custom ready

Pensato per essere adattato a brand e contenuti reali senza stravolgere la struttura:

- **Prenotazioni** — aggiorna l’URL in `src/booking.js` (`BOOKING_URL`).
- **Menu e rotte** — voci e path in `src/App.jsx` (`navItems` e relative `Route`).
- **Testi e dati aggregati** — file in `src/data/` (es. recensioni / reputation) e copy nelle pagine sotto `src/pages/`.
- **Immagini** — modulo centralizzato in `src/assets/images.js` e risorse nella cartella `src/assets/`.
- **Look & feel** — utility Tailwind in `src/App.css` e componenti sotto `src/components/`; le animazioni rispettano `prefers-reduced-motion` dove previsto (`motionPrefs.js`, contesto splash in `SplashRevealDoneContext`).
- **Componenti TS** — alcuni blocchi sono in `.tsx` (es. gallery); il resto del progetto resta JSX con tipi Typescript disponibili per lint/typecheck.

## License

This project is proprietary and protected by copyright.
Unauthorized use, reproduction, or distribution is prohibited.
