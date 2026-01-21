/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hooks for performance optimization.
 *
 * @see https://react.dev/reference/react
 */
import { useCallback } from '@wordpress/element';

/**
 * Higher-order components to compose components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	useBlockProps,
	URLInput,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	BaseControl,
} from '@wordpress/components';

/**
 * Edit component for the AI Hero Section block.
 *
 * Renders the block interface in the editor with:
 * - Background image with rounded corner
 * - Rich text heading, tagline, and content
 * - Two CTA buttons
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		content,
		tagline,
		backgroundImage,
		backgroundImageId,
		backgroundImageAlt,
		buttonPrimaryText,
		buttonPrimaryUrl,
		buttonSecondaryText,
		buttonSecondaryUrl,
	} = attributes;

	const heroImageId = useInstanceId( Edit, 'hero-image' );
	const primaryBtnId = useInstanceId( Edit, 'primary-btn' );
	const secondaryBtnId = useInstanceId( Edit, 'secondary-btn' );

	/**
	 * Handles background image selection.
	 * Memoized with useCallback for performance.
	 *
	 * @param {Object} media Selected media object.
	 */
	const onSelectImage = useCallback(
		( media ) => {
			setAttributes( {
				backgroundImage: media.url,
				backgroundImageId: media.id,
				backgroundImageAlt: media.alt || '',
			} );
		},
		[ setAttributes ]
	);

	/**
	 * Handles background image removal.
	 * Memoized with useCallback for performance.
	 */
	const onRemoveImage = useCallback( () => {
		setAttributes( {
			backgroundImage: '',
			backgroundImageId: 0,
			backgroundImageAlt: '',
		} );
	}, [ setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'hero-section',
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Background Image', 'ambrygen-web' ) }>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ backgroundImageId }
								render={ ( { open } ) => (
									<BaseControl
										id={ heroImageId }
										label={ __(
											'Hero Image',
											'ambrygen-web'
										) }
									>
										{ backgroundImage ? (
											<>
												<img
													src={ backgroundImage }
													alt={ backgroundImageAlt }
													style={ {
														maxWidth: '100%',
														height: 'auto',
														marginBottom: '10px',
														borderRadius: '8px',
													} }
												/>
												<div
													style={ {
														display: 'flex',
														gap: '8px',
													} }
												>
													<Button
														onClick={ open }
														variant="secondary"
														isSmall
														id={ heroImageId }
													>
														{ __(
															'Replace',
															'ambrygen-web'
														) }
													</Button>
													<Button
														onClick={
															onRemoveImage
														}
														variant="link"
														isDestructive
														isSmall
													>
														{ __(
															'Remove',
															'ambrygen-web'
														) }
													</Button>
												</div>
											</>
										) : (
											<Button
												onClick={ open }
												variant="secondary"
												id={ heroImageId }
											>
												{ __(
													'Upload Image',
													'ambrygen-web'
												) }
											</Button>
										) }
									</BaseControl>
								) }
							/>
						</MediaUploadCheck>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'Buttons', 'ambrygen-web' ) }>
					<BaseControl
						id={ primaryBtnId }
						label={ __( 'Primary Button', 'ambrygen-web' ) }
					>
						<TextControl
							id={ primaryBtnId }
							value={ buttonPrimaryText }
							onChange={ ( value ) =>
								setAttributes( { buttonPrimaryText: value } )
							}
							placeholder={ __( 'Button Text', 'ambrygen-web' ) }
						/>
						<URLInput
							value={ buttonPrimaryUrl }
							onChange={ ( value ) =>
								setAttributes( { buttonPrimaryUrl: value } )
							}
						/>
					</BaseControl>
					<BaseControl
						id={ secondaryBtnId }
						label={ __( 'Secondary Button', 'ambrygen-web' ) }
					>
						<TextControl
							id={ secondaryBtnId }
							value={ buttonSecondaryText }
							onChange={ ( value ) =>
								setAttributes( { buttonSecondaryText: value } )
							}
							placeholder={ __( 'Button Text', 'ambrygen-web' ) }
						/>
						<URLInput
							value={ buttonSecondaryUrl }
							onChange={ ( value ) =>
								setAttributes( { buttonSecondaryUrl: value } )
							}
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			<div className="hero-section__container">
				<div className="hero-section__background">
					{ backgroundImage ? (
						<img
							src={ backgroundImage }
							alt={ backgroundImageAlt }
							className="hero-section__image"
						/>
					) : (
						<div className="hero-section__placeholder">
							{ __(
								'Select a background image',
								'ambrygen-web'
							) }
						</div>
					) }
				</div>

				<div className="hero-section__content">
					<h2 className="hero-section__heading">
						<RichText
							tagName="span"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
						/>
					</h2>

					<div className="hero-section__description">
						<RichText
							tagName="p"
							value={ content }
							onChange={ ( value ) =>
								setAttributes( { content: value } )
							}
							placeholder={ __(
								'Add Description…',
								'ambrygen-web'
							) }
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/link',
							] }
						/>
					</div>

					<div className="hero-section__tagline">
						<RichText
							tagName="p"
							value={ tagline }
							onChange={ ( value ) =>
								setAttributes( { tagline: value } )
							}
							placeholder={ __( 'Add Tagline…', 'ambrygen-web' ) }
						/>
					</div>

					<div className="hero-section__actions">
						{ buttonSecondaryText && (
							<div className="hero-section__button hero-section__button--secondary">
								<span className="hero-section__button-text">
									{ buttonSecondaryText }
								</span>
								<span
									className="hero-section__button-icon"
									aria-hidden="true"
								>
									&rsaquo;
								</span>
							</div>
						) }
						{ buttonPrimaryText && (
							<div className="hero-section__button hero-section__button--primary">
								<span className="hero-section__button-text">
									{ buttonPrimaryText }
								</span>
								<span
									className="hero-section__button-icon"
									aria-hidden="true"
								>
									&rsaquo;
								</span>
							</div>
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
