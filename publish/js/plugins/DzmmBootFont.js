/*:
 * @plugindesc DZMM：GameFont 加载超时则继续启动，避免卡在 Now Loading
 * @author dzmm-local
 *
 * @help 云预览若自定义字体缺失/过大，CSS Font Loading 会永远 check 失败。
 * 超时后强制进入标题（系统字体兜底）。
 */
(function () {
    'use strict';

    var TIMEOUT_MS = 2500;

    var _isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function () {
        if (_isGameFontLoaded.call(this)) return true;
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= TIMEOUT_MS) {
            if (!this._dzmmFontWarned) {
                this._dzmmFontWarned = true;
                console.warn('[DzmmBootFont] GameFont not ready after ' + TIMEOUT_MS + 'ms, continuing');
            }
            return true;
        }
        return false;
    };
})();
