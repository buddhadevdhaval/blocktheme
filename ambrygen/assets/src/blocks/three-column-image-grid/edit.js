import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
	BlockVariationsExamplePreview,
	TagSelector,
} from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';

const ALLOWED_BLOCKS = [ 'ambrygen/three-column-image-grid-item' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		eyebrow,
		heading,
		description,
		headingTag,
		variation = 'variation-1',
	} = attributes;
	const { blockId } = attributes;
	const VARIANTS = useMemo(
		() => [
			{
				label: __( 'Variation 1', 'ambrygen-web' ),
				value: 'variation-1',
				image: getThemeAssetUrl(
					'/assets/src/images/three-column-image/variation-1.png'
				),
			},
			{
				label: __( 'Variation 2', 'ambrygen-web' ),
				value: 'variation-2',
				image: getThemeAssetUrl(
					'/assets/src/images/three-column-image/variation-2.png'
				),
			},
		],
		[]
	);

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		const shouldBeVertical = variation !== 'variation-2';

		if ( attributes.isHeaderVertical !== shouldBeVertical ) {
			setAttributes( {
				isHeaderVertical: shouldBeVertical,
			} );
		}
	}, [ attributes.isHeaderVertical, variation, setAttributes ] );

	const variationClass = variation === 'variation-2' ? 'variation-three' : '';
	const showEyebrow = variation !== 'variation-2';
	const isHeaderVertical = variation !== 'variation-2';

	const blockProps = useBlockProps( {
		className: `block-layout three-column-image-grid ${ variationClass }`,
	} );

	const HeadingTag = headingTag || 'h2';

	if ( blockId === 'three-column-image-grid-example' ) {
		return (
			<BlockVariationsExamplePreview
				variants={ VARIANTS }
				className="three-column-image-grid-example-preview"
				itemClass="three-column-image-grid-example-preview__item"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<div className="layout-variant-selector">
						{ VARIANTS.map( ( variantItem ) => (
							<button
								key={ variantItem.value }
								type="button"
								className={ `variant-button ${
									variation === variantItem.value
										? 'is-selected'
										: ''
								}` }
								onClick={ () =>
									setAttributes( {
										variation: variantItem.value,
									} )
								}
							>
								<img
									src={ variantItem.image }
									alt={ variantItem.label }
								/>
								<span>{ variantItem.label }</span>
							</button>
						) ) }
					</div>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div
					className={ `three-column-image-grid__header block__rowflex is-${
						isHeaderVertical ? 'vertical' : 'horizontal'
					}` }
				>
					<div className="block-title mb-0 block__rowflex--heading-title js-gsap-fade three-column-image-grid__header__left">
						{ showEyebrow && (
							<RichText
								tagName="div"
								value={ eyebrow }
								allowedFormats={ [ 'core/text-color' ] }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
								className="eyebrow"
								placeholder={ __(
									'Add Eyebrow...',
									'ambrygen-web'
								) }
							/>
						) }
						{ showEyebrow && eyebrow && heading && (
							<div
								className="is-style-gl-s12"
								aria-hidden="true"
							/>
						) }
						<RichText
							tagName={ HeadingTag }
							className={ `block-title block__rowflex--heading-title heading-3 mb-0` }
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							allowedFormats={ [ 'core/text-color' ] }
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>
					</div>

					<div className="heading-content-wrapper">
						<div className="block__rowflex--block-content subtitle1-reg">
							<RichText
								tagName="div"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								multiline="p"
								placeholder={ __(
									'Add description...',
									'ambrygen-web'
								) }
							/>
						</div>
					</div>
				</div>

				{ ( heading || description ) && (
					<div className="is-style-gl-s32" aria-hidden="true"></div>
				) }

				<div className="three-column-image-grid__content">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ [
							[ 'ambrygen/three-column-image-grid-item' ],
							[ 'ambrygen/three-column-image-grid-item' ],
							[ 'ambrygen/three-column-image-grid-item' ],
						] }
						templateLock="all"
					/>
				</div>
			</div>
		</>
	);
}
