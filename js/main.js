/* ═══════════════════════════════════════════════════════════════
   main.js — Portfolio interactions
   - Rain canvas animation
   - Navbar scroll behaviour
   - Mobile menu toggle
   - Intersection Observer fade-in
   - Active nav link tracking
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Rain canvas ─────────────────────────────────────────────
  const canvas  = document.getElementById('rain-canvas');
  const ctx     = canvas.getContext('2d');
  let drops     = [];
  let animFrame = null;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createDrops() {
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    drops = Array.from({ length: count }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      speed:   1.8 + Math.random() * 3.5,
      opacity: 0.025 + Math.random() * 0.07,
      length:  12 + Math.random() * 22,
      drift:   0.2 + Math.random() * 0.4,   // slight rightward lean
    }));
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(function (d) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 201, 167, ${d.opacity})`;
      ctx.lineWidth   = 0.6;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.drift * (d.length / 15), d.y + d.length);
      ctx.stroke();

      d.y += d.speed;
      d.x += d.drift * 0.15;

      // Reset when off screen
      if (d.y > canvas.height + d.length) {
        d.y  = -d.length - Math.random() * 40;
        d.x  = Math.random() * canvas.width;
      }
      if (d.x > canvas.width + 20) {
        d.x = -10;
      }
    });

    animFrame = requestAnimationFrame(drawRain);
  }

  function initRain() {
    resizeCanvas();
    createDrops();
    if (animFrame) cancelAnimationFrame(animFrame);
    drawRain();
  }

  initRain();

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      initRain();
    }, 200);
  });

  // ── Navbar scroll behaviour ──────────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on init

  // ── Mobile menu toggle ───────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  // ── Intersection Observer — fade-in animations ───────────────
  const fadeElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // ── Active nav link tracking ─────────────────────────────────
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-link');
  const navHeight   = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
  ) || 64;

  function getActiveSection() {
    let current = '';
    const scrollY = window.scrollY + navHeight + 60;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    });

    return current;
  }

  function updateActiveLink() {
    const active = getActiveSection();
    navLinkEls.forEach(function (link) {
      const href = link.getAttribute('href');
      const matches = href === '#' + active;
      link.classList.toggle('active', matches);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run once on init

})();
