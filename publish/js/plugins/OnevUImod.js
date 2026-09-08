/*:
 * @help
 *  必ずOnevASSISTANTの下に配置してください。
 * 
 * ============================================================================
 * ■ テキストスプライトの制御文字
 * ============================================================================
 * テキストスプライトで変数の値を表示する際、以下の制御文字を使用できます。
 * 変数に文字列を設定する際に使用してください。
 * 
 * 例：◆変数の操作：#0014 test = "{N[1]}が現れた！"
 *     → アクター1の名前が「リード」の場合「リードが現れた！」と表示
 * 
 * ----------------------------------------------------------------------------
 * ◆ 基本制御文字
 * ----------------------------------------------------------------------------
 *   {N[n]}    : アクターID n の名前
 *   {P[n]}    : パーティの n 番目のメンバー名
 *   {V[n]}    : 変数 n の値（再帰的に展開可能）
 *   {G}       : 通貨単位
 * 
 * ----------------------------------------------------------------------------
 * ◆ データベース参照
 * ----------------------------------------------------------------------------
 *   {class[n]}  : 職業ID n の名前
 *   {skill[n]}  : スキルID n の名前
 *   {item[n]}   : アイテムID n の名前
 *   {weapon[n]} : 武器ID n の名前
 *   {armor[n]}  : 防具ID n の名前
 *   {enemy[n]}  : 敵キャラID n の名前
 *   {troop[n]}  : 敵グループID n の名前
 *   {state[n]}  : ステートID n の名前
 * 
 * ----------------------------------------------------------------------------
 * ◆ 使用例
 * ----------------------------------------------------------------------------
 *   "{enemy[1]}が現れた！"      → 「スライムが現れた！」
 *   "{N[1]}は{skill[5]}を覚えた" → 「リードはファイアを覚えた」
 *   "所持金: {V[10]}{G}"        → 「所持金: 500G」
 * 
 * ============================================================================
 * 
 * @command UI作成
 * @text UIを作成
 * @desc UIを設定し表示する
 *
 * @arg Name
 * @text UI名
 * @type string
 * @desc UI名前を設定
 *
 * @arg UIbaseSettings
 * @text UIbase設定
 * @type struct<UIbaseSettings>
 * @desc UIのドラッグbaseになる画像の設定
 *
 * @arg ActiveSwitchIds
 * @text 有効化スイッチ
 * @type switch[]
 * @desc このUIが表示されている間ONになるスイッチID
 *
 * @arg X
 * @text 全体X座標
 * @type number
 * @default 0
 * @desc UI全体のX座標
 *
 * @arg Y
 * @text 全体Y座標
 * @type number
 * @default 0
 * @desc UI全体のY座標
 *
 * @arg PictureId
 * @text 使用ピクチャID
 * @type number
 * @default 50
 * @desc 使用するピクチャID
 *
 * @arg ImageSprites
 * @text 画像スプライト一覧
 * @type struct<UIImageSprite>[]
 * @desc 静的または単一画像として表示するUIスプライト
 *
 * @arg ChoiceSprites
 * @text 選択肢スプライト一覧
 * @type struct<UIChoiceSprite>[]
 * @desc コモンイベントなどを呼び出す画像選択ボタン一覧
 *
 * @arg GaugeSprites
 * @text ゲージスプライト一覧
 * @type struct<UIGaugeSprite>[]
 * @desc ゲージに使用する画像
 *
 * @arg NumberSprites
 * @text 数値スプライト一覧
 * @type struct<UINumberSprite>[]
 * @desc 変数に応じて数字をスプライトで表示する項目
 *
 * @arg TextSprites
 * @text テキストスプライト一覧
 * @type struct<UITextSprite>[]
 * @desc 変数の値をテキストとして表示するスプライト一覧
 *
 * @command UI消去
 * @text UIを消去
 * @desc 指定したUIを消去
 *
 * @arg name
 * @text UI名
 * @desc 消去するUIの名前
 * @type string
 *
 * @command UI全消去
 * @text すべてのUIを消去
 * @desc すべてのUIを消去
 *
 * @command UI非表示
 * @text UIを非表示
 * @desc 指定したUIをフェードで非表示にする
 *
 * @arg name
 * @text UI名
 * @desc 非表示にするUIの名前
 * @type string
 *
 * @arg fadeFrames
 * @text フェード時間（フレーム）
 * @desc 非表示になるまでのフレーム数（0で即時非表示）
 * @type number
 * @default 30
 * @min 0
 *
 * @command UI表示
 * @text UIを表示
 * @desc 非表示にしたUIをフェードで再表示する
 *
 * @arg name
 * @text UI名
 * @desc 表示するUIの名前
 * @type string
 *
 * @arg fadeFrames
 * @text フェード時間（フレーム）
 * @desc 表示されるまでのフレーム数（0で即時表示）
 * @type number
 * @default 30
 * @min 0
 *
 * @command UI全非表示
 * @text すべてのUIを非表示
 * @desc すべてのUIを一時的に非表示にする
 *
 * @arg fadeFrames
 * @text フェード時間（フレーム）
 * @desc 非表示になるまでのフレーム数（0で即時非表示）
 * @type number
 * @default 0
 * @min 0
 *
 * @command UI再表示
 * @text すべてのUIを再表示
 * @desc 非表示にしたUIをすべて再表示する
 *
 * @arg fadeFrames
 * @text フェード時間（フレーム）
 * @desc 表示されるまでのフレーム数（0で即時表示）
 * @type number
 * @default 0
 * @min 0
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
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param Y
 * @type number
 * @min -9999
 * @max 9999
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
 * @desc 有効条件（空の場合は常に有効）
 *
 * @param DisabledImage
 * @text 無効時の画像
 * @type file
 * @dir img/UI
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UITransitionEffect>
 * @default {"AppearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"StartScale\":\"100\",\"UseOffset\":\"false\",\"StartOffsetX\":\"0\",\"StartOffsetY\":\"0\",\"Easing\":\"easeOutQuad\"}","DisappearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"EndScale\":\"100\",\"UseOffset\":\"false\",\"EndOffsetX\":\"0\",\"EndOffsetY\":\"0\",\"Easing\":\"easeInQuad\"}"}
 * @desc ボタンの出現・消去時に効果を使用する
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
 * @default true
 * @desc イベント停止の影響を受けるかどうか
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

/*~struct~UIImageTransitionEffect:
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

/*~struct~UIGaugeSprite:
 * @param Type
 * @text ゲージタイプ
 * @type select
 * @option 伸縮         @value elasticity
 * @option 移動         @value slide
 * @default elasticity
 * @desc ゲージの動作方式（伸縮 or 移動）
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
 * @param FadeFrames
 * @text フェード時間
 * @type number
 * @min 0
 * @default 0
 * @desc 出現・消失時のフェードフレーム数（0で無効）
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
 * @param MinusBitmap
 * @text マイナス記号画像
 * @type file
 * @dir img/system
 * @desc マイナス値の時に表示する記号画像（空なら負の値は0として表示）
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
 * @param ShowCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @desc 表示条件（スイッチ・変数ベース）
 *
 * @param ProhibitCondition
 * @text 禁止条件
 * @type struct<ConditionConfig>
 * @desc この条件を満たすと非表示になる
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
 * @param FadeFrames
 * @text フェード時間
 * @type number
 * @min 0
 * @default 0
 * @desc 出現・消失時のフェードフレーム数（0で無効）
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
 * @min 8
 * @max 72
 * @default 28
 * @desc テキストのフォントサイズ
 *
 * @param FontFace
 * @text フォント名
 * @type string
 * @default
 * @desc 空欄だとデフォルトフォント
 *
 * @param Color
 * @text テキスト色
 * @type string
 * @default #ffffff
 * @desc テキストの色（#ffffff形式またはCSS色名）
 *
 * @param Align
 * @text 文字配置
 * @type select
 * @option 左揃え @value left
 * @option 中央揃え @value center
 * @option 右揃え @value right
 * @default left
 * @desc テキストの配置位置
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
 *
 * @param DisplayCondition
 * @text 表示条件
 * @type struct<ConditionConfig>
 * @desc テキスト表示の条件（スイッチ・変数ベース）
 *
 * @param ProhibitCondition
 * @text 禁止条件
 * @type struct<ConditionConfig>
 * @desc この条件を満たすと非表示になる
 *
 * @param FadeEffect
 * @text 出現・消去効果
 * @type struct<UIImageTransitionEffect>
 * @default {"AppearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"StartScale\":\"100\",\"UseOffset\":\"false\",\"StartOffsetX\":\"0\",\"StartOffsetY\":\"0\",\"Easing\":\"easeOutQuad\"}","DisappearEffect":"{\"StartDelay\":\"0\",\"FadeFrames\":\"5\",\"UseScale\":\"false\",\"EndScale\":\"100\",\"UseOffset\":\"false\",\"EndOffsetX\":\"0\",\"EndOffsetY\":\"0\",\"Easing\":\"easeInQuad\"}"}
 * @desc テキストの出現・消去時の効果
 *
 * @param Priority
 * @text 表示優先度
 * @type number
 * @min 0
 * @default 0
 * @desc 数値が大きいほど手前に描画
 *
 * @param DecorationWindow
 * @text 装飾ウィンドウ
 * @type struct<TextDecorationWindow>
 * @desc テキストの下に表示する装飾画像の設定
 *
 */

