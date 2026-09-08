//=============================================================================
// DzmmTouchUi.js
//=============================================================================
/*:
 * @plugindesc DZMM：返回键 + 列表拖动 + 小游戏鼠标左右键热区
 * @author DZMM
 *
 * @help
 * - 右下「返回」：一次性取消
 * - 列表上下拖动滚动；松手且未拖动才点选
 * - 点活动窗口外：取消
 * - 小游戏中：点画面上的鼠标图标 = 左键/右键（触屏无实体右键）
 *   · 打扫：点 0_Mouse_Icon 图 = 左键
 *   · 分类：点背景里左/右鼠标图标 = 左键/右键（图标画在 0_Bg 上）
 * - ?notouchui=1 隐藏 UI
 */

(function () {
  "use strict";

  var DRAG_THRESH = 16;
  var ROW_PX = 36;
  var BACK_ID = "dzmm-touch-back";
  var ZONE_L_ID = "dzmm-mouse-left";
  var ZONE_R_ID = "dzmm-mouse-right";
  var pendingCancel = false;
  var pendingTrigger = false;
  var uiBlockFrames = 0;
  var UI_COOLDOWN_MS = 220;

  // 小游戏开关（与 CommonEvents 一致）
  var SW_GARBAGE_CLICK = 122;
  var SW_GARBAGE_ANI = 121;
  var SW_RECYCLE_BAG = 127;
  var SW_RECYCLE_IN1 = 128;
  var SW_RECYCLE_IN2 = 129;
  var SW_RECYCLE_IN3 = 130;
  var SW_RECYCLE_CD = 132;

  // 分类背景 0_Bg 上鼠标图标像素框（1440×810，略放大便于点按）
  var RECYCLE_MOUSE_L = { x: 28, y: 492, w: 72, h: 88 };
  var RECYCLE_MOUSE_R = { x: 996, y: 492, w: 72, h: 88 };

  function touchUiDisabled() {
    return /(?:^|[?&])notouchui=1(?:&|$)/.test(location.search || "");
  }

  function currentSceneName() {
    try {
      return SceneManager._scene && SceneManager._scene.constructor
        ? SceneManager._scene.constructor.name
        : "";
    } catch (e) {
      return "";
    }
  }

  function isTitleScene() {
    return currentSceneName() === "Scene_Title";
  }

  function swOn(id) {
    try {
      return !!(
        typeof $gameSwitches !== "undefined" &&
        $gameSwitches &&
        $gameSwitches.value(id)
      );
    } catch (e) {
      return false;
    }
  }

  /** @returns {"garbage"|"recycle"|null} */
  function mouseMinigameMode() {
    if (
      swOn(SW_RECYCLE_BAG) ||
      swOn(SW_RECYCLE_IN1) ||
      swOn(SW_RECYCLE_IN2) ||
      swOn(SW_RECYCLE_IN3) ||
      swOn(SW_RECYCLE_CD)
    ) {
      return "recycle";
    }
    if (swOn(SW_GARBAGE_CLICK) || swOn(SW_GARBAGE_ANI)) {
      return "garbage";
    }
    return null;
  }

  function requestCancel() {
    pendingCancel = true;
    uiBlockFrames = 8;
  }

  function requestLeftClick() {
    pendingTrigger = true;
    uiBlockFrames = 6;
  }

  function requestRightClick() {
    pendingCancel = true;
    uiBlockFrames = 6;
  }

  function injectCancelOnce() {
    if (!pendingCancel) return;
    pendingCancel = false;
    try {
      if (TouchInput && TouchInput._newState) {
        TouchInput._newState.cancelled = true;
      } else if (TouchInput && TouchInput._events) {
        TouchInput._events.cancelled = true;
      }
    } catch (e) {}
  }

  function injectTriggerOnce() {
    if (!pendingTrigger) return;
    pendingTrigger = false;
    try {
      if (TouchInput && TouchInput._newState) {
        TouchInput._newState.triggered = true;
        TouchInput._newState.pressed = true;
      } else if (TouchInput && TouchInput._events) {
        TouchInput._events.triggered = true;
        TouchInput._events.pressed = true;
      }
    } catch (e) {}
  }

  function bindTapOnce(btn, handler) {
    var lastAt = 0;
    function onUi(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      var now = Date.now();
      if (now - lastAt < UI_COOLDOWN_MS) return;
      lastAt = now;
      handler();
    }
    btn.addEventListener("pointerup", onUi, { passive: false });
    btn.addEventListener(
      "pointerdown",
      function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      },
      { passive: false }
    );
    btn.addEventListener(
      "click",
      function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      },
      true
    );
  }

  function ensureBackButton() {
    if (document.getElementById(BACK_ID)) return;
    var btn = document.createElement("button");
    btn.id = BACK_ID;
    btn.type = "button";
    btn.textContent = "返回";
    btn.setAttribute("aria-label", "返回");
    btn.style.cssText = [
      "position:fixed",
      "z-index:99999",
      "right:10px",
      "bottom:10px",
      "min-width:64px",
      "height:40px",
      "padding:0 14px",
      "border:1px solid rgba(255,255,255,.35)",
      "border-radius:10px",
      "background:rgba(0,0,0,.62)",
      "color:#fff",
      "font:600 15px/40px sans-serif",
      "letter-spacing:.05em",
      "-webkit-tap-highlight-color:transparent",
      "touch-action:manipulation",
      "user-select:none",
      "display:none",
      "pointer-events:auto",
      "box-shadow:0 2px 8px rgba(0,0,0,.35)",
    ].join(";");
    bindTapOnce(btn, requestCancel);
    document.body.appendChild(btn);
  }

  function makeHitZone(id, aria) {
    var el = document.getElementById(id);
    if (el) return el;
    el = document.createElement("button");
    el.id = id;
    el.type = "button";
    el.textContent = "";
    el.setAttribute("aria-label", aria);
    el.style.cssText = [
      "position:fixed",
      "z-index:99990",
      "border:none",
      "border-radius:8px",
      "background:transparent",
      "opacity:0.01",
      "padding:0",
      "margin:0",
      "min-width:0",
      "-webkit-tap-highlight-color:transparent",
      "touch-action:manipulation",
      "user-select:none",
      "display:none",
      "pointer-events:auto",
    ].join(";");
    document.body.appendChild(el);
    return el;
  }

  function ensureMouseZones() {
    var L = makeHitZone(ZONE_L_ID, "鼠标左键");
    var R = makeHitZone(ZONE_R_ID, "鼠标右键");
    if (!L._dzmmBound) {
      bindTapOnce(L, requestLeftClick);
      L._dzmmBound = true;
    }
    if (!R._dzmmBound) {
      bindTapOnce(R, requestRightClick);
      R._dzmmBound = true;
    }
  }

  function canvasScreenRect() {
    var canvas = Graphics && (Graphics._canvas || Graphics.canvas);
    if (!canvas || !canvas.getBoundingClientRect) return null;
    return canvas.getBoundingClientRect();
  }

  function placeOverGame(el, gx, gy, gw, gh) {
    var rect = canvasScreenRect();
    if (!rect || !Graphics) {
      el.style.display = "none";
      return;
    }
    var sx = rect.width / Graphics.width;
    var sy = rect.height / Graphics.height;
    el.style.display = "block";
    el.style.left = Math.round(rect.left + gx * sx) + "px";
    el.style.top = Math.round(rect.top + gy * sy) + "px";
    el.style.width = Math.max(44, Math.round(gw * sx)) + "px";
    el.style.height = Math.max(44, Math.round(gh * sy)) + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  }

  function findMouseIconPicture() {
    try {
      if (!$gameScreen) return null;
      for (var i = 1; i < 200; i++) {
        var pic = $gameScreen.picture(i);
        if (!pic) continue;
        var name = pic.name() || "";
        if (/Mouse_Icon/i.test(name) || /\/0_Mouse/i.test(name)) {
          return { id: i, pic: pic, name: name };
        }
      }
    } catch (e) {}
    return null;
  }

  function updateMouseZones() {
    ensureMouseZones();
    var L = document.getElementById(ZONE_L_ID);
    var R = document.getElementById(ZONE_R_ID);
    var mode = mouseMinigameMode();
    var hide = touchUiDisabled() || isTitleScene() || !mode;

    if (hide) {
      if (L) L.style.display = "none";
      if (R) R.style.display = "none";
      return;
    }

    if (mode === "recycle") {
      // 点背景里画好的左右鼠标图标
      placeOverGame(L, RECYCLE_MOUSE_L.x, RECYCLE_MOUSE_L.y, RECYCLE_MOUSE_L.w, RECYCLE_MOUSE_L.h);
      placeOverGame(R, RECYCLE_MOUSE_R.x, RECYCLE_MOUSE_R.y, RECYCLE_MOUSE_R.w, RECYCLE_MOUSE_R.h);
      return;
    }

    // 打扫：叠在 0_Mouse_Icon 图片上
    if (R) R.style.display = "none";
    var icon = findMouseIconPicture();
    if (icon && icon.pic) {
      var x = icon.pic.x();
      var y = icon.pic.y();
      var sc = (icon.pic.scaleX ? icon.pic.scaleX() : 100) / 100;
      var iw = Math.max(56, Math.round(90 * sc));
      var ih = Math.max(56, Math.round(110 * sc));
      placeOverGame(L, x, y, iw, ih);
    } else {
      // 兜底：原版图标默认位置 (987,580)
      placeOverGame(L, 980, 570, 70, 90);
    }
  }

  function updateBackButton() {
    var back = document.getElementById(BACK_ID);
    if (!back) return;
    var hide = touchUiDisabled() || isTitleScene();
    back.style.display = hide ? "none" : "block";
  }

  // 去掉确认键（若旧会话残留）
  function removeOkButton() {
    var ok = document.getElementById("dzmm-touch-ok");
    if (ok && ok.parentNode) ok.parentNode.removeChild(ok);
  }

  var _SceneManager_updateMain = SceneManager.updateMain;
  SceneManager.updateMain = function () {
    ensureBackButton();
    ensureMouseZones();
    removeOkButton();
    updateBackButton();
    updateMouseZones();
    injectCancelOnce();
    injectTriggerOnce();
    if (uiBlockFrames > 0) uiBlockFrames -= 1;
    _SceneManager_updateMain.apply(this, arguments);
  };

  // MV: Window_Selectable.onTouch；MZ 勿整段覆盖 processTouch
  if (typeof Window_Selectable.prototype.onTouch === "function") {
    Window_Selectable.prototype.processTouch = function () {
      if (!this.isOpenAndActive()) {
        this._dzmmDrag = null;
        this._touching = false;
        return;
      }

      if (uiBlockFrames > 0) {
        this._dzmmDrag = null;
        this._touching = false;
        if (TouchInput.isCancelled() && this.isCancelEnabled()) {
          this.processCancel();
        }
        return;
      }

      if (TouchInput.isCancelled()) {
        this._dzmmDrag = null;
        this._touching = false;
        if (this.isCancelEnabled()) this.processCancel();
        return;
      }

      if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        this._dzmmDrag = {
          y: TouchInput.y,
          scrolled: false,
          acc: 0,
          moved: false,
        };
        this._touching = true;
        this.onTouch(false);
        return;
      }

      if (this._dzmmDrag && TouchInput.isPressed()) {
        var dy = this._dzmmDrag.y - TouchInput.y;
        if (Math.abs(dy) >= DRAG_THRESH) {
          this._dzmmDrag.scrolled = true;
          this._dzmmDrag.moved = true;
          this._dzmmDrag.acc += dy;
          this._dzmmDrag.y = TouchInput.y;
          while (this._dzmmDrag.acc >= ROW_PX) {
            this.scrollDown();
            this._dzmmDrag.acc -= ROW_PX;
          }
          while (this._dzmmDrag.acc <= -ROW_PX) {
            this.scrollUp();
            this._dzmmDrag.acc += ROW_PX;
          }
        }
        return;
      }

      if (this._dzmmDrag && !TouchInput.isPressed()) {
        var wasScroll = this._dzmmDrag.scrolled;
        this._dzmmDrag = null;
        this._touching = false;
        if (!wasScroll) {
          this.onTouch(true);
        }
        return;
      }

      if (TouchInput.isTriggered() && !this.isTouchedInsideFrame()) {
        if (this.isCancelEnabled()) this.processCancel();
      }
    };
  } else if (
    typeof Window_Selectable !== "undefined" &&
    Window_Selectable.prototype.onTouchOk
  ) {
    // MZ：拖动滚动，拖过则不点选
    var _MZ_update = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function () {
      _MZ_update.apply(this, arguments);
      if (!this.isOpenAndActive() || uiBlockFrames > 0) {
        this._dzmmDrag = null;
        return;
      }
      if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        this._dzmmDrag = { y: TouchInput.y, scrolled: false, acc: 0 };
        this._dzmmDragScrolled = false;
      } else if (this._dzmmDrag && TouchInput.isPressed()) {
        var ddy = this._dzmmDrag.y - TouchInput.y;
        if (Math.abs(ddy) >= DRAG_THRESH) {
          this._dzmmDrag.scrolled = true;
          this._dzmmDragScrolled = true;
          this._dzmmDrag.acc += ddy;
          this._dzmmDrag.y = TouchInput.y;
          while (this._dzmmDrag.acc >= ROW_PX) {
            if (this.scrollDown) this.scrollDown();
            this._dzmmDrag.acc -= ROW_PX;
          }
          while (this._dzmmDrag.acc <= -ROW_PX) {
            if (this.scrollUp) this.scrollUp();
            this._dzmmDrag.acc += ROW_PX;
          }
        }
      } else if (this._dzmmDrag && !TouchInput.isPressed()) {
        this._dzmmDrag = null;
      }
    };
    var _MZ_onTouchOk = Window_Selectable.prototype.onTouchOk;
    Window_Selectable.prototype.onTouchOk = function () {
      if (this._dzmmDragScrolled) {
        this._dzmmDragScrolled = false;
        return;
      }
      _MZ_onTouchOk.apply(this, arguments);
    };
  }
})();
