// Basic interactivity for the wedding site
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle for small screens — prefer class toggles and aria attributes
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (menuBtn && nav) {
        // ensure proper aria state
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            menuBtn.classList.toggle('active', open);
            menuBtn.setAttribute('aria-expanded', String(open));
            // remove any inline styles that older implementation might have left behind
            nav.style.display = '';
        });

        // Close mobile nav automatically when window resizes above mobile breakpoint
        window.addEventListener('resize', () => {
            try {
                if (window.innerWidth > 600 && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            } catch (e) { }
        });
        // Close mobile nav when a navigation link is clicked (use event delegation)
        nav.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.matches && target.matches('a')) {
                if (nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Gallery modal
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCaption = document.getElementById('modalCaption');
    if (modal && modalImg) {
        let lastFocused = null;
        // initialize Swiper if present (script is included in index.html)
        let gallerySwiper = null;
        try {
            if (typeof Swiper !== 'undefined') {
                // collect available modules from the UMD bundle (if present)
                const mods = [];
                if (Swiper.Grid) mods.push(Swiper.Grid);
                if (Swiper.Navigation) mods.push(Swiper.Navigation);
                if (Swiper.Pagination) mods.push(Swiper.Pagination);
                if (Swiper.Autoplay) mods.push(Swiper.Autoplay);

                gallerySwiper = new Swiper('.gallery-swiper', {
                    modules: mods.length ? mods : undefined,
                    slidesPerView: 3,
                    spaceBetween: 12,
                    grid: {
                        rows: 2,
                        fill: 'row'
                    },
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    observer: true,
                    observeParents: true,
                    breakpoints: {
                        320: { slidesPerView: 1, grid: { rows: 2 } },
                        600: { slidesPerView: 2, grid: { rows: 2 } },
                        900: { slidesPerView: 3, grid: { rows: 2 } }
                    }
                });

                // ensure layout updates (Grid needs a refresh in some cases)
                try { gallerySwiper.update(); gallerySwiper.updateSize(); } catch (e) { }
            }
        } catch (e) { /* ignore if Swiper not available */ }

        // prefer swiper's original slides (avoid duplicated loop slides)
        let thumbs = [];
        const slideEls = Array.from(document.querySelectorAll('.gallery-swiper .swiper-slide'));
        // Build thumbs from original slide order using data-swiper-slide-index when present
        const ordered = [];
        slideEls.forEach(sl => {
            const img = sl.querySelector('img.thumb');
            if (img) {
                // original index stored by Swiper when loop=true is in data-swiper-slide-index
                const orig = sl.hasAttribute('data-swiper-slide-index') ? Number(sl.getAttribute('data-swiper-slide-index')) : null;
                ordered.push({ el: img, origIndex: orig });
            }
        });
        // If origIndex is present, group by origIndex to get unique original slides in order
        if (ordered.some(o => o.origIndex !== null)) {
            const map = new Map();
            ordered.forEach(o => { if (!map.has(o.origIndex)) map.set(o.origIndex, o.el); });
            thumbs = Array.from(map.values());
        } else {
            thumbs = ordered.map(o => o.el);
        }
        let currentIndex = -1;
        // Attach click handlers to thumbnails (support <img> or elements with background-image/data-src)
        let bodyScrollY = 0;

        function wireThumbs() {
            // attach click handlers to the canonical thumbs list (original slide order)
            thumbs.forEach((img, idx) => {
                img.addEventListener('click', (ev) => {
                    lastFocused = document.activeElement;
                    // open modal with the clicked index
                    showAt(idx);
                    modal.classList.remove('hidden');
                    modal.classList.remove('closing');
                    modal.classList.add('opening');
                    modal.setAttribute('aria-hidden', 'false');
                    bodyScrollY = window.scrollY || document.documentElement.scrollTop || 0;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${bodyScrollY}px`;
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                    setTimeout(() => {
                        modal.classList.remove('opening');
                        if (modalClose && typeof modalClose.focus === 'function') {
                            try { modalClose.focus({ preventScroll: true }); } catch (e) { modalClose.focus(); }
                        }
                    }, 220);
                });
            });
        }

        wireThumbs();
        // helper to get src from thumbnail element
        function srcFromThumb(el) {
            if (!el) return '';
            return el.tagName.toLowerCase() === 'img'
                ? el.src
                : (el.dataset.src || getComputedStyle(el).backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''));
        }

        function showAt(index) {
            if (!thumbs.length) return;
            currentIndex = (index + thumbs.length) % thumbs.length;
            const el = thumbs[currentIndex];
            const src = srcFromThumb(el);
            modalImg.src = src || '';
            if (modalCaption) modalCaption.textContent = el.getAttribute('alt') || el.dataset.caption || '';
            // sync swiper position using slideToLoop (handles looped clones)
            try {
                if (gallerySwiper && typeof gallerySwiper.slideToLoop === 'function') {
                    gallerySwiper.slideToLoop(currentIndex);
                } else if (gallerySwiper && typeof gallerySwiper.slideTo === 'function') {
                    gallerySwiper.slideTo(currentIndex);
                }
            } catch (e) { }
        }

        // If Swiper later populates slides dynamically, re-wire on update
        if (gallerySwiper && gallerySwiper.on) {
            gallerySwiper.on('slideChange', () => {
                // no-op for now; if dynamic updates needed we can re-wire
            });
        }

        // Only attach close handler if the close button exists
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                // play closing animation
                modal.classList.remove('opening');
                modal.classList.add('closing');
                modal.setAttribute('aria-hidden', 'true');
                // unlock scroll after animation and restore scroll position
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('closing');
                    modalImg.src = '';
                    // restore body scroll
                    try {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.left = '';
                        document.body.style.right = '';
                        window.scrollTo(0, bodyScrollY || 0);
                    } catch (err) { }
                    try { modalClose.blur(); } catch (e) { }
                    try { if (lastFocused && typeof lastFocused.focus === 'function') { lastFocused.focus({ preventScroll: true }); } } catch (e) { try { if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus(); } catch (e) { } }
                    // clear state
                    currentIndex = -1;
                    if (modalCaption) modalCaption.textContent = '';
                }, 180);
            });
        }


        // NOTE: removed duplicate generic Swiper init targeting ".swiper" to avoid overriding the grid setup

        // Prev/Next buttons
        if (modalPrev) {
            modalPrev.addEventListener('click', () => { if (typeof currentIndex === 'number' && currentIndex > -1) showAt(currentIndex - 1); });
        }
        if (modalNext) {
            modalNext.addEventListener('click', () => { if (typeof currentIndex === 'number' && currentIndex > -1) showAt(currentIndex + 1); });
        }

        // Clicking the backdrop closes the modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('opening');
                modal.classList.add('closing');
                modal.setAttribute('aria-hidden', 'true');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('closing');
                    modalImg.src = '';
                    try {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.left = '';
                        document.body.style.right = '';
                        window.scrollTo(0, bodyScrollY || 0);
                    } catch (err) { }
                    try { if (modalClose) modalClose.blur(); } catch (e) { }
                    try { if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus(); } catch (e) { }
                    currentIndex = -1;
                    if (modalCaption) modalCaption.textContent = '';
                }, 180);
            }
        });

        // Allow Escape key to close the modal
        // Focus trap and Escape handling
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                // trigger close flow (same as other close paths)
                modal.classList.remove('opening');
                modal.classList.add('closing');
                modal.setAttribute('aria-hidden', 'true');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('closing');
                    modalImg.src = '';
                    try {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.left = '';
                        document.body.style.right = '';
                        window.scrollTo(0, bodyScrollY || 0);
                    } catch (err) { }
                    try { if (modalClose) modalClose.blur(); } catch (err) { }
                    try { if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus(); } catch (err) { }
                    currentIndex = -1;
                    if (modalCaption) modalCaption.textContent = '';
                }, 180);
            }

            // left/right arrows navigate images when modal open
            if (!modal.classList.contains('hidden') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                if (typeof currentIndex === 'number' && currentIndex > -1) {
                    if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
                    else showAt(currentIndex + 1);
                }
            }

            // focus trap logic: keep focus inside modal when open
            if (!modal.classList.contains('hidden') && e.key === 'Tab') {
                const focusable = modal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else { // Tab
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
    }

    // Countdown
    function startCountdown() {
        const el = document.getElementById('countdown');
        if (!el) return;
        const target = new Date(el.dataset.date);
        function tick() {
            const now = new Date();
            let diff = Math.max(0, target - now);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -= days * (1000 * 60 * 60 * 24);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            diff -= minutes * (1000 * 60);
            const seconds = Math.floor(diff / 1000);
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
        tick();
        setInterval(tick, 1000);
    }
    startCountdown();


    // Google Calendar / ICS generation
    const addToGCal = document.getElementById('addToGCal');
    const downloadIcs = document.getElementById('downloadIcs');
    function buildEvent() {
        return {
            title: 'Idy & Anie Wedding',
            details: 'Join us for our wedding celebration',
            location: 'Royal Nefsea International Schools, Uyo',
            start: new Date('2025-11-15T12:00:00'),
            end: new Date('2025-11-15T17:00:00')
        };
    }
    function toGCalUrl(ev) {
        const start = ev.start.toISOString().replace(/-|:|\.\d+/g, '');
        const end = ev.end.toISOString().replace(/-|:|\.\d+/g, '');
        const url = new URL('https://www.google.com/calendar/render');
        url.searchParams.set('action', 'TEMPLATE');
        url.searchParams.set('text', ev.title);
        url.searchParams.set('dates', `${start}/${end}`);
        url.searchParams.set('details', ev.details);
        url.searchParams.set('location', ev.location);
        return url.toString();
    }
    function toICS(ev) {
        function fmt(d) {
            return d.toISOString().replace(/-|:|\.\d+/g, '');
        }
        return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${fmt(new Date())}\nDTSTART:${fmt(ev.start)}\nDTEND:${fmt(ev.end)}\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.details}\nLOCATION:${ev.location}\nEND:VEVENT\nEND:VCALENDAR`;
    }
    if (addToGCal) { addToGCal.addEventListener('click', () => { const ev = buildEvent(); window.open(toGCalUrl(ev), '_blank'); }); }
    if (downloadIcs) { downloadIcs.addEventListener('click', () => { const ev = buildEvent(); const blob = new Blob([toICS(ev)], { type: 'text/calendar' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'idy-anie-wedding.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }); }

    // Prevent empty clicks on placeholder links
    document.querySelectorAll('a.placeholder').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            // small accessible feedback
            a.setAttribute('aria-disabled', 'true');
            // optionally show a message in the console (remove in production)
            console.info('Placeholder link clicked; replace href with a real destination.', a);
        });
    });

});