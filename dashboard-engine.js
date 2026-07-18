document.addEventListener("DOMContentLoaded", () => {
    const sessionToken = enforceDashboardRouteSecurity();
    if (!sessionToken) return; // redirected

    calculateAndRenderSaaSMetrics();

    // Attach click event to the "+ Register New Asset" button
    const registerBtn = document.getElementById('btn-register-asset');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => toggleAssetModal(true));
    }

    // Role-based UI setup
    setupRoleBasedUI(sessionToken);
});

function enforceDashboardRouteSecurity() {
    const sessionToken = JSON.parse(localStorage.getItem('activeSessionUser'));
    if (!sessionToken || !sessionToken.isLoggedIn) {
        window.location.href = 'Login/login.html';
        return null;
    }
    
    const userNameElem = document.getElementById('session-username');
    if (userNameElem) userNameElem.innerText = `${sessionToken.firstName} ${sessionToken.lastName}`;
    
    const roleElem = document.getElementById('session-role');
    if (roleElem) roleElem.innerText = sessionToken.userRole;
    
    const headerViewRole = document.getElementById('header-view-role');
    if (headerViewRole) headerViewRole.innerText = `${sessionToken.userRole} view`;
    
    const roleMenu = document.getElementById('role-context-menu');
    if (roleMenu) roleMenu.innerText = `${sessionToken.userRole.substring(0, 5)} Menu`;

    const initialsElem = document.getElementById('user-avatar-initials');
    if (initialsElem) {
        initialsElem.innerText = (sessionToken.firstName[0] + sessionToken.lastName[0]).toUpperCase();
    }
    
    return sessionToken;
}

// Open/Close Modal Handler
function toggleAssetModal(show) {
    const modal = document.getElementById('asset-modal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

// NEW ASSET SUBMISSION AND STORAGE ENGINE
function handleAssetRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('asset-name').value.trim();
    const category = document.getElementById('asset-category').value;
    const status = document.getElementById('asset-status').value;

    // Fetch existing assets arrays or define default fallback seed array
    let currentAssets = JSON.parse(localStorage.getItem('assetsDataMaster')) || [
        { name: "Backup Generator", category: "Machinery", status: "Operational" },
        { name: "Water Dispenser", category: "Appliances", status: "Under Maintenance" },
        { name: "Reception Laptop", category: "Electronics", status: "Operational" },
        { name: "IT Lab Printer 02", category: "Electronics", status: "Operational" },
        { name: "Main Office AC 03", category: "Appliances", status: "Under Maintenance" },
        { name: "Fire Extinguisher", category: "Safety", status: "Operational" }
    ];

    // Add new asset record object
    const newAsset = { name, category, status, timestamp: new Date().toLocaleString() };
    currentAssets.push(newAsset);

    // Commit changes back to LocalStorage database
    localStorage.setItem('assetsDataMaster', JSON.stringify(currentAssets));

    alert(`🎉 Success! "${name}" has been registered into the LocalStorage database.`);

    // Reset form, close popup modal and recalculate dashboard indicators instantly
    document.getElementById('asset-registration-form').reset();
    toggleAssetModal(false);
    calculateAndRenderSaaSMetrics();
}

// METRICS RE-CALCULATOR ENGINE
function calculateAndRenderSaaSMetrics() {
    const defaultAssets = [
        { name: "Backup Generator", category: "Machinery", status: "Operational" },
        { name: "Water Dispenser", category: "Appliances", status: "Under Maintenance" },
        { name: "Reception Laptop", category: "Electronics", status: "Operational" },
        { name: "IT Lab Printer 02", category: "Electronics", status: "Operational" },
        { name: "Main Office AC 03", category: "Appliances", status: "Under Maintenance" },
        { name: "Fire Extinguisher", category: "Safety", status: "Operational" }
    ];

    const currentAssetsList = JSON.parse(localStorage.getItem('assetsDataMaster'));

    // If no data exists yet, set default seed array in LocalStorage
    if (!currentAssetsList) {
        localStorage.setItem('assetsDataMaster', JSON.stringify(defaultAssets));
    }

    const finalAssetsArray = currentAssetsList || defaultAssets;

    // Calculate direct dynamic array components lengths
    const totalAssetsCount = finalAssetsArray.length;
    const operationalAssetsCount = finalAssetsArray.filter(a => a.status === 'Operational').length;
    const maintenanceAssetsCount = finalAssetsArray.filter(a => a.status === 'Under Maintenance' || a.status === 'Under Inspection').length;

    // Dynamically bind numbers onto the DOM cards counters
    document.getElementById('count-total-assets').innerText = totalAssetsCount;
    document.getElementById('count-operational-assets').innerText = operationalAssetsCount;
    document.getElementById('count-maintenance-assets').innerText = maintenanceAssetsCount;
}

function setupRoleBasedUI(sessionToken) {
    const currentRole = sessionToken.userRole.toLowerCase();
    const userName = `${sessionToken.firstName} ${sessionToken.lastName}`;

    document.body.className = ''; // reset classes
    document.body.classList.add(`role-${currentRole}`);

    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarRoleSubtitle = document.querySelector('.profile-text span');

    if (sidebarName && sidebarAvatar) {
        sidebarName.innerText = userName;
        sidebarAvatar.innerText = userName.split(" ").map(n => n[0]).join("").toUpperCase();

        if (currentRole === 'technician') {
            if (sidebarRoleSubtitle) sidebarRoleSubtitle.innerText = "Senior Maintenance Technician";
            const topBadge = document.querySelector('.admin-menu-badge');
            if (topBadge) topBadge.innerText = "Tech Menu";
        } else {
            if (sidebarRoleSubtitle) sidebarRoleSubtitle.innerText = "Administrator";
        }
    }

    const roleLabel = document.getElementById('dashboard-role-lbl');
    const mainTitle = document.getElementById('dashboard-main-title');
    const descText = document.getElementById('dashboard-desc-text');

    if (currentRole === 'technician') {
        if (roleLabel) roleLabel.innerText = "ASSETCARE WORKSPACE";
        if (mainTitle) mainTitle.innerText = "Technician Dashboard";
        if (descText) descText.innerText = "Focus on your assigned work, due schedules, and active maintenance tasks.";
    } else {
        if (roleLabel) roleLabel.innerText = "ASSETCARE WORKSPACE";
        if (mainTitle) mainTitle.innerText = "Administrator Dashboard";
        if (descText) descText.innerText = "Overview of campus assets, reported infrastructure issues, and active logs.";
    }
}
