document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const game = document.getElementById('game').value.trim();
    const platform = document.getElementById('platform').value;
    const details = document.getElementById('details').value.trim();
    
    // Validate required fields
    if (!name || !email || !game) {
        showStatus('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    if (!validateEmail(email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Prepare data
    const formData = {
        name: name,
        email: email,
        game: game,
        platform: platform,
        details: details,
        timestamp: new Date().toLocaleString()
    };
    
    // Send to Google Sheet
    sendToGoogleSheet(formData);
});

// Back button to return to form
document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('confirmationSection').style.display = 'none';
    document.getElementById('requestForm').reset();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.scrollIntoView({ behavior: 'smooth' });
}

function sendToGoogleSheet(data) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwQrhKkf4qY5RB1n131ijwILr0xDy6qxpGsGfv2ri2qnU1f6sJCkd2xQtWTezCD1Q3AiQ/exec';
    
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // Hide form and show confirmation
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('confirmationSection').style.display = 'block';
    })
    .catch(error => {
        showStatus('An error occurred. Please try again later.', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    });
}