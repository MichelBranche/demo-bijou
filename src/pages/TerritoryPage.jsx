import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bijouImages } from '../assets/images'
import { prefersReducedMotion } from '../motionPrefs'

/** Fonti istituzionali / concessionari noti — controllati su contenuto visitatore. */
const EXTERNAL = {
  casino: 'https://www.casinodelavallee.it/',
  qcTerme: 'https://www.qcterme.com/it/pre-saint-didier',
}

function TerritoryPage() {
  const territorioRootRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const root = territorioRootRef.current
    if (!root) return undefined

    const reduced = prefersReducedMotion()
    /* Lenis + ScrollTrigger su iOS/Android spesso non aggiornano i trigger in tempo:
       il contenuto resta con opacity:0 da gsap.from → “buco” bianco fino al footer. */
    const skipLenisMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    const lenis =
      reduced || skipLenisMobile
        ? null
        : new Lenis({
            duration: 1.5,
            smoothWheel: true,
            smoothTouch: false,
          })

    let tickerCallback = () => {}
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      tickerCallback = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)
    }

    const nav = document.getElementById('navbar')
    const onScroll = () => {
      if (!nav) return
      nav.classList.toggle('scrolled', window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)

    const easing = /** @type {const} */ ('power3.out')

    const onceScroll = (trigger) => ({
      trigger,
      start: 'top 88%',
      once: true,
      invalidateOnRefresh: true,
    })

    const ctx = gsap.context(() => {
      if (reduced) return

      const hero = root.querySelector('.territorio-page__hero')
      const heroBits = hero?.querySelectorAll('.territo-hero__el') ?? []

      if (heroBits.length) {
        gsap.from(heroBits, {
          y: 32,
          opacity: 0,
          duration: 0.78,
          stagger: 0.11,
          ease: easing,
          immediateRender: false,
          scrollTrigger: { ...onceScroll(hero), start: 'top 84%' },
        })
      }

      const fig = root.querySelector('.territory-hero-figure')
      const heroImg = fig?.querySelector('img')
      if (fig && heroImg) {
        gsap
          .timeline({
            scrollTrigger: onceScroll(fig),
          })
          .from(fig, {
            y: 44,
            opacity: 0,
            duration: 0.82,
            ease: easing,
            immediateRender: false,
          })
          .from(
            heroImg,
            {
              scale: 1.08,
              duration: 1.15,
              ease: easing,
              transformOrigin: '50% 50%',
              immediateRender: false,
            },
            '-=0.62',
          )
      }

      root.querySelectorAll('.territory-topic__figure').forEach((figure) => {
        const topicImg = figure.querySelector('img')
        if (!topicImg) return
        gsap.from(topicImg, {
          scale: 1.07,
          duration: 1.02,
          ease: easing,
          transformOrigin: '50% 50%',
          immediateRender: false,
          scrollTrigger: onceScroll(figure),
        })
      })

      const opening = root.querySelector('.territory-body__opening')
      if (opening) {
        gsap.from(opening, {
          y: 28,
          opacity: 0,
          duration: 0.72,
          ease: easing,
          immediateRender: false,
          scrollTrigger: onceScroll(opening),
        })
      }

      root.querySelectorAll('.territory-topic').forEach((section) => {
        const children = section.querySelectorAll(':scope > *')
        if (!children.length) return
        gsap.from(children, {
          y: 22,
          opacity: 0,
          duration: 0.64,
          stagger: 0.055,
          ease: easing,
          immediateRender: false,
          scrollTrigger: onceScroll(section),
        })
      })

      const foot = root.querySelector('.territory-footnote')
      if (foot) {
        gsap.from(foot, {
          y: 20,
          opacity: 0,
          duration: 0.68,
          ease: easing,
          immediateRender: false,
          scrollTrigger: onceScroll(foot),
        })
      }
    }, root)

    const refreshSt = () => {
      ScrollTrigger.refresh()
    }
    queueMicrotask(refreshSt)
    requestAnimationFrame(refreshSt)
    requestAnimationFrame(() => requestAnimationFrame(refreshSt))
    const t50 = window.setTimeout(refreshSt, 50)
    const t250 = window.setTimeout(refreshSt, 250)
    const onLoad = () => refreshSt()
    window.addEventListener('load', onLoad, { once: true })
    const vv = window.visualViewport
    if (vv) vv.addEventListener('resize', refreshSt)

    return () => {
      window.clearTimeout(t50)
      window.clearTimeout(t250)
      window.removeEventListener('load', onLoad)
      if (vv) vv.removeEventListener('resize', refreshSt)
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(tickerCallback)
      }
    }
  }, [])

  return (
    <div ref={territorioRootRef} className="page-shell territorio-page">
      <header className="page-hero territorio-page__hero">
        <span className="label territo-hero__el">Territorio</span>
        <h1 className="serif territo-hero__el">Nel cuore della Valle d&apos;Aosta</h1>
        <p className="page-intro territo-hero__el">
          Saint‑Vincent è una buona fermata sulla valle centrale, fra la Riviera delle Alpi, le storiche cure legate alle
          acque locali ancora pubblicizzate spesso come Terme Fons Salutis e i collegamenti comodi verso dorsali nevose più
          note come Monte Rosa o Cervinia. Più sotto distinguiamo cosa vedere davvero a due passi dall&apos;hotel e cosa
          merita un&apos;uscita giornaliera in automobile.
        </p>
      </header>

      <figure className="territory-hero-figure">
        <img
          src={bijouImages.editorial.territory}
          alt="Paesaggi e colori lungo la Valle d&apos;Aosta"
          loading="eager"
          decoding="async"
        />
      </figure>

      <div className="territory-body">
        <p className="territory-body__opening">
          Da piazza Cavalieri si dipartono passeggiate tra giardini curati, fontane ornate e vie ordinate del centro;
          a breve distanza l&apos;atmosfera da borgo alpino lascia spazio anche a serate negli esercizi attorno alla piazza
          o giornate piene dentro i percorsi termali collinari. Il resto della valle resta raggiungibile in auto spesso in
          venti‑trenta minuti per sci, sentieri o la solita visita archeologica ad Aosta.
        </p>

        <section
          className="territory-topic"
          aria-labelledby="territorio-casino-titolo"
        >
          <h2 id="territorio-casino-titolo" className="territory-topic__title serif">
            Casinò de la Vallée
          </h2>
          <p className="territorio-sub">A pochi metri dalla Bijou • Saint-Vincent</p>
          <figure className="territory-topic__figure">
            <img
              src={bijouImages.territorio.casino}
              alt="Esterno del Casinò de la Vallée — facciata con vetrata e insegna, verde e montagne sullo sfondo"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p>
            Il <strong>Casino de la Vallée</strong> è la casa da gioco pubblica valdostana: ristrutturata nel progetto
            resort, oggi occupa <strong>oltre 3.000 m² su due piani</strong> collegati al polo alberghiero Billia. È
            annoverata tra le realtà europee più note per <strong>offerta di slot elettroniche</strong> e, dove la
            normativa e il calendario lo prevedono, <strong>tavoli di gioco tradizionale</strong>, tornei e promozioni
            dedicate.
          </p>
          <p>
            Alle origini storiche del <strong>29 aprile 1947</strong> nella sede dell&apos;Grand Hôtel Billia oggi si somma una
            proposta anche di <strong>bar, ristorazione e nightlife</strong> interna alla struttura: utile leggere gli
            avvisi su <strong>eventi dal vivo</strong> e sugli ingressi contingentati nelle giornate di punta della
            stagione sciistica e delle feste.
          </p>
          <ul className="territory-bullet-list">
            <li>
              <strong>Età</strong>: ammessi i <strong>maggiori</strong>; serve un{' '}
              <strong>documento d&apos;identità valido</strong>. Per chi risiede in Valle d&apos;Aosta valgono limitazioni nei
              confronti della partecipazione a taluni giochi — verificate il bollettino aggiornato in reception o sul{' '}
              <a href={EXTERNAL.casino} target="_blank" rel="noopener noreferrer">
                sito della casa da gioco
              </a>
              .
            </li>
            <li>
              <strong>Ingresso</strong>: in linea di massima gratuito verso gli spazi comuni della visita turistica; per
              l&apos;accesso alle zone di puntata possono essere richieste procedure di accredito tessera loyalty.
            </li>
            <li>
              <strong>Orario indicativo ricorrente</strong>: aperture quotidiane a partire dalle ore 10 anche nei weekend
              (confermare su calendario ufficiale stagionale).
            </li>
            <li><strong>Dress code</strong>: look ordinato (&quot;smart casual&quot;) consigliato; evitate completo sportivo o mare.</li>
          </ul>
          <p className="territory-link-out">
            <a href={EXTERNAL.casino} target="_blank" rel="noopener noreferrer">
              Casino de la Vallée — informazioni per il visitatore
            </a>
          </p>
        </section>

        <section
          className="territory-topic"
          aria-labelledby="territorio-terme-titolo"
        >
          <h2 id="territorio-terme-titolo" className="territory-topic__title serif">
            Terme e benessere
          </h2>
          <p className="territorio-sub">Saint-Vincent e dintorni</p>
          <figure className="territory-topic__figure">
            <img
              src={bijouImages.territorio.terme}
              alt="Piscina panoramica in ambiente wellness, acqua turchese e terrazza in legno con vista sulle montagne"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p>
            La tradizione delle <strong>acque oligominerali</strong> dell&apos;alta Valle centrale è legata anche al nome storico delle
            strutture di cura santvincentine: un tempo si parlava delle <strong>Terme Saint-Vincent-Fons Salutis</strong> nella
            promozione turistica. Oggi l&apos;<strong>elegante funicolare</strong> (e la passeggiata pedonabile) permettono ancora di
            collegare in pochi minuti centro e la zona della collina termale, così anche chi alloggia in piazza può raggiungere
            acqua tiepida e rituali wellness <strong>a piedi, senza spostamenti lunghi</strong>.
          </p>
          <p>
            Una giornata termale più ampia — con <strong>giardini d&apos;acqua, percorsi caldo‑freddo</strong> e <strong>piscine
            esterne</strong> immerse nel bosco della valle del torrente — è ciò che offre il <strong>QC Terme di
            Pré-Saint-Didier</strong>, circa un quarto d&apos;ora di auto lungo statale verso Morgex: ottimo dopo sci o trekking,
            o come piano B se il tempo in quota è mosso.
          </p>
          <ul className="territory-bullet-list">
            <li><strong>Saint-Vincent</strong>: focus su circuiti termali, idromassaggi e percorsi benessere compatti; comodissimo se volete un pomeriggio breve.</li>
            <li><strong>Pré-Saint-Didier (QC)</strong>: esperienza più ampia in mezzo al verde, con possibilità di pranzo light in loco e trattamenti su prenotazione.</li>
            <li><strong>Consiglio pratico</strong>: portate ciabatte, accappatoio (se non incluso nel pacchetto) e prenotate slot orari nelle settimane di alta affluenza.</li>
          </ul>
          <p className="territory-link-out">
            <a href={EXTERNAL.qcTerme} target="_blank" rel="noopener noreferrer">
              QC Terme Pré-Saint-Didier
            </a>
          </p>
        </section>

        <section
          className="territory-topic"
          aria-labelledby="territorio-sport-titolo"
        >
          <h2 id="territorio-sport-titolo" className="territory-topic__title serif">
            Sport e neve
          </h2>
          <p className="territorio-sub">Sci, fondo e discesa dall&apos;hotel</p>
          <p>
            Saint-Vincent non è un paese sulla stessa pista degli impianti, ma sta <strong>al centro logistico perfetto della
            valle</strong>: raggiunge in circa mezz&apos;ora (o poco più) dorsali molto diverse tra loro.
          </p>
          <ul className="territory-bullet-list">
            <li><strong>Monterosa Ski</strong> (Champoluc, Gressoney, Alagna): grande comprensorio tra Valsesia e Valle d&apos;Aosta, adatto sia a chi scia tutto il giorno sia a chi prova prima volta su neve garantita alta quota.</li>
            <li><strong>Breuil-Cervinia · Valtournenche collegabile a Zermatt (Matterhorn)</strong>: giornata in quota con vista sul più iconico delle Alpi pensili; alcuni giorni gli impianti di punta sono sensibili al vento — controllare i comunicati giornalieri degli skipass regionali.</li>
            <li><strong>La Thuile · Espace San Bernardo</strong>: area italo‑francese dalla spiccata vocazione sciistica lungo Bacino del Piccolo San Bernardo, adatta sia alle famiglie sia a chi gusta giornate on‑snow con pranzo oltrepassando la frontiera sulle piste.</li>
            <li><strong>Pila sopra Aosta</strong>: praticità assoluta in auto dalla capitale alpina — comprensorio compatto dove alternare sci e passeggiate al mattino nei mercati di Aosta.</li>
          </ul>
          <p>
            Amanti del fondo trovano lungo tutta la valle <strong>anello e piste da sci di fondo mantenute</strong> (verificate le
            condizioni giornaliere sulla neve naturale versus innevamento); le <strong>ciaspolate</strong> con le lampade al fronte,
            dopo neve fresca nei boschi sopra mille metri, sono un classico quando non sci da discesa.
          </p>
        </section>

        <section
          className="territory-topic"
          aria-labelledby="territorio-natura-titolo"
        >
          <h2 id="territorio-natura-titolo" className="territory-topic__title serif">
            Natura, cammini e ciclabilità
          </h2>
          <p>
            In estate Saint-Vincent profuma di <strong>erba tagliata e resina</strong> fuori dal nucleo; partono sentieri che salgono
            verso le alture del Verron o verso le borgate di <strong>Crétaz e Moron</strong>, con prati attrezzati per pic-nic.
            Chiedete in reception la mappa escursionistica aggiornata: i dislivelli possono sorprendere anche i camminatori
            allenati.
          </p>
          <p>
            La <strong>ciclovia della Valle d&apos;Aosta</strong> attraversa la mediana della valle seguendo il corso della Dora
            Baltea; il tratto che passa da Saint-Vincent è generalmente <strong>pianeggiante e adatto a e-bike</strong>, con
            possibilità di fermarsi in paese per un caffè e proseguire verso la bassa valle o verso Aosta.
          </p>
          <ul className="territory-bullet-list">
            <li><strong>Gran Paradiso</strong>: il Parco Nazionale è raggiungibile con auto e poi a piedi per avvistare stambecchi, marmotte e valloni laterali al ghiacciaio.</li>
            <li><strong>Rifugi e alpeggi</strong>: colazioni con fontina e polenta in quota partono spesso da parcheggi sopra i mille e duecento metri.</li>
          </ul>
        </section>

        <section
          className="territory-topic"
          aria-labelledby="territorio-cultura-titolo"
        >
          <h2 id="territorio-cultura-titolo" className="territory-topic__title serif">
            Cultura, castelli e tavola
          </h2>
          <p>
            <strong>Aosta</strong>, a meno di venti minuti, concentra <strong>teatro romano, Arco d&apos;Augusto, pretoria e criptoportici</strong>: un
            micro-corso di archeologia all&apos;aperto. A breve distanza, i <strong>castelli di Fénis e Issogne</strong> raccontano il
            Medioevo valdostano con affreschi e cortili porticati da film.
          </p>
          <p>
            Nel calendario autunnale tornano sagre e rassegne vinicole; la denominazione più famosa nei dintorni è il{' '}
            <strong>DOC Torrette superiore</strong>, accompagnamenti con i rossi dai vitigni autoctoni più piccoli. In trattoria
            ordinate quasi sempre <strong>Lard d&apos;Arnad DOP</strong>, <strong>carbonada</strong> e{' '}
            <strong>polenta concia</strong>, poi chiudete con <strong>fonduta al fontina valdostano DOP</strong>,{' '}
            <strong>canederli</strong> allo speck di Saint‑Rhémy o le <strong>mille varianti stagionali</strong> suggerite dai
            cuochi alpini.
          </p>
          <ul className="territory-bullet-list">
            <li><strong>Mercatini e artigiano</strong>: il centro di Aosta sabato mattina è vivacissimo; Saint-Vincent propone stagionalità legate al ciclo alpino delle fiere piccole ma curate.</li>
            <li><strong>Ecomusei e mestieri</strong>: mulini, sapone e latte di montagna sono temi ricorrenti nelle aperture estive degli spazi didattici in valle.</li>
          </ul>
        </section>

        <p className="territory-footnote">
          Orari delle terme e del casino, tariffazione skipass e stato delle piste possono cambiare in blocco stagionale —
          questo testo vuole essere un orientamento dall&apos;hotel: confermate sempre su fonti aggiornate il giorno prima del
          vostro programma.
        </p>
      </div>
    </div>
  )
}

export default TerritoryPage
