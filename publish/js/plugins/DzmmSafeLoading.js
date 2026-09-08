/*:
 * @plugindesc DZMM：Loading 防崩 + 图/音/解密立绘重试；WEBP MIME；延迟 revoke（防女主 ANI 黑块）
 * @author dzmm-local
 *
 * @help
 * - Graphics._paintUpperCanvas / Bitmap.getPixel：破图不崩
 * - 加密图 / WebAudio：失败自动重试
 * - 解密后按文件头设 Blob MIME（WEBP/PNG），避免部分浏览器解不出立绘/性交 ANI
 * - 延迟 revokeObjectURL，避免 Safari/WebView 在 texImage2D 前像素被丢 → 黑框
 * - Poses/Sex、Idle 等大体积 [ANI] 表优先多轮重试
 */

(function () {
    "use strict";

    var IMG_RETRY = 8;
    var AUD_RETRY = 6;
    var RETRY_BASE_MS = 200;
    var REVOKE_DELAY_MS = 12000;

    function imageReady(img) {
        return !!(img && img.complete && img.naturalWidth > 0);
    }

    function detectMime(buffer) {
        if (!buffer || buffer.byteLength < 12) return "";
        var bytes = new Uint8Array(buffer, 0, 12);
        var ascii = String.fromCharCode.apply(null, bytes);
        if (ascii.indexOf("\x89PNG") === 0) return "image/png";
        if (ascii.indexOf("RIFF") === 0 && ascii.slice(8, 12) === "WEBP") {
            return "image/webp";
        }
        if (ascii.indexOf("GIF8") === 0) return "image/gif";
        if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
        return "";
    }

    function isBustLikeUrl(url) {
        var s = String(url || "");
        // 用户反馈缺失最多：房间性交姿势表 Poses/Sex/*[ANI]*、女主 Idle 立绘
        return (
            /\/img\/pictures\/Poses\/Sex\//i.test(s) ||
            /Poses\/Sex\//i.test(s) ||
            /\/img\/pictures\/Idle\//i.test(s) ||
            /Idle\/Ayane_/i.test(s) ||
            /\[ANI\]/i.test(s) ||
            /Scene_Ayane_/i.test(s)
        );
    }

    function priorityRetryMax(url) {
        // 性交姿势表体积大（常 200KB+），弱网更容易中断
        if (/Poses\/Sex\//i.test(String(url || ""))) {
            return IMG_RETRY + 4;
        }
        if (isBustLikeUrl(url)) {
            return IMG_RETRY + 2;
        }
        return IMG_RETRY;
    }

    var _paint = Graphics._paintUpperCanvas;
    if (typeof _paint === "function") {
        Graphics._paintUpperCanvas = function () {
            if (this._loadingImage && !imageReady(this._loadingImage)) {
                this._clearUpperCanvas();
                return;
            }
            try {
                _paint.call(this);
            } catch (e) {
                try {
                    this._clearUpperCanvas();
                } catch (e2) {}
            }
        };
    }

    var _updateErrorPrinter = Graphics._updateErrorPrinter;
    if (typeof _updateErrorPrinter === "function") {
        Graphics._updateErrorPrinter = function () {
            if (!this._errorPrinter) return;
            return _updateErrorPrinter.apply(this, arguments);
        };
    }

    var _updateCanvas = Graphics._updateCanvas;
    if (typeof _updateCanvas === "function") {
        Graphics._updateCanvas = function () {
            if (!this._canvas) return;
            return _updateCanvas.apply(this, arguments);
        };
    }

    var _createCanvas = Bitmap.prototype._createCanvas;
    Bitmap.prototype._createCanvas = function (width, height) {
        try {
            var img = this.__image;
            if (img && !imageReady(img)) {
                this.__image = null;
            }
            return _createCanvas.call(this, width, height);
        } catch (e) {
            try {
                this.__canvas = this.__canvas || document.createElement("canvas");
                this.__context = this.__canvas.getContext("2d");
                this.__canvas.width = Math.max(width || 0, 1);
                this.__canvas.height = Math.max(height || 0, 1);
                this.__baseTexture =
                    this.__baseTexture || new PIXI.BaseTexture(this.__canvas);
                this._setDirty();
            } catch (e2) {}
        }
    };

    var _getPixel = Bitmap.prototype.getPixel;
    Bitmap.prototype.getPixel = function (x, y) {
        try {
            if (!this.width || !this.height) return "#ffffff";
            return _getPixel.call(this, x, y);
        } catch (e) {
            return "#ffffff";
        }
    };

    var _drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
        if (align == null || align === "undefined") align = "left";
        return _drawText.call(this, text, x, y, maxWidth, lineHeight, align);
    };

    function scheduleRevoke(objectUrl) {
        if (!objectUrl || String(objectUrl).indexOf("blob:") !== 0) return;
        // 原版 onLoad 立刻 revoke → 部分 WebView texImage2D 前像素已空（女主 ANI 黑块）
        // 延迟足够久，等 PIXI/WebGL 吃完贴图再释放
        setTimeout(function () {
            try {
                URL.revokeObjectURL(objectUrl);
            } catch (e) {}
        }, REVOKE_DELAY_MS);
    }

    // Encrypted images: MIME + retry xhr
    Bitmap.prototype._startDecrypting = function () {
        var self = this;
        var url = this._url + "_";
        var tries = this._dzmmDecryptTries || 0;
        // 重试时绕过缓存
        if (tries > 0) {
            url +=
                (url.indexOf("?") >= 0 ? "&" : "?") +
                "dzmm_r=" +
                tries +
                "&t=" +
                Date.now();
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            if (xhr.status < 400) {
                self._onXhrLoad(xhr);
            } else {
                self._dzmmDecryptFail("HTTP " + xhr.status);
            }
        };
        xhr.onerror = function () {
            self._dzmmDecryptFail("network");
        };
        try {
            xhr.send();
        } catch (e) {
            self._dzmmDecryptFail(String(e && e.message));
        }
    };

    // 先保存原版 error，供耗尽重试时直达，避免和 decode 重试互相套娃
    var _onError = Bitmap.prototype._onError;

    Bitmap.prototype._dzmmDecryptFail = function (reason) {
        this._dzmmDecryptTries = (this._dzmmDecryptTries || 0) + 1;
        var max = priorityRetryMax(this._url);
        if (this._dzmmDecryptTries <= max) {
            var self = this;
            this._loadingState = "loading";
            console.warn(
                "[dzmm-img] decrypt retry",
                this._dzmmDecryptTries,
                this._url,
                reason || ""
            );
            setTimeout(function () {
                self._startDecrypting();
            }, RETRY_BASE_MS * this._dzmmDecryptTries);
            return;
        }
        // 已耗尽：直接进原版 error，勿再走 decode 重试（否则会二次循环）
        this._dzmmGiveUp = true;
        _onError.call(this);
    };

    Bitmap.prototype._onXhrLoad = function (xhr) {
        if (xhr.status >= 400) {
            this._dzmmDecryptFail("HTTP " + xhr.status);
            return;
        }
        try {
            var arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
            var mime = detectMime(arrayBuffer);
            if (!mime) {
                // 解密结果仍不像图片（密钥/截断）→ 当失败重试，勿假装 png
                throw new Error("bad image signature after decrypt");
            }
            var blob = new Blob([arrayBuffer], { type: mime });
            var objectUrl = URL.createObjectURL(blob);
            this._dzmmObjectUrl = objectUrl;
            // 注意：不要在这里清零 _dzmmDecodeTries；否则「XHR 成功但永远解不出」会死循环
            this._image.onerror = this._onError.bind(this);
            this._image.onload = this._onLoad.bind(this);
            this._image.src = objectUrl;
        } catch (e) {
            this._dzmmDecryptFail(String(e && e.message));
        }
    };

    Bitmap.prototype._onLoad = function () {
        // 原版立刻 revoke → 部分 WebView 上传贴图前像素已空（ANI 黑块）
        var objectUrl = this._dzmmObjectUrl || (this._image && this._image.src);
        this._dzmmObjectUrl = null;
        this._dzmmDecryptTries = 0;
        this._dzmmDecodeTries = 0;
        this._dzmmGiveUp = false;
        this._loadingState = "loaded";
        this._createBaseTexture(this._image);
        this._callLoadListeners();
        if (Utils.hasEncryptedImages() && objectUrl) {
            scheduleRevoke(objectUrl);
        }
    };

    // 解码失败（WEBP/跨域等）也重试，不只 XHR
    Bitmap.prototype._onError = function () {
        if (this._dzmmGiveUp) {
            this._dzmmGiveUp = false;
            return _onError.apply(this, arguments);
        }
        if (Utils.hasEncryptedImages() && this._url) {
            this._dzmmDecodeTries = (this._dzmmDecodeTries || 0) + 1;
            var max = priorityRetryMax(this._url);
            if (this._dzmmDecodeTries <= max) {
                var self = this;
                this._loadingState = "loading";
                // 解码失败也算一轮「拉取重试」，与 decrypt 计数分开，避免互相清零
                console.warn(
                    "[dzmm-img] decode retry",
                    this._dzmmDecodeTries,
                    this._url
                );
                setTimeout(function () {
                    self._startDecrypting();
                }, RETRY_BASE_MS * self._dzmmDecodeTries);
                return;
            }
        }
        return _onError.apply(this, arguments);
    };

    var _bitmapRetry = Bitmap.prototype.retry;
    Bitmap.prototype.retry = function () {
        this._dzmmDecryptTries = 0;
        this._dzmmDecodeTries = 0;
        this._dzmmGiveUp = false;
        return _bitmapRetry.call(this);
    };

    if (typeof WebAudio !== "undefined" && WebAudio.prototype._onError) {
        var _waOnError = WebAudio.prototype._onError;
        WebAudio.prototype._onError = function () {
            this._dzmmAudioTries = (this._dzmmAudioTries || 0) + 1;
            if (this._dzmmAudioTries <= AUD_RETRY) {
                var self = this;
                this._isError = false;
                setTimeout(function () {
                    if (typeof self._startLoading === "function") {
                        self._startLoading();
                    }
                }, RETRY_BASE_MS * self._dzmmAudioTries);
                return;
            }
            return _waOnError.apply(this, arguments);
        };

        var _waRetry = WebAudio.prototype.retry;
        if (typeof _waRetry === "function") {
            WebAudio.prototype.retry = function () {
                this._dzmmAudioTries = 0;
                return _waRetry.call(this);
            };
        }
    }
})();
