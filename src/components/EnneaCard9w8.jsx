/**
 * @typedef {{ id: string, title: string, icon: string, body: string }} EnneaCardSection
 * @typedef {{ sections: EnneaCardSection[] }} EnneaCard9w8Props
 */

/**
 * @param {EnneaCard9w8Props} props
 */
export function EnneaCard9w8({ sections }) {
	return (
		<>
			<style>{`
				.ennea-card-9w8 {
					max-width: 480px;
					margin: 0 auto;
					padding: 16px;
					font-family: "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", sans-serif;
					color: #1f2933;
				}

				.ennea-card-9w8 .card {
					background: #ffffff;
					border: 1px solid #e4e1d8;
					border-radius: 16px;
					padding: 18px 16px;
					margin-bottom: 12px;
					box-shadow: 0 8px 24px rgba(31, 41, 51, 0.04);
				}

				.ennea-card-9w8 .card h2 {
					margin: 0 0 10px;
					font-size: 1.05rem;
					line-height: 1.4;
					font-weight: 700;
					color: #2f6f5e;
				}

				.ennea-card-9w8 .card p {
					margin: 0;
					white-space: pre-line;
					font-size: 0.95rem;
					line-height: 1.75;
					color: #1f2933;
				}
			`}</style>
			<div className="ennea-card-9w8">
				{sections.map((section) => (
					<section key={section.id} className="card">
						<h2>
							{section.icon} {section.title}
						</h2>
						<p>{section.body}</p>
					</section>
				))}
			</div>
		</>
	);
}
