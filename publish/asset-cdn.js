/**
 * 海之家 — 对齐 ntr了朋友的女友 / jk少女 成功范式：
 * 1) 下载 zip → 解压（媒体 STORED，解压快）→ 再注入 main.js
 * 2) img/system、fonts 留壳本地，Boot 不堵在大包上
 * 3) SceneManager.run 等 packReady；遮罩在 Boot.terminate 揭开
 *
 *   默认 → R2 game-pack.zip（含压缩后的 spines）
 *   ?pack=local → 本地 publish/game-pack.zip
 *   ?pack=r2    → R2（显式）
 *   ?pack=0     → 散文件
 *   ?cdn=0      → 纯磁盘
 */
(function () {
  "use strict";

  var CDN = "https://pub-db5421ea70f04d5e8caa7e9a211e381c.r2.dev/umi-no-ie/";
  var CACHE_TAG = "umi260908r";
  var PACK_URL_R2 = CDN + "game-pack.zip?v=" + CACHE_TAG;
  var PACK_URL_LOCAL = "./game-pack.zip?v=" + CACHE_TAG;
  var qs = location.search || "";
  var forceLocal = /(?:^|[?&])cdn=0(?:&|$)/.test(qs);
  var USE_CDN = !forceLocal;
  var packMode = "r2";
  if (/(?:^|[?&])pack=0(?:&|$)/.test(qs)) packMode = "off";
  else if (/(?:^|[?&])pack=local(?:&|$)/.test(qs)) packMode = "local";
  else if (/(?:^|[?&])pack=r2(?:&|$)/.test(qs)) packMode = "r2";
  var USE_PACK = USE_CDN && packMode !== "off";
  var PACK_URL = packMode === "local" ? PACK_URL_LOCAL : PACK_URL_R2;

  var PREFIXES = ["img/", "audio/", "fonts/"];
  // Boot 关键留壳；spines 进 pack（Loader 对 json/atlas 保路径，XHR 喂 blob）
  var LOCAL_PREFIXES = ["img/system/", "fonts/"];

  var packBlobs = Object.create(null);
  var packUrls = Object.create(null);
  var progressListeners = [];

  function emitProgress(info) {
    for (var i = 0; i < progressListeners.length; i++) {
      try {
        progressListeners[i](info);
      } catch (e) {}
    }
    try {
      if (window.dzmm && dzmm.loading && typeof dzmm.loading.progress === "function") {
        var pct = Math.round(Math.max(0, Math.min(1, info.ratio || 0)) * 100);
        dzmm.loading.progress({
          phase: info.phase === "boot" || info.phase === "done" ? "boot" : "assets",
          message: info.message || "",
          current: info.current || 0,
          total: info.total || 0,
          percent: pct
        });
      }
    } catch (e) {}
  }

  function decodeRelPath(rel) {
    return String(rel || "")
      .split("/")
      .map(function (seg) {
        if (!seg) return seg;
        try {
          return decodeURIComponent(seg);
        } catch (e) {
          return seg;
        }
      })
      .join("/");
  }

  function stripBase(pathname) {
    var path = String(pathname || "");
    try {
      var base = location.pathname.replace(/\/[^/]*$/, "/");
      if (path.indexOf(base) === 0) path = path.slice(base.length);
    } catch (e) {}
    return path.replace(/^\//, "").replace(/^static\//, "");
  }

  function isLocalAsset(rel) {
    rel = String(rel || "");
    for (var i = 0; i < LOCAL_PREFIXES.length; i++) {
      if (rel.indexOf(LOCAL_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function shouldMapRel(rel) {
    if (!rel || isLocalAsset(rel)) return false;
    for (var i = 0; i < PREFIXES.length; i++) {
      if (rel.indexOf(PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function relFromUrl(url) {
    if (!url) return "";
    var s = String(url);
    if (/^(?:blob:|data:)/i.test(s)) return "";
    if (s.indexOf(CDN) === 0) s = s.slice(CDN.length);
    else if (/^(?:https?:)/i.test(s)) {
      try {
        var u = new URL(s, location.href);
        if (u.origin !== location.origin && s.indexOf(CDN) !== 0) return "";
        s = u.pathname.replace(/^\/static\//, "/");
      } catch (e) {
        return "";
      }
    }
    return decodeRelPath(stripBase(s).replace(/^\.\//, ""));
  }

  function blobUrl(rel) {
    rel = decodeRelPath(rel);
    if (!packUrls[rel] && packBlobs[rel]) {
      packUrls[rel] = URL.createObjectURL(packBlobs[rel]);
    }
    return packUrls[rel] || "";
  }

  function mapUrl(url) {
    if (!url) return url;
    if (/^(?:blob:|data:)/i.test(String(url))) return url;
    var rel = relFromUrl(url);
    var pathOnly = rel.split("#")[0].split("?")[0];
    var shellUrl =
      window.__UMI_SHELL_URLS && window.__UMI_SHELL_URLS[pathOnly];
    if (shellUrl) return shellUrl;
    if (!USE_CDN || !shouldMapRel(rel)) return url;
    var packed = blobUrl(pathOnly);
    if (packed) return packed;
    if (String(url).indexOf(CDN) === 0) return url;
    return url;
  }

  function formatMB(n) {
    return (n / 1024 / 1024).toFixed(1);
  }

  function downloadPack() {
    emitProgress({ phase: "download", message: "下载资源包…", current: 0, total: 0, ratio: 0 });
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", PACK_URL, true);
      xhr.responseType = "arraybuffer";
      xhr.onprogress = function (ev) {
        var total = ev.lengthComputable ? ev.total : 0;
        emitProgress({
          phase: "download",
          message: total
            ? "下载资源包 " + formatMB(ev.loaded) + " / " + formatMB(total) + " MB"
            : "下载资源包 " + formatMB(ev.loaded) + " MB…",
          current: ev.loaded,
          total: total,
          ratio: total ? ev.loaded / total : 0
        });
      };
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          emitProgress({ phase: "download", message: "下载完成", current: 1, total: 1, ratio: 1 });
          resolve(xhr.response);
        } else reject(new Error("pack HTTP " + xhr.status));
      };
      xhr.onerror = function () {
        reject(new Error("pack network error"));
      };
      xhr.send();
    });
  }

  function unzipPack(buf) {
    if (typeof JSZip === "undefined") return Promise.reject(new Error("JSZip missing"));
    emitProgress({ phase: "unzip", message: "解压资源包…", current: 0, total: 0, ratio: 0 });
    return JSZip.loadAsync(buf).then(function (zip) {
      var entries = [];
      zip.forEach(function (path, file) {
        if (!path || file.dir) return;
        var rel = decodeRelPath(path.replace(/^\/+/, ""));
        if (isLocalAsset(rel)) return; // 壳内已有
        entries.push({ path: rel, file: file });
      });
      var total = entries.length;
      var done = 0;
      var lastEmit = 0;
      var CONCURRENCY = 48;
      function maybeEmit(force) {
        var now = Date.now();
        if (!force && now - lastEmit < 50 && done < total) return;
        lastEmit = now;
        emitProgress({
          phase: "unzip",
          message: "解压资源 " + done + " / " + total,
          current: done,
          total: total,
          ratio: total ? done / total : 0
        });
      }
      var idx = 0;
      function pump() {
        if (idx >= total) return Promise.resolve();
        var batch = [];
        while (batch.length < CONCURRENCY && idx < total) {
          (function (entry) {
            batch.push(
              entry.file.async("arraybuffer").then(function (ab) {
                packBlobs[entry.path] = new Blob([ab], {
                  type: /\.png$/i.test(entry.path)
                    ? "image/png"
                    : /\.jpe?g$/i.test(entry.path)
                      ? "image/jpeg"
                      : /\.webp$/i.test(entry.path)
                        ? "image/webp"
                        : /\.json$/i.test(entry.path)
                          ? "application/json"
                          : /\.atlas$/i.test(entry.path)
                            ? "text/plain"
                            : /\.ogg$/i.test(entry.path)
                              ? "audio/ogg"
                              : ""
                });
                done += 1;
                maybeEmit(false);
              })
            );
          })(entries[idx++]);
        }
        return Promise.all(batch).then(pump);
      }
      return pump().then(function () {
        maybeEmit(true);
        emitProgress({ phase: "boot", message: "正在启动游戏引擎…", current: 1, total: 1, ratio: 1 });
        console.info("[umi-cdn] pack ready", total, "files");
        return true;
      });
    });
  }

  function loadPack() {
    if (!USE_PACK) return Promise.resolve(false);
    return downloadPack()
      .then(unzipPack)
      .catch(function (e) {
        console.warn("[umi-cdn] pack failed", e && e.message ? e.message : String(e));
        emitProgress({ phase: "error", message: "资源包加载失败", current: 0, total: 0, ratio: 0 });
        return false;
      });
  }

  var packReady = USE_CDN
    ? new Promise(function (resolve) {
        setTimeout(function () {
          loadPack().then(resolve, function () {
            resolve(false);
          });
        }, 0);
      })
    : Promise.resolve(false);

  window.__UMI_CDN = {
    enabled: USE_CDN,
    base: CDN,
    tag: CACHE_TAG,
    packMode: packMode,
    packUrl: PACK_URL,
    resolve: mapUrl,
    ready: packReady,
    onProgress: function (fn) {
      if (typeof fn === "function") progressListeners.push(fn);
    }
  };

  function wrapProto(obj, method, mapper) {
    if (!obj || !obj[method] || obj[method].__umiWrapped) return;
    var orig = obj[method];
    function wrapped() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string") args[0] = mapper(args[0]);
      return orig.apply(this, args);
    }
    wrapped.__umiWrapped = true;
    obj[method] = wrapped;
  }

  function keepSpinePath(u) {
    if (typeof u !== "string") return false;
    var s = u.replace(/\\/g, "/");
    return /(?:^|\/)img\/spines\//.test(s) && /\.(json|atlas)(?:\?|#|$)/i.test(s);
  }

  function mapLoaderUrl(u) {
    if (keepSpinePath(u)) return u; // path kept for relative atlas; XHR/fetch → blob
    return mapUrl(u);
  }

  function asImageOptions(url, opts) {
    opts = opts && typeof opts === "object" ? Object.assign({}, opts) : {};
    // blob: URLs lose .png extension → PIXI would XHR-load and texture stays undefined
    if (/\.(png|jpe?g|gif|webp)(?:\?|#|$)/i.test(String(url || ""))) {
      var Res = (window.PIXI && (PIXI.LoaderResource || (PIXI.loaders && PIXI.loaders.Resource))) || null;
      if (Res && Res.LOAD_TYPE) opts.loadType = Res.LOAD_TYPE.IMAGE;
    }
    return opts;
  }

  function hookPixiLoader() {
    var Loader =
      (window.PIXI && PIXI.Loader) ||
      (window.PIXI && PIXI.loaders && PIXI.loaders.Loader) ||
      null;
    if (!Loader || !Loader.prototype || Loader.prototype.add.__umiWrapped) return false;
    var _add = Loader.prototype.add;
    Loader.prototype.add = function () {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string" && typeof args[1] === "string") {
        var rawUrl = args[1];
        var mapped = mapLoaderUrl(rawUrl);
        args[1] = mapped;
        if (mapped !== rawUrl && /^blob:/i.test(mapped)) {
          if (typeof args[2] === "function") {
            args.splice(2, 0, asImageOptions(rawUrl, null));
          } else {
            args[2] = asImageOptions(rawUrl, args[2]);
          }
        }
      } else if (args[0] && typeof args[0] === "object" && typeof args[0].url === "string") {
        var raw0 = args[0].url;
        var mapped0 = mapLoaderUrl(raw0);
        args[0] = Object.assign({}, args[0], { url: mapped0 });
        if (mapped0 !== raw0 && /^blob:/i.test(mapped0)) {
          args[0].loadType = asImageOptions(raw0, args[0]).loadType;
        }
      } else if (typeof args[0] === "string" && args[1] && typeof args[1] === "object" && args[1].url) {
        var raw1 = args[1].url;
        var mapped1 = mapLoaderUrl(raw1);
        args[1] = Object.assign({}, args[1], { url: mapped1 });
        if (mapped1 !== raw1 && /^blob:/i.test(mapped1)) {
          args[1].loadType = asImageOptions(raw1, args[1]).loadType;
        }
      }
      return _add.apply(this, args);
    };
    Loader.prototype.add.__umiWrapped = true;
    return true;
  }

  function installLoadHooks() {
    hookPixiLoader();
    if (typeof Bitmap !== "undefined" && Bitmap.prototype && !Bitmap.prototype._startLoading.__umiWrapped) {
      var _bmpLoad = Bitmap.prototype._startLoading;
      Bitmap.prototype._startLoading = function () {
        if (this._url) this._url = mapUrl(this._url);
        return _bmpLoad.apply(this, arguments);
      };
      Bitmap.prototype._startLoading.__umiWrapped = true;
    }
    if (
      typeof WebAudio !== "undefined" &&
      WebAudio.prototype &&
      WebAudio.prototype._realUrl &&
      !WebAudio.prototype._realUrl.__umiWrapped
    ) {
      var _real = WebAudio.prototype._realUrl;
      WebAudio.prototype._realUrl = function () {
        return mapUrl(_real.apply(this, arguments));
      };
      WebAudio.prototype._realUrl.__umiWrapped = true;
    }
    if (typeof Graphics !== "undefined") {
      wrapProto(Graphics, "setLoadingImage", mapUrl);
    }
    if (typeof FontManager !== "undefined" && FontManager.makeUrl && !FontManager.makeUrl.__umiWrapped) {
      var _makeUrl = FontManager.makeUrl;
      FontManager.makeUrl = function (filename) {
        var raw = "fonts/" + String(filename || "");
        var shellUrl =
          window.__UMI_SHELL_URLS && window.__UMI_SHELL_URLS[raw];
        if (shellUrl) return shellUrl;
        if (isLocalAsset(raw)) return _makeUrl.call(this, filename);
        var packed = blobUrl(raw);
        if (packed) return packed;
        return mapUrl(_makeUrl.call(this, filename));
      };
      FontManager.makeUrl.__umiWrapped = true;
    }
    return true;
  }

  function hookTransport() {
    if (window.__umiCdnTransportHooked) return;
    window.__umiCdnTransportHooked = true;
    var _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[1] === "string") args[1] = mapUrl(args[1]);
      return _open.apply(this, args);
    };
    if (window.fetch) {
      var _fetch = window.fetch.bind(window);
      window.fetch = function (input, init) {
        if (typeof input === "string") return _fetch(mapUrl(input), init);
        if (input && typeof Request !== "undefined" && input instanceof Request) {
          var mapped = mapUrl(input.url);
          if (mapped !== input.url) return _fetch(new Request(mapped, input), init);
        }
        return _fetch(input, init);
      };
    }
    try {
      var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
      if (desc && desc.set) {
        Object.defineProperty(HTMLImageElement.prototype, "src", {
          configurable: true,
          enumerable: true,
          get: desc.get,
          set: function (v) {
            desc.set.call(this, mapUrl(v));
          }
        });
      }
    } catch (e) {}
  }

  function hookSceneManager() {
    if (typeof SceneManager === "undefined" || SceneManager.__umiCdnHooked) return false;
    SceneManager.__umiCdnHooked = true;
    var _run = SceneManager.run;
    SceneManager.run = function () {
      installLoadHooks();
      var self = this;
      var args = arguments;
      return packReady.then(function (packLoaded) {
        if (USE_PACK && !packLoaded) {
          if (typeof window.__UMI_BOOT_ERROR__ === "function") {
            window.__UMI_BOOT_ERROR__("资源包加载失败，请检查网络后刷新重试");
          }
          return;
        }
        installLoadHooks();
        return _run.apply(self, args);
      });
    };
    return true;
  }

  hookTransport();
  console.info("[umi-cdn] packMode=", packMode, "url=", PACK_URL);

  if (!USE_CDN) {
    console.info("[umi-cdn] LOCAL (?cdn=0)");
    return;
  }

  var tries = 0;
  (function wait() {
    hookSceneManager();
    installLoadHooks();
    if (tries > 600) return;
    tries += 1;
    setTimeout(wait, 50);
  })();
})();
