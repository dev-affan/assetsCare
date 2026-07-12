document.addEventListener("DOMContentLoaded", () => {
    // Sourcing baseline asset care architecture data frames safely from localstorage entries
    compileLiveOperationalAnalytics();
});

function compileLiveOperationalAnalytics() {
    // Reading data from common tables if filled across workspace runs
    const masterSchedules = JSON.parse(localStorage.getItem('campusSchedulesMaster')) || [
        { assetName: "Backup Generator Alpha", assetCode: "AST-2026-001", type: "Oil Overhaul", status: "Upcoming", priority: "High" },
        { assetName: "Classroom Projector 04", assetCode: "AST-2026-004", type: "Lens Dusting", status: "Completed", priority: "Medium" },
        { assetName: "Server Room HVAC Unit", assetCode: "AST-2026-009", type: "Coolant Refill", status: "Overdue", priority: "High" }
    ];

    const structuralTechnicians = JSON.parse(localStorage.getItem('techniciansMasterList')) || [];

    // Core Metrics Calculations
    const totalAssetsCalculated = 12 + masterSchedules.length; // Base institutional configuration reference
    const activeIssuesCount = masterSchedules.filter(s => s.status === 'Overdue' || s.status === 'In Progress').length;
    const completedTasksCount = masterSchedules.filter(s => s.status === 'Completed').length + 4; // Adding constant historical completions

    // Calculate Real-time System Health Quotient Rate
    const systemHealthQuotient = Math.round(((totalAssetsCalculated - activeIssuesCount) / totalAssetsCalculated) * 100);

    // Apply counters straight into DOM elements
    document.getElementById('stat-total-assets').innerText = totalAssetsCalculated;
    document.getElementById('stat-active-issues').innerText = activeIssuesCount;
    document.getElementById('stat-completed-tasks').innerText = completedTasksCount;
    document.getElementById('stat-health-rate').innerText = `${systemHealthQuotient}%`;

    // Calculate Progress Bar Condition Statistics Distribution Breakdown
    let goodAssetsCount = Math.floor(totalAssetsCalculated * 0.75);
    let repairAssetsCount = activeIssuesCount;
    let criticalAssetsCount = masterSchedules.filter(s => s.priority === 'High' && s.status === 'Overdue').length;

    // Boundary check balancing
    const residual = totalAssetsCalculated - (goodAssetsCount + repairAssetsCount + criticalAssetsCount);
    goodAssetsCount += residual;

    const goodPercentage = Math.round((goodAssetsCount / totalAssetsCalculated) * 100);
    const repairPercentage = Math.round((repairAssetsCount / totalAssetsCalculated) * 100);
    const criticalPercentage = Math.round((criticalAssetsCount / totalAssetsCalculated) * 100);

    // Update Text Data Elements 
    document.getElementById('bar-val-good-text').innerText = `${goodAssetsCount} Assets (${goodPercentage}%)`;
    document.getElementById('bar-val-repair-text').innerText = `${repairAssetsCount} Assets (${repairPercentage}%)`;
    document.getElementById('bar-val-critical-text').innerText = `${criticalAssetsCount} Assets (${criticalPercentage}%)`;

    // Animate CSS Fill Bars Graphically
    document.getElementById('bar-fill-good').style.width = `${goodPercentage}%`;
    document.getElementById('bar-fill-repair').style.width = `${repairPercentage}%`;
    document.getElementById('bar-fill-critical').style.width = `${criticalPercentage}%`;

    // Render Recent Trends Log stream list dynamically
    const logsHolder = document.getElementById('analytics-logs-holder');
    logsHolder.innerHTML = "";

    masterSchedules.slice(0, 4).forEach(item => {
        let statusColor = "#64748b";
        let statusBackground = "#f1f5f9";

        if (item.status === 'Upcoming') { statusColor = "#10b981"; statusBackground = "#e8fbf2"; }
        else if (item.status === 'Overdue') { statusColor = "#ef4444"; statusBackground = "#fff1f2"; }
        else if (item.status === 'Completed') { statusColor = "#3b82f6"; statusBackground = "#eff6ff"; }

        const rowHTML = `
            <div class="log-row-item">
                <div class="log-info-meta-side">
                    <strong>${item.assetName} (${item.assetCode})</strong>
                    <span>Action: ${item.type} • Priority Level: ${item.priority}</span>
                </div>
                <span class="log-status-badge" style="color: ${statusColor}; background: ${statusBackground};">${item.status}</span>
            </div>
        `;
        logsHolder.insertAdjacentHTML('beforeend', rowHTML);
    });
}

function triggerMockExport() {
    alert("AssetCare Report System Engaged! Preparing spreadsheet compile download for SMIT Technology Campus logs...");
}