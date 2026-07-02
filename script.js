const DIAGNOSIS_STORAGE_KEY = "sieDiagnosisState";

let currentDiagnosisResult = null;

document.addEventListener("DOMContentLoaded", () => {
	const startButton = document.getElementById("start-diagnosis");
	const diagnosisForm = document.getElementById("diagnosis-form");
	const wPage = document.getElementById("w-page");

	if (startButton) {
		startButton.addEventListener("click", () => {
			window.location.href = "diagnosis.html";
		});
	}

	if (wPage) {
		initializeWPage();
		return;
	}

	if (diagnosisForm) {
		initializeDiagnosisForm(diagnosisForm);
	}
});

function getPreviewTypeFromQuery() {
	const params = new URLSearchParams(window.location.search);
	const previewType = Number(params.get("previewType"));

	if (Number.isInteger(previewType) && previewType >= 1 && previewType <= 9) {
		return previewType;
	}

	return null;
}

const RESPONSE_OPTIONS = [
	{ label: "ほとんどない", value: 1 },
	{ label: "たまにある", value: 2 },
	{ label: "よくある", value: 3 },
	{ label: "ほぼいつもそう", value: 4 }
];

const ENNEAGRAM_TYPES = [
	{
		type: 1,
		name: "改革する人",
		questions: [
			"自分の中に『正しくありたい』という強い基準がある。",
			"間違いを見つけると、自然と気になってしまう。",
			"自分にも他人にも厳しくなることがある。",
			"『もっと良くできるはずだ』と思う場面が多い。",
			"感情よりも『正しさ』を優先することがある。",
			"怠けていると感じると、自分に腹が立つ。",
			"ルールや秩序が乱れるとストレスを感じる。",
			"人から『真面目だね』と言われることが多い。",
			"自分の怒りを抑え込む傾向がある。",
			"完璧にできないと、満足しにくい。",
			"他人の行動に『もっとこうすればいいのに』と思う。",
			"自分の欠点を改善しようと努力する。",
			"仕事や家事の手抜きが気になる。",
			"自分の感情を『未熟』と感じて抑えることがある。",
			"『正しく生きたい』という願望が強い。"
		]
	},
	{
		type: 2,
		name: "助ける人",
		questions: [
			"困っている人を見ると、自然と手を差し伸べたくなる。",
			"人から『ありがとう』と言われると嬉しい。",
			"自分の欲求より他人の気持ちを優先しがち。",
			"人に必要とされることが大事だと感じる。",
			"相手の気持ちを察しようとする癖がある。",
			"自分のことを後回しにしてしまう。",
			"人の役に立てないと不安になることがある。",
			"相手の喜びが自分の喜びになる。",
			"自分の本音を隠してしまうことがある。",
			"相手のために頑張りすぎて疲れることがある。",
			"人から嫌われることが怖い。",
			"相手の気持ちを読み違えると落ち込む。",
			"自分の価値を『人の役に立つか』で判断しがち。",
			"相手の反応に敏感。",
			"自分の欲求を言うのが苦手。"
		]
	},
	{
		type: 3,
		name: "達成する人",
		questions: [
			"成果を出すことが自分の価値だと感じる。",
			"人から評価されると安心する。",
			"効率よく物事を進めるのが好き。",
			"目標を立てると達成したくなる。",
			"自分を良く見せようとする癖がある。",
			"負けることが嫌い。",
			"仕事や役割に没頭しやすい。",
			"感情よりも結果を優先する。",
			"人前では弱みを見せたくない。",
			"競争心が強い。",
			"成功している自分をイメージすることが多い。",
			"努力している姿を見せたい。",
			"自分の感情を後回しにする。",
			"周囲の期待に応えようとする。",
			"『できる自分』でいたい。"
		]
	},
	{
		type: 4,
		name: "個性を求める人",
		questions: [
			"自分は他の人と違うと感じることが多い。",
			"感情が深く、揺れやすい。",
			"本物でありたいという願望が強い。",
			"自分の内面を大事にする。",
			"理想の自分と現実の自分のギャップに苦しむことがある。",
			"特別な存在でいたい。",
			"感情を表現することが多い。",
			"自分の欠けている部分に目が向きやすい。",
			"他人と比較して落ち込むことがある。",
			"美しさや雰囲気に敏感。",
			"深い関係を求める。",
			"平凡になることが怖い。",
			"感情が強く、言葉にしにくいことがある。",
			"自分の世界観を大事にする。",
			"感情の波が創造性につながる。"
		]
	},
	{
		type: 5,
		name: "観察する人",
		questions: [
			"一人の時間が必要だと感じる。",
			"情報を集めることが好き。",
			"感情よりも理解を優先する。",
			"人との距離を取りたくなることがある。",
			"自分の内側の世界が豊か。",
			"知識が増えると安心する。",
			"エネルギーが枯れる感覚がある。",
			"人に頼るのが苦手。",
			"自分の領域を侵されるとストレス。",
			"深く考えすぎることがある。",
			"物事を観察する癖がある。",
			"感情表現が控えめ。",
			"何かを理解する前に行動したくない。",
			"自分のペースを乱されるのが苦手。",
			"知識や洞察が自分の価値だと感じる。"
		]
	},
	{
		type: 6,
		name: "忠実な人",
		questions: [
			"不安になりやすい。",
			"物事を慎重に考える。",
			"信頼できる人を大事にする。",
			"最悪のケースを想定することが多い。",
			"安心できる環境を求める。",
			"自分の判断に自信が持てないことがある。",
			"群れの中で安心する。",
			"権威に対して複雑な感情がある。",
			"ルールがあると安心する。",
			"他人の意見を参考にすることが多い。",
			"自分の不安を隠すことがある。",
			"信頼を裏切られることが怖い。",
			"予測できない状況が苦手。",
			"何かを決めるときに時間がかかる。",
			"安心を求める気持ちが強い。"
		]
	},
	{
		type: 7,
		name: "熱中する人",
		questions: [
			"楽しいことを求める気持ちが強い。",
			"退屈が苦手。",
			"新しいアイデアが次々と浮かぶ。",
			"ネガティブな感情を避けたくなる。",
			"自由でいたい。",
			"未来の可能性を考えるのが好き。",
			"何かを始めるのが得意。",
			"途中で飽きることがある。",
			"制限されるとストレス。",
			"人を楽しませるのが好き。",
			"つらい感情を軽く扱うことがある。",
			"選択肢が多いほど嬉しい。",
			"何かを失うことが怖い。",
			"自分の感情をポジティブに変換しようとする。",
			"未来に希望を感じたい。"
		]
	},
	{
		type: 8,
		name: "挑戦する人",
		questions: [
			"自分の弱さを見せたくない。",
			"強くありたいという願望がある。",
			"他人に支配されるのが嫌い。",
			"自分の意見をはっきり言う。",
			"不正を見ると怒りが湧く。",
			"弱い立場の人を守りたい。",
			"コントロールされると反発したくなる。",
			"直感で動くことが多い。",
			"自分の力を試したくなる。",
			"感情が強く出ることがある。",
			"率直な人が好き。",
			"自分の領域を守りたい。",
			"他人の本音を見抜こうとする。",
			"自分の道を切り開きたい。",
			"強さが自分の価値だと感じる。"
		]
	},
	{
		type: 9,
		name: "平和を求める人",
		questions: [
			"争いを避けたい。",
			"自分の意見を言うのが苦手。",
			"平和で穏やかな環境が好き。",
			"他人の意見に合わせがち。",
			"自分の欲求がわからなくなることがある。",
			"怒りを抑え込む。",
			"変化が苦手。",
			"何かを始めるまで時間がかかる。",
			"自分の存在感が薄いと感じることがある。",
			"人を傷つけたくない。",
			"自分の感情を後回しにする。",
			"重要な決断を避けることがある。",
			"落ち着いた時間が必要。",
			"他人の気持ちを優先しすぎる。",
			"調和が自分の価値だと感じる。"
		]
	}
];

