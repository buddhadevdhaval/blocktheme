import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

function buildSrcSet( sizes ) {
	if ( ! sizes ) {
		return undefined;
	}

	return Object.values( sizes )
		.filter( ( s ) => s?.url && s?.width )
		.map( ( s ) => `${ s.url } ${ s.width }w` )
		.join( ', ' );
}

export default function Edit( { attributes, setAttributes } ) {
	const { logo, logoSizes, quote, author, role } = attributes;

	return (
		<div
			{ ...useBlockProps( {
				className: 'ambry-testimonials__grid__item',
			} ) }
		>
			<InspectorControls>
				<PanelBody title={ __( 'Logo Image', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									logo: media?.url,
									logoSizes: media?.sizes || {},
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div className="image-panel-preview">
									{ logo && <img src={ logo } alt="" /> }

									<Button
										onClick={ open }
										variant="secondary"
									>
										{ logo
											? __(
													'Replace Image',
													'ambrygen-web'
											  )
											: __(
													'Select Logo',
													'ambrygen-web'
											  ) }
									</Button>

									{ logo && (
										<Button
											isDestructive
											onClick={ () =>
												setAttributes( {
													logo: '',
													logoSizes: {},
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

			{ logo && (
				<img
					src={ logo }
					srcSet={ buildSrcSet( logoSizes ) }
					loading="lazy"
					className="ambry-testimonials__grid__logo"
					alt=""
				/>
			) }

			<RichText
				tagName="p"
				value={ quote }
				onChange={ ( value ) => setAttributes( { quote: value } ) }
				className="ambry-testimonials__grid__item__quote body2"
			/>

			<div className="ambry-testimonials__layout__author-details">
				<RichText
					tagName="strong"
					value={ author }
					onChange={ ( value ) => setAttributes( { author: value } ) }
					className="ambry-testimonials__layout__author-details__author body2-medium"
				/>

				<RichText
					tagName="span"
					value={ role }
					onChange={ ( value ) => setAttributes( { role: value } ) }
					className="ambry-testimonials__layout__author-details__role body2-medium"
				/>
			</div>
		</div>
	);
}
