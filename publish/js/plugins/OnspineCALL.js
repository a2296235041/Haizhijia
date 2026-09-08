/*:
 * @target MZ
 * @plugindesc Spinespine補助プラグイン
 * @author Onmoremind
 * 
 * @param resetAnimationName
 * @text リセット用アニメ名
 * @type string
 * @default idle
 * @desc トラックリセット時に使用するアニメ名
 *
 * @param pictureIdVariable
 * @text ピクチャID変数
 * @type variable
 * @default 0
 * @desc ピクチャIDを格納する変数
 *
 * @param xVariable
 * @text X座標変数
 * @type variable
 * @default 0
 * @desc X座標を格納する変数
 *
 * @param yVariable
 * @text Y座標変数
 * @type variable
 * @default 0
 * @desc Y座標を格納する変数
 *
 * @param scaleVariable
 * @text 拡大率変数
 * @type variable
 * @default 0
 * @desc 拡大率を格納する変数
 *
 * @param skeletonNameVariable
 * @text スケルトン名変数
 * @type variable
 * @default 0
 * @desc スケルトン名を格納する変数
 *
 * @param trackVariable
 * @text トラック番号変数
 * @type variable
 * @default 0
 * @desc トラック番号を格納する変数
 *
 * @param animationNameVariable
 * @text アニメーション名変数
 * @type variable
 * @default 0
 * @desc アニメーション名を格納する変数
 *
 * @param skinNamesVariable
 * @text スキン名変数
 * @type variable
 * @default 0
 * @desc スキン名（カンマ区切りまたは配列形式）を格納する変数
 *
 * @param fadeDurationVariable
 * @text フェード時間変数
 * @type variable
 * @default 0
 * @desc フェード時間（フレーム）を格納する変数（0:即時表示、1以上:フェードイン）
 *
 * @param skinPresets
 * @text スキンプリセット一覧
 * @type struct<SkinPreset>[]
 * @default []
 * @desc プリセット名ごとにレイヤー別スキンマッピングを登録（スケルトンごとに異なるスキン設定を管理）
 *
 * @param skeletonPartAlphaDefaults
 * @text スケルトン別パーツアルファ既定値
 * @type struct<SkeletonPartAlphaDefault>[]
 * @default []
 * @desc スケルトンごとにパーツの透明度上限を事前登録（出現時にpartAlphaSettingsが未指定なら自動適用）
 *
 * @param presets
 * @text プリセット一覧
 * @type struct<SpinePreset>[]
 * @default []
 * @desc 二重配列呼び出し用のプリセットを事前登録（プリセット名で呼び出し可能）
 *
 * @command CallSpineFull
 * @text Spine呼出
 * @desc 指定した設定でSpine呼出
 *
 * @arg pictureId
 * @type number
 * @text ピクチャID
 * @desc 使用するピクチャ番号（例：5）
 *
 * @arg x
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text X座標
 *
 * @arg y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text Y座標
 *
 * @arg pictureScale
 * @type number
 * @min 1
 * @max 500
 * @default 100
 * @text ピクチャ拡大率（％）
 *
 * @arg skeletonName
 * @type string
 * @text スケルトン名
 * 
 * @arg trackSettings
 * @type struct<SpineTrack>[]
 * @text アニメーション設定

 * @arg layerSkinSettings
 * @type struct<SkinLayerEntry>[]
 * @text レイヤースキン設定
 * @desc レイヤー名ごとに適用するスキン名を指定（例: レイヤー=face, スキン=normal → face/normal を適用）
 *
 * @arg mixValue
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.3
 * @text ミックス時間（秒）
 * 
 * @arg mosaicSettings
 * @type struct<MosaicData>[]
 * @text モザイク設定リスト
 *
 * @arg useFade
 * @type select
 * @option 即時表示（不透明）
 * @value false
 * @option フェード表示
 * @value true
 * @option 透明のまま表示
 * @value transparent
 * @default false
 * @text 表示モード
 * @desc 即時表示=不透明で即表示、フェード表示=徐々にフェードイン、透明のまま表示=alpha0で配置（後から手動フェード）
 *
 * @arg fadeDuration
 * @type number
 * @default 30
 * @text フェード時間（フレーム）
 *
 * @arg partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc フェード完了時に別のアルファ値で止めるパーツを指定（影パーツ等）
 *
 * @command CallSpineVar
 * @text Spinevar呼出
 * @desc 変数参照でSpine呼出（pictureID、X、Y座標に加え拡大率・スケルトン名も変数から取得可能）
 *
 * @arg pictureIdVar
 * @type variable
 * @text ピクチャID変数
 * @desc ピクチャIDが格納されている変数
 *
 * @arg xVar
 * @type variable
 * @text X座標変数
 * @desc X座標が格納されている変数
 *
 * @arg yVar
 * @type variable
 * @text Y座標変数
 * @desc Y座標が格納されている変数
 *
 * @arg pictureScaleVar
 * @type variable
 * @text 拡大率変数
 * @desc 拡大率に使用している変数
 *
 * @arg skeletonNameVar
 * @type variable
 * @text スケルトン名変数
 * @desc スケルトン名に使用している変数
 * 
 * @arg trackSettings
 * @type struct<SpineTrack>[]
 * @text アニメーション設定

 * @arg layerSkinSettings
 * @type struct<SkinLayerEntry>[]
 * @text レイヤースキン設定
 * @desc レイヤー名ごとに適用するスキン名を指定
 *
 * @arg mixValue
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.3
 * @text ミックス時間（秒）
 * 
 * @arg mosaicSettings
 * @type struct<MosaicData>[]
 * @text モザイク設定リスト
 *
 * @arg useFade
 * @type select
 * @option 即時表示（不透明）
 * @value false
 * @option フェード表示
 * @value true
 * @option 透明のまま表示
 * @value transparent
 * @default false
 * @text 表示モード
 * @desc 即時表示=不透明で即表示、フェード表示=徐々にフェードイン、透明のまま表示=alpha0で配置（後から手動フェード）
 *
 * @arg fadeDuration
 * @type number
 * @default 30
 * @text フェード時間（フレーム）
 *
 * @arg partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc フェード完了時に別のアルファ値で止めるパーツを指定（影パーツ等）
 *
 * @command updateSpine
 * @text Spine再設定
 * @desc 表示済みSpineにアニメ・ミックス・再生速度を再適用
 *
 * @arg pictureId
 * @type number
 * @default 10
 * @text ピクチャID
 * 
 * @arg trackSettings
 * @type struct<SpineTrack>[]
 * @default []
 * @text アニメ設定リスト
 *
 * @arg mixValue
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.3
 * @text setmix値
 *
 * @arg timeScale
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 1.0
 * @text アニメ再生速度
 * 
 * @arg resetOtherTracks
 * @type boolean
 * @default false
 * @text 他トラックをリセット
 * @desc 指定されていないトラックはリセットアニメに置き換える

 *
 * @command changeSkin
 * @text Spineスキン変更
 * @desc 表示済みSpineのスキンを変更
 *
 * @arg pictureId
 * @type number
 * @default 10
 * @text ピクチャID
 * 
 * @arg layerSkinSettings
 * @type struct<LayerSkinSetting>[]
 * @default []
 * @text レイヤー別スキン設定
 * 
 * @command playRandomAnimation
 * @text Spineランダム再生
 * @desc 指定トラックにランダム再生（重み付き）でアニメーションを設定
 *
 * @arg pictureId
 * @type number
 * @default 10
 * @text ピクチャID
 *
 * @arg trackId
 * @type number
 * @default 0
 * @text トラック番号
 *
 * @arg randomEntries
 * @type struct<RandomAnim>[]
 * @default []
 * @text ランダム再生設定
 * @desc アニメーション名と回数の設定
 * 
 * @command setSpineTimeScale
 * @text Spine再生速度変更
 * @desc 指定したSpineのアニメ再生速度だけを変更します
 *
 * @arg pictureId
 * @type number
 * @default 99
 * @text ピクチャID
 *
 * @arg timeScale
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 1.0
 * @text アニメ再生速度
 *
 * @command setSpineAlpha
 * @text Spineアルファ設定
 *
 * @arg pictureId
 * @type number
 * @default 99
 * @text ピクチャID
 *
 * @arg alphaTracks
 * @type struct<AlphaTrack>[]
 * @text アルファ設定リスト
 * 
 * @command setSpineColor
 * @text Spineセットカラー変更
 * @desc 指定したSpineのセットカラー（R,G,B,A）を変更します
 *
 * @arg pictureId
 * @type number
 * @default 99
 * @text ピクチャID
 *
 * @arg colorR
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.5
 * @text R（赤）
 * @desc 赤チャンネル（0〜1）
 *
 * @arg colorG
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.5
 * @text G（緑）
 * @desc 緑チャンネル（0〜1）
 *
 * @arg colorB
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.5
 * @text B（青）
 * @desc 青チャンネル（0〜1）
 *
 * @arg colorA
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 1
 * @text A（不透明度）
 * @desc アルファチャンネル（0〜1）
 * 
 * @command fadeSpineAlpha
 * @text Spineフェード透明化
 * @desc 指定したSpineをフェードさせて透明度を変更
 *
 * @arg pictureId
 * @type number
 * @default 99
 * @text ピクチャID
 *
 * @arg targetAlpha
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0
 * @text 目標アルファ値
 *
 * @arg fadeDuration
 * @type number
 * @min 1
 * @default 30
 * @text フェード時間（フレーム）
 *
 * @arg partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc フェード中に別のアルファ値で止めるパーツを指定（影パーツ等）
 *
 * @command showTestSpine
 * @text 座標確認
 * @desc 座標確認用コマンド
 *
 * @arg pictureName
 * @type file
 * @dir img/pictures/
 * @text ドラック用画像
 *
 * @arg skeletonName
 * @type string
 * @default UI
 * @text スケルトン名
 *
 * @arg animationName
 * @type string
 * @default 1
 * @text アニメーション名
 * 
 * @arg skinNames
 * @type string[]
 * @default []
 * @text スキン名リスト
 * @desc 複数スキンを順に適用
 * 
 * @arg x
 * @type number
 * @default 400
 * @text X座標
 *
 * @arg y
 * @type number
 * @default 300
 * @text Y座標
 *
 * @arg scalePercent
 * @type number
 * @default 100
 * @text 拡大率（％）
 * 
 * @command fadeOutAndErase
 * @text 消去
 * @desc 指定したSpineをフェードアウトしてから消去
 *
 * @arg pictureId
 * @type number
 * @text ピクチャID
 * @desc 消去するピクチャ番号
 *
 * @arg fadeDuration
 * @type number
 * @default 30
 * @text フェード時間（フレーム）
 * @desc フェードアウトにかける時間
 * 
 * @command VarSpinecall
 * @text VarSpinecall
 * @desc 設定した変数の値を使用してSpineを呼出
 * 
 * @command VaranimCall
 * @text VaranimCall
 * @desc 設定した変数の値を使用してSpineアニメーションを変更
 *
 * @arg option
 * @type struct<AnimationOption>
 * @text オプション設定
 * @desc アニメーション再生のオプション設定
 *
 * @command showAnimBrowser
 * @text アニメ確認
 * @desc Spineのアニメーション・スキンをウィンドウで確認・適用するデバッグツール
 *
 * @arg pictureName
 * @type file
 * @dir img/pictures/
 * @text ドラッグ用画像
 *
 * @arg skeletonName
 * @type string
 * @default UI
 * @text スケルトン名
 *
 * @arg x
 * @type number
 * @min -9999
 * @max 9999
 * @default 400
 * @text X座標
 *
 * @arg y
 * @type number
 * @min -9999
 * @max 9999
 * @default 300
 * @text Y座標
 *
 * @arg scalePercent
 * @type number
 * @min 1
 * @max 500
 * @default 100
 * @text 拡大率（％）
 *
 * @arg resetAnimName
 * @type string
 * @default 000
 * @text リセット用アニメ名
 * @desc キャンセル時に全トラックに適用するアニメーション名
 *
 * @command CallPreset
 * @text プリセット呼出
 * @desc 登録済みプリセット名を指定してSpine二重配列コマンドを実行
 *
 * @arg presetName
 * @type string
 * @text プリセット名
 * @desc 実行するプリセットの名前
 *
 * @command CallPresetAnim
 * @text プリセットアニメ適用
 * @desc プリセットの設定を使い、指定トラックに上下アニメを適用
 *
 * @arg presetName
 * @type string
 * @text プリセット名
 * @desc 使用するプリセットの名前（ピクチャID・スキン等の設定を参照）
 *
 * @arg trackId
 * @type number
 * @min 0
 * @default 0
 * @text 使用トラック
 * @desc アニメーションを適用するトラック番号
 *
 * @arg animA
 * @type string
 * @default
 * @text アニメーションA（下）
 * @desc 下ピクチャ用アニメーション名
 *
 * @arg animB
 * @type string
 * @default
 * @text アニメーションB（上）
 * @desc 上ピクチャ用アニメーション名
 *
 * @command CallPresetChainTransition
 * @text プリセット連鎖遷移
 * @desc プリセット設定を使い、アニメ配列を順番に遷移し最後のアニメでBlink繰り返し
 *
 * @arg presetName
 * @type string
 * @text プリセット名
 * @desc 使用するプリセットの識別名
 *
 * @arg trackId
 * @type number
 * @min 0
 * @default 0
 * @text 使用トラック
 * @desc アニメーションを適用するトラック番号
 *
 * @arg animations
 * @type string[]
 * @default []
 * @text アニメーション配列
 * @desc 順番に遷移するアニメ名の配列（最後のアニメがBlinkで繰り返し）
 *
 * @arg fadeDuration
 * @type number
 * @min 1
 * @default 30
 * @text フェード時間（フレーム）
 * @desc フェードイン・フェードアウトにかけるフレーム数
 *
 * @arg fadeWait
 * @type number
 * @min 0
 * @default 0
 * @text フェード間ウェイト（フレーム）
 * @desc フェードイン完了後、フェードアウト開始までの待機フレーム数
 *
 * @command CallPresetChainTransitionPlus
 * @text プリセット連鎖遷移＋
 * @desc 遷移アニメ配列を順番に実行し、完了後に指定のアニメA/BでBlinkを再開
 *
 * @arg presetName
 * @type string
 * @text プリセット名
 * @desc 使用するプリセットの識別名
 *
 * @arg trackId
 * @type number
 * @min 0
 * @default 0
 * @text 使用トラック
 * @desc アニメーションを適用するトラック番号
 *
 * @arg animations
 * @type struct<TransitionAnimStep>[]
 * @default []
 * @text 遷移アニメ配列
 * @desc 順番に遷移するアニメーションステップの配列
 *
 * @arg postAnimA
 * @type string
 * @text 遷移後アニメA（下）
 * @desc 遷移完了後に下ピクチャでBlinkするアニメ名
 *
 * @arg postAnimB
 * @type string
 * @text 遷移後アニメB（上）
 * @desc 遷移完了後に上ピクチャでBlinkするアニメ名
 *
 * @arg lastFadeDuration
 * @type number
 * @min 1
 * @default 30
 * @text 最終遷移フェード時間
 * @desc 最後のアニメからpostAnimへの遷移にかけるフレーム数
 *
 * @arg lastFadeWait
 * @type number
 * @min 0
 * @default 0
 * @text 最終遷移ウェイト
 * @desc 最後のアニメからpostAnimへの遷移のフェードイン後の待機フレーム数
 */

/*~struct~TransitionAnimStep:
 * @param animName
 * @type string
 * @text アニメーション名
 * @desc 遷移するアニメーション名
 *
 * @param fadeDuration
 * @type number
 * @min 1
 * @default 30
 * @text 偏移時間（フレーム）
 * @desc このステップのフェードイン・フェードアウトにかけるフレーム数
 *
 * @param fadeWait
 * @type number
 * @min 0
 * @default 0
 * @text 待機ウェイト（フレーム）
 * @desc このステップのフェードイン完了後、フェードアウト開始までの待機フレーム数
 *
 * @param commonEventId
 * @type common_event
 * @default 0
 * @text コモンイベント
 * @desc このステップ開始時に呼び出すコモンイベント（0で無し）
 */

/*~struct~SpineTrack:
 * @param trackId
 * @type number
 * @text トラック番号
 *
 * @param animations
 * @type string[]
 * @text アニメーション名リスト
 *
 * @param order
 * @type select
 * @option sequential
 * @option random
 * @option shuffle
 * @default sequential
 * @text 再生順序
 *
 * @param continuance
 * @type select
 * @option continue
 * @option reset
 * @option none
 * @default continue
 * @text 継続オプション
 *
 * @param interrupt
 * @type boolean
 * @default false
 * @text 割り込み
 */

/*~struct~MosaicData:
 * @param image
 * @type string
 * @text 対象パーツ名
 *
 * @param size
 * @type number
 * @min 1
 * @text モザイクサイズ（px）
 */

/*~struct~AlphaTrack:
 * @param trackId
 * @type number
 * @text トラック番号
 *
 * @param alpha
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 1.0
 * @text アルファ値（0～1.0）
 *
 * @param overwrite
 * @type boolean
 * @default false
 * @text 上書き（overwrite）
 */

