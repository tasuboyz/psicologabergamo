// js/modules/NavigationManager.js
export class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.showNavbar();
    }

    setupEventListeners() {
        // Toggle mobile menu
        this.navToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Handle smooth scroll
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        }, { passive: true });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.navToggle.classList.add('active');
        this.navMenu.classList.add('active');
        
        // Disable scroll on body
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        this.animateMenuItems();
        
        // Set focus to first menu item for accessibility
        this.navLinks[0]?.focus();
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        
        // Re-enable scroll on body
        document.body.style.overflow = '';
    }

    animateMenuItems() {
        this.navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Show/hide navbar based on scroll direction
        if (currentScrollY > this.scrollThreshold) {
            if (currentScrollY > this.lastScrollY && !this.isMenuOpen) {
                this.hideNavbar();
            } else {
                this.showNavbar();
            }
            
            this.navbar.classList.add('scrolled');
        } else {
            this.showNavbar();
            this.navbar.classList.remove('scrolled');
        }
        
        this.lastScrollY = currentScrollY;
        
        // Update active section
        this.updateActiveSection();
    }

    showNavbar() {
        this.navbar.classList.add('visible');
    }

    hideNavbar() {
        if (!this.isMenuOpen) {
            this.navbar.classList.remove('visible');
        }
    }

    setupScrollSpy() {
        const options = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        this.scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNavLink(entry.target.id);
                }
            });
        }, options);

        this.sections.forEach(section => {
            this.scrollSpyObserver.observe(section);
        });
    }

    setActiveNavLink(sectionId) {
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updateActiveSection() {
        let current = '';
        
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            this.setActiveNavLink(current);
        }
    }

    setupSmoothScroll() {
        // Polyfill for smooth scroll if not supported
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.smoothScrollPolyfill();
        }
    }

    scrollToSection(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const headerHeight = this.navbar.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update URL without adding to history
        if (history.replaceState) {
            history.replaceState(null, null, target);
        }
    }

    smoothScrollPolyfill() {
        // Simple smooth scroll polyfill
        const smoothScroll = (target) => {
            const targetElement = document.querySelector(target);
            if (!targetElement) return;

            const start = window.pageYOffset;
            const headerHeight = this.navbar.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const targetPosition = elementPosition + start - headerHeight - 20;
            const distance = targetPosition - start;
            const duration = Math.abs(distance) / 2; // Adjust speed
            let startTime = null;

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = this.ease(timeElapsed, start, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            requestAnimationFrame(animation);
        };

        // Override the default scrollToSection method
        this.scrollToSection = smoothScroll;
    }

    ease(t, b, c, d) {
        // Easing function for smooth scroll
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Public methods
    goToSection(sectionId) {
        this.scrollToSection(`#${sectionId}`);
    }

    getCurrentSection() {
        const activeLink = document.querySelector('.nav-link.active');
        return activeLink ? activeLink.getAttribute('href').substring(1) : null;
    }

    highlightNavigation() {
        // Add a subtle highlight effect to the navigation
        this.navbar.style.transition = 'all 0.3s ease';
        this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        
        setTimeout(() => {
            this.navbar.style.background = '';
            this.navbar.style.boxShadow = '';
        }, 1000);
    }

    // Accessibility methods
    trapFocus() {
        if (!this.isMenuOpen) return;

        const focusableElements = this.navMenu.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Cleanup
    destroy() {
        if (this.scrollSpyObserver) {
            this.scrollSpyObserver.disconnect();
        }
        
        // Remove event listeners
        this.navToggle?.removeEventListener('click', this.toggleMobileMenu);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleOutsideClick);
    }
}
