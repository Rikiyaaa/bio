// Volume Controls Functionality
document.addEventListener('DOMContentLoaded', function() {
    const volumeButton = document.getElementById('volume-button');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLevel = document.querySelector('.volume-level');
    const volumeHighIcon = document.getElementById('volume-high-icon');
    const volumeMuteIcon = document.getElementById('volume-mute-icon');
    const volumeWaveHigh = document.getElementById('volume-wave-high');
    const volumeWaveLow = document.getElementById('volume-wave-low');
    
    let prevVolume = 20; // Store previous volume level when muted
    let isMuted = false;
    
    // Initialize volume
    function initVolume() {
        if (scReady) {
            scPlayer.setVolume(volumeSlider.value);
        }
    }
    
    // Update volume icons based on level
    function updateVolumeIcon(value) {
        if (value === 0 || isMuted) {
            volumeHighIcon.style.display = 'none';
            volumeMuteIcon.style.display = 'block';
        } else {
            volumeHighIcon.style.display = 'block';
            volumeMuteIcon.style.display = 'none';
            
            // Show/hide wave patterns based on volume level
            if (value > 50) {
                volumeWaveHigh.style.display = 'block';
                volumeWaveLow.style.display = 'block';
            } else if (value > 0) {
                volumeWaveHigh.style.display = 'none';
                volumeWaveLow.style.display = 'block';
            } else {
                volumeWaveHigh.style.display = 'none';
                volumeWaveLow.style.display = 'none';
            }
        }
    }
    
    // Update volume display and SoundCloud player
    function updateVolume(value) {
        volumeLevel.textContent = value + '%';
        
        if (scReady) {
            scPlayer.setVolume(value);
        }
        
        updateVolumeIcon(value);
    }
    
    // Handle volume slider input
    volumeSlider.addEventListener('input', function() {
        const value = this.value;
        isMuted = (value === '0');
        prevVolume = isMuted ? prevVolume : value;
        updateVolume(value);
    });
    
    // Handle volume button click (mute/unmute)
    volumeButton.addEventListener('click', function() {
        if (isMuted) {
            // Unmute
            volumeSlider.value = prevVolume;
            isMuted = false;
        } else {
            // Mute
            prevVolume = volumeSlider.value > 0 ? volumeSlider.value : 50;
            volumeSlider.value = 0;
            isMuted = true;
        }
        
        updateVolume(volumeSlider.value);
    });
    
    // Initialize volume when SoundCloud is ready
    if (typeof scPlayer !== 'undefined') {
        if (scReady) {
            initVolume();
        } else {
            scPlayer.bind(SC.Widget.Events.READY, function() {
                initVolume();
            });
        }
    }
    
    // Initial volume icon update
    updateVolumeIcon(volumeSlider.value);
});