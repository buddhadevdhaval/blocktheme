import { useBlockProps, RichText } from '@wordpress/block-editor';
import { isValidUrl } from '../../utils/validation.js';

export default function Save( { attributes } ) {
	const { items = [], variation = 'two-column', heading = '' } = attributes;

	const blockProps = useBlockProps.save( {
		className: `image-grid-block variation-${ variation }`,
	} );

	return (
		<section { ...blockProps }>
			<div className="get-started-ambry-block">
				<h2 className="block-title heading-3 mb-0">
					<RichText.Content
						value={ heading || 'Get Started with Ambry' }
					/>
				</h2>

				<div className="card-grid-block">
					{ items.map( ( item, index ) => {
						const isLink = item.link && isValidUrl( item.link );
						const Tag = isLink ? 'a' : 'div';
						const HeadingTag = item.headingTag || 'h5';

						return (
							<Tag
								key={ index }
								className="card-col"
								{ ...( isLink ? { href: item.link } : {} ) }
								aria-label={ item.title || 'Card item' }
							>
								{ item.imageUrl && (
									<div className="image-block">
										<img
											src={ item.imageUrl }
											srcSet={
												item.imageSrcSet || undefined
											}
											sizes={
												item.imageSizes || undefined
											}
											alt={
												item.imageAlt ||
												item.title ||
												'Company logo'
											}
											loading="lazy"
										/>
									</div>
								) }

								<div className="card-info">
									{ item.title && (
										<HeadingTag className="link-btn mb-0">
											<RichText.Content
												value={ item.title }
											/>
										</HeadingTag>
									) }

									{ item.description && (
										<div className="card-description text-small">
											<RichText.Content
												value={ item.description }
											/>
										</div>
									) }
								</div>
							</Tag>
						);
					} ) }
				</div>
			</div>
		</section>
	);
}
