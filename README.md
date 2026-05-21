# Portfolio V2

Modernes, responsives Portfolio von Azin Ildas mit Light- / Dark-Mode.
Aktuelle Projekte werden über **Sanity (Headless CMS)** gepflegt,
Schulprojekte stehen statisch in `data.json`.

## Struktur

```
Portfolio_V2/
├── index.html         # Markup + Tailwind-Klassen
├── styles.css         # Custom Styles
├── script.js          # Daten laden, UI, Sanity-Fetch, Theme, Toggle
├── data.json          # Hero / About / Skills / Schulprojekte / Kontakt
├── pictures/          # Lokale Bilder (z. B. Profilbild)
├── studio/            # ← Sanity Studio (eigenes Mini-Projekt)
└── package.json       # Optional: Minify-Script
```

## Lokal starten (Portfolio)

Da `script.js` `fetch("data.json")` nutzt, wird ein kleiner Webserver gebraucht
(nicht per Doppelklick als `file://`).

```bash
# Beispiel mit Node (im Ordner Portfolio_V2):
npx serve .
```

---

## Sanity – Aktuelle Projekte verwalten

**Projekt-ID:** `sj84f28g`
**Dataset:** `production`
**Plan:** Growth Trial

### 1) Studio einmalig einrichten

```bash
cd studio
npm install
npm run dev
```

Studio öffnet sich auf <http://localhost:3333>. Erst-Login geht über deinen
Sanity-Account, der Zugriff auf das Projekt `Portfolio Azin` hat.

### 2) CORS für das Frontend freigeben

Damit das Portfolio (Browser) direkt von Sanity lesen darf, einmalig in
<https://www.sanity.io/manage/personal/project/sj84f28g/api> unter
**CORS origins** diese Origins hinzufügen (jeweils ohne Credentials):

- `http://localhost:3000`  *(falls du `npx serve` o. Ä. nutzt — Port ggf. anpassen)*
- `https://azinildas.github.io`  *(GitHub Pages)*
- Später ggf. dein Custom-Domain

### 3) Projekte anlegen

Im Studio (`Laufende Projekte`) ein neues Dokument anlegen mit:

| Feld         | Pflicht? | Beschreibung                                            |
| ------------ | -------- | ------------------------------------------------------- |
| Titel        | ✓        | z. B. *„Smart Home Dashboard"*                          |
| Untertitel   | –        | Kurzer Beschreiber                                      |
| Beschreibung | ✓        | 2–3 Sätze                                               |
| Projektbild  | –        | Vorschau auf der Karte                                  |
| Tags         | –        | z. B. *FastAPI, Docker, Tailwind*                       |
| Video-Link   | –        | URL zu Demo-Video — **leer = Button verschwindet**      |
| GitHub-Link  | –        | URL zum Repo — **leer = Button verschwindet**           |
| Reihenfolge  | –        | Sortierung (kleinere Zahl = weiter oben)                |

**Publishen** klicken — fertig. Beim nächsten Reload des Portfolios sind die
Projekte sichtbar (gefetched über die GROQ-Query in `script.js`).

### 4) Studio online deployen (optional)

```bash
cd studio
npm run deploy
```

Bekommt dann eine eigene URL `https://<dein-host>.sanity.studio`,
sodass du Projekte auch vom Handy / unterwegs pflegen kannst.

---

## Wie das Frontend mit Sanity spricht

`script.js` macht beim Laden parallel **zwei Requests**:

1. `data.json` — alles Statische (Hero, About, Skills, Schulprojekte, Kontakt)
2. Sanity HTTP API — nur die `currentProjects`

```js
GET https://sj84f28g.api.sanity.io/v2024-01-01/data/query/production?query=…
```

Wenn Sanity erreichbar **und** mindestens 1 Projekt veröffentlicht ist,
übernehmen die Sanity-Daten. Sonst wird die Empty-State-Box angezeigt
*("Hier ist gerade noch nichts veröffentlicht …")* — das Portfolio funktioniert
also auch komplett ohne CMS.

## Schulprojekte ein-/ausklappen

Die 4 alten Projekte (Ski Service Management, SSP, TTT, Snake) sind
standardmäßig zugeklappt und können per Klick auf den Button
*"Schulprojekte ansehen"* unten in der Projekt-Sektion ausgeklappt werden.

---

## Kontaktformular (Web3Forms)

Das Formular im Kontakt-Bereich verschickt echte E-Mails über
[Web3Forms](https://web3forms.com) – kostenlos, ohne Account, ohne Backend.

### Setup (einmalig, ~2 Min)

1. Auf <https://web3forms.com> deine E-Mail eingeben → Access Key kommt
   per Mail.
2. Den Key in `script.js` einsetzen:

   ```js
   const CONTACT_FORM = {
     accessKey: "DEIN_ACCESS_KEY_HIER",
     endpoint: "https://api.web3forms.com/submit",
   };
   ```
3. Speichern, Seite neu laden, Test-Nachricht abschicken — sollte direkt im
   deinem Postfach (`a.ildas@m2apla.ch`) ankommen.

Solange der Key leer ist, zeigt das Formular einen freundlichen Hinweis an
und verweist auf die Kontakt-Links daneben.

---

## Minify (optional)

```bash
npm install
npm run minify
```

Erzeugt `script.min.js` und `styles.min.css` (gitignored).
