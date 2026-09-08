//=============================================================================
// OnevASSISTANT.js
// RPGツクールMZ用ゲーム作成支援プラグイン
//=============================================================================
/* このソフトウェアの一部にMITライセンス、ならびにBSDライセンスで配布されている製作物が含まれています。
   https://raw.github.com/danro/easing-js/master/LICENSE
 */

/*:
 * @target MZ
 * @plugindesc ゲーム作成支援プラグイン 
 * @author Onmoremind
 * 
 * @param TitleSettings
 * @text タイトル設定
 * @type struct<TitleSettings>
 * @desc タイトル画面に関する設定
 *
 * @param UIConfigs
 * @text UI設定リスト 
 * @type struct<UIConfig>[]
 * @desc 呼び出し可能な独自UIの設定一覧
 *
 * @param ADMINSettings
 * @text 呼出しコモンイベント管理
 * @type struct<ADMINSettings>
 * @desc イベントの呼出し管理設定
 *
 * @param CgGroupConfig
 * @text CG設定
 * @type struct<CgGroup>
 * @desc CG変遷設定
 *
 * @param BackgroundSettings
 * @text 背景設定
 * @type struct<BackgroundSettings>
 * @desc 背景の切り替えや表示に関する設定
 * 
 * @param ChoiceIndexVariableId
 * @text 選択肢index変数
 * @type variable
 * @desc 選択肢のインデックスを格納する変数ID
 * @default 0
 * 
 * @param FadeTimeVariableId
 * @text フェード時間変数ID
 * @type variable
 * @desc ここで指定した変数の値をフェード系のフレーム数として共有使用
 * @default 0
 * 
 * @param RecollectionSettings
 * @text 回想シーン設定
 * @type struct<RecollectionSettings>
 * @desc 回想シーンに関する設定
 *
 * @param ChatLogSettings
 * @text チャットログ設定
 * @type struct<ChatLogSettings>
 * @desc チャットログ表示に関する各種設定
 *
 * @param OptionCommands
 * @text オプション項目設定
 * @type struct<OptionCommandSet>
 * @desc 各オプション項目の初期値と表示可否のセット
 *
 * @param EnabledSizes
 * @text 有効サイズリスト
 * @type number[]
 * @default ["0", "1", "2", "3", "4"]
 * @desc オプション画面で選択可能な画面サイズの番号リスト
 *
 * @param disablePointer
 * @text ポインタを無効化
 * @type boolean
 * @default true
 * @desc true の場合、タップによる移動先の点滅のONOFF
 * 
 * @param MoveSwitch
 * @text 移動禁止スイッチ
 * @desc 移動を制御するためのスイッチ
 * @type switch
 * @default 10
 * 
 * @param Presets
 * @text フキダシプリセット一覧
 * @type struct<Preset>[]
 * @default []
 * @desc 設定を保存して名前で呼出可
 *
 * @param OnomatopoeiaPresets
 * @text オノマトペプリセット一覧
 * @type struct<OnomatopoeiaFullPreset>[]
 * @default []
 * @desc ID指定で呼び出し可能なオノマトペプリセット
 * 
 * @help
 * スクリプトコマンド:
 *   OnevASSISTANT.saveCurrentBgm();          回想シーンに入る前のBGMを保存
 *   OnevASSISTANT.resetTriggers();  　　　　　実行フラグをクリアして再実行可能にする
 *   OnevASSISTANT.resetLastClickedChoice();  最後にクリックした選択肢をリセット
 *   OnevASSISTANT.completeCommonEvent();     呼び出した選択肢のコモンイベントを再開するscript。
 *   <NoStop>　                               StopEvent が有効な選択肢があっても停止しないようにする
 * 　　　　　　　　　　　　　　　　　　　　　　　 イベントのメモ欄に記述
 * 
 *   toggleFullScreen()                       フルスクリーン状態をトグルで切り替える
 *   changeWindowSize(n)                      サイズを対応した番号に変更
 *
 * サイズ番号一覧:
 *   0 : 816  * 624
 *   1 : 1024 * 576
 *   2 : 1280 * 720
 *   3 : 1600 * 900
 *   4 : 1920 * 1080
 * 
 * イージングパターンは以下のサイトを参照してください。
 * http://easings.net/ja
 * 
 * 
 *
 * 利用規約：
 *  プラグイン作者に無断で使用、改変、再配布は不可。
 *
 * @command UI操作
 * @text UI操作
 * @desc UIを表示または消去
 *
 * @arg action
 * @text 操作
 * @type select
 * @option 表示
 * @option 消去
 * @option 全消去
 * @option 全非表示
 * @option 再表示
 * @default 表示
 *
 * @arg name
 * @text UI名
 * @desc 表示するUIの名前
 * @type string
 *
 * @command CustomCommonEvent
 * @text カスタムコモンイベント
 * @desc 指定したコモンイベントを呼出
 *
 * @arg name
 * @text カスタム名
 * @type string
 * @desc イベントトリガーのカスタム名
 *
 * @command CharacterAppearance
 * @text キャラクター出現
 * @desc キャラを出現
 *
 * @arg mode
 * @text 出現方法
 * @type select
 * @option 通常出現
 * @option 右から登場
 * @option 左から登場
 * @option 下から登場
 * @option 上から登場
 * @desc キャラをどう出現させるかを選択
 *
 * @arg name
 * @text キャラ識別名
 * @type string
 *
 * @arg layers
 * @text レイヤー構成
 * @type struct<LayerItem>[]
 * @desc レイヤー名・画像・優先度のリスト 
 *
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 20
 *
 * @arg scale
 * @text 拡大率(%)
 * @type number
 * @min 1
 * @max 400
 * @default 100
 *
 * @arg useVariable
 * @text 座標を変数IDで指定
 * @type boolean
 * @default false
 *
 * @arg x
 * @text X座標
 * @type number
 * @default 0
 * @desc 座標を変数IDで指定した場合は変数IDを指定
 *
 * @arg y
 * @text Y座標
 * @type number
 * @default 0
 * @desc 座標を変数IDで指定した場合は変数IDを指定
 *
 * @arg fade
 * @text フェード時間(frame)
 * @type number
 * @default 
 * 
 * @arg flip
 * @text 左右反転
 * @type boolean
 * @default false
 * @desc キャラクター画像を左右反転させるかどうか
 *
 * @arg easing
 * @text イージング種別
 * @type select
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default linear
 *
 * @command ChangeLayers
 * @text パーツ差し替え
 * @desc 指定したキャラのパーツ差替
 *
 * @arg name
 * @text キャラ識別名
 * @type string
 *
 * @arg layers
 * @text 差し替えレイヤー
 * @type struct<LayerPartItem>[]
 * @desc 置き換えたいレイヤーの配列
 *
 * @arg fade
 * @text フェード時間(frame)
 * @type number
 *
 * @command MoveCharacter
 * @text キャラ移動
 * @desc キャラクターを指定座標に移動させる
 *
 * @arg name
 * @text キャラ識別名
 * @desc 移動させるキャラクターの識別名
 * @type string
 *
 * @arg x
 * @text X座標
 * @desc 目標のX座標
 * @type number
 * @min -9999
 * @max 9999
 *
 * @arg y
 * @text Y座標
 * @desc 目標のY座標
 * @type number
 * @min -9999
 * @max 9999
 *
 * @arg scale
 * @text 拡大率(%)
 * @type number
 * @min 1
 * @max 400
 * @default 100
 *
 * @arg duration
 * @text 移動時間
 * @desc 移動にかけるフレーム数
 * @type number
 * @default 30
 *
 * @arg loops
 * @type number
 * @default 1
 * @text ループ回数（移動は1固定推奨）
 * @desc 基本は1を推奨（2以上や0は効果オーバーレイのみループし、位置の移動は1回で完了します）。
 *
 * @arg easing
 * @type select
 * @text イージング種別
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default easeInOutSine
 *
 * @arg effectSettings
 * @text 追加エフェクト設定
 * @type struct<EffectSettings>
 * @desc 簡易効果合成
 *
 * @command モーション
 * @text キャラモーション実行
 * @desc モーションを適用
 *
 * @arg name
 * @type string
 * @text キャラ識別名
 *
 * @arg motion
 * @type select
 * @text モーション名
 * @option うなずく
 * @option 二回うなずく
 * @option 否定
 * @option ジャンプ
 * @option 笑う
 * @option 怒る
 * @option none(簡易効果のみ用)
 * @option モーション解除（無限ループ停止）
 * @desc 実行するモーションの種類
 *
 * @arg duration
 * @type number
 * @default 24
 * @text モーション時間
 *
 * @arg animationSettings
 * @text アニメーション設定
 * @type struct<AnimationSettings>
 * @desc ループ回数とループ間ウェイトの設定（空の場合は1回実行）
 *
 * @arg amplitude
 * @type number
 * @default 0
 * @text 動作の大きさ（振れ幅）
 * @desc モーションの強さ
 *
 * @arg easing
 * @type select
 * @text イージング種別
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default linear
 * @desc モーションの速度変化の種類を選択してください。
 *
 * @arg effectSettings
 * @text 追加エフェクト設定
 * @type struct<EffectSettings>
 * @desc 簡易効果合成
 *
 * @command CharacterExit
 * @text キャラクター退場
 * @desc キャラクターを退場させる
 *
 * @arg mode
 * @text 退場方法
 * @type select
 * @option 通常退場
 * @option 右に消える
 * @option 左に消える
 * @option 上に消える
 * @option 下に消える
 *
 * @arg name
 * @text キャラ識別名
 * @type string
 *
 * @arg duration
 * @text 退場時間
 * @type number
 * @default 30
 *
 * @arg easing
 * @text イージング種別
 * @type select
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default linear
 *
 * @command CG処理
 * @text CG処理
 * @desc 呼出、進行、消去を選択
 *
 * @arg mode
 * @text モード
 * @type select
 * @option 呼出
 * @option 進行
 * @option 消去
 * @desc 実行したい操作を選択
 * @default 呼出
 *
 * @arg label
 * @text シーン名
 * @type string
 * @desc パラメーターで指定したシーン名
 * @default
 *
 * @arg index
 * @text 進行番号
 * @type number
 * @min 0
 * @desc 省略で順送り
 * @default
 *
 * @arg ruleImage
 * @text ルール画像
 * @type file
 * @dir img/system
 * @desc クランジション用ルール画像指定（省略可）
 * @default
 *
 * @command ピクチャにマスク適用
 * @text ピクチャにマスク適用
 * @desc 指定したピクチャIDにマスク画像を適用
 *
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @min 1
 * @desc マスクを適用したいピクチャID
 *
 * @arg maskPictureId
 * @text マスクピクチャID
 * @type number
 * @min 1
 * @desc マスク画像を表示するピクチャID
 *
 * @arg maskImage
 * @text マスク画像
 * @type file
 * @dir img/pictures/
 *
 * @command ピクチャのマスク解除
 * @text ピクチャのマスク解除
 * @desc 指定したピクチャIDのマスクを解除（-1で全マスク解除）
 *
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @min -1
 * @default 1
 * @desc マスクを解除したいピクチャID（-1で全てのマスクを解除）
 *
 * @arg eraseMaskPicture
 * @text マスク画像を消去
 * @type boolean
 * @default true
 * @desc マスク解除時にマスク用ピクチャも消去するか
 *
 * @command setImageChoices
 * @text 画像選択肢設定
 * @desc struct<Choicecommand>[] を使って選択肢を登録します
 *
 * @arg choices
 * @type struct<Choicecommand>[]
 * @text 選択肢リスト
 * @desc 画像と選択肢名のセットを配列で入力
 *
 * @arg enableDPad
 * @text 十字キー操作許可
 * @type boolean
 * @default true
 * @desc true: 十字キーとマウス両方で操作可 / false: マウスのみ
 *
 * @command リング選択肢
 * @text リング選択肢
 * @desc 土台画像と選択肢画像を円配置で表示
 *
 * @arg 仮想選択肢数
 * @text 仮想選択肢数
 * @type number
 * @min 0
 * @max 999
 * @default 0
 * @desc 円運動の分割数
 *
 * @arg 一周回転
 * @text 一周回転
 * @type boolean
 * @default true
 * @desc 選択肢を一周回転させるかどうか
 *
 * @arg 変数で指定
 * @text 変数で指定
 * @type boolean
 * @default false
 * @desc 座標を変数から取得するかどうか
 *
 * @arg X軸
 * @text X軸
 * @type number
 * @default 0
 * @desc 中心のX座標
 *
 * @arg Y軸
 * @text Y軸
 * @type number
 * @default 0
 * @desc 中心のY座標
 *
 * @arg 土台画像
 * @text 土台画像
 * @type file
 * @dir img/UI/
 * @desc 背景に表示する土台画像
 *
 * @arg 選択肢リスト
 * @text 選択肢リスト
 * @type struct<RingChoice>[]
 * @desc 画像とコモンイベントをセットで登録
 *
 * @arg リング選択肢オフセットX
 * @text リング選択肢オフセットX
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 土台画像の中心からのXオフセット
 *
 * @arg リング選択肢オフセットY
 * @text リング選択肢オフセットY
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 土台画像の中心からのYオフセット
 * 
 * @arg 選択音
 * @text 選択音
 * @type struct<CursorSelectSe>
 * @desc カーソル移動時に再生する効果音
 *
 * @arg 決定音
 * @text 決定音
 * @type struct<CursorOkSe>
 * @desc 決定時に再生する効果音
 *
 * @arg 初期選択インデックス変数
 * @text 初期選択インデックス変数
 * @type variable
 * @desc 最初に選択状態にする画像のインデックスを格納した変数番号
 * @default 0
 *
 * @arg 初期角度
 * @text 初期角度
 * @type number
 * @default 0
 * @desc 円配置の開始角度（度数、0=右、90=下、180=左、270=上）
 *
 * @arg 円の大きさ
 * @text 円の大きさ
 * @type number
 * @default 100
 * @desc 選択肢を配置する円の半径
 *
 * @arg イージングタイプ
 * @text イージングタイプ
 * @type select
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default easeOutQuad
 * @desc 移動アニメーションの速度変化の種類
 *
 * @arg 移動時間
 * @text 移動時間
 * @type number
 * @default 24
 * @desc 移動アニメーションにかけるフレーム数
 *
 * @arg 拡大表示
 * @text 拡大表示
 * @type boolean
 * @default true
 * @desc 選択中の画像を拡大表示するかどうか
 *
 * @arg キャンセル動作
 * @text キャンセル動作
 * @type select
 * @option 終了
 * @option index0に戻る
 * @default 終了
 * @desc キャンセルキーを押した時の動作
 *
 * @arg マスク画像
 * @text マスク画像
 * @type file
 * @dir img/UI/
 * @desc 表示範囲を制限するマスク画像
 *
 * @command CallRecollection
 * @text 回想呼出し
 * @desc 回想シーン呼出し
 *
 * @command 背景処理
 * @text 背景処理
 * @desc 背景の変遷を管理
 *
 * @arg mode
 * @text モード
 * @type select
 * @option 背景呼出
 * @option 背景変更
 * @option 時間経過
 * @option 背景消去
 * @desc 背景処理選択
 *
 * @arg place
 * @text 場所名
 * @type string
 * @desc 呼出しに使用する名前
 * @default
 *
 * @arg time
 * @text 時間帯
 * @type select
 * @option 朝
 * @option 夕方
 * @option 夜
 * @option なし
 * @desc 時間帯を選択。
 * @default なし
 *
 * @arg ruleImage
 * @text ルール画像（任意）
 * @type file
 * @dir img/system
 * @desc 背景トランジションに使用するルール画像
 * @default
 *
 * @arg duration
 * @text 変遷フレーム数
 * @type number
 * @min 1
 * @max 999
 * @desc 完了するまでのフレーム数
 * @default 60
 * 
 * @command 背景フィルター制御
 * @text 背景フィルター制御
 * @desc フィルターをかけるか解除するかを選択
 *
 * @arg action
 * @text 操作
 * @type select
 * @option 適用
 * @option 解除
 * @default 適用
 * @desc フィルターを適用するか解除するかを選択
 *
 * @arg color
 * @text フィルター色
 * @type string
 * @default #000000
 * @desc カラーコードで指定
 *       フィルターの色を消す場合はresetかリセットを指定
 *
 * @arg opacity
 * @text 透明度
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @command RuleFade
 * @text フェード機能
 *
 * @arg type
 * @text 処理タイプ
 * @type select
 * @option フェードアウト
 * @value out
 * @option フェードイン
 * @value in
 * @default out
 *
 * @arg ruleImage
 * @text ルール画像
 * @type file
 * @dir img/system
 * @default mask_Dissolve
 *
 * @arg duration
 * @text フェード時間
 * @type number
 * @min 1
 * @default 
 * @desc 空欄の場合、フェード時間変数IDで指定した変数の値を使用
 * 　　　　指定した場合はその値をフレーム数として使用
 *
 * @arg reverseDirection
 * @text 方向反転
 * @type boolean
 * @default false
 * @desc true でマスクの進行を左右反転
 *
 * @arg transferMapId
 * @text 移動先マップID
 * @type number
 * @min 0
 * @default 0
 * @desc フェードアウト完了時に移動するマップID（0で移動なし）
 *
 * @arg transferX
 * @text 移動先X座標
 * @type number
 * @default 0
 * @desc マップ移動時のX座標
 *
 * @arg transferY
 * @text 移動先Y座標
 * @type number
 * @default 0
 * @desc マップ移動時のY座標
 *
 * @arg transferDirection
 * @text 移動後の向き
 * @type select
 * @option そのまま
 * @value 0
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @option 上
 * @value 8
 * @default 0
 * @desc マップ移動後のプレイヤーの向き
 *
 * @command SET_FADE_COLOR
 * @text フェードカラー設定
 * @desc フェードで使うカラーを設定
 *
 * @arg color
 * @text フェードカラー
 * @type string
 * @default #
 * @desc #000000,
 *
 * @command CLEAR_FADE_COLOR
 * @text フェードカラー解除
 * @desc カラー指定を黒に戻す
 * 
 * @command crossFadeBgm
 * @text クロスフェードBGM 
 * @desc 指定したBGMと現在のBGMをクロスフェードで切り替え
 *
 * @arg name
 * @text BGM名
 * @desc 再生するBGMのファイル名
 * @type file
 * @dir audio/bgm
 *
 * @arg volume
 * @text 音量
 * @desc 再生するBGMの音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @arg pitch
 * @text ピッチ
 * @desc 再生するBGMのピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @arg pan
 * @text 位相
 * @desc 再生するBGMの左右バランス
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @arg fadeTime
 * @text フェード時間
 * @type number
 * @default 2000
 * 
 * @command ChatLog
 * @text ログ
 * @desc チャットログ操作
 *
 * @arg action
 * @text 処理内容
 * @type select
 * @option 左にログを追加
 * @option 右にログを追加
 * @option ログをクリア
 * @default 左にログを追加
 *
 * @arg message
 * @text 表示メッセージ
 * @desc 表示するテキスト（ログ追加時のみ有効）
 * @type string
 * @default
 *
 * @arg fontColor
 * @text フォントカラー
 * @desc 0～31 の色番号（未指定でデフォルト色）
 * @type number
 * @min 0
 * @max 31
 *
 * @arg voiceName
 * @text ボイス名
 * @desc 再生するボイスのファイル名
 * @type file
 * @dir audio/voice
 * @default
 *
 * @arg voiceVolume
 * @text ボイス音量
 * @desc 0～100（未指定で Config のボイス音量 or 100）
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @arg voicePitch
 * @text ボイスピッチ
 * @desc 50～150（未指定で 100）
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @arg voicePan
 * @text ボイス位相
 * @desc -100～100（未指定で 0）
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @arg stopCurrentVoice
 * @text 既存ボイスを停止
 * @desc 再生前に現在のボイスを停止するか
 * @type boolean
 * @default true
 *
 * @command ChatStamp
 * @text スタンプ
 * @desc チャットログにスタンプを追加
 *
 * @arg side
 * @text 表示位置
 * @desc スタンプを表示する位置
 * @type select
 * @option 左
 * @option 右
 * @default 左
 *
 * @arg stampName
 * @text スタンプ画像名
 * @desc 使用するピクチャ
 * @type file
 * @dir img/pictures
 *
 * @arg width
 * @text 幅
 * @desc スタンプの表示幅
 * @type number
 * @default 0
 * @min 0
 *
 * @arg height
 * @text 高さ
 * @desc スタンプの表示高さ
 * @type number
 * @default 0
 * @min 0
 * 
 * @arg commonEventId
 * @text コモンイベントID
 * @desc クリックで呼び出すコモンイベント
 * @type common_event
 * @default 0
 *
 * @command ChatWindow
 * @text チャットウィンドウ設定
 * @desc チャットログウィンドウの位置やサイズ、不透明度を変更
 *
 * @arg x
 * @text X座標
 * @type number
 * @default 0
 *
 * @arg y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @arg width
 * @text 幅
 * @type number
 * @default 480
 *
 * @arg height
 * @text 高さ
 * @type number
 * @default 216
 *
 * @arg opacity
 * @text 不透明度
 * @desc 0で完全透明、255で不透明
 * @type number
 * @default 255
 * @max 255
 * @min 0
 *
 * @arg paddingTop
 * @text 上余白
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg paddingBottom
 * @text 下余白
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg paddingLeft
 * @text 左余白
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg paddingRight
 * @text 右余白
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg lineSpacing
 * @text 行間
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg fontSize
 * @text フォントサイズ
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg iconSize
 * @text アイコンサイズ
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg scrollAmount
 * @text スクロール量
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg defaultStampWidth
 * @text デフォルトスタンプ幅
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg defaultStampHeight
 * @text デフォルトスタンプ高さ
 * @type number
 * @default -1
 * @desc -1で変更しない
 *
 * @arg customBackgroundImage
 * @text カスタム背景画像
 * @type file
 * @dir img/pictures
 * @desc 背景画像を指定。空欄で変更しない
 *
 * @arg fontName
 * @text 使用フォント名
 * @type string
 * @desc 空欄で変更しない
 * 
 * @command show
 * @text フキダシ表示
 * @desc 独自ウィンドウを生成、文章の表示と同じ使い方が可能
 * @arg id
 * @type number 
 * @min 1 
 * @default 1
 * 
 * @arg text
 * @text 文章
 * @type note 
 * @default
 * 
 * @arg x
 * @type number 
 * @default 0
 * 
 * @arg y
 * @type number 
 * @default 0
 * 
 * @arg anchorX
 * @text 基点
 * @type select
 * @option 左 
 * @value left
 * @option 中央 
 * @value center
 * @option 右 
 * @value right
 * @default left
 * 
 * @arg background
 * @text 背景
 * @type select
 * @option 通常 
 * @value window
 * @option 透明 
 * @value transparent
 * @default window
 * 
 * @arg opacity
 * @text ウィンドウ不透明度
 * @type number 
 * @min 0 
 * @max 255 
 * @default 255
 * 
 * @arg backOpacity
 * @text 背景不透明度
 * @type number 
 * @min 0 
 * @max 255 
 * @default 192
 * 
 * @arg padding
 * @text 余白
 * @desc -1でデフォルト設定
 * @type number 
 * @min -1 
 * @default -1
 * 
 * @arg fontSize
 * @text フォントサイズ
 * @desc 0の場合systemの値を使用
 * @type number 
 * @min 0 
 * @default 0
 * 
 * @arg fontColor
 * @text 文字色
 * @type string 
 * @default
 * @desc window.pngの番号色や#00000で指定
 * 
 * @arg outlineColor
 * @text アウトライン色
 * @type string 
 * @default
 * @desc 空白ならアウトライン無し
 * アウトライン使用の場合はwindow.pngの番号色や#00000で指定
 * 
 * @arg outlineWidth
 * @text アウトライン太さ
 * @type number
 * @min 0
 * @default 4
 * @desc 文章表示中のアウトライン太さ。\ow[値] で文中変更可
 * 
 * @arg windowskin
 * @text ウィンドウスキン
 * @type file 
 * @dir img/system/ 
 * @default
 * 
 * @arg waitInput
 * @text 入力待ちをする
 * @type boolean 
 * @on 待つ 
 * @off 待たない 
 * @default false
 * 
 * @arg closeOnConfirm
 * @text 入力後に閉じる
 * @type boolean 
 * @on 閉じる 
 * @off 閉じない 
 * @default false
 *
 * @arg tailImage
 * @text テール画像
 * @type file 
 * @dir img/system/ 
 * @default
 * 
 * @arg tailPosition
 * @text テール配置
 * @type select
 * @option なし 
 * @value none
 * @option 左上 
 * @value lt
 * @option 中央上 
 * @value ct
 * @option 右上 
 * @value rt
 * @option 左下 
 * @value lb
 * @option 中央下 
 * @value cb
 * @option 右下 
 * @value rb
 * @default none
 * 
 * @arg tailOffsetX
 * @text テールX補正
 * @type number 
 * @min -9999 
 * @max 9999 
 * @default 0
 * 
 * @arg tailOffsetY
 * @text テールY補正
 * @type number 
 * @min -9999 
 * @max 9999 
 * @default 0
 *
 * @command showPreset
 * @text フキダシプリセット
 * @desc プリセットの設定を使用
 * 
 * @arg id
 * @type number 
 * @min 1 
 * @default 1
 * 
 * @arg presetName
 * @text 使用設定名
 * @type string @default
 * 
 * @arg text
 * @text 文章
 * @type note 
 * @default
 * 
 * @arg waitInput
 * @text 入力待ちをする
 * @type boolean 
 * @on 待つ 
 * @off 待たない 
 * @default false
 * 
 * @arg closeOnConfirm
 * @text 入力後に閉じる
 * @type boolean 
 * @on 閉じる 
 * @off 閉じない 
 * @default false
 *
 * @command setText
 * @text 文章差し替え
 * @desc 指定したIDの文章差替
 * @arg id
 * @type number 
 * @min 1 
 * @default 1
 * @arg text
 * @type note 
 * @default
 * @arg waitInput
 * @text 入力待ち（イベント停止）
 * @type boolean 
 * @on 待つ 
 * @off 待たない 
 * @default false
 * @arg closeOnConfirm
 * @text 入力後に閉じる
 * @type boolean 
 * @on 閉じる 
 * @off 閉じない 
 * @default false
 * 
 * @command close
 * @text 全フキダシ終了
 * @arg id
 * @type number 
 * @min -1 
 * @default -1
 * 
 * @command オノマトペプリセット呼出
 * @text オノマトペプリセット呼出
 * @desc プリセットIDを指定してオノマトペを表示
 *
 * @arg presetId
 * @text プリセットID
 * @type string
 * @desc 呼び出すプリセットのID
 *
 * @arg overrideX
 * @text X座標上書き
 * @type number
 * @default -1
 * @desc -1以外を指定するとプリセットのX座標を上書き
 *
 * @arg overrideY
 * @text Y座標上書き
 * @type number
 * @default -1
 * @desc -1以外を指定するとプリセットのY座標を上書き
 *
 * @command オノマトペ表示
 * @text オノマトペ表示
 * @desc カスタムオノマトペを表示
 *
 * @arg id
 * @text オノマトペID
 * @type string
 * @desc オノマトペの識別ID（空白の場合は自動生成）
 *
 * @arg image
 * @text 画像ファイル名
 * @type file
 * @dir img/pictures/
 * @desc オノマトペ画像
 *
 * @arg positionSettings
 * @text 座標設定
 * @type struct<PositionSettings>
 * @desc 開始・終了座標とランダム幅の設定
 * 開始座標から終了座標に向かって移動する
 *
 * @arg scaleSettings
 * @text 拡大率設定
 * @type struct<ScaleSettings>
 * @desc 拡大率に関する詳細設定
 *
 * @arg opacitySettings
 * @text 透明度設定
 * @type struct<OpacitySettings>
 * @desc 透明度に関する設定
 *
 * @arg animationSettings
 * @text アニメーション設定
 * @type struct<AnimationSettings>
 * @desc 時間・ループ・イージングに関する設定
 * 
 * @arg effectSettings
 * @text 追加エフェクト設定
 * @type struct<EffectSettings>
 * @desc 簡易効果合成
 *
 * @arg seSettings
 * @text SE設定
 * @type struct<OnomatopoeiaSeSettings>
 * @desc オノマトペ表示時に再生するSE設定

 * @command オノマトペ表示(スプライトシート)
 * @text オノマトペ表示(スプライトシート)
 * @desc スプライト画像を使用したオノマトペ
 *
 * @arg id
 * @text オノマトペID
 * @type string
 * @desc オノマトペの識別ID
 *
 * @arg image
 * @text 画像ファイル名（スプライトシート）
 * @type file
 * @dir img/pictures/
 * @desc フレームが格子状に並んだスプライトシート画像
 *
 * @arg sheetSettings
 * @text シート設定
 * @type struct<OnomatopoeiaSpriteSheetSettings>
 * @desc フレーム切替に関する設定
 *
 * @arg positionSettings
 * @text 座標設定
 * @type struct<PositionSettings>
 * @desc 開始・終了座標とランダム幅の設定
 * 開始座標から終了座標に向かって移動する
 *
 * @arg scaleSettings
 * @text 拡大率設定
 * @type struct<ScaleSettings>
 * @desc 拡大率に関する詳細設定
 *
 * @arg opacitySettings
 * @text 透明度設定
 * @type struct<OpacitySettings>
 * @desc 透明度に関する設定
 *
 * @arg animationSettings
 * @text アニメーション設定
 * @type struct<AnimationSettings>
 * @desc 時間・ループ・イージングに関する設定
 * 
 * @arg effectSettings
 * @text 追加エフェクト設定
 * @type struct<EffectSettings>
 * @desc 簡易効果合成
 *
 * @arg seSettings
 * @text SE設定
 * @type struct<OnomatopoeiaSeSettings>
 * @desc オノマトペ表示時に再生するSE設定
 *
 * @command オノマトペ削除
 * @text オノマトペ削除
 * @desc 表示中のオノマトペを削除（フェード変数が0より大きければフェードアウト）
 *
 * @arg id
 * @text オノマトペID
 * @type string
 * @desc 削除するオノマトペのID（空白の場合は全削除）
 *
 */

/*~struct~PositionSettings:
 * @param startX
 * @text 開始座標X
 * @type number
 * @default 0
 * @desc イージング開始時のX座標
 *
 * @param startY
 * @text 開始座標Y
 * @type number
 * @default 0
 * @desc イージング開始時のY座標
 *
 * @param targetX
 * @text 終了座標X
 * @type number
 * @default 0
 * @desc イージング終了時のX座標
 *
 * @param targetY
 * @text 終了座標Y
 * @type number
 * @default 0
 * @desc イージング終了時のY座標
 *
 * @param rndX
 * @text 開始X座標ランダム加算幅
 * @type number
 * @default 0
 * @desc 開始時のX座標にランダムで加算する値の最大値
 * 例：100なら0～100内でランダム値を加算
 *
 * @param rndY
 * @text 開始Y座標ランダム加算幅
 * @type number
 * @default 0
 * @desc 開始時のY座標にランダムで加算する値の最大値
 * 例：100なら0～100内でランダム値を加算
 *
 * @param targetRndX
 * @text 終了X座標ランダム加算幅
 * @type number
 * @default 0
 * @desc 終了時のX座標にランダムで加算する値の最大値
 * 例：100なら0～100内でランダム値を加算
 *
 * @param targetRndY
 * @text 終了Y座標ランダム加算幅
 * @type number
 * @default 0
 * @desc 終了時のY座標にランダムで加算する値の最大値
 * 例：100なら0～100内でランダム値を加算
 *
 * @param rndOnLoop
 * @text ループ時のランダム値の再計算
 * @type boolean
 * @default true
 * @desc ループ時にランダム値を再計算するかどうか
 *
 * @param easingType
 * @text 座標イージングの種類
 * @type select
 * @default linear
 * @option linear
 * @option easeInQuad
 * @option easeOutQuad
 * @option easeInOutQuad
 * @option easeInCubic
 * @option easeOutCubic
 * @option easeInOutCubic
 * @option easeInQuart
 * @option easeOutQuart
 * @option easeInOutQuart
 * @option easeInQuint
 * @option easeOutQuint
 * @option easeInOutQuint
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 * @desc 座標移動用のイージングの種類
 */

/*~struct~ScaleSettings:
 * @param startScale
 * @text 開始拡大率
 * @type number
 * @default 100
 * @desc イージング開始時の拡大率（%）
 ※がついたイージングの際、基準拡大率と同じ値にする
 *
 * @param targetScale
 * @text 終了拡大率
 * @type number
 * @default 100
 * @desc イージング終了時の拡大率（%）
 ※がついたイージングの際、基準拡大率と同じ値にする
 *
 * @param easingType
 * @text 拡大率イージングの種類
 * @type select
 * @default linear
 * @option linear
 * @option easeInQuad
 * @option easeOutQuad
 * @option easeInOutQuad
 * @option easeInCubic
 * @option easeOutCubic
 * @option easeInOutCubic
 * @option easeInQuart
 * @option easeOutQuart
 * @option easeInOutQuart
 * @option easeInQuint
 * @option easeOutQuint
 * @option easeInOutQuint
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInElastic※
 * @option easeOutElastic※
 * @option easeInOutElastic※
 * @option easeInBack※
 * @option easeOutBack※
 * @option easeInOutBack※
 * @option easeInBounce※
 * @option easeOutBounce※
 * @option easeInOutBounce※
 * @desc 拡大率専用のイージングの種類
 *
 * @param baseScale
 * @text 基準拡大率
 * @type number
 * @default 100
 * @desc イージングの基準となる拡大率（%）
 *
 * @param maxScale
 * @text 最大拡大率
 * @type number
 * @default 100
 * @desc ＊がついたイージングの最大（最小）拡大率（％）
 *
 * @param minScale
 * @text 最小拡大率
 * @type number
 * @default 100
 * @desc ＊がついたイージングの最大（最小）拡大率（％）
 */

/*~struct~OpacitySettings:
 * @param startOpacity
 * @text 開始透明度
 * @type number
 * @default 255
 * @min 0
 * @max 255
 * @desc イージング開始時の透明度（0~255）
 *
 * @param targetOpacity
 * @text 終了透明度
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * @desc イージング終了時の透明度（0~255）
 *
 * @param easingType
 * @text 透明度イージングの種類
 * @type select
 * @default linear
 * @option linear
 * @option easeInQuad
 * @option easeOutQuad
 * @option easeInOutQuad
 * @option easeInCubic
 * @option easeOutCubic
 * @option easeInOutCubic
 * @option easeInQuart
 * @option easeOutQuart
 * @option easeInOutQuart
 * @option easeInQuint
 * @option easeOutQuint
 * @option easeInOutQuint
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 * @desc 透明度イージングの種類
 */

/*~struct~AnimationSettings:
 * @param duration
 * @text イージング時間
 * @type number
 * @default 60
 * @min 1
 * @desc イージングが完了するまでの時間（フレーム数）
 *
 * @param loops
 * @text ループ回数
 * @type number
 * @default 0
 * @min 0
 * @desc イージングのループ回数（0で無限ループ）
 *
 * @param loopWait
 * @text ループ間ウェイト
 * @type number
 * @default 0
 * @min 0
 * @desc ループとループの間の待機時間（フレーム数）
 */

/*~struct~EffectSettings:
 * @param type
 * @text 効果タイプ
 * @type select
 * @option none
 * @option shake
 * @option float
 * @option wave
 * @option bounce
 * @default none
 * @desc 追加エフェクトの種類
 *
 * @param ampX
 * @text 振幅X（px）
 * @type number
 * @min 0
 * @default 0
 * @desc 位置系効果のX方向振幅（shake/float/wave/bounce）
 *
 * @param ampY
 * @text 振幅Y（px）
 * @type number
 * @min 0
 * @default 0
 * @desc 位置系効果のY方向振幅（shake/float/wave/bounce）
 *
 *
 * @param speed
 * @text 速度
 * @type number
 * @decimals 2
 * @default 0.10
 * @desc sin/cosベース効果の進行速度（毎フレームの位相増分）
 *
 * @param decay
 * @text 減衰率
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0
 * @desc アニメ進行に伴う振幅の線形減衰（0～1）。1だと終了時に0になります。
 */

/*~struct~OnomatopoeiaSeSettings:
 * @param seList
 * @text SEリスト
 * @type struct<OnomatopoeiaSe>[]
 * @default []
 * @desc 再生するSEのリスト（複数登録時はランダムで1つ再生、空なら再生しない）
 *
 * @param playTiming
 * @text 再生タイミング
 * @type select
 * @option 表示開始時
 * @option ループ毎
 * @default 表示開始時
 * @desc SEを再生するタイミング
 */

/*~struct~OnomatopoeiaSe:
 * @param name
 * @text SEファイル名
 * @type file
 * @dir audio/se/
 * @desc 再生するSEファイル
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @desc SEの音量（0～100）
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @desc SEのピッチ（50～150）
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * @desc SEの位相（-100～100）
 */

/*~struct~OnomatopoeiaSpriteSheetSettings:
 * @param frameCols
 * @text 列数
 * @type number
 * @default 3
 * @desc スプライトシートの列数
 *
 * @param frameRows
 * @text 行数
 * @type number
 * @default 1
 * @desc スプライトシートの行数
 *
 * @param startIndex
 * @text 再生開始フレーム
 * @type number
 * @default 0
 * @desc 再生する最初のフレーム番号（0起算）
 *
 * @param endIndex
 * @text 再生終了フレーム
 * @type number
 * @default 2
 * @desc 再生する最後のフレーム番号（0起算）
 *
 * @param interval
 * @text 切替間隔(フレーム)
 * @type number
 * @default 6
 * @desc 何フレームごとに次フレームへ進めるか
 *
 * @param loopSheet
 * @text シートをループ再生
 * @type boolean
 * @default true
 * @desc true の場合、終了フレームまで到達すると開始フレームに戻り続ける
 *
 * @param pingPong
 * @text 往復再生（ピンポン）
 * @type boolean
 * @default false
 * @desc true の場合、端で反転して往復再生
 */

/*~struct~TitleSettings:
 * @param UseCustomTitle
 * @text 独自タイトルを使用する
 * @type boolean
 * @default false
 * @desc trueの場合は独自のタイトルを使用
 *
 * @param ShowGameTitle
 * @text ゲームタイトル表示
 * @type boolean
 * @default true
 * @desc 画面中央上部にゲームタイトルを表示するか
 *
 * @param BackgroundImage
 * @text 背景画像
 * @type file
 * @dir img/titles1/
 * @desc タイトル背景画像
 *
 * @param Choices
 * @text タイトル選択肢リスト
 * @type struct<VisualtitleChoiceItem>[]
 * @desc 表示されるタイトル選択肢の一覧
 *
 * @param ChoiceXBase
 * @text 選択肢X基準
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param ChoiceYBase
 * @text 選択肢Y基準
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param CursorConfig
 * @text カーソル設定
 * @type struct<titlecursorConfig>
 *
 * @param CursorSelectSE
 * @text カーソル移動SE
 * @type struct<CursorSelectSe>
 *
 * @param CursorOkSE
 * @text 決定SE
 * @type struct<CursorOkSe>
 *
 * @param TitleBGM
 * @text タイトルBGM
 * @type struct<BGM>
 *
 * @param DummyMapId
 * @text ダミーマップID
 * @type number
 * @min 1
 * @desc commonEvent 実行時に遷移するマップID
 * @default 1
 *
 * @param WindowTitleSuffix
 * @text ウィンドウタイトル追加文
 * @type string
 * @desc ウィンドウタイトルの右側に追加する文章（例: " - Ver 1.0"）
 * @default 
 */

/*~struct~UIConfig:
 * @param Name
 * @text UI名
 * @type string
 *
 * @param UIbaseSettings
 * @text UIbase設定
 * @type struct<UIbaseSettings>
 * @desc UIのドラッグbaseになる画像の設定
 *
 * @param ActiveSwitchIds
 * @text 有効化スイッチ
 * @type switch[]
 * @desc このUIが表示されている間ONになるスイッチID
 *
 * @param X
 * @text 全体X座標
 * @type number
 * @default 0
 *
 * @param Y
 * @text 全体Y座標
 * @type number
 * @default 0
 *
 * @param PictureId
 * @text 使用ピクチャID
 * @type number
 * @default 50
 *
 * @param ImageSprites
 * @text 画像スプライト一覧
 * @type struct<UIImageSprite>[]
 * @desc 静的または単一画像として表示するUIスプライト
 *
 * @param ChoiceSprites
 * @text 選択肢スプライト一覧
 * @type struct<UIChoiceSprite>[]
 * @desc コモンイベントなどを呼び出す画像選択ボタン一覧
 *
 * @param GaugeSprites
 * @text ゲージスプライト一覧
 * @type struct<UIGaugeSprite>[]
 * @desc ゲージに使用する画像
 *
 * @param NumberSprites
 * @text 数値スプライト一覧
 * @type struct<UINumberSprite>[]
 * @desc 変数に応じて数字をスプライトで表示する項目
 *
 * @param TextSprites
 * @text テキストスプライト一覧
 * @type struct<UITextSprite>[]
 * @desc 変数の値をテキストとして表示するスプライト一覧
 */

/*~struct~UIImageSprite:
 * @param Image
 * @text 表示画像
 * @type file
 * @dir img/UI
 *
 * @param OffsetX
 * @text Xオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param OffsetY
 * @text Yオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param ShowCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @default {"Conditions":"[]"}
 * @desc 表示条件（すべてAND評価）
 *
 * @param ProhibitCondition
 * @text 禁止条件
 * @type struct<ConditionConfig>
 * @default {"Conditions":"[]"}
 * @desc 禁止条件（満たすと非表示）
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UIImageTransitionEffect>
 * @default {"AppearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"StartScale\":\"100\",\"UseOffset\":\"false\",\"StartOffsetX\":\"0\",\"StartOffsetY\":\"0\",\"Easing\":\"easeOutQuad\"}","DisappearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"EndScale\":\"100\",\"UseOffset\":\"false\",\"EndOffsetX\":\"0\",\"EndOffsetY\":\"0\",\"Easing\":\"easeInQuad\"}"}
 * @desc 画像の出現・消去時の効果
 *
 * @param Priority
 * @text 表示優先度
 * @type number
 * @min 0
 * @default 0
 * @desc 数値が大きいほど手前に描画
 */

/*~struct~UIChoiceSprite:
 * @param Image
 * @text 表示画像
 * @type file
 * @dir img/UI
 * @desc ボタンとして表示される画像
 *
 * @param CommonEventId
 * @type common_event
 * @desc クリックしたときに呼び出されるコモンイベント
 *
 * @param X
 * @type number
 * @default 0
 *
 * @param Y
 * @type number
 * @default 0
 *
 * @param HoverEffect
 * @text ホバー効果
 * @type struct<UIHoverEffectConfig>
 * @desc ホバー効果
 *
 * @param HoverIndexNumber
 * @text ホバー時インデックス番号
 * @type number
 * @min 0
 * @default 0
 * @desc ホバー中に選択肢index変数に代入する数値（0で無効）
 *
 * @param IgnoreTransparent
 * @text 透明部分を判定から除外
 * @type boolean
 * @default true
 * @desc true: 画像の透明ピクセルはホバー/クリック判定に含めない / false: 透明部分も判定に含める
 *
 * @param ClickEffect
 * @text クリック効果
 * @type struct<UIClickEffectConfig>
 * @desc クリック時の演出効果
 *
 * @param ShowCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @default {"Conditions":"[]"}
 * @desc 表示条件
 *
 * @param EnableCondition
 * @text 有効条件
 * @type struct<ConditionConfig>
 * @default {"Conditions":"[]"}
 * @desc 有効条件
 *
 * @param DisabledImage
 * @text 無効時の画像
 * @type file
 * @dir img/UI
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UITransitionEffect>
 * @default {"AppearEffect":"{\"UseEffect\":\"false\",\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"StartScale\":\"100\",\"UseOffset\":\"false\",\"StartOffsetX\":\"0\",\"StartOffsetY\":\"0\",\"Easing\":\"easeOutQuad\"}","DisappearEffect":"{\"UseEffect\":\"false\",\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"EndScale\":\"100\",\"UseOffset\":\"false\",\"EndOffsetX\":\"0\",\"EndOffsetY\":\"0\",\"Easing\":\"easeInQuad\"}"}
 * @desc 選択肢の出現・消去時の演出効果
 *
 * @param StopEvent
 * @text イベント停止
 * @type boolean
 * @default false
 * @desc この選択肢が表示されたときにイベントを停止するかどうか
 *
 * @param ResumeOnClick
 * @text クリック時にイベント再開
 * @type boolean
 * @default false
 * @desc イベント停止の影響を受けるかどうか
 */

/*~struct~UITransitionEffect:
 *
 * @param AppearEffect
 * @text 出現時効果
 * @type struct<UIFadeAppearEffect>
 * @desc 選択肢が出現するときの効果
 *
 * @param DisappearEffect
 * @text 消去時効果
 * @type struct<UIFadeDisappearEffect>
 * @desc 選択肢が消去するときの効果
 */

/*~struct~UIFadeAppearEffect:
 *
 * @param UseEffect
 * @text 出現時効果を使用
 * @type boolean
 * @default true
 * @desc falseの場合は即座に表示
 *
 * @param StartDelay
 * @text 出現開始遅延（フレーム）
 * @type number
 * @default 0
 * @min 0
 * @desc 出現条件を満たしてから出現開始までの遅延
 *
 * @param FadeFrames
 * @text フレーム数
 * @type number
 * @default 5
 * @min 1
 *
 * @param StartScale
 * @text 開始拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると拡大効果が有効（フェード完了で100%）
 *
 * @param StartOffsetX
 * @text 開始X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param StartOffsetY
 * @text 開始Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param Easing
 * @text イージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutQuad
 * @desc 出現アニメーションのイージング
 */

/*~struct~UIFadeDisappearEffect:
 *
 * @param UseEffect
 * @text 消去時効果を使用
 * @type boolean
 * @default true
 * @desc falseの場合は即座に非表示
 *
 * @param StartDelay
 * @text 消去開始遅延（フレーム）
 * @type number
 * @default 0
 * @min 0
 * @desc 消去条件を満たしてから消去開始までの遅延
 *
 * @param FadeFrames
 * @text フレーム数
 * @type number
 * @default 5
 * @min 1
 *
 * @param EndScale
 * @text 終了拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると拡大効果が有効（100%から開始）
 *
 * @param EndOffsetX
 * @text 終了X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param EndOffsetY
 * @text 終了Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param Easing
 * @text イージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeInQuad
 * @desc 消去アニメーションのイージング
 */

/*~struct~UIImageFadeEffect:
 *
 * @param UseFade
 * @text フェードを使う
 * @type boolean
 * @default false
 *
 * @param AppearEffect
 * @text 出現時効果
 * @type struct<UIImageAppearEffect>
 * @desc 画像が出現するときの効果
 *
 * @param DisappearEffect
 * @text 消去時効果
 * @type struct<UIImageDisappearEffect>
 * @desc 画像が消去するときの効果
 */

/*~struct~UIImageAppearEffect:
 *
 * @param StartDelay
 * @text 出現開始遅延（フレーム）
 * @type number
 * @default 0
 * @min 0
 * @desc 出現条件を満たしてから出現開始までの遅延
 *
 * @param FadeFrames
 * @text フレーム数
 * @type number
 * @default 5
 * @min 1
 *
 * @param StartScale
 * @text 開始拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると拡大効果が有効（フェード完了で100%）
 *
 * @param StartOffsetX
 * @text 開始X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param StartOffsetY
 * @text 開始Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param Easing
 * @text イージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutQuad
 * @desc 出現アニメーションのイージング
 */

/*~struct~UIImageDisappearEffect:
 *
 * @param StartDelay
 * @text 消去開始遅延（フレーム）
 * @type number
 * @default 0
 * @min 0
 * @desc 消去条件を満たしてから消去開始までの遅延
 *
 * @param FadeFrames
 * @text フレーム数
 * @type number
 * @default 5
 * @min 1
 *
 * @param EndScale
 * @text 終了拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると拡大効果が有効（100%から開始）
 *
 * @param EndOffsetX
 * @text 終了X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param EndOffsetY
 * @text 終了Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると位置補正が有効
 *
 * @param Easing
 * @text イージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeInQuad
 * @desc 消去アニメーションのイージング
 */

/*~struct~UIHoverEffectConfig:
 *
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外の値を設定すると拡大が有効になります
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI/
 * @desc 画像を設定するとフレーム表示が有効になります
 *
 * @param SpriteSheet
 * @text スプライトシート設定
 * @type struct<UISpriteSheetConfig>
 * @default
 *
 * @param ExtraImageSetting
 * @text ホバー中表示画像
 * @type struct<UIHoverExtraImageConfig>[]
 * @default []
 *
 * @param HoverSE
 * @text ホバー時SE
 * @type struct<UIHoverSEConfig>
 * @desc ホバー時に再生するSE設定
 * @default
 *
 * @param HoverScript
 * @text ホバー時実行スクリプト
 * @type multiline_string
 * @desc ホバー時に実行するJavaScriptコード
 * @default
 *
 * @param KeepOriginalImage
 * @text ホバー時に元画像を表示
 * @type boolean
 * @default true
 * @desc ホバー時に元の表示画像を表示したままにするかどうか（false で非表示）
 *
 * @param EntryEasing
 * @text 拡大開始イージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutBack
 * @desc 拡大/移動アニメ開始時のイージング
 *
 * @param ExitEasing
 * @text 戻りイージング
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutExpo
 * @desc ホバー解除時の戻り挙動のイージング
 */

/*~struct~UIHoverSEConfig:
 *
 * @param name
 * @text SEファイル名
 * @type file
 * @dir audio/se/
 * @desc 再生するSEファイル
 * @default
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @desc SEの音量（0～100）
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @desc SEのピッチ（50～150）
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * @desc SEの位相（-100～100）
 */

/*~struct~UIClickEffectConfig:
 *
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外の値を設定すると拡大が有効になります
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI/
 * @desc 画像を設定するとフレーム表示が有効になります
 *
 * @param SpriteSheet
 * @text スプライトシート設定
 * @type struct<UISpriteSheetConfig>
 * @default
 *
 * @param ClickSE
 * @text クリック時SE
 * @type file
 * @dir audio/se/
 * @desc クリック時に再生するSEファイル
 * @default
 *
 * @param Duration
 * @text 効果時間（フレーム）
 * @type number
 * @default 15
 * @min 1
 * @desc クリック効果の継続フレーム数
 *
 * @param Easing
 * @text イージング（拡大時）
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutQuad
 * @desc クリック拡大アニメのイージング
 *
 * @param ExitEasing
 * @text イージング（戻り時）
 * @type select
 * @option Linear（一定） @value linear
 * @option QuadIn（加速開始） @value easeInQuad
 * @option QuadOut（減速終了） @value easeOutQuad
 * @option QuadInOut（加減速） @value easeInOutQuad
 * @option CubicIn @value easeInCubic
 * @option CubicOut @value easeOutCubic
 * @option CubicInOut @value easeInOutCubic
 * @option QuartIn @value easeInQuart
 * @option QuartOut @value easeOutQuart
 * @option QuartInOut @value easeInOutQuart
 * @option QuintIn @value easeInQuint
 * @option QuintOut @value easeOutQuint
 * @option QuintInOut @value easeInOutQuint
 * @option SineIn @value easeInSine
 * @option SineOut @value easeOutSine
 * @option SineInOut @value easeInOutSine
 * @option ExpoIn @value easeInExpo
 * @option ExpoOut @value easeOutExpo
 * @option ExpoInOut @value easeInOutExpo
 * @option CircIn @value easeInCirc
 * @option CircOut @value easeOutCirc
 * @option CircInOut @value easeInOutCirc
 * @option BackIn @value easeInBack
 * @option BackOut @value easeOutBack
 * @option BackInOut @value easeInOutBack
 * @option ElasticIn @value easeInElastic
 * @option ElasticOut @value easeOutElastic
 * @option ElasticInOut @value easeInOutElastic
 * @option BounceIn @value easeInBounce
 * @option BounceOut @value easeOutBounce
 * @option BounceInOut @value easeInOutBounce
 * @default easeOutQuad
 * @desc クリック戻りアニメのイージング
 */

/*~struct~UIbaseSettings:
 *
 * @param EnableSwitchId
 * @text 有効化スイッチID
 * @type switch
 * @desc このスイッチがONのときUI全体をドラッグで移動可能にする
 *
 * @param Baseimage
 * @text base画像
 * @type file
 * @dir img/UI/
 * @desc UIのbaseになるファイル名
 */

/*~struct~UIHoverExtraImageConfig:
 *
 * @param Image
 * @text 表示画像ファイル
 * @type file
 * @dir img/UI/
 * @desc ホバー中に表示する追加画像
 *
 * @param X
 * @text X座標
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param Y
 * @text Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param UseAbsolutePosition
 * @text 絶対座標を使用
 * @type boolean
 * @on 絶対座標
 * @off オフセット
 * @default false
 * @desc true=画面上の絶対座標、false=選択肢画像からのオフセット
 *
 * @param PictureId
 * @text ピクチャID（表示優先度）
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @desc 0=通常表示。0以外はピクチャレイヤーに配置（IDが大きいほど前面）
 *
 * @param ShowCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @default {"Conditions":"[]"}
 * @desc 画像を表示する条件（複数設定可能、すべてAND評価）
 *
 * @param HideOnHoverExit
 * @text ホバー解除時に非表示
 * @type boolean
 * @on 非表示にする
 * @off 表示を維持する
 * @default true
 * @desc ホバー解除時に画像を消すかどうか
 */

/*~struct~ConditionConfig:
*
* @param Conditions
* @text 条件リスト
* @type struct<ConditionItem>[]
* @default []
* @desc 複数の条件を設定可能（すべてAND評価）
*/

/*~struct~ConditionItem:
*
* @param SwitchId
* @text スイッチID
* @type switch
* @default 0
* @desc スイッチ条件（0で無効）
*
* @param SwitchValue
* @text スイッチの期待値
* @type boolean
* @on ON
* @off OFF
* @default true
* @desc スイッチがこの値と一致する時に条件を満たす
*
* @param VariableId
* @text 変数ID
* @type variable
* @default 0
* @desc 変数条件（0で無効）
*
* @param Operator
* @text 比較方法
* @type select
* @option 等しい（==）
* @option 以上（>=）
* @option 以下（<=）
* @option より大きい（>）
* @option より小さい（<）
* @option 等しくない（!=）
* @default 等しい（==）
* @desc 変数の比較方法
*
* @param Value
* @text 比較値
* @type number
* @min -99999999
* @max 99999999
* @default 0
* @desc 変数と比較する対象値
*/

/*~struct~UIGaugeSprite:
 * @param Type
 * @text ゲージタイプ
 * @type select
 * @option 伸縮         @value elasticity
 * @option 移動         @value slide
 * @option マスク     @value mask
 * @default elasticity
 * @desc ゲージの動作方式（伸縮 / 移動 / マスク）
 *
 * @param Align
 * @text ゲージの進行方向
 * @type select
 * @option left
 * @option right
 * @option up
 * @option down
 * @default right
 * @desc ゲージ方向
 *
 * @param CurrentVarId
 * @text 現在値の変数ID
 * @type variable
 * @desc ゲージの現在値変数ID
 *
 * @param MaxVarId
 * @text 最大値の変数ID
 * @type variable
 * @desc ゲージの最大値変数ID
 *
 * @param BarImage
 * @text ゲージ画像
 * @type file
 * @dir img/UI
 * @desc ゲージとして使う画像
 *
 * @param MaskImage
 * @text マスク画像
 * @type file
 * @dir img/UI
 * @desc マスクに使用する画像
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @default 0
 *
 * @param Decoration
 * @text 装飾設定
 * @type struct<UIGaugeDecoration>
 * @desc ゲージに重ねる装飾画像
 *
 * @param SlideDistance
 * @text ゲージの移動距離
 * @type number
 * @min 0
 * @desc ゲージが移動する距離(移動タイプのみ使用)
 *
 * @param Condition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @desc 表示条件（空欄なら常に表示）
 *
 * @param UseEasing
 * @text イージングを使用する
 * @type boolean
 * @default true
 * @desc 値が変化したときの移動表現を使用するかどうか
 *
 * @param EasingType
 * @text イージングの種類
 * @type select
 * @option linear
 * @option easeInQuad
 * @option easeOutQuad
 * @option easeInOutQuad
 * @option easeInCubic
 * @option easeOutCubic
 * @option easeInOutCubic
 * @option easeInQuart
 * @option easeOutQuart
 * @option easeInOutQuart
 * @option easeInQuint
 * @option easeOutQuint
 * @option easeInOutQuint
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 * @default easeInOutQuad
 * @desc イーシング種類を指定
 *
 * @param EasingSpeed
 * @text イージング速度
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 1.0
 * @default 0.15
 * @desc 値に近づく速さ
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UIGaugeFadeEffect>
 * @desc 出現・消去時のエフェクト設定
 */

/*~struct~UIGaugeFadeEffect:
 *
 * @param AppearEffect
 * @text 出現時効果
 * @type struct<UIFadeAppearEffect>
 * @desc 出現するときの効果
 *
 * @param DisappearEffect
 * @text 消去時効果
 * @type struct<UIFadeDisappearEffect>
 * @desc 消去するときの効果
 */

/*~struct~UIGaugeDecoration:
 *
 * @param BackgroundImage
 * @text 背景画像
 * @type file
 * @dir img/UI
 * @desc ゲージの後ろに表示される背景画像
 *
 * @param BackgroundOffsetX
 * @text 背景画像X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 背景画像のX座標補正
 *
 * @param BackgroundOffsetY
 * @text 背景画像Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 背景画像のY座標補正
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI
 * @desc ゲージの上に重ねる装飾枠画像
 *
 * @param FrameOffsetX
 * @text フレーム画像X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc フレーム画像のX座標補正
 *
 * @param FrameOffsetY
 * @text フレーム画像Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc フレーム画像のY座標補正
 */

/*~struct~UINumberSprite:
 * @param VariableId
 * @text 表示変数ID
 * @type variable
 * @desc この変数の値をスプライトで表示
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @default 0
 * @desc 数字の表示位置X
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @default 0
 * @desc 数字の表示位置Y
 *
 * @param Bitmap
 * @text 数字画像
 * @type file
 * @dir img/system
 * @default Damage
 * @desc 数字表示に使用する画像
 *
 * @param PrefixImage
 * @text プレフィックス画像
 * @type file
 * @dir img/system
 * @desc 数字の左側に表示するマーク画像（通貨アイコン等）
 *
 * @param PrefixOffsetX
 * @text プレフィックスXオフセット
 * @type number
 * @min -999
 * @max 999
 * @default 0
 * @desc プレフィックス画像のX座標オフセット
 *
 * @param PrefixOffsetY
 * @text プレフィックスYオフセット
 * @type number
 * @min -999
 * @max 999
 * @default 0
 * @desc プレフィックス画像のY座標オフセット
 *
 * @param MinusBitmap
 * @text マイナス記号画像
 * @type file
 * @dir img/system
 * @desc マイナス値の時に表示する記号画像（空なら負の値は0として表示）
 *
 * @param MinusOffsetX
 * @text マイナス記号X軸オフセット
 * @type number
 * @min -999
 * @max 999
 * @default 0
 * @desc マイナス記号のX座標オフセット
 *
 * @param Digit
 * @text 桁数
 * @type number
 * @default 4
 * @desc 表示する最大桁数
 *
 * @param Padding
 * @text 桁間スペース
 * @type number
 * @min -99
 * @max 99
 * @default 0
 * @desc 各桁の間隔
 *
 * @param Align
 * @text 整列方向
 * @type select
 * @option 左揃え @value left
 * @option 中央揃え @value center
 * @option 右揃え @value right
 * @default right
 * @desc 数字の表示位置を設定（左・中央・右）
 *
 * @param PadZero
 * @text ゼロ埋め
 * @type boolean
 * @default false
 * @desc 桁が足りないときに0で埋めるか
 *
 * @param MaxValue
 * @text 最大表示値
 * @type number
 * @min -99999999
 * @default 0
 * @desc 表示上の最大値（0で無制限）。実数がこれを超えても表示はこの値で止まる
 *
 * @param MinValue
 * @text 最小表示値
 * @type number
 * @min -99999999
 * @default 0
 * @desc 表示上の最小値（0で無制限）。実数がこれを下回っても表示はこの値で止まる
 *
 * @param SwitchId
 * @text 表示スイッチ
 * @type switch
 * @default 0
 * @desc 0で常に表示
 *
 * @param UseSeparator
 * @text 3桁区切りを使用
 * @type boolean
 * @default false
 * @desc true の場合、3桁ごとに区切りカンマを挿入
 *
 * @param SeparatorBitmap
 * @text 区切り画像
 * @type file
 * @dir img/system
 * @desc カンマ用画像（UseSeparator=true時必須）
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UINumberFadeEffect>
 * @desc 出現・消去時のエフェクト設定
 *
 */

/*~struct~UINumberFadeEffect:
 *
 * @param AppearEffect
 * @text 出現時効果
 * @type struct<UIFadeAppearEffect>
 * @desc 出現するときの効果
 *
 * @param DisappearEffect
 * @text 消去時効果
 * @type struct<UIFadeDisappearEffect>
 * @desc 消去するときの効果
 */

/*~struct~UITextSprite:
 * @param VariableId
 * @text 表示する変数ID
 * @type variable
 * @desc 表示したい値が格納されている変数番号
 *
 * @param OffsetX
 * @text Xオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc UIConfig.X に対する相対位置
 *
 * @param OffsetY
 * @text Yオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc UIConfig.Y に対する相対位置
 *
 * @param FontSize
 * @text フォントサイズ
 * @type number
 * @default 28
 *
 * @param Align
 * @text 揃え
 * @type select
 * @option 左揃え
 * @value left
 * @option 中央揃え
 * @value center
 * @option 右揃え
 * @value right
 * @default left
 * @desc テキストの表示位置
 *
 * @param FontFace
 * @text フォント名
 * @type string
 * @desc 表示に使うフォント名（空白ならデフォルト）
 *
 * @param DisplayCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @desc テキスト表示の条件（スイッチ・変数ベース）
 *
 * @param TextColor
 * @text テキストカラー
 * @type string
 * @default #ffffff
 * @desc テキストの色（#ffffff形式またはCSS色名）
 *
 * @param OutlineColor
 * @text アウトラインカラー
 * @type string
 * @default #000000
 * @desc テキストアウトラインの色（#ffffff形式またはCSS色名）
 *
 * @param OutlineWidth
 * @text アウトライン幅
 * @type number
 * @min 0
 * @max 10
 * @default 4
 * @desc アウトラインの太さ（0で無効）
 */

/*~struct~UISpriteSheetConfig:

 * @param UseSpriteSheet
 * @text スプライトシートを使用
 * @type boolean
 * @default true
 *
 * @param FrameIndex
 * @text 初期フレーム番号
 * @type number
 * @default 0
 *
 * @param FrameCols
 * @text 列数
 * @type number
 * @default 3 
 *
 * @param FrameRows
 * @text 行数
 * @type number
 * @default 1
 * 
 * @param UseAnimation
 * @type boolean
 * @default true
 *
 * @param Loop
 * @text ループ再生
 * @type boolean
 * @default true 
 *
 * @param StartIndex
 * @text 再生開始フレーム
 * @type number
 * @default 0
 *
 * @param EndIndex
 * @text 再生終了フレーム
 * @type number
 * @default 2
 *
 * @param Interval
 * @text 切替間隔(フレーム)
 * @type number
 * @default 6 
 * 
 * @param OffsetX
 * @text X オフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param OffsetY
 * @text Y オフセット
 * @type number
 * @min -9999
 * @max 9999
 * @default 0 
 */

/*~struct~RecollectionSettings:
 * @param Background
 * @text 回想背景画像
 * @type file
 * @dir img/Recollection/
 * @desc 回想シーンの背景に表示される画像
 * @default ""
 *
 * @param TabBackgrounds
 * @text タブ別背景画像設定
 * @type struct<TabBackground>[]
 * @desc 各タブに表示される画像と座標設定
 * @default []
 *
 * @param Choices
 * @text 回想選択肢リスト
 * @type struct<RecChoiceItem>[]
 * @desc 回想画面に表示される選択肢一覧
 * @default []
 *
 * @param CursorConfig
 * @text カーソル設定
 * @type struct<RecCursorConfig>
 * @default {}
 *
 * @param BGM
 * @text 回想BGM
 * @type struct<BGM>
 * @default {}
 *
 * @param SelectSE
 * @text 選択SE
 * @type struct<CursorSelectSe>
 * @default {}
 *
 * @param OkSE
 * @text 決定SE
 * @type struct<CursorOkSe>
 * @default {}
 *
 * @param Tabs
 * @text タブボタン一覧
 * @type struct<TabButton>[]
 * @default []
 *
 * @param TabCursor
 * @text タブ用カーソル設定
 * @type struct<TabCursorConfig>
 * @default {}
 *
 * @param RecollectionCancelsetting
 * @text 終了確認設定
 * @type struct<RecollectionCancelConfig>
 * @desc 回想シーン中にキャンセルキーで表示される確認画像選択肢
 * @default {}
 *
 * @param RecollectionActiveSwitches
 * @text 回想中スイッチ
 * @type switch[]
 * @desc 回想モード中にONにし、終了時にOFFにするスイッチ
 * @default []
 */

/*~struct~RecChoiceItem:
 * @param Name
 * @text メモ
 * @type string
 * @desc sceneメモ用
 *
 * @param Page
 * @text 表示ページ
 * @type number
 * @desc タブに設定したページで表示
 * @default 1
 *
 * @param ShowSwitch
 * @text 表示スイッチ
 * @type switch
 * @desc 回想開放を判定するスイッチ
 * @default 0
 *
 * @param EnabledImage
 * @text 開放時画像
 * @type file
 * @dir img/Recollection/
 * @desc 表示スイッチがONのときに表示される画像ファイル
 *
 * @param DisabledImage
 * @text 未開放画像
 * @type file
 * @dir img/Recollection/
 * @desc 表示スイッチがOFFのときに表示される画像ファイル
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ピクチャを表示するX位置
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ピクチャを表示するY位置
 *
 * @param HoverEffect
 * @text ホバー効果
 * @type struct<HoverRecollectionEffectConfig>
 * @desc ホバー効果を設定
 *
 * @param CommonEventId
 * @parent Action
 * @text コモンイベントID
 * @type common_event
 * @desc 回想として呼び出すコモンイベント
 *
 */

/*~struct~ADMINSettings:
 * @param NewGameCommonEvent
 * @text ニューゲームコモン
 * @type common_event
 * @default 0
 * @desc ニューゲーム開始時に自動で実行されるコモンイベントID
 *
 * @param LoadGameCommonEvent
 * @text ロードコモン
 * @type common_event
 * @default 0
 * @desc ロード完了時に自動で実行されるコモンイベントID
 *
 * @param MenuCloseCommonEvent
 * @text メニューコモン
 * @type common_event
 * @default 0
 * @desc メニュー画面を閉じたときに実行されるコモンイベントID
 *
 * @param EventTriggers
 * @text イベントトリガー
 * @type struct<EventTrigger>[]
 * @default []
 * @desc 条件に応じて発動するコモンイベント設定
 *
 * @param TriggerRecordVariable
 * @text トリガー実行記録変数ID
 * @type variable
 * @desc 一度きりイベントの実行状態を記録する変数ID
 * @default 0
 */

/*~struct~EventTrigger:
 * @param CommonEventId
 * @text コモンイベントID
 * @type common_event
 * @desc 実行されるコモンイベントのID。
 *
 * @param ConditionSwitches
 * @text 実行条件スイッチ
 * @type switch[]
 * @desc すべてのスイッチがONのときに実行。
 * @default []
 *
 * @param ConditionVariables
 * @text 実行条件変数
 * @type struct<ConditionVariable>[]
 * @desc すべての変数条件が満たされているときに実行。
 * @default []
 *
 * @param ProhibitSwitches
 * @text 禁止条件スイッチ
 * @type switch[]
 * @desc いずれかのスイッチがONのとき実行しない。
 * @default []
 *
 * @param ProhibitVariables
 * @text 禁止条件変数
 * @type struct<ConditionVariable>[]
 * @desc いずれかの変数条件が満たされていると実行しない。
 * @default []
 *
 * @param Once
 * @text 一度きり実行
 * @type boolean
 * @desc 条件を満たしたら一度だけ実行し、それ以降は無視。
 * @default false
 *
 * @param CustomName
 * @text カスタム名
 * @type string
 * @desc 使用するカスタム名の指定
 * @default
 *
 * @param BlockIfTriggered
 * @text 連続発火を禁止
 * @type boolean
 * @desc 連続のイベント実行を抑制
 * @default false
 */

/*~struct~BackgroundSettings:
 * @param Backgrounds
 * @text 背景管理リスト
 * @type struct<Background>[]
 * @default []
 * @desc 時間帯別の背景画像設定
 *
 * @param PictureId1
 * @text 背景用ピクチャID1
 * @type number
 * @default 1
 * @desc 旧背景に使用するピクチャID
 *
 * @param PictureId2
 * @text 背景用ピクチャID2
 * @type number
 * @default 2
 * @desc 新背景に使用するピクチャID
 */

/*~struct~ConditionVariable:
 * @param Id
 * @text 変数ID
 * @type variable
 * @desc 判定対象の変数ID。
 *
 * @param Operator
 * @text 比較方法
 * @type select
 * @option 等しい（==）
 * @value 等しい
 * @option 等しくない（!=）
 * @value 等しくない
 * @option より大きい（>）
 * @value より大きい
 * @option より小さい（<）
 * @value より小さい
 * @option 以上（>=）
 * @value 以上
 * @option 以下（<=）
 * @value 以下
 * @desc 変数と比較する方法を選択。
 *
 * @param Value
 * @text 比較値
 * @type number
 * @desc 変数と比較する対象の値。
 */

/*~struct~ChatLogSettings:
 *
 * @param SwitchID
 * @text 表示スイッチID
 * @type switch
 * @desc チャットログの表示・非表示を切り替えるスイッチ
 * @default 1
 *
 * @param DisableChatSwitchID
 * @text チャット無効スイッチID
 * @type switch
 * @desc ONのときチャットログ追加を無効化
 * @default 2
 *
 * @param ForceHideSwitchIds
 * @text 強制非表示スイッチID一覧
 * @type switch[]
 * @desc ONのときチャットログウィンドウを強制的に非表示にするスイッチ
 * @default []
 *
 * @param MaxLogEntries
 * @text 最大ログ件数
 * @type number
 * @desc 保存する最大件数（古い順に削除）
 * @default 100
 *
 * @param WindowX
 * @text ウィンドウX座標
 * @type number
 * @default 0
 *
 * @param WindowY
 * @text ウィンドウY座標
 * @type number
 * @default 0
 *
 * @param WindowWidth
 * @text ウィンドウ幅
 * @type number
 * @default 480
 *
 * @param WindowHeight
 * @text ウィンドウ高さ
 * @type number
 * @default 216
 *
 * @param SwitchMoves
 * @text スイッチ移動設定
 * @type struct<ChatLogSwitchMove>[]
 * @desc 指定スイッチON時にウィンドウを移動させる設定
 * @default []
 *
 * @param WindowOpacity
 * @text ウィンドウ透明度
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param PaddingTop
 * @text 上余白
 * @type number
 * @default 8
 *
 * @param PaddingBottom
 * @text 下余白
 * @type number
 * @default 8
 *
 * @param PaddingLeft
 * @text 左余白
 * @type number
 * @default 12
 *
 * @param PaddingRight
 * @text 右余白
 * @type number
 * @default 12
 *
 * @param LineSpacing
 * @text 行間
 * @type number
 * @default 4
 *
 * @param FontSize
 * @text フォントサイズ
 * @type number
 * @default 28
 *
 * @param IconSize
 * @text アイコンサイズ
 * @type number
 * @default 32
 *
 * @param ScrollAmount
 * @text スクロール量
 * @type number
 * @default 40
 *
 * @param DefaultStampWidth
 * @text デフォルトスタンプ幅
 * @type number
 * @default 100
 *
 * @param DefaultStampHeight
 * @text デフォルトスタンプ高さ
 * @type number
 * @default 100
 *
 * @param CustomBackgroundImage
 * @text カスタム背景画像
 * @type file
 * @dir img/pictures
 * @desc 背景画像を指定。空欄なら無し
 *
 * @param FontName
 * @text 使用フォント名
 * @type string
 * @default GameFont
 */

/*~struct~ChatLogSwitchMove:
 *
 * @param Name
 * @text 設定名
 * @type string
 * @default ""
 * @desc 管理しやすいよう任意の名前を付けます（任意）
 *
 * @param SwitchId
 * @text トリガースイッチID
 * @type switch
 * @desc ONの間ウィンドウを移動させるスイッチ
 * @default 0
 *
 * @param TargetX
 * @text 移動先X座標
 * @type number
 * @default ""
 * @desc スイッチON時のウィンドウX座標（未入力で初期値を使用）
 *
 * @param TargetY
 * @text 移動先Y座標
 * @type number
 * @default ""
 * @desc スイッチON時のウィンドウY座標（未入力で初期値を使用）
 *
 * @param Duration
 * @text 移動時間(フレーム)
 * @type number
 * @min 0
 * @default 20
 * @desc ウィンドウが目標座標へ移動するまでのフレーム数
 *
 * @param Easing
 * @text イージング
 * @type select
 * @option リニア
 * @value linear
 * @option イーズイン(Quad)
 * @value easeInQuad
 * @option イーズアウト(Quad)
 * @value easeOutQuad
 * @option イーズインアウト(Quad)
 * @value easeInOutQuad
 * @default easeOutQuad
 * @desc 移動の滑らかさを決める補間方法
 */

/*~struct~LayerItem:
 * @param layer
 * @text レイヤー名
 * @type string
 *
 * @param file
 * @text ファイル名（img/characterset 内）
 * @type file
 * @dir img/characterset
 *
 * @param priority
 * @text 優先度
 * @type number
 * @default 50
 * @desc 値が大きいほど上に表示
 */

/*~struct~LayerPartItem:
 * @param layer
 * @text レイヤー名
 * @type string
 *
 * @param file
 * @text 画像ファイル
 * @type file
 * @dir img/characterset
 */

/*~struct~CgGroup:
 *
 * @param PictureId1
 * @text ベースPictureID
 * @type number
 * @min 1 @max 100
 * @default 21
 *
 * @param PictureId2
 * @text フェードPictureID
 * @type number
 * @min 1 @max 100
 * @default 22
 *
 * @param Scenes
 * @text CGシーン一覧
 * @type struct<CgScene>[]
 * @desc このグループに属する CG シーンを列挙
 */

/*~struct~CgScene:
 *
 * @param Label
 * @text シーン名（ラベル）
 * @type string
 *
 * @param Images
 * @text 画像リスト
 * @type struct<CgImage>[]
 * @desc
 */

/*~struct~CgImage:
 *
 * @param FileName
 * @text CG画像ファイル
 * @type file
 * @dir img/pictures/
 */

/*~struct~VisualtitleChoiceItem:
 * @param Name
 * @text 選択肢名
 * @type string
 * @desc タイトルで表示する選択肢の名前（メモ用）
 *
 * @param ShowSwitch
 * @text 表示スイッチ
 * @type switch
 * @desc ONのときのみこの選択肢を表示（0で常に表示）
 * @default 0
 *
 * @param Image
 * @text 表示画像
 * @type file
 * @dir img/UI/
 * @desc 表示する画像ファイル（img/UI/ フォルダ内）
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @desc ピクチャを表示するX位置
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @desc ピクチャを表示するY位置
 *
 * @param HoverEffect
 * @text ホバー効果
 * @type struct<VisualtitleHoverEffectConfig>
 * @desc ホバー効果を設定
 *
 * @param Action
 * @text 実行アクション
 * @type select
 * @option はじめから
 * @value newGame
 * @option つづきから
 * @value continue
 * @option オプション
 * @value options
 * @option ゲーム終了
 * @value gameend
 * @option コモンイベント呼び出し
 * @value commonEvent
 * @desc クリックされたときに実行する動作
 *
 * @param CommonEventId
 * @parent Action
 * @text コモンイベントID
 * @type common_event
 * @desc アクションがコモンイベントのときに呼ばれるコモンイベントID
 */

/*~struct~VisualtitleHoverEffectConfig:
 *
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外の値を設定すると拡大が有効になります
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @default 0
 * @desc 0以外の値を設定すると位置補正が有効になります
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI/
 * @desc 画像を設定するとフレーム表示が有効になります
 *
 * @param HideImageOnFrame
 * @text フレーム表示時に画像を透明化
 * @type boolean
 * @default false
 * @desc trueにするとフレーム表示時にホバー中の選択肢画像を透明にします
 *
 * @param ExtraImageSetting
 * @text ホバー中追加画像
 * @type struct<titleVisualHoverExtraImageConfig>
 * @default
 */

/*~struct~HoverEffectConfig:
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると選択時に拡大
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のX座標をずらす
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のY座標をずらす
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI/
 * @desc 画像を設定すると選択中にフレーム画像が表示
 *
 * @param ExtraImageSetting
 * @text ホバー中表示画像
 * @type struct<VisualHoverExtraImageConfig>[]
 * @default []
 */

/*~struct~titleVisualHoverExtraImageConfig:
 *
 * @param Image
 * @text ホバー画像ファイル名
 * @type file
 * @dir img/UI/
 *
 * @param X
 * @text X座標
 * @type number
 * @default 0
 *
 * @param Y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param SwitchId
 * @text 表示条件スイッチID
 * @type switch
 * @default 0
 *
 * @param VariableId
 * @text 表示条件変数ID
 * @type variable
 * @default 0
 *
 * @param CompareValue
 * @text 比較値
 * @type number
 * @default 0
 *
 * @param Operator
 * @text 比較演算子
 * @type select
 * @option ==
 * @option >=
 * @option <=
 * @option >
 * @option <
 * @default ==
 */

/*~struct~DummyMapSettings:
 * @param MapId
 * @text マップID
 * @type number
 * @min 1
 * @desc 遷移先のマップID
 *
 * @param X
 * @text X座標
 * @type number
 * @default 1
 *
 * @param Y
 * @text Y座標
 * @type number
 * @default 1
 */

/*~struct~titlecursorConfig:
 *
 * @param Image
 * @text カーソル画像
 * @type file
 * @dir img/UI/
 *
 * @param Position
 * @text 表示位置
 * @type select
 * @option 左
 * @value left
 * @option 中央
 * @value center
 * @option 右
 * @value right
 * @default left
 * @desc カーソルの相対表示位置
 *
 * @param OffsetX
 * @text X座標補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param OffsetY
 * @text Y座標補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc タイトル画面で表示されるカーソルの画像と座標補正値
 */

/*~struct~RecCursorConfig:
 * @param Image
 * @text カーソル画像
 * @type file
 * @dir img/Recollection/
 * @desc 回想シーンで使うカーソル画像
 * @default
 *
 * @param OffsetX
 * @text Xオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 2
 * @default 0
 * @desc カーソルのX座標補正値
 *
 * @param OffsetY
 * @text Yオフセット
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 2
 * @default 0
 * @desc カーソルのY座標補正値
 */

/*~struct~RecollectionChoiceItem:
 * @param Name
 * @text 選択肢名
 * @type string
 * @desc 開発者用メモとしての選択肢名
 *
 * @param Page
 * @text 表示ページ
 * @type number
 * @desc この選択肢を表示するページ番号（1ページ目なら1）
 * @default 1
 *
 * @param ShowSwitch
 * @text 表示スイッチ
 * @type switch
 * @desc このスイッチのONOFFで回想可能、表示画像の判定を行う
 * @default 0
 *
 * @param EnabledImage
 * @text 表示画像（ON時）
 * @type file
 * @dir img/Recollection/
 * @desc 表示スイッチがONのときに表示される画像ファイル
 *
 * @param DisabledImage
 * @text 表示画像（OFF時）
 * @type file
 * @dir img/Recollection/
 * @desc 表示スイッチがOFFのときに表示される画像ファイル
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ピクチャを表示するX位置
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ピクチャを表示するY位置
 *
 * @param HoverEffect
 * @text ホバー効果
 * @type struct<HoverRecollectionEffectConfig>
 * @desc 選択中に拡大・移動・フレーム表示などの演出を設定
 *
 * @param CommonEventId
 * @parent Action
 * @text コモンイベントID
 * @type common_event
 * @desc 回想として呼び出すコモンイベント
 *
 */

/*~struct~TabBackground:
 * @param Page
 * @text 対応ページ番号
 * @type number
 *
 * @param Image
 * @text 背景画像
 * @type file
 * @dir img/Recollection/
 *
 * @param X
 * @type number
 * @default 0
 *
 * @param Y
 * @type number
 * @default 0
 *
 * @param ShowSwitch
 * @text 表示スイッチ
 * @type switch
 * @default 0
 * @desc 0なら常に表示、1以上でそのスイッチON時のみ表示
 *
 * @param ShowVariable
 * @text 表示変数ID
 * @type variable
 * @default 0
 *
 * @param ShowOperator
 * @text 変数の比較方法
 * @type select
 * @option 等しい（==）
 * @option 以上（>=）
 * @option 以下（<=）
 * @option より大きい（>）
 * @option より小さい（<）
 * @default 等しい（==）
 *
 * @param ShowValue
 * @text 比較値
 * @type number
 * @default 0
 */

/*~param~TabBackgrounds:
 * @text タブ別背景画像設定
 * @type struct<TabBackground>[]
 * @desc 各ページに対応する画像設定
 */

/*~struct~HoverRecollectionEffectConfig:
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると選択時に拡大
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のX座標をずらす
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のY座標をずらす
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/Recollection/
 * @desc 画像を設定すると選択中にフレーム画像が表示
 */

/*~struct~RecollectionCancelConfig:
 * @param BaseImage
 * @text 土台画像
 * @type file
 * @dir img/Recollection/
 * @desc 確認ウィンドウの背景画像
 *
 * @param Choices
 * @text 選択肢画像リスト
 * @type struct<RecCancelChoiceItem>[]
 * @desc 終了確認の選択肢
 */

/*~struct~RecCancelChoiceItem:
 * @param Image
 * @text 選択肢画像
 * @type file
 * @dir img/Recollection/
 *
 * @param X
 * @text X座標
 * @type number
 * @default 0
 *
 * @param Y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param HoverEffect
 * @text ホバー効果
 * @type struct<HoverRecollectionEffectConfig>
 * @desc ホバー時の拡大・移動・フレーム表示を設定
 *
 * @param Action
 * @text アクション
 * @type select
 * @option endRecollection
 * @option cancel
 * @desc 選択されたときの動作
 */

/*~struct~PageButton:
 * @param Image
 * @text ボタン画像
 * @type file
 * @dir img/Recollection/
 * @desc 表示するボタン画像
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ボタンの表示位置X
 * @default 0
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc ボタンの表示位置Y
 * @default 0
 */

/*~struct~CursorConfig_Recollection:
 * @param Image
 * @text カーソル画像
 * @type file
 * @dir img/Recollection/
 * @desc 回想シーン専用カーソル画像ファイル
 *
 * @param OffsetX
 * @text オフセットX
 * @type number
 * @min -9999
 * @max 9999
 * @desc カーソルのX座標に加算する数値
 * @default 0
 *
 * @param OffsetY
 * @text オフセットY
 * @type number
 * @min -9999
 * @max 9999
 * @desc カーソルのY座標に加算する数値
 * @default 0
 */

/*~struct~TabButton:
 * @param Image
 * @text タブ画像
 * @type file
 * @dir img/Recollection/
 * @desc 表示するタブの画像
 *
 * @param X
 * @text 表示X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc タブ画像を表示するX位置
 *
 * @param Y
 * @text 表示Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc タブ画像を表示するY位置
 *
 * @param Page
 * @text 対応ページ番号
 * @type number
 * @min -9999
 * @max 9999
 * @desc このタブを押すと切り替わるページ番号
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/Recollection/
 * @desc 選択中に表示される装飾フレーム画像
 */

/*~struct~TabCursorConfig:
 * @param Image
 * @text カーソル画像
 * @type file
 * @dir img/Recollection/
 * @desc タブカーソル画像ファイル
 *
 * @param OffsetX
 * @text オフセットX
 * @type number
 * @min -9999
 * @max 9999
 * @desc カーソルのX座標に加算される数値
 * @default 0
 *
 * @param OffsetY
 * @text オフセットY
 * @type number
 * @min -9999
 * @max 9999
 * @desc カーソルのY座標に加算される数値
 * @default 0
 */

/*~struct~BGM:
 * @param name
 * @text ファイル名
 * @type file
 * @dir audio/bgm/
 * @desc 再生するBGMファイル名
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

/*~struct~CursorConfig:
 * @param VariableId
 * @text 切り替え変数ID
 * @type variable
 * @default 0
 *
 * @param CursorList
 * @text カーソル画像リスト
 * @type struct<CursorImageEntry>[]
 * @desc 値ごとに画像と補正を切り替える
 */

/*~struct~CursorImageEntry:
 * @param Value
 * @text 変数の値
 * @type number
 *
 * @param Image
 * @text カーソル画像
 * @type file
 * @dir img/UI/
 *
 * @param Position
 * @text 表示位置
 * @type select
 * @option 左
 * @value left
 * @option 中央
 * @value center
 * @option 右
 * @value right
 * @default left
 * @desc カーソルの相対表示位置
 *
 * @param OffsetX
 * @text オフセットX
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param OffsetY
 * @text オフセットY
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 */

/*~struct~CursorSelectSe:
 * @param name
 * @text ファイル名
 * @type file
 * @dir audio/se/
 *
 * @param volume
 * @type number
 * @default 90
 *
 * @param pitch
 * @type number
 * @default 100
 *
 * @param pan
 * @type number
 * @default 0
 */

/*~struct~CursorOkSe:
 * @param name
 * @text ファイル名
 * @type file
 * @dir audio/se/
 *
 * @param volume
 * @type number
 * @default 90
 *
 * @param pitch
 * @type number
 * @default 100
 *
 * @param pan
 * @type number
 * @default 0
 */

/*~struct~Background:
 * @param Place
 * @text 場所名
 * @type string
 * @desc 例：村、城、森 など
 *
 * @param MorningImage
 * @text 朝の画像
 * @type file
 * @dir img/pictures/
 * @desc img/pictures/ 以下（サブフォルダ可）を指定
 *
 * @param EveningImage
 * @text 夕方の画像
 * @type file
 * @dir img/pictures/
 * @desc img/pictures/ 以下（サブフォルダ可）を指定
 *
 * @param NightImage
 * @text 夜の画像
 * @type file
 * @dir img/pictures/
 * @desc img/pictures/ 以下（サブフォルダ可）を指定
 */

/*~struct~Choicecommand:
 * @param 画像
 * @text 画像ファイル
 * @type file
 * @dir img/UI/
 * @desc img/UI
 *
 * @param 選択肢名
 * @text 選択肢の名前
 * @type string
 * @desc Show Choices で入力するテキスト
 *
 * @param X座標
 * @text X座標
 * @type number
 * @min 0
 * @default 0
 * @desc ウィンドウ左上を基準とした表示X位置（px）
 *
 * @param Y座標
 * @text Y座標
 * @type number
 * @min 0
 * @default 0
 * @desc ウィンドウ左上を基準とした表示Y位置（px）
 *
 * @param Scale
 * @text 拡大率（%）
 * @type number
 * @default 100
 * @desc 100以外を設定すると選択時に拡大
 *
 * @param OffsetX
 * @text X補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のX座標をずらす
 *
 * @param OffsetY
 * @text Y補正
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc 0以外を設定すると選択中に画像のY座標をずらす
 *
 * @param FrameImage
 * @text フレーム画像
 * @type file
 * @dir img/UI/
 * @desc 画像を設定すると選択中にフレーム画像が表示
 *
 * @param ExtraImageSetting
 * @text ホバー中表示画像
 * @type struct<choiceHoverExtraImageConfig>[]
 * @default []
 */

/*~struct~choiceHoverExtraImageConfig:
 *
 * @param Image
 * @text ホバー画像ファイル名
 * @type file
 * @dir img/UI/
 *
 * @param X
 * @text X座標
 * @type number
 * @default 0
 *
 * @param Y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param SwitchId
 * @text 表示条件スイッチID
 * @type switch
 * @default 0
 *
 * @param VariableId
 * @text 表示条件変数ID
 * @type variable
 * @default 0
 *
 * @param CompareValue
 * @text 比較値
 * @type number
 * @default 0
 *
 * @param Operator
 * @text 比較演算子
 * @type select
 * @option ==
 * @option >=
 * @option <=
 * @option >
 * @option <
 * @default ==
 */

/*~struct~RingChoice:
 * @param 画像
 * @text 画像
 * @type file
 * @dir img/UI/
 * @desc 選択肢画像
 *
 * @param コモンイベント
 * @text コモンイベント
 * @type common_event
 * @desc 選択時に呼び出すコモンイベント
 *
 */

/*~struct~OptionCommandSet:
 *
 * @param alwaysDash
 * @text 常時ダッシュの初期値
 * @type boolean
 * @default true
 *
 * @param showAlwaysDash
 * @text 常時ダッシュを表示
 * @type boolean
 * @default true
 *
 * @param commandRemember
 * @text コマンド記憶の初期値
 * @type boolean
 * @default true
 *
 * @param showCommandRemember
 * @text コマンド記憶を表示
 * @type boolean
 * @default true
 *
 * @param touchUI
 * @text タッチUIの初期値
 * @type boolean
 * @default true
 *
 * @param showTouchUI
 * @text タッチUIを表示
 * @type boolean
 * @default true
 *
 * @param showScreenSize
 * @text 画面サイズを表示
 * @type boolean
 * @default true
 *
 * @param showFullScreen
 * @text フルスクリーンを表示
 * @type boolean
 * @default true
 *
 * @param returnToTitle
 * @text タイトルに戻るの初期値
 * @type boolean
 * @default true
 *
 * @param showReturnToTitle
 * @text タイトルに戻るを表示
 * @type boolean
 * @default true
 */

/*~struct~Preset:
 * @param name
 * @text プリセット名
 * @type string
 *
 * @param x
 * @text X
 * @type number
 * @min 0
 *
 * @param y
 * @text Y
 * @type number
 * @min 0
 *
 * @param anchorX
 * @text アンカーX
 * @type select
 * @option left
 * @option center
 * @option right
 * @default left
 *
 * @param background
 * @text 背景
 * @type select
 * @option window
 * @option transparent
 * @option image
 * @default window
 *
 * @param backgroundImage
 * @text 背景画像（img/pictures）
 * @type file
 * @dir img/pictures
 *
 * @param opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @default 255
 *
 * @param backOpacity
 * @text 背景不透明度
 * @type number
 * @max 255
 * @default 192
 *
 * @param padding
 * @text パディング
 * @type number
 * @min -1
 * @default -1
 *
 * @param fontSize
 * @text フォントサイズ
 * @type number
 * @min 0
 * @default 0
 *
 * @param fontColor
 * @text 文字色（数値 or CSS色）
 * @type string
 * @default
 *
 * @param outlineColor
 * @text 縁色（none/transparentで無効）
 * @type string
 * @default
 *
 * @param outlineWidth
 * @text 縁の太さ
 * @type number
 * @min 0
 * @default 4
 *
 * @param windowskin
 * @text ウィンドウスキン（img/system）
 * @type file
 * @dir img/system
 *
 * @param tailImage
 * @text 吹き出し画像（img/system）
 * @type file
 * @dir img/system
 *
 * @param tailPosition
 * @text 吹き出し位置
 * @type select
 * @option none
 * @option lt
 * @option ct
 * @option rt
 * @option lb
 * @option cb
 * @option rb
 * @default none
 *
 * @param tailOffsetX
 * @text 吹き出しオフセットX
 * @type number
 * @default 0
 *
 * @param tailOffsetY
 * @text 吹き出しオフセットY
 * @type number
 * @default 0
 */

/*~struct~OnomatopoeiaSettings:
 * @param presets
 * @text プリセット一覧
 * @type struct<OnomatopoeiaPreset>[]
 * @desc 登録済みオノマトペプリセットの一覧
 */

/*~struct~OnomatopoeiaPreset:
 * @param name
 * @text プリセット名
 * @type string
 * @desc プリセットの識別名
 *
 * @param image
 * @text 画像ファイル名
 * @type file
 * @dir img/pictures/
 * @desc オノマトペ画像
 *
 * @param x
 * @text X座標
 * @type number
 * @default 400
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 300
 *
 * @param duration
 * @text 表示時間
 * @type number
 * @default 60
 * @desc フレーム数
 *
 * @param fadeIn
 * @text フェードイン時間
 * @type number
 * @default 10
 * @desc フレーム数
 *
 * @param fadeOut
 * @text フェードアウト時間
 * @type number
 * @default 10
 * @desc フレーム数
 *
 * @param scaleStart
 * @text 開始スケール
 * @type number
 * @decimals 2
 * @default 0.50
 *
 * @param scaleEnd
 * @text 終了スケール
 * @type number
 * @decimals 2
 * @default 1.20
 *
 * @param rotationStart
 * @text 開始回転角度
 * @type number
 * @default 0
 * @desc 度数法（360度）
 *
 * @param rotationEnd
 * @text 終了回転角度
 * @type number
 * @default 0
 * @desc 度数法（360度）
 *
 * @param easing
 * @text イージングタイプ
 * @type select
 * @option Linear（一定速度） @value linear
 * @option QuadIn（加速・緩やかな始まり） @value easeInQuad
 * @option QuadOut（減速・穏やかな終わり） @value easeOutQuad
 * @option QuadInOut（加速と減速） @value easeInOutQuad
 * @option CubicIn（強めの加速） @value easeInCubic
 * @option CubicOut（強めの減速） @value easeOutCubic
 * @option CubicInOut（滑らかな加減速） @value easeInOutCubic
 * @option QuartIn（急激な加速） @value easeInQuart
 * @option QuartOut（急激な減速） @value easeOutQuart
 * @option QuartInOut（急加減速） @value easeInOutQuart
 * @option QuintIn（非常に急な加速） @value easeInQuint
 * @option QuintOut（非常に急な減速） @value easeOutQuint
 * @option QuintInOut（激しい加減速） @value easeInOutQuint
 * @option SineIn（なめらかな始まり） @value easeInSine
 * @option SineOut（なめらかな終わり） @value easeOutSine
 * @option SineInOut（なめらかな加減速） @value easeInOutSine
 * @option ExpoIn（急激に速くなる） @value easeInExpo
 * @option ExpoOut（急激に遅くなる） @value easeOutExpo
 * @option ExpoInOut（極端な加減速） @value easeInOutExpo
 * @option CircIn（円弧のような加速） @value easeInCirc
 * @option CircOut（円弧のような減速） @value easeOutCirc
 * @option CircInOut（円弧的な加減速） @value easeInOutCirc
 * @option BackIn（少し戻ってから加速） @value easeInBack
 * @option BackOut（終わりに少し戻る） @value easeOutBack
 * @option BackInOut（前後に跳ねるような動き） @value easeInOutBack
 * @option ElasticIn（バネのように跳ねて加速） @value easeInElastic
 * @option ElasticOut（バネのように跳ねて減速） @value easeOutElastic
 * @option ElasticInOut（バネのように前後に跳ねる） @value easeInOutElastic
 * @option BounceIn（バウンドしながら加速） @value easeInBounce
 * @option BounceOut（バウンドしながら減速） @value easeOutBounce
 * @option BounceInOut（前後にバウンドする動き） @value easeInOutBounce
 * @default easeOutQuad
 */

/*~struct~OnomatopoeiaFullPreset:
 * @param id
 * @text プリセットID
 * @type string
 * @desc プリセットを呼び出す際のID
 *
 * @param image
 * @text 画像ファイル名
 * @type file
 * @dir img/pictures/
 * @desc オノマトペ画像
 *
 * @param positionSettings
 * @text 座標設定
 * @type struct<PositionSettings>
 * @desc 開始・終了座標とランダム幅の設定
 *
 * @param scaleSettings
 * @text 拡大率設定
 * @type struct<ScaleSettings>
 * @desc 拡大率に関する詳細設定
 *
 * @param opacitySettings
 * @text 透明度設定
 * @type struct<OpacitySettings>
 * @desc 透明度に関する設定
 *
 * @param animationSettings
 * @text アニメーション設定
 * @type struct<AnimationSettings>
 * @desc 時間・ループ・イージングに関する設定
 *
 * @param effectSettings
 * @text 追加エフェクト設定
 * @type struct<EffectSettings>
 * @desc 簡易効果合成
 *
 * @param seSettings
 * @text SE設定
 * @type struct<OnomatopoeiaSeSettings>
 * @desc オノマトペ表示時に再生するSE設定
 */

(() => {
  //=============================================================================
  // 共通関数
  //=============================================================================

  "use strict";
  const PLUGIN_NAME = "OnevASSISTANT";
  window.PLUGIN_NAME = PLUGIN_NAME;

  const parameters = PluginManager.parameters(PLUGIN_NAME);
  const _origIsFastForward = Scene_Map.prototype.isFastForward;
  function safeJsonParse(jsonString, defaultValue = null) {
    if (typeof jsonString !== "string") {
      return jsonString !== undefined ? jsonString : defaultValue;
    }

    if (!jsonString || jsonString.trim() === "") {
      return defaultValue;
    }
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON解析エラー:", error);
      console.error("解析対象:", jsonString);
      return defaultValue;
    }
  }

  window.safeJsonParse = safeJsonParse;

  function getPluginParameter(pluginName, key, defaultValue = undefined) {
    const param = PluginManager.parameters(pluginName)[key];
    return param !== undefined ? param : defaultValue;
  }

  window.getPluginParameter = getPluginParameter;

  function parseDeep(input) {
    function deepParse(val) {
      if (typeof val !== "string") return val;
      try {
        const parsed = JSON.parse(val);
        return deepParse(parsed);
      } catch {
        return val;
      }
    }

    if (!input) return [];
    try {
      const top = typeof input === "string" ? JSON.parse(input) : input;
      return Array.isArray(top)
        ? top.map((entry) => deepParse(entry))
        : deepParse(top);
    } catch (e) {
      return [];
    }
  }

  window.parseDeep = parseDeep;

  function loadDataFile(filename) {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  async function loadMultipleDataFiles(filenames) {
    const promises = filenames.map((filename) =>
      loadDataFile(filename).catch((error) => {
        return null;
      })
    );

    const results = await Promise.all(promises);
    const data = {};
    filenames.forEach((filename, index) => {
      if (results[index] !== null) {
        data[filename] = results[index];
      }
    });
    return data;
  }

  const dataCache = new Map();
  async function loadDataFileWithCache(filename) {
    if (dataCache.has(filename)) {
      return dataCache.get(filename);
    }

    const data = await loadDataFile(filename);
    dataCache.set(filename, data);
    return data;
  }

  function resolveEffectFlags(cfg) {
    if (!cfg) return { useScale: false, useOffset: false, useFrame: false };
    const scale = Number(cfg.Scale);
    const offsetX = Number(cfg.OffsetX || 0);
    const offsetY = Number(cfg.OffsetY || 0);
    const frameImage = cfg.FrameImage;
    
    return {
      useScale: !isNaN(scale) && scale !== 100,
      useOffset: offsetX !== 0 || offsetY !== 0,
      useFrame: frameImage && String(frameImage).trim() !== ""
    };
  }

  function checkSwitches(switchArray, requiredState) {
    if (!Array.isArray(switchArray)) return true;
    return switchArray.every((id) => $gameSwitches.value(id) === requiredState);
  }

  function normalizeOperator(op) {
    switch (op) {
      case "==":
      case "等しい（==）":
        return "==";
      case "!=":
      case "等しくない（!=）":
        return "!=";
      case ">=":
      case "以上（>=）":
        return ">=";
      case "<=":
      case "以下（<=）":
        return "<=";
      case ">":
      case "より大きい（>）":
        return ">";
      case "<":
      case "より小さい（<）":
        return "<";
      default:
        return "==";
    }
  }

  function checkVariables(variableArray) {
    if (!Array.isArray(variableArray)) return true;

    return variableArray.every((cond) => {
      const id = Number(cond.id ?? cond.Id ?? 0);
      const rawOp = cond.op ?? cond.Operator ?? "==";
      const cmp = Number(cond.value ?? cond.Value ?? 0);
      const op = normalizeOperator(rawOp);
      const v = $gameVariables.value(id);

      switch (op) {
        case "==":
          return v == cmp;
        case "!=":
          return v != cmp;
        case ">=":
          return v >= cmp;
        case "<=":
          return v <= cmp;
        case ">":
          return v > cmp;
        case "<":
          return v < cmp;
        default:
          return true;
      }
    });
  }

  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, "");
  }

  function getNonTransparentBounds(bitmap) {
    const w = bitmap.width;
    const h = bitmap.height;
    const ctx = bitmap._context;
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, w, h).data;

    let minX = w,
      minY = h,
      maxX = 0,
      maxY = 0;
    let hasVisible = false;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const alpha = imageData[i + 3];
        if (alpha > 10) {
          hasVisible = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!hasVisible) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    };
  }

  function isUserTryingFastForward(sceneInstance) {
    return _origIsFastForward.call(sceneInstance);
  }

  //=============================================================================
  // 共通イージング
  //=============================================================================

  const Easing = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
    easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    easeInOutExpo: (t) =>
      t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2,
    easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
    easeOutCirc: (t) => Math.sqrt(1 - --t * t),
    easeInOutCirc: (t) =>
      t < 0.5
        ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
        : (Math.sqrt(1 - 4 * --t * t) + 1) / 2,
    easeInBack: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    },
    easeOutBack: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * --t * t * t + c1 * t * t;
    },
    easeInOutBack: (t) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    easeInElastic: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return (
        -Math.pow(2, 10 * t - 10) *
        Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3))
      );
    },
    easeOutElastic: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return (
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) +
        1
      );
    },
    easeInOutElastic: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const c = (2 * Math.PI) / 4.5;
      return t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c)) / 2 + 1;
    },
    easeInBounce: (t) => 1 - Easing.easeOutBounce(1 - t),
    easeOutBounce: (t) => {
      const n1 = 7.5625,
        d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    },
    easeInOutBounce: (t) =>
      t < 0.5
        ? (1 - Easing.easeOutBounce(1 - 2 * t)) / 2
        : (1 + Easing.easeOutBounce(2 * t - 1)) / 2,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };

  function resolveEasing(name, fallback = "linear") {
    const fallbackKey = String(fallback || "linear").trim();
    const key = String(name || fallbackKey || "linear").trim();
    const easingFromWindow =
      (typeof window !== "undefined" && window.OnevASSISTANT && window.OnevASSISTANT.Easing) || {};
    return (
      Easing[key] ||
      easingFromWindow[key] ||
      Easing[fallbackKey] ||
      easingFromWindow[fallbackKey] ||
      Easing.linear
    );
  }

  function applyHoverEffect(sprite, config, onHoverImageChange) {
    if (!sprite || !config) return;
    if (config.UseScale && config.Scale) {
      sprite.scale.x = sprite.scale.y = config.Scale / 100;
    }

    if (config.UseOffset) {
      sprite.x += config.OffsetX || 0;
      sprite.y += config.OffsetY || 0;
    }
    if (config.UseFrame && config.FrameImage) {
      if (typeof config.onFrameImage === "function") {
        config.onFrameImage(sprite, config.FrameImage);
      }
    }

    if (config.ExtraImageSetting && onHoverImageChange) {
      onHoverImageChange(config.ExtraImageSetting);
    }
  }

  function findNearestChoiceIndex(choices, currentIndex, direction) {
    if (!choices || choices.length === 0) return currentIndex;
    const cx = choices[currentIndex].x;
    const cy = choices[currentIndex].y;
    const dirs = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const dirVec = dirs[direction];
    if (!dirVec) return currentIndex;
    let bestIndex = -1;
    let bestScore = Infinity;
    for (let i = 0; i < choices.length; i++) {
      if (i === currentIndex) continue;
      const tx = choices[i].x;
      const ty = choices[i].y;
      const dx = tx - cx;
      const dy = ty - cy;
      const dot = dx * dirVec.x + dy * dirVec.y;
      if (dot <= 0) continue;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if ((direction === "up" || direction === "down") && absDy < absDx * 0.6)
        continue;
      if (
        (direction === "left" || direction === "right") &&
        absDx < absDy * 0.6
      )
        continue;
      const distSq = dx * dx + dy * dy;
      if (distSq < bestScore) {
        bestScore = distSq;
        bestIndex = i;
      }
    }
    return bestIndex >= 0 ? bestIndex : currentIndex;
  }

  function getMousePosition() {
    return { x: TouchInput.x, y: TouchInput.y };
  }

  function isMouseOverChoice(choice, mousePos) {
    if (!choice || !mousePos) return false;
    const rect = OnevASSISTANT.getHoverHitRect
      ? OnevASSISTANT.getHoverHitRect(choice)
      : null;
    if (!rect) return false;
    return (
      mousePos.x >= rect.left &&
      mousePos.x <= rect.right &&
      mousePos.y >= rect.top &&
      mousePos.y <= rect.bottom
    );
  }

  function getWheelInput(direction, continuous = false) {
    if (!TouchInput.wheelY) return false;

    const wheelY = TouchInput.wheelY;

    if (direction === "up" && wheelY < 0) {
      return true;
    } else if (direction === "down" && wheelY > 0) {
      return true;
    }
    return false;
  }

  function getWheelInputContinuous(direction) {
    return getWheelInput(direction, true);
  }

  function getWheelInputTrigger(direction) {
    return getWheelInput(direction, false);
  }

  window.OnevASSISTANT = window.OnevASSISTANT || {};
  Object.assign(window.OnevASSISTANT, {
    safeJsonParse,
    parseDeep,
    loadDataFile,
    checkSwitches,
    checkVariables,
    applyHoverEffect,
    findNearestChoiceIndex,
    getMousePosition,
    isMouseOverChoice,
    getWheelInput,
    getWheelInputContinuous,
    getWheelInputTrigger,
    getPluginParameter,
    norm,
    Easing,
    resolveEasing,
    resolveEffectFlags,
    isUserTryingFastForward,
  });

  //======================================================================
  // タイトル画面
  //======================================================================

  const TitleSettings = window.OnevASSISTANT.safeJsonParse(
    window.OnevASSISTANT.getPluginParameter("OnevASSISTANT", "TitleSettings"),
    {}
  );


  const WindowTitleSuffix = TitleSettings.WindowTitleSuffix || "";
  if (WindowTitleSuffix) {
    const _Scene_Boot_updateDocumentTitle = Scene_Boot.prototype.updateDocumentTitle;
    Scene_Boot.prototype.updateDocumentTitle = function() {
      _Scene_Boot_updateDocumentTitle.call(this);
      document.title = $dataSystem.gameTitle + WindowTitleSuffix;
    };
  }

  const useCustomTitle =
    TitleSettings.UseCustomTitle === "true" ||
    TitleSettings.UseCustomTitle === true;

  if (useCustomTitle) {
    const ShowTitleText = TitleSettings["ShowGameTitle"] !== "false";
  const TitleBg = TitleSettings["BackgroundImage"] || "";
  const TitleChoiceBaseX = Number(TitleSettings["ChoiceXBase"] || 0);
  const TitleChoiceBaseY = Number(TitleSettings["ChoiceYBase"] || 0);
  const TitleChoices = window.OnevASSISTANT.parseDeep(
    TitleSettings["Choices"] || "[]"
  ).map((obj) => {
    const hover = window.OnevASSISTANT.safeJsonParse(obj.HoverEffect, {});
    const extraStr = hover.ExtraImageSetting;
    const extraObj = extraStr
      ? window.OnevASSISTANT.safeJsonParse(extraStr, {})
      : hover.ExtraImageSetting || null;

    const hScale = Number(hover.Scale || 100);
    const hOffsetX = Number(hover.OffsetX || 0);
    const hOffsetY = Number(hover.OffsetY || 0);
    const hFrameImage = hover.FrameImage || "";
    obj.HoverEffect = {
      UseScale: hScale !== 100,
      UseOffset: hOffsetX !== 0 || hOffsetY !== 0,
      UseFrame: hFrameImage.trim() !== "",
      HideImageOnFrame: hover.HideImageOnFrame === true || hover.HideImageOnFrame === "true",
      FrameImage: hFrameImage,
      OffsetX: hOffsetX,
      OffsetY: hOffsetY,
      Scale: hScale,
      ExtraImageSetting: extraObj,
    };
    return obj;
  });

  const TitleCursorCfg = window.OnevASSISTANT.safeJsonParse(
    TitleSettings["CursorConfig"],
    {}
  );
  const TitleCurImg = TitleCursorCfg.Image || "";
  const TitleCurOffX = Number(TitleCursorCfg.OffsetX || 0);
  const TitleCurOffY = Number(TitleCursorCfg.OffsetY || 0);
  const TitleCursorSe = window.OnevASSISTANT.safeJsonParse(
    TitleSettings["CursorSelectSE"],
    null
  );

  const TitleOkSe = window.OnevASSISTANT.safeJsonParse(
    TitleSettings["CursorOkSE"],
    null
  );

  const TitleBgm = window.OnevASSISTANT.safeJsonParse(
    TitleSettings["TitleBGM"],
    null
  );

  const DummyMapId = Number(
    window.OnevASSISTANT.getPluginParameter("OnevASSISTANT", "DummyMapId") || 2
  );

  const DummyMapX = 1;
  const DummyMapY = 1;
  const _Scene_Title_createBackground = Scene_Title.prototype.createBackground;
  Scene_Title.prototype.createBackground = function () {
    _Scene_Title_createBackground.call(this);
    if (TitleBg) {
      this._backSprite1.bitmap = ImageManager.loadBitmap(
        "img/titles1/",
        TitleBg
      );
    }
  };

  Scene_Title.prototype.drawGameTitle = function () {
    if (!ShowTitleText) return;
    const x = 20;
    const y = Graphics.height / 4;
    const maxWidth = Graphics.width - x * 2;
    const text = $dataSystem.gameTitle;
    const sprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    sprite.bitmap.outlineColor = "black";
    sprite.bitmap.outlineWidth = 8;
    sprite.bitmap.fontSize = 48;
    sprite.bitmap.drawText(text, x, y, maxWidth, 48, "center");
    this.addChild(sprite);
  };

  Scene_Title.prototype.createCommandWindow = function () {
    this._slIcons = [];
    this._slFrames = [];
    this._slExtras = [];
    this._slIndex = 0;
    this._inputMode = "keyboard";
    const initPos = window.OnevASSISTANT.getMousePosition();
    this._lastMouseX = initPos.x;
    this._lastMouseY = initPos.y;

    for (var i = 0; i < TitleChoices.length; i++) {
      var c = TitleChoices[i];
      var switchId = Number(c.ShowSwitch || 0);
      if (
        switchId > 0 &&
        !window.OnevASSISTANT.checkSwitches([switchId], true)
      ) {
        this._slIcons[i] = null;
        this._slFrames[i] = null;
        continue;
      }
      var sp = new Sprite(ImageManager.loadBitmap("img/UI/", c.Image));
      sp.anchor.set(0.5, 0.5);
      sp.x = TitleChoiceBaseX + Number(c.X || 0);
      sp.y = TitleChoiceBaseY + Number(c.Y || 0);
      sp.scale.x = sp.scale.y = Number(c.Scale || 100) / 100;

      sp._baseX = sp.x;
      sp._baseY = sp.y;
      sp._baseScale = sp.scale.x;
      (function initStaticHitRect(sprite) {
        const ax = sprite.anchor.x || 0;
        const ay = sprite.anchor.y || 0;
        const w = sprite.width || (sprite.bitmap && sprite.bitmap.width) || 0;
        const h = sprite.height || (sprite.bitmap && sprite.bitmap.height) || 0;
        const left = sprite._baseX - w * ax;
        const top = sprite._baseY - h * ay;
        sprite._hitLeft = left;
        sprite._hitTop = top;
        sprite._hitRight = left + w;
        sprite._hitBottom = top + h;
      })(sp);

      sp.targetX = sp.x;
      sp.y = sp.y;
      sp.targetScale = sp.scale.x;

      this.addChild(sp);
      this._slIcons[i] = sp;

      const hover = c.HoverEffect || {};
      if (hover.UseFrame && hover.FrameImage) {
        const fr = new Sprite(
          ImageManager.loadBitmap("img/UI/", hover.FrameImage)
        );
        fr.anchor.set(0.5, 0.5);
        fr.x = sp.x;
        fr.y = sp.y;
        fr.visible = false;
        this.addChild(fr);
        this._slFrames[i] = fr;
      } else {
        this._slFrames[i] = null;
      }

      const extra = hover.ExtraImageSetting;
      if (extra && extra.Image) {
        const ex = new Sprite(
          ImageManager.loadBitmap("img/UI/", extra.Image)
        );
        ex.anchor.set(0.5, 0.5);
        ex.x = sp.x + Number(extra.X || 0);
        ex.y = sp.y + Number(extra.Y || 0);
        ex.scale.x = ex.scale.y = sp.scale.x;
        ex.visible = false;
        this.addChild(ex);
        this._slExtras[i] = ex;
      } else {
        this._slExtras[i] = null;
      }
    }

    if (TitleCurImg) {
      this._slCursor = new Sprite(
        ImageManager.loadBitmap("img/UI/", TitleCurImg)
      );
      this._slCursor.anchor.set(0.5, 0.5);
      this.addChild(this._slCursor);
    }

    this._updateSlChoice();
    this.children = this.children.filter((sp) => !sp._onevHoverExtra);
  };

  Scene_Title.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    if (!this._slIcons) return;

    const mousePos = window.OnevASSISTANT.getMousePosition();
    if (this._lastMouseX !== mousePos.x || this._lastMouseY !== mousePos.y) {
      this._inputMode = "mouse";
      this._lastMouseX = mousePos.x;
      this._lastMouseY = mousePos.y;
    }

    const t = 0.2;

    for (let i = 0; i < this._slIcons.length; i++) {
      const sp = this._slIcons[i];
      if (!sp) continue;

      const item = TitleChoices[i];
      const hover = item.HoverEffect || {};
      const isSelected = i === this._slIndex;

      sp.targetX =
        sp._baseX + (isSelected && hover.UseOffset ? hover.OffsetX || 0 : 0);
      sp.y =
        sp._baseY + (isSelected && hover.UseOffset ? hover.OffsetY || 0 : 0);
      sp.targetScale =
        isSelected && hover.UseScale
          ? (hover.Scale || 100) / 100
          : sp._baseScale;

      sp.x += (sp.targetX - sp.x) * t;
      sp.scale.x += (sp.targetScale - sp.scale.x) * t;
      sp.scale.y += (sp.targetScale - sp.scale.y) * t;

      const fr = this._slFrames[i];
      const originalHover = item.HoverEffect || {};
      const useFrame = originalHover.UseFrame === true || originalHover.UseFrame === "true";
      if (fr) {
        fr.visible = isSelected && useFrame;
        fr.x = sp.x;
        fr.y = sp.y;
        fr.scale.x = sp.scale.x;
        fr.scale.y = sp.scale.y;
      }

      const hideOnFrame = originalHover.HideImageOnFrame === true || originalHover.HideImageOnFrame === "true";
      if (isSelected && useFrame && hideOnFrame && fr) {
        sp.opacity = 0;
      } else {
        sp.opacity = 255;
      }

      const ex = this._slExtras[i];
      if (ex) {
        ex.visible = isSelected;
        ex.x = Number(item.HoverEffect.ExtraImageSetting.X || 0);
        ex.y = Number(item.HoverEffect.ExtraImageSetting.Y || 0);
        ex.scale.x = sp.scale.x;
        ex.scale.y = sp.scale.y;
      }
    }

    if (this._slChoiceLocked) return;

    if (Input.isRepeated("down") || Input.isRepeated("up")) {
      const dir = Input.isRepeated("down") ? "down" : "up";
      this._slIndex = window.OnevASSISTANT.findNearestChoiceIndex(
        this._slIcons
          .map((sp, i) => (sp ? { x: sp.x, y: sp.y, _idx: i } : null))
          .filter(Boolean),
        this._slIndex,
        dir
      );
      this._inputMode = "keyboard";
      if (TitleCursorSe && TitleCursorSe.name)
        AudioManager.playSe(TitleCursorSe);
    }

    if (Input.isTriggered("ok")) {
      this._onSlChoiceClick(this._slIndex);
    }

    if (this._inputMode === "mouse") {
      for (let i = 0; i < this._slIcons.length; i++) {
        const sp = this._slIcons[i];
        if (!sp || !sp.bitmap || !sp.bitmap.isReady()) continue;
        const w = sp.bitmap.width * sp.scale.x;
        const h = sp.bitmap.height * sp.scale.y;
        const left = sp.x - w * 0.5;
        const top = sp.y - h * 0.5;
        if (
          mousePos.x >= left &&
          mousePos.x <= left + w &&
          mousePos.y >= top &&
          mousePos.y <= top + h
        ) {
          if (this._slIndex !== i) {
            this._slIndex = i;
            if (TitleCursorSe && TitleCursorSe.name)
              AudioManager.playSe(TitleCursorSe);
          }
          break;
        }
      }
    }
    if (TouchInput.isTriggered()) {
      const mouse = window.OnevASSISTANT.getMousePosition();
      for (let i = 0; i < this._slIcons.length; i++) {
        const sp = this._slIcons[i];
        if (!sp || !sp.bitmap || !sp.bitmap.isReady()) continue;
        const w = sp.bitmap.width * sp.scale.x;
        const h = sp.bitmap.height * sp.scale.y;
        const left = sp.x - w * 0.5;
        const top = sp.y - h * 0.5;
        if (
          mouse.x >= left &&
          mouse.x <= left + w &&
          mouse.y >= top &&
          mouse.y <= top + h
        ) {
          this._onSlChoiceClick(i);
          break;
        }
      }
    }

    this._updateSlChoice();

    if (this._pendingCommonEventId && DataManager.isMapLoaded()) {
      $gameSystem = new Game_System();
      $gameScreen = new Game_Screen();
      $gameTimer = new Game_Timer();
      $gameMessage = new Game_Message();
      $gameSwitches = new Game_Switches();
      $gameVariables = new Game_Variables();
      $gameSelfSwitches = new Game_SelfSwitches();
      $gameActors = new Game_Actors();
      $gameParty = new Game_Party();
      $gameTroop = new Game_Troop();
      $gameMap = new Game_Map();
      $gamePlayer = new Game_Player();
      $gameParty.setupStartingMembers();
      $gameMap.setup(this._pendingMapId);
      $gamePlayer.reserveTransfer(
        this._pendingMapId,
        this._pendingMapX,
        this._pendingMapY,
        2,
        0
      );
      $gamePlayer.refresh();
      $gamePlayer.setTransparent(true);
      $gameScreen.startFadeOut(0);
      $gameTemp.reserveCommonEvent(this._pendingCommonEventId);
      this._pendingCommonEventId = null;
      SceneManager.goto(Scene_Map);
    }
  };

  const TitleCurPos = TitleCursorCfg.Position || "left";

  Scene_Title.prototype._updateSlChoice = function () {
    var idx = this._slIndex;
    this._slFrames.forEach(function (fr, i) {
      if (fr) fr.visible = i === idx;
    });

    if (this._slCursor && this._slIcons[idx]) {
      var sp = this._slIcons[idx];
      var cursorX = sp.x;
      var bw = sp.bitmap ? sp.bitmap.width * sp.scale.x : 0;

      switch (TitleCurPos) {
        case "left":
          cursorX = sp.x - bw / 2;
          break;
        case "right":
          cursorX = sp.x + bw / 2;
          break;
        case "center":
        default:
          cursorX = sp.x;
          break;
      }
      this._slCursor.x = cursorX + TitleCurOffX;
      this._slCursor.y = sp.y + TitleCurOffY;
      this._slCursor.visible = true;
    }
  };

  Scene_Title.prototype._onSlChoiceClick = function (index) {
    if (this._slChoiceLocked) return;
    this._slChoiceLocked = true;
    var item = TitleChoices[index];
    if (!item || !item.Action) return;

    if (TitleOkSe && TitleOkSe.name) AudioManager.playSe(TitleOkSe);

    switch (item.Action) {
      case "newGame":
        if ($gameTemp) $gameTemp._clearPicturesOnMapStart = true;
        DataManager.setupNewGame();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
        break;
      case "continue":
        SceneManager.push(Scene_Load);
        break;
      case "options":
        SceneManager.push(Scene_Options);
        break;
      case "gameend":
        SceneManager.exit();
        break;
      case "commonEvent": {
        const id = Number(item.CommonEventId || 0);
        if (id > 0) {
          if ($gameTemp) $gameTemp._clearPicturesOnMapStart = true;
          this.fadeOutAll();
          $gameScreen._brightness = 0;
          $gameTemp._adminInterceptorType = null;
          this._pendingCommonEventId = Number(item.CommonEventId || 0);
          this._pendingCommonEventId = id;
          this._pendingMapId = DummyMapId;
          this._pendingMapX = DummyMapX;
          this._pendingMapY = DummyMapY;

          DataManager.loadMapData(DummyMapId);
        }
        break;
      }

      default:
        console.warn("未定義のアクションが指定されました:", item.Action);
    }
  };

  Scene_Title.prototype.playTitleMusic = function () {
    var bgmData;
    if (TitleBgm && TitleBgm.name) {
      bgmData = {
        name: TitleBgm.name,
        volume: Number(TitleBgm.volume || 90),
        pitch: Number(TitleBgm.pitch || 100),
        pan: Number(TitleBgm.pan || 0),
      };
    } else {
      bgmData = $dataSystem.titleBgm;
    }


    if (bgmData && bgmData.name) {
      OnevASSISTANT.crossFadeBgm({
        name: bgmData.name,
        volume: bgmData.volume || 90,
        pitch: bgmData.pitch || 100,
        pan: bgmData.pan || 0,
        fadeTime: 2000,
      });
    }
  };

  const _Scene_Title_start = Scene_Title.prototype.start;
  Scene_Title.prototype.start = function () {

    if (window.OnevASSISTANT && OnevASSISTANT.removeAllUI) {
      OnevASSISTANT.removeAllUI();
    }


    if ($gameScreen && $gameScreen.clear) {
      $gameScreen.clear();
    }


    if (window.$charCompose) {
      window.$charCompose = new CharComposeManager();
    }

    this._slChoiceLocked = false;
    if (
      typeof utakata !== "undefined" &&
      utakata.CommonSaveManager &&
      utakata.CommonSaveManager.load
    ) {
      utakata.CommonSaveManager.load();
    }
    _Scene_Title_start.call(this);
  };

  Scene_Title.prototype.isBusy = function () {
    return Scene_Base.prototype.isBusy.call(this);
  };

  if (useCustomTitle) {
    Window_TitleCommand.prototype.makeCommandList = function () {};
  }

  (function () {
    const _Game_Interpreter_setupReservedCommonEvent =
      Game_Interpreter.prototype.setupReservedCommonEvent;
    Game_Interpreter.prototype.setupReservedCommonEvent = function () {
      const result = _Game_Interpreter_setupReservedCommonEvent.call(this);
      if (result && $gameMap.mapId && $gameMap.mapId() === DummyMapId) {
        $gameScreen._brightness = 0;
      }
      return result;
    };

    const _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function () {
      _Game_Interpreter_terminate.call(this);
    };

    const _Game_Temp_reserveCommonEvent =
      Game_Temp.prototype.reserveCommonEvent;
    Game_Temp.prototype.reserveCommonEvent = function (commonEventId) {
      const result = _Game_Temp_reserveCommonEvent.call(this, commonEventId);
      return result;
    };
  })();
  }

  //======================================================================
  // UI表示関連
  //======================================================================

  const _SM_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _SM_start.call(this);


    if ($gameTemp && $gameTemp._clearPicturesOnMapStart) {
      if ($gameScreen && $gameScreen.clear) {
        $gameScreen.clear();
      } else if ($gameScreen && $gameScreen.clearPictures) {
        $gameScreen.clearPictures();
      }

      if (window.$charCompose) {
        window.$charCompose = new CharComposeManager();
      }
      $gameTemp._clearPicturesOnMapStart = false;
    }

    $gameSystem.getCustomUIs().forEach((uiName) => {
      OnevASSISTANT.createUI(uiName);
    });

    if (window.$charCompose) {
      $charCompose.list().forEach((e) => {
        composeAndShow(
          e.name,
          e.pid,
          e.x,
          e.y,
          e.scale,
          e.flip,
          e.layers,
          "通常出現",
          255,
          0,
          e.x,
          e.y,
          "linear",
          e.origin
        );
      });
    }

    if (SceneManager._forceFadeInDuration > 0) {
      this.startFadeIn(SceneManager._forceFadeInDuration, false);
      SceneManager._forceFadeInDuration = 0;
    }
    if (SceneManager._nextSceneFadeIn) {
      this.startFadeIn(30, false);
      SceneManager._nextSceneFadeIn = false;
    }

    const container = this._spriteset && this._spriteset._pictureContainer;
    if (container) {
      for (const { targetId, maskId } of window.Onev_MaskSettings || []) {
        const targetSprite = container.children.find(
          (sp) => sp._pictureId === targetId
        );
        const maskSprite = container.children.find(
          (sp) => sp._pictureId === maskId
        );
        if (targetSprite && maskSprite) {
          targetSprite.mask = maskSprite;
          maskSprite.visible = false;
        }
      }
    }

    if (window.isScreenFadedOut) {
      const fadeColor = $gameScreen.getRuleFadeColorHex
        ? $gameScreen.getRuleFadeColorHex()
        : "#000000";
      if (typeof ensureFadeOutOverlay === "function") {
        ensureFadeOutOverlay(this, fadeColor);
      }
      if (typeof hideDomFadeOverlay === "function") {
        hideDomFadeOverlay();
      }
    }

    if (window.$chatLogData && $chatLogData.wasVisible && this._chatLogWindow) {
      this._chatLogWindow.showWindow();
    }
  };
  const _SMn_terminate = Scene_Menu.prototype.terminate;
  Scene_Menu.prototype.terminate = function () {
    _SMn_terminate.call(this);
    OnevASSISTANT.redrawAllUI();
    $gameTemp._adminInterceptorType = "menuClose";
  };

  const SPRITE_PRIORITIES = {
    IMAGE: 0,
    GAUGE: 100,
    NUMBER: 300,
    CHOICE: 999,
    TEXT: 1500,
  };


  function checkOrSwitchCondition(condition) {
    if (!condition || !condition.OrSwitchIds) return true;
    let orSwitchIds = condition.OrSwitchIds;
    if (typeof orSwitchIds === "string") {
      try {
        orSwitchIds = JSON.parse(orSwitchIds);
      } catch (e) {
        return true;
      }
    }
    if (!Array.isArray(orSwitchIds) || orSwitchIds.length === 0) return true;
    const validIds = orSwitchIds.map(id => Number(id)).filter(id => id > 0);
    if (validIds.length === 0) return true;
    return validIds.some(id => $gameSwitches.value(id));
  }

  OnevASSISTANT.clickCooldown = 100;
  OnevASSISTANT.lastClickTime = 0;
  OnevASSISTANT._clickStartChoice = null;
  OnevASSISTANT._forceHideAll = false;
  OnevASSISTANT._lastCommonEventId = null;
  OnevASSISTANT._eventPausedByChoice = false;
  OnevASSISTANT._pausedInterpreter = null;
  OnevASSISTANT._choicesActive = false;
  OnevASSISTANT._lastEventStopState = false;
  OnevASSISTANT._dynamicUIConfigFile = "OnevDynamicUI.json";

  // dataフォルダのJSONからUI設定（[name,config]の配列）を読み込む。
  // NW.js/ローカル実行時のみ。失敗・未存在でもnullを返すだけで無害。
  OnevASSISTANT._loadDynamicUIConfigsFromFile = function () {
    try {
      if (!(typeof require === "function" && Utils.isNwjs())) return null;
      const fs = require("fs");
      const path = require("path");
      const base = path.dirname(process.mainModule.filename);
      const file = path.join(base, "data", OnevASSISTANT._dynamicUIConfigFile);
      if (!fs.existsSync(file)) return null;
      const arr = JSON.parse(fs.readFileSync(file, "utf8"));
      return Array.isArray(arr) ? arr : null;
    } catch (e) {
      console.warn("[OnevASSISTANT] OnevDynamicUI.json 読込失敗", e);
      return null;
    }
  };

  // キー順や空白に依存しない安定シリアライズ（内容差分の判定用）。
  OnevASSISTANT._stableStringify = function (v) {
    if (Array.isArray(v)) {
      return "[" + v.map(OnevASSISTANT._stableStringify).join(",") + "]";
    }
    if (v && typeof v === "object") {
      return (
        "{" +
        Object.keys(v)
          .sort()
          .map(
            (k) => JSON.stringify(k) + ":" + OnevASSISTANT._stableStringify(v[k])
          )
          .join(",") +
        "}"
      );
    }
    return JSON.stringify(v);
  };

  // 現在の_dynamicUIConfigsをdataフォルダのJSONへ書き出す（NW.js/ローカル時のみ）。
  // これによりUI定義はセーブではなくプロジェクト資産として保持される。
  // 重要: 内容が前回と変わっていなければ書き込まない。毎回書くと
  // ツクールMZエディタが「外部で変更されました」ポップアップを出すため。
  OnevASSISTANT.saveDynamicUIConfigsToFile = function () {
    try {
      if (!(typeof require === "function" && Utils.isNwjs())) return false;
      if (!OnevASSISTANT._dynamicUIConfigs) return false;
      const arr = Array.from(OnevASSISTANT._dynamicUIConfigs.entries());
      const stable = OnevASSISTANT._stableStringify(arr);
      // 内容に変化が無ければ書き込みをスキップ（ファイル更新→ポップアップを防止）
      if (stable === OnevASSISTANT._dynamicUIConfigsLastStable) return false;
      const fs = require("fs");
      const path = require("path");
      const base = path.dirname(process.mainModule.filename);
      const file = path.join(base, "data", OnevASSISTANT._dynamicUIConfigFile);
      fs.writeFileSync(file, JSON.stringify(arr), "utf8");
      OnevASSISTANT._dynamicUIConfigsLastStable = stable;
      console.log("[OnevASSISTANT] OnevDynamicUI.json を更新（内容変更を検出）");
      return true;
    } catch (e) {
      console.warn("[OnevASSISTANT] OnevDynamicUI.json 書込失敗", e);
      return false;
    }
  };

  // ファイルのUI設定を基準（baseline）として保持。boot時に1度だけ読み込む。
  OnevASSISTANT._baseDynamicUIConfigs =
    OnevASSISTANT._loadDynamicUIConfigsFromFile() || [];
  OnevASSISTANT._dynamicUIConfigs = new Map(OnevASSISTANT._baseDynamicUIConfigs);
  // ディスク上の内容を「前回書き込み済み」として記録 → 同一内容では書き込まない。
  OnevASSISTANT._dynamicUIConfigsLastStable = OnevASSISTANT._stableStringify(
    OnevASSISTANT._baseDynamicUIConfigs
  );
  window.OnevASSISTANT = window.OnevASSISTANT || {};
  OnevASSISTANT._dragInfo = OnevASSISTANT._dragInfo || {};
  OnevASSISTANT._activeSprites = OnevASSISTANT._activeSprites || {};
  OnevASSISTANT._activeUINames = OnevASSISTANT._activeUINames || new Set();
  const uiConfigs = OnevASSISTANT.parseDeep(parameters["UIConfigs"]);
  const testConfig = uiConfigs[0];
  window.OnevASSISTANT._activeUINames = new Set();
  OnevASSISTANT._activeSprites = OnevASSISTANT._activeSprites || {};

  const _GS_initialize = Game_System.prototype.initialize;

  Game_System.prototype._uiPositions = {};

  Game_System.prototype.setUIPosition = function (name, x, y) {
    this._uiPositions = this._uiPositions || {};
    this._uiPositions[name] = { x, y };
  };

  Game_System.prototype.getUIPosition = function (name) {
    this._uiPositions = this._uiPositions || {};
    return this._uiPositions[name] || null;
  };

  Game_System.prototype.setUIFadeCompleted = function (name, completed) {
    this._uiFadeCompleted = this._uiFadeCompleted || {};
    this._uiFadeCompleted[name] = completed;
  };

  Game_System.prototype.isUIFadeCompleted = function (name) {
    this._uiFadeCompleted = this._uiFadeCompleted || {};
    return this._uiFadeCompleted[name] === true;
  };

  Game_System.prototype.clearUIFadeCompleted = function (name) {
    this._uiFadeCompleted = this._uiFadeCompleted || {};
    delete this._uiFadeCompleted[name];
  };

  Game_System.prototype.initialize = function () {
    _GS_initialize.call(this);
    this._activeUIs = [];
  };

  Game_System.prototype.removeCustomUI = function (name) {
    this._activeUIs = this._activeUIs || [];
    const idx = this._activeUIs.indexOf(name);
    if (idx >= 0) {
      this._activeUIs.splice(idx, 1);
    }
    this.clearUIFadeCompleted(name);
  };

  Game_System.prototype.clearCustomUIs = function () {
    this._activeUIs = [];
    this._uiFadeCompleted = {};
  };

  Game_System.prototype.showCustomUI = function (name) {
    this._activeUIs = this._activeUIs || [];
    if (!this._activeUIs.includes(name)) {
      this._activeUIs.push(name);
    }
  };

  Game_System.prototype.getCustomUIs = function () {
    return this._activeUIs || [];
  };

  window.testConfig = testConfig;

  OnevASSISTANT.createUI = function (name) {
    try {
      if (OnevASSISTANT._activeUINames.has(name)) {
        const pc = SceneManager._scene?._spriteset?._pictureContainer;
        const old = OnevASSISTANT._activeSprites[name];

        if (!old || old.parent !== pc) {
          if (old && old.parent) old.parent.removeChild(old);
          delete OnevASSISTANT._activeSprites[name];
          OnevASSISTANT._activeUINames.delete(name);
        } else {
          return;
        }
      }
      const configs = OnevASSISTANT.parseDeep(parameters["UIConfigs"]);
      let target = configs.find((c) => c.Name === name);

      if (!target && OnevASSISTANT._dynamicUIConfigs.has(name)) {
        target = OnevASSISTANT._dynamicUIConfigs.get(name);
      }

      if (!target) {
        console.warn(`UI名「${name}」が見つかりません`);
        return;
      }

      const newPictureId = Number(target.PictureId || 50);
      for (const [existingName, existingSprite] of Object.entries(OnevASSISTANT._activeSprites)) {
        if (existingName !== name && existingSprite && existingSprite.z === newPictureId) {
          console.warn(`[OnevASSISTANT] 警告: ピクチャID(${newPictureId})は既にUI「${existingName}」で使用中です。既存UIを消去して置き換えます。`);
          OnevASSISTANT.removeUI(existingName);
          break;
        }
      }

      OnevASSISTANT._activeUINames.add(name);
      $gameSystem.showCustomUI(name);

      const base = OnevASSISTANT.safeJsonParse(target.UIbaseSettings);
      if (!base) {
        console.warn(`UI「${name}」のベース設定が無効です`);
        return;
      }

      const sprite = base.Baseimage
        ? new Sprite(ImageManager.loadBitmap("img/UI/", base.Baseimage))
        : new Sprite();
      sprite.sortableChildren = true;
      const pos = $gameSystem.getUIPosition(name);
      sprite.x = Number(pos?.x || target.X || 0);
      sprite.y = Number(pos?.y || target.Y || 0);
      sprite.z = Number(target.PictureId || 50);
      sprite._onevUIName = name;

      const imageSprites = OnevASSISTANT.createAndAttachImageSprites(
        sprite,
        target.ImageSprites,
        []
      );
      sprite._onevImageChildren = imageSprites;

      const switchId = Number(base.EnableSwitchId || 0);
      if (switchId > 0) {
        OnevASSISTANT._dragInfo[name] = {
          sprite: sprite,
          switchId: switchId,
          dragging: false,
          offsetX: 0,
          offsetY: 0,
        };
      }

      const pc = SceneManager._scene?._spriteset?._pictureContainer;
      if (!pc) {
        console.warn(`UI「${name}」: pictureContainerが見つかりません`);
        return;
      }
      const targetPicId = Number(target.PictureId || 50);
      let insertIdx = pc.children.length;
      for (let i = 0; i < pc.children.length; i++) {
        if (pc.children[i]._pictureId !== undefined && pc.children[i]._pictureId >= targetPicId) {
          insertIdx = i;
          break;
        }
      }
      pc.addChildAt(sprite, insertIdx);

      OnevASSISTANT._activeSprites[name] = sprite;
      const choiceSpriteData =
        typeof target.ChoiceSprites === "string"
          ? OnevASSISTANT.parseDeep(target.ChoiceSprites || "[]")
          : target.ChoiceSprites || [];
      OnevASSISTANT.createChoiceSprites(sprite, choiceSpriteData);

      const gaugeDefs =
        typeof target.GaugeSprites === "string"
          ? OnevASSISTANT.parseDeep(target.GaugeSprites || "[]")
          : target.GaugeSprites || [];
      const gaugeSprites = OnevASSISTANT.createGaugeSprites(sprite, gaugeDefs, name);
      sprite._onevGaugeChildren = gaugeSprites;

      const numberDefs =
        typeof target.NumberSprites === "string"
          ? OnevASSISTANT.parseDeep(target.NumberSprites || "[]")
          : target.NumberSprites || [];
      const numberSprites = OnevASSISTANT.createNumberSprites(sprite, numberDefs, name);
      sprite._onevNumberChildren = numberSprites;

      const textDefs =
        typeof target.TextSprites === "string"
          ? OnevASSISTANT.parseDeep(target.TextSprites || "[]")
          : target.TextSprites || [];
      const textSprites = OnevASSISTANT.createTextSprites(sprite, textDefs);
      sprite._onevTextChildren = textSprites;

      const activeIds =
        typeof target.ActiveSwitchIds === "string"
          ? OnevASSISTANT.parseDeep(target.ActiveSwitchIds || [])
          : target.ActiveSwitchIds || [];
      activeIds.forEach((id) => {
        if (+id > 0) $gameSwitches.setValue(+id, true);
      });
    } catch (e) {
      console.error(`UI「${name}」の作成中にエラー:`, e);
    }
  };

  OnevASSISTANT.updateNumberSprites = function () {
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];


      if (!root || root.destroyed || !root.transform) {
        OnevASSISTANT._activeUINames.delete(name);
        delete OnevASSISTANT._activeSprites[name];
        continue;
      }

      (root._onevNumberChildren || []).forEach((sp) => {
        if (!sp || sp.destroyed || !sp.transform) return;
        sp.update();
      });
    }
  };

  OnevASSISTANT.updateNumberFades = function () {
    const now = performance.now();
    const msPerFrame = 1000 / 60;
    
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevNumberChildren) continue;
      
      root._onevNumberChildren.forEach((sp) => {
        const cfg = sp._fadeConfig;
        if (!cfg) return;
        
        if (!sp._assetsReady || !sp._assetsReady()) return;
        
        const appearCfg = OnevASSISTANT.safeJsonParse(cfg.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(cfg.DisappearEffect || "{}");
        
        if (sp._pendingAppearEffect) {
          sp._pendingAppearEffect = false;
          const conditionNow = sp._evaluateCondition();
          if (conditionNow) {
            sp._targetVisible = false;
            sp._nextVisible = true;
          } else {
            sp._targetVisible = false;
            sp._nextVisible = false;
            sp.visible = false;
            sp.alpha = 0;
          }
        }
        
        const conditionMet = sp._evaluateCondition();
        if (sp._nextVisible !== conditionMet && !sp._fadeDelayActive && !sp._fadeTween) {
          sp._nextVisible = conditionMet;
        }
        
        if (sp._nextVisible !== sp._targetVisible && !sp._fadeDelayActive) {
          const willShow = sp._nextVisible;
          const effectCfg = willShow ? appearCfg : disappearCfg;
          const hasEffect = String(effectCfg.UseEffect) === "true" || 
            Number(effectCfg.FadeFrames) > 0 ||
            Number(effectCfg.StartScale || effectCfg.EndScale) !== 100 ||
            Number(effectCfg.StartOffsetX || effectCfg.EndOffsetX) !== 0 ||
            Number(effectCfg.StartOffsetY || effectCfg.EndOffsetY) !== 0;
          const delayFrames = Number(effectCfg.StartDelay) || 0;
          
          if (!hasEffect) {
            sp._targetVisible = willShow;
            sp.visible = willShow;
            sp.alpha = willShow ? 1 : 0;
            sp.x = sp._originalX;
            sp.y = sp._originalY;
            sp.scale.x = 1;
            sp.scale.y = 1;
            sp._fadeTween = null;
            return;
          }
          
          if (delayFrames > 0) {
            sp._fadeDelayActive = true;
            sp._fadeDelayStartTime = now;
            sp._fadeDelayDuration = delayFrames * msPerFrame;
            sp._fadePendingShow = willShow;
            if (willShow) {
              sp.visible = false;
              sp.alpha = 0;
            }
            return;
          }
          
          sp._targetVisible = willShow;
          OnevASSISTANT.startNumberFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
        }
        
        if (sp._fadeDelayActive) {
          const elapsed = now - sp._fadeDelayStartTime;
          if (elapsed >= sp._fadeDelayDuration) {
            sp._fadeDelayActive = false;
            const willShow = sp._fadePendingShow;
            sp._targetVisible = willShow;
            OnevASSISTANT.startNumberFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
          }
          return;
        }
        
        if (sp._fadeTween) {
          const tRaw = (now - sp._fadeTween.startTime) / sp._fadeTween.duration;
          const t = tRaw < 1 ? tRaw : 1;
          const easedT = sp._fadeTween.easingFunc ? sp._fadeTween.easingFunc(t) : t;
          
          sp.alpha = sp._fadeTween.from + (sp._fadeTween.to - sp._fadeTween.from) * easedT;
          
          const effectCfg = sp._fadeTween.effectCfg;
          if (effectCfg) {
            if (sp._fadeTween.willShow) {
              const startScale = Number(effectCfg.StartScale || 100) / 100;
              const curScale = startScale + (1 - startScale) * easedT;
              sp.scale.x = curScale;
              sp.scale.y = curScale;
              
              const startOffsetX = sp._fadeStartOffsetX || 0;
              const startOffsetY = sp._fadeStartOffsetY || 0;
              sp.x = sp._originalX + startOffsetX * (1 - easedT);
              sp.y = sp._originalY + startOffsetY * (1 - easedT);
            } else {
              const endScale = Number(effectCfg.EndScale || 100) / 100;
              const curScale = 1 + (endScale - 1) * easedT;
              sp.scale.x = curScale;
              sp.scale.y = curScale;
              
              const endOffsetX = Number(effectCfg.EndOffsetX || 0);
              const endOffsetY = Number(effectCfg.EndOffsetY || 0);
              sp.x = sp._originalX + endOffsetX * easedT;
              sp.y = sp._originalY + endOffsetY * easedT;
            }
          }
          
          if (t >= 1) {
            sp._fadeTween = null;
            if (sp._targetVisible) {
              sp.visible = true;
              sp.alpha = 1;
              sp.scale.x = 1;
              sp.scale.y = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
            } else {
              sp.visible = false;
              sp.alpha = 0;
              sp.scale.x = 1;
              sp.scale.y = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
            }
          } else {
            sp.visible = sp.alpha > 0;
          }
        }
      });
    }
  };
  
  OnevASSISTANT.startNumberFade = function (sp, willShow, appearCfg, disappearCfg, now, msPerFrame) {
    const effectCfg = willShow ? appearCfg : disappearCfg;
    const fadeFrames = Number(effectCfg.FadeFrames || 5);
    const duration = fadeFrames * msPerFrame;
    const easingName = effectCfg.Easing || (willShow ? "easeOutQuad" : "easeInQuad");
    const easingFunc = Easing[easingName] || Easing.linear;
    
    if (willShow) {
      sp.visible = true;
      sp.alpha = 0;
      const startScale = Number(effectCfg.StartScale || 100) / 100;
      sp.scale.x = startScale;
      sp.scale.y = startScale;
      sp._fadeStartOffsetX = Number(effectCfg.StartOffsetX || 0);
      sp._fadeStartOffsetY = Number(effectCfg.StartOffsetY || 0);
      sp.x = sp._originalX + sp._fadeStartOffsetX;
      sp.y = sp._originalY + sp._fadeStartOffsetY;
    } else {
      sp._fadeStartScale = sp.scale.x;
      sp._fadeStartX = sp.x;
      sp._fadeStartY = sp.y;
    }
    
    const from = sp.alpha;
    const to = willShow ? 1 : 0;
    
    sp._fadeTween = {
      startTime: now,
      duration,
      from,
      to,
      willShow,
      easingFunc,
      effectCfg
    };
  };

  OnevASSISTANT.updateTextSprites = function () {
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];

      if (!root || root.destroyed || !root.transform) {
        OnevASSISTANT._activeUINames.delete(name);
        delete OnevASSISTANT._activeSprites[name];
        continue;
      }

      (root._onevTextChildren || []).forEach((sp) => {
        if (!sp || sp.destroyed || !sp.transform) return;
        sp.update();
      });
    }
  };

  OnevASSISTANT.createNumberSprites = function (parentSprite, defs, uiName) {
    const list = [];
    const effectiveUiName = uiName || parentSprite._onevUIName;
    const fadeAlreadyCompleted = effectiveUiName && $gameSystem && $gameSystem.isUIFadeCompleted(effectiveUiName);
    
    defs.forEach((cfg) => {
      const sp = new Sprite_NumberVariable(cfg, parentSprite.x, parentSprite.y);
      sp.zIndex = SPRITE_PRIORITIES.NUMBER;
      sp._originalX = sp.x;
      sp._originalY = sp.y;
      sp._fadeConfig = OnevASSISTANT.safeJsonParse(cfg.FadeEffect || "{}");
      sp._fadeTween = null;
      sp._fadeDelayActive = false;
      
      const shouldShow = sp._evaluateCondition();
      const appearCfg = OnevASSISTANT.safeJsonParse(sp._fadeConfig?.AppearEffect || "{}");
      const hasAppearEffect = String(appearCfg.UseEffect) === "true" || 
        String(appearCfg.UseScale) === "true" || 
        String(appearCfg.UseOffset) === "true" || 
        Number(appearCfg.StartScale) !== 100 ||
        Number(appearCfg.StartOffsetX) !== 0 ||
        Number(appearCfg.StartOffsetY) !== 0 ||
        Number(appearCfg.FadeFrames) > 0;
      
      if (shouldShow && hasAppearEffect && !fadeAlreadyCompleted) {
        sp._nextVisible = false;
        sp._targetVisible = false;
        sp.visible = false;
        sp.alpha = 0;
        sp._pendingAppearEffect = true;
      } else {
        sp._nextVisible = shouldShow;
        sp._targetVisible = shouldShow;
        sp.visible = shouldShow;
        sp.alpha = shouldShow ? 1 : 0;
      }
      
      parentSprite.addChild(sp);
      list.push(sp);
    });
    return list;
  };

  OnevASSISTANT.createTextSprites = function (parentSprite, defs) {
    const list = [];
    const uiName = parentSprite._onevUIName;
    const fadeAlreadyCompleted = uiName && $gameSystem && $gameSystem.isUIFadeCompleted(uiName);

    defs.forEach((cfg) => {
      const sp = new Sprite_TextVariable(cfg, parentSprite.x, parentSprite.y);
      sp.zIndex = Number(cfg.Priority || 0) + SPRITE_PRIORITIES.TEXT;
      sp._originalX = sp.x;
      sp._originalY = sp.y;
      sp._fadeConfig = OnevASSISTANT.safeJsonParse(cfg.FadeEffect || "{}");
      sp._fadeTween = null;
      sp._fadeDelayActive = false;

      const shouldShow = sp._evaluateCondition();
      const appearCfg = OnevASSISTANT.safeJsonParse(sp._fadeConfig?.AppearEffect || "{}");
      const hasOffset = Number(appearCfg.StartOffsetX || 0) !== 0 || Number(appearCfg.StartOffsetY || 0) !== 0;
      const hasScale = Number(appearCfg.StartScale || 100) !== 100;
      const hasFadeFrames = Number(appearCfg.FadeFrames) > 0;
      const hasAppearEffect = hasOffset || hasScale || hasFadeFrames;

      if (shouldShow && hasAppearEffect && !fadeAlreadyCompleted) {
        sp._nextVisible = false;
        sp._targetVisible = false;
        sp.visible = false;
        sp.alpha = 0;
        sp._pendingAppearEffect = true;
      } else {
        sp._nextVisible = shouldShow;
        sp._targetVisible = shouldShow;
        sp.visible = shouldShow;
        sp.alpha = shouldShow ? 1 : 0;
      }

      parentSprite.addChild(sp);
      list.push(sp);
    });
    return list;
  };

  window.OnevASSISTANT.resetLastClickedChoice = function () {
    OnevASSISTANT._lastCommonEventId = null;
  };

  window.OnevASSISTANT.resetChoiceState = function () {
    OnevASSISTANT._lastCommonEventId = null;
    OnevASSISTANT._eventPausedByChoice = false;
    OnevASSISTANT._pausedInterpreter = null;
    OnevASSISTANT._choicesActive = false;
    OnevASSISTANT._runningCommonInterpreter = null;
    OnevASSISTANT._waitingForCommonEventId = null;
    OnevASSISTANT._unlockAllHoverLocks();
    delete OnevASSISTANT._savedEventIndex;
    delete OnevASSISTANT._savedEventWaitMode;
    delete OnevASSISTANT._savedEventWaitCount;
  };

  window.OnevASSISTANT.pauseEvent = function () {
    const interpreter =
      $gameMap && $gameMap._interpreter ? $gameMap._interpreter : null;
    if (interpreter && !OnevASSISTANT._eventPausedByChoice) {
      OnevASSISTANT._eventPausedByChoice = true;
      OnevASSISTANT._pausedInterpreter = interpreter;
      OnevASSISTANT._savedEventIndex = interpreter._index;
      OnevASSISTANT._savedEventWaitMode = interpreter._waitMode;
      OnevASSISTANT._savedEventWaitCount = interpreter._waitCount;

      interpreter._waitMode = "choice";
      interpreter._waitCount = 999999;
      OnevASSISTANT._choicesActive = true;
    }
  };

  window.OnevASSISTANT.resumeEvent = function () {
    if (
      OnevASSISTANT._eventPausedByChoice &&
      OnevASSISTANT._pausedInterpreter
    ) {
      const interpreter = OnevASSISTANT._pausedInterpreter;

      if (OnevASSISTANT._savedEventIndex !== undefined) {
        interpreter._index = OnevASSISTANT._savedEventIndex;
      }
      if (OnevASSISTANT._savedEventWaitMode !== undefined) {
        interpreter._waitMode = OnevASSISTANT._savedEventWaitMode;
      } else {
        interpreter._waitMode = "";
      }
      if (OnevASSISTANT._savedEventWaitCount !== undefined) {
        interpreter._waitCount = OnevASSISTANT._savedEventWaitCount;
      } else {
        interpreter._waitCount = 0;
      }

      OnevASSISTANT._eventPausedByChoice = false;
      OnevASSISTANT._pausedInterpreter = null;
      OnevASSISTANT._choicesActive = false;

      delete OnevASSISTANT._savedEventIndex;
      delete OnevASSISTANT._savedEventWaitMode;
      delete OnevASSISTANT._savedEventWaitCount;
    }
  };

  window.OnevASSISTANT.insertCommonEventToCurrentEvent = function (
    commonEventId
  ) {
    if (
      !OnevASSISTANT._pausedInterpreter ||
      !$dataCommonEvents[commonEventId]
    ) {
      return;
    }

    const interpreter = OnevASSISTANT._pausedInterpreter;
    const commonEvent = $dataCommonEvents[commonEventId];
    const commonCommands = commonEvent.list || [];

    if (commonCommands.length === 0) {
      OnevASSISTANT.resumeEvent();
      return;
    }

    if (!interpreter._childInterpreter) {
      interpreter._childInterpreter = new Game_Interpreter(
        interpreter._depth + 1
      );
    }

    interpreter._childInterpreter.setup(commonCommands, interpreter._eventId);

    interpreter._waitMode = "commonEvent";
  };

  OnevASSISTANT.isEventStopDisabled = function (event) {
    if (!event) {
      return false;
    }

    let eventData = null;
    if (event.event && typeof event.event === "function") {
      eventData = event.event();
    } else if (event._eventId && $dataMap && $dataMap.events) {
      eventData = $dataMap.events[event._eventId];
    }

    if (!eventData) {
      return false;
    }

    const note = eventData.note || "";

    const hasNoStopTag = note.includes("<NoStop>");

    return hasNoStopTag;
  };

  OnevASSISTANT.isInterpreterAllowedDuringChoice = function (interpreter) {
    if (!interpreter) {
      return false;
    }

    if (interpreter === OnevASSISTANT._runningCommonInterpreter) {
      return true;
    }

    let current = OnevASSISTANT._runningCommonInterpreter;
    while (current && current._childInterpreter) {
      if (interpreter === current._childInterpreter) {
        return true;
      }
      current = current._childInterpreter;
    }

    if (!interpreter._eventId && interpreter._depth === 0) {
      return true;
    }

    if (
      interpreter._eventId &&
      OnevASSISTANT.isEventStopDisabled({ _eventId: interpreter._eventId })
    ) {
      return true;
    }

    return false;
  };

  OnevASSISTANT.createAndAttachImageSprites = function (
    parentSprite,
    imageSpriteData,
    storeArray = null
  ) {
    parentSprite.sortableChildren = true;
    const imageConfigs = [];

    try {
      const rawArray = JSON.parse(imageSpriteData || "[]");
      for (const entry of rawArray) {
        try {
          const cfg = JSON.parse(entry);
          imageConfigs.push(cfg);
        } catch (e) {
          console.warn("ImageSprites設定のJSONが壊れています:", entry, e);
        }
      }
    } catch (e) {
      console.error("ImageSprites 全体のパース失敗:", imageSpriteData, e);
    }

    const children = [];

    imageConfigs.forEach((cfg) => {
      const priority = Number(cfg.Priority || 0);
      const imgSp = new Sprite(ImageManager.loadBitmap("img/UI/", cfg.Image));
      imgSp.anchor.set(0.5);
      imgSp.x = Number(cfg.OffsetX || 0);
      imgSp.y = Number(cfg.OffsetY || 0);
      imgSp._originalX = imgSp.x;
      imgSp._originalY = imgSp.y;
      imgSp.zIndex = priority + SPRITE_PRIORITIES.IMAGE;
      imgSp._fadeConfig = OnevASSISTANT.safeJsonParse(cfg.FadeEffect || "{}");
      imgSp._fadeTween = null;
      imgSp._fadeDelayActive = false;

      const showCondStr = cfg.ShowCondition || "{}";
      const prohibitCondStr = cfg.ProhibitCondition || "{}";
      imgSp._showCondStr = showCondStr;
      imgSp._prohibitCondStr = prohibitCondStr;
      const shouldShow = evaluateCondition(showCondStr);
      const shouldProhibit = hasConditionSet(prohibitCondStr) && evaluateCondition(prohibitCondStr);
      const finalVisible = shouldShow && !shouldProhibit;
      const appearCfg = OnevASSISTANT.safeJsonParse(imgSp._fadeConfig?.AppearEffect || "{}");
      const hasAppearEffect = String(appearCfg.UseOffset) === "true" || String(appearCfg.UseScale) === "true" || Number(appearCfg.FadeFrames) > 0;
      const uiName = parentSprite._onevUIName;
      const fadeAlreadyCompleted = uiName && $gameSystem && $gameSystem.isUIFadeCompleted(uiName);
      
      if (finalVisible && hasAppearEffect && !fadeAlreadyCompleted) {
        imgSp._nextVisible = false;
        imgSp._targetVisible = false;
        imgSp.visible = false;
        imgSp.alpha = 0;
        imgSp._pendingAppearEffect = true;
      } else {
        imgSp._nextVisible = finalVisible;
        imgSp._targetVisible = finalVisible;
        imgSp.visible = finalVisible;
        imgSp.alpha = finalVisible ? 1 : 0;
      }
      parentSprite.addChild(imgSp);
      children.push(imgSp);
    });

    if (storeArray) {
      storeArray.length = 0;
      storeArray.push(...children);
    }

    return children;
  };

  OnevASSISTANT.createChoiceSprites = function (parentSprite, choices) {
    let list = [];
    try {
      const arr = typeof choices === "string" ? JSON.parse(choices) : choices;
      list = arr
        .map((entry) => {
          if (typeof entry === "string") {
            try {
              return JSON.parse(entry);
            } catch (e) {
              console.warn("ChoiceSpritesの項目を解析できません:", entry, e);
              return null;
            }
          }
          return entry;
        })
        .filter(Boolean);
    } catch (e) {
      console.error("ChoiceSprites 全体のパース失敗:", choices, e);
    }

    if (!list.length) {
      return;
    }

    const choiceSprites = [];
    list.forEach((choice, i) => {
      const width = Number(choice.Width || 200);
      const height = Number(choice.Height || 48);
      const text = choice.Text || `選択肢${i + 1}`;
      let content;
      if (choice.Image) {
        content = new Sprite(ImageManager.loadBitmap("img/UI/", choice.Image));
      } else {
        const bmp = new Bitmap(width, height);
        bmp.fontSize = 22;
        bmp.drawText(text, 0, 0, width, height, "center");
        content = new Sprite(bmp);
      }
      content.anchor.set(0.5);
      const wrapper = new PIXI.Container();
      wrapper.addChild(content);
      content._originalX = 0;
      content._originalY = 0;
      Object.defineProperty(wrapper, "anchor", {
        get() {
          return content.anchor;
        },
      });

      wrapper.x = Number(choice.X || 0);
      wrapper.y = Number(choice.Y || 0);
      wrapper._originalX = wrapper.x;
      wrapper._originalY = wrapper.y;
      wrapper._choiceMeta = choice;
      wrapper._content = content;
      wrapper.zIndex = SPRITE_PRIORITIES.CHOICE;
      wrapper._fadeConfig = OnevASSISTANT.safeJsonParse(
        choice.FadeEffect || "{}"
      );
      wrapper._targetVisible = wrapper.visible;
      wrapper._nextVisible = wrapper.visible;
      wrapper._fadeTween = null;
      wrapper.alpha = wrapper.visible ? 1 : 0;
      wrapper._isHovered = false;
      wrapper._hoverState = "normal";
      wrapper.interactive = true;
      wrapper.buttonMode = true;
      wrapper.interactiveChildren = true;
      content.interactive = true;
      content.buttonMode = true;
      const ignoreTransparent = choice.IgnoreTransparent !== "false" && choice.IgnoreTransparent !== false;
      wrapper._ignoreTransparent = ignoreTransparent;
      content.containsPoint = function (point) {
        const bmp = this.bitmap;
        if (!bmp || !bmp.isReady()) {
          return PIXI.Sprite.prototype.containsPoint.call(this, point);
        }
        const local = this.worldTransform.applyInverse(point, new PIXI.Point());
        const w = this.width;
        const h = this.height;
        const left = -this.anchor.x * w;
        const top = -this.anchor.y * h;
        if (
          local.x < left ||
          local.x >= left + w ||
          local.y < top ||
          local.y >= top + h
        ) {
          return false;
        }
        if (!wrapper._ignoreTransparent) return true;
        const px = Math.floor(local.x + this.anchor.x * w);
        const py = Math.floor(local.y + this.anchor.y * h);
        const alpha = bmp.getAlphaPixel(px, py);
        return alpha > 0;
      };
      // クリック処理は updateChoiceClicks（プレス→リリース判定）に一本化。
      // 以前はここで PIXI の "pointertap" でも handleChoiceSelection を呼んでおり、
      // 1クリックで2経路が発火 → 同一コモンイベントが二重起動する原因だった。
      // プロジェクト規約（クリックはリリース発火）に合わせ pointertap 経路は廃止。
      wrapper.visible = false;
      wrapper.alpha = 0;
      wrapper._targetVisible = false;
      wrapper._nextVisible = false;
      wrapper._fadeTween = null;
      Object.defineProperty(wrapper, "width", {
        get() {
          return content.width;
        },
      });
      Object.defineProperty(wrapper, "height", {
        get() {
          return content.height;
        },
      });
      parentSprite.addChild(wrapper);
      wrapper._needInitialHitCheck = true;
      wrapper._initialHoverFlag = false;

      (function applySilentInitialHover() {
        const hoverCfg = OnevASSISTANT.safeJsonParse(
          wrapper._choiceMeta.HoverEffect
        );
        if (!hoverCfg) return;
        if (!wrapper.visible || wrapper._isEnabled === false) return;
        const content = wrapper._content;
        if (!content) return;
        const pt = new PIXI.Point(TouchInput.x, TouchInput.y);

        const tryApply = () => {
          if (!content.bitmap || !content.bitmap.isReady()) return;
          if (content.containsPoint(pt)) {
            wrapper._isHovered = true;
            OnevASSISTANT.applyHoverEffect(
              wrapper,
              hoverCfg,
               true,
               true
            );
          }
        };

        if (content.bitmap && content.bitmap.isReady()) {
          tryApply();
        } else if (content.bitmap) {
          content.bitmap.addLoadListener(() => tryApply());
        }
      })();

      const showCondStr = wrapper._choiceMeta.ShowCondition || "{}";
      const shouldShow = evaluateCondition(showCondStr);
      const appearCfg = OnevASSISTANT.safeJsonParse(wrapper._fadeConfig?.AppearEffect || "{}");
      const hasAppearEffect = String(appearCfg.UseEffect) === "true" || 
        String(appearCfg.UseScale) === "true" || 
        String(appearCfg.UseOffset) === "true" || 
        Number(appearCfg.FadeFrames) > 0;
      const enCondStr = wrapper._choiceMeta.EnableCondition || "{}";
      const isEnabled = evaluateCondition(enCondStr);
      wrapper._isEnabled = isEnabled;
      wrapper.interactive = isEnabled;
      wrapper.buttonMode = isEnabled;
      if (wrapper._content) {
        wrapper._content.interactive = isEnabled;
        wrapper._content.buttonMode = isEnabled;
      }

      if (!isEnabled && choice.DisabledImage) {
        const target = wrapper._content || wrapper;
        target.bitmap = ImageManager.loadBitmap("img/UI/", choice.DisabledImage);
      }

      const uiName = parentSprite._onevUIName;
      const fadeAlreadyCompleted = uiName && $gameSystem && $gameSystem.isUIFadeCompleted(uiName);
      
      if (shouldShow) {
        if (hasAppearEffect && !fadeAlreadyCompleted) {
          wrapper.visible = false;
          wrapper.alpha = 0;
          wrapper._targetVisible = false;
          wrapper._nextVisible = false;
          wrapper._pendingAppearEffect = true; 
        } else {
          wrapper.visible = true;
          wrapper.alpha = 1;
          wrapper._targetVisible = true;
          wrapper._nextVisible = true;
        }
      } else {
        wrapper.visible = false;
        wrapper.alpha = 0;
        wrapper._targetVisible = false;
        wrapper._nextVisible = false;
      }

      choiceSprites.push(wrapper);
    });
    parentSprite._onevChoiceChildren = choiceSprites;
  };

  OnevASSISTANT.startStandaloneCommonEvent = function (commonEventId) {
    const ceId = Number(commonEventId || 0);
    if (ceId <= 0) return false;

    const commonEvent = $dataCommonEvents ? $dataCommonEvents[ceId] : null;
    if (!commonEvent || !Array.isArray(commonEvent.list)) {
      return false;
    }

    if (!commonEvent.list.length) {
      return false;
    }

    const interpreter = new Game_Interpreter();
    interpreter.setup(commonEvent.list, 0);
    OnevASSISTANT._runningCommonInterpreter = interpreter;
    return true;
  };

  OnevASSISTANT.handleChoiceSelection = function (choiceSprite, triggeredAt) {
    if (!choiceSprite) return false;

    if (choiceSprite._isEnabled === false) return false;

    if (choiceSprite._fadeTween || choiceSprite._fadeDelayActive || 
        choiceSprite._nextVisible !== choiceSprite._targetVisible) {
      return false;
    }

    const choice = choiceSprite._choiceMeta || {};
    const ceId = Number(choice.CommonEventId || 0);

    const resumeOnClick =
      choice.ResumeOnClick !== undefined
        ? choice.ResumeOnClick === "true" || choice.ResumeOnClick === true
        : true;

    if (
      ceId > 0 &&
      OnevASSISTANT._lastCommonEventId &&
      OnevASSISTANT._lastCommonEventId === ceId
    ) {
      return false;
    }

    const stamp =
      typeof triggeredAt === "number" ? triggeredAt : performance.now();
    OnevASSISTANT.lastClickTime = stamp;

    const clickCfg = choice.ClickEffect
      ? OnevASSISTANT.safeJsonParse(choice.ClickEffect)
      : null;
    if (clickCfg) {
      OnevASSISTANT.applyClickEffect(choiceSprite, clickCfg);
    }

    const switchId = Number(choice.SwitchId || 0);
    if (switchId > 0) {
      $gameSwitches.setValue(switchId, true);
    }

    if (ceId > 0) {
      if (
        OnevASSISTANT._eventPausedByChoice &&
        OnevASSISTANT._pausedInterpreter &&
        resumeOnClick
      ) {
        choiceSprite._hoverLocked = true;
        OnevASSISTANT._lockedHoverSprites =
          OnevASSISTANT._lockedHoverSprites || new Set();
        OnevASSISTANT._lockedHoverSprites.add(choiceSprite);
        OnevASSISTANT._lastCommonEventId = ceId;

        const parentInterpreter = OnevASSISTANT._pausedInterpreter;

        if ($gameMap && $gameMap._events) {
          $gameMap._events.forEach((event) => {
            if (
              event &&
              event._interpreter &&
              event._interpreter._waitMode === "choice"
            ) {
              if (!OnevASSISTANT.isEventStopDisabled(event)) {
                event._interpreter._waitMode = "";
                event._interpreter._waitCount = 0;
              }
            }
          });
        }

        OnevASSISTANT._choicesActive = false;

        const commonEvent = $dataCommonEvents[ceId];
        if (commonEvent) {
          const commonInterpreter = new Game_Interpreter();
          commonInterpreter.setup(commonEvent.list, 0);

          OnevASSISTANT._runningCommonInterpreter = commonInterpreter;

          parentInterpreter._waitMode = "commonEventComplete";
          parentInterpreter._waitingCommonEventId = ceId;
          OnevASSISTANT._pausedInterpreter = parentInterpreter;
          OnevASSISTANT._waitingForCommonEventId = ceId;
        }
      } else {
        OnevASSISTANT._lastCommonEventId = ceId;

        if ($gameTemp && $gameTemp.reserveCommonEvent) {
          $gameTemp.reserveCommonEvent(ceId);
        }
      }

      if ($gameScreen && $gameScreen.startFadeIn) {
        $gameScreen.startFadeIn(1);
      }
    } else {
      if (resumeOnClick && OnevASSISTANT._eventPausedByChoice) {
        OnevASSISTANT.resumeEvent();
      }
    }

    return true;
  };

  OnevASSISTANT._unlockAllHoverLocks = function () {
    if (!OnevASSISTANT._lockedHoverSprites) return;
    for (const sp of OnevASSISTANT._lockedHoverSprites) {
      if (!sp) continue;
      sp._hoverLocked = false;
      OnevASSISTANT.clearHoverEffect(sp, true);
    }
    OnevASSISTANT._lockedHoverSprites.clear();
  };

  OnevASSISTANT.choiceStopEventEnabled = function (choiceMeta) {
    if (!choiceMeta) return false;

    const value = choiceMeta.StopEvent;

    if (value === undefined || value === null) {
      return false;  
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value !== 0;
    }

    const normalized = String(value).trim().toLowerCase();
    return !["false", "0", "off"].includes(normalized);
  };

  OnevASSISTANT.applyHoverEffect = function (
    sprite,
    config,
    isChoiceMode = false,
    muteSe = false
  ) {
    if (!sprite || !config) return;

    const target = sprite._content || sprite;

    if (target._originalX != null && target._originalY != null) {
      target.x = target._originalX;
      target.y = target._originalY;
    }

    const flags = OnevASSISTANT.resolveEffectFlags(config);
    const useScale = flags.useScale;
    const useOffset = flags.useOffset;
    const targetScale = useScale ? (+config.Scale || 100) / 100 : 1;
    const offsetX = useOffset ? +config.OffsetX || 0 : 0;
    const offsetY = useOffset ? +config.OffsetY || 0 : 0;
    const entryEasingName =
      config.EntryEasing || config.Easing || "easeOutBack";
    const entryEasing = OnevASSISTANT.resolveEasing
      ? OnevASSISTANT.resolveEasing(entryEasingName, "easeOutBack")
      : OnevASSISTANT.Easing.easeOutBack;

    target._hoverState = "hovered";
    target._hoverTween = {
      startTime: performance.now(),
      duration: +config.EntryDuration || 200,
      fromScale: target.scale.x,
      toScale: targetScale,
      fromX: target._originalX ?? target.x,
      fromY: target._originalY ?? target.y,
      offsetX,
      offsetY,
      phase: "entry",
      easing: entryEasing,
    };

    const keepOriginal = config.KeepOriginalImage !== "false" && config.KeepOriginalImage !== false;
    if (!keepOriginal) {
      target._hoverHiddenOriginal = true;
      if (target._texture && !target._savedTexture) {
        target._savedTexture = target._texture;
        target.texture = PIXI.Texture.EMPTY;
      }
    }

    if (config.HoverSE && !muteSe) {
      let hoverSeData = config.HoverSE;
      if (typeof hoverSeData === "string") {
        hoverSeData = OnevASSISTANT.safeJsonParse(hoverSeData, null);
      }
      const seName = hoverSeData && hoverSeData.name
        ? String(hoverSeData.name).replace(/\.\w+$/, "")
        : (typeof config.HoverSE === "string" ? String(config.HoverSE).replace(/\.\w+$/, "") : "");
      if (seName && sprite._suppressSEOnFirstEnter) {
        sprite._suppressSEOnFirstEnter = false;
      } else if (seName) {
        AudioManager.playSe({
          name: seName,
          volume: hoverSeData && hoverSeData.volume != null ? Number(hoverSeData.volume) : 90,
          pitch: hoverSeData && hoverSeData.pitch != null ? Number(hoverSeData.pitch) : 100,
          pan: hoverSeData && hoverSeData.pan != null ? Number(hoverSeData.pan) : 0
        });
      }
    }

    if (config.HoverScript && String(config.HoverScript).trim()) {
      try {
        const scriptCode = String(config.HoverScript);
        const executeScript = new Function(
          "$gameVariables",
          "$gameSwitches",
          "$gameActors",
          "$gameParty",
          "$gamePlayer",
          "$gameMap",
          "$gameScreen",
          "$gameTemp",
          scriptCode
        );
        executeScript(
          $gameVariables,
          $gameSwitches,
          $gameActors,
          $gameParty,
          $gamePlayer,
          $gameMap,
          $gameScreen,
          $gameTemp
        );
      } catch (error) {
        console.warn("[OnevASSISTANT] ホバースクリプト実行エラー:", error);
        console.warn("スクリプト内容:", config.HoverScript);
      }
    }

    let extraCfgList = [];
    if (config.ExtraImageSetting) {
      const parsed = OnevASSISTANT.safeJsonParse(config.ExtraImageSetting);
      if (Array.isArray(parsed)) {
        extraCfgList = parsed.map(item => typeof item === 'string' ? OnevASSISTANT.safeJsonParse(item) : item).filter(Boolean);
      } else if (parsed && parsed.Image) {
        extraCfgList = [parsed];
      }
    }

    if (extraCfgList.length > 0) {
      if (target._hoverExtraImages && target._hoverExtraImages.length > 0) {
        for (const oldImg of target._hoverExtraImages) {
          if (oldImg && !oldImg._destroyed) {
            const oldParent = oldImg.parent;
            if (oldParent) {
              oldParent.removeChild(oldImg);
            }
            oldImg.destroy({ children: true, texture: false });
          }
        }
        target._hoverExtraImages = [];
      }
      if (target._hoverExtraImage && !target._hoverExtraImage._destroyed) {
        const oldParent = target._hoverExtraImage.parent;
        if (oldParent) {
          oldParent.removeChild(target._hoverExtraImage);
        }
        target._hoverExtraImage.destroy({ children: true, texture: false });
        target._hoverExtraImage = null;
      } else if (target._hoverExtraImage) {
        target._hoverExtraImage = null;
      }

      const validConfigs = extraCfgList.filter(extraCfg => {
        if (!extraCfg || !extraCfg.Image) return false;
        const showCondStr = extraCfg.ShowCondition || "{}";
        const result = evaluateCondition(showCondStr);
        return result;
      });

      const pictureIdMap = new Map();
      for (let i = 0; i < validConfigs.length; i++) {
        const cfg = validConfigs[i];
        const pid = +cfg.PictureId || 0;
        if (pictureIdMap.has(pid)) {
          console.warn(`[OnevASSISTANT] 警告: 同じピクチャID(${pid})が複数設定されています。最後の設定のみ表示されます。`);
        }
        pictureIdMap.set(pid, cfg);
      }

      const finalConfigs = Array.from(pictureIdMap.values());

      target._hoverExtraImages = [];
      target._hoverExtraHideOnExitList = [];

      for (const extraCfg of finalConfigs) {
        const bmp = ImageManager.loadBitmap("img/UI/", extraCfg.Image);
        const sp = new Sprite(bmp);
        sp.anchor.set(0.5, 0.5);
        sp._isHoverExtraImage = true;
        sp._showCondition = extraCfg.ShowCondition || "{}";
        
        const pictureId = +extraCfg.PictureId || 0;
        const useAbsolute = String(extraCfg.UseAbsolutePosition) === "true";
        const posX = +extraCfg.X || 0;
        const posY = +extraCfg.Y || 0;
        
        if (pictureId > 0) {
          const scene = SceneManager._scene;
          const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;
          if (pc) {
            for (let i = pc.children.length - 1; i >= 0; i--) {
              const child = pc.children[i];
              if (child && !child._destroyed &&
                  child._isHoverExtraImage && 
                  child._hoverPictureId === pictureId && 
                  child._hoverExtraOwner !== target) {
                if (child._hoverExtraOwner && child._hoverExtraOwner._hoverExtraImages) {
                  const idx = child._hoverExtraOwner._hoverExtraImages.indexOf(child);
                  if (idx >= 0) {
                    child._hoverExtraOwner._hoverExtraImages.splice(idx, 1);
                    if (child._hoverExtraOwner._hoverExtraHideOnExitList) {
                      child._hoverExtraOwner._hoverExtraHideOnExitList.splice(idx, 1);
                    }
                  }
                }
                pc.removeChild(child);
                child.destroy({ children: true, texture: false });
              }
            }
            
            if (useAbsolute) {
              sp.x = posX;
              sp.y = posY;
            } else {
              const globalPos = target.getGlobalPosition();
              sp.x = globalPos.x + posX;
              sp.y = globalPos.y + posY;
            }
            
            let insertIndex = pc.children.length;
            for (let i = 0; i < pc.children.length; i++) {
              const child = pc.children[i];
              if (child._pictureId !== undefined && child._pictureId >= pictureId) {
                insertIndex = i;
                break;
              }
              if (child._hoverPictureId !== undefined && child._hoverPictureId >= pictureId) {
                insertIndex = i;
                break;
              }
            }
            
            sp._hoverPictureId = pictureId;
            sp._hoverExtraOwner = target; 
            pc.addChildAt(sp, insertIndex);
          } else {
            if (useAbsolute) {
              const uiRoot = sprite.parent;
              if (uiRoot) {
                sp.x = posX;
                sp.y = posY;
                uiRoot.addChild(sp);
              } else {
                sp.x = posX;
                sp.y = posY;
                sprite.addChild(sp);
              }
            } else {
              sp.x = posX;
              sp.y = posY;
              sprite.addChild(sp);
            }
          }
        } else {
          if (useAbsolute) {
            const uiRoot = sprite.parent;
            if (uiRoot) {
              sp.x = posX;
              sp.y = posY;
              uiRoot.addChild(sp);
            } else {
              sp.x = posX;
              sp.y = posY;
              sprite.addChild(sp);
            }
          } else {
            sp.x = posX;
            sp.y = posY;
            sprite.addChild(sp);
          }
        }
        
        target._hoverExtraImages.push(sp);
        const hideOnExit = extraCfg.HideOnHoverExit;
        target._hoverExtraHideOnExitList.push(hideOnExit === undefined || hideOnExit === null || String(hideOnExit) === "true" || hideOnExit === true);
      }

      if (target._hoverExtraImages.length > 0) {
        target._hoverExtraImage = target._hoverExtraImages[target._hoverExtraImages.length - 1];
        target._hoverExtraHideOnExit = target._hoverExtraHideOnExitList[target._hoverExtraHideOnExitList.length - 1];
      }
    }

    if (!flags.useFrame || !config.FrameImage) return;

    target._hoverReqId = (target._hoverReqId || 0) + 1;
    const myReqId = target._hoverReqId;

    const bmp = ImageManager.loadBitmap("img/UI/", config.FrameImage);
    if (bmp.isReady()) {
      drawFrameIfAlive();
    } else {
      bmp.addLoadListener(drawFrameIfAlive);
    }

    function drawFrameIfAlive() {
      if (target._hoverState !== "hovered") return;
      if (target._hoverReqId !== myReqId) return;

      const sheetCfg =
        OnevASSISTANT.safeJsonParse(config.SpriteSheet || "{}") || {};
      const offX = +(sheetCfg.OffsetX || 0);
      const offY = +(sheetCfg.OffsetY || 0);
      const useSheet = String(sheetCfg.UseSpriteSheet) === "true";
      const loopFlag = String(sheetCfg.Loop) !== "false";
      let frameSp;

      if (useSheet) {
        const cols = +(sheetCfg.FrameCols || 1);
        const rows = +(sheetCfg.FrameRows || 1);
        const fw = bmp.width / cols;
        const fh = bmp.height / rows;

        const makeTex = (idx) =>
          new PIXI.Texture(
            bmp.baseTexture,
            new PIXI.Rectangle(
              (idx % cols) * fw,
              Math.floor(idx / cols) * fh,
              fw,
              fh
            )
          );

        if (String(sheetCfg.UseAnimation) === "true") {
          const s = +(sheetCfg.StartIndex || 0);
          const e = +(sheetCfg.EndIndex || cols * rows - 1);
          const tex = [];
          for (let i = s; i <= e; i++) tex.push(makeTex(i));

          frameSp = new PIXI.AnimatedSprite(tex);
          const interval = Math.max(+sheetCfg.Interval || 6, 1);
          frameSp.animationSpeed = 1 / interval;
          frameSp.loop = loopFlag;
          frameSp.play();

          if (!loopFlag) {
            frameSp.onComplete = () => frameSp.gotoAndStop(tex.length - 1);
          }
        } else {
          frameSp = new Sprite(bmp);
          const idx = +(sheetCfg.FrameIndex || 0);
          frameSp.setFrame(
            (idx % cols) * fw,
            Math.floor(idx / cols) * fh,
            fw,
            fh
          );
        }
      } else {
        frameSp = new Sprite(bmp);
      }

      frameSp.anchor.set(0.5);
      frameSp.x += offX;
      frameSp.y += offY;
      if (target._hoverFrame && !target._hoverFrame._destroyed) {
        try { if (typeof target._hoverFrame.stop === "function") target._hoverFrame.stop(); } catch (_) {}
        if (target._hoverFrame.parent) {
          target._hoverFrame.parent.removeChild(target._hoverFrame);
        }
        target._hoverFrame.destroy({ children: true, texture: false, baseTexture: false });
        target._hoverFrame = null;
      }
      target.addChild(frameSp);
      target._hoverFrame = frameSp;
    }
  };

  OnevASSISTANT.clearHoverEffect = function (sprite, force) {
    const target = sprite._content || sprite;

    if (sprite._hoverLocked && !force) {
      return;
    }

    target._hoverState = "normal";
    target.scale.set(1, 1);
    if (target._originalX != null && target._originalY != null) {
      target.x = target._originalX;
      target.y = target._originalY;
    }

    if (target._hoverHiddenOriginal) {
      if (target._savedTexture) {
        target.texture = target._savedTexture;
        delete target._savedTexture;
      }
      target._hoverHiddenOriginal = false;
    }

    if (target._hoverFrame) {
      if (!target._hoverFrame._destroyed) {
        target.removeChild(target._hoverFrame);
        target._hoverFrame.destroy({ children: true, texture: false });
      }
      target._hoverFrame = null;
    }

    if (target._hoverExtraImages && target._hoverExtraImages.length > 0) {
      const hideList = target._hoverExtraHideOnExitList || [];
      const remainingImages = [];
      const remainingHideFlags = [];
      
      for (let i = 0; i < target._hoverExtraImages.length; i++) {
        const img = target._hoverExtraImages[i];
        const shouldHide = hideList[i] !== false; 
        
        if (shouldHide) {
          if (img && !img._destroyed) {
            const imgParent = img.parent;
            if (imgParent) {
              imgParent.removeChild(img);
            }
            img.destroy({ children: true, texture: false });
          }
        } else {
          remainingImages.push(img);
          remainingHideFlags.push(false);
        }
      }
      
      target._hoverExtraImages = remainingImages;
      target._hoverExtraHideOnExitList = remainingHideFlags;
      
      if (remainingImages.length > 0) {
        target._hoverExtraImage = remainingImages[remainingImages.length - 1];
        target._hoverExtraHideOnExit = false;
      } else {
        target._hoverExtraImage = null;
        target._hoverExtraHideOnExit = undefined;
      }
    } else if (target._hoverExtraImage) {
      if (target._hoverExtraHideOnExit === true) {
        if (!target._hoverExtraImage._destroyed) {
          const imgParent = target._hoverExtraImage.parent;
          if (imgParent) {
            imgParent.removeChild(target._hoverExtraImage);
          }
          target._hoverExtraImage.destroy({ children: true, texture: false });
        }
        target._hoverExtraImage = null;
        target._hoverExtraHideOnExit = undefined;
        target._hoverExtraPictureId = undefined;
      }
    }

    delete target._hoverTween;
  };

  OnevASSISTANT.resetHoverEffect = function (sprite, cfg) {
    const target = sprite._content || sprite;
    const flags = OnevASSISTANT.resolveEffectFlags(cfg);

    if (flags.useScale) {
      target.scale.set(1, 1);
    }
    if (flags.useOffset) {
      target.x -= Number(cfg.OffsetX || 0);
      target.y -= Number(cfg.OffsetY || 0);
    }
    if (flags.useFrame && target._hoverFrame) {
      target.removeChild(target._hoverFrame);
      target._hoverFrame = null;
    }
  };

  OnevASSISTANT.applyClickEffect = function (sprite, config) {
    if (!sprite || !config) return;

    const cfg = typeof config === "string" ? OnevASSISTANT.safeJsonParse(config) : config;
    if (!cfg) return;

    const target = sprite._content || sprite;
    const flags = OnevASSISTANT.resolveEffectFlags(cfg);

    const useScale = flags.useScale;
    const useOffset = flags.useOffset;
    const targetScale = useScale ? (+cfg.Scale || 110) / 100 : 1;
    const offsetX = useOffset ? +cfg.OffsetX || 0 : 0;
    const offsetY = useOffset ? +cfg.OffsetY || 0 : 0;
    const duration = +cfg.Duration || 15;
    const entryEasingName = cfg.Easing || cfg.EntryEasing || "easeOutQuad";
    const exitEasingName = cfg.ExitEasing || "easeOutQuad";

    let entryEasing, exitEasing;
    if (OnevASSISTANT.resolveEasing) {
      entryEasing = OnevASSISTANT.resolveEasing(entryEasingName, "easeOutQuad");
      exitEasing = OnevASSISTANT.resolveEasing(exitEasingName, "easeOutQuad");
    } else if (OnevASSISTANT.Easing) {
      entryEasing = OnevASSISTANT.Easing[entryEasingName] || OnevASSISTANT.Easing.easeOutQuad || function(t) { return t; };
      exitEasing = OnevASSISTANT.Easing[exitEasingName] || OnevASSISTANT.Easing.easeOutQuad || function(t) { return t; };
    } else {
      entryEasing = exitEasing = function(t) { return t; };
    }

    if (cfg.ClickSE) {
      const seName = String(cfg.ClickSE).replace(/\.\w+$/, "");
      AudioManager.playSe({ name: seName, volume: 90, pitch: 100, pan: 0 });
    }

    const startScale = target.scale.x;
    const startX = target.x;
    const startY = target.y;
    const originalX = target._originalX ?? target.x;
    const originalY = target._originalY ?? target.y;

    target._clickState = "clicking";
    target._clickTween = {
      startTime: performance.now(),
      duration: duration * (1000 / 60),
      fromScale: startScale,
      toScale: targetScale,
      fromX: startX,
      fromY: startY,
      originalX: originalX,
      originalY: originalY,
      offsetX,
      offsetY,
      phase: "entry",
      entryEasing: entryEasing,
      exitEasing: exitEasing,
    };

    if (flags.useFrame && cfg.FrameImage) {
      target._clickReqId = (target._clickReqId || 0) + 1;
      const myReqId = target._clickReqId;

      const bmp = ImageManager.loadBitmap("img/UI/", cfg.FrameImage);
      const drawClickFrame = () => {
        if (target._clickState !== "clicking") return;
        if (target._clickReqId !== myReqId) return;

        const sheetCfg =
          OnevASSISTANT.safeJsonParse(cfg.SpriteSheet || "{}") || {};
        const offX = +(sheetCfg.OffsetX || 0);
        const offY = +(sheetCfg.OffsetY || 0);
        const useSheet = String(sheetCfg.UseSpriteSheet) === "true";
        const loopFlag = String(sheetCfg.Loop) !== "false";
        let frameSp;

        if (useSheet) {
          const cols = +(sheetCfg.FrameCols || 1);
          const rows = +(sheetCfg.FrameRows || 1);
          const fw = bmp.width / cols;
          const fh = bmp.height / rows;

          const makeTex = (idx) =>
            new PIXI.Texture(
              bmp.baseTexture,
              new PIXI.Rectangle(
                (idx % cols) * fw,
                Math.floor(idx / cols) * fh,
                fw,
                fh
              )
            );

          if (String(sheetCfg.UseAnimation) === "true") {
            const s = +(sheetCfg.StartIndex || 0);
            const e = +(sheetCfg.EndIndex || cols * rows - 1);
            const tex = [];
            for (let i = s; i <= e; i++) tex.push(makeTex(i));

            frameSp = new PIXI.AnimatedSprite(tex);
            const interval = Math.max(+sheetCfg.Interval || 6, 1);
            frameSp.animationSpeed = 1 / interval;
            frameSp.loop = loopFlag;
            frameSp.play();

            if (!loopFlag) {
              frameSp.onComplete = () => frameSp.gotoAndStop(tex.length - 1);
            }
          } else {
            frameSp = new Sprite(bmp);
            const idx = +(sheetCfg.FrameIndex || 0);
            frameSp.setFrame(
              (idx % cols) * fw,
              Math.floor(idx / cols) * fh,
              fw,
              fh
            );
          }
        } else {
          frameSp = new Sprite(bmp);
        }

        frameSp.anchor.set(0.5);
        frameSp.x += offX;
        frameSp.y += offY;
        target.addChild(frameSp);
        target._clickFrame = frameSp;
      };

      if (bmp.isReady()) {
        drawClickFrame();
      } else {
        bmp.addLoadListener(drawClickFrame);
      }
    }
  };

  OnevASSISTANT.clearClickEffect = function (sprite) {
    const target = sprite._content || sprite;

    target._clickState = "normal";

    if (target._clickFrame) {
      target.removeChild(target._clickFrame);
      target._clickFrame.destroy({ children: true, texture: false });
      target._clickFrame = null;
    }

    delete target._clickTween;
  };

  OnevASSISTANT.updateClickTween = function (sprite) {
    const target = sprite._content || sprite;
    const tween = target._clickTween;
    if (!tween) return;

    const now = performance.now();
    const elapsed = now - tween.startTime;
    const progress = Math.min(elapsed / tween.duration, 1);
    const easingFunc = tween.phase === "entry" 
      ? (tween.entryEasing || tween.easing || function(t) { return t; })
      : (tween.exitEasing || tween.easing || function(t) { return t; });
    const eased = easingFunc(progress);

    if (tween.phase === "entry") {
      const scale = tween.fromScale + (tween.toScale - tween.fromScale) * eased;
      target.scale.set(scale, scale);

      const x = tween.fromX + tween.offsetX * eased;
      const y = tween.fromY + tween.offsetY * eased;
      target.x = x;
      target.y = y;

      if (progress >= 1) {
        tween.phase = "exit";
        tween.startTime = now;
        tween.fromScale = target.scale.x;
        tween.fromX = target.x;
        tween.fromY = target.y;
        tween.toScale = 1;
      }
    } else if (tween.phase === "exit") {
      const scale = tween.fromScale + (tween.toScale - tween.fromScale) * eased;
      target.scale.set(scale, scale);

      const x = tween.fromX + (tween.originalX - tween.fromX) * eased;
      const y = tween.fromY + (tween.originalY - tween.fromY) * eased;
      target.x = x;
      target.y = y;

      if (progress >= 1) {
        OnevASSISTANT.clearClickEffect(sprite);
      }
    }
  };

  OnevASSISTANT.updateAllClickEffects = function () {
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevChoiceChildren) continue;

      for (const sp of root._onevChoiceChildren) {
        const target = sp._content || sp;
        if (target._clickTween) {
          OnevASSISTANT.updateClickTween(sp);
        }
      }
    }
  };

  OnevASSISTANT.isPixelTransparent = function (sprite, localX, localY) {
    if (!sprite || !sprite.bitmap || !sprite.bitmap.isReady()) return true;

    const bitmap = sprite.bitmap;
    const canvas = bitmap.canvas || bitmap._canvas;
    if (!canvas) return true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    const bitmapX = Math.floor(localX);
    const bitmapY = Math.floor(localY);

    if (
      bitmapX < 0 ||
      bitmapX >= bitmap.width ||
      bitmapY < 0 ||
      bitmapY >= bitmap.height
    ) {
      return true;
    }

    try {
      const imageData = ctx.getImageData(bitmapX, bitmapY, 1, 1);
      const alpha = imageData.data[3];

      return alpha === 0;
    } catch (e) {
      return false;
    }
  };

  OnevASSISTANT.updateHoverStates = function () {
    OnevASSISTANT.updateAllClickEffects();

    if (
      $gameMap.isEventRunning &&
      $gameMap.isEventRunning() &&
      !OnevASSISTANT._eventPausedByChoice
    ) {
      return;
    }

    if (!OnevASSISTANT.getHoverHitRect) {
      OnevASSISTANT.getHoverHitRect = function (sp) {
        if (!sp) return null;
        const baseX = sp._baseX != null ? sp._baseX : sp.x;
        const baseY = sp._baseY != null ? sp._baseY : sp.y;
        let gx = baseX;
        let gy = baseY;
        if (sp.parent && sp.parent.toGlobal) {
          const pt = new PIXI.Point(baseX, baseY);
          const gpt = sp.parent.toGlobal(pt);
          gx = gpt.x;
          gy = gpt.y;
        }
        const w =
          sp._baseWidth != null
            ? sp._baseWidth
            : sp.width || (sp.bitmap && sp.bitmap.width) || 0;
        const h =
          sp._baseHeight != null
            ? sp._baseHeight
            : sp.height || (sp.bitmap && sp.bitmap.height) || 0;
        const ax = sp.anchor?.x ?? 0.5;
        const ay = sp.anchor?.y ?? 0.5;
        const left = gx - w * ax;
        const top = gy - h * ay;
        return { left, top, right: left + w, bottom: top + h };
      };
    }
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevChoiceChildren) continue;

      for (const sp of root._onevChoiceChildren) {
        const cfg = sp._choiceMeta;
        if (!cfg || (!cfg.HoverEffect && !cfg.HoverIndexNumber)) continue;
        if (sp._fadeTween) continue;
        if (sp._nextVisible !== sp._targetVisible) continue;
        if (sp._fadeDelayActive) continue;

        const sprite = sp._content || sp;
        if (
          sp._hoverBaseReady !== true &&
          sprite.bitmap &&
          sprite.bitmap.isReady()
        ) {
          const ax = sprite.anchor?.x ?? 0.5;
          const ay = sprite.anchor?.y ?? 0.5;
          const w = sprite.width || sprite.bitmap.width;
          const h = sprite.height || sprite.bitmap.height;
          const baseX = sp._baseX != null ? sp._baseX : sp.x;
          const baseY = sp._baseY != null ? sp._baseY : sp.y;
          sp._hitLeft = baseX - w * ax;
          sp._hitTop = baseY - h * ay;
          sp._hitRight = sp._hitLeft + w;
          sp._hitBottom = sp._hitTop + h;
          sp._hoverBaseReady = true;
        }

        let hit = false;
        const rect = OnevASSISTANT.getHoverHitRect(sp);
        if (rect) {
          const mx = TouchInput.x;
          const my = TouchInput.y;
          hit =
            mx >= rect.left &&
            mx <= rect.right &&
            my >= rect.top &&
            my <= rect.bottom;

          if (hit && sp._ignoreTransparent !== false) {
            const sprite = sp._content || sp;
            if (sprite.bitmap && sprite.bitmap.isReady()) {
              const ax = sprite.anchor?.x ?? 0.5;
              const ay = sprite.anchor?.y ?? 0.5;
              const w = sprite.width || sprite.bitmap.width;
              const h = sprite.height || sprite.bitmap.height;
              const localX = mx - rect.left;
              const localY = my - rect.top;
              const bitmapX = localX;
              const bitmapY = localY;

              if (OnevASSISTANT.isPixelTransparent(sprite, bitmapX, bitmapY)) {
                hit = false;
              }
            }
          }
        }

        let wasHovered = sp._isHovered;
        sp._isHovered = hit;

        if (sp._needInitialHitCheck) {
          sp._needInitialHitCheck = false;
          if (hit) {
            sp._suppressSEOnFirstEnter = true;
            sp._initialHoverFlag = true;
            sp._initialSilentHover = true;
            const hoverConfig = OnevASSISTANT.safeJsonParse(
              sp._choiceMeta.HoverEffect
            );
            if (hoverConfig && sp.visible && sp._isEnabled !== false) {
              OnevASSISTANT.applyHoverEffect(
                sp,
                hoverConfig,
                 true,
                 true
              );
            }
            sp._isHovered = true;
            wasHovered = true;
            continue;
          } else {
            sp._suppressSEOnFirstEnter = false;
            sp._initialHoverFlag = false;
          }
        }

        if (sp._initialSilentHover && !sp._isHovered) {
          sp._initialSilentHover = false;
          sp._suppressSEOnFirstEnter = false;
          const tgt = sp._content || sp;
          tgt._hoverReqId = (tgt._hoverReqId || 0) + 1;
          OnevASSISTANT.clearHoverEffect(sp,  true);
          const target = sp._content || sp;
          target._hoverState = "normal";
        }

        if (wasHovered !== sp._isHovered) {
          const hoverConfig = OnevASSISTANT.safeJsonParse(
            sp._choiceMeta.HoverEffect
          );
          if (sp._isHovered) {
            if (sp.visible && sp._isEnabled !== false) {
              OnevASSISTANT.applyHoverEffect(sp, hoverConfig);
            }
            const hoverIndexNumber = Number(sp._choiceMeta.HoverIndexNumber) || 0;
            const choiceIndexVarId = Number(parameters.ChoiceIndexVariableId) || 0;
            if (hoverIndexNumber > 0 && choiceIndexVarId > 0 && sp.visible && sp._isEnabled !== false) {
              $gameVariables.setValue(choiceIndexVarId, hoverIndexNumber);
            }
          } else {
            if (!sp._hoverLocked) {
              const tgtOnLeave = sp._content || sp;
              if (tgtOnLeave._hoverFrame && !tgtOnLeave._hoverFrame._destroyed) {
                try { if (typeof tgtOnLeave._hoverFrame.stop === "function") tgtOnLeave._hoverFrame.stop(); } catch (_) {}
                if (tgtOnLeave._hoverFrame.parent) {
                  tgtOnLeave._hoverFrame.parent.removeChild(tgtOnLeave._hoverFrame);
                }
                tgtOnLeave._hoverFrame.destroy({ children: true, texture: false, baseTexture: false });
                tgtOnLeave._hoverFrame = null;
              }
            }
          }
        }
      }
    }

    const choiceIndexVarId = Number(parameters.ChoiceIndexVariableId) || 0;
    if (choiceIndexVarId > 0) {
      let anyHovered = false;
      for (const name of OnevASSISTANT._activeUINames) {
        const root = OnevASSISTANT._activeSprites[name];
        if (!root || !root._onevChoiceChildren) continue;
        for (const sp of root._onevChoiceChildren) {
          const cfg = sp._choiceMeta;
          const hoverIndexNumber = Number(cfg?.HoverIndexNumber) || 0;
          if (hoverIndexNumber > 0 && sp._isHovered && sp.visible && sp._isEnabled !== false) {
            anyHovered = true;
            break;
          }
        }
        if (anyHovered) break;
      }
      if (!anyHovered) {
        $gameVariables.setValue(choiceIndexVarId, 0);
      }
    }
  };

  OnevASSISTANT.updateHoverEffects = function () {
    const now = performance.now();
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevChoiceChildren) continue;

      root._onevChoiceChildren.forEach((sp) => {
        const tgt = sp._content || sp;
        if (!sp._isHovered && tgt._hoverFrame) {
          if (!sp._hoverLocked) {
            try { if (typeof tgt._hoverFrame.stop === "function") tgt._hoverFrame.stop(); } catch (_) {}
            tgt.removeChild(tgt._hoverFrame);
            tgt._hoverFrame.destroy({ children: true, texture: false });
            tgt._hoverFrame = null;
          }
        }

        if (!sp.visible || sp._isEnabled === false) return;

        const effect = OnevASSISTANT.safeJsonParse(sp._choiceMeta.HoverEffect);
        if (!effect) return;

        const target = sp._content || sp;

        const effectFlags = OnevASSISTANT.resolveEffectFlags(effect);
        const useScale = effectFlags.useScale;
        const useOffset = effectFlags.useOffset;
        const useFrame = effectFlags.useFrame;
        const hasExtraImage = (target._hoverExtraImages && target._hoverExtraImages.length > 0) ||
          (effect.ExtraImageSetting && (() => {
            const parsed = OnevASSISTANT.safeJsonParse(effect.ExtraImageSetting);
            if (Array.isArray(parsed)) {
              return parsed.some(item => {
                const obj = typeof item === 'string' ? OnevASSISTANT.safeJsonParse(item) : item;
                return obj && obj.Image;
              });
            }
            return !!(parsed && parsed.Image);
          })());
        
        if (!useScale && !useOffset && !useFrame && !hasExtraImage) return;
        
        if (!sp._isHovered && !sp._hoverLocked) {
          if (target._hoverExtraImage && target._hoverExtraHideOnExit === true) {
            const imgParent = target._hoverExtraImage.parent;
            if (imgParent) imgParent.removeChild(target._hoverExtraImage);
            target._hoverExtraImage.destroy({ children: true, texture: false });
            target._hoverExtraImage = null;
            target._hoverExtraHideOnExit = undefined;
            target._hoverExtraPictureId = undefined;
          }
          if (target._hoverExtraImages && target._hoverExtraImages.length > 0) {
            const hideList = target._hoverExtraHideOnExitList || [];
            const remaining = [];
            const remainingFlags = [];
            for (let ei = 0; ei < target._hoverExtraImages.length; ei++) {
              const img = target._hoverExtraImages[ei];
              const shouldHide = hideList[ei] !== false;
              if (shouldHide) {
                if (img && !img._destroyed) {
                  const p = img.parent;
                  if (p) p.removeChild(img);
                  img.destroy({ children: true, texture: false });
                }
              } else {
                remaining.push(img);
                remainingFlags.push(false);
              }
            }
            target._hoverExtraImages = remaining;
            target._hoverExtraHideOnExitList = remainingFlags;
            target._hoverExtraImage = remaining.length > 0 ? remaining[remaining.length - 1] : null;
            target._hoverExtraHideOnExit = remaining.length > 0 ? false : undefined;
          }
        }
        
        if (sp._isHovered && target._hoverExtraImages && target._hoverExtraImages.length > 0) {
          for (const extraImg of target._hoverExtraImages) {
            if (!extraImg || extraImg._destroyed) continue;
            const condStr = extraImg._showCondition || "{}";
            extraImg.visible = evaluateCondition(condStr);
          }
        }
        
        if (!useScale && !useOffset && !useFrame) return;

        const targetScale = useScale
          ? (Number(effect.Scale) || 100) / 100
          : 1.0;
        const moveX = useOffset ? Number(effect.OffsetX || 0) : 0;
        const moveY = useOffset ? Number(effect.OffsetY || 0) : 0;
        const entryEasingName =
          effect.EntryEasing || effect.Easing || "easeOutBack";
        const entryEasing = OnevASSISTANT.resolveEasing
          ? OnevASSISTANT.resolveEasing(entryEasingName, "easeOutBack")
          : OnevASSISTANT.Easing.easeOutBack;
        const exitEasingName =
          effect.ExitEasing || effect.ReturnEasing || "easeOutExpo";
        const exitEasing = OnevASSISTANT.resolveEasing
          ? OnevASSISTANT.resolveEasing(exitEasingName, "easeOutExpo")
          : OnevASSISTANT.Easing.easeOutExpo;

        const currentTween = target._hoverTween;
        const currentPhase = currentTween?.phase;

        const isClickActive = target._clickState === "clicking" || target._clickTween;

        if (
          sp._isHovered &&
          !sp._hoverLocked &&
          !isClickActive &&
          target._hoverState !== "hovered" &&
          (currentPhase !== "entry" || !currentTween)
        ) {
          target._hoverState = "hovered";
          target._hoverTween = {
            startTime: now,
            duration: Number(effect.EntryDuration) || 250,
            fromScale: target.scale.x,
            toScale: targetScale,
            fromX: target.x,
            fromY: target.y,
            offsetX: moveX,
            offsetY: moveY,
            phase: "entry",
            easing: entryEasing,
          };
          const keepOriginalOnEntry = effect.KeepOriginalImage !== "false" && effect.KeepOriginalImage !== false;
          if (!keepOriginalOnEntry) {
            target._hoverHiddenOriginal = true;
            if (target._texture && !target._savedTexture) {
              target._savedTexture = target._texture;
              target.texture = PIXI.Texture.EMPTY;
            }
          }
        } else if (
          !sp._isHovered &&
          !sp._hoverLocked &&
          !isClickActive &&
          (target._hoverState !== "normal" || currentTween)
        ) {
          if (target._hoverFrame) {
            const f = target._hoverFrame;
            target.removeChild(f);
            try {
              if (typeof f.stop === "function") f.stop();
            } catch (_) {}
            f.destroy({ children: true, texture: false, baseTexture: false });
            target._hoverFrame = null;
          }

          if (target._hoverHiddenOriginal) {
            if (target._savedTexture) {
              target.texture = target._savedTexture;
              delete target._savedTexture;
            }
            target._hoverHiddenOriginal = false;
          }

          if (currentPhase !== "exit") {
            const destX = target._originalX ?? 0;
            const destY = target._originalY ?? 0;
            target._hoverState = "exiting";
            target._hoverTween = {
              startTime: now,
              duration: Number(effect.ExitDuration) || 250,
              fromScale: target.scale.x,
              toScale: 1.0,
              fromX: target.x,
              fromY: target.y,
              offsetX: destX - target.x,
              offsetY: destY - target.y,
              phase: "exit",
              easing: exitEasing,
            };
          }
        }

        if (sp._isHovered && !sp._hoverLocked && !isClickActive && useFrame && effect.FrameImage && !target._hoverFrame) {
          const frame = new Sprite(
            ImageManager.loadBitmap("img/UI/", effect.FrameImage)
          );
          frame.anchor.set(0.5);
          target.addChild(frame);
          target._hoverFrame = frame;
        }

        if (target._hoverTween && !isClickActive) {
          const tween = target._hoverTween;
          const t = Math.min(1, (now - tween.startTime) / tween.duration);
          const eased = tween.easing ? tween.easing(t) : t;

          const scaleVal =
            tween.fromScale + (tween.toScale - tween.fromScale) * eased;
          target.scale.set(scaleVal, scaleVal);

          target.x = tween.fromX + tween.offsetX * eased;
          target.y = tween.fromY + tween.offsetY * eased;

          if (t >= 1) {
            delete target._hoverTween;
            if (!sp._isHovered && !sp._hoverLocked) {
              OnevASSISTANT.clearHoverEffect(sp,  true);
              target._hoverState = "normal";
            }
          }
        } else if (isClickActive && target._hoverTween) {
          target._hoverTween.startTime = now;
        }
      });
    }
  };

  OnevASSISTANT.getSpriteBounds = function (sp) {
    if (!sp || !sp.getGlobalPosition)
      return { left: 0, top: 0, right: 0, bottom: 0 };

    if (sp._baseGlobalX == null || sp._baseGlobalY == null) {
      const g = sp.getGlobalPosition();
      sp._baseGlobalX = g.x;
      sp._baseGlobalY = g.y;
      if (sp._baseScale == null) sp._baseScale = sp.scale?.x ?? 1;
    }

    const baseX = sp._baseGlobalX;
    const baseY = sp._baseGlobalY;
    const baseScale = sp._baseScale != null ? sp._baseScale : 1;
    const width = (sp.width || sp.bitmap?.width || 0) * baseScale;
    const height = (sp.height || sp.bitmap?.height || 0) * baseScale;
    const anchorX = sp.anchor?.x ?? 0;
    const anchorY = sp.anchor?.y ?? 0;
    const left = baseX - anchorX * width;
    const top = baseY - anchorY * height;

    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
    };
  };

  function hasConditionSet(conditionStr) {
    if (!conditionStr) return false;
    try {
      const condition = typeof conditionStr === "string" 
        ? JSON.parse(conditionStr) 
        : conditionStr;
      
      if (condition.Conditions !== undefined) {
        let conditions = condition.Conditions;
        if (typeof conditions === "string") {
          try {
            conditions = JSON.parse(conditions);
          } catch (e) {
            return false;
          }
        }
        return Array.isArray(conditions) && conditions.length > 0;
      }
      
      const switchId = Number(condition.SwitchId || 0);
      const variableId = Number(condition.VariableId || 0);
      return switchId > 0 || variableId > 0;
    } catch (e) {
      return false;
    }
  }

  function evaluateCondition(conditionStr) {
    if (!conditionStr) return true;

    try {
      const condition = typeof conditionStr === "string" 
        ? JSON.parse(conditionStr) 
        : conditionStr;

      if (condition.Conditions) {
        let conditions = condition.Conditions;
        if (typeof conditions === "string") {
          try {
            conditions = JSON.parse(conditions);
          } catch (e) {
            conditions = [];
          }
        }
        
        if (Array.isArray(conditions) && conditions.length > 0) {
          for (const item of conditions) {
            const parsed = typeof item === "string" ? JSON.parse(item) : item;
            if (!evaluateSingleCondition(parsed)) {
              return false;
            }
          }
          return true;
        }
        return true;
      }

      return evaluateSingleCondition(condition);

    } catch (e) {
      console.warn("ConditionConfig parse error:", e);
      return true;
    }
  }

  function evaluateSingleCondition(item) {
    if (!item) return true;

    const switchId = Number(item.SwitchId || 0);
    if (switchId > 0) {
      const expectedValue = item.SwitchValue === "true" || item.SwitchValue === true;
      const actualValue = $gameSwitches.value(switchId);
      if (actualValue !== expectedValue) return false;
    }

    if (item.OrSwitchIds) {
      let orSwitchIds = item.OrSwitchIds;
      if (typeof orSwitchIds === "string") {
        try {
          orSwitchIds = JSON.parse(orSwitchIds);
        } catch (e) {
          orSwitchIds = [];
        }
      }
      if (Array.isArray(orSwitchIds) && orSwitchIds.length > 0) {
        const validIds = orSwitchIds.map(id => Number(id)).filter(id => id > 0);
        if (validIds.length > 0) {
          const anyOn = validIds.some(id => $gameSwitches.value(id));
          if (!anyOn) return false;
        }
      }
    }

    const variableId = Number(item.VariableId || 0);
    if (variableId > 0) {
      const actualValue = $gameVariables.value(variableId);
      const compareValue = Number(item.Value || 0);
      const operator = item.Operator || "等しい（==）";
      if (!evaluateOperator(actualValue, operator, compareValue)) return false;
    }

    return true;
  }

  function evaluateOperator(actualValue, operator, compareValue) {
    switch (operator) {
      case "等しい（==）":
      case "==":
        return actualValue === compareValue;
      case "以上（>=）":
      case ">=":
        return actualValue >= compareValue;
      case "以下（<=）":
      case "<=":
        return actualValue <= compareValue;
      case "より大きい（>）":
      case ">":
        return actualValue > compareValue;
      case "より小さい（<）":
      case "<":
        return actualValue < compareValue;
      case "等しくない（!=）":
      case "!=":
        return actualValue !== compareValue;
      default:
        return true;
    }
  }

  function Sprite_GaugeVariable(setting, baseX = 0, baseY = 0) {
    this.initialize(setting, baseX, baseY);
  }
  Sprite_GaugeVariable.prototype = Object.create(Sprite.prototype);
  Sprite_GaugeVariable.prototype.constructor = Sprite_GaugeVariable;
  Sprite_GaugeVariable.prototype.initialize = function (
    s,
    baseX = 0,
    baseY = 0
  ) {
    Sprite.prototype.initialize.call(this);

    this._container = new Sprite();
    this.addChild(this._container);
    this._curVar = +s.CurrentVarId || 0;
    this._maxVar = +s.MaxVarId || 0;
    this._type = s.Type || "horizontal";
    this._align = s.Align || "right";
    this._maskImage = s.MaskImage || "";
    this._condition = s.Condition || "";
    this._useEasing =
      typeof s.UseEasing === "string"
        ? s.UseEasing.trim().toLowerCase() === "true"
        : s.UseEasing !== undefined ? !!s.UseEasing : true;
    this._easeSpeed = +s.EasingSpeed || 0.15;
    this._easeType = s.EasingType || "easeInOut";
    this._slideDistance = +s.SlideDistance || 0;
    this._animationStartTime = null;
    this._animationDuration = 0;
    this._startRate = 0;
    this._targetRate = 0;
    this._fadeFrames = +s.FadeFrames || 0;
    this._fadeProgress = 0;
    this._fadeDirection = 0;
    this._lastVisibleState = null;
    const offsetX = +s.X || 0;
    const offsetY = +s.Y || 0;
    this.x = baseX + offsetX;
    this.y = baseY + offsetY;
    this._baseX = this.x;
    this._baseY = this.y;
    this.anchor.set(0.5, 0.5);
    this._width = 0;
    this._height = 0;
    this._bitmap = ImageManager.loadBitmap("img/UI/", s.BarImage || "");
    this._curRate = typeof s.InitialRate === "number" ? s.InitialRate : 0;
    this._targetRate = this._curRate;
    this._initialized = false;
    this._sprite = new Sprite();
    this._sprite.bitmap = this._bitmap;
    this._container.addChild(this._sprite);

    if (this._maskImage && this._type !== "mask") {
      const maskBmp = ImageManager.loadBitmap("img/UI/", this._maskImage);
      maskBmp.addLoadListener(() => {
        const maskSprite = new Sprite(maskBmp);
        this._sprite.mask = maskSprite;
        this._container.addChildAt(maskSprite, 0);
      });
    }

    this._bitmap.addLoadListener(() => {
      if (this._type === "elasticity") {
        this._width = this._bitmap.width;
        this._height = this._bitmap.height;
      } else if (this._type === "slide") {
        switch (this._align) {
          case "left":
          case "right":
            this._width = this._slideDistance || this._bitmap.width;
            this._height = this._bitmap.height;
            break;
          case "up":
          case "down":
            this._width = this._bitmap.width;
            this._height = this._slideDistance || this._bitmap.height;
            break;
        }
      } else if (this._type === "mask") {
        this._width = this._bitmap.width;
        this._height = this._bitmap.height;
        if (!this._maskSprite) {
          if (this._maskImage) {
            const maskBmp = ImageManager.loadBitmap("img/UI/", this._maskImage);
            maskBmp.addLoadListener(() => {
              const maskSp = new Sprite(maskBmp);
              maskSp.render = function(renderer) {
                this.updateTransform();
              };
              this._container.addChild(maskSp);
              this._sprite.mask = maskSp;
              this._maskSprite = maskSp;
              this.updateVisual();
            });
          } else {
            const maskGfx = new PIXI.Graphics();
            maskGfx.beginFill(0xffffff);
            maskGfx.drawRect(0, 0, this._width, this._height);
            maskGfx.endFill();
            this._container.addChild(maskGfx);
            this._sprite.mask = maskGfx;
            this._maskSprite = maskGfx;
          }
        }
      }
      this.updateVisual();
    });

    let deco = s.Decoration;
    try {
      if (typeof deco === "string") deco = JSON.parse(deco);
    } catch (e) {
      deco = null;
    }

    if (deco) {
      if (deco.BackgroundImage) {
        const bgBmp = ImageManager.loadBitmap("img/UI/", deco.BackgroundImage);
        this._bgSprite = new Sprite(bgBmp);
        this._bgSprite.x = +deco.BackgroundOffsetX || 0;
        this._bgSprite.y = +deco.BackgroundOffsetY || 0;
        this._container.addChildAt(this._bgSprite, 0);
      }
      if (deco.FrameImage) {
        const frameBmp = ImageManager.loadBitmap("img/UI/", deco.FrameImage);
        this._frameSprite = new Sprite(frameBmp);
        this._frameSprite.x = +deco.FrameOffsetX || 0;
        this._frameSprite.y = +deco.FrameOffsetY || 0;
        this._container.addChild(this._frameSprite);
      }
    }

    if (this._type === "slide") {
      switch (this._align) {
        case "up":
          this._sprite.y = this._slideDistance;
          break;
        case "down":
          this._sprite.y = -this._slideDistance;
          break;
        case "left":
          this._sprite.x = this._slideDistance;
          break;
        case "right":
          this._sprite.x = -this._slideDistance;
          break;
      }
    }
  };

  Sprite_GaugeVariable.prototype.update = function () {
    Sprite.prototype.update.call(this);

    const shouldShow = evaluateCondition(this._condition);

    if (this._fadeTween || this._fadeDelayActive || (this._fadeConfig && this._nextVisible !== this._targetVisible)) {
      if (!this.visible) {
        const val = $gameVariables.value(this._curVar);
        const max = this._maxVar > 0 ? $gameVariables.value(this._maxVar) : 100;
        this._curRate = max > 0 ? Math.min(1, val / max) : 0;
        return;
      }
    } else if (this._fadeFrames > 0) {
      if (shouldShow !== this._lastVisibleState) {
        this._lastVisibleState = shouldShow;
        this._fadeDirection = shouldShow ? 1 : -1;
        this._fadeProgress = shouldShow ? 0 : this._fadeFrames;
      }

      if (this._fadeDirection !== 0) {
        if (this._fadeDirection === 1) {
          this._fadeProgress++;
          if (this._fadeProgress >= this._fadeFrames) {
            this._fadeProgress = this._fadeFrames;
            this._fadeDirection = 0;
          }
        } else {
          this._fadeProgress--;
          if (this._fadeProgress <= 0) {
            this._fadeProgress = 0;
            this._fadeDirection = 0;
          }
        }
        this.alpha = this._fadeProgress / this._fadeFrames;
        this.visible = this._fadeProgress > 0;
      }
      if (!shouldShow && this._fadeProgress <= 0) {
        this.visible = false;
        const val = $gameVariables.value(this._curVar);
        const max = this._maxVar > 0 ? $gameVariables.value(this._maxVar) : 100;
        this._curRate = max > 0 ? Math.min(1, val / max) : 0;
        return;
      }
    } else {
      this.visible = shouldShow;
      if (!shouldShow) {
        const val = $gameVariables.value(this._curVar);
        const max = this._maxVar > 0 ? $gameVariables.value(this._maxVar) : 100;
        this._curRate = max > 0 ? Math.min(1, val / max) : 0;
        return;
      }
    }

    const val = $gameVariables.value(this._curVar);
    const max = this._maxVar > 0 ? $gameVariables.value(this._maxVar) : 100;
    const newTarget = max > 0 ? Math.min(1, val / max) : 0;

    if (!this._initialized) {
      this._curRate = newTarget;
      this._targetRate = newTarget;
      this._initialized = true;
    } else if (Math.abs(this._targetRate - newTarget) > 1e-6) {
      this._startRate = this._curRate;
      this._targetRate = newTarget;
      this._animationStartTime = Date.now();
      const speed = Math.max(0.000001, this._easeSpeed);
      this._animationDuration = Math.max(1, Math.floor(1000 / speed));
    }

    if (this._useEasing && this._animationStartTime) {
      const elapsed = Date.now() - this._animationStartTime;
      const progress = Math.min(1, elapsed / this._animationDuration);
      const easingFunction = Easing[this._easeType] || Easing.linear;
      const easedProgress = easingFunction(progress);
      const startRate = this._startRate;
      this._curRate =
        startRate + (this._targetRate - startRate) * easedProgress;

      if (progress >= 1) {
        this._curRate = this._targetRate;
        this._animationStartTime = null;
      }
    } else {
      this._curRate = newTarget;
    }

    this.updateVisual();
  };
  Sprite_GaugeVariable.prototype.applyEasing = function (c, t) {
    const d = t - c,
      s = this._easeSpeed;
    const easingFunc = Easing[this._easeType] || Easing.linear;
    const eased = easingFunc(s);
    return c + d * eased;
  };
  Sprite_GaugeVariable.prototype.updateVisual = function () {
    if (
      !this._sprite ||
      !this._bitmap ||
      !this._bitmap.isReady() ||
      !this._sprite.bitmap ||
      !this._sprite.texture ||
      !this._sprite.texture.baseTexture ||
      !this._sprite.texture.baseTexture.valid
    ) {
      return;
    }

    const rate = this._curRate;
    const fixedRate =
      Math.abs(rate - 1) < 0.001 ? 1 : Math.abs(rate - 0) < 0.001 ? 0 : rate;

    if (this._type === "elasticity") {
      if (this._align === "left" || this._align === "right") {
        const sw = Math.floor(this._width * rate);
        this._sprite.setFrame(0, 0, sw, this._bitmap.height);
        this._sprite.x = this._align === "left" ? this._width - sw : 0;
      } else if (this._align === "up") {
        const sh = Math.round(this._height * fixedRate);
        const sy = this._bitmap.height - sh;
        this._sprite.setFrame(0, sy, this._bitmap.width, sh);
        this._sprite.y = this._height - sh;
      } else if (this._align === "down") {
        const sh = Math.floor(this._height * rate);
        this._sprite.setFrame(0, 0, this._bitmap.width, sh);
        this._sprite.y = 0;
      }
    } else if (this._type === "slide") {
      this._sprite.setFrame(0, 0, this._bitmap.width, this._bitmap.height);
      const dist = this._slideDistance;

      switch (this._align) {
        case "left":
          this._sprite.x = -dist * rate;
          break;
        case "right":
          this._sprite.x = dist * rate;
          break;
        case "up":
          this._sprite.y = -dist * rate;
          break;
        case "down":
          this._sprite.y = dist * rate;
          break;
      }
    } else if (this._type === "mask" && this._maskSprite) {
      this._sprite.setFrame(0, 0, this._bitmap.width, this._bitmap.height);
      this._sprite.x = 0;
      this._sprite.y = 0;
      const w = this._width;
      const h = this._height;
      switch (this._align) {
        case "right":
          this._maskSprite.x = -(w - w * rate);
          break;
        case "left":
          this._maskSprite.x = w - w * rate;
          break;
        case "down":
          this._maskSprite.y = -(h - h * rate);
          break;
        case "up":
          this._maskSprite.y = h - h * rate;
          break;
      }
    }
  };

  OnevASSISTANT.createGaugeSprites = function (parentSprite, gaugeDefs, uiName) {
    const list = [];
    const effectiveUiName = uiName || parentSprite._onevUIName;
    const fadeAlreadyCompleted = effectiveUiName && $gameSystem && $gameSystem.isUIFadeCompleted(effectiveUiName);
    
    gaugeDefs.forEach((cfg) => {
      const sp = new Sprite_GaugeVariable(cfg, parentSprite.x, parentSprite.y);
      sp.zIndex = SPRITE_PRIORITIES.GAUGE;
      sp._originalX = sp.x;
      sp._originalY = sp.y;
      sp._fadeConfig = OnevASSISTANT.safeJsonParse(cfg.FadeEffect || "{}");
      sp._fadeTween = null;
      sp._fadeDelayActive = false;
      
      const shouldShow = evaluateCondition(sp._condition);
      const appearCfg = OnevASSISTANT.safeJsonParse(sp._fadeConfig?.AppearEffect || "{}");
      const hasAppearEffect = String(appearCfg.UseEffect) === "true" || 
        String(appearCfg.UseScale) === "true" || 
        String(appearCfg.UseOffset) === "true" || 
        Number(appearCfg.StartScale) !== 100 ||
        Number(appearCfg.StartOffsetX) !== 0 ||
        Number(appearCfg.StartOffsetY) !== 0 ||
        Number(appearCfg.FadeFrames) > 0;
      
      if (shouldShow && hasAppearEffect && !fadeAlreadyCompleted) {
        sp._nextVisible = false;
        sp._targetVisible = false;
        sp.visible = false;
        sp.alpha = 0;
        sp._pendingAppearEffect = true;
      } else {
        sp._nextVisible = shouldShow;
        sp._targetVisible = shouldShow;
        sp.visible = shouldShow;
        sp.alpha = shouldShow ? 1 : 0;
      }
      
      parentSprite.addChild(sp);
      list.push(sp);
    });
    return list;
  };

  OnevASSISTANT.updateGaugeSprites = function () {
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      (root._onevGaugeChildren || []).forEach((sp) => sp.update());
    }
  };

  OnevASSISTANT.updateGaugeFades = function () {
    const now = performance.now();
    const msPerFrame = 1000 / 60;
    
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevGaugeChildren) continue;
      
      root._onevGaugeChildren.forEach((sp) => {
        const cfg = sp._fadeConfig;
        if (!cfg) return;
        
        if (sp._bitmap && !sp._bitmap.isReady()) return;
        
        const appearCfg = OnevASSISTANT.safeJsonParse(cfg.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(cfg.DisappearEffect || "{}");
        
        if (sp._pendingAppearEffect) {
          sp._pendingAppearEffect = false;
          const conditionNow = evaluateCondition(sp._condition);
          if (conditionNow) {
            sp._targetVisible = false;
            sp._nextVisible = true;
          } else {
            sp._targetVisible = false;
            sp._nextVisible = false;
            sp.visible = false;
            sp.alpha = 0;
          }
        }
        
        const conditionMet = evaluateCondition(sp._condition);
        if (sp._nextVisible !== conditionMet && !sp._fadeDelayActive && !sp._fadeTween) {
          sp._nextVisible = conditionMet;
        }
        
        if (sp._nextVisible !== sp._targetVisible && !sp._fadeDelayActive) {
          const willShow = sp._nextVisible;
          const effectCfg = willShow ? appearCfg : disappearCfg;
          const hasEffect = String(effectCfg.UseEffect) === "true" || 
            Number(effectCfg.FadeFrames) > 0 ||
            Number(effectCfg.StartScale || effectCfg.EndScale) !== 100 ||
            Number(effectCfg.StartOffsetX || effectCfg.EndOffsetX) !== 0 ||
            Number(effectCfg.StartOffsetY || effectCfg.EndOffsetY) !== 0;
          const delayFrames = Number(effectCfg.StartDelay) || 0;
          
          if (!hasEffect) {
            sp._targetVisible = willShow;
            sp.visible = willShow;
            sp.alpha = willShow ? 1 : 0;
            sp.x = sp._originalX;
            sp.y = sp._originalY;
            sp.scale.x = 1;
            sp.scale.y = 1;
            sp._fadeTween = null;
            return;
          }
          
          if (delayFrames > 0) {
            sp._fadeDelayActive = true;
            sp._fadeDelayStartTime = now;
            sp._fadeDelayDuration = delayFrames * msPerFrame;
            sp._fadePendingShow = willShow;
            if (willShow) {
              sp.visible = false;
              sp.alpha = 0;
            }
            return;
          }
          
          sp._targetVisible = willShow;
          OnevASSISTANT.startGaugeFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
        }
        
        if (sp._fadeDelayActive) {
          const elapsed = now - sp._fadeDelayStartTime;
          if (elapsed >= sp._fadeDelayDuration) {
            sp._fadeDelayActive = false;
            const willShow = sp._fadePendingShow;
            sp._targetVisible = willShow;
            OnevASSISTANT.startGaugeFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
          }
          return;
        }
        
        if (sp._fadeTween) {
          const tRaw = (now - sp._fadeTween.startTime) / sp._fadeTween.duration;
          const t = tRaw < 1 ? tRaw : 1;
          const easedT = sp._fadeTween.easingFunc ? sp._fadeTween.easingFunc(t) : t;
          
          sp.alpha = sp._fadeTween.from + (sp._fadeTween.to - sp._fadeTween.from) * easedT;
          
          const effectCfg = sp._fadeTween.effectCfg;
          if (effectCfg) {
            if (sp._fadeTween.willShow) {
              const startScale = Number(effectCfg.StartScale || 100) / 100;
              const curScale = startScale + (1 - startScale) * easedT;
              sp.scale.x = curScale;
              sp.scale.y = curScale;
              
              const startOffsetX = sp._fadeStartOffsetX || 0;
              const startOffsetY = sp._fadeStartOffsetY || 0;
              sp.x = sp._originalX + startOffsetX * (1 - easedT);
              sp.y = sp._originalY + startOffsetY * (1 - easedT);
            } else {
              const endScale = Number(effectCfg.EndScale || 100) / 100;
              const curScale = 1 + (endScale - 1) * easedT;
              sp.scale.x = curScale;
              sp.scale.y = curScale;
              
              const endOffsetX = Number(effectCfg.EndOffsetX || 0);
              const endOffsetY = Number(effectCfg.EndOffsetY || 0);
              sp.x = sp._originalX + endOffsetX * easedT;
              sp.y = sp._originalY + endOffsetY * easedT;
            }
          }
          
          if (t >= 1) {
            sp._fadeTween = null;
            if (sp._targetVisible) {
              sp.visible = true;
              sp.alpha = 1;
              sp.scale.x = 1;
              sp.scale.y = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
            } else {
              sp.visible = false;
              sp.alpha = 0;
              sp.scale.x = 1;
              sp.scale.y = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
            }
          } else {
            sp.visible = sp.alpha > 0;
          }
        }
      });
    }
  };
  
  OnevASSISTANT.startGaugeFade = function (sp, willShow, appearCfg, disappearCfg, now, msPerFrame) {
    const effectCfg = willShow ? appearCfg : disappearCfg;
    const fadeFrames = Number(effectCfg.FadeFrames || 5);
    const duration = fadeFrames * msPerFrame;
    const easingName = effectCfg.Easing || (willShow ? "easeOutQuad" : "easeInQuad");
    const easingFunc = Easing[easingName] || Easing.linear;
    
    if (willShow) {
      sp.visible = true;
      sp.alpha = 0;
      const startScale = Number(effectCfg.StartScale || 100) / 100;
      sp.scale.x = startScale;
      sp.scale.y = startScale;
      sp._fadeStartOffsetX = Number(effectCfg.StartOffsetX || 0);
      sp._fadeStartOffsetY = Number(effectCfg.StartOffsetY || 0);
      sp.x = sp._originalX + sp._fadeStartOffsetX;
      sp.y = sp._originalY + sp._fadeStartOffsetY;
    } else {
      sp._fadeStartScale = sp.scale.x;
      sp._fadeStartX = sp.x;
      sp._fadeStartY = sp.y;
    }
    
    const from = sp.alpha;
    const to = willShow ? 1 : 0;
    
    sp._fadeTween = {
      startTime: now,
      duration,
      from,
      to,
      willShow,
      easingFunc,
      effectCfg
    };
  };

  function Sprite_NumberVariable(setting, baseX, baseY) {
    this.initialize(setting, baseX, baseY);
  }
  Sprite_NumberVariable.prototype = Object.create(Sprite.prototype);
  Sprite_NumberVariable.prototype.constructor = Sprite_NumberVariable;
  Sprite_NumberVariable.prototype.initialize = function (
    s,
    baseX = 0,
    baseY = 0
  ) {
    Sprite.prototype.initialize.call(this);

    this._setting = s;
    this._varId = +s.VariableId || 0;
    this._digits = +s.Digit || 4;
    this._padding = +s.Padding || 0;
    this._align = s.Align || "right";
    this._boxWidth = +s.BoxWidth || 0;
    this._padZero = String(s.PadZero).toLowerCase() === "true";
    this._maxValue = +s.MaxValue || 0;
    this._minValue = +s.MinValue || 0;
    this._switchId = +s.SwitchId || 0;
    this._showCondition = s.ShowCondition || "";
    this._prohibitCondition = s.ProhibitCondition || "";
    this._useSeparator = String(s.UseSeparator).toLowerCase() === "true";
    this._separatorBitmapName = s.SeparatorBitmap || "";
    if (this._useSeparator && !this._separatorBitmapName) {
      this._useSeparator = false;
    }
    this._prefixBitmapName = s.PrefixImage || "";
    this._prefixBitmap = null;
    this._prefixW = 0;
    this._prefixH = 0;
    this._prefixOffsetX = +s.PrefixOffsetX || 0;
    this._prefixOffsetY = +s.PrefixOffsetY || 0;
    this._prefixReady = !this._prefixBitmapName;
    this._minusBitmapName = s.MinusBitmap || "";
    this._minusBitmap = null;
    this._minusW = 0;
    this._minusH = 0;
    this._minusOffsetX = +s.MinusOffsetX || 0;
    this._minusReady = !this._minusBitmapName;
    
    this._fadeFrames = +s.FadeFrames || 0;
    this._fadeProgress = 0;
    this._fadeDirection = 0;
    this._shouldBeVisible = true;
    this._lastVisibleState = null;
    const offsetX = +s.X || 0;
    const offsetY = +s.Y || 0;
    this.x = baseX + offsetX;
    this.y = baseY + offsetY;
    this._baseX = this.x;
    this._baseY = this.y;
    const anchorX =
      this._align === "right" ? 1.0 : this._align === "center" ? 0.5 : 0.0;
    this.anchor.set(anchorX, 0.5);
    this._value = null;
    this._glyphSprites = [];
    this._bitmapReady = false;
    this._separatorReady = !this._useSeparator;
    this._separatorBitmap = null;
    this._commaW = 0;
    this._commaH = 0;
    const bmpName = s.Bitmap || "Damage";
    this._bitmap = ImageManager.loadSystem(bmpName);
    this._bitmap.addLoadListener(() => {
      this._digitW = this._bitmap.width / 10;
      this._digitH = this._bitmap.height;
      this._bitmapReady = true;
      this._refresh();
    });

    if (this._useSeparator) {
      this._separatorBitmap = ImageManager.loadSystem(
        this._separatorBitmapName
      );
      this._separatorBitmap.addLoadListener(() => {
        this._commaW = this._separatorBitmap.width;
        this._commaH = this._separatorBitmap.height;
        this._separatorReady = true;
        this._refresh();
      });
    }

    if (this._minusBitmapName) {
      this._minusBitmap = ImageManager.loadSystem(this._minusBitmapName);
      this._minusBitmap.addLoadListener(() => {
        this._minusW = this._minusBitmap.width;
        this._minusH = this._minusBitmap.height;
        this._minusReady = true;
        this._refresh();
      });
    }

    if (this._prefixBitmapName) {
      this._prefixBitmap = ImageManager.loadSystem(this._prefixBitmapName);
      this._prefixBitmap.addLoadListener(() => {
        this._prefixW = this._prefixBitmap.width;
        this._prefixH = this._prefixBitmap.height;
        this._prefixReady = true;
        this._refresh();
      });
    }
  };

  Sprite_NumberVariable.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._assetsReady()) this._refresh();
  };

  Sprite_NumberVariable.prototype._refresh = function () {
    if (!this._assetsReady()) return;

    let shouldShow = this._evaluateCondition();

    if (this._fadeTween || this._fadeDelayActive || (this._fadeConfig && this._nextVisible !== this._targetVisible)) {
      if (!this.visible) return;
    } else if (this._fadeFrames > 0) {
      if (shouldShow !== this._lastVisibleState) {
        this._lastVisibleState = shouldShow;
        this._fadeDirection = shouldShow ? 1 : -1;
        this._fadeProgress = shouldShow ? 0 : this._fadeFrames;
      }

      if (this._fadeDirection !== 0) {
        if (this._fadeDirection === 1) {
          this._fadeProgress++;
          if (this._fadeProgress >= this._fadeFrames) {
            this._fadeProgress = this._fadeFrames;
            this._fadeDirection = 0;
          }
        } else {
          this._fadeProgress--;
          if (this._fadeProgress <= 0) {
            this._fadeProgress = 0;
            this._fadeDirection = 0;
          }
        }
        this.alpha = this._fadeProgress / this._fadeFrames;
        this.visible = this._fadeProgress > 0;
      }
      if (!shouldShow && this._fadeProgress <= 0) {
        this.visible = false;
        return;
      }
    } else {
      if (!shouldShow) {
        this.visible = false;
        return;
      } else {
        this.visible = true;
      }
    }

    let v = $gameVariables.value(this._varId);
    if (this._maxValue !== 0 && v > this._maxValue) {
      v = this._maxValue;
    }
    if (this._minValue !== 0 && v < this._minValue) {
      v = this._minValue;
    }
    if (v === this._value) return;
    this._value = v;

    let isNegative = v < 0;
    let absValue = Math.abs(v);
    
    if (isNegative && !this._minusBitmapName) {
      isNegative = false;
      absValue = 0;
    }

    let displayVal;
    if (absValue === 0) {
      displayVal = this._padZero ? "0".padStart(this._digits, "0") : "0";
    } else if (absValue >= Math.pow(10, this._digits)) {
      displayVal = "9".repeat(this._digits);
    } else {
      const raw = String(absValue);
      displayVal = this._padZero
        ? raw.padStart(this._digits, "0")
        : raw.substring(raw.length - this._digits);
    }

    const glyphs = this._buildGlyphSequence(displayVal, isNegative);
    const totalWidth = glyphs.reduce((sum, glyph, idx) => {
      const w = this._glyphWidth(glyph.type);
      if (idx === 0) return sum + w;
      return sum + this._padding + w;
    }, 0);

    let cursor = 0;
    if (this._align === "right") {
      cursor = -totalWidth;
    } else if (this._align === "center") {
      cursor = -totalWidth / 2;
    }

    glyphs.forEach((glyph, i) => {
      const sp = this._ensureGlyphSprite(i, glyph.type);
      if (glyph.type === "digit") {
        const digit = Number(glyph.value) || 0;
        sp.setFrame(digit * this._digitW, 0, this._digitW, this._digitH);
      } else if (glyph.type === "comma" && this._useSeparator && this._separatorBitmap) {
        sp.setFrame(0, 0, this._commaW || this._separatorBitmap.width, this._commaH || this._separatorBitmap.height);
      } else if (glyph.type === "prefix" && this._prefixBitmap) {
        sp.setFrame(0, 0, this._prefixW || this._prefixBitmap.width, this._prefixH || this._prefixBitmap.height);
      } else if (glyph.type === "minus" && this._minusBitmap) {
        sp.setFrame(0, 0, this._minusW || this._minusBitmap.width, this._minusH || this._minusBitmap.height);
      }
      if (glyph.type === "prefix") {
        sp.x = cursor + this._prefixOffsetX;
        sp.y = this._prefixOffsetY;
      } else {
        sp.x = cursor + (glyph.type === "minus" ? this._minusOffsetX : 0);
      }
      cursor += this._glyphWidth(glyph.type);
      if (i < glyphs.length - 1) {
        cursor += this._padding;
      }
      sp.visible = true;
    });

    for (let i = glyphs.length; i < this._glyphSprites.length; i++) {
      const extra = this._glyphSprites[i];
      if (extra) extra.visible = false;
    }
  };

  Sprite_NumberVariable.prototype._assetsReady = function () {
    if (!this._bitmapReady) return false;
    if (this._useSeparator && !this._separatorReady) return false;
    if (this._minusBitmapName && !this._minusReady) return false;
    if (this._prefixBitmapName && !this._prefixReady) return false;
    return true;
  };

  Sprite_NumberVariable.prototype._evaluateCondition = function () {
    if (this._switchId > 0 && !$gameSwitches.value(this._switchId)) {
      return false;
    }

    if (this._showCondition && this._showCondition !== "" && this._showCondition !== "{}") {
      const parsed = OnevASSISTANT.safeJsonParse(this._showCondition);
      if (parsed && parsed.Conditions) {
        let conditions = parsed.Conditions;
        if (typeof conditions === "string") {
          try { conditions = JSON.parse(conditions); } catch(e) { conditions = []; }
        }
        if (Array.isArray(conditions) && conditions.length === 0) {
        } else if (!evaluateCondition(this._showCondition)) {
          return false;
        }
      } else if (!evaluateCondition(this._showCondition)) {
        return false;
      }
    }

    if (this._prohibitCondition && this._prohibitCondition !== "" && this._prohibitCondition !== "{}") {
      const parsed = OnevASSISTANT.safeJsonParse(this._prohibitCondition);
      if (parsed && parsed.Conditions) {
        let conditions = parsed.Conditions;
        if (typeof conditions === "string") {
          try { conditions = JSON.parse(conditions); } catch(e) { conditions = []; }
        }
        if (Array.isArray(conditions) && conditions.length === 0) {
        } else if (evaluateCondition(this._prohibitCondition)) {
          return false;
        }
      } else if (evaluateCondition(this._prohibitCondition)) {
        return false;
      }
    }

    return true;
  };

  Sprite_NumberVariable.prototype._buildGlyphSequence = function (
    digitsOnly,
    isNegative = false
  ) {
    let result = [];
    
    if (this._prefixBitmapName) {
      result.push({ type: "prefix" });
    }
    
    if (isNegative && this._minusBitmapName) {
      result.push({ type: "minus" });
    }
    
    if (!this._useSeparator) {
      const digitGlyphs = digitsOnly.split("").map((value) => ({ type: "digit", value }));
      return result.concat(digitGlyphs);
    }
    const formatted = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedGlyphs = formatted.split("").map((ch) => {
      if (ch === ",") {
        return { type: "comma" };
      }
      return { type: "digit", value: ch };
    });
    return result.concat(formattedGlyphs);
  };

  Sprite_NumberVariable.prototype._glyphWidth = function (type) {
    if (type === "prefix") {
      if (this._prefixW) return this._prefixW;
      if (this._prefixBitmap && this._prefixBitmap.isReady()) {
        return this._prefixBitmap.width;
      }
    }
    if (type === "comma") {
      if (this._commaW) return this._commaW;
      if (this._separatorBitmap && this._separatorBitmap.isReady()) {
        return this._separatorBitmap.width;
      }
    }
    if (type === "minus") {
      if (this._minusW) return this._minusW;
      if (this._minusBitmap && this._minusBitmap.isReady()) {
        return this._minusBitmap.width;
      }
    }
    return this._digitW || 0;
  };

  Sprite_NumberVariable.prototype._ensureGlyphSprite = function (
    index,
    type
  ) {
    let sp = this._glyphSprites[index];
    if (!sp || sp._glyphType !== type) {
      if (sp) {
        this.removeChild(sp);
      }
      let bitmap;
      if (type === "prefix" && this._prefixBitmap) {
        bitmap = this._prefixBitmap;
      } else if (type === "comma" && this._useSeparator && this._separatorBitmap) {
        bitmap = this._separatorBitmap;
      } else if (type === "minus" && this._minusBitmap) {
        bitmap = this._minusBitmap;
      } else {
        bitmap = this._bitmap;
      }
      sp = new Sprite(bitmap);
      sp._glyphType = type;
      this.addChild(sp);
      this._glyphSprites[index] = sp;
    } else {
      let targetBitmap;
      if (type === "prefix" && this._prefixBitmap) {
        targetBitmap = this._prefixBitmap;
      } else if (type === "comma" && this._useSeparator && this._separatorBitmap) {
        targetBitmap = this._separatorBitmap;
      } else if (type === "minus" && this._minusBitmap) {
        targetBitmap = this._minusBitmap;
      } else {
        targetBitmap = this._bitmap;
      }
      if (sp.bitmap !== targetBitmap) {
        sp.bitmap = targetBitmap;
      }
    }
    return sp;
  };
  OnevASSISTANT.convertEscapeCharacters = function (text) {
    if (typeof text !== "string") return String(text);
    const originalText = text;

    while (text.match(/\{V\[(\d+)\]\}/gi)) {
      text = text.replace(/\{V\[(\d+)\]\}/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
      );
    }

    text = text.replace(/\{N\[(\d+)\]\}/gi, (_, p1) => {
      const actorId = parseInt(p1);
      const actor = actorId >= 1 ? $gameActors.actor(actorId) : null;
      return actor ? actor.name() : "";
    });

    text = text.replace(/\{P\[(\d+)\]\}/gi, (_, p1) => {
      const memberIndex = parseInt(p1);
      const actor = memberIndex >= 1 ? $gameParty.members()[memberIndex - 1] : null;
      return actor ? actor.name() : "";
    });

    text = text.replace(/\{G\}/gi, TextManager.currencyUnit);
    
    text = text.replace(/\{class\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataClasses[id] ? $dataClasses[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{skill\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataSkills[id] ? $dataSkills[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{item\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataItems[id] ? $dataItems[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{weapon\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataWeapons[id] ? $dataWeapons[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{armor\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataArmors[id] ? $dataArmors[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{enemy\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataEnemies[id] ? $dataEnemies[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{troop\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataTroops[id] ? $dataTroops[id] : null;
      return data ? data.name : "";
    });

    text = text.replace(/\{state\[(\d+)\]\}/gi, (_, p1) => {
      const id = parseInt(p1);
      const data = id >= 1 && $dataStates[id] ? $dataStates[id] : null;
      return data ? data.name : "";
    });
    

    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");

    while (text.match(/\x1bV\[(\d+)\]/gi)) {
      text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
      );
    }

    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) => {
      const actorId = parseInt(p1);
      const actor = actorId >= 1 ? $gameActors.actor(actorId) : null;
      return actor ? actor.name() : "";
    });

    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) => {
      const memberIndex = parseInt(p1);
      const actor = memberIndex >= 1 ? $gameParty.members()[memberIndex - 1] : null;
      return actor ? actor.name() : "";
    });

    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);

    return text;
  };

  OnevASSISTANT._fontLoadCache = OnevASSISTANT._fontLoadCache || {};

  OnevASSISTANT.ensureFontLoaded = function (fontName, sourceHint = "") {
    if (!fontName || typeof document === "undefined" || !document.fonts) {
      return Promise.resolve();
    }

    const trimmed = String(fontName).trim();
    if (!trimmed) return Promise.resolve();

    const cache = OnevASSISTANT._fontLoadCache;
    const escapeFamily = (name) => name.replace(/"/g, '\\"');
    try {
      if (document.fonts.check(`16px "${escapeFamily(trimmed)}"`)) {
        cache[trimmed] = "loaded";
        return Promise.resolve();
      }
    } catch (_) {}

    const cached = cache[trimmed];
    if (cached === "loaded") {
      return Promise.resolve();
    }
    if (cached && typeof cached.then === "function") {
      return cached;
    }

    const normalizeSource = (src) => {
      if (!src) return "";
      return src.match(/^fonts\//i) ? src : `fonts/${src}`;
    };

    const attempts = [];
    if (sourceHint) {
      attempts.push({ family: trimmed, url: normalizeSource(sourceHint) });
    }

    const baseName = trimmed.replace(/\.(woff2?|ttf|otf)$/i, "");
    if (!sourceHint && baseName === trimmed) {
      ["woff2", "woff", "ttf", "otf"].forEach((ext) => {
        attempts.push({ family: trimmed, url: `fonts/${trimmed}.${ext}` });
      });
    }

    const loadSequential = (index) => {
      if (index >= attempts.length || typeof FontFace === "undefined") {
        return document.fonts
          .load(`16px "${escapeFamily(trimmed)}"`)
          .catch(() => {});
      }

      const { family, url } = attempts[index];
      try {
        const font = new FontFace(family, `url("${url}")`);
        return font
          .load()
          .then((loadedFont) => {
            document.fonts.add(loadedFont);
            return loadedFont;
          })
          .catch(() => loadSequential(index + 1));
      } catch (e) {
        return loadSequential(index + 1);
      }
    };

    const promise = loadSequential(0)
      .catch(() => {})
      .then(() => {
        cache[trimmed] = "loaded";
      });

    cache[trimmed] = promise;
    return promise;
  };

  function Sprite_TextVariable(setting, baseX, baseY) {
    this.initialize(setting, baseX, baseY);
  }
  Sprite_TextVariable.prototype = Object.create(Sprite.prototype);
  Sprite_TextVariable.prototype.constructor = Sprite_TextVariable;
  Sprite_TextVariable.prototype.initialize = function (
    s,
    baseX = 0,
    baseY = 0
  ) {
    Sprite.prototype.initialize.call(this);

    this._varId = +s.VariableId || 0;
    this._fontSize = +s.FontSize || 28;
    const rawFont = (s.FontFace || "").trim();
    const fontExtMatch = rawFont.match(/\.(woff2?|ttf|otf)$/i);
    this._fontFaceSource = fontExtMatch ? rawFont : "";
    this._fontFace = fontExtMatch
      ? rawFont.replace(/\.(woff2?|ttf|otf)$/i, "")
      : rawFont;
    this._align = s.Align || "left";
    this._textColor = s.Color || s.TextColor || "#ffffff";
    const outlineColorInput =
      typeof s.OutlineColor === "string"
        ? s.OutlineColor.trim()
        : s.OutlineColor;
    this._outlineColorDisabled = outlineColorInput === "0";
    this._outlineColor =
      outlineColorInput && outlineColorInput !== "0"
        ? outlineColorInput
        : "#000000";
    const parsedOutlineWidth = Number(s.OutlineWidth);
    this._outlineWidth = Number.isFinite(parsedOutlineWidth)
      ? Math.max(0, parsedOutlineWidth)
      : 4;
    const offsetX = +s.OffsetX || 0;
    const offsetY = +s.OffsetY || 0;
    this.x = baseX + offsetX;
    this.y = baseY + offsetY;
    this._baseX = this.x;
    this._baseY = this.y;
    this._originalX = this.x;
    this._originalY = this.y;
    this._value = null;
    this.bitmap = new Bitmap(1, 1);
    this._fontReady = !this._fontFace;
    this._showSwitch = +s.ShowSwitch || 0;
    this._showVariable = +s.ShowVariable || 0;
    this._showOperator = s.ShowOperator || "==";
    this._showValue = +s.ShowValue || 0;
    this._showCondition = s.DisplayCondition || s.ShowCondition || "";
    this._prohibitCondition = s.ProhibitCondition || "";
    this._fadeFrames = +s.FadeFrames || 0;
    this._fadeProgress = 0;
    this._fadeDirection = 0;
    this._shouldBeVisible = true;
    this._lastVisibleState = null;
    this._nextVisible = true;
    this._targetVisible = true;
    this._fadeConfig = null;
    this._fadeTween = null;
    this._fadeDelayActive = false;
    this._pendingAppearEffect = false;
    this._decorationConfig = OnevASSISTANT.safeJsonParse(s.DecorationWindow || "{}");
    const leftImg = (this._decorationConfig.LeftImage || "").trim();
    const centerImg = (this._decorationConfig.CenterImage || "").trim();
    const rightImg = (this._decorationConfig.RightImage || "").trim();
    this._decorationEnabled = !!(leftImg || centerImg || rightImg);
    this._decorationSprites = null;
    this._decorationBitmaps = null;
    this._decorationReady = false;
    this._textSprite = null; 

    if (this._decorationEnabled) {
      this._decorationBitmaps = {
        left: leftImg ? ImageManager.loadBitmap("img/UI/", leftImg) : null,
        center: centerImg ? ImageManager.loadBitmap("img/UI/", centerImg) : null,
        right: rightImg ? ImageManager.loadBitmap("img/UI/", rightImg) : null
      };
      this.visible = false;
    }

    if (this._fontFace) {
      OnevASSISTANT.ensureFontLoaded(this._fontFace, this._fontFaceSource)
        .catch(() => {})
        .finally(() => {
          this._fontReady = true;
          this._value = null;
          this.forceRedraw();
          setTimeout(() => {
            this._value = null;
            this.forceRedraw();
          }, 100);
        });
    }
  };

  Sprite_TextVariable.prototype.forceRedraw = function () {
    const rawValue = String($gameVariables.value(this._varId));
    const v = OnevASSISTANT.convertEscapeCharacters(rawValue);
    this._value = rawValue;
    const fontSize = this._fontSize;
    const fontFace = this._fontFace || "GameFont";
    let align = this._align;
    if (align === "左揃え") align = "left";
    if (align === "中央揃え") align = "center";
    if (align === "右揃え") align = "right";

    const temp = new Bitmap(1, 1);
    temp.fontSize = fontSize;
    temp.fontFace = fontFace;
    const measuredWidth = Math.ceil(temp.measureTextWidth(v));
    const padding = 16;
    const boxWidth = measuredWidth + padding * 2;
    const boxHeight = fontSize + padding;
    const bmp = new Bitmap(boxWidth, boxHeight);
    bmp.fontSize = fontSize;
    bmp.fontFace = fontFace;
    bmp.textColor = this._textColor;
    const outlineActive =
      !this._outlineColorDisabled && this._outlineWidth > 0;
    bmp.outlineColor = outlineActive ? this._outlineColor : "rgba(0,0,0,0)";
    bmp.outlineWidth = outlineActive ? this._outlineWidth : 0;
    bmp.drawText(v, 0, 0, boxWidth, boxHeight, align);

    if (this._decorationEnabled) {
      this.sortableChildren = true;
      
      if (!this._textSprite) {
        this._textSprite = new Sprite();
        this._textSprite.zIndex = 10;
        this._textSprite.visible = false; 
        this.addChild(this._textSprite);
      }
      this._textSprite.bitmap = bmp;
      this.bitmap = new Bitmap(1, 1);
      
      switch (align) {
        case "left":
          this._textSprite.anchor.set(0, 0.5);
          break;
        case "center":
          this._textSprite.anchor.set(0.5, 0.5);
          break;
        case "right":
          this._textSprite.anchor.set(1, 0.5);
          break;
        default:
          this._textSprite.anchor.set(0.5, 0.5);
      }
      this._textSprite.x = 0;
      this._textSprite.y = 0;
      this.anchor.set(0, 0);
    } else {
      this.bitmap = bmp;
      switch (align) {
        case "left":
          this.anchor.set(0, 0.5);
          break;
        case "center":
          this.anchor.set(0.5, 0.5);
          break;
        case "right":
          this.anchor.set(1, 0.5);
          break;
        default:
          this.anchor.set(0.5, 0.5);
      }
    }

    this.x = this._baseX;
    this.y = this._baseY;

    if (this._decorationEnabled) {
      this._updateDecorationWindow(measuredWidth);
    }
  };

  Sprite_TextVariable.prototype._updateDecorationWindow = function (textWidth) {
    const cfg = this._decorationConfig;
    const offsetX = Number(cfg.OffsetX) || 0;
    const offsetY = Number(cfg.OffsetY) || 0;
    const paddingLeft = Number(cfg.PaddingLeft) || 0;
    const paddingRight = Number(cfg.PaddingRight) || 0;

    if (!this._decorationSprites) {
      this._decorationSprites = {
        left: new Sprite(),
        center: new Sprite(),
        right: new Sprite()
      };
      this._decorationSprites.left.zIndex = -1;
      this._decorationSprites.center.zIndex = -1;
      this._decorationSprites.right.zIndex = -1;
      this._decorationSprites.left.visible = false;
      this._decorationSprites.center.visible = false;
      this._decorationSprites.right.visible = false;
      this.addChild(this._decorationSprites.center);
      this.addChild(this._decorationSprites.left);
      this.addChild(this._decorationSprites.right);

      const sprites = this._decorationSprites;
      const bmps = this._decorationBitmaps;
      if (bmps) {
        sprites.left.bitmap = bmps.left;
        sprites.center.bitmap = bmps.center;
        sprites.right.bitmap = bmps.right;
      }
    }

    const sprites = this._decorationSprites;
    const bmps = this._decorationBitmaps;
    const leftBmp = bmps ? bmps.left : null;
    const centerBmp = bmps ? bmps.center : null;
    const rightBmp = bmps ? bmps.right : null;

    const leftReady = !leftBmp || leftBmp.isReady();
    const centerReady = !centerBmp || centerBmp.isReady();
    const rightReady = !rightBmp || rightBmp.isReady();

    if (!leftReady || !centerReady || !rightReady) {
      if (!this._decorationReady) {
        setTimeout(() => this._updateDecorationWindow(textWidth), 16);
      }
      return;
    }

    this._decorationReady = true;

    const leftW = leftBmp ? leftBmp.width : 0;
    const rightW = rightBmp ? rightBmp.width : 0;

    const totalTextWidth = textWidth + paddingLeft + paddingRight;
    const centerWidth = Math.max(0, totalTextWidth);
    const totalDecoWidth = leftW + centerWidth + rightW;

    let baseX = 0;
    const align = this._align;
    if (align === "left" || align === "左揃え") {
      baseX = -leftW - paddingLeft;
    } else if (align === "center" || align === "中央揃え") {
      baseX = -totalDecoWidth / 2;
    } else if (align === "right" || align === "右揃え") {
      baseX = -centerWidth - leftW + paddingRight;
    }

    sprites.left.x = baseX + offsetX;
    sprites.left.y = offsetY;
    sprites.left.anchor.set(0, 0.5);
    
    sprites.center.x = baseX + leftW + offsetX;
    sprites.center.y = offsetY;
    sprites.center.anchor.set(0, 0.5);
    if (centerBmp && centerBmp.width > 0) {
      sprites.center.scale.x = centerWidth / centerBmp.width;
    }

    sprites.right.x = baseX + leftW + centerWidth + offsetX;
    sprites.right.y = offsetY;
    sprites.right.anchor.set(0, 0.5);
    sprites.left.visible = true;
    sprites.center.visible = true;
    sprites.right.visible = true;

    if (this._textSprite) {
      this._textSprite.visible = true;
    }

    this.visible = true;
  };

  Sprite_TextVariable.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (!this._fontReady) return;

    const shouldShow = this._evaluateCondition();

    if (this._fadeConfig) {
      this._nextVisible = shouldShow;
    } else if (this._fadeFrames > 0) {
      if (shouldShow !== this._lastVisibleState) {
        this._lastVisibleState = shouldShow;
        this._fadeDirection = shouldShow ? 1 : -1;
        this._fadeProgress = shouldShow ? 0 : this._fadeFrames;
      }

      if (this._fadeDirection !== 0) {
        if (this._fadeDirection === 1) {
          this._fadeProgress++;
          if (this._fadeProgress >= this._fadeFrames) {
            this._fadeProgress = this._fadeFrames;
            this._fadeDirection = 0;
          }
        } else {
          this._fadeProgress--;
          if (this._fadeProgress <= 0) {
            this._fadeProgress = 0;
            this._fadeDirection = 0;
          }
        }
        this.alpha = this._fadeProgress / this._fadeFrames;
        this.visible = this._fadeProgress > 0;
      }
      if (!shouldShow && this._fadeProgress <= 0) {
        this.visible = false;
        return;
      }
    } else {
      if (!shouldShow) {
        this.visible = false;
        return;
      } else {
        this.visible = true;
      }
    }

    const v = String($gameVariables.value(this._varId));
    if (v !== this._value || this._value === null) {
      this.forceRedraw();
    }
  };

  Sprite_TextVariable.prototype.updateText = function (force = false) {
    const v = String($gameVariables.value(this._varId));
    if (!force && v === this._value) return;
    this.forceRedraw();
  };

  Sprite_TextVariable.prototype._evaluateCondition = function () {
    if (this._prohibitCondition) {
      try {
        const parsed = typeof this._prohibitCondition === "string" 
          ? JSON.parse(this._prohibitCondition) 
          : this._prohibitCondition;
        if (parsed.Conditions) {
          let conditions = parsed.Conditions;
          if (typeof conditions === "string") {
            conditions = JSON.parse(conditions);
          }
          if (Array.isArray(conditions) && conditions.length === 0) {
          } else if (evaluateCondition(this._prohibitCondition)) {
            return false;
          }
        } else if (evaluateCondition(this._prohibitCondition)) {
          return false;
        }
      } catch (e) {
        if (evaluateCondition(this._prohibitCondition)) {
          return false;
        }
      }
    }

    if (this._showCondition) {
      try {
        const parsed = typeof this._showCondition === "string" 
          ? JSON.parse(this._showCondition) 
          : this._showCondition;
        if (parsed.Conditions) {
          let conditions = parsed.Conditions;
          if (typeof conditions === "string") {
            conditions = JSON.parse(conditions);
          }
          if (Array.isArray(conditions) && conditions.length === 0) {
          } else {
            return evaluateCondition(this._showCondition);
          }
        } else {
          return evaluateCondition(this._showCondition);
        }
      } catch (e) {
        return evaluateCondition(this._showCondition);
      }
    }

    if (this._showSwitch > 0) {
      if (!$gameSwitches.value(this._showSwitch)) {
        return false;
      }
    }

    if (this._showVariable > 0) {
      const v = $gameVariables.value(this._showVariable);
      const op = this._showOperator;
      const cmp = this._showValue;

      switch (op) {
        case "==":
        case "等しい（==）":
          return v == cmp;
        case "!=":
          return v != cmp;
        case ">=":
        case "以上（>=）":
          return v >= cmp;
        case "<=":
        case "以下（<=）":
          return v <= cmp;
        case ">":
        case "より大きい（>）":
          return v > cmp;
        case "<":
        case "より小さい（<）":
          return v < cmp;
        default:
          return true;
      }
    }

    return true;
  };

  OnevASSISTANT.updateChoiceClicks = function () {
    const now = performance.now();
    if (now - OnevASSISTANT.lastClickTime < OnevASSISTANT.clickCooldown) return;

    const point = new PIXI.Point(TouchInput.x, TouchInput.y);

    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevChoiceChildren) continue;

      for (const sp of root._onevChoiceChildren) {
        if (!sp.visible || sp._isEnabled === false) continue;
        let hit = false;
        if (OnevASSISTANT.getHoverHitRect) {
          const rect = OnevASSISTANT.getHoverHitRect(sp);
          if (rect) {
            hit =
              point.x >= rect.left &&
              point.x <= rect.right &&
              point.y >= rect.top &&
              point.y <= rect.bottom;

            if (hit && sp._ignoreTransparent !== false) {
              const sprite = sp._content || sp;
              if (sprite && sprite.bitmap && sprite.bitmap.isReady()) {
                const ax = sprite.anchor?.x ?? 0.5;
                const ay = sprite.anchor?.y ?? 0.5;
                const w = sprite.width || sprite.bitmap.width;
                const h = sprite.height || sprite.bitmap.height;
                const localX = point.x - rect.left;
                const localY = point.y - rect.top;
                const bitmapX = localX;
                const bitmapY = localY;

                if (
                  OnevASSISTANT.isPixelTransparent(sprite, bitmapX, bitmapY)
                ) {
                  hit = false;
                }
              }
            }
          }
        } else if (sp._content) {
          hit = sp._content.containsPoint(point);
        }

        if (TouchInput.isTriggered() && hit) {
          OnevASSISTANT._clickStartChoice = sp;
        }

        if (TouchInput.isReleased() && hit && OnevASSISTANT._clickStartChoice === sp) {
          OnevASSISTANT._clickStartChoice = null;
          if (OnevASSISTANT.handleChoiceSelection(sp, now)) {
            return;
          }
        }
      }
    }

    if (TouchInput.isReleased()) {
      OnevASSISTANT._clickStartChoice = null;
    }
  };

  const _Scene_Map_update_adminCommon = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update_adminCommon.call(this);

    if (OnevASSISTANT._runningCommonInterpreter) {
      OnevASSISTANT._runningCommonInterpreter.update();
      if (
        OnevASSISTANT._runningCommonInterpreter &&
        typeof OnevASSISTANT._runningCommonInterpreter.isRunning ===
          "function" &&
        !OnevASSISTANT._runningCommonInterpreter.isRunning()
      ) {
        OnevASSISTANT._runningCommonInterpreter = null;
        OnevASSISTANT._unlockAllHoverLocks();
      }
    }

    this._updateUIDrag();
    OnevASSISTANT.updateUIVisibility();
    OnevASSISTANT.updateUIFades();
    OnevASSISTANT.updateImageFades();
    OnevASSISTANT.updateHoverStates();
    OnevASSISTANT.updateHoverEffects();
    OnevASSISTANT.updateChoiceFades();
    OnevASSISTANT.updateChoiceClicks();
    OnevASSISTANT.updateGaugeFades();
    OnevASSISTANT.updateGaugeSprites();
    OnevASSISTANT.updateNumberFades();
    OnevASSISTANT.updateNumberSprites();
    OnevASSISTANT.updateTextSprites();
    OnevASSISTANT.updateTextFades();
  };

  OnevASSISTANT.updateUIVisibility = function () {
    if (OnevASSISTANT._forceHideAll && SceneManager._scene instanceof Scene_Map)
      return;

    const pluginParams = PluginManager.parameters("OnevASSISTANT") || {};
    const configs = OnevASSISTANT.parseDeep(pluginParams["UIConfigs"] || "[]");

    const allConfigs = [...configs];
    for (const [name, dynamicConfig] of OnevASSISTANT._dynamicUIConfigs) {
      if (!allConfigs.find((c) => c.Name === name)) {
        allConfigs.push(dynamicConfig);
      }
    }

    for (const cfg of allConfigs) {
      const name = cfg.Name;
      const sprite = OnevASSISTANT._activeSprites[name];
      if (!sprite) continue;

      const rawImgs =
        typeof cfg.ImageSprites === "string"
          ? JSON.parse(cfg.ImageSprites || "[]")
          : cfg.ImageSprites || [];
      const imgConfs = rawImgs
        .map((s) => {
          try {
            return typeof s === "string" ? JSON.parse(s) : s;
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      const imageSprites = sprite._onevImageChildren || [];
      imgConfs.forEach((imgCfg, idx) => {
        const child = imageSprites[idx];
        if (!child) return;
        
        if (child._fadeTween || child._fadeDelayActive) return;
        
        if (child._pendingAppearEffect) return;
        
        if (child._nextVisible !== child._targetVisible) return;
        
        const showCondStr = imgCfg.ShowCondition || "{}";
        const prohibitCondStr = imgCfg.ProhibitCondition || "{}";
        const shouldShow = evaluateCondition(showCondStr);
        const shouldProhibit = hasConditionSet(prohibitCondStr) && evaluateCondition(prohibitCondStr);
        const ok = shouldShow && !shouldProhibit;
        
        if (child._targetVisible === ok) return;
        
        const fadeCfg = child._fadeConfig;
        const appearCfg = OnevASSISTANT.safeJsonParse(fadeCfg?.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(fadeCfg?.DisappearEffect || "{}");
        const useAppearEffect = String(appearCfg.UseEffect) === "true" || 
          String(appearCfg.UseScale) === "true" || 
          String(appearCfg.UseOffset) === "true" || 
          Number(appearCfg.FadeFrames) > 0;
        const useDisappearEffect = String(disappearCfg.UseEffect) === "true" || 
          String(disappearCfg.UseScale) === "true" || 
          String(disappearCfg.UseOffset) === "true" || 
          Number(disappearCfg.FadeFrames) > 0;
        
        if (ok && useAppearEffect) {
          child._nextVisible = true;
        } else if (!ok && useDisappearEffect) {
          child._nextVisible = false;
        } else {
          child.visible = ok;
          child.alpha = ok ? 1 : 0;
          child._targetVisible = ok;
          child._nextVisible = ok;
        }
      });

      const choiceSprites = sprite._onevChoiceChildren || [];
      choiceSprites.forEach((sp) => {
        const enCondStr = sp._choiceMeta.EnableCondition || "{}";
        const isEnabled = evaluateCondition(enCondStr);
        const wasEnabled = sp._isEnabled !== false;
        const isBecomingEnabled = !wasEnabled && isEnabled;
        
        if (isBecomingEnabled) {
          sp._needInitialHitCheck = true;
          sp._initialHoverFlag = false;
          sp._initialSilentHover = false;
        }
        
        if (sp._isEnabled !== isEnabled) {
          sp._isEnabled = isEnabled;
          sp.interactive = isEnabled;
          sp.buttonMode = isEnabled;
          const target = sp._content || sp;
          if (!isEnabled) {
            const img = sp._choiceMeta.DisabledImage;
            if (img) {
              target.bitmap = ImageManager.loadBitmap("img/UI/", img);
            }
          } else {
            const orig = sp._choiceMeta.Image;
            if (orig) {
              target.bitmap = ImageManager.loadBitmap("img/UI/", orig);
            }
            sp.alpha = 1;
          }
        }

        if (sp._fadeTween || sp._fadeDelayActive) return;
        
        if (sp._pendingAppearEffect) return;
        
        if (sp._nextVisible !== sp._targetVisible) return;
        
        const showCondStr = sp._choiceMeta.ShowCondition || "{}";
        const shouldShow = evaluateCondition(showCondStr);
        
        if (sp._targetVisible === shouldShow) return;
        
        const fadeCfg = sp._fadeConfig;
        const wasTargetVisible = sp._targetVisible !== false;
        const isBecomingVisible = !wasTargetVisible && shouldShow;
        const appearCfg = OnevASSISTANT.safeJsonParse(fadeCfg?.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(fadeCfg?.DisappearEffect || "{}");
        const hasAppearEffect = String(appearCfg.UseEffect) === "true" || 
          String(appearCfg.UseScale) === "true" || 
          String(appearCfg.UseOffset) === "true" || 
          Number(appearCfg.FadeFrames) > 0;
        const hasDisappearEffect = String(disappearCfg.UseEffect) === "true" || 
          String(disappearCfg.UseScale) === "true" || 
          String(disappearCfg.UseOffset) === "true" || 
          Number(disappearCfg.FadeFrames) > 0;
        
        if (isBecomingVisible) {
          sp._needInitialHitCheck = true;
          sp._initialHoverFlag = false;
          sp._initialSilentHover = false;
        }
        
        if (shouldShow && hasAppearEffect) {
          sp._nextVisible = true;
        } else if (!shouldShow && hasDisappearEffect) {
          sp._nextVisible = false;
        } else {
          sp.visible = shouldShow;
          sp.alpha = shouldShow ? 1 : 0;
          sp._targetVisible = shouldShow;
          sp._nextVisible = shouldShow;
        }
        
        if (!shouldShow) {
          const target = sp._content || sp;
          if (target._hoverExtraImages && target._hoverExtraImages.length > 0) {
            for (const img of target._hoverExtraImages) {
              if (img && !img._destroyed) {
                const imgParent = img.parent;
                if (imgParent) {
                  imgParent.removeChild(img);
                }
                img.destroy({ children: true, texture: false });
              }
            }
            target._hoverExtraImages = [];
            target._hoverExtraHideOnExitList = [];
          }
          if (target._hoverExtraImage && !target._hoverExtraImage._destroyed) {
            const imgParent = target._hoverExtraImage.parent;
            if (imgParent) {
              imgParent.removeChild(target._hoverExtraImage);
            }
            target._hoverExtraImage.destroy({ children: true, texture: false });
          }
          target._hoverExtraImage = null;
          target._hoverExtraHideOnExit = undefined;
          target._hoverExtraPictureId = undefined;
          sp._isHovered = false;
          if (target._hoverState) {
            target._hoverState = "normal";
          }
        }
      });
    }

    let shouldStopEvent = false;

    for (const cfgCheck of allConfigs) {
      const nameCheck = cfgCheck.Name;
      const spriteCheck = OnevASSISTANT._activeSprites[nameCheck];
      if (!spriteCheck || !spriteCheck._onevChoiceChildren) continue;

      const choiceSprites = spriteCheck._onevChoiceChildren || [];
      for (const sp of choiceSprites) {
        const showCondStr = sp._choiceMeta.ShowCondition || "{}";
        const shouldShow = evaluateCondition(showCondStr);
        const stopEvent = OnevASSISTANT.choiceStopEventEnabled(sp._choiceMeta);

        if (shouldShow && stopEvent) {
          shouldStopEvent = true;
          break;
        }
      }

      if (shouldStopEvent) break;
    }

    const currentStopState = shouldStopEvent;
    const previousStopState = OnevASSISTANT._lastEventStopState || false;

    if (currentStopState !== previousStopState) {
      OnevASSISTANT._lastEventStopState = currentStopState;

      if (currentStopState && !OnevASSISTANT._eventPausedByChoice) {
        OnevASSISTANT.pauseEvent();

        if ($gameMap && $gameMap._interpreter) {
          $gameMap._interpreter._waitMode = "choice";
          $gameMap._interpreter._waitCount = 999999;
        }

        if ($gameMap && $gameMap._events) {
          $gameMap._events.forEach((event, index) => {
            if (event) {
              let eventData = null;
              if (event.event && typeof event.event === "function") {
                eventData = event.event();
              } else if (event._eventId && $dataMap && $dataMap.events) {
                eventData = $dataMap.events[event._eventId];
              }

              const eventName = eventData ? eventData.name : "名前なし";
              const eventId = eventData
                ? eventData.id
                : event._eventId || index;
              const hasInterpreter = event._interpreter ? true : false;
              const isRunning =
                event._interpreter && event._interpreter.isRunning();

              let triggerType = "unknown";
              if (event._trigger !== undefined) {
                triggerType = event._trigger;
              } else if (
                eventData &&
                eventData.pages &&
                eventData.pages[0] &&
                eventData.pages[0].trigger !== undefined
              ) {
                triggerType = eventData.pages[0].trigger;
              }

              if (triggerType === 4) {
                if (event._interpreter) {
                  if (
                    (!event._interpreter._list ||
                      event._interpreter._list.length === 0) &&
                    event._interpreter._index > 0
                  ) {
                    event._interpreter.clear();
                    event.start();
                  }
                }
              }

              if (triggerType === 4 && event._interpreter) {
                if (!OnevASSISTANT.isEventStopDisabled(event)) {
                  event._interpreter._waitMode = "choice";
                  event._interpreter._waitCount = 999999;
                }
              } else if (event._interpreter && event._interpreter.isRunning()) {
                if (!OnevASSISTANT.isEventStopDisabled(event)) {
                  event._interpreter._waitMode = "choice";
                  event._interpreter._waitCount = 999999;
                }
              }
            }
          });
        }

        if ($dataCommonEvents && $gameTemp._commonEventQueue) {
          $gameTemp._commonEventQueue.forEach((interpreter) => {
            if (
              interpreter &&
              typeof interpreter.isRunning === "function" &&
              interpreter.isRunning()
            ) {
              interpreter._waitMode = "choice";
              interpreter._waitCount = 999999;
            }
          });
        }
      } else if (!currentStopState && OnevASSISTANT._eventPausedByChoice) {
        if (
          OnevASSISTANT._runningCommonInterpreter &&
          typeof OnevASSISTANT._runningCommonInterpreter.isRunning ===
            "function" &&
          OnevASSISTANT._runningCommonInterpreter.isRunning()
        ) {
          return;
        }

        if ($gameMap && $gameMap._interpreter) {
          if ($gameMap._interpreter._waitMode === "choice") {
            $gameMap._interpreter._waitMode = "";
            $gameMap._interpreter._waitCount = 0;
          }
        }

        if ($gameMap && $gameMap._events) {
          $gameMap._events.forEach((event) => {
            if (event && event._interpreter) {
              if (event._interpreter._waitMode === "choice") {
                if (!OnevASSISTANT.isEventStopDisabled(event)) {
                  event._interpreter._waitMode = "";
                  event._interpreter._waitCount = 0;
                }
              }
            }
          });
        }

        if ($dataCommonEvents && $gameTemp._commonEventQueue) {
          $gameTemp._commonEventQueue.forEach((interpreter) => {
            if (interpreter && interpreter._waitMode === "choice") {
              interpreter._waitMode = "";
              interpreter._waitCount = 0;
            }
          });
        }

        OnevASSISTANT.resumeEvent();
      }
    }
  };

  Scene_Map.prototype._updateUIDrag = function () {
    const infoMap = OnevASSISTANT._dragInfo;
    for (const name in infoMap) {
      const info = infoMap[name];
      const sp = info.sprite;
      if (TouchInput.isTriggered()) {
        const mx = TouchInput.x;
        const my = TouchInput.y;
        const left = sp.x - sp.anchor.x * sp.width;
        const top = sp.y - sp.anchor.y * sp.height;
        if (
          $gameSwitches.value(info.switchId) &&
          mx >= left &&
          mx <= left + sp.width &&
          my >= top &&
          my <= top + sp.height
        ) {
          info.dragging = true;
          info.offsetX = mx - sp.x;
          info.offsetY = my - sp.y;
        }
      } else if (TouchInput.isPressed() && info.dragging) {
        sp.x = TouchInput.x - info.offsetX;
        sp.y = TouchInput.y - info.offsetY;
      } else if (info.dragging && TouchInput.isReleased()) {
        info.dragging = false;
        $gameSystem.setUIPosition(name, sp.x, sp.y);
      }
    }
  };

  Scene_Map.prototype._updateOnevUIVisibility = function () {
    const configs = OnevASSISTANT.parseDeep(
      PluginManager.parameters("OnevASSISTANT")["UIConfigs"] || []
    );
    for (const cfg of configs) {
      const name = cfg.Name;
      const sprite = OnevASSISTANT._activeSprites[name];
      if (!sprite) continue;

      const activeSwitchIds = OnevASSISTANT.parseDeep(cfg.ActiveSwitchIds);
      sprite.visible = checkSwitches(activeSwitchIds, true);

      const rawArray = JSON.parse(cfg.ImageSprites || "[]");
      const imageConfigs = rawArray
        .map((s) => {
          try {
            return JSON.parse(s);
          } catch {
            return null;
          }
        })
        .filter((e) => e);

      const imageSprites = sprite._onevImageChildren || [];

      imageConfigs.forEach((imgCfg, idx) => {
        const child = imageSprites[idx];
        if (!child) return;

        const showCondStr = imgCfg.ShowCondition || "{}";
        const prohibitCondStr = imgCfg.ProhibitCondition || "{}";
        const shouldShow = evaluateCondition(showCondStr);
        const shouldProhibit = hasConditionSet(prohibitCondStr) && evaluateCondition(prohibitCondStr);

        child.visible = shouldShow && !shouldProhibit;
      });
    }
  };
  OnevASSISTANT.redrawAllUI = function () {
    const scene = SceneManager._scene;
    const pc = scene._spriteset && scene._spriteset._pictureContainer;
    if (!pc) return;
    for (const name of OnevASSISTANT._activeUINames) {
      if (OnevASSISTANT._activeSprites[name]?.parent === pc) continue;

      OnevASSISTANT.createUI(name);
    }
  };

  OnevASSISTANT.completeCommonEvent = function () {
    if (OnevASSISTANT._runningCommonInterpreter) {
      if (OnevASSISTANT._runningCommonInterpreter._childInterpreter) {
        OnevASSISTANT._runningCommonInterpreter._childInterpreter._list = [];
        OnevASSISTANT._runningCommonInterpreter._childInterpreter._index = 0;
        const childRef =
          OnevASSISTANT._runningCommonInterpreter._childInterpreter;
        setTimeout(() => {
          if (
            OnevASSISTANT._runningCommonInterpreter &&
            OnevASSISTANT._runningCommonInterpreter._childInterpreter ===
              childRef
          ) {
            OnevASSISTANT._runningCommonInterpreter._childInterpreter = null;
          }
        }, 0);
      }
      OnevASSISTANT._runningCommonInterpreter._list = [];
      OnevASSISTANT._runningCommonInterpreter._index = 0;
      const parentRef = OnevASSISTANT._runningCommonInterpreter;
      setTimeout(() => {
        if (OnevASSISTANT._runningCommonInterpreter === parentRef) {
          OnevASSISTANT._runningCommonInterpreter = null;
        }
      }, 0);
    }

    if (
      OnevASSISTANT._pausedInterpreter &&
      OnevASSISTANT._pausedInterpreter._waitMode === "commonEventComplete"
    ) {
      OnevASSISTANT._pausedInterpreter._waitMode = "";
      OnevASSISTANT._pausedInterpreter._waitCount = 0;
      OnevASSISTANT._pausedInterpreter._waitingCommonEventId = null;
      OnevASSISTANT._pausedInterpreter = null;
      OnevASSISTANT._waitingForCommonEventId = null;

      OnevASSISTANT._eventPausedByChoice = false;
      OnevASSISTANT._unlockAllHoverLocks();
    }

    OnevASSISTANT.resetLastClickedChoice();
  };

  const _GI_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (
      this._waitMode === "choice" &&
      (OnevASSISTANT._eventPausedByChoice || this._waitCount > 0)
    ) {
      if (
        this._eventId &&
        OnevASSISTANT.isEventStopDisabled({ _eventId: this._eventId })
      ) {
        this._waitMode = "";
        this._waitCount = 0;
        return false;
      }

      if (this._waitCount < 999999) {
        this._waitCount = 999999;
      }
      return true;
    }

    if (this._waitMode === "commonEvent") {
      if (this._childInterpreter) {
        this._childInterpreter.update();

        if (this._childInterpreter && this._childInterpreter.isRunning()) {
          return true;
        }

        this._childInterpreter = null;
        this._waitMode = "";
        OnevASSISTANT._waitingForCommonEventId = null;
        return false;
      }

      this._waitMode = "";
      OnevASSISTANT._waitingForCommonEventId = null;
      return false;
    }

    if (this._waitMode === "commonEventComplete") {
      return true;
    }

    if (this._waitMode === "ruleFade") {
      if (OnevASSISTANT.isRuleFading()) {
        return true; 
      }
      this._waitMode = "";
      return false;  
    }

    return _GI_updateWaitMode.call(this);
  };

  const _GM_updateEvents = Game_Map.prototype.updateEvents;
  Game_Map.prototype.updateEvents = function () {
    if (OnevASSISTANT._eventPausedByChoice) {
      for (const event of this._events) {
        if (
          event &&
          event._trigger === 4 &&
          OnevASSISTANT.isEventStopDisabled(event)
        ) {
          if (event._trigger === 4) {
            if (
              !event._interpreter ||
              !event._interpreter._list ||
              event._interpreter._list.length === 0
            ) {
              event._interpreter = new Game_Interpreter();
              const eventData = event.event();
              if (
                eventData &&
                eventData.pages &&
                eventData.pages[event._pageIndex]
              ) {
                event._interpreter.setup(
                  eventData.pages[event._pageIndex].list,
                  event._eventId
                );
              }
            }

            if (
              event._interpreter &&
              event._interpreter._list &&
              event._interpreter._list.length > 0
            ) {
              if (event._interpreter._waitMode === "choice") {
                event._interpreter._waitMode = "";
                event._interpreter._waitCount = 0;
              }

              let maxIterations = 100;
              let iterations = 0;

              while (
                event._interpreter.isRunning() &&
                iterations < maxIterations
              ) {
                const currentCmd = event._interpreter.currentCommand();
                if (!currentCmd) break;

                if (
                  event._interpreter._waitMode &&
                  event._interpreter._waitMode !== "choice"
                ) {
                  break;
                }

                const result = event._interpreter.executeCommand();

                if (result) {
                  event._interpreter._index++;
                } else {
                  break;
                }

                iterations++;
              }

              event._interpreter.updateWait();

              if (
                !event._interpreter.isRunning() &&
                event._interpreter._list.length > 0
              ) {
                event._interpreter._index = 0;
              }
            }
          }
        }
      }
    } else {
      _GM_updateEvents.call(this);
    }
  };

  const _GE_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function () {
    _GE_update.call(this);
  };

  const _GE_updateParallelEvent = Game_Event.prototype.updateParallelEvent;
  Game_Event.prototype.updateParallelEvent = function () {
    if (this._trigger === 4 && OnevASSISTANT.isEventStopDisabled(this)) {
      if (!this._interpreter) {
        this.setupPage();
      }
      if (this._interpreter) {
        if (!this._interpreter._list || this._interpreter._list.length === 0) {
          this._interpreter = null;
          this.setupPage();

          if (
            !this._interpreter ||
            !this._interpreter._list ||
            this._interpreter._list.length === 0
          ) {
            this._interpreter = new Game_Interpreter();
            const eventData = this.event();
            if (
              eventData &&
              eventData.pages &&
              eventData.pages[this._pageIndex]
            ) {
              this._interpreter.setup(
                eventData.pages[this._pageIndex].list,
                this._eventId
              );
            }
          }
        }

        if (this._interpreter._waitMode === "choice") {
          this._interpreter._waitMode = "";
          this._interpreter._waitCount = 0;
        }

        if (this._interpreter._list && this._interpreter._list.length > 0) {
          this._interpreter.update();
        }
      }
    } else {
      _GE_updateParallelEvent.call(this);
    }
  };

  const _GI_update = Game_Interpreter.prototype.update;
  Game_Interpreter.prototype.update = function () {
    if (this._waitMode === "commonEvent" && this._childInterpreter) {
      this._childInterpreter.update();

      if (this._childInterpreter && !this._childInterpreter.isRunning()) {
        this._childInterpreter = null;
        this._waitMode = "";
        OnevASSISTANT._waitingForCommonEventId = null;
        return;
      }

      if (this._childInterpreter) {
        return;
      }
    }

    if (OnevASSISTANT._eventPausedByChoice || this._waitMode === "choice") {
      if (OnevASSISTANT.isInterpreterAllowedDuringChoice(this)) {
        _GI_update.call(this);
        return;
      }

      if (this._waitMode === "choice" && this._waitCount < 999999) {
        this._waitCount = 999999;
      }
      return;
    }

    _GI_update.call(this);
  };

  const _GI_executeCommand = Game_Interpreter.prototype.executeCommand;
  Game_Interpreter.prototype.executeCommand = function () {
    if (OnevASSISTANT._eventPausedByChoice) {
      if (OnevASSISTANT.isInterpreterAllowedDuringChoice(this)) {
        return _GI_executeCommand.call(this);
      }
      return false;
    }

    if (this._waitCount > 0) {
      if (
        this._eventId &&
        OnevASSISTANT.isEventStopDisabled({ _eventId: this._eventId })
      ) {
        return _GI_executeCommand.call(this);
      }

      return false;
    }

    if (!OnevASSISTANT._eventPausedByChoice) {
      OnevASSISTANT.updateUIVisibility();
      if (OnevASSISTANT._lastEventStopState) {
        OnevASSISTANT.pauseEvent();
        return false;
      }
    }

    return _GI_executeCommand.call(this);
  };

  const _GI_updateWaitCount = Game_Interpreter.prototype.updateWaitCount;
  Game_Interpreter.prototype.updateWaitCount = function () {
    if (OnevASSISTANT.isInterpreterAllowedDuringChoice(this)) {
      return _GI_updateWaitCount.call(this);
    }

    if (OnevASSISTANT._eventPausedByChoice && this._waitMode === "choice") {
      return;
    }

    _GI_updateWaitCount.call(this);
  };

  const _GI_updateWait = Game_Interpreter.prototype.updateWait;
  Game_Interpreter.prototype.updateWait = function () {
    if (OnevASSISTANT.isInterpreterAllowedDuringChoice(this)) {
      return _GI_updateWait.call(this);
    }

    if (OnevASSISTANT._eventPausedByChoice && this._waitMode === "choice") {
      return true;
    }

    return _GI_updateWait.call(this);
  };

  const _GI_command121 = Game_Interpreter.prototype.command121;
  Game_Interpreter.prototype.command121 = function (params) {
    const result = _GI_command121.call(this, params);

    if (!OnevASSISTANT._eventPausedByChoice) {
      setTimeout(() => {
        OnevASSISTANT.updateUIVisibility();
        if (
          OnevASSISTANT._lastEventStopState &&
          !OnevASSISTANT._eventPausedByChoice
        ) {
          OnevASSISTANT.pauseEvent();
        }
      }, 0);
    }

    return result;
  };

  const _GI_command230 = Game_Interpreter.prototype.command230;
  Game_Interpreter.prototype.command230 = function (params) {
    return _GI_command230.call(this, params);
  };

  const _SM_createPictures = Spriteset_Map.prototype.createPictures;
  Spriteset_Map.prototype.createPictures = function () {
    _SM_createPictures.call(this);
    this._pictureContainer.interactive = true;
    this._pictureContainer.interactiveChildren = true;
    OnevASSISTANT.redrawAllUI();
  };

  const _SB_createPictures = Spriteset_Battle.prototype.createPictures;
  Spriteset_Battle.prototype.createPictures = function () {
    _SB_createPictures.call(this);
    this._pictureContainer.interactive = true;
    this._pictureContainer.interactiveChildren = true;
    OnevASSISTANT.redrawAllUI();
  };

  OnevASSISTANT.updateImageFades = function () {
    const now = performance.now();
    const msPerFrame = 1000 / 60;
    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevImageChildren) continue;
      
      let hasPendingFade = false;
      let hasActiveTween = false;
      
      root._onevImageChildren.forEach((sp) => {
        const cfg = sp._fadeConfig;
        if (!cfg) return;
        
        if (sp.bitmap && !sp.bitmap.isReady()) return;

        const appearCfg = OnevASSISTANT.safeJsonParse(cfg.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(cfg.DisappearEffect || "{}");

        if (sp._pendingAppearEffect) {
          sp._pendingAppearEffect = false;
          sp._targetVisible = false;  
          sp._nextVisible = true;
          hasPendingFade = true;
        }

        if (sp._nextVisible !== sp._targetVisible) {
          const willShow = sp._nextVisible;
          if (willShow) {
            const showCondStr = sp._showCondStr || "{}";
            const prohibitCondStr = sp._prohibitCondStr || "{}";
            const shouldShow = evaluateCondition(showCondStr);
            const shouldProhibit = hasConditionSet(prohibitCondStr) && evaluateCondition(prohibitCondStr);
            if (!shouldShow || shouldProhibit) {
              sp._nextVisible = false;
              sp._targetVisible = false;
              sp.visible = false;
              sp.alpha = 0;
              return;
            }
          }
          sp._targetVisible = willShow;

          const effectCfg = willShow ? appearCfg : disappearCfg;
          const delayFrames = Number(effectCfg.StartDelay || 0);
          
          if (delayFrames > 0) {
            sp._fadeDelayActive = true;
            sp._fadeDelayStartTime = now;
            sp._fadeDelayDuration = delayFrames * msPerFrame;
            sp._fadePendingShow = willShow;
            
            if (willShow) {
              sp.visible = false;
              sp.alpha = 0;
            }
            return;
          }
          
          OnevASSISTANT.startImageFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
        }
        
        if (sp._fadeDelayActive) {
          hasActiveTween = true;
          const elapsed = now - sp._fadeDelayStartTime;
          if (elapsed >= sp._fadeDelayDuration) {
            sp._fadeDelayActive = false;
            const willShow = sp._fadePendingShow;
            OnevASSISTANT.startImageFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
          }
          return;
        }

        if (sp._fadeTween) {
          hasActiveTween = true;
          const tRaw = (now - sp._fadeTween.startTime) / sp._fadeTween.duration;
          const t = tRaw < 1 ? tRaw : 1;
          const easedT = sp._fadeTween.easingFunc ? sp._fadeTween.easingFunc(t) : t;

          sp.alpha = sp._fadeTween.from + (sp._fadeTween.to - sp._fadeTween.from) * easedT;

          const effectCfg = sp._fadeTween.effectCfg || {};
          const willShow = sp._fadeTween.willShow;

          if (String(effectCfg.UseScale) === "true") {
            if (willShow) {
              const startScale = Number(effectCfg.StartScale || 100) / 100;
              const currentScale = startScale + (1 - startScale) * easedT;
              sp.scale.x = currentScale;
              sp.scale.y = currentScale;
            } else {
              const endScale = Number(effectCfg.EndScale || 100) / 100;
              const startScale = sp._fadeStartScale || 1;
              const currentScale = startScale + (endScale - startScale) * easedT;
              sp.scale.x = currentScale;
              sp.scale.y = currentScale;
            }
          }

          if (String(effectCfg.UseOffset) === "true") {
            if (willShow) {
              const startOffsetX = Number(effectCfg.StartOffsetX || 0);
              const startOffsetY = Number(effectCfg.StartOffsetY || 0);
              sp.x = sp._originalX + startOffsetX * (1 - easedT);
              sp.y = sp._originalY + startOffsetY * (1 - easedT);
            } else {
              const endOffsetX = Number(effectCfg.EndOffsetX || 0);
              const endOffsetY = Number(effectCfg.EndOffsetY || 0);
              const startX = sp._fadeStartX !== undefined ? sp._fadeStartX : sp._originalX;
              const startY = sp._fadeStartY !== undefined ? sp._fadeStartY : sp._originalY;
              sp.x = startX + endOffsetX * easedT;
              sp.y = startY + endOffsetY * easedT;
            }
          }

          if (t >= 1) {
            sp._fadeTween = null;
            sp._fadeDelayActive = false;
            if (!sp._targetVisible) {
              sp.visible = false;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              sp.scale.x = 1;
              sp.scale.y = 1;
            } else {
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              sp.scale.x = 1;
              sp.scale.y = 1;
            }
            sp.alpha = sp._targetVisible ? 1 : 0;
          }
        }
      });
      
      if (!hasPendingFade && !hasActiveTween && $gameSystem) {
        $gameSystem.setUIFadeCompleted(name, true);
      }
    }
  };

  OnevASSISTANT.startImageFade = function (sp, willShow, appearCfg, disappearCfg, now, msPerFrame) {
    const effectCfg = willShow ? appearCfg : disappearCfg;
    const frames = Number(effectCfg.FadeFrames) || 5;
    const duration = frames * msPerFrame;
    const easingName = effectCfg.Easing || (willShow ? "easeOutQuad" : "easeInQuad");
    const easingFunc = OnevASSISTANT.Easing[easingName] || OnevASSISTANT.Easing.linear;

    if (willShow) {
      sp.alpha = 0;
      sp.visible = true;

      if (String(appearCfg.UseScale) === "true") {
        const startScale = Number(appearCfg.StartScale || 100) / 100;
        sp.scale.x = startScale;
        sp.scale.y = startScale;
      }
      if (String(appearCfg.UseOffset) === "true") {
        sp._fadeStartOffsetX = Number(appearCfg.StartOffsetX || 0);
        sp._fadeStartOffsetY = Number(appearCfg.StartOffsetY || 0);
        sp.x = sp._originalX + sp._fadeStartOffsetX;
        sp.y = sp._originalY + sp._fadeStartOffsetY;
      }
    } else {
      sp._fadeStartScale = sp.scale.x;
      sp._fadeStartX = sp.x;
      sp._fadeStartY = sp.y;
    }

    const from = sp.alpha;
    const to = willShow ? 1 : 0;

    sp._fadeTween = {
      startTime: now,
      duration,
      from,
      to,
      willShow,
      easingFunc,
      effectCfg
    };
  };
  OnevASSISTANT.updateChoiceFades = function () {
    const now = performance.now();
    const msPerFrame = 1000 / 60;

    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevChoiceChildren) continue;

      let hasChoicePendingFade = false;
      let hasChoiceActiveTween = false;

      root._onevChoiceChildren.forEach((sp) => {
        const cfg = sp._fadeConfig;
        if (!cfg) return;
        
        const content = sp._content;
        if (content && content.bitmap && !content.bitmap.isReady()) return;

        const appearCfg = OnevASSISTANT.safeJsonParse(cfg.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(cfg.DisappearEffect || "{}");

        if (sp._pendingAppearEffect) {
          sp._pendingAppearEffect = false;
          const showCondStr = sp._choiceMeta.ShowCondition || "{}";
          const conditionNow = evaluateCondition(showCondStr);
          if (conditionNow) {
            sp._targetVisible = false;  
            sp._nextVisible = true;
            hasChoicePendingFade = true;
          } else {
            sp._targetVisible = false;
            sp._nextVisible = false;
            sp.visible = false;
            sp.alpha = 0;
          }
        }
        
        const conditionMet = sp._nextVisible !== sp._targetVisible && !sp._fadeDelayActive;

        if (conditionMet) {
          const willShow = sp._nextVisible;
          const effectCfg = willShow ? appearCfg : disappearCfg;
          const hasEffect = String(effectCfg.UseEffect) === "true" || 
            String(effectCfg.UseScale) === "true" || 
            String(effectCfg.UseOffset) === "true" || 
            Number(effectCfg.FadeFrames) > 0;
          const delayFrames = Number(effectCfg.StartDelay) || 0;
          
          if (!hasEffect) {
            sp._targetVisible = willShow;
            if (willShow) {
              sp.visible = true;
              sp.alpha = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              if (sp._content) {
                sp._content.scale.x = 1;
                sp._content.scale.y = 1;
              }
              sp._needInitialHitCheck = true;
              sp._initialHoverFlag = false;
              sp._initialSilentHover = false;
              sp.interactive = true;
              sp.buttonMode = true;
              if (sp._content) {
                sp._content.interactive = true;
                sp._content.buttonMode = true;
              }
            } else {
              sp.visible = false;
              sp.alpha = 0;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              if (sp._content) {
                sp._content.scale.x = 1;
                sp._content.scale.y = 1;
              }
            }
            sp._fadeTween = null;
            sp._fadeDelayActive = false;
            return;
          }
          
          if (delayFrames > 0) {
            sp._fadeDelayActive = true;
            sp._fadeDelayStartTime = now;
            sp._fadeDelayDuration = delayFrames * msPerFrame;
            sp._fadePendingShow = willShow;
            
            sp.interactive = false;
            sp.buttonMode = false;
            if (sp._content) {
              sp._content.interactive = false;
              sp._content.buttonMode = false;
            }
            
            if (willShow) {
              sp.visible = false;
              sp.alpha = 0;
            }
            return;
          }
          
          sp._targetVisible = willShow;
          OnevASSISTANT.startChoiceFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
        }
        
        if (sp._fadeDelayActive) {
          hasChoiceActiveTween = true;
          const elapsed = now - sp._fadeDelayStartTime;
          if (elapsed >= sp._fadeDelayDuration) {
            sp._fadeDelayActive = false;
            const willShow = sp._fadePendingShow;
            sp._targetVisible = willShow;
            OnevASSISTANT.startChoiceFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
          }
          return;
        }

        if (sp._fadeTween) {
          hasChoiceActiveTween = true;
          const tRaw = (now - sp._fadeTween.startTime) / sp._fadeTween.duration;
          const t = tRaw < 1 ? tRaw : 1;
          const easedT = sp._fadeTween.easingFunc ? sp._fadeTween.easingFunc(t) : t;

          sp.alpha = sp._fadeTween.from + (sp._fadeTween.to - sp._fadeTween.from) * easedT;

          const effectCfg = sp._fadeTween.effectCfg || {};
          const willShow = sp._fadeTween.willShow;

          if (String(effectCfg.UseScale) === "true" && sp._content) {
            if (willShow) {
              const startScale = Number(effectCfg.StartScale || 100) / 100;
              const currentScale = startScale + (1 - startScale) * easedT;
              sp._content.scale.x = currentScale;
              sp._content.scale.y = currentScale;
            } else {
              const endScale = Number(effectCfg.EndScale || 100) / 100;
              const startScale = sp._fadeStartScale || 1;
              const currentScale = startScale + (endScale - startScale) * easedT;
              sp._content.scale.x = currentScale;
              sp._content.scale.y = currentScale;
            }
          }

          if (String(effectCfg.UseOffset) === "true") {
            if (willShow) {
              const startOffsetX = Number(effectCfg.StartOffsetX || 0);
              const startOffsetY = Number(effectCfg.StartOffsetY || 0);
              sp.x = sp._originalX + startOffsetX * (1 - easedT);
              sp.y = sp._originalY + startOffsetY * (1 - easedT);
            } else {
              const endOffsetX = Number(effectCfg.EndOffsetX || 0);
              const endOffsetY = Number(effectCfg.EndOffsetY || 0);
              const startX = sp._fadeStartX !== undefined ? sp._fadeStartX : sp._originalX;
              const startY = sp._fadeStartY !== undefined ? sp._fadeStartY : sp._originalY;
              sp.x = startX + endOffsetX * easedT;
              sp.y = startY + endOffsetY * easedT;
            }
          }

          if (t >= 1) {
            sp._fadeTween = null;
            if (!sp._targetVisible) {
              sp.visible = false;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              if (sp._content) {
                sp._content.scale.x = 1;
                sp._content.scale.y = 1;
              }
            } else {
              sp.x = sp._originalX;
              sp.y = sp._originalY;
              if (sp._content) {
                sp._content.scale.x = 1;
                sp._content.scale.y = 1;
              }
              sp.interactive = true;
              sp.buttonMode = true;
              if (sp._content) {
                sp._content.interactive = true;
                sp._content.buttonMode = true;
              }
            }
            sp.alpha = sp._targetVisible ? 1 : 0;
          }
        }
      });
      
      if (!hasChoicePendingFade && !hasChoiceActiveTween && $gameSystem) {
        const imageHasPending = root._onevImageChildren && root._onevImageChildren.some(sp => sp._pendingAppearEffect || sp._fadeTween || sp._fadeDelayActive);
        if (!imageHasPending) {
          $gameSystem.setUIFadeCompleted(name, true);
        }
      }
    }
  };

  OnevASSISTANT.startChoiceFade = function (sp, willShow, appearCfg, disappearCfg, now, msPerFrame) {
    if (sp._isHovered) {
      sp._isHovered = false;
      sp._initialSilentHover = false;
      sp._suppressSEOnFirstEnter = false;
      const tgt = sp._content || sp;
      tgt._hoverReqId = (tgt._hoverReqId || 0) + 1;
      OnevASSISTANT.clearHoverEffect(sp, true);
      tgt._hoverState = "normal";
    }

    const effectCfg = willShow ? appearCfg : disappearCfg;
    const frames = Number(effectCfg.FadeFrames) || 5;
    const duration = frames * msPerFrame;
    const easingName = effectCfg.Easing || (willShow ? "easeOutQuad" : "easeInQuad");
    const easingFunc = OnevASSISTANT.Easing[easingName] || OnevASSISTANT.Easing.linear;

    if (willShow) {
      sp.alpha = 0;
      sp.visible = true;
      sp._needInitialHitCheck = true;
      sp._initialHoverFlag = false;
      sp._initialSilentHover = false;
      
      sp.interactive = false;
      sp.buttonMode = false;
      if (sp._content) {
        sp._content.interactive = false;
        sp._content.buttonMode = false;
      }

      if (String(appearCfg.UseScale) === "true" && sp._content) {
        const startScale = Number(appearCfg.StartScale || 100) / 100;
        sp._content.scale.x = startScale;
        sp._content.scale.y = startScale;
      }
      if (String(appearCfg.UseOffset) === "true") {
        sp._fadeStartOffsetX = Number(appearCfg.StartOffsetX || 0);
        sp._fadeStartOffsetY = Number(appearCfg.StartOffsetY || 0);
        sp.x = sp._originalX + sp._fadeStartOffsetX;
        sp.y = sp._originalY + sp._fadeStartOffsetY;
      }
    } else {
      sp._fadeStartScale = sp._content ? sp._content.scale.x : 1;
      sp._fadeStartX = sp.x;
      sp._fadeStartY = sp.y;
      sp.interactive = false;
      sp.buttonMode = false;
      if (sp._content) {
        sp._content.interactive = false;
        sp._content.buttonMode = false;
      }
    }

    const from = sp.alpha;
    const to = willShow ? 1 : 0;

    sp._fadeTween = {
      startTime: now,
      duration,
      from,
      to,
      willShow,
      easingFunc,
      effectCfg
    };
  };

  OnevASSISTANT.updateTextFades = function () {
    const now = performance.now();
    const msPerFrame = 1000 / 60;

    for (const name of OnevASSISTANT._activeUINames) {
      const root = OnevASSISTANT._activeSprites[name];
      if (!root || !root._onevTextChildren) continue;

      root._onevTextChildren.forEach((sp) => {
        const cfg = sp._fadeConfig;
        if (!cfg) return;

        if (!sp._fontReady) return;

        const appearCfg = OnevASSISTANT.safeJsonParse(cfg.AppearEffect || "{}");
        const disappearCfg = OnevASSISTANT.safeJsonParse(cfg.DisappearEffect || "{}");

        if (sp._pendingAppearEffect) {
          sp._pendingAppearEffect = false;
          const conditionNow = sp._evaluateCondition();
          if (conditionNow) {
            sp._targetVisible = false;
            sp._nextVisible = true;
          } else {
            sp._targetVisible = false;
            sp._nextVisible = false;
            sp.visible = false;
            sp.alpha = 0;
          }
        }

        if (sp._nextVisible !== sp._targetVisible) {
          const willShow = sp._nextVisible;
          sp._targetVisible = willShow;

          const effectCfg = willShow ? appearCfg : disappearCfg;
          const delayFrames = Number(effectCfg.StartDelay || 0);

          if (delayFrames > 0) {
            sp._fadeDelayActive = true;
            sp._fadeDelayStartTime = now;
            sp._fadeDelayDuration = delayFrames * msPerFrame;
            sp._fadePendingShow = willShow;

            if (willShow) {
              sp.visible = false;
              sp.alpha = 0;
            }
            return;
          }

          OnevASSISTANT.startTextFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
        }

        if (sp._fadeDelayActive) {
          const elapsed = now - sp._fadeDelayStartTime;
          if (elapsed >= sp._fadeDelayDuration) {
            sp._fadeDelayActive = false;
            const willShow = sp._fadePendingShow;
            OnevASSISTANT.startTextFade(sp, willShow, appearCfg, disappearCfg, now, msPerFrame);
          }
          return;
        }

        if (sp._fadeTween) {
          const tRaw = (now - sp._fadeTween.startTime) / sp._fadeTween.duration;
          const t = tRaw < 1 ? tRaw : 1;
          const easedT = sp._fadeTween.easingFunc ? sp._fadeTween.easingFunc(t) : t;

          sp.alpha = sp._fadeTween.from + (sp._fadeTween.to - sp._fadeTween.from) * easedT;

          const effectCfg = sp._fadeTween.effectCfg || {};
          const willShow = sp._fadeTween.willShow;

          const hasScale = willShow 
            ? Number(effectCfg.StartScale || 100) !== 100 
            : Number(effectCfg.EndScale || 100) !== 100;
          if (hasScale) {
            if (willShow) {
              const startScale = Number(effectCfg.StartScale || 100) / 100;
              const currentScale = startScale + (1 - startScale) * easedT;
              sp.scale.x = currentScale;
              sp.scale.y = currentScale;
            } else {
              const endScale = Number(effectCfg.EndScale || 100) / 100;
              const startScale = sp._fadeStartScale || 1;
              const currentScale = startScale + (endScale - startScale) * easedT;
              sp.scale.x = currentScale;
              sp.scale.y = currentScale;
            }
          }

          const hasOffset = willShow 
            ? (Number(effectCfg.StartOffsetX || 0) !== 0 || Number(effectCfg.StartOffsetY || 0) !== 0)
            : (Number(effectCfg.EndOffsetX || 0) !== 0 || Number(effectCfg.EndOffsetY || 0) !== 0);
          if (hasOffset) {
            if (willShow) {
              const startOffsetX = Number(effectCfg.StartOffsetX || 0);
              const startOffsetY = Number(effectCfg.StartOffsetY || 0);
              sp.x = sp._originalX + startOffsetX * (1 - easedT);
              sp.y = sp._originalY + startOffsetY * (1 - easedT);
            } else {
              const endOffsetX = Number(effectCfg.EndOffsetX || 0);
              const endOffsetY = Number(effectCfg.EndOffsetY || 0);
              sp.x = sp._originalX + endOffsetX * easedT;
              sp.y = sp._originalY + endOffsetY * easedT;
            }
          }

          if (t >= 1) {
            sp._fadeTween = null;
            if (!willShow) {
              sp.visible = false;
              sp.alpha = 0;
            } else {
              sp.visible = true;
              sp.alpha = 1;
              sp.scale.x = 1;
              sp.scale.y = 1;
              sp.x = sp._originalX;
              sp.y = sp._originalY;
            }
          }
        }
      });
    }
  };

  OnevASSISTANT.startTextFade = function (sp, willShow, appearCfg, disappearCfg, now, msPerFrame) {
    const effectCfg = willShow ? appearCfg : disappearCfg;
    const frames = Number(effectCfg.FadeFrames) || 5;
    const duration = frames * msPerFrame;
    const easingName = effectCfg.Easing || (willShow ? "easeOutQuad" : "easeInQuad");
    const easingFunc = OnevASSISTANT.Easing[easingName] || OnevASSISTANT.Easing.linear;

    if (willShow) {
      sp.alpha = 0;
      sp.visible = true;

      const hasScale = Number(appearCfg.StartScale || 100) !== 100;
      if (hasScale) {
        const startScale = Number(appearCfg.StartScale || 100) / 100;
        sp.scale.x = startScale;
        sp.scale.y = startScale;
      }
      const hasOffset = Number(appearCfg.StartOffsetX || 0) !== 0 || Number(appearCfg.StartOffsetY || 0) !== 0;
      if (hasOffset) {
        sp._fadeStartOffsetX = Number(appearCfg.StartOffsetX || 0);
        sp._fadeStartOffsetY = Number(appearCfg.StartOffsetY || 0);
        sp.x = sp._originalX + sp._fadeStartOffsetX;
        sp.y = sp._originalY + sp._fadeStartOffsetY;
      }
    } else {
      sp._fadeStartScale = sp.scale.x;
      sp._fadeStartX = sp.x;
      sp._fadeStartY = sp.y;
    }

    const from = sp.alpha;
    const to = willShow ? 1 : 0;

    sp._fadeTween = {
      startTime: now,
      duration,
      from,
      to,
      willShow,
      easingFunc,
      effectCfg
    };
  };

  OnevASSISTANT.removeUI = function (name) {
    const scene = SceneManager._scene;
    const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;
    if (!pc) return;

    if ($gameSystem && $gameSystem.removeCustomUI) {
      $gameSystem.removeCustomUI(name);
    }

    const oldSprite = OnevASSISTANT._activeSprites[name];
    if (oldSprite && oldSprite._onevChoiceChildren) {
      oldSprite._onevChoiceChildren.forEach(function(sp) {
        if (!sp) return;
        sp._isHovered = false;
        const tgt = sp._content || sp;
        if (tgt._hoverFrame && !tgt._hoverFrame._destroyed) {
          try { if (typeof tgt._hoverFrame.stop === "function") tgt._hoverFrame.stop(); } catch (_) {}
          if (tgt._hoverFrame.parent) tgt._hoverFrame.parent.removeChild(tgt._hoverFrame);
          tgt._hoverFrame.destroy({ children: true, texture: false, baseTexture: false });
          tgt._hoverFrame = null;
        }
        if (tgt._hoverExtraImages && tgt._hoverExtraImages.length > 0) {
          tgt._hoverExtraImages.forEach(function(img) {
            if (img && !img._destroyed) {
              if (img.parent) img.parent.removeChild(img);
              img.destroy({ children: true, texture: false });
            }
          });
          tgt._hoverExtraImages = [];
        }
        if (tgt._hoverExtraImage && !tgt._hoverExtraImage._destroyed) {
          if (tgt._hoverExtraImage.parent) tgt._hoverExtraImage.parent.removeChild(tgt._hoverExtraImage);
          tgt._hoverExtraImage.destroy({ children: true, texture: false });
          tgt._hoverExtraImage = null;
        }
      });
    }

    OnevASSISTANT._activeUINames.delete(name);
    delete OnevASSISTANT._activeSprites[name];

    const configs = OnevASSISTANT.parseDeep(parameters["UIConfigs"] || []);
    const cfg = configs.find((c) => c.Name === name);
    if (cfg) {
      const activeIds = OnevASSISTANT.parseDeep(cfg.ActiveSwitchIds || []);
      activeIds.forEach((id) => {
        if (+id > 0) $gameSwitches.setValue(+id, false);
      });
    }

    for (let i = pc.children.length - 1; i >= 0; i--) {
      const child = pc.children[i];
      if (child._onevUIName === name) {
        pc.removeChildAt(i);
      }
    }
  };

  OnevASSISTANT.removeAllUI = function () {
    const scene = SceneManager._scene;
    const pc = scene && scene._spriteset && scene._spriteset._pictureContainer;
    const names = [...OnevASSISTANT._activeUINames];


    if (pc) {
      for (const name of names) {
        for (let i = pc.children.length - 1; i >= 0; i--) {
          const child = pc.children[i];
          if (child._onevUIName === name) {
            pc.removeChildAt(i);
          }
        }
      }
    }


    for (const name of names) {
      const sp = OnevASSISTANT._activeSprites[name];
      if (!sp || sp.destroyed) continue;

      try {

        if (sp._texture) {
          sp.destroy({ children: true, texture: false, baseTexture: false });
        } else {

          if (sp.removeChildren) sp.removeChildren();
          if (sp.parent) sp.parent.removeChild(sp);
          if (sp.destroy) sp.destroy({ children: true, texture: false, baseTexture: false });
        }
      } catch (err) {
        console.warn("[OnevASSISTANT] Failed to destroy UI sprite", { name, err });
      }
    }

    OnevASSISTANT._activeUINames.clear();
    OnevASSISTANT._activeSprites = {};

    if ($gameSystem && $gameSystem.clearCustomUIs) {
      $gameSystem.clearCustomUIs();
    }
  };

  OnevASSISTANT.hideAllUI = function () {
    OnevASSISTANT._forceHideAll = true;
    for (const name of OnevASSISTANT._activeUINames) {
      const sp = OnevASSISTANT._activeSprites[name];
      if (sp) sp.visible = false;
    }
  };


  OnevASSISTANT.hideAllUIWithFade = function (fadeFrames) {
    OnevASSISTANT._forceHideAll = true;
    fadeFrames = Number(fadeFrames) || 0;

    for (const name of OnevASSISTANT._activeUINames) {
      OnevASSISTANT.hideUIWithFade(name, fadeFrames);
    }
  };

  OnevASSISTANT.showAllUI = function () {
    OnevASSISTANT._forceHideAll = false;
    for (const name of OnevASSISTANT._activeUINames) {
      const sp = OnevASSISTANT._activeSprites[name];
      if (sp) sp.visible = true;
    }
  };


  OnevASSISTANT.showAllUIWithFade = function (fadeFrames) {
    OnevASSISTANT._forceHideAll = false;
    fadeFrames = Number(fadeFrames) || 0;

    for (const name of OnevASSISTANT._activeUINames) {
      OnevASSISTANT.showUIWithFade(name, fadeFrames);
    }
  };


  OnevASSISTANT.hideUI = function (name) {
    const sp = OnevASSISTANT._activeSprites[name];
    if (sp) {
      sp.visible = false;
      sp.alpha = 0;
      sp._manuallyHidden = true;
    }
  };


  OnevASSISTANT.showUI = function (name) {
    const sp = OnevASSISTANT._activeSprites[name];
    if (sp) {
      sp.visible = true;
      sp.alpha = 1;
      sp._manuallyHidden = false;
    }
  };


  OnevASSISTANT.hideUIWithFade = function (name, fadeFrames) {
    const sp = OnevASSISTANT._activeSprites[name];
    if (!sp) return;

    fadeFrames = Number(fadeFrames) || 0;
    sp._manuallyHidden = true;

    if (fadeFrames <= 0) {
      sp.visible = false;
      sp.alpha = 0;
      return;
    }

    const msPerFrame = 1000 / 60;
    const duration = fadeFrames * msPerFrame;
    const startTime = performance.now();
    const startAlpha = sp.alpha;

    sp._uiFadeTween = {
      startTime: startTime,
      duration: duration,
      from: startAlpha,
      to: 0,
      onComplete: function () {
        sp.visible = false;
        sp._uiFadeTween = null;
      }
    };
  };


  OnevASSISTANT.showUIWithFade = function (name, fadeFrames) {
    const sp = OnevASSISTANT._activeSprites[name];
    if (!sp) return;

    fadeFrames = Number(fadeFrames) || 0;
    sp._manuallyHidden = false;
    sp.visible = true;

    if (fadeFrames <= 0) {
      sp.alpha = 1;
      return;
    }

    const msPerFrame = 1000 / 60;
    const duration = fadeFrames * msPerFrame;
    const startTime = performance.now();
    const startAlpha = sp.alpha;

    sp._uiFadeTween = {
      startTime: startTime,
      duration: duration,
      from: startAlpha,
      to: 1,
      onComplete: function () {
        sp._uiFadeTween = null;
      }
    };
  };


  OnevASSISTANT.updateUIFades = function () {
    const now = performance.now();

    for (const name of OnevASSISTANT._activeUINames) {
      const sp = OnevASSISTANT._activeSprites[name];
      if (!sp || !sp._uiFadeTween) continue;

      const tween = sp._uiFadeTween;
      const elapsed = now - tween.startTime;
      const progress = Math.min(1, elapsed / tween.duration);

      sp.alpha = tween.from + (tween.to - tween.from) * progress;

      if (progress >= 1) {
        sp.alpha = tween.to;
        if (tween.onComplete) tween.onComplete();
      }
    }
  };

  PluginManager.registerCommand("OnevASSISTANT", "UI操作", function (args) {
    const action = args.action;
    const name = args.name || "";

    if (action === "表示" && name) {
      const names = name.split(",").map(n => n.trim()).filter(n => n);
      for (const uiName of names) {
        OnevASSISTANT.createUI(uiName);
      }
    }

    if (action === "消去" && name) {
      const names = name.split(",").map(n => n.trim()).filter(n => n);
      for (const uiName of names) {
        OnevASSISTANT.removeUI(uiName);
      }
    }

    if (action === "全消去") {
      OnevASSISTANT.removeAllUI();
    }

    if (action === "全非表示") {
      OnevASSISTANT.hideAllUI();
    }

    if (action === "再表示") {
      OnevASSISTANT.showAllUI();
    }
  });

  //=========================================================================
  // カスタムコモンイベント呼出管理
  //=========================================================================

  const ADMIN = JSON.parse(parameters["ADMINSettings"] || "{}");
  window.OnevASSISTANT = window.OnevASSISTANT || {};
  OnevASSISTANT._executedTriggers = new Set();
  OnevASSISTANT.resetTriggers = function () {
    this._executedTriggers.clear();
  };
  const eventTriggers = JSON.parse(ADMIN.EventTriggers || "[]").map((e) => {
    const t = JSON.parse(e);

    const parseArr = (s) => JSON.parse(s || "[]");
    const jsonOrSelf = (x) => (typeof x === "string" ? JSON.parse(x) : x);
    t.ConditionSwitches = parseArr(t.ConditionSwitches).map(Number);
    t.ProhibitSwitches = parseArr(t.ProhibitSwitches).map(Number);
    t.ConditionVariables = parseArr(t.ConditionVariables).map(jsonOrSelf);
    t.ProhibitVariables = parseArr(t.ProhibitVariables).map(jsonOrSelf);

    const normVar = (cv) => ({
      id: Number(cv.Id ?? cv.id ?? 0),
      op: cv.Operator ?? cv.op ?? "==",
      value: Number(cv.Value ?? cv.value ?? 0),
    });
    t.ConditionVariables = t.ConditionVariables.map(normVar);
    t.ProhibitVariables = t.ProhibitVariables.map(normVar);
    t.BlockIfTriggered = String(t.BlockIfTriggered) === "true";
    t.Once = String(t.Once) === "true";
    return t;
  });
  function executeEventTriggers(customName = "", options = {}) {
    const { interrupt = false, interpreter = null } = options;

    if (!OnevASSISTANT._executedTriggers) {
      OnevASSISTANT._executedTriggers = new Set();
    }

    const recordVarId = Number(ADMIN.TriggerRecordVariable || 0);
    let executedList = [];
    if (recordVarId > 0) {
      try {
        executedList = JSON.parse($gameVariables.value(recordVarId) || "[]");
      } catch {
        executedList = [];
      }
    }

    const matched = [];
    eventTriggers.forEach((t) => {
      if (t.CustomName !== customName) return;

      const ceId = Number(t.CommonEventId);
      const executed = executedList.includes(ceId);

      if (t.Once && executed) return;

      if (t.BlockIfTriggered && OnevASSISTANT._executedTriggers.has(customName))
        return;

      const okCond =
        checkSwitches(t.ConditionSwitches, true) &&
        checkVariables(t.ConditionVariables);
      const ngCond =
        (t.ProhibitSwitches.length &&
          !checkSwitches(t.ProhibitSwitches, false)) ||
        (t.ProhibitVariables.length && !checkVariables(t.ProhibitVariables));

      if (okCond && !ngCond) {
        const commonEvent = $dataCommonEvents[ceId];
        if (!commonEvent) return;
        matched.push({ t, ceId, commonEvent });
      }
    });

    if (matched.length === 0) return;

    let seenBlock = false;
    const filtered = [];
    for (const m of matched) {
      if (m.t.BlockIfTriggered) {
        if (!seenBlock) {
          filtered.push(m);
          seenBlock = true;
        }
      } else {
        filtered.push(m);
      }
    }

    if (filtered.length === 0) return;

    if (seenBlock) {
      OnevASSISTANT._executedTriggers.add(customName);
    }

    if (interrupt && interpreter) {
      const first = filtered.shift();
      try {
        if (typeof interpreter.setupChild === "function") {
          interpreter.setupChild(first.commonEvent.list, interpreter._eventId);
        } else {
          const child = new Game_Interpreter(interpreter._depth + 1);
          child.setup(first.commonEvent.list, interpreter._eventId);
          interpreter._childInterpreter = child;
        }
      } catch (e) {
        $gameTemp.reserveCommonEvent(first.ceId);
      }
      if (
        first.t.Once &&
        recordVarId > 0 &&
        !executedList.includes(first.ceId)
      ) {
        executedList.push(first.ceId);
      }
    }

    const rest = interrupt ? filtered : filtered;
    rest.forEach((m) => {
      $gameTemp.reserveCommonEvent(m.ceId);
      if (m.t.Once && recordVarId > 0 && !executedList.includes(m.ceId)) {
        executedList.push(m.ceId);
      }
    });

    if (recordVarId > 0) {
      $gameVariables.setValue(recordVarId, JSON.stringify(executedList));
    }
  }
  window.executeEventTriggers = executeEventTriggers;

  const _DM_setupNew = DataManager.setupNewGame;
  DataManager.setupNewGame = function () {
    _DM_setupNew.call(this);
    $gameTemp._adminInterceptorType = "newGame";
  };

  const _DM_loadGame = DataManager.loadGame;
  DataManager.loadGame = function (savefileId) {
    return _DM_loadGame.call(this, savefileId).then((result) => {
      $gameTemp._adminInterceptorType = "loadGame";
      console.log(
        "[OnevASSISTANT] ロード完了: adminInterceptorType = loadGame"
      );
      return result;
    });
  };

  const _GM_setupStart = Game_Map.prototype.setupStartingEvent;
  Game_Map.prototype.setupStartingEvent = function () {
    const r = _GM_setupStart.call(this);
    return r || this._setupAdminCommonInterceptor();
  };

  Game_Map.prototype._setupAdminCommonInterceptor = function () {
    const typ = $gameTemp._adminInterceptorType;

    if (!typ) return false;

    const idMap = {
      newGame: Number(ADMIN.NewGameCommonEvent || 0),
      loadGame: Number(ADMIN.LoadGameCommonEvent || 0),
      menuClose: Number(ADMIN.MenuCloseCommonEvent || 0),
    };
    const ceId = idMap[typ];

    console.log("[OnevASSISTANT] コモンイベントID", {
      typ: typ,
      ceId: ceId,
      exists: !!($dataCommonEvents && $dataCommonEvents[ceId]),
    });

    const dummyMapId = Number(
      PluginManager.parameters("OnevASSISTANT")["DummyMapId"] || 0
    );

    if ($gameMap.mapId() === dummyMapId && typ === "newGame") {
      $gameTemp._adminInterceptorType = null;
      console.log("[OnevASSISTANT] ダミーマップでスキップ");
      return false;
    }

    if (ceId > 0 && $dataCommonEvents[ceId] && !this.isEventRunning()) {
      console.log("[OnevASSISTANT] コモンイベント実行:", ceId);
      this._interpreter.setup($dataCommonEvents[ceId].list);
      $gameTemp._adminInterceptorType = null;
      return true;
    }

    console.log("[OnevASSISTANT] コモンイベント実行されず", {
      ceId: ceId,
      hasCommonEvent: !!($dataCommonEvents && $dataCommonEvents[ceId]),
      isEventRunning: this.isEventRunning(),
    });

    $gameTemp._adminInterceptorType = null;
    return false;
  };

  if (PluginManager.registerCommand) {
    PluginManager.registerCommand(
      "OnevASSISTANT",
      "CustomCommonEvent",
      function (args) {
        const name = args.name || "";
        if (name)
          executeEventTriggers(name, { interrupt: true, interpreter: this });
      }
    );
  }

  //=========================================================================
  // キャラクター表示・モーション関係
  //=========================================================================

  const PARAMS = PluginManager.parameters("OnevASSISTANT");
  const FADE_VAR_ID = Number(PARAMS.FadeTimeVariableId || 0);


  function isMessageSkipping() {
    return $gameMessage && typeof $gameMessage.skipFlg === 'function' && $gameMessage.skipFlg();
  }

  function resolveFade(args, en = "fade", jp = "フェード時間(frame)") {

    if (isMessageSkipping()) return 0;
    if (args[en] !== "") return Number(args[en]) || 0;
    const vid = Number(args[jp] || 0) || FADE_VAR_ID;
    return Number($gameVariables.value(vid)) || 0;
  }

  class CharComposeManager {
    constructor() {
      this._list = [];
    }
    register(e) {
      const i = this._list.findIndex((a) => a.pid === e.pid);
      if (i >= 0) this._list[i] = e;
      else this._list.push(e);
    }
    erase(pid) {
      this._list = this._list.filter((a) => a.pid !== pid);
    }
    list() {
      return this._list;
    }
  }
  window.$charCompose = window.$charCompose || new CharComposeManager();
  window._compositeCache = window._compositeCache || {};
  const pendingLayerChanges = new Map();

  function mergePendingLayerChanges(name, targetLayers, consume = false) {
    const pending = pendingLayerChanges.get(name);
    if (!pending || pending.size === 0) {
      if (consume) pendingLayerChanges.delete(name);
      return false;
    }

    let changed = false;
    for (const [layerName, change] of pending.entries()) {
      const idx = targetLayers.findIndex((l) => l.layer === layerName);
      if (idx >= 0) {
        if (targetLayers[idx].file !== change.file) {
          targetLayers[idx].file = change.file;
          changed = true;
        }
        if (
          change.priority != null &&
          targetLayers[idx].priority !== change.priority
        ) {
          targetLayers[idx].priority = change.priority;
          changed = true;
        }
      } else {
        targetLayers.push({
          layer: layerName,
          file: change.file,
          priority: change.priority ?? 50,
        });
        changed = true;
      }
    }

    if (consume) pendingLayerChanges.delete(name);
    return changed;
  }

  function handleCharacterAppearance(args) {
    const g = (en, jp, def = "") => args[en] ?? args[jp] ?? def;
    const name = g("name", "キャラ識別名");
    const pid = Number(g("pictureId", "ピクチャID", 20));
    const scale = Number(g("scale", "拡大率(%)", 100));
    const mode = g("mode", "出現方法", "通常出現");
    const flip = g("flip", "左右反転", "false") === "true";
    const easing = g("easing", "イージング種別", "linear");
    const useVar = g("useVariable", "座標を変数IDで指定", "false") === "true";
    const fade = resolveFade(args);
    const origin = Number(g("origin", "基点", "1"));

    let tx = Number(g("x", "X座標", 0));
    let ty = Number(g("y", "Y座標", 0));
    if (useVar) {
      tx = $gameVariables.value(tx);
      ty = $gameVariables.value(ty);
    }

    const layerList = JSON.parse(g("layers", "レイヤー構成", "[]")).map(
      (str) => {
        const o = JSON.parse(str);
        return {
          layer: o.layer,
          file: o.file,
          priority: Number(o.priority) || 50,
        };
      }
    );

    const M = 100;
    let sx = tx,
      sy = ty;
    switch (mode) {
      case "左から登場":
        sx = -M;
        break;
      case "右から登場":
        sx = Graphics.width + M;
        break;
      case "上から登場":
        sy = -M;
        break;
      case "下から登場":
        sy = Graphics.height + M;
        break;
    }
    const initA = mode === "通常出現" && fade > 0 ? 0 : 255;

    composeAndShow(
      name,
      pid,
      sx,
      sy,
      scale,
      flip,
      layerList,
      mode,
      initA,
      fade,
      tx,
      ty,
      easing,
      origin
    );
  }

  PluginManager.registerCommand(PLUGIN_NAME, "CharacterAppearance", (args) =>
    handleCharacterAppearance(args)
  );
  PluginManager.registerCommand(PLUGIN_NAME, "キャラクター出現", (args) =>
    handleCharacterAppearance(args)
  );

  function applyScaleToSprite(sprite, scaleValue) {
    const signX = scaleValue < 0 ? -1 : 1;
    const abs = Math.abs(scaleValue);
    const s = abs / 100;
    sprite.scale.x = s * signX;
    sprite.scale.y = s;
    const pic = $gameScreen.picture(sprite._pictureId);
    if (pic) {
      pic._scaleX = abs * signX;
      pic._scaleY = abs;
    }
  }

  function composeAndShow(
    name,
    pid,
    sx,
    sy,
    scale,
    flip,
    layerList,
    mode,
    initA = 255,
    fade = 0,
    tx,
    ty,
    easing = "linear",
    origin = 1
  ) {
    if (tx === undefined) tx = sx;
    if (ty === undefined) ty = sy;
    let effectiveLayers = Array.isArray(layerList)
      ? layerList.map((layer) => ({
          layer: layer.layer,
          file: layer.file,
          priority: layer.priority != null ? Number(layer.priority) : 50,
        }))
      : [];

    mergePendingLayerChanges(name, effectiveLayers, true);

    let loadGeneration = 0;

    const startLoad = () => {
      const currentGeneration = ++loadGeneration;
      const sorted = effectiveLayers
        .map((layer) => ({ ...layer }))
        .sort((a, b) => a.priority - b.priority);

      if (sorted.length === 0) {
        finalize(currentGeneration, [], sorted);
        return;
      }

      const bitmaps = new Array(sorted.length);
      let loaded = 0;

      sorted.forEach((L, i) => {
        const bmp = ImageManager.loadBitmap("img/characterset/", L.file);
        bmp.addLoadListener(() => {
          if (currentGeneration !== loadGeneration) return;
          bitmaps[i] = bmp;
          if (++loaded >= sorted.length) {
            if (mergePendingLayerChanges(name, effectiveLayers, true)) {
              startLoad();
              return;
            }
            finalize(currentGeneration, bitmaps, sorted);
          }
        });
      });
    };

    const finalize = (generation, bitmaps, sorted) => {
      if (generation !== loadGeneration) return;

      const widths = bitmaps.map((b) => b?.width || 0);
      const heights = bitmaps.map((b) => b?.height || 0);
      const w = widths.length ? Math.max(...widths) : 1;
      const h = heights.length ? Math.max(...heights) : 1;
      const composite = new Bitmap(w, h);
      sorted.forEach((layer, idx) => {
        const bmp = bitmaps[idx];
        if (!bmp) return;
        composite.blt(bmp, 0, 0, bmp.width, bmp.height, 0, 0);
      });

      window._compositeCache[pid] = composite;

      $gameScreen.showPicture(pid, "", origin, sx, sy, scale, scale, initA, 0);
      const pic = $gameScreen.picture(pid);
      if (pic) {
        pic._x = sx;
        pic._y = sy;
        pic._opacity = initA;
        pic._scaleX = scale * (flip ? -1 : 1);
        pic._scaleY = scale;
      }

      const scene = SceneManager._scene;
      const spriteset = scene && scene._spriteset;
      const container = spriteset && spriteset._pictureContainer;
      if (!container) return;
      const sp = container.children.find((s) => s._pictureId === pid);
      if (!sp) return;

      sp.bitmap = composite;
      applyScaleToSprite(sp, flip ? -scale : scale);
      sp.x = sx;
      sp.y = sy;

      $charCompose.register({
        pid,
        name,
        x: tx,
        y: ty,
        scale,
        flip,
        layers: effectiveLayers.map((layer) => ({ ...layer })),
        origin,
      });

      const duration = fade > 0 ? fade : 24;
      if (mode === "通常出現") {
        if (fade > 0) {
          const destScaleX = flip ? -scale : scale;
          $gameScreen.movePicture(
            pid,
            origin,
            tx,
            ty,
            destScaleX,
            scale,
            255,
            0,
            fade
          );
        }
      } else {
        executeCharacterMotion(name, "move", duration, {
          targetX: tx,
          targetY: ty,
          easing,
        });
      }
    };

    startLoad();
  }

  function queueForBatch(entry, fade) {
    const pid = entry.pid;
    _pendingBatch[pid] ??= { entry, fade, scheduled: false };
    _pendingBatch[pid].entry = entry;
    _pendingBatch[pid].fade = fade;
    if (!_pendingBatch[pid].scheduled) {
      _pendingBatch[pid].scheduled = true;
      setTimeout(() => {
        const { entry: e, fade: f } = _pendingBatch[pid];
        replaceAndFade(e, f);
        delete _pendingBatch[pid];
      }, 0);
    }
  }

  PluginManager.registerCommand(PLUGIN_NAME, "ChangeLayers", (args) => {
    const g = (en, jp, def = "") => args[en] ?? args[jp] ?? def;
    const name = g("name", "キャラ識別名");
    const fade = resolveFade(args);
    const changes = JSON.parse(g("layers", "レイヤー構成", "[]")).map((str) => {
      const o = JSON.parse(str);
      const priority = o.priority !== undefined ? Number(o.priority) : null;
      return { layer: o.layer, file: o.file, priority };
    });
    const entry = $charCompose.list().find((e) => e.name === name);
    if (!entry) {
      const pending = pendingLayerChanges.get(name) || new Map();
      changes.forEach((ch) => {
        pending.set(ch.layer, { file: ch.file, priority: ch.priority });
      });
      pendingLayerChanges.set(name, pending);
      return;
    }
    changes.forEach((ch) => {
      const idx = entry.layers.findIndex((l) => l.layer === ch.layer);
      if (idx >= 0) {
        entry.layers[idx].file = ch.file;
        if (ch.priority != null) entry.layers[idx].priority = ch.priority;
      } else {
        entry.layers.push({
          layer: ch.layer,
          file: ch.file,
          priority: ch.priority ?? 50,
        });
      }
    });
    queueForBatch(entry, fade);
  });

  function replaceAndFade(entry, fade = 0) {
    const { pid, scale, flip, layers } = entry;
    const sorted = [].concat(layers).sort((a, b) => a.priority - b.priority);
    const bitmaps = new Array(sorted.length);
    let loaded = 0;
    sorted.forEach((L, i) => {
      const bmp = ImageManager.loadBitmap("img/characterset/", L.file);
      bmp.addLoadListener(() => {
        bitmaps[i] = bmp;
        if (++loaded >= sorted.length) doReplace();
      });
    });
    function doReplace() {
      const w = Math.max(...bitmaps.map((b) => b.width));
      const h = Math.max(...bitmaps.map((b) => b.height));
      const cmp = new Bitmap(w, h);
      bitmaps.forEach((b) => cmp.blt(b, 0, 0, b.width, b.height, 0, 0));
      window._compositeCache[pid] = cmp;

      const cont = SceneManager._scene._spriteset._pictureContainer;
      const sp = cont.children.find((s) => s._pictureId === pid);
      if (!sp) return;
      const ov = new Sprite(sp.bitmap);
      ov.x = sp.x;
      ov.y = sp.y;
      ov.anchor = sp.anchor.clone();
      ov.scale = sp.scale.clone();
      cont.addChild(ov);

      sp.bitmap = cmp;
      if (flip) sp.scale.x = -Math.abs(sp.scale.x);

      if (fade > 0) {
        const step = 255 / fade;
        (function tick() {
          ov.opacity -= step;
          if (ov.opacity <= 0) cont.removeChild(ov);
          else requestAnimationFrame(tick);
        })();
      } else cont.removeChild(ov);
    }
  }

  const _pendingBatch = {};

  function eraseComposite(pid) {
    $gameScreen.erasePicture(pid);
    delete window._compositeCache[pid];
    $charCompose.erase(pid);
  }
  window.eraseComposite = eraseComposite;

  const _make = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const c = _make.call(this);
    c.charCompose = $charCompose.list();

    c.onevActiveUIs = $gameSystem.getCustomUIs().slice();
    c.onevUIPositions = $gameSystem._uiPositions ? JSON.parse(JSON.stringify($gameSystem._uiPositions)) : {};

    // UI定義(_dynamicUIConfigs)はセーブに焼き込まない（肥大化対策）。
    // 定義は data/OnevDynamicUI.json にプロジェクト資産として保持する。
    return c;
  };
  const _ext = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (c) {
    _ext.call(this, c);
    window.$charCompose = new CharComposeManager();
    if (c.charCompose) c.charCompose.forEach((e) => $charCompose.register(e));


    if (c.onevActiveUIs) {
      $gameSystem._activeUIs = c.onevActiveUIs.slice();
    }
    if (c.onevUIPositions) {
      $gameSystem._uiPositions = JSON.parse(JSON.stringify(c.onevUIPositions));
    }

    if (c.onevDynamicUIConfigs) {
      // 旧セーブ（UI定義を内包）との互換維持。読み込んだ上でJSONへ移行保存する。
      OnevASSISTANT._dynamicUIConfigs = new Map(c.onevDynamicUIConfigs);
      OnevASSISTANT.saveDynamicUIConfigsToFile();
    } else {
      // 新セーブ（UI定義を持たない）はJSON基準のbaselineから復元する。
      OnevASSISTANT._dynamicUIConfigs = new Map(
        OnevASSISTANT._baseDynamicUIConfigs || []
      );
    }


    OnevASSISTANT._activeUINames.clear();
    OnevASSISTANT._activeSprites = {};
  };

  const _motionMap = {};

  function registerBase(pid, type, duration, params) {
    const base = { type, frame: 0, duration, ...params };
    base._effectT = 0;
    base._currentEffX = 0;
    base._currentEffY = 0;
    _motionMap[pid] = {
      base,
      overlay: _motionMap[pid]?.overlay ?? null,
    };
  }

  function registerOverlay(pid, type, duration, params) {
    const rec = _motionMap[pid] ?? { base: null, overlay: null };
    const loops =
      params.loops === undefined || params.loops === null
        ? 1
        : Number(params.loops);
    const loopWait =
      params.loopWait === undefined || params.loopWait === null
        ? 0
        : Number(params.loopWait);
    const overlay = { type, frame: 0, duration, ...params };
    overlay._loopWait = loopWait;
    overlay._loopWaitCounter = 0;
    overlay._isWaiting = false;
    if (loops === 0) {
      overlay._baseDuration = duration;
      overlay._loopCount = -1;
      overlay.duration = 9999999;
    } else if (loops > 1) {
      overlay._baseDuration = duration;
      overlay._loopCount = loops;
      overlay.duration = (duration + loopWait) * loops - loopWait;
    } else {
      overlay._loopCount = 1;
    }
    overlay._effectT = 0;
    overlay._currentEffX = 0;
    overlay._currentEffY = 0;
    rec.overlay = overlay;
    _motionMap[pid] = rec;
  }

  function executeCharacterMotion(name, type, duration = 24, params = {}) {
    let pids = [];

    if (name && name.toUpperCase().startsWith('PID')) {
      const pidStr = name.substring(3);
      const pidParts = pidStr.split(',');
      for (const part of pidParts) {
        const pid = Number(part.trim());
        if (!isNaN(pid)) pids.push(pid);
      }
      if (pids.length === 0) return;
    } else {
      const entry = $charCompose.list().find((e) => e.name === name);
      if (!entry) return;
      pids.push(entry.pid);
    }

    for (const pid of pids) {
      const sp = SceneManager._scene._spriteset._pictureContainer.children.find(
        (s) => s._pictureId === pid
      );
      if (!sp) continue;

      const moveLike = ["move", "runleft", "runright", "runup", "rundown"];
      const reg = moveLike.includes(type) ? registerBase : registerOverlay;

      reg(pid, type, duration, {
        ...params,
        startX: sp.x,
        startY: sp.y,
        targetX: params.targetX ?? sp.x,
        targetY: params.targetY ?? sp.y,
        startScale: Math.abs(sp.scale.x) * 100,
        targetScale: params.targetScale ?? Math.abs(sp.scale.x) * 100,
        startOpacity: sp.opacity ?? 255,
        targetOpacity: params.targetOpacity ?? 255,
        easing: params.easing || "linear",
      });
    }
  }

  const MotionTypeMap = {
    うなずく: "yes",
    二回うなずく: "yesyes",
    否定: "no",
    ジャンプ: "jump",
    揺れる: "shake",
    笑う: "laugh",
    怒る: "stomp",
    右に消える: "runright",
    左に消える: "runleft",
    上に消える: "runup",
    下に消える: "rundown",
    none: "none",
    モーション解除: "clear",
  };

  function parseAnimationSettings(args) {
    try {
      const raw = args.animationSettings;
      if (raw === undefined || raw === "") {
        return { loops: 1, loopWait: 0 };
      }
      const as = typeof raw === "string" ? JSON.parse(raw) : raw;
      return {
        loops: Number(as.loops ?? 1),
        loopWait: Number(as.loopWait ?? 0),
      };
    } catch (_) {
      return { loops: 1, loopWait: 0 };
    }
  }

  function parseEffectSettings(args) {
    try {
      const raw = args.effectSettings;
      if (raw === undefined || raw === "") return null;
      const es = JSON.parse(raw);
      return {
        type: es.type || "none",
        ampX: Number(es.ampX || 0),
        ampY: Number(es.ampY || 0),
        speed: Number(es.speed || 0.1),
        decay: Number(es.decay || 0),
      };
    } catch (_) {
      return null;
    }
  }

  function clearCharacterOverlayByName(name) {
    const entry = $charCompose.list().find((e) => e.name === name);
    if (!entry) return;
    const pid = entry.pid;
    const cont = SceneManager._scene?._spriteset?._pictureContainer;
    if (!cont) return;
    const sp = cont.children.find((s) => s._pictureId === pid);
    if (!sp) return;
    const rec = _motionMap[pid];
    if (!rec || !rec.overlay) return;
    rec.overlay = null;
    if (!rec.base) delete _motionMap[pid];
  }

  PluginManager.registerCommand(PLUGIN_NAME, "モーション", (args) => {
    const name = args.name;
    const raw = args.motion || args["モーション"];
    const type = MotionTypeMap[raw] || raw;
    const duration =
      Number(args.duration || args["duration"]) || resolveFade(args) || 24;
    const amplitude = Number(args.amplitude || args["amplitude"]) || 0;
    const easing = args.easing || args["easing"] || "linear";
    const animSettings = parseAnimationSettings(args);
    const effect = parseEffectSettings(args);

    if (type === "clear") {
      clearCharacterOverlayByName(name);
      return;
    }

    executeCharacterMotion(name, type, duration, {
      amplitude,
      easing,
      loops: animSettings.loops,
      loopWait: animSettings.loopWait,
      effect,
    });
  });

  PluginManager.registerCommand(PLUGIN_NAME, "MoveCharacter", (args) => {
    const name = args.name;
    const x = Number(args.x || args["X座標"]) || 0;
    const y = Number(args.y || args["Y座標"]) || 0;
    const duration =
      Number(args.duration || args["duration"]) || resolveFade(args) || 24;
    const scale = Number(args.scale || args["scale"]) || 100;
    const easing = args.easing || args["easing"] || "linear";
    const animSettings = parseAnimationSettings(args);
    const effect = parseEffectSettings(args);
    executeCharacterMotion(name, "move", duration, {
      targetX: x,
      targetY: y,
      targetScale: scale,
      easing,
      loops: animSettings.loops,
      loopWait: animSettings.loopWait,
      effect,
    });
  });

  PluginManager.registerCommand(PLUGIN_NAME, "CharacterExit", (args) => {
    const name = args.name;
    const mode = args.mode || args["mode"] || "通常退場";
    const duration =
      Number(args.duration || args["duration"]) || resolveFade(args) || 24;
    const easing = args.easing || args["easing"] || "linear";

    if (MotionTypeMap[mode]) {
      executeCharacterMotion(name, MotionTypeMap[mode], duration, { easing });
      return;
    }

    let pids = [];
    if (name && name.toUpperCase().startsWith('PID')) {
      const pidStr = name.substring(3);
      const pidParts = pidStr.split(',');
      for (const part of pidParts) {
        const pid = Number(part.trim());
        if (!isNaN(pid)) pids.push(pid);
      }
      if (pids.length === 0) return;
    } else {
      const entry = $charCompose.list().find((e) => e.name === name);
      if (!entry) return;
      pids.push(entry.pid);
    }

    const cont = SceneManager._scene._spriteset._pictureContainer;
    for (const pid of pids) {
      const sp = cont.children.find((s) => s._pictureId === pid);
      if (!sp) continue;

      const ov = new Sprite(sp.bitmap);
      ov.x = sp.x;
      ov.y = sp.y;
      ov.anchor = sp.anchor.clone();
      ov.scale = sp.scale.clone();
      ov.opacity = 255;
      cont.addChild(ov);

      eraseComposite(pid);

      const step = 255 / duration;
      (function tick() {
        ov.opacity -= step;
        if (ov.opacity <= 0) cont.removeChild(ov);
        else requestAnimationFrame(tick);
      })();
    }
  });

  const _SprPicUpd2 = Sprite_Picture.prototype.update;
  Sprite_Picture.prototype.update = function () {
    _SprPicUpd2.call(this);

    const cache = window._compositeCache[this._pictureId];
    if (cache && this.bitmap !== cache) this.bitmap = cache;

    const rec = _motionMap[this._pictureId];
    if (!rec) return;
    if (rec.base) applyMotion(this, rec, rec.base, true);
    if (rec.overlay) applyMotion(this, rec, rec.overlay, false);
  };

  function applyMotion(sp, parent, st, overrideXY) {
    if (st._isWaiting) {
      st._loopWaitCounter++;
      if (st._loopWaitCounter >= st._loopWait) {
        st._isWaiting = false;
        st._loopWaitCounter = 0;
        st.frame = 0;
      }
      return;
    }
    
    st.frame++;
    const baseDur = st._baseDuration || st.duration;
    const loopProgress = st.frame % baseDur;
    const inLoopT = loopProgress / baseDur;
    
    if (!overrideXY && st._baseDuration && st._loopWait > 0 && loopProgress === 0 && st.frame > 0) {
      st._isWaiting = true;
      st._loopWaitCounter = 0;
      return;
    }
    
    const t = Math.min(st.frame / st.duration, 1);
    const e = (Easing[st.easing] || Easing.linear)(t);
    const eLocal =
      !overrideXY && st._baseDuration
        ? (Easing[st.easing] || Easing.linear)(inLoopT)
        : e;

    switch (st.type) {
      case "move":
        if (overrideXY) {
          sp.x = st.startX + (st.targetX - st.startX) * e;
          sp.y = st.startY + (st.targetY - st.startY) * e;
        }
        break;
      case "runleft":
        if (overrideXY) sp.x = st.startX - e * (Graphics.width + 300);
        break;
      case "runright":
        if (overrideXY) sp.x = st.startX + e * (Graphics.width + 300);
        break;
      case "runup":
        if (overrideXY)
          sp.y = st.startY - e * (Graphics.height + sp.bitmap.height + 300);
        break;
      case "rundown":
        if (overrideXY)
          sp.y = st.startY + e * (Graphics.height + sp.bitmap.height + 300);
        break;

      case "jump":
        sp.y += -Math.sin(eLocal * Math.PI) * (st.amplitude || 12);
        break;
      case "yes":
        sp.y += Math.sin(eLocal * Math.PI) * (st.amplitude || 6);
        break;
      case "yesyes":
        sp.y += Math.sin(eLocal * Math.PI * 4) * (st.amplitude || 6);
        break;
      case "no":
        sp.x += Math.sin(eLocal * Math.PI * 2) * (st.amplitude || 4);
        break;
      case "shake":
        sp.x += Math.sin(st.frame * 0.5) * (st.amplitude || 2);
        break;
      case "laugh":
        sp.y += Math.sin(eLocal * Math.PI * 3) * (st.amplitudeY || 4);
        sp.x += Math.sin(eLocal * Math.PI * 6) * (st.amplitudeX || 1.5);
        break;
      case "stomp":
        sp.y += Math.abs(Math.sin(eLocal * Math.PI)) * (st.amplitude || 10);
        break;
    }

    if (st.effect && st.effect.type && st.effect.type !== "none") {
      const eff = st.effect;
      st._effectT = (st._effectT || 0) + (eff.speed || 0.1);
      const prog =
        !overrideXY && st._baseDuration
          ? (st.frame % st._baseDuration) / st._baseDuration
          : t;
      const decayMul = Math.max(0, 1 - (eff.decay || 0) * prog);

      const ax = (eff.ampX || 0) * decayMul;
      const ay = (eff.ampY || 0) * decayMul;
      const ph = st._effectT;

      let xOff = 0,
        yOff = 0;
      switch (eff.type) {
        case "shake":
          xOff = (Math.random() * 2 - 1) * ax;
          yOff = (Math.random() * 2 - 1) * ay;
          break;
        case "float":
          xOff = Math.sin(ph) * ax;
          yOff = Math.sin(ph) * ay;
          break;
        case "wave":
          xOff = Math.sin(ph) * ax;
          yOff = Math.sin(ph * 0.8) * ay;
          break;
        case "bounce":
          yOff = -Math.abs(Math.sin(ph)) * ay;
          xOff = Math.sin(ph * 0.5) * ax * 0.5;
          break;
      }

      const fadeOutThreshold = 0.8;
      if (t > fadeOutThreshold) {
        const fadeT = (t - fadeOutThreshold) / (1 - fadeOutThreshold);
        const fadeMul = 1 - fadeT;
        xOff *= fadeMul;
        yOff *= fadeMul;
      }

      st._currentEffX = xOff;
      st._currentEffY = yOff;
    } else {
      st._currentEffX = 0;
      st._currentEffY = 0;
    }
    sp.x += st._currentEffX || 0;
    sp.y += st._currentEffY || 0;

    if (overrideXY && st.targetScale != null) {
      const s0 = st.startScale / 100,
        s1 = st.targetScale / 100;
      const sign = sp.scale.x < 0 ? -1 : 1;
      const s = s0 + (s1 - s0) * e;
      sp.scale.x = s * sign;
      sp.scale.y = s;
    }
    if (overrideXY && st.targetOpacity != null) {
      sp.opacity = st.startOpacity + (st.targetOpacity - st.startOpacity) * e;
    }

    if (st.frame >= st.duration) {
      if (overrideXY) {
        const pic = $gameScreen.picture(sp._pictureId);
        if (pic) {
          pic._x = sp.x;
          pic._y = sp.y;
          if (st.targetScale != null) {
            pic._scaleX = Math.abs(sp.scale.x) * 100;
            pic._scaleY = Math.abs(sp.scale.y) * 100;
          }
          if (st.targetOpacity != null) {
            pic._opacity = sp.opacity;
          }
        }
        if (overrideXY) parent.base = null;
        else parent.overlay = null;

        const done = !parent.base && !parent.overlay;
        if (done) delete _motionMap[sp._pictureId];

        if (
          done &&
          ["runleft", "runright", "runup", "rundown"].includes(st.type)
        ) {
          eraseComposite(sp._pictureId);
        }
        return;
      }
      if (overrideXY) parent.base = null;
      else parent.overlay = null;
      if (!parent.base && !parent.overlay) delete _motionMap[sp._pictureId];
    }
  }

  //=========================================================================
  // 画像選択肢
  //=========================================================================

  function applyImageChoiceHoverEffect(sprite, config) {
    if (!sprite || !config) return;
  }

  ImageManager.loadChoiceImage = function (name) {
    return this.loadBitmap("img/UI/", name, 0, true);
  };

  const _GS_init = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _GS_init.call(this);
    this._imageChoices = null;
  };
  Game_System.prototype.setImageChoices = function (list) {
    this._imageChoices = list;
  };
  Game_System.prototype.imageChoices = function () {
    return this._imageChoices;
  };
  Game_System.prototype.clearImageChoices = function () {
    this._imageChoices = null;
  };
  Game_System.prototype.imageChoiceModeValid = function (arr) {
    if (!this._imageChoices || !this._imageChoices.length) return false;
    const names = this._imageChoices.map((c) => c["選択肢名"]);
    return arr.every((t) => names.includes(t));
  };

  PluginManager.registerCommand(PLUGIN_NAME, "setImageChoices", (args) => {
    const raw = JSON.parse(args.choices || "[]");
    const list = raw.map((s) => JSON.parse(s));
    $gameSystem.setImageChoices(list);

    $gameSystem._imageChoicesEnableDPad = args.enableDPad !== "false";
  });

  const WCL = Window_ChoiceList.prototype;
  const _wWidth = WCL.windowWidth,
    _wHeight = WCL.windowHeight,
    _init = WCL.initialize,
    _start = WCL.start,
    _update = WCL.update,
    _select = WCL.select,
    _ok = WCL.processOk,
    _cancel = WCL.processCancel;

  WCL.isImageMode = function () {
    return $gameSystem.imageChoiceModeValid($gameMessage.choices());
  };

  WCL.windowWidth = function () {
    return this.isImageMode() ? 0 : _wWidth.call(this);
  };
  WCL.windowHeight = function () {
    return this.isImageMode() ? 0 : _wHeight.call(this);
  };

  WCL.initialize = function (msg) {
    _init.call(this, msg);
    this._choiceSprite = [];
  };

  WCL.start = function () {
    if (this.isImageMode()) this._createImageChoices();
    _start.call(this);
    if (this.isImageMode()) {
      this.x = this.y = 0;
      if (this.index() < 0) this.select(0);
      if (this._downArrowSprite) this._downArrowSprite.visible = false;
      if (this._upArrowSprite) this._upArrowSprite.visible = false;
    }
  };

  WCL.select = function (index) {
    _select.call(this, index);
  };

  WCL._disposeChoiceSprites = function () {
    this._choiceSprite.forEach((sp) => {
      if (sp?.parent) sp.parent.removeChild(sp);
      if (sp?._frame?.parent) sp._frame.parent.removeChild(sp._frame);
      if (sp?._hovers) {
        sp._hovers.forEach(h => { if (h?.parent) h.parent.removeChild(h); });
      } else if (sp?._hover?.parent) {
        sp._hover.parent.removeChild(sp._hover);
      }
    });
    this._choiceSprite = [];
  };

  WCL.processOk = function () {
    _ok.call(this);
    this._disposeChoiceSprites();
    $gameSystem.clearImageChoices();
  };
  WCL.processCancel = function () {
    _cancel.call(this);
    this._disposeChoiceSprites();
    $gameSystem.clearImageChoices();
  };

  WCL._createImageChoices = function () {
    const list = $gameSystem.imageChoices();
    const texts = $gameMessage.choices();
    this._choiceSprite = [];

    for (let i = 0; i < texts.length; i++) {
      const info = list.find((c) => c["選択肢名"] === texts[i]);
      if (!info) continue;

      const sp = new Sprite(ImageManager.loadChoiceImage(info.画像));
      sp.x = Number(info.X座標) || 0;
      sp.y = Number(info.Y座標) || 0;
      sp.anchor.set(0.5, 0.5);
      sp._baseX = sp.x;
      sp._baseY = sp.y;
      sp.z = 9999;
      (function initStaticHitRect(sprite) {
        const ax = sprite.anchor.x || 0.5;
        const ay = sprite.anchor.y || 0.5;
        const w = sprite.width || (sprite.bitmap && sprite.bitmap.width) || 0;
        const h = sprite.height || (sprite.bitmap && sprite.bitmap.height) || 0;
        const left = sprite._baseX - w * ax;
        const top = sprite._baseY - h * ay;
        sprite._hitLeft = left;
        sprite._hitTop = top;
        sprite._hitRight = left + w;
        sprite._hitBottom = top + h;
      })(sp);

      if (info.FrameImage) {
        const f = new Sprite(ImageManager.loadChoiceImage(info.FrameImage));
        f.anchor.set(0.5, 0.5);
        f.visible = false;
        f.x = 0;
        f.y = 0;
        sp.addChild(f);
        sp._frame = f;
      }

      sp._hovers = [];
      if (info.ExtraImageSetting) {
        let extraList = [];
        try {
          const parsed = JSON.parse(info.ExtraImageSetting);
          if (Array.isArray(parsed)) {
            extraList = parsed.map(s => (typeof s === 'string' ? JSON.parse(s) : s)).filter(Boolean);
          } else if (parsed && typeof parsed === 'object') {
            extraList = [parsed];
          }
        } catch (e) {}
        for (const cfg of extraList) {
          const imgName = cfg.Image || cfg.画像;
          if (!imgName) continue;
          const h = new Sprite(ImageManager.loadChoiceImage(imgName));
          h.anchor.set(0.5, 0.5);
          h.x = Number(cfg.X ?? cfg.OffsetX ?? 0);
          h.y = Number(cfg.Y ?? cfg.OffsetY ?? 0);
          h.visible = false;
          SceneManager._scene._windowLayer.addChild(h);
          sp._hovers.push(h);
        }
        sp._hover = sp._hovers[0] || null;
      }
      SceneManager._scene.addChild(sp);
      this._choiceSprite[i] = sp;
    }
  };

  Window_ChoiceList.prototype._mouseHitIndex = function () {
    const mx = TouchInput.x;
    const my = TouchInput.y;

    for (let i = 0; i < this._choiceSprite.length; i++) {
      const sp = this._choiceSprite[i];
      if (!sp || !sp.bitmap || !sp.bitmap.isReady()) continue;

      const w = sp.bitmap.width * Math.abs(sp.scale.x);
      const h = sp.bitmap.height * Math.abs(sp.scale.y);
      const left = sp.x - w * sp.anchor.x;
      const top = sp.y - h * sp.anchor.y;

      const margin = 2;
      if (
        mx >= left - margin &&
        mx <= left + w + margin &&
        my >= top - margin &&
        my <= top + h + margin
      )
        return i;
    }
    return -1;
  };

  WCL.update = function () {
    _update.call(this);
    if (!this.isImageMode()) return;


    const enableDPad = $gameSystem._imageChoicesEnableDPad !== false;
    if (enableDPad) {
      if (Input.isTriggered("up")) this._moveImageChoice("up");
      if (Input.isTriggered("down")) this._moveImageChoice("down");
      if (Input.isTriggered("left")) this._moveImageChoice("left");
      if (Input.isTriggered("right")) this._moveImageChoice("right");
      if (Input.dir4 !== 0) this._lastInputType = "keyboard";
    }

    this._lastMouseX = this._lastMouseX ?? TouchInput.x;
    this._lastMouseY = this._lastMouseY ?? TouchInput.y;
    if (
      TouchInput.x !== this._lastMouseX ||
      TouchInput.y !== this._lastMouseY
    ) {
      this._lastInputType = "mouse";
    }
    this._lastMouseX = TouchInput.x;
    this._lastMouseY = TouchInput.y;


    if (enableDPad) {
      const keyTrig =
        Input.isTriggered("down") ||
        Input.isTriggered("up") ||
        Input.isTriggered("left") ||
        Input.isTriggered("right");

      if (keyTrig) {
        this._lastInputType = "keyboard";
      } else if (TouchInput.isMoved()) {
        this._lastInputType = "mouse";
      }
    } else {
      if (TouchInput.isMoved()) {
        this._lastInputType = "mouse";
      }
    }

    const cfgs = $gameSystem.imageChoices();
    const cur = this.index();
    const LERP = 0.2;

    for (let i = 0; i < this._choiceSprite.length; i++) {
      const sp = this._choiceSprite[i];
      const info = cfgs[i];
      if (!sp || !info) continue;

      const bx = sp._baseX;
      const by = sp._baseY;

      if (i === cur) {
        const scaleT = (Number(info.Scale) || 100) / 100;
        const tx = bx + Number(info.OffsetX || 0);
        const ty = by + Number(info.OffsetY || 0);

        sp.scale.x += (scaleT - sp.scale.x) * LERP;
        sp.scale.y = sp.scale.x;
        sp.x += (tx - sp.x) * LERP;
        sp.y += (ty - sp.y) * LERP;

        if (sp._frame) sp._frame.visible = true;
        if (sp._hovers) sp._hovers.forEach(h => { h.visible = true; });
        else if (sp._hover) sp._hover.visible = true;
      } else {
        sp.scale.x += (1 - sp.scale.x) * LERP;
        sp.scale.y = sp.scale.x;
        sp.x += (bx - sp.x) * LERP;
        sp.y += (by - sp.y) * LERP;

        if (Math.abs(sp.x - bx) < 0.01) sp.x = bx;
        if (Math.abs(sp.y - by) < 0.01) sp.y = by;

        if (sp._frame) sp._frame.visible = false;
        if (sp._hovers) sp._hovers.forEach(h => { h.visible = false; });
        else if (sp._hover) sp._hover.visible = false;
      }
    }

    if (this._lastInputType === "mouse") {
      const hit = this._mouseHitIndex();
      if (hit >= 0 && hit !== this.index()) {
        this.select(hit);
        SoundManager.playCursor();
      }
    }

    if (TouchInput.isReleased()) {
      const hit = this._mouseHitIndex();
      if (hit >= 0 && hit === this.index()) this.processOk();
    }
  };

  const _origPCM = WCL.processCursorMove;
  WCL.processCursorMove = function () {
    if (this.isImageMode()) return;
    _origPCM.call(this);
  };

  WCL._moveImageChoice = function (dir) {
    const list = this._choiceSprite;
    if (!list || !list.length) return;

    const cur = this.index();
    const cx = list[cur]._baseX;
    const cy = list[cur]._baseY;

    let best = -1,
      bestPrimary = Infinity,
      bestDist2 = Infinity;

    for (let i = 0; i < list.length; i++) {
      if (i === cur) continue;
      const dx = list[i]._baseX - cx;
      const dy = list[i]._baseY - cy;

      if (dir === "up" && dy >= 0) continue;
      if (dir === "down" && dy <= 0) continue;
      if (dir === "left" && dx >= 0) continue;
      if (dir === "right" && dx <= 0) continue;

      const primary =
        dir === "up" || dir === "down" ? Math.abs(dy) : Math.abs(dx);
      const dist2 = dx * dx + dy * dy;

      if (
        primary < bestPrimary ||
        (primary === bestPrimary && dist2 < bestDist2)
      ) {
        best = i;
        bestPrimary = primary;
        bestDist2 = dist2;
      }
    }

    if (best < 0) {
      if (dir === "up") {
        const maxY = Math.max(...list.map((s) => s._baseY));
        best = list.findIndex((s) => s._baseY === maxY);
      } else if (dir === "down") {
        const minY = Math.min(...list.map((s) => s._baseY));
        best = list.findIndex((s) => s._baseY === minY);
      } else if (dir === "left") {
        const maxX = Math.max(...list.map((s) => s._baseX));
        best = list.findIndex((s) => s._baseX === maxX);
      } else if (dir === "right") {
        const minX = Math.min(...list.map((s) => s._baseX));
        best = list.findIndex((s) => s._baseX === minX);
      }
    }

    if (best >= 0 && best !== cur) {
      this.select(best);
      SoundManager.playCursor();
      this._lastInputType = "keyboard";
    }
  };
  (() => {
    const _updateArrows = Window_ChoiceList.prototype.updateArrows;
    Window_ChoiceList.prototype.updateArrows = function () {
      if ($gameSystem.imageChoiceModeValid($gameMessage.choices())) {
        this.downArrowVisible = false;
        this.upArrowVisible = false;
        return;
      }
      _updateArrows.call(this);
    };
  })();

  //======================================================================
  // リング選択肢
  //======================================================================

  let _ringChoiceEnabled = false;
  let _ringChoiceConfig = null;
  let _ringChoiceSprites = [];
  let _ringChoiceBaseSprite = null;
  let _currentRingIndex = 0;
  let _currentVirtualIndex = 0;
  let _menuEnabledBeforeRingChoice = true;
  let _ringChoiceClickGuard = false;

  function setMenuEnabled(enabled) {
    if (SceneManager._scene && SceneManager._scene._menuEnabled !== undefined) {
      SceneManager._scene._menuEnabled = enabled;
    }
  }

  function getMenuEnabled() {
    if (SceneManager._scene && SceneManager._scene._menuEnabled !== undefined) {
      return SceneManager._scene._menuEnabled;
    }
    return true;
  }

  function parseChoiceList(raw) {
    if (!raw) return [];
    let arr = raw;
    if (typeof arr === "string") arr = JSON.parse(raw);
    return arr.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );
  }

  PluginManager.registerCommand("OnevASSISTANT", "リング選択肢", (args) => {
    _ringChoiceEnabled = true;
    let choiceList = parseChoiceList(args["選択肢リスト"]);
    const realImages = choiceList.map((c) => c["画像"]);
    const commonEvents = choiceList.map((c) => Number(c["コモンイベント"]));
    const realCount = realImages.length;
    let virtualCount = Number(args["仮想選択肢数"]);
    if (!virtualCount || virtualCount < 1) virtualCount = realCount;
    const initialIndexVarId = Number(args["初期選択インデックス変数"] || 0);
    let initialIndex = 0;
    if (initialIndexVarId > 0) {
      initialIndex = $gameVariables.value(initialIndexVarId) || 0;
    } else if (args["初期選択インデックス"]) {
      initialIndex = Number(args["初期選択インデックス"]) || 0;
    }
    const initialAngleDeg = Number(args["初期角度"] || 0);
    const initialAngleRad = (initialAngleDeg * Math.PI) / 180;

    let baseX = 0;
    let baseY = 0;
    const useVariablePosition = args["変数で指定"] === "true";

    if (useVariablePosition) {
      const xAxisVarId = Number(args["X軸"] || 0);
      const yAxisVarId = Number(args["Y軸"] || 0);
      baseX = xAxisVarId > 0 ? $gameVariables.value(xAxisVarId) || 0 : 0;
      baseY = yAxisVarId > 0 ? $gameVariables.value(yAxisVarId) || 0 : 0;
    } else {
      baseX = Number(args["X軸"] || 0);
      baseY = Number(args["Y軸"] || 0);
    }

    const offsetX = Number(args["リング選択肢オフセットX"] || 0);
    const offsetY = Number(args["リング選択肢オフセットY"] || 0);

    let selectSe = null,
      okSe = null;
    if (args["選択音"]) {
      try {
        selectSe =
          typeof args["選択音"] === "string"
            ? JSON.parse(args["選択音"])
            : args["選択音"];
      } catch (e) {}
    }
    if (args["決定音"]) {
      try {
        okSe =
          typeof args["決定音"] === "string"
            ? JSON.parse(args["決定音"])
            : args["決定音"];
      } catch (e) {}
    }

    _ringChoiceConfig = {
      baseX: baseX,
      baseY: baseY,
      baseOffsetX: offsetX,
      baseOffsetY: offsetY,
      baseImage: args["土台画像"] || "",
      maskImage: args["マスク画像"] || "",
      choiceImages: realImages,
      commonEvents: commonEvents,
      circleRadius: Number(args["円の大きさ"] || 100),
      easingType: args["イージングタイプ"] || "easeOutQuad",
      duration: Number(args["移動時間"] || 24),
      virtualCount: virtualCount,
      initialIndex: initialIndex,
      initialAngleRad: initialAngleRad,
      enlargeSelected: args["拡大表示"] === "true",
      rotateContinuously: args["一周回転"] === "true",
      cancelAction: args["キャンセル動作"] || "終了",
      selectSe: selectSe,
      okSe: okSe,
    };
    showRingChoice();
  });

  function calculateRingPositions(
    count,
    radius,
    centerX,
    centerY,
    offsetRad = 0
  ) {
    const positions = [];
    const angleStep = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i + offsetRad;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      positions.push({ x, y, angle });
    }
    return positions;
  }

  function showRingChoice() {
    if (!_ringChoiceEnabled || !_ringChoiceConfig) return;
    _ringChoiceClickGuard = true;
    const config = _ringChoiceConfig;
    const realImages = config.choiceImages;
    const realCount = realImages.length;
    const virtualCount = config.virtualCount;
    const initialIndex = Math.max(
      0,
      Math.min(config.initialIndex, realCount - 1)
    );
    const initialAngleRad = config.initialAngleRad || 0;

    _currentVirtualIndex = initialIndex;
    _currentRingIndex = initialIndex % realCount;

    const centerX = config.baseX + (config.baseOffsetX || 0);
    const centerY = config.baseY + (config.baseOffsetY || 0);

    config.centerX = centerX;
    config.centerY = centerY;

    const angleStep = (2 * Math.PI) / virtualCount;
    const adjustedInitialAngle = initialAngleRad - initialIndex * angleStep;

    const ringPositions = calculateRingPositions(
      virtualCount,
      config.circleRadius,
      centerX,
      centerY,
      adjustedInitialAngle
    );

    if (config.baseImage) {
      _ringChoiceBaseSprite = new Sprite(
        ImageManager.loadBitmap("img/UI/", config.baseImage)
      );
      _ringChoiceBaseSprite.anchor.set(0.5);
      _ringChoiceBaseSprite.x = config.baseX;
      _ringChoiceBaseSprite.y = config.baseY;
      SceneManager._scene.addChild(_ringChoiceBaseSprite);
    }

    let ringChoiceContainer = null;
    if (config.maskImage) {
      ringChoiceContainer = new PIXI.Container();
      ringChoiceContainer.x = centerX;
      ringChoiceContainer.y = centerY;
      SceneManager._scene.addChild(ringChoiceContainer);

      const maskSprite = new Sprite(
        ImageManager.loadBitmap("img/UI/", config.maskImage)
      );
      maskSprite.anchor.set(0.5);
      maskSprite.x = 0;
      maskSprite.y = 0;
      ringChoiceContainer.mask = maskSprite;
      ringChoiceContainer.addChild(maskSprite);

      config.ringChoiceContainer = ringChoiceContainer;
    }

    _ringChoiceSprites = [];
    let loadedCount = 0;
    for (let i = 0; i < realCount; i++) {
      if (i >= virtualCount) break;

      const bitmap = ImageManager.loadBitmap("img/UI/", realImages[i]);
      bitmap.addLoadListener(() => {
        if (bitmap.isError()) return;

        const sprite = new Sprite(bitmap);
        sprite.anchor.set(0.5);
        sprite.x = ringPositions[i].x;
        sprite.y = ringPositions[i].y;
        sprite._startX = ringPositions[i].x;
        sprite._startY = ringPositions[i].y;
        sprite._targetX = ringPositions[i].x;
        sprite._targetY = ringPositions[i].y;
        sprite._frame = 0;
        sprite._duration = config.duration;
        sprite._easingType = config.easingType;
        sprite._isAnimating = false;
        sprite._index = i;
        sprite.scale.set(1.0, 1.0);
        sprite._isSelected = false;

        _ringChoiceSprites[i] = sprite;

        if (config.ringChoiceContainer) {
          sprite.x = ringPositions[i].x - centerX;
          sprite.y = ringPositions[i].y - centerY;
          sprite._startX = ringPositions[i].x - centerX;
          sprite._startY = ringPositions[i].y - centerY;
          sprite._targetX = ringPositions[i].x - centerX;
          sprite._targetY = ringPositions[i].y - centerY;
          config.ringChoiceContainer.addChild(sprite);
        } else {
          SceneManager._scene.addChild(sprite);
        }

        loadedCount++;
        if (loadedCount === Math.min(realCount, virtualCount)) {
          _ringChoiceSprites.forEach((sprite, j) => {
            if (!sprite) return;
            if (j === _currentRingIndex) {
              const shouldEnlarge = config.enlargeSelected !== false;
              const scale = shouldEnlarge ? 1.2 : 1.0;
              sprite.scale.set(scale, scale);
              sprite._isSelected = true;
            } else {
              sprite.scale.set(1.0, 1.0);
              sprite._isSelected = false;
            }
          });
        }
      });
    }

    setTimeout(() => {
      _ringChoiceSprites.forEach((sprite, i) => {
        if (!sprite) return;
        if (i === _currentRingIndex) {
          const shouldEnlarge = config.enlargeSelected !== false;
          const scale = shouldEnlarge ? 1.2 : 1.0;
          sprite.scale.set(scale, scale);
          sprite._isSelected = true;
        } else {
          sprite.scale.set(1.0, 1.0);
          sprite._isSelected = false;
        }
      });
    }, 0);
  }

  function updateRingChoiceAnimation() {
    if (!_ringChoiceEnabled || !_ringChoiceSprites) return;
    _ringChoiceSprites.forEach((sprite, index) => {
      if (sprite && sprite._isAnimating) {
        sprite._frame++;
        const progress = sprite._frame / sprite._duration;
        if (progress >= 1) {
          sprite.x = sprite._targetX;
          sprite.y = sprite._targetY;
          sprite._isAnimating = false;
        } else {
          const eased = (Easing[sprite._easingType] || Easing.linear)(progress);
          sprite.x =
            sprite._startX + (sprite._targetX - sprite._startX) * eased;
          sprite.y =
            sprite._startY + (sprite._targetY - sprite._startY) * eased;
        }
      }
    });
  }

  const _Scene_Map_update_ringChoice = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update_ringChoice.call(this);
    updateRingChoiceAnimation();
    if (!_ringChoiceEnabled) return;
    if (_ringChoiceClickGuard) {
      if (!TouchInput.isPressed() && !Input.isPressed("ok")) {
        _ringChoiceClickGuard = false;
      } else {
        return;
      }
    }

    if (
      Input.isTriggered("up") ||
      Input.isTriggered("down") ||
      OnevASSISTANT.getWheelInput("up") ||
      OnevASSISTANT.getWheelInput("down")
    ) {
      const dir =
        Input.isTriggered("up") || OnevASSISTANT.getWheelInput("up") ? -1 : 1;
      moveRingSelection(dir);
    }

    if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
      selectRingChoice();
    }

    if (Input.isTriggered("cancel")) {
      handleRingChoiceCancel();
    }
  };

  function moveRingSelection(direction) {
    if (_ringChoiceSprites.length === 0) return;

    const config = _ringChoiceConfig;
    const realCount = _ringChoiceSprites.length;
    const virtualCount = config.virtualCount;
    const initialAngle = config.initialAngleRad || 0;
    const centerX = config.centerX;
    const centerY = config.centerY;
    const hasMask = !!config.ringChoiceContainer;
    const toLocalX = (x) => (hasMask ? x - centerX : x);
    const toLocalY = (y) => (hasMask ? y - centerY : y);
    const easeSelected = config.enlargeSelected !== false;
    const selScale = easeSelected ? 1.2 : 1.0;
    const loop = config.rotateContinuously !== false;
    const setAnim = (oldPos, newPos) => {
      for (let i = 0; i < realCount; i++) {
        const spr = _ringChoiceSprites[i];
        if (!spr) continue;
        spr._startX = toLocalX(oldPos[i].x);
        spr._startY = toLocalY(oldPos[i].y);
        spr._targetX = toLocalX(newPos[i].x);
        spr._targetY = toLocalY(newPos[i].y);
        spr._frame = 0;
        spr._isAnimating = true;
      }
    };

    let moved = false;

    if (direction === 0) {
      const prevIndex = _currentRingIndex;
      const newRing = 0;
      const newVirt = 0;
      const oldOffset =
        initialAngle - (_currentVirtualIndex * 2 * Math.PI) / virtualCount;
      const newOffset = initialAngle - (newVirt * 2 * Math.PI) / virtualCount;
      setAnim(
        calculateRingPositions(
          virtualCount,
          config.circleRadius,
          centerX,
          centerY,
          oldOffset
        ),
        calculateRingPositions(
          virtualCount,
          config.circleRadius,
          centerX,
          centerY,
          newOffset
        )
      );

      if (_ringChoiceSprites[prevIndex]) {
        _ringChoiceSprites[prevIndex].scale.set(1.0, 1.0);
        _ringChoiceSprites[prevIndex]._isSelected = false;
      }
      _ringChoiceSprites[newRing].scale.set(selScale, selScale);
      _ringChoiceSprites[newRing]._isSelected = true;

      _currentRingIndex = newRing;
      _currentVirtualIndex = newVirt;
      moved = prevIndex !== newRing;
    } else {
      const prevIndex = _currentRingIndex;
      let newRing = direction > 0 ? prevIndex + 1 : prevIndex - 1;

      if (!loop && (newRing < 0 || newRing >= realCount)) return;
      newRing = (newRing + realCount) % realCount;

      let newVirt = newRing;
      if (virtualCount > realCount) {
        if (loop) {
          newVirt =
            (_currentVirtualIndex + (direction > 0 ? 1 : -1) + virtualCount) %
            virtualCount;
          while (newVirt >= realCount) {
            newVirt =
              (newVirt + (direction > 0 ? 1 : -1) + virtualCount) %
              virtualCount;
          }
        } else {
          newVirt = newRing;
        }
      }

      _currentRingIndex = newRing;
      _currentVirtualIndex = newVirt;

      const oldVirt = (newVirt - direction + virtualCount) % virtualCount;
      const oldOff = initialAngle - (oldVirt * 2 * Math.PI) / virtualCount;
      const newOff = initialAngle - (newVirt * 2 * Math.PI) / virtualCount;
      setAnim(
        calculateRingPositions(
          virtualCount,
          config.circleRadius,
          centerX,
          centerY,
          oldOff
        ),
        calculateRingPositions(
          virtualCount,
          config.circleRadius,
          centerX,
          centerY,
          newOff
        )
      );

      if (_ringChoiceSprites[prevIndex]) {
        _ringChoiceSprites[prevIndex].scale.set(1.0, 1.0);
        _ringChoiceSprites[prevIndex]._isSelected = false;
      }
      _ringChoiceSprites[newRing].scale.set(selScale, selScale);
      _ringChoiceSprites[newRing]._isSelected = true;
      moved = prevIndex !== newRing;
    }

    if (moved && config.selectSe && config.selectSe.name) {
      AudioManager.playSe(config.selectSe);
    }
  }

  function selectRingChoice() {
    if (!_ringChoiceSprites[_currentRingIndex]) return;
    const config = _ringChoiceConfig;
    const realCount = _ringChoiceSprites.length;

    if (_currentVirtualIndex >= realCount) {
      return;
    }

    if (config.okSe && config.okSe.name) {
      AudioManager.playSe(config.okSe);
    }

    const ceId = Number(config.commonEvents[_currentVirtualIndex]);
    if (ceId > 0) {
      $gameTemp.reserveCommonEvent(ceId);
    }
    cleanupRingChoice();
  }

  function handleRingChoiceCancel() {
    const config = _ringChoiceConfig;
    if (config.cancelAction === "index0に戻る") {
      moveRingSelection(0);
    } else {
      cleanupRingChoice();
    }
  }

  function cleanupRingChoice() {
    _ringChoiceEnabled = false;
    _ringChoiceConfig = null;
    if (_ringChoiceBaseSprite && _ringChoiceBaseSprite.parent) {
      _ringChoiceBaseSprite.parent.removeChild(_ringChoiceBaseSprite);
    }
    _ringChoiceBaseSprite = null;
    if (_ringChoiceSprites) {
      _ringChoiceSprites.forEach((sprite) => {
        if (sprite && sprite.parent) sprite.parent.removeChild(sprite);
      });
    }
    _ringChoiceSprites = [];
    _currentRingIndex = 0;
    _currentVirtualIndex = 0;

    if (_ringChoiceConfig && _ringChoiceConfig.ringChoiceContainer) {
      if (_ringChoiceConfig.ringChoiceContainer.parent) {
        _ringChoiceConfig.ringChoiceContainer.parent.removeChild(
          _ringChoiceConfig.ringChoiceContainer
        );
      }
      _ringChoiceConfig.ringChoiceContainer = null;
    }

    setMenuEnabled(_menuEnabledBeforeRingChoice);
    _ringChoiceClickGuard = false;
  }

  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "リング選択肢") {
      if (this.setWaitMode) {
        this.setWaitMode("ringChoice");
      }
      _menuEnabledBeforeRingChoice = getMenuEnabled();
      setMenuEnabled(false);
    }
  };

  const _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
  Scene_Map.prototype.isMenuEnabled = function () {
    if (_ringChoiceEnabled) {
      return false;
    }
    return _Scene_Map_isMenuEnabled.call(this);
  };

  //=========================================================================
  // クロスフェードBGM
  //=========================================================================
  OnevASSISTANT = OnevASSISTANT || {};
  OnevASSISTANT._fadeTimer = null;
  OnevASSISTANT._crossFadeTimer = null;
  OnevASSISTANT._crossFadeOldBuffer = null;

  function clearFadeTimer() {
    if (OnevASSISTANT._fadeTimer) {
      clearInterval(OnevASSISTANT._fadeTimer);
      OnevASSISTANT._fadeTimer = null;
    }
  }

  function clearCrossFadeTimer() {
    if (OnevASSISTANT._crossFadeTimer) {
      clearInterval(OnevASSISTANT._crossFadeTimer);
      OnevASSISTANT._crossFadeTimer = null;
    }
    if (OnevASSISTANT._crossFadeOldBuffer) {
      try { OnevASSISTANT._crossFadeOldBuffer.stop(); } catch (e) {}
      OnevASSISTANT._crossFadeOldBuffer = null;
    }
  }

  function fadeOutBuffer(buffer, durationMs) {
    if (!buffer) return;
    clearFadeTimer();
    clearCrossFadeTimer();
    if (durationMs <= 0) {
      buffer.stop();
      AudioManager._bgmBuffer = null;
      AudioManager._currentBgm = null;
      return;
    }
    const step = 30;
    const steps = Math.max(1, Math.ceil(durationMs / step));
    let count = 0;
    const startVol = buffer._volume;
    OnevASSISTANT._fadeTimer = setInterval(() => {
      count++;
      const t = count / steps;
      buffer.volume = startVol * (1 - t);
      if (count >= steps) {
        clearFadeTimer();
        buffer.stop();
        AudioManager._bgmBuffer = null;
        AudioManager._currentBgm = null;
      }
    }, step);
  }

  OnevASSISTANT.crossFadeBgm = function (params) {
    const nameRaw = params.name ?? "";
    const name = String(nameRaw).trim();
    const tgtVol = params.volume / 100;
    const pitch = params.pitch / 100;
    const pan = params.pan / 100;
    const fadeTime = params.fadeTime;
    const oldBuffer = AudioManager._bgmBuffer;
    const current = AudioManager._currentBgm;

    clearCrossFadeTimer();
    clearFadeTimer();

    if (typeof isMessageSkipping === "function" && isMessageSkipping()) {
      if (oldBuffer) {
        try { oldBuffer.stop(); } catch (e) {}
        AudioManager._bgmBuffer = null;
        AudioManager._currentBgm = null;
      }
      if (name) {
        AudioManager.playBgm({
          name,
          volume: params.volume,
          pitch: params.pitch,
          pan: params.pan,
        });
      } else {
        AudioManager.stopBgm();
      }
      return;
    }

    if (!name) {
      if (!oldBuffer) return;
      fadeOutBuffer(oldBuffer, fadeTime);
      return;
    }

    if (
      current &&
      current.name === name &&
      (current.pitch ?? 100) === (params.pitch ?? 100) &&
      (current.pan ?? 0) === (params.pan ?? 0)
    ) {
      return;
    }

    if (!oldBuffer) {
      AudioManager.playBgm({
        name,
        volume: params.volume,
        pitch: params.pitch,
        pan: params.pan,
      });
      return;
    }

    const ext = AudioManager.audioFileExt
      ? AudioManager.audioFileExt()
      : ".ogg";
    const newBuffer = new WebAudio(`audio/bgm/${name}${ext}`);
    newBuffer.pitch = pitch;
    newBuffer.pan = pan;
    newBuffer.volume = 0;
    newBuffer.play(true);

    OnevASSISTANT._crossFadeOldBuffer = oldBuffer;

    const startCrossFade = () => {
      const step = 30;
      const steps = Math.max(1, Math.ceil(fadeTime / step));
      let count = 0;
      const oldStartVol = oldBuffer._volume;
      const targetOldBuffer = oldBuffer;

      OnevASSISTANT._crossFadeTimer = setInterval(() => {
        count++;
        const t = count / steps;
        try { targetOldBuffer.volume = oldStartVol * (1 - t); } catch (e) {}
        newBuffer.volume = tgtVol * t;
        if (count >= steps) {
          clearInterval(OnevASSISTANT._crossFadeTimer);
          OnevASSISTANT._crossFadeTimer = null;
          try { targetOldBuffer.stop(); } catch (e) {}
          if (OnevASSISTANT._crossFadeOldBuffer === targetOldBuffer) {
            OnevASSISTANT._crossFadeOldBuffer = null;
          }
          AudioManager._bgmBuffer = newBuffer;
          AudioManager._currentBgm = {
            name,
            volume: params.volume,
            pitch: params.pitch,
            pan: params.pan,
            pos: 0,
          };
        }
      }, step);
    };

    if (newBuffer.isReady && newBuffer.isReady()) {
      startCrossFade();
    } else if (newBuffer.addLoadListener) {
      newBuffer.addLoadListener(startCrossFade);
    } else {
      startCrossFade();
    }
  };

  PluginManager.registerCommand(PLUGIN_NAME, "crossFadeBgm", (args) => {
    OnevASSISTANT.crossFadeBgm({
      name: args.name,
      volume: Number(args.volume || 90),
      pitch: Number(args.pitch || 100),
      pan: Number(args.pan || 0),
      fadeTime: Number(args.fadeTime || 2000),
    });
  });

  var RecollectionCursorState = null;

  //======================================================================
  // 回想シーン設定
  //======================================================================

  SceneManager._forceFadeInDuration = 0;

  function Scene_Recollection() {
    this.initialize(...arguments);
  }
  window.Scene_Recollection = Scene_Recollection;

  Scene_Recollection.prototype = Object.create(Scene_Base.prototype);
  Scene_Recollection.prototype.constructor = Scene_Recollection;

  Scene_Recollection.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);

    const param = OnevASSISTANT.safeJsonParse(
      OnevASSISTANT.getPluginParameter("OnevASSISTANT", "RecollectionSettings"),
      {}
    );
    this._activeSwitches = JSON.parse(
      param.RecollectionActiveSwitches || "[]"
    ).map(Number);
    this._activeSwitches.forEach(
      (id) => id && $gameSwitches.setValue(id, true)
    );

    this._page = 1;
    this._cursorIndex = -1;
    this._sprites = [];
    this._frames = [];
    this._choiceSprites = [];
    this._tabCursorIndex = 0;
    this._focusTarget = "tab";
    this._inputMode = "keyboard";
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._selected = false;
    this._cancelBaseSprite = null;
    this._cancelConfirmActive = false;
    this._cancelConfirmIndex = 0;
    this._cancelConfirmSprites = [];
    this._cancelConfirmFrames = [];
    this._pendingExit = false;
    this._exitFadeInAfter = 30;

    if (window.RecollectionCursorState) {
      this._page = window.RecollectionCursorState.page;
      this._tabCursorIndex = window.RecollectionCursorState.tabIndex;
      this._cursorIndex = window.RecollectionCursorState.choiceIndex;
      this._focusTarget = "choice";
      window.RecollectionCursorState = null;
    }
  };

  Scene_Recollection.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this._loadParams();
    this._setupBackground();
    this._setupBgm();
    this._createCursor();
    this._createTabs();

    if (this._tabCursorCfg.Image) {
      this._tabCursorSprite = new Sprite(
        ImageManager.loadBitmap("img/Recollection/", this._tabCursorCfg.Image)
      );
      this._tabCursorSprite.anchor.set(0.5);
      this._tabCursorSprite.visible = true;
      this.addChild(this._tabCursorSprite);
    }

    this._changePage(this._page);
    this._updateTabCursor();
    if (this._cursorSprite) {
      this.removeChild(this._cursorSprite);
      this.addChild(this._cursorSprite);
      this._cursorSprite.visible = this._focusTarget === "choice";
    }

    if (
      this._focusTarget === "choice" &&
      this._cursorIndex >= 0 &&
      this._cursorIndex < this._choiceSprites.length
    ) {
      this.setChildIndex(this._cursorSprite, this.children.length - 1);
      this._updateCursor(true);
    }
  };

  Scene_Recollection.prototype._loadParams = function () {
    const s = JSON.parse(
      PluginManager.parameters("OnevASSISTANT")["RecollectionSettings"] || "{}"
    );

    this._tabButtons = OnevASSISTANT.parseDeep(s.Tabs || "[]");
    this._cursorCfg = JSON.parse(s.CursorConfig || "{}");
    this._selSe = JSON.parse(s.SelectSE || "{}");
    this._okSe = JSON.parse(s.OkSE || "{}");

    const rawCancel =
      typeof s.RecollectionCancelsetting === "string"
        ? JSON.parse(s.RecollectionCancelsetting)
        : s.RecollectionCancelsetting || {};
    this._cancelCfg = {
      BaseImage: rawCancel.BaseImage || "",
      Choices: JSON.parse(rawCancel.Choices || "[]").map((v) => {
        const o = typeof v === "string" ? JSON.parse(v) : v;
        if (o.HoverEffect) o.HoverEffect = JSON.parse(o.HoverEffect);
        return o;
      }),
    };

    this._choices = JSON.parse(s.Choices || "[]").map((v) => {
      const o = JSON.parse(v);
      if (o.HoverEffect) o.HoverEffect = JSON.parse(o.HoverEffect);
      return o;
    });

    this._tabBackgrounds = JSON.parse(s.TabBackgrounds || "[]").map((v) => {
      const o = JSON.parse(v);
      o.Page = Number(o.Page || 1);
      o.X = Number(o.X || 0);
      o.Y = Number(o.Y || 0);
      return o;
    });

    this._tabCursorCfg = JSON.parse(s.TabCursor || "{}");
    this._maxPage = this._choices.reduce(
      (mx, c) => Math.max(mx, Number(c.Page || 1)),
      1
    );
  };

  Scene_Recollection.prototype._setupBackground = function () {
    const bg = JSON.parse(
      PluginManager.parameters("OnevASSISTANT")["RecollectionSettings"] || "{}"
    ).Background;
    if (bg) {
      this._baseBackgroundSprite = new Sprite(
        ImageManager.loadBitmap("img/Recollection/", bg)
      );
      this.addChild(this._baseBackgroundSprite);
    }
  };

  Scene_Recollection.prototype._setupBgm = function () {
    const bgm = JSON.parse(
      JSON.parse(
        PluginManager.parameters("OnevASSISTANT")["RecollectionSettings"] ||
          "{}"
      ).BGM || "{}"
    );
    if (bgm.name)
      OnevASSISTANT.crossFadeBgm({
        name: String(bgm.name),
        volume: +bgm.volume || 90,
        pitch: +bgm.pitch || 100,
        pan: +bgm.pan || 0,
        fadeTime: 1000,
      });
  };

  Scene_Recollection.prototype._clearSprites = function () {
    this._sprites.forEach((sp) => this.removeChild(sp));
    this._frames.forEach((fr) => fr && this.removeChild(fr));
    this._sprites = [];
    this._frames = [];
    this._choiceSprites = [];
  };

  Scene_Recollection.prototype._clearTabSprites = function () {
    if (this._tabSprites)
      this._tabSprites.forEach((sp) => this.removeChild(sp));
    if (this._tabFrames)
      this._tabFrames.forEach((fr) => fr && this.removeChild(fr));
    this._tabSprites = [];
    this._tabFrames = [];
  };

  Scene_Recollection.prototype._createTabs = function () {
    this._clearTabSprites();

    this._tabSprites = [];
    this._tabFrames = [];

    this._tabButtons.forEach((tab, idx) => {
      if (!tab.Image) return;

      const sp = new Sprite(
        ImageManager.loadBitmap("img/Recollection/", tab.Image)
      );
      sp.anchor.set(0.5);
      sp.x = +tab.X || 0;
      sp.y = +tab.Y || 0;
      sp._tabPage = +tab.Page || 1;
      this.addChild(sp);
      this._tabSprites.push(sp);

      if (tab.FrameImage) {
        const fr = new Sprite(
          ImageManager.loadBitmap("img/Recollection/", tab.FrameImage)
        );
        fr.anchor.set(0.5);
        fr.x = sp.x;
        fr.y = sp.y;
        fr.visible = idx === this._tabCursorIndex;
        this.addChild(fr);
        this._tabFrames[idx] = fr;
      } else {
        this._tabFrames[idx] = null;
      }
    });
  };

  Scene_Recollection.prototype._createChoices = function () {
    const oldSprites = this._choiceSprites || [];
    const oldFrames = this._frames || [];

    const newSprites = [];
    const newFrames = [];

    let imagesToLoad = 0;
    let imagesLoaded = 0;

    this._choices.forEach((it) => {
      if (+it.Page !== this._page) return;

      const enabled =
        +it.ShowSwitch === 0 ||
        OnevASSISTANT.checkSwitches([+it.ShowSwitch], true);
      const imgName = enabled ? it.EnabledImage : it.DisabledImage;
      if (!imgName) return;

      const bmp = ImageManager.loadBitmap("img/Recollection/", imgName);
      const sp = new Sprite(bmp);
      sp.anchor.set(0.5);
      sp.x = +it.X || 0;
      sp.y = +it.Y || 0;
      sp.scale.set((+it.Scale || 100) / 100);
      sp.visible = false;

      const eff = it.HoverEffect || {};
      sp._baseX = sp.x;
      sp._baseY = sp.y;
      sp._baseScale = sp.scale.x;
      sp._hoverScale =
        eff.UseScale === "true" ? (+eff.Scale || 100) / 100 : sp._baseScale;
      sp._hoverOffsetX = eff.UseOffset === "true" ? +eff.OffsetX : 0;
      sp._hoverOffsetY = eff.UseOffset === "true" ? +eff.OffsetY : 0;

      sp._recCfg = it;
      sp._recEnabled = enabled;

      imagesToLoad++;
      bmp.addLoadListener(() => {
        sp.visible = true;
        imagesLoaded++;
        if (imagesLoaded >= imagesToLoad) {
          oldSprites.forEach((s) => this.removeChild(s));
          oldFrames.forEach((f) => f && this.removeChild(f));

          if (this._cursorIndex < 0) this._cursorIndex = 0;
          this._updateCursor(true);
        }
      });

      this.addChild(sp);
      newSprites.push(sp);

      let frameSprite = null;
      if (enabled && (eff.UseFrame === true || eff.UseFrame === "true")) {
        const fbmp = ImageManager.loadBitmap(
          "img/Recollection/",
          eff.FrameImage
        );
        const fr = new Sprite(fbmp);
        fr.anchor.set(0.5);

        fr.x = fr._baseX = sp._baseX;
        fr.y = fr._baseY = sp._baseY;
        fr._baseScale = 1.0;
        fr._enabled = enabled;
        fr._targetX = fr._baseX;
        fr._targetY = fr._baseY;
        fr._targetScale = fr._baseScale;

        fr.visible = false;
        this.addChild(fr);
        frameSprite = fr;
      }

      newFrames.push(frameSprite);
    });

    this._choiceSprites = newSprites;
    this._sprites = newSprites;
    this._frames = newFrames;

    if (newSprites.length) {
      if (this._focusTarget !== "choice" || this._cursorIndex < 0) {
        this._cursorIndex = 0;
      }
      this._updateCursor(true);

      if (
        this._focusTarget === "choice" &&
        this._cursorIndex >= 0 &&
        this._cursorIndex < newSprites.length
      ) {
        this._updateCursor(true);
        const tgt = this._choiceSprites[this._cursorIndex];
        if (this._cursorSprite && tgt) {
          const targetX = tgt._baseX + (+this._cursorCfg.OffsetX || 0);
          const targetY = tgt._baseY + (+this._cursorCfg.OffsetY || 0);
          this._cursorSprite.x = targetX;
          this._cursorSprite.y = targetY;
          this._cursorSprite._targetX = targetX;
          this._cursorSprite._targetY = targetY;
        }
      }

      if (
        this._focusTarget === "choice" &&
        this._cursorIndex >= 0 &&
        this._cursorIndex < newSprites.length
      ) {
        this._choiceSprites.forEach((sp, i) => {
          const hov = i === this._cursorIndex;
          sp._targetX = sp._baseX + (hov ? sp._hoverOffsetX : 0);
          sp._targetY = sp._baseY + (hov ? sp._hoverOffsetY : 0);
          sp._targetScale = hov ? sp._hoverScale : sp._baseScale;

          if (hov) {
            sp.x = sp._targetX;
            sp.y = sp._targetY;
            sp.scale.set(sp._targetScale, sp._targetScale);
          }

          const fr = this._frames[i];
          if (fr) {
            fr.visible = hov;
            fr._targetX = sp._targetX;
            fr._targetY = sp._targetY;
            fr._targetScale = sp._targetScale;

            if (hov) {
              fr.x = fr._targetX;
              fr.y = fr._targetY;
              if (fr._targetScale != null) {
                fr.scale.set(fr._targetScale, fr._targetScale);
              }
            }
          }
        });
      }
    }
  };

  Scene_Recollection.prototype._createCursor = function () {
    const cfg = this._cursorCfg;
    if (!cfg.Image) return;
    this._cursorSprite = new Sprite(
      ImageManager.loadBitmap("img/Recollection/", cfg.Image)
    );
    this._cursorSprite.anchor.set(0.5);
    this._cursorSprite.visible = false;
    this._cursorCfg.OffsetX = Number(cfg.OffsetX) || 0;
    this._cursorCfg.OffsetY = Number(cfg.OffsetY) || 0;
    this.addChild(this._cursorSprite);
  };

  Scene_Recollection.prototype._updateTabCursor = function () {
    this._tabFrames.forEach(
      (fr, i) => fr && (fr.visible = i === this._tabCursorIndex)
    );

    if (this._tabCursorSprite) {
      const sp = this._tabSprites[this._tabCursorIndex];
      if (sp && sp.bitmap && sp.bitmap.isReady()) {
        this._tabCursorSprite.visible = true;
        this._tabCursorSprite.x = sp.x + (+this._tabCursorCfg.OffsetX || 0);
        this._tabCursorSprite.y = sp.y + (+this._tabCursorCfg.OffsetY || 0);
      } else {
        this._tabCursorSprite.visible = false;
      }
    }
  };

  Scene_Recollection.prototype._updateCursor = function (skipSe = false) {
    if (this._cancelConfirmActive) return;
    if (this._selected) return;
    if (
      this._cursorIndex < 0 ||
      this._cursorIndex >= this._choiceSprites.length
    ) {
      if (this._cursorSprite) this._cursorSprite.visible = false;
      return;
    }

    this._choiceSprites.forEach((sp, i) => {
      const hov = i === this._cursorIndex;
      sp._targetX = sp._baseX + (hov ? sp._hoverOffsetX : 0);
      sp._targetY = sp._baseY + (hov ? sp._hoverOffsetY : 0);
      sp._targetScale = hov ? sp._hoverScale : sp._baseScale;
      const fr = this._frames[i];
      if (fr) {
        fr.visible = hov && sp._recEnabled;
        fr._targetX = sp._targetX;
        fr._targetY = sp._targetY;
        fr._targetScale = sp._targetScale;

        if (hov) {
          fr.x = fr._targetX;
          fr.y = fr._targetY;
          if (fr._targetScale != null) {
            fr.scale.set(fr._targetScale, fr._targetScale);
          }
        } else {
          fr.x = sp._baseX;
          fr.y = sp._baseY;
          fr.scale.set(1.0, 1.0);
        }
      }
    });

    const tgt = this._choiceSprites[this._cursorIndex];
    if (this._cursorSprite) {
      this._cursorSprite.visible = true;
      this._cursorSprite._targetX =
        tgt._targetX + (+this._cursorCfg.OffsetX || 0);
      this._cursorSprite._targetY =
        tgt._targetY + (+this._cursorCfg.OffsetY || 0);

      this.setChildIndex(this._cursorSprite, this.children.length - 1);
    }

    if (!skipSe && this._selSe.name)
      AudioManager.playSe({
        name: this._selSe.name,
        volume: +this._selSe.volume || 90,
        pitch: +this._selSe.pitch || 100,
        pan: +this._selSe.pan || 0,
      });
  };

  Scene_Recollection.prototype._moveCursor = function (dir) {
    if (this._selected) return;
    const curIdx = this._cursorIndex;
    const curSp = this._choiceSprites[curIdx];
    if (!curSp) return;
    const cx = curSp._baseX,
      cy = curSp._baseY;

    const cands = [];
    this._choiceSprites.forEach((sp, i) => {
      if (i === curIdx) return;
      const dx = sp._baseX - cx;
      const dy = sp._baseY - cy;
      if (
        (dir === "up" && dy >= 0) ||
        (dir === "down" && dy <= 0) ||
        (dir === "left" && dx >= 0) ||
        (dir === "right" && dx <= 0)
      )
        return;
      cands.push({ i, dx, dy });
    });

    const score = (c) =>
      dir === "left" || dir === "right"
        ? 2 * c.dx * c.dx + c.dy * c.dy
        : 2 * c.dy * c.dy + c.dx * c.dx;

    cands.sort((a, b) => score(a) - score(b));

    if (cands.length > 0) {
      this._cursorIndex = cands[0].i;
      this._updateCursor();
      return;
    }

    const wrapCands = [];
    this._choiceSprites.forEach((sp, i) => {
      if (i === curIdx) return;
      const dx = sp._baseX - cx;
      const dy = sp._baseY - cy;

      if ((dir === "left" || dir === "right") && Math.abs(dy) < 16) {
        wrapCands.push({ i, x: sp._baseX });
      } else if ((dir === "up" || dir === "down") && Math.abs(dx) < 16) {
        wrapCands.push({ i, y: sp._baseY });
      }
    });

    if (wrapCands.length > 0) {
      if (dir === "left") {
        wrapCands.sort((a, b) => b.x - a.x);
      } else if (dir === "right") {
        wrapCands.sort((a, b) => a.x - b.x);
      } else if (dir === "up") {
        wrapCands.sort((a, b) => b.y - a.y);
      } else if (dir === "down") {
        wrapCands.sort((a, b) => a.y - b.y);
      }

      this._cursorIndex = wrapCands[0].i;
      this._updateCursor();
    }
  };

  Scene_Recollection.prototype._changePage = function (page) {
    this._page = page;
    this._createChoices();
    this._updateTabCursor();

    if (this._focusTarget === "choice") {
      if (this._selected) return;
      this._cursorIndex = 0;
      if (this._cursorSprite) this._cursorSprite.visible = true;
      this._updateCursor(true);
    } else {
      if (this._cursorSprite) this._cursorSprite.visible = false;
    }

    if (this._cursorSprite) {
      this.removeChild(this._cursorSprite);
      this.addChild(this._cursorSprite);
      this.setChildIndex(this._cursorSprite, this.children.length - 1);
    }

    this._frames.forEach((fr, i) => {
      if (fr) {
        const sp = this._choiceSprites[i];
        if (sp) {
          fr.x = sp._baseX;
          fr.y = sp._baseY;
          fr._baseX = sp._baseX;
          fr._baseY = sp._baseY;
          fr._targetX = sp._baseX;
          fr._targetY = sp._baseY;
          fr.visible = false;
        }
      }
    });

    if (this._tabBackgroundSprites) {
      this._tabBackgroundSprites.forEach((sp) => this.removeChild(sp));
    }
    this._tabBackgroundSprites = [];

    const shouldShow = (cfg) => {
      const sw = Number(cfg.ShowSwitch);
      if (sw > 0 && !$gameSwitches.value(sw)) return false;

      const vid = Number(cfg.ShowVariable);
      if (vid > 0) {
        const val = $gameVariables.value(vid);
        const target = Number(cfg.ShowValue);
        const op = cfg.ShowOperator || "等しい（==）";

        switch (op) {
          case "等しい（==）":
            if (val !== target) return false;
            break;
          case "以上（>=）":
            if (val < target) return false;
            break;
          case "以下（<=）":
            if (val > target) return false;
            break;
          case "より大きい（>）":
            if (val <= target) return false;
            break;
          case "より小さい（<）":
            if (val >= target) return false;
            break;
        }
      }
      return true;
    };

    const bgList = this._tabBackgrounds
      .filter((cfg) => Number(cfg.Page) === page)
      .filter((cfg) => shouldShow(cfg));

    const baseIndex = this.children.indexOf(this._baseBackgroundSprite ?? null);
    let insertAt = baseIndex >= 0 ? baseIndex + 1 : this.children.length;

    bgList.forEach((cfg) => {
      const sp = new Sprite(
        ImageManager.loadBitmap("img/Recollection/", cfg.Image)
      );
      sp.anchor.set(0.5);
      sp.x = +cfg.X || Graphics.width / 2;
      sp.y = +cfg.Y || Graphics.height / 2;
      this.addChildAt(sp, insertAt++);
      this._tabBackgroundSprites.push(sp);
    });
  };

  Scene_Recollection.prototype._hideCancelConfirm = function () {
    this._cancelConfirmActive = false;
    if (
      this._cursorSprite &&
      this._focusTarget === "choice" &&
      this._cursorIndex >= 0 &&
      this._cursorIndex < this._choiceSprites.length
    ) {
      this._cursorSprite.visible = true;
      this._updateCursor(true);
    }
    this._frames.forEach((fr, i) => {
      if (fr) fr.visible = i === this._cursorIndex;
    });
    this._cancelConfirmSprites.forEach((s) => this.removeChild(s));
    this._cancelConfirmFrames.forEach((f) => f && this.removeChild(f));
    if (this._cancelBaseSprite) this.removeChild(this._cancelBaseSprite);

    this._cancelConfirmSprites = [];
    this._cancelConfirmFrames = [];
    this._cancelConfirmIndex = 0;
    this._cancelBaseSprite = null;
  };

  Scene_Recollection.prototype._showCancelConfirmImage = function () {
    if (Array.isArray(this._tabFrames)) {
      this._tabFrames.forEach((fr) => fr && (fr.visible = false));
    }
    if (this._tabCursorSprite) {
      this._tabCursorSprite.visible = false;
    }

    if (this._cancelBaseSprite) return;
    const name = this._cancelCfg.BaseImage;
    if (!name) return;

    this._cancelBaseSprite = new Sprite(
      ImageManager.loadBitmap("img/Recollection/", name)
    );
    this._cancelBaseSprite.anchor.set(0.5);
    this._cancelBaseSprite.x = Graphics.width / 2;
    this._cancelBaseSprite.y = Graphics.height / 2;
    this.addChild(this._cancelBaseSprite);
    this.setChildIndex(this._cancelBaseSprite, this.children.length - 1);
    this._cancelConfirmSprites = [];
    this._cancelConfirmFrames = [];
    this._cancelConfirmIndex = 0;

    this._cancelCfg.Choices.forEach((cfg, i) => {
      const sp = new Sprite(
        ImageManager.loadBitmap("img/Recollection/", cfg.Image)
      );
      sp.anchor.set(0.5);
      sp.x = +cfg.X || 0;
      sp.y = +cfg.Y || 0;

      const eff = cfg.HoverEffect || {};
      sp._baseX = sp.x;
      sp._baseY = sp.y;
      sp._baseScale = 1.0;
      sp._hoverScale = eff.UseScale === "true" ? (+eff.Scale || 100) / 100 : 1;
      sp._hoverOffsetX = eff.UseOffset === "true" ? +eff.OffsetX : 0;
      sp._hoverOffsetY = eff.UseOffset === "true" ? +eff.OffsetY : 0;
      sp._action = cfg.Action || "cancel";

      this.addChild(sp);
      this.setChildIndex(sp, this.children.length - 1);
      this._cancelConfirmSprites.push(sp);

      if (eff.FrameImage) {
        const fr = new Sprite(
          ImageManager.loadBitmap("img/Recollection/", eff.FrameImage)
        );
        fr.anchor.set(0.5);
        fr.x = sp.x;
        fr.y = sp.y;
        fr.visible = false;
        this.addChild(fr);
        this.setChildIndex(fr, this.children.length - 1);
        this._cancelConfirmFrames[i] = fr;
      } else {
        this._cancelConfirmFrames[i] = null;
      }
    });

    this._updateCancelConfirmCursor(true);

    if (this._cursorSprite) this._cursorSprite.visible = false;
    this._frames.forEach((fr) => {
      if (fr) fr.visible = false;
    });

    this._cancelConfirmActive = true;
  };

  Scene_Recollection.prototype._updateCancelConfirmCursor = function (
    skipSe = false
  ) {
    if (this._selected) return;
    this._cancelConfirmSprites.forEach((sp, i) => {
      const hov = i === this._cancelConfirmIndex;
      sp._targetX = sp._baseX + (hov ? sp._hoverOffsetX : 0);
      sp._targetY = sp._baseY + (hov ? sp._hoverOffsetY : 0);
      sp._targetScale = hov ? sp._hoverScale : sp._baseScale;
      const fr = this._cancelConfirmFrames[i];
      if (fr) {
        fr.visible = hov;
        fr._targetX = sp._targetX;
        fr._targetY = sp._targetY;
      }
    });

    if (!skipSe && this._selSe.name)
      AudioManager.playSe({
        name: this._selSe.name,
        volume: +this._selSe.volume || 90,
        pitch: +this._selSe.pitch || 100,
        pan: +this._selSe.pan || 0,
      });
  };

  Scene_Recollection.prototype._onSelect = function (cfg) {
    if (this._selected) return;
    this._selected = true;

    window.RecollectionCursorState = {
      tabIndex: this._tabCursorIndex,
      choiceIndex: this._cursorIndex,
      page: this._page,
    };

    if (this._okSe.name)
      AudioManager.playSe({
        name: this._okSe.name,
        volume: +this._okSe.volume || 90,
        pitch: +this._okSe.pitch || 100,
        pan: +this._okSe.pan || 0,
      });

    if (cfg.CommonEventId) {
      $gameScreen._brightness = 0;
      $gameTemp.reserveCommonEvent(+cfg.CommonEventId);
    }

    this.startFadeOut(this.fadeSpeed(), false);
    this.fadeOutAll(this.fadeSpeed());
    AudioManager.fadeOutBgm(60);
    SceneManager.pop();
  };

  Scene_Recollection.prototype.update = function () {
    Scene_Base.prototype.update.call(this);

    if (this._pendingExit) {
      if (this._fadeDuration > 0) return;
      if (!this._didCleanup) {
        this._didCleanup = true;
        if (typeof window.ADMIN_forceClearAllCGPictures === "function") {
          window.ADMIN_forceClearAllCGPictures();
        }
        if (this._clearSprites) this._clearSprites();
        if (this._clearTabSprites) this._clearTabSprites();
        if (this._baseBackgroundSprite)
          this.removeChild(this._baseBackgroundSprite);
        if (this._tabBackgroundSprites)
          this._tabBackgroundSprites.forEach((sp) => this.removeChild(sp));
        if (this._cursorSprite) this.removeChild(this._cursorSprite);
        if (this._tabCursorSprite) this.removeChild(this._tabCursorSprite);
        if (this._cancelBaseSprite) this.removeChild(this._cancelBaseSprite);
        if (this._cancelConfirmSprites)
          this._cancelConfirmSprites.forEach((sp) => this.removeChild(sp));
        if (this._cancelConfirmFrames)
          this._cancelConfirmFrames.forEach((fr) => fr && this.removeChild(fr));
      }

      const dur = this._exitFadeInAfter || 30;
      SceneManager._forceFadeInDuration = dur;
      $gameScreen.startFadeIn(dur);
      $gameSystem.replayBgm();
      SceneManager.pop();
      this._pendingExit = false;
      return;
    }

    if (this._pendingExit && this._fadeDuration <= 0) {
      this._pendingExit = false;
      SceneManager.pop();

      const next = SceneManager._scene;
      if (next && next.startFadeIn) {
        next.startFadeIn(this._exitFadeInAfter, false);
      }
      $gameScreen.startFadeIn(this._exitFadeInAfter);
      $gameSystem.replayBgm();
      return;
    }
    if (!this._sprites.length) return;
    if (this.isBusy()) return;
    if (this._selected) return;

    const mx = TouchInput.x,
      my = TouchInput.y;

    if (this._cancelConfirmActive) {
      const over = this._cancelConfirmSprites.findIndex((sp) => {
        if (!sp.bitmap || !sp.bitmap.isReady()) return false;
        const w = sp.bitmap.width * sp.scale.x;
        const h = sp.bitmap.height * sp.scale.y;
        return (
          mx >= sp.x - w / 2 &&
          mx <= sp.x + w / 2 &&
          my >= sp.y - h / 2 &&
          my <= sp.y + h / 2
        );
      });
      if (over >= 0 && over !== this._cancelConfirmIndex) {
        this._cancelConfirmIndex = over;
        this._updateCancelConfirmCursor();
      }

      for (let i = 0; i < this._cancelConfirmSprites.length; i++) {
        const sp = this._cancelConfirmSprites[i];
        if (TouchInput.isTriggered() && this._isMouseOverSprite(sp)) {
          const act = sp._action;
          if (act === "endRecollection") {
            this.exitRecollection();
          } else {
            this._hideCancelConfirm();
          }
          break;
        }
      }

      if (Input.isTriggered("left") || Input.isTriggered("right")) {
        const len = this._cancelConfirmSprites.length;
        this._cancelConfirmIndex = Input.isTriggered("left")
          ? (len + this._cancelConfirmIndex - 1) % len
          : (this._cancelConfirmIndex + 1) % len;
        this._updateCancelConfirmCursor();
      }
      if (Input.isTriggered("ok")) {
        const act =
          this._cancelConfirmSprites[this._cancelConfirmIndex]._action;
        act === "endRecollection"
          ? this.exitRecollection()
          : this._hideCancelConfirm();
      }

      _smoothSprites(this._choiceSprites.concat(this._frames));

      if (this._cursorSprite && this._cursorSprite.visible) {
        this._cursorSprite.x = this._cursorSprite._targetX;
        this._cursorSprite.y = this._cursorSprite._targetY;
        if (this._cursorSprite._targetScale != null) {
          const s = this._cursorSprite._targetScale;
          this._cursorSprite.scale.set(s, s);
        }
      }

      return;
    }

    if (
      Input.isPressed("up") ||
      Input.isPressed("down") ||
      Input.isPressed("left") ||
      Input.isPressed("right") ||
      Input.isTriggered("ok") ||
      Input.isTriggered("cancel")
    ) {
      this._inputMode = "keyboard";
    } else if (mx !== this._lastMouseX || my !== this._lastMouseY) {
      this._inputMode = "mouse";
    }
    this._lastMouseX = mx;
    this._lastMouseY = my;

    if (this._inputMode === "keyboard") {
      if (this._focusTarget === "choice") {
        if (Input.isTriggered("cancel")) {
          this._focusTarget = "tab";
          this._cursorIndex = -1;

          if (this._cursorSprite) this._cursorSprite.visible = false;

          this._choiceSprites.forEach((sp) => {
            sp.x = sp._baseX;
            sp.y = sp._baseY;
            sp.scale.set(sp._baseScale);
            sp._targetX = null;
            sp._targetY = null;
            sp._targetScale = null;
          });

          this._frames.forEach((fr) => {
            if (fr) {
              fr.visible = false;
              fr.x = null;
              fr.y = null;
              fr._targetX = null;
              fr._targetY = null;
            }
          });

          this._updateTabCursor();
        }
        if (Input.isTriggered("ok")) {
          const sp = this._choiceSprites[this._cursorIndex];
          if (sp && sp._recEnabled) this._onSelect(sp._recCfg);
        }
        if (
          Input.isRepeated("up") ||
          Input.isRepeated("down") ||
          Input.isRepeated("left") ||
          Input.isRepeated("right")
        ) {
          if (Input.isRepeated("up")) this._moveCursor("up");
          if (Input.isRepeated("down")) this._moveCursor("down");
          if (Input.isRepeated("left")) this._moveCursor("left");
          if (Input.isRepeated("right")) this._moveCursor("right");
        }
      } else {
        if (Input.isTriggered("cancel")) this._showCancelConfirmImage();

        if (Input.isTriggered("ok")) {
          this._focusTarget = "choice";

          if (this._choiceSprites.length) {
            this._cursorIndex = 0;
            if (this._cursorSprite) this._cursorSprite.visible = true;
            this._updateCursor();
          } else {
            this._cursorIndex = -1;
            if (this._cursorSprite) this._cursorSprite.visible = false;
          }
        }

        if (
          Input.isRepeated("left") ||
          Input.isRepeated("right") ||
          Input.isRepeated("up") ||
          Input.isRepeated("down")
        ) {
          const len = this._tabSprites.length;
          if (Input.isRepeated("left") || Input.isRepeated("up"))
            this._tabCursorIndex = (len + this._tabCursorIndex - 1) % len;
          else this._tabCursorIndex = (this._tabCursorIndex + 1) % len;

          this._updateTabCursor();
          this._changePage(this._tabSprites[this._tabCursorIndex]._tabPage);
        }
      }
    }

    if (this._inputMode === "mouse") {
      if (this._focusTarget === "choice") {
        const over = this._choiceSprites.findIndex((sp) => {
          if (!sp.bitmap || !sp.bitmap.isReady()) return false;
          const w = sp.bitmap.width * sp.scale.x;
          const h = sp.bitmap.height * sp.scale.y;
          return (
            mx >= sp.x - w / 2 &&
            mx <= sp.x + w / 2 &&
            my >= sp.y - h / 2 &&
            my <= sp.y + h / 2
          );
        });
        if (over >= 0 && over !== this._cursorIndex) {
          this._cursorIndex = over;
          this._updateCursor();
        }
        if (TouchInput.isTriggered() && over >= 0) {
          const sp = this._choiceSprites[over];
          if (sp._recEnabled) this._onSelect(sp._recCfg);
        }
      }

      this._tabSprites.forEach((sp, i) => {
        if (!sp.bitmap || !sp.bitmap.isReady()) return;
        const w = sp.bitmap.width,
          h = sp.bitmap.height;
        if (
          mx >= sp.x - w / 2 &&
          mx <= sp.x + w / 2 &&
          my >= sp.y - h / 2 &&
          my <= sp.y + h / 2 &&
          TouchInput.isTriggered()
        ) {
          this._tabCursorIndex = i;
          this._focusTarget = "choice";
          this._changePage(sp._tabPage);
          if (this._cursorSprite) this._cursorSprite.visible = true;
          this._updateCursor();
          this._updateTabCursor();
        }
      });

      if (
        ["tab", "choice"].includes(this._focusTarget) &&
        TouchInput.isCancelled()
      ) {
        this._showCancelConfirmImage();
      }

      this._choiceSprites.forEach((sp, i) => {
        const hov = i === this._cursorIndex;

        sp._targetX = sp._baseX + (hov ? sp._hoverOffsetX : 0);
        sp._targetY = sp._baseY + (hov ? sp._hoverOffsetY : 0);
        sp._targetScale = hov ? sp._hoverScale : sp._baseScale;

        const fr = this._frames[i];
        if (fr) {
          fr.visible = hov && sp._recEnabled;
          fr._targetX = sp._targetX;
          fr._targetY = sp._targetY;
          fr._targetScale = sp._targetScale;

          if (hov) {
            if (!this._cancelConfirmActive) {
              this.setChildIndex(fr, this.children.length - 1);
            }
            fr.x = fr._targetX;
            fr.y = fr._targetY;
            if (fr._targetScale != null) {
              fr.scale.set(fr._targetScale, fr._targetScale);
            }
          } else {
            fr.x = sp._baseX;
            fr.y = sp._baseY;
            fr.scale.set(1.0, 1.0);
          }
        }
      });

      if (this._cursorSprite && this._cursorSprite.visible) {
        if (!this._cancelConfirmActive) {
          this.setChildIndex(this._cursorSprite, this.children.length - 1);
        }
      }

      if (this._focusTarget === "tab") {
        const overChoice = this._choiceSprites.findIndex((sp) => {
          if (!sp.bitmap || !sp.bitmap.isReady()) return false;
          const w = sp.bitmap.width * sp.scale.x;
          const h = sp.bitmap.height * sp.scale.y;
          return (
            mx >= sp.x - w / 2 &&
            mx <= sp.x + w / 2 &&
            my >= sp.y - h / 2 &&
            my <= sp.y + h / 2
          );
        });

        if (overChoice >= 0) {
          this._focusTarget = "choice";
          this._cursorIndex = overChoice;
          if (this._cursorSprite) this._cursorSprite.visible = true;
          this._updateCursor();
        }
      }
    }

    _smoothSprites(this._choiceSprites.concat(this._frames));

    if (this._cursorSprite && this._cursorSprite.visible) {
      this._cursorSprite.x = this._cursorSprite._targetX;
      this._cursorSprite.y = this._cursorSprite._targetY;
      if (this._cursorSprite._targetScale != null) {
        const s = this._cursorSprite._targetScale;
        this._cursorSprite.scale.set(s, s);
      }
      this.setChildIndex(this._cursorSprite, this.children.length - 1);
    }
  };

  Scene_Recollection.prototype._checkRightClickTrigger = function () {
    if (TouchInput._rightButtonPressed && !this._wasRightClick) {
      this._wasRightClick = true;
      return true;
    }
    if (!TouchInput._rightButtonPressed) {
      this._wasRightClick = false;
    }
    return false;
  };

  Scene_Recollection.prototype.exitRecollection = function () {
    this._activeSwitches.forEach((id) => {
      if (id) $gameSwitches.setValue(id, false);
    });
    const spd = this.fadeSpeed();
    this.startFadeOut(spd, false);
    this.fadeOutAll(spd);
    AudioManager.fadeOutBgm(60);
    this._pendingExit = true;
  };

  function _smoothSprites(list) {
    const t = 0.2;
    list.forEach((sp) => {
      if (!sp || sp._targetX == null) return;

      sp.x += (sp._targetX - sp.x) * t;
      sp.y += (sp._targetY - sp.y) * t;
      if (sp._targetScale != null) {
        const s = sp.scale.x + (sp._targetScale - sp.scale.x) * t;
        sp.scale.set(s, s);
      }
    });
  }

  function Scene_RecollectionEntry() {
    this.initialize(...arguments);
  }
  Scene_RecollectionEntry.prototype = Object.create(Scene_Base.prototype);
  Scene_RecollectionEntry.prototype.constructor = Scene_RecollectionEntry;
  Scene_RecollectionEntry.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._phase = 0;
    this._fadeOpacity = 0;
  };

  Scene_RecollectionEntry.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    $gameSystem.saveBgm();
    this._fadeSprite = new ScreenSprite();
    this.addChild(this._fadeSprite);
  };

  Scene_RecollectionEntry.prototype.update = function () {
    Scene_Base.prototype.update.call(this);

    if (this._phase === 0) {
    } else if (this._phase === 1) {
    } else if (this._phase === 2) {
      if (this._syncFadeSprite && this._fadeInDuration > 0) {
        this._fadeSprite.opacity = this._fadeOpacity;
      }
      if (this._fadeInDuration <= 0) {
        if (this._fadeSprite && this._fadeSprite.parent) {
          this.removeChild(this._fadeSprite);
        }
        SceneManager.pop();
      }
    }
  };

  Scene_RecollectionEntry.prototype.startFadeIn = function (duration, white) {
    Scene_Base.prototype.startFadeIn.call(this, duration, white);
    if (this._fadeSprite) {
      this._fadeSprite.opacity = 255;
      this._syncFadeSprite = true;
    }
  };

  PluginManager.registerCommand("OnevASSISTANT", "CallRecollection", () => {
    const scene = SceneManager._scene;
    if (!scene) return;

    scene.startFadeOut(60, false);
    const _update = scene.update;
    scene.update = function () {
      _update.call(this);
      if (this._fadeDuration <= 0) SceneManager.push(Scene_Recollection);
    };
  });

  Scene_Recollection.prototype._isMouseOverSprite = function (sp) {
    if (!sp || !sp.bitmap || !sp.bitmap.isReady()) return false;
    const mx = TouchInput.x,
      my = TouchInput.y;
    const baseX = sp._baseX != null ? sp._baseX : sp.x;
    const baseY = sp._baseY != null ? sp._baseY : sp.y;
    const w = sp.bitmap.width * sp.scale.x;
    const h = sp.bitmap.height * sp.scale.y;
    return (
      mx >= baseX - w / 2 &&
      mx <= baseX + w / 2 &&
      my >= baseY - h / 2 &&
      my <= baseY + h / 2
    );
  };

  OnevASSISTANT.saveCurrentBgm = function () {
    const bgm = AudioManager._currentBgm;
    if (bgm && bgm.name) {
      OnevASSISTANT._savedBgm = {
        name: bgm.name,
        volume: bgm.volume,
        pitch: bgm.pitch,
        pan: bgm.pan,
      };
    } else {
      OnevASSISTANT._savedBgm = null;
    }
  };

  window.OnevASSISTANT.saveCurrentBgm = OnevASSISTANT.saveCurrentBgm;

  Scene_Recollection.prototype.start = function () {
    if (typeof window.ADMIN_clearCG === "function") {
      window.ADMIN_clearCG();
    }
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(30, false);

    if (this._focusTarget !== "choice") {
      this._focusTarget = "tab";
      const tabSprite = this._tabSprites[this._tabCursorIndex];
      const tabPage = tabSprite ? tabSprite._tabPage : 1;
      this._changePage(tabPage);

      if (this._choiceSprites.length > 0) {
        this._cursorIndex = 0;
        this._updateCursor(true);
        if (this._cursorSprite) this._cursorSprite.visible = false;
      } else {
        this._cursorIndex = -1;
        if (this._cursorSprite) this._cursorSprite.visible = false;
      }
    } else {
      if (
        this._choiceSprites.length > 0 &&
        this._cursorIndex >= 0 &&
        this._cursorIndex < this._choiceSprites.length
      ) {
        if (this._cursorSprite) {
          this._cursorSprite.visible = true;
          this.setChildIndex(this._cursorSprite, this.children.length - 1);
        }
        this._updateCursor(true);
      }
    }

    this._updateTabCursor();
  };

  Scene_Recollection.prototype._hideCancelConfirm = function () {
    this._cancelConfirmActive = false;

    if (this._focusTarget === "tab") {
      if (this._tabCursorSprite) this._tabCursorSprite.visible = true;
      if (Array.isArray(this._tabFrames)) {
        this._tabFrames.forEach((fr, i) => {
          if (fr) fr.visible = i === this._tabCursorIndex;
        });
      }
    } else {
      if (this._tabCursorSprite) this._tabCursorSprite.visible = false;
      if (Array.isArray(this._tabFrames)) {
        this._tabFrames.forEach((fr) => fr && (fr.visible = false));
      }
    }

    if (
      this._cursorSprite &&
      this._focusTarget === "choice" &&
      this._cursorIndex >= 0 &&
      this._cursorIndex < this._choiceSprites.length
    ) {
      this._cursorSprite.visible = true;
      this._updateCursor(true);
    }
    this._frames.forEach((fr, i) => {
      if (fr)
        fr.visible = this._focusTarget === "choice" && i === this._cursorIndex;
    });

    this._cancelConfirmSprites.forEach((s) => this.removeChild(s));
    this._cancelConfirmFrames.forEach((f) => f && this.removeChild(f));
    if (this._cancelBaseSprite) this.removeChild(this._cancelBaseSprite);

    this._cancelConfirmSprites = [];
    this._cancelConfirmFrames = [];
    this._cancelConfirmIndex = 0;
    this._cancelBaseSprite = null;
  };

  (function () {
    const _exitRec = Scene_Recollection.prototype.exitRecollection;
    Scene_Recollection.prototype.exitRecollection = function () {
      _exitRec.call(this);
      const fadeOutMs = 1000;
      setTimeout(() => {
        const prev = OnevASSISTANT._savedBgm;
        if (prev && prev.name) {
          OnevASSISTANT.crossFadeBgm({
            name: prev.name,
            volume: prev.volume,
            pitch: prev.pitch,
            pan: prev.pan,
            fadeTime: 1000,
          });
        }
      }, fadeOutMs);
    };

    //======================================================================
    // 背景の管理
    //======================================================================

    const raw = OnevASSISTANT.getPluginParameter(
      "OnevASSISTANT",
      "BackgroundSettings",
      "{}"
    );

    let backgroundSettings = [];
    let backgroundPictureId = 10;
    let fadingPictureId = 11;
    let queuedBackgroundChange = null;

    function normalizeBackgroundPictureParam(path) {
      if (!path) return "";
      let name = String(path).trim();
      if (!name) return "";
      name = name.replace(/\\/g, "/");
      name = name.replace(/^img\/(?:pictures|Pictures)\//, "");
      name = name.replace(/^\//, "");
      name = name.replace(/\.(png|jpg|jpeg|gif|bmp|webp)$/i, "");
      name = name
        .split("/")
        .filter((segment) => segment !== ".." && segment !== ".")
        .join("/");
      return name;
    }

    function resolveBackgroundPicturePath(timePic) {
      if (!timePic) return "";
      const candidates = [
        timePic.RelativePath,
        timePic.FilePath,
        timePic.FileNameWithFolder,
      ].filter((v) => typeof v === "string" && v.length > 0);

      for (const cand of candidates) {
        const normalized = normalizeBackgroundPictureParam(cand);
        if (normalized) {
          return normalized;
        }
      }

      if (typeof timePic.FileName === "string" && timePic.FileName.length > 0) {
        const base = normalizeBackgroundPictureParam(timePic.FileName);
        if (!base) {
          return "";
        }

        if (timePic.LegacyFolder !== false) {
          return "backgrounds/" + base;
        }

        return base;
      }

      return "";
    }

    try {
      const parsed = OnevASSISTANT.safeJsonParse(raw, {});

      if (parsed.PictureId1 != null)
        backgroundPictureId = Number(parsed.PictureId1);
      if (parsed.PictureId2 != null)
        fadingPictureId = Number(parsed.PictureId2);

      const list = OnevASSISTANT.parseDeep(parsed.Backgrounds || []);
      backgroundSettings = list.map((bg) => {
        const timePics = [];
        const addTimePicture = (timeKey, rawPath) => {
          if (!rawPath) return;
          const original = String(rawPath);
          const normalized = normalizeBackgroundPictureParam(original);
          if (!normalized) return;

          const entry = {
            Time: timeKey,
            FileName: normalized.split("/").pop(),
          };

          if (/[\\\/]/.test(original)) {
            entry.RelativePath = normalized;
            entry.LegacyFolder = false;
          } else {
            entry.LegacyFolder = true;
          }

          timePics.push(entry);
        };

        addTimePicture("morning", bg.MorningImage);
        addTimePicture("evening", bg.EveningImage);
        addTimePicture("night", bg.NightImage);

        return {
          Place: bg.Place,
          TimePictures: timePics,
        };
      });
    } catch (e) {
      console.error("背景設定の初期化中に予期せぬエラー:", e);
    }

    const timeOrder = ["morning", "evening", "night"];
    let currentPlace = null;
    let currentTime = "morning";
    let isPictureTransitioning = false;
    let nextTimeToSet = null;
    let nextPlaceToSet = null;

    window.ADMIN_changeBackground = function (
      place,
      time,
      ruleImage = null,
      duration = 60
    ) {
      time = time || currentTime || "morning";

      const isFast =
        Graphics && Graphics._fpsMeter && Graphics._fpsMeter._isRunning;
      const instant =
        isFast ||
        (SceneManager &&
          SceneManager.isFastForward &&
          SceneManager.isFastForward());

      if (isPictureTransitioning) {
        queuedBackgroundChange = { place, time, ruleImage, duration };
        return;
      }
      const bg = backgroundSettings.find((bg) => bg.Place === place);
      if (!bg) {
        console.warn("場所が見つかりません:", place);
        return;
      }
      const timePic = bg.TimePictures.find((tp) => tp.Time === time);
      if (!timePic) {
        console.warn("時間帯データが見つかりません:", time);
        return;
      }

      if (isPictureTransitioning) {
        queuedBackgroundChange = { place, time, ruleImage, duration };
        return;
      }

      const fileName = resolveBackgroundPicturePath(timePic);
      if (!fileName) {
        console.warn("背景画像パスが無効です:", timePic);
        return;
      }

      nextPlaceToSet = place;
      nextTimeToSet = time;

      if (instant) {
        currentPlace = place;
        currentTime = time;
        nextPlaceToSet = null;
        nextTimeToSet = null;
        $gameScreen.showPicture(
          backgroundPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.showPicture(
          fadingPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.erasePicture(backgroundPictureId);
        try {
          const scene = SceneManager._scene;
          if (scene && scene._onevFadeLayer) {
            scene._onevFadeLayer.visible = true;
          }
        } catch (e) {}
        isPictureTransitioning = false;
        return;
      }

      isPictureTransitioning = true;

      if (ruleImage) {
        ADMIN_performRuleTransition(fileName, ruleImage, duration, true, "out");
      } else {
        $gameScreen.showPicture(
          backgroundPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.movePicture(
          fadingPictureId,
          0,
          0,
          0,
          100,
          100,
          0,
          0,
          duration
        );
      }
    };

    window.ADMIN_advanceTime = function (ruleImage = null, duration = 60) {
      console.log("[時間経過] 実行:", {
        現在時間: currentTime,
        現在場所: currentPlace,
        トランジション中: isPictureTransitioning,
        マップID: $gameMap ? $gameMap.mapId() : "不明",
        マップ名: $dataMapInfos && $gameMap ? $dataMapInfos[$gameMap.mapId()]?.name : "不明"
      });

      if (isPictureTransitioning) {
        console.log("[時間経過] トランジョン中のためキューに追加");
        queuedBackgroundChange = {
          isAdvanceTime: true,
          place: null,
          time: null,
          ruleImage,
          duration,
        };
        return;
      }

      const bg = backgroundSettings.find((bg) => bg.Place === currentPlace);
      if (!bg) return;
      const nextTime = getNextValidTime(bg, currentTime);
      if (!nextTime) return;
      const timePic = bg.TimePictures.find((tp) => tp.Time === nextTime);
      if (!timePic) return;
      const fileName = resolveBackgroundPicturePath(timePic);
      if (!fileName) return;

      console.log("[時間経過] 次の時間帯:", {
        次の時間: nextTime,
        画像ファイル: fileName
      });

      isPictureTransitioning = true;
      nextTimeToSet = nextTime;

      const isFast =
        Graphics && Graphics._fpsMeter && Graphics._fpsMeter._isRunning;
      const instant =
        isFast ||
        (SceneManager &&
          SceneManager.isFastForward &&
          SceneManager.isFastForward());

      if (instant) {
        $gameScreen.showPicture(
          backgroundPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.showPicture(
          fadingPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.erasePicture(backgroundPictureId);
        currentTime = nextTime;
        isPictureTransitioning = false;
        nextTimeToSet = null;
        console.log("[時間経過] 完了(instant) - 現在時間:", currentTime);
        return;
      }

      if (ruleImage) {
        ADMIN_performRuleTransition(fileName, ruleImage, duration, true, "out");
      } else {
        $gameScreen.showPicture(
          backgroundPictureId,
          fileName,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.movePicture(
          fadingPictureId,
          0,
          0,
          0,
          100,
          100,
          0,
          0,
          duration
        );
      }
    };

    function getNextValidTime(bgData, current) {
      let index = timeOrder.indexOf(current);
      if (index === -1) return null;
      const total = timeOrder.length;
      for (let i = 1; i <= total; i++) {
        const nextTime = timeOrder[(index + i) % total];
        if (bgData.TimePictures.find((tp) => tp.Time === nextTime)) {
          return nextTime;
        }
      }
      return null;
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
      _Scene_Map_update.call(this);

      if (isPictureTransitioning) {
        const pic = $gameScreen.picture(fadingPictureId);
        const bgPic = $gameScreen.picture(backgroundPictureId);

        if (!pic || pic.opacity() <= 0) {
          isPictureTransitioning = false;
          const timeToSet = nextTimeToSet;
          const placeToSet = nextPlaceToSet;
          nextTimeToSet = null;
          nextPlaceToSet = null;

          if (bgPic) {
            const fileName = bgPic._name;
            $gameScreen.showPicture(
              fadingPictureId,
              fileName,
              0,
              0,
              0,
              100,
              100,
              255,
              0
            );
          }
          $gameScreen.erasePicture(backgroundPictureId);

          if (placeToSet !== null) currentPlace = placeToSet;
          if (timeToSet !== null) currentTime = timeToSet;

          console.log("[背景トランジション] 完了:", {
            現在場所: currentPlace,
            現在時間: currentTime
          });

          if (queuedBackgroundChange) {
            const q = queuedBackgroundChange;
            queuedBackgroundChange = null;

            if (q.isAdvanceTime) {
              console.log("[キュー] 時間経過を実行");
              window.ADMIN_advanceTime(q.ruleImage, q.duration);
            } else {
              console.log("[キュー] 背景変更を実行");
              const time = q.time || currentTime;
              window.ADMIN_changeBackground(
                q.place,
                time,
                q.ruleImage,
                q.duration
              );
            }
          }
        } else {
        }
      }
    };

    window.ADMIN_currentTime = () => currentTime;
    window.ADMIN_performRuleTransition = function (
      nextImagePath,
      ruleImageName,
      duration = 60,
      applyTimeChange = false,
      type = "out"
    ) {
      const isFast =
        Graphics && Graphics._fpsMeter && Graphics._fpsMeter._isRunning;
      const instant =
        isFast ||
        (SceneManager &&
          SceneManager.isFastForward &&
          SceneManager.isFastForward());

      if (instant) {
        $gameScreen.showPicture(
          fadingPictureId,
          nextImagePath,
          0,
          0,
          0,
          100,
          100,
          255,
          0
        );
        $gameScreen.erasePicture(backgroundPictureId);
        isPictureTransitioning = false;
        if (applyTimeChange) {
          currentTime = nextTimeToSet;
        }
        nextTimeToSet = null;
        if (queuedBackgroundChange) {
          const q = queuedBackgroundChange;
          queuedBackgroundChange = null;
          const time = q.time || currentTime;
          window.ADMIN_changeBackground(q.place, time, q.ruleImage, q.duration);
        }
        return;
      }

      const newBitmap = ImageManager.loadPicture(nextImagePath);
      const ruleBitmap = ImageManager.loadBitmap("img/system/", ruleImageName);
      const oldPic = $gameScreen.picture(fadingPictureId);
      const oldBitmap =
        oldPic && oldPic.name()
          ? ImageManager.loadPicture(oldPic.name())
          : new Bitmap(Graphics.width, Graphics.height);

      function waitUntilReady(callback) {
        if (
          newBitmap.isReady() &&
          ruleBitmap.isReady() &&
          oldBitmap.isReady()
        ) {
          callback();
        } else {
          setTimeout(() => waitUntilReady(callback), 10);
        }
      }

      waitUntilReady(() => {
        const stage = SceneManager._scene._spriteset;
        if (!stage) return;

        const container = new Sprite();
        const newSprite = new Sprite(newBitmap);
        const oldSprite = new Sprite(oldBitmap);
        const maskSprite = new Sprite(ruleBitmap);
        maskSprite.width = Graphics.width;
        maskSprite.height = Graphics.height;
        const isFadeOut = type === "out";
        const fragmentShader = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform sampler2D back;
        uniform sampler2D mask;
        uniform float  progress;
        uniform int    isFadeOut;
        uniform int    invertMask;
        void main(void){
            float m = texture2D(mask, vTextureCoord).r;
            if (invertMask == 1) m = 1.0 - m;
            float f = step(m, progress);
            float alpha = isFadeOut == 1 ? f : (1.0 - f);
            vec4 oldColor = texture2D(back,      vTextureCoord);
            vec4 newColor = texture2D(uSampler,  vTextureCoord);

            gl_FragColor = mix(oldColor, newColor, alpha);
        }
        `;

        const filter = new PIXI.Filter(undefined, fragmentShader, {
          back: oldSprite.texture,
          mask: maskSprite.texture,
          progress: 0,
          isFadeOut: type === "out" ? 1 : 0,
          invertMask: 0,
        });

        newSprite.filters = [filter];
        container.addChild(oldSprite);
        container.addChild(newSprite);
        const transitionLayer = new Sprite();
        transitionLayer.z = 0;
        const pictureContainer =
          SceneManager._scene._spriteset._pictureContainer;

        let insertIndex = pictureContainer.children.length;
        for (let i = 0; i < pictureContainer.children.length; i++) {
          const sprite = pictureContainer.children[i];
          if (sprite._pictureId === fadingPictureId) {
            insertIndex = i + 1;
            break;
          }
        }

        pictureContainer.addChild(transitionLayer);
        transitionLayer.addChild(container);

        isPictureTransitioning = true;
        let frame = 0;
        function updateTransition() {
          filter.uniforms.progress = ++frame / duration;
          if (frame >= duration) {
            if (transitionLayer.parent) {
              transitionLayer.parent.removeChild(transitionLayer);
            }

            $gameScreen.showPicture(
              fadingPictureId,
              nextImagePath,
              0,
              0,
              0,
              100,
              100,
              255,
              0
            );
            $gameScreen.erasePicture(backgroundPictureId);
            isPictureTransitioning = false;

            if (applyTimeChange) {
              currentTime = nextTimeToSet;
            }
            nextTimeToSet = null;

            if (queuedBackgroundChange) {
              const q = queuedBackgroundChange;
              queuedBackgroundChange = null;
              const time = q.time || currentTime;
              window.ADMIN_changeBackground(
                q.place,
                time,
                q.ruleImage,
                q.duration
              );
            }
          } else {
            requestAnimationFrame(updateTransition);
          }
        }
        requestAnimationFrame(updateTransition);
      });
    };

    PluginManager.registerCommand("OnevASSISTANT", "背景処理", (args) => {
      const mode = args.mode;
      const place = args.place;
      const jpTime = args.time;
      const ruleImage = args.ruleImage;
      const duration = Number(args.duration || 60);
      const wait = Number(args.duration || 60);

      const m = { 朝: "morning", 夕方: "evening", 夜: "night" };
      const time =
        jpTime === "なし" || !jpTime
          ? window.ADMIN_currentTime
            ? window.ADMIN_currentTime()
            : "morning"
          : m[jpTime] || jpTime;

      if (mode === "背景呼出" && place && time) {
        window.ADMIN_changeBackground(place, time, ruleImage, duration);
      } else if (mode === "背景変更" && place) {
        const nowTime = window.ADMIN_currentTime
          ? window.ADMIN_currentTime()
          : "morning";
        const safeTime =
          jpTime === "なし" || !jpTime ? nowTime : m[jpTime] || jpTime;
        window.ADMIN_changeBackground(place, safeTime, ruleImage, duration);
      } else if (mode === "時間経過") {
        window.ADMIN_advanceTime &&
          window.ADMIN_advanceTime(ruleImage, duration);
      } else if (mode === "背景消去") {
        $gameScreen.erasePicture(backgroundPictureId);
        $gameScreen.erasePicture(fadingPictureId);
        isPictureTransitioning = false;
        queuedBackgroundChange = null;
        window.ADMIN_clearBackgroundFilter();
      }
    });

    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
      _Sprite_Picture_update.call(this);
      const bgIds = [backgroundPictureId, fadingPictureId];
      if (bgIds.includes(this._pictureId)) {
        this.z = 0;
      } else {
        this.z = 10;
      }
    };

    function getBackgroundPictureSprites() {
      const scene = SceneManager._scene;
      if (!scene || !scene._spriteset || !scene._spriteset._pictureContainer)
        return [];

      const pictureContainer = scene._spriteset._pictureContainer;
      const bgIds = [backgroundPictureId, fadingPictureId];
      const backgroundSprites = [];

      for (const child of pictureContainer.children) {
        if (child._pictureId && bgIds.includes(child._pictureId)) {
          backgroundSprites.push(child);
        }
      }

      return backgroundSprites;
    }

    window.ADMIN_setBackgroundFilter = function (hexColor, opacity) {
      const backgroundSprites = getBackgroundPictureSprites();
      if (backgroundSprites.length === 0) return;

      const color = parseInt(hexColor.replace(/^#/, ""), 16);
      const alpha = Math.max(0, Math.min(opacity, 255)) / 255;
      const r = ((color >> 16) & 0xff) / 255;
      const g = ((color >> 8) & 0xff) / 255;
      const b = (color & 0xff) / 255;

      backgroundSprites.forEach((sprite) => {
        if (!sprite.filters) {
          sprite.filters = [];
        }

        sprite.filters = sprite.filters.filter(
          (filter) => !filter._isBackgroundFilter
        );

        const colorFilter = new PIXI.filters.ColorMatrixFilter();

        if (alpha > 0) {
          colorFilter.matrix = [
            1 - alpha + r * alpha,
            0,
            0,
            0,
            0,
            0,
            1 - alpha + g * alpha,
            0,
            0,
            0,
            0,
            0,
            1 - alpha + b * alpha,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
          ];

          colorFilter._isBackgroundFilter = true;
          sprite.filters.push(colorFilter);
        }
      });
    };

    window.ADMIN_clearBackgroundFilter = function () {
      const backgroundSprites = getBackgroundPictureSprites();

      backgroundSprites.forEach((sprite) => {
        if (sprite.filters) {
          sprite.filters = sprite.filters.filter(
            (filter) => !filter._isBackgroundFilter
          );

          if (sprite.filters.length === 0) {
            sprite.filters = null;
          }
        }
      });
    };

    PluginManager.registerCommand(
      "OnevASSISTANT",
      "背景フィルター制御",
      (args) => {
        const action = args.action;

        if (action === "適用") {
          const rawColor = (args.color || "").trim();
          if (/^(reset|リセット)$/i.test(rawColor)) {
            window.ADMIN_clearBackgroundFilter();
            return;
          }
          const color = rawColor || "#000000";
          const opacity = Number(args.opacity || 0);
          window.ADMIN_setBackgroundFilter(color, opacity);
        } else if (action === "解除") {
          window.ADMIN_clearBackgroundFilter();
        }
      }
    );
  })();

  //======================================================================
  // CG変遷管理
  //======================================================================

  const cgorigin = 0;
  const cgposX = 0;
  const cgposY = 0;
  let currentCgLabel = null;
  let currentCgIndex = 0;
  let nextCgIndex = null;
  let isCgTransitioning = false;
  let queuedCgChange = null;
  const raw = getPluginParameter("OnevASSISTANT", "CgGroupConfig", "{}");
  const pluginParams_cg = PluginManager.parameters("OnevASSISTANT");
  const GLOBAL_FADE_VAR_ID_cg = Number(
    pluginParams_cg["FadeTimeVariableId"] || 0
  );
  let cgSettings = [];

  try {
    const g = parseDeep(safeJsonParse(raw, {}));
    const picId1 = Number(g.PictureId1 || 21);
    const picId2 = Number(g.PictureId2 || 22);
    let scenes = Array.isArray(g.Scenes)
      ? g.Scenes
      : parseDeep(safeJsonParse(g.Scenes || "[]"));

    scenes.forEach((scene) => {
      let imgs = Array.isArray(scene.Images)
        ? scene.Images
        : parseDeep(safeJsonParse(scene.Images || "[]"));

      if (imgs.length === 0) return;

      const mainImage = imgs[0].FileName || "";
      const variations = imgs.length > 1 ? imgs.filter((_, i) => i > 0) : [];

      cgSettings.push({
        Label: scene.Label,
        PictureId1: picId1,
        PictureId2: picId2,
        MainImage: mainImage,
        Variations: variations,
      });
    });
  } catch (e) {
    console.error("CG設定の初期化エラー:", e);
  }

  function getCgVariations(cg) {
    const list = [];
    if (cg.MainImage) list.push(cg.MainImage);

    (cg.Variations || []).forEach((v) => {
      if (typeof v === "string") {
        list.push(v);
      } else if (v && v.FileName) {
        list.push(v.FileName);
      }
    });
    return list;
  }

  function getFadeDuration(cg, fallbackDuration) {

    if (isMessageSkipping()) return 1;
    if (GLOBAL_FADE_VAR_ID_cg > 0) {
      const v = Number($gameVariables.value(GLOBAL_FADE_VAR_ID_cg));
      return Math.max(1, v || fallbackDuration);
    }
    return Math.max(1, fallbackDuration);
  }

  window.ADMIN_performCGTransition = function (
    nextImagePath,
    ruleImageName,
    duration = 60,
    type = "out",
    cgConfig
  ) {
    const idOld = cgConfig.PictureId1;
    const idNew = cgConfig.PictureId2;
    const newBitmap = ImageManager.loadPicture(nextImagePath);
    const ruleBitmap = ImageManager.loadBitmap("img/system/", ruleImageName);
    const oldPic = $gameScreen.picture(idNew);
    const oldBitmap =
      oldPic && oldPic.name()
        ? ImageManager.loadPicture(oldPic.name())
        : new Bitmap(Graphics.width, Graphics.height);

    const waitUntilReady = (cb) =>
      newBitmap.isReady() && ruleBitmap.isReady() && oldBitmap.isReady()
        ? cb()
        : setTimeout(() => waitUntilReady(cb), 10);

    waitUntilReady(() => {
      const picCont = SceneManager._scene?._spriteset?._pictureContainer;
      if (!picCont) return;

      const container = new Sprite();
      const newSprite = new Sprite(newBitmap);
      const oldSprite = new Sprite(oldBitmap);
      const maskSprite = new Sprite(ruleBitmap);
      maskSprite.width = Graphics.width;
      maskSprite.height = Graphics.height;

      const shader = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform sampler2D back;
        uniform sampler2D mask;
        uniform float progress;
        void main(void){
          float m = texture2D(mask, vTextureCoord).r;
          float f = smoothstep(progress-0.05, progress+0.05, m);
          float t = ${type === "out" ? "f" : "1.0 - f"};
          vec4 fromCol = texture2D(back, vTextureCoord);
          vec4 toCol   = texture2D(uSampler, vTextureCoord);
          vec4 outCol  = mix(fromCol, toCol, t);
          gl_FragColor = outCol;
        }`;

      const filter = new PIXI.Filter(undefined, shader, {
        back: oldSprite.texture,
        mask: maskSprite.texture,
        progress: 0,
      });

      newSprite.filters = [filter];
      container.addChild(oldSprite);
      container.addChild(newSprite);

      const transitionLayer = new Sprite();
      picCont.addChild(transitionLayer);
      transitionLayer.addChild(container);

      isCgTransitioning = true;
      let frame = 0;
      const step = () => {
        filter.uniforms.progress = ++frame / duration;
        if (frame >= duration) {
          transitionLayer.parent.removeChild(transitionLayer);
          $gameScreen.showPicture(
            idNew,
            nextImagePath,
            cgorigin,
            cgposX,
            cgposY,
            100,
            100,
            255,
            0
          );
          $gameScreen.erasePicture(idOld);
          isCgTransitioning = false;
        } else {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    });
  };

  window.ADMIN_displayCgFade = function (label, idx, fallbackDu) {
    const cg = cgSettings.find((c) => c.Label === label);
    if (!cg) {
      console.warn("CGラベルが見つかりません:", label);
      return;
    }

    const du = Math.max(1, getFadeDuration(cg, fallbackDu));
    const list = getCgVariations(cg);
    const target =
      idx !== null ? Math.min(Math.max(idx, 0), list.length - 1) : 0;
    const fileName = list[target];
    currentCgLabel = label;
    currentCgIndex = target;
    nextCgIndex = target;
    const idB = cg.PictureId1;
    const idF = cg.PictureId2;
    const prevPic = $gameScreen.picture(idB);
    const hasPrev = prevPic && prevPic.name();

    if (!hasPrev) {
      $gameScreen.showPicture(
        idB,
        fileName,
        cgorigin,
        cgposX,
        cgposY,
        100,
        100,
        0,
        0
      );
      isCgTransitioning = true;
      $gameScreen.movePicture(
        idB,
        cgorigin,
        cgposX,
        cgposY,
        100,
        100,
        255,
        0,
        du
      );

      const fallbackTimer = setTimeout(() => {
        if (isCgTransitioning) {
          isCgTransitioning = false;
          flushCgQueue();
        }
      }, (du + 10) * 16.67);

      waitPictures([idB], () => {
        clearTimeout(fallbackTimer);
        isCgTransitioning = false;
        flushCgQueue();
      });
      return;
    }

    const prevName = prevPic.name();
    $gameScreen.showPicture(
      idF,
      prevName,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      255,
      0
    );

    $gameScreen.showPicture(
      idB,
      fileName,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      255,
      0
    );

    isCgTransitioning = true;
    $gameScreen.movePicture(idF, cgorigin, cgposX, cgposY, 100, 100, 0, 0, du);

    const fallbackTimer = setTimeout(() => {
      if (isCgTransitioning) {
        $gameScreen.erasePicture(idF);
        isCgTransitioning = false;
        flushCgQueue();
      }
    }, (du + 10) * 16.67);

    waitPictures([idF], () => {
      clearTimeout(fallbackTimer);
      $gameScreen.erasePicture(idF);
      isCgTransitioning = false;
      flushCgQueue();
    });
  };

  window.ADMIN_changeCG = function (
    label,
    index = null,
    ruleImage = null,
    fallbackDu = 60
  ) {
    const cg = cgSettings.find((c) => c.Label === label);
    if (!cg) {
      console.warn("CGラベルが見つかりません:", label);
      return;
    }

    const duration = getFadeDuration(cg, fallbackDu);

    if (isCgTransitioning) {
      queuedCgChanges.push({
        mode: "進行",
        label,
        index,
        ruleImage,
        duration,
      });
      return;
    }

    const list = getCgVariations(cg);
    let target = 0;
    if (index === null) {
      if (currentCgLabel === label) {
        target = Math.min(currentCgIndex + 1, list.length - 1);
      }
    } else {
      target = Math.max(0, Math.min(Number(index), list.length - 1));
    }

    currentCgLabel = label;
    currentCgIndex = target;
    nextCgIndex = target;

    const fileName = list[target];
    const idB = cg.PictureId1;
    const idF = cg.PictureId2;

    if (ruleImage) {
      isCgTransitioning = true;
      ADMIN_performCGTransition(fileName, ruleImage, duration, "in", cg);

      const fallbackTimer = setTimeout(() => {
        if (isCgTransitioning) {
          isCgTransitioning = false;
          flushCgQueue();
        }
      }, (duration + 10) * 16.67);

      waitPictures([idB], () => {
        clearTimeout(fallbackTimer);
        isCgTransitioning = false;
        flushCgQueue();
      });
      return;
    }

    const prevPic = $gameScreen.picture(idB);
    const prevName = prevPic && prevPic.name() ? prevPic.name() : fileName;

    $gameScreen.showPicture(
      idF,
      prevName,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      255,
      0
    );

    $gameScreen.showPicture(
      idB,
      fileName,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      255,
      0
    );

    isCgTransitioning = true;
    $gameScreen.movePicture(
      idF,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      0,
      0,
      duration
    );

    const fallbackTimer = setTimeout(() => {
      if (isCgTransitioning) {
        $gameScreen.erasePicture(idF);
        isCgTransitioning = false;
        flushCgQueue();
      }
    }, (duration + 10) * 16.67);

    waitPictures([idF], () => {
      clearTimeout(fallbackTimer);
      $gameScreen.erasePicture(idF);
      isCgTransitioning = false;
      flushCgQueue();
    });
  };

  window.ADMIN_advanceCG = function (ruleImage = null, fallbackDu = 60) {
    const cg = cgSettings.find((c) => c.Label === currentCgLabel);
    if (!cg) return;

    const duration = getFadeDuration(cg, fallbackDu);

    if (isCgTransitioning) {
      queuedCgChanges.push({
        mode: "進行",
        label: currentCgLabel,
        index: null,
        ruleImage,
        duration,
      });
      return;
    }

    const variations = getCgVariations(cg);
    let next = currentCgIndex + 1;
    if (next >= variations.length) {
      next = variations.length - 1;
    }

    window.ADMIN_changeCG(currentCgLabel, next, ruleImage, duration);
  };

  window.ADMIN_clearCG = function (label, ruleImage = null) {
    const cg = cgSettings.find((c) => c.Label === (label || currentCgLabel));
    if (!cg) return;

    const duration = getFadeDuration(cg, 0);
    const idB = cg.PictureId1;
    const idF = cg.PictureId2;

    const pic = $gameScreen.picture(idB);
    if (!pic || !pic.name()) {
      $gameScreen.erasePicture(idB);
      $gameScreen.erasePicture(idF);
      isCgTransitioning = false;
      queuedCgChanges = [];
      return;
    }

    if (ruleImage) {
      isCgTransitioning = true;
      const fileName = pic.name();
      ADMIN_performCGTransition(fileName, ruleImage, duration, "out", cg);

      const fallbackTimer = setTimeout(() => {
        if (isCgTransitioning) {
          isCgTransitioning = false;
          flushCgQueue();
        }
      }, (duration + 10) * 16.67);

      waitPictures([idB], () => {
        clearTimeout(fallbackTimer);
        isCgTransitioning = false;
        flushCgQueue();
      });
      return;
    }

    isCgTransitioning = true;
    $gameScreen.movePicture(
      idB,
      cgorigin,
      cgposX,
      cgposY,
      100,
      100,
      0,
      0,
      duration
    );

    const fallbackTimer = setTimeout(() => {
      if (isCgTransitioning) {
        $gameScreen.erasePicture(idB);
        $gameScreen.erasePicture(idF);
        isCgTransitioning = false;
        flushCgQueue();
      }
    }, (duration + 10) * 16.67);

    waitPictures([idB], () => {
      clearTimeout(fallbackTimer);
      $gameScreen.erasePicture(idB);
      $gameScreen.erasePicture(idF);
      isCgTransitioning = false;
      flushCgQueue();
    });
  };

  PluginManager.registerCommand("OnevASSISTANT", "CG処理", (args) => {
    const mode = args.mode;
    const idx = args.index === "" ? null : Number(args.index);
    const rule = args.ruleImage || null;
    const label = args.label && args.label !== "" ? args.label : currentCgLabel;

    const cg = cgSettings.find((c) => c.Label === label);
    if (!cg) {
      console.warn("CGラベルが見つかりません:", label);
      return;
    }

    const du = getFadeDuration(cg, 0);

    const cmd = {
      mode,
      label,
      index: idx,
      ruleImage: rule,
      duration: du,
    };

    if (isCgTransitioning) {
      queuedCgChanges.push(cmd);
    } else {
      invokeCGCommand(cmd);
    }
  });

  function invokeCGCommand(cmd) {
    switch (cmd.mode) {
      case "呼出":
        window.ADMIN_displayCgFade(cmd.label, cmd.index, cmd.duration);
        break;
      case "進行":
      case "進行(Variation)":
        if (cmd.index !== null) {
          window.ADMIN_changeCG(
            cmd.label,
            cmd.index,
            cmd.ruleImage,
            cmd.duration
          );
        } else {
          window.ADMIN_advanceCG(cmd.ruleImage, cmd.duration);
        }
        break;
      case "消去":
        window.ADMIN_clearCG(cmd.label);
        break;
    }
  }
  const _Scene_Map_update_cgTransition = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update_cgTransition.call(this);

    if (!isCgTransitioning && queuedCgChange) {
      const cmd = queuedCgChange;
      queuedCgChange = null;
      invokeCGCommand(cmd);
    }
  };

  const _Sprite_Picture_update = Sprite_Picture.prototype.update;
  Sprite_Picture.prototype.update = function () {
    _Sprite_Picture_update.call(this);
    const ids = cgSettings.flatMap((c) => [c.PictureId1, c.PictureId2]);
    this.z = ids.includes(this._pictureId) ? 0 : 5;
  };

  function waitPictures(ids, onFinish) {
    const allDone = () =>
      ids.every((id) => {
        const pic = $gameScreen.picture(id);
        if (!pic) return true;

        if (pic._time !== undefined && pic._easingX) {
          return pic._time >= pic._duration;
        } else {
          return pic._duration <= 0;
        }
      });
    const loop = () => (allDone() ? onFinish?.() : requestAnimationFrame(loop));
    loop();
  }

  let queuedCgChanges = [];

  function flushCgQueue() {
    if (isCgTransitioning || !queuedCgChanges.length) return;
    const cmd = queuedCgChanges.shift();
    invokeCGCommand(cmd);
  }

  window.ADMIN_forceClearAllCGPictures = function () {
    cgSettings.forEach((cg) => {
      $gameScreen.erasePicture(cg.PictureId1);
      $gameScreen.erasePicture(cg.PictureId2);
    });
    currentCgLabel = null;
    currentCgIndex = 0;
    nextCgIndex = null;
    isCgTransitioning = false;
    queuedCgChanges = [];
  };

  //========================================================================================================
  //マスク処理
  //========================================================================================================

  window.Onev_MaskSettings = window.Onev_MaskSettings || [];
  PluginManager.registerCommand(PLUGIN_NAME, "ピクチャにマスク適用", (args) => {
    const targetId = Number(args.pictureId);
    const maskId = Number(args.maskPictureId);
    const maskImage = args.maskImage;

    const exists = Onev_MaskSettings.some(
      (m) => m.targetId === targetId && m.maskId === maskId
    );
    if (!exists) Onev_MaskSettings.push({ targetId, maskId, maskImage });

    applyPictureMask(targetId, maskId, maskImage);
  });

  function applyPictureMask(targetId, maskId, maskImage) {
    const scene = SceneManager._scene;
    const container =
      scene && scene._spriteset && scene._spriteset._pictureContainer;
    if (!container) return;

    const targetSprite = container.children.find(
      (sp) => sp._pictureId === targetId
    );
    if (!targetSprite) {
      return;
    }

    if (!$gameScreen.picture(maskId)) {
      const targetPic = $gameScreen.picture(targetId);
      if (!targetPic) return;

      $gameScreen.showPicture(
        maskId,
        maskImage,
        targetPic.origin(),
        targetPic.x(),
        targetPic.y(),
        targetPic.scaleX(),
        targetPic.scaleY(),
        targetPic.opacity(),
        targetPic.blendMode()
      );
    }

    let tries = 0;
    const maxTries = 20;

    function tryApplyMask() {
      const maskSprite = container.children.find(
        (sp) => sp._pictureId === maskId
      );
      const targetSprite = container.children.find(
        (sp) => sp._pictureId === targetId
      );

      if (maskSprite && targetSprite) {
        maskSprite.anchor.set(targetSprite.anchor.x, targetSprite.anchor.y);
        maskSprite.x = targetSprite.x;
        maskSprite.y = targetSprite.y;
        maskSprite.scale.set(targetSprite.scale.x, targetSprite.scale.y);
        targetSprite.mask = maskSprite;
      } else if (tries < maxTries) {
        tries++;
        requestAnimationFrame(tryApplyMask);
      }
    }

    requestAnimationFrame(tryApplyMask);
  }

  PluginManager.registerCommand(PLUGIN_NAME, "ピクチャのマスク解除", (args) => {
    const targetId = Number(args.pictureId);
    const eraseMaskPicture = args.eraseMaskPicture !== "false";

    if (targetId === -1) {
      removeAllPictureMasks(eraseMaskPicture);
    } else {
      removePictureMask(targetId, eraseMaskPicture);
    }
  });

  function removeAllPictureMasks(eraseMaskPicture = true) {
    const scene = SceneManager._scene;
    const container =
      scene && scene._spriteset && scene._spriteset._pictureContainer;

    const allMasks = [...Onev_MaskSettings];

    for (const maskSetting of allMasks) {
      const targetId = maskSetting.targetId;
      const maskId = maskSetting.maskId;

      if (container) {
        const targetSprite = container.children.find(
          (sp) => sp._pictureId === targetId
        );
        const maskSprite = container.children.find(
          (sp) => sp._pictureId === maskId
        );
        if (targetSprite) {
          targetSprite.mask = null;
        }
        if (maskSprite) {
          maskSprite.visible = false;
        }
      }

      if (eraseMaskPicture && $gameScreen.picture(maskId)) {
        $gameScreen.erasePicture(maskId);
      }
    }

    Onev_MaskSettings.length = 0;
  }

  window.removeAllPictureMasks = removeAllPictureMasks;

  function removePictureMask(targetId, eraseMaskPicture = true) {
    const scene = SceneManager._scene;
    const container =
      scene && scene._spriteset && scene._spriteset._pictureContainer;

    const maskSettingIndex = Onev_MaskSettings.findIndex(
      (m) => m.targetId === targetId
    );

    if (maskSettingIndex === -1) {
      return;
    }

    const maskSetting = Onev_MaskSettings[maskSettingIndex];
    const maskId = maskSetting.maskId;

    if (container) {
      const targetSprite = container.children.find(
        (sp) => sp._pictureId === targetId
      );
      const maskSprite = container.children.find(
        (sp) => sp._pictureId === maskId
      );
      if (targetSprite) {
        targetSprite.mask = null;
      }
      if (maskSprite) {
        maskSprite.visible = false;
      }
    }

    if (eraseMaskPicture && $gameScreen.picture(maskId)) {
      $gameScreen.erasePicture(maskId);
    }

    Onev_MaskSettings.splice(maskSettingIndex, 1);
  }

  window.removePictureMask = removePictureMask;

  //======================================================================
  // フェード制御
  //======================================================================

  const pluginParams_fade = PluginManager.parameters("OnevASSISTANT");
  const GLOBAL_FADE_VAR_ID_fade = Number(
    pluginParams_fade["FadeTimeVariableId"] || 0
  );
  function getGlobalFadeDuration(fallback) {
    if (GLOBAL_FADE_VAR_ID_fade > 0) {
      const v = Number($gameVariables.value(GLOBAL_FADE_VAR_ID_fade));
      return v > 0 ? v : fallback;
    }
    return fallback;
  }

  let _prevRuleFadeLayer = null;
  let isScreenFading = false;
  let isScreenFadedOut = false;
  let queuedScreenFade = null;
  let _originalIsFastForward = null;
  let _globalFadeOverlay = null;
  let _suppressGlobalOverlay = false;
  let _domFadeOverlayEl = null;

  window.OnevASSISTANT = window.OnevASSISTANT || {};
  OnevASSISTANT.isRuleFading = function() {
    return isScreenFading || OnevASSISTANT._waitingForRuleFadeTransfer;
  };
  OnevASSISTANT.isScreenFadedOut = function() {
    return isScreenFadedOut;
  };
  OnevASSISTANT.forceResetFade = function() {
    isScreenFading = false;
    isScreenFadedOut = false;
    OnevASSISTANT._pendingRuleFadeTransfer = false;
    OnevASSISTANT._waitingForRuleFadeTransfer = false;
    if (_prevRuleFadeLayer && _prevRuleFadeLayer.parent) {
      _prevRuleFadeLayer.parent.removeChild(_prevRuleFadeLayer);
    }
    _prevRuleFadeLayer = null;
  };
  OnevASSISTANT._pendingRuleFadeTransfer = false;
  OnevASSISTANT._waitingForRuleFadeTransfer = false;

  function ensureGlobalFadeOverlay(fadeColor) {
    if (_suppressGlobalOverlay) return;
    try {
      const app = Graphics && (Graphics.app || Graphics._app);
      if (!app || !app.stage) return;

      if (_globalFadeOverlay && _globalFadeOverlay.parent === app.stage) {
        app.stage.addChild(_globalFadeOverlay);
        const sp = _globalFadeOverlay.children[0];
        if (sp) {
          sp.width = Graphics.width;
          sp.height = Graphics.height;
          sp.tint = PIXI.utils.string2hex(fadeColor || "#000000");
          sp.alpha = 1.0;
        }
        return;
      }

      _globalFadeOverlay = new PIXI.Container();
      const black = new PIXI.Sprite(PIXI.Texture.WHITE);
      black.width = Graphics.width;
      black.height = Graphics.height;
      black.tint = PIXI.utils.string2hex(fadeColor || "#000000");
      black.alpha = 1.0;
      _globalFadeOverlay.addChild(black);
      app.stage.addChild(_globalFadeOverlay);
    } catch (e) {}
  }

  function removeGlobalFadeOverlay() {
    try {
      if (_globalFadeOverlay && _globalFadeOverlay.parent) {
        _globalFadeOverlay.parent.removeChild(_globalFadeOverlay);
      }
    } finally {
      _globalFadeOverlay = null;
    }
  }

  function ensureDomFadeOverlay(fadeColor) {
    try {
      if (!_domFadeOverlayEl) {
        const el = document.createElement("div");
        el.id = "onev-global-fade";
        el.style.position = "fixed";
        el.style.left = "0";
        el.style.top = "0";
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.pointerEvents = "none";
        el.style.zIndex = "9999";
        document.body.appendChild(el);
        _domFadeOverlayEl = el;
      }
      _domFadeOverlayEl.style.background = fadeColor || "#000000";
      _domFadeOverlayEl.style.display = "block";
      _domFadeOverlayEl.style.opacity = "1";
    } catch (e) {}
  }

  function hideDomFadeOverlay() {
    try {
      if (_domFadeOverlayEl) {
        _domFadeOverlayEl.style.display = "none";
      }
    } catch (e) {}
  }

  function ensureFadeOutOverlay(scene, fadeColor) {
    if (_suppressGlobalOverlay) return;
    try {
      if (_globalFadeOverlay && _globalFadeOverlay.parent) {
        const app = Graphics && (Graphics.app || Graphics._app);
        if (app && app.stage === _globalFadeOverlay.parent) {
          return;
        }
      }
      const container = (scene && scene._spriteset) || scene;
      if (_prevRuleFadeLayer) {
        if (_prevRuleFadeLayer.parent === container) return;
        if (_prevRuleFadeLayer.parent) {
          _prevRuleFadeLayer.parent.removeChild(_prevRuleFadeLayer);
          if (container && container.addChild)
            container.addChild(_prevRuleFadeLayer);
          return;
        } else {
          _prevRuleFadeLayer = null;
        }
      }

      const layer = new PIXI.Container();
      if (container && container.addChild) container.addChild(layer);

      const blackSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      blackSprite.width = Graphics.width;
      blackSprite.height = Graphics.height;
      blackSprite.tint = PIXI.utils.string2hex(fadeColor || "#000000");
      blackSprite.alpha = 1.0;
      layer.addChild(blackSprite);

      _prevRuleFadeLayer = layer;
    } catch (e) {
      _prevRuleFadeLayer = null;
    }
  }

  function ensureFadeOutOverlayBelowWindow(scene, fadeColor) {
    if (_suppressGlobalOverlay) return;
    try {
      const container = scene && scene._spriteset;
      if (!container) {
        ensureFadeOutOverlay(scene, fadeColor);
        return;
      }
      
      if (_prevRuleFadeLayer) {
        if (_prevRuleFadeLayer.parent === container) {
          return;
        }
        if (_prevRuleFadeLayer.parent) {
          _prevRuleFadeLayer.parent.removeChild(_prevRuleFadeLayer);
        }
        container.addChild(_prevRuleFadeLayer);
        return;
      }

      const layer = new PIXI.Container();
      container.addChild(layer);

      const blackSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      blackSprite.width = Graphics.width;
      blackSprite.height = Graphics.height;
      blackSprite.tint = PIXI.utils.string2hex(fadeColor || "#000000");
      blackSprite.alpha = 1.0;
      layer.addChild(blackSprite);

      _prevRuleFadeLayer = layer;
    } catch (e) {
      _prevRuleFadeLayer = null;
    }
  }

  const _Scene_Map_create_fade = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function () {
    _Scene_Map_create_fade.apply(this, arguments);
    if (isScreenFadedOut) {
      const fadeColor = $gameScreen.getRuleFadeColorHex
        ? $gameScreen.getRuleFadeColorHex()
        : "#000000";
      ensureFadeOutOverlayBelowWindow(this, fadeColor);
      hideDomFadeOverlay();
    }
  };

  const _Scene_Map_update_fade = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update_fade.apply(this, arguments);
  };

  const _Scene_Map_startFadeIn_fade = Scene_Map.prototype.startFadeIn;
  Scene_Map.prototype.startFadeIn = function (duration, white) {
    if (isScreenFadedOut) {
      return;
    }
    _Scene_Map_startFadeIn_fade.apply(this, arguments);
  };

  const _Scene_Map_startFadeOut_fade = Scene_Map.prototype.startFadeOut;
  Scene_Map.prototype.startFadeOut = function (duration, white) {
    if (isScreenFadedOut) {
      return;
    }
    _Scene_Map_startFadeOut_fade.apply(this, arguments);
  };

  const _Scene_Map_updateTransferPlayer_fade = Scene_Map.prototype.updateTransferPlayer;
  Scene_Map.prototype.updateTransferPlayer = function () {
    if (isScreenFading) {
      return;
    }
    if (OnevASSISTANT._pendingRuleFadeTransfer && $gamePlayer.isTransferring()) {
      OnevASSISTANT._pendingRuleFadeTransfer = false;
      _Scene_Map_updateTransferPlayer_fade.apply(this, arguments);
      return;
    }
    _Scene_Map_updateTransferPlayer_fade.apply(this, arguments);
  };

  const _Scene_Map_onMapLoaded_fade = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded_fade.apply(this, arguments);
    
    if (isScreenFadedOut) {
      const fadeColor = $gameScreen.getRuleFadeColorHex
        ? $gameScreen.getRuleFadeColorHex()
        : "#000000";
      _prevRuleFadeLayer = null;
      ensureFadeOutOverlayBelowWindow(this, fadeColor);
    }
    
    if (OnevASSISTANT._waitingForRuleFadeTransfer) {
      OnevASSISTANT._waitingForRuleFadeTransfer = false;
    }
  };

  const _Scene_Base_create_fade = Scene_Base.prototype.create;
  Scene_Base.prototype.create = function () {
    _Scene_Base_create_fade.apply(this, arguments);
  };

  const _Scene_Base_start_fade = Scene_Base.prototype.start;
  Scene_Base.prototype.start = function () {
    _Scene_Base_start_fade.apply(this, arguments);
  };

  const _Scene_Map_performTransfer_fade = Scene_Map.prototype.performTransfer;
  Scene_Map.prototype.performTransfer = function () {
    if (isScreenFading) {
      if (typeof _Scene_Map_performTransfer_fade === "function") {
        _Scene_Map_performTransfer_fade.apply(this, arguments);
      }
      return;
    }
    if (typeof _Scene_Map_performTransfer_fade === "function") {
      _Scene_Map_performTransfer_fade.apply(this, arguments);
    }
    if (isScreenFadedOut) {
      const fadeColor = $gameScreen.getRuleFadeColorHex
        ? $gameScreen.getRuleFadeColorHex()
        : "#000000";
      ensureFadeOutOverlayBelowWindow(this, fadeColor);
      if (_prevRuleFadeLayer && _prevRuleFadeLayer.parent === this) {
        this.addChildAt(_prevRuleFadeLayer, this.children.indexOf(this._windowLayer));
      }
    }
  };

  Game_Screen.prototype._hexToRGB = function (hex) {
    hex = (hex || "").replace(/^#/, "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const num = parseInt(hex, 16) || 0;
    return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
  };

  Game_Screen.prototype.setRuleFadeColor = function (hex) {
    this._ruleFadeColor = this._hexToRGB(hex);
  };

  Game_Screen.prototype.clearRuleFadeColor = function () {
    this._ruleFadeColor = null;
  };

  Game_Screen.prototype.getRuleFadeColorHex = function () {
    if (!this._ruleFadeColor) return "#000000";
    return (
      "#" +
      this._ruleFadeColor.map((c) => ("0" + c.toString(16)).substr(-2)).join("")
    );
  };

  const _Scene_MenuBase_isBusy = Scene_MenuBase.prototype.isBusy;
  Scene_MenuBase.prototype.isBusy = function () {
    if (isScreenFading) return true;
    return _Scene_MenuBase_isBusy.apply(this, arguments);
  };

  PluginManager.registerCommand("OnevASSISTANT", "SET_FADE_COLOR", (args) => {
    const hex = args.color || "#000000";
    $gameScreen.setRuleFadeColor(hex);
  });

  PluginManager.registerCommand("OnevASSISTANT", "CLEAR_FADE_COLOR", () => {
    $gameScreen.clearRuleFadeColor();
  });

  PluginManager.registerCommand("OnevASSISTANT", "RuleFade", function (args) {
    const type = args.type;
    const imgName = args.ruleImage || "mask_Dissolve";
    let durationArg = Number(args.duration || 0);
    const duration = durationArg > 0 ? durationArg : getGlobalFadeDuration(60);
    const reverse = args.reverseDirection === "true";
    const colorCode = args.fadeColor || $gameScreen.getRuleFadeColorHex();
    const transferMapId = Number(args.transferMapId || 0);
    const transferX = Number(args.transferX || 0);
    const transferY = Number(args.transferY || 0);
    const transferDirection = Number(args.transferDirection || 0);
    
    if (type === "out" && transferMapId > 0) {
      performRuleScreenFadeWithTransfer(
        imgName, duration, reverse, colorCode,
        transferMapId, transferX, transferY, transferDirection
      );
    } else {
      performRuleScreenFade(type, imgName, duration, reverse, colorCode);
    }
    this.setWaitMode("ruleFade");
  });

  function performRuleScreenFadeWithTransfer(
    ruleImageName, duration, reverseDirection, fadeColor,
    mapId, x, y, direction
  ) {
    const scene = SceneManager._scene;
    if (!scene) return;

    if (isScreenFading) {
      queuedScreenFade = {
        type: "out",
        ruleImageName,
        duration,
        reverseDirection,
        fadeColor,
        transferMapId: mapId,
        transferX: x,
        transferY: y,
        transferDirection: direction
      };
      return;
    }
    isScreenFading = true;
    if (SceneManager && SceneManager.isFastForward) {
      if (!_originalIsFastForward)
        _originalIsFastForward = SceneManager.isFastForward;
      SceneManager.isFastForward = () => false;
    }
    const ruleBitmap = ImageManager.loadBitmap("img/system/", ruleImageName);
    const fc = fadeColor || $gameScreen.getRuleFadeColorHex();
    const du = duration > 0 ? duration : getGlobalFadeDuration(60);
    const callStart = (bmp) =>
      startFadeWithTransfer(scene, bmp, du, reverseDirection, fc, _prevRuleFadeLayer, mapId, x, y, direction);
    if (!ruleBitmap.isReady()) ruleBitmap.addLoadListener(callStart);
    else callStart(ruleBitmap);
  }

  function startFadeWithTransfer(
    scene, ruleBitmap, duration, reverseDirection, fadeColor, oldLayer,
    mapId, x, y, direction
  ) {
    const EPS_SCALE = 1.25;
    const PROGRESS_BIAS_FACTOR = 0.5;
    const DITHER_STRENGTH_BASE = 1.0 / 255.0;
    const GAMMA = 1.0;
    const stepSizeJS = 1.0 / Math.max(1.0, duration);

    const layer = new PIXI.Container();
    
    const container = (scene && scene._spriteset) || scene;
    if (container && container.addChild) container.addChild(layer);
    
    const blackSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    blackSprite.tint = 0xffffff;
    blackSprite.width = Graphics.width;
    blackSprite.height = Graphics.height;
    layer.addChild(blackSprite);

    const maskSprite = new Sprite(ruleBitmap);
    maskSprite.width = Graphics.width;
    maskSprite.height = Graphics.height;

    const shader = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D mask;
      uniform float progress;
      uniform int isFadeOut;
      uniform int invertMask;
      uniform vec3 fadeColor;
      uniform float stepSize;
      uniform float epsScale;
      uniform float ditherStrength;
      uniform float gammaMask;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }
      void main(void){
        float m = texture2D(mask, vTextureCoord).r;
        m = pow(m, gammaMask);
        float n = hash(vTextureCoord);
        m = clamp(m - ditherStrength * (n - 0.5), 0.0, 1.0);
        if (invertMask == 1) m = 1.0 - m;
        float eps = max(1.0 / 255.0, stepSize * epsScale);
        m = min(m, 1.0 - eps);
        float f = smoothstep(m - eps, m + eps, progress);
        float a = isFadeOut == 1 ? f : (1.0 - f);
        gl_FragColor = vec4(fadeColor * a, a);
      }
    `;
    const filter = new PIXI.Filter(undefined, shader, {
      mask: maskSprite.texture,
      progress: -0.001,
      isFadeOut: 1,
      invertMask: reverseDirection ? 1 : 0,
      fadeColor: hexToRGBVec3(fadeColor),
      stepSize: stepSizeJS,
      epsScale: EPS_SCALE,
      ditherStrength: Math.max(DITHER_STRENGTH_BASE, stepSizeJS * 0.75),
      gammaMask: GAMMA,
    });
    blackSprite.filters = [filter];
    if (oldLayer && oldLayer.parent) oldLayer.parent.removeChild(oldLayer);
    _prevRuleFadeLayer = layer;

    let frame = 0;
    let transferDone = false;
    function update() {
      const bias = stepSizeJS * PROGRESS_BIAS_FACTOR;
      filter.uniforms.progress = Math.min(frame / duration + bias, 1.0);
      frame++;
      if (frame <= duration) {
        requestAnimationFrame(update);
      } else {
        blackSprite.filters = null;
        blackSprite.tint = PIXI.utils.string2hex(fadeColor);
        blackSprite.alpha = 1.0;
        _prevRuleFadeLayer = layer;
        isScreenFadedOut = true;
        isScreenFading = false;

        if (!transferDone) {
          transferDone = true;
          OnevASSISTANT._pendingRuleFadeTransfer = true;
          OnevASSISTANT._waitingForRuleFadeTransfer = true;
          $gamePlayer.reserveTransfer(mapId, x, y, direction, 2);
        }

        if (_originalIsFastForward) {
          SceneManager.isFastForward = _originalIsFastForward;
          _originalIsFastForward = null;
        }
        if (queuedScreenFade) {
          const q = queuedScreenFade;
          queuedScreenFade = null;
          if (q.transferMapId && q.transferMapId > 0) {
            performRuleScreenFadeWithTransfer(
              q.ruleImageName, q.duration, q.reverseDirection, q.fadeColor,
              q.transferMapId, q.transferX, q.transferY, q.transferDirection
            );
          } else {
            performRuleScreenFade(
              q.type, q.ruleImageName, q.duration, q.reverseDirection, q.fadeColor
            );
          }
        }
      }
    }
    requestAnimationFrame(update);
  }

  function hexToRGBVec3(hex) {
    hex = (hex || "").replace(/^#/, "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const num = parseInt(hex, 16) || 0;
    return [
      ((num >> 16) & 0xff) / 255,
      ((num >> 8) & 0xff) / 255,
      (num & 0xff) / 255,
    ];
  }

  function performRuleScreenFade(
    type,
    ruleImageName,
    duration = 0,
    reverseDirection = false,
    fadeColor
  ) {
    const scene = SceneManager._scene;
    
    if (!scene) {
      return;
    }

    if (type === "in" && !isScreenFadedOut) {
      return;
    }

    if (type === "in") {
      _suppressGlobalOverlay = true;
    }
    if (isScreenFading) {
      queuedScreenFade = {
        type,
        ruleImageName,
        duration,
        reverseDirection,
        fadeColor,
      };
      return;
    }
    isScreenFading = true;
    if (SceneManager && SceneManager.isFastForward) {
      if (!_originalIsFastForward)
        _originalIsFastForward = SceneManager.isFastForward;
      SceneManager.isFastForward = () => false;
    }
    const ruleBitmap = ImageManager.loadBitmap("img/system/", ruleImageName);
    const fc = fadeColor || $gameScreen.getRuleFadeColorHex();
    const du = duration > 0 ? duration : getGlobalFadeDuration(60);
    const callStart = (bmp) =>
      startFade(scene, bmp, type, du, reverseDirection, fc, _prevRuleFadeLayer);
    if (!ruleBitmap.isReady()) ruleBitmap.addLoadListener(callStart);
    else callStart(ruleBitmap);
  }

  function startFade(
    scene,
    ruleBitmap,
    type,
    duration,
    reverseDirection,
    fadeColor,
    oldLayer = null
  ) {
    const EPS_SCALE = 1.25;
    const PROGRESS_BIAS_FACTOR = 0.5;
    const DITHER_STRENGTH_BASE = 1.0 / 255.0;
    const GAMMA = 1.0;
    const stepSizeJS = 1.0 / Math.max(1.0, duration);
    
    const layer = new PIXI.Container();
    
    const container = (scene && scene._spriteset) || scene;
    if (container && container.addChild) container.addChild(layer);
    
    const blackSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    blackSprite.width = Graphics.width;
    blackSprite.height = Graphics.height;
    layer.addChild(blackSprite);
    
    if (type === "in") {
      blackSprite.tint = PIXI.utils.string2hex(fadeColor);
      blackSprite.alpha = 1.0;
      blackSprite.filters = null; 
    } else {
      blackSprite.tint = 0xffffff;
    }

    const maskSprite = new Sprite(ruleBitmap);
    maskSprite.width = Graphics.width;
    maskSprite.height = Graphics.height;

    const shader = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D mask;
      uniform float progress;
      uniform int isFadeIn;
      uniform int invertMask;
      uniform vec3 fadeColor;
      uniform float stepSize;
      uniform float epsScale;
      uniform float ditherStrength;
      uniform float gammaMask;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }
      void main(void){
        float m = texture2D(mask, vTextureCoord).r;
        m = pow(m, gammaMask);
        float n = hash(vTextureCoord);
        m = clamp(m - ditherStrength * (n - 0.5), 0.0, 1.0);
        if (invertMask == 1) m = 1.0 - m;
        float eps = max(1.0 / 255.0, stepSize * epsScale);
        m = min(m, 1.0 - eps);
        float f = smoothstep(m - eps, m + eps, progress);
        // フェードアウト: progress 0→1, f 0→1, a=f (透明→黒)
        // フェードイン: progress 1→0, f 1→0, a=f (黒→透明)
        float a = f;
        gl_FragColor = vec4(fadeColor * a, a);
      }
    `;
    
    const initialProgress = (type === "in") ? 1.0 : -0.001;
    
    const filter = new PIXI.Filter(undefined, shader, {
      mask: maskSprite.texture,
      progress: initialProgress,
      isFadeIn: type === "in" ? 1 : 0,
      invertMask: reverseDirection ? 1 : 0,
      fadeColor: hexToRGBVec3(fadeColor),
      stepSize: stepSizeJS,
      epsScale: EPS_SCALE,
      ditherStrength: Math.max(DITHER_STRENGTH_BASE, stepSizeJS * 0.75),
      gammaMask: GAMMA,
    });
    
    if (type === "out") {
      blackSprite.filters = [filter];
    }
    
    if (type === "out") {
      if (oldLayer && oldLayer.parent) {
        oldLayer.parent.removeChild(oldLayer);
      }
      _prevRuleFadeLayer = layer;
    }

    let frame = 0;
    let updateCount = 0;
    let overlaysRemoved = false; 
    let filterApplied = false;
    const FADE_IN_DELAY_FRAMES = 3; 
    
    function update() {
      const bias = stepSizeJS * PROGRESS_BIAS_FACTOR;
      let progress;
      
      if (type === "in") {
        if (frame < FADE_IN_DELAY_FRAMES) {
          progress = 1.0; 
        } else {
          if (!filterApplied) {
            filterApplied = true;
            blackSprite.tint = 0xffffff;
            blackSprite.filters = [filter];
            filter.uniforms.progress = 1.0;
          }
          const actualFrame = frame - FADE_IN_DELAY_FRAMES;
          progress = Math.max(1.0 - (actualFrame / duration + bias), 0.0);
        }
        
        if (!overlaysRemoved && frame >= FADE_IN_DELAY_FRAMES - 1) {
          overlaysRemoved = true;
          if (_globalFadeOverlay) {
            removeGlobalFadeOverlay();
          }
          hideDomFadeOverlay();
          if (oldLayer && oldLayer.parent) {
            oldLayer.parent.removeChild(oldLayer);
          }
          if (_prevRuleFadeLayer && _prevRuleFadeLayer !== oldLayer) {
            if (_prevRuleFadeLayer.parent) {
              _prevRuleFadeLayer.parent.removeChild(_prevRuleFadeLayer);
            }
          }
          _prevRuleFadeLayer = null;
        }
      } else {
        progress = Math.min(frame / duration + bias, 1.0);
      }
      
      if (filterApplied || type === "out") {
        filter.uniforms.progress = progress;
      }
      
      updateCount++;
      
      frame++;
      const totalFrames = (type === "in") ? duration + FADE_IN_DELAY_FRAMES : duration;
      if (frame <= totalFrames) {
        requestAnimationFrame(update);
      } else {
        if (type === "out") {
          blackSprite.filters = null;
          blackSprite.tint = PIXI.utils.string2hex(fadeColor);
          blackSprite.alpha = 1.0;
          _prevRuleFadeLayer = layer;
          isScreenFadedOut = true;
        }
        if (type === "in") {
          if (layer && layer.parent) {
            layer.parent.removeChild(layer);
          } else if (scene && scene.removeChild) {
            scene.removeChild(layer);
          }
          isScreenFadedOut = false;
          _suppressGlobalOverlay = false;
          removeGlobalFadeOverlay();
          hideDomFadeOverlay();
        }
        isScreenFading = false;
        if (_originalIsFastForward) {
          SceneManager.isFastForward = _originalIsFastForward;
          _originalIsFastForward = null;
          _prevRuleFadeLayer = null;
        }
        if (queuedScreenFade) {
          const q = queuedScreenFade;
          queuedScreenFade = null;
          performRuleScreenFade(
            q.type,
            q.ruleImageName,
            q.duration,
            q.reverseDirection,
            q.fadeColor
          );
        }
      }
    }
    requestAnimationFrame(update);
  }
})();

(() => {
  const _Spriteset_Base_createUpperLayer_rulefade =
    Spriteset_Base.prototype.createUpperLayer;
  Spriteset_Base.prototype.createUpperLayer = function () {
    _Spriteset_Base_createUpperLayer_rulefade.apply(this, arguments);
    try {
      if (isScreenFadedOut) {
        const fadeColor = $gameScreen.getRuleFadeColorHex
          ? $gameScreen.getRuleFadeColorHex()
          : "#000000";
        if (!_prevRuleFadeLayer || _prevRuleFadeLayer.parent !== this) {
          const scene = SceneManager._scene;
          if (scene) ensureFadeOutOverlay(scene, fadeColor);
          hideDomFadeOverlay();
        }
      }
    } catch (e) {}
  };

  //======================================================================
  // チャットログ機能
  //======================================================================

  const raw = getPluginParameter("OnevASSISTANT", "ChatLogSettings", "{}");
  const chatParams = safeJsonParse(raw, {});
  const parameters = {
    ...chatParams,
    ...PluginManager.parameters("OnevASSISTANT"),
  };

  const DEFAULT_MOVE_DURATION = 20;
  const DEFAULT_MOVE_EASING = "easeOutQuad";

  function parseSwitchMoves(raw) {
    if (!raw) return [];

    let rawArray;
    try {
      rawArray = JSON.parse(raw);
    } catch (error) {
      console.warn("ChatLogのSwitchMovesを解析できませんでした:", error);
      return [];
    }

    return rawArray
      .map((entry, index) => {
        const data = safeJsonParse(entry, null);
        if (!data) return null;

        const switchId = Number(data.SwitchId || 0);
        if (!switchId) return null;

        const hasX = data.TargetX !== undefined && data.TargetX !== "";
        const hasY = data.TargetY !== undefined && data.TargetY !== "";

        const durationRaw =
          data.Duration !== undefined && data.Duration !== ""
            ? Number(data.Duration)
            : DEFAULT_MOVE_DURATION;
        const duration = Math.max(0, durationRaw || 0);

        const easing = (data.Easing || DEFAULT_MOVE_EASING).toString();

        return {
          name: data.Name || "",
          switchId,
          targetX: hasX ? Number(data.TargetX) : null,
          targetY: hasY ? Number(data.TargetY) : null,
          duration,
          easing,
          key: `switch:${switchId}:${index}`,
        };
      })
      .filter(Boolean);
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function applyEasing(easing, t) {
    const clamped = clamp01(t);
    switch (easing) {
      case "easeInQuad":
        return clamped * clamped;
      case "easeOutQuad":
        return clamped * (2 - clamped);
      case "easeInOutQuad":
        return clamped < 0.5
          ? 2 * clamped * clamped
          : -1 + (4 - 2 * clamped) * clamped;
      case "linear":
      default:
        return clamped;
    }
  }

  let fontName = parameters["FontName"] || "GameFont";
  let customBackgroundImage = parameters["CustomBackgroundImage"] || "";
  let fontLoaded = false;

  if (fontName !== "GameFont") {
    const fontFileName = fontName.endsWith(".woff")
      ? fontName
      : `${fontName}.woff`;
    const baseFontName = fontName.replace(/\.woff$/i, "");

    const font = new FontFace(baseFontName, `url("fonts/${fontFileName}")`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        fontLoaded = true;
      })
      .catch((err) => {
        console.warn(
          `フォント "${baseFontName}" の読み込みに失敗しました:`,
          err
        );
        fontLoaded = true;
      });

    fontName = baseFontName;
  } else {
    fontLoaded = true;
  }

  const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
  Scene_Boot.prototype.isReady = function () {
    return _Scene_Boot_isReady.call(this) && fontLoaded;
  };

  const settings = {
    disableSwitchId: Number(parameters["DisableChatSwitchID"] || 2),
    visibleSwitchId: Number(parameters["SwitchID"] || 1),
    forceHideSwitchIds: JSON.parse(
      parameters["ForceHideSwitchIds"] || "[]"
    ).map(Number),
    maxEntries: Number(parameters["MaxLogEntries"] || 100),
    padding: {
      top: Number(parameters["PaddingTop"] || 8),
      bottom: Number(parameters["PaddingBottom"] || 8),
      left: Number(parameters["PaddingLeft"] || 12),
      right: Number(parameters["PaddingRight"] || 12),
    },
    fontSize: Number(parameters["FontSize"] || 28),
    iconSize: Number(parameters["IconSize"] || 32),
    scrollAmount: Number(parameters["ScrollAmount"] || 40),
    defaultStampWidth: Number(parameters["DefaultStampWidth"] || 100),
    defaultStampHeight: Number(parameters["DefaultStampHeight"] || 100),
    backgroundImage: parameters["CustomBackgroundImage"] || "",
    voiceCompleteId: Number(parameters["VoiceCompleteSwitchID"] || 0),
    fontName: fontName,
    window: {
      x: Number(parameters["WindowX"] || 0),
      y: Number(parameters["WindowY"] || 0),
      width: Number(parameters["WindowWidth"] || 480),
      height: Number(parameters["WindowHeight"] || 216),
      opacity: Number(parameters["WindowOpacity"] || 255),
    },
    lineSpacing: Number(parameters["LineSpacing"] || 4),
    switchMoves: parseSwitchMoves(parameters["SwitchMoves"]),
  };

  let {
    x: currentWindowX,
    y: currentWindowY,
    width: currentWindowWidth,
    height: currentWindowHeight,
    opacity: currentWindowOpacity,
  } = settings.window;

  const baseWindowX = settings.window.x;
  const baseWindowY = settings.window.y;
  const switchMoveConfigs = settings.switchMoves || [];

  let windowMoveTween = null;
  let lastTargetKey = null;
  let manualPositionOverride = false;
  let lastSwitchStates = {};

  let {
    top: paddingTop,
    bottom: paddingBottom,
    left: paddingLeft,
    right: paddingRight,
  } = settings.padding;

  let scrollAmount = settings.scrollAmount;
  let maxLogEntries = settings.maxEntries;
  let disableChatSwitchId = settings.disableSwitchId;
  const DEBUG = true;
  let switchId = settings.visibleSwitchId;
  let fontSize = settings.fontSize;
  let iconSize = settings.iconSize;
  let lineSpacing = settings.lineSpacing;
  let fontNameFinal = settings.fontName;
  let voiceCompleteSwitchId = settings.voiceCompleteId;
  let chatEntries = [];
  let scrollY = 0;
  let totalLogHeight = 0;
  let maxScrollY = 0;
  let $chatLogData = {
    entries: [],
    scrollY: 0,
    wasVisible: false,
    windowX: currentWindowX,
    windowY: currentWindowY,
    windowWidth: currentWindowWidth,
    windowHeight: currentWindowHeight,
    windowOpacity: currentWindowOpacity,
  };

  function sanitizeAudioName(name) {
    if (!name) return "";
    const trimmed = String(name).trim();
    return trimmed.replace(/\.ogg$/i, "");
  }

  function resolveActiveSwitchTarget() {
    for (const config of switchMoveConfigs) {
      if (config.switchId && $gameSwitches.value(config.switchId)) {
        return {
          x: config.targetX !== null ? config.targetX : baseWindowX,
          y: config.targetY !== null ? config.targetY : baseWindowY,
          duration: config.duration,
          easing: config.easing,
          key: config.key,
        };
      }
    }

    return {
      x: baseWindowX,
      y: baseWindowY,
      duration: DEFAULT_MOVE_DURATION,
      easing: DEFAULT_MOVE_EASING,
      key: "base",
    };
  }

  function startWindowTween(targetX, targetY, duration, easing, key) {
    windowMoveTween = {
      startX: currentWindowX,
      startY: currentWindowY,
      targetX,
      targetY,
      duration: Math.max(0, duration || 0),
      easing: easing || DEFAULT_MOVE_EASING,
      elapsed: 0,
      key,
    };
  }

  function updateWindowTween(windowInstance) {
    if (!windowMoveTween) return;

    if (windowMoveTween.duration === 0) {
      currentWindowX = windowMoveTween.targetX;
      currentWindowY = windowMoveTween.targetY;
      windowInstance.move(
        currentWindowX,
        currentWindowY,
        currentWindowWidth,
        currentWindowHeight
      );
      windowMoveTween = null;
      return;
    }

    windowMoveTween.elapsed = Math.min(
      windowMoveTween.elapsed + 1,
      windowMoveTween.duration
    );
    const progress = windowMoveTween.elapsed / windowMoveTween.duration;
    const eased = applyEasing(windowMoveTween.easing, progress);

    const newX = Math.round(
      lerp(windowMoveTween.startX, windowMoveTween.targetX, eased)
    );
    const newY = Math.round(
      lerp(windowMoveTween.startY, windowMoveTween.targetY, eased)
    );

    if (currentWindowX !== newX || currentWindowY !== newY) {
      currentWindowX = newX;
      currentWindowY = newY;
      windowInstance.move(
        currentWindowX,
        currentWindowY,
        currentWindowWidth,
        currentWindowHeight
      );
    }

    if (windowMoveTween.elapsed >= windowMoveTween.duration) {
      windowMoveTween = null;
    }
  }

  function Window_ChatLog() {
    this.initialize(...arguments);
  }

  Window_ChatLog.prototype = Object.create(Window_Base.prototype);
  Window_ChatLog.prototype.constructor = Window_ChatLog;

  Window_ChatLog.prototype.initialize = function () {
    const rect = new Rectangle(
      currentWindowX,
      currentWindowY,
      currentWindowWidth,
      currentWindowHeight
    );
    Window_Base.prototype.initialize.call(this, rect);

    if (typeof this.padding === "function") {
      this._paddingCustom = 0;
      this.padding = function () {
        return this._paddingCustom;
      };
    } else {
      this.padding = 0;
    }
    this.createContents();

    this.contents.fontSize = fontSize;

    if (customBackgroundImage) {
      this.windowskin = new Bitmap();
      this.opacity = 0;
      this.backOpacity = 0;
      this.contentsOpacity = 255;
      this._backgroundSprite = new Sprite();
      const bgBitmap = ImageManager.loadPicture(customBackgroundImage);
      this._backgroundSprite.bitmap = bgBitmap;
      this.addChildToBack(this._backgroundSprite);

      bgBitmap.addLoadListener(() => {
        const w = bgBitmap.width;
        const h = bgBitmap.height;

        this._backgroundSprite.x = 0;
        this._backgroundSprite.y = 0;
        this.setWindowSize(
          w,
          h,
          currentWindowX,
          currentWindowY,
          currentWindowOpacity
        );
      });
    } else {
      this.opacity = currentWindowOpacity;
      this.backOpacity = 192;
      this.contentsOpacity = 255;
    }
    this.hide();
    this.updateVisibility();
    this.initializeMouseScroll();
    this.redrawLog();
    this._draggingScrollbar = false;
    this._dragOffsetY = 0;
    this._refreshChatMask();
    this._voiceQueue = [];
  };

  Window_ChatLog.prototype.updateBackgroundImage = function () {
    if (this._backgroundSprite) {
      this.removeChild(this._backgroundSprite);
      this._backgroundSprite = null;
    }

    if (customBackgroundImage && customBackgroundImage.trim() !== "") {
      this.windowskin = new Bitmap();
      this.opacity = 0;
      this.backOpacity = 0;
      this.contentsOpacity = 255;
      this._backgroundSprite = new Sprite();
      const bgBitmap = ImageManager.loadPicture(customBackgroundImage);
      this._backgroundSprite.bitmap = bgBitmap;
      this.addChildToBack(this._backgroundSprite);

      bgBitmap.addLoadListener(() => {
        const w = bgBitmap.width;
        const h = bgBitmap.height;
        this._backgroundSprite.x = 0;
        this._backgroundSprite.y = 0;
        this.setWindowSize(
          w,
          h,
          currentWindowX,
          currentWindowY,
          currentWindowOpacity
        );
      });
    } else {
      this.windowskin = ImageManager.loadSystem("Window");
      this.opacity = currentWindowOpacity;
      this.backOpacity = 192;
      this.contentsOpacity = 255;
    }
  };

  Window_ChatLog.prototype._refreshChatMask = function () {
    try {
      if (!this._chatMask) {
        this._chatMask = new PIXI.Graphics();
        this.addChild(this._chatMask);
        if (this._contentsSprite) {
          this._contentsSprite.mask = this._chatMask;
        }
      }
      const w = this.contents.width;
      const h = this.contents.height;
      const x = paddingLeft;
      const y = paddingTop;
      const rw = Math.max(0, w - paddingLeft - paddingRight);
      const rh = Math.max(0, h - paddingTop - paddingBottom);
      this._chatMask.clear();
      this._chatMask.beginFill(0xffffff, 1);
      this._chatMask.drawRect(x, y, rw, rh);
      this._chatMask.endFill();
    } catch (e) {}
  };

  Window_ChatLog.prototype.updateSwitchDrivenPosition = function () {
    let switchStateChanged = false;
    for (const config of switchMoveConfigs) {
      if (config.switchId) {
        const currentState = $gameSwitches.value(config.switchId);
        const lastState = lastSwitchStates[config.switchId];
        if (lastState !== undefined && lastState !== currentState) {
          switchStateChanged = true;
        }
        lastSwitchStates[config.switchId] = currentState;
      }
    }

    if (switchStateChanged) {
      manualPositionOverride = false;
    }

    if (manualPositionOverride) return;

    const target = resolveActiveSwitchTarget();

    if (!target) return;

    const upcomingKey = target.key;
    const needsNewTween =
      (windowMoveTween &&
        (windowMoveTween.targetX !== target.x ||
          windowMoveTween.targetY !== target.y ||
          lastTargetKey !== upcomingKey)) ||
      (!windowMoveTween &&
        (lastTargetKey !== upcomingKey ||
          currentWindowX !== target.x ||
          currentWindowY !== target.y));

    if (needsNewTween) {
      const alreadyAtTarget =
        currentWindowX === target.x && currentWindowY === target.y;

      if (alreadyAtTarget) {
        windowMoveTween = null;
        lastTargetKey = upcomingKey;
      } else {
        startWindowTween(
          target.x,
          target.y,
          target.duration,
          target.easing,
          upcomingKey
        );
        lastTargetKey = upcomingKey;
      }
    }

    updateWindowTween(this);
  };

  Window_ChatLog.prototype._refreshFrame = function () {
    if (customBackgroundImage) return;
    Window_Base.prototype._refreshFrame.call(this);
  };

  Window_ChatLog.prototype.updateVisibility = function () {
    const forceHidden = settings.forceHideSwitchIds.some((id) =>
      $gameSwitches.value(id)
    );
    if (forceHidden || !$gameSwitches.value(switchId)) {
      this.hideWindow();
    } else {
      this.showWindow();
    }
  };

  Window_ChatLog.prototype.textPadding = function () {
    return 0;
  };

  Window_ChatLog.prototype.lineHeight = function () {
    return this.contents.fontSize + 6;
  };

  Window_ChatLog.prototype.convertEscapeCharacters = function (text) {
    text = text.replace(/\\+n(?![\[\d])/g, "\n");
    text = text.replace(/\\/g, "¤");
    text = text.replace(/¤V\[(\d+)\]/gi, (_, n) => {
      return $gameVariables.value(Number(n));
    });

    text = text.replace(/\\SV\[([^\]]+)\]/gi, (_, arg) => {
      const expanded = this.convertEscapeCharacters(arg);
      this._lastVoiceName = expanded;
      return "";
    });

    text = text.replace(/¤SC\[(\d+)\]/gi, (_, n) => {
      const varValue = $gameVariables.value(Number(n));
      this._lastVoiceName = varValue;
      return "";
    });

    text = text.replace(/¤N\[(\d+)\]/gi, (_, n) => {
      const actor = $gameActors.actor(Number(n));
      return actor ? actor.name() : "";
    });

    text = text.replace(/¤ITEM\[(\d+)\]/gi, (_, id) => {
      const item = $dataItems[parseInt(id, 10)];
      return item ? item.name : "";
    });

    text = text.replace(/¤WEAPON\[(\d+)\]/gi, (_, id) => {
      const wep = $dataWeapons[parseInt(id, 10)];
      return wep ? wep.name : "";
    });

    text = text.replace(/¤ARMOR\[(\d+)\]/gi, (_, id) => {
      const arm = $dataArmors[parseInt(id, 10)];
      return arm ? arm.name : "";
    });

    text = text.replace(/¤G/gi, TextManager.currencyUnit);

    return text;
  };

  Window_ChatLog.prototype.initializeMouseScroll = function () {};
  Window_ChatLog.prototype.scrollYPlus = function () {
    if (this._scrollAnimation) {
      this._scrollAnimation.active = false;
    }
    scrollY = Math.min(scrollY + scrollAmount, maxScrollY);
    this.redrawLog();
  };

  Window_ChatLog.prototype.scrollYMinus = function () {
    if (this._scrollAnimation) {
      this._scrollAnimation.active = false;
    }
    scrollY = Math.max(scrollY - scrollAmount, 0);
    this.redrawLog();
  };

  Window_ChatLog.prototype.redrawLogWithNewEntryOffset = function (
    newEntryOffset
  ) {
    this.contents.clear();
    this._playedVoices = [];
    this._stampHitAreas = [];
    this.updateTotalHeight();

    let currentY = this.contents.height - paddingBottom + scrollY;
    const visibleTop = paddingTop;
    const visibleBottom = this.contents.height - paddingBottom;

    for (let i = chatEntries.length - 1; i >= 0; i--) {
      const entry = chatEntries[i];
      let entryHeight;
      if (entry.height) {
        entryHeight = entry.height;
      } else if (entry.text && entry.text.includes("\n")) {
        const lineCnt = entry.text.split("\n").length;
        entryHeight = (fontSize + lineSpacing) * lineCnt;
      } else {
        entryHeight = fontSize + lineSpacing;
      }

      currentY -= entryHeight;

      let drawY = currentY;
      if (i === chatEntries.length - 1) {
        drawY = currentY + newEntryOffset;
      }

      if (drawY + entryHeight <= visibleTop) break;
      if (drawY >= visibleBottom) continue;

      if (entry.type === "text") {
        this.contents.fontSize = fontSize;
        const txt = this.convertEscapeCharacters(entry.text).replace(
          /¤C\[(\d+)\]/gi,
          ""
        );
        let x;
        if (entry.align === "right") {
          const w = this.textWidth(txt);
          x = this.contents.width - paddingRight - w;
        } else {
          x = paddingLeft;
        }
        this.drawChatText(entry.text, x, drawY, entry.align);
      } else if (entry.type === "stamp") {
        const bitmap = ImageManager.loadPicture(entry.stampName);
        if (bitmap && bitmap.isReady()) {
          const w = entry.width;
          const h = entry.height;
          const x =
            entry.align === "right"
              ? this.contents.width - w - paddingRight
              : paddingLeft;

          this.contents.blt(
            bitmap,
            0,
            0,
            bitmap.width,
            bitmap.height,
            x,
            drawY,
            w,
            h
          );
          this._stampHitAreas.push({
            x,
            y: drawY,
            width: w,
            height: h,
            commonEventId: entry.commonEventId || 0,
          });
        } else {
          bitmap.addLoadListener(() =>
            this.redrawLogWithNewEntryOffset(newEntryOffset)
          );
        }
      }
    }

    this.drawScrollBar();
    this.contents.fontSize = fontSize;
  };

  Window_ChatLog.prototype.redrawLog = function () {
    this.contents.clear();
    this._playedVoices = [];
    this._stampHitAreas = [];
    this.updateTotalHeight();
    let currentY = this.contents.height - paddingBottom + scrollY;
    const visibleTop = paddingTop;
    const visibleBottom = this.contents.height - paddingBottom;

    for (let i = chatEntries.length - 1; i >= 0; i--) {
      const entry = chatEntries[i];
      let entryHeight;
      if (entry.height) {
        entryHeight = entry.height;
      } else if (entry.text && entry.text.includes("\n")) {
        const lineCnt = entry.text.split("\n").length;
        entryHeight = (fontSize + lineSpacing) * lineCnt;
      } else {
        entryHeight = fontSize + lineSpacing;
      }
      currentY -= entryHeight;

      let drawY = currentY;
      if (typeof this._temporaryNewLogOffset === "number") {
        if (i === chatEntries.length - 1) {
          drawY = currentY + this._temporaryNewLogOffset;
        } else {
          drawY = currentY + this._temporaryNewLogOffset;
        }
      }

      if (drawY + entryHeight <= visibleTop) break;
      if (drawY >= visibleBottom) continue;
      if (entry.type === "text") {
        this.contents.fontSize = fontSize;
        const txt = this.convertEscapeCharacters(entry.text).replace(
          /¤C\[(\d+)\]/gi,
          ""
        );
        let x;
        if (entry.align === "right") {
          const w = this.textWidth(txt);
          x = this.contents.width - paddingRight - w;
        } else {
          x = paddingLeft;
        }
        this.drawChatText(entry.text, x, drawY, entry.align);
      } else if (entry.type === "stamp") {
        const bitmap = ImageManager.loadPicture(entry.stampName);
        if (bitmap && bitmap.isReady()) {
          const w = entry.width;
          const h = entry.height;
          const x =
            entry.align === "right"
              ? this.contents.width - w - paddingRight
              : paddingLeft;

          this.contents.blt(
            bitmap,
            0,
            0,
            bitmap.width,
            bitmap.height,
            x,
            drawY,
            w,
            h
          );
          this._stampHitAreas.push({
            x,
            y: drawY,
            width: w,
            height: h,
            commonEventId: entry.commonEventId || 0,
          });
        } else {
          bitmap.addLoadListener(() => this.redrawLog());
        }
      }
    }

    this.drawScrollBar();
    this.contents.fontSize = fontSize;
  };

  Window_ChatLog.prototype.drawScrollBar = function () {
    const barWidth = 8;
    const marginRight = 4;
    const visibleHeight = this.contents.height - paddingTop - paddingBottom;

    if (totalLogHeight <= visibleHeight) return;
    const trackX = this.contents.width - paddingRight - barWidth - marginRight;
    const trackY = paddingTop;
    const trackH = visibleHeight;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(trackX, trackY, barWidth, trackH, "#000000");
    const barRatio = visibleHeight / totalLogHeight;
    const barHeight = Math.floor(visibleHeight * barRatio);
    const maxScroll = totalLogHeight - visibleHeight;
    const barY =
      paddingTop +
      Math.floor(
        ((maxScroll - scrollY) / maxScroll) * (visibleHeight - barHeight)
      );

    this.contents.paintOpacity = 128;
    this.contents.fillRect(trackX, barY, barWidth, barHeight, "#FFFFFF");
    this.contents.paintOpacity = 255;
  };

  Window_ChatLog.prototype.updateTotalHeight = function () {
    let total = 0;
    for (let i = chatEntries.length - 1; i >= 0; i--) {
      const entry = chatEntries[i];
      let entryHeight;
      if (entry.height) {
        entryHeight = entry.height;
      } else if (entry.text && entry.text.includes("\n")) {
        entryHeight = (fontSize + lineSpacing) * 2;
      } else {
        entryHeight = fontSize + lineSpacing;
      }
      if (entry.text && entry.text.includes("\n")) {
        const normalizedText = this.convertEscapeCharacters(entry.text);
        const lineCount = normalizedText.split("\n").length;
        entryHeight = (fontSize + lineSpacing) * lineCount;
      }
      total += entryHeight;
    }
    totalLogHeight = total;

    const visibleHeight = this.contents.height - paddingTop - paddingBottom;
    maxScrollY = Math.max(totalLogHeight - visibleHeight, 0);

    scrollY = Math.min(scrollY, maxScrollY);
  };

  Window_ChatLog.prototype.updateDragScroll = function () {
    const visibleHeight = this.contents.height - paddingTop - paddingBottom;
    if (totalLogHeight <= visibleHeight) return;

    const barWidth = 8;
    const marginRight = 4;
    const pad =
      typeof this.padding === "function"
        ? this.padding()
        : Number(this.padding || 0);
    const mx = TouchInput.x - (this.x + pad);
    const my = TouchInput.y - (this.y + pad);
    const trackX = this.contents.width - paddingRight - barWidth - marginRight;
    const trackY = paddingTop;
    const trackH = visibleHeight;
    const barH = Math.floor((visibleHeight * visibleHeight) / totalLogHeight);
    const maxScroll = totalLogHeight - visibleHeight;
    const barY =
      trackY + Math.floor((trackH - barH) * (1 - scrollY / maxScroll));

    if (!this._draggingScrollbar && TouchInput.isTriggered()) {
      if (
        mx >= trackX &&
        mx <= trackX + barWidth &&
        my >= barY &&
        my <= barY + barH
      ) {
        this._draggingScrollbar = true;
        this._dragOffsetY = my - barY;
        return;
      }
    }

    if (this._draggingScrollbar) {
      if (TouchInput.isPressed()) {
        let relY = my - this._dragOffsetY - trackY;
        relY = Math.max(0, Math.min(trackH - barH, relY));
        scrollY = Math.round(maxScroll * (1 - relY / (trackH - barH)));
        this.redrawLog();
        return;
      }
      if (TouchInput.isReleased()) {
        this._draggingScrollbar = false;
      }
    }
  };

  Window_ChatLog.prototype.animateNewLogEntry = function (lineHeight) {
    if (this._newLogAnimation && this._newLogAnimation.active) {
      this.redrawLog();
      return;
    }

    const animationOffset = lineHeight;

    this._newLogAnimation = {
      offset: animationOffset,
      targetOffset: 0,
      duration: 60,
      elapsed: 0,
      active: true,
    };
  };

  Window_ChatLog.prototype.scrollToPosition = function (
    targetScrollY,
    animated = false
  ) {
    if (!animated) {
      scrollY = targetScrollY;
      this.redrawLog();
      return;
    }

    const startScrollY = scrollY;

    if (startScrollY === targetScrollY) {
      return;
    }

    if (this._scrollAnimation && this._scrollAnimation.active) {
      this._scrollAnimation.active = false;
    }

    this._scrollAnimation = {
      startScrollY: startScrollY,
      targetScrollY: targetScrollY,
      duration: 60,
      elapsed: 0,
      active: true,
    };
  };

  Window_ChatLog.prototype.scrollToBottom = function (animated = false) {
    this.updateTotalHeight();
    if (!animated) {
      scrollY = 0;
      this.redrawLog();
      return;
    }

    this.scrollToPosition(0, true);
  };

  Window_ChatLog.prototype.clearLog = function () {
    chatEntries = [];
    scrollY = 0;
    totalLogHeight = 0;
    maxScrollY = 0;
    this.contents.clear();
  };

  Window_ChatLog.prototype.hideWindow = function () {
    this.visible = false;
    this.hide();
  };

  Window_ChatLog.prototype.showWindow = function () {
    this.visible = true;
    this.show();
    this.redrawLog();
  };

  Window_ChatLog.prototype.setWindowSize = function (
    width,
    height,
    x,
    y,
    opacity
  ) {
    if (width !== undefined) currentWindowWidth = width;
    if (height !== undefined) currentWindowHeight = height;
    if (x !== undefined) currentWindowX = x;
    if (y !== undefined) currentWindowY = y;
    if (opacity !== undefined) currentWindowOpacity = opacity;

    this.move(
      currentWindowX,
      currentWindowY,
      currentWindowWidth,
      currentWindowHeight
    );
    this.opacity = currentWindowOpacity;
    this.createContents();
    this.redrawLog();
    this._refreshChatMask();

    windowMoveTween = null;
    lastTargetKey = null;
  };

  Window_ChatLog.prototype.drawChatText = function (text, x, y, align) {
    const normalizedText = text.replace(/\\+n(?![\[\d])/g, "\n");
    const textState = {
      index: 0,
      x: x,
      y: y,
      left: x,
      text: this.convertEscapeCharacters(normalizedText),
      drawing: true,
    };

    this.contents.fontFace = fontName;
    this.contents.fontSize = fontSize;
    this.resetTextColor();
    this.contents.fontBold = false;
    this.contents.fontItalic = false;
    this.contents.outlineWidth = 4;

    const controlCodeMarker = "¤";
    while (textState.index < textState.text.length) {
      const c = textState.text.charAt(textState.index);
      if (c === controlCodeMarker) {
        textState.index++;
        const code = this.obtainEscapeCode(textState);
        this.processChatEscapeCharacter(code, textState);
      } else if (c === "\n") {
        textState.x = textState.left;
        textState.y += this.lineHeight();
        textState.index++;
      } else {
        const w = this.textWidth(c);
        this.contents.drawText(
          c,
          textState.x,
          textState.y,
          w,
          this.lineHeight(),
          "left"
        );
        textState.x += w;
        textState.index++;
      }
    }
  };

  Window_ChatLog.prototype.resetFontSettings = function () {
    this.contents.fontFace = fontName;
    this.contents.fontSize = fontSize;
    this.resetTextColor();
    this.contents.fontBold = false;
    this.contents.fontItalic = false;
  };

  Window_ChatLog.prototype.processChatEscapeCharacter = function (
    code,
    textState
  ) {
    switch (code) {
      case "C": {
        const colorIndex = this.obtainEscapeParam(textState);
        this.changeTextColor(ColorManager.textColor(colorIndex));
        break;
      }
      case "I": {
        const iconIndex = this.obtainEscapeParam(textState);
        this.drawIcon(iconIndex, textState.x, textState.y + 2);
        textState.x += this.iconWidth;
        break;
      }
      case "FS": {
        const size = this.obtainEscapeParam(textState);
        this.contents.fontSize = size;
        break;
      }
      case "V": {
        const variableId = this.obtainEscapeParam(textState);
        const value = $gameVariables.value(variableId).toString();
        for (let i = 0; i < value.length; i++) {
          const char = value.charAt(i);
          const w = this.textWidth(char);
          this.contents.drawText(
            char,
            textState.x,
            textState.y,
            w,
            this.lineHeight(),
            "left"
          );
          textState.x += w;
        }
        break;
      }
      case "FB": {
        this.contents.fontBold = !this.contents.fontBold;
        break;
      }
      case "FI": {
        this.contents.fontItalic = !this.contents.fontItalic;
        break;
      }
      case "OW": {
        const width = this.obtainEscapeParam(textState);
        this.contents.outlineWidth = width;
        break;
      }
      case "SV": {
        const match = textState.text
          .substring(textState.index)
          .match(/^\[([^\]]+)\]/);
        if (match) {
          let fileName = match[1];
          textState.index += match[0].length;

          fileName = this.convertEscapeCharacters(fileName);

          if (this._playedVoices && this._playedVoices.includes(fileName)) {
          } else {
            this._lastVoiceName = fileName;
          }
        }
        break;
      }
    }
  };

  Window_ChatLog.prototype.obtainEscapeCode = function (textState) {
    const regExp = /^([A-Z]{1,3})/i;
    const match = textState.text.substring(textState.index).match(regExp);
    if (match) {
      textState.index += match[1].length;
      return match[1].toUpperCase();
    }
    return "";
  };

  Window_ChatLog.prototype.obtainEscapeParam = function (textState) {
    const regExp = /^\[(\d+)\]/;
    const match = textState.text.substring(textState.index).match(regExp);
    if (match) {
      textState.index += match[0].length;
      return Number(match[1]);
    } else {
      return 0;
    }
  };

  Window_ChatLog.prototype._localX = function () {
    const pad =
      typeof this.padding === "function"
        ? this.padding()
        : Number(this.padding || 0);
    return TouchInput.x - this.x - pad;
  };
  Window_ChatLog.prototype._localY = function () {
    const pad =
      typeof this.padding === "function"
        ? this.padding()
        : Number(this.padding || 0);
    return TouchInput.y - this.y - pad;
  };

  const _Window_ChatLog_update = Window_ChatLog.prototype.update;
  Window_ChatLog.prototype.update = function () {
    _Window_ChatLog_update.call(this);

    this.updateSwitchDrivenPosition();
    this.updateDragScroll();

    if (this._newLogAnimation && this._newLogAnimation.active) {
      this._newLogAnimation.elapsed++;
      const progress =
        this._newLogAnimation.elapsed / this._newLogAnimation.duration;

      if (progress >= 1) {
        this._newLogAnimation.active = false;
        this._temporaryNewLogOffset = null;
        this.redrawLog();
      } else {
        const eased = 1 - Math.pow(1 - progress, 2);
        const currentOffset = this._newLogAnimation.offset * (1 - eased);

        this._temporaryNewLogOffset = currentOffset;
        this.redrawLog();
      }
    }

    if (this._scrollAnimation && this._scrollAnimation.active) {
      this._scrollAnimation.elapsed++;
      const progress =
        this._scrollAnimation.elapsed / this._scrollAnimation.duration;

      if (progress >= 1) {
        this._scrollAnimation.active = false;
        scrollY = this._scrollAnimation.targetScrollY;
        this.redrawLog();
      } else {
        const eased = 1 - Math.pow(1 - progress, 2);
        const currentScrollY =
          this._scrollAnimation.startScrollY +
          (this._scrollAnimation.targetScrollY -
            this._scrollAnimation.startScrollY) *
            eased;
        scrollY = currentScrollY;
        this.redrawLog();
      }
    }

    if (this.visible) {
      const wheelY = TouchInput.wheelY;
      if (wheelY > 0) {
        this.scrollYMinus();
      } else if (wheelY < 0) {
        this.scrollYPlus();
      }
    }

    if (this.visible && TouchInput.isTriggered()) {
      const lx = this._localX();
      const ly = this._localY();
      const visibleLeft = paddingLeft;
      const visibleRight = this.contents.width - paddingRight;
      const visibleTop = paddingTop;
      const visibleBottom = this.contents.height - paddingBottom;
      if (
        lx < visibleLeft ||
        lx > visibleRight ||
        ly < visibleTop ||
        ly > visibleBottom
      ) {
        return;
      }
      for (const area of this._stampHitAreas) {
        if (
          lx >= area.x &&
          lx <= area.x + area.width &&
          ly >= area.y &&
          ly <= area.y + area.height
        ) {
          if (area.commonEventId > 0) {
            $gameTemp.reserveCommonEvent(area.commonEventId);
          }
          break;
        }
      }
    }
  };

  Window_ChatLog.prototype._applyVoiceParams = function (buffer, sound) {
    if (typeof AudioManager.updateSeParameters === "function") {
      AudioManager.updateSeParameters(buffer, sound);
    } else if (typeof AudioManager.updateBgmParameters === "function") {
      try {
        AudioManager.updateBgmParameters(buffer, sound);
      } catch (e) {}
    } else {
      try {
        if (buffer && typeof buffer.volume === "number") {
          buffer.volume = (sound.volume || 100) / 100;
        }
        if (buffer && typeof buffer.pitch === "number") {
          buffer.pitch = (sound.pitch || 100) / 100;
        }
        if (buffer && typeof buffer.pan === "number") {
          buffer.pan = (sound.pan || 0) / 100;
        }
      } catch (e) {}
    }
  };

  Window_ChatLog.prototype._playVoiceSound = function (sound) {
    try {
      const buffer = AudioManager.createBuffer("voice/", sound.name);
      this._currentVoiceBuffer = buffer;
      buffer.addLoadListener(() => {
        this._applyVoiceParams(buffer, sound);
        buffer.play(false, 0);
        buffer.addStopListener(() => {
          if (voiceCompleteSwitchId > 0) {
            $gameSwitches.setValue(voiceCompleteSwitchId, true);
          }
          this._currentVoiceBuffer = null;
          if (this._voiceQueue && this._voiceQueue.length > 0) {
            const next = this._voiceQueue.shift();
            this._playVoiceSound(next);
          }
        });
      });
    } catch (e) {}
  };

  Window_ChatLog.prototype.playVoice = function (
    name,
    volume = null,
    pitch = null,
    pan = null,
    stopCurrent = true
  ) {
    if (!name) return;
    const baseName = sanitizeAudioName(name);
    if (!baseName) return;

    const sound = {
      name: baseName,
      volume:
        volume !== null && volume !== undefined
          ? Number(volume)
          : ConfigManager.voiceVolume || 100,
      pitch: pitch !== null && pitch !== undefined ? Number(pitch) : 100,
      pan: pan !== null && pan !== undefined ? Number(pan) : 0,
    };

    this._suppressVoiceOnce = true;
    this._voiceQueue = this._voiceQueue || [];
    const buf = this._currentVoiceBuffer;
    const isPlaying =
      !!buf &&
      ((typeof buf.isPlaying === "function" && buf.isPlaying()) ||
        (typeof buf.isReady === "function" ? !buf.isReady() : true));

    if (stopCurrent) {
      if (isPlaying) {
        try {
          this._currentVoiceBuffer.stop();
        } catch (e) {}
      }
      this._voiceQueue.length = 0;
      this._playVoiceSound(sound);
      return;
    }

    if (isPlaying) {
      this._voiceQueue.push(sound);
    } else {
      this._playVoiceSound(sound);
    }
  };

  Window_ChatLog.prototype.addChatText = function (text, align) {
    if ($gameSwitches.value(disableChatSwitchId)) return;

    const rawText = text;
    const displayText = this.convertEscapeCharacters(text);

    if (
      displayText &&
      window.SimpleVoiceControlParams &&
      window.SimpleVoiceControlParams.enableVoicePlayback
    ) {
      if (this._suppressVoiceOnce) {
        this._suppressVoiceOnce = false;
      } else {
        if (this._lastVoiceName == undefined) {
          const svMatch = /\\SV\[(.+?)\]/i.exec(rawText);
          if (svMatch && svMatch[1])
            this._lastVoiceName = sanitizeAudioName(svMatch[1]);
        }

        const sound = {
          name: sanitizeAudioName(this._lastVoiceName),
          volume: ConfigManager.voiceVolume || 100,
          pitch: 100,
          pan: 0,
        };

        if (this._currentVoiceBuffer && this._currentVoiceBuffer.isPlaying()) {
          this._currentVoiceBuffer.stop();
        }

        const buffer = AudioManager.createBuffer("voice/", sound.name);
        this._currentVoiceBuffer = buffer;
        buffer.addLoadListener(() => {
          buffer.play(false, 0);
          buffer.addStopListener(() => {
            if (voiceCompleteSwitchId > 0) {
              $gameSwitches.setValue(voiceCompleteSwitchId, true);
            }
          });
        });
        this._lastVoiceName = null;
      }
    }

    const entryHeight = fontSize + lineSpacing;
    const entry = {
      type: "text",
      text: displayText,
      align: align,
      fontSize: fontSize,
      height: entryHeight,
    };

    chatEntries.push(entry);
    if (chatEntries.length > maxLogEntries) {
      chatEntries.shift();
    }

    this.updateTotalHeight();

    if (!this._newLogAnimation || !this._newLogAnimation.active) {
      const lineHeight = entryHeight;
      this.animateNewLogEntry(lineHeight);
    } else {
      this._newLogAnimation.offset += entryHeight;
    }

    this.showWindow();
  };

  Window_ChatLog.prototype.addStamp = function (
    stampName,
    align,
    width,
    height,
    commonEventId = 0
  ) {
    if ($gameSwitches.value(disableChatSwitchId)) return;

    const defaultWidth = Number(parameters["DefaultStampWidth"]) || 100;
    const defaultHeight = Number(parameters["DefaultStampHeight"]) || 100;
    const targetWidth = width || defaultWidth;
    const targetHeight = height || defaultHeight;
    const bitmap = ImageManager.loadPicture(stampName);

    bitmap.addLoadListener(() => {
      let finalWidth = bitmap.width;
      let finalHeight = bitmap.height;

      if (finalWidth > targetWidth || finalHeight > targetHeight) {
        const scale = Math.min(
          targetWidth / finalWidth,
          targetHeight / finalHeight
        );
        finalWidth = Math.floor(finalWidth * scale);
        finalHeight = Math.floor(finalHeight * scale);
      }

      const entry = {
        type: "stamp",
        stampName,
        align,
        width: finalWidth,
        height: finalHeight,
        commonEventId,
      };

      chatEntries.push(entry);
      if (chatEntries.length > maxLogEntries) chatEntries.shift();

      this.updateTotalHeight();

      if (!this._newLogAnimation || !this._newLogAnimation.active) {
        this.animateNewLogEntry(finalHeight);
      } else {
        this._newLogAnimation.offset += finalHeight;
      }

      this.showWindow();
    });
  };

  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (_Game_Interpreter_pluginCommand) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
    }

    if (!SceneManager._scene || !SceneManager._scene._chatLogWindow) {
      return;
    }

    const chatWindow = SceneManager._scene._chatLogWindow;
    if (!args) args = [];

    switch (command) {
      case "chatleft":
      case "chatright": {
        const text = args.join(" ").replace(/_/g, " ");
        const align = command === "chatleft" ? "left" : "right";
        chatWindow.addChatText(text, align);
        break;
      }
      case "chatsize": {
        const w = Number(args[0] || currentWindowWidth);
        const h = Number(args[1] || currentWindowHeight);
        const x = Number(args[2] || currentWindowX);
        const y = Number(args[3] || currentWindowY);
        const op =
          args[4] !== undefined ? Number(args[4]) : currentWindowOpacity;
        chatWindow.setWindowSize(w, h, x, y, op);
        break;
      }
      case "chatscroll": {
        const val = Number(args[0] || defaultScrollAmount);
        scrollAmount = val;
        break;
      }
      case "chatclear": {
        chatWindow.clearLog();
        break;
      }
    }
  };

  function onchat(align, content) {
    if (!SceneManager._scene || !SceneManager._scene._chatLogWindow) {
      return;
    }
    const chatWindow = SceneManager._scene._chatLogWindow;

    if (align !== "left" && align !== "right") {
      return;
    }

    if (typeof content === "string") {
      const normalizedContent = content.replace(/\\+n(?![\[\d])/g, "\n");
      chatWindow.addChatText(normalizedContent, align);
    } else if (typeof content === "object" && content.stamp) {
      chatWindow.addStamp(content.stamp, align, content.width, content.height);
    } else {
    }
  }
  window.onchat = onchat;

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this._chatLogWindow = new Window_ChatLog();
    const picContainer = this._spriteset._pictureContainer;
    picContainer.addChild(this._chatLogWindow);
    picContainer.setChildIndex(
      this._chatLogWindow,
      picContainer.children.length - 1
    );
    this._chatLogWindow.restoreFromSaveData();
  };

  const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function () {
    _Scene_Map_updateMain.call(this);

    if (this._chatLogWindow) {
      this._chatLogWindow.update();
      this._chatLogWindow.updateVisibility();
      this._chatLogWindow.updateDragScroll();
    }
  };

  Window_ChatLog.prototype.restoreFromSaveData = function () {
    if ($chatLogData.entries) {
      chatEntries = JSON.parse(JSON.stringify($chatLogData.entries));
    }
    scrollY = $chatLogData.scrollY || 0;
    totalLogHeight = 0;
    currentWindowX = $chatLogData.windowX || currentWindowX;
    currentWindowY = $chatLogData.windowY || currentWindowY;
    currentWindowWidth = $chatLogData.windowWidth || currentWindowWidth;
    currentWindowHeight = $chatLogData.windowHeight || currentWindowHeight;
    currentWindowOpacity = $chatLogData.windowOpacity || currentWindowOpacity;

    this.move(
      currentWindowX,
      currentWindowY,
      currentWindowWidth,
      currentWindowHeight
    );
    this.opacity = currentWindowOpacity;
    this.createContents();
    this._refreshChatMask();

    if ($chatLogData.wasVisible) {
      this.showWindow();
    } else {
      this.hideWindow();
    }
    this.redrawLog();

    windowMoveTween = null;
    lastTargetKey = null;
  };

  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    if (this._chatLogWindow) {
      this._chatLogWindow.saveChatLogData();
    }
    _Scene_Map_terminate.call(this);
  };

  Window_ChatLog.prototype.saveChatLogData = function () {
    $chatLogData.entries = JSON.parse(JSON.stringify(chatEntries));
    $chatLogData.scrollY = scrollY;
    $chatLogData.wasVisible = this.visible;
    $chatLogData.windowX = currentWindowX;
    $chatLogData.windowY = currentWindowY;
    $chatLogData.windowWidth = currentWindowWidth;
    $chatLogData.windowHeight = currentWindowHeight;
    $chatLogData.windowOpacity = currentWindowOpacity;
  };

  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.chatLogData = JSON.parse(JSON.stringify($chatLogData));
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.chatLogData) {
      $chatLogData = JSON.parse(JSON.stringify(contents.chatLogData));
    }
  };

  Window_ChatLog.prototype.standardFontFace = function () {
    return fontName;
  };

  PluginManager.registerCommand("OnevASSISTANT", "ChatLog", (args) => {
    const action = args.action;
    const message = args.message || "";
    const fontColorIndex =
      args.fontColor !== undefined && args.fontColor !== ""
        ? Number(args.fontColor)
        : null;
    const voiceName = sanitizeAudioName((args.voiceName || "").trim());
    const voiceVolume =
      args.voiceVolume !== undefined && args.voiceVolume !== ""
        ? Number(args.voiceVolume)
        : null;
    const voicePitch =
      args.voicePitch !== undefined && args.voicePitch !== ""
        ? Number(args.voicePitch)
        : null;
    const voicePan =
      args.voicePan !== undefined && args.voicePan !== ""
        ? Number(args.voicePan)
        : null;
    const stopCurrentVoice = String(args.stopCurrentVoice || "true") === "true";

    if (!SceneManager._scene || !SceneManager._scene._chatLogWindow) {
      console.warn("チャットログウィンドウが見つかりません。");
      return;
    }

    const chatWindow = SceneManager._scene._chatLogWindow;

    switch (action) {
      case "左にログを追加":
        {
          let finalMessage = message;
          if (
            finalMessage &&
            fontColorIndex !== null &&
            !Number.isNaN(fontColorIndex)
          ) {
            finalMessage = `\\C[${fontColorIndex}]${finalMessage}\\C[0]`;
          }
          if (voiceName) {
            chatWindow.playVoice(
              voiceName,
              voiceVolume,
              voicePitch,
              voicePan,
              stopCurrentVoice
            );
          }
          chatWindow.addChatText(finalMessage, "left");
        }
        break;

      case "右にログを追加":
        {
          let finalMessage = message;
          if (
            finalMessage &&
            fontColorIndex !== null &&
            !Number.isNaN(fontColorIndex)
          ) {
            finalMessage = `\\C[${fontColorIndex}]${finalMessage}\\C[0]`;
          }
          if (voiceName) {
            chatWindow.playVoice(
              voiceName,
              voiceVolume,
              voicePitch,
              voicePan,
              stopCurrentVoice
            );
          }
          chatWindow.addChatText(finalMessage, "right");
        }
        break;

      case "ログをクリア":
        chatWindow.clearLog();
        break;
    }
  });

  PluginManager.registerCommand("OnevASSISTANT", "ChatStamp", (args) => {
    const side = args.side === "右" ? "right" : "left";
    const stamp = args.stampName || "";
    const w = Number(args.width || 0);
    const h = Number(args.height || 0);
    const ceId = Number(args.commonEventId || 0);

    const chatWindow =
      SceneManager._scene && SceneManager._scene._chatLogWindow;
    chatWindow.addStamp(stamp, side, w, h, ceId);
  });

  PluginManager.registerCommand("OnevASSISTANT", "ChatWindow", (args) => {
    const x = Number(args.x || 0);
    const y = Number(args.y || 0);
    const width = Number(args.width || 480);
    const height = Number(args.height || 216);
    const opacity = Number(args.opacity || 255);

    const chatWindow =
      SceneManager._scene && SceneManager._scene._chatLogWindow;
    if (chatWindow) {
      chatWindow.setWindowSize(width, height, x, y, opacity);
      manualPositionOverride = true;

      if (Number(args.paddingTop) >= 0) {
        paddingTop = Number(args.paddingTop);
      }
      if (Number(args.paddingBottom) >= 0) {
        paddingBottom = Number(args.paddingBottom);
      }
      if (Number(args.paddingLeft) >= 0) {
        paddingLeft = Number(args.paddingLeft);
      }
      if (Number(args.paddingRight) >= 0) {
        paddingRight = Number(args.paddingRight);
      }
      if (Number(args.lineSpacing) >= 0) {
        lineSpacing = Number(args.lineSpacing);
      }
      if (Number(args.fontSize) >= 0) {
        fontSize = Number(args.fontSize);
      }
      if (Number(args.iconSize) >= 0) {
        iconSize = Number(args.iconSize);
      }
      if (Number(args.scrollAmount) >= 0) {
        scrollAmount = Number(args.scrollAmount);
      }
      if (Number(args.defaultStampWidth) >= 0) {
        parameters["DefaultStampWidth"] = String(args.defaultStampWidth);
      }
      if (Number(args.defaultStampHeight) >= 0) {
        parameters["DefaultStampHeight"] = String(args.defaultStampHeight);
      }
      if (args.customBackgroundImage !== undefined) {
        if (args.customBackgroundImage.trim() !== "") {
          customBackgroundImage = args.customBackgroundImage.trim();
        } else {
          customBackgroundImage = "";
        }
        chatWindow.updateBackgroundImage();
      }
      if (args.fontName && args.fontName.trim() !== "") {
        fontName = args.fontName.trim();
      }

      chatWindow.redrawLog();
    } else {
      console.warn("⚠️ チャットウィンドウがまだ初期化されていません");
    }
  });

  //=============================================================================
  // ウィンドウサイズ変更+オプション項目
  //=============================================================================

  const OptionCommands = OnevASSISTANT.safeJsonParse(
    parameters["OptionCommands"],
    {}
  );
  const EnabledSizes = JSON.parse(parameters["EnabledSizes"] || "[]").map(
    Number
  );

  ConfigManager.alwaysDash = OptionCommands.alwaysDash === "true";
  ConfigManager.commandRemember = OptionCommands.commandRemember === "true";
  ConfigManager.touchUI = OptionCommands.touchUI === "true";
  ConfigManager.screenSize = 2;
  ConfigManager.fullScreen = false;
  ConfigManager.returnToTitle = OptionCommands.returnToTitle === "true";
  const showAlwaysDash = OptionCommands.showAlwaysDash === "true";
  const showCommandRemember = OptionCommands.showCommandRemember === "true";
  const showTouchUI = OptionCommands.showTouchUI === "true";
  const showReturnToTitle = OptionCommands.showReturnToTitle === "true";
  const showScreenSize = OptionCommands.showScreenSize === "true";
  const showFullScreen = OptionCommands.showFullScreen === "true";

  const SizeManager = {
    SIZES: {
      0: { width: 816, height: 624 },
      1: { width: 1024, height: 576 },
      2: { width: 1280, height: 720 },
      3: { width: 1600, height: 900 },
      4: { width: 1920, height: 1080 },
    },
    FILE_NAME: "windowsize",
    _savedApplied: false,
    resizeWindow(w, h) {
      const fw = window.outerWidth - window.innerWidth;
      const fh = window.outerHeight - window.innerHeight;
      window.resizeTo(w + fw, h + fh);
    },
    applySize(label) {
      ConfigManager.screenSize = label;
      this.save(label);
      if (!Graphics._isFullScreen()) {
        this.applyRecordedSize();
      }
    },
    applyRecordedSize() {
      const size = this.SIZES[ConfigManager.screenSize];
      if (size) this.resizeWindow(size.width, size.height);
    },
    save(label) {
      const data = {
        sizeLabel: label ?? ConfigManager.screenSize,
        isFullScreen: Graphics._isFullScreen(),
      };
      StorageManager.saveToLocalFile(
        this.FILE_NAME,
        JSON.stringify(data)
      ).catch(() => {});
    },
    async load() {
      try {
        const json = await StorageManager.loadFromLocalFile(this.FILE_NAME);
        return JSON.parse(json);
      } catch {
        return null;
      }
    },
    async applySaved() {
      if (this._savedApplied) return;
      this._savedApplied = true;

      const data = await this.load();
      if (!data) return;

      if (data.sizeLabel !== undefined && this.SIZES[data.sizeLabel]) {
        ConfigManager.screenSize = data.sizeLabel;
        this.applyRecordedSize();
      }
      if (data.isFullScreen && !Graphics._isFullScreen()) {
        Graphics._requestFullScreen();
      }
    },
    getClosestLabel() {
      const w = window.innerWidth,
        h = window.innerHeight;
      let closest = 0,
        minDiff = Infinity;
      for (const [label, size] of Object.entries(this.SIZES)) {
        const diff = Math.abs(size.width - w) + Math.abs(size.height - h);
        if (diff < minDiff) {
          closest = Number(label);
          minDiff = diff;
        }
      }
      return closest;
    },
    getLabels() {
      return EnabledSizes.filter((id) => this.SIZES.hasOwnProperty(id));
    },
    getSizeOptions() {
      return this.getLabels().map((id) => {
        const s = this.SIZES[id];
        return `${s.width}×${s.height}`;
      });
    },
  };

  const _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function () {
    const config = _ConfigManager_makeData.call(this);
    config.screenSize = this.screenSize;
    config.fullScreen = this.fullScreen;
    return config;
  };

  const _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    _ConfigManager_applyData.call(this, config);
    this.screenSize = Number.isInteger(config.screenSize)
      ? config.screenSize
      : 0;
    this.fullScreen =
      typeof config.fullScreen === "boolean" ? config.fullScreen : false;
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    SizeManager.applySaved();
  };

  let _prevFullScreen = Graphics._isFullScreen();
  const _SceneManager_updateMain = SceneManager.updateMain;
  SceneManager.updateMain = function () {
    _SceneManager_updateMain.call(this);
    const now = Graphics._isFullScreen();
    if (_prevFullScreen && !now) SizeManager.applyRecordedSize();
    _prevFullScreen = now;
  };

  const _SceneManager_terminate = SceneManager.terminate;
  SceneManager.terminate = function () {
    SizeManager.save();
    _SceneManager_terminate.call(this);
  };
  window.changeWindowSize = (label) => SizeManager.applySize(label);
  window.toggleFullScreen = () => Graphics._switchFullScreen();
  const _Window_Options_addGeneralOptions =
    Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function () {
    _Window_Options_addGeneralOptions.call(this);
    if (showScreenSize) this.addCommand("画面サイズ", "screenSize");
    if (showFullScreen) this.addCommand("フルスクリーン", "fullScreen");
  };

  const _Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function (index) {
    const symbol = this.commandSymbol(index);
    const value = this.getConfigValue(symbol);
    if (symbol === "screenSize") {
      const labels = SizeManager.getLabels();
      const options = SizeManager.getSizeOptions();
      const idx = labels.indexOf(value);
      return options[idx] || "";
    } else if (symbol === "fullScreen") {
      return value ? "ON" : "OFF";
    } else if (symbol === "returnToTitle") {
      return "";
    }
    return _Window_Options_statusText.call(this, index);
  };

  const _Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function () {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    const value = this.getConfigValue(symbol);
    if (symbol === "screenSize") {
      const labels = SizeManager.getLabels();
      const i = labels.indexOf(value);
      const next = (i + 1) % labels.length;
      const val = labels[next];
      this.changeValue(symbol, val);
      SizeManager.applySize(val);
    } else if (symbol === "fullScreen") {
      this.changeValue(symbol, !value);
      if (this.getConfigValue(symbol) !== Graphics._isFullScreen()) {
        Graphics._switchFullScreen();
      }
    } else if (symbol === "returnToTitle") {
      SoundManager.playOk();
      SceneManager.goto(Scene_Title);
    } else {
      _Window_Options_processOk.call(this);
    }
  };

  const _Window_Options_makeCommandList =
    Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function () {
    _Window_Options_makeCommandList.call(this);
    this._list = this._list.filter((cmd) => {
      if (cmd.symbol === "alwaysDash" && !showAlwaysDash) return false;
      if (cmd.symbol === "commandRemember" && !showCommandRemember)
        return false;
      if (cmd.symbol === "touchUI" && !showTouchUI) return false;
      return true;
    });
    if (showReturnToTitle) this.addCommand("タイトルに戻る", "returnToTitle");
    this.addCommand("閉じる", "close", false);
  };

  const _Window_Options_drawItem = Window_Options.prototype.drawItem;
  Window_Options.prototype.drawItem = function (index) {
    if (this.commandSymbol(index) === "close") {
      const rect = this.itemRect(index);
      this.resetTextColor();
      this.changePaintOpacity(true);
      this.drawText(
        this.commandName(index),
        rect.x,
        rect.y,
        rect.width,
        "center"
      );
    } else {
      _Window_Options_drawItem.call(this, index);
    }
  };

  const _Window_Options_processOkClose = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function () {
    const symbol = this.commandSymbol(this.index());
    if (symbol === "close") SceneManager.pop();
    else _Window_Options_processOkClose.call(this);
  };

  function overrideTouchUIButton(sceneClass) {
    const _createButtons = sceneClass.prototype.createButtons;
    sceneClass.prototype.createButtons = function () {
      _createButtons.call(this);
      if (!showTouchUI && this._buttonTouchUI) {
        this._buttonTouchUI.visible = false;
        this.removeChild(this._buttonTouchUI);
        this._buttonTouchUI = null;
      }
    };
  }

  overrideTouchUIButton(Scene_Title);
  overrideTouchUIButton(Scene_MenuBase);
  overrideTouchUIButton(Scene_Options);

  const _Scene_Map_createMenuButton = Scene_Map.prototype.createMenuButton;
  Scene_Map.prototype.createMenuButton = function () {
    _Scene_Map_createMenuButton.call(this);
    if (!showTouchUI && this._menuButton) {
      this._menuButton.visible = false;
      this.removeChild(this._menuButton);
      this._menuButton = null;
    }
  };

  const _Scene_Map_createButtons = Scene_Map.prototype.createButtons;
  Scene_Map.prototype.createButtons = function () {
    _Scene_Map_createButtons.call(this);
    if (!showTouchUI && this._buttonTouchUI) {
      this._buttonTouchUI.visible = false;
      this.removeChild(this._buttonTouchUI);
      this._buttonTouchUI = null;
    }
  };

  //=============================================================================
  // 点滅+移動制御
  //=============================================================================

  ("use strict");
  const disablePointer = parameters["disablePointer"] === "true";
  const moveSwitchId = Number(parameters["MoveSwitch"] || 10);
  const _Sprite_Destination_update = Sprite_Destination.prototype.update;
  Sprite_Destination.prototype.update = function () {
    if (disablePointer) {
      Sprite.prototype.update.call(this);
      this.visible = false;
    } else {
      _Sprite_Destination_update.call(this);
    }
  };
  const _Game_Player_executeMove = Game_Player.prototype.executeMove;
  Game_Player.prototype.executeMove = function (direction) {
    if (!$gameSwitches.value(moveSwitchId)) {
      _Game_Player_executeMove.call(this, direction);
    }
  };

  //=============================================================================
  // 複数会話ウィンドウ
  //=============================================================================
  const CHARS_PER_FRAME = 1;
  const CHAR_INTERVAL_FRAMES = 2;
  const WAIT_DOT_FRAMES = 15;
  const WAIT_BAR_FRAMES = 60;
  const FAST_WHILE_PRESSED = true;

  const DEBUG_FreeMsg = false;
  const dbg = (...a) => {
    if (!DEBUG_FreeMsg) return;
    const handler = window.OnevASSISTANT?.logDebug;
    if (typeof handler === "function") {
      handler("[FreeMsg]", ...a);
    }
  };

  const num = (s) => Number(s || 0);
  const str = (s) => (s != null ? String(s) : "");
  const bool = (s) => String(s) === "true";

  const stripQuotes = (s) => {
    const t = str(s).trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      return t.substring(1, t.length - 1);
    }
    return t;
  };

  const preprocessText = (s) => {
    let r = String(s ?? "");
    const PH = "\uE000__KEEP_N__";
    r = r.replace(/\\\\n/g, PH);
    r = r.replace(/\\\\/g, "\\");
    r = r.replace(/\\n/g, "\n");
    while (r.indexOf(PH) >= 0) r = r.replace(PH, "\\n");
    return r;
  };

  const getPadding = (win) =>
    typeof win.padding === "function"
      ? win.padding()
      : Number(win.padding || 0);

  const setPadding = (win, value) => {
    if (value < 0) return;
    if (typeof win.padding === "function") {
      win._paddingCustom = value;
      win.padding = function () {
        return this._paddingCustom;
      };
    } else {
      win.padding = value;
    }
    if (typeof win.updatePadding === "function") win.updatePadding();
  };

  const parseArgs = (args) => ({
    id: num(args.id) || 1,
    text: stripQuotes(args.text),
    x: num(args.x),
    y: num(args.y),
    anchorX: args.anchorX || "left",
    background: args.background || "window",
    backgroundImage: str(args.backgroundImage),
    opacity: Math.min(255, Math.max(0, num(args.opacity) || 255)),
    backOpacity: Math.min(255, Math.max(0, num(args.backOpacity) || 192)),
    padding: num(args.padding),
    fontSize: num(args.fontSize),
    fontColor: str(args.fontColor),
    outlineColor: str(args.outlineColor),
    outlineWidth: num(args.outlineWidth),
    windowskin: str(args.windowskin),
    waitInput: bool(args.waitInput),
    closeOnConfirm: bool(args.closeOnConfirm),
    tailImage: str(args.tailImage),
    tailPosition: args.tailPosition || "none",
    tailOffsetX: num(args.tailOffsetX),
    tailOffsetY: num(args.tailOffsetY),
  });

  const param = PluginManager.parameters(PLUGIN_NAME);
  function parseStructArray(json) {
    try {
      return JSON.parse(json || "[]").map((e) => JSON.parse(e));
    } catch (_) {
      return [];
    }
  }
  const _rawPresets = parseStructArray(param.Presets);
  const PresetMap = new Map();
  for (const p of _rawPresets) {
    if (!p || !p.name) continue;
    const opt = {
      x: num(p.x),
      y: num(p.y),
      anchorX: p.anchorX || "left",
      background: p.background || "window",
      backgroundImage: str(p.backgroundImage),
      opacity: Math.min(255, Math.max(0, num(p.opacity) || 255)),
      backOpacity: Math.min(255, Math.max(0, num(p.backOpacity) || 192)),
      padding: num(p.padding),
      fontSize: num(p.fontSize),
      fontColor: str(p.fontColor),
      outlineColor: str(p.outlineColor),
      outlineWidth: num(p.outlineWidth),
      windowskin: str(p.windowskin),
      tailImage: str(p.tailImage),
      tailPosition: p.tailPosition || "none",
      tailOffsetX: num(p.tailOffsetX),
      tailOffsetY: num(p.tailOffsetY),
    };
    PresetMap.set(String(p.name), opt);
  }

  const FreeMsg = {
    _windows: new Map(),
    _waiters: new Map(),

    show(opt, interpreter) {
      const id = opt.id || 1;
      let win = this._windows.get(id);
      const rect = new Rectangle(opt.x, opt.y, 24, 24);

      if (!win) {
        win = new Window_FreeMessage(rect, opt);
        win._freeMsgId = id;
        this._windows.set(id, win);
        this.addToScene(win);
      } else {
        win.applyOptions(opt);
        win.setText(opt.text);
        win.visible = true;
        win.open();
      }

      win._waitForInput = !!opt.waitInput;
      win._closeOnConfirm = !!opt.closeOnConfirm;

      if (opt.waitInput && interpreter) {
        this._waiters.set(interpreter, {
          id,
          resolved: false,
          closeOnConfirm: !!opt.closeOnConfirm,
        });
        interpreter.setWaitMode("freeMessage");
      }

      win.setupTail?.();
    },

    addToScene(win) {
      const scene = SceneManager._scene;
      if (scene && typeof scene.addWindow === "function") scene.addWindow(win);
    },

    resolveByWindow(id) {
      for (const [interp, w] of this._waiters) {
        if (w.id === id) {
          w.resolved = true;
          if (w.closeOnConfirm) this.close(id);
        }
      }
    },

    setText(id, text, waitInput, closeOnConfirm, interpreter) {
      const win = this._windows.get(id);
      if (!win) return;
      win.setText(text);
      if (typeof waitInput === "boolean") win._waitForInput = waitInput;
      if (typeof closeOnConfirm === "boolean")
        win._closeOnConfirm = closeOnConfirm;
      if (waitInput && interpreter) {
        this._waiters.set(interpreter, {
          id,
          resolved: false,
          closeOnConfirm: !!closeOnConfirm,
        });
        interpreter.setWaitMode("freeMessage");
      }
    },

    close(id) {
      if (id === -1) {
        for (const [i, w] of this._windows) {
          w._autoDestroy = true;
          w.close();
        }
        return;
      }
      const win = this._windows.get(id);
      if (win) {
        win._autoDestroy = true;
        win.close();
      }
    },

    erase(id) {
      this.close(id);
    },

    _destroyWindow(id) {
      const win = this._windows.get(id);
      if (!win) return;
      win._destroyTail?.();
      win.parent?.removeChild(win);
      try {
        win.destroy?.({ children: true });
      } catch (_e) {
        try {
          win.contents?.destroy?.();
        } catch (__) {}
      }
      this._windows.delete(id);
      dbg("destroy", { id });
    },
  };

  class Window_FreeMessage extends Window_Base {
    _isOutlineOff(v) {
      const t = (v ?? "").toString().trim();
      return !t || /^(transparent|none|off|0)$/i.test(t);
    }
    _resolveColor(v) {
      const t = (v ?? "").toString().trim();
      if (!t) return null;
      if (/^\d+$/.test(t)) return ColorManager.textColor(Number(t));
      return t;
    }

    resetFontSettings() {
      Window_Base.prototype.resetFontSettings.call(this);
      const size = Number(this._options?.fontSize || 0);
      if (size > 0) this.contents.fontSize = size;

      const baseColor = this._resolveColor(this._options?.fontColor);
      if (baseColor) this.changeTextColor(baseColor);

      const olRaw = this._options?.outlineColor;
      if (this._isOutlineOff(olRaw)) {
        this.contents.outlineWidth = 0;
        this.contents.outlineColor = "rgba(0,0,0,0)";
      } else {
        const ol = this._resolveColor(olRaw);
        if (ol) this.contents.outlineColor = ol;
      }
      const ow = Number(this._options?.outlineWidth);
      if (!isNaN(ow) && ow >= 0) this.contents.outlineWidth = ow;
    }
    resetTextColor() {
      Window_Base.prototype.resetTextColor.call(this);
      const baseColor = this._resolveColor(this._options?.fontColor);
      if (baseColor) this.changeTextColor(baseColor);
    }

    initialize(rect, options) {
      super.initialize(rect);
      this._options = options;
      this._baseX = options.x;
      this._baseY = options.y;
      this.openness = 255;
      this._backgroundSprite = null;
      this.applyOptions(options);
      this.setText(options.text);
      this._waitForInput = !!options.waitInput;
      this._closeOnConfirm = !!options.closeOnConfirm;
      this._autoDestroy = false;
      this._tailSprite = null;
    }

    applyOptions(opt) {
      this._options = Object.assign(this._options || {}, opt);
      this._baseX = opt.x;
      this._baseY = opt.y;
      if (opt.background === "image" && opt.backgroundImage) {
        this._setupBackgroundImage(opt.backgroundImage);
        this.opacity = 0;
        this.backOpacity = 0;
      } else {
        this._destroyBackgroundImage();
        this.opacity = opt.background === "transparent" ? 0 : opt.opacity;
        this.backOpacity =
          opt.background === "transparent" ? 0 : opt.backOpacity;
      }

      if (opt.padding >= 0) setPadding(this, opt.padding);
      this.resetFontSettings();
      if (opt.windowskin)
        this.windowskin = ImageManager.loadSystem(opt.windowskin);
    }

    setText(text) {
      this._textRaw = stripQuotes(text || "");
      this._textConverted = this.convertEscapeCharacters(
        preprocessText(this._textRaw)
      );

      this.resizeForText();
      this.resetFontSettings();
      this.contents.clear();
      this._waitCount = 0;
      this._pauseInput = false;
      this._finished = false;
      this._charsPerFrame = CHARS_PER_FRAME;
      this._instantMode = false;
      this._confirmReady = false;
      this._charWait = 0;
      this._fastGuard = 10;

      this._textState = this.createTextState(
        this._textConverted,
        0,
        0,
        this.innerWidth
      );
      this._textState.drawing = true;
    }

    appendText(text) {
      this._textRaw = (this._textRaw || "") + stripQuotes(text || "");
      this._textConverted = this.convertEscapeCharacters(
        preprocessText(this._textRaw)
      );
      this.setText(this._textRaw);
    }

    _tailBitmap() {
      const name = (this._options?.tailImage || "").trim();
      if (!name) return null;
      return ImageManager.loadSystem(name);
    }
    _tailAnchor(pos) {
      switch (pos || "none") {
        case "lt":
          return [0, 0];
        case "ct":
          return [0.5, 0];
        case "rt":
          return [1, 0];
        case "lb":
          return [0, 1];
        case "cb":
          return [0.5, 1];
        case "rb":
          return [1, 1];
        default:
          return [0.5, 1];
      }
    }
    _tailAnchorPoint(pos) {
      const x = this.x,
        y = this.y,
        w = this.width,
        h = this.height;
      switch (pos || "none") {
        case "lt":
          return [x, y];
        case "ct":
          return [x + w / 2, y];
        case "rt":
          return [x + w, y];
        case "lb":
          return [x, y + h];
        case "cb":
          return [x + w / 2, y + h];
        case "rb":
          return [x + w, y + h];
        default:
          return [x + w / 2, y + h];
      }
    }
    setupTail() {
      this._destroyTail();
      const pos = this._options?.tailPosition || "none";
      const name = (this._options?.tailImage || "").trim();
      if (pos === "none" || !name) return;
      const bmp = this._tailBitmap();
      if (!bmp) return;

      const sp = new Sprite(bmp);
      const [ax, ay] = this._tailAnchor(pos);
      sp.anchor.set(ax, ay);
      sp.alpha = this.openness === 255 ? 1 : 0;
      sp.visible = this.visible;
      this._tailSprite = sp;

      const p = this.parent ?? SceneManager._scene;
      p?.addChild(sp);
      this._updateTailPosition(true);
    }
    _destroyTail() {
      if (this._tailSprite) {
        this._tailSprite.parent?.removeChild(this._tailSprite);
        try {
          this._tailSprite.destroy();
        } catch (_) {}
        this._tailSprite = null;
      }
    }

    _setupBackgroundImage(imageName) {
      this._destroyBackgroundImage();
      if (!imageName) return;

      const bitmap = ImageManager.loadPicture(imageName);
      this._backgroundSprite = new Sprite(bitmap);
      this._backgroundSprite.anchor.set(0, 0);
      this.addChildAt(this._backgroundSprite, 0);

      bitmap.addLoadListener(() => {
        this._updateBackgroundImage();
      });
    }
    _destroyBackgroundImage() {
      if (this._backgroundSprite) {
        this.removeChild(this._backgroundSprite);
        try {
          this._backgroundSprite.destroy();
        } catch (_) {}
        this._backgroundSprite = null;
      }
    }
    _updateBackgroundImage() {
      if (!this._backgroundSprite || !this._backgroundSprite.bitmap) return;
      const bgBitmap = this._backgroundSprite.bitmap;
      if (bgBitmap.isReady()) {
        this._backgroundSprite.scale.x = this.width / bgBitmap.width;
        this._backgroundSprite.scale.y = this.height / bgBitmap.height;
        this._backgroundSprite.x = 0;
        this._backgroundSprite.y = 0;
      }
    }

    _updateTailPosition(force = false) {
      const sp = this._tailSprite;
      if (!sp) return;
      const pos = this._options?.tailPosition || "none";
      const [bx, by] = this._tailAnchorPoint(pos);
      const ox = Number(this._options?.tailOffsetX || 0);
      const oy = Number(this._options?.tailOffsetY || 0);
      const nx = Math.round(bx + ox);
      const ny = Math.round(by + oy);
      if (force || sp.x !== nx || sp.y !== ny) {
        sp.x = nx;
        sp.y = ny;
      }
      sp.alpha = this.openness === 255 ? 1 : 0;
      sp.visible = this.visible;
    }

    _processOnePrintable(textState) {
      if (!textState || !textState.text) return 0;
      if (textState.index >= textState.text.length) return 0;
      for (;;) {
        if (textState.index >= textState.text.length) return 0;

        const prevX = textState.x;
        const prevY = textState.y;
        const prevIndex = textState.index;
        const prevWait = this._waitCount;
        const prevPause = this._pauseInput;
        this.processCharacter(textState);
        if (this._waitCount > prevWait || (!prevPause && this._pauseInput)) {
          return 0;
        }

        const movedX = textState.x !== prevX;
        const movedY = textState.y !== prevY;
        const advanced = textState.index > prevIndex;

        if (advanced && movedX) {
          return 1;
        }
      }
    }

    update() {
      super.update();
      this._updateTailPosition();
      if (this._fastGuard > 0) this._fastGuard--;
      if (!this.isOpen()) {
        if (this._autoDestroy && this.openness === 0) {
          FreeMsg._destroyWindow(this._freeMsgId);
        }
        return;
      }

      if (this._finished && this._waitForInput) {
        if (!this._confirmReady) {
          this._confirmReady = true;
          return;
        }
        const triggered =
          Input.isTriggered("ok") ||
          Input.isTriggered("cancel") ||
          TouchInput.isTriggered();
        if (triggered) {
          FreeMsg.resolveByWindow(this._freeMsgId);
          if (this._closeOnConfirm) FreeMsg.close(this._freeMsgId);
        }
        return;
      }

      const fastPressed =
        FAST_WHILE_PRESSED &&
        this._fastGuard <= 0 &&
        (Input.isPressed("ok") ||
          Input.isPressed("shift") ||
          TouchInput.isPressed());
      const skipTriggered =
        Input.isTriggered("ok") ||
        TouchInput.isTriggered() ||
        Input.isTriggered("cancel");

      if (skipTriggered) {
        this._waitCount = 0;
        this._pauseInput = false;
        this._charWait = 0;
      }
      if (this._pauseInput) {
        if (!skipTriggered) return;
        this._pauseInput = false;
      }
      if (this._waitCount > 0) {
        this._waitCount--;
        return;
      }

      const slowMode = !fastPressed && !this._instantMode;
      if (slowMode && this._charWait > 0) {
        this._charWait--;
        return;
      }

      const target =
        fastPressed || this._instantMode ? 9999 : this._charsPerFrame;
      let printed = 0;

      while (this._textState && printed < target) {
        if (
          !this._textState.text ||
          this._textState.index >= this._textState.text.length
        )
          break;
        const gained = this._processOnePrintable(this._textState);
        printed += gained;
        if (!this._textState || this._pauseInput || this._waitCount > 0) break;
        if (slowMode && gained > 0) break;
      }

      if (slowMode && printed > 0)
        this._charWait = Math.max(0, CHAR_INTERVAL_FRAMES);

      if (
        this._textState &&
        this._textState.text &&
        this._textState.index >= this._textState.text.length
      ) {
        this._textState = null;
        this._finished = true;
        this.finalRedraw();
      }
    }

    finalRedraw() {
      const fullText =
        this._textConverted ??
        this.convertEscapeCharacters(preprocessText(this._textRaw || ""));
      this.contents.clear();
      this.resetFontSettings();
      this.drawTextEx(fullText, 0, 0, this.innerWidth);
    }

    processEscapeCharacter(code, textState) {
      switch (code) {
        case ".":
          if (textState.drawing) this._waitCount = WAIT_DOT_FRAMES;
          return;
        case "|":
          if (textState.drawing) this._waitCount = WAIT_BAR_FRAMES;
          return;
        case "!":
          if (textState.drawing) this._pauseInput = true;
          return;
        case ">":
          if (textState.drawing) this._instantMode = true;
          return;
        case "<":
          if (textState.drawing) this._instantMode = false;
          return;
        case "n":
          this.processNewLine(textState);
          return;
        case "OW": {
          const p = this.obtainEscapeParam(textState);
          if (textState.drawing && p != null)
            this.contents.outlineWidth = Number(p) || 0;
          return;
        }
        default:
          Window_Base.prototype.processEscapeCharacter.call(
            this,
            code,
            textState
          );
      }
    }

    resizeForText() {
      if (!this._backSprite || !this._frameSprite) {
        return;
      }

      const pad = getPadding(this);
      const raw = this._textRaw || "";
      const text =
        this._textConverted ??
        this.convertEscapeCharacters(preprocessText(raw));
      const anchor = this._options?.anchorX || "left";

      this.resetFontSettings();

      const ts = this.createTextState(text, 0, 0, 0x7fffffff);
      ts.drawing = false;
      this.processAllText(ts);
      const measuredH = Math.ceil(ts.outputHeight || 0);

      const lines = text.split("\n");
      let maxW = 0;
      for (const line of lines) {
        const s = this.textSizeEx(line);
        const w = s && typeof s.width === "number" ? s.width : 0;
        if (w > maxW) maxW = w;
      }

      const width = Math.max(48, Math.ceil(maxW + pad * 2 + 4));
      const height = Math.max(24, Math.ceil(measuredH + pad * 2 + 4));

      const bx = Number(this._baseX ?? this.x);
      const by = Number(this._baseY ?? this.y);
      let nx;
      if (anchor === "center") nx = Math.round(bx - width / 2);
      else if (anchor === "right") nx = Math.round(bx - width);
      else nx = bx;
      let ny = by;

      const gw = Graphics.width,
        gh = Graphics.height;
      if (nx + width > gw) nx = Math.max(0, gw - width);
      if (ny + height > gh) ny = Math.max(0, gh - height);

      this.x = nx || 0;
      this.y = ny || 0;

      if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this.createContents();
        if (this._backSprite && this._frameSprite) {
          this._refreshAllParts();
        }
      }

      this._updateBackgroundImage();
      this._updateTailPosition(true);
    }
  }

  const _updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === "freeMessage") {
      const w = FreeMsg._waiters.get(this);
      if (!w) {
        this._waitMode = "";
        return false;
      }
      if (w.resolved) {
        FreeMsg._waiters.delete(this);
        this._waitMode = "";
        return false;
      }
      return true;
    }
    return _updateWaitMode.apply(this, arguments);
  };

  PluginManager.registerCommand(PLUGIN_NAME, "show", function (args) {
    const opt = parseArgs(args);
    FreeMsg.show(opt, this);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "showPreset", function (args) {
    const id = num(args.id) || 1;
    const name = stripQuotes(args.presetName || "");
    const base = PresetMap.get(name);
    const preset = base || {
      x: 0,
      y: 0,
      anchorX: "left",
      background: "window",
      backgroundImage: "",
      opacity: 255,
      backOpacity: 192,
      padding: -1,
      fontSize: 0,
      fontColor: "",
      outlineColor: "",
      outlineWidth: 4,
      windowskin: "",
      tailImage: "",
      tailPosition: "none",
      tailOffsetX: 0,
      tailOffsetY: 0,
    };
    const opt = Object.assign({}, preset, {
      id,
      text: stripQuotes(args.text || ""),
      waitInput: bool(args.waitInput),
      closeOnConfirm: bool(args.closeOnConfirm),
    });
    FreeMsg.show(opt, this);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setText", function (args) {
    const id = num(args.id) || 1;
    const text = str(args.text);
    const wait = bool(args.waitInput);
    const close = bool(args.closeOnConfirm);
    FreeMsg.setText(id, text, wait, close, this);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "close", (args) => {
    const id = num(args.id) || 1;
    FreeMsg.close(id);
  });

  const _Scene_Map_terminate_FreeMsg = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    _Scene_Map_terminate_FreeMsg.call(this);
    for (const [id, win] of FreeMsg._windows) {
      try {
        win._destroyTail?.();
        win.parent?.removeChild(win);
        win.destroy?.({ children: true });
      } catch (e) {}
    }
    FreeMsg._windows.clear();
    FreeMsg._waiters.clear();
  };

  //=============================================================================
  // オノマトペ機能
  //=============================================================================

  const PARAMS = PluginManager.parameters(PLUGIN_NAME);
  const PRESETS = JSON.parse(PARAMS["Presets"] || "[]");

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ表示", (args) => {
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const imageName = args.image || args["画像ファイル名"] || "s_sandoll";
    const x = Number(args.x || args["X座標"] || 400);
    const y = Number(args.y || args["Y座標"] || 300);
    const duration = Number(args.duration || args["表示時間"] || 60);
    const fadeIn = Number(args.fadeIn || args["フェードイン時間"] || 10);
    const fadeOut = Number(args.fadeOut || args["フェードアウト時間"] || 10);
    const scaleStart = Number(args.scaleStart || args["開始スケール"] || 0.5);
    const scaleEnd = Number(args.scaleEnd || args["終了スケール"] || 1.2);
    const rotationStart = Number(
      args.rotationStart || args["開始回転角度"] || 0
    );
    const rotationEnd = Number(args.rotationEnd || args["終了回転角度"] || 0);
    const easing = args.easing || args["イージングタイプ"] || "easeOutQuad";

    const param = {
      name: imageName,
      startX: x,
      startY: y,
      targetX: x,
      targetY: y - 100,
      startScale: Math.round(scaleStart * 100),
      targetScale: Math.round(scaleEnd * 100),
      startOpacity: 0,
      targetOpacity: 255,
      duration: duration,
      loops: 1,
      easingType: easing,
      easingOpacityType: "linear",
      rndX: 0,
      rndY: 0,
      rndOnLoop: "false",
      fadeIn: fadeIn,
      fadeOut: fadeOut,
      rotationStart: rotationStart,
      rotationEnd: rotationEnd,
    };

    const onomatopoeia = new Sprite_Onomatopoeia(param);
    onomatopoeia.startEase();
    SceneManager._scene.addChild(onomatopoeia);

    if ($gameTemp._onmtpManager._storeData["custom"] === undefined) {
      $gameTemp._onmtpManager._storeData["custom"] = [];
    }
    $gameTemp._onmtpManager._storeData["custom"].push(onomatopoeia);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "プリセット呼出", (args) => {
    const presetNum = parseInt(args.presetNumber || "1") - 1;
    if (PRESETS.length > presetNum) {
      if ($gameTemp._onmtpManager === null) {
        $gameTemp._onmtpManager = new OnomatopoeiaManager();
      }
      $gameTemp._onmtpManager.add(presetNum);
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ削除", (args) => {
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const target = args.target || "all";
    if (target === "all") {
      var currentScene = SceneManager._scene;
      Object.keys($gameTemp._onmtpManager._storeData).forEach((key) => {
        $gameTemp._onmtpManager._storeData[key].forEach((data) => {
          currentScene.removeChild(data);
        });
      });
      $gameTemp._onmtpManager._storeData = {};
    } else if (target === "preset") {
      const presetNum = parseInt(args.presetNumber || "1") - 1;
      if (PRESETS.length > presetNum) {
        $gameTemp._onmtpManager.removePreset(presetNum);
      }
    } else if (target === "custom") {
      if ($gameTemp._onmtpManager._storeData["custom"]) {
        var currentScene = SceneManager._scene;
        $gameTemp._onmtpManager._storeData["custom"].forEach((data) => {
          currentScene.removeChild(data);
        });
        delete $gameTemp._onmtpManager._storeData["custom"];
      }
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ表示", (args) => {
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const param = {
      name: args.image || "s_sandoll",
      startX: Number(args.startX || 400),
      startY: Number(args.startY || 300),
      targetX: Number(args.targetX || 400),
      targetY: Number(args.targetY || 200),
      startScale: Number(args.startScale || 100),
      targetScale: Number(args.targetScale || 150),
      startOpacity: Number(args.startOpacity || 255),
      targetOpacity: Number(args.targetOpacity || 0),
      duration: Number(args.duration || 60),
      loops: Number(args.loops || 0),
      rndX: Number(args.rndX || 0),
      rndY: Number(args.rndY || 0),
      rndOnLoop: String(args.rndOnLoop || "false"),
      easingType: args.easingType || "linear",
      easingOpacityType: args.easingOpacityType || "linear",
    };

    const onomatopoeia = new Sprite_Onomatopoeia(param);
    onomatopoeia.startEase();
    SceneManager._scene.addChild(onomatopoeia);

    if ($gameTemp._onmtpManager._storeData["custom"] === undefined) {
      $gameTemp._onmtpManager._storeData["custom"] = [];
    }
    $gameTemp._onmtpManager._storeData["custom"].push(onomatopoeia);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "プリセット呼出", (args) => {
    const presetNum = parseInt(args.presetNumber || "1") - 1;
    if (PRESETS.length > presetNum) {
      if ($gameTemp._onmtpManager === null) {
        $gameTemp._onmtpManager = new OnomatopoeiaManager();
      }
      $gameTemp._onmtpManager.add(presetNum);
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ削除", (args) => {
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const all = args.all !== "false";
    if (all) {
      var currentScene = SceneManager._scene;
      Object.keys($gameTemp._onmtpManager._storeData).forEach((key) => {
        $gameTemp._onmtpManager._storeData[key].forEach((data) => {
          currentScene.removeChild(data);
        });
      });
      $gameTemp._onmtpManager._storeData = {};
    } else {
      if (
        $gameTemp._onmtpManager._storeData["custom"] &&
        $gameTemp._onmtpManager._storeData["custom"].length > 0
      ) {
        var currentScene = SceneManager._scene;
        var lastItem = $gameTemp._onmtpManager._storeData["custom"].pop();
        currentScene.removeChild(lastItem);
      }
    }
  });

  const _Game_Interpreter_pluginCommand_Onmtp =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand_Onmtp.apply(this, arguments);

    if (args.length < 1) {
      return;
    }

    var option = "start";
    if (args.length >= 2) {
      option = args[1].toLowerCase();
    }

    var cmd = command.toLowerCase();
    if (cmd === "omtp") {
      if ($gameTemp._onmtpManager === null) {
        $gameTemp._onmtpManager = new OnomatopoeiaManager();
      }
      switch (option) {
        case "start":
          var presetNum = parseInt(args[0]) - 1;
          if (PRESETS.length > presetNum) {
            $gameTemp._onmtpManager.add(presetNum);
          }
          break;
        case "delete":
          var presetNum = parseInt(args[0]) - 1;
          if (PRESETS.length > presetNum) {
            $gameTemp._onmtpManager.removePreset(presetNum);
          }
          break;
      }
    }
  };

  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _Game_Map_setup.call(this, mapId);
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }
    $gameTemp._onmtpManager._mapId = -1;
  };

  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this._onmtpManager = null;
  };

  const _Scene_Base_isReady = Scene_Base.prototype.isReady;
  Scene_Base.prototype.isReady = function () {
    if ($gameTemp !== null) {
      if ($gameTemp._onmtpManager !== null) {
        $gameTemp._onmtpManager.restore();
      }
    }
    return _Scene_Base_isReady.call(this);
  };

  class Sprite_Onomatopoeia extends Sprite {
    constructor(param, time = 0, loopTime = 0, rndPosition = { x: 0, y: 0 }) {
      super();

      this.visible = false;
      this.z = 10;
      this.anchor.set(0.5, 0.5);
      this._param = param;
      this._startPosition = {
        x: Number(param.startX),
        y: Number(param.startY),
      };
      this._targetPosition = {
        x: Number(param.targetX),
        y: Number(param.targetY),
      };
      this._startScale = {
        x: Number(param.startScale) / 100.0,
        y: Number(param.startScale) / 100.0,
      };
      this._targetScale = {
        x: Number(param.targetScale) / 100,
        y: Number(param.targetScale) / 100,
      };
      this._baseScale =
        Number(param.baseScale || param.startScale || 100) / 100.0;
      this._maxScale = Number(param.maxScale || 200) / 100.0;
      this._minScale = Number(param.minScale || 50) / 100.0;
      this._rndPosition = {
        x: (Math.random() * 100 * Number(param.rndX || 0)) / 100,
        y: (Math.random() * 100 * Number(param.rndY || 0)) / 100,
      };

      this._targetRndPosition = {
        x: (Math.random() * 100 * Number(param.targetRndX || 0)) / 100,
        y: (Math.random() * 100 * Number(param.targetRndY || 0)) / 100,
      };

      this._startOpacity = Number(param.startOpacity);
      this._targetOpacity = Number(param.targetOpacity);
      this.bitmap = ImageManager.loadPicture(param.name || "s_sandoll");
      this._duration = 0;
      this._time = time;
      this._loopTime = loopTime;
      this._waitTime = 0;
      this._isWaiting = false;
      const eff = (param && param.effect) || {};
      this._effect = {
        type: (eff.type || "none").toString(),
        ampX: Number(eff.ampX || 0),
        ampY: Number(eff.ampY || 0),
        speed: Number(eff.speed || 0.1),
        decay: Number(eff.decay || 0),
      };
      this._effectT = 0;
      this._isFadingOut = false;
      this._fadeOutDuration = 0;
      this._fadeOutTime = 0;
      this._fadeOutStartOpacity = 0;
      this._seSettings = param.seSettings || null;
    }

    _playRandomSe() {
      if (!this._seSettings) return;
      
      try {
        const seListRaw = this._seSettings.seList ? 
          (typeof this._seSettings.seList === "string" ? JSON.parse(this._seSettings.seList) : this._seSettings.seList) : [];
        if (seListRaw.length > 0) {
          const seList = seListRaw.map(item => typeof item === "string" ? JSON.parse(item) : item);
          const randomIndex = Math.floor(Math.random() * seList.length);
          const selectedSe = seList[randomIndex];
          if (selectedSe && selectedSe.name) {
            AudioManager.playSe({
              name: selectedSe.name,
              volume: Number(selectedSe.volume ?? 90),
              pitch: Number(selectedSe.pitch ?? 100),
              pan: Number(selectedSe.pan ?? 0)
            });
          }
        }
      } catch (e) {
        console.warn("[Onomatopoeia] SE再生エラー:", e);
      }
    }

    startFadeOut(duration) {
      if (duration <= 0) {
        this.visible = false;
        if (this._customId && $gameTemp._onmtpManager) {
          $gameTemp._onmtpManager.removeById(this._customId);
        } else {
          $gameTemp._onmtpManager.remove(this);
        }
        return;
      }
      this._isFadingOut = true;
      this._fadeOutDuration = duration;
      this._fadeOutTime = 0;
      this._fadeOutStartOpacity = this.opacity;
    }

    update() {
      if (this._isFadingOut) {
        this._fadeOutTime++;
        const t = Math.min(this._fadeOutTime / this._fadeOutDuration, 1);
        this.opacity = this._fadeOutStartOpacity * (1 - t);
        if (this._fadeOutTime >= this._fadeOutDuration) {
          this.visible = false;
          if (this._customId && $gameTemp._onmtpManager) {
            $gameTemp._onmtpManager.removeById(this._customId);
          } else {
            $gameTemp._onmtpManager.remove(this);
          }
        }
        return;
      }

      if (this._isWaiting) {
        this._waitTime++;
        const loopWait = Number(this._param.loopWait || 0);
        if (this._waitTime >= loopWait) {
          this._isWaiting = false;
          this._waitTime = 0;
          this.startEase(false);
        }
        return;
      }

      if (this._time < this._duration) {
        this._time++;
        const baseX = this.updateEasing(this._easingX);
        const baseY = this.updateEasing(this._easingY);
        let baseScale = this.updateScaleEasing(this._easingScale);
        let baseOpacity = this.updateEasing(this._easingOpacity);
        let xOff = 0;
        let yOff = 0;
        let opAdd = 0;
        if (this._effect && this._effect.type && this._effect.type !== "none") {
          const prog =
            this._duration > 0 ? Math.min(1, this._time / this._duration) : 1;
          const decayMul = Math.max(0, 1 - (this._effect.decay || 0) * prog);
          this._effectT += this._effect.speed || 0.1;
          const t = this._effectT;
          const ax = (this._effect.ampX || 0) * decayMul;
          const ay = (this._effect.ampY || 0) * decayMul;

          switch (this._effect.type) {
            case "shake":
              xOff = (Math.random() * 2 - 1) * ax;
              yOff = (Math.random() * 2 - 1) * ay;
              break;
            case "float":
              xOff = Math.sin(t) * ax;
              yOff = Math.sin(t) * ay;
              break;
            case "wave":
              xOff = Math.sin(t) * ax;
              yOff = Math.sin(t * 0.8) * ay;
              break;
            case "bounce":
              yOff = -Math.abs(Math.sin(t)) * ay;
              xOff = Math.sin(t * 0.5) * ax * 0.5;
              break;
            default:
              break;
          }

          const fadeOutThreshold = 0.8;
          if (prog > fadeOutThreshold) {
            const fadeT = (prog - fadeOutThreshold) / (1 - fadeOutThreshold);
            const fadeMul = 1 - fadeT;
            xOff *= fadeMul;
            yOff *= fadeMul;
          }
        }

        this.x = baseX + xOff;
        this.y = baseY + yOff;
        const finalScale = Math.max(
          this._minScale || 0,
          Math.min(this._maxScale || Infinity, baseScale)
        );
        this.scale.set(finalScale, finalScale);
        this.opacity = Math.max(0, Math.min(255, baseOpacity + opAdd));
        if (this._time >= this._duration) {
          this._loopTime++;
          this._duration = 0;
          this._time = 0;
          this.endEase();
        }
      }
    }

    updateEasing(easing) {
      const easingFunc = window.OnevASSISTANT.Easing[easing.f] || window.OnevASSISTANT.Easing.linear;
      const progress = this._time / this._duration;
      return easing.b + easing.c * easingFunc(progress);
    }

    updateScaleEasing(easing) {
      const easingType = easing.f;
      const easingFunc = window.OnevASSISTANT.Easing[easingType] || window.OnevASSISTANT.Easing.linear;
      const progress = this._time / this._duration;
      let result;

      if (
        (easingType.includes("Back") ||
          easingType.includes("Elastic") ||
          easingType.includes("Bounce")) &&
        easing.c === 0
      ) {
        const tempB = easing.base;
        const tempC = easing.max - easing.base;
        result = tempB + tempC * easingFunc(progress);

        if (progress > 0.5) {
          const returnProgress = (progress - 0.5) * 2;
          const targetValue = easing.b + easing.c;
          result = result + (targetValue - result) * returnProgress;
        }
      } else {
        result = easing.b + easing.c * easingFunc(progress);
      }

      if (
        easingType.includes("Back") ||
        easingType.includes("Elastic") ||
        easingType.includes("Bounce")
      ) {
        result = Math.max(easing.min, Math.min(easing.max, result));
      } else {
        const minBound = Math.min(easing.b, easing.b + easing.c);
        const maxBound = Math.max(easing.b, easing.b + easing.c);
        result = Math.max(minBound, Math.min(maxBound, result));
      }
      return result;
    }

    startEase(resetFlg = true) {
      if (resetFlg) {
        this._loopTime = 0;
      }
      if (this._param.rndOnLoop === "true") {
        this._rndPosition = {
          x: (Math.random() * 100 * Number(this._param.rndX)) / 100,
          y: (Math.random() * 100 * Number(this._param.rndY)) / 100,
        };
        this._targetRndPosition = {
          x: (Math.random() * 100 * Number(this._param.targetRndX || 0)) / 100,
          y: (Math.random() * 100 * Number(this._param.targetRndY || 0)) / 100,
        };
      }
      
      if (this._seSettings && this._seSettings.playTiming === "ループ毎") {
        this._playRandomSe();
      }
      
      this.visible = true;
      this._duration = this._param.duration;
      this.x = this._startPosition.x + this._rndPosition.x;
      this.y = this._startPosition.y + this._rndPosition.y;
      this.scale.set(this._startScale.x, this._startScale.y);
      this.opacity = this._startOpacity;

      const finalTargetX = this._targetPosition.x + this._targetRndPosition.x;
      const finalTargetY = this._targetPosition.y + this._targetRndPosition.y;

      this._easingX = {
        f: this._param.easingType,
        b: this.x,
        c: finalTargetX - this.x,
      };
      this._easingY = {
        f: this._param.easingType,
        b: this.y,
        c: finalTargetY - this.y,
      };
      this._easingScale = {
        f: this._param.easingScaleType || this._param.easingType,
        b: this.scale.x,
        c: this._targetScale.x - this.scale.x,
        base: this._baseScale,
        max: this._maxScale,
        min: this._minScale,
      };

      this._easingOpacity = {
        f: this._param.easingOpacityType,
        b: this.opacity,
        c: this._targetOpacity - this.opacity,
      };
      this._effectT = 0;
    }

    endEase() {
      if (this._loopTime < this._param.loops || this._param.loops == 0) {
        this._loopTime++;
        const loopWait = Number(this._param.loopWait || 0);
        if (loopWait > 0) {
          this._isWaiting = true;
          this._waitTime = 0;
        } else {
          this.startEase(false);
        }
      } else {
        const targetOpacity = Number(this._param.targetOpacity);
        if (targetOpacity >= 255) {
          return;
        }
        this.visible = false;
        if (this._customId && $gameTemp._onmtpManager) {
          $gameTemp._onmtpManager.removeById(this._customId);
        } else {
          $gameTemp._onmtpManager.remove(this);
        }
      }
    }
  }

  class Sprite_OnomatopoeiaSheet extends Sprite_Onomatopoeia {
    constructor(param) {
      super(param);
      const sheet = param.sheetSettings || {};
      this._sheet = {
        cols: Number(sheet.frameCols || 3),
        rows: Number(sheet.frameRows || 1),
        start: Number(sheet.startIndex || 0),
        end: Number(sheet.endIndex || 0),
        interval: Number(sheet.interval || 6),
        loop:
          sheet.loopSheet !== undefined
            ? sheet.loopSheet === true || sheet.loopSheet === "true"
            : true,
        pingPong: sheet.pingPong === true || sheet.pingPong === "true",
      };
      this._frameIndex = this._sheet.start;
      this._frameTicker = 0;

      this.bitmap = ImageManager.loadPicture(param.name || "s_sandoll");
      this.bitmap.addLoadListener(() => {
        this._frameWidth = Math.floor(this.bitmap.width / this._sheet.cols);
        this._frameHeight = Math.floor(this.bitmap.height / this._sheet.rows);
        this._updateFrameRect();
      });
    }

    _updateFrameRect() {
      const cols = this._sheet.cols;
      const w = this._frameWidth || 0;
      const h = this._frameHeight || 0;
      const idx = Math.max(0, this._frameIndex);
      const xIndex = idx % cols;
      const yIndex = Math.floor(idx / cols);
      this.setFrame(xIndex * w, yIndex * h, w, h);
    }

    update() {
      super.update();
      if (!this.visible || this._isWaiting) return;
      if (!this.bitmap || !this.bitmap.isReady()) return;

      this._frameTicker++;
      if (this._frameTicker >= this._sheet.interval) {
        this._frameTicker = 0;
        this._advanceFrame();
        this._updateFrameRect();
      }
    }

    _advanceFrame() {
      const s = this._sheet;
      const dirKey = "_sheetDir";
      if (s.pingPong) {
        if (this[dirKey] === undefined) this[dirKey] = 1;
        this._frameIndex += this[dirKey];
        if (this._frameIndex >= s.end) {
          this._frameIndex = s.end;
          this[dirKey] = -1;
        } else if (this._frameIndex <= s.start) {
          this._frameIndex = s.start;
          this[dirKey] = 1;
        }
      } else {
        this._frameIndex++;
        const last = s.end;
        if (this._frameIndex > last) {
          if (s.loop) {
            this._frameIndex = s.start;
          } else {
            this._frameIndex = last;
          }
        }
      }
    }
  }

  class OnomatopoeiaManager {
    constructor() {
      this._mapId = -1;
      this._storeData = {};
      this._idCounter = 0;
      this._sprites = new Map();
    }

    addWithId(param, id = null) {
      const scene = SceneManager._scene;

      if (!id || id.trim() === "") {
        id = `auto_${Date.now()}_${this._idCounter++}`;
      }

      if (this._sprites.has(id)) {
        this.removeById(id);
      }

      const randomSeed = Math.random() * 1000;
      const onomatopoeia = new Sprite_Onomatopoeia(param);
      onomatopoeia._customId = id;
      onomatopoeia.startEase();
      scene.addChild(onomatopoeia);
      this._sprites.set(id, onomatopoeia);

      if (this._storeData["custom"] === undefined) {
        this._storeData["custom"] = [];
      }
      this._storeData["custom"].push(onomatopoeia);

      return id;
    }

    removeById(id) {
      if (!this._sprites.has(id)) {
        return false;
      }

      const sprite = this._sprites.get(id);
      const scene = SceneManager._scene;
      scene.removeChild(sprite);
      this._sprites.delete(id);
      if (this._storeData["custom"]) {
        const index = this._storeData["custom"].indexOf(sprite);
        if (index >= 0) {
          this._storeData["custom"].splice(index, 1);
        }
      }
      return true;
    }

    fadeOutById(id, duration) {
      if (!this._sprites.has(id)) {
        return false;
      }
      const sprite = this._sprites.get(id);
      if (sprite && sprite.startFadeOut) {
        sprite.startFadeOut(duration);
        return true;
      }
      return false;
    }

    fadeOutAll(duration) {
      this._sprites.forEach((sprite, id) => {
        if (sprite && sprite.startFadeOut) {
          sprite.startFadeOut(duration);
        }
      });
      Object.keys(this._storeData).forEach((key) => {
        if (this._storeData[key]) {
          this._storeData[key].forEach((sprite) => {
            if (sprite && sprite.startFadeOut) {
              sprite.startFadeOut(duration);
            }
          });
        }
      });
    }

    removeAll() {
      const scene = SceneManager._scene;
      this._sprites.forEach((sprite, id) => {
        scene.removeChild(sprite);
      });
      this._sprites.clear();
      Object.keys(this._storeData).forEach((key) => {
        if (this._storeData[key]) {
          this._storeData[key].forEach((sprite) => {
            scene.removeChild(sprite);
          });
        }
      });
      this._storeData = {};
    }

    addSheetWithId(param, id = null) {
      const scene = SceneManager._scene;
      if (!id || id.trim() === "") {
        id = `auto_${Date.now()}_${this._idCounter++}`;
      }
      if (this._sprites.has(id)) {
        this.removeById(id);
      }
      const spr = new Sprite_OnomatopoeiaSheet(param);
      spr._customId = id;
      spr.startEase();
      scene.addChild(spr);
      this._sprites.set(id, spr);
      if (this._storeData["custom"] === undefined)
        this._storeData["custom"] = [];
      this._storeData["custom"].push(spr);
      return id;
    }

    add(number) {
      var scene = SceneManager._scene;
      var param = JSON.parse(PRESETS[number]);
      var onomatopoeia = new Sprite_Onomatopoeia(param);
      onomatopoeia.startEase();
      scene.addChild(onomatopoeia);

      if (this._storeData[number] === undefined) {
        this._storeData[number] = [];
      }
      this._storeData[number].push(onomatopoeia);
    }

    remove(onomatopoeia) {
      var scene = SceneManager._scene;
      scene.removeChild(onomatopoeia);
    }

    removePreset(number) {
      var currentScene = SceneManager._scene;
      Object.keys(this._storeData).forEach((key) => {
        this._storeData[key].forEach((data) => {
          currentScene.removeChild(data);
        });
      });
      delete this._storeData[number];
    }

    restore() {
      var currentScene = SceneManager._scene;
      var previousScene = SceneManager._previousClass;
      const allowedScenes = PARAMS["Scenes"]
        ? JSON.parse(PARAMS["Scenes"])
        : ["Scene_Map"];
      if (allowedScenes.includes(previousScene.name)) {
        Object.keys(this._storeData).forEach((key) => {
          this._storeData[key].forEach((data) => {
            currentScene.addChild(data);
          });
        });
      }
    }
  }

  const ONOMATOPOEIA_PRESETS_RAW = JSON.parse(PARAMS["OnomatopoeiaPresets"] || "[]");
  const ONOMATOPOEIA_PRESETS = ONOMATOPOEIA_PRESETS_RAW.map(item => {
    try {
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  function findOnomatopoeiaPresetById(id) {
    return ONOMATOPOEIA_PRESETS.find(p => p.id === id);
  }

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペプリセット呼出", (args) => {
    const presetId = args.presetId;
    const preset = findOnomatopoeiaPresetById(presetId);
    
    if (!preset) {
      console.warn(`[OnevASSISTANT] オノマトペプリセットが見つかりません: ${presetId}`);
      return;
    }

    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const positionSettings = preset.positionSettings
      ? (typeof preset.positionSettings === "string" ? JSON.parse(preset.positionSettings) : preset.positionSettings)
      : {};
    const scaleSettings = preset.scaleSettings
      ? (typeof preset.scaleSettings === "string" ? JSON.parse(preset.scaleSettings) : preset.scaleSettings)
      : {};
    const opacitySettings = preset.opacitySettings
      ? (typeof preset.opacitySettings === "string" ? JSON.parse(preset.opacitySettings) : preset.opacitySettings)
      : {};
    const animationSettings = preset.animationSettings
      ? (typeof preset.animationSettings === "string" ? JSON.parse(preset.animationSettings) : preset.animationSettings)
      : {};
    const effectSettings = preset.effectSettings
      ? (typeof preset.effectSettings === "string" ? JSON.parse(preset.effectSettings) : preset.effectSettings)
      : {};
    const seSettings = preset.seSettings
      ? (typeof preset.seSettings === "string" ? JSON.parse(preset.seSettings) : preset.seSettings)
      : {};

    const overrideX = Number(args.overrideX ?? -1);
    const overrideY = Number(args.overrideY ?? -1);
    if (overrideX >= 0) {
      positionSettings.startX = overrideX;
      positionSettings.targetX = overrideX;
    }
    if (overrideY >= 0) {
      positionSettings.startY = overrideY;
      positionSettings.targetY = overrideY;
    }

    if (!seSettings.playTiming || seSettings.playTiming === "表示開始時") {
      try {
        const seListRaw = seSettings.seList ? 
          (typeof seSettings.seList === "string" ? JSON.parse(seSettings.seList) : seSettings.seList) : [];
        if (seListRaw.length > 0) {
          const seList = seListRaw.map(item => typeof item === "string" ? JSON.parse(item) : item);
          const randomIndex = Math.floor(Math.random() * seList.length);
          const selectedSe = seList[randomIndex];
          if (selectedSe && selectedSe.name) {
            AudioManager.playSe({
              name: selectedSe.name,
              volume: Number(selectedSe.volume ?? 90),
              pitch: Number(selectedSe.pitch ?? 100),
              pan: Number(selectedSe.pan ?? 0)
            });
          }
        }
      } catch (e) {
        console.warn("[OnevASSISTANT] SE再生エラー:", e);
      }
    }

    const param = {
      name: preset.image || "s_sandoll",
      startX: Number(positionSettings.startX || 400),
      startY: Number(positionSettings.startY || 300),
      targetX: Number(positionSettings.targetX || 400),
      targetY: Number(positionSettings.targetY || 200),
      rndX: Number(positionSettings.rndX || 0),
      rndY: Number(positionSettings.rndY || 0),
      targetRndX: Number(positionSettings.targetRndX || 0),
      targetRndY: Number(positionSettings.targetRndY || 0),
      startScale: Number(scaleSettings.startScale || 100),
      targetScale: Number(scaleSettings.targetScale || 150),
      baseScale: Number(scaleSettings.baseScale || 100),
      maxScale: Number(scaleSettings.maxScale || 200),
      minScale: Number(scaleSettings.minScale || 50),
      startOpacity: Number(opacitySettings.startOpacity || 255),
      targetOpacity: Number(opacitySettings.targetOpacity || 0),
      duration: Number(animationSettings.duration || 60),
      loops: Number(animationSettings.loops || 0),
      loopWait: Number(animationSettings.loopWait || 0),
      rndOnLoop: String(positionSettings.rndOnLoop || "false"),
      easingType: positionSettings.easingType || "linear",
      easingScaleType: scaleSettings.easingType || "linear",
      easingOpacityType: opacitySettings.easingType || "linear",
      effect: {
        type: effectSettings.type || "none",
        ampX: Number(effectSettings.ampX || 0),
        ampY: Number(effectSettings.ampY || 0),
        speed: Number(effectSettings.speed || 0.1),
        decay: Number(effectSettings.decay || 0),
      },
      seSettings: seSettings,
    };

    $gameTemp._onmtpManager.addWithId(param, presetId);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ表示", (args) => {
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }

    const positionSettings = args.positionSettings
      ? JSON.parse(args.positionSettings)
      : {};
    const scaleSettings = args.scaleSettings
      ? JSON.parse(args.scaleSettings)
      : {};
    const opacitySettings = args.opacitySettings
      ? JSON.parse(args.opacitySettings)
      : {};
    const animationSettings = args.animationSettings
      ? JSON.parse(args.animationSettings)
      : {};
    const effectSettings = args.effectSettings
      ? JSON.parse(args.effectSettings)
      : {};
    const seSettings = args.seSettings
      ? JSON.parse(args.seSettings)
      : {};

    if (!seSettings.playTiming || seSettings.playTiming === "表示開始時") {
      const seListRaw = seSettings.seList ? JSON.parse(seSettings.seList) : [];
      if (seListRaw.length > 0) {
        const seList = seListRaw.map(item => typeof item === "string" ? JSON.parse(item) : item);
        const randomIndex = Math.floor(Math.random() * seList.length);
        const selectedSe = seList[randomIndex];
        if (selectedSe && selectedSe.name) {
          AudioManager.playSe({
            name: selectedSe.name,
            volume: Number(selectedSe.volume ?? 90),
            pitch: Number(selectedSe.pitch ?? 100),
            pan: Number(selectedSe.pan ?? 0)
          });
        }
      }
    }

    const param = {
      name: args.image || "s_sandoll",
      startX: Number(positionSettings.startX || 400),
      startY: Number(positionSettings.startY || 300),
      targetX: Number(positionSettings.targetX || 400),
      targetY: Number(positionSettings.targetY || 200),
      rndX: Number(positionSettings.rndX || 0),
      rndY: Number(positionSettings.rndY || 0),
      targetRndX: Number(positionSettings.targetRndX || 0),
      targetRndY: Number(positionSettings.targetRndY || 0),
      startScale: Number(scaleSettings.startScale || 100),
      targetScale: Number(scaleSettings.targetScale || 150),
      baseScale: Number(scaleSettings.baseScale || 100),
      maxScale: Number(scaleSettings.maxScale || 200),
      minScale: Number(scaleSettings.minScale || 50),
      startOpacity: Number(opacitySettings.startOpacity || 255),
      targetOpacity: Number(opacitySettings.targetOpacity || 0),
      duration: Number(animationSettings.duration || 60),
      loops: Number(animationSettings.loops || 0),
      loopWait: Number(animationSettings.loopWait || 0),
      rndOnLoop: String(positionSettings.rndOnLoop || "false"),
      easingType: positionSettings.easingType || "linear",
      easingScaleType: scaleSettings.easingType || "linear",
      easingOpacityType: opacitySettings.easingType || "linear",
      effect: {
        type: effectSettings.type || "none",
        ampX: Number(effectSettings.ampX || 0),
        ampY: Number(effectSettings.ampY || 0),
        speed: Number(effectSettings.speed || 0.1),
        decay: Number(effectSettings.decay || 0),
      },
      seSettings: seSettings,
    };

    const assignedId = $gameTemp._onmtpManager.addWithId(param, args.id);
  });

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "オノマトペ表示(スプライトシート)",
    (args) => {
      if ($gameTemp._onmtpManager === null) {
        $gameTemp._onmtpManager = new OnomatopoeiaManager();
      }
      const positionSettings = args.positionSettings
        ? JSON.parse(args.positionSettings)
        : {};
      const scaleSettings = args.scaleSettings
        ? JSON.parse(args.scaleSettings)
        : {};
      const opacitySettings = args.opacitySettings
        ? JSON.parse(args.opacitySettings)
        : {};
      const animationSettings = args.animationSettings
        ? JSON.parse(args.animationSettings)
        : {};
      const sheetSettings = args.sheetSettings
        ? JSON.parse(args.sheetSettings)
        : {};
      const effectSettings = args.effectSettings
        ? JSON.parse(args.effectSettings)
        : {};
      const seSettings = args.seSettings
        ? JSON.parse(args.seSettings)
        : {};

      if (!seSettings.playTiming || seSettings.playTiming === "表示開始時") {
        const seListRaw = seSettings.seList ? JSON.parse(seSettings.seList) : [];
        if (seListRaw.length > 0) {
          const seList = seListRaw.map(item => typeof item === "string" ? JSON.parse(item) : item);
          const randomIndex = Math.floor(Math.random() * seList.length);
          const selectedSe = seList[randomIndex];
          if (selectedSe && selectedSe.name) {
            AudioManager.playSe({
              name: selectedSe.name,
              volume: Number(selectedSe.volume ?? 90),
              pitch: Number(selectedSe.pitch ?? 100),
              pan: Number(selectedSe.pan ?? 0)
            });
          }
        }
      }

      const param = {
        name: args.image || "s_sandoll",
        startX: Number(positionSettings.startX || 400),
        startY: Number(positionSettings.startY || 300),
        targetX: Number(positionSettings.targetX || 400),
        targetY: Number(positionSettings.targetY || 200),
        rndX: Number(positionSettings.rndX || 0),
        rndY: Number(positionSettings.rndY || 0),
        targetRndX: Number(positionSettings.targetRndX || 0),
        targetRndY: Number(positionSettings.targetRndY || 0),
        startScale: Number(scaleSettings.startScale || 100),
        targetScale: Number(scaleSettings.targetScale || 150),
        baseScale: Number(scaleSettings.baseScale || 100),
        maxScale: Number(scaleSettings.maxScale || 200),
        minScale: Number(scaleSettings.minScale || 50),
        startOpacity: Number(opacitySettings.startOpacity || 255),
        targetOpacity: Number(opacitySettings.targetOpacity || 0),
        duration: Number(animationSettings.duration || 60),
        loops: Number(animationSettings.loops || 0),
        loopWait: Number(animationSettings.loopWait || 0),
        rndOnLoop: String(positionSettings.rndOnLoop || "false"),
        easingType: positionSettings.easingType || "linear",
        easingScaleType: scaleSettings.easingType || "linear",
        easingOpacityType: opacitySettings.easingType || "linear",
        effect: {
          type: effectSettings.type || "none",
          ampX: Number(effectSettings.ampX || 0),
          ampY: Number(effectSettings.ampY || 0),
          speed: Number(effectSettings.speed || 0.1),
          decay: Number(effectSettings.decay || 0),
        },
        sheetSettings: {
          frameCols: Number(
            sheetSettings.frameCols || sheetSettings.FrameCols || 3
          ),
          frameRows: Number(
            sheetSettings.frameRows || sheetSettings.FrameRows || 1
          ),
          startIndex: Number(
            sheetSettings.startIndex || sheetSettings.StartIndex || 0
          ),
          endIndex: Number(
            sheetSettings.endIndex || sheetSettings.EndIndex || 0
          ),
          interval: Number(
            sheetSettings.interval || sheetSettings.Interval || 6
          ),
          loopSheet:
            sheetSettings.loopSheet === undefined
              ? true
              : sheetSettings.loopSheet === true ||
                sheetSettings.loopSheet === "true",
          pingPong:
            sheetSettings.pingPong === true ||
            sheetSettings.pingPong === "true",
        },
        seSettings: seSettings,
      };

      $gameTemp._onmtpManager.addSheetWithId(param, args.id);
    }
  );

  PluginManager.registerCommand(PLUGIN_NAME, "オノマトペ削除", (args) => {
    if ($gameTemp._onmtpManager === null) {
      return;
    }

    const id = args.id;

    const FADE_VAR_ID = Number(PARAMS.FadeTimeVariableId || 0);
    const fadeTime =
      FADE_VAR_ID > 0 ? Number($gameVariables.value(FADE_VAR_ID)) || 0 : 0;

    if (!id || id.trim() === "") {
      if (fadeTime > 0) {
        $gameTemp._onmtpManager.fadeOutAll(fadeTime);
      } else {
        $gameTemp._onmtpManager.removeAll();
      }
    } else {
      if (fadeTime > 0) {
        $gameTemp._onmtpManager.fadeOutById(id.trim(), fadeTime);
      } else {
        $gameTemp._onmtpManager.removeById(id.trim());
      }
    }
  });
})();

