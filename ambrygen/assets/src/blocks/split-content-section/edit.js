import {
	InnerBlocks,
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

import {
	BlockExamplePreview,
	ImageUploader,
	TagSelector,
} from '../_shared/components';

const CONTENT_TEMPLATE = [
	[
		'core/paragraph',
		{ placeholder: __( 'Add Paragraph...', 'ambrygen-web' ) },
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		titleTag,
		description,
		backgroundImage,
		backgroundImageAlt,
		isMediumText,
		isHeaderVertical,
	} = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlockOrder } = select( 'core/block-editor' );

			return getBlockOrder( clientId ).length > 0;
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: `heading-content-section ${
			isMediumText ? 'variation-medium-text' : ''
		}`,
	} );

	const handleImageSelect = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			backgroundImage: media.url,
			backgroundImageId: media.id || 0,
			backgroundImageAlt: media.alt || '',
		} );
	};

	if ( blockId === 'split-content-section-example' ) {
		return (
			<BlockExamplePreview
				className="split-content-section-example-preview"
				imagePath="/assets/src/images/ambrygen-default-image.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Section Intro Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ titleTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { titleTag: value } )
						}
					/>

					<ImageUploader
						label={ __( 'Background Image', 'ambrygen-web' ) }
						url={ backgroundImage }
						onSelect={ handleImageSelect }
						onRemove={ () =>
							setAttributes( {
								backgroundImage: '',
								backgroundImageId: 0,
								backgroundImageAlt: '',
							} )
						}
					/>

					<ToggleControl
						label={ __( 'Vertical Header Layout', 'ambrygen-web' ) }
						checked={ isHeaderVertical }
						onChange={ ( value ) =>
							setAttributes( { isHeaderVertical: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Medium Text Variation', 'ambrygen-web' ) }
						checked={ isMediumText }
						onChange={ ( value ) =>
							setAttributes( { isMediumText: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ backgroundImage && (
					<div className="block-bg-image">
						<img
							src={ backgroundImage }
							alt={ backgroundImageAlt || '' }
						/>
					</div>
				) }
				<div
					className={ `heading-content-section__inner block__rowflex is-${
						isHeaderVertical ? 'vertical' : 'horizontal'
					}` }
				>
					<RichText
						tagName={ titleTag || 'h2' }
						className="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/text-color',
							'ambrygen/tooltip',
						] }
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>
					<div className="heading-content-wrapper">
						<div className="heading-content-section__description block__rowflex--block-content block-description">
							<RichText
								tagName="div"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/link',
									'ambrygen/tooltip',
								] }
								placeholder={ __(
									'Add Description...',
									'ambrygen-web'
								) }
							/>
						</div>
						<div className="heading-content-section__content js-gsap-fade">
							{ hasInnerBlocks && (
								<div
									className="is-style-gl-s24"
									aria-hidden="true"
								></div>
							) }
							<InnerBlocks
								allowedBlocks={ [
									'core/paragraph',
									'core/list',
									'core/buttons',
									'core/button',
									'core/spacer',
								] }
								template={ CONTENT_TEMPLATE }
								templateLock={ false }
								renderAppender={ InnerBlocks.ButtonBlockAppender }
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
