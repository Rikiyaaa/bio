// เพิ่ม CSS สำหรับเอฟเฟกต์หิมะตก
const snowStyles = document.createElement('style');
snowStyles.innerHTML = `
    .snowflake {
        position: fixed;
        top: -10px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1em;
        font-family: Arial, sans-serif;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        user-select: none;
        z-index: 1;
        pointer-events: none;
        opacity: 0;
        animation: snowfall-fade-in 0.5s ease forwards;
    }

    @keyframes snowfall-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(snowStyles);

// ตัวแปรสำหรับควบคุมการทำงานของเอฟเฟกต์หิมะ
let snowflakes = [];
let snowInterval;

// สร้างเกล็ดหิมะใหม่
function createSnowflake() {
    // สัญลักษณ์เกล็ดหิมะที่หลากหลาย
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❇', '❈', '❉', '*'];
    
    // สร้างองค์ประกอบเกล็ดหิมะใหม่
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    
    // กำหนดขนาดเกล็ดหิมะด้วยการสุ่ม
    const size = Math.random() * 1 + 0.5; // ขนาดระหว่าง 0.5 ถึง 1.5em
    snowflake.style.fontSize = `${size}em`;
    snowflake.style.opacity = size * 0.6; // เกล็ดหิมะขนาดเล็กจะจางกว่า
    
    // กำหนดตำแหน่งเริ่มต้นแบบสุ่ม
    const startPosition = Math.random() * window.innerWidth;
    snowflake.style.left = `${startPosition}px`;
    
    // เพิ่มเกล็ดหิมะเข้าไปในหน้าเว็บ
    document.body.appendChild(snowflake);
    snowflakes.push(snowflake);
    
    // กำหนดค่าพื้นฐานสำหรับแอนิเมชั่น
    const speed = Math.random() * 3 + 2; // ความเร็วระหว่าง 2 ถึง 5
    const horizontalSpeed = Math.random() * 2 - 1; // ความเร็วแนวนอนระหว่าง -1 ถึง 1
    const rotation = Math.random() * 360; // การหมุนเริ่มต้นแบบสุ่ม
    
    // เริ่มต้นแอนิเมชั่นของเกล็ดหิมะ
    let positionY = -10;
    let currentPositionX = startPosition;
    let rotationAngle = rotation;
    
    function animateSnowflake() {
        if (!snowflake || !snowflake.parentNode) return;
        
        positionY += speed * 0.5;
        currentPositionX += horizontalSpeed;
        rotationAngle += 0.5;
        
        snowflake.style.top = `${positionY}px`;
        snowflake.style.left = `${currentPositionX}px`;
        snowflake.style.transform = `rotate(${rotationAngle}deg)`;
        
        // ลบเกล็ดหิมะเมื่อมันตกลงล่างพ้นหน้าจอ
        if (positionY > window.innerHeight) {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
            // ลบเกล็ดหิมะออกจากอาร์เรย์
            const index = snowflakes.indexOf(snowflake);
            if (index !== -1) {
                snowflakes.splice(index, 1);
            }
            return;
        }
        
        // ทำให้แอนิเมชั่นทำงานต่อเนื่อง
        requestAnimationFrame(animateSnowflake);
    }
    
    // เริ่มต้นแอนิเมชั่น
    requestAnimationFrame(animateSnowflake);
}

// เริ่มต้นเอฟเฟกต์หิมะ
function startSnow() {
    if (snowInterval) {
        clearInterval(snowInterval);
    }
    
    // สร้างหิมะใหม่ทุก 1 วินาที
    snowInterval = setInterval(function() {
        if (document.visibilityState === 'visible') {
            createSnowflake();
        }
    }, 1000);
}

// เริ่มต้นเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
function initSnowEffect() {
    // เริ่มเอฟเฟกต์หิมะทันที
    startSnow();
}

// เรียกใช้ฟังก์ชัน initSnowEffect เมื่อหน้าเว็บโหลดเสร็จ
window.addEventListener('load', initSnowEffect);

// เพิ่มการตรวจสอบเมื่อเปลี่ยนแท็บกลับมา
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && !snowInterval) {
        startSnow();
    }
});