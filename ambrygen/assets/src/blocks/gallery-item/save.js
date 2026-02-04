import { RichText } from '@wordpress/block-editor';
import { isValidUrl } from '../../utils/validation.js';

export default function Save( { attributes } ) {
	const {
		imageUrl,
		imageAlt,
		imageSrcSet,
		imageSizes,
		title,
		headingTag,
		description,
		link,
	} = attributes;

	const Tag = link && isValidUrl( link ) ? 'a' : 'div';
	const HeadingTag = headingTag || 'h5';

	return (
		<Tag className="card-col" { ...( Tag === 'a' ? { href: link } : {} ) }>
			{ imageUrl && (
				<div className="image-block">
					<img
						src={ imageUrl }
						srcSet={ imageSrcSet || undefined }
						sizes={ imageSizes || undefined }
						alt={ imageAlt || title }
						loading="lazy"
					/>
				</div>
			) }

			<div className="card-info">
				{ title && (
					<HeadingTag className="link-btn mb-0">
						<RichText.Content value={ title } />
					</HeadingTag>
				) }

				{ description && (
					<div className="card-description text-small">
						<RichText.Content value={ description } />
					</div>
				) }
			</div>
		</Tag>
	);
}
