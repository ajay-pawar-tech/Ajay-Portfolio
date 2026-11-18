/**
 * Skills 3D Carousel
 * ---------------------------------------------------------
 * - Wraps .skills-container in a .skills-scene (if missing)
 * - Toggles the "skills-3d-ready" class on .skills-section
 * - Calculates card width, ring radius and angle step
 * - Recalculates on resize / orientation change / font load
 * - Uses 3D only when the viewport is >= 768px AND the user
 *   has not requested reduced motion
 * - Safe if elements are missing (does nothing, no errors)
 * - Listeners are registered once and removed by destroy()
 */
(function () {
    'use strict';

    var CLASS_3D = 'skills-3d-ready';
    var GAP = 36;               // space between cards on the ring (px)
    var MIN_W = 230;            // min card width (px)
    var MAX_W = 340;            // max card width (px)
    var WIDTH_DIVISOR = 2.4;    // keeps the visible arc inside the scene
    var SPEED_PER_CARD = 7;     // seconds per card for one full turn

    var mq3d = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    var mqSwipe = window.matchMedia('(max-width: 767.98px)');

    var section, container, scene, cards;
    var createdScene = false;
    var initialised = false;
    var rafId = 0;
    var resizeObserver = null;
    var lastKey = '';

    function addMqListener(mq, fn) {
        if (mq.addEventListener) { mq.addEventListener('change', fn); }
        else if (mq.addListener) { mq.addListener(fn); }
    }

    function removeMqListener(mq, fn) {
        if (mq.removeEventListener) { mq.removeEventListener('change', fn); }
        else if (mq.removeListener) { mq.removeListener(fn); }
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function setA11y(mode) {
        // 3D: the scene is focusable so keyboard focus pauses rotation.
        // Swipe: the scroll area must be focusable for keyboard users.
        if (mode === '3d') {
            scene.setAttribute('tabindex', '0');
            scene.setAttribute('role', 'region');
            scene.setAttribute('aria-label', 'Skills carousel (rotation pauses on hover or focus)');
            container.removeAttribute('tabindex');
            container.removeAttribute('role');
            container.removeAttribute('aria-label');
        } else if (mode === 'swipe') {
            container.setAttribute('tabindex', '0');
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Skills carousel, swipe horizontally');
            scene.removeAttribute('tabindex');
            scene.removeAttribute('role');
            scene.removeAttribute('aria-label');
        } else {
            [scene, container].forEach(function (el) {
                el.removeAttribute('tabindex');
                el.removeAttribute('role');
                el.removeAttribute('aria-label');
            });
        }
    }

    function clearCardVars() {
        cards.forEach(function (card) {
            card.style.removeProperty('--i');
            card.style.removeProperty('height');
        });
        ['--skills-card-w', '--skills-card-h', '--skills-radius', '--skills-step', '--skills-speed']
            .forEach(function (name) { section.style.removeProperty(name); });
    }

    function disable3D() {
        section.classList.remove(CLASS_3D);
        clearCardVars();
        if (mqSwipe.matches) {
            setA11y('swipe');
        } else {
            container.scrollLeft = 0;
            setA11y('none');
        }
    }

    function enable3D() {
        var count = cards.length;
        var available = scene.clientWidth || section.clientWidth;
        var cardW = Math.round(clamp((available - GAP * 2) / WIDTH_DIVISOR, MIN_W, MAX_W));
        var step = 360 / count;
        var radius = Math.round((cardW + GAP) / (2 * Math.tan(Math.PI / count)));

        section.classList.add(CLASS_3D);
        container.scrollLeft = 0;

        section.style.setProperty('--skills-card-w', cardW + 'px');
        section.style.setProperty('--skills-radius', radius + 'px');
        section.style.setProperty('--skills-step', step + 'deg');
        section.style.setProperty('--skills-speed', (count * SPEED_PER_CARD) + 's');

        // Measure natural card height at the new width so every card is equal
        var tallest = 0;
        cards.forEach(function (card, index) {
            card.style.setProperty('--i', index);
            card.style.height = 'auto';
        });
        cards.forEach(function (card) {
            tallest = Math.max(tallest, card.offsetHeight);
        });
        cards.forEach(function (card) {
            card.style.removeProperty('height');
        });

        section.style.setProperty('--skills-card-h', Math.ceil(tallest) + 'px');
        setA11y('3d');
    }

    function update(force) {
        var use3d = mq3d.matches;
        var key = (use3d ? '3d' : (mqSwipe.matches ? 'swipe' : 'grid')) + ':' + scene.clientWidth;

        if (!force && key === lastKey) { return; }
        lastKey = key;

        if (use3d) { enable3D(); } else { disable3D(); }
    }

    function schedule() {
        if (rafId) { return; }
        rafId = window.requestAnimationFrame(function () {
            rafId = 0;
            update(false);
        });
    }

    function onModeChange() {
        lastKey = '';
        schedule();
    }

    function onFontsOrLoad() {
        if (initialised) { update(true); }
    }

    function init() {
        if (initialised) { return; }

        section = document.querySelector('.skills-section');
        if (!section) { return; }

        container = section.querySelector('.skills-container');
        if (!container) { return; }

        cards = Array.prototype.filter.call(container.children, function (el) {
            return el.classList && el.classList.contains('skill-card');
        });
        if (cards.length < 3) { return; }   // a ring needs at least 3 cards

        scene = container.parentElement;
        if (!scene || !scene.classList.contains('skills-scene')) {
            scene = document.createElement('div');
            scene.className = 'skills-scene';
            container.parentNode.insertBefore(scene, container);
            scene.appendChild(container);
            createdScene = true;
        }

        initialised = true;

        addMqListener(mq3d, onModeChange);
        addMqListener(mqSwipe, onModeChange);
        window.addEventListener('orientationchange', onModeChange);
        window.addEventListener('load', onFontsOrLoad);

        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(schedule);
            resizeObserver.observe(scene);
        } else {
            window.addEventListener('resize', schedule);
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(onFontsOrLoad);
        }

        update(true);
    }

    function destroy() {
        if (!initialised) { return; }
        initialised = false;

        if (rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
        if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }

        removeMqListener(mq3d, onModeChange);
        removeMqListener(mqSwipe, onModeChange);
        window.removeEventListener('orientationchange', onModeChange);
        window.removeEventListener('load', onFontsOrLoad);
        window.removeEventListener('resize', schedule);

        section.classList.remove(CLASS_3D);
        clearCardVars();
        setA11y('none');

        if (createdScene && scene.parentNode) {
            scene.parentNode.insertBefore(container, scene);
            scene.parentNode.removeChild(scene);
            createdScene = false;
        }
    }

    window.SkillsCarousel = { init: init, destroy: destroy, refresh: function () { update(true); } };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
