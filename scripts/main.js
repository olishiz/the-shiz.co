(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = header.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('is-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 48rem)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 4);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  var heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var heroInView = true;
    var syncHeroVideo = function () {
      if (motionQuery.matches || !heroInView) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(function () {});
      }
    };
    motionQuery.addEventListener('change', syncHeroVideo);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        heroInView = entries[0].isIntersecting;
        syncHeroVideo();
      }).observe(heroVideo);
    }
  }

  if ('IntersectionObserver' in window) {
    var navLinks = nav.querySelectorAll('ul a[href^="#"]');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }
})();
