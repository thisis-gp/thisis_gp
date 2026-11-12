// Esc pauses and resumes the game. The engine is driven by requestAnimationFrame, so pausing means holding
// the next frame callback until the player resumes. Audio is suspended with it.
(function () {
  var realRAF = window.requestAnimationFrame.bind(window);
  var paused = false;
  var held = null;

  window.requestAnimationFrame = function (cb) {
    return realRAF(function (t) {
      if (paused) { held = cb; return; }
      cb(t);
    });
  };

  var overlay = document.createElement('div');
  overlay.setAttribute('role', 'status');
  overlay.style.cssText = 'position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(16,20,30,.62);color:#faf8f4;font:700 clamp(32px,7vw,72px)/1 system-ui,sans-serif;letter-spacing:-.04em;cursor:pointer;z-index:10';
  overlay.innerHTML = 'Paused<span style="font:500 clamp(14px,2vw,20px)/1.2 system-ui,sans-serif;letter-spacing:0">Press Esc or click to resume</span>';
  document.body.appendChild(overlay);

  // inside the portfolio page the keys are listed under the game, so the built-in hint would only sit under the touch buttons
  if (window.parent !== window) { var hint = document.getElementById('hint'); if (hint) hint.style.display = 'none'; }

  function audio() { return typeof window.__audioCtx === 'function' ? window.__audioCtx() : null; }

  function setPaused(next) {
    if (next === paused) return;
    paused = next;
    overlay.style.display = paused ? 'flex' : 'none'; // an inline display would beat the hidden attribute
    var a = audio();
    if (paused) {
      if (a && a.state === 'running') a.suspend();
    } else {
      if (a && a.state === 'suspended') a.resume();
      var cb = held; held = null;
      if (cb) realRAF(cb);
    }
  }

  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.repeat) return;
    e.preventDefault();
    setPaused(!paused);
  });
  overlay.addEventListener('pointerdown', function () { setPaused(false); });

  // the page around the game can toggle it too (for example when the page, not the game, has the focus)
  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin || !e.data || e.data.type !== 'toggle-pause') return;
    setPaused(!paused);
  });
})();
