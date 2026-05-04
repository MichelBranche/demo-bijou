import { useRef } from 'react'
import { bijouImages } from '@/assets/images'
import { useTerritorioPageAnimations } from '@/hooks/useTerritorioPageAnimations'
import TerritorioHero from '@/components/territorio/TerritorioHero'
import TerritorioFeatureSplit from '@/components/territorio/TerritorioFeatureSplit'
import TerritorioChecklist from '@/components/territorio/TerritorioChecklist'
import TerritorioNumberedList from '@/components/territorio/TerritorioNumberedList'
import TerritorioInfoGrid from '@/components/territorio/TerritorioInfoGrid'
import '@/styles/territorio-page.css'

/** Fonti istituzionali / concessionari noti — controllati su contenuto visitatore. */
const EXTERNAL = {
  casino: 'https://www.casinodelavallee.it/',
  qcTerme: 'https://www.qcterme.com/it/pre-saint-didier',
}

const infoCards = [
  {
    id: 'sport',
    icon: 'mountain',
    title: 'Sport e neve',
    sub: 'Sci, fondo e discesa dall’hotel',
    lede:
      'Saint-Vincent è al centro logistico della valle: in circa mezz’ora raggiungete dorsali molto diverse tra loro, dal Monterosa a Cervinia e La Thuile.',
    bullets: [
      'Monterosa Ski (Champoluc, Gressoney, Alagna): grande comprensorio tra Valsesia e Valle d’Aosta.',
      'Breuil-Cervinia · Valtournenche, collegabile a Zermatt: giornate in quota con vista iconica.',
      'La Thuile · Espace San Bernardo: area italo-francese adatta a famiglie e sci on-snow.',
    ],
    ctaTo: '/contatti',
    ctaLabel: 'Scopri di più →',
  },
  {
    id: 'natura',
    icon: 'trees',
    title: 'Natura, cammini e ciclabilità',
    sub: 'Sentieri e Dora Baltea',
    lede:
      'In estate partono sentieri verso le alture del Verron o verso Crétaz e Moron; la ciclovale della Valle d’Aosta attraversa la valle seguendo la Dora Baltea.',
    bullets: [
      'Gran Paradiso: il Parco Nazionale è raggiungibile in auto e poi a piedi per stambecchi e marmotte.',
      'Rifugi e alpeggi: colazioni con fontina e polenta in quota.',
      'E-bike sul tratto pianeggiante che attraversa Saint-Vincent.',
    ],
    ctaTo: '/contatti',
    ctaLabel: 'Scopri di più →',
  },
  {
    id: 'cultura',
    icon: 'castle',
    title: 'Cultura, castelli e tavola',
    sub: 'Aosta e sapori valdostani',
    lede:
      'Aosta concentra teatro romano, Arco d’Augusto e criptoportici; i castelli di Fénis e Issogne raccontano il Medioevo valdostano con affreschi memorabili.',
    bullets: [
      'Torrette superiore DOC e cantine della bassa valle.',
      'Lard d’Arnad DOP, carbonada e polenta concia in trattoria.',
      'Mercatini e artigianato: Aosta il sabato mattina, Saint-Vincent con stagionalità alpina.',
    ],
    ctaTo: '/contatti',
    ctaLabel: 'Scopri di più →',
  },
  {
    id: 'eventi',
    icon: 'events',
    title: 'Eventi e tradizioni',
    sub: 'Calendario di valle',
    lede:
      'Tra sagre vinicole, rassegne estive e appuntamenti legati alla montagna, la Valle d’Aosta offre un calendario denso anche fuori dalla stagione sciistica.',
    bullets: [
      'Fiere e mercati stagionali nel centro storico e nelle borgate.',
      'Rievocazioni e feste patronali nei comuni della valle centrale.',
      'Eventi legati alla neve e agli impianti nelle settimane di punta.',
    ],
    ctaTo: '/contatti',
    ctaLabel: 'Scopri di più →',
  },
]

