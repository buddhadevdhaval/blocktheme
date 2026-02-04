/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Default testimonial template
 * This template is used when the block is first inserted and no inner blocks exist.
 * @type {Array<Array>}
 */
const TEMPLATE = [
	[
		'ambrygen/testimonial-item',
		{
			quote: 'The Ambry Care Program has transformed how we manage patient care. Truly remarkable service!',
			author: 'Sarah Mitchell',
			role: 'CEO of TechSpark',
			logo: '/wp-content/themes/ambrygen/assets/src/images/testimonial/logo-1.png',
		},
	],
	[
		'ambrygen/testimonial-item',
		{
			quote: "Ambrygen's team made it so easy for our staff to streamline operations. Highly recommended!",
			author: 'James Parker',
			role: 'Operations Manager',
			logo: '/wp-content/themes/ambrygen/assets/src/images/testimonial/logo-2.png',
		},
	],
	[
		'ambrygen/testimonial-item',
		{
			quote: 'We saw immediate improvements in workflow and patient satisfaction thanks to Ambrygen.',
			author: 'Emily Chen',
			role: 'Head of Nursing',
			logo: '/wp-content/themes/ambrygen/assets/src/images/testimonial/logo-3.png',
		},
	],
	[
		'ambrygen/testimonial-item',
		{
			quote: 'The support and innovative solutions provided by Ambrygen have been invaluable.',
			author: 'Michael Lee',
			role: 'CTO of HealthBridge',
			logo: '/wp-content/themes/ambrygen/assets/src/images/testimonial/logo-4.png',
		},
	],
];

/**
 * Builds responsive srcSet string from sizes object.
 *
 * @param {Object} sizes Image sizes object with url and width properties
 * @return {string|undefined} srcSet string or undefined if no sizes provided
 */
function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}

	return Object.values( sizes )
		.filter( ( s ) => s?.url && s?.width )
		.map( ( s ) => `${ s.url } ${ s.width }w` )
		.join( ', ' );
}

/**
 * Default images used when block is first inserted
 * @type {string}
 */

const DEFAULT_MAIN =
	'/wp-content/themes/ambrygen/assets/src/images/testimonials-main.jpg';

