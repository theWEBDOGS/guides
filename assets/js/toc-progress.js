/* Progress-trail TOC: fills the rail to the live reading position, checks
   off finished sections, rings the current one, ticks the "n / total"
   counter. The first item may be a synthesized Intro node (data-intro,
   href="#top") that is active until the first real heading passes the
   reading line (35% down the viewport). Appendix links live outside .trail
   and are ignored. No deps. */
(function () {
  var toc = document.getElementById('toc');
  if (!toc) return;
  var trail = toc.querySelector('.trail');
  var fill = document.getElementById('rail-fill');
  var count = document.getElementById('toc-count');
  var all = Array.prototype.slice.call(trail.querySelectorAll('.toc-item'));
  if (!all.length) return;
  var intro = all[0].hasAttribute('data-intro') ? all[0] : null;
  var items = intro ? all.slice(1) : all;
  var heads = items.map(function (a) {
    return document.getElementById(decodeURIComponent(a.hash.slice(1)));
  });
  if (!items.length || heads.indexOf(null) !== -1) return;

  function nodeMid(el) {
    var n = el.querySelector('.node').getBoundingClientRect();
    return n.top + n.height / 2 - trail.getBoundingClientRect().top;
  }

  function update() {
    var probe = window.innerHeight * 0.35;
    var idx = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= probe) idx = i;
    }
    var atEnd = Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2;
    var last = idx === heads.length - 1;

    if (intro) {
      intro.classList.toggle('active', idx === -1);
      intro.classList.toggle('done', idx > -1);
    }
    items.forEach(function (a, i) {
      a.classList.toggle('done', i < idx || (i === idx && last && atEnd));
      a.classList.toggle('active', i === idx && !(last && atEnd));
    });

    if (count) {
      var total = all.length;
      var pos = idx + 1 + (intro ? 1 : 0);
      if (idx === -1) pos = intro ? 1 : 0;
      if (last && atEnd) pos = total;
      count.textContent = (pos > 0 ? pos : '–') + ' / ' + total;
    }

    var h;
    if (idx === -1) {
      h = intro ? nodeMid(intro) : 0;
      if (intro && heads.length) {
        /* progress toward the first heading: it crosses the probe once the
           page scrolls another (firstTop - probe) px from here */
        var first = heads[0].getBoundingClientRect().top;
        var frac0 = Math.min(1, Math.max(0, window.scrollY /
          Math.max(1, window.scrollY + first - probe)));
        h += frac0 * (nodeMid(items[0]) - nodeMid(intro));
      }
    } else {
      h = nodeMid(items[idx]);
      if (idx < heads.length - 1) {
        var a1 = heads[idx].getBoundingClientRect().top;
        var a2 = heads[idx + 1].getBoundingClientRect().top;
        var frac = Math.min(1, Math.max(0, (probe - a1) / (a2 - a1)));
        h += frac * (nodeMid(items[idx + 1]) - nodeMid(items[idx]));
      }
    }
    fill.style.height = Math.max(0, h) + 'px';
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
