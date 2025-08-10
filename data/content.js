// data/content.js - Contenuti del sito
export const siteContent = {
    hero: {
        title: "Esistono per te diversi mondi possibili",
        subtitle: "alcune volte però serve una mano per poterli esplorare",
        cta: "Iniziamo questo viaggio insieme?"
    },
    
    about: {
        title: "PSICO...CHI?",
        name: "Giulia Nicolino",
        profession: "Psicologa Clinica specializzata in Psicoterapia Sistemico-Relazionale",
        registration: "Psicologa - Psicoterapeuta iscritta alla sezione A dell'Albo Professionale - Ordine degli Psicologi della Lombardia, n°22599",
        bio: `Mi occupo di <strong>Sostegno Psicologico</strong>, <strong>Psicoterapia</strong> e di <strong>Promozione della Salute</strong>.

Nata e cresciuta in Calabria, in un paesino di campagna sulla costa tirrenica, spinta dalla voglia di intraprendere lo studio della psicologia, mi sono spostata negli anni, abitando diversi luoghi, contesti, culture.

Ognuno di questi posti mi ha permesso di collezionare esperienze e relazioni preziose, plasmando il mio stile, determinando chi oggi sono sia a livello privato che professionale.`,
        education: [
            {
                degree: "Laurea Triennale",
                location: "Perugia",
                focus: "Approfondendo i temi dell'autoregolazione e del goal setting"
            },
            {
                degree: "Esperienza Internazionale",
                location: "Berlino",
                focus: "Esperienze cliniche e educative, conoscenza del modello sistemico-relazionale"
            },
            {
                degree: "Laurea Magistrale",
                location: "Università di Bergamo",
                focus: "Psicologia Clinica, tirocinio presso Centro Shinui"
            },
            {
                degree: "Specializzazione Quadriennale",
                location: "Scuola di Psicoterapia Sistemico-Dialogica di Bergamo",
                focus: "Tirocini presso Cooperativa Biplano e Consultorio Don Stefano Palla"
            }
        ]
    },

    services: [
        {
            id: 'consulenze',
            title: 'Consulenze e Psicoterapia',
            icon: '🧠',
            description: 'Consulenze, sostegno psicologico, psicoterapia e promozione del benessere relazionale per individui, coppie, famiglie e gruppi.',
            features: [
                'Difficoltà nel superare momenti di crisi, conflitto o stress',
                'Terapia di coppia e familiare (per ogni tipo e forma di famiglia!)',
                'Fatiche legate a vissuti ansiosi e depressivi',
                'Problemi relazionali ed emotivi',
                'Disturbi del comportamento alimentare',
                'Sostegno nel periodo perinatale',
                'Supporto allo sviluppo personale nell\'ambito privato o professionale',
                'Supervisione a docenti ed educatori'
            ]
        },
        {
            id: 'adolescenti',
            title: 'Colloquio Motivazionale per Adolescenti e Giovani Adulti',
            icon: '🌱',
            description: 'L\'adolescenza è una fase dello sviluppo delicata, con le sue complessità e meravigliose ambivalenze. Stimolando la sua naturale motivazione e forte di una buona relazione, il metodo del Colloquio Motivazionale permette di abbattere le resistenze a favore della possibilità di affrontare insieme le insicurezze che spesso contraddistinguono cambiamenti ed evoluzioni.',
            features: [
                'Supporto durante cambiamenti evolutivi',
                'Gestione delle insicurezze adolescenziali',
                'Stimolo della motivazione naturale',
                'Approccio relazionale personalizzato',
                'Abbattimento delle resistenze',
                'Accompagnamento nelle transizioni di vita'
            ]
        },
        {
            id: 'laboratorio',
            title: 'Laboratorio Dialogico Espressivo',
            icon: '🎭',
            description: 'Il laboratorio si configura come un percorso svolto in gruppo che ha come obiettivo quello di migliorare le competenze emotive, relazionali e comunicative dei partecipanti, tramite l\'utilizzo di tecniche espressive di vario tipo. Il laboratorio può essere adattato a vari ambiti e contesti.',
            features: [
                'Confronto con persone in situazioni simili in modo creativo',
                'Lavoro sul riconoscimento delle emozioni',
                'Miglioramento delle competenze relazionali e comunicative',
                'Utilizzo di tecniche espressive innovative',
                'Co-condotto con la Dott.ssa Alessia Frigerio',
                'Adattabile a diversi contesti'
            ]
        },
        {
            id: 'promozione',
            title: 'Promozione della Salute',
            icon: '🏢',
            description: 'Sei un\'azienda, scuola o associazione? Conosciamoci e creiamo insieme il progetto più adatto alla tua realtà al fine di pianificare interventi preventivi e/o volti a migliorare il benessere delle persone che la vivono.',
            features: [
                'Progetti personalizzati per aziende',
                'Interventi preventivi nelle scuole',
                'Programmi per associazioni',
                'Valutazione dello stress lavoro-correlato',
                'Promozione del benessere organizzativo',
                'Formazione e supervisione'
            ]
        }
    ],

    modalities: [
        {
            icon: 'fas fa-map-marker-alt',
            title: 'Incontri in presenza',
            description: 'A Bergamo presso la Cooperativa Il Dialogo<br>(Piazzale L. Goisis 1)'
        },
        {
            icon: 'fas fa-laptop',
            title: 'Colloqui Online',
            description: 'Per persone fuori Regione, Italiani all\'estero o per preferenza personale'
        },
        {
            icon: 'fas fa-home',
            title: 'Interventi domiciliari',
            description: 'Possibilità di concordare incontri a domicilio'
        },
        {
            icon: 'fas fa-language',
            title: 'Colloqui in tedesco',
            description: 'Disponibilità per colloqui anche in lingua tedesca'
        }
    ],

    collaborations: [
        {
            title: 'ASST Papa Giovanni XXIII',
            description: 'SC Psicologia - Sostegno psicologico nel reparto cardiopatie congenite e patologia neonatale'
        },
        {
            title: 'Un porto per noi',
            description: 'Co-conduzione incontri di gruppo con la Dott.ssa Alessia Frigerio'
        },
        {
            title: 'Équipe SLC',
            description: 'Valutazione e prevenzione dello stress lavoro correlato e promozione del benessere aziendale'
        },
        {
            title: 'Scuola di Psicoterapia Sistemico-Dialogica',
            description: 'Progetto "Dialogo Virale" e ricerca sulla psicoterapia sistemico-dialogica di gruppo'
        }
    ],

    contact: {
        phone: '339 180 0568',
        email: 'info@giulianicolino.com',
        address: 'Piazzale Lodovico Goisis 1, 24124 Bergamo BG',
        coordinates: { lat: 45.7086322, lng: 9.6787935 },
        social: {
            linkedin: 'https://www.linkedin.com/in/giulia-nicolino-a97a02a0/',
            instagram: 'https://www.instagram.com/giulia.nicolino_psicologa/'
        },
        whatsapp: 'https://wa.me/393391800568'
    },

    footer: {
        title: 'Dott.ssa Giulia Nicolino',
        subtitle: 'Psicologa - Psicoterapeuta Sistemico Relazionale',
        piva: 'P.IVA 04473420166',
        copyright: '©2024 Dott.ssa Giulia Nicolino. Tutti i diritti riservati.'
    }
};
