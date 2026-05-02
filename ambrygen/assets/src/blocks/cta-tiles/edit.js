import { __, sprintf } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useEffect, useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	BlockVariationsExamplePreview,
	TagSelector,
} from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

// Constants
const ALLOWED_BLOCKS = [ 'ambrygen/cta-tiles-item' ];

const CTA_TILES_VARIATIONS = {
	IMAGE_ONLY_TITLE: 'image-only-title',
	IMAGE_TITLE_DESCRIPTION_ICON: 'image-title-description-icon',
	IMAGE_TITLE_DESCRIPTION: 'image-title-description',
};

const LEGACY_VARIATION_MAP = {
	default: CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE,
	'image-content-grid': CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON,
	'variation-features': CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION,
};

const VARIATION_CLASS_NAMES = {
	[ CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE ]: 'default',
	[ CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON ]: 'image-content-grid',
	[ CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION ]: 'variation-features',
};

const VARIATION_AMB_CLASSES = {
	[ CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION ]: 'variation-team',
	[ CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON ]: 'variation-team',
};

const GRID_COLUMNS_BY_ITEM_COUNT = {
	1: '1',
	2: '2',
	3: '3',
};

const normalizeCtaTilesVariation = ( variation ) =>
	LEGACY_VARIATION_MAP[ variation ] ||
	variation ||
	CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE;

const getVariants = () => [
	{
		label: __( 'Image with Only Title', 'ambrygen-web' ),
		value: CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE,
		image: getThemeAssetUrl( '/assets/src/images/cta-tiles/v-1.png' ),
	},
	{
		label: __( 'Image with Title & Description & Icon', 'ambrygen-web' ),
		value: CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON,
		image: getThemeAssetUrl( '/assets/src/images/cta-tiles/v-2.png' ),
	},
	{
		label: __( 'Image with Title & Description', 'ambrygen-web' ),
		value: CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION,
		image: getThemeAssetUrl( '/assets/src/images/cta-tiles/v-3.png' ),
	},
];

const DEFAULT_TEMPLATE = [
	[
		'ambrygen/cta-tiles-item',
		{
			title: '',
			description: '',
			link: {
				url: '',
				text: '',
				target: '',
				rel: '',
				variant: 'dark',
			},
		},
	],
	[
		'ambrygen/cta-tiles-item',
		{
			title: '',
			description: '',
			link: {
				url: '',
				text: '',
				target: '',
				rel: '',
				variant: 'dark',
			},
		},
	],
];

