import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { getThemeAssetUrl } from '../../utils/assets';
import {
	BlockVariationsExamplePreview,
	TagSelector,
} from '../_shared/components';

const VARIATION_VALUES = {
	VARIATION_1: 'variation-1',
	VARIATION_2: 'variation-2',
};

const VARIATION_1_TEMPLATE = [
	[ 'ambrygen/two-card-column-item' ],
	[ 'ambrygen/two-card-column-item' ],
];

const VARIATION_2_TEMPLATE = [
	[ 'ambrygen/two-card-column-item' ],
	[ 'ambrygen/two-card-column-item' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		heading,
		headingTag,
		description,
		variation = VARIATION_VALUES.VARIATION_1,
		eyebrow,
	} = attributes;
	const HeadingTag = headingTag || 'h2';
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	const isExample = blockId === 'two-column-card-example';

	const VARIANTS = useMemo(
		() => [
			{
				label: __( 'Variation 1', 'ambrygen-web' ),
				value: VARIATION_VALUES.VARIATION_1,
				image: getThemeAssetUrl(
					'/assets/src/images/two-card-column/variation-1.png'
				),
			},
			{
				label: __( 'Variation 2', 'ambrygen-web' ),
				value: VARIATION_VALUES.VARIATION_2,
				image: getThemeAssetUrl(
					'/assets/src/images/two-card-column/variation-2.png'
				),
			},
		],
		[]
	);

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	const isVariation2 = variation === VARIATION_VALUES.VARIATION_2;

	const blockProps = useBlockProps( {
		className: isVariation2
			? 'ordering-options'
			: 'cta-tiles-with-content',
	} );

	if ( isExample ) {
		return (
			<BlockVariationsExamplePreview
				variants={ VARIANTS }
				className="two-column-solution-card-example-preview"
				itemClass="two-column-solution-card-example-preview__item"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Select Variation', 'ambrygen-web' ) }>
					<div className="layout-variant-selector">
						{ VARIANTS.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								className={ `variant-button ${
									variation === variant.value
										? 'is-selected'
										: ''
								}` }
								onClick={ () => {
									if ( variation !== variant.value ) {
										setAttributes( {
											variation: variant.value,
										} );

										const nextTemplate =
											variant.value ===
											VARIATION_VALUES.VARIATION_2
												? VARIATION_2_TEMPLATE
												: VARIATION_1_TEMPLATE;

										replaceInnerBlocks(
											clientId,
											createBlocksFromInnerBlocksTemplate(
												nextTemplate
											)
										);
									}
								} }
							>
								<img
									src={ variant.image }
									alt={ variant.label }
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ HeadingTag }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				{ isVariation2 ? (
					<>
						<div className="ordering-options__header">
							<RichText
								tagName="div"
								className="hero-kicker ordering-options__eyebrow"
								value={ eyebrow }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
								placeholder={ __( 'Add Eyebrow...', 'ambrygen-web' ) }
								allowedFormats={ [] }
							/>
							<div class="is-style-gl-s12" aria-hidden="true"></div>

							<RichText
								tagName={ HeadingTag }
								className="heading-4 block-title mb-0"
								value={ heading }
								allowedFormats={ [ 'core/text-color' ] }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add Heading...',
									'ambrygen-web'
								) }
							/>

							<div
								className="is-style-gl-s12"
								aria-hidden="true"
							></div>

							<RichText
								tagName="div"
								className="body1 ordering-options__subtitle"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( {
										description: value,
									} )
								}
								placeholder={ __(
									'Add Description...',
									'ambrygen-web'
								) }
							/>
						</div>

						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

						<div className="ordering-options__cards">
							<BlockContextProvider
								value={ {
									'ambrygen/twoCardColumnVariation': variation,
								} }
							>
								<InnerBlocks
									allowedBlocks={ [ 'ambrygen/two-card-column-item' ] }
									template={ VARIATION_2_TEMPLATE }
								/>
							</BlockContextProvider>
						</div>
					</>
				) : (
					<>
						<div className="cta-tiles-with-content__header block__rowflex">
							<RichText
								tagName={ HeadingTag }
								className="heading-3 block-title mb-0 block__rowflex--heading-title"
								value={ heading }
								allowedFormats={ [ 'core/text-color' ] }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add Heading...',
									'ambrygen-web'
								) }
							/>

							<div className="block__rowflex--block-content subtitle-1-regular">
								<RichText
									tagName="div"
									value={ description }
									onChange={ ( value ) =>
										setAttributes( {
											description: value,
										} )
									}
									placeholder={ __(
										'Add Description...',
										'ambrygen-web'
									) }
								/>
							</div>
						</div>

						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>

						<div className="cta-tiles-with-content__grid">
							<BlockContextProvider
								value={ {
									'ambrygen/twoCardColumnVariation': variation,
								} }
							>
								<InnerBlocks
									allowedBlocks={ [
										'ambrygen/two-card-column-item',
									] }
									template={ VARIATION_1_TEMPLATE }
								/>
							</BlockContextProvider>
						</div>
					</>
				) }
			</section>
		</>
	);
}
