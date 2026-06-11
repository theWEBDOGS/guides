/* Progress-trail TOC.
   Desktop: fills the sidebar rail to the live reading position, checks off
   finished sections, rings the current one, ticks the "n / total" counter.
   Mobile (<940px, styled in CSS): the same nav renders as a fixed top strip
   that slides in after the header band — current section + counter + a
   horizontal gradient progress bar — and expands to the full trail on tap.
   The first item may be a synthesized Intro node (data-intro, href="#top").
   Reading line = 35% down the viewport. No deps. */
(function () {
  var toc = document.getElementById('toc');
  if (!toc) return;
  var trail = toc.querySelector('.trail');
  var fill = document.getElementById('rail-fill');
  var count = document.getElementById('toc-count');
  var bar = document.getElementById('toc-bar');
  var barFill = document.getElementById('toc-bar-fill');
  var barNow = document.getElementById('toc-bar-now');
  var barCount = document.getElementById('toc-bar-count');
  var aside = toc.closest('aside');
  var band = document.querySelector('.band');
  var all = Array.prototype.slice.call(trail.querySelectorAll('.toc-item'));
  if (!all.length) return;
  var intro = all[0].hasAttribute('data-intro') ? all[0] : null;
  var items = intro ? all.slice(1) : all;
  var heads = items.map(function (a) {
    return document.getElementById(decodeURIComponent(a.hash.slice(1)));
  });
  if (!items.length || heads.indexOf(null) !== -1) return;

  function labelOf(el) { return el.querySelector('.t').textContent; }
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
    var finished = last && atEnd;

    if (intro) {
      intro.classList.toggle('active', idx === -1);
      intro.classList.toggle('done', idx > -1);
    }
    items.forEach(function (a, i) {
      a.classList.toggle('done', i < idx || (i === idx && finished));
      a.classList.toggle('active', i === idx && !finished);
    });

    /* fractional progress inside the current stretch */
    var frac = 0;
    if (idx === -1) {
      var first = heads[0].getBoundingClientRect().top;
      frac = Math.min(1, Math.max(0, window.scrollY /
        Math.max(1, window.scrollY + first - probe)));
    } else if (idx < heads.length - 1) {
      var a1 = heads[idx].getBoundingClientRect().top;
      var a2 = heads[idx + 1].getBoundingClientRect().top;
      frac = Math.min(1, Math.max(0, (probe - a1) / (a2 - a1)));
    }

    /* one scalar 0..N-1 across all nodes drives both presentations */
    var offset = intro ? 1 : 0;
    var cur;
    if (idx === -1) cur = intro ? frac : 0;
    else cur = offset + idx + frac;
    if (finished) cur = all.length - 1;

    var total = all.length;
    var pos = idx === -1 ? (intro ? 1 : 0) : offset + idx + 1;
    if (finished) pos = total;
    var counterText = (pos > 0 ? pos : '–') + ' / ' + total;
    if (count) count.textContent = counterText;
    if (barCount) barCount.textContent = counterText;
    if (barNow) {
      barNow.textContent = idx === -1
        ? (intro ? labelOf(intro) : labelOf(items[0]))
        : labelOf(items[idx]);
    }
    if (barFill) barFill.style.width = (cur / (total - 1) * 100) + '%';

    /* vertical rail fill — only when the trail is actually rendered */
    if (fill && trail.getBoundingClientRect().height > 0) {
      var h;
      if (idx === -1) {
        h = intro ? nodeMid(intro) + frac * (nodeMid(items[0]) - nodeMid(intro)) : 0;
      } else {
        h = nodeMid(items[idx]);
        if (idx < heads.length - 1) {
          h += frac * (nodeMid(items[idx + 1]) - nodeMid(items[idx]));
        } else if (finished) {
          h = nodeMid(items[idx]);
        }
      }
      fill.style.height = Math.max(0, h) + 'px';
    }

    /* mobile strip slides in once the header band scrolls away */
    if (aside && band) {
      aside.classList.toggle('visible', band.getBoundingClientRect().bottom < 0);
    }
  }

  /* mobile: tap the strip to open/close the trail panel */
  if (bar) {
    bar.addEventListener('click', function () {
      var open = toc.classList.toggle('open');
      bar.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) update(); /* trail just became visible — size its fill */
    });
    toc.addEventListener('click', function (e) {
      if (e.target.closest('.toc-item') || e.target.closest('.toc-appendix a')) {
        toc.classList.remove('open');
        bar.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (toc.classList.contains('open') && !toc.contains(e.target)) {
        toc.classList.remove('open');
        bar.setAttribute('aria-expanded', 'false');
      }
    });
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