const TYPE_PROFILES = {
	1: {
		title: "完全でありたい人",
		overview: "理想や規範を大切にし、物事を正しく整えたいという意識が強いタイプです。責任感が高く、改善点を見つける力に優れます。社会や組織にとって信頼できる推進役ですが、基準が高いぶん自他への批判が強まりやすく、柔軟さを失うと心身が緊張しやすくなります。",
		center: "本能センター（怒り）",
		centerReason: "怒りを直接出すより、正しさや改善要求に変換して表現しやすい傾向があるため。",
		valuesRedline: "誠実さ、秩序、責任。手抜きや不公平、無責任な態度がレッドライン。",
		cognitiveBias: "世界を『正しい/間違い』で評価し、欠点修正の視点で見やすい。",
		coreStory: "『きちんとしていれば認められる』『ミスは許されない』という物語を持ちやすい。",
		externalImpression: "真面目、堅実、頼れる。時に厳しい・融通が利かない印象。",
		goodCycle: "原則を守りながら現実に合わせて改善し、周囲の質を静かに引き上げられる。",
		badCycle: "理想と現実の差に苛立ち、自己否定や他者批判が強くなり関係が硬直する。",
		arrows: "ストレス時: タイプ4 / 成長時: タイプ7",
		strengthPractice: "業務標準化や品質改善で強みが発揮される。改善提案は『責める』でなく『仕組み化』で伝える。",
		compatibility: "良い: 7・9（柔軟さと受容を補える） / 悪い: 4・8（感情表現や強い主張で衝突しやすい）",
		advice: "80点で提出する練習、他者のやり方を1つ受け入れる、1日1回『十分できている点』を言語化する。"
	},
	2: {
		title: "愛されたい支援者",
		overview: "人の役に立つことに喜びを感じ、関係づくりに温かさを持ち込めるタイプです。相手の気持ちを読む力が高く、支援や調整に強みがあります。一方で、必要とされたい気持ちが強くなると自己犠牲が進み、本音や疲労を抱え込みやすくなります。",
		center: "感情センター（恥）",
		centerReason: "『自分は愛されているか』を対人反応から感じ取りやすい傾向があるため。",
		valuesRedline: "感謝、つながり、思いやり。冷淡さ、拒絶、恩知らずな態度がレッドライン。",
		cognitiveBias: "世界を『必要とされる/されない』で捉え、相手優先で判断しやすい。",
		coreStory: "『役に立てば愛される』『迷惑をかけてはいけない』を学びやすい。",
		externalImpression: "優しい、面倒見がよい、気配り上手。時に干渉的・おせっかいに見える。",
		goodCycle: "共感力を活かしながら境界線を守り、健全な支援で信頼を築ける。",
		badCycle: "尽くしすぎて疲れ、見返り不足を感じて不満や操作的言動が出る。",
		arrows: "ストレス時: タイプ8 / 成長時: タイプ4",
		strengthPractice: "相談対応や顧客フォローで強い。支援前に『今の余力』を確認し、引き受け量を明確化する。",
		compatibility: "良い: 4・9（感情共有と受容が深まる） / 悪い: 5・8（距離感や強い主張で消耗しやすい）",
		advice: "頼まれる前に手伝わない日を作る、自分の希望を1日1回言葉にする、休息を予定に入れる。"
	},
	3: {
		title: "成功を実現する人",
		overview: "目標達成力と実行力に優れ、成果を素早く形にできるタイプです。場の期待を読み、必要な役割を演じる適応力も高いのが特徴です。ただし成果中心になりすぎると感情が置き去りになり、空虚感や自己同一性の揺れを感じやすくなります。",
		center: "感情センター（恥）",
		centerReason: "価値を『達成と評価』で確かめやすく、感情よりイメージ管理を優先しやすいため。",
		valuesRedline: "成果、効率、評価、前進。無能扱い、停滞、面目を失う状況がレッドライン。",
		cognitiveBias: "世界を『成功/失敗』で見て、最短で結果を出せるかを重視しやすい。",
		coreStory: "『成果を出せば認められる』『弱みを見せると価値が下がる』を抱えやすい。",
		externalImpression: "有能、速い、頼もしい。時に競争的・本音が見えにくい印象。",
		goodCycle: "目的達成と人への配慮を両立し、周囲を巻き込んで高い成果を出せる。",
		badCycle: "肩書きや成果に同一化し、失敗回避のため過活動や見栄に偏る。",
		arrows: "ストレス時: タイプ9 / 成長時: タイプ6",
		strengthPractice: "プロジェクト推進や営業で強みが活きる。目標に『感情チェック』を組み込み過負荷を防ぐ。",
		compatibility: "良い: 6・8（実行と決断が噛み合う） / 悪い: 4・9（速度差や優先順位でズレやすい）",
		advice: "毎日5分だけ感情を書き出す、結果以外の価値を3つ定義する、休息も成果指標に含める。"
	},
	4: {
		title: "本質を求める芸術家",
		overview: "感受性が豊かで、意味や美意識を深く探究するタイプです。独自の視点で世界を再解釈し、創造性や表現力に強みを持ちます。一方で欠乏感や比較意識が強まると、感情の波に飲まれやすく、行動より内省に留まりやすくなります。",
		center: "感情センター（恥）",
		centerReason: "自己の価値を『特別さ・本物感』で確かめやすく、感情体験を中心に自己を認識するため。",
		valuesRedline: "本物らしさ、深さ、独自性。表面的対応、凡庸化、感情の否定がレッドライン。",
		cognitiveBias: "世界を『意味がある/ない』『本物/偽物』で見やすく、欠けている点に注意が向く。",
		coreStory: "『そのままの私では受け入れられない』『特別である必要がある』を形成しやすい。",
		externalImpression: "繊細、個性的、表現豊か。時に気分屋・近寄りがたい印象。",
		goodCycle: "感情を創造に変え、他者の痛みを理解する深い共感者として機能する。",
		badCycle: "比較と自己否定が強まり、孤立や先延ばしで自己効力感が下がる。",
		arrows: "ストレス時: タイプ2 / 成長時: タイプ1",
		strengthPractice: "企画・デザイン・文章表現で活躍しやすい。締切と小さな行動単位を先に設定して実行力を補う。",
		compatibility: "良い: 1・2（構造化と受容を得やすい） / 悪い: 3・8（成果圧や強い圧力で疲れやすい）",
		advice: "比較するSNS時間を制限する、感情の命名を行う、1日1つ具体行動で現実接続を作る。"
	},
	5: {
		title: "知を蓄える探究者",
		overview: "観察力と分析力に優れ、複雑な事象を構造化して理解するのが得意なタイプです。独立性が高く、深い専門性を築けます。反面、エネルギー消耗への不安が強いと関わりを避け、知識は増えても行動が遅れることで機会損失につながることがあります。",
		center: "思考センター（不安）",
		centerReason: "感情より理解を優先し、十分に把握してから動こうとするため。",
		valuesRedline: "自律、境界、知識、静けさ。侵入、過干渉、準備不足での即断がレッドライン。",
		cognitiveBias: "世界を『理解できる/できない』で捉え、観察者ポジションを取りやすい。",
		coreStory: "『求められすぎると枯渇する』『備えていれば安全』を持ちやすい。",
		externalImpression: "冷静、博識、客観的。時に距離がある・感情が見えにくい印象。",
		goodCycle: "知見を実践に接続し、必要な場面で簡潔に共有して高い価値を生む。",
		badCycle: "準備と情報収集が終わらず、行動回避と孤立が進む。",
		arrows: "ストレス時: タイプ7 / 成長時: タイプ8",
		strengthPractice: "調査分析や設計業務で強みが活きる。『十分条件』を決め、完璧前でも小さく実装する。",
		compatibility: "良い: 8・1（決断力と構造化が補完） / 悪い: 2・7（密着や即興要求で負荷が上がりやすい）",
		advice: "会話前に時間枠を宣言する、週1回は未完成でも共有する、体感系の休息を増やす。"
	},
	6: {
		title: "信頼を築く守り手",
		overview: "リスク感知と慎重な検討に強く、組織や人間関係の安定を支えるタイプです。誠実で責任感があり、チームの安全装置になれます。ただし不確実性が高い状況では疑念が増え、判断遅延や確認過多に陥ることがあります。",
		center: "思考センター（不安）",
		centerReason: "先の危険を予測し、安心材料を集めながら意思決定する傾向が強いため。",
		valuesRedline: "信頼、安全、誠実、連帯。裏切り、曖昧さ、約束不履行がレッドライン。",
		cognitiveBias: "世界を『安全/危険』『信頼/不信』で見て、最悪ケースを先に検討しやすい。",
		coreStory: "『油断すると危ない』『備えれば守れる』を内在化しやすい。",
		externalImpression: "堅実、忠実、責任感がある。時に心配性・優柔不断に見える。",
		goodCycle: "現実的なリスク管理で周囲を守り、信頼できる実行体制を作れる。",
		badCycle: "不安が増幅し、確認・先延ばし・他者依存で行動力が低下する。",
		arrows: "ストレス時: タイプ3 / 成長時: タイプ9",
		strengthPractice: "品質管理や監査、計画策定で活躍。懸念を3点に絞って提示し、対策までセットで共有する。",
		compatibility: "良い: 9・3（安心感と実行力を補完） / 悪い: 7・8（変化速度や圧力で緊張しやすい）",
		advice: "判断期限を先に設定する、信頼できる相談相手を固定する、事実と想像を分けて記録する。"
	},
	7: {
		title: "可能性を広げる楽天家",
		overview: "好奇心が強く、発想力と行動力で新しい可能性を切り開くタイプです。場を明るくし、停滞を破る推進力があります。反面、苦痛回避が強まると選択肢を増やしすぎて集中が散り、未完了案件や衝動的判断が増えやすくなります。",
		center: "思考センター（不安）",
		centerReason: "不快や制限への不安を、未来志向や選択肢拡大で処理しやすいため。",
		valuesRedline: "自由、楽しさ、可能性、スピード。拘束、退屈、悲観の押し付けがレッドライン。",
		cognitiveBias: "世界を『面白い/つまらない』『可能/不可能』で捉え、明るい側面へ注意が向く。",
		coreStory: "『苦しい場所に留まらなくていい』『前向きでいれば乗り越えられる』を持ちやすい。",
		externalImpression: "明るい、発想豊か、行動的。時に落ち着きがない・軽く見える印象。",
		goodCycle: "選択肢を絞って集中し、創造性を成果までつなげられる。",
		badCycle: "刺激追求で散漫になり、困難回避や先延ばしが重なる。",
		arrows: "ストレス時: タイプ1 / 成長時: タイプ5",
		strengthPractice: "新規企画や改善立案で強みを発揮。着手前に『完了条件』を決め、同時進行を3件以内に制限する。",
		compatibility: "良い: 5・9（深さと安定を補える） / 悪い: 1・6（規律や慎重さと摩擦が起きやすい）",
		advice: "不快感を否定せず10分だけ向き合う、ToDoに『やらないこと』を入れる、週次で未完了を整理する。"
	},
	8: {
		title: "力で切り開く統率者",
		overview: "意思が強く決断が速い、挑戦的なリーダータイプです。曖昧さを嫌い、問題を直視して突破する力があります。弱者を守る正義感も強い一方、脅威を感じると防衛的に強さを増し、対立的なコミュニケーションになりやすくなります。",
		center: "本能センター（怒り）",
		centerReason: "身体感覚と直感で即応し、境界侵害や不正に強く反応しやすいため。",
		valuesRedline: "自立、正義、主導権、率直さ。支配、裏切り、曖昧な操作がレッドライン。",
		cognitiveBias: "世界を『強い/弱い』『公正/不正』で見て、主導権を確保しようとする。",
		coreStory: "『弱みを見せると傷つく』『自分で守るしかない』を形成しやすい。",
		externalImpression: "力強い、頼れる、率直。時に威圧的・怖い印象を与える。",
		goodCycle: "力を保護と育成に使い、チームの安心感と実行力を同時に高める。",
		badCycle: "先制的に攻撃的となり、対話機会を失って孤立や反発を招く。",
		arrows: "ストレス時: タイプ5 / 成長時: タイプ2",
		strengthPractice: "交渉や危機対応で強みが活きる。決断前に『相手の事情を1つ確認する』を習慣化する。",
		compatibility: "良い: 2・5（受容と分析を補完） / 悪い: 1・4（正しさ衝突や感情摩擦が起きやすい）",
		advice: "命令形を依頼形に言い換える、沈黙3秒で相手の返答を待つ、弱さを小さく共有する。"
	},
	9: {
		title: "調和を育てる仲介者",
		overview: "穏やかさと受容力で対立を和らげ、場を安定させるタイプです。多様な立場を理解し、関係をつなぐ力があります。反面、自分の優先順位を後回しにしすぎると惰性や先延ばしが進み、望みが曖昧になってエネルギーが低下しやすくなります。",
		center: "本能センター（怒り）",
		centerReason: "怒りや自己主張を抑えて平和維持を優先し、衝突回避でエネルギーを使いやすいため。",
		valuesRedline: "調和、安心、平穏、包摂。強い対立、急な変化、圧迫的要求がレッドライン。",
		cognitiveBias: "世界を『平和/緊張』で捉え、摩擦を減らす選択を優先しやすい。",
		coreStory: "『波風を立てない方が安全』『自分より周囲を優先すべき』を持ちやすい。",
		externalImpression: "優しい、話しやすい、協調的。時に主体性が弱い印象。",
		goodCycle: "自分の意志を保ちながら調停力を発揮し、全体最適を実現できる。",
		badCycle: "自己主張の回避で受け身が続き、重要課題が停滞する。",
		arrows: "ストレス時: タイプ6 / 成長時: タイプ3",
		strengthPractice: "ファシリテーションや合意形成で強みが活きる。会議前に『自分の結論』を1文で準備する。",
		compatibility: "良い: 3・6（方向性と安心を補完） / 悪い: 8・1（圧力や批判で萎縮しやすい）",
		advice: "毎日最優先タスクを1つだけ先に実施する、断る練習を短文で行う、意見表明の回数目標を設定する。"
	}
};

