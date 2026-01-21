import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save( { attributes } ) {
	const { backgroundColor, imageUrl, imageAlt, faqs } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'ambrygen-faq',
		style: { backgroundColor },
	} );
	return (
		<section { ...blockProps } aria-labelledby="faq-heading">
			<div className="faq-inner">
				<div className="faq-image">
					{ imageUrl && (
						<img
							src={ imageUrl }
							alt={
								imageAlt ||
								__( 'FAQ illustration', 'ambrygen-web' )
							}
							className="faq-img"
						/>
					) }
				</div>

				<div className="faq-content">
					<h2 id="faq-heading">
						{ __( 'Frequently Asked Questions', 'ambrygen-web' ) }
					</h2>

					<div className="faq-accordion">
						{ Array.isArray( faqs ) &&
							faqs.map( ( faq, index ) => (
								<details key={ index } className="faq-item">
									<summary>
										<RichText.Content
											value={ faq.question }
										/>
									</summary>
									<div className="faq-answer">
										<RichText.Content
											value={ faq.answer }
										/>
									</div>
								</details>
							) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
