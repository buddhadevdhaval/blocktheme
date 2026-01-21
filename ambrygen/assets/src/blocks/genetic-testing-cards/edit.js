/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

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
 * CardControl Component
 *
 * Reusable control for card settings in Inspector.
 *
 * @param {Object}   props                  Component properties.
 * @param {string}   props.title            Title of the card control panel.
 * @param {number}   props.imageId          ID of the selected image.
 * @param {string}   props.imageUrl         URL of the selected image.
 * @param {string}   props.imageAlt         Alt text of the selected image.
 * @param {Function} props.onSelectImage    Callback function when image is selected.
 * @param {Function} props.onRemoveImage    Callback function when image is removed.
 * @param {string}   props.linkText         Text for the link.
 * @param {Function} props.onLinkTextChange Callback function when link text changes.
 * @param {string}   props.linkUrl          URL for the link.
 * @param {Function} props.onLinkUrlChange  Callback function when link URL changes.
 * @param {string}   props.controlId        Unique identifier for accessibility control IDs.
 */
function CardControl( {
	title,
	imageId,
	imageUrl,
	imageAlt,
	onSelectImage,
	onRemoveImage,
	linkText,
	onLinkTextChange,
	linkUrl,
	onLinkUrlChange,
	controlId,
} ) {
	return (
		<PanelBody title={ title } initialOpen={ false }>
			<PanelRow>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<BaseControl
								id={ `${ controlId }-image` }
								label={ __( 'Card Image', 'ambrygen-web' ) }
							>
								{ imageUrl ? (
									<>
										<img
											src={ imageUrl }
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
												id={ `${ controlId }-replace` }
											>
												{ __(
													'Replace',
													'ambrygen-web'
												) }
											</Button>
											<Button
												onClick={ onRemoveImage }
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
										id={ `${ controlId }-upload` }
									>
										{ __( 'Upload Image', 'ambrygen-web' ) }
									</Button>
								) }
							</BaseControl>
						) }
					/>
				</MediaUploadCheck>
			</PanelRow>
			<PanelRow>
				<BaseControl
					id={ `${ controlId }-link` }
					label={ __( 'Link', 'ambrygen-web' ) }
					className="w-full"
				>
					<TextControl
						id={ `${ controlId }-text` }
						value={ linkText }
						onChange={ onLinkTextChange }
						label={ __( 'Link Text', 'ambrygen-web' ) }
						placeholder={ __( 'Learn more', 'ambrygen-web' ) }
					/>
					<URLInput
						value={ linkUrl }
						onChange={ onLinkUrlChange }
						label={ __( 'Link URL', 'ambrygen-web' ) }
					/>
				</BaseControl>
			</PanelRow>
		</PanelBody>
	);
}

