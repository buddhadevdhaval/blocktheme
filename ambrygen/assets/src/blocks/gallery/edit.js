import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
} from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { Fragment, useEffect, useCallback } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';
/**
 * Placeholder image fallback.
 */
const PLACEHOLDER_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/uploads/default-image.webp';

/**
 * Gallery layout variations.
 */
const GALLERY_VARIATIONS = [
	{
		key: 'two-column',
		label: '2 Column Layout',
		itemCount: 2,
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/two-column.png',
	},
	{
		key: 'five-column',
		label: '5 Column Layout',
		itemCount: 5,
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/five-column.png',
	},
];

/**
 * Media Upload Panel component.
 * @param root0
 * @param root0.title
 * @param root0.imageUrl
 * @param root0.imageAlt
 * @param root0.onSelect
 * @param root0.onRemove
 * @param root0.selectLabel
 * @param root0.replaceLabel
 * @param root0.removeLabel
 * @param root0.headingTag
 * @param root0.onHeadingTagChange
 * @param root0.link
 * @param root0.onLinkChange
 */
function MediaUploadPanel( {
	title,
	imageUrl,
	imageAlt,
	onSelect,
	onRemove,
	selectLabel,
	replaceLabel,
	removeLabel,
	headingTag,
	onHeadingTagChange,
	link,
	onLinkChange,
} ) {
	return (
		<PanelBody title={ title } initialOpen={ false }>
			{ ! imageUrl ? (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelect }
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<Button onClick={ open } variant="primary">
								{ selectLabel }
							</Button>
						) }
					/>
				</MediaUploadCheck>
			) : (
				<div className="image-preview">
					<img src={ imageUrl } alt={ imageAlt } />
					<div className="image-actions">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelect }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
									>
										{ replaceLabel }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						<Button
							variant="link"
							isDestructive
							onClick={ onRemove }
						>
							{ removeLabel }
						</Button>
					</div>

					{ /* Heading Tag Selector */ }
					<SelectControl
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h5' }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ onHeadingTagChange }
					/>

					{ /* Internal Link Picker */ }
					<URLInput
						label={ __( 'Link', 'ambrygen-web' ) }
						value={ link || '' }
						onChange={ onLinkChange }
						className="components-base-control"
						__experimentalSuggestions={ true } // allows searching posts/pages
					/>
				</div>
			) }
		</PanelBody>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { items = [], variation = 'two-column', heading = '' } = attributes;

	const currentVariant =
		GALLERY_VARIATIONS.find( ( v ) => v.key === variation ) ||
		GALLERY_VARIATIONS[ 0 ];
	const requiredCount = currentVariant.itemCount;

	useEffect( () => {
		let newItems = [ ...items ];
		while ( newItems.length < requiredCount ) {
			newItems.push( {
				imageUrl: '',
				imageId: 0,
				imageAlt: '',
				imageSrcSet: '',
				imageSizes: '(max-width: 768px) 100vw, 33vw',
				title: __( 'Grid Item Title', 'ambrygen-web' ),
				headingTag: 'h5',
				description: '',
				link: '',
			} );
		}
		if ( newItems.length > requiredCount ) {
			newItems = newItems.slice( 0, requiredCount );
		}
		if ( newItems.length !== items.length ) {
			setAttributes( { items: newItems } );
		}
	}, [ variation, items, requiredCount, setAttributes ] );

	const updateItem = useCallback(
		( index, key, value ) => {
			const newItems = [ ...items ];
			newItems[ index ] = { ...newItems[ index ], [ key ]: value };
			setAttributes( { items: newItems } );
		},
		[ items, setAttributes ]
	);

	const handleImageSelect = useCallback(
		( index, media ) => {
			const sizes = media?.sizes || media?.media_details?.sizes || {};
			const newItems = [ ...items ];

			newItems[ index ] = {
				...newItems[ index ],
				imageUrl: media.url,
				imageId: media.id,
				imageAlt: media.alt || '',
				imageSrcSet: buildSrcSet( sizes ),
				imageSizes: '(max-width: 768px) 100vw, 33vw',
			};

			setAttributes( { items: newItems } );
		},
		[ items, setAttributes ]
	);

	const handlePanelOpen = ( blockClientId ) => {
		if ( blockClientId ) {
			dispatch( 'core/block-editor' ).selectBlock( blockClientId );
			dispatch( 'core/edit-post' ).openGeneralSidebar(
				'edit-post/block'
			);
		}
	};

	const blockProps = useBlockProps( {
		className: `image-grid-block variation-${ variation }`,
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Choose Variation', 'ambrygen-web' ) }
					initialOpen
				>
					<div className="ambrygen-variation-selector">
						{ GALLERY_VARIATIONS.map( ( option ) => (
							<button
								key={ option.key }
								type="button"
								className={ `variation-card ${
									variation === option.key ? 'is-active' : ''
								}` }
								onClick={ () =>
									setAttributes( { variation: option.key } )
								}
							>
								<img
									src={ option.preview }
									alt={ option.label }
								/>
								<span>{ option.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				{ items.map( ( item, index ) => (
					<MediaUploadPanel
						key={ index }
						title={ sprintf(
							__( 'Image Grid %d', 'ambrygen-web' ),
							index + 1
						) }
						imageUrl={ item.imageUrl }
						imageAlt={ item.imageAlt }
						selectLabel={ __( 'Select Image', 'ambrygen-web' ) }
						replaceLabel={ __( 'Replace Image', 'ambrygen-web' ) }
						removeLabel={ __( 'Remove Image', 'ambrygen-web' ) }
						onSelect={ ( media ) =>
							handleImageSelect( index, media )
						}
						onRemove={ () => updateItem( index, 'imageUrl', '' ) }
						headingTag={ item.headingTag }
						onHeadingTagChange={ ( value ) =>
							updateItem( index, 'headingTag', value )
						}
						link={ item.link }
						onLinkChange={ ( value ) =>
							updateItem( index, 'link', value )
						}
					/>
				) ) }
			</InspectorControls>

			<div { ...blockProps } className="wp-block-group">
				<section className="container-1340">
					<div className="is-style-gl-s48" />
					<div className="wrapper">
						<div className="get-started-ambry-block">
							<h2 className="block-title heading-3 mb-0">
								<RichText
									tagName="span"
									value={ heading }
									onChange={ ( value ) =>
										setAttributes( { heading: value } )
									}
									placeholder={ __(
										'Get Started with Ambry',
										'ambrygen-web'
									) }
									allowedFormats={ [ 'core/text-color' ] }
								/>
							</h2>

							<div className="card-grid-block">
								{ items.map( ( item, idx ) => {
									const HeadingTag = item.headingTag || 'h5';
									// In edit mode, do NOT wrap with <a> to avoid redirect
									const Tag = 'div';

									return (
										<Tag key={ idx } className="card-col">
											<div
												className="image-block"
												role="button"
												tabIndex={ 0 }
												onClick={ () =>
													handlePanelOpen( clientId )
												}
												onKeyDown={ ( e ) => {
													if (
														e.key === 'Enter' ||
														e.key === ' '
													) {
														handlePanelOpen(
															clientId
														);
													}
												} }
											>
												<img
													src={
														item.imageUrl ||
														PLACEHOLDER_IMAGE
													}
													srcSet={
														item.imageSrcSet ||
														undefined
													}
													sizes={
														item.imageSizes ||
														undefined
													}
													alt={
														item.imageAlt ||
														item.title
													}
													loading="lazy"
												/>
											</div>

											<div className="card-info">
												<HeadingTag className="link-btn mb-0">
													<RichText
														value={ item.title }
														onChange={ ( value ) =>
															updateItem(
																idx,
																'title',
																value
															)
														}
														placeholder={ __(
															'Add title…',
															'ambrygen-web'
														) }
													/>
												</HeadingTag>

												<div className="card-description text-small">
													<RichText
														value={
															item.description
														}
														onChange={ ( value ) =>
															updateItem(
																idx,
																'description',
																value
															)
														}
														placeholder={ __(
															'Add description…',
															'ambrygen-web'
														) }
													/>
												</div>
											</div>
										</Tag>
									);
								} ) }
							</div>
						</div>
					</div>
					<div className="is-style-gl-s48" />
				</section>
			</div>
		</Fragment>
	);
}
