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
