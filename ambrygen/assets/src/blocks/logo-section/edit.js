import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	PlainText,
} from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import {
	ImageUploader,
	ImagePlaceholder,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
	Field,
	TagSelector
} from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';

const DEFAULT_DOWNLOAD = {
	group: 'web',
	label: 'JPG',
	fileUrl: '',
	fileId: 0,
};

const DEFAULT_LEFT_ITEM = {
	title: '',
	description: '',
	imageUrl: '',
	imageId: 0,
	imageAlt: '',
	secondaryImageUrl: '',
	secondaryImageId: 0,
	secondaryImageAlt: '',
};

const DEFAULT_RIGHT_SECTION = {
	title: '',
	content: '',
	listItems: [],
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		sectionTitle,
		sectionTitleTag,
		logoImageUrl,
		logoImageAlt,
		downloads = [],
		leftItems = [],
		rightTitle,
		rightContent,
		rightSections = [],
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'logo-section',
	} );

	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const displayLogo = logoImageUrl || defaultImages.placeholder.url;

	const {
		update: updateDownload,
		add: addDownload,
		remove: removeDownload,
		move: moveDownload,
	} = useArrayHandlers( setAttributes, 'downloads' );

	const {
		update: updateLeftItem,
		add: addLeftItem,
		remove: removeLeftItem,
		move: moveLeftItem,
	} = useArrayHandlers( setAttributes, 'leftItems' );

	const {
		update: updateRightSection,
		add: addRightSection,
		remove: removeRightSection,
		move: moveRightSection,
	} = useArrayHandlers( setAttributes, 'rightSections' );

	const updateDownloadMedia = ( index, media ) => {
		setAttributes( ( prev ) => {
			const nextDownloads = [ ...( prev.downloads || [] ) ];
			nextDownloads[ index ] = {
				...nextDownloads[ index ],
				fileUrl: media?.url || '',
				fileId: media?.id || 0,
			};
			return { downloads: nextDownloads };
		} );
	};

	const clearDownloadMedia = ( index ) => {
		setAttributes( ( prev ) => {
			const nextDownloads = [ ...( prev.downloads || [] ) ];
			nextDownloads[ index ] = {
				...nextDownloads[ index ],
				fileUrl: '',
				fileId: 0,
			};
			return { downloads: nextDownloads };
		} );
	};

	const updateLeftImage = ( index, media ) => {
		setAttributes( ( prev ) => {
			const nextItems = [ ...( prev.leftItems || [] ) ];
			nextItems[ index ] = {
				...nextItems[ index ],
				imageUrl: media?.url || '',
				imageId: media?.id || 0,
				imageAlt: media?.alt || '',
			};
			return { leftItems: nextItems };
		} );
	};

	const updateLeftSecondaryImage = ( index, media ) => {
		setAttributes( ( prev ) => {
			const nextItems = [ ...( prev.leftItems || [] ) ];
			nextItems[ index ] = {
				...nextItems[ index ],
				secondaryImageUrl: media?.url || '',
				secondaryImageId: media?.id || 0,
				secondaryImageAlt: media?.alt || '',
			};
			return { leftItems: nextItems };
		} );
	};

	const updateRightListItem = ( sectionIndex, itemIndex, value ) => {
		setAttributes( ( prev ) => {
			const nextSections = [ ...( prev.rightSections || [] ) ];
			const nextSection = { ...( nextSections[ sectionIndex ] || {} ) };
			const nextItems = [ ...( nextSection.listItems || [] ) ];
			nextItems[ itemIndex ] = value;
			nextSection.listItems = nextItems;
			nextSections[ sectionIndex ] = nextSection;
			return { rightSections: nextSections };
		} );
	};

	const addRightListItem = ( sectionIndex ) => {
		setAttributes( ( prev ) => {
			const nextSections = [ ...( prev.rightSections || [] ) ];
			const nextSection = { ...( nextSections[ sectionIndex ] || {} ) };
			const nextItems = [ ...( nextSection.listItems || [] ), '' ];
			nextSection.listItems = nextItems;
			nextSections[ sectionIndex ] = nextSection;
			return { rightSections: nextSections };
		} );
	};

	const removeRightListItem = ( sectionIndex, itemIndex ) => {
		setAttributes( ( prev ) => {
			const nextSections = [ ...( prev.rightSections || [] ) ];
			const nextSection = { ...( nextSections[ sectionIndex ] || {} ) };
			const nextItems = [ ...( nextSection.listItems || [] ) ];
			nextItems.splice( itemIndex, 1 );
			nextSection.listItems = nextItems;
			nextSections[ sectionIndex ] = nextSection;
			return { rightSections: nextSections };
		} );
	};

	const moveRightListItem = ( sectionIndex, itemIndex, direction ) => {
		setAttributes( ( prev ) => {
			const nextSections = [ ...( prev.rightSections || [] ) ];
			const nextSection = { ...( nextSections[ sectionIndex ] || {} ) };
			const nextItems = [ ...( nextSection.listItems || [] ) ];
			const targetIndex =
				direction === 'up' ? itemIndex - 1 : itemIndex + 1;
			if (
				targetIndex < 0 ||
				targetIndex >= nextItems.length ||
				itemIndex < 0 ||
				itemIndex >= nextItems.length
			) {
				return { rightSections: nextSections };
			}
			const temp = nextItems[ itemIndex ];
			nextItems[ itemIndex ] = nextItems[ targetIndex ];
			nextItems[ targetIndex ] = temp;
			nextSection.listItems = nextItems;
			nextSections[ sectionIndex ] = nextSection;
			return { rightSections: nextSections };
		} );
	};

	const webDownloads = downloads.filter(
		( item ) => item.group === 'web'
	);
	const printDownloads = downloads.filter(
		( item ) => item.group === 'print'
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Logo Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<Field
						label={ __( 'Section Title', 'ambrygen-web' ) }
						value={ sectionTitle }
						onChange={ ( value ) =>
							setAttributes( { sectionTitle: value } )
						}
					/>
					<TagSelector
						label={ __( 'Title Tag', 'ambrygen-web' ) }
						type="heading"
						value={ sectionTitleTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { sectionTitleTag: value } )
						}
					/>
					<ImageUploader
						label={ __( 'Logo Image', 'ambrygen-web' ) }
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
				</PanelBody>

				<PanelBody
					title={ __( 'Download Files', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ downloads.length === 0 && (
						<p className="components-base-control__help">
							{ __(
								'No downloads added yet.',
								'ambrygen-web'
							) }
						</p>
					) }

					{ downloads.map( ( item, index ) => (
						<PanelItem key={ index }>
							<ItemHeader
								index={ index }
								label={ item.label || item.fileUrl }
								total={ downloads.length }
								onMove={ ( i, dir ) =>
									moveDownload( i, dir )
								}
								onRemove={ ( i ) =>
									removeDownload( i, 0 )
								}
								minCount={ 0 }
							/>

							<SelectControl
								label={ __( 'Group', 'ambrygen-web' ) }
								value={ item.group || 'web' }
								options={ [
									{
										label: __(
											'For Web',
											'ambrygen-web'
										),
										value: 'web',
									},
									{
										label: __(
											'For Print',
											'ambrygen-web'
										),
										value: 'print',
									},
								] }
								onChange={ ( value ) =>
									updateDownload( index, 'group', value )
								}
							/>

							<SelectControl
								label={ __( 'Label', 'ambrygen-web' ) }
								value={ item.label || 'JPG' }
								options={ [
									{ label: 'JPG', value: 'JPG' },
									{ label: 'PNG', value: 'PNG' },
									{ label: 'PDF', value: 'PDF' },
									{ label: 'SVG', value: 'SVG' },
								] }
								onChange={ ( value ) =>
									updateDownload( index, 'label', value )
								}
							/>

							<div style={ { marginBottom: '8px' } }>
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={ [
											'application',
											'text',
											'image',
										] }
										onSelect={ ( media ) =>
											updateDownloadMedia(
												index,
												media
											)
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
													? __(
															'Replace File',
															'ambrygen-web'
													  )
													: __(
															'Select File',
															'ambrygen-web'
													  ) }
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
											clearDownloadMedia( index );
										} }
										style={ { marginLeft: '8px' } }
									>
										{ __(
											'Remove File',
											'ambrygen-web'
										) }
									</Button>
								) }
							</div>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						onClick={ () => addDownload( DEFAULT_DOWNLOAD ) }
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ __( 'Add Download', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody
					title={ __( 'Guideline Items', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ leftItems.length === 0 && (
						<p className="components-base-control__help">
							{ __(
								'No guideline items added yet.',
								'ambrygen-web'
							) }
						</p>
					) }

					{ leftItems.map( ( item, index ) => (
						<PanelItem key={ index }>
							<ItemHeader
								index={ index }
								label={ item.title }
								total={ leftItems.length }
								onMove={ ( i, dir ) =>
									moveLeftItem( i, dir )
								}
								onRemove={ ( i ) => removeLeftItem( i, 0 ) }
								minCount={ 0 }
							/>

							<Field
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ item.title || '' }
								onChange={ ( value ) =>
									updateLeftItem( index, 'title', value )
								}
								onClick={ ( e ) => e.stopPropagation() }
							/>

							<Field
								label={ __(
									'Description',
									'ambrygen-web'
								) }
								value={ item.description || '' }
								onChange={ ( value ) =>
									updateLeftItem(
										index,
										'description',
										value
									)
								}
								onClick={ ( e ) => e.stopPropagation() }
							/>

							<ImageUploader
								label={ __( 'Primary Image', 'ambrygen-web' ) }
								url={ item.imageUrl }
								onSelect={ ( media ) =>
									updateLeftImage( index, media )
								}
								onRemove={ () =>
									updateLeftImage( index, null )
								}
							/>

							<ImageUploader
								label={ __(
									'Secondary Image (optional)',
									'ambrygen-web'
								) }
								url={ item.secondaryImageUrl }
								onSelect={ ( media ) =>
									updateLeftSecondaryImage( index, media )
								}
								onRemove={ () =>
									updateLeftSecondaryImage( index, null )
								}
							/>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						onClick={ () => addLeftItem( DEFAULT_LEFT_ITEM ) }
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ __( 'Add Guideline', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>
				<div className="logo-section__header">
					<RichText
						tagName={ sectionTitleTag || 'h2' }
						className="logo-section__title heading-3 mb-0"
						value={ sectionTitle }
						onChange={ ( value ) =>
							setAttributes( { sectionTitle: value } )
						}
						placeholder={ __( 'Logo', 'ambrygen-web' ) }
					/>
				</div>
				<div class="is-style-gl-s50" aria-hidden="true"></div>

				<div className="logo-section__top">
					<div className="logo-section__logo">
						{ displayLogo ? (
							<img src={ displayLogo } alt={ logoImageAlt } />
						) : (
							<ImagePlaceholder
								text={ __(
									'No logo set',
									'ambrygen-web'
								) }
							/>
						) }
					</div>

					<div className="logo-section__downloads">
						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title">
								{ __( 'For Web', 'ambrygen-web' ) }
							</div>
							<ul className="logo-section__downloads-list">
								{ webDownloads.length === 0 && (
									<li className="logo-section__downloads-empty">
										{ __(
											'No files',
											'ambrygen-web'
										) }
									</li>
								) }
								{ webDownloads.map( ( item, index ) => (
									<li
										key={ `${ index }-web` }
										className="logo-section__downloads-item"
									>
										<span className="logo-section__downloads-link">
											{ item.label || 'JPG' }
										</span>
									</li>
								) ) }
							</ul>
						</div>

						<div className="logo-section__downloads-group">
							<div className="logo-section__downloads-title">
								{ __( 'For Print', 'ambrygen-web' ) }
							</div>
							<ul className="logo-section__downloads-list">
								{ printDownloads.length === 0 && (
									<li className="logo-section__downloads-empty">
										{ __(
											'No files',
											'ambrygen-web'
										) }
									</li>
								) }
								{ printDownloads.map( ( item, index ) => (
									<li
										key={ `${ index }-print` }
										className="logo-section__downloads-item"
									>
										<span className="logo-section__downloads-link">
											{ item.label || 'PDF' }
										</span>
									</li>
								) ) }
							</ul>
						</div>
					</div>
				</div>

				<div className="logo-section__divider" aria-hidden="true" />

				<div className="logo-section__bottom">
					<div className="logo-section__left">
						{ leftItems.length === 0 && (
							<p className="logo-section__empty">
								{ __(
									'Add guideline items from the sidebar.',
									'ambrygen-web'
								) }
							</p>
						) }
						{ leftItems.map( ( item, index ) => (
							<div
								key={ index }
								className="logo-section__guideline-item"
							>
								<RichText
									tagName="h4"
									className="logo-section__guideline-title heading-6 mb-0"
									value={ item.title }
									onChange={ ( value ) =>
										updateLeftItem(
											index,
											'title',
											value
										)
									}
									placeholder={ __(
										'Guideline Title',
										'ambrygen-web'
									) }
								/>
								<div className="logo-section__guideline-images">
									{ item.imageUrl ? (
										<img
											src={ item.imageUrl }
											alt={ item.imageAlt || '' }
										/>
									) : (
										<ImagePlaceholder />
									) }
									{ item.secondaryImageUrl && (
										<img
											src={ item.secondaryImageUrl }
											alt={
												item.secondaryImageAlt || ''
											}
										/>
									) }
								</div>
								<RichText
									tagName="p"
									className="logo-section__guideline-description"
									value={ item.description }
									onChange={ ( value ) =>
										updateLeftItem(
											index,
											'description',
											value
										)
									}
									placeholder={ __(
										'Guideline description',
										'ambrygen-web'
									) }
								/>
							</div>
						) ) }
					</div>

					<div className="logo-section__right">
						<div className="logo-section__right-content">
							{ rightSections.length > 0 ? (
								rightSections.map( ( section, index ) => (
									<div
										key={ index }
										className="logo-section__right-content__section subtitle2"
									>
										<ItemHeader
											index={ index }
											label={ section.title }
											total={ rightSections.length }
											onMove={ ( i, dir ) =>
												moveRightSection( i, dir )
											}
											onRemove={ ( i ) =>
												removeRightSection( i, 0 )
											}
											minCount={ 0 }
										/>
										<PlainText
											className="logo-section__right-content__section-title subtitle2-sbold"
											value={ section.title }
											onChange={ ( value ) =>
												updateRightSection(
													index,
													'title',
													value
												)
											}
											placeholder={ __(
												'Section Title',
												'ambrygen-web'
											) }
										/>
										<RichText
											tagName="div"
											value={ section.content }
											onChange={ ( value ) =>
												updateRightSection(
													index,
													'content',
													value
												)
											}
											placeholder={ __(
												'Section content',
												'ambrygen-web'
											) }
										/>
										{ ( section.listItems || [] ).length >
											0 && (
											<ul className="logo-section__right-content__section-list">
												{ ( section.listItems || [] ).map(
													( listItem, itemIndex ) => (
														<li
															key={ itemIndex }
														>
															<Field
																label={ __(
																	'List item',
																	'ambrygen-web'
																) }
																value={
																	listItem
																}
																onChange={ (
																	value
																) =>
																	updateRightListItem(
																		index,
																		itemIndex,
																		value
																	)
																}
															/>
															<ItemHeader
																index={
																	itemIndex
																}
																label={
																	listItem
																}
																total={
																	section
																		.listItems
																		.length
																}
																onMove={ (
																	i,
																	dir
																) =>
																	moveRightListItem(
																		index,
																		i,
																		dir
																	)
																}
																onRemove={ (
																	i
																) =>
																	removeRightListItem(
																		index,
																		i
																	)
																}
																minCount={ 0 }
															/>
														</li>
													)
												) }
											</ul>
										) }
										<Button
											variant="secondary"
											onClick={ () =>
												addRightListItem( index )
											}
											style={ { marginTop: '8px' } }
										>
											{ __(
												'Add List Item',
												'ambrygen-web'
											) }
										</Button>
									</div>
								) )
							) : (
								<>
									<RichText
										tagName="h3"
										className="logo-section__right-title heading-6 mb-0"
										value={ rightTitle }
										onChange={ ( value ) =>
											setAttributes( {
												rightTitle: value,
											} )
										}
										placeholder={ __(
											'Using the Logo',
											'ambrygen-web'
										) }
									/>
									<RichText
										tagName="div"
										className="logo-section__right-content"
										value={ rightContent }
										onChange={ ( value ) =>
											setAttributes( {
												rightContent: value,
											} )
										}
										placeholder={ __(
											'Right content',
											'ambrygen-web'
										) }
									/>
								</>
							) }
							<Button
								variant="primary"
								onClick={ () =>
									addRightSection( DEFAULT_RIGHT_SECTION )
								}
								style={ {
									width: '100%',
									justifyContent: 'center',
									marginTop: '16px',
								} }
							>
								{ __( 'Add Information', 'ambrygen-web' ) }
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
