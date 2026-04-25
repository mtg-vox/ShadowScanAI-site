/* ShadowScan AI - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

  // ============================
  // COOKIE CONSENT + META PIXEL LOADER
  // ============================
  var CONSENT_KEY = 'ssai_cookie_consent_v1';
  var PIXEL_ID = '1141958824588736';
  var banner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var prefsLink = document.getElementById('cookie-preferences-link');

  // Visitors in the EU/EEA, UK, or Switzerland get the consent banner (GDPR/UK GDPR/Swiss FADP).
  // Detection uses the browser's IANA timezone -- no external geo lookup, no extra requests.
  var EU_LIKE_TIMEZONES = {
    'Europe/Vienna':1,'Europe/Brussels':1,'Europe/Sofia':1,'Europe/Zagreb':1,'Asia/Famagusta':1,'Asia/Nicosia':1,
    'Europe/Prague':1,'Europe/Copenhagen':1,'Europe/Tallinn':1,'Europe/Helsinki':1,'Europe/Paris':1,
    'Europe/Berlin':1,'Europe/Busingen':1,'Europe/Athens':1,'Europe/Budapest':1,'Europe/Dublin':1,
    'Europe/Rome':1,'Europe/Riga':1,'Europe/Vilnius':1,'Europe/Luxembourg':1,'Europe/Malta':1,
    'Europe/Amsterdam':1,'Europe/Warsaw':1,'Europe/Lisbon':1,'Atlantic/Azores':1,'Atlantic/Madeira':1,
    'Europe/Bucharest':1,'Europe/Bratislava':1,'Europe/Ljubljana':1,'Europe/Madrid':1,'Africa/Ceuta':1,
    'Atlantic/Canary':1,'Europe/Stockholm':1,
    // EEA (non-EU)
    'Atlantic/Reykjavik':1,'Europe/Vaduz':1,'Europe/Oslo':1,'Arctic/Longyearbyen':1,
    // UK + Crown Dependencies
    'Europe/London':1,'Europe/Guernsey':1,'Europe/Jersey':1,'Europe/Isle_of_Man':1,'Atlantic/Faroe':1,
    // Switzerland
    'Europe/Zurich':1
  };

  function isEuLikeVisitor() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return !!EU_LIKE_TIMEZONES[tz];
    } catch (e) {
      return false;
    }
  }

  function loadMetaPixel() {
    if (window._ssai_pixel_loaded) return;
    window._ssai_pixel_loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    if (typeof fbq === 'function') {
      fbq('init', PIXEL_ID);
      fbq('track', 'PageView');
    }
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-visible'); });
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.hidden = true; }, 250);
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  var stored = getConsent();
  var requiresConsent = isEuLikeVisitor();

  if (!requiresConsent) {
    // Outside EU/EEA/UK/CH: load the Pixel without showing a banner.
    loadMetaPixel();
  } else if (stored === 'accepted') {
    loadMetaPixel();
  } else if (stored === 'declined') {
    // do nothing
  } else {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      setConsent('accepted');
      hideBanner();
      loadMetaPixel();
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      setConsent('declined');
      hideBanner();
    });
  }
  if (prefsLink) {
    prefsLink.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(CONSENT_KEY); } catch (err) {}
      // Always allow re-opening the banner from the footer link, regardless of region.
      showBanner();
    });
  }

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
