document.addEventListener("DOMContentLoaded", () => {
    // Initial dynamic base seed data array inside localStorage for issue models matching real preview specs
    if (!localStorage.getItem('campusIssuesMaster')) {
        const seedIssues = [
            { id: "ISS-001", title: "Engine Overheating", assetCode: "AST-2026-001", priority: "High", status: "Open", category: "Electrical", reportedBy: "Muhammad Affan", assignedTo: "Bilal Raza", date: "Jul 11, 2026" },
            { id: "ISS-002", title: "Display flickering", assetCode: "AST-2026-002", priority: "Medium", status: "In Progress", category: "Hardware", reportedBy: "Muhammad Affan", assignedTo: "Asif Ali", date: "Jul 10, 2026" },
            { id: "ISS-003", title: "Pressure valve leak", assetCode: "AST-2026-003", priority: "High", status: "Open", category: "Plumbing", reportedBy: "Admin Portal", assignedTo: "Unassigned", date: "Jul 12, 2026" },
            { id: "ISS-004", title: "Safety kit expired", assetCode: "AST-2026-004", priority: "Low", status: "Resolved", category: "Safety", reportedBy: "Safety Inspector", assignedTo: "Sajid Khan", date: "Jul 05, 2026" }
        ];
        localStorage.setItem('campusIssuesMaster', JSON.stringify(seedIssues));
    }

    calculateAndRenderIssuesPage();

    const triggerModalBtn = document.getElementById('btn-trigger-issue-modal');
    if (triggerModalBtn) {
        triggerModalBtn.addEventListener('click', () => toggleIssueModal(true));
    }
});

function toggleIssueModal(show) {
    const modal = document.getElementById('issue-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function handleIssueRegistration(event) {
    event.preventDefault();

    const title = document.getElementById('issue-title').value.trim();
    const assetCode = document.getElementById('issue-asset-code').value.trim();
    const priority = document.getElementById('issue-priority').value;
    const category = document.getElementById('issue-category').value;
    const assignedTo = document.getElementById('issue-assignee').value.trim() || "Unassigned";

    let currentIssues = JSON.parse(localStorage.getItem('campusIssuesMaster')) || [];

    // Auto incremental string based index key token signature
    const nextIndexId = `ISS-${String(1000 + currentIssues.length + 1).substring(1)}`;

    const newIssue = {
        id: nextIndexId,
        title,
        assetCode,
        priority,
        status: "Open",
        category,
        reportedBy: "Muhammad Affan", // Default session log identification trigger
        assignedTo,
        date: "Jul 12, 2026"
    };

    currentIssues.unshift(newIssue); // Put fresh entries on top stack allocation
    localStorage.setItem('campusIssuesMaster', JSON.stringify(currentIssues));

    document.getElementById('issue-submission-form').reset();
    toggleIssueModal(false);
    calculateAndRenderIssuesPage();
}

function calculateAndRenderIssuesPage(filteredArray = null) {
    const masterList = JSON.parse(localStorage.getItem('campusIssuesMaster')) || [];
    const sourceArray = filteredArray !== null ? filteredArray : masterList;

    document.getElementById('directory-issues-counter').innerText = `${sourceArray.length} issues`;

    const listHolder = document.getElementById('dynamic-issues-list-holder');
    const emptyState = document.getElementById('issues-empty-state');

    listHolder.innerHTML = "";

    if (sourceArray.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    sourceArray.forEach((issue) => {
        // Priority Class Matching Postures
        let prioClass = 'prio-medium';
        if (issue.priority === 'High') prioClass = 'prio-high';
        if (issue.priority === 'Low') prioClass = 'prio-low';

        // Status Colors Configuration Engine
        let statusClass = 'stat-open';
        if (issue.status === 'In Progress') statusClass = 'stat-progress';
        if (issue.status === 'Resolved') statusClass = 'stat-resolved';

        // Direct initial token string for avatar extraction safety bubble
        const avatarChars = issue.category ? issue.category.substring(0, 3).toUpperCase() : 'ISS';

        const rowHTML = `
            <div class="issue-list-row-item">
                <div class="col-issue-meta">
                    <div class="issue-avatar-badge">${avatarChars}</div>
                    <div class="asset-text-details">
                        <h5>${issue.title}</h5>
                        <span>${issue.id}</span>
                    </div>
                </div>
                <div class="col-asset-code">${issue.assetCode}</div>
                <div class="col-priority">
                    <span class="badge-priority ${prioClass}">${issue.priority}</span>
                </div>
                <div class="col-status">
                    <span class="badge-status ${statusClass}">${issue.status}</span>
                </div>
                <div class="col-reported-by">${issue.reportedBy}</div>
                <div class="col-assigned-to">${issue.assignedTo}</div>
                <div class="col-date">${issue.date}</div>
                <div class="col-actions">
                    <button class="btn-row-action-open">Open</button>
                    <button class="btn-row-action-resolve" ${issue.status === 'Resolved' ? 'disabled' : ''} onclick="resolveIssueDirect('${issue.id}')">Resolve</button>
                </div>
            </div>
        `;
        listHolder.insertAdjacentHTML('beforeend', rowHTML);
    });
}

function resolveIssueDirect(issueId) {
    let masterList = JSON.parse(localStorage.getItem('campusIssuesMaster')) || [];
    masterList = masterList.map(iss => {
        if (iss.id === issueId) {
            iss.status = "Resolved";
        }
        return iss;
    });
    localStorage.setItem('campusIssuesMaster', JSON.stringify(masterList));
    calculateAndRenderIssuesPage();
}

function applyLiveIssueFilters() {
    const masterList = JSON.parse(localStorage.getItem('campusIssuesMaster')) || [];
    const searchQuery = document.getElementById('issue-search-input').value.toLowerCase().trim();
    const targetPriority = document.getElementById('filter-priority-select').value;
    const targetStatus = document.getElementById('filter-status-select').value;
    const targetCategory = document.getElementById('filter-category-select').value;

    const filteredResults = masterList.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery) ||
            issue.id.toLowerCase().includes(searchQuery) ||
            issue.assetCode.toLowerCase().includes(searchQuery);
        const matchesPriority = (targetPriority === 'ALL') || (issue.priority === targetPriority);
        const matchesStatus = (targetStatus === 'ALL') || (issue.status === targetStatus);
        const matchesCategory = (targetCategory === 'ALL') || (issue.category === targetCategory);

        return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
    });

    calculateAndRenderIssuesPage(filteredResults);
}

function clearIssueFiltersEngine() {
    document.getElementById('issue-search-input').value = "";
    document.getElementById('filter-priority-select').value = "ALL";
    document.getElementById('filter-status-select').value = "ALL";
    document.getElementById('filter-category-select').value = "ALL";
    calculateAndRenderIssuesPage();
}

