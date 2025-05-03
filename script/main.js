// Main JavaScript file for initialization and loading screens

// DOM Elements
const enterScreen = document.getElementById('enter-screen');
const loadingScreen = document.getElementById('loading-screen');
const videoBackground = document.getElementById('video-background');
const progressBar = document.getElementById('progress');
const card = document.getElementById('tilt-card');

// State variables
let loadingProgress = 0;
let enterClicked = false;

// Loading simulation
function simulateLoading() {
    const interval = setInterval(() => {
        loadingProgress += Math.random() * 10;
        if (loadingProgress > 100) loadingProgress = 100;
        
        progressBar.style.width = `${loadingProgress}%`;
        
        if (loadingProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showMainContent();
            }, 500);
        }
    }, 200);
}

// Show main content after loading
function showMainContent() {
    loadingScreen.classList.add('fade-out');
    
    // Show video background
    videoBackground.style.opacity = '1';
    
    // Show main container
    setTimeout(() => {
        card.style.display = 'block';
        setTimeout(() => {
            card.style.opacity = '1';
            
            // Initialize components
            initTypingEffect();
            setupTiltEffect();
            initSoundCloud();
            initVisitorCounter();
            initDiscordProfile();
            initSnowEffect();
        }, 100);
    }, 500);
}

// Handle enter button click
enterScreen.addEventListener('click', function() {
    enterClicked = true;
    
    // Show loading screen
    enterScreen.classList.add('fade-out');
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    
    // Start loading simulation
    simulateLoading();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Pre-load video
    videoBackground.addEventListener('loadeddata', function() {
        console.log('Video loaded and ready to play');
    });
    
    videoBackground.addEventListener('error', function(e) {
        console.error('Error loading video:', e);
    });
    
    // Add click event to enter button
    document.getElementById('enter-screen').addEventListener('click', function() {
        enterClicked = true;
    });
});

// Preload images function (for album art, profile picture)
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Update profile information function
function updateProfile(username, bio, badges) {
    // Update username for typing effect
    if (typingEffect) {
        typingEffect.stop();
    }
    
    typingEffect = new TypingEffect(document.querySelector('.username'), {
        phrases: username,
        typingSpeed: 100,
        deletingSpeed: 80,
        pauseBeforeDelete: 2000,
        pauseBeforeType: 500
    });
    
    // Update bio
    document.querySelector('.bio').textContent = bio;
    
    // Update badges
    const badgesContainer = document.querySelector('.badges');
    badgesContainer.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'badge';
        badgeEl.textContent = badge;
        badgesContainer.appendChild(badgeEl);
    });
    
    // Start typing effect
    typingEffect.start();
}

// Optional: Add dark/light mode toggle
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('light-mode');
    
    if (isDark) {
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
    }
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Disable tilt effect on small screens
    if (window.innerWidth <= 768) {
        card.style.transform = 'none';
        card.style.transition = 'none';
    } else {
        // Re-enable tilt effect on larger screens
        setupTiltEffect();
    }
    
    // Update snow effect if active
    if (typeof isSnowing !== 'undefined' && isSnowing) {
        stopSnow();
        startSnow();
    }
});