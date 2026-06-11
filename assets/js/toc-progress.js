/* Progress-trail TOC: fills the rail to the live reading position, checks
   off finished sections, rings the current one, ticks the "n / total"
   counter. Reading line = 35% down the viewport. No deps. */
(function () {
  var toc = document.getElementById('toc');
  if (!toc) return;
  var items = Array.prototype.slice.call(toc.querySelectorAll('.toc-item'));
  var fill = document.getElementById('rail-fill');
  var count = document.getElementById('toc-count');
  var trail = toc.querySelector('.trail');
  var heads = items.map(function (a) {
    return document.getElementById(decodeURIComponent(a.hash.slice(1)));
  });
  if (!items.length || heads.indexOf(null) !== -1) return;

  function nodeMid(i) {
    var n = items[i].querySelector('.node').getBoundingClientRect();
    return n.top + n.height / 2 - trail.getBoundingClientRect().top;
  }

  function update() {
    var probe = window.innerHeight * 0.35;
    var idx = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= probe) idx = i;
    }
    items.forEach(function (a, i) {
      a.classList.toggle('done', i < idx);
      a.classList.toggle('active', i === idx);
    });
    if (count) {
      count.textContent = (idx < 0 ? '–' : idx + 1) + ' / ' + items.length;
    }
    var h;
    if (idx < 0) {
      h = 0;
    } else {
      h = nodeMid(idx);
      var atEnd = Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight - 2;
      if (idx < heads.length - 1) {
        var a1 = heads[idx].getBoundingClientRect().top;
        var a2 = heads[idx + 1].getBoundingClientRect().top;
        var frac = Math.min(1, Math.max(0, (probe - a1) / (a2 - a1)));
        h += frac * (nodeMid(idx + 1) - nodeMid(idx));
      } else if (atEnd) {
        items[idx].classList.remove('active');
        items[idx].classList.add('done');
        if (count) count.textContent = items.length + ' / ' + items.length;
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
