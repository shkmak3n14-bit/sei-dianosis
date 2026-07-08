const DIAGNOSIS_STORAGE_KEY = "sieDiagnosisState";
const WING_STORAGE_KEY = "sieWingState";
const WING_HISTORY_STORAGE_KEY = "sieWingHistory";
const MAX_WING_HISTORY_ITEMS = 30;

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
			"完璧にできないと自分を責め、その厳しさが他人にも向いてしまう。",
			"完璧にできないと感じると、行動に踏み出しづらくなる。",
			// ※「やらない理由を考える」は心理的安全性の観点で安全版に調整
			// #◆ 改善志向・完璧主義#
			"改善点が自然と目につき、より良くしたい気持ちが湧きやすい。",
			"完璧に近づけようとして細部にこだわる。",
			// #◆ 秩序・怠慢への反応#
			"人の怠慢やルーズさが気になり、秩序が乱れると不安になる。",
			// #◆ 社会的な硬さ（外的指標）#
			"冗談が通じない、融通が利かないと言われた経験がある。",
			// #◆ 責任感・義務感の重さ#
			"責任感が強く、必要以上に重荷を背負ってしまう。"
		]
	},
	{
		type: 2,
		name: "助ける人",
		questions: [
			// ◆ 他者中心の感情処理（タイプ2の核）
			"相手の気持ちを察しようとする",
			"自分の気持ちよりも、まず相手がどう感じるかを優先してしまう",
			"相手の気持ちや反応に強く影響され、行動が左右される",
			"関係がどう見えるかを気にしてしまう",
			// ◆ 承認欲求・必要とされたい気持ち（動機の明確化）
			"人の役に立つと、相手との関係が深まると感じる",
			"人を助けると、自分が必要とされていると感じる",
			"感謝されないと不安になる",
			"人のために動くことで自分の価値を感じる",
			// ◆ 自己犠牲・ニーズの後回し
			"相手の気持ちや期待を優先してしまい、結果的に自分のことが後回しになる",
			"頼られると断りにくい",
			// ◆ 過剰な援助・境界線の薄さ
			"困っている人を見ると、理由を考える前に手を差し伸べてしまう",
			"相手の状況や問題を一緒に考え、何か力になれることを探そうとする",
			"相手のために頑張りすぎて疲れる",
			"人との距離が自然と近くなり、相手のパーソナルスペースに入っても不快に思われない",
			// ◆ 改善志向の援助（あなたの新しい観点）
			"人を助けたい気持ちから、相手がもっと良くなる方法が自然と見える",
			"相手が成長できると思う方法を見つけると、一緒に試してみようと提案したくなる",
			// ◆ 怒りの抑制・関係維持の優先
			"関係を壊したくなくて怒りより優しさを優先する",
			// ◆ 期待への過剰適応（タイプ2の深層）
			"相手の期待に応えることで関係が深まると感じ、つい頑張りすぎてしまう",
			// ◆ 助ける側でいたい気持ち・弱さの抑制（あなたの新しい観点）
			"人を助けることは得意だが、自分が助けを求めるのは苦手だと感じる",
			"助けを求めるのが苦手なため、言わなくても気遣ってくれる人に安心感を覚える",
			// ◆ 力の流れを読む能力（あなたの新しい観点）
			"誰かを助けたいという思いから、グループの中で影響力のある人や、自分が支えられる人を直感的に見分ける"
		]
	},
	{
		type: 3,
		name: "達成する人",
		questions: [
			// ◆ 成果・達成への強い動機
			"目標を達成することが大きな喜びになる",
			"成果が出ると気分が上がる",
			"成果が出ないと不安になる",
			"自分の価値を成果で測りがちだと感じる",
			// ◆ 効率至上主義・段取りの重視
			"効率的に動くことを好む",
			"効率の悪さにイライラする",
			"進めていた段取りや効率が崩れると、成果が遅れそうで強いストレスを感じる",
			// ◆ 感情の棚上げ・成果優先
			"感情が湧いても、まずはやるべきことを片付けようとして後回しにしがちだと感じる",
			"感情よりも、成果や評価を優先することが自然に感じられる",
			// ◆ 自己像の操作・弱さの抑圧
			"人からどう見られるかを意識する",
			"弱さを見せると評価やイメージが崩れる気がして、強い自分を保とうとしてしまう",
			"成功している自分でいたいと感じる",
			// ◆ 役割適応・自己変形
			"どんな人にも合わせられると感じ、状況に応じて自分を柔軟に変えられると思う",
			"周囲の期待に合わせて、自分の見せ方や振る舞いを変える",
			// ◆ 衝突回避の“成果優先”ロジック
			"衝突すると成果が落ちると感じる場面では、効率のために相手に合わせる",
			// ◆ 競争心・比較意識
			"競争心があると感じる",
			"周囲の人と自分の成果を比べてしまう",
			// ◆ 外面と内面のギャップ
			"外で役割に合わせて頑張り続けると、家では何もできないほど疲れる",
			"外では気遣いができる人に見られるが、家では疲れ切って動けなくなる",
			// ◆ 成果優先による関係の後回し
			"関係の維持よりも成果を優先してしまい、身近な人への気遣いが後回しになる",
			// ◆ 自己像操作の副作用
			"状況に合わせて自分を変えることがあり、周囲から「自分が無い」と言われる"
		]
	},
	{
		type: 4,
		name: "個性を求める人",
		questions: [
			// ◆ 感情の深さ・複雑さ
			"感情が深く動く",
			"感情が複雑で説明しにくい",
			"感情を言語化するのが難しい",
			"感情が深く複雑なため、その処理に時間や心身のエネルギーを必要とする",
			// ◆ 自己同一性・自分らしさの保持
			"自分らしさを大切にしていると感じる",
			"自分の世界観を守りたいと感じる",
			"独自性を保ちたい気持ちが強いと感じる",
			// ◆ 特別性への欲求・自己価値の揺れ
			"特別でありたい気持ちがある",
			"一番になることより、自分が特別な存在だと感じられることを重視する",
			"その時の感情の状態によって、自分の価値や可能性への見方が大きく変わる",
			"他人と比べて落ち込む",
			// ◆ 内面への没入・自己理解への欲求
			"自分の内面を深く理解したいと感じる",
			"内面の意味や感情の背景を探ろうとする",
			// ◆ 気分依存・行動の揺れ
			"その時の気分や内面の状態によって、行動や選択が大きく変わりやすい",
			// ◆ 感情と孤独の関係
			"感情の複雑さや独自性が、周囲との理解のズレにつながる",
			"自分の独自性を大切にするほど、理解されず孤独を感じる",
			// ◆ 他者の感情への敏感さ
			"他人の感情の動きや雰囲気の変化に敏感で、その意味を深く感じ取ろうとする",
			"他者の感情を自分の内面に取り込みやすいと感じる",
			// ◆ 美意識・象徴性
			"お金よりも、手間や気持ちのこもったプレゼントに強く心が動く",
			"表面的な性的なものより、感情や美しさを伴う深い魅力に惹かれる",
			// ◆ 感動の深さ・共鳴への欲求
			"深い感動を誰かと共有できると、強い喜びを感じる",
			// ◆ 内外のギャップ
			"他人の相談には冷静に答えられるが、自分の感情は深すぎて抑えにくいと感じる"
		]
	},
	{
		type: 5,
		name: "観察する人",
		questions: [
			// ◆ 思考の深さ・理解欲求
			"一人で考える時間が必要だと感じる",
			"深く理解したい気持ちが強いと感じる",
			"理解できないと不安になる",
			"情報を集めすぎてしまう",
			// ◆ 論理優先・感情の切り離し
			"感情より論理を優先する",
			"感情を切り離してしまう",
			"他人の強い感情に触れると、どう対応してよいか分からず立ち止まってしまう",
			"他人の感情に巻き込まれないよう距離を置く",
			// ◆ 観察・分析の傾向
			"人や状況を観察する癖がある",
			"情報の整理が得意だと感じる",
			"深い洞察があると言われる",
			// ◆ 境界線の強さ・距離感
			"距離を取りたい気持ちがある",
			"自分の領域に踏み込まれると不快に感じる",
			"自分の内面を守りたいと感じる",
			// ◆ エネルギー管理・消耗の回避
			"体力や感情の消耗を避けたいと感じる",
			"考えるペースを急に乱されると、頭のエネルギーが一気に消耗して疲れやすい",
			"刺激が多い環境では、思考や感情がすぐに疲れてしまう",
			// ◆ 内向性・世界への距離
			"自分の世界にこもる",
			"外の世界よりも内面の世界のほうが安心できると感じる",
			// ◆ 相手との接し方（タイプ5の思考センターとしての特徴）
			"自分では筋の通ったことを言っているつもりなのに、理解してもらえないとイライラする",
			"論理的な不備を指摘されても、それが理にかなっていれば受け入れやすいと感じる",
			"自分と同じくらいの思考の深さがある人に、自然と親近感がわく"
		]
	},
	{
		type: 6,
		name: "忠実な人",
		questions: [
			// ◆ 不安と確認行動
			"不安になると確認したくなる",
			"自分の判断を疑ってしまう",
			"自分の考えを疑う癖がある",
			"予定が曖昧だと落ち着かない",
			// ◆ リスク予測・シミュレーション
			"複数のリスクや起こりうる状況を想定して考慮に入れる",
			"未来の不安をシミュレーションする",
			"自分がシミュレーションした通りに物事が進まないと、相手や状況への信頼が揺らぐ",
			"臨機応変に対応するには、事前の十分な準備や計画があることが安心につながると考える",
			// ◆ 安心源の探索・信頼の慎重さ
			"信頼できる人を慎重に選ぶ",
			"安心できる人に依存しやすい",
			"自分に安心感を与えてくれる人には、かなりの労力をかけてでも尽くしたいと思う",
			"たくさんの備えやリスクヘッジを持っている人を見ると、「この人についていけば安心だ」と感じる",
			// ◆ 権威への両価性
			"権威に対して安心と不安が同時に出る",
			// ◆ 過剰警戒・反応の読み取り
			"人の反応の変化に敏感で、そこから信頼や安全が揺らいでいないか読み取ろうとしてしまう",
			"他者の評判や社会的評価を、相手との関係における信頼度判断の重要な参考情報として考慮する",
			// ◆ ルール・秩序への依存
			"安心できるルールを求める",
			"安心できる環境を求める",
			// ◆ 不安の対処行動
			"不安を紛らわせるために行動する",
			"自分の不安を隠そうとする",
			// ◆ 行動停止
			"不安が強いと行動が止まる"
		]
	},
	{
		type: 7,
		name: "熱中する人",
		questions: [
			// ◆ 楽しさ・刺激の追求
			"楽しいことを求める気持ちが強い",
			"刺激を求める",
			"新しいことに飛びつく",
			// ◆ 不安の回避・上書き
			"不安を感じても、他の可能性や楽しい側面に視点を移しやすい",
			"ネガティブな感情を感じても、別の角度から考え直したり行動に移したりしやすい",
			"深刻な話題を避ける",
			"自分の不安を隠す",
			// ◆ 選択肢の確保・自由の重視
			"選択肢が多いと安心する",
			"自由を奪われるとストレスを感じる",
			// ◆ 衝動性・行動の軽さ
			"行動が衝動的になる",
			"いくつかの感情を同時に持つことや、気持ちの切り替えが早い",
			// ◆ 計画・未来への希望
			"計画を詰めすぎる",
			"未来に希望を持ちやすい",
			// ◆ 人との関わり・気分の上昇
			"人と一緒にいると気分が上がる",
			// ◆ 思考の軽さ・議論の回避（あなたの追加観点）
			"深刻な議論や重い話題になると、話しても無駄だと言われる"
		]
	},
	{
		type: 8,
		name: "挑戦する人",
		questions: [
			// ◆ 領域・境界線の防衛
			"自分の領域を守りたい気持ちが強い",
			"自分の境界線を守ろうとする",
			// ◆ 弱さと主導権・防御本能
			"弱さを見せると相手に主導権を握られそうで、無防備になることを避けたくなる",
			"自分の立場や意見を守るため、強めのトーンや態度を取る",
			// ◆ 行動力・主導権の保持
			"行動力があると感じる",
			"自分で決めたいと感じる",
			"支配されたり指図されたりすることが嫌いだと感じる",
			// ◆ 怒り・瞬間的な感情の強さ
			"不正さや支配に対して、素早く強く反応する",
			"感情を強く感じ、その気持ちをはっきりと表現する",
			// ◆ 率直さ・場を動かす力
			"率直に話すことが多いと感じる",
			"強く出ることで場を動かす",
			// ◆ 他者の弱さへの感度・守りたい気持ち
			"他人の弱さに敏感だと感じる",
			"大切な人を守りたい気持ちが強い",
			// ◆ 対立・関係性の扱い
			"対立を避けない",
			"友達や恋人など、大切な人との関係が揺らぐと、はっきりさせたくなる",
			// ◆ 無視・向き合い方
			"自分が無視されるとつらく感じることがあり、相手のことも無視せず向き合おうとする"
		]
	},
	{
		type: 9,
		name: "平和を求める人",
		questions: [
			// ◆ 争い・衝突の回避（タイプ9の核）
			"争いを避けたい気持ちが強い",
			"衝突を避けたいという気持ちから、怒りを感じても表に出さないようにする",
			"対立しそうな場面では、自分の意見を弱めてしまう",
			// ◆ 自己主張の弱さ・ニーズの後回し
			"どちらでもいいと思うことが多い",
			"相手の意見や視点を理解し、その方向に同調しやすい",
			"自分の意見を言うと疲れる",
			"自分の意見やニーズよりも、相手の意見のほうが正しく思えてしまい、結果的に自分の要求を後回しにしやすい",
			// ◆ 感情の抑圧・麻痺
			"感情が麻痺する",
			"怒りに気づかず、身体反応で後から気づく",
			// ◆ 行動の停滞・エネルギーの低下
			"行動が遅くなる",
			"変化が苦手だと感じる",
			// ◆ 境界線の曖昧さ・自己消失
			"自分の境界線が曖昧になる",
			"衝突や対立を避けようとする中で、自分の意見や存在感を小さく見せる",
			"自分の存在感が薄くなる",
			// ◆ 他者優先・関係の安定化
			"人の気持ちを優先する"
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
		"正しさを大切にするが、対立を長引かせない言い方を選ぶ。",
		"改善点に気づいても、まず場の空気が荒れない伝え方を考える。",
		"不満があっても感情を抑え、落ち着いて処理する。",
		"『こうあるべき』という基準は強いが、押し切るより調整を選ぶ。",
		"自分の基準を守りながら、周囲との和も同じくらい重視する。"
	],
	"1w2": [
		"正しさを守りつつ、人の役に立つ責任も強く感じる。",
		"相手を助けるために、手順や基準を整えて動く。",
		"『助けるべきだ』と感じると、予定より先に手を出す。",
		"相手の成長のためなら、耳の痛い指摘もする。",
		"人を支えたあとに『もっとできたはず』と自分を厳しく評価する。"
	],
	"2w1": [
		"人を助けるとき、善意だけでなく正しい手順にもこだわる。",
		"相手のために動いたあと、配慮やマナーが十分だったか振り返る。",
		"頼まれごとには応えるが、やり方が雑だと気になって直したくなる。",
		"自分の感情より『相手のためになったか』を優先しやすい。",
		"優しさと誠実さの両方を満たしたい気持ちが強い。"
	],
	"2w3": [
		"人を助けるとき、感謝だけでなく成果として見えることも大事にする。",
		"頼られると嬉しく、期待以上で返そうと動きが速くなる。",
		"相手の役に立ちながら『有能だと思われたい』気持ちも働く。",
		"人前では面倒見の良さと実行力の両方を示したくなる。",
		"貢献が評価されると、自分の価値を強く実感する。"
	],
	"3w2": [
		"成果を出すとき、周囲への貢献として伝わる形を意識する。",
		"期待されると燃え、相手の期待値を超える結果を狙う。",
		"人間関係を活かして目標達成を加速させるのが得意だ。",
		"役に立ったと評価されると、次の行動エネルギーが上がる。",
		"実績と好印象の両方を同時に取りにいく。"
	],
	"3w4": [
		"成果は欲しいが、量産型ではなく自分の色で勝ちたい。",
		"評価されたい一方で、表現や美意識の一貫性を崩したくない。",
		"数字だけ良くても『自分らしくない成功』には満足しにくい。",
		"競争場面で他者との差別化ポイントを強く意識する。",
		"感情の起伏を抱えつつ、外では結果を出す役割を維持する。"
	],
	"4w3": [
		"自分らしい表現をしたうえで、他者からの評価も得たい。",
		"感情が動くと創造性が高まり、結果として形にしたくなる。",
		"作品や発信の反応を見て、自己価値が大きく揺れやすい。",
		"他者比較で落ち込むが、同時に『見返したい』意欲も湧く。",
		"独自性と達成感のどちらも欠けると不満が残る。"
	],
	"4w5": [
		"感情の意味を掘り下げる時間がないと、内面が落ち着かない。",
		"刺激の多い場が続くと消耗し、一人で回復する必要がある。",
		"流行よりも、自分の内面に忠実な理解や表現を選ぶ。",
		"気持ちを言葉にする前に、頭の中で長く整理する。",
		"外向きの評価より、内面の整合性や深さを優先する。"
	],
	"5w4": [
		"知的に理解したい気持ちと、独特な感受性の両方が強い。",
		"一人で考える時間が削られると、集中力と機嫌が落ちる。",
		"多数派の結論より、自分で組み立てた独自の見方を重視する。",
		"感情は深いが、共有する相手とタイミングを厳選する。",
		"人と距離を取りつつ、作品や思考には個性を残したい。",
		"理解が進むほど、論理だけでなく美意識や世界観の一貫性も気になる。"
	],
	"5w6": [
		"理解の正確さと安全性の両方が担保されるまで動きにくい。",
		"判断前に前提条件やリスクを細かく洗い出す。",
		"不確実さが高い場面では、調査や検証の量が増える。",
		"人間関係は慎重だが、信頼した相手とは情報を共有する。",
		"『分かること』と『備えること』をセットで考える。",
		"新しい提案は、魅力より先に再現性と運用リスクを確認したくなる。"
	],
	"6w5": [
		"不安を感じると、まず情報収集と裏取りを始める。",
		"結論を出す前に、根拠の抜け漏れを何度も確認する。",
		"人を信頼するまで時間がかかり、距離の取り方は慎重だ。",
		"自分の判断でも『見落としがないか』を繰り返し点検する。",
		"安心を得るために、理解の深さを先に確保したくなる。"
	],
	"6w7": [
		"不安を感じると、一人で抱えるより人と話して整理したくなる。",
		"安心を確保しながら、気分が上がる予定を入れてバランスを取る。",
		"心配事が続くと、行動量を増やして停滞感を避ける。",
		"信頼できる仲間が近くにいると、判断と実行が速くなる。",
		"不安対策と楽しさ確保を同時進行で回す傾向がある。"
	],
	"7w6": [
		"楽しい体験を求めつつ、失敗しないための保険も準備する。",
		"新しい挑戦でも、逃げ道や代替案を先に考えておく。",
		"予定を立てるとき、ワクワクと安全性の両方で判断する。",
		"不安が出ると、仲間と計画を共有して安心材料を増やす。",
		"自由さより『安心して楽しめる状態』を重視する。"
	],
	"7w8": [
		"楽しさを見つけると、細かい確認より先に動き出す。",
		"欲しいものは遠慮せず取りにいき、主導権も握りたくなる。",
		"退屈や停滞に強いストレスを感じ、刺激のある選択を優先する。",
		"場が遅いと感じると、強めに方向を決めて前へ進める。",
		"安全策よりスピードとインパクトを重視する。"
	],
	"8w7": [
		"主導権を握って前進し、同時に楽しさや勢いも求める。",
		"抵抗があっても押し切る力があり、判断は速い。",
		"エネルギーの高い場を好み、停滞を嫌う。",
		"遠慮より率直さを優先し、要求をはっきり伝える。",
		"強さの発揮と体験の充実を同時に取りにいく。"
	],
	"8w9": [
		"普段は落ち着いているが、境界を侵されると一気に強く出る。",
		"対立は望まないが、守るべき対象のためなら引かない。",
		"怒りは短時間で強く出るが、収まると切り替えが早い。",
		"主導権は持ちたい一方で、日常は穏やかな流れを好む。",
		"強さと平穏の両立を重視する。",
		"決める場面では主張するが、決着後は関係修復に意識を向ける。"
	],
	"9w8": [
		"基本は穏やかだが、押し込まれると急に強く踏ん張る。",
		"自分や身内の領域が侵される場面では、反応が速くなる。",
		"普段は譲るが、重要な一点では頑固に守り切る。",
		"衝突は避けたいが、守る対象のためなら対立も受け入れる。",
		"怒りは蓄積型ではなく、瞬間的に出て収まりやすい。",
		"普段は合わせるが、限界を超えると声や態度が急に強くなる。"
	],
	"9w1": [
		"穏やかさを保ちつつ、内側では『正しくありたい』基準が強い。",
		"衝突を避けるために感情を抑え、あとで一人で整理する。",
		"小さなミスでも『もっと丁寧にできた』と反省が続く。",
		"人に迷惑をかけた感覚が残ると、長く引きずりやすい。",
		"平和維持と良心の両立を常に意識する。"
	]
};

