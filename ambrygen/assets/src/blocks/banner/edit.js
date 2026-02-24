import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingLevel,
		content,
		imageUrl,
		imageAlt,
		shapeUrl,
		eyebrow,
		breadcrumb,
		buttonText,
		buttonUrl,
	} = attributes;

	const HeadingTag = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes(
		headingLevel
	)
		? headingLevel
		: 'h2';

	return (
		<>
			{ /* ================= Inspector ================= */ }
			<InspectorControls>
				{ /* Heading */ }
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

				{ /* Content */ }
				<PanelBody title={ __( 'Content Options', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Eyebrow / Kicker', 'ambrygen-web' ) }
						value={ eyebrow }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
						placeholder="COMPANY"
					/>

					<TextControl
						label={ __( 'Breadcrumb', 'ambrygen-web' ) }
						value={ breadcrumb }
						onChange={ ( value ) =>
							setAttributes( { breadcrumb: value } )
						}
						placeholder="Home / Company / Our People"
					/>
				</PanelBody>

				{ /* Banner Image */ }
				<PanelBody title={ __( 'Banner Image', 'ambrygen-web' ) }>
					{ imageUrl && (
						<img
							src={ imageUrl }
							alt=""
							style={ { width: '100%', marginBottom: '10px' } }
						/>
					) }

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

					{ imageUrl && (
						<Button
							isDestructive
							variant="link"
							onClick={ () =>
								setAttributes( {
									imageUrl: '',
									imageAlt: '',
								} )
							}
						>
							{ __( 'Remove Image', 'ambrygen-web' ) }
						</Button>
					) }
				</PanelBody>

				{ /* Shape Image */ }
				<PanelBody title={ __( 'Shape Image', 'ambrygen-web' ) }>
					{ shapeUrl && (
						<img
							src={ shapeUrl }
							alt=""
							style={ { width: '100%', marginBottom: '10px' } }
						/>
					) }

					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( { shapeUrl: media.url } )
							}
							allowedTypes={ [ 'image', 'svg' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ shapeUrl
										? __( 'Change Shape', 'ambrygen-web' )
										: __( 'Select Shape', 'ambrygen-web' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					{ shapeUrl && (
						<Button
							isDestructive
							variant="link"
							onClick={ () => setAttributes( { shapeUrl: '' } ) }
						>
							{ __( 'Remove Shape', 'ambrygen-web' ) }
						</Button>
					) }
				</PanelBody>

				{ /* CTA */ }
				<PanelBody title={ __( 'CTA Button', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'Button Text', 'ambrygen-web' ) }
						value={ buttonText }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						placeholder="Careers"
					/>

					<URLInput
						label={ __( 'Button URL', 'ambrygen-web' ) }
						value={ buttonUrl }
						onChange={ ( url ) =>
							setAttributes( { buttonUrl: url } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* ================= Block Markup ================= */ }
			<div
				{ ...useBlockProps( {
					className: 'hero hero--alongside container-1340',
				} ) }
			>
				<div className="wrapper">
					<div className="hero__row">
						<div className="hero__content">
							{ breadcrumb && (
								<div className="hero__breadcrumb">
									{ breadcrumb }
								</div>
							) }

							{ eyebrow && (
								<div className="hero__eyebrow hero-kicker">
									{ eyebrow }
								</div>
							) }

							<div className="is-style-gl-s24"></div>

							<HeadingTag className="hero__title heading-2 mb-0">
								<RichText
									tagName="span"
									value={ heading }
									onChange={ ( val ) =>
										setAttributes( { heading: val } )
									}
									allowedFormats={ [
										'core/bold',
										'core/italic',
										'core/text-color',
									] }
									placeholder={ __(
										'Heading',
										'ambrygen-web'
									) }
								/>{ ' ' }
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

							{ buttonText && buttonUrl && (
								<>
									<div className="is-style-gl-s24"></div>
									<div className="hero__actions">
										<a
											href={ buttonUrl }
											className="site-btn is-style-site-tertiary-btn is-style-site-trailing-icon"
										>
											{ buttonText }
										</a>
									</div>
								</>
							) }
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
