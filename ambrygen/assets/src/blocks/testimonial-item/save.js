import { useBlockProps, RichText } from '@wordpress/block-editor';

function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}

	return Object.values( sizes )
		.filter( ( s ) => s?.url && s?.width )
		.map( ( s ) => `${ s.url } ${ s.width }w` )
		.join( ', ' );
}

export default function Save( { attributes } ) {
	const { logo, logoSizes, logoAlt = '', quote, author, role } = attributes;

	return (
		<div { ...useBlockProps.save( { className: 'ambry-testimonial' } ) }>
			{ logo && (
				<img
					src={ logo }
					srcSet={ buildSrcSet( logoSizes ) }
					sizes="(max-width: 600px) 100vw, 300px" // Adjust for your layout
					loading="lazy"
					className="ambry-testimonial__logo"
					alt={ logoAlt || 'Company logo' } // SEO & ADA compliant
				/>
			) }

			<RichText.Content
				tagName="p"
				value={ quote }
				className="ambry-testimonial__quote"
			/>

			<RichText.Content
				tagName="strong"
				value={ author }
				className="ambry-testimonial__author"
			/>

			<RichText.Content
				tagName="span"
				value={ role }
				className="ambry-testimonial__role"
			/>
		</div>
	);
}
