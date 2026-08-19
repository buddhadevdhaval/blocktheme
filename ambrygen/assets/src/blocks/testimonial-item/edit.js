import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import { DEFAULT_IMAGES, ImageUploader } from '../_shared/components';

export default function Edit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const fallbackImage = defaults?.placeholder || {};
	const { logo, logoAlt, quote, author, role } = attributes;
	const mainImage = context?.[ 'ambrygen/mainImage' ];
	const mainImageAlt = context?.[ 'ambrygen/mainImageAlt' ];
	const displayMainImage = mainImage || fallbackImage.url || '';
	const displayMainImageAlt = mainImage
		? mainImageAlt || ''
		: fallbackImage.alt || '';
	const { parentClientId, blockIndex } = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const rootClientId = blockEditor.getBlockRootClientId( clientId );

			return {
				parentClientId: rootClientId,
				blockIndex: blockEditor.getBlockIndex( clientId, rootClientId ),
			};
		},
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const blockProps = useBlockProps( {
		className: 'ambry-testimonials__grid__item',
	} );
	const isFirstItem = blockIndex === 0;

	const updateLogo = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		setAttributes( {
			logoId: media.id || 0,
			logo: media.url || '',
			logoAlt: media.alt || '',
		} );
	};

	const updateMainImage = ( media ) => {
		if ( ! media?.url || ! parentClientId ) {
			return;
		}

		updateBlockAttributes( parentClientId, {
			mainImage: media.url,
			mainImageId: media.id || 0,
			mainImageAlt: media.alt || '',
		} );
	};

	const removeMainImage = () => {
		if ( ! parentClientId ) {
			return;
		}

		updateBlockAttributes( parentClientId, {
			mainImage: '',
			mainImageId: 0,
			mainImageAlt: '',
		} );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				{ isFirstItem && (
					<PanelBody
						title={ __( 'Image Settings', 'ambrygen-web' ) }
						initialOpen={ true }
					>
						<ImageUploader
							label={ __( 'Image', 'ambrygen-web' ) }
							url={ mainImage }
							onSelect={ updateMainImage }
							onRemove={ removeMainImage }
						/>
					</PanelBody>
				) }
				<PanelBody
					title={ __( 'Logo Settings', 'ambrygen-web' ) }
					initialOpen={ ! isFirstItem }
				>
					<ImageUploader
						label={ __( 'Logo', 'ambrygen-web' ) }
						url={ logo }
						onSelect={ updateLogo }
						onRemove={ () =>
							setAttributes( {
								logoId: 0,
								logo: '',
								logoAlt: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ displayMainImage && (
				<div
					className="ambry-testimonials__grid__item__thumb"
					aria-hidden="true"
				>
					<img
						src={ displayMainImage }
						alt={ displayMainImageAlt }
						loading="lazy"
					/>
				</div>
			) }

			<div className="ambry-testimonials__grid__item__content">
				{ logo && (
					<>
						<img
							src={ logo }
							loading="lazy"
							alt={ logoAlt || '' }
							className="ambry-testimonials__grid__logo"
						/>
						<div
							className="is-style-gl-s32"
							aria-hidden="true"
						></div>
					</>
				) }

				<RichText
					tagName="blockquote"
					value={ quote }
					onChange={ ( value ) => setAttributes( { quote: value } ) }
					placeholder={ __( 'Add Description…', 'ambrygen-web' ) }
					className="ambry-testimonials__grid__item__quote body2-reg"
				/>

				<cite className="ambry-testimonials__layout__author-details">
					<RichText
						tagName="div"
						value={ author }
						onChange={ ( value ) =>
							setAttributes( { author: value } )
						}
						placeholder={ __( 'Add Author name…', 'ambrygen-web' ) }
						className="ambry-testimonials__layout__author-details__author body2-medium"
					/>

					<RichText
						tagName="div"
						value={ role }
						onChange={ ( value ) =>
							setAttributes( { role: value } )
						}
						placeholder={ __( 'Add Designation…', 'ambrygen-web' ) }
						className="ambry-testimonials__layout__author-details__role body2-medium"
					/>
				</cite>
			</div>
		</div>
	);
}