function compareByNormalizedScore(a, b) {
	const normalizedA = typeof a.normalized === "number" ? a.normalized : (a.max ? a.score / a.max : 0);
	const normalizedB = typeof b.normalized === "number" ? b.normalized : (b.max ? b.score / b.max : 0);

	if (normalizedB !== normalizedA) {
		return normalizedB - normalizedA;
	}

	if (b.score !== a.score) {
		return b.score - a.score;
	}

	if (typeof a.type === "number" && typeof b.type === "number") {
		return a.type - b.type;
	}

	if (typeof a.wingCode === "string" && typeof b.wingCode === "string") {
		return a.wingCode.localeCompare(b.wingCode);
	}

	return 0;
}

function getWingGapSummary(wingScores) {
	if (!Array.isArray(wingScores) || wingScores.length === 0) {
		return null;
	}

	const topWing = wingScores[0];
	const secondWing = wingScores[1] ?? null;

	if (!secondWing) {
		return {
			topWing,
			secondWing,
			gapPercent: null,
			label: "候補が1つのため点差は算出していません。"
		};
	}

	const topPercent = topWing.max ? (topWing.score / topWing.max) * 100 : 0;
	const secondPercent = secondWing.max ? (secondWing.score / secondWing.max) * 100 : 0;
	const gapPercent = Math.round((topPercent - secondPercent) * 10) / 10;
	let label = "判定差は小さめです。追加回答が有効です。";

	if (gapPercent >= 10) {
		label = "判定差は大きく、ウイング傾向は比較的明確です。";
	} else if (gapPercent >= 5) {
		label = "判定差は中程度です。";
	}

	return {
		topWing,
		secondWing,
		gapPercent,
		label
	};
}

