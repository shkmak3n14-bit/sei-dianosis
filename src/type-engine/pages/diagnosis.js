/**
 * 診断ページ（diagnosis.html）の初期化とUI操作
 */
import { ENNEAGRAM_TYPES } from "../data/enneagramTypes.js";
import { TYPE_DETAIL_PROFILES } from "../data/typeDetailProfiles.js";
import {
	getCurrentDiagnosisResult,
	setCurrentDiagnosisResult,
	saveDiagnosisState,
	loadStoredDiagnosisState,
	clearStoredDiagnosisState
} from "../core/storage.js";
import {
	RESPONSE_OPTIONS,
	getPreviewTypeFromQuery,
	compareByNormalizedScore,
	updateAnsweredCount
} from "../core/utils.js";

export function initializeDiagnosisForm(diagnosisForm) {
	const answeredCountElement = document.getElementById("answered-count");
	const totalCountElement = document.getElementById("total-count");
	const resultSection = document.getElementById("diagnosis-result");
	const resultDetail = document.getElementById("result-detail");
	const resultCards = document.getElementById("result-cards");
	const resultActions = document.getElementById("result-actions");
	const resetButton = document.getElementById("diagnosis-reset-btn");
	const redoButton = document.getElementById("diagnosis-redo-btn");
	const acceptButton = document.getElementById("diagnosis-accept-btn");
	const totalQuestions = ENNEAGRAM_TYPES.reduce((sum, entry) => sum + entry.questions.length, 0);
	const previewType = getPreviewTypeFromQuery();
	const resultElements = {
		resultSection,
		resultDetail,
		resultCards,
		resultActions
	};

	if (totalCountElement) {
		totalCountElement.textContent = String(totalQuestions);
	}

	if (previewType) {
		const previewState = createPreviewResultState(previewType);
		setCurrentDiagnosisResult(previewState);
		renderDiagnosisResult(previewState, 0, resultElements);

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
		clearDiagnosisResultUI(resultElements);
		setCurrentDiagnosisResult(null);
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
			if (!getCurrentDiagnosisResult()) {
				return;
			}

			saveDiagnosisState(getCurrentDiagnosisResult());
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
		const rankedScores = getRankedScores(scores);
		const answers = collectAnswers(diagnosisForm);
		setCurrentDiagnosisResult({
			scores: rankedScores,
			answers,
			selectedRankIndex: 0
		});
		saveDiagnosisState(getCurrentDiagnosisResult());
		renderDiagnosisResult(getCurrentDiagnosisResult(), 0, resultElements);
	});

	if (resultCards) {
		resultCards.addEventListener("click", (event) => {
			const link = event.target.closest("a[data-rank]");

			if (!link || !getCurrentDiagnosisResult()) {
				return;
			}

			event.preventDefault();
			const selectedRankIndex = Number(link.dataset.rank);
			renderDiagnosisResult(getCurrentDiagnosisResult(), selectedRankIndex, resultElements);
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

	const rankedScores = getRankedScores(resultState.scores);
	const safeRankIndex = rankedScores[selectedRankIndex] ? selectedRankIndex : 0;

	setCurrentDiagnosisResult({
		...resultState,
		scores: rankedScores,
		selectedRankIndex: safeRankIndex
	});

	const selectedResult = rankedScores[safeRankIndex] ?? null;
	const detailProfile = selectedResult ? TYPE_DETAIL_PROFILES[selectedResult.type] : null;
	const cyclePercent = selectedResult ? Math.round((selectedResult.score / selectedResult.max) * 100) : 0;
	const visibleRanks = Array.from({ length: 3 }, (_, index) => rankedScores[index] ?? null);

	if (elements.resultDetail) {
		elements.resultDetail.innerHTML = selectedResult && detailProfile
			? buildDetailedReportMarkup(detailProfile, cyclePercent, safeRankIndex)
			: `<article class="report-card"><p>該当するタイプがありません。</p></article>`;
	}

	if (elements.resultCards) {
		elements.resultCards.innerHTML = visibleRanks
			.map((item, index) => {
				if (!item) {
					return `
						<article class="result-card">
							<h3>${index + 1}位 該当なし</h3>
							<p class="score">- / - 点</p>
							<p>一致度: -</p>
						</article>
					`;
				}

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
		elements.resultActions.hidden = !selectedResult;
	}

	if (elements.resultSection) {
		elements.resultSection.hidden = false;
		elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

/**
 * 「ほとんどない」のみのタイプは順位対象外にする。
 * （最低点だけのタイプは一致度25%になり、見かけ上の2位・3位になってしまうため）
 */
function getRankedScores(scores) {
	if (!Array.isArray(scores)) {
		return [];
	}

	const minOptionValue = RESPONSE_OPTIONS[0]?.value ?? 1;

	return scores.filter((entry) => {
		if (!entry || !entry.max) {
			return false;
		}

		const questionCount = entry.max / RESPONSE_OPTIONS.length;
		const minimumScore = questionCount * minOptionValue;

		return entry.score > minimumScore;
	});
}

function buildDetailSectionBodyMarkup(section) {
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
 * 学習メニュー「タイプ詳細解説」と同じ本文（項目1〜10）を表示する。
 * ウイング診断前のため「このタイプから派生するウイング」は含めない。
 */
function buildDetailedReportMarkup(detailProfile, cyclePercent, selectedRankIndex) {
	const sectionsMarkup = (detailProfile.sections ?? [])
		.map((section) => `
			<section class="wing-learn-section">
				<h3 class="wing-learn-section-heading">${section.heading}</h3>
				<div class="wing-learn-section-body">
					${buildDetailSectionBodyMarkup(section)}
				</div>
			</section>
		`)
		.join("");

	return `
		<article class="report-card type-detail-report">
			<p class="report-rank">${selectedRankIndex + 1}位（一致度 ${cyclePercent}%）</p>
			<h3 class="wing-learn-title">${detailProfile.title}</h3>
			${sectionsMarkup}
		</article>
	`;
}

function clearDiagnosisResultUI(elements) {
	if (elements.resultSection) {
		elements.resultSection.hidden = true;
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

/**
 * 設問ごとの回答をタイプ別に収集する。
 * 未選択は 0。形式: number[][]（タイプ → 設問）
 */
function collectAnswers(formElement) {
	return ENNEAGRAM_TYPES.map((entry) => {
		return entry.questions.map((_questionText, questionIndex) => {
			const questionName = `type${entry.type}-q${questionIndex + 1}`;
			const selected = formElement.querySelector(`input[name="${questionName}"]:checked`);

			return selected ? Number(selected.value) : 0;
		});
	});
}

/**
 * 設問ごとの回答を復元する。
 * 旧形式（タイプごとに数値1つ）は、各タイプのQ1だけが選ばれる不具合の原因になるため無視する。
 */
function restoreAnswers(formElement, answers) {
	if (!Array.isArray(answers) || answers.length === 0) {
		return;
	}

	// 旧形式: [1, 1, ...] のようにタイプ数ぶんの数値配列
	if (typeof answers[0] === "number") {
		return;
	}

	ENNEAGRAM_TYPES.forEach((entry, typeIndex) => {
		const typeAnswers = answers[typeIndex];

		if (!Array.isArray(typeAnswers)) {
			return;
		}

		typeAnswers.forEach((value, questionIndex) => {
			if (typeof value !== "number" || value < 1) {
				return;
			}

			const questionName = `type${entry.type}-q${questionIndex + 1}`;
			const target = formElement.querySelector(
				`input[name="${questionName}"][value="${value}"]`
			);

			if (target) {
				target.checked = true;
			}
		});
	});
}