/*~struct~AnimationOption:
 * @param order
 * @type select
 * @option sequential
 * @option random
 * @option shuffle
 * @default sequential
 * @text 順序オプション
 * @desc アニメーションの再生順序
 *
 * @param continuance
 * @type select
 * @option continue
 * @option reset
 * @option none
 * @default continue
 * @text 継続オプション
 * @desc アニメーション終了後の動作
 *
 * @param interrupt
 * @type boolean
 * @default false
 * @text 割り込みフラグ
 * @desc 現在のアニメーションを中断するか
 *
 * @param keepSkin
 * @type boolean
 * @default false
 * @text スキン変数使用
 * @desc trueならスキン変数の内容でスキンを適用する。falseなら適用しない
 */

/*~struct~RandomAnim:
 * @param name
 * @type string
 * @text アニメーション名
 *
 * @param times
 * @type number
 * @min 1
 * @default 1
 * @text 回数（重み）
 */

/*~struct~SkinLayerEntry:
 * @param layerName
 * @type string
 * @text レイヤー名
 * @desc スキンのレイヤー（カテゴリ）名
 *
 * @param skinName
 * @type string
 * @text スキン名
 * @desc 指定レイヤーに適用するスキン名
 */

/*~struct~SkinLayerVarEntry:
 * @param layerName
 * @type string
 * @text レイヤー名
 * @desc スキンのレイヤー（カテゴリ）名
 *
 * @param skinNameVar
 * @type variable
 * @default 0
 * @text スキン名変数
 * @desc スキン名を格納した変数番号
 */

/*~struct~LayerSkinSetting:
 * @param layerName
 * @type string
 * @text レイヤー名
 * @desc スキンのレイヤー（カテゴリ）名
 *
 * @param skinName
 * @type string
 * @text スキン名
 * @desc 指定レイヤーに適用するスキン名
 */

/*~struct~SpineCallEntry:
 * @param pictureId
 * @type number
 * @text ピクチャID
 * @desc 使用するピクチャ番号
 *
 * @param x
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text X座標
 *
 * @param y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text Y座標
 *
 * @param pictureScale
 * @type number
 * @min 1
 * @max 500
 * @default 100
 * @text ピクチャ拡大率（％）
 *
 * @param skeletonName
 * @type string
 * @text スケルトン名
 *
 * @param trackSettings
 * @type struct<SpineTrack>[]
 * @text アニメーション設定
 *
 * @param layerSkinSettings
 * @type struct<SkinLayerEntry>[]
 * @text レイヤースキン設定
 * @desc レイヤー名ごとに適用するスキン名を指定
 *
 * @param mixValue
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.3
 * @text ミックス時間（秒）
 *
 * @param mosaicSettings
 * @type struct<MosaicData>[]
 * @text モザイク設定リスト
 *
 * @param useFade
 * @type select
 * @option 即時表示（不透明）
 * @value false
 * @option フェード表示
 * @value true
 * @option 透明のまま表示
 * @value transparent
 * @default false
 * @text 表示モード
 * @desc 即時表示=不透明で即表示、フェード表示=徐々にフェードイン、透明のまま表示=alpha0で配置（後から手動フェード）
 *
 * @param fadeDuration
 * @type number
 * @default 30
 * @text フェード時間（フレーム）
 *
 * @param partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc フェード完了時に別のアルファ値で止めるパーツを指定
 */

/*~struct~SpineCallEntryVar:
 * @param pictureId
 * @type number
 * @text ピクチャID
 * @desc 使用するピクチャ番号（直接指定）
 *
 * @param xVar
 * @type variable
 * @text X座標変数
 * @desc X座標が格納されている変数
 *
 * @param yVar
 * @type variable
 * @text Y座標変数
 * @desc Y座標が格納されている変数
 *
 * @param pictureScaleVar
 * @type variable
 * @text 拡大率変数
 * @desc 拡大率が格納されている変数（0で100%）
 *
 * @param skeletonNameVar
 * @type variable
 * @text スケルトン名変数
 * @desc スケルトン名が格納されている変数
 *
 * @param trackSettings
 * @type struct<SpineTrack>[]
 * @text アニメーション設定
 *
 * @param layerSkinSettings
 * @type struct<SkinLayerEntry>[]
 * @text レイヤースキン設定
 * @desc レイヤー名ごとに適用するスキン名を指定
 *
 * @param mixValue
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.3
 * @text ミックス時間（秒）
 *
 * @param mosaicSettings
 * @type struct<MosaicData>[]
 * @text モザイク設定リスト
 *
 * @param useFade
 * @type select
 * @option 即時表示（不透明）
 * @value false
 * @option フェード表示
 * @value true
 * @option 透明のまま表示
 * @value transparent
 * @default false
 * @text 表示モード
 * @desc 即時表示=不透明で即表示、フェード表示=徐々にフェードイン、透明のまま表示=alpha0で配置（後から手動フェード）
 *
 * @param fadeDuration
 * @type number
 * @default 30
 * @text フェード時間（フレーム）
 *
 * @param partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc フェード完了時に別のアルファ値で止めるパーツを指定
 */

/*~struct~SpinePreset:
 * @param presetName
 * @type string
 * @text プリセット名
 * @desc 呼び出し時に使用する識別名
 *
 * @param pictureIdA
 * @type number
 * @default 10
 * @text ピクチャID（下）
 * @desc ベースとなる下のピクチャID（常に表示）
 *
 * @param pictureIdB
 * @type number
 * @default 11
 * @text ピクチャID（上）
 * @desc 上に重ねるピクチャID
 *
 * @param x
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text X座標
 * @desc X座標
 *
 * @param y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @text Y座標
 * @desc Y座標
 *
 * @param scale
 * @type number
 * @min 0
 * @max 1000
 * @default 100
 * @text 拡大率
 * @desc 拡大率（%）
 *
 * @param skeletonName
 * @type string
 * @default
 * @text スケルトン名
 * @desc スケルトン名
 *
 * @param skinPresetName
 * @type string
 * @default
 * @text スキンプリセット名
 * @desc 使用するスキンプリセットの名前（スキンプリセット一覧から参照）
 *
 * @param duration
 * @type number
 * @min 1
 * @default 30
 * @text 点滅間隔/フェード時間（フレーム）
 * @desc Blink=点滅間隔、Transition=フェード時間
 *
 * @param count
 * @type number
 * @min 0
 * @default 0
 * @text 点滅回数（Blinkのみ）
 * @desc 0で無限ループ（Transitionでは無視）
 *
 * @param wait
 * @type number
 * @min 0
 * @default 0
 * @text ウェイト（フレーム）
 * @desc Blink=点滅間ウェイト、Transition=フェード間ウェイト
 *
 * @param animationsA
 * @type string[]
 * @default []
 * @text アニメーション配列A（下）直接指定
 * @desc 下ピクチャ用アニメーション名を直接指定（トラック0から順に割り当て。変数より優先）
 *
 * @param animationsB
 * @type string[]
 * @default []
 * @text アニメーション配列B（上）直接指定
 * @desc 上ピクチャ用アニメーション名を直接指定（トラック0から順に割り当て。変数より優先）
 *
 * @param maskImage
 * @type file
 * @dir img/pictures
 * @default
 * @text マスク画像
 * @desc 両Spineピクチャに適用するマスク画像（img/picturesフォルダ内。空欄でマスクなし）
 *
 * @param maskPictureId
 * @type number
 * @min 0
 * @default 0
 * @text マスクピクチャID
 * @desc マスク用ピクチャID（0でマスクなし）
 */

/*~struct~SkinPreset:
 * @param name
 * @type string
 * @text スキンプリセット名
 * @desc 識別用の名前（SpinePresetの「スキンプリセット名」と一致させる）
 *
 * @param layers
 * @type struct<SkinPresetLayer>[]
 * @default []
 * @text レイヤー設定
 * @desc レイヤーごとの変数→スキン名マッピング
 */

/*~struct~SkinPresetLayer:
 * @param layerName
 * @type string
 * @text レイヤー名
 * @desc スキンのレイヤー（カテゴリ）名
 *
 * @param skinVar
 * @type variable
 * @default 0
 * @text 判定変数
 * @desc この変数の値に応じてスキンを切り替える
 *
 * @param skinMap
 * @type struct<SkinPresetMapEntry>[]
 * @default []
 * @text スキンマッピング
 * @desc 変数の値とスキン名の対応表
 */

/*~struct~SkeletonPartAlphaDefault:
 * @param skeletonName
 * @type string
 * @text スケルトン名
 * @desc 対象のスケルトン名（例: chara_A, enemy_dragon）
 *
 * @param partAlphaSettings
 * @type struct<PartAlpha>[]
 * @default []
 * @text パーツ別アルファ設定
 * @desc このスケルトンのパーツごとの透明度上限
 */

/*~struct~PartAlpha:
 * @param partName
 * @type string
 * @text パーツ名
 * @desc Spineのアタッチメント画像名（例: shadow, gun）
 *
 * @param targetAlpha
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.4
 * @text 目標アルファ値
 * @desc このパーツのフェード完了時のアルファ値（0=透明、1=不透明）
 */

/*~struct~SkinPresetMapEntry:
 * @param value
 * @type number
 * @default 1
 * @text 変数値
 * @desc この値のときに適用するスキン
 *
 * @param skinName
 * @type string
 * @text スキン名
 * @desc 適用するスキン名
 */

