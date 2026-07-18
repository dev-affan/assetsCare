// 1. Static/Hardcoded Defaults Array with Name components
const defaultUsers = {
    "admin@assetcare.demo": { firstName: "Demo", lastName: "Admin", password: "admin123", role: "Administrator" },
    "technician@assetcare.demo": { firstName: "Demo", lastName: "Tech", password: "tech123", role: "Technician" }
};

// LocalStorage database check
if (!localStorage.getItem('usersDatabase')) {
    localStorage.setItem('usersDatabase', JSON.stringify(defaultUsers));
}

// 2. Form Section Toggle
function toggleAuthForm(target) {
    if (target === 'signup') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('signup-section').style.display = 'block';
    } else {
        document.getElementById('signup-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    }
}

// 3. Quick-fill helper for demo profiles
function autoFillCredentials(email, password) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
}

// 4. SIGNUP EXECUTION (Stores First Name & Last Name separately)
function executeLocalStorageSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;

    let db = JSON.parse(localStorage.getItem('usersDatabase'));

    // Check if user already exists
    if (db[email]) {
        alert("⚠️ This email is already registered! Please use a different email or login.");
        return;
    }

    // Save individual object components to LocalStorage
    db[email] = { firstName, lastName, password, role };
    localStorage.setItem('usersDatabase', JSON.stringify(db));

    alert(`🎉 Account created successfully for ${firstName} ${lastName}! Shifting to Sign In flow.`);

    // Autofill email in login form and switch view
    document.getElementById('login-email').value = email;
    toggleAuthForm('login');
}

// 5. LOGIN EXECUTION (Validates using just Email and Password)
function executeLocalStorageLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    let db = JSON.parse(localStorage.getItem('usersDatabase'));
    const userProfile = db[email];

    if (userProfile && userProfile.password === password) {
        // Create full authenticated session token
        const sessionToken = {
            isLoggedIn: true,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            userEmail: email,
            userRole: userProfile.role, // "Administrator" or "Technician"
            loginTimestamp: new Date().toLocaleString()
        };

        localStorage.setItem('activeSessionUser', JSON.stringify(sessionToken));

        // Redirects to Dashboard layout
        window.location.href = '../index.html';
    } else {
        alert("❌ Invalid Email or Password! Please try again.");
    }
}

// Jab user "Use admin account" par click kare
function loginAsAdmin() {
    const sessionToken = {
        isLoggedIn: true,
        firstName: "Demo",
        lastName: "Admin",
        userEmail: "admin@assetcare.demo",
        userRole: "Administrator",
        loginTimestamp: new Date().toLocaleString()
    };
    localStorage.setItem('activeSessionUser', JSON.stringify(sessionToken));
    window.location.href = '../index.html'; // Main Dashboard par bhejein
}

// Jab user "Use technician account" par click kare
function loginAsTechnician() {
    const sessionToken = {
        isLoggedIn: true,
        firstName: "Demo",
        lastName: "Tech",
        userEmail: "technician@assetcare.demo",
        userRole: "Technician",
        loginTimestamp: new Date().toLocaleString()
    };
    localStorage.setItem('activeSessionUser', JSON.stringify(sessionToken));
    window.location.href = '../index.html'; // Same index.html par bhejein, baaki kaam wahan handle hoga
}