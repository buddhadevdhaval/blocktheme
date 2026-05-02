import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';
import {
	BlockExamplePreview,
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
	Field,
	TagSelector,
} from '../_shared/components';

function createDownloadId() {
	return `download-${ Date.now() }-${ Math.random()
		.toString( 36 )
		.slice( 2, 10 ) }`;
}

function createDefaultDownload( group ) {
	return {
		id: createDownloadId(),
		group,
		groupName: '',
		label: '',
		fileUrl: '',
		fileId: 0,
	};
}

function normalizeDownloadsWithIds( downloads = [] ) {
	let hasChanges = false;

	const normalizedDownloads = downloads.map( ( item ) => {
		if ( item?.id ) {
			return item;
		}

		hasChanges = true;

		return {
			...item,
			id: createDownloadId(),
		};
	} );

	return {
		hasChanges,
		normalizedDownloads,
	};
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		sectionTitle,
		headingTag,
		logoImageUrl,
		logoImageAlt,
		downloads = [],
		secondaryImageUrl,
		secondaryImageAlt,
		secondaryImageId,
	} = attributes;
	const HeadingTag = headingTag || 'h2';

	const allowedDescriptionBlocks = [
		'core/paragraph',
		'core/buttons',
		'core/button',
		'core/spacer',
		'core/list',
	];

	const descriptionTemplate = [
		[
			'core/paragraph',
			{
				placeholder: __( 'Description', 'ambrygen-web' ),
			},
		],
	];

	useEffect( () => {
		const { hasChanges, normalizedDownloads } =
			normalizeDownloadsWithIds( downloads );

		if ( hasChanges ) {
			setAttributes( { downloads: normalizedDownloads } );
		}
	}, [ downloads, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'logo-section',
	} );
	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const displayLogo = logoImageUrl || defaultImages.placeholder.url;
	const hasSecondaryImage = Boolean( secondaryImageId || secondaryImageUrl );
	const hasHeading = '' !== sectionTitle.trim();

	if ( sectionTitle === 'multimedia-logo-example' ) {
		return (
			<BlockExamplePreview
				className="multimedia-logo-example-preview"
				imagePath="/assets/src/images/cta-tiles-with-3-card/default-image.png"
			/>
		);
	}

	const updateDownload = ( downloadId, key, value ) => {
		setAttributes( {
			downloads: downloads.map( ( item ) =>
				item.id === downloadId ? { ...item, [ key ]: value } : item
			),
		} );
	};

	const addDownload = ( group ) => {
		setAttributes( {
			downloads: [ ...downloads, createDefaultDownload( group ) ],
		} );
	};

	const removeDownload = ( downloadId ) => {
		setAttributes( {
			downloads: downloads.filter( ( item ) => item.id !== downloadId ),
		} );
	};

	const moveDownload = ( index, direction ) => {
		const newIndex = index + direction;

		if ( newIndex < 0 || newIndex >= downloads.length ) {
			return;
		}

		const nextDownloads = [ ...downloads ];
		[ nextDownloads[ index ], nextDownloads[ newIndex ] ] = [
			nextDownloads[ newIndex ],
			nextDownloads[ index ],
		];

		setAttributes( { downloads: nextDownloads } );
	};

	const updateDownloadMedia = ( downloadId, media ) => {
		setAttributes( {
			downloads: downloads.map( ( item ) =>
				item.id === downloadId
					? {
							...item,
							fileUrl: media?.url || '',
							fileId: media?.id || 0,
					  }
					: item
			),
		} );
	};

	const clearDownloadMedia = ( downloadId ) => {
		setAttributes( {
			downloads: downloads.map( ( item ) =>
				item.id === downloadId
					? {
							...item,
							fileUrl: '',
							fileId: 0,
					  }
					: item
			),
		} );
	};

	const webDownloads = downloads.filter( ( item ) => item.group === 'web' );
	const printDownloads = downloads.filter( ( item ) => item.group === 'print' );

	const renderDownloadPanel = ( group ) => {
		const groupDownloads = downloads
			.map( ( item, index ) => ( { item, index } ) )
			.filter( ( entry ) => entry.item.group === group );

		return (
			<>
				{ groupDownloads.length === 0 && (
					<p className="components-base-control__help">
						{ __( 'No items added yet.', 'ambrygen-web' ) }
					</p>
				) }

				{ groupDownloads.map( ( { item, index } ) => (
					<PanelItem key={ item.id }>
						<ItemHeader
							index={ index }
							label={ item.groupName || item.label || item.fileUrl }
							total={ downloads.length }
							onMove={ ( i, dir ) => moveDownload( i, dir ) }
							onRemove={ () => removeDownload( item.id ) }
							minCount={ 0 }
						/>

						<TextControl
							label={ __( 'Group Name', 'ambrygen-web' ) }
							value={ item.groupName || '' }
							onChange={ ( value ) =>
								updateDownload( item.id, 'groupName', value )
							}
						/>

						<TextControl
							label={ __( 'Link Name', 'ambrygen-web' ) }
							value={ item.label || '' }
							onChange={ ( value ) =>
								updateDownload( item.id, 'label', value )
							}
						/>

						<div style={ { marginBottom: '8px' } }>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={ [
										'application/pdf',
										'application/zip',
										'application/x-zip-compressed',
										'application/octet-stream',
										'image/svg+xml',
										'image/png',
										'image/jpeg',
									] }
									onSelect={ ( media ) =>
										updateDownloadMedia( item.id, media )
									}
									render={ ( { open } ) => (
										<Button
											variant="secondary"
											onClick={ ( e ) => {
												e.stopPropagation();
												open();
											} }
										>
											{ item.fileUrl
												? __( 'Replace File', 'ambrygen-web' )
												: __( 'Select File', 'ambrygen-web' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ item.fileUrl && (
								<Button
									variant="secondary"
									isDestructive
									onClick={ ( e ) => {
										e.stopPropagation();
										clearDownloadMedia( item.id );
									} }
									style={ { marginLeft: '8px' } }
								>
									{ __( 'Remove File', 'ambrygen-web' ) }
								</Button>
							) }
						</div>
					</PanelItem>
				) ) }

				<Button
					variant="primary"
					onClick={ () => addDownload( group ) }
					style={ { width: '100%', justifyContent: 'center' } }
				>
					{ group === 'web'
						? __( 'Add Web Item', 'ambrygen-web' )
						: __( 'Add Print Item', 'ambrygen-web' ) }
				</Button>
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Content Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<Field
						label={ __( 'Heading', 'ambrygen-web' ) }
						value={ sectionTitle }
						onChange={ ( value ) =>
							setAttributes( { sectionTitle: value } )
						}
					/>
					<ImageUploader
						label={ __( 'Image-1', 'ambrygen-web' ) }
						url={ logoImageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								logoImageUrl: media.url,
								logoImageId: media.id,
								logoImageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								logoImageUrl: '',
								logoImageId: 0,
								logoImageAlt: '',
							} )
						}
					/>
					<ImageUploader
						label={ __( 'Image-2', 'ambrygen-web' ) }
						url={ secondaryImageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								secondaryImageUrl: media.url,
								secondaryImageId: media.id,
								secondaryImageAlt: media.alt || '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								secondaryImageUrl: '',
								secondaryImageId: 0,
								secondaryImageAlt: '',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Group For Web', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ renderDownloadPanel( 'web' ) }
				</PanelBody>
				<PanelBody
					title={ __( 'Group For Print', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ renderDownloadPanel( 'print' ) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="logo-section__header">
					<RichText
						tagName={ HeadingTag }
						className="logo-section__title heading-3 mb-0"
						value={ sectionTitle }
						onChange={ ( value ) =>
							setAttributes( { sectionTitle: value } )
						}
						placeholder={ __( 'Heading', 'ambrygen-web' ) }
					/>
				</div>
				{ hasHeading && (
					<div className="is-style-gl-s50" aria-hidden="true"></div>
				) }

				<div className="logo-section__top">
					<div className="logo-section__logo">
						{ displayLogo ? (
							<img src={ displayLogo } alt={ logoImageAlt } />
						) : (
							<ImagePlaceholder
								text={ __( 'Image-1', 'ambrygen-web' ) }
							/>
						) }
					</div>

					<div className="logo-section__downloads">
						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{ __( 'Group For Web', 'ambrygen-web' ) }
							</div>
							<div className="logo-section__downloads-stack">
								{ webDownloads.length === 0 && (
									<div className="logo-section__downloads-empty">
										{ __(
											'Add web items from the sidebar.',
											'ambrygen-web'
										) }
									</div>
								) }
								{ webDownloads.map( ( item ) => (
									<div
										key={ item.id }
										className="logo-section__downloads-block"
									>
										<div className="logo-section__downloads-group-name">
											{ item.groupName ||
												__(
													'Group Name',
													'ambrygen-web'
												) }
										</div>
										<div className="logo-section__downloads-list">
											<span className="logo-section__downloads-link">
												{ item.label ||
													__(
														'Download file',
														'ambrygen-web'
													) }
											</span>
										</div>
									</div>
								) ) }
							</div>
						</div>

						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title subtitle2-sbold">
								{ __( 'Group For Print', 'ambrygen-web' ) }
							</div>
							<div className="logo-section__downloads-stack">
								{ printDownloads.length === 0 && (
									<div className="logo-section__downloads-empty">
										{ __(
											'Add print items from the sidebar.',
											'ambrygen-web'
										) }
									</div>
								) }
								{ printDownloads.map( ( item ) => (
									<div
										key={ item.id }
										className="logo-section__downloads-block"
									>
										<div className="logo-section__downloads-group-name">
											{ item.groupName ||
												__(
													'Group Name',
													'ambrygen-web'
												) }
										</div>
										<div className="logo-section__downloads-list">
											<span className="logo-section__downloads-link">
												{ item.label ||
													__(
														'Download file',
														'ambrygen-web'
													) }
											</span>
										</div>
									</div>
								) ) }
							</div>
						</div>
					</div>
				</div>

				<div className="logo-section__divider" aria-hidden="true" />

				<div className="logo-section__bottom">
					{ hasSecondaryImage && (
						<div className="logo-section__left">
							<div className="logo-section__guideline-item">
								<div className="logo-section__guideline-images">
									<img
										src={ secondaryImageUrl }
										alt={ secondaryImageAlt }
									/>
								</div>
							</div>
						</div>
					) }
					<div className="logo-section__description">
						<div className="logo-section__right-content">
							<InnerBlocks
								allowedBlocks={ allowedDescriptionBlocks }
								template={ descriptionTemplate }
								templateInsertUpdatesSelection={ true }
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
