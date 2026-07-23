/**
 * EnneaCard9w8 と同じカード構造の HTML を返す（診断 HTML ページ用）
 * @param {{ id: string, title: string, icon: string, body: string }[]} sections
 * @param {{ heading?: string }} [options]
 */
export function renderEnneaCardMarkup(sections, options = {}) {
	if (!Array.isArray(sections) || sections.length === 0) {
		return "";
	}

	const heading = options.heading
		? `<header class="ennea-card-header"><h3>${options.heading}</h3></header>`
		: "";

	const cards = sections
		.map(
			(section) => `
		<section class="card" data-section-id="${section.id}">
			<h2>${section.icon} ${section.title}</h2>
			<p>${escapeHtml(section.body)}</p>
		</section>
	`
		)
		.join("");

	return `
		<div class="ennea-card-9w8">
			${heading}
			${cards}
		</div>
	`;
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}
