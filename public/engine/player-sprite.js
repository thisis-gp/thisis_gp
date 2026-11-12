// Character Lab hook: replaces the player cells of spritesheet.png / bigSpritesheet.png at runtime.
// Message: { type: "player-sprite", png: "data:image/png;base64,..." } with a 48x16 sheet (stand, step L, step R).
// The engine mirrors the player with a negative scale, so frames must face right and are not flipped here.
(function () {
  var FRAME = 16;
  // sheet cell index -> character frame (0 stand, 1 step, 2 step other leg), from Prefabs.generateMario()
  var SMALL = { path: 'assets/images/spritesheet.png', cols: 14, cellH: 16, map: { 0: 0, 2: 1, 3: 2, 4: 0, 5: 0, 6: 0 } };
  var BIG = { path: 'assets/images/bigSpritesheet.png', cols: 21, cellH: 32,
    map: { 0: 0, 1: 1, 2: 2, 3: 1, 4: 0, 5: 0, 21: 0, 22: 1, 23: 2, 24: 1, 25: 0, 26: 0 } };
  var pending = null;
  var base = {};   // untouched originals, so repeated swaps never stack

  function repaint(sheet, character) {
    var gl = window.__gl, tex = window.__texByPath && window.__texByPath[sheet.path], src = window.__assets.img[sheet.path];
    if (!gl || !tex || !src) return false;
    var c = document.createElement('canvas'); c.width = src.naturalWidth; c.height = src.naturalHeight;
    var g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(src, 0, 0);
    Object.keys(sheet.map).forEach(function (i) {
      var x = (i % sheet.cols) * FRAME, y = Math.floor(i / sheet.cols) * sheet.cellH;
      g.clearRect(x, y, FRAME, sheet.cellH);
      g.drawImage(character, sheet.map[i] * FRAME, 0, FRAME, FRAME, x, y, FRAME, sheet.cellH);  // 16x32 cells: nearest-neighbour stretch
    });
    var prev = gl.getParameter(gl.TEXTURE_BINDING_2D);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);   // same as the shim's stb-style upload
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, prev);
    return true;
  }
  function apply(character) { return repaint(SMALL, character) & repaint(BIG, character); }

  window.__applyPendingPlayerSprite = function () { if (pending) { apply(pending); } };

  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin || !e.data || e.data.type !== 'player-sprite') return;
    if (typeof e.data.png !== 'string' || e.data.png.indexOf('data:image/png;base64,') !== 0) return;
    var img = new Image();
    img.onload = function () {
      if (img.naturalWidth !== FRAME * 3 || img.naturalHeight !== FRAME) { console.warn('player-sprite: expected 48x16 PNG'); return; }
      pending = img; apply(img);
    };
    img.src = e.data.png;
  });
})();
