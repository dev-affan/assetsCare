document.addEventListener("DOMContentLoaded", () => {
    // Initializing high grade baseline structural mock records inside LocalStorage if absent
    if (!localStorage.getItem('campusSchedulesMaster')) {
        const seedSchedules = [
            { id: "SCH-901", assetName: "Backup Generator Alpha", assetCode: "AST-2026-001", type: "Full Oil & Filter Replacement", technician: "Bilal Raza", date: "2026-07-15", priority: "High", status: "Upcoming" },
            { id: "SCH-902", assetName: "Classroom Projector 04", assetCode: "AST-2026-004", type: "Lens Dusting & Calibration", technician: "Asif Ali", date: "2026-07-12", priority: "Medium", status: "In Progress" },
            { id: "SCH-903", assetName: "Server Room HVAC Unit", assetCode: "AST-2026-009", type: "Coolant Refill & Coil Polish", technician: "Sajid Khan", date: "2026-07-01", priority: "High", status: "Overdue" }
        ];
        localStorage.setItem('campusSchedulesMaster', JSON.stringify(seedSchedules));
    }

    calculateAndRenderSchedulesPage();

    const openModalBtn = document.getElementById('btn-trigger-schedule-modal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => toggleScheduleModal(true));
    }
});

function toggleScheduleModal(show) {
    const modal = document.getElementById('schedule-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function handleScheduleRegistration(event) {
    event.preventDefault();

    const assetName = document.getElementById('sch-asset-name').value.trim();
    const assetCode = document.getElementById('sch-asset-code').value.trim();
    const type = document.getElementById('sch-type').value.trim();
    const technician = document.getElementById('sch-technician').value.trim();
    const date = document.getElementById('sch-date').value;
    const priority = document.getElementById('sch-priority').value;
    const status = document.getElementById('sch-status').value;

    let currentSchedules = JSON.parse(localStorage.getItem('campusSchedulesMaster')) || [];
    const nextId = `SCH-${String(1000 + currentSchedules.length + 1).substring(1)}`;

    const newSchedule = {
        id: nextId,
        assetName,
        assetCode,
        type,
        technician,
        date,
        priority,
        status
    };

    currentSchedules.unshift(newSchedule);
    localStorage.setItem('campusSchedulesMaster', JSON.stringify(currentSchedules));

    document.getElementById('schedule-submission-form').reset();
    toggleScheduleModal(false);
    calculateAndRenderSchedulesPage();
}

function calculateAndRenderSchedulesPage(filteredArray = null) {
    const masterList = JSON.parse(localStorage.getItem('campusSchedulesMaster')) || [];
    const sourceArray = filteredArray !== null ? filteredArray : masterList;

    // Counter rendering updating
    document.getElementById('directory-schedules-counter').innerText = `${sourceArray.length} maintenance tracks`;

    const gridHolder = document.getElementById('dynamic-cards-grid-holder');
    const emptyState = document.getElementById('schedule-empty-state');

    gridHolder.innerHTML = "";

    if (sourceArray.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    sourceArray.forEach(item => {
        // Status Badges & Accent Lines Setup Matching Specifications
        let statusPillClass = 'pill-upcoming';
        let accentModifier = 'card-accent-upcoming';

        if (item.status === 'In Progress') {
            statusPillClass = 'pill-progress';
            accentModifier = 'card-accent-progress';
        } else if (item.status === 'Overdue') {
            statusPillClass = 'pill-overdue';
            accentModifier = 'card-accent-overdue';
        }

        // Clean Date formatting for visual excellence
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const parsedDate = new Date(item.date);
        const displayDate = isNaN(parsedDate) ? item.date : parsedDate.toLocaleDateString('en-US', dateOptions);

        const cardHTML = `
            <div class="schedule-item-card ${accentModifier}">
                <div class="card-top-identity-row">
                    <div class="card-title-area">
                        <h4>${item.assetName}</h4>
                        <span class="card-asset-tag">${item.assetCode}</span>
                    </div>
                    <span class="badge-status-pill ${statusPillClass}">${item.status}</span>
                </div>
                
                <div class="card-metadata-list">
                    <div class="meta-bullet-item">
                        <span class="lbl">• Maintenance Type:</span>
                        <span class="val">${item.type}</span>
                    </div>
                    <div class="meta-bullet-item">
                        <span class="lbl">• Technician:</span>
                        <span class="val">${item.technician}</span>
                    </div>
                    <div class="meta-bullet-item">
                        <span class="lbl">• Scheduled Date:</span>
                        <span class="val">${displayDate}</span>
                    </div>
                    <div class="meta-bullet-item">
                        <span class="lbl">• Track Priority:</span>
                        <span class="val" style="font-weight:700; color:${item.priority === 'High' ? '#ef4444' : '#64748b'}">${item.priority}</span>
                    </div>
                </div>

                <div class="card-actions-footer">
                    <button class="btn-card-edit">Edit Schedule</button>
                    <button class="btn-card-complete" ${item.status === 'Completed' ? 'disabled' : ''} onclick="markScheduleAsDoneDirect('${item.id}')">Mark Completed</button>
                </div>
            </div>
        `;
        gridHolder.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function markScheduleAsDoneDirect(scheduleId) {
    let masterList = JSON.parse(localStorage.getItem('campusSchedulesMaster')) || [];
    masterList = masterList.map(sch => {
        if (sch.id === scheduleId) {
            sch.status = "Completed";
        }
        return sch;
    });
    // Optional filter out/removal can also be applied based on system workflow preferences
    localStorage.setItem('campusSchedulesMaster', JSON.stringify(masterList));
    calculateAndRenderSchedulesPage();
}

function applyLiveScheduleFilters() {
    const masterList = JSON.parse(localStorage.getItem('campusSchedulesMaster')) || [];
    const searchQuery = document.getElementById('schedule-search-input').value.toLowerCase().trim();
    const targetPriority = document.getElementById('filter-priority-select').value;
    const targetStatus = document.getElementById('filter-status-select').value;
    const targetType = document.getElementById('filter-type-select').value;

    const filteredResults = masterList.filter(item => {
        const matchesSearch = item.assetName.toLowerCase().includes(searchQuery) ||
            item.technician.toLowerCase().includes(searchQuery) ||
            item.assetCode.toLowerCase().includes(searchQuery);
        const matchesPriority = (targetPriority === 'ALL') || (item.priority === targetPriority);
        const matchesStatus = (targetStatus === 'ALL') || (item.status === targetStatus);
        const matchesType = (targetType === 'ALL') || (item.assetName.includes(targetType) || item.type.includes(targetType));

        return matchesSearch && matchesPriority && matchesStatus && matchesType;
    });

    calculateAndRenderSchedulesPage(filteredResults);
}

function clearScheduleFiltersEngine() {
    document.getElementById('schedule-search-input').value = "";
    document.getElementById('filter-priority-select').value = "ALL";
    document.getElementById('filter-status-select').value = "ALL";
    document.getElementById('filter-type-select').value = "ALL";
    calculateAndRenderSchedulesPage();
}