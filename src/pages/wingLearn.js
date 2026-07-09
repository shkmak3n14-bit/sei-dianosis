/**
 * ウイング詳細解説ページ（wing-learn.html）の初期化
 */
import { WING_DETAIL_PROFILES } from "./wing.js";

function buildSectionBodyMarkup(section) {
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

function buildSectionsMarkup(sections) {
	return sections
		.map((section) => `
			<section class="wing-learn-section">
				<h2 class="wing-learn-section-heading">${section.heading}</h2>
				<div class="wing-learn-section-body">
					${buildSectionBodyMarkup(section)}
				</div>
			</section>
		`)
		.join("");
}

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
		const profile = WING_DETAIL_PROFILES[code];

		if (navItem && profile?.title) {
			navItem.textContent = profile.title;
		}

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
				<p>現在、詳細解説がある対象は タイプ8（ウイング弱/ほぼ無し）・8w9・タイプ9（ウイング弱/ほぼ無し）・9w1・9w8 です。</p>
			</div>
		`;
		return;
	}

	const detail = WING_DETAIL_PROFILES[wingCode];

	contentEl.innerHTML = `
		<h1 class="wing-learn-title">${detail.title}</h1>
		${buildSectionsMarkup(detail.sections)}
	`;
}
