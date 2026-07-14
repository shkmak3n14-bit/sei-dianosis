/**
 * 自己理解モジュール向け: ウイング内部分類の読み取りヘルパー
 *
 * 使い方（後続モジュール）:
 *   import { loadWingClassificationForSelfUnderstanding } from "../../type-engine/core/wingBridge.js";
 *   const classification = loadWingClassificationForSelfUnderstanding();
 *
 * 返却例:
 *   {
 *     mainType: 9,
 *     direction: 8,
 *     strength: 0.35,
 *     strengthBand: "medium",
 *     classification: "9w8（中）",
 *     profileKey: "9w8",
 *     appendStrengthNote: true,
 *     ...
 *   }
 */
import { loadWingState } from "./storage.js";

export function loadWingClassificationForSelfUnderstanding() {
	const wingState = loadWingState();

	if (!wingState || !wingState.classification) {
		return null;
	}

	return wingState.classification;
}
