// API Base URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const messageBox = document.getElementById('messageBox');

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    clearMessage();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    clearMessage();
});

// Handle Login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('loginUserId').value.trim();
    const phoneNumber = document.getElementById('loginPhone').value.trim();
    
    if (!userId || !phoneNumber) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, phoneNumber })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
});

// Handle Registration
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const userId = document.getElementById('registerUserId').value.trim();
    const phoneNumber = document.getElementById('registerPhone').value.trim();
    
    if (!username || !userId || !phoneNumber) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, userId, phoneNumber })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Registration successful! Please login.', 'success');
            
            // Clear form and switch to login
            registerFormElement.reset();
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            }, 1500);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
});

// Show message function
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        clearMessage();
    }, 4000);
}

// Clear message function
function clearMessage() {
    messageBox.style.display = 'none';
    messageBox.textContent = '';
}
