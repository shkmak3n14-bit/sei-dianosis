/**
 * ウイング判定ページ（w.html）の初期化・データ・UI操作
 */
import { TYPE_PROFILES } from "../data/typeProfiles.js";
import { TYPE8_WING_DETAIL_PROFILES } from "../data/wingDetails/type8.js";
import {
	loadStoredDiagnosisState,
	saveWingState,
	loadWingState,
	clearWingState,
	loadWingHistory,
	appendWingHistoryEntry
} from "../core/storage.js";
import {
	RESPONSE_OPTIONS,
	compareByNormalizedScore,
	formatHistoryDate
} from "../core/utils.js";

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

const WING_LONG_PROFILES = {
	"1w9": {
		title: "タイプ1ウイング9",
		overview: "正しさを大切にしながら、場の平和も守ろうとするタイプです。厳密さと穏やかさの両立を目指します。",
		manifestation: "改善点には敏感ですが、強く押すより静かに整える動きになりやすいです。対立は最小化しつつ品質を上げようとします。",
		values: "誠実さ、秩序、調和、丁寧な進め方を大切にします。",
		redline: "不誠実な進行、雑な判断、無責任な押し切りが続くと強く消耗します。",
		goodCycle: "判断基準を言語化し、相手の事情も尊重して合意を作ると、信頼される調整役になります。",
		learning: "落ち着いて論点を整理できる人（5、6、成熟した9）から学びが深まりやすいです。",
		growth: "前進を促してくれるが威圧しない人（3、健全な8）と組むと、実行力が伸びます。",
		stress: "我慢が続くと、表面は静かなまま内側で自己批判と不満が強まります。",
		check: "『別に大丈夫』と言いながら身体が固い、細部への苛立ちが増える、訂正だけして本音を言えていない。",
		recovery: "まず不満を1つ短文で言葉にし、次に『修正案を1つ』だけ提案します。溜め込む前の小出しが回復の鍵です。"
	},
	"1w2": {
		title: "タイプ1ウイング2",
		overview: "正しさと貢献意識が強く、役に立つ形で改善を進めたいタイプです。",
		manifestation: "基準を守りつつ人を支えるため、指導や伴走に力を出します。頼られると責任がさらに強まります。",
		values: "正確さ、誠実さ、役に立つこと、相手の成長を重視します。",
		redline: "感謝のない依頼、丸投げ、善意の利用が続くと怒りと疲労が蓄積します。",
		goodCycle: "役割範囲を明確にし、支援と自己管理を両立できると、信頼される育成者になります。",
		learning: "境界線を明確にできる人（8、5、成熟した1）が学びを進めます。",
		growth: "成果を測りながら前進させる人（3、6）と組むと、支援が持続可能になります。",
		stress: "『私がやらなければ』が強くなり、過剰介入と自己否定が同時に進みます。",
		check: "頼まれごとを即答で受ける、疲れているのに手放せない、評価不足に敏感になる。",
		recovery: "引き受ける前に『今週の余力』を確認し、1件だけ断る練習をします。助け方の上限設定が好転につながります。"
	},
	"2w1": {
		title: "タイプ2ウイング1",
		overview: "人を支えたい気持ちに、正しさと誠実さの基準が加わるタイプです。",
		manifestation: "親切さに加え、やり方の丁寧さや公平性まで気を配ります。見えない裏方仕事を引き受けがちです。",
		values: "思いやり、礼節、役立つこと、良心に沿う行動を大切にします。",
		redline: "無礼な依頼、配慮の欠如、手順軽視が続くと強い摩耗が起きます。",
		goodCycle: "助ける範囲と基準を先に共有すると、温かさと品質が両立します。",
		learning: "感情と境界の両方を扱える人（9、5、成熟した1）が学びを促します。",
		growth: "実行優先で背中を押す人（3、8）と組むと、先延ばしを防げます。",
		stress: "『ちゃんと助けなければ』が過熱し、自己否定と他者評価の揺れが強まります。",
		check: "頼まれていない支援が増える、感謝不足に傷つく、正しさで自分を追い詰める。",
		recovery: "支援前に『これは私の役割か』を確認し、1日1回は自分の希望を先に言語化します。"
	},
	"2w3": {
		title: "タイプ2ウイング3",
		overview: "人の役に立ちながら成果も出したい、対人力と実行力の高いタイプです。",
		manifestation: "気配りとスピードを両立し、期待に応える動きが得意です。評価が追い風になると非常に強いです。",
		values: "貢献、成果、信頼、好印象の維持を重視します。",
		redline: "努力の不可視化、曖昧な評価、一方的な要求が続くと消耗が加速します。",
		goodCycle: "目標と支援範囲を数値化すると、頑張りすぎを防ぎつつ高い成果が出ます。",
		learning: "冷静に優先順位を引ける人（5、1、6）から学びやすいです。",
		growth: "率直に本音確認してくれる人（8、4）と組むと自己同一性が安定します。",
		stress: "必要とされたい気持ちと評価不安が重なり、過活動と空虚感が出やすくなります。",
		check: "断れない、実績アピールが増える、疲労を隠す、反応待ちで気分が揺れる。",
		recovery: "成果目標と休息目標を同時に設定し、『頼まれていない追加対応』を1つ減らします。"
	},
	"3w2": {
		title: "タイプ3ウイング2",
		overview: "達成意欲に対人配慮が加わり、成果と関係を同時に作るタイプです。",
		manifestation: "相手の期待を読み、役立つ結果を素早く返します。場の空気を掴んで推進役になりやすいです。",
		values: "成果、貢献、信頼、機会創出を大切にします。",
		redline: "無意味な停滞、評価の不透明さ、努力の否認でモチベーションが急落します。",
		goodCycle: "目標と人間関係の両方を設計できると、チーム成果を大きく押し上げます。",
		learning: "内省を促し本音を扱える人（4、9、成熟した6）が学びを深めます。",
		growth: "論点を絞る人（1、5）と組むと、速度と精度のバランスが整います。",
		stress: "成果維持への焦りで感情を切り離し、役割演技が過剰になります。",
		check: "休んでも頭が止まらない、結果以外の会話が減る、評価への過敏さが増える。",
		recovery: "毎日5分だけ感情を記録し、結果ではなく『本当に大切な理由』を言葉に戻します。"
	},
	"3w4": {
		title: "タイプ3ウイング4",
		overview: "成果志向に独自性へのこだわりが加わる、表現力の高い達成タイプです。",
		manifestation: "実績を出しつつ、他者との差別化や美意識を重視します。質と印象の両方を取りにいきます。",
		values: "達成、独自性、審美性、自己表現の一貫性を大切にします。",
		redline: "凡庸化、テンプレ対応、評価の浅さに強い不満が出ます。",
		goodCycle: "成果基準と創造基準を分けて運用すると、過不足なく力を発揮できます。",
		learning: "現実的な優先順位を示す人（1、6、5）が実行の安定を助けます。",
		growth: "受容的で深い対話ができる人（4、9、2）が内面の揺れを整えます。",
		stress: "比較意識が強まり、承認欲求と自己否定が往復しやすくなります。",
		check: "見え方調整に時間を使いすぎる、着手が遅れる、批評への防衛が強くなる。",
		recovery: "『完成度より提出』の小目標を置き、評価軸を3つに固定して振れ幅を減らします。"
	},
	"4w3": {
		title: "タイプ4ウイング3",
		overview: "感受性の深さと成果への意識を併せ持つ、表現型の実行タイプです。",
		manifestation: "内面の体験を作品や成果に変換しようとします。反応があると推進力が増します。",
		values: "本物感、独自性、達成感、他者との意味ある共鳴を重視します。",
		redline: "表面的評価、比較による矮小化、感性の軽視が続くと失速します。",
		goodCycle: "感情を素材化し、期限と形式を決めると、創造性が現実成果に結びつきます。",
		learning: "構造化を支える人（1、5、6）から実務面の学びが得られます。",
		growth: "実行を促す人（3、8）と、感情を受け止める人（9、2）の両輪が有効です。",
		stress: "比較と自己否定が強まり、気分依存で行動が止まりやすくなります。",
		check: "他者反応に気分が支配される、未完了が増える、自己価値が日ごとに乱高下する。",
		recovery: "感情を書き出した後に『次の具体行動1つ』を必ず実行し、現実接続を戻します。"
	},
	"4w5": {
		title: "タイプ4ウイング5",
		overview: "深い感情理解と知的探究が結びついた、内省性の高いタイプです。",
		manifestation: "一人で深く考え、意味を掘り下げる時間を必要とします。表現は厳選された形になりやすいです。",
		values: "内面の真実、独自の世界観、深い理解、静かな誠実さを重視します。",
		redline: "浅い共感、過干渉、急な社交圧でエネルギーが急低下します。",
		goodCycle: "内省時間を確保しつつ、外部との接点を小さく継続すると創造が安定します。",
		learning: "現実接続を支える人（1、6、成熟した3）から実装面の学びが得られます。",
		growth: "温かく待てる人（9、2）と論点整理できる人（5）との関係が刺激になります。",
		stress: "孤立と過思考が進み、行動より解釈に閉じこもりやすくなります。",
		check: "返信回避、考察だけで終わる、体力低下を無視して内省を続ける。",
		recovery: "一人時間を守ったうえで、外部に出す行動を1つだけ設定します。未完成共有が回復の導線です。"
	},
	"5w4": {
		title: "タイプ5ウイング4",
		overview: "分析力に独自の感性が加わる、専門性と個性を併せ持つタイプです。",
		manifestation: "理解の深さを重視しながら、自分ならではの視点や表現を保持します。",
		values: "知的整合性、独自性、境界線、集中できる静けさを大切にします。",
		redline: "表層的議論、感情の押し付け、思考時間の侵害で強く閉じます。",
		goodCycle: "探究テーマを絞り、定期的に外へ出力すると価値が伝わりやすくなります。",
		learning: "実行の筋道を示す人（1、3、6）が学びを前進させます。",
		growth: "受容的対話ができる人（9、2、4）から感情統合の刺激を受けやすいです。",
		stress: "距離を取りすぎて孤立し、理解は深まるのに現実影響が減ります。",
		check: "準備中が長期化、共有回避、他者との温度差への苛立ちが増える。",
		recovery: "『十分理解したら公開』ではなく『途中公開して検証』へ切り替えるのが好転点です。"
	},
	"5w6": {
		title: "タイプ5ウイング6",
		overview: "知的探究と安全志向が結びついた、精密で慎重な分析タイプです。",
		manifestation: "情報収集、検証、リスク点検を丁寧に行い、再現性の高い判断を目指します。",
		values: "正確性、安全性、予測可能性、信頼できる根拠を重視します。",
		redline: "根拠不明の指示、場当たり運用、検証なしの即断が続くと不安が増大します。",
		goodCycle: "調査範囲と期限を決めると、精度を保ったまま実行速度を上げられます。",
		learning: "決断を支える人（8、3、成熟した1）から学びやすいです。",
		growth: "心理的安全を作る人（9、2）と組むと、共有行動が増えて成果化します。",
		stress: "不確実性で再確認が止まらず、行動開始が遅れます。",
		check: "同じ確認を繰り返す、最悪想定が拡大する、対人接点を減らしすぎる。",
		recovery: "判断期限を先に置き、『必要十分な根拠3点』で着手します。完全性より検証循環を優先します。"
	},
	"6w5": {
		title: "タイプ6ウイング5",
		overview: "不安管理に分析力が加わる、慎重で論理的な守り手タイプです。",
		manifestation: "先回りでリスクを検討し、事実確認を丁寧に行います。簡単には信用せず根拠で判断します。",
		values: "安全、信頼、一貫性、検証可能性を大切にします。",
		redline: "情報の不透明さ、説明不足、責任の曖昧さが続くと警戒が強まります。",
		goodCycle: "懸念を構造化して共有できると、チームの事故予防装置として機能します。",
		learning: "意思決定を前へ進める人（3、8）から実行の学びが得られます。",
		growth: "受容的で落ち着いた人（9、2）と関わると過緊張が緩みます。",
		stress: "疑念が連鎖し、確認過多と行動遅延が同時に進みます。",
		check: "『まだ不十分』が増える、相談先を固定できない、同じ資料を何度も見直す。",
		recovery: "不安を『事実・推測・対策』に分け、最小実行を1つ決めます。小さな成功で信頼を再構築します。"
	},
	"6w7": {
		title: "タイプ6ウイング7",
		overview: "安全を求めつつ前向きさも持つ、対話型の現実派タイプです。",
		manifestation: "不安を一人で抱えず、人と相談しながら動きます。準備しつつ楽しさも確保しようとします。",
		values: "安心、仲間意識、柔軟性、先回りの備えを重視します。",
		redline: "孤立、曖昧な指示、サポート不在で不安が急上昇します。",
		goodCycle: "相談相手と進捗リズムを固定すると、慎重さと行動力が両立します。",
		learning: "論点を絞る人（1、5、成熟した3）から判断力を学べます。",
		growth: "挑戦を後押しする人（7、8）と組むと停滞を破りやすいです。",
		stress: "気分転換で不安を上書きし続け、重要判断を先送りしやすくなります。",
		check: "予定を詰めすぎる、確認依存が増える、考えを一人で閉じられない。",
		recovery: "安心行動と前進行動を1つずつ決め、同日に実行します。『備えるだけ』を止めるのが転換点です。"
	},
	"7w6": {
		title: "タイプ7ウイング6",
		overview: "楽しさ追求に安全確認が加わる、機動力の高いバランスタイプです。",
		manifestation: "新規性を求めつつ、保険や代替案も準備します。仲間との計画で勢いが出ます。",
		values: "自由、希望、安心して楽しめる状態、選択肢の確保を重視します。",
		redline: "拘束、悲観の固定化、逃げ道のない設計が続くと反発が強まります。",
		goodCycle: "完了条件を先に決めると、発想力が成果へつながります。",
		learning: "深掘りを促す人（5、1、6）から集中力を学びやすいです。",
		growth: "実行を牽引する人（3、8）との協働で着地力が高まります。",
		stress: "不安回避で予定を増やし、注意資源が分散します。",
		check: "着手は早いが完了が遅い、重い話題を避ける、切替で疲労をごまかす。",
		recovery: "同時進行を3件以内に絞り、最も重い案件を最初の25分だけ実行します。"
	},
	"7w8": {
		title: "タイプ7ウイング8",
		overview: "楽しさと推進力が強く、勢いで道を切り開くパワフルなタイプです。",
		manifestation: "機会を見つけると即行動し、場を動かす力があります。主導権を握るほど力が出ます。",
		values: "自由、スピード、影響力、体験の濃さを大切にします。",
		redline: "停滞、過度な管理、選択肢の剥奪で強い反発が出ます。",
		goodCycle: "勢いに検証役を一人置くと、突破力が成果と信頼に変わります。",
		learning: "構造と優先順位を示す人（1、5、6）から安定運用を学べます。",
		growth: "受容的にブレーキをかける人（9、2）と組むと継続力が上がります。",
		stress: "退屈回避で刺激を追いすぎ、対人圧が上がりやすくなります。",
		check: "待てない、結論を急ぐ、反論への苛立ちが強い、完了前に次へ飛ぶ。",
		recovery: "行動前に『目的・副作用・終わり方』を30秒確認し、1つ終えるまで新規着手を止めます。"
	},
	"8w7": {
		title: "タイプ8ウイング7",
		overview: "強い主導性に機動力が加わる、推進力の高いチャレンジャータイプです。",
		manifestation: "決断が速く、障害を押し切って前進します。場の停滞を嫌い、方向を明確に示します。",
		values: "主導権、公正、自由、成果のスピードを重視します。",
		redline: "支配、欺瞞、責任回避、遅い意思決定が続くと攻勢が強まります。",
		goodCycle: "率直さに配慮を足すと、強さが保護と育成に変わります。",
		learning: "受容と間を作れる人（9、2、5）が学びを深めます。",
		growth: "精度を担保する人（1、6）と組むと長期成果が安定します。",
		stress: "防衛反応で押し込みが増え、対話より制圧に傾きます。",
		check: "説明を飛ばす、相手の遅さに過敏、任せるより握る選択が増える。",
		recovery: "指示前に相手事情を1つ聞き、結論を『共同決定』の形に言い換えます。"
	},
	"8w9": {
		title: "タイプ8ウイング9",
		overview: "強さと落ち着きを併せ持ち、静かに場を守る統率タイプです。",
		manifestation: "普段はどっしり構えますが、境界侵害には明確に止めに入ります。感情より態度で意思を示しやすいです。",
		values: "自立、主導権、平穏、信頼、守る責任を重視します。",
		redline: "回りくどい操作、境界無視、責任放棄が続くと強い反発が出ます。",
		goodCycle: "目的と役割を明確化し、強さを保護行動へ使うと周囲の安心が増えます。",
		learning: "感情の言語化を促す人（2、4、9）から対人の幅を学べます。",
		growth: "構造と検証を担う人（1、5、6）と組むと判断の再現性が上がります。",
		stress: "防衛優先で対話が減り、無言の圧や切断行動が増えやすくなります。",
		check: "相手の話を最後まで聞かない、任せられない、怒りで疲労を覆う。",
		recovery: "怒りの下にある感情を1語で特定し、要求を『してほしい行動』で具体化します。"
	},
	"9w8": {
		title: "タイプ9ウイング8",
		overview: "穏やかさを土台にしながら、必要時に強く踏ん張れるタイプです。",
		manifestation: "普段は合わせられますが、境界が破られると急に強く反応します。重要点では粘り強いです。",
		values: "安心、平和、自分のペース、境界線、身内の保護を重視します。",
		redline: "強制、侵入、繰り返しの圧力が続くと内側の怒りが急上昇します。",
		goodCycle: "早めの本音共有と境界表明ができると、包容力と実行力が同時に活きます。",
		learning: "論点を静かに明確化する人（1、5、6）から学びが深まります。",
		growth: "前進を促す人（3、8）と組むと先送りを防げます。",
		stress: "我慢を重ねて突然強く出る、という反動パターンが起こりやすいです。",
		check: "『どうでもいい』が増える、返答が遅れる、小刺激に過剰反応する。",
		recovery: "爆発前に不快感を数値化し、境界線を短く伝えます。小さな自己主張の継続が回復を作ります。"
	},
	"9w1": {
		title: "タイプ9ウイング1",
		overview: "穏やかさと良心の強さを併せ持ち、静かに整えることを好むタイプです。",
		manifestation: "対立を避けながら丁寧さを保とうとします。乱れや不誠実さには内心で強く反応します。",
		values: "平和、誠実、丁寧さ、良心に沿う判断を大切にします。",
		redline: "雑な進行、急な圧力、理不尽な要求が続くと無力感が蓄積します。",
		goodCycle: "小さく意見を言う習慣を持つと、調停力と実行力が安定します。",
		learning: "境界と優先順位を示せる人（1、5、8）から学びが進みます。",
		growth: "行動を後押しする人（3、6）と組むと停滞を抜けやすくなります。",
		stress: "本音を飲み込み続け、先延ばしと自己批判が強まります。",
		check: "『合わせる』が増える、決められない、疲れているのに休めない。",
		recovery: "今の希望を1文で書き、最優先タスクを1つだけ先に実行します。自己消失を防ぐ小行動が鍵です。"
	}
};

