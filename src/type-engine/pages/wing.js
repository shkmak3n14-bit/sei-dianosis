/**
 * ウイング判定ページ（w.html）の初期化・データ・UI操作
 */
import { TYPE_PROFILES } from "../data/typeProfiles.js";
import { TYPE_DETAIL_PROFILES } from "../data/typeDetailProfiles.js";
import { TYPE1_WING_DETAIL_PROFILES } from "../data/wingDetails/type1.js";
import { TYPE2_WING_DETAIL_PROFILES } from "../data/wingDetails/type2.js";
import { TYPE3_WING_DETAIL_PROFILES } from "../data/wingDetails/type3.js";
import { TYPE4_WING_DETAIL_PROFILES } from "../data/wingDetails/type4.js";
import { TYPE5_WING_DETAIL_PROFILES } from "../data/wingDetails/type5.js";
import { TYPE6_WING_DETAIL_PROFILES } from "../data/wingDetails/type6.js";
import { TYPE7_WING_DETAIL_PROFILES } from "../data/wingDetails/type7.js";
import { TYPE8_WING_DETAIL_PROFILES } from "../data/wingDetails/type8.js";
import { TYPE9_WING_DETAIL_PROFILES } from "../data/wingDetails/type9.js";
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
import { classifyWingResult } from "../core/wingClassification.js";

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

export const WING_DETAIL_PROFILES = {
	...TYPE1_WING_DETAIL_PROFILES,
	...TYPE2_WING_DETAIL_PROFILES,
	...TYPE3_WING_DETAIL_PROFILES,
	...TYPE4_WING_DETAIL_PROFILES,
	...TYPE5_WING_DETAIL_PROFILES,
	...TYPE6_WING_DETAIL_PROFILES,
	...TYPE7_WING_DETAIL_PROFILES,
	...TYPE8_WING_DETAIL_PROFILES,
	...TYPE9_WING_DETAIL_PROFILES
};

function buildWingDetailSectionBodyMarkup(section) {
	const parts = [];

	if (section.body) {
		parts.push(`<p>${section.body}</p>`);
	}

	if (Array.isArray(section.items) && section.items.length > 0) {
		const listClass = section.listStyle === "check" ? "wing-learn-checklist" : "wing-learn-list";

		parts.push(`
			<ul class="${listClass}">
				${section.items.map((item) => `<li>${item}</li>`).join("")}
			</ul>
		`);
	}

	if (section.footer) {
		parts.push(`<p>${section.footer}</p>`);
	}

	return parts.join("");
}

/**
 * 分類結果に応じたウイング説明を表示する。
 * - 強・中: 分類ラベルの直後に強度説明、その後に方向ウイング本文
 * - ○w弱（ほぼ無し）: 強度説明の下に【再掲】＋メインタイプ詳細
 * - ○w○（弱）で flat 本文未整備: 準備中表示
 * 判定結果画面では「←タイプ○（メイン）の詳細へ」は出さない。
 */
function renderWingDetailProfile(classification) {
	if (!classification) {
		return `
			<article class="report-card">
				<p>ウイング分類結果がありません。</p>
			</article>
		`;
	}

	const profileKey = classification.profileKey;
	const detail = WING_DETAIL_PROFILES[profileKey];
	const classificationLabel = classification.classification;
	const isAlmostNoneFlat =
		classification.strengthBand === "almost_none" ||
		String(classificationLabel).includes("w弱（ほぼ無し）");
	const strengthNoteMarkup =
		classification.appendStrengthNote || isAlmostNoneFlat
			? `
			<section class="wing-learn-section wing-strength-note">
				<h3 class="wing-learn-section-heading">ウイング強度</h3>
				<div class="wing-learn-section-body">
					<p>この結果のウイング強度は「${classification.strengthLabel}」です。${classification.strengthDescription}状態です。</p>
				</div>
			</section>
		`
			: "";

	if (isAlmostNoneFlat) {
		const typeDetail = TYPE_DETAIL_PROFILES[classification.mainType];
		const typeTitle = typeDetail?.title ?? `タイプ${classification.mainType}`;
		const typeSectionsMarkup = typeDetail
			? (typeDetail.sections ?? [])
					.map((section) => `
			<section class="wing-learn-section">
				<h3 class="wing-learn-section-heading">${section.heading}</h3>
				<div class="wing-learn-section-body">
					${buildWingDetailSectionBodyMarkup(section)}
				</div>
			</section>
		`)
					.join("")
			: `
			<section class="wing-learn-section">
				<div class="wing-learn-section-body">
					<p>このタイプの詳細解説は準備中です。</p>
				</div>
			</section>
		`;

		return `
			<article class="report-card type-detail-report">
				<p class="report-rank">${classificationLabel}</p>
				${strengthNoteMarkup}
				<p class="wing-reprint-label">【再掲】</p>
				<h3 class="wing-learn-title">${typeTitle}</h3>
				${typeSectionsMarkup}
			</article>
		`;
	}

	if (!detail) {
		const fallbackTitle =
			classification.strengthBand === "weak"
				? `タイプ${classification.mainType}w弱`
				: classificationLabel;

		return `
			<article class="report-card type-detail-report">
				<p class="report-rank">${classificationLabel}</p>
				${strengthNoteMarkup}
				<h3 class="wing-learn-title">${fallbackTitle}</h3>
				<section class="wing-learn-section">
					<div class="wing-learn-section-body">
						<p>この分類の詳細解説は準備中です（フェーズ3で追加予定）。</p>
					</div>
				</section>
			</article>
		`;
	}

	const sectionsMarkup = (detail.sections ?? [])
		.map((section) => `
			<section class="wing-learn-section">
				<h3 class="wing-learn-section-heading">${section.heading}</h3>
				<div class="wing-learn-section-body">
					${buildWingDetailSectionBodyMarkup(section)}
				</div>
			</section>
		`)
		.join("");

	return `
		<article class="report-card type-detail-report">
			<p class="report-rank">${classificationLabel}</p>
			${strengthNoteMarkup}
			<h3 class="wing-learn-title">${detail.title}</h3>
			${sectionsMarkup}
		</article>
	`;
}