/**
 * CTA Tiles Block Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string}   props.clientId      - Block client ID
 * @return {JSX.Element} Edit component
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		variation: variationAttribute = CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE,
		heading,
		description,
		headingTag = 'h2',
		topImageID = 0,
		topImageURL,
		topImageAlt,
	} = attributes;

	const VARIANTS = getVariants();
	const variation = normalizeCtaTilesVariation( variationAttribute );
	const hasTopImage = Boolean( topImageID && topImageURL );
	const isExample = blockId === 'cta-tiles-example';

	// Initialize block ID
	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;
		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	// Normalize variation on mount
	useEffect( () => {
		if ( variation !== variationAttribute ) {
			setAttributes( { variation } );
		}
	}, [ variationAttribute, variation, setAttributes ] );

	// Get inner blocks
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const { insertBlock } = useDispatch( 'core/block-editor' );

	// Calculate grid columns
	const effectiveGridColumns =
		GRID_COLUMNS_BY_ITEM_COUNT[ innerBlocks.length ] || '3';

	// Get variation-specific classes
	const ambClass = VARIATION_AMB_CLASSES[ variation ] || '';
	const variationClassName =
		VARIATION_CLASS_NAMES[ variation ] ||
		VARIATION_CLASS_NAMES[ CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE ];

	const blockProps = useBlockProps( {
		className: `cta-tiles block-${ variationClassName } ${ ambClass } grid-column${ effectiveGridColumns }`,
	} );

	const HeadingTag = headingTag || 'h2';

	// Handle media upload
	const handleMediaSelect = useCallback(
		( media ) => {
			if ( ! media || ! media.id || ! media.url ) {
				return;
			}
			setAttributes( {
				topImageID: media.id,
				topImageURL: media.url,
				topImageAlt: media.alt || '',
			} );
		},
		[ setAttributes ]
	);

	// Handle media removal
	const handleMediaRemove = useCallback( () => {
		setAttributes( {
			topImageID: null,
			topImageURL: '',
			topImageAlt: '',
		} );
	}, [ setAttributes ] );

	// Example preview
	if ( isExample ) {
		return (
			<BlockVariationsExamplePreview
				variants={ VARIANTS }
				className="cta-tiles-example-preview"
				itemClass="cta-tiles-example-preview__item"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Select Variation', 'ambrygen-web' ) }
					initialOpen
				>
					<div
						className="layout-variant-selector"
						role="radiogroup"
						aria-label={ __(
							'CTA Tiles Variation',
							'ambrygen-web'
						) }
					>
						{ VARIANTS.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								role="radio"
								className={ `variant-button ${
									variation === variant.value
										? 'is-selected'
										: ''
								}` }
								aria-checked={ variation === variant.value }
								aria-label={ sprintf(
									/* translators: %s: variant label */
									__( 'Select %s', 'ambrygen-web' ),
									variant.label
								) }
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt={ variant.label }
									aria-hidden="true"
									role="presentation"
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				{ variation ===
					CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON && (
					<PanelBody
						title={ __( 'Icon', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						<MediaUploadCheck>
							{ hasTopImage && (
								<div className="cta-tiles__image-preview">
									<img
										src={ topImageURL }
										alt={ topImageAlt || '' }
									/>
								</div>
							) }
							<MediaUpload
								onSelect={ handleMediaSelect }
								allowedTypes={ [ 'image' ] }
								value={ topImageID }
								render={ ( { open } ) => (
									<Button onClick={ open } variant="primary">
										{ hasTopImage
											? __(
													'Replace Image',
													'ambrygen-web'
											  )
											: __(
													'Select Image',
													'ambrygen-web'
											  ) }
									</Button>
								) }
							/>
							{ hasTopImage && (
								<Button
									variant="link"
									isDestructive
									onClick={ handleMediaRemove }
									style={ { marginTop: '8px' } }
								>
									{ __( 'Remove Image', 'ambrygen-web' ) }
								</Button>
							) }
						</MediaUploadCheck>
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				<div className="cta-tiles__content">
					{ /* Variation: Image + Title + Description + Icon */ }
					{ variation ===
						CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION_ICON && (
						<div className="cta-tiles__header logo-title-section">
							{ hasTopImage && (
								<>
									<div className="logo-title-section__icon">
										<img
											src={ topImageURL }
											alt={ topImageAlt || '' }
											className="logo-title-section__logo"
										/>
										<div
											className="is-style-gl-s50"
											aria-hidden="true"
										/>
									</div>
									<div
										className="is-style-gl-s50"
										aria-hidden="true"
									/>
								</>
							) }

							<div className="logo-title-section__content">
								<HeadingTag className="heading-2 block-title mb-0">
									<RichText
										tagName="span"
										value={ heading }
										onChange={ ( value ) =>
											setAttributes( { heading: value } )
										}
										placeholder={ __(
											'Add Heading…',
											'ambrygen-web'
										) }
										aria-label={ __(
											'CTA Tiles Heading',
											'ambrygen-web'
										) }
										allowedFormats={ [
											'core/bold',
											'core/italic',
											'core/text-color',
										] }
									/>
								</HeadingTag>
									<div
										className="is-style-gl-s16"
										aria-hidden="true"
									/>
								<div className="body1-reg logo-title-section__description">
									<RichText
										tagName="div"
										value={ description }
										onChange={ ( value ) =>
											setAttributes( {
												description: value,
											} )
										}
										placeholder={ __(
											'Add Description…',
											'ambrygen-web'
										) }
										aria-label={ __(
											'CTA Tiles Description',
											'ambrygen-web'
										) }
										allowedFormats={ [
											'core/bold',
											'core/italic',
										] }
									/>
								</div>
							</div>
						</div>
					) }

					{ /* Variation: Image + Title Only */ }
					{ variation === CTA_TILES_VARIATIONS.IMAGE_ONLY_TITLE && (
						<HeadingTag className="block-title heading-3 mb-0">
							<RichText
								tagName="span"
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add Heading…',
									'ambrygen-web'
								) }
								aria-label={ __(
									'CTA Tiles Heading',
									'ambrygen-web'
								) }
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/text-color',
								] }
							/>
						</HeadingTag>
					) }

					{ /* Variation: Image + Title + Description */ }
					{ variation ===
						CTA_TILES_VARIATIONS.IMAGE_TITLE_DESCRIPTION && (
						<div className="cta-tiles__header block__rowflex">
							<HeadingTag className="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title">
								<RichText
									tagName="span"
									value={ heading }
									onChange={ ( value ) =>
										setAttributes( { heading: value } )
									}
									placeholder={ __(
										'Add Heading…',
										'ambrygen-web'
									) }
									aria-label={ __(
										'CTA Tiles Heading',
										'ambrygen-web'
									) }
									allowedFormats={ [
										'core/bold',
										'core/italic',
										'core/text-color',
									] }
								/>
							</HeadingTag>
							<div className="heading-content-wrapper">
								<div className="block__rowflex--block-content subtitle1-reg">
									<RichText
										tagName="div"
										value={ description }
										onChange={ ( value ) =>
											setAttributes( {
												description: value,
											} )
										}
										placeholder={ __(
											'Add Description…',
											'ambrygen-web'
										) }
										aria-label={ __(
											'CTA Tiles Description',
											'ambrygen-web'
										) }
										allowedFormats={ [
											'core/bold',
											'core/italic',
										] }
									/>
								</div>
							</div>
						</div>
					) }

					<div className="card-grid-block">
						<BlockContextProvider
							value={ {
								'ambrygen/ctaTilesVariation': variation,
							} }
						>
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ DEFAULT_TEMPLATE }
								templateLock={ false }
								renderAppender={ false }
							/>
						</BlockContextProvider>

							<Button
								variant="primary"
								onClick={ () => {
									insertBlock(
										createBlock( 'ambrygen/cta-tiles-item' ),
										undefined,
										clientId
									);
								} }
							>
								{ __( 'Add New Record', 'ambrygen-web' ) }
							</Button>
					</div>
				</div>
			</div>
		</>
	);
}
