import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/gallery-item' ];

const DEFAULT_TEMPLATE = [
	[
		'ambrygen/gallery-item',
		{
			title: 'Providers',
			description: 'Learn more about how we work with our providers',
			link: '#',
		},
	],
	[
		'ambrygen/gallery-item',
		{
			title: 'Patients',
			description: 'Learn more about our offerings to patients',
			link: '#',
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId } = attributes;

	useEffect( () => {
		const expectedId = `sticky-tabs-${ clientId.slice( 0, 8 ) }`;

		if ( blockId !== expectedId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId ] );

	const {
		variation = 'two-column',
		heading,
		description,
		headingTag = 'h2',
		topImageID = 0,
		topImageURL,
	} = attributes;

	const VARIANTS = [
		{
			label: 'Default',
			value: 'two-column',
			image: getThemeAssetUrl(
				'/assets/src/images/image-gallery/default.png'
			),
		},
		{
			label: 'Image + Content + Grid',
			value: 'image-content-grid',
			image: getThemeAssetUrl(
				'/assets/src/images/image-gallery/image-content-grid.png'
			),
		},
		{
			label: 'Variation features',
			value: 'variation-features',
			image: getThemeAssetUrl(
				'/assets/src/images/image-gallery/image-content-grid.png'
			),
		},
	];

	let amb_class = '';
	if ( variation === 'image-content-grid' ) {
		amb_class = 'variation-style-two';
	}

	const blockProps = useBlockProps( {
		className: `image-grid-block variation-features variation-${ variation } ${ amb_class }`,
	} );

	const HeadingTag = headingTag || 'h2';
	useEffect( () => {
		if ( ! attributes.variation ) {
			setAttributes( { variation: 'two-column' } );
		}
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Gallery Settings', 'ambrygen-web' ) }>
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
					/>
				</PanelBody>

				{ variation === 'image-content-grid' && (
					<PanelBody title={ __( 'Top Image', 'ambrygen-web' ) }>
						<MediaUploadCheck>
							{ topImageID && (
								<div className="gallery-intro__image">
									<img src={ topImageURL } alt="" />
								</div>
							) }
							<MediaUpload
								onSelect={ ( media ) =>
									setAttributes( {
										topImageID: media.id,
										topImageURL: media.url,
									} )
								}
								allowedTypes={ [ 'image' ] }
								value={ topImageID }
								render={ ( { open } ) => (
									<Button onClick={ open } variant="primary">
										{ topImageID
											? 'Replace Image'
											: 'Select Image' }
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
									} )
								}
							>
								Remove Image
							</Button>
						) }
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				<div className="get-started-ambry-block">
					{ /* New Variant */ }
					{ variation === 'image-content-grid' && (
						<div className="our-approach__header logo-title-section">
							<div className="logo-title-section__icon">
								{ topImageID && (
									<img
										src={ topImageURL }
										alt=""
										className="logo-title-section__logo"
									/>
								) }
							</div>
							<div
								className="is-style-gl-s50"
								aria-hidden="true"
							></div>
							<div className="logo-title-section__content">
								<HeadingTag className="heading-2 block-title mb-0">
									<RichText
										value={ heading }
										onChange={ ( value ) =>
											setAttributes( { heading: value } )
										}
										placeholder="Add title…"
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
										placeholder="Add description…"
									/>
								</div>
							</div>
						</div>
					) }

					{ /* Old Variant */ }
					{ variation === 'two-column' && (
						<HeadingTag className="block-title heading-3 mb-0">
							<RichText
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Add title…"
							/>
						</HeadingTag>
					) }

					{ variation === 'variation-features' && (
						<>
							<div className="our-approach__header block__rowflex">
								<HeadingTag className="block-title heading-3 mb-0 block__rowflex--heading-title">
									<RichText
										value={ heading }
										onChange={ ( value ) =>
											setAttributes( { heading: value } )
										}
										placeholder="Add title…"
									/>
								</HeadingTag>
								<div className="block__rowflex--block-content subtitle1-reg">
									<RichText
										value={ description }
										onChange={ ( value ) =>
											setAttributes( {
												description: value,
											} )
										}
										placeholder="Add description…"
									/>
								</div>
							</div>
						</>
					) }

					<div className="card-grid-block">
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ DEFAULT_TEMPLATE }
							templateLock={ false }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
