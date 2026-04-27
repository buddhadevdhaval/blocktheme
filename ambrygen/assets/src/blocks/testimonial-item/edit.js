import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import { ImageUploader } from '../_shared/components';

export default function Edit( { attributes, setAttributes, context } ) {
	const { logo, logoAlt, quote, author, role } = attributes;
	const mainImage = context?.[ 'ambrygen/mainImage' ];
	const mainImageAlt = context?.[ 'ambrygen/mainImageAlt' ];
	const blockProps = useBlockProps( {
		className: 'ambry-testimonials__grid__item',
	} );
	const updateLogo = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		   setAttributes( {
			   logoId: media.id ?? undefined,
			   logo: media.url,
			   logoAlt: media.alt || '',
		   } );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<ImageUploader
					label={ __( 'ICON', 'ambrygen-web' ) }
					url={ logo }
					onSelect={ updateLogo }
					onRemove={ () =>
						setAttributes( {
							logoId: undefined,
							logo: '',
							logoAlt: '',
						} )
					}
				/>
			</InspectorControls>

			{ mainImage && (
				<div
					className="ambry-testimonials__grid__item__thumb"
					aria-hidden="true"
				>
					<img
						src={ mainImage }
						alt={ mainImageAlt || '' }
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
