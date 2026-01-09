import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { heading, content, imageUrl, imageAlt } = attributes;

	return (
		<div { ...useBlockProps.save( { className: 'contact-banner' } ) }>
			<div className="contact-banner__inner">
				<div className="contact-banner__content">
					<RichText.Content tagName="h2" value={ heading } />
					<RichText.Content tagName="p" value={ content } />
				</div>

				{ imageUrl && (
					<div className="contact-banner__image">
						<img src={ imageUrl } alt={ imageAlt } />
					</div>
				) }
			</div>
		</div>
	);
}