/**
 * Edit component for the Testimonials block.
 *
 * @param {Object}   props               Block props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update block attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Block editor interface
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	// Destructure attributes for easier usage
	let {
		heading,
		headingTag,
		mainImage,
		mainImageSizes,
		secondaryImage,
		secondaryImageSizes,
		overlayImage,
		overlayImageSizes,
	} = attributes;

	useEffect( () => {
		if ( ! secondaryImage ) {
			setAttributes( {
				secondaryImage:
					'/wp-content/themes/ambrygen/assets/src/images/testimonial/secondary-image.png',
			} );
		}

		if ( ! overlayImage ) {
			setAttributes( {
				overlayImage:
					'/wp-content/themes/ambrygen/assets/src/images/testimonial/overlay-image.png',
			} );
		}

		if ( ! mainImage ) {
			setAttributes( { mainImage: DEFAULT_MAIN } );
		}
	}, [] );

	// Determine heading tag, default to H2
	const Tag = headingTag || 'h2';

	// Apply default images if not already set

	if ( ! mainImage ) {
		mainImage = DEFAULT_MAIN;
	}

	/**
	 * Check if inner blocks already exist to prevent re-inserting the template
	 * @type {boolean}
	 */
	const hasInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore )
				.getBlocks( clientId )
				.some(
					( block ) => block.name === 'ambrygen/testimonial-item'
				),
		[ clientId ]
	);

	return (
		<section
			{ ...useBlockProps( {
				className: 'ambry-testimonials',
			} ) }
		>
			{ /* Inspector Controls for sidebar settings */ }
			<InspectorControls>
				{ /* Heading settings panel */ }
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<SelectControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingTag }
						options={ [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].map(
							( tag ) => ( {
								label: tag.toUpperCase(),
								value: tag,
							} )
						) }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				{ /* Secondary Image Panel */ }
				<PanelBody title={ __( 'Secondary Image', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									secondaryImage: media?.url,
									secondaryImageSizes: media?.sizes || {},
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div className="image-panel-preview">
									{ secondaryImage && (
										<img src={ secondaryImage } alt="" />
									) }

									<Button
										onClick={ open }
										variant="secondary"
									>
										{ secondaryImage
											? __(
													'Replace Secondary Image',
													'ambrygen-web'
											  )
											: __(
													'Select Secondary Image',
													'ambrygen-web'
											  ) }
									</Button>

									{ secondaryImage && (
										<Button
											isDestructive
											onClick={ () =>
												setAttributes( {
													secondaryImage: '',
													secondaryImageSizes: {},
												} )
											}
										>
											{ __(
												'Remove Image',
												'ambrygen-web'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Overlay Image Panel */ }
				<PanelBody title={ __( 'Overlay Image', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									overlayImage: media?.url,
									overlayImageSizes: media?.sizes || {},
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div className="image-panel-preview">
									{ overlayImage && (
										<img src={ overlayImage } alt="" />
									) }

									<Button
										onClick={ open }
										variant="secondary"
									>
										{ overlayImage
											? __(
													'Replace Overlay Image',
													'ambrygen-web'
											  )
											: __(
													'Select Overlay Image',
													'ambrygen-web'
											  ) }
									</Button>

									{ overlayImage && (
										<Button
											isDestructive
											onClick={ () =>
												setAttributes( {
													overlayImage: '',
													overlayImageSizes: {},
												} )
											}
										>
											{ __(
												'Remove Image',
												'ambrygen-web'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Main image panel */ }
				<PanelBody title={ __( 'Main Image', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									mainImage: media?.url,
									mainImageSizes: media?.sizes || {},
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div className="image-panel-preview">
									{ mainImage && (
										<img src={ mainImage } alt="" />
									) }
									<Button
										onClick={ open }
										variant="secondary"
									>
										{ mainImage
											? __(
													'Replace Image',
													'ambrygen-web'
											  )
											: __(
													'Select Image',
													'ambrygen-web'
											  ) }
									</Button>
									{ mainImage && (
										<Button
											isDestructive
											onClick={ () =>
												setAttributes( {
													mainImage: '',
													mainImageSizes: {},
												} )
											}
										>
											{ __(
												'Remove Image',
												'ambrygen-web'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			{ /* Overlay Graphics - matching save.js */ }
			<div className="ambry-testimonials__graphic-images">
				{ overlayImage && (
					<div className="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
						<img
							src={ overlayImage }
							srcSet={ buildSrcSet( overlayImageSizes ) }
							alt=""
							className="overlay__img"
						/>
					</div>
				) }

				{ /* Secondary Image */ }
				{ secondaryImage && (
					<div className="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
						<img
							src={ secondaryImage }
							srcSet={ buildSrcSet( secondaryImageSizes ) }
							className="overlay__img"
							alt=""
						/>
					</div>
				) }
			</div>

			{ /* Heading displayed in editor */ }
			<RichText
				tagName={ Tag }
				value={ heading }
				onChange={ ( value ) => setAttributes( { heading: value } ) }
				className="ambry-testimonials__heading"
			/>

			{ /* Main layout with image and testimonial items */ }
			<div className="ambry-testimonials__layout">
				<div className="ambry-testimonials__grid">
					<div className="ambry-testimonials__top-inner__image-block">
						{ mainImage && (
							<img
								src={ mainImage }
								srcSet={ buildSrcSet( mainImageSizes ) }
								className="ambry-testimonials__main-image"
								alt=""
							/>
						) }
					</div>

					<InnerBlocks
						template={ ! hasInnerBlocks ? TEMPLATE : undefined }
						allowedBlocks={ [ 'ambrygen/testimonial-item' ] }
					/>
				</div>
			</div>
		</section>
	);
}
