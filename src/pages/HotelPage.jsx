import { useRef } from 'react'
import { bijouImages } from '@/assets/images'
import { useHotelPageAnimations } from '@/hooks/useHotelPageAnimations'
import Hero from '@/components/hotel/Hero'
import SectionIntro from '@/components/hotel/SectionIntro'
import ImageGallery from '@/components/hotel/ImageGallery'
import Wellness from '@/components/hotel/Wellness'
import AccessibilityCard from '@/components/hotel/AccessibilityCard'
import '@/styles/hotel-page.css'

const hotelPhoto = bijouImages.hotelPage

const hotelSpazioAlts = [
  'Angolo lettura con libreria e poltrone · ambienti comuni Hotel Bijou',
  'Salotto con libreria bianca, zona relax e illuminazione morbida · Hotel Bijou',
]

const hotelColazioneAlts = [
  'Sala colazioni con passaggi dipinti nel blu e tavolate su tovaglie rosse · Hotel Bijou',
  'Tavola colazione dall’alto su tovaglia rossa · Hotel Bijou',
  'Servizio à la carte al tavolo: cappuccino, paste salate e selezione dolce · Hotel Bijou',
  'Buffet yogurt e formaggi locali Petit Brusson e Toma di Gressoney · Hotel Bijou',
]

function HotelPage() {
  const mainRef = useRef(null)
  const galleryRef = useRef(null)

  useHotelPageAnimations({ mainRef, galleryRef })

  const heroImages = hotelPhoto.spaziComuni.map((src, i) => ({
    src,
    alt: hotelSpazioAlts[i] ?? `Spazi comuni Hotel Bijou ${i + 1}`,
  }))

  const galleryItems = hotelPhoto.colazione.slice(0, 4).map((src, i) => ({
    src,
    alt: hotelColazioneAlts[i] ?? `Colazione Hotel Bijou ${i + 1}`,
  }))

  return (
    <main ref={mainRef} className="page-shell hotel-landing">
      <Hero
        label="Hotel"
        title="Hotel Bijou"
        description={`Per noi l'Hotel Bijou è la nostra casa e vogliamo condividerla con te. Il calore del caminetto, i pavimenti e i mobili in legno antico e i tessuti naturali, il tutto abbinato ad elementi di design moderno, creano un'atmosfera magica dove ti aspettiamo per accoglierti con un sorriso.`}
        images={heroImages}
      />

      <SectionIntro id="arredi" icon="sofa" title="Arredi e ambienti">
        <p>
          Tutti gli arredi del nostro boutique hotel a Saint‑Vincent sono frutto di un&apos;accurata ricerca al fine di
          creare un&apos;atmosfera calda e raffinata sia nelle camere che negli ambienti comuni. Il soggiorno e la sala
          colazioni al piano terra, insieme al dehors situato sulla piazza, ti offrono un affaccio unico sulla vita del
          paese.
        </p>
      </SectionIntro>

      <SectionIntro id="colazione" icon="coffee" title="La colazione">
        <p>
          Ogni mattina a colazione ti aspetta il nostro ricco buffet composto da un&apos;attenta selezione dei migliori
          prodotti tipici valdostani: dai salumi e formaggi di macellerie e caseifici locali, il latte e lo yogurt da
          una piccola azienda agricola del Col de Joux, fino al caffè torrefatto a Morgex, il tutto accompagnato da
          un&apos;ampia scelta di torte e dolcetti fatti in casa e un servizio di caffetteria al tavolo. Su richiesta è
          possibile ordinare anche prodotti senza glutine, specifici per celiaci.
        </p>
      </SectionIntro>

      <ImageGallery ref={galleryRef} items={galleryItems} />

      <Wellness
        label="Benessere"
        title="Zona benessere"
        description="Abbiamo inoltre predisposto una piccola zona benessere dove, tra sauna, bagno turco, docce a cascata e angolo tisane, potrai rilassarti dopo una giornata trascorsa alla scoperta delle nostre valli. Prenota presso la reception per accedervi in uso esclusivo in qualunque momento della giornata."
        imageSrc={hotelPhoto.benessereSauna}
        imageAlt="Interno sauna in legno naturale · area benessere Hotel Bijou"
      >
        <AccessibilityCard />
      </Wellness>
    </main>
  )
}

export default HotelPage
