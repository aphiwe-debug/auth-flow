// API Base URL
const API_BASE = 'http://localhost:8000';

// Store tokens
let accessToken = null;
let refreshToken = null;

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Display API response
function displayResponse(data, isError = false) {
    const output = document.getElementById('response-output');
    output.textContent = JSON.stringify(data, null, 2);
    output.style.color = isError ? '#f56565' : '#68d391';
}

// Register user
async function registerUser() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const fullName = document.getElementById('reg-name').value;

    if (!email || !password || !fullName) {
        displayResponse({error: 'Please fill all fields'}, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                full_name: fullName
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            displayResponse({
                success: true,
                message: 'User registered successfully!',
                user: data
            });
            // Clear form
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-name').value = '';
        } else {
            displayResponse(data, true);
        }
    } catch (error) {
        displayResponse({error: 'Network error: ' + error.message}, true);
    }
}

// Login user
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        displayResponse({error: 'Please fill all fields'}, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            accessToken = data.access_token;
            refreshToken = data.refresh_token;
            
            displayResponse({
                success: true,
                message: 'Login successful!',
                tokens: {
                    access_token: data.access_token.substring(0, 50) + '...',
                    refresh_token: data.refresh_token.substring(0, 50) + '...',
                    token_type: data.token_type
                }
            });
            
            // Enable profile button
            document.getElementById('profile-btn').disabled = false;
            
            // Clear form
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
        } else {
            displayResponse(data, true);
        }
    } catch (error) {
        displayResponse({error: 'Network error: ' + error.message}, true);
    }
}

// Get user profile
async function getProfile() {
    if (!accessToken) {
        displayResponse({error: 'Please login first'}, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            displayResponse({
                success: true,
                message: 'Profile retrieved successfully!',
                profile: data
            });
        } else {
            displayResponse(data, true);
        }
    } catch (error) {
        displayResponse({error: 'Network error: ' + error.message}, true);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
function addLoadingState(buttonElement) {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Loading...';
    buttonElement.disabled = true;
    
    setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
    }, 2000);
}

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#f56565';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#f56565';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
});

// Test API connection on page load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(`${API_BASE}/general/welcome`);
        if (response.ok) {
            console.log('✅ API connection successful');
        }
    } catch (error) {
        console.log('❌ API connection failed:', error.message);
        displayResponse({
            warning: 'API server not running',
            message: 'Please start the AuthFlow API server to test the demo',
            command: 'docker-compose up'
        }, true);
    }
});