(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = header && header.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var scrollTopBtn = document.getElementById('scrolltop');

  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && nav) {
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
  }

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 4);
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
     Hero: OpenAI "Sol & Luna" inspired 3D Cosmic Star-Cluster & Starburst
     ======================================================================== */
  var cosmosCanvas = document.getElementById('hero-cosmos');
  if (cosmosCanvas && cosmosCanvas.getContext) {
    (function initHeroCosmos(canvas) {
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var W = 0;
      var H = 0;
      var dpr = 1;
      var heroInView = true;
      var rafId = 0;
      var lastTs = 0;
      var simTime = 4.2;
      var targetTiltX = 0;
      var targetTiltY = 0;
      var tiltX = 0;
      var tiltY = 0;

      // Deterministic PRNG so the star cluster is balanced and repeatable
      var seed = 133791;
      function rand() {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      }
      function gauss() {
        var u = Math.max(1e-6, rand());
        var v = rand();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * v);
      }

      // Pre-baked soft radial star sprites for fast 60fps additive rendering
      function makeStarSprite(coreRgb, midRgb, outerRgb) {
        var sc = document.createElement('canvas');
        sc.width = 64;
        sc.height = 64;
        var sctx = sc.getContext('2d');
        var g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(' + coreRgb + ', 1)');
        g.addColorStop(0.14, 'rgba(' + coreRgb + ', 0.92)');
        g.addColorStop(0.36, 'rgba(' + midRgb + ', 0.42)');
        g.addColorStop(0.7, 'rgba(' + outerRgb + ', 0.1)');
        g.addColorStop(1, 'rgba(' + outerRgb + ', 0)');
        sctx.fillStyle = g;
        sctx.fillRect(0, 0, 64, 64);
        return sc;
      }

      var sprites = [
        makeStarSprite('255,255,255', '225,236,255', '150,185,245'), // Pure white
        makeStarSprite('255,255,255', '135,205,255', '65,145,245'),  // Luna cyan-blue
        makeStarSprite('255,250,238', '255,180,98', '230,115,45'),   // Sol amber-gold
        makeStarSprite('255,246,236', '255,146,88', '205,82,42')     // Warm coral-gold
      ];

      // 1. Deep-field ambient stars across the full sky
      var bgStars = [];
      for (var i = 0; i < 250; i++) {
        bgStars.push({
          u: rand(),
          v: rand() * 0.92,
          size: 0.55 + Math.pow(rand(), 2.2) * 1.9,
          alpha: 0.22 + rand() * 0.65,
          phase: rand() * 6.283,
          speed: 0.6 + rand() * 1.6,
          sprite: rand() < 0.62 ? 0 : (rand() < 0.58 ? 1 : 2)
        });
      }

      // 2. Crisp 4-point cross diffraction flare stars (+ rays)
      var flareStars = [];
      for (var f = 0; f < 22; f++) {
        var side = f % 2 === 0 ? -1 : 1;
        var fu = 0.5 + side * (0.14 + rand() * 0.34);
        var fv = 0.08 + rand() * 0.72;
        flareStars.push({
          u: fu,
          v: fv,
          arm: 12 + rand() * 22,
          alpha: 0.38 + rand() * 0.48,
          phase: rand() * 6.283,
          tint: rand() < 0.7 ? '235,244,255' : '255,222,185'
        });
      }

      // 3. Peripheral outward comet / shooting-star light streaks
      var streaks = [];
      for (var s = 0; s < 36; s++) {
        var dir = s % 2 === 0 ? -1 : 1;
        streaks.push({
          dir: dir,
          progress: rand(),
          speed: 0.055 + rand() * 0.11,
          laneY: (rand() - 0.46) * 0.82,
          startR: 0.14 + rand() * 0.22,
          len: 28 + rand() * 68,
          slope: (rand() - 0.5) * 0.16,
          alpha: 0.28 + rand() * 0.58,
          warm: rand() < 0.28
        });
      }

      // 4. Dense 3D swirling "Sol & Luna" star cluster (~820 particles)
      var cluster = [];
      // Sub-cluster offsets give authentic astrophotography asymmetry
      var lobes = [
        [0, 0, 0, 1.0],
        [0.34, -0.22, 0.18, 0.52],
        [-0.3, 0.24, -0.15, 0.48],
        [0.22, 0.32, -0.24, 0.44],
        [-0.26, -0.26, 0.22, 0.4]
      ];
      for (var c = 0; c < 820; c++) {
        var lobe = lobes[c < 460 ? 0 : (1 + (c % 4))];
        var spread = lobe[3] * (c < 180 ? 0.42 : 0.92);
        var x = lobe[0] + gauss() * 0.42 * spread;
        var y = lobe[1] + gauss() * 0.36 * spread;
        var z = lobe[2] + gauss() * 0.42 * spread;

        var pick = rand();
        var spriteIdx = pick < 0.4 ? 0 : (pick < 0.72 ? 1 : (pick < 0.91 ? 2 : 3));
        var mag = Math.pow(rand(), 2.6);
        cluster.push({
          x: x,
          y: y,
          z: z,
          size: 1.8 + mag * 7.8,
          alpha: 0.34 + (1 - mag * 0.3) * 0.64,
          twinkle: rand() * 6.283,
          sprite: spriteIdx
        });
      }

      function resize() {
        var rect = canvas.parentElement.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(320, Math.round(rect.width));
        H = Math.max(360, Math.round(rect.height));
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        drawFrame(0);
      }

      function drawFrame(dt) {
        if (!W || !H) return;
        simTime += dt;
        tiltX += (targetTiltX - tiltX) * Math.min(1, dt * 4 + 0.04);
        tiltY += (targetTiltY - tiltY) * Math.min(1, dt * 4 + 0.04);

        ctx.save();
        ctx.scale(dpr, dpr);

        // Base deep cosmos
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        var cx = W * 0.5;
        var cy = H * (W < 640 ? 0.32 : 0.37);
        var clusterScale = Math.min(W * 0.34, H * 0.38, 320);

        // Subtle deep-space nebula wash (sapphire + warm core dust)
        var neb = ctx.createRadialGradient(cx, cy, 4, cx, cy, clusterScale * 2.1);
        neb.addColorStop(0, 'rgba(255, 224, 182, 0.14)');
        neb.addColorStop(0.24, 'rgba(96, 152, 232, 0.09)');
        neb.addColorStop(0.58, 'rgba(18, 36, 72, 0.06)');
        neb.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb;
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'lighter';

        // Layer 1: Background stars
        for (var i = 0; i < bgStars.length; i++) {
          var bs = bgStars[i];
          var tw = 0.72 + 0.28 * Math.sin(simTime * bs.speed + bs.phase);
          ctx.globalAlpha = bs.alpha * tw;
          var d = bs.size * 4.2;
          var bx = bs.u * W;
          var by = bs.v * H;
          ctx.drawImage(sprites[bs.sprite], bx - d * 0.5, by - d * 0.5, d, d);
        }

        // Layer 2: 4-point cross diffraction flare stars (+ lens flares)
        ctx.lineWidth = 1;
        for (var f = 0; f < flareStars.length; f++) {
          var fs = flareStars[f];
          var fx = fs.u * W + tiltX * 8;
          var fy = fs.v * H + tiltY * 6;
          var ftw = 0.75 + 0.25 * Math.sin(simTime * 1.3 + fs.phase);
          var arm = fs.arm * ftw;
          var a = fs.alpha * ftw;

          var hg = ctx.createLinearGradient(fx - arm, fy, fx + arm, fy);
          hg.addColorStop(0, 'rgba(' + fs.tint + ', 0)');
          hg.addColorStop(0.5, 'rgba(' + fs.tint + ', ' + (a * 0.85).toFixed(3) + ')');
          hg.addColorStop(1, 'rgba(' + fs.tint + ', 0)');
          ctx.globalAlpha = 1;
          ctx.strokeStyle = hg;
          ctx.beginPath();
          ctx.moveTo(fx - arm, fy);
          ctx.lineTo(fx + arm, fy);
          ctx.stroke();

          var vg = ctx.createLinearGradient(fx, fy - arm, fx, fy + arm);
          vg.addColorStop(0, 'rgba(' + fs.tint + ', 0)');
          vg.addColorStop(0.5, 'rgba(' + fs.tint + ', ' + (a * 0.85).toFixed(3) + ')');
          vg.addColorStop(1, 'rgba(' + fs.tint + ', 0)');
          ctx.strokeStyle = vg;
          ctx.beginPath();
          ctx.moveTo(fx, fy - arm);
          ctx.lineTo(fx, fy + arm);
          ctx.stroke();

          ctx.globalAlpha = Math.min(1, a * 1.25);
          ctx.drawImage(sprites[0], fx - 6, fy - 6, 12, 12);
        }

        // Layer 3: Peripheral shooting-star / warp light streaks
        var halfSpan = W * 0.54;
        for (var s = 0; s < streaks.length; s++) {
          var st = streaks[s];
          if (dt > 0) {
            st.progress += dt * st.speed;
            if (st.progress > 1) st.progress -= 1;
          }
          var u = st.progress;
          var fade = u < 0.15 ? u / 0.15 : (u > 0.82 ? (1 - u) / 0.18 : 1);
          var dist = (st.startR + u * (1 - st.startR)) * halfSpan;
          var headX = cx + st.dir * dist;
          var headY = cy + st.laneY * H * 0.56 + st.slope * dist;
          var tailLen = st.len * (0.65 + u * 0.65);
          var tailX = headX - st.dir * tailLen;
          var tailY = headY - st.slope * tailLen;

          var sg = ctx.createLinearGradient(tailX, tailY, headX, headY);
          var rgb = st.warm ? '255, 205, 148' : '225, 240, 255';
          sg.addColorStop(0, 'rgba(' + rgb + ', 0)');
          sg.addColorStop(1, 'rgba(' + rgb + ', ' + (st.alpha * fade * 0.78).toFixed(3) + ')');
          ctx.globalAlpha = 1;
          ctx.strokeStyle = sg;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.stroke();

          ctx.globalAlpha = st.alpha * fade;
          ctx.drawImage(sprites[st.warm ? 2 : 0], headX - 4.5, headY - 4.5, 9, 9);
        }

        // Layer 4: 3D Rotating "Sol & Luna" Star Cluster
        var rotY = simTime * 0.11 + tiltX * 0.38;
        var rotX = 0.22 + Math.sin(simTime * 0.07) * 0.08 + tiltY * 0.28;
        var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        var fov = 2.6;

        for (var c = 0; c < cluster.length; c++) {
          var p = cluster[c];
          var x1 = p.x * cosY - p.z * sinY;
          var z1 = p.x * sinY + p.z * cosY;
          var y2 = p.y * cosX - z1 * sinX;
          var z2 = p.y * sinX + z1 * cosX;

          var persp = fov / Math.max(0.7, fov + z2);
          var sx = cx + x1 * clusterScale * persp;
          var sy = cy + y2 * clusterScale * 0.88 * persp;
          var sr = p.size * persp * 2.15;
          var twc = 0.82 + 0.18 * Math.sin(simTime * 1.9 + p.twinkle);
          var depthFade = Math.min(1, Math.max(0.22, (1.4 - z2) * 0.72));

          ctx.globalAlpha = p.alpha * twc * depthFade;
          ctx.drawImage(sprites[p.sprite], sx - sr * 0.5, sy - sr * 0.5, sr, sr);
        }

        // Layer 5: Central Radiant "Sol" Core Star
        var pulse = 1 + 0.045 * Math.sin(simTime * 1.6);
        var coreX = cx + tiltX * 10;
        var coreY = cy + tiltY * 8;
        var outerR = Math.max(54, clusterScale * 0.34) * pulse;

        var outerHalo = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, outerR);
        outerHalo.addColorStop(0, 'rgba(255, 252, 242, 0.95)');
        outerHalo.addColorStop(0.16, 'rgba(255, 232, 196, 0.62)');
        outerHalo.addColorStop(0.42, 'rgba(255, 186, 118, 0.18)');
        outerHalo.addColorStop(0.72, 'rgba(135, 192, 255, 0.06)');
        outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = outerHalo;
        ctx.beginPath();
        ctx.arc(coreX, coreY, outerR, 0, 6.2831853);
        ctx.fill();

        // Crisp luminous sun disc
        var discR = Math.max(10.5, clusterScale * 0.052) * pulse;
        var discGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, discR * 1.65);
        discGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        discGrad.addColorStop(0.58, 'rgba(255, 249, 235, 0.98)');
        discGrad.addColorStop(0.82, 'rgba(255, 224, 178, 0.45)');
        discGrad.addColorStop(1, 'rgba(255, 200, 140, 0)');
        ctx.fillStyle = discGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, discR * 1.65, 0, 6.2831853);
        ctx.fill();

        ctx.restore();
      }

      function tick(ts) {
        rafId = 0;
        if (!heroInView || motionQuery.matches || document.hidden) return;
        var dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
        lastTs = ts;
        drawFrame(dt);
        rafId = requestAnimationFrame(tick);
      }

      function syncLoop() {
        if (motionQuery.matches || !heroInView || document.hidden) {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
          lastTs = 0;
          if (motionQuery.matches) drawFrame(0);
        } else if (!rafId) {
          lastTs = 0;
          rafId = requestAnimationFrame(tick);
        }
      }

      var heroSec = canvas.closest('.hero');
      if (heroSec) {
        heroSec.addEventListener('pointermove', function (e) {
          if (motionQuery.matches) return;
          var r = heroSec.getBoundingClientRect();
          targetTiltX = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
          targetTiltY = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
        }, { passive: true });
        heroSec.addEventListener('pointerleave', function () {
          targetTiltX = 0;
          targetTiltY = 0;
        });
      }

      window.addEventListener('resize', resize, { passive: true });
      document.addEventListener('visibilitychange', syncLoop);
      motionQuery.addEventListener('change', syncLoop);
      if ('IntersectionObserver' in window && heroSec) {
        new IntersectionObserver(function (entries) {
          heroInView = entries[0].isIntersecting;
          syncLoop();
        }).observe(heroSec);
      }

      resize();
      syncLoop();
    })(cosmosCanvas);
  }

  /* ========================================================================
     Approach: the note below the loop follows the stage you hover or tap
     ======================================================================== */
  var approachPanel = document.getElementById('approach-panel');
  if (approachPanel) {
    (function initApproachInteractive(panel) {
      var pills = Array.prototype.slice.call(panel.querySelectorAll('.stage-pill[data-step]'));
      var nodes = Array.prototype.slice.call(panel.querySelectorAll('.loop-node[data-step]'));
      var kicker = document.getElementById('stage-kicker');
      var title = document.getElementById('stage-title');
      var desc = document.getElementById('stage-desc');
      var tags = document.getElementById('stage-tags');
      var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      var pinned = null;

      function decode(value) {
        var el = document.createElement('textarea');
        el.innerHTML = value || '';
        return el.value;
      }

      function fill(idx) {
        var pill = pills[idx];
        if (!pill || !title) return;
        kicker.textContent = decode(pill.getAttribute('data-phase')) + ' · ' + decode(pill.getAttribute('data-stage'));
        title.textContent = decode(pill.getAttribute('data-title'));
        desc.textContent = decode(pill.getAttribute('data-desc'));
        tags.innerHTML = '';
        (pill.getAttribute('data-tags') || '').split('|').forEach(function (tag) {
          if (!tag) return;
          var li = document.createElement('li');
          li.textContent = decode(tag);
          tags.appendChild(li);
        });
      }

      function render(idx) {
        panel.setAttribute('data-active-step', String(idx));
        pills.forEach(function (item, i) {
          item.classList.toggle('is-active', i === idx);
          item.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
        });
        nodes.forEach(function (node, i) {
          node.classList.toggle('is-active', i === idx);
        });
        fill(idx);
      }

      function release() {
        if (pinned === null) {
          panel.removeAttribute('data-active-step');
          pills.forEach(function (item) {
            item.classList.remove('is-active');
            item.setAttribute('aria-pressed', 'false');
          });
          nodes.forEach(function (node) { node.classList.remove('is-active'); });
          fill(0);
          return;
        }
        render(pinned);
      }

      function bind(el, idx) {
        el.addEventListener('click', function () {
          pinned = idx;
          render(idx);
        });
        if (!finePointer) return;
        el.addEventListener('pointerenter', function () { render(idx); });
        el.addEventListener('pointerleave', release);
      }

      pills.forEach(function (pill, i) { bind(pill, i); });
      nodes.forEach(function (node, i) { bind(node, i); });
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

    var navLinks = nav ? nav.querySelectorAll('ul a[href^="#"]') : [];
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
