import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	InnerBlocks,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/video-grid-item' ];
const TEMPLATE = [
	[ 'ambrygen/video-grid-item' ],
	[ 'ambrygen/video-grid-item' ],
];

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
} ) {
	const {
		blockId,
		heading,
		description,
		subheading = '',
		subDescription = '',
		quoteAttribution = '',
		headingTag = 'h2',
		variation = 'variation-features',
	} = attributes;

	const hasContent = ( value ) =>
		value?.replace( /<[^>]+>/g, '' ).trim().length > 0;

	const innerBlocksCount = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlocks( clientId ).length,
		[ clientId ]
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
		if ( variation === 'default' || variation === 'image-content-grid' ) {
			setAttributes( {
				variation: 'variation-features',
			} );
		}
	}, [ variation, setAttributes ] );

	const ambClass =
		variation === 'variation-features' || variation === 'variation-3'
			? 'variation-team'
			: '';
	const hasQuote = hasContent( heading );
	const hasQuoteAttribution = hasContent( quoteAttribution );
	const hasDescription = hasContent( description );
	const hasSubheading = hasContent( subheading );
	const hasSubDescription = hasContent( subDescription );

	const blockProps = useBlockProps( {
		className: `image-grid-block video-grid wp-block-ambrygen-gallery block-${ variation } ${ ambClass } grid-column${
			innerBlocksCount >= 3 ? 3 : 2
		}`,
	} );
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Video Grid Settings', 'ambrygen-web' ) }
				>
					<SelectControl
						label={ __( 'Variation', 'ambrygen-web' ) }
						value={ variation }
						options={ [
							{
								label: __( 'Featured Videos', 'ambrygen-web' ),
								value: 'variation-features',
							},
							{
								label: __( 'Compact Grid', 'ambrygen-web' ),
								value: 'variation-3',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								variation: value,
							} )
						}
					/>

					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div
					className={ `two-column-videos${
						variation === 'variation-3' ? ' row-videos' : ''
					}` }
				>
					<div className="is-style-gl-s50" aria-hidden="true"></div>

					{ ( hasQuote ||
						hasQuoteAttribution ||
						hasDescription ||
						isSelected ) && (
						<div className="two-column-videos__header block__rowflex">
							{ ( hasQuote ||
								hasQuoteAttribution ||
								isSelected ) && (
								<div className="block__rowflex--heading-title two-column-videos__header-quote">
									{ ( hasQuote || isSelected ) && (
										<RichText
											tagName={ headingTag }
											className="heading-4 mb-0 js-gsap-fade two-column-videos__quote-text"
											value={ heading }
											onChange={ ( value ) =>
												setAttributes( {
													heading: value,
												} )
											}
											placeholder={ __(
												'Add quote',
												'ambrygen-web'
											) }
										/>
									) }
									{ ( hasQuote || isSelected ) &&
										( hasQuoteAttribution ||
											isSelected ) && (
											<div
												className="is-style-gl-s16"
												aria-hidden="true"
											></div>
										) }
									{ ( hasQuoteAttribution || isSelected ) && (
										<RichText
											tagName="div"
											className="body2-reg two-column-videos__quote-attribution"
											value={ quoteAttribution }
											onChange={ ( value ) =>
												setAttributes( {
													quoteAttribution: value,
												} )
											}
											placeholder={ __(
												'Add quote attribution',
												'ambrygen-web'
											) }
											withoutInteractiveFormatting={
												true
											}
										/>
									) }
								</div>
							) }

							{ ( hasDescription || isSelected ) && (
								<RichText
									tagName="div"
									className="block__rowflex--block-content subtitle-1-regular js-gsap-fade two-column-videos__header-description"
									value={ description }
									onChange={ ( value ) =>
										setAttributes( {
											description: value,
										} )
									}
									placeholder={ __(
										'Add description…',
										'ambrygen-web'
									) }
								/>
							) }
						</div>
					) }

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					{ ( hasSubheading || hasSubDescription || isSelected ) && (
						<div className="two-column-videos__subheading">
							{ ( hasSubheading || isSelected ) && (
								<RichText
									tagName="h2"
									className="heading-4 block-title mb-0"
									value={ subheading }
									onChange={ ( value ) =>
										setAttributes( {
											subheading: value,
										} )
									}
									placeholder={ __(
										'Add subheading…',
										'ambrygen-web'
									) }
								/>
							) }
							{ ( hasSubheading || isSelected ) &&
								( hasSubDescription || isSelected ) && (
									<div
										className="is-style-gl-s16"
										aria-hidden="true"
									></div>
								) }
							{ ( hasSubDescription || isSelected ) && (
								<RichText
									tagName="div"
									className="body2-reg two-column-videos__subheading-description"
									value={ subDescription }
									onChange={ ( value ) =>
										setAttributes( {
											subDescription: value,
										} )
									}
									placeholder={ __(
										'Add subheading description…',
										'ambrygen-web'
									) }
								/>
							) }
						</div>
					) }

					<div className="is-style-gl-s50" aria-hidden="true"></div>

					<div className="videos__cards">
						<BlockContextProvider
							value={ {
								'ambrygen/videoGridVariation': variation,
							} }
						>
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ TEMPLATE }
								templateLock={ false }
								renderAppender={
									variation === 'variation-features'
										? false
										: undefined
								}
							/>
						</BlockContextProvider>
					</div>

					<div className="is-style-gl-s50" aria-hidden="true"></div>
				</div>
			</section>
		</>
	);
}
