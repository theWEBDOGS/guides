// One-click copy on every fenced code block. The guides' Terminal steps are
// written as "paste this whole block" — this button is that affordance.
document.querySelectorAll('div.highlighter-rouge').forEach(function (block) {
  var code = block.querySelector('code');
  if (!code) return;
  var btn = document.createElement('button');
  btn.className = 'copy';
  btn.type = 'button';
  btn.textContent = '⧉ COPY';
  btn.addEventListener('click', function () {
    var text = code.innerText.replace(/\n$/, '');
    var done = function () {
      btn.textContent = '✓ COPIED';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = '⧉ COPY';
        btn.classList.remove('copied');
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }
  });
  block.classList.add('has-copy');
  block.appendChild(btn);
});
