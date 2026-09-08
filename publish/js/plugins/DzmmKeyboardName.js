/*:
 * @plugindesc DZMM：姓名输入改为键盘/鼠标打字（支持中文输入法）
 * @author dzmm-local
 * @target MZ
 *
 * @help
 * 替换默认五十音/字母盘。保留脸图+下划线编辑窗，下方用 HTML 输入框。
 * Enter / 点击「确定」确认；Esc / 「恢复默认」还原初始名。
 */
(function () {
    "use strict";

    var STYLE_ID = "dzmm-keyboard-name-style";
    var WRAP_ID = "dzmm-keyboard-name-wrap";

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var css = document.createElement("style");
        css.id = STYLE_ID;
        css.textContent =
            "#" +
            WRAP_ID +
            "{position:fixed;z-index:10000;display:flex;flex-direction:column;gap:10px;" +
            "align-items:stretch;box-sizing:border-box;padding:12px 14px;" +
            "background:rgba(20,18,28,0.92);border:2px solid rgba(220,200,255,0.55);" +
            "border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,0.45);}" +
            "#" +
            WRAP_ID +
            " input{width:100%;height:48px;font-size:22px;line-height:48px;" +
            "padding:0 12px;border:1px solid rgba(255,255,255,0.35);border-radius:8px;" +
            "background:#1a1722;color:#f2eaff;outline:none;box-sizing:border-box;" +
            "font-family:GameFont,sans-serif;}" +
            "#" +
            WRAP_ID +
            " input:focus{border-color:#c9a8ff;}" +
            "#" +
            WRAP_ID +
            " .dzmm-kn-hint{color:rgba(255,255,255,0.65);font-size:13px;margin:0;}" +
            "#" +
            WRAP_ID +
            " .dzmm-kn-btns{display:flex;gap:10px;}" +
            "#" +
            WRAP_ID +
            " button{flex:1;min-height:48px;font-size:18px;border:0;border-radius:8px;" +
            "cursor:pointer;font-family:GameFont,sans-serif;}" +
            "#" +
            WRAP_ID +
            " .dzmm-kn-ok{background:#7b5cff;color:#fff;}" +
            "#" +
            WRAP_ID +
            " .dzmm-kn-reset{background:#3a3548;color:#eee;}";
        document.head.appendChild(css);
    }

    function clipName(text, max) {
        text = String(text || "");
        if (max <= 0) return text;
        // 按码点截断，避免拆开代理对
        var chars = Array.from(text);
        return chars.slice(0, max).join("");
    }

    var _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function (event) {
        var el = document.activeElement;
        if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            return;
        }
        _Input_onKeyDown.call(this, event);
    };

    var _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function (event) {
        var el = document.activeElement;
        if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            return;
        }
        _Input_onKeyUp.call(this, event);
    };

    Scene_Name.prototype.createInputWindow = function () {
        ensureStyle();
        this._inputWindow = null;
        this.createKeyboardPanel();
    };

    Scene_Name.prototype.editWindowRect = function () {
        var padding = $gameSystem.windowPadding();
        var ww = 600;
        var wh = ImageManager.standardFaceHeight + padding * 2;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = Math.max(48, (Graphics.boxHeight - (wh + 160)) / 2);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Name.prototype.createKeyboardPanel = function () {
        this.removeKeyboardPanel();
        var wrap = document.createElement("div");
        wrap.id = WRAP_ID;

        var hint = document.createElement("p");
        hint.className = "dzmm-kn-hint";
        hint.textContent = "点击输入框打字（可用输入法），最多 " + this._maxLength + " 字";
        wrap.appendChild(hint);

        var input = document.createElement("input");
        input.type = "text";
        input.maxLength = this._maxLength;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.value = this._editWindow.name();
        input.placeholder = "输入名字";
        wrap.appendChild(input);

        var btns = document.createElement("div");
        btns.className = "dzmm-kn-btns";
        var ok = document.createElement("button");
        ok.type = "button";
        ok.className = "dzmm-kn-ok";
        ok.textContent = "确定";
        var reset = document.createElement("button");
        reset.type = "button";
        reset.className = "dzmm-kn-reset";
        reset.textContent = "恢复默认";
        btns.appendChild(ok);
        btns.appendChild(reset);
        wrap.appendChild(btns);

        document.body.appendChild(wrap);
        this._dzmmNameWrap = wrap;
        this._dzmmNameInput = input;

        var self = this;
        var syncFromInput = function () {
            var name = clipName(input.value, self._maxLength);
            if (input.value !== name) input.value = name;
            self._editWindow._name = name;
            self._editWindow._index = name.length;
            self._editWindow.refresh();
        };

        input.addEventListener("input", syncFromInput);
        input.addEventListener("compositionend", syncFromInput);
        input.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter") {
                ev.preventDefault();
                self.commitKeyboardName();
            } else if (ev.key === "Escape") {
                ev.preventDefault();
                self.restoreKeyboardDefault();
            }
        });
        ok.addEventListener("click", function (ev) {
            ev.preventDefault();
            self.commitKeyboardName();
        });
        reset.addEventListener("click", function (ev) {
            ev.preventDefault();
            self.restoreKeyboardDefault();
        });

        this.layoutKeyboardPanel();
        setTimeout(function () {
            try {
                input.focus();
                input.select();
            } catch (e) {}
        }, 50);
    };

    Scene_Name.prototype.layoutKeyboardPanel = function () {
        if (!this._dzmmNameWrap || !this._editWindow) return;
        var canvas = document.querySelector("canvas");
        var scaleX = 1;
        var scaleY = 1;
        var left = 0;
        var top = 0;
        if (canvas) {
            var rect = canvas.getBoundingClientRect();
            left = rect.left;
            top = rect.top;
            scaleX = rect.width / Graphics.boxWidth;
            scaleY = rect.height / Graphics.boxHeight;
        }
        var ew = this._editWindow;
        var x = left + ew.x * scaleX;
        var y = top + (ew.y + ew.height + 10) * scaleY;
        var w = Math.max(280, ew.width * scaleX);
        var wrap = this._dzmmNameWrap;
        wrap.style.left = Math.round(x) + "px";
        wrap.style.top = Math.round(y) + "px";
        wrap.style.width = Math.round(w) + "px";
    };

    Scene_Name.prototype.restoreKeyboardDefault = function () {
        if (!this._editWindow) return;
        this._editWindow.restoreDefault();
        if (this._dzmmNameInput) {
            this._dzmmNameInput.value = this._editWindow.name();
            try {
                this._dzmmNameInput.focus();
            } catch (e) {}
        }
        SoundManager.playCancel();
    };

    Scene_Name.prototype.commitKeyboardName = function () {
        if (!this._editWindow) return;
        if (this._dzmmNameInput) {
            var name = clipName(this._dzmmNameInput.value, this._maxLength);
            this._editWindow._name = name;
            this._editWindow._index = name.length;
        }
        if (!this._editWindow.name()) {
            SoundManager.playBuzzer();
            try {
                this._dzmmNameInput && this._dzmmNameInput.focus();
            } catch (e) {}
            return;
        }
        SoundManager.playOk();
        this.onInputOk();
    };

    Scene_Name.prototype.removeKeyboardPanel = function () {
        var wrap = this._dzmmNameWrap || document.getElementById(WRAP_ID);
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        this._dzmmNameWrap = null;
        this._dzmmNameInput = null;
    };

    var _Scene_Name_start = Scene_Name.prototype.start;
    Scene_Name.prototype.start = function () {
        _Scene_Name_start.call(this);
        this.layoutKeyboardPanel();
    };

    var _Scene_Name_terminate = Scene_Name.prototype.terminate;
    Scene_Name.prototype.terminate = function () {
        this.removeKeyboardPanel();
        if (typeof _Scene_Name_terminate === "function") {
            _Scene_Name_terminate.call(this);
        }
    };

    var _Scene_Name_update = Scene_Name.prototype.update;
    Scene_Name.prototype.update = function () {
        _Scene_Name_update.call(this);
        if (Graphics._dzmmKnLastW !== Graphics.boxWidth ||
            Graphics._dzmmKnLastH !== Graphics.boxHeight) {
            Graphics._dzmmKnLastW = Graphics.boxWidth;
            Graphics._dzmmKnLastH = Graphics.boxHeight;
            this.layoutKeyboardPanel();
        }
    };
})();
