/* Site-wide keyboard navigation, the complete loop:
     1-9        -> open that guide (hub order: title sort)
     0 / Left   -> back to the guides hub
     j / k      -> next / previous section on a guide page
   Bare keys only -- modifier combos pass through, as do editable targets.
   Up/Down arrows are never touched: they scroll. */
(function () {
  var guides = window.GUIDES || [];
  var home = '/';
  var heads = Array.prototype.slice.call(
    document.querySelectorAll('article h2[id]'));
  var smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto' : 'smooth';

  function currentSection() {
    var probe = window.innerHeight * 0.35, idx = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= probe) idx = i;
    }
    return idx;
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;

    if (/^[1-9]$/.test(e.key)) {
      var url = guides[+e.key - 1];
      if (url && location.pathname !== url) window.location = url;
    } else if (e.key === '0' || e.key === 'ArrowLeft') {
      if (location.pathname !== home) window.location = home;
    } else if ((e.key === 'j' || e.key === 'k') && heads.length) {
      var idx = currentSection();
      if (e.key === 'j') {
        var next = heads[idx + 1];
        if (next) next.scrollIntoView({ behavior: smooth });
      } else {
        if (idx <= 0) window.scrollTo({ top: 0, behavior: smooth });
        else heads[idx - 1].scrollIntoView({ behavior: smooth });
      }
    }
  });
})();
