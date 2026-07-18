document.addEventListener("DOMContentLoaded", () => {
    syncProfileInputsFromStorage();
});

function syncProfileInputsFromStorage() {
    const sessionData = JSON.parse(localStorage.getItem('activeSessionUser'));
    if (!sessionData) return;

    // Fill dynamic form input channels
    document.getElementById('setting-full-name').value = `${sessionData.firstName} ${sessionData.lastName}`;
    document.getElementById('setting-email').value = sessionData.userEmail;

    // Synchronize current active layout elements globally
    document.getElementById('sidebar-user-name').innerText = `${sessionData.firstName} ${sessionData.lastName}`;
    const computedInitials = (sessionData.firstName[0] + sessionData.lastName[0]).toUpperCase();
    document.getElementById('sidebar-user-avatar').innerText = computedInitials;
}

// PROFILE RE-CONFIGURATION DISPATCHER
function saveProfileChanges(event) {
    event.preventDefault();

    const newName = document.getElementById('setting-full-name').value.trim();
    const newEmail = document.getElementById('setting-email').value.trim();

    let sessionData = JSON.parse(localStorage.getItem('activeSessionUser'));
    let db = JSON.parse(localStorage.getItem('usersDatabase')) || {};

    // Determine first and last name
    const tokens = newName.split(" ");
    const firstName = tokens[0] || "Demo";
    const lastName = tokens.slice(1).join(" ") || "Admin";

    // Update session
    const oldEmail = sessionData.userEmail;
    sessionData.firstName = firstName;
    sessionData.lastName = lastName;
    sessionData.userEmail = newEmail;
    localStorage.setItem('activeSessionUser', JSON.stringify(sessionData));

    // Update database
    if (db[oldEmail]) {
        db[newEmail] = db[oldEmail];
        db[newEmail].firstName = firstName;
        db[newEmail].lastName = lastName;
        if (oldEmail !== newEmail) {
            delete db[oldEmail];
        }
        localStorage.setItem('usersDatabase', JSON.stringify(db));
    }

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

    let sessionData = JSON.parse(localStorage.getItem('activeSessionUser'));
    let db = JSON.parse(localStorage.getItem('usersDatabase')) || {};
    let userProfile = db[sessionData.userEmail];

    if (!userProfile) {
        alert("Error: User profile not found in database.");
        return;
    }

    // 1. Check current confirmation validation match
    if (currentInput !== userProfile.password) {
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
    userProfile.password = newInput;
    localStorage.setItem('usersDatabase', JSON.stringify(db));

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