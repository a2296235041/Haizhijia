/*:
 * @plugindesc 将 RPG Maker MZ 存档同步到 DZMM 平台 KV（按槽位拆分）
 * @author dzmm
 *
 * @help
 * MZ 存档走 StorageManager.saveToForage（zip 二进制串）。
 * v2：每个槽位独立 KV key，避免整包超过 5MiB 导致全员丢档。
 * 启动时兼容读取旧整包 natsu-ntr-rpg-save-bundle-v1 并迁移。
 * 需放在 DzmmSafeStorage 之后。
 */
(function () {
    'use strict';

    var dz = window.dzmm;

    function sdk() {
        return window.dzmm || dz;
    }

    var LEGACY_BUNDLE_KEY = 'natsu-ntr-rpg-save-bundle-v1';
    var INDEX_KEY = 'natsu-ntr-save-v2:index';
    var SLOT_PREFIX = 'natsu-ntr-save-v2:';
    var MAX_FILE_ID = 20;
    var PUT_TRIES = 3;

    /** @type {{v:number, saves:Object.<string, any>, names:string[]}} */
    var bundle = { v: 2, saves: {}, names: [] };
    var kvReady = false;
    var seeded = false;
    var syncEnabled = true;
    var lastSyncError = null;
    var platformReadError = null;
    var slotWriteQueue = Promise.resolve();
    var pendingHiddenFlush = null;

    function makeStorageError(message, code) {
        var error = new Error(message);
        error.code = code;
        error.retryable = true;
        return error;
    }

    function showScreenBanner(message, isError) {
        try {
            var el = document.getElementById('dzmm-save-toast');
            if (!el) {
                el = document.createElement('div');
                el.id = 'dzmm-save-toast';
                el.setAttribute('role', 'status');
                el.style.cssText = [
                    'position:fixed',
                    'left:50%',
                    'top:16%',
                    'transform:translateX(-50%)',
                    'z-index:2147483646',
                    'padding:14px 22px',
                    'border-radius:12px',
                    'font:600 17px/1.45 "Microsoft YaHei","PingFang SC",sans-serif',
                    'color:#fff',
                    'pointer-events:none',
                    'opacity:0',
                    'transition:opacity .18s ease',
                    'max-width:min(86vw,520px)',
                    'text-align:center',
                    'box-shadow:0 10px 28px rgba(0,0,0,.4)',
                    'letter-spacing:.02em'
                ].join(';');
                (document.body || document.documentElement).appendChild(el);
            }
            el.style.background = isError
                ? 'rgba(176,36,36,.94)'
                : 'rgba(16,132,72,.94)';
            el.textContent = String(message || '');
            el.style.opacity = '1';
            if (el._hideTimer) clearTimeout(el._hideTimer);
            el._hideTimer = setTimeout(function () {
                el.style.opacity = '0';
            }, isError ? 3200 : 2400);
        } catch (e) {
            console.warn('[DzmmPlatformSave] banner failed', e);
        }
    }

    function toastError(message) {
        showScreenBanner(message, true);
        var api = sdk();
        if (api && api.toast && typeof api.toast.error === 'function') {
            try { api.toast.error(message); } catch (e) {}
        }
        console.warn('[DzmmPlatformSave] ' + message);
    }

    function toastOk(message) {
        var now = Date.now();
        if (toastOk._msg === message && now - (toastOk._at || 0) < 1600) return;
        toastOk._msg = message;
        toastOk._at = now;
        showScreenBanner(message, false);
        var api = sdk();
        if (api && api.toast) {
            try {
                if (typeof api.toast.success === 'function') {
                    api.toast.success(message);
                    return;
                }
                if (typeof api.toast.info === 'function') {
                    api.toast.info(message);
                }
            } catch (e) {}
        }
        console.info('[DzmmPlatformSave] ' + message);
    }

    function notifySaveFailure(error, saveName) {
        var detail = (error && (error.code || error.message)) || '';
        var message = '平台存档失败，进度可能未同步。请再点一次保存。';
        if (saveName) message = '「' + saveName + '」' + message;
        if (detail) message += '（' + String(detail).slice(0, 80) + '）';
        toastError(message);
        try {
            if (typeof SoundManager !== 'undefined' && SoundManager.playBuzzer) {
                SoundManager.playBuzzer();
            }
        } catch (e) {}
    }

    function canUseKv() {
        var api = sdk();
        return !!(api && api.kv && typeof api.kv.get === 'function' &&
            typeof api.kv.put === 'function');
    }

    function canBatchGet() {
        var api = sdk();
        return !!(canUseKv() && api && typeof api.kv.batchGet === 'function' &&
            kvBatchEnabled !== false);
    }

    var kvBatchEnabled = null;

    function refreshCaps() {
        var api = sdk();
        if (!api || !api.capabilities || typeof api.capabilities.get !== 'function') {
            return Promise.resolve();
        }
        return api.capabilities.get().then(function (caps) {
            if (caps && caps.kvBatch === false) kvBatchEnabled = false;
            else if (caps && caps.kvBatch === true) kvBatchEnabled = true;
        }).catch(function () {});
    }

    function slotKey(saveName) {
        return SLOT_PREFIX + saveName;
    }

    function knownSaveNames() {
        var names = ['config', 'global'];
        for (var i = 0; i <= MAX_FILE_ID; i++) {
            names.push('file' + i);
        }
        return names;
    }

    function refreshNameIndex() {
        bundle.names = Object.keys(bundle.saves || {}).filter(function (name) {
            return !!bundle.saves[name];
        }).sort();
    }

    function binaryStringFromBytes(u8) {
        var chunk = 0x8000;
        var out = '';
        for (var i = 0; i < u8.length; i += chunk) {
            out += String.fromCharCode.apply(
                null,
                u8.subarray(i, Math.min(i + chunk, u8.length))
            );
        }
        return out;
    }

    function zipToPayload(zip) {
        if (zip == null) return null;
        if (typeof zip === 'string') {
            try {
                return { enc: 'b64', data: btoa(zip), bytes: zip.length };
            } catch (e) {
                return { enc: 'raw', data: zip, bytes: zip.length };
            }
        }
        if (zip instanceof ArrayBuffer) {
            return zipToPayload(binaryStringFromBytes(new Uint8Array(zip)));
        }
        if (ArrayBuffer.isView && ArrayBuffer.isView(zip)) {
            return zipToPayload(binaryStringFromBytes(
                new Uint8Array(zip.buffer, zip.byteOffset, zip.byteLength)
            ));
        }
        return { enc: 'json', data: zip };
    }

    function payloadToZip(payload) {
        if (payload == null) return null;
        if (typeof payload === 'string') return payload;
        if (typeof payload !== 'object') return null;
        if (payload.enc === 'b64' && typeof payload.data === 'string') {
            try {
                return atob(payload.data);
            } catch (e) {
                return null;
            }
        }
        if (payload.enc === 'raw' && typeof payload.data === 'string') {
            return payload.data;
        }
        return null;
    }

    function sleep(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function kvPut(key, value, opts) {
        return sdk().kv.put(key, value, opts);
    }

    function kvGet(key) {
        return sdk().kv.get(key).then(function (result) {
            return result && result.value;
        });
    }

    function kvDelete(key) {
        var api = sdk();
        if (!canUseKv() || !api || typeof api.kv.delete !== 'function') {
            return Promise.resolve();
        }
        return api.kv.delete(key).catch(function () {});
    }

    function putWithRetry(key, value, opts) {
        var attempt = 0;
        function once() {
            attempt += 1;
            return kvPut(key, value, opts).catch(function (error) {
                if (attempt >= PUT_TRIES) throw error;
                console.warn('[DzmmPlatformSave] put retry', attempt, key,
                    error && error.code, error && error.message);
                return sleep(200 * attempt).then(once);
            });
        }
        return once();
    }

    function writeIndex(required) {
        refreshNameIndex();
        var index = {
            v: 2,
            names: bundle.names.slice(),
            updatedAt: Date.now()
        };
        return putWithRetry(INDEX_KEY, index, { flush: true }).catch(function (error) {
            lastSyncError = error;
            if (required) throw error;
            console.warn('[DzmmPlatformSave] index put failed',
                error && error.code, error && error.message);
        });
    }

    function writeSlot(saveName, payload, required) {
        if (!syncEnabled) {
            var disabled = makeStorageError(
                '平台存档同步已停止', 'PLATFORM_SAVE_DISABLED');
            lastSyncError = disabled;
            if (required) {
                notifySaveFailure(disabled, saveName);
                return Promise.reject(disabled);
            }
            return Promise.resolve();
        }
        if (!canUseKv()) {
            // 与 deleteSlot 一致：无平台时本地档已写入，云端软失败不抛（本地预览）
            var unavailable = makeStorageError(
                '平台存档服务不可用', 'PLATFORM_STORAGE_UNAVAILABLE');
            lastSyncError = unavailable;
            if (required) {
                notifySaveFailure(unavailable, saveName);
                return Promise.reject(unavailable);
            }
            return Promise.resolve();
        }
        var key = slotKey(saveName);
        var body = {
            v: 2,
            name: saveName,
            payload: payload,
            updatedAt: Date.now()
        };
        return putWithRetry(key, body, { flush: true }).then(function () {
            return writeIndex(required);
        }).then(function () {
            lastSyncError = null;
            platformReadError = null;
            console.info('[DzmmPlatformSave] synced slot', saveName);
        }).catch(function (error) {
            lastSyncError = error;
            console.warn('[DzmmPlatformSave] slot save failed', saveName,
                error && error.code, error && error.message);
            if (required) {
                notifySaveFailure(error, saveName);
                throw error;
            }
        });
    }

    function deleteSlot(saveName, required) {
        if (!syncEnabled || !canUseKv()) return Promise.resolve();
        delete bundle.saves[saveName];
        refreshNameIndex();
        return kvDelete(slotKey(saveName)).then(function () {
            return writeIndex(required);
        }).catch(function (error) {
            lastSyncError = error;
            if (required) {
                notifySaveFailure(error, saveName);
                throw error;
            }
        });
    }

    function enqueueSlotWrite(task) {
        slotWriteQueue = slotWriteQueue.then(task, task);
        return slotWriteQueue;
    }

    function forageKeySafe(saveName) {
        // forageKey 依赖 $dataSystem.advanced.gameId；数据库未就绪时不能调用
        if (typeof $dataSystem !== 'undefined' && $dataSystem && $dataSystem.advanced) {
            return StorageManager.forageKey(saveName);
        }
        return 'rmmzsave.pending.' + saveName;
    }

    function putLocalZip(saveName, zip) {
        if (!zip) return Promise.resolve();
        var key = forageKeySafe(saveName);
        if (window.DzmmSafeStorageUseMemory && window.DzmmSafeStorageMemory) {
            window.DzmmSafeStorageMemory[key] = zip;
            // 数据库就绪后补写正式 key，避免 pending 键读不到
            if (key.indexOf('rmmzsave.pending.') === 0 &&
                typeof $dataSystem !== 'undefined' && $dataSystem && $dataSystem.advanced) {
                var realKey = StorageManager.forageKey(saveName);
                window.DzmmSafeStorageMemory[realKey] = zip;
                delete window.DzmmSafeStorageMemory[key];
                key = realKey;
            }
            StorageManager._forageKeys = Object.keys(window.DzmmSafeStorageMemory).filter(function (k) {
                return k.indexOf('rmmzsave.') === 0;
            });
            StorageManager._forageKeysUpdated = true;
            return Promise.resolve();
        }
        if (typeof localforage !== 'undefined' &&
            typeof $dataSystem !== 'undefined' && $dataSystem && $dataSystem.advanced) {
            return localforage.setItem(key, zip);
        }
        return Promise.resolve();
    }

    function ingestSlotValue(saveName, value, writeLocal) {
        if (!value) return;
        var payload = null;
        if (value.payload) payload = value.payload;
        else if (value.enc) payload = value;
        else if (typeof value === 'string') payload = value;
        if (!payload) return;
        var zip = payloadToZip(payload);
        if (!zip) return;
        bundle.saves[saveName] = typeof payload === 'string'
            ? { enc: 'raw', data: payload }
            : payload;
        // 启动早期只进内存 bundle；等 System.json 就绪后再 seed 到 forage
        if (writeLocal) return putLocalZip(saveName, zip);
        return Promise.resolve();
    }

    function batchGetKeys(keys) {
        if (!keys.length) return Promise.resolve({});
        if (!canBatchGet()) {
            var out = {};
            var chain = Promise.resolve();
            keys.forEach(function (key) {
                chain = chain.then(function () {
                    return kvGet(key).then(function (value) {
                        if (value != null) out[key] = value;
                    }).catch(function () {});
                });
            });
            return chain.then(function () { return out; });
        }
        var out = {};
        var i = 0;
        function nextBatch() {
            if (i >= keys.length) return Promise.resolve(out);
            var slice = keys.slice(i, i + 10);
            i += 10;
            return sdk().kv.batchGet(slice).then(function (map) {
                kvBatchEnabled = true;
                if (map && typeof map === 'object') {
                    Object.keys(map).forEach(function (k) {
                        var entry = map[k];
                        var value = entry && Object.prototype.hasOwnProperty.call(entry, 'value')
                            ? entry.value
                            : entry;
                        if (value != null) out[k] = value;
                    });
                }
            }).catch(function (error) {
                kvBatchEnabled = false;
                console.warn('[DzmmPlatformSave] batchGet fallback',
                    error && error.message);
                return Promise.all(slice.map(function (key) {
                    return kvGet(key).then(function (value) {
                        if (value != null) out[key] = value;
                    }).catch(function () {});
                }));
            }).then(nextBatch);
        }
        return nextBatch();
    }

    function loadFromV2() {
        return kvGet(INDEX_KEY).then(function (index) {
            var names = (index && Array.isArray(index.names) && index.names.length)
                ? index.names.slice()
                : knownSaveNames();
            var keys = names.map(slotKey);
            return batchGetKeys(keys).then(function (map) {
                var found = 0;
                var chain = Promise.resolve();
                names.forEach(function (name) {
                    var value = map[slotKey(name)];
                    if (!value) return;
                    found += 1;
                    chain = chain.then(function () {
                        return ingestSlotValue(name, value);
                    });
                });
                return chain.then(function () {
                    refreshNameIndex();
                    return found;
                });
            });
        });
    }

    function loadFromLegacyBundle() {
        return kvGet(LEGACY_BUNDLE_KEY).then(function (value) {
            if (!value || !value.saves || typeof value.saves !== 'object') {
                return 0;
            }
            var names = Object.keys(value.saves);
            names.forEach(function (saveName) {
                var payload = value.saves[saveName];
                if (!payload) return;
                if (!bundle.saves[saveName]) {
                    bundle.saves[saveName] = payload;
                }
            });
            refreshNameIndex();
            return names.length;
        });
    }

    function migrateLegacyToV2() {
        var names = Object.keys(bundle.saves || {});
        if (!names.length || !canUseKv()) return Promise.resolve();
        var chain = Promise.resolve();
        names.forEach(function (saveName) {
            chain = chain.then(function () {
                return putWithRetry(slotKey(saveName), {
                    v: 2,
                    name: saveName,
                    payload: bundle.saves[saveName],
                    updatedAt: Date.now(),
                    migratedFrom: 'bundle-v1'
                }, { flush: true });
            });
        });
        return chain.then(function () {
            return writeIndex(false);
        }).then(function () {
            console.info('[DzmmPlatformSave] migrated', names.length, 'slots to v2');
            // 保留旧整包作只读备份，避免迁移中途失败无法回滚
        }).catch(function (error) {
            console.warn('[DzmmPlatformSave] migrate incomplete',
                error && error.code, error && error.message);
        });
    }

    function seedFromBundle() {
        var names = Object.keys(bundle.saves || {});
        if (!names.length) {
            return StorageManager.updateForageKeys();
        }
        var chain = Promise.resolve();
        names.forEach(function (saveName) {
            var zip = payloadToZip(bundle.saves[saveName]);
            if (!zip) return;
            chain = chain.then(function () {
                return putLocalZip(saveName, zip);
            });
        });
        return chain.then(function () {
            return StorageManager.updateForageKeys();
        }).then(function () {
            console.info('[DzmmPlatformSave] seeded', names.length, 'slots from platform');
        });
    }

    function isRetryableKvError(error) {
        if (!error) return true;
        var code = String(error.code || error.name || '');
        var msg = String(error.message || '');
        // 业务/数据错误不要当网络重试（例如 $dataSystem 未就绪这类编程错误）
        if (/advanced|dataSystem|is not a function|JSON|SyntaxError/i.test(msg)) {
            return false;
        }
        if (/TIMEOUT|UNAVAILABLE|NETWORK|NOT_READY|ABORT|FETCH|5\d\d|429|ECONN|Failed to fetch|Load failed/i.test(code + ' ' + msg)) {
            return true;
        }
        if (!code && msg) return true;
        return false;
    }

    function waitForKvReady(maxMs) {
        // 纯静态本地预览没有 window.dzmm：立刻降级，勿空等 20s
        if (!window.dzmm || !window.dzmm.kv) {
            return Promise.reject(makeStorageError(
                '本地预览无平台存档',
                'NO_DZMM_PLATFORM'
            ));
        }
        var kv = window.dzmm.kv;
        if (typeof kv.get !== 'function' || typeof kv.put !== 'function') {
            return Promise.reject(makeStorageError(
                '本地预览无平台存档',
                'NO_DZMM_PLATFORM'
            ));
        }
        // 127.0.0.1 本地测：有残缺 dzmm 注入时也别空等 20s
        var localHost = false;
        try {
            localHost = /^(127\.0\.0\.1|localhost)$/i.test(location.hostname || '');
        } catch (e) {}
        maxMs = maxMs || 20000;
        if (localHost) maxMs = Math.min(maxMs, 1500);
        var started = Date.now();
        return new Promise(function (resolve, reject) {
            function tick() {
                if (canUseKv()) {
                    resolve(sdk());
                    return;
                }
                if (Date.now() - started >= maxMs) {
                    reject(makeStorageError(
                        localHost ? '本地预览无平台存档' : '平台存档服务启动超时',
                        localHost ? 'NO_DZMM_PLATFORM' : 'PLATFORM_KV_TIMEOUT'
                    ));
                    return;
                }
                setTimeout(tick, 120);
            }
            tick();
        });
    }

    function loadPlatformWithRetry() {
        var attempt = 0;
        function once() {
            attempt += 1;
            return loadFromV2().then(function (v2Count) {
                if (v2Count > 0) return { source: 'v2', count: v2Count };
                return loadFromLegacyBundle().then(function (legacyCount) {
                    if (legacyCount > 0) {
                        return migrateLegacyToV2().then(function () {
                            return { source: 'legacy', count: legacyCount };
                        });
                    }
                    return { source: 'empty', count: 0 };
                });
            }).catch(function (error) {
                if (attempt < 5 && isRetryableKvError(error)) {
                    console.warn('[DzmmPlatformSave] read retry', attempt,
                        error && error.code, error && error.message);
                    return sleep(250 * attempt).then(once);
                }
                throw error;
            });
        }
        return once();
    }

    function readPlatformSaves() {
        // 冷启动：插件执行时 dzmm/kv 常常还没注入，必须先等，不能立刻判失败
        return waitForKvReady(20000).then(function () {
            return refreshCaps();
        }).then(function () {
            return loadPlatformWithRetry();
        }).then(function (info) {
            kvReady = true;
            platformReadError = null;
            if (info && info.count) {
                console.info('[DzmmPlatformSave] loaded', info.count, 'from', info.source);
            } else {
                console.info('[DzmmPlatformSave] no cloud saves yet');
            }
            return info;
        }).catch(function (error) {
            platformReadError = error || makeStorageError(
                '平台存档读取失败', 'PLATFORM_READ_FAILED');
            lastSyncError = platformReadError;
            kvReady = true;
            // 本地 http 预览无 dzmm：静默本地档，不弹吓人 toast
            if (error && error.code === 'NO_DZMM_PLATFORM') {
                lastSyncError = null;
                platformReadError = null;
                console.info('[DzmmPlatformSave] local preview: no dzmm.kv, using local slots only');
            } else {
                toastError('平台存档暂时连不上，已用本地临时存档；连上后请再手动保存一次。');
                console.warn('[DzmmPlatformSave] platform unavailable after wait/retry:',
                    error && error.code, error && error.message);
            }
            return { source: 'error', count: 0 };
        });
    }

    var loading = readPlatformSaves();
    window.DzmmPlatformSaveReady = loading;
    var seedPromise = null;

    function ensureSeeded() {
        if (seeded) return Promise.resolve();
        if (!kvReady || !DataManager.isDatabaseLoaded()) {
            return Promise.resolve();
        }
        if (seedPromise) return seedPromise;
        seedPromise = seedFromBundle().then(function () {
            seeded = true;
        }).catch(function (e) {
            platformReadError = e;
            lastSyncError = e;
            console.warn('[DzmmPlatformSave] seed error',
                e && e.code, e && e.message);
            seeded = true;
        });
        return seedPromise;
    }

    var oldBootReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () {
        if (!seeded && kvReady && DataManager.isDatabaseLoaded()) {
            ensureSeeded();
        }
        return oldBootReady.apply(this, arguments) && kvReady && seeded;
    };

    var oldSaveToForage = StorageManager.saveToForage;
    StorageManager.saveToForage = function (saveName, zip) {
        var self = this;
        return Promise.resolve(oldSaveToForage.call(self, saveName, zip)).then(function () {
            // 本地写入已成功；无平台 KV 时跳过云端（本地 http 预览）
            if (!syncEnabled || !canUseKv()) {
                lastSyncError = null;
                return;
            }
            var payload = zipToPayload(zip);
            if (!payload) return;
            bundle.saves[saveName] = payload;
            refreshNameIndex();
            return enqueueSlotWrite(function () {
                // 自动档 file0：平台写失败不阻断本地 globalInfo，避免槽位一直空白
                var required = saveName !== 'file0';
                return writeSlot(saveName, payload, required).then(function () {
                    if (saveName === 'file0' && lastSyncError) {
                        notifyAutosaveSoftFail(lastSyncError);
                        return;
                    }
                    // 手动槽位：云端写成功后立刻弹屏（不依赖 Scene_Save / dzmm.toast）
                    if (/^file([1-9]|1\d|20)$/.test(saveName) && !lastSyncError) {
                        toastOk('已同步到云端存档');
                    }
                });
            });
        });
    };

    var oldRemoveForage = StorageManager.removeForage;
    StorageManager.removeForage = function (saveName) {
        var self = this;
        return Promise.resolve(oldRemoveForage.call(self, saveName)).then(function () {
            return enqueueSlotWrite(function () {
                return deleteSlot(saveName, true);
            });
        });
    };

    var oldLoadFromForage = StorageManager.loadFromForage;
    StorageManager.loadFromForage = function (saveName) {
        var self = this;
        return Promise.resolve(oldLoadFromForage.call(self, saveName)).then(function (zip) {
            if (zip != null) return zip;
            if (Object.prototype.hasOwnProperty.call(bundle.saves, saveName)) {
                return payloadToZip(bundle.saves[saveName]);
            }
            return null;
        });
    };

    var oldForageExists = StorageManager.forageExists;
    StorageManager.forageExists = function (saveName) {
        if (oldForageExists.call(this, saveName)) return true;
        return Object.prototype.hasOwnProperty.call(bundle.saves, saveName);
    };

    function clearLocalSlots() {
        syncEnabled = false;
        var mem = window.DzmmSafeStorageMemory;
        if (mem) {
            Object.keys(mem).forEach(function (k) {
                if (k.indexOf('rmmzsave.') === 0) delete mem[k];
            });
        }
        var removals = [];
        try {
            removals.push(StorageManager.remove('config'));
            removals.push(StorageManager.remove('global'));
            for (var i = 0; i <= MAX_FILE_ID; i++) {
                removals.push(StorageManager.remove('file' + i));
            }
        } catch (e) {}
        bundle = { v: 2, saves: {}, names: [] };
        StorageManager._forageKeys = [];
        StorageManager._forageKeysUpdated = true;
        return Promise.all(removals.map(function (result) {
            return Promise.resolve(result).catch(function () {});
        }));
    }

    function clearPlatformSlots() {
        var names = knownSaveNames().concat(bundle.names || []);
        var uniq = {};
        names.forEach(function (n) { uniq[n] = true; });
        var list = Object.keys(uniq);
        var chain = Promise.resolve();
        list.forEach(function (name) {
            chain = chain.then(function () {
                return kvDelete(slotKey(name));
            });
        });
        return chain.then(function () {
            return kvDelete(INDEX_KEY);
        }).then(function () {
            return kvDelete(LEGACY_BUNDLE_KEY);
        });
    }

    function notifyAutosaveSoftFail(error) {
        var now = Date.now();
        if (notifyAutosaveSoftFail._at && now - notifyAutosaveSoftFail._at < 15000) return;
        notifyAutosaveSoftFail._at = now;
        var detail = (error && (error.code || error.message)) || '';
        var msg = '自动存档未同步到云端，请顺便手动保存一次。';
        if (detail) msg += '（' + String(detail).slice(0, 60) + '）';
        toastError(msg);
    }

    // MZ 默认只在「切图」时自动存；本游戏几乎单图，导致自动档长期为空。
    // 进入地图空闲后、打开菜单前补一次自动存。
    function scheduleMapAutosave(scene, delayMs) {
        if (!scene || !scene.isAutosaveEnabled || !scene.isAutosaveEnabled()) return;
        scene._dzmmAutosaveDue = Date.now() + (delayMs || 600);
    }

    function tryRunScheduledAutosave(scene) {
        if (!scene || !scene._dzmmAutosaveDue) return;
        if (Date.now() < scene._dzmmAutosaveDue) return;
        if (scene.isBusy && scene.isBusy()) return;
        if ($gameMap && $gameMap.isEventRunning && $gameMap.isEventRunning()) return;
        scene._dzmmAutosaveDue = 0;
        scene.requestAutosave();
    }

    var oldMapOnMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        oldMapOnMapLoaded.apply(this, arguments);
        // 含新游戏进图、读档进图、切图；与原版 transfer autosave 去重靠延迟合并
        scheduleMapAutosave(this, this._transfer ? 900 : 700);
    };

    var oldMapUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        oldMapUpdate.apply(this, arguments);
        tryRunScheduledAutosave(this);
    };

    var oldCallMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function () {
        if (this.isAutosaveEnabled()) {
            this.requestAutosave();
        }
        oldCallMenu.apply(this, arguments);
    };

    var oldAutosaveFailure = Scene_Base.prototype.onAutosaveFailure;
    Scene_Base.prototype.onAutosaveFailure = function () {
        if (typeof oldAutosaveFailure === 'function') {
            oldAutosaveFailure.apply(this, arguments);
        }
        notifyAutosaveSoftFail(lastSyncError || makeStorageError('自动存档失败', 'AUTOSAVE_FAILED'));
    };

    // 手动保存成功/失败提示（实时取 dzmm；Boot 时再确认没被后置插件盖掉）
    function hookSaveSceneToasts() {
        var success = Scene_Save.prototype.onSaveSuccess;
        if (success && success.__dzmmPlatformSaveToast) return;

        var oldOnSaveSuccess = Scene_Save.prototype.onSaveSuccess;
        var wrappedSuccess = function () {
            oldOnSaveSuccess.apply(this, arguments);
            if (canUseKv() && !lastSyncError) {
                toastOk('已同步到云端存档');
            } else if (!canUseKv()) {
                toastOk('已保存到本地');
            }
        };
        wrappedSuccess.__dzmmPlatformSaveToast = true;
        Scene_Save.prototype.onSaveSuccess = wrappedSuccess;

        var oldOnSaveFailure = Scene_Save.prototype.onSaveFailure;
        if (!(oldOnSaveFailure && oldOnSaveFailure.__dzmmPlatformSaveToast)) {
            var wrappedFailure = function () {
                oldOnSaveFailure.apply(this, arguments);
                // 勿用启动阶段残留的 PLATFORM_KV_TIMEOUT 误报「保存失败」
                var err = lastSyncError;
                if (err && (err.code === 'NO_DZMM_PLATFORM' || err.code === 'PLATFORM_KV_TIMEOUT')) {
                    err = makeStorageError('保存失败', 'SAVE_FAILED');
                }
                notifySaveFailure(err || makeStorageError('保存失败', 'SAVE_FAILED'));
            };
            wrappedFailure.__dzmmPlatformSaveToast = true;
            Scene_Save.prototype.onSaveFailure = wrappedFailure;
        }
    }
    hookSaveSceneToasts();

    var oldBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        hookSaveSceneToasts();
        return oldBootStart.apply(this, arguments);
    };

    function bindSaveLifecycle() {
        var api = sdk();
        if (!api || !api.save || typeof api.save.onAction !== 'function') return false;
        if (window.__DzmmPlatformSaveLifecycleBound) return true;
        window.__DzmmPlatformSaveLifecycleBound = true;
        api.save.onAction(function (request) {
            var action = request && (request.action || request.type);
            if (action !== 'reset' && action !== 'prepareDeleteRecord') {
                return { ok: true };
            }

            syncEnabled = false;
            var done = clearLocalSlots();
            if (canUseKv()) {
                done = done.then(function () {
                    return clearPlatformSlots();
                });
            }

            return Promise.resolve(done).then(function () {
                if (action === 'reset') {
                    return { ok: true, reload: true };
                }
                return { ok: true };
            }).catch(function (error) {
                syncEnabled = true;
                console.warn('[DzmmPlatformSave] lifecycle cleanup failed:',
                    error && error.code, error && error.message);
                return {
                    ok: false,
                    message: (error && error.message) || '清除平台存档失败'
                };
            });
        });
        return true;
    }

    if (!bindSaveLifecycle()) {
        var lifeTries = 0;
        var lifeTimer = setInterval(function () {
            lifeTries += 1;
            if (bindSaveLifecycle() || lifeTries > 100) clearInterval(lifeTimer);
        }, 100);
    }

    function flushDirtyHint() {
        if (!syncEnabled || !canUseKv()) return;
        if (pendingHiddenFlush) return pendingHiddenFlush;
        // 隐藏页时再确认 index；槽位本身保存时已 flush
        pendingHiddenFlush = writeIndex(false).then(function () {
            pendingHiddenFlush = null;
        }, function () {
            pendingHiddenFlush = null;
        });
        return pendingHiddenFlush;
    }

    try {
        window.addEventListener('pagehide', flushDirtyHint);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') flushDirtyHint();
        });
    } catch (e) {}
})();
