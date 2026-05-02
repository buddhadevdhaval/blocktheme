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

const VARIATIONS = {
	DEFAULT: 'two-column-solution-card',
	ORDERING_OPTIONS: 'ordering-options',
};

const TEMPLATE_DEFAULT = [
	[ 'ambrygen/two-card-column-item' ],
	[ 'ambrygen/two-card-column-item' ],
];

const TEMPLATE_ORDERING = [
	[ 'ambrygen/two-card-column-item' ],
	[ 'ambrygen/two-card-column-item' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		heading,
		headingTag,
		eyebrow,
		description,
		variation = VARIATIONS.DEFAULT,
	} = attributes;
	const hasHeaderContent = Boolean( eyebrow || heading || description );
	const HeadingTag = headingTag || 'h2';
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	const VARIANTS = useMemo(
		() => [
			{
				label: __( 'Two Card Column', 'ambrygen-web' ),
				value: VARIATIONS.DEFAULT,
				image: getThemeAssetUrl(
					'/assets/src/images/two-card-column/preview.png'
				),
			},
			{
				label: __( 'Ordering Options', 'ambrygen-web' ),
				value: VARIATIONS.ORDERING_OPTIONS,
				image: getThemeAssetUrl(
					'/assets/src/images/two-card-column/ordering-options.png'
				),
			},
		],
		[]
	);

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const isOrderingOptions = variation === VARIATIONS.ORDERING_OPTIONS;

	const blockProps = useBlockProps( {
		className: isOrderingOptions
			? 'ordering-options'
			: 'cta-tiles-with-content',
	} );

	if ( blockId === 'two-column-solution-card-example' ) {
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
											VARIATIONS.ORDERING_OPTIONS
												? TEMPLATE_ORDERING
												: TEMPLATE_DEFAULT;

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
				{ ! isOrderingOptions && (
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
				) }
			</InspectorControls>

			<section { ...blockProps }>
				{ isOrderingOptions ? (
					<>
						<div className="ordering-options__header">
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

							{ heading && description && (
								<div
									className="is-style-gl-s12"
									aria-hidden="true"
								></div>
							) }

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

						{ hasHeaderContent && (
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>
						) }

						<div className="ordering-options__cards">
							<BlockContextProvider
								value={ {
									'ambrygen/twoCardColumnVariation': variation,
								} }
							>
								<InnerBlocks
									allowedBlocks={ [ 'ambrygen/two-card-column-item' ] }
									template={ TEMPLATE_ORDERING }
									templateLock="insert"
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

						{ hasHeaderContent && (
							<div
								className="is-style-gl-s50"
								aria-hidden="true"
							></div>
						) }

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
									template={ TEMPLATE_DEFAULT }
								/>
							</BlockContextProvider>
						</div>
					</>
				) }
			</section>
		</>
	);
}