function renderWingLongProfile(wingCode) {
	const profile = WING_LONG_PROFILES[wingCode];

	if (!profile) {
		return "";
	}

	const hasDetail = Object.prototype.hasOwnProperty.call(WING_DETAIL_PROFILES, wingCode);
	const detailLinkMarkup = hasDetail
		? `<p class="detail-link-row"><a href="wing-learn.html?wing=${encodeURIComponent(wingCode)}" class="detail-link">詳細版を読む →</a></p>`
		: "";

	return `
		<article class="report-card">
			<h3>本文版ウイング解説</h3>
			${detailLinkMarkup}
			<p><strong>1. メインタイプ＋ウイング:</strong> ${profile.title}</p>
			<p><strong>2. 概要:</strong> ${profile.overview}</p>
			<p><strong>3. ウイングの現れ方:</strong> ${profile.manifestation}</p>
			<p><strong>4. 何を大切にしているのか:</strong> ${profile.values}</p>
			<p><strong>5. 無理が出やすい場面:</strong> ${profile.redline}</p>
			<p><strong>6. 好循環には何が必要か:</strong> ${profile.goodCycle}</p>
			<p><strong>7. 学びには何が必要か:</strong> ${profile.learning}</p>
			<p><strong>8. 成長のキッカケ/刺激:</strong> ${profile.growth}</p>
			<p><strong>9. 悪循環の入口/高ストレス状態:</strong> ${profile.stress}</p>
			<p><strong>10. 自認チェックポイント:</strong> ${profile.check}</p>
			<p><strong>11. 悪循環を好転するために必要なこと:</strong> ${profile.recovery}</p>
		</article>
	`;
}

