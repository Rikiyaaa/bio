// Typing Effect for Username Animation

// Global reference for typing effect instance
let typingEffect;

// Username typing effect class
class TypingEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.phrases = options.phrases || ['@username'];
        this.typingSpeed = options.typingSpeed || 150;
        this.deletingSpeed = options.deletingSpeed || 100;
        this.pauseBeforeDelete = options.pauseBeforeDelete || 2000;
        this.pauseBeforeType = options.pauseBeforeType || 500;
        this.currentPhrase = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.timeout = null;
    }
    
    type() {
        // Get the current phrase
        const fullPhrase = this.phrases[this.currentPhrase];
        
        // If deleting
        if (this.isDeleting) {
            // Remove last character
            this.currentText = fullPhrase.substring(0, this.currentText.length - 1);
        } else {
            // Add the next character
            this.currentText = fullPhrase.substring(0, this.currentText.length + 1);
        }
        
        // Update the element
        this.element.textContent = this.currentText;
        
        // Calculate typing speed
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        // Randomize speed slightly for more natural feel
        typeSpeed = Math.floor(Math.random() * (typeSpeed * 0.5)) + typeSpeed;
        
        // If complete with current phrase
        if (!this.isDeleting && this.currentText === fullPhrase) {
            // Pause then start deleting
            typeSpeed = this.pauseBeforeDelete;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // Move to next phrase
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            // Pause before typing next phrase
            typeSpeed = this.pauseBeforeType;
        }
        
        // Queue next character
        this.timeout = setTimeout(() => this.type(), typeSpeed);
    }
    
    start() {
        this.type();
    }
    
    stop() {
        clearTimeout(this.timeout);
    }
}

// Initialize typing effect
function initTypingEffect() {
    const usernameElement = document.querySelector('.username');
    
    // Initialize only if element exists
    if (usernameElement) {
        // Stop previous instance if exists
        if (typingEffect) {
            typingEffect.stop();
        }
        
        typingEffect = new TypingEffect(usernameElement, {
            phrases: ['Kitsakorn'],
            typingSpeed: 100,
            deletingSpeed: 80,
            pauseBeforeDelete: 2000,
            pauseBeforeType: 500
        });
        
        typingEffect.start();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // The typing effect will be started after loading screen
    // via the showMainContent function in main.js
});