(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = header.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var scrollTopBtn = document.getElementById('scrolltop');

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
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 4);
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('is-visible', y > 240);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var revealEls = document.querySelectorAll('.reveal');
  if (motionQuery.matches || !('IntersectionObserver' in window)) {
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

  /* ========================================================================
     Approach: Desktop Hover Meaning Popover + Click / Device Tap Popup Modal
     ======================================================================== */
  var approachPanel = document.getElementById('approach-panel');
  if (approachPanel) {
    (function initApproachInteractive(panel) {
      var loopDiagram = document.getElementById('loop-diagram');
      var pills = Array.prototype.slice.call(panel.querySelectorAll('.stage-pill[data-step]'));
      var nodes = Array.prototype.slice.call(panel.querySelectorAll('.loop-node[data-step]'));
      var hoverPopover = document.getElementById('step-hover-popover');
      var hoverPhase = document.getElementById('hover-popover-phase');
      var hoverTitle = document.getElementById('hover-popover-title');
      var hoverDesc = document.getElementById('hover-popover-desc');
      var hoverTags = document.getElementById('hover-popover-tags');

      var popup = document.getElementById('step-popup');
      var popupPhase = document.getElementById('popup-phase');
      var popupStage = document.getElementById('popup-stage');
      var popupTitle = document.getElementById('popup-title');
      var popupDesc = document.getElementById('popup-desc');
      var popupTags = document.getElementById('popup-tags');
      var popupClose = document.getElementById('popup-close');
      var popupPrev = document.getElementById('popup-prev');
      var popupNext = document.getElementById('popup-next');

      var finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      var currentPopupStep = -1;
      var lastTriggerEl = null;

      var stages = pills.map(function (btn) {
        return {
          phase: btn.getAttribute('data-phase') || '',
          stage: btn.getAttribute('data-stage') || '',
          title: btn.getAttribute('data-title') || '',
          desc: btn.getAttribute('data-desc') || '',
          tags: (btn.getAttribute('data-tags') || '').split('|').filter(Boolean)
        };
      });

      function fillTagList(ul, tags) {
        ul.innerHTML = '';
        tags.forEach(function (tag) {
          var li = document.createElement('li');
          li.textContent = tag;
          ul.appendChild(li);
        });
      }

      function highlightStep(idx) {
        if (idx === null || idx < 0) {
          panel.removeAttribute('data-active-step');
          nodes.forEach(function (n) { n.classList.remove('is-active'); });
          pills.forEach(function (p) { p.classList.remove('is-active'); });
          return;
        }
        panel.setAttribute('data-active-step', String(idx));
        nodes.forEach(function (n) {
          n.classList.toggle('is-active', Number(n.getAttribute('data-step')) === idx);
        });
        pills.forEach(function (p) {
          p.classList.toggle('is-active', Number(p.getAttribute('data-step')) === idx);
        });
      }

      function showHoverPopover(idx) {
        if (!finePointerQuery.matches || currentPopupStep >= 0 || !stages[idx] || !loopDiagram) return;
        var s = stages[idx];
        hoverPhase.textContent = s.phase + ' · ' + s.stage;
        hoverTitle.textContent = s.title;
        hoverDesc.textContent = s.desc;
        fillTagList(hoverTags, s.tags);
        hoverPopover.hidden = false;
        highlightStep(idx);

        // Anchor cleanly near the active SVG node without covering the glowing platform
        var activeSvgNode = panel.querySelector('.loop-svg-wide .loop-node[data-step="' + idx + '"]');
        var diagRect = loopDiagram.getBoundingClientRect();
        var popW = hoverPopover.offsetWidth || 320;
        var popH = hoverPopover.offsetHeight || 180;
        var left = (diagRect.width - popW) * 0.5;
        var top = (diagRect.height - popH) * 0.5;

        if (activeSvgNode && getComputedStyle(panel.querySelector('.loop-svg-wide')).display !== 'none') {
          var nr = activeSvgNode.getBoundingClientRect();
          var relCx = nr.left - diagRect.left + nr.width * 0.5;
          var relCy = nr.top - diagRect.top + nr.height * 0.5;

          if (idx === 1 || idx === 2) {
            left = relCx - popW - 56;
            top = relCy - popH * 0.5;
          } else if (idx === 4 || idx === 5) {
            left = relCx + 56;
            top = relCy - popH * 0.5;
          } else if (idx === 0) {
            left = relCx - popW * 0.5;
            top = relCy + 54;
          } else {
            left = relCx - popW * 0.5;
            top = relCy - popH - 52;
          }
        }

        left = Math.max(8, Math.min(diagRect.width - popW - 8, left));
        top = Math.max(4, Math.min(diagRect.height - popH - 4, top));
        hoverPopover.style.left = Math.round(left) + 'px';
        hoverPopover.style.top = Math.round(top) + 'px';
      }

      function hideHoverPopover() {
        hoverPopover.hidden = true;
        if (currentPopupStep < 0) {
          highlightStep(-1);
        }
      }

      function openPopup(idx, triggerEl) {
        if (!stages[idx]) return;
        currentPopupStep = idx;
        if (triggerEl) lastTriggerEl = triggerEl;
        hoverPopover.hidden = true;
        highlightStep(idx);

        var s = stages[idx];
        popupPhase.textContent = s.phase;
        popupStage.textContent = s.stage;
        popupTitle.textContent = s.title;
        popupDesc.textContent = s.desc;
        fillTagList(popupTags, s.tags);
        popup.hidden = false;
        document.body.style.overflow = 'hidden';
        popupClose.focus();
      }

      function closePopup() {
        if (currentPopupStep < 0) return;
        currentPopupStep = -1;
        popup.hidden = true;
        document.body.style.overflow = '';
        highlightStep(-1);
        if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
          lastTriggerEl.focus();
        }
      }

      function bindStepTrigger(el) {
        var idx = Number(el.getAttribute('data-step'));
        el.addEventListener('pointerenter', function (e) {
          if (e.pointerType === 'mouse') showHoverPopover(idx);
        });
        el.addEventListener('pointerleave', function (e) {
          if (e.pointerType === 'mouse') hideHoverPopover();
        });
        el.addEventListener('focus', function () {
          if (finePointerQuery.matches) showHoverPopover(idx);
        });
        el.addEventListener('blur', function () {
          hideHoverPopover();
        });
        el.addEventListener('click', function () {
          openPopup(idx, el);
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPopup(idx, el);
          }
        });
      }

      nodes.forEach(bindStepTrigger);
      pills.forEach(bindStepTrigger);

      popupClose.addEventListener('click', closePopup);
      popup.addEventListener('click', function (e) {
        if (e.target === popup) closePopup();
      });
      popupPrev.addEventListener('click', function () {
        if (currentPopupStep >= 0) openPopup((currentPopupStep + stages.length - 1) % stages.length);
      });
      popupNext.addEventListener('click', function () {
        if (currentPopupStep >= 0) openPopup((currentPopupStep + 1) % stages.length);
      });
      document.addEventListener('keydown', function (e) {
        if (currentPopupStep < 0) return;
        if (e.key === 'Escape') {
          closePopup();
        } else if (e.key === 'ArrowLeft') {
          openPopup((currentPopupStep + stages.length - 1) % stages.length);
        } else if (e.key === 'ArrowRight') {
          openPopup((currentPopupStep + 1) % stages.length);
        }
      });
    })(approachPanel);
  }

  if ('IntersectionObserver' in window) {
    var isoStages = document.querySelectorAll('.iso-stage');
    if (isoStages.length) {
      var isoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
        });
      });
      isoStages.forEach(function (stage) { isoObserver.observe(stage); });
    }

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

  var inquiryForm = document.querySelector('.inquiry-form');
  if (inquiryForm) {
    var inquiryError = document.getElementById('inquiry-error');
    inquiryForm.addEventListener('submit', function (e) {
      var needs = inquiryForm.querySelectorAll('input[name="need"]:checked');
      var budget = inquiryForm.querySelector('input[name="budget"]:checked');
      var missing = [];
      if (!needs.length) missing.push('what you need');
      if (!budget) missing.push('a budget range');
      if (!missing.length) {
        inquiryError.hidden = true;
        return;
      }
      e.preventDefault();
      inquiryError.hidden = false;
      inquiryError.textContent = 'Select ' + missing.join(' and ') + ' before sending.';
      var focusTarget = !needs.length
        ? inquiryForm.querySelector('input[name="need"]')
        : inquiryForm.querySelector('input[name="budget"]');
      if (focusTarget) focusTarget.focus();
    });
    inquiryForm.addEventListener('change', function () {
      if (inquiryError && !inquiryError.hidden) inquiryError.hidden = true;
    });
  }
})();
