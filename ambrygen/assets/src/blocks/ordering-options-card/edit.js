import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

import { DEFAULT_IMAGES, ImageUploader } from '../_shared/components';

// Use the modern List block structure (list items are inner blocks).
const CONTENT_TEMPLATE = [
	[
		'core/list',
		{ ordered: false },
		[ [ 'core/list-item', { content: '' } ] ],
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const { imageAlt, imageUrl, title, subtitle } = attributes;
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const placeholderImage = defaults?.placeholder || {};
	const previewUrl = imageUrl || placeholderImage.url || '';
	const previewAlt =
		imageAlt || placeholderImage.alt || __( 'Card image', 'ambrygen-web' );
	const blockProps = useBlockProps( {
		className: 'ordering-options__card',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<PanelRow>
						<ImageUploader
							label={ __( 'Card Image', 'ambrygen-web' ) }
							url={ imageUrl }
							onSelect={ ( media ) =>
								setAttributes( {
									imageId: media.id,
									imageUrl: media.url,
									imageAlt: media.alt || '',
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
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="ordering-options__card-image">
					{ previewUrl ? (
						<img
							src={ previewUrl }
							alt={ previewAlt }
							loading="lazy"
						/>
					) : (
						<div className="ordering-options__image-placeholder">
							{ __( 'Add image', 'ambrygen-web' ) }
						</div>
					) }
				</div>

				<div className="ordering-options__card-body">
					<div className="ordering-options__card-content">
						<RichText
							tagName="h3"
							className="heading-5 ordering-options__card-title mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Card title...', 'ambrygen-web' ) }
							withoutInteractiveFormatting={ true }
						/>

						<RichText
							tagName="div"
							className="subtitle2-sbold ordering-options__card-subtitle"
							value={ subtitle }
							onChange={ ( value ) =>
								setAttributes( { subtitle: value } )
							}
							placeholder={ __(
								'Card subtitle...',
								'ambrygen-web'
							) }
							withoutInteractiveFormatting={ true }
						/>

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>

						<div className="ordering-options__card-copy">
							<InnerBlocks
								allowedBlocks={ [
									'core/list',
									'core/paragraph',
									'core/spacer',
									'core/buttons',
								] }
								template={ CONTENT_TEMPLATE }
								templateLock={ false }
								renderAppender={
									InnerBlocks.ButtonBlockAppender
								}
							/>
						</div>

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>
					</div>

					<div className="is-style-gl-s24" aria-hidden="true"></div>
				</div>
			</div>
		</>
	);
}
