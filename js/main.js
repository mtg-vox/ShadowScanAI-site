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

    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================
  // STICKY NAV SHADOW ON SCROLL
  // ============================
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // ============================
  // FLOATING CTA (MOBILE)
  // ============================
  const floatingCta = document.getElementById('floating-cta');
  const heroSection = document.getElementById('signup-form');

  if (floatingCta && heroSection) {
    var floatingVisible = false;
    var floatingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          if (!floatingVisible) {
            floatingCta.classList.add('is-visible');
            floatingVisible = true;
          }
        } else {
          floatingCta.classList.remove('is-visible');
          floatingVisible = false;
        }
      });
    }, { threshold: 0.1 });

    floatingObserver.observe(heroSection);
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
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ============================
  // FOUNDER BIO EXPAND/COLLAPSE
  // ============================
  const readMoreBtn = document.getElementById('founder-read-more-btn');
  const founderBioMore = document.getElementById('founder-bio-more');

  if (readMoreBtn && founderBioMore) {
    readMoreBtn.addEventListener('click', function () {
      var isExpanded = founderBioMore.classList.contains('is-expanded');
      if (isExpanded) {
        founderBioMore.classList.remove('is-expanded');
        readMoreBtn.textContent = 'Read more';
      } else {
        founderBioMore.classList.add('is-expanded');
        readMoreBtn.textContent = 'Read less';
      }
    });
  }

  // ============================
  // FORM SUBMISSION + CONVERSION TRACKING
  // ============================
  const form = document.getElementById('email-form');
  const formDone = document.querySelector('.w-form-done');
  const formFail = document.querySelector('.w-form-fail');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name').value.trim();
      var email = form.querySelector('#email').value.trim();

      if (!email) {
        if (formFail) formFail.style.display = 'block';
        return;
      }

      // Submit to Formspree
      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.style.display = 'none';
          if (formDone) formDone.style.display = 'block';
          if (formFail) formFail.style.display = 'none';

          // Fire Meta Pixel Lead event
          if (typeof fbq === 'function') {
            fbq('track', 'Lead', { content_name: 'Free Scan Signup' });
          }
        } else {
          if (formFail) formFail.style.display = 'block';
        }
      }).catch(function () {
        if (formFail) formFail.style.display = 'block';
      });
    });
  }

});
