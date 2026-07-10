/**
 * タイプ詳細解説ページ（type-learn.html）の初期化
 */
import { TYPE_DETAIL_PROFILES, TYPE_WING_OPTIONS } from "../data/typeDetailProfiles.js";
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

function buildWingDerivativesMarkup(typeNumber) {
	const wings = TYPE_WING_OPTIONS[typeNumber] ?? [];

	if (wings.length === 0) {
		return "";
	}

	const links = wings
		.map((wing) => {
			const hasDetail = Object.prototype.hasOwnProperty.call(WING_DETAIL_PROFILES, wing.code);

			if (hasDetail) {
				return `<li><a href="wing-learn.html?wing=${encodeURIComponent(wing.code)}">${wing.label}の詳細を読む</a></li>`;
			}

			return `<li><span>${wing.label}</span><span class="topic-note">（詳細解説は準備中）</span></li>`;
		})
		.join("");

	return `
		<section class="wing-learn-section type-wing-derivatives">
			<h2 class="wing-learn-section-heading">このタイプから派生するウイング</h2>
			<div class="wing-learn-section-body">
				<p>メインタイプの動機はそのままに、隣接タイプの影響で表現の色味が変わります。</p>
				<ul class="sidebar-links">${links}</ul>
				<p class="topic-note">※wはウイング（隣接タイプの影響）の略</p>
			</div>
		</section>
	`;
}

export function initializeTypeLearnPage() {
	const contentEl = document.getElementById("type-learn-content");
	const backLink = document.getElementById("type-learn-back");
	const params = new URLSearchParams(window.location.search);
	const typeParam = Number(params.get("type"));
	const availableTypes = Object.keys(TYPE_DETAIL_PROFILES).map(Number);

	if (backLink) {
		backLink.href = "index.html#nine-types";
	}

	availableTypes.forEach((typeNumber) => {
		const navItem = document.getElementById(`nav-type-${typeNumber}`);
		const profile = TYPE_DETAIL_PROFILES[typeNumber];

		if (navItem && profile?.title) {
			navItem.textContent = profile.title;
		}

		if (navItem) {
			if (typeNumber === typeParam) {
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

	if (!Number.isInteger(typeParam) || !TYPE_DETAIL_PROFILES[typeParam]) {
		contentEl.innerHTML = `
			<div class="wing-learn-placeholder">
				<p>上のリンクからタイプを選んでください。</p>
				<p>9つのタイプがメインです。各タイプからウイングが2種類派生します。</p>
			</div>
		`;
		return;
	}

	const detail = TYPE_DETAIL_PROFILES[typeParam];

	contentEl.innerHTML = `
		<h1 class="wing-learn-title">${detail.title}</h1>
		${buildSectionsMarkup(detail.sections)}
		${buildWingDerivativesMarkup(typeParam)}
	`;
}