function TerritoryPage() {
  const mainRef = useRef(/** @type {HTMLElement | null} */ (null))
  useTerritorioPageAnimations({ mainRef })

  return (
    <main ref={mainRef} className="page-shell territorio-landing">
      <TerritorioHero
        label="Territorio"
        title="Nel cuore della Valle d'Aosta"
        intro="Saint‑Vincent è una buona fermata sulla valle centrale, fra la Riviera delle Alpi, le storiche cure legate alle acque locali ancora pubblicizzate spesso come Terme Fons Salutis e i collegamenti comodi verso dorsali nevose più note come Monte Rosa o Cervinia. Più sotto distinguiamo cosa vedere davvero a due passi dall'hotel e cosa merita un'uscita giornaliera in automobile."
        imageSrc={bijouImages.editorial.territory}
        imageAlt="Paesaggi e colori lungo la Valle d'Aosta"
        after="Da piazza Cavalieri si dipartono passeggiate tra giardini curati, fontane ornate e vie ordinate del centro; a breve distanza l'atmosfera da borgo alpino lascia spazio anche a serate negli esercizi attorno alla piazza o giornate piene dentro i percorsi termali collinari. Il resto della valle resta raggiungibile in auto spesso in venti‑trenta minuti per sci, sentieri o la solita visita archeologica ad Aosta."
      />

      <TerritorioFeatureSplit
        id="casino"
        title="Casinò de la Vallée"
        subheading="A pochi metri dalla Bijou • Saint-Vincent"
        imageSrc={bijouImages.territorio.casino}
        imageAlt="Esterno del Casinò de la Vallée — facciata con vetrata e insegna, verde e montagne sullo sfondo"
        ctaHref={EXTERNAL.casino}
        ctaLabel="Scopri di più sul Casinò de la Vallée →"
      >
        <p>
          Il <strong>Casino de la Vallée</strong> è la casa da gioco pubblica valdostana: ristrutturata nel progetto
          resort, oggi occupa <strong>oltre 3.000 m² su due piani</strong> collegati al polo alberghiero Billia. È
          annoverata tra le realtà europee più note per <strong>offerta di slot elettroniche</strong> e, dove la
          normativa e il calendario lo prevedono, <strong>tavoli di gioco tradizionale</strong>, tornei e promozioni
          dedicate.
        </p>
        <p>
          Alle origini storiche del <strong>29 aprile 1947</strong> nella sede dell&apos;Grand Hôtel Billia oggi si somma
          una proposta anche di <strong>bar, ristorazione e nightlife</strong> interna alla struttura: utile leggere
          gli avvisi su <strong>eventi dal vivo</strong> e sugli ingressi contingentati nelle giornate di punta della
          stagione sciistica e delle feste.
        </p>
        <TerritorioChecklist
          items={[
            <>
              <strong>Età</strong>: ammessi i <strong>maggiori</strong>; serve un{' '}
              <strong>documento d&apos;identità valido</strong>. Per chi risiede in Valle d&apos;Aosta valgono
              limitazioni nei confronti della partecipazione a taluni giochi — verificate il bollettino aggiornato in
              reception o sul{' '}
              <a href={EXTERNAL.casino} target="_blank" rel="noopener noreferrer">
                sito della casa da gioco
              </a>
              .
            </>,
            <>
              <strong>Ingresso</strong>: in linea di massima gratuito verso gli spazi comuni della visita turistica; per
              l&apos;accesso alle zone di puntata possono essere richieste procedure di accredito tessera loyalty.
            </>,
            <>
              <strong>Orario indicativo ricorrente</strong>: aperture quotidiane a partire dalle ore 10 anche nei weekend
              (confermare su calendario ufficiale stagionale).
            </>,
            <>
              <strong>Dress code</strong>: look ordinato (&quot;smart casual&quot;) consigliato; evitate completo
              sportivo o mare.
            </>,
          ]}
        />
      </TerritorioFeatureSplit>

      <TerritorioFeatureSplit
        id="terme"
        title="Terme e benessere"
        subheading="Saint-Vincent e dintorni"
        imageSrc={bijouImages.territorio.terme}
        imageAlt="Piscina panoramica in ambiente wellness, acqua turchese e terrazza in legno con vista sulle montagne"
        ctaHref={EXTERNAL.qcTerme}
        ctaLabel="Scopri le Terme di Saint-Vincent →"
      >
        <p>
          La tradizione delle <strong>acque oligominerali</strong> dell&apos;alta Valle centrale è legata anche al nome
          storico delle strutture di cura santvincentine: un tempo si parlava delle{' '}
          <strong>Terme Saint-Vincent-Fons Salutis</strong> nella promozione turistica. Oggi l&apos;
          <strong>elegante funicolare</strong> (e la passeggiata pedonabile) permettono ancora di collegare in pochi
          minuti centro e la zona della collina termale, così anche chi alloggia in piazza può raggiungere acqua tiepida
          e rituali wellness <strong>a piedi, senza spostamenti lunghi</strong>.
        </p>
        <p>
          Una giornata termale più ampia — con <strong>giardini d&apos;acqua, percorsi caldo‑freddo</strong> e{' '}
          <strong>piscine esterne</strong> immerse nel bosco della valle del torrente — è ciò che offre il{' '}
          <strong>QC Terme di Pré-Saint-Didier</strong>, circa un quarto d&apos;ora di auto lungo statale verso Morgex:
          ottimo dopo sci o trekking, o come piano B se il tempo in quota è mosso.
        </p>
        <TerritorioNumberedList
          items={[
            'Saint-Vincent: circuiti termali compatti e comodi per un pomeriggio breve.',
            'Pré-Saint-Didier (QC): esperienza ampia nel verde, pranzo light e trattamenti su prenotazione.',
            'Consiglio pratico: ciabatte, accappatoio (se non incluso) e slot orari prenotati in alta affluenza.',
            'Colline termali raggiungibili a piedi dal centro grazie alla funicolare.',
          ]}
        />
      </TerritorioFeatureSplit>

      <TerritorioInfoGrid cards={infoCards} />

      <div className="territorio-landing__container territorio-block">
        <p className="territorio-footnote" data-reveal>
          Orari delle terme e del casino, tariffazione skipass e stato delle piste possono cambiare in blocco stagionale
          — questo testo vuole essere un orientamento dall&apos;hotel: confermate sempre su fonti aggiornate il giorno
          prima del vostro programma.
        </p>
      </div>
    </main>
  )
}

export default TerritoryPage
