/* Site-wide keyboard navigation, the complete loop:
     1-9            -> open that guide (hub order: most recently verified first)
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

  /* Position-based jumping (NOT the trail's 35% reading-line — with short
     sections the next heading is already past that line after a jump, which
     made arrows skip sections). "Next" = first heading meaningfully below
     the viewport top (70px clears both scroll-margins: 26 desktop / 64
     mobile); "previous" = last heading scrolled above it, falling back to
     page top. Returns true when it navigated (callers preventDefault then). */
  function jumpNext() {
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top > 70) {
        heads[i].scrollIntoView({ behavior: smooth });
        return true;
      }
    }
    return false; /* nothing below — let native scrolling take over */
  }
  function jumpPrev() {
    var target = null;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top < -5) target = heads[i];
    }
    if (target) { target.scrollIntoView({ behavior: smooth }); return true; }
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: smooth });
      return true;
    }
    return false; /* already at the top — native behavior */
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
      if (jumpNext() && e.key === 'ArrowDown') e.preventDefault();

    } else if ((e.key === 'ArrowUp' || e.key === 'k') && heads.length) {
      if (jumpPrev() && e.key === 'ArrowUp') e.preventDefault();
    }
  });
})();
