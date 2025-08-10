// js/modules/MapIntegration.js
export class MapIntegration {
    constructor(config = {}) {
        this.config = {
            containerId: 'google-map',
            address: 'Piazzale Lodovico Goisis 1, 24124 Bergamo BG',
            center: { lat: 45.6982642, lng: 9.6772698 }, // Coordinate dirette di Bergamo
            zoom: 16,
            styles: this.getMapStyles(),
            markerTitle: 'Dott.ssa Giulia Nicolino - Psicologa Psicoterapeuta',
            infoWindowContent: this.getInfoWindowContent(),
            ...config
        };
        
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
        this.isLoaded = false;
        
        this.init();
    }

    async init() {
        try {
            await this.waitForGoogleMaps();
            this.initializeMap();
        } catch (error) {
            console.error('Errore nel caricamento di Google Maps:', error);
        }
    }

    waitForGoogleMaps() {
        return new Promise((resolve, reject) => {
            // Se Google Maps è già caricato
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            // Aspetta che Google Maps si carichi
            const checkGoogleMaps = () => {
                if (window.google && window.google.maps) {
                    resolve();
                } else {
                    setTimeout(checkGoogleMaps, 100);
                }
            };

            // Timeout dopo 10 secondi
            setTimeout(() => {
                reject(new Error('Timeout nel caricamento di Google Maps'));
            }, 10000);

            checkGoogleMaps();
        });
    }