function loadWingHistory() {
	const raw = window.localStorage.getItem(WING_HISTORY_STORAGE_KEY);

	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function saveWingHistory(history) {
	window.localStorage.setItem(WING_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function getWingPercent(scoreEntry) {
	if (!scoreEntry || !scoreEntry.max) {
		return 0;
	}

	return Math.round(((scoreEntry.score / scoreEntry.max) * 100) * 10) / 10;
}

function appendWingHistoryEntry(entry) {
	const current = loadWingHistory();
	const next = [entry, ...current].slice(0, MAX_WING_HISTORY_ITEMS);

	saveWingHistory(next);
	return next;
}

function getWingComparisonText(currentEntry, previousEntry, scopeLabel) {
	if (!currentEntry || !previousEntry) {
		return "比較対象が1件のみのため、次回回答後に前後比較を表示します。";
	}

	const currentTop = getWingPercent(currentEntry.scores[0]);
	const previousTop = getWingPercent(previousEntry.scores[0]);
	const currentGap = typeof currentEntry.gapPercent === "number" ? currentEntry.gapPercent : 0;
	const previousGap = typeof previousEntry.gapPercent === "number" ? previousEntry.gapPercent : 0;
	const topDelta = Math.round((currentTop - previousTop) * 10) / 10;
	const gapDelta = Math.round((currentGap - previousGap) * 10) / 10;
	const topWingChanged = currentEntry.topWingCode !== previousEntry.topWingCode;
	const topDeltaLabel = `${topDelta > 0 ? "+" : ""}${topDelta}%`;
	const gapDeltaLabel = `${gapDelta > 0 ? "+" : ""}${gapDelta}%`;
	const wingChangeLabel = topWingChanged
		? `1位ウイングが ${previousEntry.topWingCode} から ${currentEntry.topWingCode} に変化しました。`
		: `1位ウイングは ${currentEntry.topWingCode} のままです。`;
	const prefix = scopeLabel ? `${scopeLabel}の前回比` : "前回比";

	return `${prefix}: 1位一致度 ${topDeltaLabel} / 1位-2位点差 ${gapDeltaLabel}。${wingChangeLabel}`;
}

function formatHistoryDate(isoText) {
	const date = new Date(isoText);

	if (Number.isNaN(date.getTime())) {
		return "日時不明";
	}

	return date.toLocaleString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}

function getHistoryFilterMeta(currentType, filterValue) {
	if (filterValue === "all") {
		return {
			label: "全タイプ",
			predicate: (entry) => !!entry
		};
	}

	if (typeof filterValue === "string" && filterValue.startsWith("type:")) {
		const parsedType = Number(filterValue.replace("type:", ""));

		if (Number.isInteger(parsedType) && parsedType >= 1 && parsedType <= 9) {
			return {
				label: `タイプ${parsedType}`,
				predicate: (entry) => !!entry && entry.type === parsedType
			};
		}
	}

	return {
		label: `今回タイプ（タイプ${currentType}）`,
		predicate: (entry) => !!entry && entry.type === currentType
	};
}

function renderWingHistory(type, elements, filterValue = "current") {
	const { historySection, historySummary, historyCompare, historyList, historyFilterHint } = elements;

	if (!historySection || !historySummary || !historyCompare || !historyList) {
		return;
	}

	const allHistory = loadWingHistory();
	const filterMeta = getHistoryFilterMeta(type, filterValue);
	const filteredHistory = allHistory
		.filter((entry) => filterMeta.predicate(entry) && Array.isArray(entry.scores) && entry.scores.length > 0)
		.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

	if (historyFilterHint) {
		historyFilterHint.textContent = `表示対象: ${filterMeta.label}`;
	}

	if (filteredHistory.length === 0) {
		historySection.hidden = false;
		historySummary.textContent = `${filterMeta.label}の履歴はまだありません。`;
		historyCompare.innerHTML = "<p>この表示条件では前後比較を作れません。</p>";
		historyList.innerHTML = '<p class="history-empty">別の表示対象を選ぶか、判定を実行して履歴を作成してください。</p>';
		return;
	}

	historySection.hidden = false;
	historySummary.textContent = `${filterMeta.label}の履歴は ${filteredHistory.length} 件です。直近3件を表示しています。`;

	const latest = filteredHistory[0];
	const previous = filteredHistory[1] ?? null;
	historyCompare.innerHTML = `<p>${getWingComparisonText(latest, previous, filterMeta.label)}</p>`;

	const recentThree = filteredHistory.slice(0, 3);
	historyList.innerHTML = recentThree
		.map((entry, index) => {
			const first = entry.scores[0];
			const second = entry.scores[1] ?? null;
			const firstPercent = getWingPercent(first);
			const secondPercent = second ? getWingPercent(second) : 0;
			const gapText = typeof entry.gapPercent === "number" ? `${entry.gapPercent}%` : "-";
			const typeLine = filterValue === "all" ? `<p class="history-type">タイプ${entry.type}</p>` : "";

			return `
				<article class="history-card">
					<h3>${index === 0 ? "最新" : `${index + 1}件前`}</h3>
					${typeLine}
					<p class="history-date">${formatHistoryDate(entry.createdAt)}</p>
					<p>1位: ${entry.topWingCode}（一致度 ${firstPercent}%）</p>
					<p>${second ? `2位: ${second.wingCode}（一致度 ${secondPercent}%）` : "2位: -"}</p>
					<p>1位と2位の一致度差: ${gapText}</p>
				</article>
			`;
		})
		.join("");
}

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
			resultSummary.textContent = `タイプ${previewType}のプレビュー結果を表示しています。`;
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
			const max = entry.questions.length * RESPONSE_OPTIONS.length;

			return {
				type: entry.type,
				name: entry.name,
				score,
				max,
				normalized: max ? score / max : 0
			};
		});

		scores.sort(compareByNormalizedScore);
		const answers = collectAnswers(diagnosisForm);
		const topThree = scores.slice(0, 3);
		currentDiagnosisResult = {
			scores,
			answers,
			selectedRankIndex: 0
		};
		saveDiagnosisState(currentDiagnosisResult);

		if (resultSummary) {
			resultSummary.textContent = `一致度が最も高いのは タイプ${topThree[0].type}（${topThree[0].name}）です。2位・3位の結果は上部リンクで切り替えられます。`;
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
			max,
			normalized: max ? score / max : 0
		};
	}).sort(compareByNormalizedScore);

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

			<h3>一致度（%）</h3>
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
	const wingHistory = document.getElementById("wing-history");
	const wingHistorySummary = document.getElementById("wing-history-summary");
	const wingHistoryCompare = document.getElementById("wing-history-compare");
	const wingHistoryList = document.getElementById("wing-history-list");
	const wingHistoryFilter = document.getElementById("wing-history-filter");
	const wingHistoryFilterHint = document.getElementById("wing-history-filter-hint");
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
		wSummary.textContent = `${selectedRankIndex + 1}位の結果を確認しました。一致度が最も高いのはタイプ${topResult.type}（${profile.title}）です。`;
	}

	if (wDetail) {
		wDetail.innerHTML = `
			<p>一致度: ${percentage}%</p>
			<p>${profile.overview}</p>
			<p>ウイング判定では、タイプ${topResult.type}に対応する ${wingCodes.join(" と ")} のみ、合計${totalWingQuestions}問を表示します。</p>
		`;
	}

	if (wingIntro) {
		wingIntro.textContent = `タイプ${topResult.type}のウイング候補（${wingCodes.join(" / ")}）に回答してください。`;
	}

	if (wingHistoryFilter) {
		wingHistoryFilter.value = "current";
		wingHistoryFilter.addEventListener("change", () => {
			renderWingHistory(topResult.type, {
				historySection: wingHistory,
				historySummary: wingHistorySummary,
				historyCompare: wingHistoryCompare,
				historyList: wingHistoryList,
				historyFilterHint: wingHistoryFilterHint
			}, wingHistoryFilter.value);
		});
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
				const max = questions.length * RESPONSE_OPTIONS.length;

				return {
					wingCode,
					score,
					max,
					normalized: max ? score / max : 0
				};
			});

			wingScores.sort(compareByNormalizedScore);
			const gapSummary = getWingGapSummary(wingScores);
			const topWing = gapSummary ? gapSummary.topWing : wingScores[0];
			const secondWing = gapSummary ? gapSummary.secondWing : wingScores[1];
			const wingState = {
				type: topResult.type,
				wings: wingCodes,
				scores: wingScores,
				answers: collectWingAnswers(wingForm, wingCodes)
			};
			const historyEntry = {
				type: topResult.type,
				createdAt: new Date().toISOString(),
				topWingCode: topWing ? topWing.wingCode : "",
				gapPercent: gapSummary ? gapSummary.gapPercent : null,
				scores: wingScores.map((entry) => ({
					wingCode: entry.wingCode,
					score: entry.score,
					max: entry.max,
					normalized: entry.normalized
				}))
			};

			saveWingState(wingState);
			appendWingHistoryEntry(historyEntry);
			renderWingHistory(topResult.type, {
				historySection: wingHistory,
				historySummary: wingHistorySummary,
				historyCompare: wingHistoryCompare,
				historyList: wingHistoryList,
				historyFilterHint: wingHistoryFilterHint
			}, wingHistoryFilter ? wingHistoryFilter.value : "current");

			if (wingResultSummary && topWing) {
				wingResultSummary.textContent = `ウイング判定では、一致度が最も高いのは ${topWing.wingCode} です。`;
			}

			if (wingResultDetail && topWing) {
				const topPercent = Math.round((topWing.score / topWing.max) * 100);
				const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;
				const gapLine = gapSummary && typeof gapSummary.gapPercent === "number"
					? `<p>1位と2位の一致度差: ${gapSummary.gapPercent}%（${gapSummary.label}）</p>`
					: "";

				wingResultDetail.innerHTML = `
					<p>タイプ${topResult.type}の候補: ${wingCodes.join(" / ")}</p>
					<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
					${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
					${gapLine}
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
		const gapSummary = getWingGapSummary(Array.isArray(storedWingState.scores) ? storedWingState.scores : []);

		if (wingResultSummary && topWing) {
			wingResultSummary.textContent = `前回のウイング判定では、一致度が最も高かったのは ${topWing.wingCode} でした。`;
		}

		if (wingResultDetail && topWing) {
			const topPercent = Math.round((topWing.score / topWing.max) * 100);
			const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;
			const gapLine = gapSummary && typeof gapSummary.gapPercent === "number"
				? `<p>1位と2位の一致度差: ${gapSummary.gapPercent}%（${gapSummary.label}）</p>`
				: "";

			wingResultDetail.innerHTML = `
				<p>タイプ${topResult.type}の候補: ${wingCodes.join(" / ")}</p>
				<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
				${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
				${gapLine}
			`;
		}

		if (wingResult) {
			wingResult.hidden = false;
		}

		renderWingHistory(topResult.type, {
			historySection: wingHistory,
			historySummary: wingHistorySummary,
			historyCompare: wingHistoryCompare,
			historyList: wingHistoryList,
			historyFilterHint: wingHistoryFilterHint
		}, wingHistoryFilter ? wingHistoryFilter.value : "current");
	} else {
		clearWingState();
		renderWingHistory(topResult.type, {
			historySection: wingHistory,
			historySummary: wingHistorySummary,
			historyCompare: wingHistoryCompare,
			historyList: wingHistoryList,
			historyFilterHint: wingHistoryFilterHint
		}, wingHistoryFilter ? wingHistoryFilter.value : "current");
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

