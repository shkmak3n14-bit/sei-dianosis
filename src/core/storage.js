/**
 * セッションストレージ・ローカルストレージの状態管理
 */
const DIAGNOSIS_STORAGE_KEY = "sieDiagnosisState";
const WING_STORAGE_KEY = "sieWingState";
const WING_HISTORY_STORAGE_KEY = "sieWingHistory";
const MAX_WING_HISTORY_ITEMS = 30;

let _currentDiagnosisResult = null;

export function getCurrentDiagnosisResult() {
	return _currentDiagnosisResult;
}

export function setCurrentDiagnosisResult(value) {
	_currentDiagnosisResult = value;
}

export function saveDiagnosisState(state) {
	window.sessionStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(state));
}

export function loadStoredDiagnosisState() {
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

export function clearStoredDiagnosisState() {
	window.sessionStorage.removeItem(DIAGNOSIS_STORAGE_KEY);
}

export function saveWingState(state) {
	window.sessionStorage.setItem(WING_STORAGE_KEY, JSON.stringify(state));
}

export function loadWingState() {
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

export function clearWingState() {
	window.sessionStorage.removeItem(WING_STORAGE_KEY);
}

export function loadWingHistory() {
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

export function saveWingHistory(history) {
	window.localStorage.setItem(WING_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function appendWingHistoryEntry(entry) {
	const current = loadWingHistory();
	const next = [entry, ...current].slice(0, MAX_WING_HISTORY_ITEMS);

	saveWingHistory(next);
	return next;
}
