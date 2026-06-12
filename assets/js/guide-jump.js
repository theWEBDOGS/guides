/* Hub keyboard nav: press 1-9 to open that guide. Bare digits only --
   modifier combos (cmd+1 = browser tabs) pass through untouched. */
document.addEventListener('keydown', function (e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  var t = e.target.tagName;
  if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
  if (!/^[1-9]$/.test(e.key)) return;
  var card = document.querySelectorAll('.cards .card')[+e.key - 1];
  if (card) window.location = card.href;
});
