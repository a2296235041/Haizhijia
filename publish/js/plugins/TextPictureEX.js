//=============================================================================
// RPG Maker MZ - Text Picture EX
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Displays text as a picture with customizable presets.
 * @author Yoji Ojima (Extended)
 *
 * @param presets
 * @text Style Presets
 * @type struct<StylePreset>[]
 * @desc List of style presets. Use \PS[n] to apply preset n.
 * @default ["{\"name\":\"Default\",\"fontFace\":\"\",\"fontSize\":\"26\",\"textColor\":\"#ffffff\",\"outlineColor\":\"#000000\",\"outlineWidth\":\"3\",\"bold\":\"false\",\"italic\":\"false\"}"]
 *
 * @help TextPictureEX.js
 *
 * This plugin provides a command to show text as a picture.
 *
 * Use it in the following procedure.
 *   1. Call the plugin command "Set Text Picture".
 *   2. Execute "Show Picture" without specifying an image.
 *
 * Control Characters:
 *   \PS[n] - Apply style preset n (1-based index)
 *   \OL[n] - Change outline color (system.png color index, same as \C[n])
 *   \CR - Reset text color to preset default
 *   \OC - Reset outline color to preset default
 *   \FR - Reset all font settings to preset default
 *
 * @command set
 * @text Set Text Picture
 * @desc Sets text to display as a picture.
 *       After this, execute "Show Picture" without specifying an image.
 *
 * @arg text
 * @type multiline_string
 * @text Text
 * @desc Text to display as a picture.
 *       Control characters are allowed.
 */

/*:ja
 * @target MZ
 * @plugindesc テキストをピクチャとして表示します（プリセット対応）。
 * @author Yoji Ojima (拡張版)
 *
 * @param presets
 * @text スタイルプリセット
 * @type struct<StylePreset>[]
 * @desc スタイルプリセットのリスト。\PS[n]でプリセットnを適用できます。
 * @default ["{\"name\":\"デフォルト\",\"fontFace\":\"\",\"fontSize\":\"26\",\"textColor\":\"#ffffff\",\"outlineColor\":\"#000000\",\"outlineWidth\":\"3\",\"bold\":\"false\",\"italic\":\"false\"}"]
 *
 * @help TextPictureEX.js
 *
 * このプラグインは、テキストをピクチャとして表示するコマンドを提供します。
 *
 * 次の手順で使用してください。
 *   1. プラグインコマンド「テキストピクチャの設定」を呼び出します。
 *   2. 画像を指定せずに「ピクチャの表示」を実行します。
 *
 * ■ 制御文字
 *   \PS[n] - スタイルプリセットnを適用（1から始まる番号）
 *   \OL[n] - アウトラインカラーを変更（system.pngのカラー番号、\C[n]と同じ）
 *   \CR - フォントカラーをプリセットのデフォルトに戻す
 *   \OC - アウトラインカラーをプリセットのデフォルトに戻す
 *   \FR - すべてのフォント設定をプリセットのデフォルトに戻す
 *
 * @command set
 * @text テキストピクチャの設定
 * @desc ピクチャとして表示するテキストを設定します。
 *       この後、画像を指定せずに「ピクチャの表示」を実行してください。
 *
 * @arg text
 * @type multiline_string
 * @text テキスト
 * @desc ピクチャとして表示するテキストです。
 *       制御文字が使用可能です。
 */

/*~struct~StylePreset:
 * @param name
 * @text プリセット名
 * @desc このプリセットの名前（管理用）。
 * @default 
 *
 * @param fontFace
 * @text フォント名
 * @desc 使用するフォント名。同名の.woffファイルを自動読み込み。
 *       例: genkai-mincho → fonts/genkai-mincho.woff
 * @default 
 *
 * @param fontSize
 * @text フォントサイズ
 * @type number
 * @desc フォントサイズ。
 * @default 26
 *
 * @param textColor
 * @text フォントカラー
 * @desc 文字色（CSS形式）。例: #ffffff
 * @default #ffffff
 *
 * @param outlineColor
 * @text アウトラインカラー
 * @desc 縁取りの色（CSS形式）。例: #000000
 * @default #000000
 *
 * @param outlineWidth
 * @text アウトライン幅
 * @type number
 * @desc 縁取りの太さ。
 * @default 3
 *
 * @param bold
 * @text 太字
 * @type boolean
 * @desc 太字にするかどうか。
 * @default false
 *
 * @param italic
 * @text 斜体
 * @type boolean
 * @desc 斜体にするかどうか。
 * @default false
 */

