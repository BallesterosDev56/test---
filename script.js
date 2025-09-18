// Form State Management
class FormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateNavigation();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('submit-button').addEventListener('click', (e) => this.submitForm(e));
        
        // Form validation
        this.bindValidationEvents();
        
        // Custom checkbox interactions
        this.bindCheckboxEvents();
        
        // AI Solutions generation
        document.getElementById('generate-solutions').addEventListener('click', () => this.generateSolutions());
        
        // Calendar interactions
        this.bindCalendarEvents();
    }

    bindValidationEvents() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    bindCheckboxEvents() {
        // System options
        document.querySelectorAll('.system-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.updateCheckboxVisual(option, checkbox.checked);
            });
        });

        // App options
        document.querySelectorAll('.app-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.updateCheckboxVisual(option, checkbox.checked);
            });
        });
    }

    bindCalendarEvents() {
        document.querySelectorAll('.day.available').forEach(day => {
            day.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
                // Add selection to clicked day
                day.classList.add('selected');
                // Add visual feedback
                day.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                day.style.color = 'white';
            });
        });
    }

    updateCheckboxVisual(option, isChecked) {
        const checkbox = option.querySelector('input[type="checkbox"]');
        const checkIcon = option.querySelector('i.fa-check');
        
        if (isChecked) {
            option.style.backgroundColor = '#eef2ff';
            option.style.borderColor = '#4f46e5';
            checkIcon.classList.remove('hidden');
        } else {
            option.style.backgroundColor = '';
            option.style.borderColor = '';
            checkIcon.classList.add('hidden');
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.updateProgress();
            this.updateNavigation();
            this.showStep(this.currentStep);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.updateNavigation();
            this.showStep(this.currentStep);
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('hidden');
        });

        // Show current step with animation
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        currentStepElement.classList.remove('hidden');
        
        // Trigger animation
        setTimeout(() => {
            currentStepElement.classList.add('active');
        }, 50);
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for checkboxes
        if (this.currentStep === 1) {
            const systemCheckboxes = currentStepElement.querySelectorAll('input[name="current-system"]:checked');
            if (systemCheckboxes.length === 0) {
                this.showError(currentStepElement.querySelector('.form-group:last-child .error-message'), 'Please select at least one current system');
                isValid = false;
            }
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = field.closest('.form-group').querySelector('.error-message');
        
        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showError(errorElement, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(errorElement, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[^\D][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showError(errorElement, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            errorElement.classList.add('error-message');
        }
    }

    clearError(field) {
        const errorElement = field.closest('.form-group').querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const formData = new FormData();
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (input.checked) {
                    if (!this.formData[input.name]) {
                        this.formData[input.name] = [];
                    }
                    this.formData[input.name].push(input.value);
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        const currentStepSpan = document.getElementById('current-step');
        const totalStepsSpan = document.getElementById('total-steps');
        
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        currentStepSpan.textContent = this.currentStep;
        totalStepsSpan.textContent = this.totalSteps;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-button');

        // Show/hide previous button
        if (this.currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        // Show/hide next/submit buttons
        if (this.currentStep === this.totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        // Check if high priority lead
        if (this.currentStep === this.totalSteps && this.isHighPriorityLead()) {
            const calendarSection = document.getElementById('calendar-section');
            if (calendarSection) {
                calendarSection.classList.remove('hidden');
            }
        }
    }

    isHighPriorityLead() {
        const numUsers = this.formData['num-users'];
        return numUsers === 'high' || numUsers === 'very-high';
    }

    async generateSolutions() {
        const issues = document.getElementById('main-issues').value.trim();
        if (!issues) {
            alert('Please describe your main issues first.');
            return;
        }

        // Check if CONFIG is available
        if (typeof CONFIG === 'undefined') {
            alert('Configuration not loaded. Please refresh the page and try again.');
            return;
        }

        // Check if API key is configured
        if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            alert('API key not configured. Please check the config.js file and add your Google Gemini API key.');
            return;
        }

        const button = document.getElementById('generate-solutions');
        const solutionOutput = document.getElementById('solution-output');
        const solutionContent = document.getElementById('solution-content');

        // Set loading state
        const originalButtonHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing with Odoo 18...';
        button.disabled = true;
        button.classList.add('loading');
        solutionContent.innerHTML = '';
        solutionOutput.classList.remove('hidden');

        try {
            const prompt = `You are a senior Odoo 18 ERP consultant. A client migrating from Zoho has described these issues: "${issues}".

Provide 3-4 Odoo 18 solutions that directly address their problems. Use:
- Professional but friendly tone
- Simple, non-technical language
- 1-2 sentences per solution
- Focus on concrete benefits
- Plain text format (no markdown, no asterisks, no special formatting)

Format each solution as: Module Name - Brief explanation. Key benefit: specific result

Be concise and solution-focused. Return only plain text without any markdown formatting.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = CONFIG.GEMINI_API_KEY;
            const apiUrl = `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;

            const response = await this.fetchWithExponentialBackoff(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            let generatedText = "Sorry, I could not generate a solution at this time.";

            if (response.candidates && response.candidates.length > 0 &&
                response.candidates[0].content && response.candidates[0].content.parts &&
                response.candidates[0].content.parts.length > 0) {
                generatedText = response.candidates[0].content.parts[0].text;
            }

            // Clean up the text and format it properly
            const cleanedText = this.cleanAndFormatText(generatedText);
            solutionContent.innerHTML = cleanedText;

        } catch (error) {
            console.error('Error generating solutions:', error);
            solutionContent.textContent = "Sorry, there was an error generating solutions. Please try again later.";
        } finally {
            button.innerHTML = originalButtonHTML || '<i class="fas fa-magic mr-2"></i>Get Personalized Solutions';
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    cleanAndFormatText(text) {
        // Remove markdown formatting
        let cleaned = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert *italic* to <em>
            .replace(/\n\n/g, '<br><br>') // Convert double newlines to paragraph breaks
            .replace(/\n/g, '<br>') // Convert single newlines to line breaks
            .replace(/•/g, '•') // Keep bullet points as they are
            .replace(/\s+/g, ' ') // Clean up extra whitespace
            .trim();
        
        // Wrap each solution in a nice container
        const solutions = cleaned.split('<br><br>').filter(s => s.trim());
        if (solutions.length > 1) {
            return solutions.map(solution => 
                `<div class="solution-item mb-4 p-4 bg-white rounded-lg border-l-4 border-indigo-500 shadow-sm">
                    <div class="text-gray-800">${solution}</div>
                </div>`
            ).join('');
        }
        
        return `<div class="text-gray-800">${cleaned}</div>`;
    }

    async fetchWithExponentialBackoff(url, options, retries = 3, delay = 1000) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (retries > 0) {
                console.warn(`Fetch failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithExponentialBackoff(url, options, retries - 1, delay * 2);
            } else {
                throw error;
            }
        }
    }

    async submitForm(event) {
        event.preventDefault();
        
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            await this.sendEmail();
        }
    }

    async sendEmail() {
        const submitButton = document.getElementById('submit-button');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;

        try {
            // Check if CONFIG is available
            if (typeof CONFIG === 'undefined') {
                throw new Error('Configuration not loaded. Please refresh the page and try again.');
            }

            // Initialize EmailJS with correct format
            emailjs.init({
                publicKey: CONFIG.EMAILJS_PUBLIC_KEY
            });

            // Prepare email data with all form fields
            const emailData = {
                to_email: CONFIG.EMAIL_DESTINATION,
                from_name: this.formData['contact-name'] || 'Lead Form',
                from_email: this.formData['contact-email'] || 'no-email@provided.com',
                company_name: this.formData['company-name'] || 'Not provided',
                num_users: this.formData['num-users'] || 'Not provided',
                current_system: Array.isArray(this.formData['current-system']) 
                    ? this.formData['current-system'].join(', ') 
                    : (this.formData['current-system'] || 'Not provided'),
                zoho_apps: Array.isArray(this.formData['zoho-apps']) 
                    ? this.formData['zoho-apps'].join(', ') 
                    : (this.formData['zoho-apps'] || 'Not provided'),
                main_issues: this.formData['main-issues'] || 'Not provided',
                project_timeline: this.formData['project-timeline'] || 'Not provided',
                project_budget: this.formData['project-budget'] || 'Not provided',
                contact_phone: this.formData['contact-phone'] || 'Not provided',
                message: this.formatEmailMessage(),
                submission_date: new Date().toLocaleString()
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                CONFIG.EMAILJS_SERVICE_ID,
                CONFIG.EMAILJS_TEMPLATE_ID,
                emailData
            );

            console.log('Email sent successfully:', response);
            
            // Send autoreply to the user
            await this.sendAutoreply();
            
            this.showSuccessMessage();

        } catch (error) {
            console.error('Error sending email:', error);
            this.showErrorMessage('Failed to send form. Please try again or contact us directly at info@zohodoo.com');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    formatEmailMessage() {
        let message = `New Lead Form Submission\n\n`;
        message += `Company: ${this.formData['company-name'] || 'Not provided'}\n`;
        message += `Contact: ${this.formData['contact-name'] || 'Not provided'} (${this.formData['contact-email'] || 'Not provided'})\n`;
        message += `Phone: ${this.formData['contact-phone'] || 'Not provided'}\n`;
        message += `Company Size: ${this.formData['num-users'] || 'Not provided'}\n`;
        message += `Current System: ${Array.isArray(this.formData['current-system']) 
            ? this.formData['current-system'].join(', ') 
            : (this.formData['current-system'] || 'Not provided')}\n`;
        message += `Zoho Apps Used: ${Array.isArray(this.formData['zoho-apps']) 
            ? this.formData['zoho-apps'].join(', ') 
            : (this.formData['zoho-apps'] || 'Not provided')}\n`;
        message += `Main Issues: ${this.formData['main-issues'] || 'Not provided'}\n`;
        message += `Timeline: ${this.formData['project-timeline'] || 'Not provided'}\n`;
        message += `Budget: ${this.formData['project-budget'] || 'Not provided'}\n`;
        
        return message;
    }

    async sendAutoreply() {
        try {
            // Check if CONFIG is available
            if (typeof CONFIG === 'undefined') {
                console.warn('Configuration not loaded. Skipping autoreply.');
                return;
            }

            // Prepare autoreply data
            const autoreplyData = {
                to_email: this.formData['contact-email'],
                from_name: this.formData['contact-name'] || 'Valued Customer',
                company_name: this.formData['company-name'] || 'Your Company',
                num_users: this.formData['num-users'] || 'Not specified',
                submission_date: new Date().toLocaleString()
            };

            // Send autoreply using EmailJS
            const autoreplyResponse = await emailjs.send(
                CONFIG.EMAILJS_SERVICE_ID,
                CONFIG.EMAILJS_AUTOREPLY_TEMPLATE_ID,
                autoreplyData
            );

            console.log('Autoreply sent successfully:', autoreplyResponse);

        } catch (error) {
            console.error('Error sending autoreply:', error);
            // Don't show error to user for autoreply failure
        }
    }

    showErrorMessage(message) {
        const resultBox = document.getElementById('result-box');
        const resultMessage = document.getElementById('result-message');
        
        resultBox.className = 'mt-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-200 shadow-lg';
        resultMessage.textContent = message;
        resultBox.classList.remove('hidden');
        
        // Hide form
        document.getElementById('lead-form').style.display = 'none';
    }

    showSuccessMessage() {
        const companyName = this.formData['company-name'] || 'Valued Customer';
        const numUsers = this.formData['num-users'];
        
        let message = '';
        if (numUsers === 'high' || numUsers === 'very-high') {
            message = `Thank you, ${companyName}! We see you as a high-priority lead. We look forward to connecting with you on your booked call.`;
        } else if (numUsers === 'medium') {
            message = `Thank you, ${companyName}! Your submission has been received. A team member will be in touch shortly to discuss your needs.`;
        } else {
            message = `Thank you, ${companyName}! We appreciate your interest. We'll add you to our newsletter for future updates and resources.`;
        }

        // Hide form and show success message
        document.getElementById('lead-form').style.display = 'none';
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-box').classList.remove('hidden');
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormManager();
});
