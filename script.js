const DIAGNOSIS_STORAGE_KEY = "sieDiagnosisState";
const WING_STORAGE_KEY = "sieWingState";

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
			// #◆ 正しさ・基準・義務感（タイプ1の核）#
			"『こうあるべき』という強い基準を持ち、それに沿って行動しようとする。",
			"正しい方法を選びたい気持ちが強く、判断の軸が“正しさ”になりやすい。",
			"自分の感情よりも、正しく振る舞うことを優先する傾向がある。",
			"「〜する」よりも「〜せねばならない」と考えることが多い。",
			"正しくあろうとする姿勢が、自分の誇りになっていると感じる。",
			// #◆ 怒りの抑制・正しさ優先の感情処理#
			"怒りが湧いても、正しさを保つために抑えようとすることが多い。",
			"基準が守られない場面でも、怒りを表に出すことをためらう。",
			// #◆ 自己批判・未熟さへの厳しさ（深層）#
			"自分の行動が正しかったか、後から振り返って確認することが多い。",
			"ミスをすると必要以上に落ち込み、自分に厳しくなる。",
			"自分の弱さや未熟さを受け入れにくく、理想の自分との差に苦しむ。",
			// #◆ 刃の循環構造（あなたが提案した最重要ポイント）#
			"完璧にできないと自分を責め、その厳しさが他人にも向いてしまうことがある。",
			"完璧にできないと感じると、行動に踏み出しづらくなることがある。",
			// ※「やらない理由を考える」は心理的安全性の観点で安全版に調整
			// #◆ 改善志向・完璧主義#
			"改善点が自然と目につき、より良くしたい気持ちが湧きやすい。",
			"完璧に近づけようとして細部にこだわる。",
			// #◆ 秩序・怠慢への反応#
			"人の怠慢やルーズさが気になり、秩序が乱れると不安になる。",
			// #◆ 社会的な硬さ（外的指標）#
			"冗談が通じない、融通が利かないと言われた経験がある。",
			// #◆ 責任感・義務感の重さ#
			"責任感が強く、必要以上に重荷を背負ってしまうことがある。"
		]
	},
	{
		type: 2,
		name: "助ける人",
		questions: [
			// ◆ 他者中心の感情処理（タイプ2の核）
			"相手の気持ちを察しようとすることがある",
			"自分の気持ちよりも、まず相手がどう感じるかを優先してしまうことがある",
			"相手の気持ちや反応に強く影響され、行動が左右されることがある",
			"関係がどう見えるかを気にしてしまうことがある",
			// ◆ 承認欲求・必要とされたい気持ち（動機の明確化）
			"人の役に立つと、相手との関係が深まると感じることがある",
			"人を助けると、自分が必要とされていると感じることがある",
			"感謝されないと不安になることがある",
			"人のために動くことで自分の価値を感じることがある",
			// ◆ 自己犠牲・ニーズの後回し
			"自分のニーズよりも相手の気持ちや期待を優先してしまい、結果的に自分のことが後回しになることがある",
			"相手のために自分を犠牲にしてしまうことがある",
			"頼られると断りにくいことがある",
			// ◆ 過剰な援助・境界線の薄さ
			"困っている人を見ると、理由を考える前に手を差し伸べてしまうことがある",
			"相手の問題を自分が解決しようとすることがある",
			"相手のために頑張りすぎて疲れることがある",
			"人との距離が自然と近くなり、相手のパーソナルスペースに入っても不快に思われないことがある",
			// ◆ 改善志向の援助（あなたの新しい観点）
			"人を助けたい気持ちから、相手がもっと良くなる方法が自然と見えることがある",
			"相手が良くなると思うと、その方向へそっと導きたくなることがある",
			// ◆ 怒りの抑制・関係維持の優先
			"関係を壊したくなくて怒りより優しさを優先することがある",
			// ◆ 期待への過剰適応（タイプ2の深層）
			"相手の期待に応えることで関係が深まると感じ、つい頑張りすぎてしまうことがある",
			// ◆ 助ける側でいたい気持ち・弱さの抑制（あなたの新しい観点）
			"人を助けることは得意だが、自分が助けを求めるのは苦手だと感じることがある",
			"助けを求めるのが苦手なため、言わなくても気遣ってくれる人に安心感を覚えることがある",
			// ◆ 力の流れを読む能力（あなたの新しい観点）
			"誰かを助けたいという思いから、グループの中で影響力のある人や、自分が支えられる人を直感的に見分けることがある"
		]
	},
	{
		type: 3,
		name: "達成する人",
		questions: [
			// ◆ 成果・達成への強い動機
			"目標を達成することが大きな喜びになることがある",
			"成果が出ると気分が上がることがある",
			"成果が出ないと不安になることがある",
			"自分の価値を成果で測りがちだと感じることがある",
			// ◆ 効率至上主義・段取りの重視
			"効率的に動くことを好むことがある",
			"効率の悪さにイライラすることがある",
			"進めていた段取りや効率が崩れると、成果が遅れそうで強いストレスを感じることがある",
			// ◆ 感情の棚上げ・成果優先
			"感情が湧いても、まずはやるべきことを片付けようとして後回しにしがちだと感じることがある",
			"感情よりも、成果や評価を優先することが自然に感じられることがある",
			// ◆ 自己像の操作・弱さの抑圧
			"人からどう見られるかを意識することがある",
			"弱さを見せると評価やイメージが崩れる気がして、強い自分を保とうとしてしまうことがある",
			"成功している自分でいたいと感じることがある",
			// ◆ 役割適応・自己変形
			"どんな人にも合わせられると感じ、状況に応じて自分を柔軟に変えられると思うことがある",
			"周囲の期待に合わせて、自分の見せ方や振る舞いを変えることがある",
			// ◆ 衝突回避の“成果優先”ロジック
			"衝突すると成果が落ちると感じる場面では、効率のために相手に合わせることがある",
			// ◆ 競争心・比較意識
			"競争心があると感じることがある",
			"周囲の人と自分の成果を比べてしまうことがある",
			// ◆ 外面と内面のギャップ
			"外で役割に合わせて頑張り続けると、家では何もできないほど疲れることがある",
			"外では気遣いができる人に見られるが、家では疲れ切って動けなくなることがある",
			// ◆ 成果優先による関係の後回し
			"関係の維持よりも成果を優先してしまい、身近な人への気遣いが後回しになることがある",
			// ◆ 自己像操作の副作用
			"状況に合わせて自分を変えることがあり、周囲から「自分が無い」と言われることがある"
		]
	},
	{
		type: 4,
		name: "個性を求める人",
		questions: [
			// ◆ 感情の深さ・複雑さ
			"感情が深く動くことがある",
			"感情が複雑で説明しにくいことがある",
			"感情を言語化するのが難しいことがある",
			"感情が強すぎて疲れることがある",
			// ◆ 自己同一性・自分らしさの保持
			"自分らしさを大切にしていると感じることがある",
			"自分の世界観を守りたいと感じることがある",
			"独自性を保ちたい気持ちが強いと感じることがある",
			// ◆ 特別性への欲求・自己価値の揺れ
			"特別でありたい気持ちがある",
			"一番になることより、自分が特別な存在だと感じられることを重視することがある",
			"自分の価値を感情で測ることがある",
			"他人と比べて落ち込むことがある",
			// ◆ 内面への没入・自己理解への欲求
			"自分の内面を深く理解したいと感じることがある",
			"内面の意味や感情の背景を探ろうとすることがある",
			// ◆ 気分依存・行動の揺れ
			"その時の気分や内面の状態によって、行動や選択が大きく変わりやすいことがある",
			// ◆ 感情と孤独の関係
			"感情が孤独感につながることがある",
			"自分の独自性を大切にするほど、理解されず孤独を感じることがある",
			// ◆ 他者の感情への敏感さ
			"他人の感情の動きや雰囲気の変化に敏感で、その意味を深く感じ取ろうとすることがある",
			"他者の感情を自分の内面に取り込みやすいと感じることがある",
			// ◆ 美意識・象徴性
			"お金よりも、手間や気持ちのこもったプレゼントに強く心が動くことがある",
			"表面的な性的なものより、感情や美しさを伴う深い魅力に惹かれることがある",
			// ◆ 感動の深さ・共鳴への欲求
			"深い感動を誰かと共有できると、強い喜びを感じることがある",
			// ◆ 内外のギャップ
			"他人の相談には冷静に答えられるが、自分の感情は深すぎて抑えにくいと感じることがある"
		]
	},
	{
		type: 5,
		name: "観察する人",
		questions: [
			// ◆ 思考の深さ・理解欲求
			"一人で考える時間が必要だと感じることがある",
			"深く理解したい気持ちが強いと感じることがある",
			"理解できないと不安になることがある",
			"情報を集めすぎてしまうことがある",
			// ◆ 論理優先・感情の切り離し
			"感情より論理を優先することがある",
			"感情を切り離してしまうことがある",
			"他人の強い感情に触れると、どう対応してよいか分からず立ち止まってしまうことがある",
			"他人の感情に巻き込まれないよう距離を置くことがある",
			// ◆ 観察・分析の傾向
			"人や状況を観察する癖がある",
			"情報の整理が得意だと感じることがある",
			"深い洞察があると言われることがある",
			// ◆ 境界線の強さ・距離感
			"距離を取りたい気持ちがある",
			"自分の領域に踏み込まれると不快に感じることがある",
			"自分の内面を守りたいと感じることがある",
			// ◆ エネルギー管理・消耗の回避
			"体力や感情の消耗を避けたいと感じることがある",
			"考えるペースを急に乱されると、頭のエネルギーが一気に消耗して疲れやすいことがある",
			"刺激が多い環境では、思考や感情がすぐに疲れてしまうことがある",
			// ◆ 内向性・世界への距離
			"自分の世界にこもることがある",
			"外の世界よりも内面の世界のほうが安心できると感じることがある",
			// ◆ 相手との接し方（タイプ5の思考センターとしての特徴）
			"自分では筋の通ったことを言っているつもりなのに、理解してもらえないとイライラすることがある",
			"論理的な不備を指摘されても、それが理にかなっていれば受け入れやすいと感じることがある",
			"自分と同じくらいの思考の深さがある人に、自然と親近感がわくことがある"
		]
	},
	{
		type: 6,
		name: "忠実な人",
		questions: [
			"不安になると確認したくなる。",
			"リスクを考えすぎることがある。",
			"信頼できる人を慎重に選ぶ。",
			"自分の判断を疑ってしまう。",
			"安心できる環境を求める。",
			"未来の不安をシミュレーションする。",
			"権威に対して安心と不安が同時に出る。",
			"予定が曖昧だと落ち着かない。",
			"人の反応の変化に敏感で、そこから信頼や安全が揺らいでいないかをつい読み取ろうとしてしまう。",
			"自分の不安を隠そうとする。",
			"安心できる人に依存しやすい。",
			"不安を紛らわせるために行動する。",
			"自分の考えを疑う癖がある。",
			"安心できるルールを求める。",
			"不安が強いと行動が止まる。"
		]
	},
	{
		type: 7,
		name: "熱中する人",
		questions: [
			"楽しいことを求める気持ちが強い。",
			"退屈が苦手。",
			"不安を楽しさで上書きする。",
			"計画を詰めすぎることがある。",
			"選択肢が多いと安心する。",
			"ネガティブ感情を避ける。",
			"刺激を求める。",
			"行動が衝動的になることがある。",
			"人と一緒にいると気分が上がる。",
			"自由を奪われるとストレス。",
			"新しいことに飛びつく。",
			"感情を軽く扱うことがある。",
			"深刻な話題を避ける。",
			"自分の不安を隠す。",
			"未来に希望を持ちやすい。"
		]
	},
	{
		type: 8,
		name: "挑戦する人",
		questions: [
			"自分の領域を守りたい気持ちが強い。",
			"弱さを見せると相手に主導権を握られそうで、無防備になることを避けたくなる。",
			"行動力がある。",
			"怒りが瞬間的に出る。",
			"自分で決めたい。",
			"支配されることが嫌い。",
			"率直に話す。",
			"強く出ることで場を動かす。",
			"他人の弱さに敏感。",
			"自分の境界線を守る。",
			"感情が瞬間的に強い。",
			"自分の欲求に正直。",
			"対立を避けない。",
			"弱さを隠すために強く出ることがある。",
			"大切な人を守りたい気持ちが強い。"
		]
	},
	{
		type: 9,
		name: "平和を求める人",
		questions: [
			"争いを避けたい気持ちが強い。",
			"自分の意見を弱めてしまうことがある。",
			"衝突を避けるため怒りを無意識に押し込める。",
			"どちらでもいいと思うことが多い。",
			"自分の意見やニーズよりも、相手の意見のほうが正しく思えてしまい、結果的に自分の要求を後回しにしやすい。",
			"人の意見に合わせてしまう。",
			"感情が麻痺することがある。",
			"行動が遅くなることがある。",
			"自分の境界線が曖昧になる。",
			"平和を守るために自分を消すことがある。",
			"怒りに気づかず身体反応で後から気づくことがある。",
			"変化が苦手。",
			"自分の意見を言うと疲れる。",
			"人の気持ちを優先する。",
			"自分の存在感が薄くなることがある。"
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

const TYPE_WING_MAP = {
	1: ["1w9", "1w2"],
	2: ["2w1", "2w3"],
	3: ["3w2", "3w4"],
	4: ["4w3", "4w5"],
	5: ["5w4", "5w6"],
	6: ["6w5", "6w7"],
	7: ["7w6", "7w8"],
	8: ["8w7", "8w9"],
	9: ["9w8", "9w1"]
};

const WING_QUESTIONS = {
	"1w9": [
		"正しくありたい気持ちと、争いを避けたい気持ちが同時に出ることがある。",
		"自分の意見を言う前に、場の空気を読んでしまう。",
		"怒りを感じても、穏やかに処理しようとする。",
		"『こうあるべき』と思うが、強く主張することは少ない。",
		"自分の基準を守りつつ、周囲と調和したいと思う。"
	],
	"1w2": [
		"正しくありたい気持ちと、人の役に立ちたい気持ちが両方強い。",
		"相手のために自分の基準を少し曲げることがある。",
		"人のために頑張りすぎて疲れることがある。",
		"自分の正しさを、相手のために使おうとする。",
		"『助けるべきだ』と感じると行動が早くなる。"
	],
	"2w1": [
		"人を助けるときに『正しいやり方』を意識することがある。",
		"相手のために頑張るが、内心では自分に厳しい。",
		"自分の行動が正しかったか気にすることがある。",
		"相手のために動くが、ルールや基準も守りたい。",
		"自分の感情より『役に立てたか』を優先する。"
	],
	"2w3": [
		"人の役に立つことで評価されたい気持ちがある。",
		"助けるときに『どう見られるか』を意識することがある。",
		"相手のために動くが、成果も気になる。",
		"頼られると嬉しくて頑張りすぎることがある。",
		"人のために動くことが、自分の価値につながると感じる。"
	],
	"3w2": [
		"人の役に立つことで自分の価値を感じる。",
		"助ける行動が評価につながると嬉しい。",
		"相手の期待に応えようとして頑張りすぎることがある。",
		"自分の成果が人の役に立つと満足感が強い。",
		"人からの評価を意識して行動することがある。"
	],
	"3w4": [
		"成果を出したい気持ちと、独自性を保ちたい気持ちがある。",
		"人からの評価を気にするが、同時に自分らしさも大事にする。",
		"感情が深く動くことがあるが、表には出しにくい。",
		"自分のスタイルで成果を出したいと思う。",
		"他人と比べて『自分らしさ』を意識することがある。"
	],
	"4w3": [
		"自分らしさを表現したい気持ちが強い。",
		"感情が深く動くが、成果も意識する。",
		"自分の作品や表現が評価されると嬉しい。",
		"他人と比べて落ち込むことがある。",
		"独自性と成果の両方を求める。"
	],
	"4w5": [
		"自分の感情を深く理解したいと思う。",
		"一人の時間がないと疲れやすい。",
		"独自性を保ちつつ、深い理解を求める。",
		"感情が複雑で、説明しにくいことがある。",
		"表現よりも『内面の深さ』を重視する。"
	],
	"5w4": [
		"深い理解を求めるが、感情も強く動くことがある。",
		"一人で考える時間がとても大事。",
		"独自の視点を持ちたいと思う。",
		"感情を表に出しにくいが、内側では強い。",
		"他人と距離を置きつつ、自分らしさを守りたい。"
	],
	"5w6": [
		"深く理解したい気持ちと、安心したい気持ちが両方ある。",
		"情報を集めて安全を確保しようとする。",
		"不安があると調べすぎてしまうことがある。",
		"他人との距離を取りつつ、信頼できる人を求める。",
		"理解と安全の両方を重視する。"
	],
	"6w5": [
		"不安があると情報を集めすぎることがある。",
		"深く理解することで安心したい。",
		"信頼できる人を慎重に選ぶ。",
		"自分の考えを疑ってしまうことがある。",
		"安心と理解の両方を求める。"
	],
	"6w7": [
		"不安があると誰かと一緒にいたくなる。",
		"安心したい気持ちと、楽しみたい気持ちが同時に出る。",
		"気分転換を求めて行動することがある。",
		"人と一緒にいると安心する。",
		"不安を紛らわせるために予定を入れることがある。"
	],
	"7w6": [
		"楽しいことを求めるが、安心も重視する。",
		"計画を立ててリスクを避けようとする。",
		"不安があると予定を詰めて紛らわせることがある。",
		"人と一緒にいると気分が上がる。",
		"楽しさと安全の両方を求める。"
	],
	"7w8": [
		"楽しいことを求めるが、行動力も強い。",
		"自分の欲求に正直でいたい。",
		"退屈が苦手で、刺激を求める。",
		"強く出ることで場を動かすことがある。",
		"楽しさと勢いの両方を求める。"
	],
	"8w7": [
		"行動力があり、勢いで進むことがある。",
		"自分の欲求に正直でいたい。",
		"楽しさや刺激を求める傾向がある。",
		"場を引っ張ることが多い。",
		"強さと楽しさの両方を求める。"
	],
	"8w9": [
		"強く出ることがあるが、争いは長引かせたくない。",
		"自分の領域を守りたい気持ちが強い。",
		"必要なときは強く出るが、普段は穏やか。",
		"怒りは瞬間的だが、長く続かない。",
		"強さと平和の両方を求める。"
	],
	"9w8": [
		"自分の領域を侵されると瞬間的に強く反応することがある。",
		"穏やかでいたいが、必要なときは強く出られる。",
		"相手が強く出てきたとき、踏ん張ることがある。",
		"大切な人を守るためなら対立を避けないことがある。",
		"怒りは短いが、瞬間的に強い。"
	],
	"9w1": [
		"自分の行動が正しかったか後から振り返ることが多い。",
		"怒りを抑えて穏やかに処理しようとする。",
		"自分のミスを必要以上に反省してしまうことがある。",
		"『こうあるべき』という基準が内側に強くある。",
		"人に迷惑をかけたと感じると長く気にしてしまう。"
	]
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
	const wingIntro = document.getElementById("wing-intro");
	const wingForm = document.getElementById("wing-form");
	const wingResult = document.getElementById("wing-result");
	const wingResultSummary = document.getElementById("wing-result-summary");
	const wingResultDetail = document.getElementById("wing-result-detail");
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
	const wingCodes = TYPE_WING_MAP[topResult.type] ?? [];
	const totalWingQuestions = wingCodes.reduce((sum, wingCode) => {
		const questions = WING_QUESTIONS[wingCode] ?? [];
		return sum + questions.length;
	}, 0);

	if (wSummary) {
		wSummary.textContent = `${selectedRankIndex + 1}位の結果を確認しました。タイプ${topResult.type}（${profile.title}）が最有力です。`;
	}

	if (wDetail) {
		wDetail.innerHTML = `
			<p>好循環度: ${percentage}%</p>
			<p>${profile.overview}</p>
			<p>ウイング判定では、タイプ${topResult.type}に対応する ${wingCodes.join(" と ")} のみ、合計${totalWingQuestions}問を表示します。</p>
		`;
	}

	if (wingIntro) {
		wingIntro.textContent = `タイプ${topResult.type}のウイング候補（${wingCodes.join(" / ")}）に回答してください。`;
	}

	if (wingForm) {
		wingForm.innerHTML = buildWingFormMarkup(wingCodes);

		wingForm.addEventListener("submit", (event) => {
			event.preventDefault();

			if (!wingForm.checkValidity()) {
				wingForm.reportValidity();
				return;
			}

			const wingScores = wingCodes.map((wingCode) => {
				const questions = WING_QUESTIONS[wingCode] ?? [];
				const score = questions.reduce((sum, _questionText, questionIndex) => {
					const questionName = `wing-${wingCode}-q${questionIndex + 1}`;
					const selected = wingForm.querySelector(`input[name="${questionName}"]:checked`);

					return sum + Number(selected ? selected.value : 0);
				}, 0);

				return {
					wingCode,
					score,
					max: questions.length * RESPONSE_OPTIONS.length
				};
			});

			wingScores.sort((a, b) => b.score - a.score);
			const topWing = wingScores[0];
			const secondWing = wingScores[1];
			const wingState = {
				type: topResult.type,
				wings: wingCodes,
				scores: wingScores,
				answers: collectWingAnswers(wingForm, wingCodes)
			};

			saveWingState(wingState);

			if (wingResultSummary && topWing) {
				wingResultSummary.textContent = `ウイング判定は ${topWing.wingCode} が最有力です。`;
			}

			if (wingResultDetail && topWing) {
				const topPercent = Math.round((topWing.score / topWing.max) * 100);
				const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;

				wingResultDetail.innerHTML = `
					<p>タイプ${topResult.type}の候補: ${wingCodes.join(" / ")}</p>
					<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
					${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
				`;
			}

			if (wingResult) {
				wingResult.hidden = false;
				wingResult.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	const storedWingState = loadWingState();

	if (
		storedWingState &&
		storedWingState.type === topResult.type &&
		Array.isArray(storedWingState.wings) &&
		storedWingState.wings.length === wingCodes.length &&
		storedWingState.wings.every((wingCode, index) => wingCode === wingCodes[index])
	) {
		if (wingForm && Array.isArray(storedWingState.answers)) {
			restoreWingAnswers(wingForm, wingCodes, storedWingState.answers);
		}

		const topWing = Array.isArray(storedWingState.scores) ? storedWingState.scores[0] : null;
		const secondWing = Array.isArray(storedWingState.scores) ? storedWingState.scores[1] : null;

		if (wingResultSummary && topWing) {
			wingResultSummary.textContent = `前回のウイング判定では ${topWing.wingCode} が最有力でした。`;
		}

		if (wingResultDetail && topWing) {
			const topPercent = Math.round((topWing.score / topWing.max) * 100);
			const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;

			wingResultDetail.innerHTML = `
				<p>タイプ${topResult.type}の候補: ${wingCodes.join(" / ")}</p>
				<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
				${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
			`;
		}

		if (wingResult) {
			wingResult.hidden = false;
		}
	} else {
		clearWingState();
	}

	if (wBackLink) {
		wBackLink.href = "diagnosis.html";
	}
}

function buildWingFormMarkup(wingCodes) {
	return wingCodes
		.map((wingCode) => {
			const questions = WING_QUESTIONS[wingCode] ?? [];
			const questionsMarkup = questions
				.map((questionText, questionIndex) => {
					const questionName = `wing-${wingCode}-q${questionIndex + 1}`;
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
					<legend>${wingCode}</legend>
					${questionsMarkup}
				</fieldset>
			`;
		})
		.join("");
}

function collectWingAnswers(formElement, wingCodes) {
	return wingCodes.map((wingCode) => {
		const questions = WING_QUESTIONS[wingCode] ?? [];
		const answers = questions.map((_questionText, questionIndex) => {
			const questionName = `wing-${wingCode}-q${questionIndex + 1}`;
			const selected = formElement.querySelector(`input[name="${questionName}"]:checked`);

			return selected ? Number(selected.value) : 0;
		});

		return {
			wingCode,
			answers
		};
	});
}

function restoreWingAnswers(formElement, wingCodes, storedAnswers) {
	if (!Array.isArray(storedAnswers)) {
		return;
	}

	wingCodes.forEach((wingCode) => {
		const targetWing = storedAnswers.find((entry) => entry && entry.wingCode === wingCode);

		if (!targetWing || !Array.isArray(targetWing.answers)) {
			return;
		}

		targetWing.answers.forEach((value, questionIndex) => {
			if (typeof value !== "number") {
				return;
			}

			const questionName = `wing-${wingCode}-q${questionIndex + 1}`;
			const targetInput = formElement.querySelector(`input[name="${questionName}"][value="${value}"]`);

			if (targetInput) {
				targetInput.checked = true;
			}
		});
	});
}

function saveWingState(state) {
	window.sessionStorage.setItem(WING_STORAGE_KEY, JSON.stringify(state));
}

function loadWingState() {
	const raw = window.sessionStorage.getItem(WING_STORAGE_KEY);

	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function clearWingState() {
	window.sessionStorage.removeItem(WING_STORAGE_KEY);
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
