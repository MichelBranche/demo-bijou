# SEO Launch Checklist — Hotel Bijou

## 1) Canonical Domain
- [x] Dominio canonico scelto: `https://www.bijouhotel.it`.
- [x] In Vercel impostato redirect 301 da `https://bijouhotel.it` a `https://www.bijouhotel.it`.
- [ ] Verifica da browser e terminale che tutte le varianti rispondano con 301 verso il canonico.

## 2) Search Console (Google)
- [ ] Crea proprietà `Domain` in Google Search Console.
- [ ] Verifica DNS (TXT) sul provider dominio.
- [ ] Invia sitemap: `https://www.bijouhotel.it/sitemap.xml`.
- [ ] Controlla in `Indicizzazione > Pagine` eventuali errori (noindex, canonical errata, soft 404).
- [ ] Usa `Controllo URL` per:
  - `/`
  - `/hotel`
  - `/camere`
  - `/territorio`
  - `/contatti`
- [ ] Se necessario, richiedi indicizzazione manuale delle 5 URL.

## 3) Bing Webmaster Tools
- [ ] Crea proprietà sito.
- [ ] Verifica dominio.
- [ ] Invia sitemap XML.

## 4) Robots & Sitemap
- [ ] Verifica che `https://www.bijouhotel.it/robots.txt` sia pubblico.
- [ ] Verifica che `https://www.bijouhotel.it/sitemap.xml` sia valido e leggibile.
- [ ] Conferma che tutte le URL in sitemap restituiscano `200`.

## 5) Meta e Canonical (QA finale)
- [ ] Ogni route ha `title` unico e coerente.
- [ ] Ogni route ha `meta description` unica.
- [ ] Ogni route ha `canonical` assoluta al dominio canonico.
- [ ] Ogni route ha Open Graph (`og:title`, `og:description`, `og:image`, `og:url`).
- [ ] Ogni route ha Twitter card (`summary_large_image`).

## 6) Structured Data
- [ ] Homepage: `Hotel` + `WebSite` validi.
- [ ] `Hotel`, `Camere`, `Territorio`, `Contatti`: `WebPage` / `ContactPage` validi.
- [ ] Test su Rich Results Test (Google) senza errori bloccanti.

## 7) Performance & CWV
- [ ] Lighthouse Mobile (prod URL, no localhost) target:
  - Performance >= 90
  - SEO = 100
  - Best Practices >= 95
  - Accessibility >= 95
- [ ] Web Vitals in Search Console (mobile/desktop): monitorare LCP, INP, CLS.
- [ ] Ottimizzare immagini più pesanti se LCP in rosso (priorità hero homepage).

## 8) Local SEO Essentials
- [ ] Google Business Profile completo (NAP coerente con sito).
- [ ] NAP identico su sito, GBP, Booking/Facebook.
- [ ] Aggiungi foto recenti e categorie corrette su GBP.
- [ ] Raccogli e rispondi alle recensioni regolarmente.

## 9) Monitoring Continuo
- [ ] Imposta reminder mensile:
  - Search Console errori indicizzazione
  - Query/click/CTR per pagina
  - Pagine con calo traffico
- [ ] Aggiorna sitemap quando aggiungi nuove route.
- [ ] Re-test Rich Results dopo ogni modifica SEO.

## 10) Quick Acceptance Test (go-live)
- [ ] `curl -I https://www.bijouhotel.it/` -> `200`.
- [ ] `curl -I https://www.bijouhotel.it/hotel` -> `200`.
- [ ] `curl -I https://www.bijouhotel.it/robots.txt` -> `200`.
- [ ] `curl -I https://www.bijouhotel.it/sitemap.xml` -> `200`.
- [ ] Versione non canonica -> `301` verso canonica.

