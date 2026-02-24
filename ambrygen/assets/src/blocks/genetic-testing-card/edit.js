/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
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
import { PanelBody, PanelRow, BaseControl } from '@wordpress/components';

/**
 * Edit component for the Genetic Testing Card block.
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {JSX.Element} Block editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
	const defaults = DEFAULT_IMAGES();

	const { image, imageAlt, title, description, link, type } = attributes;

	const instanceId = useInstanceId( Edit );

	/**
	 * Set default image on block creation if empty.
	 * Runs when image or type changes.
	 */
	useEffect( () => {
		if ( ! image ) {
			setAttributes( {
				image: defaults?.placeholder?.url,
				imageAlt: defaults?.placeholder?.alt || '',
			} );
		}
	}, [ image, type, setAttributes ] );

	const onSelectImage = ( media ) => {
		setAttributes( {
			image: media.url,
			imageId: media.id,
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
		className: `genetic-cards__card genetic-cards__card--${ type }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Card Settings', 'ambrygen-web' ) }>
					<PanelRow>
						<ImageUploader
							url={ image }
							onSelect={ onSelectImage }
							onRemove={ onRemoveImage }
							label={ __( 'Card Image', 'ambrygen-web' ) }
						/>
					</PanelRow>

					<PanelRow>
						<BaseControl
							id={ `card-link-${ instanceId }` }
							className="w-full"
						>
							<CtaButtonField
								label={ __( 'Link setting' ) }
								textLabel={ __( 'Link Text' ) }
								defaultVariant="primary"
								value={ link }
								showVariant={ false }
								onChange={ ( value ) =>
									setAttributes( { link: value } )
								}
							/>
						</BaseControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className={ `genetic-cards__image-wrapper genetic-cards__image-wrapper--${ type }` }
				>
					<img
						src={ image || defaults?.placeholder?.url }
						alt={ imageAlt || defaults?.placeholder?.alt || '' }
						loading="lazy"
					/>
				</div>

				<div
					className={ `genetic-cards__content ${
						type === 'main' ? 'genetic-cards__content--main' : ''
					}` }
				>
					<RichText
						tagName="div"
						className="genetic-cards__title heading-6 mb-0 card-title"
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						placeholder={ __( 'Heading…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s8" />

					<RichText
						tagName="div"
						className="genetic-cards__description body1"
						value={ description }
						onChange={ ( val ) =>
							setAttributes( { description: val } )
						}
						placeholder={ __( 'Description…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s20" />

					{ link?.text && (
						<div className="genetic-cards__link">
							<a
								className="site-btn is-style-site-text-btn has-icon"
								href={ '#' }
							>
								{ link?.text || 'Learn more' }{ ' ' }
							</a>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
