/*:
 * @plugindesc DZMM 预览/聊天 iframe 内自动等比缩放 1280×720 画面
 * @author dzmm-local
 *
 * @help RPG Maker MV 默认仅在 NW.js/手机开启拉伸；浏览器里会 1:1 像素显示并留黑边。
 * 本插件强制开启 stretch，并在容器尺寸变化时重算缩放。
 */
(function () {
    'use strict';

    Graphics._defaultStretchMode = function () {
        return true;
    };

    var _Graphics_initialize = Graphics.initialize;
    // MZ: SceneManager 检查 Graphics.initialize() 的返回值；丢弃返回值会变成
    // undefined → "Failed to initialize graphics."（MV 不检查，故以前无感）
    Graphics.initialize = function (width, height, type) {
        var ok = _Graphics_initialize.apply(this, arguments);
        this._stretchEnabled = true;
        if (this._updateAllElements) {
            this._updateAllElements();
        }
        return ok;
    };

    function reflow() {
        // DZMM iframe: resize may fire before Graphics.initialize → _errorPrinter is null
        if (!Graphics || !Graphics._canvas || typeof Graphics._updateAllElements !== 'function') {
            return;
        }
        try {
            Graphics._updateAllElements();
        } catch (e) {}
    }

    window.addEventListener('resize', reflow);
    window.addEventListener('orientationchange', reflow);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', reflow);
    }
    if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(reflow);
        document.addEventListener('DOMContentLoaded', function () {
            ro.observe(document.documentElement);
            if (document.body) ro.observe(document.body);
        });
    }
})();