(() => {
  const pluginName = "OnspineCALL";
  const params = PluginManager.parameters(pluginName);
  const resetAnimationName = params.resetAnimationName || "idle";
  const trackState = (window._spineTrackStates =
    window._spineTrackStates || {});
  const skinState = (window._spineSkinStates = window._spineSkinStates || {});
  const skinNamesVariableId = Number(params.skinNamesVariable) || 0;
  const fadeDurationVariableId = Number(params.fadeDurationVariable) || 0;

  // スキンプリセット読み込み
  const skinPresetMap = {};
  JSON.parse(params.skinPresets || "[]").forEach((raw) => {
    const obj = JSON.parse(raw);
    const name = String(obj.name || "").trim();
    if (!name) return;
    skinPresetMap[name] = JSON.parse(obj.layers || "[]").map((r) => {
      const o = JSON.parse(r);
      const skinMap = JSON.parse(o.skinMap || "[]").map((m) => {
        const mo = JSON.parse(m);
        return {
          value: Number(mo.value) || 0,
          skinName: String(mo.skinName || "").trim(),
        };
      });
      return {
        layerName: String(o.layerName || "").trim(),
        skinVar: Number(o.skinVar) || 0,
        skinMap: skinMap,
      };
    });
  });

  // スキンプリセットから現在の変数値でスキン設定を解決する共通関数
  function resolveSkinPreset(skinPresetName) {
    const layers = skinPresetMap[skinPresetName];
    if (!layers) return { layerSkinSettings: [], combinedSkinNames: [] };
    const layerSkinSettings = layers
      .map((e) => {
        if (!e.layerName || e.skinVar <= 0) return null;
        const varValue = Number($gameVariables.value(e.skinVar)) || 0;
        const matched = e.skinMap.find((m) => m.value === varValue);
        return {
          layerName: e.layerName,
          skinName: matched ? matched.skinName : "",
        };
      })
      .filter((e) => e && e.layerName && e.skinName);
    const combinedSkinNames = layerSkinSettings
      .map((e) => e.skinName)
      .filter((v, i, a) => a.indexOf(v) === i);
    return { layerSkinSettings, combinedSkinNames };
  }

  // スケルトン別パーツアルファ既定値の読み込み
  const skeletonPartAlphaMap = {};
  JSON.parse(params.skeletonPartAlphaDefaults || "[]").forEach((raw) => {
    const obj = JSON.parse(raw);
    const name = String(obj.skeletonName || "").trim();
    if (!name) return;
    skeletonPartAlphaMap[name] = JSON.parse(obj.partAlphaSettings || "[]")
      .map((s) => {
        const o = JSON.parse(s);
        const v = Number(o.targetAlpha);
        return {
          partName: String(o.partName || "").trim(),
          targetAlpha: isFinite(v) ? Math.max(0, Math.min(1, v)) : 1,
        };
      })
      .filter((p) => p.partName);
  });

  // 明示指定とスケルトンデフォルトをマージ（明示指定が優先）
  function resolvePartAlphas(skeletonName, explicitPartAlphas) {
    const defaults = skeletonPartAlphaMap[skeletonName];
    if (!defaults || defaults.length === 0) return explicitPartAlphas;
    if (!explicitPartAlphas || explicitPartAlphas.length === 0) {
      return defaults.map((d) => ({ ...d }));
    }
    const explicitNames = new Set(explicitPartAlphas.map((p) => p.partName));
    const merged = [...explicitPartAlphas];
    for (const d of defaults) {
      if (!explicitNames.has(d.partName)) {
        merged.push({ ...d });
      }
    }
    return merged;
  }

  // プリセット読み込み
  const presetList = JSON.parse(params.presets || "[]").map((raw) => {
    const obj = JSON.parse(raw);
    return {
      presetName: String(obj.presetName || "").trim(),
      pictureIdA: Number(obj.pictureIdA) || 10,
      pictureIdB: Number(obj.pictureIdB) || 11,
      x: Number(obj.x) || 0,
      y: Number(obj.y) || 0,
      scale: Number(obj.scale) || 100,
      skeletonName: String(obj.skeletonName || "").trim(),
      skinPresetName: String(obj.skinPresetName || "").trim(),
      duration: Number(obj.duration) || 30,
      count: Number(obj.count) || 0,
      wait: Number(obj.wait) || 0,
      animationsA: JSON.parse(obj.animationsA || "[]").map(s => String(s || "").trim()).filter(s => s),
      animationsB: JSON.parse(obj.animationsB || "[]").map(s => String(s || "").trim()).filter(s => s),
      maskImage: String(obj.maskImage || "").trim(),
      maskPictureId: Number(obj.maskPictureId) || 0,
    };
  });

  const colorState = (window._spineColorStates =
    window._spineColorStates || {});
  const alphaFadeState = (window._spineAlphaFades =
    window._spineAlphaFades || {});
  const blinkState = (window._spineBlinkStates =
    window._spineBlinkStates || {});
  // 二重配列点滅のキュー（次の設定を待機させる）
  const dualBlinkQueue = (window._spineDualBlinkQueue =
    window._spineDualBlinkQueue || {});
  // CallPresetAnim先行呼出しのバッファ（CallPresetで消費）
  const pendingTrackOverrides = (window._spinePendingTrackOverrides =
    window._spinePendingTrackOverrides || {});
  // 連鎖遷移キュー（CallPresetChainTransitionで使用）
  const transitionChainQueue = (window._spineTransitionChain =
    window._spineTransitionChain || {});
  // マスク設定の管理用
  const spineMaskState = (window._spineMaskState =
    window._spineMaskState || {});
  const testSpineState = {
    active: false,
    pictureId: 20,
    waitFrames: 0,
    maxWait: 0,
    skeletonApplied: false,
    sprite: null,
    infoWindow: null,
    config: null,
    spineRef: null,
  };

  function clamp01(value, fallback = 1) {
    const num = Number(value);
    if (!isFinite(num)) return fallback;
    return Math.max(0, Math.min(1, num));
  }

  function setSpineColor(spine, pictureId, r, g, b, a) {
    const color = {
      r: clamp01(r),
      g: clamp01(g),
      b: clamp01(b),
      a: clamp01(a),
    };
    spine.setColor(color.r, color.g, color.b, color.a);
    colorState[pictureId] = color;
  }

  function getSpineColor(pictureId) {
    return Object.assign({ r: 1, g: 1, b: 1, a: 1 }, colorState[pictureId]);
  }

  function stopSpineFade(pictureId) {
    const state = alphaFadeState[pictureId];
    if (state) {
      state.active = false;
      delete alphaFadeState[pictureId];
    }
  }

  function animateSpineAlpha(
    pictureId,
    targetAlpha,
    durationFrames,
    options = {}
  ) {
    const spine = getSpine(pictureId);
    if (!spine) return false;

    const duration = Math.max(1, Math.floor(Number(durationFrames) || 0));
    const baseColor = getSpineColor(pictureId);
    const startAlpha =
      options.startAlpha != null ? options.startAlpha : baseColor.a;
    const colorBase = options.colorOverride
      ? {
          r: clamp01(options.colorOverride.r, baseColor.r),
          g: clamp01(options.colorOverride.g, baseColor.g),
          b: clamp01(options.colorOverride.b, baseColor.b),
        }
      : baseColor;
    const clampedTarget = clamp01(targetAlpha, baseColor.a);

    // パーツ別アルファ設定
    const partAlphas = (options.partAlphas || [])
      .filter((p) => p.partName && isFinite(p.targetAlpha));

    stopSpineFade(pictureId);

    // 初期アルファを強制反映
    setSpineColor(
      spine,
      pictureId,
      colorBase.r,
      colorBase.g,
      colorBase.b,
      startAlpha
    );
    // パーツ別の初期アルファも反映
    for (const part of partAlphas) {
      spine.setColor(part.partName, 1, 1, 1, startAlpha);
    }

    if (options.debugTag) {
      console.log(
        `[OnspineCALL] ${options.debugTag} fade start`,
        { pictureId, startAlpha, targetAlpha: clampedTarget, duration, partAlphas }
      );
    }

    // ゲームループ同期方式: alphaFadeStateに登録し updateFadeAnimations で毎フレーム処理
    alphaFadeState[pictureId] = {
      active: true,
      spine,
      pictureId,
      startAlpha,
      clampedTarget,
      colorBase: { r: colorBase.r, g: colorBase.g, b: colorBase.b },
      step: 1 / duration,
      progress: 0,
      debugTag: options.debugTag || null,
      onFinish: typeof options.onFinish === "function" ? options.onFinish : null,
      partAlphas,
    };

    return true;
  }

  // ゲームループから毎フレーム呼び出し: 全アクティブフェードを1ステップ進める
  function updateFadeAnimations() {
    for (const key in alphaFadeState) {
      const state = alphaFadeState[key];
      if (!state || !state.active) continue;

      // false+partAlphas: alpha=0で待機→フィルタ安定後にalpha=1で一括表示
      if (state._immediateWait != null) {
        if (--state._immediateWait > 0) continue;
        setSpineColor(state.spine, state.pictureId, 1, 1, 1, 1);
        for (const part of state.partAlphas) {
          state.spine.setColor(part.partName, 1, 1, 1, clamp01(part.targetAlpha));
        }
        state.active = false;
        delete alphaFadeState[key];
        continue;
      }

      state.progress += state.step;
      const t = Math.min(state.progress, 1);
      const alpha =
        state.startAlpha + (state.clampedTarget - state.startAlpha) * t;
      setSpineColor(
        state.spine,
        state.pictureId,
        state.colorBase.r,
        state.colorBase.g,
        state.colorBase.b,
        alpha
      );
      // パーツ別アルファ: 各パーツは startAlpha → partTargetAlpha で同期フェード
      for (const part of state.partAlphas) {
        const partAlpha =
          state.startAlpha +
          (clamp01(part.targetAlpha) - state.startAlpha) * t;
        state.spine.setColor(part.partName, 1, 1, 1, partAlpha);
      }
      if (t >= 1) {
        state.active = false;
        delete alphaFadeState[key];
        if (state.debugTag) {
          console.log(
            `[OnspineCALL] ${state.debugTag} fade end`,
            { pictureId: state.pictureId, targetAlpha: state.clampedTarget }
          );
        }
        if (state.onFinish) {
          state.onFinish();
        }
      }
    }
  }

  function stopSpineBlink(pictureId) {
    const state = blinkState[pictureId];
    if (state) {
      state.active = false;
      // 二重配列点滅用のdualBlinkStateがあれば、それも停止
      if (state.dualBlinkState) {
        state.dualBlinkState.stopped = true;
      }
      delete blinkState[pictureId];
    }
  }

  function blinkSpineAlpha(
    pictureId,
    blinkDuration,
    blinkCount,
    minAlpha,
    maxAlpha,
    options = {}
  ) {
    const spine = getSpine(pictureId);
    if (!spine) return false;

    const duration = Math.max(1, Math.floor(Number(blinkDuration) || 15));
    const count = Math.floor(Number(blinkCount)) || 0; // 0で無限ループ
    const isInfinite = count <= 0;
    const alphaMin = clamp01(minAlpha, 0);
    const alphaMax = clamp01(maxAlpha, 1);
    const startPhase = options.startFromVisible ? 0 : 1; // 0: 出現状態から開始（透明化へ）, 1: 透明状態から開始（出現へ）
    const blinkWait = Math.max(0, Math.floor(Number(options.blinkWait) || 0)); // 点滅間ウェイト

    // 既存の点滅とフェードを停止
    stopSpineBlink(pictureId);
    stopSpineFade(pictureId);

    const baseColor = getSpineColor(pictureId);
    const state = {
      active: true,
      currentCount: 0,
      totalCount: count,
      isInfinite: isInfinite,
      phase: startPhase, // 0: フェードアウト（透明化）, 1: フェードイン（出現）, 2: ウェイト
      progress: 0,
      waitFrames: 0,
    };
    blinkState[pictureId] = state;

    const step = 1 / duration;

    const update = () => {
      if (!state.active) return;

      // ウェイトフェーズ
      if (state.phase === 2) {
        state.waitFrames++;
        if (state.waitFrames >= blinkWait) {
          state.waitFrames = 0;
          state.progress = 0;
          // ウェイト後の次のフェーズへ
          state.phase = state.nextPhase;
        }
        if (state.active) {
          requestAnimationFrame(update);
        }
        return;
      }

      state.progress += step;
      const t = Math.min(state.progress, 1);

      let alpha;
      if (state.phase === 0) {
        // フェードアウト（maxAlpha → minAlpha）
        alpha = alphaMax + (alphaMin - alphaMax) * t;
      } else {
        // フェードイン（minAlpha → maxAlpha）
        alpha = alphaMin + (alphaMax - alphaMin) * t;
      }

      setSpineColor(
        spine,
        pictureId,
        baseColor.r,
        baseColor.g,
        baseColor.b,
        alpha
      );

      if (t >= 1) {
        // フェーズ切り替え
        state.progress = 0;
        if (state.phase === 0) {
          // 透明化完了 → ウェイトまたは出現フェーズへ
          if (blinkWait > 0) {
            state.phase = 2; // ウェイトフェーズ
            state.nextPhase = 1; // ウェイト後は出現フェーズ
            state.waitFrames = 0;
          } else {
            state.phase = 1;
          }
        } else {
          // 出現完了 → 1回の点滅サイクル完了
          state.currentCount++;
          if (!state.isInfinite && state.currentCount >= state.totalCount) {
            // 全点滅完了（無限ループでない場合のみ）
            state.active = false;
            delete blinkState[pictureId];
            if (typeof options.onFinish === "function") {
              options.onFinish();
            }
            return;
          }
          // 次の点滅サイクルへ
          if (blinkWait > 0) {
            state.phase = 2; // ウェイトフェーズ
            state.nextPhase = 0; // ウェイト後は透明化フェーズ
            state.waitFrames = 0;
          } else {
            state.phase = 0;
          }
        }
      }

      if (state.active) {
        requestAnimationFrame(update);
      }
    };

    update();
    return true;
  }

  function detachTestSpineSprite() {
    const sprite = testSpineState.sprite;
    if (!sprite) return;
    if (sprite._wheelListenerBound) {
      window.removeEventListener("wheel", sprite._wheelListenerBound);
      sprite._wheelListenerBound = null;
    }
    if (sprite._draggableOriginalUpdate) {
      sprite.update = sprite._draggableOriginalUpdate;
      sprite._draggableOriginalUpdate = null;
    }
    if (sprite._draggableOriginalHitTest) {
      sprite.hitTest = sprite._draggableOriginalHitTest;
      sprite._draggableOriginalHitTest = null;
    }
    if (sprite._draggableInfoWindow && sprite._draggableInfoWindow.parent) {
      sprite._draggableInfoWindow.parent.removeChild(
        sprite._draggableInfoWindow
      );
    }
    sprite._draggableInfoWindow = null;
    sprite._draggableUpdateInstalled = false;
    sprite._draggableSetupDone = false;
    testSpineState.sprite = null;
    testSpineState.infoWindow = null;
  }

  function cleanupTestSpineState({ erasePicture = false } = {}) {
    detachTestSpineSprite();
    if (testSpineState.infoWindow && testSpineState.infoWindow.parent) {
      testSpineState.infoWindow.parent.removeChild(testSpineState.infoWindow);
    }
    if (erasePicture && $gameScreen.picture(testSpineState.pictureId)) {
      $gameScreen.erasePicture(testSpineState.pictureId);
    }
    stopSpineFade(testSpineState.pictureId);
    delete colorState[testSpineState.pictureId];
    testSpineState.active = false;
    testSpineState.waitFrames = 0;
    testSpineState.maxWait = 0;
    testSpineState.skeletonApplied = false;
    testSpineState.infoWindow = null;
    testSpineState.config = null;
    testSpineState.spineRef = null;
  }

  function getSpine(pictureId) {
    const picture = $gameScreen.picture(pictureId);
    if (!picture) return null;
    return $gameScreen.spine(pictureId);
  }

  // マスク適用ヘルパー（コンテナ方式: A/BをPIXI.Containerでまとめてマスク適用）
  // マスクスプライトはpictureContainerに残し renderable=false にして
  // ラッパーの外部マスクとして参照する（PIXIの正しいマスクパターン）
  function applyDualSpineMask(pictureIdA, pictureIdB, maskPictureId, maskImage) {
    if (!maskImage || !maskPictureId) return;

    // 既存マスクがありラッパーが生きている場合 → ラッパーはそのまま維持
    const existing = spineMaskState[pictureIdB];
    if (existing && existing.wrapperContainer) {
      const scene = SceneManager._scene;
      const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;
      if (pc && pc.children.indexOf(existing.wrapperContainer) >= 0) {
        // spriteA/Bは同じSprite_Pictureオブジェクト（RPG Makerが固定管理）なので
        // erasePicture/showPictureしてもオブジェクトは変わらない → ラッパー内に残っている
        existing.pictureIdA = pictureIdA;
        return; // マスクは維持されたまま
      }
      // ラッパーが無効化されている場合は解除して再作成
      removeDualSpineMask(pictureIdB, true);
    }

    // マスク用ピクチャを左上(0,0)、100%スケールで表示
    $gameScreen.showPicture(maskPictureId, maskImage, 0, 0, 0, 100, 100, 255, 0);

    // 管理情報を保存
    spineMaskState[pictureIdB] = { pictureIdA, maskPictureId, maskImage, wrapperContainer: null };

    // 同期で即座にマスク適用を試み、ビットマップ未準備時のみ非同期リトライ
    function tryApplyMask(tries) {
      const scene = SceneManager._scene;
      const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;
      if (!pc) { if (tries < 60) requestAnimationFrame(() => tryApplyMask(tries + 1)); return; }

      const spriteA = pc.children.find(sp => sp._pictureId === pictureIdA);
      const spriteB = pc.children.find(sp => sp._pictureId === pictureIdB);
      const maskSprite = pc.children.find(sp => sp._pictureId === maskPictureId);

      if (!spriteA || !spriteB || !maskSprite || !maskSprite.bitmap || !maskSprite.bitmap.isReady()) {
        if (tries < 60) requestAnimationFrame(() => tryApplyMask(tries + 1));
        return;
      }

      // ラッパーコンテナを作成
      const wrapper = new PIXI.Container();

      // RPG Makerの更新チェーンを伝播させる
      wrapper.update = function() {
        for (const child of this.children) {
          if (child.update) child.update();
        }
      };

      // spriteAの元の位置を記録してラッパーを挿入
      const indexA = pc.children.indexOf(spriteA);
      pc.addChildAt(wrapper, indexA);

      // spriteA/Bをラッパーに移動（addChildで自動的にpcから削除される）
      wrapper.addChild(spriteA);
      wrapper.addChild(spriteB);

      // マスクスプライトはpcに残し、描画だけ非表示にする
      maskSprite.renderable = false;

      // ラッパーにマスクを適用
      wrapper.mask = maskSprite;

      spineMaskState[pictureIdB].wrapperContainer = wrapper;
    }
    // 最初は同期で試行
    tryApplyMask(0);
  }

  // マスク解除ヘルパー
  function removeDualSpineMask(pictureIdB, eraseMaskPicture) {
    const setting = spineMaskState[pictureIdB];
    if (!setting) return;
    const scene = SceneManager._scene;
    const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;

    if (pc && setting.wrapperContainer) {
      const wrapper = setting.wrapperContainer;
      const wrapperIndex = pc.children.indexOf(wrapper);

      // ラッパーが現在のpictureContainerに存在する場合のみ復元処理
      if (wrapperIndex >= 0) {
        wrapper.mask = null;

        // ラッパーから子を取り出し（pictureId順にソート）
        const children = wrapper.removeChildren();
        children.sort((a, b) => (a._pictureId || 0) - (b._pictureId || 0));

        // ラッパーをpcから削除
        pc.removeChild(wrapper);

        // 子をpcの元の位置に順序通り戻す
        for (let i = 0; i < children.length; i++) {
          pc.addChildAt(children[i], wrapperIndex + i);
        }

        // マスクスプライトの描画を復元
        const maskSprite = pc.children.find(sp => sp._pictureId === setting.maskPictureId);
        if (maskSprite) maskSprite.renderable = true;
      }

      wrapper.destroy();
    }

    if (eraseMaskPicture && $gameScreen.picture(setting.maskPictureId)) {
      $gameScreen.erasePicture(setting.maskPictureId);
    }
    delete spineMaskState[pictureIdB];
  }

  // シーン復帰時にマスクを再適用するフック
  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    // spineMaskStateに残っているマスク設定を新しいスプライトに再適用
    const entries = Object.entries(spineMaskState);
    for (const [pictureIdB, setting] of entries) {
      if (!setting) continue;
      const { pictureIdA, maskPictureId, maskImage } = setting;
      // 古いエントリを削除（wrapperContainerは旧シーンと共に破棄済み）
      delete spineMaskState[pictureIdB];
      applyDualSpineMask(pictureIdA, Number(pictureIdB), maskPictureId, maskImage);
    }
  };

  function applySkins(spine, skinNames, replace) {
    if (skinNames.length === 0) return;
    spine.setSkin(...skinNames);
  }

  function updateLayerSkins(pictureId, layerSkinSettings) {
    const spine = getSpine(pictureId);
    if (!spine) return;

    skinState[pictureId] = skinState[pictureId] || {};

    for (const setting of layerSkinSettings) {
      if (setting.layerName && setting.skinName) {
        skinState[pictureId][setting.layerName] = setting.skinName;
      }
    }

    const allSkinNames = Object.values(skinState[pictureId]).filter(
      (name) => name
    );

    if (allSkinNames.length > 0) {
      applySkins(spine, allSkinNames, true);
    }
  }

  function initializeSkinState(pictureId, layerSkinSettings) {
    skinState[pictureId] = {};
    for (const setting of layerSkinSettings) {
      if (setting.layerName && setting.skinName) {
        skinState[pictureId][setting.layerName] = setting.skinName;
      }
    }
  }

  function applyMix(spine, mixValue) {
    if (mixValue >= 0) {
      try {
        // ★stateDataのdefaultMixを直接設定（最も確実な方法）
        if (spine.stateData) {
          spine.stateData.defaultMix = mixValue;
        }
      } catch (e) {
        console.warn("[OnspineCALL] applyMix error:", e);
      }
    }
  }

  function applyTracks(spine, pictureId, tracks, resetUnused) {
    const activeTracks = new Set();
    trackState[pictureId] = trackState[pictureId] || {};
    const stateMap = trackState[pictureId];

    for (const track of tracks) {
      spine.setAnimation(
        track.trackId,
        track.animations,
        track.order,
        track.continuance,
        track.interrupt
      );
      stateMap[track.trackId] = track.animations[0] || "";
      activeTracks.add(track.trackId);
    }

    if (resetUnused) {
      for (const trackId in stateMap) {
        if (!activeTracks.has(Number(trackId))) {
          spine.setAnimation(Number(trackId), resetAnimationName, true);
          stateMap[trackId] = resetAnimationName;
        }
      }
    }
  }

  function coerceAnimationSource(rawValue) {
    if (Array.isArray(rawValue)) {
      return rawValue;
    }
    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (_) {}
      }
    }
    return rawValue;
  }

  function normalizeAnimationNames(value) {
    if (Array.isArray(value)) {
      return value
        .map((name) => String(name ?? "").trim())
        .filter((name) => name.length > 0);
    }
    if (value == null) {
      return [];
    }
    return String(value)
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }

  function buildTrackAnimationEntries(baseTrack, rawValue) {
    let trackStart = Number(baseTrack) || 0;
    if (!isFinite(trackStart)) {
      trackStart = 0;
    }
    const source = coerceAnimationSource(rawValue);
    if (Array.isArray(source)) {
      const entries = [];
      source.forEach((entry, index) => {
        const animations = normalizeAnimationNames(entry);
        if (animations.length > 0) {
          entries.push({ trackId: trackStart + index, animations });
        }
      });
      return entries;
    }
    const animations = normalizeAnimationNames(source);
    if (animations.length === 0) {
      return [];
    }
    return [{ trackId: trackStart, animations }];
  }

  function collectSkinNamesFromVariable(varId) {
    if (!(varId > 0)) {
      return [];
    }
    const value = $gameVariables.value(varId);
    const source = coerceAnimationSource(value);
    const names = normalizeAnimationNames(source);
    const unique = [];
    for (const name of names) {
      if (!unique.includes(name)) {
        unique.push(name);
      }
    }
    return unique;
  }

  function parsePartAlphaSettings(raw) {
    return JSON.parse(raw || "[]")
      .map((s) => {
        const obj = JSON.parse(s);
        return {
          partName: String(obj.partName || "").trim(),
          targetAlpha: clamp01(Number(obj.targetAlpha)),
        };
      })
      .filter((p) => p.partName);
  }

  PluginManager.registerCommand(pluginName, "CallSpineFull", (args) => {
    const pictureId = Number(args.pictureId);
    const x = Number(args.x);
    const y = Number(args.y);
    const scale = Number(args.pictureScale);
    const skeletonName = args.skeletonName;
    const skinNames = JSON.parse(args.skinNames || "[]");
    const layerSkinSettings = JSON.parse(args.layerSkinSettings || "[]")
      .map((raw) => {
        const obj = JSON.parse(raw);
        return {
          layerName: String(obj.layerName || "").trim(),
          skinName: String(obj.skinName || "").trim(),
        };
      })
      .filter((e) => e.layerName && e.skinName);
    const mixValue = Number(args.mixValue);
    const fadeMode = args.useFade || "false";
    const fadeDuration = Number(args.fadeDuration);
    const partAlphas = resolvePartAlphas(
      skeletonName,
      parsePartAlphaSettings(args.partAlphaSettings)
    );

    const trackSettings = JSON.parse(args.trackSettings || "[]").map((raw) => {
      const obj = JSON.parse(raw);
      return {
        trackId: Number(obj.trackId),
        animations: JSON.parse(obj.animations || "[]"),
        order: obj.order || "sequential",
        continuance: obj.continuance || "continue",
        interrupt: obj.interrupt === "true",
      };
    });

    const mosaicSettings = JSON.parse(args.mosaicSettings || "[]")
      .map((raw) => {
        const obj = JSON.parse(raw);
        return {
          image: obj.image.trim(),
          size: Number(obj.size),
        };
      })
      .filter((m) => m.image && m.size > 0);

    if ($gameScreen.picture(pictureId)) {
      $gameScreen.erasePicture(pictureId);
    }
    $gameScreen.showPicture(pictureId, "", 0, x, y, scale, scale, 255, 0);

    const spine = getSpine(pictureId);
    if (!spine) return;

    spine.setSkeleton(skeletonName);
    spine.setScale(1.0, 1.0);
    stopSpineFade(pictureId);
    setSpineColor(spine, pictureId, 1, 1, 1, fadeMode === "false" ? 1 : 0);

    initializeSkinState(pictureId, layerSkinSettings);

    const layerCombined = layerSkinSettings.map((e) => e.skinName);
    const combinedSkinNames = [...skinNames, ...layerCombined].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    applySkins(spine, combinedSkinNames, true);
    applyMix(spine, mixValue);
    applyTracks(spine, pictureId, trackSettings, false);

    for (const mosaic of mosaicSettings) {
      spine.setMosaic(mosaic.image, mosaic.size);
    }

    // partAlphasを設定（全モード共通）
    for (const part of partAlphas) {
      spine.setColor(part.partName, 1, 1, 1, clamp01(part.targetAlpha));
    }

    if (fadeMode === "true") {
      animateSpineAlpha(pictureId, 1, fadeDuration, {
        startAlpha: 0,
        partAlphas,
      });
    } else if (fadeMode === "false" && partAlphas.length > 0) {
      // partAlphasあり即時表示: 内部でtransparent開始→フィルタ安定後に一括表示
      setSpineColor(spine, pictureId, 1, 1, 1, 0);
      stopSpineFade(pictureId);
      alphaFadeState[pictureId] = {
        active: true,
        spine,
        pictureId,
        partAlphas,
        _immediateWait: 3,
      };
    }
    // transparent: alpha=0のまま維持、partAlphasは設定済み
  });

  PluginManager.registerCommand(pluginName, "CallSpineVar", (args) => {
    const pictureIdVar = Number(args.pictureIdVar);
    const xVar = Number(args.xVar);
    const yVar = Number(args.yVar);
    const pictureId = $gameVariables.value(pictureIdVar);
    const x = $gameVariables.value(xVar);
    const y = $gameVariables.value(yVar);
    const scaleVarId = Number(args.pictureScaleVar || 0);
    let scale = 100;
    if (scaleVarId > 0) {
      const v = Number($gameVariables.value(scaleVarId));
      if (isFinite(v)) {
        scale = v;
      }
    }

    const skeletonNameVarId = Number(args.skeletonNameVar || 0);
    let skeletonName = "";
    if (skeletonNameVarId > 0) {
      const v = $gameVariables.value(skeletonNameVarId);
      skeletonName = String(v ?? "");
    }
    if (!skeletonName) return;
    const skinNames = JSON.parse(args.skinNames || "[]");
    const layerSkinSettings = JSON.parse(args.layerSkinSettings || "[]")
      .map((raw) => {
        const obj = JSON.parse(raw);
        return {
          layerName: String(obj.layerName || "").trim(),
          skinName: String(obj.skinName || "").trim(),
        };
      })
      .filter((e) => e.layerName && e.skinName);
    const mixValue = Number(args.mixValue);
    const fadeMode = args.useFade || "false";
    const fadeDuration = Number(args.fadeDuration);
    const partAlphas = resolvePartAlphas(
      skeletonName,
      parsePartAlphaSettings(args.partAlphaSettings)
    );

    const trackSettings = JSON.parse(args.trackSettings || "[]").map((raw) => {
      const obj = JSON.parse(raw);
      return {
        trackId: Number(obj.trackId),
        animations: JSON.parse(obj.animations || "[]"),
        order: obj.order || "sequential",
        continuance: obj.continuance || "continue",
        interrupt: obj.interrupt === "true",
      };
    });

    const mosaicSettings = JSON.parse(args.mosaicSettings || "[]")
      .map((raw) => {
        const obj = JSON.parse(raw);
        return {
          image: obj.image.trim(),
          size: Number(obj.size),
        };
      })
      .filter((m) => m.image && m.size > 0);

    if ($gameScreen.picture(pictureId)) {
      $gameScreen.erasePicture(pictureId);
    }
    $gameScreen.showPicture(pictureId, "", 0, x, y, scale, scale, 255, 0);

    const spine = getSpine(pictureId);
    if (!spine) return;

    spine.setSkeleton(skeletonName);
    spine.setScale(1.0, 1.0);
    stopSpineFade(pictureId);
    setSpineColor(spine, pictureId, 1, 1, 1, fadeMode === "false" ? 1 : 0);

    initializeSkinState(pictureId, layerSkinSettings);

    const layerCombined = layerSkinSettings.map((e) => e.skinName);
    const combinedSkinNames = [...skinNames, ...layerCombined].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    applySkins(spine, combinedSkinNames, true);
    applyMix(spine, mixValue);
    applyTracks(spine, pictureId, trackSettings, false);

    for (const mosaic of mosaicSettings) {
      spine.setMosaic(mosaic.image, mosaic.size);
    }

    for (const part of partAlphas) {
      spine.setColor(part.partName, 1, 1, 1, clamp01(part.targetAlpha));
    }

    if (fadeMode === "true") {
      animateSpineAlpha(pictureId, 1, fadeDuration, {
        startAlpha: 0,
        partAlphas,
      });
    } else if (fadeMode === "false" && partAlphas.length > 0) {
      setSpineColor(spine, pictureId, 1, 1, 1, 0);
      stopSpineFade(pictureId);
      alphaFadeState[pictureId] = {
        active: true,
        spine,
        pictureId,
        partAlphas,
        _immediateWait: 3,
      };
    }
  });

  PluginManager.registerCommand(pluginName, "updateSpine", (args) => {
    const pictureId = Number(args.pictureId || 99);
    const mixValue = Number(args.mixValue || 0.3);
    const timeScale = Number(args.timeScale || 1.0);
    const resetOtherTracks = args.resetOtherTracks === "true";

    const trackSettings = JSON.parse(args.trackSettings || "[]").map((raw) => {
      const obj = JSON.parse(raw);
      return {
        trackId: Number(obj.trackId),
        animations: JSON.parse(obj.animations || "[]"),
        order: obj.order || "sequential",
        continuance: obj.continuance || "continue",
        interrupt: obj.interrupt === "true",
      };
    });

    const spine = getSpine(pictureId);
    if (!spine) {
      return;
    }

    applyMix(spine, mixValue);
    if (timeScale > 0) spine.setTimeScale(timeScale);
    applyTracks(spine, pictureId, trackSettings, resetOtherTracks);
  });

  PluginManager.registerCommand(pluginName, "changeSkin", (args) => {
    const pictureId = Number(args.pictureId || 10);
    const layerSkinSettings = JSON.parse(args.layerSkinSettings || "[]").map(
      (raw) => {
        return JSON.parse(raw);
      }
    );

    const spine = getSpine(pictureId);
    if (!spine) {
      console.warn(`[OnspineCALL] ピクチャID ${pictureId} のSpine存在せず`);
      return;
    }

    if (layerSkinSettings.length > 0) {
      console.log(
        `[OnspineCALL] ピクチャID ${pictureId} のレイヤースキンを変更:`,
        layerSkinSettings
      );
      updateLayerSkins(pictureId, layerSkinSettings);
    } else {
      console.warn(
        `[OnspineCALL] ピクチャID ${pictureId} に有効なレイヤースキン設定なし`
      );
    }
  });

  PluginManager.registerCommand(pluginName, "playRandomAnimation", (args) => {
    const pictureId = Number(args.pictureId || 0);
    const trackId = Number(args.trackId || 0);
    const entriesRaw = JSON.parse(args.randomEntries || "[]");

    if (!pictureId) {
      return;
    }

    const spine = getSpine(pictureId);
    if (!spine) {
      return;
    }

    let continuance = "reset";
    let interrupt = false;

    const animations = [];
    for (const raw of entriesRaw) {
      try {
        const obj = JSON.parse(raw);
        const base = String(obj.name || "").trim();
        let times = Number(obj.times || 1);
        if (!base) continue;
        if (!isFinite(times) || times <= 0) times = 1;
        const anim = `${base}/times=${times}`;
        animations.push(anim);
      } catch (_) {}
    }

    if (animations.length === 0) {
      return;
    }

    try {
      spine.setAnimation(trackId, animations, "random", continuance, interrupt);
    } catch (e) {
      return;
    }

    trackState[pictureId] = trackState[pictureId] || {};
    trackState[pictureId][trackId] = animations.join(",");
  });

  PluginManager.registerCommand(pluginName, "setSpineTimeScale", (args) => {
    const pictureId = Number(args.pictureId || 0);
    const timeScale = Number(args.timeScale || 1.0);
    if (!pictureId || !(timeScale > 0)) return;
    const spine = getSpine(pictureId);
    if (!spine) return;
    spine.setTimeScale(timeScale);
  });

  PluginManager.registerCommand(pluginName, "showTestSpine", (args) => {
    const pictureId = 20;
    const pictureName = args.pictureName || "test";
    const skeletonName = args.skeletonName || "test";
    const animationName = args.animationName || "test";
    const x = Number(args.x || 400);
    const y = Number(args.y || 300);
    const scale = Math.max(0.1, Number(args.scalePercent || 100) / 100);
    const skinNames = JSON.parse(args.skinNames || "[]");

    cleanupTestSpineState();

    testSpineState.pictureId = pictureId;
    testSpineState.config = {
      skeletonName,
      animationName,
      skinNames,
      scale,
    };
    testSpineState.waitFrames = 0;
    testSpineState.maxWait = 600;
    testSpineState.skeletonApplied = false;
    testSpineState.active = true;

    $gameScreen.showPicture(
      pictureId,
      pictureName,
      0,
      x,
      y,
      scale * 100,
      scale * 100,
      255,
      0
    );

    if (!Input.keyMapper[67]) Input.keyMapper[67] = "copy";
  });

  function showToast(text) {
    const toast = new Window_Base(new Rectangle(0, 0, 350, 60));
    toast.opacity = 200;
    toast.contents.clear();
    toast.drawText(text, 0, 0, 320, 36, "center");
    const scene = SceneManager._scene;
    if (!scene) return;
    scene.addChild(toast);
    toast.x = (Graphics.width - toast.width) / 2;
    toast.y = (Graphics.height - toast.height) / 2;
    setTimeout(() => scene.removeChild(toast), 1500);
  }

  function setupDraggableTestSprite(sprite) {
    const scene = SceneManager._scene;
    if (!scene) return;

    if (sprite._draggableInfoWindow && sprite._draggableInfoWindow.parent) {
      sprite._draggableInfoWindow.parent.removeChild(
        sprite._draggableInfoWindow
      );
    }

    const infoWindow = new Window_Base(new Rectangle(10, 10, 450, 80));
    infoWindow.opacity = 180;
    scene.addChild(infoWindow);

    sprite._dragging = false;
    sprite._copyMode = "x";
    sprite._lastCopyPressed = false;

    sprite._draggableInfoWindow = infoWindow;
    testSpineState.infoWindow = infoWindow;
    testSpineState.sprite = sprite;

    if (!sprite._draggableOriginalHitTest) {
      sprite._draggableOriginalHitTest = sprite.hitTest;
    }
    sprite.hitTest = function (x, y) {
      const left = this.x;
      const top = this.y;
      const right = left + this.width * this.scale.x;
      const bottom = top + this.height * this.scale.y;
      return x >= left && x < right && y >= top && y < bottom;
    };

    sprite._onWheel = function (event) {
      const delta = Math.sign(event.deltaY);
      const step = 0.01;
      let newScale = this.scale.x - delta * step;
      newScale = Math.max(0.1, Math.min(3.0, newScale));
      this.scale.set(newScale, newScale);
      const pic = $gameScreen.picture(testSpineState.pictureId);
      if (pic) {
        pic._scaleX = pic._scaleY = newScale * 100;
      }
    };

    if (!sprite._wheelListenerBound) {
      sprite._wheelListenerBound = (event) => {
        if (!testSpineState.active || testSpineState.sprite !== sprite) return;
        sprite._onWheel(event);
      };
      window.addEventListener("wheel", sprite._wheelListenerBound);
    }

    if (!sprite._draggableUpdateInstalled) {
      const originalUpdate = sprite.update;
      sprite._draggableOriginalUpdate = originalUpdate;
      sprite.update = function () {
        originalUpdate.call(this);
        if (!testSpineState.active || testSpineState.sprite !== this) return;
        if (!this.visible || !this.bitmap || !this.bitmap.isReady()) return;

        if (
          !this._dragging &&
          TouchInput.isTriggered() &&
          this.hitTest(TouchInput.x, TouchInput.y)
        ) {
          this._dragging = true;
          this._offsetX = TouchInput.x - this.x;
          this._offsetY = TouchInput.y - this.y;
        } else if (this._dragging && TouchInput.isPressed()) {
          this.x = TouchInput.x - this._offsetX;
          this.y = TouchInput.y - this._offsetY;
          const pic = $gameScreen.picture(testSpineState.pictureId);
          if (pic) {
            pic._x = this.x;
            pic._y = this.y;
          }
        } else if (this._dragging && !TouchInput.isPressed()) {
          this._dragging = false;
        }

        if (
          Input.isPressed("control") &&
          Input.isPressed("copy") &&
          !this._lastCopyPressed
        ) {
          const value =
            this._copyMode === "x" ? Math.round(this.x) : Math.round(this.y);
          const label = this._copyMode.toUpperCase();
          const text = `${value}`;
          navigator.clipboard
            ?.writeText(text)
            .then(() => {
              showToast(`${label}: ${value} をコピーしました`);
            })
            .catch(() => {
              showToast(`${label}: ${value} をコピーしました`);
            });
          this._copyMode = this._copyMode === "x" ? "y" : "x";
          this._lastCopyPressed = true;
        } else if (!Input.isPressed("control") || !Input.isPressed("copy")) {
          this._lastCopyPressed = false;
        }

        const infoWindow = this._draggableInfoWindow;
        if (infoWindow && infoWindow.contents) {
          const zoom = Math.round(this.scale.x * 100);
          infoWindow.contents.clear();
          infoWindow.drawText(`X: ${Math.round(this.x)}`, 0, 0, 160);
          infoWindow.drawText(`Y: ${Math.round(this.y)}`, 0, 24, 160);
          infoWindow.drawText(`倍率: ${zoom}%`, 160, 0, 160);
        }
      };
      sprite._draggableUpdateInstalled = true;
    }

    sprite._draggableSetupDone = true;
  }

  function updateTestSpineState() {
    if (!testSpineState.active) return;
    const state = testSpineState;

    const picture = $gameScreen.picture(state.pictureId);
    if (!picture) {
      cleanupTestSpineState();
      return;
    }

    const spine = getSpine(state.pictureId);
    if (!spine) {
      state.waitFrames++;
      if (state.maxWait && state.waitFrames > state.maxWait) {
        cleanupTestSpineState();
      }
      return;
    }

    if (state.spineRef !== spine) {
      state.spineRef = spine;
      state.skeletonApplied = false;
    }
    state.waitFrames = 0;

    if (!state.skeletonApplied && state.config) {
      try {
        spine.setSkeleton(state.config.skeletonName);
        if (state.config.skinNames.length > 0)
          spine.setSkin(...state.config.skinNames);
        spine.setAnimation(0, state.config.animationName, true);
        state.skeletonApplied = true;
      } catch (error) {
        cleanupTestSpineState();
        return;
      }
    }

    const scene = SceneManager._scene;
    if (!scene || !scene._spriteset || !scene._spriteset._pictureContainer)
      return;

    const sprite = scene._spriteset._pictureContainer.children.find(
      (s) => s && s._pictureId === state.pictureId
    );
    if (!sprite) return;

    if (state.sprite && state.sprite !== sprite) {
      detachTestSpineSprite();
    }

    if (!sprite._draggableSetupDone) {
      setupDraggableTestSprite(sprite);
    }
  }

  if (!SceneManager.updateMain._OnspineCALL_showTestSpine) {
    const _OnspineCALL_SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function () {
      _OnspineCALL_SceneManager_updateMain.call(this);
      updateTestSpineState();
      updateFadeAnimations();
    };
    SceneManager.updateMain._OnspineCALL_showTestSpine = true;
  }

  PluginManager.registerCommand(pluginName, "setSpineAlpha", (args) => {
    const pictureId = Number(args.pictureId);
    const spine = getSpine(pictureId);
    if (!spine) {
      return;
    }

    const alphaTracks = JSON.parse(args.alphaTracks || "[]").map((raw) => {
      const obj = JSON.parse(raw);
      return {
        trackId: Number(obj.trackId),
        alpha: Number(obj.alpha),
        overwrite: obj.overwrite === "true",
      };
    });

    for (const { trackId, alpha, overwrite } of alphaTracks) {
      if (!isFinite(trackId) || !isFinite(alpha)) continue;
      try {
        spine.setAlpha(trackId, alpha, overwrite);
      } catch (e) {}
    }
  });

  PluginManager.registerCommand(pluginName, "setSpineColor", (args) => {
    const pictureId = Number(args.pictureId || 0);
    if (!pictureId) return;
    const spine = getSpine(pictureId);
    if (!spine) return;
    const r = clamp01(args.colorR, 0.5);
    const g = clamp01(args.colorG, 0.5);
    const b = clamp01(args.colorB, 0.5);
    const a = clamp01(args.colorA, 1);
    setSpineColor(spine, pictureId, r, g, b, a);
  });

  PluginManager.registerCommand(pluginName, "fadeSpineAlpha", (args) => {
    const pictureId = Number(args.pictureId || 0);
    if (!pictureId) return;
    const targetAlpha = clamp01(args.targetAlpha, 0);
    const fadeDuration = Number(args.fadeDuration) || 30;
    const partAlphas = parsePartAlphaSettings(args.partAlphaSettings);
    animateSpineAlpha(pictureId, targetAlpha, fadeDuration, { partAlphas });
  });

  // 二重配列点滅を実際に開始する関数
  function startDualArrayBlink(config) {
    const {
      pictureIdA,
      pictureIdB,
      x,
      y,
      scale,
      skeletonName,
      trackSettingsA,
      trackSettingsB,
      layerSkinSettings,
      combinedSkinNames,
      mixValue,
      blinkDuration,
      blinkCount,
      blinkWait,
      maskImage,
      maskPictureId,
    } = config;

    const queueKey = pictureIdB;

    // ピクチャA（下）の設定
    let spineA = getSpine(pictureIdA);
    if (!spineA) {
      $gameScreen.showPicture(pictureIdA, "", 0, x, y, scale, scale, 255, 0);
      spineA = getSpine(pictureIdA);
      if (!spineA) return;
      spineA.setSkeleton(skeletonName);
      spineA.setScale(1.0, 1.0);
    }
    // 既存・新規問わずスキンを適用
    initializeSkinState(pictureIdA, layerSkinSettings);
    applySkins(spineA, combinedSkinNames, true);
    applyMix(spineA, mixValue);
    // ピクチャAのフェード・ブリンクを停止し、完全不透明にリセット
    stopSpineFade(pictureIdA);
    stopSpineBlink(pictureIdA);
    setSpineColor(spineA, pictureIdA, 1, 1, 1, 1);

    // ピクチャAにもトラック設定を初期適用（CallPresetAnimの先行指定を含む）
    if (trackSettingsA && trackSettingsA.length > 0) {
      applyTracks(spineA, pictureIdA, trackSettingsA, true);
      applyMix(spineA, mixValue);
    }

    // ピクチャB（上）の設定
    // ※ Sprite_PictureオブジェクトはRPG Makerが_pictureContainerで固定管理するため
    //   erasePicture/showPictureでオブジェクト自体は変わらない。ラッパー内に残したままでOK。
    if ($gameScreen.picture(pictureIdB)) {
      $gameScreen.erasePicture(pictureIdB);
    }
    $gameScreen.showPicture(pictureIdB, "", 0, x, y, scale, scale, 255, 0);

    const spineB = getSpine(pictureIdB);
    if (!spineB) return;

    spineB.setSkeleton(skeletonName);
    spineB.setScale(1.0, 1.0);
    stopSpineFade(pictureIdB);
    stopSpineBlink(pictureIdB);

    initializeSkinState(pictureIdB, layerSkinSettings);
    applySkins(spineB, combinedSkinNames, true);

    // ★重要: スキン適用後、アニメーション適用「前」にmixを設定
    applyMix(spineB, mixValue);

    // ピクチャBにアニメーション配列Bを適用
    applyTracks(spineB, pictureIdB, trackSettingsB, false);

    // ★アニメーション適用後にも再度mixを強制設定（念のため）
    applyMix(spineB, mixValue);

    // スキン・アニメ適用後に改めて透明を保証（setSkin/setAnimation側で色がリセットされるケース対策）
    setSpineColor(spineB, pictureIdB, 1, 1, 1, 0);

    // マスク適用（既存ラッパーがあればスプライト入れ替えのみ、なければ新規作成）
    if (maskImage && maskPictureId) {
      applyDualSpineMask(pictureIdA, pictureIdB, maskPictureId, maskImage);
    }

    // 二重配列点滅専用のブリンク処理
    // trackSettingsA/Bをミュータブルな配列としてblinkStateに保存
    // CallPresetAnimが動作中にトラックを追加/更新できるようにする
    const liveTrackSettingsA = [...trackSettingsA];
    const liveTrackSettingsB = [...trackSettingsB];

    const dualBlinkState = {
      phase: 0,
      currentFrame: 0,
      remainingBlinks: blinkCount === 0 ? Infinity : blinkCount,
      stopped: false,
      firstFadeInStarted: false,
    };

    const dualArrayBlinkUpdate = () => {
      if (dualBlinkState.stopped) return;

      const spA = getSpine(pictureIdA);
      const spB = getSpine(pictureIdB);
      if (!spA || !spB) {
        dualBlinkState.stopped = true;
        return;
      }

      // phase 0: フェードイン
      if (dualBlinkState.phase === 0) {
        if (!dualBlinkState.firstFadeInStarted) {
          dualBlinkState.firstFadeInStarted = true;
          dualBlinkState.currentFrame = 0;
          // liveTrackSettingsBが更新されていたらpicB（透明中）に適用
          if (dualBlinkState._bTracksDirty) {
            applyTracks(spB, pictureIdB, liveTrackSettingsB, true);
            applyMix(spB, mixValue);
            dualBlinkState._bTracksDirty = false;
          }
        }

        const progress = Math.min(
          dualBlinkState.currentFrame / blinkDuration,
          1
        );
        spB.setColor(1, 1, 1, progress);
        colorState[pictureIdB] = { r: 1, g: 1, b: 1, a: progress };

        if (dualBlinkState.currentFrame >= blinkDuration) {
          // フェードイン完了: ピクチャAにアニメーション配列Aを適用
          applyTracks(spA, pictureIdA, liveTrackSettingsA, true);
          dualBlinkState.currentFrame = 0;
          dualBlinkState.phase = blinkWait > 0 ? 1 : 2;
        } else {
          dualBlinkState.currentFrame++;
        }
      } else if (dualBlinkState.phase === 1) {
        // フェードイン後のwait
        dualBlinkState.currentFrame++;
        if (dualBlinkState.currentFrame >= blinkWait) {
          dualBlinkState.currentFrame = 0;
          dualBlinkState.phase = 2;
        }
      } else if (dualBlinkState.phase === 2) {
        // フェードアウト
        const progress = Math.min(
          dualBlinkState.currentFrame / blinkDuration,
          1
        );
        const alpha = 1 - progress;
        spB.setColor(1, 1, 1, alpha);
        colorState[pictureIdB] = { r: 1, g: 1, b: 1, a: alpha };

        if (dualBlinkState.currentFrame >= blinkDuration) {
          // フェードアウト完了
          dualBlinkState.remainingBlinks--;
          if (dualBlinkState.remainingBlinks <= 0) {
            dualBlinkState.stopped = true;
            return;
          }
          dualBlinkState.currentFrame = 0;
          // キューがあってもなくても、blinkWait > 0ならphase 3（ウェイト）へ
          dualBlinkState.phase = blinkWait > 0 ? 3 : 0;
          if (dualBlinkState.phase === 0) {
            // ウェイトなしの場合、ここでキューをチェック
            const queuedConfig = dualBlinkQueue[queueKey];
            if (queuedConfig) {
              delete dualBlinkQueue[queueKey];
              dualBlinkState.stopped = true;
              console.log("二重配列点滅: フェードアウト完了、キューから次の設定を適用");
              if (queuedConfig._isTransition) {
                delete queuedConfig._isTransition;
                startDualArrayTransition(queuedConfig);
              } else {
                startDualArrayBlink(queuedConfig);
              }
              return;
            }
            dualBlinkState.firstFadeInStarted = false;
          }
        } else {
          dualBlinkState.currentFrame++;
        }
      } else if (dualBlinkState.phase === 3) {
        // フェードアウト後のwait
        dualBlinkState.currentFrame++;
        if (dualBlinkState.currentFrame >= blinkWait) {
          dualBlinkState.currentFrame = 0;
          // ★ウェイト完了時にキューをチェック
          const queuedConfig = dualBlinkQueue[queueKey];
          if (queuedConfig) {
            // キューに次の設定がある → ウェイト後に新しい設定を開始
            delete dualBlinkQueue[queueKey];
            dualBlinkState.stopped = true;
            console.log("二重配列点滅: ウェイト完了、キューから次の設定を適用");
            if (queuedConfig._isTransition) {
              delete queuedConfig._isTransition;
              startDualArrayTransition(queuedConfig);
            } else {
              startDualArrayBlink(queuedConfig);
            }
            return;
          }
          dualBlinkState.phase = 0; // 次のフェードインへ
          dualBlinkState.firstFadeInStarted = false;
        }
      }

      if (!dualBlinkState.stopped) {
        requestAnimationFrame(dualArrayBlinkUpdate);
      }
    };

    // blinkStateに登録（liveTrackSettingsを公開してCallPresetAnimから更新可能に）
    blinkState[pictureIdB] = {
      active: true,
      dualBlinkState: dualBlinkState,
      liveTrackSettingsA: liveTrackSettingsA,
      liveTrackSettingsB: liveTrackSettingsB,
    };

    // 念のためフェードイン開始直前にも透明を強制
    setSpineColor(spineB, pictureIdB, 1, 1, 1, 0);

    // 初回は点滅間隔ぶんSpine（上）をフェードインしてから開始
    animateSpineAlpha(pictureIdB, 1, blinkDuration, {
      startAlpha: 0,
      onFinish: () => {
        if (dualBlinkState.stopped) return;
        const spA = getSpine(pictureIdA);
        if (!spA) return;
        applyTracks(spA, pictureIdA, liveTrackSettingsA, true);
        dualBlinkState.currentFrame = 0;
        dualBlinkState.phase = blinkWait > 0 ? 1 : 2;
        dualBlinkState.firstFadeInStarted = true;
        requestAnimationFrame(dualArrayBlinkUpdate);
      },
    });
  }

  // 二重配列遷移を実際に開始する関数
  function startDualArrayTransition(config) {
    const {
      pictureIdA,
      pictureIdB,
      x,
      y,
      scale,
      skeletonName,
      trackSettingsA,
      trackSettingsB,
      layerSkinSettings,
      combinedSkinNames,
      mixValue,
      fadeDuration,
      fadeWait,
      maskImage,
      maskPictureId,
    } = config;

    // コモンイベント発火
    if (config.commonEventId > 0 && $dataCommonEvents[config.commonEventId]) {
      $gameTemp.reserveCommonEvent(config.commonEventId);
    }

    const queueKey = pictureIdB;

    // ピクチャA（下）の設定
    let spineA = getSpine(pictureIdA);
    if (!spineA) {
      $gameScreen.showPicture(pictureIdA, "", 0, x, y, scale, scale, 255, 0);
      spineA = getSpine(pictureIdA);
      if (!spineA) return;
      spineA.setSkeleton(skeletonName);
      spineA.setScale(1.0, 1.0);
    }
    // 既存・新規問わずスキンを適用
    initializeSkinState(pictureIdA, layerSkinSettings);
    applySkins(spineA, combinedSkinNames, true);
    applyMix(spineA, mixValue);
    stopSpineFade(pictureIdA);
    stopSpineBlink(pictureIdA);
    setSpineColor(spineA, pictureIdA, 1, 1, 1, 1);

    // ピクチャAのトラック初期適用は新規作成時のみ（遷移時は現在のアニメを維持）
    // trackSettingsAはフェードイン完了後(Phase0完了)にpicAに適用される
    if (config._isFirstSetup && trackSettingsA && trackSettingsA.length > 0) {
      applyTracks(spineA, pictureIdA, trackSettingsA, true);
      applyMix(spineA, mixValue);
    }

    // ピクチャB（上）の設定
    // ※ Sprite_PictureオブジェクトはRPG Makerが固定管理するため、ラッパー内に残したままでOK
    if ($gameScreen.picture(pictureIdB)) {
      $gameScreen.erasePicture(pictureIdB);
    }
    $gameScreen.showPicture(pictureIdB, "", 0, x, y, scale, scale, 255, 0);

    const spineB = getSpine(pictureIdB);
    if (!spineB) return;

    spineB.setSkeleton(skeletonName);
    spineB.setScale(1.0, 1.0);
    stopSpineFade(pictureIdB);
    stopSpineBlink(pictureIdB);

    initializeSkinState(pictureIdB, layerSkinSettings);
    applySkins(spineB, combinedSkinNames, true);
    applyMix(spineB, mixValue);

    // ピクチャBにアニメーション配列Bを適用
    applyTracks(spineB, pictureIdB, trackSettingsB, false);
    applyMix(spineB, mixValue);
    setSpineColor(spineB, pictureIdB, 1, 1, 1, 0);

    // マスク適用
    if (maskImage && maskPictureId) {
      applyDualSpineMask(pictureIdA, pictureIdB, maskPictureId, maskImage);
    }

    // 遷移用の状態管理
    const liveTrackSettingsA = [...trackSettingsA];
    const liveTrackSettingsB = [...trackSettingsB];

    const transitionState = {
      phase: 0, // 0: フェードイン, 1: ウェイト, 2: フェードアウト
      currentFrame: 0,
      stopped: false,
    };

    const transitionUpdate = () => {
      if (transitionState.stopped) {
        return;
      }

      const spA = getSpine(pictureIdA);
      const spB = getSpine(pictureIdB);
      if (!spA || !spB) {
        transitionState.stopped = true;
        return;
      }

      if (transitionState.phase === 0) {
        // フェードイン
        const progress = Math.min(
          transitionState.currentFrame / fadeDuration,
          1
        );
        spB.setColor(1, 1, 1, progress);
        colorState[pictureIdB] = { r: 1, g: 1, b: 1, a: progress };

        if (transitionState.currentFrame >= fadeDuration) {
          // フェードイン完了: ピクチャAにアニメーション配列Aを適用
          applyTracks(spA, pictureIdA, liveTrackSettingsA, true);
          transitionState.currentFrame = 0;
          transitionState.phase = fadeWait > 0 ? 1 : 2;
        } else {
          transitionState.currentFrame++;
        }
      } else if (transitionState.phase === 1) {
        // フェードイン後のウェイト
        transitionState.currentFrame++;
        if (transitionState.currentFrame >= fadeWait) {
          transitionState.currentFrame = 0;
          transitionState.phase = 2;
        }
      } else if (transitionState.phase === 2) {
        // フェードアウト
        const progress = Math.min(
          transitionState.currentFrame / fadeDuration,
          1
        );
        const alpha = 1 - progress;
        spB.setColor(1, 1, 1, alpha);
        colorState[pictureIdB] = { r: 1, g: 1, b: 1, a: alpha };

        if (transitionState.currentFrame >= fadeDuration) {
          // フェードアウト完了
          transitionState.currentFrame = 0;
          // ウェイト後にキューをチェック
          transitionState.phase = fadeWait > 0 ? 3 : 4;
        } else {
          transitionState.currentFrame++;
        }
      } else if (transitionState.phase === 3) {
        // フェードアウト後のウェイト
        transitionState.currentFrame++;
        if (transitionState.currentFrame >= fadeWait) {
          transitionState.currentFrame = 0;
          transitionState.phase = 4; // キューチェックへ
        }
      } else if (transitionState.phase === 4) {
        // キューチェック
        const queuedConfig = dualBlinkQueue[queueKey];
        if (queuedConfig) {
          delete dualBlinkQueue[queueKey];
          transitionState.stopped = true;
          console.log("二重配列遷移: ウェイト完了、キューから次の設定を適用");
          // 遷移モードか点滅モードかで分岐
          if (queuedConfig._isTransition) {
            delete queuedConfig._isTransition;
            startDualArrayTransition(queuedConfig);
          } else {
            startDualArrayBlink(queuedConfig);
          }
          return;
        }
        // 連鎖遷移キューチェック
        const chain = transitionChainQueue[queueKey];
        if (chain && chain.length > 0) {
          const nextConfig = chain.shift();
          if (chain.length === 0) delete transitionChainQueue[queueKey];
          transitionState.stopped = true;
          // 最終Blinkか遷移ステップかで分岐
          if (nextConfig._isFinalBlink) {
            delete nextConfig._isFinalBlink;
            console.log("二重配列遷移: 連鎖完了、最終Blink開始");
            startDualArrayBlink(nextConfig);
          } else {
            console.log("二重配列遷移: 連鎖キューから次のステップを実行（残り" + (chain ? chain.length : 0) + "）");
            startDualArrayTransition(nextConfig);
          }
          return;
        }
        // キューがなければ終了
        transitionState.stopped = true;
        blinkState[pictureIdB].active = false;
        console.log("二重配列遷移: 完了");
        return;
      }

      if (!transitionState.stopped) {
        requestAnimationFrame(transitionUpdate);
      }
    };

    // blinkStateに登録（stopSpineBlinkで停止できるようにする）
    blinkState[pictureIdB] = {
      active: true,
      dualBlinkState: transitionState,
      liveTrackSettingsA: liveTrackSettingsA,
      liveTrackSettingsB: liveTrackSettingsB,
    };

    setSpineColor(spineB, pictureIdB, 1, 1, 1, 0);

    // フェードイン開始
    requestAnimationFrame(transitionUpdate);
  }

  // プリセット呼出コマンド
  PluginManager.registerCommand(pluginName, "CallPreset", (args) => {
    const presetName = String(args.presetName || "").trim();
    const preset = presetList.find((p) => p.presetName === presetName);
    if (!preset) {
      console.warn(`[OnspineCALL] プリセット "${presetName}" が見つかりません`);
      return;
    }

    const x = preset.x;
    const y = preset.y;
    const scale = preset.scale;
    const skeletonName = preset.skeletonName;

    if (!skeletonName) {
      console.warn(`[OnspineCALL] プリセット "${presetName}": スケルトン名が空です`);
      return;
    }

    const animArrayA = preset.animationsA && preset.animationsA.length > 0
      ? [...preset.animationsA] : [];
    const animArrayB = preset.animationsB && preset.animationsB.length > 0
      ? [...preset.animationsB] : [];

    const { layerSkinSettings, combinedSkinNames } = resolveSkinPreset(preset.skinPresetName);

    const buildTrackSettingsFromArray = (animArray) =>
      animArray
        .map((anim, index) => {
          const animName = String(anim || "").trim();
          if (!animName || animName === "000") return null;
          return {
            trackId: index,
            animations: [animName],
            order: "sequential",
            continuance: "continue",
            interrupt: false,
          };
        })
        .filter((t) => t !== null);

    let trackSettingsA = buildTrackSettingsFromArray(animArrayA);
    let trackSettingsB = buildTrackSettingsFromArray(animArrayB);

    // CallPresetAnimが先行呼出しされていた場合、バッファからマージ
    const pendingKey = preset.pictureIdB;
    if (pendingTrackOverrides[pendingKey]) {
      const pending = pendingTrackOverrides[pendingKey];
      const mergePendingTrack = (base, overrides) => {
        for (const ov of overrides) {
          const idx = base.findIndex(t => t.trackId === ov.trackId);
          if (idx >= 0) base[idx] = ov;
          else base.push(ov);
        }
        return base;
      };
      trackSettingsA = mergePendingTrack(trackSettingsA, pending.trackSettingsA);
      trackSettingsB = mergePendingTrack(trackSettingsB, pending.trackSettingsB);
      delete pendingTrackOverrides[pendingKey];
    }

    const maskImage = preset.maskImage || "";
    const maskPictureId = preset.maskPictureId || 0;

    {
      const config = {
        pictureIdA: preset.pictureIdA,
        pictureIdB: preset.pictureIdB,
        x, y, scale, skeletonName,
        trackSettingsA, trackSettingsB,
        layerSkinSettings, combinedSkinNames,
        mixValue: 0,
        blinkDuration: preset.duration,
        blinkCount: preset.count,
        blinkWait: preset.wait,
        maskImage, maskPictureId,
      };
      const queueKey = preset.pictureIdB;
      const existingState = blinkState[queueKey];
      if (existingState && existingState.active && existingState.dualBlinkState && !existingState.dualBlinkState.stopped) {
        dualBlinkQueue[queueKey] = config;
        return;
      }
      startDualArrayBlink(config);
    }
  });

  // プリセットアニメ適用コマンド
  PluginManager.registerCommand(pluginName, "CallPresetAnim", (args) => {
    const presetName = String(args.presetName || "").trim();
    const preset = presetList.find((p) => p.presetName === presetName);
    if (!preset) {
      console.warn(`[OnspineCALL] プリセット "${presetName}" が見つかりません`);
      return;
    }

    const trackId = Number(args.trackId || 0);
    const animA = String(args.animA || "").trim();
    const animB = String(args.animB || "").trim();

    const pictureIdA = preset.pictureIdA;
    const pictureIdB = preset.pictureIdB;
    const queueKey = pictureIdB;

    // 既にblink/transitionが動作中の場合 → liveTrackSettingsを直接更新
    const existingState = blinkState[queueKey];
    if (existingState && existingState.active && existingState.dualBlinkState && !existingState.dualBlinkState.stopped) {
      // トラックをマージ/削除するヘルパー
      const mergeTrack = (settings, newTrack) => {
        const idx = settings.findIndex(t => t.trackId === newTrack.trackId);
        if (idx >= 0) settings[idx] = newTrack;
        else settings.push(newTrack);
      };
      const removeTrack = (settings, removeTrackId) => {
        const idx = settings.findIndex(t => t.trackId === removeTrackId);
        if (idx >= 0) settings.splice(idx, 1);
      };

      const hasAnimA = animA && animA !== "000";
      const hasAnimB = animB && animB !== "000";
      const isRemoveA = animA === "000";
      const isRemoveB = animB === "000";

      // 変更なしならスキップ
      if (!hasAnimA && !hasAnimB && !isRemoveA && !isRemoveB) return;

      // liveTrackSettingsを直接更新（Blinkの次のサイクルで自動反映）
      if (existingState.liveTrackSettingsA) {
        if (hasAnimA) {
          mergeTrack(existingState.liveTrackSettingsA, {
            trackId, animations: [animA], order: "sequential", continuance: "continue", interrupt: false,
          });
        } else if (isRemoveA) {
          removeTrack(existingState.liveTrackSettingsA, trackId);
        }
      }
      if (existingState.liveTrackSettingsB) {
        if (hasAnimB) {
          mergeTrack(existingState.liveTrackSettingsB, {
            trackId, animations: [animB], order: "sequential", continuance: "continue", interrupt: false,
          });
        } else if (isRemoveB) {
          removeTrack(existingState.liveTrackSettingsB, trackId);
        }
      }
      // picBのトラック更新フラグを立てる（次のphase 0開始時に適用）
      existingState.dualBlinkState._bTracksDirty = true;

      // 連鎖遷移キュー内の残りconfigにも反映（次ステップ以降に引き継ぐ）
      const chainQueue = transitionChainQueue[queueKey];
      if (chainQueue) {
        for (const cfg of chainQueue) {
          if (cfg.trackSettingsA) {
            if (hasAnimA) {
              mergeTrack(cfg.trackSettingsA, {
                trackId, animations: [animA], order: "sequential", continuance: "continue", interrupt: false,
              });
            } else if (isRemoveA) {
              removeTrack(cfg.trackSettingsA, trackId);
            }
          }
          if (cfg.trackSettingsB) {
            if (hasAnimB) {
              mergeTrack(cfg.trackSettingsB, {
                trackId, animations: [animB], order: "sequential", continuance: "continue", interrupt: false,
              });
            } else if (isRemoveB) {
              removeTrack(cfg.trackSettingsB, trackId);
            }
          }
        }
      }

      // dualBlinkQueueにも反映
      const queuedBlink = dualBlinkQueue[queueKey];
      if (queuedBlink) {
        if (queuedBlink.trackSettingsA) {
          if (hasAnimA) {
            mergeTrack(queuedBlink.trackSettingsA, {
              trackId, animations: [animA], order: "sequential", continuance: "continue", interrupt: false,
            });
          } else if (isRemoveA) {
            removeTrack(queuedBlink.trackSettingsA, trackId);
          }
        }
        if (queuedBlink.trackSettingsB) {
          if (hasAnimB) {
            mergeTrack(queuedBlink.trackSettingsB, {
              trackId, animations: [animB], order: "sequential", continuance: "continue", interrupt: false,
            });
          } else if (isRemoveB) {
            removeTrack(queuedBlink.trackSettingsB, trackId);
          }
        }
      }
      return;
    }

    // blink未開始 → バッファに蓄積（後続のCallPresetで消費される）
    const mergeTrackPending = (settings, newTrack) => {
      const idx = settings.findIndex(t => t.trackId === newTrack.trackId);
      if (idx >= 0) settings[idx] = newTrack;
      else settings.push(newTrack);
    };
    const removeTrackPending = (settings, removeTrackId) => {
      const idx = settings.findIndex(t => t.trackId === removeTrackId);
      if (idx >= 0) settings.splice(idx, 1);
    };

    if (!pendingTrackOverrides[queueKey]) {
      pendingTrackOverrides[queueKey] = { trackSettingsA: [], trackSettingsB: [] };
    }
    const pending = pendingTrackOverrides[queueKey];

    const hasAnimA = animA && animA !== "000";
    const hasAnimB = animB && animB !== "000";
    const isRemoveA = animA === "000";
    const isRemoveB = animB === "000";

    if (hasAnimA) {
      mergeTrackPending(pending.trackSettingsA, {
        trackId, animations: [animA], order: "sequential", continuance: "continue", interrupt: false,
      });
    } else if (isRemoveA) {
      removeTrackPending(pending.trackSettingsA, trackId);
    }
    if (hasAnimB) {
      mergeTrackPending(pending.trackSettingsB, {
        trackId, animations: [animB], order: "sequential", continuance: "continue", interrupt: false,
      });
    } else if (isRemoveB) {
      removeTrackPending(pending.trackSettingsB, trackId);
    }
  });

  // プリセット連鎖遷移コマンド
  PluginManager.registerCommand(pluginName, "CallPresetChainTransition", (args) => {
    const presetName = String(args.presetName || "").trim();
    const preset = presetList.find((p) => p.presetName === presetName);
    if (!preset) {
      console.warn(`[OnspineCALL] プリセット "${presetName}" が見つかりません`);
      return;
    }

    const trackId = Number(args.trackId) || 0;
    const animations = JSON.parse(args.animations || "[]").map((s) => String(s || "").trim()).filter((s) => s);

    if (animations.length < 2) {
      console.warn(`[OnspineCALL] プリセット連鎖遷移 "${presetName}": アニメ配列は2つ以上必要です`);
      return;
    }

    const fadeDuration = Number(args.fadeDuration) || 30;
    const fadeWait = Number(args.fadeWait) || 0;

    const skeletonName = preset.skeletonName;
    if (!skeletonName) {
      console.warn(`[OnspineCALL] プリセット "${presetName}": スケルトン名が空です`);
      return;
    }

    const { layerSkinSettings, combinedSkinNames } = resolveSkinPreset(preset.skinPresetName);
    const maskImage = preset.maskImage || "";
    const maskPictureId = preset.maskPictureId || 0;

    const queueKey = preset.pictureIdB;

    // 現在動作中のliveTrackSettingsがあればそれをベースにする（他トラックの設定を維持）
    // なければプリセットの基本アニメーション配列からベーストラック設定を構築
    const existingState = blinkState[queueKey];
    let baseTrackSettingsA, baseTrackSettingsB;
    if (existingState && existingState.liveTrackSettingsA) {
      baseTrackSettingsA = existingState.liveTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      baseTrackSettingsB = (existingState.liveTrackSettingsB || existingState.liveTrackSettingsA)
        .map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    } else {
      const buildBaseTrackSettings = (animArray) =>
        (animArray || [])
          .map((anim, index) => {
            const animName = String(anim || "").trim();
            if (!animName || animName === "000") return null;
            return {
              trackId: index,
              animations: [animName],
              order: "sequential",
              continuance: "continue",
              interrupt: false,
            };
          })
          .filter((t) => t !== null);
      baseTrackSettingsA = buildBaseTrackSettings(preset.animationsA);
      baseTrackSettingsB = buildBaseTrackSettings(preset.animationsB);
    }

    // pendingTrackOverridesがあればベースにマージ
    const pendingKey = queueKey;
    if (pendingTrackOverrides[pendingKey]) {
      const pending = pendingTrackOverrides[pendingKey];
      for (const ov of pending.trackSettingsA) {
        const idx = baseTrackSettingsA.findIndex(t => t.trackId === ov.trackId);
        if (idx >= 0) baseTrackSettingsA[idx] = Object.assign({}, ov);
        else baseTrackSettingsA.push(Object.assign({}, ov));
      }
      for (const ov of pending.trackSettingsB) {
        const idx = baseTrackSettingsB.findIndex(t => t.trackId === ov.trackId);
        if (idx >= 0) baseTrackSettingsB[idx] = Object.assign({}, ov);
        else baseTrackSettingsB.push(Object.assign({}, ov));
      }
      delete pendingTrackOverrides[pendingKey];
    }

    // 指定トラックを上書きするヘルパー
    const overrideTrack = (settings, tid, animName) => {
      const entry = { trackId: tid, animations: [animName], order: "sequential", continuance: "continue", interrupt: false };
      const idx = settings.findIndex((t) => t.trackId === tid);
      if (idx >= 0) settings[idx] = entry;
      else settings.push(entry);
    };

    // 連続する2つのアニメから遷移configを構築
    // animB(上・遷移中) = animations[i], animA(下・遷移後) = animations[i+1]
    const buildTransitionConfig = (animCurrent, animNext) => {
      const trackSettingsA = baseTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      const trackSettingsB = baseTrackSettingsB.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      overrideTrack(trackSettingsA, trackId, animNext);
      overrideTrack(trackSettingsB, trackId, animCurrent);
      return {
        pictureIdA: preset.pictureIdA,
        pictureIdB: preset.pictureIdB,
        x: preset.x, y: preset.y, scale: preset.scale,
        skeletonName, trackSettingsA, trackSettingsB,
        layerSkinSettings, combinedSkinNames,
        mixValue: 0, fadeDuration, fadeWait,
        maskImage, maskPictureId,
      };
    };

    // 遷移ステップを構築（N個のアニメからN-1個の遷移）
    const transitionConfigs = [];
    for (let i = 0; i < animations.length - 1; i++) {
      transitionConfigs.push(buildTransitionConfig(animations[i], animations[i + 1]));
    }

    // 最後のアニメでBlink繰り返し用のconfigを構築
    const lastAnim = animations[animations.length - 1];
    const blinkTrackSettingsA = baseTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    const blinkTrackSettingsB = baseTrackSettingsB.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    overrideTrack(blinkTrackSettingsA, trackId, lastAnim);
    overrideTrack(blinkTrackSettingsB, trackId, lastAnim);
    const finalBlinkConfig = {
      pictureIdA: preset.pictureIdA,
      pictureIdB: preset.pictureIdB,
      x: preset.x, y: preset.y, scale: preset.scale,
      skeletonName: preset.skeletonName,
      trackSettingsA: blinkTrackSettingsA,
      trackSettingsB: blinkTrackSettingsB,
      layerSkinSettings, combinedSkinNames,
      mixValue: 0,
      blinkDuration: preset.duration,
      blinkCount: preset.count,
      blinkWait: preset.wait,
      maskImage, maskPictureId,
    };

    const queueKey2 = preset.pictureIdB;
    const firstConfig = transitionConfigs[0];

    // 残りの遷移ステップ + 最後Blinkを連鎖キューに格納
    const chainConfigs = transitionConfigs.slice(1);
    // 最終Blinkは連鎖キューの末尾に追加（_isFinalBlinkフラグ付き）
    finalBlinkConfig._isFinalBlink = true;
    chainConfigs.push(finalBlinkConfig);
    if (chainConfigs.length > 0) {
      transitionChainQueue[queueKey2] = chainConfigs;
    }

    // 既存の処理がアクティブかチェック
    const existingState2 = blinkState[queueKey2];
    if (existingState2 && existingState2.active && existingState2.dualBlinkState && !existingState2.dualBlinkState.stopped) {
      // 既存処理中 → 先頭をキューに
      firstConfig._isTransition = true;
      dualBlinkQueue[queueKey2] = firstConfig;
      return;
    }

    firstConfig._isFirstSetup = true;
    startDualArrayTransition(firstConfig);
  });

  // プリセット連鎖遷移＋コマンド
  PluginManager.registerCommand(pluginName, "CallPresetChainTransitionPlus", (args) => {
    const presetName = String(args.presetName || "").trim();
    const preset = presetList.find((p) => p.presetName === presetName);
    if (!preset) {
      console.warn(`[OnspineCALL] プリセット "${presetName}" が見つかりません`);
      return;
    }

    const trackId = Number(args.trackId) || 0;
    const rawSteps = JSON.parse(args.animations || "[]").map((s) => {
      const obj = typeof s === "string" ? JSON.parse(s) : s;
      return {
        animName: String(obj.animName || "").trim(),
        fadeDuration: Number(obj.fadeDuration) || 30,
        fadeWait: Number(obj.fadeWait) || 0,
        commonEventId: Number(obj.commonEventId) || 0,
      };
    }).filter((s) => s.animName);
    const postAnimA = String(args.postAnimA || "").trim();
    const postAnimB = String(args.postAnimB || "").trim();

    if (rawSteps.length < 1) {
      console.warn(`[OnspineCALL] プリセット連鎖遷移＋ "${presetName}": 遷移アニメ配列は1つ以上必要です`);
      return;
    }
    if (!postAnimA && !postAnimB) {
      console.warn(`[OnspineCALL] プリセット連鎖遷移＋ "${presetName}": 遷移後アニメAまたはBが必要です`);
      return;
    }

    const lastFadeDuration = Number(args.lastFadeDuration) || 30;
    const lastFadeWait = Number(args.lastFadeWait) || 0;

    const skeletonName = preset.skeletonName;
    const { layerSkinSettings, combinedSkinNames } = resolveSkinPreset(preset.skinPresetName);
    const maskImage = preset.maskImage || "";
    const maskPictureId = preset.maskPictureId || 0;
    const queueKey = preset.pictureIdB;

    // 現在のliveTrackSettingsをベースに使用
    let baseTrackSettingsA, baseTrackSettingsB;
    const existingState = blinkState[queueKey];
    if (existingState && existingState.liveTrackSettingsA) {
      baseTrackSettingsA = existingState.liveTrackSettingsA
        .map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      baseTrackSettingsB = existingState.liveTrackSettingsB
        .map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    } else {
      const buildBaseTrackSettings = (animArray) =>
        (animArray || [])
          .map((anim, index) => {
            const animName = String(anim || "").trim();
            if (!animName || animName === "000") return null;
            return {
              trackId: index,
              animations: [animName],
              order: "sequential",
              continuance: "continue",
              interrupt: false,
            };
          })
          .filter((t) => t !== null);
      baseTrackSettingsA = buildBaseTrackSettings(preset.animationsA);
      baseTrackSettingsB = buildBaseTrackSettings(preset.animationsB);
    }

    // pendingがあればマージ
    const pendingKey = queueKey;
    if (pendingTrackOverrides[pendingKey]) {
      const pending = pendingTrackOverrides[pendingKey];
      for (const ov of pending.trackSettingsA) {
        const idx = baseTrackSettingsA.findIndex(t => t.trackId === ov.trackId);
        if (idx >= 0) baseTrackSettingsA[idx] = Object.assign({}, ov);
        else baseTrackSettingsA.push(Object.assign({}, ov));
      }
      for (const ov of pending.trackSettingsB) {
        const idx = baseTrackSettingsB.findIndex(t => t.trackId === ov.trackId);
        if (idx >= 0) baseTrackSettingsB[idx] = Object.assign({}, ov);
        else baseTrackSettingsB.push(Object.assign({}, ov));
      }
      delete pendingTrackOverrides[pendingKey];
    }

    // トラック上書きヘルパー
    const overrideTrack = (settings, tid, animName) => {
      const entry = { trackId: tid, animations: [animName], order: "sequential", continuance: "continue", interrupt: false };
      const idx = settings.findIndex((t) => t.trackId === tid);
      if (idx >= 0) settings[idx] = entry;
      else settings.push(entry);
    };

    // 遷移ステップを構築
    const buildTransitionConfig = (animCurrent, animNext, stepFadeDuration, stepFadeWait, stepCommonEventId) => {
      const trackSettingsA = baseTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      const trackSettingsB = baseTrackSettingsB.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
      overrideTrack(trackSettingsA, trackId, animNext);
      overrideTrack(trackSettingsB, trackId, animCurrent);
      return {
        pictureIdA: preset.pictureIdA,
        pictureIdB: preset.pictureIdB,
        x: preset.x, y: preset.y, scale: preset.scale,
        skeletonName, trackSettingsA, trackSettingsB,
        layerSkinSettings, combinedSkinNames,
        mixValue: 0, fadeDuration: stepFadeDuration, fadeWait: stepFadeWait,
        commonEventId: stepCommonEventId || 0,
        maskImage, maskPictureId,
      };
    };

    // 遷移ステップ構築
    const transitionConfigs = [];
    if (rawSteps.length >= 2) {
      // 複数アニメ: 順次遷移して最後のアニメからpostAnimへ遷移
      for (let i = 0; i < rawSteps.length - 1; i++) {
        transitionConfigs.push(buildTransitionConfig(
          rawSteps[i].animName, rawSteps[i + 1].animName,
          rawSteps[i + 1].fadeDuration, rawSteps[i + 1].fadeWait,
          rawSteps[i + 1].commonEventId
        ));
      }
    }
    // 最後の遷移アニメからpostAnimAへの遷移ステップを追加
    const lastStep = rawSteps[rawSteps.length - 1];
    const finalTransitionTrackSettingsA = baseTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    const finalTransitionTrackSettingsB = baseTrackSettingsB.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    overrideTrack(finalTransitionTrackSettingsA, trackId, postAnimA || lastStep.animName);
    overrideTrack(finalTransitionTrackSettingsB, trackId, lastStep.animName);
    transitionConfigs.push({
      pictureIdA: preset.pictureIdA,
      pictureIdB: preset.pictureIdB,
      x: preset.x, y: preset.y, scale: preset.scale,
      skeletonName,
      trackSettingsA: finalTransitionTrackSettingsA,
      trackSettingsB: finalTransitionTrackSettingsB,
      layerSkinSettings, combinedSkinNames,
      mixValue: 0, fadeDuration: lastFadeDuration, fadeWait: lastFadeWait,
      maskImage, maskPictureId,
    });

    // 最終Blink用config（postAnimA/postAnimBで繰り返し）
    const blinkTrackSettingsA = baseTrackSettingsA.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    const blinkTrackSettingsB = baseTrackSettingsB.map((t) => Object.assign({}, t, { animations: [...t.animations] }));
    overrideTrack(blinkTrackSettingsA, trackId, postAnimA || postAnimB);
    overrideTrack(blinkTrackSettingsB, trackId, postAnimB || postAnimA);
    const finalBlinkConfig = {
      pictureIdA: preset.pictureIdA,
      pictureIdB: preset.pictureIdB,
      x: preset.x, y: preset.y, scale: preset.scale,
      skeletonName: preset.skeletonName,
      trackSettingsA: blinkTrackSettingsA,
      trackSettingsB: blinkTrackSettingsB,
      layerSkinSettings, combinedSkinNames,
      mixValue: 0,
      blinkDuration: preset.duration,
      blinkCount: preset.count,
      blinkWait: preset.wait,
      maskImage, maskPictureId,
    };

    const queueKey2 = preset.pictureIdB;
    const firstConfig = transitionConfigs[0];

    // 残りの遷移ステップ + 最後Blinkを連鎖キューに格納
    const chainConfigs = transitionConfigs.slice(1);
    finalBlinkConfig._isFinalBlink = true;
    chainConfigs.push(finalBlinkConfig);
    if (chainConfigs.length > 0) {
      transitionChainQueue[queueKey2] = chainConfigs;
    }

    // 既存の処理がアクティブかチェック
    const existingState2 = blinkState[queueKey2];
    if (existingState2 && existingState2.active && existingState2.dualBlinkState && !existingState2.dualBlinkState.stopped) {
      firstConfig._isTransition = true;
      dualBlinkQueue[queueKey2] = firstConfig;
      return;
    }

    firstConfig._isFirstSetup = true;
    startDualArrayTransition(firstConfig);
  });

  PluginManager.registerCommand(pluginName, "fadeOutAndErase", (args) => {
    const pictureId = Number(args.pictureId);
    const fadeDuration = Number(args.fadeDuration) || 30;

    const spine = getSpine(pictureId);
    if (!spine) {
      $gameScreen.erasePicture(pictureId);
      delete colorState[pictureId];
      delete trackState[pictureId];
      delete skinState[pictureId];
      return;
    }
    animateSpineAlpha(pictureId, 0, fadeDuration, {
      onFinish: () => {
        $gameScreen.erasePicture(pictureId);
        delete trackState[pictureId];
        delete skinState[pictureId];
        delete colorState[pictureId];
      },
    });
  });

  PluginManager.registerCommand(pluginName, "VarSpinecall", (args) => {
    const pictureId = Number(args.pictureId);
    const fadeDuration = Number(args.fadeDuration) || 30;

    const spine = getSpine(pictureId);
    if (!spine) {
      $gameScreen.erasePicture(pictureId);
      delete colorState[pictureId];
      delete trackState[pictureId];
      delete skinState[pictureId];
      return;
    }
    animateSpineAlpha(pictureId, 0, fadeDuration, {
      onFinish: () => {
        $gameScreen.erasePicture(pictureId);
        delete trackState[pictureId];
        delete skinState[pictureId];
        delete colorState[pictureId];
      },
    });
  });

  PluginManager.registerCommand(pluginName, "VarSpinecall", (args) => {
    const pictureIdVar = Number(params.pictureIdVariable);
    const xVar = Number(params.xVariable);
    const yVar = Number(params.yVariable);
    const scaleVar = Number(params.scaleVariable);
    const skeletonNameVar = Number(params.skeletonNameVariable);
    const trackVar = Number(params.trackVariable);
    const animationNameVar = Number(params.animationNameVariable);
    const pictureId =
      pictureIdVar > 0 ? $gameVariables.value(pictureIdVar) || 0 : 0;
    const x = xVar > 0 ? $gameVariables.value(xVar) || 0 : 0;
    const y = yVar > 0 ? $gameVariables.value(yVar) || 0 : 0;
    const scale = scaleVar > 0 ? $gameVariables.value(scaleVar) || 100 : 100;
    const skeletonName =
      skeletonNameVar > 0 ? $gameVariables.value(skeletonNameVar) || "" : "";
    const trackNumRaw = trackVar > 0 ? $gameVariables.value(trackVar) : 0;
    let trackNum = Number(trackNumRaw);
    if (!isFinite(trackNum)) {
      trackNum = 0;
    }
    const animationValue =
      animationNameVar > 0 ? $gameVariables.value(animationNameVar) : "";

    if (!pictureId || !skeletonName) {
      return;
    }

    const parsedTrackSettings = buildTrackAnimationEntries(
      trackNum,
      animationValue
    ).map((entry) => ({
      trackId: entry.trackId,
      animations: entry.animations,
      order: "sequential",
      continuance: "continue",
      interrupt: false,
    }));

    if (parsedTrackSettings.length === 0) {
      return;
    }

    const mosaicSettings = [];
    const skinNames = collectSkinNamesFromVariable(skinNamesVariableId);
    const mixValue = 0.3;
    let fadeDurationFrames = 0;
    if (fadeDurationVariableId > 0) {
      const fadeValue = Number(
        $gameVariables.value(fadeDurationVariableId) || 0
      );
      if (isFinite(fadeValue) && fadeValue > 0) {
        fadeDurationFrames = Math.floor(fadeValue);
      }
    }
    const useFade = fadeDurationFrames > 0;

    if ($gameScreen.picture(pictureId)) {
      $gameScreen.erasePicture(pictureId);
    }
    $gameScreen.showPicture(pictureId, "", 0, x, y, scale, scale, 255, 0);

    const spine = getSpine(pictureId);
    if (!spine) return;

    spine.setSkeleton(skeletonName);
    spine.setScale(1.0, 1.0);
    stopSpineFade(pictureId);
    setSpineColor(spine, pictureId, 1, 1, 1, useFade ? 0 : 1);

    applySkins(spine, skinNames, true);
    applyMix(spine, mixValue);
    applyTracks(spine, pictureId, parsedTrackSettings, false);

    for (const mosaic of mosaicSettings) {
      spine.setMosaic(mosaic.image, mosaic.size);
    }

    if (useFade) {
      animateSpineAlpha(pictureId, 1, fadeDurationFrames, { startAlpha: 0 });
    }
  });

  PluginManager.registerCommand(pluginName, "VaranimCall", (args) => {
    const pictureIdVar = Number(params.pictureIdVariable);
    const trackVar = Number(params.trackVariable);
    const animationNameVar = Number(params.animationNameVariable);
    const pictureId =
      pictureIdVar > 0 ? $gameVariables.value(pictureIdVar) || 0 : 0;
    const trackNumRaw = trackVar > 0 ? $gameVariables.value(trackVar) : 0;
    let trackNum = Number(trackNumRaw);
    if (!isFinite(trackNum)) {
      trackNum = 0;
    }
    const animationValue =
      animationNameVar > 0 ? $gameVariables.value(animationNameVar) : "";

    let order = "sequential";
    let continuance = "continue";
    let interrupt = false;
    let useSkinVar = false;

    if (args.option) {
      try {
        const optionData = JSON.parse(args.option);
        order = optionData.order || "sequential";
        continuance = optionData.continuance || "continue";
        interrupt = optionData.interrupt === "true";
        if (optionData.keepSkin !== undefined) {
          useSkinVar = optionData.keepSkin === "true";
        } else if (optionData.skipSkin !== undefined) {
          useSkinVar = optionData.skipSkin !== "true";
        }
      } catch (e) {}
    }

    if (!pictureId) {
      return;
    }

    const spine = getSpine(pictureId);
    if (!spine) {
      return;
    }

    const animationEntries = buildTrackAnimationEntries(
      trackNum,
      animationValue
    );
    const skinNames = useSkinVar ? collectSkinNamesFromVariable(skinNamesVariableId) : [];

    if (animationEntries.length === 0) {
      return;
    }

    trackState[pictureId] = trackState[pictureId] || {};

    if (skinNames.length > 0) {
      applySkins(spine, skinNames, true);
    }

    for (const entry of animationEntries) {
      if (entry.animations.length === 1) {
        spine.setAnimation(
          entry.trackId,
          entry.animations[0],
          continuance,
          interrupt
        );
      } else {
        spine.setAnimation(
          entry.trackId,
          entry.animations,
          order,
          continuance,
          interrupt
        );
      }
      trackState[pictureId][entry.trackId] = entry.animations.join(",");
    }
  });

  // ==========================================================================
  // アニメ確認（showAnimBrowser）
  // ==========================================================================
  const animBrowserState = {
    active: false,
    pictureId: 21,
    waitFrames: 0,
    maxWait: 600,
    skeletonApplied: false,
    config: null,
    spineRef: null,
    spriteSpine: null,
    appliedSkins: [],
    lastAppliedAnim: "",
    lastClickedItem: "",
    trackAnims: {},
    windows: {},
    lastCopyPressed: false,
  };

  function cleanupAnimBrowser() {
    // キャンセル時: リセット用アニメを全トラックに適用
    const pic = $gameScreen.picture(animBrowserState.pictureId);
    const spine = pic ? getSpine(animBrowserState.pictureId) : null;
    const resetName = (animBrowserState.config && animBrowserState.config.resetAnimName) || "000";
    if (spine) {
      const usedTracks = Object.keys(animBrowserState.trackAnims).map(Number);
      for (const t of usedTracks) {
        spine.setAnimation(t, resetName, "sequential", "continue", false);
      }
      if (usedTracks.length === 0) {
        spine.setAnimation(0, resetName, "sequential", "continue", false);
      }
    }
    const scene = SceneManager._scene;
    for (const key of Object.keys(animBrowserState.windows)) {
      const win = animBrowserState.windows[key];
      if (win && win.parent) win.parent.removeChild(win);
    }
    animBrowserState.windows = {};
    if (animBrowserState.pictureId && $gameScreen.picture(animBrowserState.pictureId)) {
      $gameScreen.erasePicture(animBrowserState.pictureId);
    }
    stopSpineFade(animBrowserState.pictureId);
    delete colorState[animBrowserState.pictureId];
    animBrowserState.active = false;
    animBrowserState.waitFrames = 0;
    animBrowserState.skeletonApplied = false;
    animBrowserState.config = null;
    animBrowserState.spineRef = null;
    animBrowserState.spriteSpine = null;
    animBrowserState.appliedSkins = [];
    animBrowserState.lastAppliedAnim = "";
    animBrowserState.lastClickedItem = "";
    animBrowserState.trackAnims = {};
    animBrowserState.lastCopyPressed = false;
  }

  // --- カスタムウィンドウクラス ---

  // アニメ一覧ウィンドウ
  class Window_AnimList extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this._items = [];
      this._filterText = "";
    }
    isHoverEnabled() { return false; }
    maxItems() { return this._items.length; }
    drawItem(index) {
      const rect = this.itemLineRect(index);
      const name = this._items[index];
      // いずれかのトラックで適用中のアニメをハイライト
      const onTrack = Object.values(animBrowserState.trackAnims).includes(name);
      if (onTrack) {
        this.changeTextColor("#88ff88");
      } else {
        this.resetTextColor();
      }
      this.drawText(name, rect.x, rect.y, rect.width);
      this.resetTextColor();
    }
    setItems(items) {
      this._allItems = items;
      this.applyFilter();
    }
    applyFilter() {
      if (this._filterText) {
        const f = this._filterText.toLowerCase();
        this._items = this._allItems.filter(n => n.toLowerCase().includes(f));
      } else {
        this._items = this._allItems ? [...this._allItems] : [];
      }
      this.refresh();
      if (this._items.length > 0) this.select(0);
    }
    setFilter(text) {
      this._filterText = text;
      this.applyFilter();
    }
    currentItem() { return this._items[this.index()]; }
  }

  // スキン一覧ウィンドウ
  class Window_SkinList extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this._items = [];
    }
    isHoverEnabled() { return false; }
    maxItems() { return this._items.length; }
    drawItem(index) {
      const rect = this.itemLineRect(index);
      const name = this._items[index];
      // 適用済みのスキンをハイライト
      if (animBrowserState.appliedSkins.includes(name)) {
        this.changeTextColor("#88ff88");
      } else {
        this.resetTextColor();
      }
      this.drawText(name, rect.x, rect.y, rect.width);
      this.resetTextColor();
    }
    setItems(items) {
      this._items = items || [];
      this.refresh();
      if (this._items.length > 0) this.select(0);
    }
    currentItem() { return this._items[this.index()]; }
  }

  // トラック一覧ウィンドウ（動的 - アクティブなトラックのみ表示）
  class Window_TrackSelect extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this._items = [];
      this._upBtn = { x: 0, y: 0, w: 0, h: 0 };
      this._downBtn = { x: 0, y: 0, w: 0, h: 0 };
    }
    isHoverEnabled() { return false; }
    maxItems() { return this._items.length; }
    drawItem(index) {
      const rect = this.itemLineRect(index);
      const item = this._items[index];
      if (!item) return;
      this.changeTextColor("#88ff88");
      this.drawText(`T${item.trackId}: ${item.animName}`, rect.x, rect.y, rect.width);
      this.resetTextColor();
    }
    _refreshArrows() {
      if (!this.contents) return;
      // 右上に▲▼ボタンを描画
      const cw = this.contentsWidth();
      const btnW = 30;
      const btnH = 24;
      const bx = cw - btnW * 2 - 4;
      this._upBtn = { x: this.x + this.padding + bx, y: this.y + 4, w: btnW, h: btnH };
      this._downBtn = { x: this.x + this.padding + bx + btnW + 4, y: this.y + 4, w: btnW, h: btnH };
      // 描画（contents上の座標）
      this.contents.fontSize = 18;
      this.contents.fillRect(bx, 0, btnW, btnH, "rgba(60,60,60,0.8)");
      this.contents.fillRect(bx + btnW + 4, 0, btnW, btnH, "rgba(60,60,60,0.8)");
      this.changeTextColor("#ffffff");
      this.contents.drawText("▲", bx, -2, btnW, btnH, "center");
      this.contents.drawText("▼", bx + btnW + 4, -2, btnW, btnH, "center");
      this.contents.fontSize = 26;
      this.resetTextColor();
    }
    refresh() {
      super.refresh();
      this._refreshArrows();
    }
    refreshItems() {
      const anims = animBrowserState.trackAnims;
      this._items = Object.keys(anims)
        .map(Number)
        .sort((a, b) => a - b)
        .map(t => ({ trackId: t, animName: anims[t] }));
      this.refresh();
      if (this._items.length > 0 && this.index() < 0) this.select(0);
      if (this.index() >= this._items.length) this.select(Math.max(0, this._items.length - 1));
    }
    currentItem() { return this._items[this.index()]; }
    processTouch() {
      if (this.isOpenAndActive() && TouchInput.isTriggered()) {
        const arrow = this.hitTestArrow(TouchInput.x, TouchInput.y);
        if (arrow === "up") { this.swapTrack(-1); return; }
        if (arrow === "down") { this.swapTrack(1); return; }
      }
      super.processTouch();
    }
    hitTestArrow(tx, ty) {
      const u = this._upBtn;
      const d = this._downBtn;
      if (tx >= u.x && tx < u.x + u.w && ty >= u.y && ty < u.y + u.h) return "up";
      if (tx >= d.x && tx < d.x + d.w && ty >= d.y && ty < d.y + d.h) return "down";
      return null;
    }
    swapTrack(direction) {
      const idx = this.index();
      if (idx < 0 || this._items.length < 2) return;
      const targetIdx = idx + direction; // -1=up, +1=down
      if (targetIdx < 0 || targetIdx >= this._items.length) return;
      const itemA = this._items[idx];
      const itemB = this._items[targetIdx];
      // トラック番号を入れ替え
      const trackA = itemA.trackId;
      const trackB = itemB.trackId;
      const spine = getSpine(animBrowserState.pictureId);
      if (spine) {
        spine.setAnimation(trackA, itemB.animName, "sequential", "continue", true);
        spine.setAnimation(trackB, itemA.animName, "sequential", "continue", true);
      }
      animBrowserState.trackAnims[trackA] = itemB.animName;
      animBrowserState.trackAnims[trackB] = itemA.animName;
      const ts = trackState[animBrowserState.pictureId] || {};
      ts[trackA] = itemB.animName;
      ts[trackB] = itemA.animName;
      this.refreshItems();
      this.select(targetIdx);
      if (animBrowserState.windows.animWin) animBrowserState.windows.animWin.refresh();
    }
  }

  // 情報ウィンドウ
  class Window_AnimInfo extends Window_Base {
    constructor(rect) {
      super(rect);
    }
    refresh() {
      this.contents.clear();
      const lastClicked = animBrowserState.lastClickedItem || "(なし)";
      const skinCount = animBrowserState.appliedSkins.length;
      this.contents.fontSize = 18;
      this.drawText(`Copy: ${lastClicked}  skin:${skinCount}`, 0, 0, this.contentsWidth());
      this.contents.fontSize = 26;
    }
  }

  class Window_AnimHelp extends Window_Base {
    constructor(rect) {
      super(rect);
      this.opacity = 0;
      this._drawHelp();
    }
    _drawHelp() {
      if (!this.contents) return;
      this.contents.clear();
      this.contents.fontSize = 14;
      this.contents.textColor = "rgba(255,255,255,0.5)";
      const lines = [
        "Ctrl+C : コピー",
        "A : アニメ窓  T : トラック窓  S : スキン窓",
        "Tab : フォーカス切替  Esc : 閉じる",
      ];
      const lh = 18;
      for (let i = 0; i < lines.length; i++) {
        this.contents.drawText(lines[i], 4, i * lh, this.contentsWidth() - 8, lh, "left");
      }
      this.contents.fontSize = 26;
      this.resetTextColor();
    }
  }

  function getSpriteSpineForPictureId(pictureId) {
    // globalSpineObjects から取得
    if (window.globalSpineObjects) {
      const found = window.globalSpineObjects.find(obj => obj._pictureId === pictureId);
      if (found) return found;
    }
    // フォールバック: pictureContainerから探す
    const scene = SceneManager._scene;
    if (scene && scene._spriteset && scene._spriteset._pictureContainer) {
      const spritePic = scene._spriteset._pictureContainer.children.find(
        s => s && s._pictureId === pictureId
      );
      if (spritePic && spritePic.children[0] instanceof Sprite_Spine) {
        return spritePic.children[0];
      }
    }
    return null;
  }

  function createAnimBrowserWindows() {
    const scene = SceneManager._scene;
    if (!scene) return;

    const gw = Graphics.width;
    const gh = Graphics.height;

    // レイアウト: 右側にアニメ・スキン・情報、左上にトラック
    const panelW = 320;
    const panelX = gw - panelW;
    const infoH = 68;
    const skinH = 150;
    const animH = gh - skinH - infoH;
    const trackW = 320;
    const trackH = 200;

    // トラック一覧ウィンドウ（左上）
    const trackWin = new Window_TrackSelect(new Rectangle(0, 0, trackW, trackH));
    trackWin.opacity = 160;
    trackWin.setHandler("ok", () => {
      const item = trackWin.currentItem();
      if (item) {
        animBrowserState.lastClickedItem = item.animName;
        if (animBrowserState.windows.infoWin) animBrowserState.windows.infoWin.refresh();
      }
      trackWin.activate();
    });
    scene.addChild(trackWin);
    trackWin.refreshItems();
    trackWin.deactivate();

    // アニメーション一覧ウィンドウ（右側上部）
    const animWin = new Window_AnimList(new Rectangle(panelX, 0, panelW, animH));
    animWin.opacity = 160;
    animWin.setHandler("ok", () => {
      const animName = animWin.currentItem();
      if (animName) {
        const spine = getSpine(animBrowserState.pictureId);
        if (spine) {
          // 既にトラックに割り当て済みか検索
          let existingTrack = -1;
          for (const [t, name] of Object.entries(animBrowserState.trackAnims)) {
            if (name === animName) { existingTrack = Number(t); break; }
          }
          trackState[animBrowserState.pictureId] = trackState[animBrowserState.pictureId] || {};
          if (existingTrack >= 0) {
            // OFF: トラックから除去
            spine.setAnimation(existingTrack, resetAnimationName, "sequential", "continue", true);
            delete animBrowserState.trackAnims[existingTrack];
            delete trackState[animBrowserState.pictureId][existingTrack];
          } else {
            // ON: 次の空きトラックに割り当て
            let nextTrack = 0;
            while (animBrowserState.trackAnims[nextTrack] != null) nextTrack++;
            spine.setAnimation(nextTrack, animName, "sequential", "continue", true);
            animBrowserState.trackAnims[nextTrack] = animName;
            trackState[animBrowserState.pictureId][nextTrack] = animName;
          }
          animBrowserState.lastAppliedAnim = animName;
          animBrowserState.lastClickedItem = animName;
          if (animBrowserState.windows.trackWin) animBrowserState.windows.trackWin.refreshItems();
          if (animBrowserState.windows.infoWin) animBrowserState.windows.infoWin.refresh();
          animWin.refresh();
        }
      }
      animWin.activate();
    });
    scene.addChild(animWin);
    animWin.activate();

    // スキン一覧ウィンドウ（右側下部）
    const skinWin = new Window_SkinList(new Rectangle(panelX, animH, panelW, skinH));
    skinWin.opacity = 160;
    skinWin.setHandler("ok", () => {
      const skinName = skinWin.currentItem();
      if (skinName) {
        const idx = animBrowserState.appliedSkins.indexOf(skinName);
        if (idx >= 0) {
          animBrowserState.appliedSkins.splice(idx, 1);
        } else {
          animBrowserState.appliedSkins.push(skinName);
        }
        const spine = getSpine(animBrowserState.pictureId);
        if (spine && animBrowserState.appliedSkins.length > 0) {
          spine.setSkin(...animBrowserState.appliedSkins);
        }
        animBrowserState.lastClickedItem = skinName;
        skinWin.refresh();
        if (animBrowserState.windows.infoWin) animBrowserState.windows.infoWin.refresh();
      }
      skinWin.activate();
    });
    scene.addChild(skinWin);
    skinWin.deactivate();

    // 情報ウィンドウ（右側最下部）
    const infoWin = new Window_AnimInfo(new Rectangle(panelX, animH + skinH, panelW, infoH));
    infoWin.opacity = 160;
    infoWin.refresh();
    scene.addChild(infoWin);

    // ヘルプウィンドウ（左下）
    const helpH = 80;
    const helpW = 340;
    const helpWin = new Window_AnimHelp(new Rectangle(0, gh - helpH, helpW, helpH));
    scene.addChild(helpWin);

    animBrowserState.windows = { trackWin, skinWin, animWin, infoWin, helpWin };
  }

  function populateAnimBrowserLists() {
    const spriteSpine = getSpriteSpineForPictureId(animBrowserState.pictureId);
    if (!spriteSpine) return false;
    if (!spriteSpine._animationNames || spriteSpine._animationNames.length === 0) return false;

    animBrowserState.spriteSpine = spriteSpine;
    const animWin = animBrowserState.windows.animWin;
    const skinWin = animBrowserState.windows.skinWin;

    if (animWin && spriteSpine._animationNames) {
      animWin.setItems(spriteSpine._animationNames);
    }
    if (skinWin && spriteSpine._skinNames) {
      skinWin.setItems(spriteSpine._skinNames);
    }
    return true;
  }

  function updateAnimBrowser() {
    if (!animBrowserState.active) return;
    const state = animBrowserState;

    const picture = $gameScreen.picture(state.pictureId);
    if (!picture) {
      cleanupAnimBrowser();
      return;
    }

    const spine = getSpine(state.pictureId);
    if (!spine) {
      state.waitFrames++;
      if (state.maxWait && state.waitFrames > state.maxWait) {
        cleanupAnimBrowser();
      }
      return;
    }

    if (state.spineRef !== spine) {
      state.spineRef = spine;
      state.skeletonApplied = false;
    }
    state.waitFrames = 0;

    // スケルトン適用
    if (!state.skeletonApplied && state.config) {
      try {
        spine.setSkeleton(state.config.skeletonName);
        spine.setScale(1.0, 1.0);
        state.skeletonApplied = true;
      } catch (error) {
        console.error("[OnspineCALL] animBrowser skeleton error:", error);
        cleanupAnimBrowser();
        return;
      }
    }

    // ウィンドウ未作成なら作成
    if (!state.windows.animWin) {
      createAnimBrowserWindows();
    }

    // リスト未投入ならSprite_Spineからデータ取得を試行
    if (!state.spriteSpine) {
      populateAnimBrowserLists();
    }

    // Ctrl+C: 最後にクリックしたアニメ名またはスキン名をコピー
    if (Input.isPressed("control") && Input.isPressed("copy") && !state.lastCopyPressed) {
      const text = state.lastClickedItem || "";
      if (text) {
        navigator.clipboard?.writeText(text).then(() => {
          showToast(`"${text}" をコピーしました`);
        }).catch(() => {
          showToast(`"${text}" をコピーしました`);
        });
      }
      state.lastCopyPressed = true;
    } else if (!Input.isPressed("control") || !Input.isPressed("copy")) {
      state.lastCopyPressed = false;
    }

    // Escキー: 終了
    if (Input.isTriggered("cancel")) {
      cleanupAnimBrowser();
      return;
    }

    // A/T/Sキー: ウィンドウの表示/非表示切替え
    const toggleWin = (key, win) => {
      if (Input.isTriggered(key) && win) {
        win.visible = !win.visible;
        if (!win.visible && win.active) {
          win.deactivate();
        }
      }
    };
    toggleWin("animToggle", state.windows.animWin);
    toggleWin("trackToggle", state.windows.trackWin);
    toggleWin("skinToggle", state.windows.skinWin);

    // クリックでウィンドウ自動フォーカス切替
    if (TouchInput.isTriggered()) {
      const tx = TouchInput.x;
      const ty = TouchInput.y;
      const wins = [state.windows.trackWin, state.windows.animWin, state.windows.skinWin];
      for (const win of wins) {
        if (!win || !win.visible) continue;
        if (tx >= win.x && tx < win.x + win.width && ty >= win.y && ty < win.y + win.height) {
          if (!win.active) {
            for (const w of wins) { if (w) w.deactivate(); }
            win.activate();
          }
          break;
        }
      }
    }

    // Tab: ウィンドウ間のフォーカス切替
    if (Input.isTriggered("tab")) {
      const wins = [state.windows.animWin, state.windows.trackWin, state.windows.skinWin];
      const activeIdx = wins.findIndex(w => w && w.active);
      const nextIdx = (activeIdx + 1) % wins.length;
      for (const w of wins) { if (w) w.deactivate(); }
      if (wins[nextIdx]) wins[nextIdx].activate();
    }
  }

  PluginManager.registerCommand(pluginName, "showAnimBrowser", (args) => {
    const pictureId = 21;
    const pictureName = args.pictureName || "test";
    const skeletonName = args.skeletonName || "UI";
    const x = Number(args.x || 400);
    const y = Number(args.y || 300);
    const scale = Math.max(0.1, Number(args.scalePercent || 100) / 100);

    cleanupAnimBrowser();

    animBrowserState.pictureId = pictureId;
    const resetAnimName = args.resetAnimName || "000";
    animBrowserState.config = { skeletonName, scale, resetAnimName };
    animBrowserState.waitFrames = 0;
    animBrowserState.maxWait = 600;
    animBrowserState.skeletonApplied = false;
    animBrowserState.active = true;

    $gameScreen.showPicture(pictureId, pictureName, 0, x, y, scale * 100, scale * 100, 255, 0);

    if (!Input.keyMapper[67]) Input.keyMapper[67] = "copy";
    if (!Input.keyMapper[9]) Input.keyMapper[9] = "tab";
    Input.keyMapper[65] = "animToggle";   // Aキー
    Input.keyMapper[84] = "trackToggle";  // Tキー
    Input.keyMapper[83] = "skinToggle";   // Sキー
  });

  // アニメ確認中は右クリック（キャンセル / コンテキストメニュー）を無効化
  const _TouchInput_isCancelled = TouchInput.isCancelled;
  TouchInput.isCancelled = function() {
    if (animBrowserState.active) return false;
    return _TouchInput_isCancelled.call(this);
  };
  const _animBrowser_onContextMenu = function(e) {
    if (animBrowserState.active) e.preventDefault();
  };
  document.addEventListener("contextmenu", _animBrowser_onContextMenu);

  // SceneManager.updateMain にフック（showTestSpineと共存）
  if (!SceneManager.updateMain._OnspineCALL_animBrowser) {
    const _prev_updateMain_animBrowser = SceneManager.updateMain;
    SceneManager.updateMain = function() {
      _prev_updateMain_animBrowser.call(this);
      updateAnimBrowser();
    };
    SceneManager.updateMain._OnspineCALL_animBrowser = true;
  }

})();

