import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { backgroundColor, imageUrl, faqs } = attributes;

	const blockProps = useBlockProps.save( {
		style: { backgroundColor },
	} );

	return (
		<section { ...blockProps } className="ambrygen-faq">
			<div className="faq-inner">
				<div className="faq-image">
					{ imageUrl && <img src={ imageUrl } alt="" /> }
				</div>

				<div className="faq-content">
					<h2>Frequently Asked Questions</h2>

					<div className="faq-accordion">
						{ faqs.map( ( faq, index ) => (
							<details key={ index } className="faq-item">
								<summary>
									<RichText.Content value={ faq.question } />
								</summary>
								<div className="faq-answer">
									<RichText.Content value={ faq.answer } />
								</div>
							</details>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