(() => {
  "use strict";

/*~struct~TextDecorationWindow:
 * @param LeftImage
 * @text 左端画像
 * @type file
 * @dir img/UI
 * @desc 左端の装飾画像（固定サイズ）
 *
 * @param CenterImage
 * @text 中央画像
 * @type file
 * @dir img/UI
 * @desc 中央の装飾画像（テキスト長に応じて引き延ばし）
 *
 * @param RightImage
 * @text 右端画像
 * @type file
 * @dir img/UI
 * @desc 右端の装飾画像（固定サイズ）
 *
 * @param OffsetX
 * @text Xオフセット
 * @type number
 * @min -9999
 * @default 0
 * @desc 装飾画像のX位置調整
 *
 * @param OffsetY
 * @text Yオフセット
 * @type number
 * @min -9999
 * @default 0
 * @desc 装飾画像のY位置調整
 *
 * @param PaddingLeft
 * @text 左余白
 * @type number
 * @min 0
 * @default 0
 * @desc テキスト左側の余白
 *
 * @param PaddingRight
 * @text 右余白
 * @type number
 * @min 0
 * @default 0
 * @desc テキスト右側の余白
 *
 */

  const pluginName = "OnevUImod";
  const parameters = PluginManager.parameters(pluginName);

  if (window.OnevASSISTANT) {
    if (!OnevASSISTANT._uiList) {
      OnevASSISTANT._uiList = new Map();
    }

    if (!OnevASSISTANT._activeSprites) {
      OnevASSISTANT._activeSprites = {};
    }
    if (!OnevASSISTANT._activeUINames) {
      OnevASSISTANT._activeUINames = new Set();
    }

    if (!OnevASSISTANT._dynamicUIConfigs) {
      OnevASSISTANT._dynamicUIConfigs = new Map();
    }

    if (!OnevASSISTANT._previousStates) {
      OnevASSISTANT._previousStates = new Map();
    }

    
    OnevASSISTANT.checkCondition = function(condition) {
      if (!condition) {
        return true;
      }
      
      try {
        let parsedCondition = condition;
        if (typeof condition === "string") {
          try {
            parsedCondition = JSON.parse(condition);
          } catch (e) {
            return true;
          }
        }
        
        if (parsedCondition.Conditions !== undefined) {
          let conditions = parsedCondition.Conditions;
          if (typeof conditions === "string") {
            try {
              conditions = JSON.parse(conditions);
            } catch (e) {
              conditions = [];
            }
          }
          
          if (!Array.isArray(conditions) || conditions.length === 0) {
            return true;
          }
          
          for (const item of conditions) {
            const parsed = typeof item === "string" ? JSON.parse(item) : item;
            if (!this.checkSingleCondition(parsed)) {
              return false;
            }
          }
          return true;
        }
        
        return this.checkSingleCondition(parsedCondition);
      } catch (error) {
        console.warn("ConditionConfig check error:", error);
        return true; 
      }
    };
    
    OnevASSISTANT.checkSingleCondition = function(condition) {
      if (!condition) {
        return true;
      }
      
      try {
        if (condition.SwitchId && Number(condition.SwitchId) > 0) {
          const switchId = Number(condition.SwitchId);
          const expectedValue = condition.SwitchValue !== false && condition.SwitchValue !== "false";
          const actualValue = $gameSwitches.value(switchId);
          if (actualValue !== expectedValue) return false;
        }
        
        if (condition.OrSwitchIds) {
          let orSwitchIds = condition.OrSwitchIds;
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
        
        if (condition.VariableId && Number(condition.VariableId) > 0) {
          const variableId = Number(condition.VariableId);
          const actualValue = $gameVariables.value(variableId);
          const compareValue = Number(condition.Value || 0);
          const operator = condition.Operator || "等しい（==）";
          
          switch (operator) {
            case "等しい（==）":
              if (actualValue !== compareValue) return false;
              break;
            case "以上（>=）":
              if (actualValue < compareValue) return false;
              break;
            case "以下（<=）":
              if (actualValue > compareValue) return false;
              break;
            case "より大きい（>）":
              if (actualValue <= compareValue) return false;
              break;
            case "より小さい（<）":
              if (actualValue >= compareValue) return false;
              break;
          }
        }
        
        return true; 
      } catch (error) {
        console.warn("ConditionConfig check error:", error);
        return true; 
      }
    };
    
    OnevASSISTANT.hasConditionSet = function(conditionStr) {
      if (!conditionStr) return false;
      try {
        let parsedCondition = conditionStr;
        if (typeof conditionStr === "string") {
          try {
            parsedCondition = JSON.parse(conditionStr);
          } catch (e) {
            return false;
          }
        }
        
        if (parsedCondition.Conditions !== undefined) {
          let conditions = parsedCondition.Conditions;
          if (typeof conditions === "string") {
            try {
              conditions = JSON.parse(conditions);
            } catch (e) {
              return false;
            }
          }
          return Array.isArray(conditions) && conditions.length > 0;
        }
        
        const switchId = Number(parsedCondition.SwitchId || 0);
        const variableId = Number(parsedCondition.VariableId || 0);
        return switchId > 0 || variableId > 0;
      } catch (e) {
        return false;
      }
    };
    
    OnevASSISTANT.updateOnevUImodStates = function() {
      if (!this._monitoredUIs) {
        return;
      }

      const ensureStateEntry = (uiName) => {
        if (!this._previousStates) {
          this._previousStates = new Map();
        }
        let state = this._previousStates.get(uiName);
        if (!state) {
          state = {
            baseVisible: undefined,
            imageVisible: {},
            choiceVisible: {},
            choiceAlpha: {},
            choiceEnabled: {}
          };
          this._previousStates.set(uiName, state);
        }
        return state;
      };

      const applyVisibilityIfChanged = (stateBucket, index, sprite, isVisible) => {
        if (!sprite) {
          return;
        }
        if (sprite._pendingAppearEffect) {
          return;
        }
        const prev = stateBucket[index];
        if (prev === isVisible) {
          return;
        }
        stateBucket[index] = isVisible;
        
        if (sprite._fadeConfig) {
          if (sprite._fadeTween || sprite._fadeDelayActive) {
            return;
          }
          if (sprite._nextVisible !== sprite._targetVisible) {
            return;
          }
          if (sprite._targetVisible !== isVisible) {
            sprite._nextVisible = isVisible;
          }
        } else {
          sprite.visible = isVisible;
          sprite.alpha = isVisible ? 1 : 0;
        }
      };

      const applyAlphaIfChanged = (stateBucket, index, sprite, alpha) => {
        if (!sprite) {
          return;
        }
        const prev = stateBucket[index];
        if (prev !== undefined && Math.abs(prev - alpha) < 0.001) {
          return;
        }
        stateBucket[index] = alpha;
        
        sprite.alpha = alpha;
      };

      const applyTouchEnabledIfChanged = (stateBucket, index, sprite, enabled) => {
        if (!sprite) {
          return;
        }
        const prev = stateBucket[index];
        if (prev === enabled) {
          return;
        }
        stateBucket[index] = enabled;
        
        if (sprite._choiceMeta) {
          sprite.interactive = enabled;
          sprite.buttonMode = enabled;
          if (sprite._content) {
            sprite._content.interactive = enabled;
            sprite._content.buttonMode = enabled;
          }
        } else if (sprite._touchEnabled !== undefined) {
          sprite._touchEnabled = enabled;
        }
      };

      const normalizeOp = (op) => {
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
      };

      const compareByOperator = (value, operator, compareValue) => {
        const op = normalizeOp(operator);
        switch (op) {
          case "==":
            return value == compareValue;
          case "!=":
            return value != compareValue;
          case ">=":
            return value >= compareValue;
          case "<=":
            return value <= compareValue;
          case ">":
            return value > compareValue;
          case "<":
            return value < compareValue;
          default:
            return true;
        }
      };

      const isImageProhibited = (imageConfig) => {
        if (!imageConfig) {
          return false;
        }

        if (imageConfig.ProhibitCondition) {
          if (!this.hasConditionSet(imageConfig.ProhibitCondition)) {
            return false;
          }
          return this.checkCondition(imageConfig.ProhibitCondition);
        }

        return false;
      };
      
      for (const [name, uiData] of this._monitoredUIs.entries()) {
        if (!uiData.sprite) {
          continue;
        }
        
        if (!uiData.sprite.parent) {
          continue;
        }
        
        const config = uiData.config;
        const sprite = uiData.sprite;
        const stateCache = ensureStateEntry(name);
        
        let processedImageSprites = config.ImageSprites;
        let processedChoiceSprites = config.ChoiceSprites;
        
        if (typeof config.ImageSprites === 'string') {
          try {
            processedImageSprites = JSON.parse(config.ImageSprites);
          } catch (error) {
            processedImageSprites = [];
          }
        }
        
        if (typeof config.ChoiceSprites === 'string') {
          try {
            processedChoiceSprites = JSON.parse(config.ChoiceSprites);
          } catch (error) {
            processedChoiceSprites = [];
          }
        }
        
        const base = typeof config.UIbaseSettings === "string" 
          ? this.safeJsonParse(config.UIbaseSettings)
          : config.UIbaseSettings;
        
        if (base && base.DisplayCondition) {
          const shouldShow = this.checkCondition(base.DisplayCondition);
          if (stateCache.baseVisible !== shouldShow) {
            sprite.visible = shouldShow;
            stateCache.baseVisible = shouldShow;
          }
        } else {
          stateCache.baseVisible = sprite.visible;
        }
        
        if (sprite._onevImageChildren && processedImageSprites) {
          sprite._onevImageChildren.forEach((imageSprite, index) => {
            let imageConfig = processedImageSprites[index];
            
            if (typeof imageConfig === 'string') {
              try {
                imageConfig = JSON.parse(imageConfig);
              } catch (error) {
                imageConfig = {};
              }
            }
            
            let visibilityHandled = false;
            const hasProhibitSetting = imageConfig && imageConfig.ProhibitCondition;

            if (imageConfig && imageConfig.DisplayCondition) {
              const shouldShow = this.checkCondition(imageConfig.DisplayCondition);
              const finalShow = shouldShow && !isImageProhibited(imageConfig);
              applyVisibilityIfChanged(stateCache.imageVisible, index, imageSprite, finalShow);
              visibilityHandled = true;
            }
            
            if (imageConfig && imageConfig.ShowCondition && !visibilityHandled) {
              const shouldShow = this.checkCondition(imageConfig.ShowCondition);
              const finalShow = shouldShow && !isImageProhibited(imageConfig);
              applyVisibilityIfChanged(stateCache.imageVisible, index, imageSprite, finalShow);
              visibilityHandled = true;
            } else if (!visibilityHandled && hasProhibitSetting) {
              const finalShow = !isImageProhibited(imageConfig);
              applyVisibilityIfChanged(stateCache.imageVisible, index, imageSprite, finalShow);
              visibilityHandled = true;
            }
          });
        }
        
        if (sprite._onevChoiceChildren && processedChoiceSprites) {
          
          sprite._onevChoiceChildren.forEach((choiceSprite, index) => {
            let choiceConfig = null;
            
            if (choiceSprite._choiceMeta && choiceSprite._choiceMeta.Image) {
              const spriteImageName = choiceSprite._choiceMeta.Image;
              
              choiceConfig = processedChoiceSprites.find(config => {
                if (typeof config === 'string') {
                  try {
                    const parsedConfig = JSON.parse(config);
                    return parsedConfig.Image === spriteImageName;
                  } catch (error) {
                    return false;
                  }
                }
                return config.Image === spriteImageName;
              });
              
              if (!choiceConfig) {
                choiceConfig = processedChoiceSprites[index];
              }
              
            } else {
              choiceConfig = processedChoiceSprites[index];
            }
            
            if (typeof choiceConfig === 'string') {
              try {
                choiceConfig = JSON.parse(choiceConfig);
              } catch (error) {
                choiceConfig = {};
              }
            }
            
            if (choiceConfig) {
              let showCondition = null;
              
              if (choiceConfig.DisplayCondition) {
                showCondition = choiceConfig.DisplayCondition;
              }
              else if (choiceConfig.ShowCondition) {
                try {
                  const parsedShowCondition = JSON.parse(choiceConfig.ShowCondition);
                  
                  const hasValidCondition = Number(parsedShowCondition.SwitchId) > 0 || Number(parsedShowCondition.VariableId) > 0;
                  
                  if (hasValidCondition) {
                    showCondition = {};
                    
                    if (Number(parsedShowCondition.SwitchId) > 0) {
                      showCondition.SwitchId = Number(parsedShowCondition.SwitchId);
                      showCondition.SwitchValue = parsedShowCondition.SwitchValue;
                    }
                    if (Number(parsedShowCondition.VariableId) > 0) {
                      showCondition.VariableId = Number(parsedShowCondition.VariableId);
                      
                      const operator = parsedShowCondition.Operator || "等しい（==）";
                      const value = Number(parsedShowCondition.Value || 0);
                      
                      if (operator === "等しい（==）") {
                        showCondition.VariableValue = value;
                      } else if (operator === "以上（>=）") {
                        showCondition.VariableMin = value;
                      } else if (operator === "以下（<=）") {
                        showCondition.VariableMax = value;
                      } else if (operator === "より大きい（>）") {
                        showCondition.VariableMin = value + 1;
                      } else if (operator === "より小さい（<）") {
                        showCondition.VariableMax = value - 1;
                      }
                    }
                  }
                } catch (error) {
                }
              }
              
              if (showCondition) {
                const shouldShow = this.checkCondition(showCondition);
                applyVisibilityIfChanged(stateCache.choiceVisible, index, choiceSprite, shouldShow);
              } else if (choiceConfig.ShowCondition) {
              }
              
              let enableCondition = null;
              
              if (choiceConfig.EnableCondition) {
                if (typeof choiceConfig.EnableCondition === 'string') {
                  try {
                    const parsedEnableCondition = JSON.parse(choiceConfig.EnableCondition);
                    
                    const hasValidCondition = Number(parsedEnableCondition.SwitchId) > 0 || Number(parsedEnableCondition.VariableId) > 0;
                    
                    if (hasValidCondition) {
                      enableCondition = {};
                      
                      if (Number(parsedEnableCondition.SwitchId) > 0) {
                        enableCondition.SwitchId = Number(parsedEnableCondition.SwitchId);
                        enableCondition.SwitchValue = parsedEnableCondition.SwitchValue;
                      }
                      if (Number(parsedEnableCondition.VariableId) > 0) {
                        enableCondition.VariableId = Number(parsedEnableCondition.VariableId);
                        
                        const operator = parsedEnableCondition.Operator || "等しい（==）";
                        const value = Number(parsedEnableCondition.Value || 0);
                        
                        if (operator === "等しい（==）") {
                          enableCondition.VariableValue = value;
                        } else if (operator === "以上（>=）") {
                          enableCondition.VariableMin = value;
                        } else if (operator === "以下（<=）") {
                          enableCondition.VariableMax = value;
                        }
                      }
                    }
                  } catch (error) {
                  }
                } else {
                  enableCondition = choiceConfig.EnableCondition;
                }
              }
              
              if (enableCondition) {
                const isEnabled = this.checkCondition(enableCondition);
                applyAlphaIfChanged(stateCache.choiceAlpha, index, choiceSprite, isEnabled ? 1.0 : 0.5);
                applyTouchEnabledIfChanged(stateCache.choiceEnabled, index, choiceSprite, isEnabled);
              }
            }
          });
        }
      }
    };
    
    OnevASSISTANT.forceUpdateUIStates = function(modeOrOptions) {
      var mode = "full";

      if (typeof modeOrOptions === "string") {
        mode = modeOrOptions;
      } else if (modeOrOptions && typeof modeOrOptions === "object" && modeOrOptions.mode) {
        mode = modeOrOptions.mode;
      }

      if (mode === "light") {
        if (this.updateOnevUImodStates) {
          this.updateOnevUImodStates();
        }
        return;
      }

      this.updateOnevUImodStates();

      if (this.updateAllUIConditions) {
        this.updateAllUIConditions();
      } else if (this.checkAndUpdateUIVisibility) {
        this.checkAndUpdateUIVisibility();
      } else if (this.refreshUIStates) {
        this.refreshUIStates();
      }
    };

    OnevASSISTANT._uiImagesPreloaded = false;
    OnevASSISTANT.preloadAllUIImages = function() {
      if (this._uiImagesPreloaded) return; 
      
      if (typeof require !== "undefined") {
        try {
          const fs = require("fs");
          const path = require("path");
          
          let basePath = "";
          if (typeof nw !== "undefined" && nw.App) {
            basePath = path.dirname(process.mainModule.filename);
          } else {
            basePath = path.dirname(window.location.pathname);
            if (basePath.startsWith("/") && process.platform === "win32") {
              basePath = basePath.substring(1);
            }
          }
          basePath = decodeURIComponent(basePath);
          
          const uiFolder = path.join(basePath, "img", "UI");
          const imageExtensions = [".png", ".jpg", ".jpeg", ".webp"];
          
          const loadImagesRecursively = (folderPath, relativePath = "") => {
            if (!fs.existsSync(folderPath)) return 0;
            
            let count = 0;
            const entries = fs.readdirSync(folderPath, { withFileTypes: true });
            
            entries.forEach(entry => {
              const fullPath = path.join(folderPath, entry.name);
              
              if (entry.isDirectory()) {
                const subRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
                count += loadImagesRecursively(fullPath, subRelativePath);
              } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (imageExtensions.includes(ext)) {
                  const fileName = path.basename(entry.name, ext);
                  const loadPath = relativePath ? `img/UI/${relativePath}/` : "img/UI/";
                  ImageManager.loadBitmap(loadPath, fileName);
                  count++;
                }
              }
            });
            
            return count;
          };
          
          if (fs.existsSync(uiFolder)) {
            const loadedCount = loadImagesRecursively(uiFolder);
            console.log(`[OnevUImod] img/UI/ から ${loadedCount} 枚の画像をプリロードしました（サブフォルダ含む）`);
          } else {
            console.warn("[OnevUImod] img/UI/ フォルダが見つかりません");
          }
          
          this._uiImagesPreloaded = true;
        } catch (e) {
          console.warn("[OnevUImod] 画像プリロードエラー:", e);
        }
      } else {
        console.log("[OnevUImod] ブラウザ環境ではファイルシステムにアクセスできないため、プリロードをスキップします");
      }
    };

    const originalCreateUI = OnevASSISTANT.createUI;

    OnevASSISTANT.createUI = function (name) {
      OnevASSISTANT.preloadAllUIImages();
      
      if (OnevASSISTANT._dynamicUIConfigs.has(name)) {
        const dynamicConfig = OnevASSISTANT._dynamicUIConfigs.get(name);

        if (OnevASSISTANT._activeUINames.has(name)) {
          const pc = SceneManager._scene?._spriteset?._pictureContainer;
          const old = OnevASSISTANT._activeSprites[name];

          if (!old || old.parent !== pc) {
            if (old && old.parent) old.parent.removeChild(old);
            if (old && old._onevChoiceChildren) {
              old._onevChoiceChildren.forEach(function(choiceSp) {
                if (!choiceSp) return;
                choiceSp._isHovered = false;
                const tgt = choiceSp._content || choiceSp;
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
              });
            }
            delete OnevASSISTANT._activeSprites[name];
            OnevASSISTANT._activeUINames.delete(name);
            if (OnevASSISTANT._previousStates && OnevASSISTANT._previousStates.has(name)) {
              OnevASSISTANT._previousStates.delete(name);
            }
            if (OnevASSISTANT._monitoredUIs && OnevASSISTANT._monitoredUIs.has(name)) {
              OnevASSISTANT._monitoredUIs.delete(name);
            }
          } else {
            return;
          }
        }

        const target = dynamicConfig;

        OnevASSISTANT._activeUINames.add(name);
        $gameSystem.showCustomUI(name);
        


        const base = typeof target.UIbaseSettings === "string" 
          ? OnevASSISTANT.safeJsonParse(target.UIbaseSettings)
          : target.UIbaseSettings;

        if (!base) {
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
        sprite._createdByUImod = true; 
        sprite._uiConfig = target; 

        const imageSprites = OnevASSISTANT.createAndAttachImageSprites(
          sprite,
          JSON.stringify(target.ImageSprites || []),
          []
        );
        sprite._onevImageChildren = imageSprites;
        
        if (!OnevASSISTANT._monitoredUIs) {
          OnevASSISTANT._monitoredUIs = new Map();
        }
        
        const monitorData = {
          sprite: sprite,
          config: target,
          type: 'dynamic'
        };
        
        OnevASSISTANT._monitoredUIs.set(name, monitorData);

        const switchId = Number(base.EnableSwitchId || 0);
        if (switchId > 0) {
          if (!OnevASSISTANT._dragInfo) {
            OnevASSISTANT._dragInfo = {};
          }
          OnevASSISTANT._dragInfo[name] = {
            sprite: sprite,
            switchId: switchId,
            dragging: false,
            offsetX: 0,
            offsetY: 0,
          };
        }

        try {
          const pc = SceneManager._scene._spriteset._pictureContainer;
          if (pc) {
            const idx = Math.max(0, Number(target.PictureId || 50) - 1);
            const safeIdx = Math.min(idx, pc.children.length);
            pc.addChildAt(sprite, safeIdx);
          } else {
            if (SceneManager._scene._spriteset) {
              SceneManager._scene._spriteset.addChild(sprite);
            }
          }
        } catch (error) {}

        sprite._onevGaugeChildren = sprite._onevGaugeChildren || [];
        sprite._onevNumberChildren = sprite._onevNumberChildren || [];
        sprite._onevImageChildren = sprite._onevImageChildren || [];
        sprite._onevChoiceChildren = sprite._onevChoiceChildren || [];
        sprite._onevTextChildren = sprite._onevTextChildren || [];

        OnevASSISTANT._activeSprites[name] = sprite;

        try {
          const choiceSpriteData = target.ChoiceSprites || [];
          if (OnevASSISTANT.createChoiceSprites) {
            OnevASSISTANT.createChoiceSprites(sprite, choiceSpriteData);
            sprite._onevChoiceChildren = sprite._onevChoiceChildren || [];
          }
        } catch (error) {
          sprite._onevChoiceChildren = [];
        }

        try {
          let gaugeDefs = target.GaugeSprites || [];

          if (gaugeDefs.length > 0 && typeof gaugeDefs[0] === "string") {
            gaugeDefs = gaugeDefs
              .map((def) => {
                try {
                  return JSON.parse(def);
                } catch (error) {
                  return null;
                }
              })
              .filter((def) => def !== null);
          }

          if (OnevASSISTANT.createGaugeSprites) {
            const gaugeSprites = OnevASSISTANT.createGaugeSprites(
              sprite,
              gaugeDefs
            );
            sprite._onevGaugeChildren = gaugeSprites || [];
          }
          sprite._onevGaugeChildren = sprite._onevGaugeChildren || [];
        } catch (error) {
          sprite._onevGaugeChildren = [];
        }

        try {
          let numberDefs = target.NumberSprites || [];

          if (numberDefs.length > 0 && typeof numberDefs[0] === "string") {
            numberDefs = numberDefs
              .map((def) => {
                try {
                  return JSON.parse(def);
                } catch (error) {
                  return null;
                }
              })
              .filter((def) => def !== null);
          }

          if (OnevASSISTANT.createNumberSprites) {
            const numberSprites = OnevASSISTANT.createNumberSprites(
              sprite,
              numberDefs
            );
            sprite._onevNumberChildren = numberSprites || [];
          }
          sprite._onevNumberChildren = sprite._onevNumberChildren || [];
        } catch (error) {
          sprite._onevNumberChildren = [];
        }

        try {
          let textDefs = target.TextSprites || [];

          if (textDefs.length > 0 && typeof textDefs[0] === "string") {
            textDefs = textDefs
              .map((def) => {
                try {
                  return JSON.parse(def);
                } catch (error) {
                  return null;
                }
              })
              .filter((def) => def !== null);
          }

          if (OnevASSISTANT.createTextSprites) {
            const textSprites = OnevASSISTANT.createTextSprites(
              sprite,
              textDefs
            );
            sprite._onevTextChildren = textSprites || [];
          }
          sprite._onevTextChildren = sprite._onevTextChildren || [];
        } catch (error) {
          sprite._onevTextChildren = [];
        }

        const activeIds = target.ActiveSwitchIds || [];
        activeIds.forEach((id) => {
          if (+id > 0) $gameSwitches.setValue(+id, true);
        });

        if (OnevASSISTANT.registerUIForMonitoring) {
          OnevASSISTANT.registerUIForMonitoring(name, sprite, target);
        }
        
        if (OnevASSISTANT._uiConfigs) {
          OnevASSISTANT._uiConfigs[name] = target;
        }
        if (OnevASSISTANT._uiSprites) {
          OnevASSISTANT._uiSprites[name] = sprite;
        }
        if (OnevASSISTANT._registeredUIs) {
          OnevASSISTANT._registeredUIs.set(name, { sprite, config: target });
        }
        
        if (OnevASSISTANT._monitorTargets) {
          if (!OnevASSISTANT._monitorTargets[name]) {
            OnevASSISTANT._monitorTargets[name] = [];
          }
          
          if (sprite._onevImageChildren) {
            sprite._onevImageChildren.forEach((imgSprite, index) => {
              const imgConfig = target.ImageSprites && target.ImageSprites[index];
              const hasShowCondition = imgConfig && (imgConfig.ShowCondition || imgConfig.DisplayCondition);
              const hasProhibitCondition = imgConfig && imgConfig.ProhibitCondition;
              if (imgConfig && (hasShowCondition || hasProhibitCondition)) {
                OnevASSISTANT._monitorTargets[name].push({
                  type: 'image',
                  sprite: imgSprite,
                  config: imgConfig,
                  index: index
                });
              }
            });
          }
          
          if (sprite._onevChoiceChildren) {
            sprite._onevChoiceChildren.forEach((choiceSprite, index) => {
              const choiceConfig = target.ChoiceSprites && target.ChoiceSprites[index];
              if (choiceConfig && (choiceConfig.ShowCondition || choiceConfig.EnableCondition)) {
                OnevASSISTANT._monitorTargets[name].push({
                  type: 'choice',
                  sprite: choiceSprite,
                  config: choiceConfig,
                  index: index
                });
              }
            });
          }
          
          if (sprite._onevNumberChildren) {
            sprite._onevNumberChildren.forEach((numSprite, index) => {
              const numConfig = target.NumberSprites && target.NumberSprites[index];
              const hasShowCondition = numConfig && (numConfig.ShowCondition || numConfig.SwitchId);
              const hasProhibitCondition = numConfig && numConfig.ProhibitCondition;
              if (numConfig && (hasShowCondition || hasProhibitCondition)) {
                OnevASSISTANT._monitorTargets[name].push({
                  type: 'number',
                  sprite: numSprite,
                  config: numConfig,
                  index: index
                });
              }
            });
          }
          
          if (sprite._onevTextChildren) {
            sprite._onevTextChildren.forEach((textSprite, index) => {
              const textConfig = target.TextSprites && target.TextSprites[index];
              const hasShowCondition = textConfig && (textConfig.DisplayCondition || textConfig.ShowCondition || textConfig.ShowSwitch || textConfig.ShowVariable);
              const hasProhibitCondition = textConfig && textConfig.ProhibitCondition;
              if (textConfig && (hasShowCondition || hasProhibitCondition)) {
                OnevASSISTANT._monitorTargets[name].push({
                  type: 'text',
                  sprite: textSprite,
                  config: textConfig,
                  index: index
                });
              }
            });
          }
          
        }
        
        if (OnevASSISTANT.updateOnevUImodStates) {
          OnevASSISTANT.updateOnevUImodStates();
        }
        
        setTimeout(() => {
          if (OnevASSISTANT.updateOnevUImodStates) {
            OnevASSISTANT.updateOnevUImodStates();
          }
          
          if (OnevASSISTANT.forceUpdateUIStates) {
            OnevASSISTANT.forceUpdateUIStates();
          }
          if (OnevASSISTANT.updateUI) {
            OnevASSISTANT.updateUI(name);
          }
          if (OnevASSISTANT.refreshUI) {
            OnevASSISTANT.refreshUI(name);
          }
          if (OnevASSISTANT.checkUIConditions) {
            OnevASSISTANT.checkUIConditions();
          }
        }, 100);

        return target;
      } else {
        return originalCreateUI.call(this, name);
      }
    };

    const _Scene_Map_update_UImod = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
      _Scene_Map_update_UImod.call(this);
      
      if (!this._onevUImodUpdateCounter) this._onevUImodUpdateCounter = 0;
      this._onevUImodUpdateCounter++;
      
      if (this._onevUImodUpdateCounter >= 300) {
        this._onevUImodUpdateCounter = 0;
        if (window.OnevASSISTANT && OnevASSISTANT.updateOnevUImodStates && !$gameVariables._onevUImodUpdating) {
          console.log("[OnevUImod] 定期更新を実行");
          OnevASSISTANT.updateOnevUImodStates();
        }
      }
    };

    const _Scene_Battle_update_UImod = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      _Scene_Battle_update_UImod.call(this);
      
      if (!this._onevUImodUpdateCounter) this._onevUImodUpdateCounter = 0;
      this._onevUImodUpdateCounter++;
      
      if (this._onevUImodUpdateCounter >= 300) {
        this._onevUImodUpdateCounter = 0;
        if (window.OnevASSISTANT && OnevASSISTANT.updateOnevUImodStates && !$gameVariables._onevUImodUpdating) {
          console.log("[OnevUImod] 定期更新を実行");
          OnevASSISTANT.updateOnevUImodStates();
        }
      }
    };
  }

  PluginManager.registerCommand(pluginName, "UI作成", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const baseSettings = args.UIbaseSettings
      ? JSON.parse(args.UIbaseSettings)
      : {};
    const activeSwitchIds = args.ActiveSwitchIds
      ? JSON.parse(args.ActiveSwitchIds)
      : [];
    const imageSprites = args.ImageSprites ? JSON.parse(args.ImageSprites) : [];
    const choiceSprites = args.ChoiceSprites
      ? JSON.parse(args.ChoiceSprites)
      : [];
    const gaugeSprites = args.GaugeSprites ? JSON.parse(args.GaugeSprites) : [];
    const numberSprites = args.NumberSprites
      ? JSON.parse(args.NumberSprites)
      : [];
    const textSprites = args.TextSprites ? JSON.parse(args.TextSprites) : [];
    const name = args.Name;
    const configData = {
      Name: name,
      UIbaseSettings: baseSettings,
      X: Number(args.X || 0),
      Y: Number(args.Y || 0),
      PictureId: Number(args.PictureId || 50),
      ImageSprites: imageSprites,
      ChoiceSprites: choiceSprites,
      GaugeSprites: gaugeSprites,
      NumberSprites: numberSprites,
      TextSprites: textSprites,
      ActiveSwitchIds: activeSwitchIds,
    };

    if (!window.OnevASSISTANT._uiConfigs) {
      window.OnevASSISTANT._uiConfigs = {};
    }
    window.OnevASSISTANT._uiConfigs[name] = configData;

    const options = {
      enableSwitchId: Number(baseSettings.EnableSwitchId || 0),
      baseImage: baseSettings.Baseimage || "",
      x: Number(args.X || 0),
      y: Number(args.Y || 0),
      pictureId: Number(args.PictureId || 50),
      imageSprites: imageSprites,
      choiceSprites: choiceSprites,
      gaugeSprites: gaugeSprites,
      numberSprites: numberSprites,
      textSprites: textSprites,
      activeSwitchIds: activeSwitchIds.map((id) => Number(id)),
    };

    if (OnevASSISTANT && OnevASSISTANT.createUI) {
      try {
        OnevASSISTANT._dynamicUIConfigs.set(name, configData);
        // UI定義をプロジェクト資産(data/OnevDynamicUI.json)へ同期保存。
        // セーブには焼き込まず、ここを唯一の永続元とする（セーブ肥大対策）。
        if (typeof OnevASSISTANT.saveDynamicUIConfigsToFile === "function") {
          OnevASSISTANT.saveDynamicUIConfigsToFile();
        }

        const newUI = OnevASSISTANT.createUI(name);
        
        if (OnevASSISTANT._stopEventDuringChoice && choiceSprites.length > 0) {
          
          setTimeout(() => {
            if (OnevASSISTANT.updateUIVisibility) {
              OnevASSISTANT.updateUIVisibility();
            }
          }, 100); 
        }
      } catch (error) {
        console.error('[OnevUImod] UI作成エラー:', error);
      }
    }
  });

  PluginManager.registerCommand(pluginName, "UI消去", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const name = args.name;
    if (!name) {
      console.error("UI名指定なし");
      return;
    }

    try {
      if (OnevASSISTANT.removeUI) {
        OnevASSISTANT.removeUI(name);
      }
    } catch (error) {}
  });

  PluginManager.registerCommand(pluginName, "UI全消去", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    try {
      if (OnevASSISTANT.removeAllUI) {
        OnevASSISTANT.removeAllUI();
      }
    } catch (error) {}
  });

  PluginManager.registerCommand(pluginName, "UI非表示", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const name = args.name;
    if (!name) {
      console.error("UI名指定なし");
      return;
    }

    const fadeFrames = Number(args.fadeFrames || 0);

    try {
      if (OnevASSISTANT.hideUIWithFade) {
        OnevASSISTANT.hideUIWithFade(name, fadeFrames);
      } else if (OnevASSISTANT.hideUI) {
        OnevASSISTANT.hideUI(name);
      }
    } catch (error) {
      console.error('[OnevUImod] UI非表示エラー:', error);
    }
  });

  PluginManager.registerCommand(pluginName, "UI表示", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const name = args.name;
    if (!name) {
      console.error("UI名指定なし");
      return;
    }

    const fadeFrames = Number(args.fadeFrames || 0);

    try {
      if (OnevASSISTANT.showUIWithFade) {
        OnevASSISTANT.showUIWithFade(name, fadeFrames);
      } else if (OnevASSISTANT.showUI) {
        OnevASSISTANT.showUI(name);
      }
    } catch (error) {
      console.error('[OnevUImod] UI表示エラー:', error);
    }
  });

  PluginManager.registerCommand(pluginName, "UI全非表示", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const fadeFrames = Number(args.fadeFrames || 0);

    try {
      if (fadeFrames > 0 && OnevASSISTANT.hideAllUIWithFade) {
        OnevASSISTANT.hideAllUIWithFade(fadeFrames);
      } else if (OnevASSISTANT.hideAllUI) {
        OnevASSISTANT.hideAllUI();
      }
    } catch (error) {
      console.error('[OnevUImod] UI全非表示エラー:', error);
    }
  });

  PluginManager.registerCommand(pluginName, "UI再表示", function (args) {
    if (!window.OnevASSISTANT) {
      console.error("OnevASSISTANT.js発見できず");
      return;
    }

    const fadeFrames = Number(args.fadeFrames || 0);

    try {
      if (fadeFrames > 0 && OnevASSISTANT.showAllUIWithFade) {
        OnevASSISTANT.showAllUIWithFade(fadeFrames);
      } else if (OnevASSISTANT.showAllUI) {
        OnevASSISTANT.showAllUI();
      }
    } catch (error) {
      console.error('[OnevUImod] UI再表示エラー:', error);
    }
  });

  if (window.Game_Variables && window.Game_Switches) {
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
      _Game_Variables_setValue.call(this, variableId, value);
      
      setTimeout(() => {
        if (window.OnevASSISTANT) {
          if (OnevASSISTANT.forceUpdateUIStates) {
            OnevASSISTANT.forceUpdateUIStates("light");
          } else if (OnevASSISTANT.updateOnevUImodStates) {
            OnevASSISTANT.updateOnevUImodStates();
          } else if (OnevASSISTANT.checkUIConditions) {
            OnevASSISTANT.checkUIConditions();
          }
        }
      }, 0);
    };

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
      _Game_Switches_setValue.call(this, switchId, value);
      
      setTimeout(() => {
        if (window.OnevASSISTANT) {
          if (OnevASSISTANT.forceUpdateUIStates) {
            OnevASSISTANT.forceUpdateUIStates("light");
          } else if (OnevASSISTANT.updateOnevUImodStates) {
            OnevASSISTANT.updateOnevUImodStates();
          } else if (OnevASSISTANT.checkUIConditions) {
            OnevASSISTANT.checkUIConditions();
          }
        }
      }, 0);
    };
  }
})();
