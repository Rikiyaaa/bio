// Card Tilt Effect for Desktop and Mobile

// Setup card tilt effect for desktop
function setupTiltEffect() {
    const card = document.getElementById('tilt-card');
    
    if (!card) return;
    
    // Only setup tilt effect on non-mobile devices
    if (window.innerWidth > 768) {
        // Store event handler references to be able to remove them later

        // Function to handle tilt effect
function handleTilt(clientX, clientY) {
    containers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 20;
        const rotateY = (x - centerX) / 20;

        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
}

// Mouse event handling
document.addEventListener('mousemove', (e) => {
    handleTilt(e.clientX, e.clientY);
});

// Touch event handling
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleTilt(touch.clientX, touch.clientY);
}, { passive: false });

// Reset tilt on touch end
document.addEventListener('touchend', () => {
    containers.forEach((container) => {
        container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
});
        window.handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const tiltX = deltaY * 10; // tilt up/down
            const tiltY = -deltaX * 10; // tilt left/right
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        };
        
        window.handleMouseLeave = () => {
            // Reset card position when mouse leaves
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.5s ease';
        };
        
        window.handleMouseEnter = () => {
            // Remove transition when mouse enters for smooth tilt
            card.style.transition = 'none';
        };
        
        // Add event listeners
        card.addEventListener('mousemove', window.handleMouseMove);
        card.addEventListener('mouseleave', window.handleMouseLeave);
        card.addEventListener('mouseenter', window.handleMouseEnter);
    } else {
        // Remove any existing event listeners for small screens
        card.removeEventListener('mousemove', window.handleMouseMove);
        card.removeEventListener('mouseleave', window.handleMouseLeave);
        card.removeEventListener('mouseenter', window.handleMouseEnter);
    }
}

// Mobile device orientation tilt effect
function setupDeviceOrientationTilt() {
    const card = document.getElementById('tilt-card');
    
    if (!card) return;
    
    window.addEventListener('deviceorientation', function(event) {
        if (window.innerWidth <= 768) { // Only for mobile devices
            const tiltX = event.beta / 5; // Convert to smaller range
            const tiltY = event.gamma / 5;
            
            // Apply tilt effect with limitations for better UX
            if (tiltX !== null && tiltY !== null) {
                const limitedTiltX = Math.max(-10, Math.min(10, tiltX));
                const limitedTiltY = Math.max(-10, Math.min(10, tiltY));
                
                card.style.transform = `perspective(1000px) rotateX(${-limitedTiltX}deg) rotateY(${limitedTiltY}deg)`;
            }
        }
    });
}

// Initialize tilt effects
document.addEventListener('DOMContentLoaded', function() {
    // Setup tilt effect for desktop
    setupTiltEffect();
    
    // Setup tilt effect for mobile devices
    setupDeviceOrientationTilt();
    
    // Handle window resize to adjust tilt effect behavior
    window.addEventListener('resize', () => {
        setupTiltEffect();
    });
});