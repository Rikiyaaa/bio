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
        will-change: transform; /* บอกเบราว์เซอร์ให้เตรียมพร้อมสำหรับการเปลี่ยนแปลง */
    }
    
    /* เพิ่ม CSS animation แทนการใช้ JavaScript สำหรับการเคลื่อนไหวบางส่วน */
    @keyframes snowfall {
        to {
            transform: translateY(100vh);
        }
    }
    
    .snowflake-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    }
`;
document.head.appendChild(snowStyles);

// ตัวแปรสำหรับควบคุมการทำงานของเอฟเฟกต์หิมะ
let snowflakes = [];
let animationFrameId;
let lastTimestamp = 0;
let lastCreationTime = 0;
let isRunning = false;
let snowflakeContainer;

// สัญลักษณ์เกล็ดหิมะที่หลากหลาย
const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❇', '❈', '❉', '*'];

// ค่าการตั้งค่าที่สามารถปรับได้
const config = {
    maxFlakes: 15,           // ลดจากเดิม 20 เป็น 15
    createInterval: 700,     // เพิ่มจาก 500 เป็น 700ms เพื่อสร้างเกล็ดหิมะน้อยลง
    animationDuration: {     // เวลาในการตกจากบนลงล่าง (แทนการคำนวณตำแหน่งทุกเฟรม)
        min: 8,              // เร็วสุด 8 วินาที
        max: 15              // ช้าสุด 15 วินาที
    },
    updateInterval: 100,     // อัพเดตตำแหน่งทุก 100ms แทนที่จะเป็นทุกเฟรม
    isMobile: window.innerWidth < 768
};

// ปรับค่าตามอุปกรณ์
if (config.isMobile) {
    config.maxFlakes = 7;    // ลดลงอีกสำหรับมือถือ
    config.createInterval = 1000; // เพิ่มช่วงเวลาให้นานขึ้น
}

// สร้างคอนเทนเนอร์สำหรับเกล็ดหิมะทั้งหมด
function createSnowflakeContainer() {
    // สร้างคอนเทนเนอร์เพียงครั้งเดียว
    if (!snowflakeContainer) {
        snowflakeContainer = document.createElement('div');
        snowflakeContainer.className = 'snowflake-container';
        document.body.appendChild(snowflakeContainer);
    }
}

// สร้างเกล็ดหิมะใหม่
function createSnowflake(timestamp) {
    // ถ้ามีเกล็ดหิมะมากเกินไปแล้ว หรือยังไม่ถึงเวลาสร้าง ไม่ต้องสร้างเพิ่ม
    if (snowflakes.length >= config.maxFlakes || 
        timestamp - lastCreationTime < config.createInterval) {
        return;
    }
    
    lastCreationTime = timestamp;
    
    // สร้างองค์ประกอบเกล็ดหิมะใหม่
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    
    // กำหนดขนาดเกล็ดหิมะด้วยการสุ่ม
    const size = Math.random() * 0.8 + 0.5; // ขนาดระหว่าง 0.5 ถึง 1.3em
    snowflake.style.fontSize = `${size}em`;
    snowflake.style.opacity = size * 0.6; // เกล็ดหิมะขนาดเล็กจะจางกว่า
    
    // กำหนดตำแหน่งเริ่มต้นแบบสุ่ม
    const startPosition = Math.random() * window.innerWidth;
    snowflake.style.left = `${startPosition}px`;
    
    // เพิ่มเกล็ดหิมะเข้าไปในคอนเทนเนอร์แทนที่จะเพิ่มเข้า body โดยตรง
    snowflakeContainer.appendChild(snowflake);
    
    // ใช้ CSS Animation สำหรับการตกจากบนลงล่าง
    const animationDuration = Math.random() * 
        (config.animationDuration.max - config.animationDuration.min) + 
        config.animationDuration.min;
    
    // คำนวณคุณสมบัติเพื่อใช้ในการอัพเดต
    const flakeData = {
        element: snowflake,
        positionX: startPosition,
        horizontalSpeed: Math.random() * 0.8 - 0.4, // ลดความเร็วแนวนอน
        rotationAngle: Math.random() * 360,
        rotationSpeed: Math.random() * 0.3, // ลดความเร็วในการหมุน
        size: size,
        createdAt: timestamp,
        animationDuration: animationDuration
    };
    
    // ตั้งค่า CSS animation สำหรับการเคลื่อนที่ในแนวดิ่ง
    snowflake.style.animation = `snowfall ${animationDuration}s linear forwards`;
    
    // กำหนดตำแหน่งเริ่มต้น
    snowflake.style.transform = `translate3d(${flakeData.positionX}px, -10px, 0) rotate(${flakeData.rotationAngle}deg)`;
    
    snowflakes.push(flakeData);
    
    // ตั้งเวลาลบเกล็ดหิมะเมื่อตกถึงพื้นเสร็จแล้ว
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.parentNode.removeChild(snowflake);
        }
        // ลบข้อมูลเกล็ดหิมะออกจาก array
        const index = snowflakes.indexOf(flakeData);
        if (index > -1) {
            snowflakes.splice(index, 1);
        }
    }, animationDuration * 1000 + 100); // เผื่อเวลานิดหน่อย
}

// อัพเดตเฉพาะการหมุนและการเคลื่อนที่ในแนวนอน (แนวดิ่งใช้ CSS animation)
function updateSnowflakes(timestamp) {
    if (!isRunning) return;
    
    // สร้างเกล็ดหิมะใหม่
    createSnowflake(timestamp);
    
    // อัพเดตตำแหน่งของเกล็ดหิมะแต่ละอันเฉพาะการหมุนและแนวนอน
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        const flake = snowflakes[i];
        
        // คำนวณเวลาที่ผ่านไปจากเริ่มต้น
        const elapsedTime = (timestamp - flake.createdAt) / 1000; // เป็นวินาที
        
        // คำนวณตำแหน่งในแนวนอนและมุมการหมุน
        const horizontalOffset = flake.horizontalSpeed * elapsedTime * 50; // ปรับค่าให้เหมาะสม
        const currentX = flake.positionX + horizontalOffset;
        const currentRotation = flake.rotationAngle + flake.rotationSpeed * elapsedTime * 50;
        
        // คำนวณตำแหน่งในแนวดิ่งตาม CSS animation (ไม่ต้องคำนวณเอง)
        const progress = Math.min(elapsedTime / flake.animationDuration, 1);
        const verticalPosition = progress * window.innerHeight;
        
        // อัพเดตแบบรวมครั้งเดียว
        flake.element.style.transform = 
            `translate3d(${currentX}px, ${verticalPosition}px, 0) rotate(${currentRotation}deg)`;
    }
    
    // เรียกฟังก์ชันนี้อีกครั้งหลังจากผ่านไป updateInterval
    if (isRunning) {
        animationFrameId = setTimeout(() => {
            requestAnimationFrame(updateSnowflakes);
        }, config.updateInterval);
    }
}

// เริ่มต้นเอฟเฟกต์หิมะ
function startSnow() {
    if (isRunning) return;
    
    // สร้างคอนเทนเนอร์ถ้ายังไม่มี
    createSnowflakeContainer();
    
    isRunning = true;
    lastTimestamp = 0;
    lastCreationTime = 0;
    requestAnimationFrame(updateSnowflakes);
}

// หยุดเอฟเฟกต์หิมะ
function stopSnow() {
    isRunning = false;
    if (animationFrameId) {
        clearTimeout(animationFrameId);
        animationFrameId = null;
    }
}

// ล้างเกล็ดหิมะทั้งหมด
function clearSnow() {
    if (snowflakeContainer) {
        // ล้างทั้งคอนเทนเนอร์เลย ซึ่งเร็วกว่าการลบทีละอัน
        snowflakeContainer.innerHTML = '';
    }
    snowflakes = [];
}

// ใช้ IntersectionObserver เพือตรวจสอบว่าเราเห็นเอฟเฟกต์หรือไม่
function setupVisibilityOptimization() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับหรือไม่
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                if (!isRunning) startSnow();
            } else {
                if (isRunning) {
                    stopSnow();
                    // ไม่จำเป็นต้อง clearSnow ถ้าเพียงออกจากวิวพอร์ตชั่วคราว
                }
            }
        }, { threshold: 0.1 });
        
        // สังเกตคอนเทนเนอร์หิมะ
        if (snowflakeContainer) {
            observer.observe(snowflakeContainer);
        }
    }
}

// ลดโหลด CPU เมื่อแท็บไม่ได้ถูกมอง
function setupTabVisibilityHandler() {
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // เริ่มใหม่เมื่อกลับมาที่แท็บ
            if (!isRunning) startSnow();
        } else {
            // หยุดเมื่อออกจากแท็บ
            if (isRunning) {
                stopSnow();
                clearSnow(); // ล้างทั้งหมดเพื่อประหยัด memory
            }
        }
    });
}

// ปรับขนาดตามการปรับหน้าจอ (throttled)
let resizeTimeout;
function setupResponsiveHandling() {
    window.addEventListener('resize', function() {
        // ใช้ throttling เพื่อลดจำนวนการเรียกฟังก์ชัน
        if (resizeTimeout) clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(function() {
            config.isMobile = window.innerWidth < 768;
            if (config.isMobile) {
                config.maxFlakes = 7;
                config.createInterval = 1000;
            } else {
                config.maxFlakes = 15;
                config.createInterval = 700;
            }
            
            // หากมีเกล็ดหิมะมากเกินไปหลังจากปรับขนาดหน้าจอ ให้ลบส่วนเกินออก
            if (snowflakes.length > config.maxFlakes) {
                for (let i = snowflakes.length - 1; i >= config.maxFlakes; i--) {
                    if (snowflakes[i].element && snowflakes[i].element.parentNode) {
                        snowflakes[i].element.parentNode.removeChild(snowflakes[i].element);
                    }
                }
                snowflakes = snowflakes.slice(0, config.maxFlakes);
            }
        }, 200); // รอ 200ms หลังจากการปรับขนาดสุดท้าย
    });
}

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
function initSnowEffect() {
    // หน่วงเวลา 500ms ก่อนเริ่มเอฟเฟกต์เพื่อให้หน้าเว็บโหลดเสร็จก่อน
    setTimeout(() => {
        createSnowflakeContainer();
        setupVisibilityOptimization();
        setupTabVisibilityHandler();
        setupResponsiveHandling();
        startSnow();
    }, 500);
}

// เพิ่มปุ่มควบคุมสำหรับเปิด/ปิดเอฟเฟกต์ (เพื่อความสะดวก)
function addControlButton() {
    const controlButton = document.createElement('button');
    controlButton.textContent = 'ปิดเอฟเฟกต์หิมะ';
    controlButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 100;
        padding: 5px 10px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        border-radius: 5px;
        font-family: sans-serif;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.3s;
    `;
    
    controlButton.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });
    
    controlButton.addEventListener('mouseout', function() {
        this.style.opacity = '0.6';
    });
    
    controlButton.addEventListener('click', function() {
        if (isRunning) {
            stopSnow();
            clearSnow();
            controlButton.textContent = 'เปิดเอฟเฟกต์หิมะ';
        } else {
            startSnow();
            controlButton.textContent = 'ปิดเอฟเฟกต์หิมะ';
        }
    });
    
    document.body.appendChild(controlButton);
}

// ใช้ requestIdleCallback ถ้าเบราว์เซอร์รองรับ
if ('requestIdleCallback' in window) {
    window.addEventListener('load', function() {
        requestIdleCallback(() => {
            initSnowEffect();
            addControlButton();
        }, { timeout: 2000 });
    });
} else {
    // ตกไปใช้ setTimeout ถ้าไม่รองรับ
    window.addEventListener('load', function() {
        setTimeout(() => {
            initSnowEffect();
            addControlButton();
        }, 1000);
    });
}