export const WING_DETAIL_PROFILES = {
	"9w1": {
		title: "タイプ9w1（やわらかく整える人）",
		sections: [
			{
				heading: "1. このウイングの特徴",
				body: "9w1は、タイプ9（平和でありたい人）から派生したウイングです。穏やかでいたい気持ちと、きちんとしていたい気持ちの両方を持ちやすいタイプです。対立を避けたい一方で、内側には「こうあるべき」という基準もあります。そのため、外からは柔らかく見えても、内面では静かな緊張や自己批判を抱えていることがあります。"
			},
			{
				heading: "2. このウイングが日常でどう現れやすいか",
				body: "ふだんは人に合わせやすく、場を乱さないように動きます。ただ、雑さや不誠実さが目に入ると、内心ではかなり引っかかります。表立ってぶつかるより、自分が我慢する、静かに距離を取る、黙って整え直す、という形で反応しやすいです。頼まれると断りきれず引き受ける一方で、「本当はこうしたほうがいいのに」と思いながら飲み込むこともあります。"
			},
			{
				heading: "3. 何を大切にしているか",
				body: "平和、穏やかさ、良心、誠実さ、丁寧さを大切にしやすいです。ただ楽でいたいというより、「波風を立てず、でも雑にはしたくない」という気持ちがあります。"
			},
			{
				heading: "4. 無理が出やすい場面・強く反応しやすいこと",
				body: "急かされること、乱暴に扱われること、不誠実さを押しつけられることに無理が出やすいです。また、自分の気持ちを後回しにし続けると、表面上は穏やかなままでも内側に不満や疲れがたまりやすくなります。"
			},
			{
				heading: "5. 好循環には何が必要か",
				body: "落ち着いて考える時間があること。自分のペースを守れること。意見を急かされずに言えること。丁寧さや誠実さがきちんと尊重される環境では、9w1の穏やさは周囲を安心させる力になります。"
			},
			{
				heading: "6. 学びには何が必要か",
				body: "優しさを持ちながらも、曖昧さを整理できる人が合いやすいです。感情を乱暴に踏み込まず、それでも「あなたはどうしたいのか」を静かに問い返せる人です。タイプで言えば、落ち着いた1、5、6あたりの資質を持つ人から学びやすいことがあります。"
			},
			{
				heading: "7. 成長のきっかけや刺激を受けやすい相手の傾向",
				body: "遠慮しすぎず、でも押しつけすぎない人が刺激になります。特に、自分の意思をはっきり持ちつつ相手も尊重できる人は、9w1に「静かなままでも意見は持っていい」と気づかせてくれます。タイプで言えば、成熟した3や8、あるいは健全な1の影響が役立つことがあります。"
			},
			{
				heading: "8. 悪循環の入口で起きやすいこと",
				body: "小さな違和感を飲み込み続ける。断るべき場面で曖昧に受ける。自分の本音が分からなくなる。その一方で、内心では「ちゃんとしたいのにできていない」と自分を責めやすくなります。"
			},
			{
				heading: "9. 「今ちょっと危ないかも」と気づくためのチェックポイント",
				body: "頼まれると反射的に引き受けていないか。「別にいい」と言いながら少しイライラしていないか。やるべきことの前で、静かに固まっていないか。人に腹を立てるより先に、自分を責めていないか。"
			},
			{
				heading: "10. 悪循環から立て直すために必要なこと",
				body: "今すぐ必要なのは、「本当は嫌だった」「本当はこうしたい」を小さく言葉にすることです。大きな主張でなくて構いません。まずは、自分の感覚を消さないことが大切です。長い目では、対立を避けることと自分を消すことは同じではない、と体で学ぶ必要があります。意見を言っても関係は壊れない経験を少しずつ増やすことが回復につながります。"
			}
		]
	},
	"9w8": {
		title: "タイプ9w8（穏やかで芯の強い人）",
		sections: [
			{
				heading: "1. このウイングの特徴",
				body: "9w8は、タイプ9（平和でありたい人）から派生したウイングです。穏やかでいたい気持ちを土台に持ちながら、必要な時には強く踏ん張る力もあります。9の柔らかさに8の芯の強さが加わるため、ふだんは穏やかでも、境界を越えられた時には急に力強く反応することがあります。優しいだけではなく、守るものがあるとかなり粘り強い人です。"
			},
			{
				heading: "2. このウイングが日常でどう現れやすいか",
				body: "ふだんは自然体で構え、人に細かく干渉しすぎません。ただ、自分の領域や大切な人が脅かされると、一気に態度が変わることがあります。普段は譲れても、「そこは無理」という一点ではかなり頑固です。人前で目立って支配したいというより、静かに主導権を失いたくない感覚を持ちやすいです。"
			},
			{
				heading: "3. 何を大切にしているか",
				items: [
					"安心",
					"平和",
					"自分のペース",
					"境界線",
					"身内の安全"
				],
				footer: "「揉めたくない」が本音でも、「舐められたくない」「踏み込まれたくない」も同時にあります。"
			},
			{
				heading: "4. 無理が出やすい場面・強く反応しやすいこと",
				items: [
					"強引にコントロールされること",
					"何度も境界を無視されること",
					"大事な人や自分の居場所が軽く扱われること"
				],
				footer: "こうした場面では、普段の穏やかさから急に強い反応へ切り替わることがあります。"
			},
			{
				heading: "5. 好循環には何が必要か",
				items: [
					"安心して力を抜けること",
					"自分のペースが守られること",
					"必要な時に遠慮なく「嫌だ」と言えること"
				],
				footer: "人に合わせすぎず、自分の感覚も尊重される環境では、9w8の包容力と底力が安定して働きます。"
			},
			{
				heading: "6. 学びには何が必要か",
				body: "落ち着いていて、圧をかけずに本音を引き出せる人が向いています。また、強さを持ちながら乱暴ではない人も良い学び相手になります。タイプで言えば、成熟した8、1、5あたりの資質を持つ人が役立つことがあります。"
			},
			{
				heading: "7. 成長のきっかけや刺激を受けやすい相手の傾向",
				body: "自分の意志を明確に持ち、前に進む力のある人から刺激を受けやすいです。ただし、押しつける人ではなく、「あなたはどうしたい」と促してくれる人が向いています。タイプで言えば、健全な3や8、あるいは自覚的な6などが動くきっかけになりやすいです。"
			},
			{
				heading: "8. 悪循環の入口で起きやすいこと",
				items: [
					"面倒を避けて先送りする",
					"言うべきことを言わずに溜める",
					"普段は大丈夫そうに見えて、内側では鈍い苛立ちがたまる",
					"限界を超えたところで急に強く出て、自分でも驚くことがある"
				]
			},
			{
				heading: "9. 「今ちょっと危ないかも」と気づくためのチェックポイント",
				listStyle: "check",
				items: [
					"「どうでもいい」と言う回数が増えていないか",
					"本当は嫌なのに流していないか",
					"黙っているが、体は固くなっていないか",
					"小さなことに急にムッとしやすくなっていないか",
					"人を避けたい気持ちと、強く押し返したい気持ちが同時に出ていないか"
				]
			},
			{
				heading: "10. 悪循環から立て直すために必要なこと",
				body: "今すぐ必要なのは、爆発する前に不快感を小さく認めることです。「まだ大丈夫」と鈍らせ続けるほど、反動は強くなります。長い目では、穏やかさのために自分を消すのではなく、自分を守ったうえで穏やかでいる練習が必要です。境界線を早めに言葉にすることが、結果として人間関係も守ります。"
			}
		]
	},
	...TYPE8_WING_DETAIL_PROFILES
};

