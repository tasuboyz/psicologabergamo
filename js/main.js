// js/main.js - File principale dell'applicazione
import { AnimationManager } from './modules/AnimationManager.js';
import { NavigationManager } from './modules/NavigationManager.js';
import { ContactForm } from './modules/ContactForm.js';
import { MapIntegration } from './modules/MapIntegration.js';
import { ComponentManager } from './modules/ComponentManager.js';
import { siteContent } from '../data/content.js';

class PsicologaBergamoApp {
    constructor() {
        this.modules = {};
        this.isLoaded = false;
        this.loadingScreen = document.getElementById('loading-screen');
        
        this.init();
    }

    async init() {
        try {
            // Mostra la schermata di caricamento
            this.showLoadingScreen();
            
            // Aspetta che il DOM sia completamente caricato
            await this.waitForDOMContent();
            
            // Precarica le risorse critiche
            await this.preloadCriticalResources();
            
            // Inizializza i moduli
            await this.initializeModules();
            
            // Setup eventi globali
            this.setupGlobalEvents();
            
            // Nascondi la schermata di caricamento
            await this.hideLoadingScreen();
            
            // Avvia animazioni iniziali
            this.startInitialAnimations();
            
            this.isLoaded = true;
            
            console.log('🎉 Applicazione caricata con successo!');
            
        } catch (error) {
            console.error('❌ Errore durante l\'inizializzazione:', error);
            this.handleInitializationError(error);
        }
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
    }

