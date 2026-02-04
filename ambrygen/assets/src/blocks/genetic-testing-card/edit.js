/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
import {
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	useBlockProps,
	URLInput,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	BaseControl,
} from '@wordpress/components';

/**
 * Default images
 */
const DEFAULT_IMAGES = {
	small: '/wp-content/themes/ambrygen/assets/images/default-small.jpg',
	main: '/wp-content/themes/ambrygen/assets/images/default-main.jpg',
};

const DEFAULT_IMAGE_ALT = 'Genetic testing card';

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

	/**
	 * Set default image on block creation if empty.
	 * Runs when image or type changes.
	 */
	useEffect( () => {
		if ( ! image ) {
			setAttributes( {
				image: DEFAULT_IMAGES[ type ] || DEFAULT_IMAGES.small,
				imageAlt: DEFAULT_IMAGE_ALT,
			} );
		}
	}, [ image, type, setAttributes ] );

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
													srcSet={ `${ image } 1x, ${ image } 2x` }
													sizes="(max-width: 600px) 100vw, 300px"
													loading="lazy"
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
					className={ `genetic-cards__image-wrapper new genetic-cards__image-wrapper--${ type }` }
				>
					<img
						src={
							image ||
							DEFAULT_IMAGES[ type ] ||
							DEFAULT_IMAGES.small
						}
						alt={ imageAlt || DEFAULT_IMAGE_ALT }
						srcSet={ `${ image || DEFAULT_IMAGES[ type ] } 1x, ${
							image || DEFAULT_IMAGES[ type ]
						} 2x` }
						sizes="(max-width: 600px) 100vw, 300px"
						loading="lazy"
					/>
				</div>

				<div
					className={ `genetic-cards__content ${
						type === 'main' ? 'genetic-cards__content--main' : ''
					}` }
				>
					<RichText
						tagName="h3"
						className="genetic-cards__title heading-6 mb-0"
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						placeholder={ __( 'Heading…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s8" />

					<RichText
						tagName="div"
						className="genetic-cards__description body1"
						value={ description }
						onChange={ ( val ) =>
							setAttributes( { description: val } )
						}
						placeholder={ __( 'Description…', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s20" />

					{ linkText && (
						<div className="genetic-cards__link">
							<a href={ linkUrl || '#' }>
								{ linkText }{ ' ' }
								<span className="icon">&rarr;</span>
							</a>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
