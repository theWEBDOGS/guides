/* Site-wide keyboard navigation, the complete loop:
     1-9            -> open that guide (hub order: title sort)
     0 / Left       -> back to the guides hub
     Down / j       -> next section on a guide page
     Up / k         -> previous section (or page top)
   Bare keys only -- modifier combos (incl. shift-selection) pass through,
   as do editable targets. Past the last section / above the first, Up/Down
   fall back to normal scrolling (no preventDefault), so nothing below the
   article is ever unreachable. Space / Shift+Space always page-scroll. */
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
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;

    if (/^[1-9]$/.test(e.key)) {
      var url = guides[+e.key - 1];
      if (url && location.pathname !== url) window.location = url;

    } else if (e.key === '0' || e.key === 'ArrowLeft') {
      if (location.pathname !== home) window.location = home;

    } else if ((e.key === 'ArrowDown' || e.key === 'j') && heads.length) {
      var next = heads[currentSection() + 1];
      if (next) {
        if (e.key === 'ArrowDown') e.preventDefault();
        next.scrollIntoView({ behavior: smooth });
      } /* at the last section, ArrowDown scrolls normally */

    } else if ((e.key === 'ArrowUp' || e.key === 'k') && heads.length) {
      var idx = currentSection();
      if (idx === 0 && window.scrollY > 0) {
        if (e.key === 'ArrowUp') e.preventDefault();
        window.scrollTo({ top: 0, behavior: smooth });
      } else if (idx > 0) {
        if (e.key === 'ArrowUp') e.preventDefault();
        heads[idx - 1].scrollIntoView({ behavior: smooth });
      } /* already at the top, ArrowUp scrolls normally (no-op) */
    }
  });
})();