    initializeMap() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            console.error(`Container con ID ${this.config.containerId} non trovato`);
            return;
        }

        try {
            // Crea la mappa
            this.map = new google.maps.Map(container, {
                center: this.config.center,
                zoom: this.config.zoom,
                styles: this.config.styles,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: false,
                fullscreenControl: true,
                gestureHandling: 'cooperative'
            });

            // Aggiungi il marker
            this.addMarker();
            
            // Aggiungi l'info window
            this.addInfoWindow();
            
            // Setup eventi
            this.setupEventListeners();
            
            this.isLoaded = true;
            
            // Trigger evento custom
            container.dispatchEvent(new CustomEvent('mapLoaded', {
                detail: { map: this.map }
            }));

        } catch (error) {
            console.error('Errore nell\'inizializzazione della mappa:', error);
        }
    }

    addMarker() {
        // Crea un'icona personalizzata
        const markerIcon = {
            url: 'data:image/svg+xml,' + encodeURIComponent(this.getMarkerSVG()),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40)
        };

        this.marker = new google.maps.Marker({
            position: this.config.center,
            map: this.map,
            title: this.config.markerTitle,
            icon: markerIcon,
            animation: google.maps.Animation.DROP
        });

        // Aggiungi animazione bounce al click
        this.marker.addListener('click', () => {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                this.marker.setAnimation(null);
            }, 1400);
            
            this.toggleInfoWindow();
        });
    }

    addInfoWindow() {
        this.infoWindow = new google.maps.InfoWindow({
            content: this.config.infoWindowContent,
            maxWidth: 300
        });

        // Apri l'info window di default
        this.infoWindow.open(this.map, this.marker);
    }

    toggleInfoWindow() {
        if (this.infoWindow.getMap()) {
            this.infoWindow.close();
        } else {
            this.infoWindow.open(this.map, this.marker);
        }
    }

    setupEventListeners() {
        // Resize della mappa quando la finestra cambia dimensioni
        window.addEventListener('resize', () => {
            if (this.map) {
                google.maps.event.trigger(this.map, 'resize');
                this.map.setCenter(this.config.center);
            }
        });

        // Gestione della vista mobile
        this.handleMobileView();
    }

    handleMobileView() {
        if (window.innerWidth <= 768) {
            // Su mobile, disabilita il drag per permettere lo scroll della pagina
            this.map.setOptions({
                gestureHandling: 'cooperative',
                draggable: false
            });

            // Riabilita il drag quando l'utente tocca la mappa
            this.map.addListener('click', () => {
                this.map.setOptions({ draggable: true });
                
                // Disabilita di nuovo dopo 3 secondi
                setTimeout(() => {
                    this.map.setOptions({ draggable: false });
                }, 3000);
            });
        }
    }

    getMapStyles() {
        // Stile personalizzato per la mappa
        return [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#2C5F7A"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#4A90A4"}, {"visibility": "on"}]
            }
        ];
    }

    getMarkerSVG() {
        return `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="markerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#2C5F7A;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#4A90A4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M20 0C13.372 0 8 5.372 8 12c0 9 12 28 12 28s12-19 12-28c0-6.628-5.372-12-12-12z" 
                      fill="url(#markerGradient)" stroke="#ffffff" stroke-width="2"/>
                <circle cx="20" cy="12" r="6" fill="#ffffff"/>
                <text x="20" y="16" text-anchor="middle" fill="#2C5F7A" font-family="Arial" font-size="12" font-weight="bold">P</text>
            </svg>
        `;
    }

    getInfoWindowContent() {
        return `
            <div style="padding: 10px; max-width: 250px; font-family: 'Inter', sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #2C5F7A; font-size: 16px;">
                    Dott.ssa Giulia Nicolino
                </h3>
                <p style="margin: 0 0 8px 0; color: #5D6D7E; font-size: 14px;">
                    Psicologa - Psicoterapeuta
                </p>
                <p style="margin: 0 0 12px 0; color: #5D6D7E; font-size: 13px;">
                    <i class="fas fa-map-marker-alt" style="color: #4A90A4; margin-right: 5px;"></i>
                    ${this.config.address}
                </p>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <a href="tel:+393391800568" 
                       style="display: inline-flex; align-items: center; gap: 5px; 
                              background: #2C5F7A; color: white; padding: 6px 12px; 
                              border-radius: 6px; text-decoration: none; font-size: 12px;">
                        <i class="fas fa-phone"></i>
                        Chiama
                    </a>
                    <a href="https://maps.google.com/directions?daddr=${encodeURIComponent(this.config.address)}" 
                       target="_blank"
                       style="display: inline-flex; align-items: center; gap: 5px; 
                              background: #4A90A4; color: white; padding: 6px 12px; 
                              border-radius: 6px; text-decoration: none; font-size: 12px;">
                        <i class="fas fa-directions"></i>
                        Indicazioni
                    </a>
                </div>
            </div>
        `;
    }

    // Metodi pubblici
    centerOnLocation() {
        if (this.map) {
            this.map.panTo(this.config.center);
            this.map.setZoom(this.config.zoom);
        }
    }

    showInfoWindow() {
        if (this.infoWindow && this.marker) {
            this.infoWindow.open(this.map, this.marker);
        }
    }

    hideInfoWindow() {
        if (this.infoWindow) {
            this.infoWindow.close();
        }
    }

    updateMarkerPosition(lat, lng) {
        // Solo coordinate numeriche
        const newPosition = { lat, lng };
        this.config.center = newPosition;
        
        if (this.marker) {
            this.marker.setPosition(newPosition);
        }
        
        if (this.map) {
            this.map.setCenter(newPosition);
        }
    }

    setMapStyle(styles) {
        if (this.map) {
            this.map.setOptions({ styles });
        }
    }

    // Cleanup
    destroy() {
        if (this.map) {
            google.maps.event.clearInstanceListeners(this.map);
        }
        if (this.marker) {
            google.maps.event.clearInstanceListeners(this.marker);
        }
        if (this.infoWindow) {
            this.infoWindow.close();
        }
        
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
    }
}

// Funzione globale per l'inizializzazione della mappa (richiesta da Google Maps API)
window.initMap = function() {
    // Questa funzione verrà chiamata quando l'API di Google Maps sarà caricata
    console.log('Google Maps API caricata');
    
    // Trigger evento custom per notificare che l'API è pronta
    window.dispatchEvent(new CustomEvent('googleMapsReady'));
};