(() => {
  if (typeof Sprite_Spine === "undefined" || !Sprite_Spine.prototype.onEvent)
    return;
  const _OnspineCALL_Sprite_Spine_onEvent = Sprite_Spine.prototype.onEvent;
  Sprite_Spine.prototype.onEvent = function (entry, event) {
    _OnspineCALL_Sprite_Spine_onEvent.call(this, entry, event);
    if (this._isRestore) return;
    if (!event) return;
    if (!event._commonEventsParsed) {
      event._commonEventsParsed = true;
      const list = [];
      const raw = (event.stringValue || event.data?.stringValue || "").replace(
        / +/g,
        ""
      );
      if (raw) {
        for (const part of raw.split(/,/)) {
          if (part.match(/^CE:(\d+)$/i)) {
            const id = Number(RegExp.$1);
            if (id > 0 && !$dataCommonEvents[id]) {
            }
            if (id > 0) list.push(id);
          }
        }
      }
      event._commonEventIds = list;
    }
    if (Array.isArray(event._commonEventIds)) {
      for (const id of event._commonEventIds) {
        if (id > 0 && $dataCommonEvents[id]) {
          const interpreter = new Game_Interpreter();
          interpreter.setup($dataCommonEvents[id].list, 0);

          if (!$gameMap._parallelCommonEventInterpreters) {
            $gameMap._parallelCommonEventInterpreters = [];
          }
          $gameMap._parallelCommonEventInterpreters.push(interpreter);
        }
      }
    }
  };

  const _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function (sceneActive) {
    _Game_Map_update.call(this, sceneActive);

    if (this._parallelCommonEventInterpreters) {
      for (
        let i = this._parallelCommonEventInterpreters.length - 1;
        i >= 0;
        i--
      ) {
        const interpreter = this._parallelCommonEventInterpreters[i];
        interpreter.update();

        if (!interpreter.isRunning()) {
          this._parallelCommonEventInterpreters.splice(i, 1);
        }
      }
    }
  };
})();
