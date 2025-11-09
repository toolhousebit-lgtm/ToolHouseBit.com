// Small UI helpers: active nav marker + small page-ready class
(function () {
    function setActiveNav() {
        const links = document.querySelectorAll('.nav .nav-links a');
        if (!links || links.length === 0) return;
        // clear existing
        links.forEach(a => a.classList.remove('active'));

        const path = location.pathname.split('/').pop();
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            // normalize
            const hrefNorm = href.replace(/^(\.\/|\/)/, '');
            // treat index.html or empty as index
            if ((path === '' || path === 'index.html' || path === '/') && (hrefNorm === 'index.html' || hrefNorm === '')) {
                a.classList.add('active');
                return;
            }
            if (path === hrefNorm) a.classList.add('active');
        });
    }

    function markActiveLink(el) {
        if (!el) return;
        const links = document.querySelectorAll('.nav .nav-links a');
        links.forEach(a => a.classList.remove('active'));
        el.classList.add('active');
    }

    function isLoggedIn() {
        try {
            return !!JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            return false;
        }
    }

    function showTopNotice(text, opts = {}) {
        // opts: duration(ms), redirect
        const duration = typeof opts.duration === 'number' ? opts.duration : 3500; // a little longer
        const redirect = opts.redirect || null;

        // If a notice already exists, remove it first
        const existing = document.querySelector('.top-notice');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = 'top-notice';
        el.innerHTML = `
          <div class="top-notice-inner">
            <div class="top-notice-content">${text}</div>
            <button class="top-notice-close" aria-label="Dismiss notification">
              <svg class="notice-timer" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
                <circle class="timer-bg" cx="18" cy="18" r="15" fill="none" stroke-width="3"></circle>
                <circle class="timer-progress" cx="18" cy="18" r="15" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="94" stroke-dashoffset="94"></circle>
              </svg>
              <span class="close-x">×</span>
            </button>
          </div>`;

        document.body.appendChild(el);

        // force reflow to play animation
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight;

        el.classList.add('visible');

        // wire up timer animation using stroke-dashoffset
        const progress = el.querySelector('.timer-progress');
        let dismissed = false;
        let redirectTimeout = null;

        if (progress) {
            // animate by setting transition then changing dashoffset to 0
            // duration in ms
            progress.style.transition = `stroke-dashoffset ${duration}ms linear`;
            // small next tick to ensure transition
            requestAnimationFrame(() => { requestAnimationFrame(() => { progress.style.strokeDashoffset = '0'; }); });

            // when animation ends, dismiss and redirect if provided
            redirectTimeout = setTimeout(() => {
                if (dismissed) return;
                el.classList.remove('visible');
                setTimeout(() => el.remove(), 320);
                if (redirect) window.location.href = redirect;
            }, duration + 60);
        }

        const closeBtn = el.querySelector('.top-notice-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                dismissed = true;
                if (redirectTimeout) clearTimeout(redirectTimeout);
                // reverse animation for a quick dismiss
                el.classList.remove('visible');
                setTimeout(() => el.remove(), 240);
            });
        }
    }

    function interceptNavClicks() {
        const nav = document.querySelector('.nav .nav-links');
        if (!nav) return;
        nav.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;

            // If user clicks Dashboard while not logged in, show notice and redirect to register
            if (href === 'dashboard.html' && !isLoggedIn()) {
                e.preventDefault();
                showTopNotice('You must register or login before viewing the dashboard. Redirecting to Register...', { duration: 2200, redirect: 'register.html' });
                return;
            }
            // mark clicked link active immediately (gives visual feedback before navigation)
            markActiveLink(a);
            // otherwise allow navigation normally
        });
    }

    // Intercept clicks anywhere on the page (covers CTA buttons / links outside nav)
    function interceptDashboardCTALinks() {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;

            // If this is a dashboard link and user is not logged in, show notice and prevent navigation
            if (href === 'dashboard.html' && !isLoggedIn()) {
                e.preventDefault();
                showTopNotice('You must register or login before viewing the dashboard. Redirecting to Register...', { duration: 3500, redirect: 'register.html' });
                return;
            }
        });
    }

    // Listen for custom events so other scripts (eg auth.js) can ask for the same notice
    document.addEventListener('show-top-notice', (ev) => {
        try {
            const d = ev.detail || {};
            showTopNotice(d.text || 'Notice', { duration: d.duration || 2200, redirect: d.redirect || null });
        } catch (e) {
            // ignore
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        setActiveNav();
        interceptNavClicks();
        interceptDashboardCTALinks();
        // small ready class for potential JS-only animations
        document.documentElement.classList.add('js-ready');
    });
})();
