/* ShadowScan AI - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

  // ============================
  // MOBILE NAV TOGGLE
  // ============================
  const menuBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');

  if (menuBtn && overlay && closeBtn) {
    menuBtn.addEventListener('click', function () {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    });

    // Close on link click
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================
  // SCROLL FADE-IN ANIMATIONS
  // ============================
  const fadeEls = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window && fadeEls.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ============================
  // FORM SUBMISSION HANDLING
  // ============================
  const form = document.getElementById('email-form');
  const formDone = document.querySelector('.w-form-done');
  const formFail = document.querySelector('.w-form-fail');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();

      if (!email) {
        if (formFail) formFail.style.display = 'block';
        return;
      }

      // For now, show success. Replace with your actual endpoint.
      form.style.display = 'none';
      if (formDone) formDone.style.display = 'block';
      if (formFail) formFail.style.display = 'none';

      // TODO: Send to your backend / email service
      console.log('Form submitted:', { name: name, email: email });
    });
  }

});
