/*:
 * @plugindesc DZMM 沙箱：localStorage/IndexedDB 不可用时用内存存档
 * @author dzmm-local
 *
 * @help
 * RPG Maker MZ 存档走 localforage。Studio/聊天 iframe 常无同源存储。
 * 本插件在探测失败时改写 StorageManager forage API 为内存实现。
 * 跨会话持久化由 DzmmPlatformSave（dzmm.kv）负责。
 */
(function () {
    'use strict';

    var memory = Object.create(null);
    window.DzmmSafeStorageMemory = memory;

    function probeLocalStorage() {
        try {
            var ls = window.localStorage;
            if (!ls) return false;
            var k = '__dzmm_ls_probe__';
            ls.setItem(k, '1');
            ls.removeItem(k);
            return true;
        } catch (e) {
            return false;
        }
    }

    var useMemory = !probeLocalStorage();
    window.DzmmSafeStorageUseMemory = useMemory;

    if (useMemory) {
        console.warn('[DzmmSafeStorage] localStorage blocked; using in-memory storage');
    }

    function executeCallback(callback, error, result) {
        if (typeof callback === 'function') {
            try {
                callback(error, result);
            } catch (e) {}
        }
        if (error) return Promise.reject(error);
        return Promise.resolve(result);
    }

    var MEMORY_DRIVER = 'dzmmMemoryStorage';
    var memoryDriver = {
        _driver: MEMORY_DRIVER,
        _support: function () {
            return Promise.resolve(true);
        },
        _initStorage: function (options) {
            var self = this;
            return new Promise(function (resolve) {
                self._dzmmStore = memory;
                self._dbInfo = {
                    db: memory,
                    storeName: (options && options.storeName) || 'keyvaluepairs'
                };
                resolve();
            });
        },
        clear: function (callback) {
            Object.keys(memory).forEach(function (k) {
                delete memory[k];
            });
            return executeCallback(callback, null, undefined);
        },
        getItem: function (key, callback) {
            var v = Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
            return executeCallback(callback, null, v);
        },
        iterate: function (iteratorCallback, successCallback) {
            var i = 0;
            Object.keys(memory).forEach(function (k) {
                iteratorCallback(memory[k], k, i++);
            });
            return executeCallback(successCallback, null, undefined);
        },
        key: function (n, callback) {
            var keys = Object.keys(memory);
            var v = n >= 0 && n < keys.length ? keys[n] : null;
            return executeCallback(callback, null, v);
        },
        keys: function (callback) {
            return executeCallback(callback, null, Object.keys(memory));
        },
        length: function (callback) {
            return executeCallback(callback, null, Object.keys(memory).length);
        },
        removeItem: function (key, callback) {
            delete memory[key];
            return executeCallback(callback, null, undefined);
        },
        setItem: function (key, value, callback) {
            memory[key] = value;
            return executeCallback(callback, null, value);
        }
    };

    function refreshForageKeys() {
        if (typeof StorageManager === 'undefined') return;
        StorageManager._forageKeys = Object.keys(memory).filter(function (k) {
            return k.indexOf('rmmzsave.') === 0;
        });
        StorageManager._forageKeysUpdated = true;
    }

    function patchStorageManagerForage() {
        if (typeof StorageManager === 'undefined') return;

        StorageManager.saveToForage = function (saveName, zip) {
            memory[this.forageKey(saveName)] = zip;
            refreshForageKeys();
            return Promise.resolve();
        };

        StorageManager.loadFromForage = function (saveName) {
            var key = this.forageKey(saveName);
            return Promise.resolve(
                Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null
            );
        };

        StorageManager.removeForage = function (saveName) {
            delete memory[this.forageKey(saveName)];
            refreshForageKeys();
            return Promise.resolve();
        };

        StorageManager.updateForageKeys = function () {
            refreshForageKeys();
            return Promise.resolve(0);
        };

        StorageManager.forageExists = function (saveName) {
            return Object.prototype.hasOwnProperty.call(memory, this.forageKey(saveName));
        };
    }

    function installMemoryForage() {
        if (typeof localforage === 'undefined' || !localforage.defineDriver) return;
        localforage.defineDriver(memoryDriver).then(function () {
            return localforage.setDriver(MEMORY_DRIVER);
        }).then(function () {
            console.info('[DzmmSafeStorage] localforage memory driver ready');
        }).catch(function (e) {
            console.warn('[DzmmSafeStorage] memory driver failed', e);
        });
    }

    if (useMemory) {
        patchStorageManagerForage();
        if (typeof localforage !== 'undefined') {
            installMemoryForage();
        } else {
            var tries = 0;
            var timer = setInterval(function () {
                tries += 1;
                if (typeof localforage !== 'undefined') {
                    clearInterval(timer);
                    installMemoryForage();
                } else if (tries > 200) {
                    clearInterval(timer);
                }
            }, 20);
        }
    }

    // 浏览器 / Cursor 预览可能注入假 require，导致 Utils.isNwjs() 误判为桌面端，
    // 进而走 saveToLocalFile → require('path') 崩（ReferenceError / セーブ失敗）。
    function canUseNodeFs() {
        try {
            if (typeof require !== 'function') return false;
            var fs = require('fs');
            return !!(fs && typeof fs.writeFileSync === 'function');
        } catch (e) {
            return false;
        }
    }

    function patchLocalFileForBrowser() {
        if (typeof StorageManager === 'undefined') return;

        var _isLocalMode = StorageManager.isLocalMode;
        StorageManager.isLocalMode = function () {
            if (!canUseNodeFs()) return false;
            return typeof _isLocalMode === 'function' ? _isLocalMode.call(this) : false;
        };

        function webKey(saveName) {
            return 'rmmzlocal.' + String(saveName || '');
        }

        var _saveLocal = StorageManager.saveToLocalFile;
        StorageManager.saveToLocalFile = function (saveName, zip) {
            if (!canUseNodeFs()) {
                try {
                    var key = webKey(saveName);
                    if (window.DzmmSafeStorageMemory) {
                        window.DzmmSafeStorageMemory[key] = zip;
                    } else if (window.localStorage) {
                        window.localStorage.setItem(key, zip);
                    }
                } catch (e) {}
                return Promise.resolve();
            }
            return _saveLocal.apply(this, arguments);
        };

        var _loadLocal = StorageManager.loadFromLocalFile;
        StorageManager.loadFromLocalFile = function (saveName) {
            if (!canUseNodeFs()) {
                try {
                    var key = webKey(saveName);
                    if (window.DzmmSafeStorageMemory &&
                        Object.prototype.hasOwnProperty.call(window.DzmmSafeStorageMemory, key)) {
                        return Promise.resolve(window.DzmmSafeStorageMemory[key]);
                    }
                    if (window.localStorage) {
                        return Promise.resolve(window.localStorage.getItem(key));
                    }
                } catch (e) {}
                return Promise.resolve(null);
            }
            return _loadLocal.apply(this, arguments);
        };

        var _removeLocal = StorageManager.removeLocalFile;
        if (typeof _removeLocal === 'function') {
            StorageManager.removeLocalFile = function (saveName) {
                if (!canUseNodeFs()) {
                    try {
                        var key = webKey(saveName);
                        if (window.DzmmSafeStorageMemory) delete window.DzmmSafeStorageMemory[key];
                        if (window.localStorage) window.localStorage.removeItem(key);
                    } catch (e) {}
                    return;
                }
                return _removeLocal.apply(this, arguments);
            };
        }

        console.info('[DzmmSafeStorage] browser local-file shim on; nodeFs=', canUseNodeFs());
    }
    patchLocalFileForBrowser();

    // unload 在部分 iframe 会触发 Permissions policy 警告；改用 pagehide
    if (typeof SceneManager !== 'undefined' && SceneManager.setupEventHandlers) {
        var _setup = SceneManager.setupEventHandlers;
        SceneManager.setupEventHandlers = function () {
            var add = window.addEventListener.bind(window);
            window.addEventListener = function (type, listener, options) {
                if (type === 'unload') return undefined;
                return add(type, listener, options);
            };
            try {
                _setup.apply(this, arguments);
            } finally {
                window.addEventListener = add;
            }
            try {
                window.addEventListener('pagehide', this.onUnload.bind(this));
            } catch (e2) {}
        };
    }
})();
