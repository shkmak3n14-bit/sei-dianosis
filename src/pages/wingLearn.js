/**
 * ウイング詳細解説ページ（wing-learn.html）の初期化
 */
import { WING_DETAIL_PROFILES } from "./wing.js";

export function initializeWingLearnPage() {
	const contentEl = document.getElementById("wing-learn-content");
	const backLink = document.getElementById("wing-learn-back");
	const params = new URLSearchParams(window.location.search);
	const wingCode = params.get("wing") ?? "";
	const availableCodes = Object.keys(WING_DETAIL_PROFILES);

	if (backLink) {
		backLink.href = "index.html#wing-detail-section";
	}

	availableCodes.forEach((code) => {
		const navItem = document.getElementById(`nav-${code}`);

		if (navItem) {
			if (code === wingCode) {
				navItem.setAttribute("aria-current", "page");
				navItem.classList.add("is-active");
			} else {
				navItem.removeAttribute("aria-current");
				navItem.classList.remove("is-active");
			}
		}
	});

	if (!contentEl) {
		return;
	}

	if (!wingCode || !WING_DETAIL_PROFILES[wingCode]) {
		contentEl.innerHTML = `
			<div class="wing-learn-placeholder">
				<p>上のリンクからウイングを選んでください。</p>
				<p>現在、詳細解説がある対象は タイプ9（ウイング弱/ほぼ無し）・9w1・9w8・8w9 です。</p>
			</div>
		`;
		return;
	}

	const detail = WING_DETAIL_PROFILES[wingCode];
	const sectionsMarkup = detail.sections.map((section) => `
		<section class="wing-learn-section">
			<h2 class="wing-learn-section-heading">${section.heading}</h2>
			<p>${section.body}</p>
		</section>
	`).join("");

	contentEl.innerHTML = `
		<h2 class="wing-learn-title">${detail.title}</h2>
		${sectionsMarkup}
	`;
}
