// Global session logout function attached to window for inline onclick handlers
window.triggerSessionLogout = function() {
    if (confirm("Are you sure you want to securely log out of AssetCare workspace?")) {
        localStorage.removeItem('activeSessionUser');
        const currentPath = window.location.pathname;
        if (currentPath.includes('/assets/') || currentPath.includes('/issues/') || currentPath.includes('/schedule/') || currentPath.includes('/analytics/') || currentPath.includes('/notifications/') || currentPath.includes('/settings/') || currentPath.includes('/technicians/')) {
            window.location.href = '../Login/login.html';
        } else {
            window.location.href = 'Login/login.html';
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. AUTOMATIC INJECT COMPLETE CSS WITH CURSOR FIXES
    const styleId = "global-admin-menu-styles";
    if (!document.getElementById(styleId)) {
        const styleTag = document.createElement("style");
        styleTag.id = styleId;
        styleTag.innerHTML = `
            /* GLOBAL MODAL BLUR OVERLAY */
            .modal-blur-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999999 !important;
                opacity: 0;
                pointer-events: none;
                transition: all 0.25s ease-in-out;
            }

            .modal-blur-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }

            /* POPUP CARD CONTAINER */
            .user-menu-card-popup {
                background: #ffffff;
                width: 420px;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                position: relative;
                transform: scale(0.9);
                transition: transform 0.25s ease-in-out;
                text-align: left;
                pointer-events: auto; /* Force input capture */
            }

            .modal-blur-overlay.active .user-menu-card-popup {
                transform: scale(1);
            }

            /* CLOSE BUTTON */
            .modal-close-btn {
                position: absolute;
                top: 16px;
                right: 16px;
                background: #f1f5f9;
                border: none;
                font-size: 1.2rem;
                color: #64748b;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer !important;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close-btn:hover { background: #e2e8f0; color: #0f172a; }

            /* HEADER SECTION */
            .modal-header-section { margin-bottom: 20px; }
            .modal-brand-label { font-size: 0.7rem; font-weight: 700; color: #0c7489; letter-spacing: 1px; text-transform: uppercase; }
            .modal-header-section h3 { font-size: 1.4rem; color: #032b3d; font-weight: 700; margin-top: 2px; }

            /* USER ROW */
            .user-profile-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
            .user-avatar-badge { width: 44px; height: 44px; background: #e0f2fe; color: #0369a1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; }
            .user-meta-details h4 { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0; }
            .user-meta-details span { font-size: 0.82rem; color: #64748b; display: block; margin-top: 2px; }

            /* NOTICE BOX */
            .modal-info-notice-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 24px; }
            .modal-info-notice-box p { font-size: 0.85rem; color: #475569; line-height: 1.4; margin: 0; }

            /* FOOTER ACTIONS AND FIXED CURSORS */
            .modal-actions-footer { display: flex; justify-content: space-between; align-items: center; }
            
            .btn-modal-reset { 
                background: #fee2e2; 
                border: none; 
                color: #ba1c1c; 
                padding: 10px 16px; 
                font-size: 0.85rem; 
                font-weight: 600; 
                border-radius: 8px; 
                cursor: pointer !important; /* Fixed text cursor issue */
                user-select: none;
            }
            .btn-modal-reset:hover { background: #fca5a5; }
            
            .btn-modal-logout { 
                background: #ffffff; 
                border: 1px solid #cbd5e1; 
                color: #0f172a; 
                padding: 10px 20px; 
                font-size: 0.85rem; 
                font-weight: 600; 
                border-radius: 8px; 
                cursor: pointer !important; /* Fixed text cursor issue */
                user-select: none;
            }
            .btn-modal-logout:hover { background: #f8fafc; border-color: #94a3b8; }
            
            /* Navbar indicator link layout cursor sync */
            .admin-menu-badge {
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(styleTag);
    }
    // 2. INITIALIZE LOGGED IN USER CREDENTIALS DYNAMICALLY
    const sessionToken = JSON.parse(localStorage.getItem('activeSessionUser'));
    const currentPath = window.location.pathname;
    
    if (!sessionToken || !sessionToken.isLoggedIn) {
        if (!currentPath.includes('/Login/login.html')) {
            const depth = currentPath.split('/').length - currentPath.indexOf('/assetsCare/') - 3;
            // Assuming index.html is at depth 0. 
            // Better yet, just check if we are in a subfolder
            if (currentPath.includes('/assets/') || currentPath.includes('/issues/') || currentPath.includes('/schedule/') || currentPath.includes('/analytics/') || currentPath.includes('/notifications/') || currentPath.includes('/settings/') || currentPath.includes('/technicians/')) {
                window.location.href = '../Login/login.html';
            } else {
                window.location.href = 'Login/login.html';
            }
        }
        return; // stop execution
    }

    const activeRole = sessionToken.userRole || 'Administrator';
    const activeName = `${sessionToken.firstName} ${sessionToken.lastName}` || 'Demo Admin';
    const activeEmail = sessionToken.userEmail || 'admin@assetcare.demo';

    let initials = 'DA';
    if (sessionToken.firstName && sessionToken.lastName) {
        initials = (sessionToken.firstName[0] + sessionToken.lastName[0]).toUpperCase();
    }

    // 3. DYNAMICALLY INJECT POPUP STRUCTURE IN BODY
    const modalId = "globalUserMenuModal";
    if (!document.getElementById(modalId)) {
        const modalHTML = `
            <div class="modal-blur-overlay" id="${modalId}">
                <div class="user-menu-card-popup">
                    <button class="modal-close-btn" id="closeGlobalModalBtn">×</button>
                    
                    <div class="modal-header-section">
                        <span class="modal-brand-label">ASSETCARE</span>
                        <h3>User Menu</h3>
                    </div>

                    <div class="user-profile-row">
                        <div class="user-avatar-badge">${initials}</div>
                        <div class="user-meta-details">
                            <h4 id="pop-user-name">${activeName}</h4>
                            <span id="pop-user-email">${activeEmail} • ${activeRole}</span>
                        </div>
                    </div>

                    <div class="modal-info-notice-box">
                        <p>Use reset to restore the original sample data in localStorage, including demo issues, schedules, notifications, and history entries.</p>
                    </div>

                    <div class="modal-actions-footer">
                        <button class="btn-modal-reset" id="globalResetBtn">Reset Demo Data</button>
                        <button class="btn-modal-logout" id="globalLogoutBtn">Logout</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modalElement = document.getElementById(modalId);

    // 4. CLICK EVENT ROUTER - BULLETPROOF DIRECT BINDING
    function openUserMenu() {
        // Live updates content inside popup instantly before sliding up
        const liveSession = JSON.parse(localStorage.getItem('activeSessionUser'));
        const liveRole = liveSession ? liveSession.userRole : 'Administrator';
        const liveName = liveSession ? `${liveSession.firstName} ${liveSession.lastName}` : 'Demo Admin';
        const liveEmail = liveSession ? liveSession.userEmail : 'admin@assetcare.demo';

        document.getElementById('pop-user-name').innerText = liveName;
        document.getElementById('pop-user-email').innerText = `${liveEmail} • ${liveRole}`;

        modalElement.classList.add('active');
    }

    const triggerBadges = document.querySelectorAll('.admin-menu-badge, .context-menu-badge, #role-context-menu');
    triggerBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openUserMenu();
        });
    });

    // Fallback document listener just in case there are dynamic badges
    document.body.addEventListener('click', (e) => {
        const targetMenu = e.target.closest('.admin-menu-badge, .context-menu-badge, #role-context-menu');
        if (targetMenu) {
            e.preventDefault();
            e.stopPropagation();
            openUserMenu();
        }
    });

    // Close Button Action Hook
    document.getElementById('closeGlobalModalBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        modalElement.classList.remove('active');
    });

    // Logout Click Handler Execution Engine
    document.getElementById('globalLogoutBtn').addEventListener('click', (e) => {
        e.stopPropagation(); // Stop dispatch bubble breakups
        if (confirm("Confirm account session shutdown?")) {
            modalElement.classList.remove('active');

            const currentPath = window.location.pathname;

            // Check routing and map folder structure locations perfectly
            if (currentPath.includes('/settings/') ||
                currentPath.includes('/assets/') ||
                currentPath.includes('/issues/') ||
                currentPath.includes('/Login/') ||
                currentPath.includes('/notifications/') ||
                currentPath.includes('/schedule/') ||
                currentPath.includes('/technicians/') ||
                currentPath.includes('/analytics/')) {

                window.location.href = '../Login/login.html';
            } else {
                window.location.href = 'Login/login.html';
            }
        }
    });

    // Reset Click Handler Configuration Engine
    document.getElementById('globalResetBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm("Kya aap waqai poora local storage data reset karna chahte hain?")) {
            localStorage.clear();
            alert("Data reset successful!");
            window.location.reload();
        }
    });

    // Backdrop window hide execution logic
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            modalElement.classList.remove('active');
        }
    });
});