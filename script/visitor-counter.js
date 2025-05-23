function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (!visitorCountElement) return;
    
    const websiteNamespace = 'www.kitsxkorn.xyz'; // Use as website name or URL (no spaces or special chars)
    const counterKey = 'visitors'; // Key for storing visitor count
    
    // Show loading state
    visitorCountElement.textContent = '';
    visitorCountElement.classList.add('loading');
    
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

// Initialize when page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Visitor counter will be initialized after the loading screen
    // through the showMainContent function in main.js
    
    // Also add event listener to the enter button as a fallback
    document.getElementById('enter-screen').addEventListener('click', function() {
        // Wait for content to load before initializing counter
        setTimeout(initVisitorCounter, 2000);
    });
});
