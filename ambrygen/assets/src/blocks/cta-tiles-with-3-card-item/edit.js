/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import {
	ImageUploader,
	CtaButtonField,
	DEFAULT_IMAGES,
} from '../_shared/components';

import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

/**
 * Edit component for the CTA Tiles with 3 Card Item block.
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {import('@wordpress/element').WPElement} Block editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const { image, imageAlt, title, description, link, type } = attributes;

	const displayImage = image || defaults?.placeholder?.url;
	const displayImageAlt = image ? imageAlt : defaults?.placeholder?.alt || '';

	const onSelectImage = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			image: media.url,
			imageId: media.id || 0,
			imageAlt: media.alt || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			image: '',
			imageId: 0,
			imageAlt: '',
		} );
	};

	const blockProps = useBlockProps( {
		className: `cta-tiles-with-3-card__card block-layout  cta-tiles-with-3-card__card--${ type }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Card Settings', 'ambrygen-web' ) }>
					<div className="cta-tiles-with-3-card-item-sidebar">
						<ImageUploader
							url={ image }
							onSelect={ onSelectImage }
							onRemove={ onRemoveImage }
							label={ __( 'Card Image', 'ambrygen-web' ) }
						/>

						<CtaButtonField
							label={ __( '', 'ambrygen-web' ) }
							textLabel={ __( 'Link Text', 'ambrygen-web' ) }
							defaultVariant="primary"
							value={ link }
							showVariant={ false }
							onChange={ ( value ) =>
								setAttributes( { link: value } )
							}
						/>
					</div>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className={ `cta-tiles-with-3-card__image-wrapper cta-tiles-with-3-card__image-wrapper--${ type }` }
				>
					<img
						src={ displayImage }
						alt={ displayImageAlt }
						loading="lazy"
					/>
				</div>

				<div
					className={ `cta-tiles-with-3-card__content ${
						type === 'main'
							? 'cta-tiles-with-3-card__content--main'
							: ''
					}` }
				>
					<RichText
						tagName="h3"
						className="cta-tiles-with-3-card__title heading-6 mb-0 card-title block-inside-title"
						value={ title }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/text-color',
						] }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s8" aria-hidden="true" />

					<RichText
						tagName="div"
						className="cta-tiles-with-3-card__description body1 block-inside-description"
						value={ description }
						onChange={ ( val ) =>
							setAttributes( { description: val } )
						}
						placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s20" aria-hidden="true" />

					{ link?.url && (
						<div className="cta-tiles-with-3-card__link">
							<span className="site-btn is-style-site-text-btn has-right-arrow">
								{ link?.text ||
									__( 'Learn more', 'ambrygen-web' ) }
							</span>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