function getWingProfileLayerHint(layer) {
	if (layer === "mobile") {
		return "要点版。スマホで読みやすい短文表示です。";
	}

	if (layer === "card") {
		return "共有版。関わり方のすり合わせに使いやすい表示です。";
	}

	return "詳細版。10項目の本文をそのまま表示します。";
}

function renderWingMobileProfile(wingCode) {
	const profile = WING_LONG_PROFILES[wingCode];

	if (!profile) {
		return "";
	}

	return `
		<article class="report-card">
			<h3>スマホ要約版</h3>
			<p><strong>タイプ:</strong> ${profile.title}</p>
			<p><strong>ふだんの傾向:</strong> ${profile.overview} ${profile.manifestation}</p>
			<p><strong>大切にしていること:</strong> ${profile.values}</p>
			<p><strong>無理が出やすい場面:</strong> ${profile.redline}</p>
			<p><strong>しんどい時のサイン:</strong> ${profile.check}</p>
			<p><strong>好転の一歩:</strong> ${profile.recovery}</p>
		</article>
	`;
}

function renderWingShareCardProfile(wingCode) {
	const profile = WING_LONG_PROFILES[wingCode];

	if (!profile) {
		return "";
	}

	return `
		<article class="share-card">
			<h3>共有カード版: ${profile.title}</h3>
			<p><strong>ふだんの私:</strong> ${profile.overview}</p>
			<p><strong>誤解されやすいポイント:</strong> ${profile.stress}</p>
			<p><strong>しんどい時のサイン:</strong> ${profile.check}</p>
			<p><strong>してほしい関わり方:</strong> ${profile.growth}</p>
			<p><strong>一言メッセージ:</strong> ${profile.recovery}</p>
		</article>
	`;
}

