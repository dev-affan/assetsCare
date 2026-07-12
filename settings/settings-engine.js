document.addEventListener("DOMContentLoaded", () => {
    // Master Config parameters inside LocalStorage mapping
    if (!localStorage.getItem('appAdminSessionProfile')) {
        const defaultSession = {
            fullName: "Muhammad Affan",
            email: "affan@assetcare.demo",
            passcode: "admin123",
            avatarInitials: "MA"
        };
        localStorage.setItem('appAdminSessionProfile', JSON.stringify(defaultSession));
    }

    syncProfileInputsFromStorage();
});

function syncProfileInputsFromStorage() {
    const sessionData = JSON.parse(localStorage.getItem('appAdminSessionProfile'));

    // Fill dynamic form input channels
    document.getElementById('setting-full-name').value = sessionData.fullName;
    document.getElementById('setting-email').value = sessionData.email;

    // Synchronize current active layout elements globally
    document.getElementById('sidebar-user-name').innerText = sessionData.fullName;
    document.getElementById('sidebar-user-avatar').innerText = sessionData.avatarInitials;
}

// PROFILE RE-CONFIGURATION DISPATCHER
function saveProfileChanges(event) {
    event.preventDefault();

    const newName = document.getElementById('setting-full-name').value.trim();
    const newEmail = document.getElementById('setting-email').value.trim();

    let sessionData = JSON.parse(localStorage.getItem('appAdminSessionProfile'));

    // Create new dynamic avatar initials mapping from incoming text tokens
    const tokens = newName.split(" ");
    let computedInitials = "MA";
    if (tokens.length >= 2) {
        computedInitials = (tokens[0][0] + tokens[1][0]).toUpperCase();
    } else if (tokens.length === 1 && tokens[0].length > 1) {
        computedInitials = (tokens[0][0] + tokens[0][1]).toUpperCase();
    }

    sessionData.fullName = newName;
    sessionData.email = newEmail;
    sessionData.avatarInitials = computedInitials;

    localStorage.setItem('appAdminSessionProfile', JSON.stringify(sessionData));

    // Live UI sync immediately
    syncProfileInputsFromStorage();
    alert("Profile configurations updated successfully!");
}

// SECURITY LOGS PASSWORD CHANGE MANAGEMENT SYSTEM
function handlePasswordUpdate(event) {
    event.preventDefault();

    const currentInput = document.getElementById('setting-curr-password').value;
    const newInput = document.getElementById('setting-new-password').value;
    const confirmInput = document.getElementById('setting-confirm-password').value;

    let sessionData = JSON.parse(localStorage.getItem('appAdminSessionProfile'));

    // 1. Check current confirmation validation match
    if (currentInput !== sessionData.passcode) {
        alert("Error: Incorrect password entered!");
        return;
    }

    // 2. Evaluate target boundary sizing criteria
    if (newInput.length < 6) {
        alert("Error: New password must be at least 6 characters long!");
        return;
    }

    // 3. Confirm target fields matching validation
    if (newInput !== confirmInput) {
        alert("Error: New password entries do not match!");
        return;
    }

    // Commit changes safely to storage vault
    sessionData.passcode = newInput;
    localStorage.setItem('appAdminSessionProfile', JSON.stringify(sessionData));

    document.getElementById('security-change-form').reset();
    alert("Security passcode changed successfully!");
}

// CACHE PURGE PIPELINE
function wipeLocalCacheData() {
    if (confirm("Attention: Pure local storage databases data metrics ko clear karna chahte hain?")) {
        localStorage.clear();
        alert("Cache memory swept successfully! Reloading environment setup.");
        window.location.reload();
    }
}

// SYSTEM DISCONNECT LOGOUT ACTIONS ROUTE
function executeSystemLogout() {
    if (confirm("Confirm account session shutdown?")) {
        alert("Safe tracking system logout processed successfully.");

        // Settings folder se bahar nikal kar Login folder ke andar login.html par bhejna
        window.location.href = '../Login/login.html';
    }
}