/*~struct~StylePreset:en
 * @param name
 * @text Preset Name
 * @desc Name of this preset (for management).
 * @default 
 *
 * @param fontFace
 * @text Font Face
 * @desc Font name to use. Auto-loads .woff file with same name.
 *       Example: genkai-mincho → fonts/genkai-mincho.woff
 * @default 
 *
 * @param fontSize
 * @text Font Size
 * @type number
 * @desc Font size.
 * @default 26
 *
 * @param textColor
 * @text Text Color
 * @desc Text color (CSS format). Example: #ffffff
 * @default #ffffff
 *
 * @param outlineColor
 * @text Outline Color
 * @desc Outline color (CSS format). Example: #000000
 * @default #000000
 *
 * @param outlineWidth
 * @text Outline Width
 * @type number
 * @desc Outline thickness.
 * @default 3
 *
 * @param bold
 * @text Bold
 * @type boolean
 * @desc Whether to use bold text.
 * @default false
 *
 * @param italic
 * @text Italic
 * @type boolean
 * @desc Whether to use italic text.
 * @default false
 */

(() => {
    const pluginName = "TextPictureEX";
    const parameters = PluginManager.parameters(pluginName);
    
    const presetList = JSON.parse(parameters["presets"] || "[]").map(preset => {
        const p = JSON.parse(preset);
        return {
            name: String(p.name || ""),
            fontFace: String(p.fontFace || ""),
            fontSize: Number(p.fontSize) || 26,
            textColor: String(p.textColor || "#ffffff"),
            outlineColor: String(p.outlineColor || "#000000"),
            outlineWidth: Number(p.outlineWidth) || 3,
            bold: String(p.bold) === "true",
            italic: String(p.italic) === "true"
        };
    });
    
    const defaultPreset = {
        name: "Default",
        fontFace: "",
        fontSize: 26,
        textColor: "#ffffff",
        outlineColor: "#000000",
        outlineWidth: 3,
        bold: false,
        italic: false
    };
    
    function getPreset(id) {
        const index = (id || 1) - 1;
        return presetList[index] || presetList[0] || defaultPreset;
    }
    
    const loadedFonts = new Set();
    
    function loadFont(fontFace) {
        if (!fontFace || loadedFonts.has(fontFace)) return;
        const fontUrl = "fonts/" + fontFace + ".woff";
        const font = new FontFace(fontFace, `url("${fontUrl}")`);
        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            loadedFonts.add(fontFace);
            console.log("TextPictureEX: Font loaded - " + fontFace);
        }).catch(function(error) {
            console.error("TextPictureEX: Font load error - " + error);
        });
    }
    
    presetList.forEach(preset => {
        if (preset.fontFace) {
            loadFont(preset.fontFace);
        }
    });
    
    let textPictureText = "";

    PluginManager.registerCommand(pluginName, "set", args => {
        textPictureText = String(args.text);
    });

    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        _Game_Picture_show.apply(this, arguments);
        if (this._name === "" && textPictureText) {
            this.mzkp_text = textPictureText;
            this.mzkp_textChanged = true;
            textPictureText = "";
        }
    };

    const _Sprite_Picture_destroy = Sprite_Picture.prototype.destroy;
    Sprite_Picture.prototype.destroy = function() {
        destroyTextPictureBitmap(this.bitmap);
        _Sprite_Picture_destroy.apply(this, arguments);
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        if (this.visible && this._pictureName === "") {
            const picture = this.picture();
            const text = picture ? picture.mzkp_text || "" : "";
            const textChanged = picture && picture.mzkp_textChanged;
            if (this.mzkp_text !== text || textChanged) {
                this.mzkp_text = text;
                destroyTextPictureBitmap(this.bitmap);
                this.bitmap = createTextPictureBitmap(text);
                picture.mzkp_textChanged = false;
            }
        } else {
            this.mzkp_text = "";
        }
    };

    function createTextPictureBitmap(text) {
        let currentPreset = getPreset(1);
        let maxFontSize = currentPreset.fontSize;
        let maxOutlineWidth = currentPreset.outlineWidth;
        
        class Window_TextPicture extends Window_Base {
            applyPreset(preset) {
                currentPreset = preset;
                if (preset.fontFace) {
                    this.contents.fontFace = preset.fontFace;
                }
                this.contents.fontSize = preset.fontSize;
                this.contents.textColor = preset.textColor;
                this.contents.outlineColor = preset.outlineColor;
                this.contents.outlineWidth = preset.outlineWidth;
                this.contents.fontBold = preset.bold;
                this.contents.fontItalic = preset.italic;
                // 最大値を追跡
                if (preset.fontSize > maxFontSize) maxFontSize = preset.fontSize;
                if (preset.outlineWidth > maxOutlineWidth) maxOutlineWidth = preset.outlineWidth;
            }
            
            resetFontSettings() {
                super.resetFontSettings();
                this.applyPreset(currentPreset);
            }
            
            lineHeight() {
                return this.contents ? this.contents.fontSize + 8 : currentPreset.fontSize + 8;
            }
            
            processEscapeCharacter(code, textState) {
                switch (code) {
                    case "PS": // Preset Style - プリセットを適用
                        const psId = this.obtainEscapeParam(textState);
                        const newPreset = getPreset(psId);
                        this.applyPreset(newPreset);
                        break;
                    case "OL": // Outline coLor - アウトラインカラーを変更
                        const olColorIndex = this.obtainEscapeParam(textState);
                        this.contents.outlineColor = ColorManager.textColor(olColorIndex);
                        break;
                    case "CR": // Color Reset - フォントカラーをデフォルトに戻す
                        this.contents.textColor = currentPreset.textColor;
                        break;
                    case "OC": // Outline Color reset - アウトラインカラーをデフォルトに戻す
                        this.contents.outlineColor = currentPreset.outlineColor;
                        break;
                    case "FR": // Font Reset - すべてのフォント設定をデフォルトに戻す
                        this.resetFontSettings();
                        break;
                    default:
                        super.processEscapeCharacter(code, textState);
                        if (this.contents && this.contents.fontSize > maxFontSize) {
                            maxFontSize = this.contents.fontSize;
                        }
                        break;
                }
            }
        }
        
        const tempWindow = new Window_TextPicture(new Rectangle());
        tempWindow.padding = 0;
        
        tempWindow.move(0, 0, Graphics.width * 2, Graphics.height * 2);
        tempWindow.createContents();
        tempWindow.resetFontSettings();
        
        const size = tempWindow.textSizeEx(text);
        const textWidth = size.width + maxOutlineWidth * 2 + 16;
        const textHeight = size.height + maxOutlineWidth * 2 + 8;
        
        currentPreset = getPreset(1);
        maxFontSize = currentPreset.fontSize;
        maxOutlineWidth = currentPreset.outlineWidth;
        
        tempWindow.contents.destroy();
        tempWindow.move(0, 0, textWidth, textHeight);
        tempWindow.createContents();
        tempWindow.resetFontSettings();
        
        tempWindow.drawTextEx(text, 0, 0, textWidth);
        
        const bitmap = tempWindow.contents;
        tempWindow.contents = null;
        tempWindow.destroy();
        bitmap.mzkp_isTextPicture = true;
        return bitmap;
    }

    function destroyTextPictureBitmap(bitmap) {
        if (bitmap && bitmap.mzkp_isTextPicture) {
            bitmap.destroy();
        }
    }
})();
