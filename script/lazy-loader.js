// Lazy loading for SoundCloud widget
document.addEventListener('DOMContentLoaded', function() {
    // Load SoundCloud widget only when user interacts
    function loadSoundCloud() {
        const container = document.querySelector('.soundcloud-container');
        if (container && !container.dataset.loaded) {
            container.style.display = 'block';
            container.dataset.loaded = 'true';
        }
    }

    // Load on user interaction
    document.addEventListener('click', loadSoundCloud, { once: true });
    document.addEventListener('scroll', loadSoundCloud, { once: true });
});
