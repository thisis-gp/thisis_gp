// Browser glue for the TeaVM build of the engine: WebGL2 context, preloaded assets, keyboard, Web Audio.
(function () {
  var IMAGES = ['assets/images/bigSpritesheet.png', 'assets/images/items.png', 'assets/images/pipes.png',
    'assets/images/spritesheet.png', 'assets/images/spritesheets/decorationsAndBlocks.png', 'assets/images/turtle.png'];
  var TEXTS = ['assets/shaders/default.glsl', 'level.txt'];
  var SOUNDS = ['break_block', 'bump', 'coin', 'flagpole', 'gameover', 'invincible', 'jump-small', 'kick',
    'main-theme-overworld', 'mario_die', 'pipe', 'powerup', 'powerup_appears', 'stage_clear', 'stomp']
    .map(function (n) { return 'assets/sounds/' + n + '.ogg'; });
  var KEYMAP = { ArrowRight: 262, ArrowLeft: 263, ArrowDown: 264, ArrowUp: 265, Space: 32, KeyA: 65, KeyD: 68, KeyE: 69, KeyW: 87, KeyS: 83 };
  var GAME_ASPECT = 16 / 9;

  var status = document.getElementById('status');
  var canvas = document.getElementById('game');
  function fail(msg) { status.hidden = false; status.textContent = msg; status.className = 'error'; console.error(msg); }

  window.__H = [null];          // handle table shared with the Java GL shim (index 0 means "none")
  window.__assets = { text: {}, img: {} };
  window.__keyq = [];

  // GLSL 330 core -> 300 es: version line must come first, fragment shaders need default precision.
  window.__toEs300 = function (src) {
    return src.replace(/^\s+/, '').replace(/([<>]=?)\s*(\d+)(?![\d.])/g, '$1 $2.0').replace('#version 330 core', '#version 300 es\nprecision highp float;\nprecision highp int;');
  };

  var gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
  if (!gl) { fail('WebGL2 is not available in this browser.'); return; }
  window.__gl = gl;

  window.__beginFrame = function (r, g, b, a) {
    var dpr = window.devicePixelRatio || 1;
    var w = Math.max(1, Math.floor(canvas.clientWidth * dpr)), h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var vw = w, vh = Math.floor(w / GAME_ASPECT);
    if (vh > h) { vh = h; vw = Math.floor(h * GAME_ASPECT); }
    var vx = Math.floor((w - vw) / 2), vy = Math.floor((h - vh) / 2);
    gl.viewport(vx, vy, vw, vh);
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(vx, vy, vw, vh);
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  // ---- keyboard (queued; Java drains it once per frame into KeyListener) ----
  var down = {};
  window.addEventListener('keydown', function (e) {
    var k = KEYMAP[e.code]; if (k === undefined) return;
    e.preventDefault(); resumeAudio();
    if (!down[k]) { down[k] = true; window.__keyq.push(k, 1); }
  });
  window.addEventListener('keyup', function (e) {
    var k = KEYMAP[e.code]; if (k === undefined) return;
    e.preventDefault();
    if (down[k]) { down[k] = false; window.__keyq.push(k, 0); }
  });
  window.addEventListener('blur', function () {
    Object.keys(down).forEach(function (k) { if (down[k]) { down[k] = false; window.__keyq.push(+k, 0); } });
  });
  window.addEventListener('pointerdown', resumeAudio);

  // ---- audio ----
  var actx = null, buffers = {}, defs = {}, playing = {};
  window.__audioCtx = function () { return actx; };
  function ctx() { if (!actx) { var C = window.AudioContext || window.webkitAudioContext; if (C) actx = new C(); } return actx; }
  function resumeAudio() { var c = ctx(); if (c && c.state === 'suspended') c.resume(); }
  window.__sound = {
    register: function (p, loops) { defs[p] = { loops: loops }; },
    play: function (p) {
      var c = ctx(), buf = buffers[p], d = defs[p];
      if (!c || !buf || !d || playing[p]) return;
      var src = c.createBufferSource(), gain = c.createGain();
      src.buffer = buf; src.loop = d.loops; gain.gain.value = 0.3;
      src.connect(gain); gain.connect(c.destination);
      src.onended = function () { if (playing[p] === src) playing[p] = null; };
      playing[p] = src; src.start();
    },
    stop: function (p) { var s = playing[p]; if (s) { playing[p] = null; try { s.stop(); } catch (e) { } } },
    isPlaying: function (p) { return !!playing[p]; }
  };
  function loadSound(p) {
    return fetch(p).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
      var c = ctx(); if (!c) return;
      return new Promise(function (res) { c.decodeAudioData(ab, function (b) { buffers[p] = b; res(); }, function () { res(); }); });
    }).catch(function () { });
  }

  function loadImage(p) {
    return new Promise(function (res, rej) {
      var img = new Image(); img.onload = function () { window.__assets.img[p] = img; res(); };
      img.onerror = function () { rej(new Error('Could not load ' + p)); }; img.src = p;
    });
  }
  function loadText(p) {
    return fetch(p).then(function (r) { if (!r.ok) throw new Error('Could not load ' + p); return r.text(); })
      .then(function (t) { window.__assets.text[p] = t; });
  }

  var must = IMAGES.map(loadImage).concat(TEXTS.map(loadText));
  Promise.all(must).then(function () {
    status.hidden = true;
    main([]);                      // TeaVM entry point: starts the level
    window.__applyPendingPlayerSprite && window.__applyPendingPlayerSprite();
    SOUNDS.forEach(function (p) { loadSound(p); });  // effects decode in the background
  }).catch(function (e) { fail(String(e && e.message || e)); });

  window.addEventListener('error', function (e) { console.error('engine error: ' + e.message); });
})();
