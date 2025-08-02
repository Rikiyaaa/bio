// DOM Elements
const playlistButton = document.getElementById('playlist-button');
const playlistPanel = document.getElementById('playlist-panel');

// Playlist configuration
const playlist = [
    {
        url: 'https://soundcloud.com/kornthida/michi-teyu-ku-thai-ver',
        title: 'Michi Teyu Ku (Thai Ver.)',
        artist: 'Earthernative ',
        artwork: 'https://i1.sndcdn.com/artworks-VJDG2GCKbaE0CQHC-glZcXQ-t500x500.jpg',
        startTime: 27, // เริ่มที่วินาทีที่ 27
        endTime: null, // null หมายถึงเล่นจนจบเพลง
        volume: 40 // ระดับเสียงเพลงนี้ (0-100)
    },
    {
        url: 'https://soundcloud.com/kornthida/yented-on-a-date-audio',
        title: 'ว้าวุ่น ',
        artist: 'YENTED',
        artwork: 'https://i1.sndcdn.com/artworks-LbRCHmB7aJdTyQBh-RWDB1A-t500x500.jpg',
        startTime: 0, // เริ่มที่วินาทีที่ 57
        endTime: null, // null หมายถึงเล่นจนจบเพลง
        volume: 15 // ระดับเสียงเพลงนี้ (0-100)
    },
];

// คืนค่าเพลงแบบสุ่ม
function getRandomTrack() {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    return playlist[randomIndex];
}

// คืนค่าเพลงถัดไป
function getNextTrack(currentUrl) {
    const currentIndex = playlist.findIndex(track => track.url === currentUrl);
    const nextIndex = (currentIndex + 1) % playlist.length;
    return playlist[nextIndex];
}

// Track the current playing track index
let currentTrackIndex = 0;

// Initialize playlist panel
function initializePlaylistPanel() {
    console.log('Initializing playlist panel...');
    
    // Ensure the elements exist
    if (!playlistPanel || !playlistButton) {
        console.error('Playlist elements not found');
        return;
    }

    console.log('Creating playlist items...');
    
    // Clear existing content
    playlistPanel.innerHTML = '';
    
    // เพิ่มหัวข้อ Playlist
    const playlistHeader = document.createElement('div');
    playlistHeader.className = 'playlist-header';
    playlistHeader.textContent = 'Playlist';
    playlistHeader.style.fontWeight = 'bold';
    playlistHeader.style.fontSize = '18px';
    playlistHeader.style.margin = '10px 0 10px 10px';
    playlistHeader.style.textAlign = 'left';
    playlistPanel.appendChild(playlistHeader);
    
    // Set initial styles
    if (!playlistPanel.classList.contains('show')) {
        playlistPanel.style.display = 'none';
    }
    playlistButton.style.display = 'flex';
    
    // Create playlist items
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.setAttribute('data-track-index', index);
        
        // เพิ่ม cursor: pointer เพื่อให้เห็นว่าสามารถคลิกได้
        item.style.cursor = 'pointer';
        
        item.innerHTML = `
            <img src="${track.artwork}" alt="${track.title}" loading="lazy">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            </div>
        `;
        
        // Add click event to play the selected track
        item.addEventListener('click', () => {
            // ถ้าเพลงที่คลิกเป็นเพลงที่กำลังเล่นอยู่
            if (currentTrackIndex === index && window.scPlayer) {
                // สลับระหว่างเล่นและหยุด
                window.scPlayer.isPaused((isPaused) => {
                    if (isPaused) {
                        window.scPlayer.play();
                    } else {
                        window.scPlayer.pause();
                    }
                });
            } else {
                // เปลี่ยนไปเล่นเพลงใหม่
                switchToTrack(index);
            }
        });

        playlistPanel.appendChild(item);
    });
}

