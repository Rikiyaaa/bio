/**
 * Discord Integration Frontend Script
 * 
 * ไฟล์นี้จัดการเชื่อมต่อกับ API server
 * เพื่อแสดงสถานะ Discord แบบ real-time
 */

// ตั้งค่าการเชื่อมต่อ
const CONFIG = {
    // URL ของ API server ใหม่
    apiUrl: 'https://discord-user-info-api.vercel.app/api',
    // Discord User ID ที่ต้องการแสดงข้อมูล
    userId: '918384557131173988',
    // ช่วงเวลาในการดึงข้อมูลใหม่ (มิลลิวินาที)
    refreshInterval: 1000
  };
  
  // ตัวแปรสำหรับเก็บข้อมูล interval ของการดึงข้อมูลใหม่
  let dataRefreshInterval = null;
  
  // DOM Elements
  const elements = {
    statusIndicator: document.getElementById('discord-status-indicator'),
    avatar: document.getElementById('discord-avatar'),
    username: document.getElementById('discord-username'),
    statusText: document.getElementById('discord-status-text'),
    time: document.getElementById('discord-time'),
  };
  
  /**
   * เริ่มต้นการเชื่อมต่อกับ API
   */
  function initDiscordIntegration() {
    console.log('Initializing Discord integration...');
    
    // ดึงข้อมูลเริ่มต้น
    fetchUserData();
    
    // ตั้งเวลาดึงข้อมูลใหม่ทุกๆ x วินาที
    dataRefreshInterval = setInterval(fetchUserData, CONFIG.refreshInterval);
  }
  
  /**
   * ดึงข้อมูลผู้ใช้จาก API
   */
  async function fetchUserData() {
    try {
      // ดึงข้อมูลพื้นฐานของผู้ใช้
      const userData = await fetchData(`${CONFIG.apiUrl}/${CONFIG.userId}`);
      
      // ดึงข้อมูลกิจกรรมของผู้ใช้
      const activityData = await fetchData(`${CONFIG.apiUrl}/activity/${CONFIG.userId}`);
      
      // รวมข้อมูลเข้าด้วยกัน
      const combinedData = {
        ...userData,
        presence: activityData
      };
      
      // อัพเดต UI
      updateUserInterface(combinedData);
      
      // อัพเดตเวลา
      updateLastUpdatedTime();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      elements.username.textContent = 'ไม่สามารถโหลดข้อมูลได้';
      elements.statusText.textContent = 'ไม่สามารถโหลดสถานะได้';
    }
  }
  
  /**
   * ดึงข้อมูลจาก API
   */
  async function fetchData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * อัพเดตเวลาที่ดึงข้อมูลล่าสุด
   */
  function updateLastUpdatedTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    
    elements.time.textContent = ``;
  }
  
  /**
   * อัพเดต UI ตามข้อมูลผู้ใช้
   */
  function updateUserInterface(userData) {
    if (!userData) return;
    
    console.log('Updating UI with user data:', userData);
    
    // อัพเดตชื่อผู้ใช้
    const usernameContainer = document.createElement('div');
    usernameContainer.style.display = 'flex';
    usernameContainer.style.alignItems = 'center';
    usernameContainer.style.gap = '5px';
    
    const usernameText = document.createElement('span');
    usernameText.textContent = userData.display_name || userData.username;

    const badgeImage1 = document.createElement('img');
    badgeImage1.src = 'https://discordresources.com/img/hypesquadbrilliance.svg'; // เปลี่ยนเป็น URL รูปภาพที่ต้องการสำหรับรูปแรก
    badgeImage1.alt = 'Badge 1';
    badgeImage1.style.width = '20px';
    badgeImage1.style.height = '20px';
    
    const badgeImage2 = document.createElement('img');
    badgeImage2.src = 'https://discordresources.com/img/quest.png'; // เปลี่ยนเป็น URL รูปภาพที่ต้องการสำหรับรูปที่สอง
    badgeImage2.alt = 'Badge 2';
    badgeImage2.style.width = '18px';
    badgeImage2.style.height = '18px';
    
    const badgeImage3 = document.createElement('img');
    badgeImage3.src = 'https://discordresources.com/img/supportscommands.svg'; // เปลี่ยนเป็น URL รูปภาพที่ต้องการสำหรับรูปที่สาม
    badgeImage3.alt = 'Badge 3';
    badgeImage3.style.width = '20px';
    badgeImage3.style.height = '20px';
    
    // เพิ่ม badge ต่างๆ (ถ้ามี)
    usernameContainer.appendChild(usernameText);
    usernameContainer.appendChild(badgeImage1);
    usernameContainer.appendChild(badgeImage2);
    usernameContainer.appendChild(badgeImage3);
    // เคลียร์เนื้อหาเก่าและใส่เนื้อหาใหม่
    elements.username.innerHTML = '';
    elements.username.appendChild(usernameContainer);
    
    // อัพเดต avatar
    if (userData.avatarUrl) {
      elements.avatar.src = userData.avatarUrl;
    }
    
    // อัพเดตสถานะ
    if (userData.presence) {
      updatePresenceUI(userData.presence);
    }

    
    
    
  }
  
  /**
   * อัพเดต Badge จาก userData
   */
  /**
   * เพิ่ม Profile Decoration
   */
  
  /**
   * อัพเดต UI สถานะจาก presence data
   */
  function updatePresenceUI(presenceData) {
    if (!presenceData) return;
    
    console.log('Updating presence UI:', presenceData);
    
    // อัพเดตสถานะสี
    updateStatusColor(presenceData.status);
    
    // อัพเดตข้อความสถานะ
    updateStatusText(presenceData);
    
    // ตรวจสอบว่ามีกิจกรรมเพลงหรือไม่
    checkForMusicActivity(presenceData.activities);
  }
  
  /**
   * อัพเดตสีของสถานะ
   */
  function updateStatusColor(status) {
    // เคลียร์ class เดิม
    elements.statusIndicator.className = 'discord-status';
    
    // เพิ่ม class ตามสถานะ
    switch (status) {
      case 'online':
        elements.statusIndicator.classList.add('status-online');
        break;
      case 'idle':
        elements.statusIndicator.classList.add('status-idle');
        break;
      case 'dnd':
        elements.statusIndicator.classList.add('status-dnd');
        break;
      case 'offline':
      default:
        elements.statusIndicator.classList.add('status-offline');
        break;
    }
  }
  
  /**
   * อัพเดตข้อความสถานะ
   */
