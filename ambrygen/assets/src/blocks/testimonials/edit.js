/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { TagSelector, ImageUploader } from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

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
			logo: getThemeAssetUrl('/assets/src/images/testimonial/logo-1.png'),
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
		secondaryImage,
		overlayImage,
		mainImageId,
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
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				{ /* Secondary Image Panel */ }

				{ /* Overlay Image Panel */ }
				<PanelBody title={ __( 'Top Overlay Image', 'ambrygen-web' ) }>
					<ImageUploader
						url={ overlayImage }
						label={ __( 'Top Overlay Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								overlayImage: media?.url,
								overlayImageId: media?.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								overlayImage: '',
								overlayImageId: null,
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Bottom Overlay Image', 'ambrygen-web' ) }
				>
					<ImageUploader
						url={ secondaryImage }
						label={ __( 'Bottom Overlay Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								secondaryImage: media?.url,
								secondaryImageId: media?.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								secondaryImage: '',
								secondaryImageId: null,
							} )
						}
					/>
				</PanelBody>

				{ /* Main Image Panel */ }
				<PanelBody title={ __( 'Main Image', 'ambrygen-web' ) }>
					<ImageUploader
						url={ mainImage }
						label={ __( 'Main Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								mainImage: media?.url,
								mainImageId: media?.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								mainImage: null,
								mainImageId: null,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Overlay Graphics - matching save.js */ }
			<div className="ambry-testimonials__graphic-images">
				{ overlayImage && (
					<div className="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
						{ overlayImage && (
							<img
								src={ overlayImage }
								className="overlay__img"
							/>
						) }
					</div>
				) }

				{ /* Secondary Image */ }
				{ secondaryImage && (
					<div className="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
						{ secondaryImage && (
							<img
								src={ secondaryImage }
								className="overlay__img"
							/>
						) }
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
					{ /* <div className="ambry-testimonials__top-inner__image-block">
						{ mainImage && (
								<img
									src={ mainImage }
									alt=""
									className="ambry-testimonials__main-image"
								/>
							) }
					</div> */ }

					<InnerBlocks
						template={ ! hasInnerBlocks ? TEMPLATE : undefined }
						allowedBlocks={ [ 'ambrygen/testimonial-item' ] }
					/>
				</div>
			</div>
		</section>
	);
}
