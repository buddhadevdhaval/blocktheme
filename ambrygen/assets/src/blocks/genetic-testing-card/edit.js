/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
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
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const { image, imageAlt, title, description, link, type } = attributes;

	const instanceId = useInstanceId( Edit );
	const displayImage = image || defaults?.placeholder?.url;
	const displayImageAlt = image ? imageAlt : defaults?.placeholder?.alt || '';

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
								label={ __( 'Link setting', 'ambrygen-web' ) }
								textLabel={ __( 'Link Text', 'ambrygen-web' ) }
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
						src={ displayImage }
						alt={ displayImageAlt }
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
						placeholder={ __( 'Add Title…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s8" />

					<RichText
						tagName="div"
						className="genetic-cards__description body1"
						value={ description }
						onChange={ ( val ) =>
							setAttributes( { description: val } )
						}
						placeholder={ __(
							'Add Description …',
							'ambrygen-web'
						) }
					/>

					<div className="is-style-gl-s20" />

					{ link?.url && (
						<div className="genetic-cards__link">
							<span className="site-btn is-style-site-text-btn has-icon">
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
