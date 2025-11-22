// VisualBook - Authentication Management

// DOM elements
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is logged in and redirect if needed
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is logged in and on auth pages, redirect to home
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // If user is not logged in and on protected pages, redirect to login
    if (!currentUser && 
        (currentPage === 'index.html' || 
         currentPage === 'profile.html' || 
         currentPage === 'groups.html' || 
         currentPage === 'posts.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI with current user info if logged in
    if (currentUser) {
        updateUIWithUserInfo(currentUser);
    }
}

// Update UI with current user information
function updateUIWithUserInfo(user) {
    // Update navigation avatar
    const navAvatar = document.getElementById('navAvatar');
    if (navAvatar) {
        navAvatar.src = user.profilePicture || 'images/default-avatar.png';
    }
    
    // Update post user avatar
    const postUserAvatar = document.getElementById('postUserAvatar');
    if (postUserAvatar) {
        postUserAvatar.src = user.profilePicture || 'images/default-avatar.png';
    }
    
    // Update user name in sidebar
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.name;
    }
    
    // Update user bio in sidebar
    const userBio = document.getElementById('userBio');
    if (userBio) {
        userBio.textContent = user.bio || 'No bio yet';
    }
}

// Handle user signup
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const bio = document.getElementById('bio').value;
    const location = document.getElementById('location').value;
    const profilePictureInput = document.getElementById('profilePicture');
    
    // Check if user already exists
    const users = getStorageData('visualbook_users');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        alert('User with this email already exists. Please log in.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name,
        email,
        password, // In a real app, this should be hashed
        bio,
        location,
        profilePicture: 'images/default-avatar.png', // Default avatar
        friends: [],
        friendRequests: [],
        createdAt: new Date().toISOString()
    };
    
    // Handle profile picture upload if provided
    if (profilePictureInput.files.length > 0) {
        const file = profilePictureInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            newUser.profilePicture = e.target.result;
            completeSignup(newUser);
        };
        
        reader.readAsDataURL(file);
    } else {
        completeSignup(newUser);
    }
}

// Complete the signup process
function completeSignup(user) {
    const users = getStorageData('visualbook_users');
    users.push(user);
    saveStorageData('visualbook_users', users);
    
    // Set as current user and redirect
    setCurrentUser(user);
    window.location.href = 'index.html';
}

// Handle user login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = getStorageData('visualbook_users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Handle user logout
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        clearCurrentUser();
        window.location.href = 'login.html';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});