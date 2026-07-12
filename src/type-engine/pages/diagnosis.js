/**
 * 診断ページ（diagnosis.html）の初期化とUI操作
 */
import { ENNEAGRAM_TYPES } from "../data/enneagramTypes.js";
import { TYPE_PROFILES } from "../data/typeProfiles.js";
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
	getMaturityLabel,
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
	const profile = selectedResult ? TYPE_PROFILES[selectedResult.type] : null;
	const cyclePercent = selectedResult ? Math.round((selectedResult.score / selectedResult.max) * 100) : 0;
	const maturityLabel = getMaturityLabel(cyclePercent);
	const visibleRanks = Array.from({ length: 3 }, (_, index) => rankedScores[index] ?? null);

	if (elements.resultDetail) {
		elements.resultDetail.innerHTML = selectedResult && profile
			? buildDetailedReportMarkup(selectedResult, profile, cyclePercent, maturityLabel, safeRankIndex)
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