/**
 * Edit component for the Genetic Testing Cards block.
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {JSX.Element} Block editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		cardOneImage,
		cardOneImageId,
		cardOneImageAlt,
		cardOneTitle,
		cardOneDescription,
		cardOneLinkText,
		cardOneLinkUrl,
		cardTwoImage,
		cardTwoImageId,
		cardTwoImageAlt,
		cardTwoTitle,
		cardTwoDescription,
		cardTwoLinkText,
		cardTwoLinkUrl,
		cardMainImage,
		cardMainImageId,
		cardMainImageAlt,
		cardMainTitle,
		cardMainDescription,
		cardMainLinkText,
		cardMainLinkUrl,
	} = attributes;

	const instanceId = useInstanceId( Edit );

	const updateAttribute = ( key, value ) => {
		setAttributes( { [ key ]: value } );
	};

	const onSelectImage = ( key, media ) => {
		setAttributes( {
			[ `${ key }Image` ]: media.url,
			[ `${ key }ImageId` ]: media.id,
			[ `${ key }ImageAlt` ]: media.alt || '',
		} );
	};

	const onRemoveImage = ( key ) => {
		setAttributes( {
			[ `${ key }Image` ]: '',
			[ `${ key }ImageId` ]: 0,
			[ `${ key }ImageAlt` ]: '',
		} );
	};

	const blockProps = useBlockProps( {
		className: 'genetic-cards',
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<CardControl
					title={ __( 'Card 1 (Top Left)', 'ambrygen-web' ) }
					imageId={ cardOneImageId }
					imageUrl={ cardOneImage }
					imageAlt={ cardOneImageAlt }
					onSelectImage={ ( media ) =>
						onSelectImage( 'cardOne', media )
					}
					onRemoveImage={ () => onRemoveImage( 'cardOne' ) }
					linkText={ cardOneLinkText }
					onLinkTextChange={ ( val ) =>
						updateAttribute( 'cardOneLinkText', val )
					}
					linkUrl={ cardOneLinkUrl }
					onLinkUrlChange={ ( val ) =>
						updateAttribute( 'cardOneLinkUrl', val )
					}
					controlId={ `card-one-${ instanceId }` }
				/>
				<CardControl
					title={ __( 'Card 2 (Bottom Left)', 'ambrygen-web' ) }
					imageId={ cardTwoImageId }
					imageUrl={ cardTwoImage }
					imageAlt={ cardTwoImageAlt }
					onSelectImage={ ( media ) =>
						onSelectImage( 'cardTwo', media )
					}
					onRemoveImage={ () => onRemoveImage( 'cardTwo' ) }
					linkText={ cardTwoLinkText }
					onLinkTextChange={ ( val ) =>
						updateAttribute( 'cardTwoLinkText', val )
					}
					linkUrl={ cardTwoLinkUrl }
					onLinkUrlChange={ ( val ) =>
						updateAttribute( 'cardTwoLinkUrl', val )
					}
					controlId={ `card-two-${ instanceId }` }
				/>
				<CardControl
					title={ __( 'Main Card (Right)', 'ambrygen-web' ) }
					imageId={ cardMainImageId }
					imageUrl={ cardMainImage }
					imageAlt={ cardMainImageAlt }
					onSelectImage={ ( media ) =>
						onSelectImage( 'cardMain', media )
					}
					onRemoveImage={ () => onRemoveImage( 'cardMain' ) }
					linkText={ cardMainLinkText }
					onLinkTextChange={ ( val ) =>
						updateAttribute( 'cardMainLinkText', val )
					}
					linkUrl={ cardMainLinkUrl }
					onLinkUrlChange={ ( val ) =>
						updateAttribute( 'cardMainLinkUrl', val )
					}
					controlId={ `card-main-${ instanceId }` }
				/>
			</InspectorControls>

			<div className="genetic-cards__container">
				<div className="genetic-cards__column-left">
					{ /* Card One */ }
					<div className="genetic-cards__card genetic-cards__card--small">
						<div className="genetic-cards__image-wrapper">
							{ cardOneImage ? (
								<img
									src={ cardOneImage }
									alt={ cardOneImageAlt }
								/>
							) : (
								<div className="genetic-cards__placeholder">
									{ __( 'Image', 'ambrygen-web' ) }
								</div>
							) }
						</div>
						<div className="genetic-cards__content">
							<RichText
								tagName="h3"
								className="genetic-cards__title"
								value={ cardOneTitle }
								onChange={ ( val ) =>
									updateAttribute( 'cardOneTitle', val )
								}
								placeholder={ __( 'Heading…', 'ambrygen-web' ) }
							/>
							<RichText
								tagName="p"
								className="genetic-cards__description"
								value={ cardOneDescription }
								onChange={ ( val ) =>
									updateAttribute( 'cardOneDescription', val )
								}
								placeholder={ __(
									'Description…',
									'ambrygen-web'
								) }
							/>
							<div className="genetic-cards__link">
								{ cardOneLinkText }
								<span className="icon">&rarr;</span>
							</div>
						</div>
					</div>

					{ /* Card Two */ }
					<div className="genetic-cards__card genetic-cards__card--small">
						<div className="genetic-cards__image-wrapper">
							{ cardTwoImage ? (
								<img
									src={ cardTwoImage }
									alt={ cardTwoImageAlt }
								/>
							) : (
								<div className="genetic-cards__placeholder">
									{ __( 'Image', 'ambrygen-web' ) }
								</div>
							) }
						</div>
						<div className="genetic-cards__content">
							<RichText
								tagName="h3"
								className="genetic-cards__title"
								value={ cardTwoTitle }
								onChange={ ( val ) =>
									updateAttribute( 'cardTwoTitle', val )
								}
								placeholder={ __( 'Heading…', 'ambrygen-web' ) }
							/>
							<RichText
								tagName="p"
								className="genetic-cards__description"
								value={ cardTwoDescription }
								onChange={ ( val ) =>
									updateAttribute( 'cardTwoDescription', val )
								}
								placeholder={ __(
									'Description…',
									'ambrygen-web'
								) }
							/>
							<div className="genetic-cards__link">
								{ cardTwoLinkText }
								<span className="icon">&rarr;</span>
							</div>
						</div>
					</div>
				</div>

				<div className="genetic-cards__column-right">
					{ /* Main Card */ }
					<div className="genetic-cards__card genetic-cards__card--main">
						<div className="genetic-cards__image-wrapper genetic-cards__image-wrapper--main">
							{ cardMainImage ? (
								<img
									src={ cardMainImage }
									alt={ cardMainImageAlt }
								/>
							) : (
								<div className="genetic-cards__placeholder">
									{ __( 'Image', 'ambrygen-web' ) }
								</div>
							) }
						</div>
						<div className="genetic-cards__content genetic-cards__content--main">
							<RichText
								tagName="h3"
								className="genetic-cards__title"
								value={ cardMainTitle }
								onChange={ ( val ) =>
									updateAttribute( 'cardMainTitle', val )
								}
								placeholder={ __(
									'Main Heading…',
									'ambrygen-web'
								) }
							/>
							<RichText
								tagName="p"
								className="genetic-cards__description"
								value={ cardMainDescription }
								onChange={ ( val ) =>
									updateAttribute(
										'cardMainDescription',
										val
									)
								}
								placeholder={ __(
									'Description…',
									'ambrygen-web'
								) }
							/>
							<div className="genetic-cards__link">
								{ cardMainLinkText }
								<span className="icon">&rarr;</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