function renderWingLayerProfile(wingCode, layer) {
	if (layer === "mobile") {
		return renderWingMobileProfile(wingCode);
	}

	if (layer === "card") {
		return renderWingShareCardProfile(wingCode);
	}

	return renderWingLongProfile(wingCode);
}

function buildWingResultDetailMarkup(topType, wingCodes, topWing, secondWing, gapSummary, layer) {
	if (!topWing) {
		return "";
	}

	const topPercent = Math.round((topWing.score / topWing.max) * 100);
	const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;
	const gapLine = gapSummary && typeof gapSummary.gapPercent === "number"
		? `<p>1位と2位の一致度差: ${gapSummary.gapPercent}%（${gapSummary.label}）</p>`
		: "";
	const wingLayerProfile = renderWingLayerProfile(topWing.wingCode, layer);

	return `
		<p>タイプ${topType}の候補: ${wingCodes.join(" / ")}</p>
		<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
		${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
		${gapLine}
		${wingLayerProfile}
	`;
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

function getWingPercent(scoreEntry) {
	if (!scoreEntry || !scoreEntry.max) {
		return 0;
	}

	return Math.round(((scoreEntry.score / scoreEntry.max) * 100) * 10) / 10;
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

export function initializeWPage() {
	const wPage = document.getElementById("w-page");
	const wSummary = document.getElementById("w-summary");
	const wDetail = document.getElementById("w-detail");
	const wBackLink = document.getElementById("w-back-link");
	const wingIntro = document.getElementById("wing-intro");
	const wingForm = document.getElementById("wing-form");
	const wingResult = document.getElementById("wing-result");
	const wingResultSummary = document.getElementById("wing-result-summary");
	const wingResultDetail = document.getElementById("wing-result-detail");
	const wingProfileLayer = document.getElementById("wing-profile-layer");
	const wingProfileLayerHint = document.getElementById("wing-profile-layer-hint");
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
	let currentWingResultView = null;
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

	if (wingProfileLayer) {
		wingProfileLayer.value = "long";

		if (wingProfileLayerHint) {
			wingProfileLayerHint.textContent = getWingProfileLayerHint(wingProfileLayer.value);
		}

		wingProfileLayer.addEventListener("change", () => {
			if (wingProfileLayerHint) {
				wingProfileLayerHint.textContent = getWingProfileLayerHint(wingProfileLayer.value);
			}

			if (!currentWingResultView || !wingResultDetail) {
				return;
			}

			wingResultDetail.innerHTML = buildWingResultDetailMarkup(
				currentWingResultView.topType,
				currentWingResultView.wingCodes,
				currentWingResultView.topWing,
				currentWingResultView.secondWing,
				currentWingResultView.gapSummary,
				wingProfileLayer.value
			);
		});
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

			currentWingResultView = {
				topType: topResult.type,
				wingCodes,
				topWing,
				secondWing,
				gapSummary
			};

			if (wingResultDetail && topWing) {
				const selectedLayer = wingProfileLayer ? wingProfileLayer.value : "long";
				wingResultDetail.innerHTML = buildWingResultDetailMarkup(
					topResult.type,
					wingCodes,
					topWing,
					secondWing,
					gapSummary,
					selectedLayer
				);
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

		currentWingResultView = {
			topType: topResult.type,
			wingCodes,
			topWing,
			secondWing,
			gapSummary
		};

		if (wingResultDetail && topWing) {
			const selectedLayer = wingProfileLayer ? wingProfileLayer.value : "long";
			wingResultDetail.innerHTML = buildWingResultDetailMarkup(
				topResult.type,
				wingCodes,
				topWing,
				secondWing,
				gapSummary,
				selectedLayer
			);
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
