//=============================================================================
// NrSaveData.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc セーブデータがあるかどうか判定する
 * @author N
 *
 * @param includeAutoSave
 * @text オートセーブを含める
 * @type boolean
 * @default true
 * @desc true: 自動で生成されたセーブファイルを含める / false: 除外する
 *
 * @help
 * 使用方法:
 *
 * 【セーブスロット1にセーブがある場合】
 * 条件分岐 → スクリプト：
 *   セーブ有無(1)
 *
 * 【セーブが1つでも存在する場合】
 * 条件分岐 → スクリプト：
 *   全セーブ有無().length > 0
 *
 * 【セーブが1つも存在しない場合】
 * 条件分岐 → スクリプト：
 *   全セーブ有無().length === 0
 *
 * 【特定スロット（例：3）にセーブがある場合】
 * 条件分岐 → スクリプト：
 *   全セーブ有無().includes(3)
 */

(() => {
    const parameters = PluginManager.parameters("NrSaveData");
    const includeAutoSave = parameters["includeAutoSave"] === "true";

    window.セーブ有無 = function(n) {
        const fs = require("fs");
        const path = require("path");
        const dir = path.join(process.mainModule.path, "save");
        const filePath = path.join(dir, `file${n}.rmmzsave`);
        return fs.existsSync(filePath);
    };

    window.全セーブ有無 = function() {
        const fs = require("fs");
        const path = require("path");
        const dir = path.join(process.mainModule.path, "save");

        if (!fs.existsSync(dir)) return [];

        return fs.readdirSync(dir)
            .filter(name => {
                const match = name.match(/^file(\d+)\.rmmzsave$/i);
                if (!match) return false;
                const id = Number(match[1]);
                if (!includeAutoSave && id === 0) return false;
                return true;
            })
            .map(name => Number(name.match(/\d+/)[0]));
    };
})();
