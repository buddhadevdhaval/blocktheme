import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls, // <-- required!
} from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		highlight,
		headingLevel,
		content,
		imageUrl,
		imageAlt,
		shapeUrl,
	} = attributes;

	const HeadingTag = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes(
		headingLevel
	)
		? headingLevel
		: 'h2';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<SelectControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Banner Image', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageUrl: media.url,
									imageAlt: media.alt,
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageUrl
										? __( 'Change Image', 'ambrygen-web' )
										: __( 'Select Image', 'ambrygen-web' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...useBlockProps( {
					className: 'hero hero--alongside container-1340',
				} ) }
			>
				<div className="wrapper">
					<div className="hero__row">
						<div className="hero__content">
							<HeadingTag className="hero__title heading-2 mb-0">
								<RichText
									tagName="span"
									value={ heading }
									onChange={ ( val ) =>
										setAttributes( { heading: val } )
									}
									placeholder={ __(
										'Heading',
										'ambrygen-web'
									) }
								/>{ ' ' }
								<RichText
									tagName="span"
									value={ highlight }
									onChange={ ( val ) =>
										setAttributes( { highlight: val } )
									}
									placeholder={ __(
										'Highlight',
										'ambrygen-web'
									) }
								/>
							</HeadingTag>

							<div className="is-style-gl-s24"></div>
							<div className="hero__text subtitle1">
								<RichText
									tagName="p"
									value={ content }
									onChange={ ( val ) =>
										setAttributes( { content: val } )
									}
									placeholder={ __(
										'Banner text',
										'ambrygen-web'
									) }
								/>
							</div>
						</div>

						<div className="hero__media">
							<div className="hero__image">
								{ imageUrl && (
									<img
										src={ imageUrl }
										alt={ imageAlt }
										loading="lazy"
									/>
								) }
								{ shapeUrl && (
									<div className="hero__shape">
										<img
											src={ shapeUrl }
											alt=""
											aria-hidden="true"
										/>
									</div>
								) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
