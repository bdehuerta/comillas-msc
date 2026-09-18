/* Scroll-reveal + hero entrance.
   Everything degrades to fully visible if JS is off or motion is reduced. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
    document.documentElement.classList.add('motion-off');
    return;
  }

  document.documentElement.classList.add('motion-on');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      // stagger siblings inside the same group
      var group = el.parentElement;
      var sibs = group ? group.querySelectorAll(':scope > .reveal') : [];
      var idx = Array.prototype.indexOf.call(sibs, el);
      el.style.transitionDelay = (idx > 0 ? Math.min(idx, 5) * 90 : 0) + 'ms';
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  for (var j = 0; j < els.length; j++) io.observe(els[j]);

  // Hero animates on load rather than on scroll.
  var hero = document.querySelectorAll('.hero .reveal');
  for (var k = 0; k < hero.length; k++) {
    (function (el, n) {
      io.unobserve(el);
      el.style.transitionDelay = (120 + n * 110) + 'ms';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add('is-in'); });
      });
    })(hero[k], k);
  }

  // Count up the stat numbers once the band is in view.
  var statBand = document.querySelector('.stats');
  if (statBand) {
    var counted = false;
    new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting || counted) return;
      counted = true;
      document.querySelectorAll('.stats .num').forEach(function (n) {
        var target = parseInt(n.textContent.replace(/\D/g, ''), 10);
        if (!target) return;            // PLACEHOLDER text is left alone
        var suffix = /\+$/.test(n.textContent) ? '+' : '';
        var start = performance.now(), dur = 1100;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          n.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.4 }).observe(statBand);
  }
})();

/* Scroll-driven parallax for the decorative props.
   One rAF-throttled listener drives every object; each drifts at its own
   rate and rotates slightly, so the page gains depth without the objects
   ever competing with the text. Disabled under reduced-motion. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var objs = [].slice.call(document.querySelectorAll('.obj'));
  if (!objs.length) return;

  var ticking = false;

  function place() {
    var vh = window.innerHeight;
    for (var i = 0; i < objs.length; i++) {
      var el = objs[i];
      var host = el.closest('section');
      if (!host) continue;
      var r = host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;  // offscreen: skip

      // -1 when the section is entering, +1 when it is leaving
      var progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      var speed = parseFloat(el.dataset.speed) || 0.2;
      var rot = parseFloat(el.dataset.rot) || 0;

      var y = progress * speed * 220;
      var deg = rot + progress * rot * 0.5;
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) rotate(' + deg.toFixed(2) + 'deg)';
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(place); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  place();
})();

/* Masked word reveal for [data-split] headings.
   The original sentence is kept verbatim in an .sr-only node so screen
   readers announce it normally; the animated spans are aria-hidden. */
(function () {
  var heads = document.querySelectorAll('[data-split]');
  if (!heads.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (var i = 0; i < heads.length; i++) {
    var el = heads[i];
    var text = el.textContent.trim();

    el.classList.remove('reveal');          // the mask replaces the fade
    el.classList.add('is-split');
    el.innerHTML =
      '<span class="sr-only">' + text + '</span>' +
      '<span aria-hidden="true">' +
      text.split(/\s+/).map(function (w, n) {
        return '<span class="word-mask"><span class="word-inner" style="transition-delay:' +
               (n * 70) + 'ms">' + w + '</span></span>';
      }).join(' ') +
      '</span>';

    if (reduced) { el.classList.add('is-in'); continue; }

    (function (node) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { node.classList.add('is-in'); });
      });
    })(el);
  }
})();

/* Second pass: the events spine fills as you read, the active entry's dot
   turns gold, and the oversized slab numerals drift horizontally against
   the scroll. One rAF-throttled listener for all three, same pattern as
   the parallax props above. Skipped entirely under reduced-motion. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var host  = document.querySelector('.tl');
  var prog  = host ? host.querySelector('.tl-prog') : null;
  var items = host ? [].slice.call(host.querySelectorAll('.timeline > li')) : [];
  var nums  = [].slice.call(document.querySelectorAll('[data-drift]'));
  if (!host && !nums.length) return;

  var ticking = false;

  function frame() {
    var vh = window.innerHeight;

    if (host) {
      var r = host.getBoundingClientRect();
      if (prog) {
        var p = (vh * 0.68 - r.top) / r.height;
        prog.style.transform = 'scaleY(' + Math.max(0, Math.min(1, p)).toFixed(3) + ')';
      }
      for (var i = 0; i < items.length; i++) {
        var b = items[i].getBoundingClientRect();
        items[i].classList.toggle('is-active', b.top < vh * 0.66 && b.bottom > 0);
      }
    }

    for (var j = 0; j < nums.length; j++) {
      var el = nums[j];
      var q = el.getBoundingClientRect();
      if (q.bottom < -160 || q.top > vh + 160) continue;
      // -1 entering, +1 leaving
      var t = (vh / 2 - (q.top + q.height / 2)) / (vh / 2 + q.height / 2);
      var amt = parseFloat(el.dataset.drift) || 0.1;
      el.style.transform = 'translate3d(' + (t * amt * 150).toFixed(1) + 'px,0,0)';
    }

    ticking = false;
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  frame();
})();

/* Custom cursor: a ring that trails the pointer, opens over anything
   clickable, and swaps ink over the dark and gold blocks. Fine pointers
   only — touch devices keep their native behaviour and never load it.
   Under reduced-motion the ring tracks the pointer exactly, with no lag. */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var ring = document.getElementById('cursor');
  if (!ring) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cursor-on');

  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var x = tx, y = ty, raf = null;

  function render() {
    if (reduced) { x = tx; y = ty; }
    else { x += (tx - x) * 0.18; y += (ty - y) * 0.18; }
    ring.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    if (!reduced && (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1)) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  }

  function kick() { if (!raf) raf = requestAnimationFrame(render); }

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    ring.classList.add('is-visible');

    var el = e.target instanceof Element ? e.target : null;
    var link = el ? el.closest('a, button, [role="button"]') : null;
    ring.classList.toggle('is-link', !!link);

    var dark = el ? el.closest('.program, .marquee, footer .foot-links') : null;
    var gold = el ? el.closest('.join, .hero') : null;
    ring.classList.toggle('on-dark', !!dark);
    ring.classList.toggle('on-gold', !dark && !!gold);

    kick();
  }, { passive: true });

  document.addEventListener('mouseleave', function () { ring.classList.remove('is-visible'); });
  document.addEventListener('mouseenter', function () { ring.classList.add('is-visible'); });
  window.addEventListener('blur', function () { ring.classList.remove('is-visible'); });
})();