// เปลี่ยนฟังก์ชั่น updateStatusText เพื่อให้แสดงข้อความเป็นบรรทัด
// เปลี่ยนฟังก์ชั่น updateStatusText เพื่อให้แสดงข้อความเป็นบรรทัด
// เปลี่ยนฟังก์ชั่น updateStatusText เพื่อให้แสดงข้อความเป็นบรรทัด
function updateStatusText(presenceData) {
    let statusText = getStatusTranslation(presenceData.status);
    
    // ถ้ามีกิจกรรม ให้แสดงกิจกรรมแทน
    if (presenceData.activities && presenceData.activities.length > 0) {
      const activity = presenceData.activities[0]; // ใช้กิจกรรมแรก
      
      switch (activity.type) {
        case "Playing":
          statusText = `Playing ${activity.name}`;
          break;
        case "Streaming":
          statusText = `Streaming ${activity.name}`;
          break;
        case "Listening":
          statusText = `Listening ${activity.name}`;
          break;
        case "Watching":
          statusText = `Watching ${activity.name}`;
          break;
        case "Custom":
          statusText = activity.state || (activity.emoji ? activity.emoji.name : statusText);
          break;
        case "Competing":
          statusText = `Competing ${activity.name}`;
          break;
      }
      
      // สร้าง HTML ด้วย <div> เพื่อแยกบรรทัด
      const statusElement = document.createElement('div');
      statusElement.textContent = statusText;
      elements.statusText.innerHTML = '';
      elements.statusText.appendChild(statusElement);
      
      // เพิ่มรายละเอียดถ้ามี ในบรรทัดใหม่
      if (activity.details) {
        const detailsElement = document.createElement('div');
        detailsElement.textContent = `${activity.details}`;
        detailsElement.style.fontSize = 'smaller';
        elements.statusText.appendChild(detailsElement);
      }
      
      // เพิ่มระยะเวลาถ้ามี ในบรรทัดใหม่
      if (activity.timestamps && activity.timestamps.start) {
        const durationElement = document.createElement('div');
        const startTime = new Date(activity.timestamps.start);
        const now = new Date();
        const timeDiffMinutes = Math.floor((now - startTime) / (1000 * 60));
        
        let timeText = '';
        if (timeDiffMinutes < 1) {
          timeText = 'just now';
        } else if (timeDiffMinutes < 60) {
          timeText = `for ${timeDiffMinutes} minute${timeDiffMinutes > 1 ? 's' : ''} ago`;
        } else {
          const hours = Math.floor(timeDiffMinutes / 60);
          timeText = `for about ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        
        durationElement.textContent = `${timeText}`;
        durationElement.style.color = '#8bdc8b'; // สีเขียวอ่อน
        durationElement.style.fontSize = 'smaller';
        durationElement.style.fontWeight = 'bold';
        elements.statusText.appendChild(durationElement);
      }
    } else {
      // ถ้าไม่มีกิจกรรม ให้แสดงข้อความสถานะปกติ
      elements.statusText.textContent = statusText;
    }
  }
  
  /**
   * แปลสถานะเป็นภาษาไทย
   */
  function getStatusTranslation(status) {
    switch (status) {
      case 'online': return 'ออนไลน์';
      case 'idle': return 'ไม่อยู่';
      case 'dnd': return 'ห้ามรบกวน';
      case 'offline': return 'ออฟไลน์';
      default: return 'ไม่ทราบสถานะ';
    }
  }
  
  /**
   * ตรวจสอบว่ามีกิจกรรมเล่นเพลงหรือไม่
   */
  function checkForMusicActivity(activities) {
    if (!activities || activities.length === 0) return;
    
    // ค้นหากิจกรรมประเภท "Listening to Spotify" หรือเล่นเพลงอื่นๆ
    const musicActivity = activities.find(activity => 
      activity.type === "Listening" || // Listening
      (activity.type === "Playing" && // Playing
       (activity.name.includes('Spotify') || 
        activity.name.includes('Music') || 
        activity.name.includes('YouTube Music') ||
        activity.name.includes('Apple Music')))
    );
    
    if (musicActivity) {
      console.log('Found music activity:', musicActivity);
      updateMusicPlayer(musicActivity);
    }
  }
  
  /**
   * อัพเดต UI ของ Music Player
   */
  function updateMusicPlayer(activity) {
    const musicTitleElement = document.querySelector('.music-title');
    const musicArtistElement = document.querySelector('.music-artist');
    const musicAlbumArt = document.querySelector('.music-album-art');
    
    if (musicTitleElement && musicArtistElement) {
      if (activity.details) {
        musicTitleElement.textContent = activity.details; // ชื่อเพลง
      }
      
      if (activity.state) {
        musicArtistElement.textContent = activity.state; // ชื่อศิลปิน
      }
      
      // อัพเดตรูปอัลบั้มถ้ามี
      if (musicAlbumArt && activity.assets && activity.assets.largeImage) {
        musicAlbumArt.src = activity.assets.largeImage;
      }
    }
  }
  
  // เริ่มต้นเมื่อโหลดหน้าเว็บเสร็จ
  document.addEventListener('DOMContentLoaded', () => {
    // สร้าง CSS สำหรับสถานะ
    createStatusStyles();
    
    // เริ่มต้นการเชื่อมต่อ
    initDiscordIntegration();
    
    // จัดการการทำงานของ Music Player (ถ้ามี)
    setupMusicPlayerControls();
  });
  
  /**
   * สร้าง CSS สำหรับสถานะต่างๆ
   */
  function createStatusStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .discord-status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      
      .status-online {
        background-color: #43b581;
      }
      
      .status-idle {
        background-color: #faa61a;
      }
      
      .status-dnd {
        background-color: #f04747;
      }
      
      .status-offline {
        background-color: #747f8d;
      }
      
      .discord-activity-status {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .discord-activity-status svg {
        width: 16px;
        height: 16px;
      }
      
      .discord-badge {
        display: inline-block;
        margin-left: 4px;
        position: relative;
      }
      
      .discord-badge[data-tooltip]:hover:after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #18191c;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10;
      }
      
      .discord-profile-decorations {
        position: absolute;
        top: -6px;
        left: -6px;
        right: -6px;
        bottom: -6px;
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  /**
   * จัดการการทำงานของ Music Player
   */
  function setupMusicPlayerControls() {
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    if (playBtn && playIcon && pauseIcon) {
      playBtn.addEventListener('click', () => {
        // สลับระหว่างไอคอนเล่นและหยุด
        if (playIcon.style.display !== 'none') {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        } else {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
        
        // จำลองการเล่น/หยุดเพลง
        const music = document.getElementById('bg-music');
        if (music) {
          if (music.paused) {
            music.play();
          } else {
            music.pause();
          }
        }
      });
    }
    
    // จำลองความคืบหน้าของเพลง
    let progress = 0;
    const musicProgress = document.getElementById('music-progress');
    
    if (musicProgress) {
      setInterval(() => {
        if (pauseIcon && pauseIcon.style.display !== 'none') {
          progress = (progress + 1) % 100;
          musicProgress.style.width = `${progress}%`;
        }
      }, 1000);
    }
  }