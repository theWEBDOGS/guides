/* Site-wide digit-row navigation, the complete loop:
     1-9  -> open that guide (hub order: title sort)
     0 / Left-arrow -> back to the guides hub
   Bare keys only -- modifier combos (cmd+1 tabs, cmd+left history) pass
   through, as do editable targets. Up/Down are never touched: they scroll. */
(function () {
  var guides = window.GUIDES || [];
  var home = '/';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    if (/^[1-9]$/.test(e.key)) {
      var url = guides[+e.key - 1];
      if (url && location.pathname !== url) window.location = url;
    } else if (e.key === '0' || e.key === 'ArrowLeft') {
      if (location.pathname !== home) window.location = home;
    }
  });
})();
