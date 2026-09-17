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
