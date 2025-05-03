// Link confirmation dialog script for Kitsxkorn profile page

// Create the confirmation dialog container
function createConfirmationDialog() {
    // Create the dialog elements
    const dialogContainer = document.createElement('div');
    dialogContainer.className = 'confirmation-dialog-overlay';
    dialogContainer.style.display = 'none';
    
    const dialogContent = document.createElement('div');
    dialogContent.className = 'confirmation-dialog';
    
    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = 'Leaving Kitsxkorn.xyz ?';
    heading.className = 'confirmation-heading';
    
    // Create the message
    const message = document.createElement('p');
    message.textContent = 'This link is taking you to the following website';
    message.className = 'confirmation-message';
    
    // Create the URL display
    const urlDisplay = document.createElement('div');
    urlDisplay.className = 'confirmation-url-container';
    
    const urlText = document.createElement('div');
    urlText.className = 'confirmation-url';
    urlDisplay.appendChild(urlText);
    
    // Create the trust checkbox
    const trustContainer = document.createElement('div');
    trustContainer.className = 'confirmation-trust-container';
    
    const trustCheckbox = document.createElement('input');
    trustCheckbox.type = 'checkbox';
    trustCheckbox.id = 'trust-checkbox';
    trustCheckbox.className = 'confirmation-checkbox';
    
    const trustLabel = document.createElement('label');
    trustLabel.htmlFor = 'trust-checkbox';
    trustLabel.textContent = 'Trust this site';
    trustLabel.className = 'confirmation-trust-label';
    
    trustContainer.appendChild(trustCheckbox);
    trustContainer.appendChild(trustLabel);
    
    // Create the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'confirmation-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Go Back';
    cancelButton.className = 'confirmation-cancel-btn';
    cancelButton.type = 'button'; // Explicitly set button type
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Visit Site';
    confirmButton.className = 'confirmation-confirm-btn';
    confirmButton.type = 'button'; // Explicitly set button type
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    
    // Add everything to the dialog
    dialogContent.appendChild(heading);
    dialogContent.appendChild(message);
    dialogContent.appendChild(urlDisplay);
    dialogContent.appendChild(trustContainer);
    dialogContent.appendChild(buttonContainer);
    
    dialogContainer.appendChild(dialogContent);
    
    // Add event listeners for buttons
    let currentUrl = '';
    let trustedDomains = JSON.parse(localStorage.getItem('trustedDomains')) || [];
    
    // Use a flag to prevent multiple clicks
    let isProcessing = false;
    
    cancelButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop event propagation
        if (isProcessing) return;
        isProcessing = true;
        
        dialogContainer.style.display = 'none';
        
        // Reset processing flag after a short delay
        setTimeout(() => {
            isProcessing = false;
        }, 300);
    });
    
    confirmButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop event propagation
        if (isProcessing) return;
        isProcessing = true;
        
        dialogContainer.style.display = 'none';
        
        // Store domain in trusted list if checkbox is checked
        if (trustCheckbox.checked) {
            try {
                const domain = new URL(currentUrl).hostname;
                if (!trustedDomains.includes(domain)) {
                    trustedDomains.push(domain);
                    localStorage.setItem('trustedDomains', JSON.stringify(trustedDomains));
                }
            } catch (error) {
                console.error("Invalid URL:", error);
            }
        }
        
        // Add a small delay before opening the link to avoid UI glitches
        setTimeout(() => {
            window.open(currentUrl, '_blank');
            isProcessing = false;
        }, 300);
    });
    
    // Prevent clicks on the dialog from closing it
    dialogContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Close the dialog when clicking outside it
    dialogContainer.addEventListener('click', (e) => {
        if (isProcessing) return;
        isProcessing = true;
        
        dialogContainer.style.display = 'none';
        
        setTimeout(() => {
            isProcessing = false;
        }, 300);
    });
    
    // Add the dialog to the document
    document.body.appendChild(dialogContainer);
    
    // Return the dialog controller object
    return {
        show: (url) => {
            if (dialogContainer.style.display === 'flex') return; // Prevent multiple dialogs
            
            currentUrl = url;
            urlText.textContent = url;
            trustCheckbox.checked = false;
            dialogContainer.style.display = 'flex';
        },
        hide: () => {
            dialogContainer.style.display = 'none';
        }
    };
}

// Initialize the confirmation dialog once the DOM is loaded
let confirmationDialog;
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dialog only once
    if (!confirmationDialog) {
        confirmationDialog = createConfirmationDialog();
    }
    
    const links = document.querySelectorAll('.link');
    const trustedDomains = JSON.parse(localStorage.getItem('trustedDomains')) || [];
    
    links.forEach(link => {
        // Remove any existing click listeners to prevent duplicates
        const oldLink = link.cloneNode(true);
        link.parentNode.replaceChild(oldLink, link);
        
        oldLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop event propagation
            
            const url = oldLink.getAttribute('href');
            
            // If URL is valid and not '#'
            if (url && url !== '#') {
                try {
                    const domain = new URL(url).hostname;
                    
                    // Check if domain is trusted
                    if (trustedDomains.includes(domain)) {
                        window.open(url, '_blank');
                    } else {
                        confirmationDialog.show(url);
                    }
                } catch (error) {
                    // If URL is invalid, just open it directly
                    console.error("Invalid URL:", error);
                    window.open(url, '_blank');
                }
            }
        });
    });
});