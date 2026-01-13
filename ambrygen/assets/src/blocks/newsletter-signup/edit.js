/**
 * WordPress i18n for translations.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/)
 */
import { __ } from '@wordpress/i18n';

/**
 * Block editor components for media upload and rich text editing.
 * useBlockProps: Marks block wrapper with necessary props.
 * RichText: Rich text content editing.
 * MediaUpload/MediaUploadCheck: Image upload functionality.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 */
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * WordPress UI components for media upload button.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/components/button/](https://developer.wordpress.org/block-editor/reference-guides/components/button/)
 */
import { Button } from '@wordpress/components';

/**
 * Editor styles for newsletter signup block.
 *
 * @see [https://www.npmjs.com/package/@wordpress/scripts#using-css](https://www.npmjs.com/package/@wordpress/scripts#using-css)
 */
import './editor.scss';

/**
 * Edit component for Newsletter Signup block.
 * Provides image upload and heading editor with form placeholder.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit)
 *
 * @param {Object}   root0               Block properties
 * @param {Object}   root0.attributes    Block attributes (heading, image, backgroundColor, style)
 * @param {Function} root0.setAttributes Function to update block attributes
 * @return {JSX.Element}                  Editor interface element
 */
export default function Edit( { attributes, setAttributes } ) {
	const { heading, image, imageAlt, backgroundColor, style } = attributes;

	/**
	 * Block props with dynamic background color and padding.
	 */
	const blockProps = useBlockProps( {
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			padding: '60px 20px',
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="newsletter-signup">
				{ /* Image upload */ }
				<div className="newsletter-image">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( {
									image: img.url,
									imageId: img.id,
									imageAlt: img.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="secondary"
									className="upload-button"
								>
									{ image
										? __( 'Change Image', 'ambrygen-web' )
										: __( 'Upload Image', 'ambrygen-web' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ image && (
						<img
							src={ image }
							alt={
								imageAlt || __( 'Newsletter', 'ambrygen-web' )
							}
							style={ {
								maxWidth: '100%',
								height: 'auto',
								borderRadius: '12px',
							} }
						/>
					) }
				</div>

				{ /* Content section */ }
				<div className="newsletter-form-section">
					<RichText
						tagName="h3"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Stay Informed', 'ambrygen-web' ) }
						className="newsletter-heading"
					/>

					<div className="form-placeholder">
						<div className="placeholder-content">
							<p>
								📝{ ' ' }
								<strong>
									{ __( 'Add Form Here', 'ambrygen-web' ) }
								</strong>
							</p>
							<p className="placeholder-instructions">
								{ __(
									'Insert Gravity Forms block below',
									'ambrygen-web'
								) }
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
