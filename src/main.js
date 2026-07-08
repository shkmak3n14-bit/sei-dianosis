/**
 * エントリーポイント
 * ページ要素の存在に応じて各ページ初期化関数を呼び出す
 */
import { initializeDiagnosisForm } from "./pages/diagnosis.js";
import { initializeWPage } from "./pages/wing.js";
import { initializeWingLearnPage } from "./pages/wingLearn.js";

document.addEventListener("DOMContentLoaded", () => {
	const startButton = document.getElementById("start-diagnosis");
	const diagnosisForm = document.getElementById("diagnosis-form");
	const wPage = document.getElementById("w-page");
	const wingLearnPage = document.getElementById("wing-learn-page");

	if (startButton) {
		startButton.addEventListener("click", () => {
			window.location.href = "diagnosis.html";
		});
	}

	if (wingLearnPage) {
		initializeWingLearnPage();
		return;
	}

	if (wPage) {
		initializeWPage();
		return;
	}

	if (diagnosisForm) {
		initializeDiagnosisForm(diagnosisForm);
	}
});
