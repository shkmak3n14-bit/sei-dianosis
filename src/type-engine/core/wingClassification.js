/**
 * ウイング内部分類（フェーズ1）
 * 画面の大幅変更はせず、判定結果を構造化して保存する。
 * 自己理解モジュールは loadWingState().classification を参照する。
 *
 * 強度 = 1位と2位の一致度差 / 100（0〜1）
 * 近い = 一致度差が 5% 未満 → ○w弱（ほぼ無し）
 */

/** 一致度差がこれ未満なら「値が近い」→ w弱（ほぼ無し） */
export const WING_CLOSE_GAP_PERCENT = 5;

export const WING_STRENGTH_BANDS = {
	almost_none: { min: 0, max: 0.05, label: "ほぼ無し", description: "どちらのウイングも弱い" },
	weak: { min: 0.06, max: 0.25, label: "弱", description: "影響が少しある" },
	medium: { min: 0.26, max: 0.6, label: "中", description: "影響が明確にある" },
	strong: { min: 0.61, max: 1, label: "強", description: "影響が非常に強い" }
};

/**
 * @param {number} strength 0〜1（一致度差/100）
 * @returns {"almost_none"|"weak"|"medium"|"strong"}
 */
export function getStrengthBand(strength) {
	const value = clamp01(strength);

	if (value <= WING_STRENGTH_BANDS.almost_none.max) {
		return "almost_none";
	}

	if (value <= WING_STRENGTH_BANDS.weak.max) {
		return "weak";
	}

	if (value <= WING_STRENGTH_BANDS.medium.max) {
		return "medium";
	}

	return "strong";
}

/**
 * @param {string} wingCode 例: "9w8"
 * @returns {number|null}
 */
export function getWingNeighborType(wingCode) {
	const match = /^(\d)w(\d)$/.exec(String(wingCode ?? ""));

	if (!match) {
		return null;
	}

	return Number(match[2]);
}

/**
 * @param {{
 *   mainType: number,
 *   topWing: { wingCode: string, score: number, max: number } | null,
 *   secondWing?: { wingCode: string, score: number, max: number } | null,
 *   gapPercent?: number | null
 * }} input
 */
export function classifyWingResult(input) {
	const mainType = Number(input.mainType);
	const topWing = input.topWing ?? null;
	const secondWing = input.secondWing ?? null;
	const gapPercent =
		typeof input.gapPercent === "number"
			? input.gapPercent
			: computeGapPercent(topWing, secondWing);

	const flatKey = `${mainType}-flat`;
	const flatClassification = `${mainType}w弱（ほぼ無し）`;

	if (!topWing || !Number.isInteger(mainType) || mainType < 1 || mainType > 9) {
		return createFlatResult({
			mainType: Number.isInteger(mainType) ? mainType : null,
			topWing,
			secondWing,
			gapPercent,
			strength: 0,
			reason: "missing_top_wing"
		});
	}

	const isClose =
		typeof gapPercent !== "number" ||
		gapPercent < WING_CLOSE_GAP_PERCENT;

	// ⑥ 値が近い → w弱（ほぼ無し）。自己理解モジュールでもこの結果を使う。
	if (isClose) {
		return createFlatResult({
			mainType,
			topWing,
			secondWing,
			gapPercent,
			strength: typeof gapPercent === "number" ? clamp01(gapPercent / 100) : 0,
			reason: "close_gap"
		});
	}

	const strength = clamp01(gapPercent / 100);
	const strengthBand = getStrengthBand(strength);
	const bandMeta = WING_STRENGTH_BANDS[strengthBand];
	const direction = getWingNeighborType(topWing.wingCode);
	const directedWingCode = `${mainType}w${direction}`;

	// 強度がほぼ無し帯、または方向が取れない場合も flat
	if (strengthBand === "almost_none" || direction === null) {
		return createFlatResult({
			mainType,
			topWing,
			secondWing,
			gapPercent,
			strength,
			reason: strengthBand === "almost_none" ? "low_strength" : "invalid_direction"
		});
	}

	const strengthLabel = bandMeta.label;
	const classification = `${directedWingCode}（${strengthLabel}）`;
	const usesFlatProfile = strengthBand === "weak";
	const profileKey = usesFlatProfile ? flatKey : directedWingCode;
	const appendStrengthNote = strengthBand === "strong" || strengthBand === "medium";
	const strengthDescription = getDirectedStrengthDescription(direction, strengthBand);

	return {
		version: 1,
		mainType,
		direction,
		strength,
		strengthBand,
		strengthLabel,
		strengthDescription,
		classification,
		classificationKey: `${directedWingCode}_${strengthBand}`,
		/** 説明文データ参照キー（フェーズ2で使用）。弱は ○-flat */
		profileKey,
		/** 強・中のとき分類ラベル直後に強度説明を出す（フェーズ2） */
		appendStrengthNote,
		topWingCode: topWing.wingCode,
		secondWingCode: secondWing?.wingCode ?? null,
		gapPercent,
		isClose: false,
		reason: "directed"
	};
}

function getDirectedStrengthDescription(direction, strengthBand) {
	if (strengthBand === "strong") {
		return `${direction}の影響が非常に強い`;
	}

	if (strengthBand === "medium") {
		return `${direction}の影響が明確にある`;
	}

	if (strengthBand === "weak") {
		return `${direction}の影響が少しある`;
	}

	return WING_STRENGTH_BANDS.almost_none.description;
}

function createFlatResult({ mainType, topWing, secondWing, gapPercent, strength, reason }) {
	const flatKey = mainType ? `${mainType}-flat` : "unknown-flat";
	const classification = mainType ? `${mainType}w弱（ほぼ無し）` : "w弱（ほぼ無し）";

	return {
		version: 1,
		mainType,
		direction: null,
		strength: clamp01(strength),
		strengthBand: "almost_none",
		strengthLabel: WING_STRENGTH_BANDS.almost_none.label,
		strengthDescription: WING_STRENGTH_BANDS.almost_none.description,
		classification,
		classificationKey: mainType ? `${mainType}w_flat` : "w_flat",
		profileKey: flatKey,
		appendStrengthNote: false,
		topWingCode: topWing?.wingCode ?? null,
		secondWingCode: secondWing?.wingCode ?? null,
		gapPercent: typeof gapPercent === "number" ? gapPercent : null,
		isClose: reason === "close_gap",
		reason
	};
}

function computeGapPercent(topWing, secondWing) {
	if (!topWing || !secondWing || !topWing.max || !secondWing.max) {
		return null;
	}

	const topPercent = (topWing.score / topWing.max) * 100;
	const secondPercent = (secondWing.score / secondWing.max) * 100;

	return Math.round((topPercent - secondPercent) * 10) / 10;
}

function clamp01(value) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return 0;
	}

	if (value < 0) {
		return 0;
	}

	if (value > 1) {
		return 1;
	}

	return value;
}
