document.addEventListener("DOMContentLoaded", () => {
    // Correct Mock Initial Data Structure to map statuses cleanly matching real screenshot parameters
    if (!localStorage.getItem('assetsDataMaster')) {
        const seedData = [
            { name: "Backup Generator", category: "Generator", location: "Server Room", condition: "Poor", status: "Under Maintenance", timestamp: "Mar 20, 2026", nextService: "Jun 25, 2026", issues: 2, avatar: "GEN" },
            { name: "Classroom Projector 01", category: "Projector", location: "Classroom Block A", condition: "Good", status: "Operational", timestamp: "Jun 12, 2026", nextService: "Aug 5, 2026", issues: 0, avatar: "PRJ" },
            { name: "Fire Extinguisher Block A", category: "Safety Equipment", location: "Classroom Block A", condition: "Excellent", status: "Operational", timestamp: "Apr 12, 2026", nextService: "Jul 12, 2026", issues: 1, avatar: "SAFE" },
            { name: "IT Lab Printer 02", category: "Printer", location: "IT Lab", condition: "Good", status: "Under Inspection", timestamp: "Jun 21, 2026", nextService: "Sep 21, 2026", issues: 1, avatar: "PRN" }
        ];
        localStorage.setItem('assetsDataMaster', JSON.stringify(seedData));
    }

    calculateAndRenderAssetsPage();

    const registerBtn = document.getElementById('btn-register-asset');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => toggleAssetModal(true));
    }
});

function toggleAssetModal(show) {
    const modal = document.getElementById('asset-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function handleAssetRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('asset-name').value.trim();
    const category = document.getElementById('asset-category').value;
    const location = document.getElementById('asset-location').value;
    const condition = document.getElementById('asset-condition').value;
    const status = document.getElementById('asset-status').value;

    let currentAssets = JSON.parse(localStorage.getItem('assetsDataMaster')) || [];
    const avatarText = name.substring(0, 3).toUpperCase();

    const newAsset = {
        name,
        category,
        location,
        condition,
        status,
        timestamp: "Jul 12, 2026",
        nextService: "Oct 12, 2026",
        issues: 0,
        avatar: avatarText
    };
    currentAssets.push(newAsset);

    localStorage.setItem('assetsDataMaster', JSON.stringify(currentAssets));

    document.getElementById('asset-registration-form').reset();
    toggleAssetModal(false);
    calculateAndRenderAssetsPage();
}

function calculateAndRenderAssetsPage(filteredArray = null) {
    const masterList = JSON.parse(localStorage.getItem('assetsDataMaster')) || [];
    const sourceArray = filteredArray !== null ? filteredArray : masterList;

    document.getElementById('directory-assets-counter').innerText = `${sourceArray.length} assets`;

    const listHolder = document.getElementById('dynamic-assets-list-holder');
    const emptyState = document.getElementById('table-empty-state');

    listHolder.innerHTML = "";

    if (sourceArray.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    sourceArray.forEach((asset, index) => {
        const formattedCode = `AST-2026-${String(1000 + index).substring(1)}`;

        // Strict mapping conditions for accurate state classes matching mockup specs
        let statusClass = 'stat-operational';
        let currentStatusText = asset.status || 'Operational';

        if (currentStatusText === 'Out of Service' || currentStatusText === 'Under Maintenance') {
            statusClass = 'stat-outofservice';
        } else if (currentStatusText === 'Issue Reported' || currentStatusText === 'Under Inspection') {
            statusClass = 'stat-reported';
        } else {
            statusClass = 'stat-operational';
        }

        let conditionClass = 'cond-good';
        let currentConditionText = asset.condition || 'Good';
        if (currentConditionText === 'Excellent') conditionClass = 'cond-excellent';
        if (currentConditionText === 'Poor') conditionClass = 'cond-poor';

        // Strict fallback system ensuring no "undefined" labels escape into template strings
        const openIssuesCount = (asset.issues !== undefined && asset.issues !== null) ? asset.issues : 0;
        const lastServiceDate = asset.timestamp || 'Jul 12, 2026';
        const nextServiceDate = asset.nextService || 'Oct 12, 2026';
        const avatarLabel = asset.avatar || (asset.name ? asset.name.substring(0, 3).toUpperCase() : 'AST');

        const rowHTML = `
            <div class="asset-list-row-item">
                <div class="col-asset-meta">
                    <div class="asset-avatar-badge">${avatarLabel}</div>
                    <div class="asset-text-details">
                        <h5>${asset.name}</h5>
                        <span>${formattedCode}</span>
                    </div>
                </div>
                <div class="col-category">${asset.category || 'General'}</div>
                <div class="col-location">${asset.location || 'Main Campus'}</div>
                <div class="col-condition">
                    <span class="badge-condition ${conditionClass}">${currentConditionText}</span>
                </div>
                <div class="col-status">
                    <span class="badge-status ${statusClass}">${currentStatusText}</span>
                </div>
                <div class="col-service">${lastServiceDate}</div>
                <div class="col-service">${nextServiceDate}</div>
                <div class="col-issues">${openIssuesCount}</div>
                <div class="col-actions">
                    <button class="btn-row-action-open">Open</button>
                    <button class="btn-row-action-qr">QR</button>
                </div>
            </div>
        `;
        listHolder.insertAdjacentHTML('beforeend', rowHTML);
    });
}

function applyLiveAssetFilters() {
    const masterList = JSON.parse(localStorage.getItem('assetsDataMaster')) || [];
    const searchQuery = document.getElementById('asset-table-search').value.toLowerCase().trim();
    const targetCategory = document.getElementById('filter-category-select').value;
    const targetStatus = document.getElementById('filter-status-select').value;
    const targetLocation = document.getElementById('filter-location-select').value;

    const filteredResults = masterList.filter((asset, index) => {
        const code = `AST-2026-${String(1000 + index).substring(1)}`.toLowerCase();
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery) || code.includes(searchQuery) || asset.location.toLowerCase().includes(searchQuery);
        const matchesCategory = (targetCategory === 'ALL') || (asset.category === targetCategory);
        const matchesStatus = (targetStatus === 'ALL') || (asset.status === targetStatus);
        const matchesLocation = (targetLocation === 'ALL') || (asset.location === targetLocation);

        return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });

    calculateAndRenderAssetsPage(filteredResults);
}

function clearAllFiltersEngine() {
    document.getElementById('asset-table-search').value = "";
    document.getElementById('filter-category-select').value = "ALL";
    document.getElementById('filter-status-select').value = "ALL";
    document.getElementById('filter-location-select').value = "ALL";
    calculateAndRenderAssetsPage();
}

function triggerSessionLogout() {
    localStorage.removeItem('activeSessionUser');
    window.location.href = 'Login/login.html';
}