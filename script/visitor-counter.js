// เพิ่มตัวแปร global เพื่อเช็คว่าได้เพิ่มจำนวนผู้เข้าชมในเซสชั่นนี้ไปแล้วหรือยัง
let hasIncrementedThisSession = false;

function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (!visitorCountElement) return;
    
    // Show loading state
    visitorCountElement.textContent = '';
    visitorCountElement.classList.add('loading');
    
    // ดึงข้อมูลจาก localStorage
    let count = localStorage.getItem('visitorCount');
    
    // ถ้าไม่มีข้อมูลใน localStorage หรือค่าไม่ถูกต้อง
    if (!count || isNaN(parseInt(count))) {
        count = '1';
        hasIncrementedThisSession = true;
    } else if (!hasIncrementedThisSession) {
        // เพิ่มจำนวนผู้เข้าชมเฉพาะถ้ายังไม่ได้เพิ่มในเซสชั่นนี้
        count = (parseInt(count) + 1).toString();
        hasIncrementedThisSession = true;
    }
    
    // บันทึกค่าลงใน localStorage
    localStorage.setItem('visitorCount', count);
    
    // จำลองการโหลดข้อมูล
    setTimeout(() => {
        visitorCountElement.textContent = formatVisitorCount(parseInt(count));
        visitorCountElement.classList.remove('loading');
        
        // เพิ่ม hover effect เพื่อแสดงจำนวนผู้เข้าชมแบบเต็ม
        visitorCountElement.parentElement.title = `ผู้เข้าชมทั้งหมด: ${formatVisitorCount(parseInt(count))} คน`;
    }, 1000);
}

// Format visitor count for readability
function formatVisitorCount(count) {
    if (count < 1000) return count.toString();
    
    if (count < 10000) {
        // 1,234
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (count < 1000000) {
        // 12.3K
        return (count / 1000).toFixed(1) + 'K';
    } else {
        // 1.2M
        return (count / 1000000).toFixed(1) + 'M';
    }
}

// ป้องกันการเรียกใช้งานซ้ำ
let isCounterInitialized = false;

// Initialize when page is loaded
function initCounter() {
    if (isCounterInitialized) return; // ถ้าเคยเริ่มต้นแล้วให้ออกจากฟังก์ชัน
    isCounterInitialized = true;
    initVisitorCounter();
}

// เริ่มต้นนับเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // ถ้าไม่มีหน้า enter screen ให้เริ่มนับเลย
    if (!document.getElementById('enter-screen')) {
        setTimeout(initCounter, 2000);
    } else {
        // ถ้ามีหน้า enter screen ให้รอจนกว่าจะกดปุ่ม
        document.getElementById('enter-screen').addEventListener('click', function() {
            setTimeout(initCounter, 2000);
        });
    }
});
