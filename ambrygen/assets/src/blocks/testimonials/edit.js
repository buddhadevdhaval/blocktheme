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
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import {
	TagSelector,
	ImageUploader,
	BlockExamplePreview,
} from '../_shared/components';

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
	const ITEM_BLOCK_NAME = 'ambrygen/testimonial-item';

	// Destructure attributes for easier usage
	const {
		blockId,
		heading,
		headingTag,
		mainImage,
		mainImageAlt,
		secondaryImage,
		secondaryImageAlt,
		overlayImage,
		overlayImageAlt,
	} = attributes;

	const TEMPLATE = useMemo(
		() => [
			[
				'ambrygen/testimonial-item',
				{
					quote: '',
					author: '',
					role: '',
				},
			],
			[
				'ambrygen/testimonial-item',
				{
					quote: '',
					author: '',
					role: '',
				},
			],
			[
				'ambrygen/testimonial-item',
				{
					quote: '',
					author: '',
					role: '',
				},
			],
			[
				'ambrygen/testimonial-item',
				{
					quote: '',
					author: '',
					role: '',
				},
			],
		],
		[]
	);

	useEffect( () => {
		const expectedId = `testimonials-${ clientId }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	// Determine heading tag, default to H2
	const Tag = headingTag || 'h2';

	/**
	 * Check if inner blocks already exist to prevent re-inserting the template
	 * @type {boolean}
	 */
	const hasInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore )
				.getBlocks( clientId )
				.some( ( block ) => block.name === ITEM_BLOCK_NAME ),
		[ clientId ]
	);
	const blockProps = useBlockProps( {
		className: 'ambry-testimonials',
		id: blockId || undefined,
	} );

	const updateImage = ( media, fieldPrefix ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			[ fieldPrefix ]: media.url,
			[ `${ fieldPrefix }Id` ]: media.id || 0,
			[ `${ fieldPrefix }Alt` ]: media.alt || '',
		} );
	};

	if ( blockId === 'testimonials-example' ) {
		return (
			<BlockExamplePreview
				className="testimonials-example-preview"
				imagePath="/assets/src/images/testimonial/preview.png"
			/>
		);
	}

	return (
		<section { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						type="heading"
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Image Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						url={ overlayImage }
						label={ __( 'Top Left Overlay Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							updateImage( media, 'overlayImage' )
						}
						onRemove={ () =>
							setAttributes( {
								overlayImage: '',
								overlayImageId: 0,
								overlayImageAlt: '',
							} )
						}
					/>
					<ImageUploader
						url={ secondaryImage }
						label={ __( 'Bottom Right Overlay Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							updateImage( media, 'secondaryImage' )
						}
						onRemove={ () =>
							setAttributes( {
								secondaryImage: '',
								secondaryImageId: 0,
								secondaryImageAlt: '',
							} )
						}
					/>
					<ImageUploader
						url={ mainImage }
						label={ __( 'Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							updateImage( media, 'mainImage' )
						}
						onRemove={ () =>
							setAttributes( {
								mainImage: '',
								mainImageId: 0,
								mainImageAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="ambry-testimonials__graphic-images">
				   { overlayImage && (
					   <div className="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
						   <img
							   src={ overlayImage }
							   className="overlay__img"
							   alt={ overlayImageAlt || '' }
						   />
					   </div>
				   ) }

				   { secondaryImage && (
					   <div className="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
						   <img
							   src={ secondaryImage }
							   className="overlay__img"
							   alt={ secondaryImageAlt || '' }
						   />
					   </div>
				   ) }
			</div>

			<RichText
				tagName={ Tag }
				value={ heading }
				onChange={ ( value ) => setAttributes( { heading: value } ) }
				placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
				className="ambry-testimonials__heading"
			/>

			<div className="ambry-testimonials__layout">
				<div className="ambry-testimonials__grid">
					<InnerBlocks
						template={ ! hasInnerBlocks ? TEMPLATE : undefined }
						allowedBlocks={ [ ITEM_BLOCK_NAME ] }
						renderAppender={ false }
					/>
				</div>
			</div>
		</section>
	);
}
