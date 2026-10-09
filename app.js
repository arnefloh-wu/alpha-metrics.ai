/**
 * AlphaMetrics AI — app.js
 * Handles: sticky nav, hamburger menu, scroll animations, contact form, smooth scroll
 */

(function () {
  'use strict';

  /* ── STICKY NAVIGATION ─────────────────────────────────── */
  const navHeader = document.getElementById('nav-header');

  function updateNav() {
    if (window.scrollY > 60) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── HAMBURGER MENU ────────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  /* ── INTERSECTION OBSERVER — REVEAL ANIMATIONS ─────────── */
  // Hero elements use staggered CSS delays
  function applyHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach(function (el) {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () {
        el.classList.add('visible');
      }, delay + 200);
    });
  }

  // Scroll-triggered reveal for .reveal elements
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Trigger hero on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroAnimations);
  } else {
    applyHeroAnimations();
  }

  /* ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navHeader ? navHeader.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });

  /* ── ACTIVE NAV HIGHLIGHTING ───────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id);
          });
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── CONTACT FORM ──────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        highlightInvalidFields(form);
        return;
      }

      if (!isValidEmail(email)) {
        const emailInput = form.querySelector('[name="email"]');
        emailInput.style.borderColor = '#e05252';
        emailInput.focus();
        return;
      }

      // Submit via Formspree or fallback to mailto
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending\u2026';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          formSuccess.classList.add('visible');
          form.reset();
        } else {
          // Fallback to mailto
          var subject = encodeURIComponent('AlphaMetrics AI — Contact from ' + name);
          var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (form.querySelector('[name="company"]').value || 'N/A') + '\nMessage: ' + message);
          window.open('mailto:info@alpha-metrics.ai?subject=' + subject + '&body=' + body, '_blank');
          formSuccess.classList.add('visible');
          form.reset();
        }
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      })
      .catch(function () {
        // Network error — fallback to mailto
        var subject = encodeURIComponent('AlphaMetrics AI — Contact from ' + name);
        var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (form.querySelector('[name="company"]').value || 'N/A') + '\nMessage: ' + message);
        window.open('mailto:info@alpha-metrics.ai?subject=' + subject + '&body=' + body, '_blank');
        formSuccess.classList.add('visible');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      });
    });

    // Reset error styling on input
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  function highlightInvalidFields(form) {
    form.querySelectorAll('[required]').forEach(function (el) {
      if (!el.value.trim()) {
        el.style.borderColor = '#e05252';
        el.addEventListener('input', function () {
          this.style.borderColor = '';
        }, { once: true });
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── STAGGERED REVEAL FOR CARDS ────────────────────────── */
  // Format cards get staggered reveal when the grid comes into view
  const formatSection = document.querySelector('.format-cards');
  if (formatSection) {
    const formatCards = formatSection.querySelectorAll('.format-card');
    const cardObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          formatCards.forEach(function (card, i) {
            setTimeout(function () {
              card.classList.add('visible');
            }, i * 80);
          });
          cardObserver.unobserve(formatSection);
        }
      },
      { threshold: 0.08 }
    );
    cardObserver.observe(formatSection);
  }

  /* ── STAT CARD COUNTER ANIMATION ──────────────────────── */
  // A subtle "pulse in" for stat numbers when they enter view
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length) {
    const statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    statCards.forEach(function (card) {
      statObserver.observe(card);
    });
  }

})();
