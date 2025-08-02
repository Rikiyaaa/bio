<<<<<<< HEAD
// เพิ่มตัวแปร global เพื่อเช็คว่าได้เพิ่มจำนวนผู้เข้าชมในเซสชั่นนี้ไปแล้วหรือยัง
let hasIncrementedThisSession = false;

=======
>>>>>>> 2d888414db0a8d41fe11680a66ce794fcd6d4aa5
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (!visitorCountElement) return;
    
<<<<<<< HEAD
=======
    const websiteNamespace = 'www.kitsxkorn.xyz'; // Use as website name or URL (no spaces or special chars)
    const counterKey = 'visitors'; // Key for storing visitor count
    
>>>>>>> 2d888414db0a8d41fe11680a66ce794fcd6d4aa5
    // Show loading state
    visitorCountElement.textContent = '';
    visitorCountElement.classList.add('loading');
    
<<<<<<< HEAD
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
=======
    // Create URL for API request using the new API endpoint
    const apiUrl = `https://api.counterapi.dev/v1/${encodeURIComponent(websiteNamespace)}/${encodeURIComponent(counterKey)}/up`;
    
    // Call CounterAPI
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update counter value using the correct field from the API response
            // The new API returns the count in data.count as shown in the sample response
            const count = data.count || 1; // Fallback to 1 if count is somehow missing
            visitorCountElement.textContent = formatVisitorCount(count);
            visitorCountElement.classList.remove('loading');
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            // Show default value if error occurs
            visitorCountElement.textContent = '1';
            visitorCountElement.classList.remove('loading');
        });
>>>>>>> 2d888414db0a8d41fe11680a66ce794fcd6d4aa5
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

<<<<<<< HEAD
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
=======
// Initialize when page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Visitor counter will be initialized after the loading screen
    // through the showMainContent function in main.js
    
    // Also add event listener to the enter button as a fallback
    document.getElementById('enter-screen').addEventListener('click', function() {
        // Wait for content to load before initializing counter
        setTimeout(initVisitorCounter, 2000);
    });
>>>>>>> 2d888414db0a8d41fe11680a66ce794fcd6d4aa5
});
