import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ImageUploader } from '../_shared/components';

const normalizeBreaksForEditor = ( value = '' ) =>
	value.replace( /<br\s*\/?>/gi, '\n' );

const normalizeBreaksForStorage = ( value = '' ) =>
	value.replace( /\r?\n/g, '<br>' );

export default function Edit( { attributes, setAttributes } ) {
	const { content, imageUrl, imageAlt, authorName, authorRole } = attributes;
	const hasAuthorDetails = !! ( authorName || authorRole );

	return (
		<div
			{ ...useBlockProps( {
				className: 'swiper-slide',
			} ) }
		>
			<InspectorControls>
				<PanelBody
					title={ __( 'Image', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						url={ imageUrl }
						label={ __( 'Upload Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								imageId: media?.id || 0,
								imageUrl: media?.url || '',
								imageAlt: media?.alt || media?.title || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageId: 0,
								imageUrl: '',
								imageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="testimonial-slider__card">
				<RichText
					tagName="div"
					className="testimonial-slider__quote heading-5 mb-0"
					value={ normalizeBreaksForEditor( content ) }
					onChange={ ( value ) =>
						setAttributes( {
							content: normalizeBreaksForStorage( value ),
						} )
					}
					placeholder={ __( 'Description', 'ambrygen-web' ) }
				/>

				{ imageUrl && (
					<div className="is-style-gl-s24" aria-hidden="true"></div>
				) }

				{ ! hasAuthorDetails && imageUrl && (
					<div className="testimonial-slider__logo">
						<img src={ imageUrl } alt={ imageAlt } />
					</div>
				) }

				<div className="author">
					{ hasAuthorDetails && imageUrl && (
							<div className="author__image">
								<img src={ imageUrl } alt={ imageAlt } />
							</div>
					) }

					<div className="author__content">
						<RichText
							tagName="div"
							className="author__name"
							value={ authorName }
							onChange={ ( value ) =>
								setAttributes( { authorName: value } )
							}
							placeholder={ __(
								'Enter author name...',
								'ambrygen-web'
							) }
						/>
						<RichText
							tagName="div"
							className="author__role"
							value={ authorRole }
							onChange={ ( value ) =>
								setAttributes( { authorRole: value } )
							}
							placeholder={ __(
								'Enter author role...',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
