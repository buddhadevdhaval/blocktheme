import { __ } from '@wordpress/i18n';
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
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getThemeAssetUrl } from '../../utils/assets';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/gallery-item' ];

const GRID_COLUMNS_BY_ITEM_COUNT = {
	1: '1',
	2: '2',
	3: '3',
	4: '4',
};

const DEFAULT_TEMPLATE = [
	[
		'ambrygen/gallery-item',
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
		'ambrygen/gallery-item',
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

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId } = attributes;

	useEffect( () => {
		const expectedId = `sticky-tabs-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const {
		variation = 'default',
		heading,
		description,
		headingTag = 'h2',
		topImageID = 0,
		topImageURL,
		topImageAlt,
	} = attributes;

	const VARIANTS = useMemo(
		() => [
			{
				label: __( 'Image with Only Title', 'ambrygen-web' ),
				value: 'default',
				image: getThemeAssetUrl(
					'/assets/src/images/image-gallery/default.png'
				),
			},
			{
				label: __(
					'Image with Title & Description & ICON',
					'ambrygen-web'
				),
				value: 'image-content-grid',
				image: getThemeAssetUrl(
					'/assets/src/images/image-gallery/image-content-grid.png'
				),
			},
			{
				label: __( 'Image with Title & Description', 'ambrygen-web' ),
				value: 'variation-features',
				image: getThemeAssetUrl(
					'/assets/src/images/image-gallery/image-content-desc.png'
				),
			},
		],
		[]
	);

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	const effectiveGridColumns =
		GRID_COLUMNS_BY_ITEM_COUNT[ innerBlocks.length ] || '3';

	let ambClass = '';
	if (
		variation === 'variation-features' ||
		variation === 'image-content-grid'
	) {
		ambClass = 'variation-team';
	}

	const blockProps = useBlockProps( {
		className: `image-grid-block  block-${ variation } ${ ambClass } ${ `grid-column${ effectiveGridColumns }` }`,
	} );

	const HeadingTag = headingTag || 'h2';
	useEffect( () => {
		if ( ! variation ) {
			setAttributes( { variation: 'default' } );
		}
	}, [ variation, setAttributes ] );

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
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt={ variant.label }
								/>
								<span>{ variant.label }</span>
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

					{ variation === 'image-content-grid' && (
						<>
							<p>{ __( 'Top Image', 'ambrygen-web' ) }</p>
							<MediaUploadCheck>
								{ ( topImageID || topImageURL ) && (
									<div className="gallery-intro__image">
										<img
											src={ topImageURL }
											alt={ topImageAlt || '' }
										/>
									</div>
								) }
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											topImageID: media.id,
											topImageURL: media.url,
											topImageAlt: media.alt || '',
										} )
									}
									allowedTypes={ [ 'image' ] }
									value={ topImageID }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="primary"
										>
											{ topImageID
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
							</MediaUploadCheck>

							{ topImageURL && (
								<Button
									variant="link"
									isDestructive
									onClick={ () =>
										setAttributes( {
											topImageID: null,
											topImageURL: '',
											topImageAlt: '',
										} )
									}
								>
									{ __( 'Remove Image', 'ambrygen-web' ) }
								</Button>
							) }
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="get-started-block">
					{ /* New Variant */ }
					{ variation === 'image-content-grid' && (
						<div className="our-approach__header logo-title-section">
							{ ( topImageID || topImageURL ) && (
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
										></div>
									</div>
									<div
										className="is-style-gl-s50"
										aria-hidden="true"
									></div>
								</>
							) }

							<div className="logo-title-section__content">
								<HeadingTag className="heading-2 block-title mb-0">
									<RichText
										value={ heading }
										onChange={ ( value ) =>
											setAttributes( { heading: value } )
										}
										placeholder={ __(
											'Add title…',
											'ambrygen-web'
										) }
									/>
								</HeadingTag>
								<div
									className="is-style-gl-s16"
									aria-hidden="true"
								></div>
								<div className="body1-reg logo-title-section__description">
									<RichText
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
								</div>
							</div>
						</div>
					) }

					{ /* Old Variant */ }
					{ variation === 'default' && (
						<HeadingTag className="block-title heading-3 mb-0">
							<RichText
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder={ __(
									'Add title…',
									'ambrygen-web'
								) }
							/>
						</HeadingTag>
					) }

					{ variation === 'variation-features' && (
						<>
							<div className="our-approach__header block__rowflex">
								<HeadingTag
									className="heading-content-section__title heading-3 block-title mb-0
						block__rowflex--heading-title"
								>
									<RichText
										value={ heading }
										onChange={ ( value ) =>
											setAttributes( { heading: value } )
										}
										placeholder={ __(
											'Add title…',
											'ambrygen-web'
										) }
									/>
								</HeadingTag>
								<div className="heading-content-wrapper">
									<div className="block__rowflex--block-content subtitle1-reg">
										<RichText
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
									</div>
								</div>
							</div>
						</>
					) }

					<div className="card-grid-block">
						<BlockContextProvider
							value={ {
								'ambrygen/galleryVariation': variation,
								'ambrygen/galleryGridColumns':
									effectiveGridColumns,
							} }
						>
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ DEFAULT_TEMPLATE }
								templateLock={ false }
								maxBlocks={ 3 }
							/>
						</BlockContextProvider>
					</div>
				</div>
			</div>
		</>
	);
}
