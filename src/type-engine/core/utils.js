/**
 * 汎用ユーティリティ関数
 */
export const RESPONSE_OPTIONS = [
	{ label: "ほとんどない", value: 1 },
	{ label: "たまにある", value: 2 },
	{ label: "よくある", value: 3 },
	{ label: "ほぼいつもそう", value: 4 }
];
export function getPreviewTypeFromQuery() {
	const params = new URLSearchParams(window.location.search);
	const previewType = Number(params.get("previewType"));

	if (Number.isInteger(previewType) && previewType >= 1 && previewType <= 9) {
		return previewType;
	}

	return null;
}
export function compareByNormalizedScore(a, b) {
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
export function getMaturityLabel(cyclePercent) {
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

export function updateAnsweredCount(formElement, answeredCountElement, totalQuestions) {
	if (!answeredCountElement) {
		return;
	}

	const checkedCount = formElement.querySelectorAll('input[type="radio"]:checked').length;
	const answeredQuestions = Math.min(checkedCount, totalQuestions);
	answeredCountElement.textContent = String(answeredQuestions);
}
export function formatHistoryDate(isoText) {
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
