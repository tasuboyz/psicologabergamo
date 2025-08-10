// js/modules/AnimationManager.js
export class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxObserver();
        this.setupTextRevealObserver();
        this.animateOnLoad();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };

        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Osserva tutti gli elementi con data-aos
        this.observeElements('[data-aos]');
    }

    setupParallaxObserver() {
        const parallaxOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        this.parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', () => {
                        this.updateParallax(entry.target);
                    }, { passive: true });
                }
            });
        }, parallaxOptions);

        // Osserva elementi parallax
        this.observeElements('.image-parallax');
    }

    setupTextRevealObserver() {
        const textRevealOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        this.textRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealText(entry.target);
                }
            });
        }, textRevealOptions);

        this.observeElements('.text-reveal');
    }

    observeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (selector === '[data-aos]') {
                this.mainObserver.observe(element);
            } else if (selector === '.image-parallax') {
                this.parallaxObserver.observe(element);
            } else if (selector === '.text-reveal') {
                this.textRevealObserver.observe(element);
            }
        });
    }

    animateElement(element) {
        if (this.animatedElements.has(element)) return;

        const animationType = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        const duration = element.getAttribute('data-aos-duration') || 600;

        // Applica il delay
        setTimeout(() => {
            element.classList.add('aos-animate');
            this.animatedElements.add(element);

            // Trigger custom event
            element.dispatchEvent(new CustomEvent('aos:animate', {
                detail: { animationType, element }
            }));
        }, parseInt(delay));

        // Disconnetti l'observer per questo elemento
        this.mainObserver.unobserve(element);
    }

    updateParallax(element) {
        const rect = element.getBoundingClientRect();
        const speed = element.getAttribute('data-parallax-speed') || 0.5;
        const yPos = -(rect.top * speed);
        
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }

    revealText(element) {
        const lines = element.querySelectorAll('.text-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateOnLoad() {
        // Anima gli elementi che dovrebbero essere visibili al caricamento
        setTimeout(() => {
            const loadElements = document.querySelectorAll('.animate-on-load');
            loadElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 100);
            });
        }, 500);
    }

    // Metodi per animazioni programmatiche
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    fadeOut(element, duration = 500) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    slideUp(element, duration = 500) {
        element.style.height = element.offsetHeight + 'px';
        element.style.transition = `height ${duration}ms ease-in-out`;
        element.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            element.style.height = '0';
        });

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    slideDown(element, duration = 500) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.height = '0';
        element.style.transition = `height ${duration}ms ease-in-out`;
        element.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
        });

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                resolve();
            }, duration);
        });
    }

    countUp(element, start = 0, end = 100, duration = 2000) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Utility methods
    resetAnimation(element) {
        element.classList.remove('aos-animate');
        this.animatedElements.delete(element);
        this.mainObserver.observe(element);
    }

    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    // Cleanup
    destroy() {
        if (this.mainObserver) this.mainObserver.disconnect();
        if (this.parallaxObserver) this.parallaxObserver.disconnect();
        if (this.textRevealObserver) this.textRevealObserver.disconnect();
        
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// CSS per supportare le animazioni
export const animationStyles = `
    .aos-animate {
        transition-property: transform, opacity;
    }
    
    .animate-on-load {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    .animate-on-load.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .aos-animate,
        .animate-on-load {
            transition: none !important;
        }
    }
`;

// Aggiungi gli stili se non esistono già
if (!document.querySelector('#animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}
