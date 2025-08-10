# Sito Web Dott.ssa Giulia Nicolino - Psicologa Psicoterapeuta

Un sito web moderno e responsive realizzato con JavaScript ES6 puro, design mobile-first e effetti "WOW" per la Dott.ssa Giulia Nicolino, Psicologa Psicoterapeuta a Bergamo.

## 🚀 Caratteristiche Principali

- **Design Mobile-First**: Ottimizzato per tutti i dispositivi, dai telefoni ai desktop
- **Effetti WOW**: Animazioni fluide e coinvolgenti con Animate On Scroll (AOS)
- **JavaScript ES6 Modulare**: Architettura pulita e mantenibile
- **Google Maps Integration**: Mappa interattiva con fallback
- **Form di Contatto Avanzato**: Validazione real-time e UX ottimizzata
- **Performance Ottimizzate**: Caricamento rapido e smooth scrolling
- **Accessibilità**: Supporto per screen reader e navigazione da tastiera

## 📁 Struttura del Progetto

```
├── index.html                 # Pagina principale
├── css/
│   ├── main.css              # Stili principali (mobile-first)
│   └── animations.css        # Animazioni e effetti
├── js/
│   ├── main.js              # File principale dell'applicazione
│   └── modules/             # Moduli JavaScript
│       ├── AnimationManager.js    # Gestione animazioni AOS
│       ├── NavigationManager.js   # Navigazione e scroll spy
│       ├── ContactForm.js         # Form di contatto
│       ├── MapIntegration.js      # Integrazione Google Maps
│       └── ComponentManager.js    # Gestione componenti dinamici
├── data/
│   └── content.js           # Contenuti del sito
├── images/
│   ├── copertina iniziale.avif
│   ├── foto psicologa.avif
│   └── logo.avif
└── README.md
```

## 🛠️ Setup e Installazione

### 1. Google Maps API Key

Per utilizzare Google Maps, dovrai:

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita l'API "Maps JavaScript API" e "Geocoding API"
4. Crea credenziali (API Key)
5. Sostituisci `YOUR_GOOGLE_MAPS_API_KEY` nel file `index.html` con la tua API key

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=TUA_API_KEY_QUI&callback=initMap"></script>
```

**Nota**: L'integrazione di Google Maps ora utilizza l'indirizzo `Piazzale Lodovico Goisis 1, 24124 Bergamo BG` che viene automaticamente geocodificato in coordinate per posizionare il marker correttamente.

### 2. Server Locale

Il sito utilizza ES6 modules, quindi deve essere servito tramite HTTP(S):

**Opzione 1: Live Server (VS Code)**
```bash
# Installa l'estensione Live Server in VS Code
# Fai clic destro su index.html e seleziona "Open with Live Server"
```

**Opzione 2: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opzione 3: Node.js HTTP Server**
```bash
npx http-server -p 8000
```

Apri il browser su `http://localhost:8000`

## 🎨 Personalizzazione

### Contenuti

Modifica il file `data/content.js` per aggiornare:
- Informazioni personali
- Servizi offerti
- Collaborazioni
- Contatti

### Stili

I colori principali sono definiti nelle variabili CSS in `css/main.css`:

```css
:root {
    --primary-color: #2C5F7A;    /* Blu principale */
    --secondary-color: #4A90A4;  /* Blu secondario */
    --accent-color: #7FB3D3;     /* Blu accent */
    /* ... altre variabili */
}
```

### Immagini

Sostituisci le immagini nella cartella `images/` mantenendo gli stessi nomi o aggiorna i riferimenti nel codice.

## 📱 Responsive Design

Il sito utilizza un approccio mobile-first con breakpoint:

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: ≥ 1024px

## ⚡ Performance

### Ottimizzazioni Implementate

- **Lazy Loading**: Componenti caricati on-demand
- **Image Optimization**: Formato AVIF per immagini leggere
- **CSS/JS Minification**: Codice ottimizzato per produzione
- **Intersection Observer**: Animazioni efficienti
- **Debounced Events**: Gestione ottimizzata di scroll e resize

### Metriche di Performance

Il sito è ottimizzato per:
- Lighthouse Score > 90
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Cumulative Layout Shift < 0.1

## 🔧 Sviluppo

### Aggiungere Nuove Animazioni

```javascript
// In AnimationManager.js
this.observeElements('[data-aos="nuova-animazione"]');

// Nel CSS
[data-aos="nuova-animazione"] {
    transform: /* stato iniziale */;
}

[data-aos="nuova-animazione"].aos-animate {
    transform: /* stato finale */;
}
```

### Aggiungere Nuovi Componenti

```javascript
// In ComponentManager.js
this.components.set('nuovoComponente', {
    selector: '.nuovo-componente',
    renderer: this.renderNuovoComponente.bind(this),
    data: /* dati del componente */
});
```

## 📧 Form di Contatto

Il form include:
- Validazione real-time
- Messaggi di errore personalizzati
- Loading states
- Accessibilità completa

Per collegarlo a un backend, modifica il metodo `submitForm` in `ContactForm.js`.

## 🗺️ Google Maps

### Integrazione con Indirizzo

L'integrazione di Google Maps ora utilizza direttamente l'indirizzo `Piazzale Lodovico Goisis 1, 24124 Bergamo BG` dal file `content.js`. Il sistema:

1. **Geocodifica automaticamente** l'indirizzo in coordinate
2. **Posiziona il marker** nella posizione corretta
3. **Mostra un fallback** se il geocoding fallisce
4. **Utilizza coordinate di backup** per Bergamo centro in caso di errore

### Test dell'Integrazione

Per testare specificamente Google Maps:
```bash
# Avvia il server locale
python -m http.server 8000

# Visita la pagina di test
http://localhost:8000/test-maps.html
```

### Personalizzazione Mappa

Modifica `MapIntegration.js` per:
- Cambiare stili della mappa
- Aggiornare marker personalizzato  
- Modificare contenuto info window
- Aggiornare l'indirizzo nel file `data/content.js`

### Fallback

Se Google Maps non si carica, viene mostrato un fallback con:
- Link diretto a Google Maps con l'indirizzo corretto
- Numero di telefono
- Indicazioni alternative

## 🌐 Browser Support

- Chrome (ultime 3 versioni)
- Firefox (ultime 3 versioni)
- Safari (ultime 2 versioni)
- Edge (ultime 2 versioni)

## 📄 Licenza

Questo progetto è stato sviluppato per la Dott.ssa Giulia Nicolino. 
Tutti i diritti riservati.

## 🤝 Supporto

Per supporto tecnico o personalizzazioni, contatta lo sviluppatore.

---

**Nota**: Ricorda di sostituire l'API key di Google Maps prima di mettere il sito in produzione!
