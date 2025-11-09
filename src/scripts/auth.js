// Simple client-side auth using localStorage (demo only). Do NOT use in production.
(function () {
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    function registerUser(e) {
        e.preventDefault();
        const f = e.target;
        const username = f.username.value.trim();
        const email = f.email.value.trim().toLowerCase();
        const password = f.password.value;
        const confirm = f.confirm.value;
        const msgEl = document.getElementById('rg-msg');

        msgEl.textContent = '';

        if (password !== confirm) {
            msgEl.textContent = 'Passwords do not match.';
            return;
        }

        const users = getUsers();
        if (users.find(u => u.username === username || u.email === email)) {
            msgEl.textContent = 'User with that username or email already exists.';
            return;
        }

        users.push({ username, email, password });
        saveUsers(users);
        setCurrentUser({ username, email });
        window.location.href = 'dashboard.html';
    }

    function loginUser(e) {
        e.preventDefault();
        const f = e.target;
        const identifier = f.identifier.value.trim();
        const password = f.password.value;
        const msgEl = document.getElementById('lg-msg');

        msgEl.textContent = '';

        const users = getUsers();
        const user = users.find(u =>
            (u.username === identifier || u.email === identifier.toLowerCase()) && u.password === password
        );

        if (!user) {
            msgEl.textContent = 'Invalid credentials.';
            return;
        }

        setCurrentUser({ username: user.username, email: user.email });
        window.location.href = 'dashboard.html';
    }

    function handleProfileMenu() {
        const profileWrapper = document.querySelector('.profile-menu-wrapper');
        const dropdown = document.querySelector('.profile-dropdown');

        if (profileWrapper && dropdown) {
            // Toggle dropdown when profile wrapper is clicked
            profileWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !profileWrapper.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });

            // Handle menu item clicks
            const menuItems = dropdown.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });
            });
        }
    }

    function protectDashboard() {
        const cur = getCurrentUser();
        if (!cur) {
            // If not logged in, dispatch a UI event to show the top notice then redirect to register
            try {
                const ev = new CustomEvent('show-top-notice', { detail: { text: 'Please register or login before viewing the dashboard. Redirecting to Register...', duration: 2200, redirect: 'register.html' } });
                document.dispatchEvent(ev);
                // fallback redirect in case UI doesn't handle it (after same delay)
                setTimeout(() => { window.location.href = 'register.html'; }, 2300);
                return;
            } catch (e) {
                window.location.href = 'register.html';
                return;
            }
        }
        const welcome = document.getElementById('welcomeMsg');
        if (welcome) {
            welcome.textContent = `Welcome, ${cur.username}!`;
        }
        // populate the small user display (name + profile pic) if present
        const nameEl = document.getElementById('userName');
        const picEl = document.getElementById('profilePic');
        if (nameEl) nameEl.textContent = cur.username || cur.email || 'User';
        if (picEl) {
            // if user object has an `avatar` property (data URL or path), use it; otherwise use default avatar
            if (cur.avatar) {
                picEl.src = cur.avatar;
            } else {
                picEl.src = 'assets/default-avatar.png';
            }
        }

        // Initialize profile menu
        handleProfileMenu();

        // Set up logout button
        const btn = document.getElementById('logoutBtn');
        if (btn) btn.addEventListener('click', logout);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const rg = document.getElementById('registerForm');
        if (rg) rg.addEventListener('submit', registerUser);

        const lg = document.getElementById('loginForm');
        if (lg) lg.addEventListener('submit', loginUser);

        // dashboard protection & welcome
        if (location.pathname.endsWith('dashboard.html')) {
            protectDashboard();
            // wire simple dashboard search if present
            const searchForm = document.getElementById('dashboardSearch');
            const resultsEl = document.getElementById('searchResults');
            if (searchForm && resultsEl) {
                searchForm.addEventListener('submit', (ev) => {
                    ev.preventDefault();
                    const q = (searchForm.q.value || '').trim();
                    resultsEl.innerHTML = '';
                    if (!q) {
                        resultsEl.textContent = 'Please enter a search term.';
                        return;
                    }
                    // show simple loading indicator
                    const loader = document.createElement('div');
                    loader.textContent = 'Searching...';
                    resultsEl.appendChild(loader);

                    // fake async search
                    setTimeout(() => {
                        resultsEl.innerHTML = '';
                        const heading = document.createElement('div');
                        heading.style.fontWeight = '600';
                        heading.style.marginBottom = '8px';
                        heading.textContent = `Results for "${q}"`;
                        resultsEl.appendChild(heading);

                        // fake results - in a real app you'd call an API
                        const ul = document.createElement('ul');
                        ul.style.margin = '0';
                        ul.style.paddingLeft = '18px';
                        for (let i = 1; i <= 3; i++) {
                            const li = document.createElement('li');
                            li.textContent = `${q} — result ${i}`;
                            ul.appendChild(li);
                        }
                        resultsEl.appendChild(ul);
                    }, 700);
                });
            }
        }
    });

    // Expose for debugging
    window.auth = { getUsers, getCurrentUser, logout };
})();