// Function to switch to a specific track
function switchToTrack(index) {
    const track = playlist[index];
    if (!track || !window.scPlayer || !window.scReady) {
        console.error('Cannot switch track - missing requirements', {
            track: !!track,
            scPlayer: !!window.scPlayer,
            scReady: !!window.scReady
        });
        return;
    }

    console.log('Switching to track index:', index);

    // ตรวจสอบว่าเพลงที่กำลังจะเล่นเป็นเพลงเดียวกับที่กำลังเล่นอยู่หรือไม่
    window.scPlayer.getCurrentSound(function(currentSound) {
        const isSameTrack = currentSound && 
            (track.url.includes(currentSound.permalink_url) || 
             currentSound.permalink_url.includes(track.url));

        if (isSameTrack) {
            // ถ้าเป็นเพลงเดียวกัน ให้สลับระหว่างเล่น/หยุด
            window.scPlayer.isPaused(function(isPaused) {
                if (isPaused) {
                    window.scPlayer.play();
                } else {
                    window.scPlayer.pause();
                }
            });
        } else {
            // ถ้าเป็นเพลงใหม่ ให้โหลดและเล่นเพลงนั้น
            loadAndPlayTrack(track, index);
        }
    });
}

// Function to load and play a track
function loadAndPlayTrack(track, index) {
    // Remove active state from all items first
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active', 'playing');
    });

    console.log('Switching to track:', track.title);

    // Update current track index
    currentTrackIndex = index;

    // Update UI to show current track
    updatePlaylistUI();

    window.currentTrackIndex = index; // บันทึกเพลงปัจจุบันที่กำลังเล่น
    
    // Load and play the track
    window.scPlayer.load(track.url, {
        callback: function() {
            console.log('Track loaded successfully');
            
            // Set album artwork
            const albumCover = document.getElementById('album-cover');
            if (albumCover) {
                albumCover.src = track.artwork;
            }
            
            // Update song title and artist
            const titleEl = document.querySelector('.music-title');
            const artistEl = document.querySelector('.music-artist');
            if (titleEl && artistEl) {
                titleEl.textContent = track.title;
                artistEl.textContent = track.artist;
            }
            
            // Set the starting position if specified
            const startTime = track.startTime || 0;
            if (startTime > 0) {
                window.scPlayer.seekTo(startTime * 1000);
            }
            
            // Set the volume for this specific track
            if (track.volume !== undefined) {
                window.scPlayer.setVolume(track.volume);
                updateVolumeUI(track.volume);
            }
            
            // Start playing
            setTimeout(() => {
                window.scPlayer.play();
                // สั่งให้เล่นเพลงและอัพเดท UI
                setPlayingState(true);
                updatePlaylistUI(); // อัพเดท UI ของ playlist
            }, 100);

            // อัปเดต currentTrack เป็น global
            window.currentTrack = track;
            // รีเซ็ต progress bar, current time, duration
            const musicProgress = document.getElementById('music-progress');
            const currentTimeEl = document.getElementById('current-time');
            const durationEl = document.getElementById('duration');
            if (musicProgress) musicProgress.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
            if (durationEl) durationEl.textContent = '--:--';
            window.scPlayer.getDuration(function(duration) {
                if (durationEl) durationEl.textContent = duration > 0 ? formatTime(duration/1000) : '--:--';
            });
        }
    });

    // Optional: Scroll the played track into view in the playlist
    const trackElement = playlistPanel.children[index];
    if (trackElement) {
        trackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Function to update the playlist UI
function updatePlaylistUI() {
    console.log('Updating playlist UI, current track:', currentTrackIndex);
    
    try {
        // Remove active class from all items
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current track
        const currentItem = document.querySelector(`.playlist-item[data-track-index="${currentTrackIndex}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
            
            // ทำให้เพลงที่กำลังเล่นอยู่มองเห็นในพาเนล
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Check if the track is actually playing
            if (window.scPlayer) {
                window.scPlayer.isPaused((isPaused) => {
                    if (!isPaused) {
                        currentItem.classList.add('playing');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error updating playlist UI:', error);
    }
}

// Toggle playlist panel
playlistButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    
    // Initialize panel content if it's empty
    if (playlistPanel.children.length === 0) {
        initializePlaylistPanel();
    }
    
    // Show the panel first (display: block)
    if (!playlistPanel.classList.contains('show')) {
        playlistPanel.style.display = 'block';
        // Force a reflow
        playlistPanel.offsetHeight;
    }
    
    // Toggle the show class for animation
    playlistPanel.classList.toggle('show');
    
    // If we're hiding the panel, wait for animation to complete before display: none
    if (!playlistPanel.classList.contains('show')) {
        setTimeout(() => {
            if (!playlistPanel.classList.contains('show')) {
                playlistPanel.style.display = 'none';
            }
        }, 300); // Match the transition duration
    }
});

// Close playlist panel when clicking outside
document.addEventListener('click', (e) => {
    if (!playlistPanel.contains(e.target) && !playlistButton.contains(e.target)) {
        if (playlistPanel.classList.contains('show')) {
            playlistPanel.classList.remove('show');
            setTimeout(() => {
                playlistPanel.style.display = 'none';
            }, 300);
        }
    }
});

// Prevent clicks inside playlist panel from closing it
playlistPanel.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop the click from reaching the document listener
});

// Function to update volume UI
function updateVolumeUI(volume) {
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLevel = document.querySelector('.volume-level');
    if (volumeSlider && volumeLevel) {
        volumeSlider.value = volume;
        volumeLevel.textContent = `${volume}%`;
    }
}

// Function to initialize the playlist system
function initPlaylistSystem() {
    // Make sure the playlist button is properly set up
    if (playlistButton) {
        console.log('Setting up playlist button...');
        playlistButton.style.display = 'flex';
        setTimeout(() => {
            playlistButton.style.opacity = '1';
            console.log('Playlist button should now be visible');
        }, 300);
    } else {
        console.error('Playlist button not found');
    }
    
    // Set up SoundCloud event handlers
    if (window.scPlayer) {
        // เมื่อเพลงเล่นจบ ให้เล่นเพลงถัดไป
        window.scPlayer.bind(SC.Widget.Events.FINISH, () => {
            const nextIndex = (currentTrackIndex + 1) % playlist.length;
            switchToTrack(nextIndex);
        });

        // ติดตามการเปลี่ยนแปลงของ SoundCloud Player
        window.scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, () => {
            updatePlaylistUI();
        });

        // เมื่อ SoundCloud โหลดเพลงใหม่
        window.scPlayer.bind(SC.Widget.Events.READY, () => {
            window.scPlayer.getCurrentSound(function(sound) {
                // หาเพลงที่กำลังเล่นในรายการ playlist
                const index = playlist.findIndex(track => 
                    track.url.includes(sound.permalink_url) || 
                    sound.permalink_url.includes(track.url)
                );
                if (index !== -1) {
                    currentTrackIndex = index;
                    updatePlaylistUI();
                }
            });
        });

        // เมื่อกดเล่นหรือหยุด
        window.scPlayer.bind(SC.Widget.Events.PLAY, () => {
            updatePlaylistUI();
        });
        window.scPlayer.bind(SC.Widget.Events.PAUSE, () => {
            updatePlaylistUI();
        });
    }
}

// Initialize when SoundCloud is ready
function waitForSoundCloud() {
    let attempts = 0;
    const maxAttempts = 200; // 20 seconds maximum wait time

    const checkInterval = setInterval(() => {
        attempts++;
        if (window.scReady && window.scPlayer) {
            clearInterval(checkInterval);
            initPlaylistSystem();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('SoundCloud initialization timeout');
        }
    }, 100);
}

// Start initialization when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup of playlist button and panel
    if (playlistButton && playlistPanel) {
        playlistButton.style.display = 'none';
        playlistButton.style.opacity = '0';
        playlistPanel.style.display = 'none';
    }
    
    // Wait for SoundCloud to be ready
    waitForSoundCloud();
});
