document.addEventListener("DOMContentLoaded", () => {
    // Screenshot Seed Mock Data initialization if empty inside LocalStorage
    if (!localStorage.getItem('notificationsMasterList')) {
        const defaultNotifications = [
            {
                id: "NOT-001",
                title: "New issue reported for Main Office AC 03",
                description: "High-priority performance issue is in progress and needs status follow-up.",
                timestamp: "Jul 10, 2026, 3:10 PM",
                type: "Reported",
                isRead: false,
                link: "issues.html"
            },
            {
                id: "NOT-002",
                title: "Critical issue assigned to you",
                description: "Generator fuel level sensor fault was assigned to Bilal Khan.",
                timestamp: "Jul 10, 2026, 4:40 PM",
                type: "Reported",
                isRead: false,
                link: "technicians.html"
            },
            {
                id: "NOT-003",
                title: "Generator maintenance is overdue",
                description: "Emergency repair for Backup Generator is now overdue and still blocked by parts.",
                timestamp: "Jul 10, 2026, 7:05 AM",
                type: "Reported",
                isRead: false,
                link: "schedule.html"
            },
            {
                id: "NOT-004",
                title: "Technician Ahmed resolved Issue ISS-2026-0040",
                description: "Safety inspection work on Fire Extinguisher Block A was completed successfully.",
                timestamp: "Jun 29, 2026, 11:08 AM",
                type: "Reported",
                isRead: true,
                link: "issues.html"
            }
        ];
        localStorage.setItem('notificationsMasterList', JSON.stringify(defaultNotifications));
    }

    renderNotificationsDashboard();
});

function renderNotificationsDashboard(filteredData = null) {
    const masterData = JSON.parse(localStorage.getItem('notificationsMasterList')) || [];
    const sourceData = filteredData !== null ? filteredData : masterData;

    const holder = document.getElementById('dynamic-notifications-holder');
    holder.innerHTML = "";

    let unreadCount = 0;

    sourceData.forEach(notify => {
        if (!notify.isRead) unreadCount++;

        const cardClass = notify.isRead ? "notification-card" : "notification-card unread";
        const readButtonHTML = !notify.isRead
            ? `<button class="btn-mark-read" onclick="markAsRead('${notify.id}')">Mark read</button>`
            : `<span style="font-size:0.8rem; color:#94a3b8; margin-right:8px;">✓ Read</span>`;

        const cardHTML = `
            <div class="notification-card ${cardClass}">
                <div class="notify-content-side">
                    <div class="notify-title-row">
                        <h4>${notify.title}</h4>
                        <span class="status-pill-reported">${notify.type}</span>
                    </div>
                    <p>${notify.description}</p>
                    <span class="notify-timestamp">${notify.timestamp}</span>
                </div>
                <div class="notify-actions-side">
                    ${readButtonHTML}
                    <button class="btn-open-related" onclick="window.location.href='${notify.link}'">Open related</button>
                </div>
            </div>
        `;
        holder.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Top Navbar Badge Dot Controller
    const bellDot = document.getElementById('nav-bell-dot');
    if (bellDot) {
        bellDot.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function markAsRead(id) {
    let masterData = JSON.parse(localStorage.getItem('notificationsMasterList')) || [];
    masterData = masterData.map(n => {
        if (n.id === id) n.isRead = true;
        return n;
    });
    localStorage.setItem('notificationsMasterList', JSON.stringify(masterData));
    renderNotificationsDashboard();
}

function markAllNotificationsAsRead() {
    let masterData = JSON.parse(localStorage.getItem('notificationsMasterList')) || [];
    masterData = masterData.map(n => {
        n.isRead = true;
        return n;
    });
    localStorage.setItem('notificationsMasterList', JSON.stringify(masterData));
    renderNotificationsDashboard();
}

function liveSearchNotifications() {
    const query = document.getElementById('global-notify-search').value.toLowerCase().trim();
    const masterData = JSON.parse(localStorage.getItem('notificationsMasterList')) || [];

    const filtered = masterData.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query)
    );
    renderNotificationsDashboard(filtered);
}

/* 
  HELPFUL DEVELOPMENT TIP:
  Aap apne baaki files (issues.html / technicians.html) mein jab bhi koi action process karein, 
  toh background mein yeh helper function call kar sakte hain taaki live notification add ho:

  function generateSystemNotification(title, desc, pageLink) {
      let current = JSON.parse(localStorage.getItem('notificationsMasterList')) || [];
      current.unshift({
          id: "NOT-" + Date.now(),
          title: title,
          description: desc,
          timestamp: new Date().toLocaleString(),
          type: "Reported",
          isRead: false,
          link: pageLink
      });
      localStorage.setItem('notificationsMasterList', JSON.stringify(current));
  }
*/