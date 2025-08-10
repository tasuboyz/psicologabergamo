// js/modules/ComponentManager.js
import { siteContent } from '../../data/content.js';

export class ComponentManager {
    constructor() {
        this.components = new Map();
        this.renderedComponents = new Set();
        this.init();
    }

    init() {
        this.registerComponents();
        this.renderComponents();
    }

    registerComponents() {
        // Registra i componenti che devono essere renderizzati dinamicamente
        this.components.set('services', {
            selector: '.services-grid',
            renderer: this.renderServices.bind(this),
            data: siteContent.services
        });

        this.components.set('modalities', {
            selector: '.modalities-grid',
            renderer: this.renderModalities.bind(this),
            data: siteContent.modalities
        });

        this.components.set('collaborations', {
            selector: '.collaborations-grid',
            renderer: this.renderCollaborations.bind(this),
            data: siteContent.collaborations
        });

        this.components.set('backToTop', {
            selector: '#back-to-top',
            renderer: this.setupBackToTop.bind(this),
            data: null
        });
    }

    renderComponents() {
        this.components.forEach((component, name) => {
            const container = document.querySelector(component.selector);
            if (container && !this.renderedComponents.has(name)) {
                try {
                    component.renderer(container, component.data);
                    this.renderedComponents.add(name);
                } catch (error) {
                    console.error(`Errore nel rendering del componente ${name}:`, error);
                }
            }
        });
    }

    renderServices(container, services) {
        if (!services || !Array.isArray(services)) return;

        const servicesHTML = services.map((service, index) => `
            <div class="service-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="service-header">
                    <div class="service-icon">${service.icon}</div>
                    <h3 class="service-title">${service.title}</h3>
                </div>
                <p class="service-description">${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `
                        <li>${feature}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        container.innerHTML = servicesHTML;
        
        // Aggiungi effetti hover
        this.addServiceCardEffects(container);
    }

    renderModalities(container, modalities) {
        if (!modalities || !Array.isArray(modalities)) return;

        const modalitiesHTML = modalities.map((modality, index) => `
            <div class="modality-card" data-aos="zoom-in" data-aos-delay="${index * 100}">
                <i class="${modality.icon}"></i>
                <h4>${modality.title}</h4>
                <p>${modality.description}</p>
            </div>
        `).join('');

        container.innerHTML = modalitiesHTML;
    }

    renderCollaborations(container, collaborations) {
        if (!collaborations || !Array.isArray(collaborations)) return;

        const collaborationsHTML = collaborations.map((collaboration, index) => `
            <div class="collaboration-card" data-aos="fade-left" data-aos-delay="${index * 150}">
                <h4>${collaboration.title}</h4>
                <p>${collaboration.description}</p>
            </div>
        `).join('');

        container.innerHTML = collaborationsHTML;
    }

    setupBackToTop(button) {
        if (!button) return;

        let isVisible = false;
        
        const toggleVisibility = () => {
            const shouldShow = window.scrollY > 300;
            
            if (shouldShow && !isVisible) {
                button.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                button.classList.remove('visible');
                isVisible = false;
            }
        };

        // Event listener per il click
        button.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Event listener per lo scroll
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        
        // Check iniziale
        toggleVisibility();
    }

    scrollToTop() {
        const start = window.pageYOffset;
        const duration = 800;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start * (1 - easeOutCubic));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    addServiceCardEffects(container) {
        const cards = container.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            // Effetto hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(44, 95, 122, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });

            // Effetto click/touch per mobile
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });

            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    }

    // Metodi per aggiornare dinamicamente i componenti
    updateServiceData(newServices) {
        const component = this.components.get('services');
        if (component) {
            component.data = newServices;
            const container = document.querySelector(component.selector);
            if (container) {
                this.renderServices(container, newServices);
            }
        }
    }

    updateModalityData(newModalities) {
        const component = this.components.get('modalities');
        if (component) {
            component.data = newModalities;
            const container = document.querySelector(component.selector);
            if (container) {
                this.renderModalities(container, newModalities);
            }
        }
    }

    // Sistema di template per componenti riutilizzabili
    createTemplate(name, template) {
        this.templates = this.templates || new Map();
        this.templates.set(name, template);
    }

    renderTemplate(name, data, container) {
        const template = this.templates?.get(name);
        if (!template || !container) return;

        if (typeof template === 'function') {
            container.innerHTML = template(data);
        } else {
            // Template string con placeholders
            let html = template;
            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, data[key]);
            });
            container.innerHTML = html;
        }
    }

    // Gestione lazy loading per componenti pesanti
    setupLazyLoading() {
        const lazyComponents = document.querySelectorAll('[data-lazy-component]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const componentName = entry.target.getAttribute('data-lazy-component');
                    this.loadLazyComponent(componentName, entry.target);
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyComponents.forEach(component => {
            lazyObserver.observe(component);
        });
    }

    loadLazyComponent(name, container) {
        // Mostra un placeholder durante il caricamento
        container.innerHTML = `
            <div class="lazy-loading">
                <div class="loading-spinner"></div>
                <p>Caricamento...</p>
            </div>
        `;

        // Simula il caricamento del componente
        setTimeout(() => {
            const component = this.components.get(name);
            if (component) {
                component.renderer(container, component.data);
            }
        }, 500);
    }

    // Gestione responsive per componenti
    setupResponsiveComponents() {
        const mediaQueries = {
            mobile: window.matchMedia('(max-width: 767px)'),
            tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
            desktop: window.matchMedia('(min-width: 1024px)')
        };

        Object.keys(mediaQueries).forEach(breakpoint => {
            mediaQueries[breakpoint].addEventListener('change', () => {
                this.handleResponsiveChange(breakpoint, mediaQueries[breakpoint].matches);
            });
        });
    }

    handleResponsiveChange(breakpoint, matches) {
        if (matches) {
            document.body.classList.remove('mobile', 'tablet', 'desktop');
            document.body.classList.add(breakpoint);
            
            // Trigger eventi personalizzati per i componenti
            window.dispatchEvent(new CustomEvent('responsiveChange', {
                detail: { breakpoint, matches }
            }));
        }
    }

    // Metodi per animazioni staggered
    staggerElements(selector, animationClass, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Gestione errori per componenti
    handleComponentError(componentName, error, container) {
        console.error(`Errore nel componente ${componentName}:`, error);
        
        if (container) {
            container.innerHTML = `
                <div class="component-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Errore nel caricamento del componente</p>
                    <button onclick="location.reload()" class="btn btn-sm">
                        Riprova
                    </button>
                </div>
            `;
        }
    }

    // Performance monitoring
    measureComponentPerformance(componentName, renderFunction) {
        const startTime = performance.now();
        
        try {
            renderFunction();
            const endTime = performance.now();
            console.log(`Componente ${componentName} renderizzato in ${endTime - startTime}ms`);
        } catch (error) {
            const endTime = performance.now();
            console.error(`Errore nel componente ${componentName} dopo ${endTime - startTime}ms:`, error);
        }
    }

    // Cleanup
    destroy() {
        this.components.clear();
        this.renderedComponents.clear();
        
        if (this.templates) {
            this.templates.clear();
        }
    }
}
