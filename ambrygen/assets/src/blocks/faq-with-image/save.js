import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { backgroundColor, imageUrl, imageId, imageAlt, faqs } = attributes;

	const blockProps = useBlockProps.save( {
		style: { backgroundColor },
	} );

	return (
		<section
			{ ...blockProps }
			className="ambrygen-faq"
			aria-labelledby="faq-heading"
		>
			<div className="faq-inner">
				<div className="faq-image">
					{ imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt || 'FAQ illustration' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					) }
				</div>

				<div className="faq-content">
					<h2 id="faq-heading">Frequently Asked Questions</h2>

					<div
						className="faq-accordion"
						role="region"
						aria-labelledby="faq-heading"
					>
						{ faqs.map( ( faq, index ) => (
							<div key={ index } className="faq-item">
								<button
									className="faq-question"
									aria-expanded="false"
									aria-controls={ `faq-answer-${ index }` }
									id={ `faq-question-${ index }` }
									type="button"
								>
									<RichText.Content value={ faq.question } />
									<span
										className="faq-icon"
										aria-hidden="true"
									>
										+
									</span>
								</button>
								<div
									className="faq-answer"
									id={ `faq-answer-${ index }` }
									role="region"
									aria-labelledby={ `faq-question-${ index }` }
									hidden
								>
									<RichText.Content value={ faq.answer } />
								</div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
