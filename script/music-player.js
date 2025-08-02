// Music Player with SoundCloud Integration

// Music player elements
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const musicProgress = document.getElementById('music-progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
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
    let currentTrack = getRandomTrack(); // เริ่มต้นด้วยเพลงสุ่ม
    
    scPlayer.bind(SC.Widget.Events.READY, function() {
        scReady = true;
        
        // โหลดเพลงแรก
        scPlayer.load(currentTrack.url, {
            callback: function() {
                // Set album artwork
                albumCover.src = currentTrack.artwork;
                
                // อัพเดทชื่อเพลงและศิลปิน
                document.querySelector('.music-title').textContent = currentTrack.title;
                document.querySelector('.music-artist').textContent = currentTrack.artist;
                
                // Get track duration
                scPlayer.getDuration(function(duration) {
                    scDuration = duration;
                    durationEl.textContent = formatTime(duration/1000);
                });
                
        // ตั้งค่าระดับเสียงเริ่มต้น
        const volumeSlider = document.getElementById('volume-slider');
        const defaultVolume = 50; // ค่าเริ่มต้น 50%
        
        if (volumeSlider) {
            volumeSlider.value = defaultVolume;
            document.querySelector('.volume-level').textContent = `${defaultVolume}%`;
            scPlayer.setVolume(defaultVolume);
        } else {
            scPlayer.setVolume(defaultVolume);
        }                // Auto play after SoundCloud is ready
                if (typeof enterClicked !== 'undefined' && enterClicked) {
                    setTimeout(() => {
                        // ถ้ามีการกำหนด startTime ให้เริ่มเล่นจากจุดนั้น
                        // เล่นเพลงจาก startTime โดยตรง
                const startTime = currentTrack.startTime || 0;
                // อัพเดท UI ก่อน
                const startProgress = (startTime * 1000 / scDuration) * 100;
                musicProgress.style.width = `${startProgress}%`;
                currentTimeEl.textContent = formatTime(startTime);
                
                // ตั้งค่าตำแหน่งเริ่มต้นและระดับเสียงก่อนเล่น
                scPlayer.seekTo(startTime * 1000);

                // ตั้งค่าระดับเสียงตามที่กำหนดในเพลง
                const trackVolume = currentTrack.volume !== undefined ? currentTrack.volume : 50;
                const volumeSlider = document.getElementById('volume-slider');
                if (volumeSlider) {
                    volumeSlider.value = trackVolume;
                    document.querySelector('.volume-level').textContent = `${trackVolume}%`;
                }
                scPlayer.setVolume(trackVolume);

                setTimeout(() => {
                    scPlayer.play();
                    setPlayingState(true);
                }, 100);
                    }, 100); // รอ 4 วินาที
                }
            }
        });
    });
    
    // ตัวแปรสำหรับจัดการ progress animation
    let currentProgress = 0;
    let lastUpdateTime = 0;
    const PROGRESS_SMOOTH_FACTOR = 0.3; // ค่าที่ต่ำลงจะทำให้ animation นุ่มนวลขึ้น

    // ฟังก์ชันสำหรับทำ smooth progress
    function updateProgressSmooth(targetProgress) {
        const now = performance.now();
        if (!lastUpdateTime) lastUpdateTime = now;

        // คำนวณเวลาที่ผ่านไป
        const deltaTime = (now - lastUpdateTime) / 1000;
        lastUpdateTime = now;

        // ใช้ exponential smoothing เพื่อให้การเคลื่อนที่นุ่มนวล
        const smoothFactor = Math.min(1, PROGRESS_SMOOTH_FACTOR * deltaTime * 60);
        currentProgress += (targetProgress - currentProgress) * smoothFactor;

        // อัพเดท UI
        musicProgress.style.width = `${currentProgress}%`;

        // ทำ animation ต่อไปถ้ายังไม่ถึงเป้าหมาย
        if (Math.abs(targetProgress - currentProgress) > 0.01) {
            requestAnimationFrame(() => updateProgressSmooth(targetProgress));
        }
    }

    // Listen for the actual play event with smooth transition
    scPlayer.bind(SC.Widget.Events.PLAY, function() {
        setPlayingState(true);
        document.querySelector('.music-player').classList.add('is-playing');
    });
    
    // Listen for pause event with smooth transition
    scPlayer.bind(SC.Widget.Events.PAUSE, function() {
        setPlayingState(false);
        document.querySelector('.music-player').classList.remove('is-playing');
    });
    
    // Setup SoundCloud event listeners with smooth progress update
    scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
        // Update music progress bar smoothly
        const position = e.currentPosition / 1000;
        const duration = scDuration / 1000;
        targetProgress = (position / duration) * 100;
        
        // ยกเลิก animation frame เดิม (ถ้ามี)
        if (progressAnimationFrame) {
            cancelAnimationFrame(progressAnimationFrame);
        }
        
        // เริ่ม animation ใหม่
        lastProgress = null;
        progressAnimationFrame = requestAnimationFrame(animateProgress);
        
        // อัพเดทเวลาแบบ smooth
        requestAnimationFrame(() => {
            currentTimeEl.textContent = formatTime(position);
        });
    });
    
    scPlayer.bind(SC.Widget.Events.PLAY, function() {
        setPlayingState(true);
    });
    
    scPlayer.bind(SC.Widget.Events.PAUSE, function() {
        setPlayingState(false);
    });
    
    // ติดตามการเล่นเพลง
    // ติดตามความคืบหน้าการเล่น
    scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
        if (!isDragging) { // อัพเดท UI เฉพาะเมื่อไม่ได้กำลังลาก
            const currentPosition = e.currentPosition / 1000;
            const duration = scDuration / 1000;
            const progress = (currentPosition / duration) * 100;
            
            // อัพเดท UI แบบนุ่มนวล
            requestAnimationFrame(() => {
                musicProgress.style.width = `${progress}%`;
                currentTimeEl.textContent = formatTime(currentPosition);
            });
            
            // ตรวจสอบ endTime ถ้ามีการกำหนดไว้
            if (currentTrack.endTime && currentPosition >= currentTrack.endTime) {
                playNextTrack();
            }
        }
    });

    // เมื่อเพลงจบ
    scPlayer.bind(SC.Widget.Events.FINISH, function() {
        playNextTrack();
    });

    // ฟังก์ชันเล่นเพลงถัดไป
    function playNextTrack() {
        scPlayer.getCurrentSound(function(sound) {
            const nextTrack = getNextTrack(sound.permalink_url);
            currentTrack = nextTrack; // อัพเดทเพลงปัจจุบัน
            
            // โหลดและเล่นเพลงถัดไป
            scPlayer.load(nextTrack.url, {
                callback: function() {
                    // อัพเดทข้อมูลเพลง
                    albumCover.src = nextTrack.artwork;
                    document.querySelector('.music-title').textContent = nextTrack.title;
                    document.querySelector('.music-artist').textContent = nextTrack.artist;
                    
                        // เล่นเพลงจาก startTime โดยตรง
                    const startTime = nextTrack.startTime || 0;
                    // อัพเดท UI ก่อน
                    const startProgress = (startTime * 1000 / scDuration) * 100;
                    musicProgress.style.width = `${startProgress}%`;
                    currentTimeEl.textContent = formatTime(startTime);
                    
                    // ตั้งค่าตำแหน่งเริ่มต้นก่อนเล่น
                    scPlayer.seekTo(startTime * 1000);
                    setTimeout(() => {
                        scPlayer.play();
                        setPlayingState(true);
                    }, 100);
                }
            });
        });
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
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Play/pause music
function playMusic() {
    if (scReady) {
        // Check current state
        scPlayer.isPaused(function(paused) {
            if (paused) {
                scPlayer.play();
            } else {
                scPlayer.pause();
            }
        });
    }
}

// Initialize event listeners for music player
document.addEventListener('DOMContentLoaded', function() {
    // Initialize SoundCloud
    initSoundCloud();
    
    // Handle play button click
    playBtn.addEventListener('click', function() {
        playMusic();
    });
    
    // Handle music timeline interaction
    const musicTimeline = document.querySelector('.music-timeline');
    let isDragging = false;
    let wasPlaying = false;
    let lastTouchY = 0;

    // ป้องกันการเลื่อนหน้าจอบนมือถือ
    musicTimeline.addEventListener('touchstart', function(e) {
        lastTouchY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    musicTimeline.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    document.body.addEventListener('touchmove', function(e) {
        if (isDragging) {
            e.preventDefault();
        }
    }, { passive: false });

    // ฟังก์ชันสำหรับเลื่อนเวลาเพลงแบบสมูท
    function smoothSeek(e) {
        if (scReady) {
            const timeline = musicTimeline.getBoundingClientRect();
            const clickPosition = (e.clientX - timeline.left) / timeline.width;
            const seekTime = Math.floor(clickPosition * (scDuration / 1000)) * 1000;
            
            // อัพเดท UI ทันที
            musicProgress.style.width = `${clickPosition * 100}%`;
            currentTimeEl.textContent = formatTime(seekTime / 1000);
            
            return seekTime;
        }
        return 0;
    }

    // เริ่มลาก
    musicTimeline.addEventListener('mousedown', function(e) {
        if (scReady) {
            isDragging = true;
            scPlayer.isPaused(function(paused) {
                wasPlaying = !paused;
                if (!paused) {
                    scPlayer.pause();
                }
            });
            smoothSeek(e);
        }
    });

    // ลากอยู่
    document.addEventListener('mousemove', function(e) {
        if (isDragging && scReady) {
            smoothSeek(e);
        }
    });

    // หยุดลาก
    document.addEventListener('mouseup', function(e) {
        if (isDragging && scReady) {
            const seekTime = smoothSeek(e);
            scPlayer.seekTo(seekTime);
            if (wasPlaying) {
                scPlayer.play();
            }
            isDragging = false;
        }
    });
    
    // Handle volume control
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (scReady) {
                scPlayer.setVolume(this.value);
            }
        });
    }
});