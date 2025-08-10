// js/modules/ContactForm.js
export class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = this.form?.querySelector('.btn-submit');
        this.fields = {};
        this.validators = {};
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupFields();
        this.setupValidators();
        this.setupEventListeners();
        this.setupFormAnimation();
    }

    setupFields() {
        const fieldElements = this.form.querySelectorAll('input, select, textarea');
        fieldElements.forEach(field => {
            this.fields[field.name] = {
                element: field,
                isValid: false,
                value: '',
                touched: false
            };
        });
    }

    setupValidators() {
        this.validators = {
            name: (value) => {
                if (!value || value.trim().length < 2) {
                    return 'Il nome deve contenere almeno 2 caratteri';
                }
                if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    return 'Il nome può contenere solo lettere e spazi';
                }
                return true;
            },

            email: (value) => {
                if (!value) {
                    return 'L\'email è obbligatoria';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Inserisci un\'email valida';
                }
                return true;
            },

            phone: (value) => {
                if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
                    return 'Inserisci un numero di telefono valido';
                }
                return true;
            },

            message: (value) => {
                if (!value || value.trim().length < 10) {
                    return 'Il messaggio deve contenere almeno 10 caratteri';
                }
                if (value.length > 1000) {
                    return 'Il messaggio non può superare i 1000 caratteri';
                }
                return true;
            },

            privacy: (checked) => {
                if (!checked) {
                    return 'Devi accettare l\'informativa sulla privacy';
                }
                return true;
            }
        };
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName].element;
            
            // Input events for real-time validation
            field.addEventListener('input', (e) => {
                this.validateField(fieldName, e.target.value);
                this.updateFieldUI(fieldName);
            });

            // Blur events for touched state
            field.addEventListener('blur', (e) => {
                this.fields[fieldName].touched = true;
                this.validateField(fieldName, e.target.value);
                this.updateFieldUI(fieldName);
            });

            // Focus events for enhanced UX
            field.addEventListener('focus', (e) => {
                this.clearFieldError(fieldName);
            });
        });

        // Character counter for message field
        const messageField = this.fields.message?.element;
        if (messageField) {
            this.setupCharacterCounter(messageField);
        }
    }

    validateField(fieldName, value) {
        const field = this.fields[fieldName];
        if (!field || !this.validators[fieldName]) return;

        // Special handling for checkbox
        if (field.element.type === 'checkbox') {
            value = field.element.checked;
        }

        const result = this.validators[fieldName](value);
        field.isValid = result === true;
        field.value = value;
        field.errorMessage = result !== true ? result : null;

        return field.isValid;
    }

    validateForm() {
        let isFormValid = true;

        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            const value = field.element.type === 'checkbox' 
                ? field.element.checked 
                : field.element.value;
            
            const isValid = this.validateField(fieldName, value);
            field.touched = true;
            
            if (!isValid) {
                isFormValid = false;
            }
            
            this.updateFieldUI(fieldName);
        });

        return isFormValid;
    }

    updateFieldUI(fieldName) {
        const field = this.fields[fieldName];
        const element = field.element;
        const formGroup = element.closest('.form-group');
        
        if (!field.touched) return;

        // Remove existing error states
        formGroup.classList.remove('error', 'success');
        this.removeErrorMessage(formGroup);

        if (field.isValid) {
            formGroup.classList.add('success');
        } else if (field.errorMessage) {
            formGroup.classList.add('error');
            this.showErrorMessage(formGroup, field.errorMessage);
        }
    }

    showErrorMessage(formGroup, message) {
        this.removeErrorMessage(formGroup);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        formGroup.appendChild(errorElement);
    }

    removeErrorMessage(formGroup) {
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        const formGroup = field.element.closest('.form-group');
        formGroup.classList.remove('error');
        this.removeErrorMessage(formGroup);
    }

    setupCharacterCounter(textarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: var(--text-light);
            margin-top: 0.25rem;
        `;
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} caratteri rimanenti`;
            
            if (remaining < 50) {
                counter.style.color = 'var(--warning-color)';
            } else if (remaining < 0) {
                counter.style.color = 'var(--error-color)';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        };

        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }

    setupFormAnimation() {
        // Animazione form disabilitata per migliorare UX
        // Gli input sono ora sempre visibili
        /*
        // Animate form fields on first interaction
        let hasInteracted = false;
        
        this.form.addEventListener('focusin', () => {
            if (!hasInteracted) {
                this.animateFormFields();
                hasInteracted = true;
            }
        }, { once: true });
        */
    }

    animateFormFields() {
        // Animazione form disabilitata per migliorare UX
        /*
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.classList.add('animate');
            }, index * 100);
        });
        */
    }

    async handleSubmit() {
        // Prevent double submission
        if (this.submitButton.disabled) return;

        // Validate form
        if (!this.validateForm()) {
            this.showFormError('Per favore correggi gli errori evidenziati');
            this.shakeForm();
            return;
        }

        // Show loading state
        this.setSubmitLoading(true);

        try {
            const formData = this.getFormData();
            const success = await this.submitForm(formData);

            if (success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                this.showFormError('Si è verificato un errore. Riprova più tardi.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Si è verificato un errore di connessione. Riprova più tardi.');
        } finally {
            this.setSubmitLoading(false);
        }
    }

    getFormData() {
        const data = {};
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field.element.type === 'checkbox') {
                data[fieldName] = field.element.checked;
            } else {
                data[fieldName] = field.element.value.trim();
            }
        });
        return data;
    }

    async submitForm(formData) {
        // Simulated API call - replace with actual endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', formData);
                
                // Simulate success/failure
                const isSuccess = Math.random() > 0.1; // 90% success rate for demo
                resolve(isSuccess);
            }, 2000);
        });

        // Real implementation would look like:
        /*
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            return response.ok;
        } catch (error) {
            throw error;
        }
        */
    }

    setSubmitLoading(isLoading) {
        if (!this.submitButton) return;

        this.submitButton.disabled = isLoading;
        
        if (isLoading) {
            this.submitButton.innerHTML = `
                <span>Invio in corso...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.innerHTML = `
                <span>Invia messaggio</span>
                <i class="fas fa-paper-plane"></i>
            `;
            this.submitButton.classList.remove('loading');
        }
    }

    showSuccessMessage() {
        this.showMessage('Messaggio inviato con successo! Ti risponderemo presto.', 'success');
    }

    showFormError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            animation: slideInDown 0.3s ease;
        `;

        // Set colors based on type
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }

        this.form.insertBefore(messageElement, this.form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }

    resetForm() {
        this.form.reset();
        
        // Reset field states
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.isValid = false;
            field.value = '';
            field.touched = false;
            field.errorMessage = null;
            
            const formGroup = field.element.closest('.form-group');
            formGroup.classList.remove('error', 'success');
            this.removeErrorMessage(formGroup);
        });
    }

    // Public methods
    focus() {
        const firstField = Object.values(this.fields)[0];
        if (firstField) {
            firstField.element.focus();
        }
    }

    prefillData(data) {
        Object.keys(data).forEach(fieldName => {
            if (this.fields[fieldName]) {
                this.fields[fieldName].element.value = data[fieldName];
            }
        });
    }

    // Cleanup
    destroy() {
        // Remove event listeners would go here
        // This is handled automatically when the form is removed from DOM
    }
}