    async hideLoadingScreen() {
        return new Promise((resolve) => {
            if (this.loadingScreen) {
                setTimeout(() => {
                    this.loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        this.loadingScreen.style.display = 'none';
                        resolve();
                    }, 500);
                }, 1000); // Attendi almeno 1 secondo per una migliore UX
            } else {
                resolve();
            }
        });
    }

    waitForDOMContent() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async preloadCriticalResources() {
        const imagesToPreload = [
            'images/copertina iniziale.avif',
            'images/foto psicologa.avif',
            'images/logo.avif'
        ];

        const preloadPromises = imagesToPreload.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = () => {
                    console.warn(`⚠️ Impossibile precaricare: ${src}`);
                    resolve(); // Non bloccare l'app per immagini mancanti
                };
                img.src = src;
            });
        });

        await Promise.all(preloadPromises);
    }

    async initializeModules() {
        try {
            // Inizializza i moduli in ordine di priorità
            
            // 1. Component Manager (per renderizzare i contenuti)
            this.modules.componentManager = new ComponentManager();
            
            // 2. Animation Manager (per gli effetti visivi)
            this.modules.animationManager = new AnimationManager();
            
            // 3. Navigation Manager (per la navigazione)
            this.modules.navigationManager = new NavigationManager();
            
            // 4. Contact Form (per il form di contatto)
            this.modules.contactForm = new ContactForm();
            
            // 5. Map Integration (può essere caricata in modo asincrono)
            this.initializeMapWithFallback();
            
            console.log('✅ Tutti i moduli inizializzati');
            
        } catch (error) {
            console.error('❌ Errore nell\'inizializzazione dei moduli:', error);
            throw error;
        }
    }

    async initializeMapWithFallback() {
        try {
            // Aspetta che Google Maps sia pronto
            await this.waitForGoogleMaps();
            
            this.modules.mapIntegration = new MapIntegration({
                address: siteContent.contact.address,
                markerTitle: `${siteContent.footer.title} - ${siteContent.footer.subtitle}`,
                infoWindowContent: this.getCustomInfoWindowContent()
            });
            
            console.log('✅ Google Maps inizializzato');
            
        } catch (error) {
            console.warn('⚠️ Google Maps non disponibile, usando fallback:', error);
            this.showMapFallback();
        }
    }

    waitForGoogleMaps() {
        return new Promise((resolve, reject) => {
            // Timeout dopo 5 secondi
            const timeout = setTimeout(() => {
                reject(new Error('Timeout Google Maps'));
            }, 5000);

            // Se Google Maps è già disponibile
            if (window.google && window.google.maps) {
                clearTimeout(timeout);
                resolve();
                return;
            }

            // Ascolta l'evento personalizzato
            window.addEventListener('googleMapsReady', () => {
                clearTimeout(timeout);
                resolve();
            }, { once: true });
        });
    }

    showMapFallback() {
        const mapContainer = document.getElementById('google-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-fallback">
                    <div class="fallback-content">
                        <i class="fas fa-map-marked-alt"></i>
                        <h4>Studio di Psicologia</h4>
                        <p><strong>${siteContent.contact.address}</strong></p>
                        <div class="fallback-actions">
                            <a href="https://maps.google.com/search/${encodeURIComponent(siteContent.contact.address)}" 
                               target="_blank" class="btn btn-primary btn-sm">
                                <i class="fas fa-external-link-alt"></i>
                                Apri in Google Maps
                            </a>
                            <a href="tel:${siteContent.contact.phone.replace(/\s/g, '')}" 
                               class="btn btn-secondary btn-sm">
                                <i class="fas fa-phone"></i>
                                ${siteContent.contact.phone}
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getCustomInfoWindowContent() {
        return `
            <div style="padding: 15px; max-width: 280px; font-family: 'Inter', sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #2C5F7A; font-size: 18px; font-weight: 600;">
                    ${siteContent.footer.title}
                </h3>
                <p style="margin: 0 0 12px 0; color: #4A90A4; font-size: 14px; font-weight: 500;">
                    ${siteContent.footer.subtitle}
                </p>
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0 0 5px 0; color: #5D6D7E; font-size: 13px; display: flex; align-items: center;">
                        <i class="fas fa-map-marker-alt" style="color: #4A90A4; margin-right: 8px; width: 12px;"></i>
                        ${siteContent.contact.address}
                    </p>
                    <p style="margin: 0 0 5px 0; color: #5D6D7E; font-size: 13px; display: flex; align-items: center;">
                        <i class="fas fa-phone" style="color: #4A90A4; margin-right: 8px; width: 12px;"></i>
                        ${siteContent.contact.phone}
                    </p>
                    <p style="margin: 0; color: #5D6D7E; font-size: 13px; display: flex; align-items: center;">
                        <i class="fas fa-envelope" style="color: #4A90A4; margin-right: 8px; width: 12px;"></i>
                        ${siteContent.contact.email}
                    </p>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <a href="tel:${siteContent.contact.phone.replace(/\s/g, '')}" 
                       style="display: inline-flex; align-items: center; gap: 5px; 
                              background: #2C5F7A; color: white; padding: 8px 12px; 
                              border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                        <i class="fas fa-phone"></i>
                        Chiama ora
                    </a>
                    <a href="${siteContent.contact.whatsapp}" 
                       target="_blank"
                       style="display: inline-flex; align-items: center; gap: 5px; 
                              background: #25D366; color: white; padding: 8px 12px; 
                              border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                    <a href="https://maps.google.com/directions?daddr=${encodeURIComponent(siteContent.contact.address)}" 
                       target="_blank"
                       style="display: inline-flex; align-items: center; gap: 5px; 
                              background: #4A90A4; color: white; padding: 8px 12px; 
                              border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                        <i class="fas fa-directions"></i>
                        Indicazioni
                    </a>
                </div>
            </div>
        `;
    }

    setupGlobalEvents() {
        // Gestione errori globali
        window.addEventListener('error', (event) => {
            console.error('❌ Errore JavaScript:', event.error);
            this.handleGlobalError(event.error);
        });

        // Gestione errori di caricamento risorse
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Promise non gestita:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Gestione cambio orientamento (mobile)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Gestione resize finestra
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250);
        });

        // Gestione visibilità pagina (tab switch)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Gestione scroll per performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                this.handleOptimizedScroll();
                scrollTimeout = null;
            }, 16); // 60fps
        }, { passive: true });
    }

    startInitialAnimations() {
        // Anima l'entrata del contenuto principale
        setTimeout(() => {
            document.body.classList.add('loaded');
            
            // Trigger animazioni hero
            this.animateHeroContent();
            
        }, 100);
    }

    animateHeroContent() {
        const heroElements = document.querySelectorAll('.hero-content [data-aos]');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                if (this.modules.animationManager) {
                    this.modules.animationManager.animateElement(element);
                }
            }, index * 200);
        });
    }

    handleOrientationChange() {
        // Aggiorna la mappa se presente
        if (this.modules.mapIntegration && this.modules.mapIntegration.map) {
            google.maps.event.trigger(this.modules.mapIntegration.map, 'resize');
        }
        
        // Richiudi il menu mobile se aperto
        if (this.modules.navigationManager && this.modules.navigationManager.isMenuOpen) {
            this.modules.navigationManager.closeMobileMenu();
        }
    }

    handleWindowResize() {
        // Aggiorna componenti responsive
        this.updateResponsiveComponents();
        
        // Ricalcola animazioni se necessario
        if (this.modules.animationManager) {
            // Reset degli observer per nuove dimensioni
            this.modules.animationManager.setupIntersectionObserver();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pausa animazioni quando la tab non è visibile
            if (this.modules.animationManager) {
                this.modules.animationManager.pauseAnimations();
            }
        } else {
            // Riprendi animazioni quando la tab diventa visibile
            if (this.modules.animationManager) {
                this.modules.animationManager.resumeAnimations();
            }
        }
    }

    handleOptimizedScroll() {
        // Gestione scroll ottimizzata per performance
        const scrollY = window.scrollY;
        
        // Aggiorna parallax se presente
        if (this.modules.animationManager) {
            const parallaxElements = document.querySelectorAll('.image-parallax');
            parallaxElements.forEach(element => {
                this.modules.animationManager.updateParallax(element);
            });
        }
        
        // Trigger evento personalizzato per altri componenti
        window.dispatchEvent(new CustomEvent('optimizedScroll', {
            detail: { scrollY }
        }));
    }

    updateResponsiveComponents() {
        const breakpoints = {
            mobile: window.innerWidth < 768,
            tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            desktop: window.innerWidth >= 1024
        };

        // Aggiorna classe del body
        document.body.classList.remove('mobile', 'tablet', 'desktop');
        Object.keys(breakpoints).forEach(bp => {
            if (breakpoints[bp]) {
                document.body.classList.add(bp);
            }
        });
    }

    handleInitializationError(error) {
        console.error('Errore durante l\'inizializzazione:', error);
        
        // Nascondi loading screen anche in caso di errore
        if (this.loadingScreen) {
            this.loadingScreen.innerHTML = `
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #E74C3C; margin-bottom: 1rem;"></i>
                    <h2 style="color: white; margin-bottom: 1rem;">Ops! Qualcosa è andato storto</h2>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 2rem;">
                        Si è verificato un errore durante il caricamento della pagina.
                    </p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        <i class="fas fa-redo"></i>
                        Ricarica la pagina
                    </button>
                </div>
            `;
        }
    }

    handleGlobalError(error) {
        // Log dell'errore per debugging
        console.error('Errore globale:', error);
        
        // Potresti inviare l'errore a un servizio di monitoring
        // this.sendErrorToMonitoring(error);
    }

    // Metodi pubblici per interagire con l'app
    scrollToSection(sectionId) {
        if (this.modules.navigationManager) {
            this.modules.navigationManager.goToSection(sectionId);
        }
    }

    openContactForm() {
        if (this.modules.contactForm) {
            this.scrollToSection('contact');
            setTimeout(() => {
                this.modules.contactForm.focus();
            }, 800);
        }
    }

    showMap() {
        if (this.modules.mapIntegration) {
            this.scrollToSection('contact');
            setTimeout(() => {
                this.modules.mapIntegration.showInfoWindow();
            }, 800);
        }
    }

    // Metodi di utilità
    isMobile() {
        return window.innerWidth < 768;
    }

    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    }

    isDesktop() {
        return window.innerWidth >= 1024;
    }

    // Cleanup per SPA o ricaricamento moduli
    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isLoaded = false;
    }
}

// Inizializza l'applicazione quando il DOM è pronto
const app = new PsicologaBergamoApp();

// Esponi l'app globalmente per debugging (solo in sviluppo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.app = app;
    console.log('🔧 App esposta globalmente per debugging: window.app');
}

// Esporta per possibile uso come modulo
export default app;
