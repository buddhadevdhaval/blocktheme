import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

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
	const { heading, headingTag, imageUrl, imageAlt, imagePosition } =
		attributes;

	const blockProps = useBlockProps( {
		className: `left-right-block ${ imagePosition }`,
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
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
			</InspectorControls>

			<div { ...blockProps }>
				<div className="content-wrapper">
					{ /* Left image */ }
					{ imagePosition === 'left' && imageUrl && (
						<div className="image-wrapper">
							<img
								src={ imageUrl }
								alt={ imageAlt || heading || undefined }
							/>
						</div>
					) }

					{ /* Text content */ }
					<div className="text-wrapper">
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
							/>
						</div>
					) }

					{ /* Image selector */ }
					{ ! imageUrl && (
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
										{ __( 'Select Image', 'ambrygen-web' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					) }
				</div>
			</div>
		</Fragment>
	);
}
