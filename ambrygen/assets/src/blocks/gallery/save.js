import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { isValidUrl } from '../../utils/validation.js';

export default function Save( { attributes } ) {
	const { items = [], variation, columns } = attributes;

	const blockProps = useBlockProps.save( {
		className: `image-grid-block variation-${ variation } columns-${ columns }`,
	} );

	return (
		<section { ...blockProps }>
			<div className="container-1340">
				<div className="is-style-gl-s48" />

				<div className="wrapper">
					<div className="get-started-ambry-block">
						<h2 className="block-title heading-3 mb-0">
							<span>{ __( 'Get Started', 'ambrygen-web' ) }</span>{ ' ' }
							{ __( 'with Ambry', 'ambrygen-web' ) }
						</h2>

						<div className="card-grid-block">
							{ items.map( ( item, index ) => {
								const isLink =
									item.link && isValidUrl( item.link );
								const Tag = isLink ? 'a' : 'div';
								const HeadingTag = item.headingTag || 'h5';

								return (
									<Tag
										key={ index }
										className="card-col"
										{ ...( isLink
											? { href: item.link }
											: {} ) }
										aria-label={
											item.title ||
											__( 'Card item', 'ambrygen-web' )
										}
									>
										{ item.imageUrl && (
											<div className="image-block">
												<img
													src={ item.imageUrl }
													alt={
														item.title ||
														__(
															'Company logo',
															'ambrygen-web'
														)
													}
													loading="lazy"
													style={ {
														maxWidth: '100%',
														height: 'auto',
													} }
												/>
											</div>
										) }

										<div className="card-info">
											{ item.title && (
												<HeadingTag className="link-btn mb-0">
													{ item.title }
												</HeadingTag>
											) }

											{ item.description && (
												<div className="card-description text-small">
													{ item.description }
												</div>
											) }
										</div>
									</Tag>
								);
							} ) }
						</div>
					</div>
				</div>

				<div className="is-style-gl-s48" />
			</div>
		</section>
	);
}
