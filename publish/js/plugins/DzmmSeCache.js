/*:
 * @plugindesc DZMM：SE 内存复用，减少反复打 CDN
 * @author dzmm-local
 *
 * @help
 * RPGMZ 每次 playSe 都会 new WebAudio 再请求 URL。
 * 本插件对 SE 做常驻缓存：同名音效已就绪则复用（可重叠时另开一份）。
 * 需放在靠前位置；配合 R2 Cache-Control 进一步降 Class B。
 */
(function () {
    'use strict';

    if (typeof AudioManager === 'undefined') return;

    AudioManager._dzmmSeCache = AudioManager._dzmmSeCache || Object.create(null);
    var MAX_CACHED = 64;

    function cacheKey(folder, name) {
        return String(folder || '') + '\0' + String(name || '');
    }

    function isSeFolder(folder) {
        return folder === 'se/' || folder === 'se';
    }

    function trimCache() {
        var keys = Object.keys(AudioManager._dzmmSeCache);
        if (keys.length <= MAX_CACHED) return;
        // drop oldest insertion order (approx)
        var drop = keys.length - MAX_CACHED;
        for (var i = 0; i < drop; i++) {
            var k = keys[i];
            var buf = AudioManager._dzmmSeCache[k];
            try {
                if (buf && !buf.isPlaying()) buf.destroy();
            } catch (e) {}
            delete AudioManager._dzmmSeCache[k];
        }
    }

    var _createBuffer = AudioManager.createBuffer;
    AudioManager.createBuffer = function (folder, name) {
        if (!isSeFolder(folder) || !name) {
            return _createBuffer.call(this, folder, name);
        }
        var key = cacheKey(folder, name);
        var cached = this._dzmmSeCache[key];
        if (cached) {
            var ready = true;
            try {
                ready = !cached.isError || !cached.isError();
                if (typeof cached.isReady === 'function') ready = ready && cached.isReady();
            } catch (e) {}
            if (ready) {
                if (!cached.isPlaying()) {
                    cached.frameCount = Graphics.frameCount;
                    cached.name = name;
                    return cached;
                }
                // overlapping same SE: still create another instance (HTTP cache helps)
            }
        }
        var buffer = _createBuffer.call(this, folder, name);
        if (!cached || (cached.isError && cached.isError())) {
            this._dzmmSeCache[key] = buffer;
            trimCache();
        }
        return buffer;
    };

    var _cleanupSe = AudioManager.cleanupSe;
    AudioManager.cleanupSe = function () {
        // 不 destroy 已缓存的 SE，只从播放列表摘掉播完的
        var keep = [];
        for (var i = 0; i < this._seBuffers.length; i++) {
            var buffer = this._seBuffers[i];
            if (!buffer) continue;
            if (buffer.isPlaying()) {
                keep.push(buffer);
                continue;
            }
            var cached = false;
            var keys = Object.keys(this._dzmmSeCache);
            for (var j = 0; j < keys.length; j++) {
                if (this._dzmmSeCache[keys[j]] === buffer) {
                    cached = true;
                    break;
                }
            }
            if (!cached) {
                try {
                    buffer.destroy();
                } catch (e) {}
            }
        }
        this._seBuffers = keep;
    };

    var _stopSe = AudioManager.stopSe;
    AudioManager.stopSe = function () {
        for (var i = 0; i < this._seBuffers.length; i++) {
            var buffer = this._seBuffers[i];
            try {
                if (buffer && buffer.stop) buffer.stop();
            } catch (e) {}
        }
        this._seBuffers = [];
        // 保留 _dzmmSeCache
    };
})();
