/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Higher-order components to compose components.
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Core block editor components for building the block interface.
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
 */
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	BaseControl,
} from '@wordpress/components';

/**
 * Edit component for the Genetic Testing Card block.
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {JSX.Element} Block editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		image,
		imageId,
		imageAlt,
		title,
		description,
		linkText,
		linkUrl,
		type,
	} = attributes;

	const instanceId = useInstanceId( Edit );

	const onSelectImage = ( media ) => {
		setAttributes( {
			image: media.url,
			imageId: media.id,
			imageAlt: media.alt || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			image: '',
			imageId: 0,
			imageAlt: '',
		} );
	};

	const blockProps = useBlockProps( {
		className: `genetic-cards__card genetic-cards__card--${ type }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Card Settings', 'ambrygen-web' ) }>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ imageId }
								render={ ( { open } ) => (
									<BaseControl
										id={ `card-image-${ instanceId }` }
										label={ __(
											'Card Image',
											'ambrygen-web'
										) }
									>
										{ image ? (
											<>
												<img
													src={ image }
													alt={ imageAlt }
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
					<PanelRow>
						<BaseControl
							id={ `card-link-${ instanceId }` }
							label={ __( 'Link', 'ambrygen-web' ) }
							className="w-full"
						>
							<TextControl
								value={ linkText }
								onChange={ ( val ) =>
									setAttributes( { linkText: val } )
								}
								label={ __( 'Link Text', 'ambrygen-web' ) }
								placeholder={ __(
									'Learn more',
									'ambrygen-web'
								) }
							/>
							<URLInput
								value={ linkUrl }
								onChange={ ( val ) =>
									setAttributes( { linkUrl: val } )
								}
								label={ __( 'Link URL', 'ambrygen-web' ) }
							/>
						</BaseControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className={ `genetic-cards__image-wrapper genetic-cards__image-wrapper--${ type }` }
				>
					{ image ? (
						<img src={ image } alt={ imageAlt } />
					) : (
						<div className="genetic-cards__placeholder">
							{ __( 'Image', 'ambrygen-web' ) }
						</div>
					) }
				</div>
				<div
					className={ `genetic-cards__content ${
						type === 'main' ? 'genetic-cards__content--main' : ''
					}` }
				>
					<RichText
						tagName="h3"
						className="genetic-cards__title"
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						placeholder={ __( 'Heading…', 'ambrygen-web' ) }
					/>
					<RichText
						tagName="p"
						className="genetic-cards__description"
						value={ description }
						onChange={ ( val ) =>
							setAttributes( { description: val } )
						}
						placeholder={ __( 'Description…', 'ambrygen-web' ) }
					/>
					<div className="genetic-cards__link">
						{ linkText }
						<span className="icon">&rarr;</span>
					</div>
				</div>
			</div>
		</>
	);
}
