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

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, imageUrl, imagePosition } = attributes;
	const blockProps = useBlockProps( {
		className: `left-right-block ${ imagePosition }`,
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'mytheme' ) }>
					<SelectControl
						label={ __( 'Heading Tag', 'mytheme' ) }
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
						label={ __( 'Show Image on Right', 'mytheme' ) }
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
					{ imagePosition === 'left' && imageUrl && (
						<div className="image-wrapper">
							<img src={ imageUrl } alt="" />
						</div>
					) }

					<div className="text-wrapper">
						<RichText
							tagName={ headingTag }
							value={ heading }
							placeholder={ __( 'Heading…', 'mytheme' ) }
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
							templateLock={ false }
						/>
					</div>

					{ imagePosition === 'right' && imageUrl && (
						<div className="image-wrapper">
							<img src={ imageUrl } alt="" />
						</div>
					) }

					{ ! imageUrl && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) =>
									setAttributes( { imageUrl: media.url } )
								}
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button onClick={ open } isSecondary>
										{ __( 'Select Image', 'mytheme' ) }
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
