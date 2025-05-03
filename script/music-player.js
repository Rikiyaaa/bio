// Music Player with SoundCloud Integration

// Music player elements
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const musicProgress = document.getElementById('music-progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const waveBars = document.querySelectorAll('.wave-bar');
const albumCover = document.getElementById('album-cover');
const musicWave = document.querySelector('.music-wave');

// SoundCloud widget API variables
let scPlayer;
let scReady = false;
let scDuration = 0;

// Initialize SoundCloud widget API
function initSoundCloud() {
    const iframeElement = document.querySelector('#soundcloud-widget');
    scPlayer = SC.Widget(iframeElement);
    
    scPlayer.bind(SC.Widget.Events.READY, function() {
        scReady = true;
        
        // Get track info
        scPlayer.getCurrentSound(function(sound) {
            if (sound) {
                // Set album artwork if available
                if (sound.artwork_url) {
                    // Get higher resolution artwork by replacing size
                    const artworkUrl = sound.artwork_url.replace('-large', '-t500x500');
                    albumCover.src = artworkUrl;
                }
            }
        });
        
        // Get track duration
        scPlayer.getDuration(function(duration) {
            scDuration = duration;
            durationEl.textContent = formatTime(duration/1000); // SoundCloud returns ms
        });
        
        // Set initial volume
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            scPlayer.setVolume(volumeSlider.value);
        } else {
            scPlayer.setVolume(0.2); // Default 70%
        }
        
        // Auto play music after SoundCloud is ready
        // This happens after user interaction (clicking Enter button)
        if (typeof enterClicked !== 'undefined' && enterClicked) {
            playMusic();
        }
        
        // Trigger a custom event to notify that SoundCloud is ready
        const scReadyEvent = new Event('soundcloud-ready');
        document.dispatchEvent(scReadyEvent);
    });
    
    // Setup SoundCloud event listeners
    scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
        // Update music progress bar
        const position = e.currentPosition / 1000; // convert to seconds
        const duration = scDuration / 1000;
        const progressPercentage = (position / duration) * 100;
        
        musicProgress.style.width = `${progressPercentage}%`;
        currentTimeEl.textContent = formatTime(position);
    });
    
    scPlayer.bind(SC.Widget.Events.PLAY, function() {
        setPlayingState(true);
    });
    
    scPlayer.bind(SC.Widget.Events.PAUSE, function() {
        setPlayingState(false);
    });
    
    scPlayer.bind(SC.Widget.Events.FINISH, function() {
        setPlayingState(false);
        musicProgress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Loop the track
        setTimeout(() => {
            scPlayer.seekTo(0);
            scPlayer.play();
        }, 1000);
    });
    
    // Create wave visualization bars
    createWaveVisualization();
}

// Create wave visualization bars for music player
function createWaveVisualization() {
    musicWave.innerHTML = ''; // Clear existing bars if any
    
    // Create wave bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        
        // Random height for aesthetics
        const height = Math.floor(Math.random() * 20) + 10;
        bar.style.height = `${height}px`;
        
        musicWave.appendChild(bar);
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

// Set playing/paused state UI
function setPlayingState(isPlaying) {
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        
        // Animate wave bars
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.classList.add('playing');
        });
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        
        // Stop wave animation
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.classList.remove('playing');
        });
    }
}

// Play/pause music
function playMusic() {
    if (scReady) {
        scPlayer.toggle();
    }
}

// Initialize event listeners for music player
document.addEventListener('DOMContentLoaded', function() {
    // Handle play button click
    playBtn.addEventListener('click', function() {
        playMusic();
    });
    
    // Handle music timeline clicks
    document.querySelector('.music-timeline').addEventListener('click', function(e) {
        if (scReady) {
            const timeline = this.getBoundingClientRect();
            const clickPosition = (e.clientX - timeline.left) / timeline.width;
            const seekTime = Math.floor(clickPosition * (scDuration / 1000)) * 1000; // Convert to ms
            
            scPlayer.seekTo(seekTime);
        }
    });
});