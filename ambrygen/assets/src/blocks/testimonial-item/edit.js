import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { ImageUploader } from '../_shared/components';
import { t } from '../_shared/utils';

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
				<PanelBody title={ t( 'Logo Image' ) }>
					<ImageUploader
						label={ t( 'Logo' ) }
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
				</PanelBody>
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
						alt="Company logo"
						className="ambry-testimonials__grid__logo"
					/>
				) }

				<div className="is-style-gl-s32"></div>

				<RichText
					tagName="blockquote"
					value={ quote }
					onChange={ ( value ) => setAttributes( { quote: value } ) }
					className="ambry-testimonials__grid__item__quote body2-reg"
				/>

				<cite className="ambry-testimonials__layout__author-details">
					<RichText
						tagName="div"
						value={ author }
						onChange={ ( value ) =>
							setAttributes( { author: value } )
						}
						className="ambry-testimonials__layout__author-details__author body2-medium"
					/>

					<RichText
						tagName="div"
						value={ role }
						onChange={ ( value ) =>
							setAttributes( { role: value } )
						}
						className="ambry-testimonials__layout__author-details__role body2-medium"
					/>
				</cite>
			</div>
		</div>
	);
}
