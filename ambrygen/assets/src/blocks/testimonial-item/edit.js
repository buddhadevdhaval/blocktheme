import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import { ImageUploader } from '../_shared/components';

export default function Edit( { attributes, setAttributes, context } ) {
	const { logo, quote, author, role } = attributes;
	const mainImage = context?.[ 'ambrygen/mainImage' ];

	return (
		<div
			{ ...useBlockProps( {
				className: 'ambry-testimonials__grid__item',
			} ) }
		>
			<InspectorControls>
				<ImageUploader
					label={ __( 'ICON', 'ambrygen-web' ) }
					url={ logo }
					onSelect={ ( media ) =>
						setAttributes( {
							logoId: media?.id,
							logo: media?.url,
						} )
					}
					onRemove={ () =>
						setAttributes( {
							logoId: undefined,
							logo: '',
						} )
					}
				/>
			</InspectorControls>

			<div
				className="ambry-testimonials__grid__item__thumb"
				aria-hidden="true"
			>
				{ mainImage && <img src={ mainImage } alt="" loading="lazy" /> }
			</div>

			<div className="ambry-testimonials__grid__item__content">
				{ logo && (
					<img
						src={ logo }
						loading="lazy"
						alt={ __( 'Icon', 'ambrygen-web' ) }
						className="ambry-testimonials__grid__logo"
					/>
				) }

				<div className="is-style-gl-s32"></div>

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
