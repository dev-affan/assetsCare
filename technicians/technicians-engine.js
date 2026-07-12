document.addEventListener("DOMContentLoaded", () => {
    // Exact screenshot structural design seed mock mapping inside LocalStorage if not already present
    if (!localStorage.getItem('techniciansMasterList')) {
        const defaultTechnicians = [
            {
                id: "TCH-01",
                name: "Ahmed Raza",
                role: "Senior Maintenance Technician",
                initials: "AR",
                status: "Operational",
                dueToday: 0,
                completedCount: 2,
                assignments: [
                    { id: "ISS-2026-0045", title: "Hot water tap leaking", status: "Assigned" },
                    { id: "ISS-2026-0046", title: "Visitor check-in software freezing", status: "Completed" }
                ]
            },
            {
                id: "TCH-02",
                name: "Bilal Khan",
                role: "Mechanical Technician",
                initials: "BK",
                status: "Operational",
                dueToday: 1,
                completedCount: 1,
                assignments: [
                    { id: "ISS-2026-0042", title: "Generator fails to hold load", status: "Assigned" },
                    { id: "ISS-2026-0048", title: "Fuel level sensor fault", status: "Assigned" }
                ]
            },
            {
                id: "TCH-03",
                name: "Sara Ali",
                role: "Electrical Technician",
                initials: "SA",
                status: "Operational",
                dueToday: 0,
                completedCount: 1,
                assignments: [
                    { id: "ISS-2026-0041", title: "AC not cooling after 2 PM", status: "Assigned" },
                    { id: "ISS-2026-0044", title: "Inverter battery sync alarms", status: "Assigned" }
                ]
            }
        ];
        localStorage.setItem('techniciansMasterList', JSON.stringify(defaultTechnicians));
    }

    renderTechniciansDashboard();

    // Attach trigger modal action listener click
    const assignBtn = document.getElementById('btn-trigger-assign-modal');
    if (assignBtn) {
        assignBtn.addEventListener('click', () => toggleAssignModal(true));
    }
});

function toggleAssignModal(show) {
    const modal = document.getElementById('assign-tech-modal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            populateTechniciansDropdownOptions();
        }
    }
}

// Loads dynamic options from current localstorage into select form item
function populateTechniciansDropdownOptions() {
    const techData = JSON.parse(localStorage.getItem('techniciansMasterList')) || [];
    const dropdown = document.getElementById('modal-select-tech');
    if (dropdown) {
        dropdown.innerHTML = techData.map(tech =>
            `<option value="${tech.id}">${tech.name} (${tech.role})</option>`
        ).join('');
    }
}

function handleNewTargetSubmission(event) {
    event.preventDefault();

    const selectedTechId = document.getElementById('modal-select-tech').value;
    const issueId = document.getElementById('modal-issue-id').value.trim();
    const issueTitle = document.getElementById('modal-issue-title').value.trim();
    const status = document.getElementById('modal-issue-status').value;
    const isDueToday = document.getElementById('modal-is-due').value;

    let techData = JSON.parse(localStorage.getItem('techniciansMasterList')) || [];

    // Map through array matching specified item
    techData = techData.map(tech => {
        if (tech.id === selectedTechId) {
            // Push sub ticket assignment item loop
            tech.assignments.push({
                id: issueId,
                title: issueTitle,
                status: status
            });

            // Recalculate metrics increments based on form options 
            if (status === 'Completed') {
                tech.completedCount += 1;
            }
            if (isDueToday === 'Yes') {
                tech.dueToday += 1;
            }
        }
        return tech;
    });

    localStorage.setItem('techniciansMasterList', JSON.stringify(techData));
    document.getElementById('tech-assignment-form').reset();
    toggleAssignModal(false);
    renderTechniciansDashboard();
}

function renderTechniciansDashboard(filteredData = null) {
    const masterData = JSON.parse(localStorage.getItem('techniciansMasterList')) || [];
    const targetSource = filteredData !== null ? filteredData : masterData;

    // Counter synchronization
    document.getElementById('directory-tech-counter').innerText = `${targetSource.length} technicians active`;

    const holder = document.getElementById('dynamic-technician-cards-holder');
    holder.innerHTML = "";

    targetSource.forEach(tech => {
        const assignedCount = tech.assignments.filter(a => a.status === 'Assigned').length;

        // Accumulate card template
        let cardHTML = `
            <div class="tech-profile-card">
                <div class="tech-card-header">
                    <div class="tech-avatar-meta-group">
                        <div class="tech-circular-initials-avatar">${tech.initials}</div>
                        <div class="tech-name-titles">
                            <h4>${tech.name}</h4>
                            <span>${tech.role}</span>
                        </div>
                    </div>
                    <div class="tech-operational-status-badge">
                        <span class="status-dot-indicator"></span>
                        ${tech.status}
                    </div>
                </div>

                <div class="tech-counters-strip-row">
                    <div class="counter-metric-item">
                        <h5>${assignedCount}</h5>
                        <span>Assigned</span>
                    </div>
                    <div class="counter-metric-item">
                        <h5 class="${tech.dueToday > 0 ? 'due-alert-color' : ''}">${tech.dueToday}</h5>
                        <span>Due Today</span>
                    </div>
                    <div class="counter-metric-item">
                        <h5>${tech.completedCount}</h5>
                        <span>Completed</span>
                    </div>
                </div>

                <div class="tech-assignments-container-box">
                    <h5 class="active-assignments-section-title">Active Assignments</h5>
                    <div class="tech-inner-assignments-list">
        `;

        // Loop internal sub items directly to map specific bullet structures
        tech.assignments.forEach(assign => {
            const isCompleted = assign.status === 'Completed';
            const pillClass = isCompleted ? 'tech-pill-completed' : 'tech-pill-assigned';

            cardHTML += `
                <div class="inner-ticket-item-row">
                    <div class="ticket-text-side">
                        <strong>${assign.id}</strong>
                        <p style="${isCompleted ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${assign.title}</p>
                    </div>
                    <span class="ticket-status-pill ${pillClass}">${assign.status}</span>
                </div>
            `;
        });

        if (tech.assignments.length === 0) {
            cardHTML += `<p style="font-size: 0.8rem; color: #94a3b8; font-style: italic; padding: 4px 0;">No tracks registered.</p>`;
        }

        cardHTML += `
                    </div>
                </div>
            </div>
        `;

        holder.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Live search method to allow fast typing evaluation directly over user objects
function liveSearchTechnicians() {
    const query = document.getElementById('global-tech-search').value.toLowerCase().trim();
    const masterData = JSON.parse(localStorage.getItem('techniciansMasterList')) || [];

    const filtered = masterData.filter(tech =>
        tech.name.toLowerCase().includes(query) ||
        tech.role.toLowerCase().includes(query) ||
        tech.assignments.some(a => a.id.toLowerCase().includes(query) || a.title.toLowerCase().includes(query))
    );

    renderTechniciansDashboard(filtered);
}