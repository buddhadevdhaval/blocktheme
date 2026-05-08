import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	FormTokenField,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, Fragment, useMemo } from '@wordpress/element';
import { link as linkIcon, plus, trash } from '@wordpress/icons';

import { getThemeAssetUrl } from '../../utils/assets';
import {
	BlockExamplePreview,
	CtaButtonField,
	DEFAULT_IMAGES,
	ImageUploader,
	TagSelector,
} from '../_shared/components';

const createRepeaterId = ( prefix ) =>
	`${ prefix }-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const normalizePdfLink = ( link = {} ) => ( {
	id: link.id || createRepeaterId( 'resource-link' ),
	label: link.label || '',
	url: link.url || '',
} );

const normalizeResourceCard = ( card = {} ) => ( {
	id: card.id || createRepeaterId( 'resource-card' ),
	title: card.title || '',
	pdfLinks: Array.isArray( card.pdfLinks )
		? card.pdfLinks.map( normalizePdfLink )
		: [],
} );

const normalizeCustomCollaborator = ( collaborator = {} ) => ( {
	id: collaborator.id || createRepeaterId( 'resource-collaborator' ),
	name: collaborator.name || '',
	url: collaborator.url || '',
	imageId: collaborator.imageId || 0,
	imageUrl: collaborator.imageUrl || '',
	imageAlt: collaborator.imageAlt || '',
} );

const getCardKey = ( card = {} ) =>
	card.id || `${ card.title || 'resource-card' }-${ card.pdfLinks?.length || 0 }`;

const getPdfLinkKey = ( link = {} ) =>
	link.id || `${ link.label || 'resource-link' }-${ link.url || 'empty' }`;

const getCollaboratorKey = ( collaborator = {} ) =>
	collaborator.id ||
	collaborator.url ||
	collaborator.imageUrl ||
	collaborator.name ||
	'resource-collaborator';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		subtitle,
		resourceCards = [],
		orgTitle,
		collaboratorIds = [],
		headingLevel,
		resourcesCardTitle,
		customCollaborators = [],
		enableCustomCollaborators = false,
	} = attributes;
	const isExample = blockId === 'resources-example';

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, isExample, setAttributes ] );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const hasCardIds = resourceCards.every(
			( card ) =>
				card?.id &&
				( card.pdfLinks || [] ).every( ( link ) => link?.id )
		);
		const hasCollaboratorIds = customCollaborators.every(
			( collaborator ) => collaborator?.id && collaborator?.imageAlt !== undefined
		);

		if ( hasCardIds && hasCollaboratorIds ) {
			return;
		}

		setAttributes( {
			resourceCards: resourceCards.map( normalizeResourceCard ),
			customCollaborators: customCollaborators.map(
				normalizeCustomCollaborator
			),
		} );
	}, [ isExample, resourceCards, customCollaborators, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'resources',
		id: blockId || undefined,
	} );

	const collaborators = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'taxonomy', 'collaborator', {
				per_page: -1,
			} ),
		[]
	);

	const collaboratorOptions = collaborators || [];
	const suggestions = collaboratorOptions.map( ( term ) => term.name );
	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const downloadIcon = getThemeAssetUrl(
		'/assets/src/images/download-icon.svg'
	);

	const selectedCollaboratorNames = collaboratorIds
		.map( ( id ) => {
			const term = collaboratorOptions.find( ( item ) => item.id === id );
			return term ? term.name : null;
		} )
		.filter( Boolean );

	const updateCards = ( index, field, value ) => {
		const newCards = [ ...resourceCards ];
		newCards[ index ] = { ...newCards[ index ], [ field ]: value };
		setAttributes( { resourceCards: newCards } );
	};

	const updatePdfLink = ( cardIndex, linkIndex, field, value ) => {
		const newCards = [ ...resourceCards ];
		const newLinks = [ ...( newCards[ cardIndex ].pdfLinks || [] ) ];
		newLinks[ linkIndex ] = { ...newLinks[ linkIndex ], [ field ]: value };
		newCards[ cardIndex ] = { ...newCards[ cardIndex ], pdfLinks: newLinks };
		setAttributes( { resourceCards: newCards } );
	};

	const addPdfLink = ( cardIndex ) => {
		const newCards = [ ...resourceCards ];
		const currentLinks = newCards[ cardIndex ].pdfLinks || [];

		if ( currentLinks.length >= 2 ) {
			return;
		}

		const newLinks = [
			...currentLinks,
			normalizePdfLink( { label: '', url: '' } ),
		];
		newCards[ cardIndex ] = { ...newCards[ cardIndex ], pdfLinks: newLinks };
		setAttributes( { resourceCards: newCards } );
	};

	const removePdfLink = ( cardIndex, linkIndex ) => {
		const newCards = [ ...resourceCards ];
		const newLinks = [ ...( newCards[ cardIndex ].pdfLinks || [] ) ];
		newLinks.splice( linkIndex, 1 );
		newCards[ cardIndex ] = { ...newCards[ cardIndex ], pdfLinks: newLinks };
		setAttributes( { resourceCards: newCards } );
	};

	const addCard = () => {
		setAttributes( {
			resourceCards: [
				...resourceCards,
				{
					id: createRepeaterId( 'resource-card' ),
					title: '',
					pdfLinks: [
						normalizePdfLink( { label: '', url: '' } ),
						normalizePdfLink( { label: '', url: '' } ),
					],
				},
			],
		} );
	};

	const removeCard = ( index ) => {
		const newCards = [ ...resourceCards ];
		newCards.splice( index, 1 );
		setAttributes( { resourceCards: newCards } );
	};

	const onCollaboratorsChange = ( names ) => {
		const newIds = names
			.map( ( name ) => {
				const term = collaboratorOptions.find( ( item ) => item.name === name );
				return term ? term.id : null;
			} )
			.filter( Boolean );

		setAttributes( { collaboratorIds: newIds } );
	};

	const addCustomCollaborator = () => {
		setAttributes( {
			customCollaborators: [
				...customCollaborators,
				{
					id: createRepeaterId( 'resource-collaborator' ),
					name: '',
					url: '',
					imageId: 0,
					imageUrl: '',
					imageAlt: '',
				},
			],
		} );
	};

	const removeCustomCollaborator = ( index ) => {
		const newCustom = [ ...customCollaborators ];
		newCustom.splice( index, 1 );
		setAttributes( { customCollaborators: newCustom } );
	};

	const updateCustomCollaborator = ( index, field, value ) => {
		const newCustom = [ ...customCollaborators ];
		newCustom[ index ] = { ...newCustom[ index ], [ field ]: value };
		setAttributes( { customCollaborators: newCustom } );
	};

	const updateCustomCollaboratorLink = ( index, value ) => {
		updateCustomCollaborator( index, 'url', value?.url || '' );
	};

	const hasHeading = '' !== title?.trim();
	const hasSubtitle = '' !== subtitle?.trim();

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="resources-example-preview"
				imagePath="/assets/src/images/resources/preview.png"
			/>
		);
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody title={ __( 'Manage Items', 'ambrygen-web' ) } initialOpen={ true }>
					{ resourceCards.map( ( card, index ) => (
						<div
							key={ getCardKey( card ) }
							className="resources__pdf-link-editor"
						>
							<div className="resources__card-settings-header">
								<strong>
									{ __( 'Item', 'ambrygen-web' ) } { index + 1 }
								</strong>
								<Button
									icon={ trash }
									isDestructive
									onClick={ () => removeCard( index ) }
								>
									{ __( 'Remove Item', 'ambrygen-web' ) }
								</Button>
							</div>

							<TextControl
								label={ __( 'Resources', 'ambrygen-web' ) }
								value={ card.title }
								onChange={ ( value ) =>
									updateCards( index, 'title', value )
								}
								placeholder={ __( 'Resources', 'ambrygen-web' ) }
							/>

							<p>
								<strong>
									{ __( 'PDF Downloads', 'ambrygen-web' ) } (Max 2)
								</strong>
							</p>

							{ ( card.pdfLinks || [] ).map( ( link, linkIndex ) => (
								<div
									key={ getPdfLinkKey( link ) }
									className="resources__pdf-link-editor"
								>
									<div className="resources__pdf-link-editor-header">
										<span>
											{ __( 'Link', 'ambrygen-web' ) } { linkIndex + 1 }
										</span>
										<Button
											icon={ trash }
											isDestructive
											label={ __( 'Remove Link', 'ambrygen-web' ) }
											onClick={ () =>
												removePdfLink( index, linkIndex )
											}
											size="small"
										/>
									</div>

									<TextControl
										label={ __( 'Label', 'ambrygen-web' ) }
										value={ link.label }
										onChange={ ( value ) =>
											updatePdfLink(
												index,
												linkIndex,
												'label',
												value
											)
										}
										placeholder={ __( 'e.g. EN', 'ambrygen-web' ) }
									/>

									<div className="resources__pdf-link-editor-controls">
										<div className="resources__pdf-link-editor-url">
											<TextControl
												label={ __( 'File URL', 'ambrygen-web' ) }
												value={ link.url }
												onChange={ ( value ) =>
													updatePdfLink(
														index,
														linkIndex,
														'url',
														value
													)
												}
											/>
										</div>

										<MediaUploadCheck>
											<MediaUpload
												onSelect={ ( media ) =>
													updatePdfLink(
														index,
														linkIndex,
														'url',
														media.url
													)
												}
												allowedTypes={ [ 'application/pdf' ] }
												value={ link.url }
												render={ ( { open } ) => (
													<Button
														onClick={ open }
														icon={ linkIcon }
														variant="secondary"
														label={ __(
															'Select PDF',
															'ambrygen-web'
														) }
													/>
												) }
											/>
										</MediaUploadCheck>
									</div>
								</div>
							) ) }

							{ ( card.pdfLinks || [] ).length < 2 && (
								<Button
									variant="secondary"
									icon={ plus }
									onClick={ () => addPdfLink( index ) }
									className="resources__full-width-btn"
								>
									{ __( 'Add PDF Link', 'ambrygen-web' ) }
								</Button>
							) }

							<hr />
						</div>
					) ) }

					<Button
						variant="secondary"
						icon={ plus }
						onClick={ addCard }
						className="resources__full-width-btn"
					>
						{ __( 'Add New Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Collaborators', 'ambrygen-web' ) }>
					<SelectControl
						label={ __( 'Collaborators', 'ambrygen-web' ) }
						value={ enableCustomCollaborators ? 'manual' : 'taxonomy' }
						options={ [
							{
								label: __( 'Fetch from taxonomy', 'ambrygen-web' ),
								value: 'taxonomy',
							},
							{
								label: __( 'Set manually', 'ambrygen-web' ),
								value: 'manual',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								enableCustomCollaborators: value === 'manual',
							} )
						}
					/>

					{ ! enableCustomCollaborators && (
						<>
							<hr />
							<FormTokenField
								label={ __( 'Fetch from taxonomy', 'ambrygen-web' ) }
								value={ selectedCollaboratorNames }
								suggestions={ suggestions }
								onChange={ onCollaboratorsChange }
							/>
						</>
					) }

					{ enableCustomCollaborators && <hr /> }

					{ enableCustomCollaborators && (
						<div className="resources__custom-collabs-wrap">
							<p>
								<strong>{ __( 'Set manually', 'ambrygen-web' ) }</strong>
							</p>

							{ customCollaborators.map( ( collab, index ) => (
								<div
									key={ getCollaboratorKey( collab ) }
									className="resources__custom-collab-editor"
								>
									<div className="resources__custom-collab-editor-header">
										<span>
											{ __( 'Collaborator', 'ambrygen-web' ) } { index + 1 }
										</span>
										<Button
											icon={ trash }
											isDestructive
											onClick={ () =>
												removeCustomCollaborator( index )
											}
											size="small"
										/>
									</div>

									<CtaButtonField
										label={ __( 'Link', 'ambrygen-web' ) }
										value={ { url: collab.url || '' } }
										onChange={ ( value ) =>
											updateCustomCollaboratorLink( index, value )
										}
										showText={ false }
										showVariant={ false }
									/>

									<TextControl
										label={ __( 'Name', 'ambrygen-web' ) }
										value={ collab.name || '' }
										onChange={ ( value ) =>
											updateCustomCollaborator(
												index,
												'name',
												value
											)
										}
									/>

									<div className="resources__custom-collab-image">
										<p>
											<strong>{ __( 'ICON', 'ambrygen-web' ) }</strong>
										</p>
										<ImageUploader
											url={ collab.imageUrl }
											onSelect={ ( media ) => {
												const newCustom = [ ...customCollaborators ];
												newCustom[ index ] = {
													...newCustom[ index ],
													imageId: media.id,
													imageUrl: media.url,
													imageAlt: media.alt || '',
												};
												setAttributes( {
													customCollaborators: newCustom,
												} );
											} }
											onRemove={ () => {
												const newCustom = [ ...customCollaborators ];
												newCustom[ index ] = {
													...newCustom[ index ],
													imageId: 0,
													imageUrl: '',
													imageAlt: '',
												};
												setAttributes( {
													customCollaborators: newCustom,
												} );
											} }
										/>
									</div>

									<hr />
								</div>
							) ) }

							<Button
								variant="secondary"
								icon={ plus }
								onClick={ addCustomCollaborator }
								className="resources__full-width-btn"
							>
								{ __( 'Add Collaborator', 'ambrygen-web' ) }
							</Button>
						</div>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="resources__header">
					<RichText
						tagName={ headingLevel || 'h2' }
						className="heading-4 block-title mb-0 resources__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>

					<div className="is-style-gl-s12" aria-hidden="true"></div>

					<RichText
						tagName="div"
						className="body1 resources__subtitle"
						value={ subtitle }
						onChange={ ( value ) =>
							setAttributes( { subtitle: value } )
						}
						placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
					/>
				</div>

				<div className="is-style-gl-s50" aria-hidden="true"></div>

				<div className="resources__layout">
					<div className="test-lists-downloads">
						<div className="resources__card">
							<RichText
								tagName="div"
								className="subtitle2-sbold resources__card-title text-center"
								value={ resourcesCardTitle }
								onChange={ ( value ) =>
									setAttributes( { resourcesCardTitle: value } )
								}
								placeholder={ __(
									'Add Title...',
									'ambrygen-web'
								) }
							/>

							<div className="test-lists-downloads__list">
								{ resourceCards.map( ( card, index ) => (
									<div
										className="test-lists-downloads__item"
										key={ getCardKey( card ) }
									>
										<RichText
											tagName="div"
											className="body1-sbold test-lists-downloads__item-title"
											value={ card.title }
											onChange={ ( value ) =>
												updateCards( index, 'title', value )
											}
											placeholder={ __(
												'Add Resources...',
												'ambrygen-web'
											) }
										/>

										<div className="test-lists-downloads__links">
											{ ( card.pdfLinks || [] ).map(
												( link, linkIndex ) => (
													<div
														key={ getPdfLinkKey( link ) }
														className="resources__link"
													>
														<span className="resources__link-label">
															{ link.label ||
																( linkIndex === 0
																	? __(
																			'Link 1',
																			'ambrygen-web'
																	  )
																	: __(
																			'Link 2',
																			'ambrygen-web'
																	  ) ) }
														</span>
														<span className="resources__download-icon-placeholder">
															<img src={ downloadIcon } alt="" />
														</span>
													</div>
												)
											) }

											{ ( card.pdfLinks || [] ).length === 0 && (
												<div className="resources__link">
													{ __( 'No Links', 'ambrygen-web' ) }
												</div>
											) }
										</div>
									</div>
								) ) }
							</div>
						</div>
					</div>

					<div className="resources__orgs-group">
						<div className="resources__card">
							<RichText
								tagName="h3"
								className="subtitle2-sbold resources__card-title text-center"
								value={ orgTitle }
								onChange={ ( value ) =>
									setAttributes( { orgTitle: value } )
								}
								placeholder={ __(
									'Add Title...',
									'ambrygen-web'
								) }
							/>

							<div className="resources__card-logo-grid resources__card-logo-grid--3-col">
								{ collaboratorIds.length === 0 &&
									( ! enableCustomCollaborators ||
										customCollaborators.length === 0 ) && (
										<div className="resources__logo-placeholder">
											{ __(
												'Select Organizations in the sidebar',
												'ambrygen-web'
											) }
										</div>
									) }

								{ collaboratorIds.map( ( id ) => {
									const term = collaboratorOptions.find(
										( item ) => item.id === id
									);

									return (
										<div key={ id } className="resources__card-logo-link">
											{ term?.name || id }
										</div>
									);
								} ) }

								{ enableCustomCollaborators &&
									customCollaborators.map( ( collab, index ) =>
										collab.url ? (
											<div
												key={ getCollaboratorKey( collab ) }
												className="resources__card-logo-link"
											>
												{ collab.imageUrl || defaultImages?.placeholder?.url ? (
													<img
														src={
															collab.imageUrl ||
															defaultImages.placeholder.url
														}
														alt={
															collab.imageAlt ||
															defaultImages?.placeholder?.alt ||
															''
														}
													/>
												) : (
													collab.name ||
													__(
														'Custom Collaborator',
														'ambrygen-web'
													)
												) }
											</div>
										) : null
									) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