function buildWingResultDetailMarkup(topType, wingCodes, topWing, secondWing, gapSummary, summaryText, classification) {
	if (!topWing) {
		return "";
	}

	const topPercent = Math.round((topWing.score / topWing.max) * 100);
	const secondPercent = secondWing ? Math.round((secondWing.score / secondWing.max) * 100) : 0;
	const gapLine = gapSummary && typeof gapSummary.gapPercent === "number"
		? `<p>1位と2位の一致度差: ${gapSummary.gapPercent}%（${gapSummary.label}）</p>`
		: "";
	const classificationLine = classification
		? `<p>内部分類: ${classification.classification}</p>`
		: "";
	const heading =
		summaryText ||
		(classification
			? `ウイング判定の結果は ${classification.classification} です。`
			: `ウイング判定では、一致度が最も高いのは ${topWing.wingCode} です。`);

	return `
		${renderWingDetailProfile(classification)}
		<div class="wing-score-summary">
			<p>${heading}</p>
			${classificationLine}
			<p>タイプ${topType}の候補: ${wingCodes.join(" / ")}</p>
			<p>1位: ${topWing.wingCode}（${topWing.score} / ${topWing.max} 点, 一致度 ${topPercent}%）</p>
			${secondWing ? `<p>2位: ${secondWing.wingCode}（${secondWing.score} / ${secondWing.max} 点, 一致度 ${secondPercent}%）</p>` : ""}
			${gapLine}
		</div>
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
			const classification = classifyWingResult({
				mainType: topResult.type,
				topWing,
				secondWing,
				gapPercent: gapSummary ? gapSummary.gapPercent : null
			});
			const wingState = {
				type: topResult.type,
				wings: wingCodes,
				scores: wingScores,
				answers: collectWingAnswers(wingForm, wingCodes),
				classification
			};
			const historyEntry = {
				type: topResult.type,
				createdAt: new Date().toISOString(),
				topWingCode: topWing ? topWing.wingCode : "",
				gapPercent: gapSummary ? gapSummary.gapPercent : null,
				classification: classification
					? {
							classification: classification.classification,
							strengthBand: classification.strengthBand,
							profileKey: classification.profileKey,
							gapPercent: classification.gapPercent
						}
					: null,
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

			if (wingResultSummary) {
				wingResultSummary.textContent = "";
				wingResultSummary.hidden = true;
			}

			if (wingResultDetail && topWing) {
				wingResultDetail.innerHTML = buildWingResultDetailMarkup(
					topResult.type,
					wingCodes,
					topWing,
					secondWing,
					gapSummary,
					`ウイング判定の結果は ${classification.classification} です。`,
					classification
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
		const classification =
			storedWingState.classification ??
			classifyWingResult({
				mainType: topResult.type,
				topWing,
				secondWing,
				gapPercent: gapSummary ? gapSummary.gapPercent : null
			});

		if (!storedWingState.classification && classification) {
			saveWingState({
				...storedWingState,
				classification
			});
		}

		if (wingResultSummary) {
			wingResultSummary.textContent = "";
			wingResultSummary.hidden = true;
		}

		if (wingResultDetail && topWing) {
			wingResultDetail.innerHTML = buildWingResultDetailMarkup(
				topResult.type,
				wingCodes,
				topWing,
				secondWing,
				gapSummary,
				`前回のウイング判定結果は ${classification.classification} でした。`,
				classification
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