function initializeDiagnosisForm(diagnosisForm) {
	const answeredCountElement = document.getElementById("answered-count");
	const totalCountElement = document.getElementById("total-count");
	const resultSection = document.getElementById("diagnosis-result");
	const resultSummary = document.getElementById("result-summary");
	const resultRankNav = document.getElementById("result-rank-nav");
	const resultDetail = document.getElementById("result-detail");
	const resultCards = document.getElementById("result-cards");
	const resultActions = document.getElementById("result-actions");
	const resetButton = document.getElementById("diagnosis-reset-btn");
	const redoButton = document.getElementById("diagnosis-redo-btn");
	const acceptButton = document.getElementById("diagnosis-accept-btn");
	const totalQuestions = ENNEAGRAM_TYPES.reduce((sum, entry) => sum + entry.questions.length, 0);
	const previewType = getPreviewTypeFromQuery();

	if (totalCountElement) {
		totalCountElement.textContent = String(totalQuestions);
	}

	if (previewType) {
		const previewState = createPreviewResultState(previewType);
		currentDiagnosisResult = previewState;
		renderDiagnosisResult(previewState, 0, {
			resultSection,
			resultSummary,
			resultRankNav,
			resultDetail,
			resultCards,
			resultActions
		});

		if (diagnosisForm) {
			diagnosisForm.hidden = true;
		}

		const progressPanel = document.querySelector(".progress-panel");
		const actions = document.querySelector(".actions");

		if (progressPanel) {
			progressPanel.hidden = true;
		}

		if (actions) {
			actions.hidden = true;
		}

		if (resultSummary) {
			resultSummary.textContent = `タイプ${previewType}のプレビュー表示です。`;
		}

		return;
	}

	diagnosisForm.innerHTML = ENNEAGRAM_TYPES.map((entry) => {
		const questionsMarkup = entry.questions
			.map((questionText, questionIndex) => {
				const questionName = `type${entry.type}-q${questionIndex + 1}`;
				const optionsMarkup = RESPONSE_OPTIONS.map((option) => {
					const optionId = `${questionName}-v${option.value}`;

					return `
						<label for="${optionId}" class="option-pill">
							<input id="${optionId}" type="radio" name="${questionName}" value="${option.value}" required />
							<span>${option.label}</span>
						</label>
					`;
				}).join("");

				return `
					<div class="question-item">
						<p class="question-text">Q${questionIndex + 1}. ${questionText}</p>
						<div class="option-grid">${optionsMarkup}</div>
					</div>
				`;
			})
			.join("");

		return `
			<fieldset class="type-section">
				<legend>タイプ${entry.type}（${entry.name}）</legend>
				${questionsMarkup}
			</fieldset>
		`;
	}).join("");

	updateAnsweredCount(diagnosisForm, answeredCountElement, totalQuestions);
	const storedState = loadStoredDiagnosisState();

	if (storedState && Array.isArray(storedState.answers)) {
		restoreAnswers(diagnosisForm, storedState.answers);
		updateAnsweredCount(diagnosisForm, answeredCountElement, totalQuestions);
	}

	diagnosisForm.addEventListener("change", () => {
		updateAnsweredCount(diagnosisForm, answeredCountElement, totalQuestions);
	});

	diagnosisForm.addEventListener("reset", () => {
		clearDiagnosisResultUI({ resultSection, resultSummary, resultRankNav, resultDetail, resultCards, resultActions });
		currentDiagnosisResult = null;
		clearStoredDiagnosisState();

		window.setTimeout(() => {
			updateAnsweredCount(diagnosisForm, answeredCountElement, totalQuestions);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 0);
	});

	if (resetButton) {
		resetButton.addEventListener("click", () => {
			diagnosisForm.reset();
		});
	}

	if (redoButton) {
		redoButton.addEventListener("click", () => {
			if (resultSection) {
				resultSection.hidden = true;
			}

			if (resultActions) {
				resultActions.hidden = true;
			}

			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	}

	if (acceptButton) {
		acceptButton.addEventListener("click", () => {
			if (!currentDiagnosisResult) {
				return;
			}

			saveDiagnosisState(currentDiagnosisResult);
			window.location.href = "w.html";
		});
	}

	diagnosisForm.addEventListener("submit", (event) => {
		event.preventDefault();

		if (!diagnosisForm.checkValidity()) {
			diagnosisForm.reportValidity();
			return;
		}

		const scores = ENNEAGRAM_TYPES.map((entry) => {
			const score = entry.questions.reduce((sum, _questionText, questionIndex) => {
				const questionName = `type${entry.type}-q${questionIndex + 1}`;
				const selected = diagnosisForm.querySelector(`input[name="${questionName}"]:checked`);

				return sum + Number(selected ? selected.value : 0);
			}, 0);

			return {
				type: entry.type,
				name: entry.name,
				score,
				max: entry.questions.length * RESPONSE_OPTIONS.length
			};
		});

		scores.sort((a, b) => b.score - a.score);
		const answers = collectAnswers(diagnosisForm);
		const topThree = scores.slice(0, 3);
		currentDiagnosisResult = {
			scores,
			answers,
			selectedRankIndex: 0
		};
		saveDiagnosisState(currentDiagnosisResult);

		if (resultSummary) {
			resultSummary.textContent = `最も傾向が強いのは タイプ${topThree[0].type}（${topThree[0].name}）です。2位・3位の結果は上部リンクで切り替えられます。`;
		}

		renderDiagnosisResult(currentDiagnosisResult, 0, {
			resultSection,
			resultSummary,
			resultRankNav,
			resultDetail,
			resultCards,
			resultActions
		});
	});

	if (resultRankNav) {
		resultRankNav.addEventListener("click", (event) => {
			const link = event.target.closest("a[data-rank]");

			if (!link || !currentDiagnosisResult) {
				return;
			}

			event.preventDefault();
			const selectedRankIndex = Number(link.dataset.rank);
			renderDiagnosisResult(currentDiagnosisResult, selectedRankIndex, {
				resultSection,
				resultSummary,
				resultRankNav,
				resultDetail,
				resultCards,
				resultActions
			});
		});
	}
}

function createPreviewResultState(previewType) {
	const scores = ENNEAGRAM_TYPES.map((entry) => {
		const max = entry.questions.length * RESPONSE_OPTIONS.length;
		const distance = Math.abs(entry.type - previewType);
		const score = entry.type === previewType ? max : Math.max(max - distance * 7, Math.ceil(max * 0.55));

		return {
			type: entry.type,
			name: entry.name,
			score,
			max
		};
	}).sort((a, b) => b.score - a.score);

	return {
		scores,
		answers: [],
		selectedRankIndex: 0
	};
}

function renderDiagnosisResult(resultState, selectedRankIndex, elements) {
	if (!resultState || !elements) {
		return;
	}

	currentDiagnosisResult = {
		...resultState,
		selectedRankIndex
	};

	const selectedResult = resultState.scores[selectedRankIndex] ?? resultState.scores[0];
	const profile = TYPE_PROFILES[selectedResult.type];
	const cyclePercent = Math.round((selectedResult.score / selectedResult.max) * 100);
	const maturityLabel = getMaturityLabel(cyclePercent);
	const visibleRanks = resultState.scores.slice(0, 3);

	if (elements.resultRankNav) {
		elements.resultRankNav.innerHTML = visibleRanks
			.map((item, index) => {
				const activeClass = index === selectedRankIndex ? "is-active" : "";
				return `<a href="#diagnosis-result" class="rank-link ${activeClass}" data-rank="${index}">${index + 1}位を見る</a>`;
			})
			.join("");
	}

	if (elements.resultDetail && profile) {
		elements.resultDetail.innerHTML = buildDetailedReportMarkup(selectedResult, profile, cyclePercent, maturityLabel, selectedRankIndex);
	}

	if (elements.resultCards) {
		elements.resultCards.innerHTML = visibleRanks
			.map((item, index) => {
				const percentage = Math.round((item.score / item.max) * 100);

				return `
					<article class="result-card">
						<h3>${index + 1}位 タイプ${item.type}（${item.name}）</h3>
						<p class="score">${item.score} / ${item.max} 点</p>
						<p>一致度: ${percentage}%</p>
						<p><a href="#diagnosis-result" class="rank-link" data-rank="${index}">${index + 1}位の詳細を見る</a></p>
					</article>
				`;
			})
			.join("");
	}

	if (elements.resultActions) {
		elements.resultActions.hidden = false;
	}

	if (elements.resultSection) {
		elements.resultSection.hidden = false;
		elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

function buildDetailedReportMarkup(dominantType, profile, cyclePercent, maturityLabel, selectedRankIndex) {
	return `
		<article class="report-card">
			<p class="report-rank">${selectedRankIndex + 1}位</p>
			<h3>タイプNo</h3>
			<p>タイプ${dominantType.type}</p>

			<h3>タイプ名（完全でありたい人など）</h3>
			<p>タイプ${dominantType.type}（${profile.title}）</p>

			<h3>200字概要</h3>
			<p>${profile.overview}</p>

			<h3>センター（本能・感情・思考）と理由</h3>
			<p>${profile.center}</p>
			<p>${profile.centerReason}</p>

			<h3>大切にしているもの／レッドライン</h3>
			<p>${profile.valuesRedline}</p>

			<h3>認知のクセ（そのタイプが世界をどう見ているか）</h3>
			<p>${profile.cognitiveBias}</p>

			<h3>幼少期に形成されやすいコアストーリー</h3>
			<p>${profile.coreStory}</p>

			<h3>他者からどう見られやすいか（外的印象）</h3>
			<p>${profile.externalImpression}</p>

			<h3>好循環でのあなた</h3>
			<p>${profile.goodCycle}</p>

			<h3>悪循環でのあなた</h3>
			<p>${profile.badCycle}</p>

			<h3>ストレス時の矢／成長時の矢</h3>
			<p>${profile.arrows}</p>

			<h3>好循環度（%）</h3>
			<p>${cyclePercent}%</p>

			<h3>強みの活かし方（実践例）</h3>
			<p>${profile.strengthPractice}</p>

			<h3>コミュニケーションの相性（良い／悪い）</h3>
			<p>${profile.compatibility}</p>

			<h3>何をすれば好転するか（具体的アドバイス）</h3>
			<p>${profile.advice}</p>

			<h3>成熟度レベルの簡易指標</h3>
			<p>${maturityLabel}</p>
		</article>
	`;
}

function clearDiagnosisResultUI(elements) {
	if (elements.resultSection) {
		elements.resultSection.hidden = true;
	}

	if (elements.resultSummary) {
		elements.resultSummary.textContent = "";
	}

	if (elements.resultRankNav) {
		elements.resultRankNav.innerHTML = "";
	}

	if (elements.resultDetail) {
		elements.resultDetail.innerHTML = "";
	}

	if (elements.resultCards) {
		elements.resultCards.innerHTML = "";
	}

	if (elements.resultActions) {
		elements.resultActions.hidden = true;
	}
}

function collectAnswers(formElement) {
	return Array.from(formElement.querySelectorAll("fieldset")).map((fieldset) => {
		return Array.from(fieldset.querySelectorAll('input[type="radio"]')).reduce((selectedValue, input) => {
			if (input.checked) {
				return Number(input.value);
			}

			return selectedValue;
		}, 0);
	});
}

function restoreAnswers(formElement, answers) {
	const fieldsets = Array.from(formElement.querySelectorAll("fieldset"));

	fieldsets.forEach((fieldset, index) => {
		const value = answers[index];

		if (typeof value !== "number") {
			return;
		}

		const target = fieldset.querySelector(`input[type="radio"][value="${value}"]`);

		if (target) {
			target.checked = true;
		}
	});
}

function saveDiagnosisState(state) {
	window.sessionStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(state));
}

function loadStoredDiagnosisState() {
	const raw = window.sessionStorage.getItem(DIAGNOSIS_STORAGE_KEY);

	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function clearStoredDiagnosisState() {
	window.sessionStorage.removeItem(DIAGNOSIS_STORAGE_KEY);
}

function initializeWPage() {
	const wPage = document.getElementById("w-page");
	const wSummary = document.getElementById("w-summary");
	const wDetail = document.getElementById("w-detail");
	const wBackLink = document.getElementById("w-back-link");
	const storedState = loadStoredDiagnosisState();

	if (!wPage) {
		return;
	}

	if (!storedState || !Array.isArray(storedState.scores) || storedState.scores.length === 0) {
		if (wSummary) {
			wSummary.textContent = "診断結果が見つかりません。もう一度診断してください。";
		}
		return;
	}

	const selectedRankIndex = Number.isInteger(storedState.selectedRankIndex) ? storedState.selectedRankIndex : 0;
	const topResult = storedState.scores[selectedRankIndex] ?? storedState.scores[0];
	const profile = TYPE_PROFILES[topResult.type];
	const percentage = Math.round((topResult.score / topResult.max) * 100);

	if (wSummary) {
		wSummary.textContent = `${selectedRankIndex + 1}位の結果を確認しました。タイプ${topResult.type}（${profile.title}）が最有力です。`;
	}

	if (wDetail) {
		wDetail.innerHTML = `
			<p>好循環度: ${percentage}%</p>
			<p>${profile.overview}</p>
			<p>この画面から先は、必要に応じて診断ページへ戻って回答を調整できます。</p>
		`;
	}

	if (wBackLink) {
		wBackLink.href = "diagnosis.html";
	}
}

function getMaturityLabel(cyclePercent) {
	if (cyclePercent >= 85) {
		return "高い: 安定して好循環を維持しやすい状態";
	}

	if (cyclePercent >= 70) {
		return "中程度: 基本は安定、負荷時に悪循環へ傾きやすい状態";
	}

	if (cyclePercent >= 55) {
		return "要調整: 強みはあるが、思考や行動パターンの見直しが必要な状態";
	}

	return "低め: ストレス反応が出やすく、生活リズムと支援環境の再構築が必要な状態";
}

function updateAnsweredCount(formElement, answeredCountElement, totalQuestions) {
	if (!answeredCountElement) {
		return;
	}

	const checkedCount = formElement.querySelectorAll('input[type="radio"]:checked').length;
	const answeredQuestions = Math.min(checkedCount, totalQuestions);
	answeredCountElement.textContent = String(answeredQuestions);
}
