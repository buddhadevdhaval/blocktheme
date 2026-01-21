import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	Button,
	Placeholder,
	SelectControl,
	ToggleControl,
	RadioControl,
} from '@wordpress/components';

/**
 * Default InnerBlocks template
 */
const INNER_BLOCKS_TEMPLATE = [
	[
		'core/paragraph',
		{
			content: __(
				'Add your content here. This text can be changed.',
				'ambrygen-web'
			),
		},
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		headingTag,
		imageUrl,
		imageAlt,
		imagePosition,
		layoutStyle,
		imageSize,
		contentAlignment,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `flexible-content ${ layoutStyle } ${ imagePosition } ${ imageSize }`,
		style: {
			'--content-alignment': contentAlignment,
		},
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Content Settings', 'ambrygen-web' ) }>
					<SelectControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
							{ label: 'DIV', value: 'div' },
							{ label: 'SPAN', value: 'span' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>

					<SelectControl
						label={ __( 'Content Alignment', 'ambrygen-web' ) }
						value={ contentAlignment }
						options={ [
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' },
						] }
						onChange={ ( value ) =>
							setAttributes( { contentAlignment: value } )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout Settings', 'ambrygen-web' ) }>
					<RadioControl
						label={ __( 'Layout Style', 'ambrygen-web' ) }
						selected={ layoutStyle }
						options={ [
							{ label: 'Standard', value: 'standard' },
							{ label: 'Overlap', value: 'overlap' },
							{ label: 'Stacked', value: 'stacked' },
						] }
						onChange={ ( value ) =>
							setAttributes( { layoutStyle: value } )
						}
					/>

					<SelectControl
						label={ __( 'Image Size', 'ambrygen-web' ) }
						value={ imageSize }
						options={ [
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'Full Width', value: 'full' },
						] }
						onChange={ ( value ) =>
							setAttributes( { imageSize: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Show Image on Right', 'ambrygen-web' ) }
						checked={ imagePosition === 'right' }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value ? 'right' : 'left',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Image', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<PanelRow>
						{ ! imageUrl ? (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											imageUrl: media.url,
											imageId: media.id,
											imageAlt: media.alt || '',
										} )
									}
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="primary"
										>
											{ __(
												'Upload Image',
												'ambrygen-web'
											) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						) : (
							<div className="image-preview">
								<img
									src={ imageUrl }
									alt={ imageAlt || heading || undefined }
									style={ {
										maxWidth: '100px',
										height: 'auto',
										marginBottom: '10px',
									} }
								/>
								<div className="image-info">
									<p className="image-size">
										{ __(
											'Image uploaded',
											'ambrygen-web'
										) }
									</p>
									{ imageAlt && (
										<p className="image-alt">
											{ __(
												'Alt text:',
												'ambrygen-web'
											) }{ ' ' }
											{ imageAlt }
										</p>
									) }
								</div>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											setAttributes( {
												imageUrl: media.url,
												imageId: media.id,
												imageAlt: media.alt || '',
											} )
										}
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<Button
												onClick={ open }
												variant="secondary"
											>
												{ __(
													'Replace Image',
													'ambrygen-web'
												) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								<Button
									onClick={ () =>
										setAttributes( {
											imageUrl: '',
											imageId: 0,
											imageAlt: '',
										} )
									}
									variant="link"
									isDestructive
								>
									{ __( 'Remove Image', 'ambrygen-web' ) }
								</Button>
							</div>
						) }
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="content-wrapper">
					{ /* Left image */ }
					{ imagePosition === 'left' && imageUrl && (
						<div className="image-wrapper">
							<img
								src={ imageUrl }
								alt={ imageAlt || heading || undefined }
								style={ { maxWidth: '100%', height: 'auto' } }
							/>
						</div>
					) }

					{ /* Text content */ }
					<div
						className="text-wrapper"
						style={ { textAlign: contentAlignment } }
					>
						<RichText
							tagName={ headingTag }
							value={ heading }
							placeholder={ __( 'Heading…', 'ambrygen-web' ) }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
						/>

						<InnerBlocks
							allowedBlocks={ [
								'core/paragraph',
								'core/heading',
								'core/list',
								'core/image',
							] }
							template={ INNER_BLOCKS_TEMPLATE }
							templateLock={ false }
						/>
					</div>

					{ /* Right image */ }
					{ imagePosition === 'right' && imageUrl && (
						<div className="image-wrapper">
							<img
								src={ imageUrl }
								alt={ imageAlt || heading || undefined }
								style={ { maxWidth: '100%', height: 'auto' } }
							/>
						</div>
					) }

					{ /* Image placeholder */ }
					{ ! imageUrl && (
						<Placeholder
							icon="format-image"
							label={ __( 'No image selected', 'ambrygen-web' ) }
							instructions={ __(
								'Upload an image from the sidebar settings.',
								'ambrygen-web'
							) }
						/>
					) }
				</div>
			</div>
		</Fragment>
	);
}
