import {
	useBlockProps,
	InspectorControls,
	LinkControl,
	RichText,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

import { __ } from '@wordpress/i18n';
import { ImageUploader } from '../_shared/components';

export default function Edit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const { removeBlock } = useDispatch( 'core/block-editor' );

	const {
		termlinktext,
		icon = {},
		title = '',
		description = '',
		links = [],
		selectedTerm = null,
	} = attributes;

	const variation = context?.[ 'ambrygen/variation' ];

	const posts = useSelect(
		( select ) => {
			if ( variation !== 'variation-3' ) {
				return null;
			}
			return select( 'core' ).getEntityRecords(
				'postType',
				'blood-test',
				{
					per_page: -1,
				}
			);
		},
		[ variation ]
	);

	const selectedPostData = useSelect(
		( select ) => {
			if ( variation !== 'variation-3' || ! attributes.selectedPost ) {
				return null;
			}
			return select( 'core' ).getEntityRecord(
				'postType',
				'blood-test',
				attributes.selectedPost
			);
		},
		[ variation, attributes.selectedPost ]
	);

	useEffect( () => {
		if ( variation !== 'variation-3' ) {
			return;
		}
		if ( attributes.selectedPost ) {
			return;
		}
		if ( ! posts?.length ) {
			return;
		}

		const firstPost = posts[ 0 ];
		setAttributes( {
			selectedPost: firstPost.id,
			title: decodeEntities( firstPost.title.rendered ),
		} );
	}, [ variation, attributes.selectedPost, posts, setAttributes ] );

	const terms = useSelect(
		( select ) => {
			if ( variation !== 'our-testing-menu' ) {
				return null;
			}
			return select( 'core' ).getEntityRecords( 'taxonomy', 'test_type', {
				per_page: -1,
			} );
		},
		[ variation ]
	);

	const selectedTermIds = useSelect(
		( select ) => {
			if ( variation !== 'our-testing-menu' ) {
				return [];
			}
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const siblings = blockEditor.getBlocks( parentId );

			return siblings
				.map( ( block ) =>
					Number( block.attributes?.selectedTerm || 0 )
				)
				.filter(
					( id ) => id > 0 && id !== Number( selectedTerm || 0 )
				);
		},
		[ variation, clientId, selectedTerm ]
	);

	const { selectedTermData, imageUrl } = useSelect(
		( select ) => {
			if ( ! selectedTerm ) {
				return { selectedTermData: null, imageUrl: null };
			}

			const term = select( 'core' ).getEntityRecord(
				'taxonomy',
				'test_type',
				selectedTerm
			);
			let sourceUrl = null;

			if ( term?.meta?.term_image ) {
				const media = select( 'core' ).getMedia( term.meta.term_image );
				sourceUrl = media?.source_url || null;
			}

			return {
				selectedTermData: term ?? null,
				imageUrl: sourceUrl,
			};
		},
		[ selectedTerm ]
	);

	useEffect( () => {
		if ( variation !== 'our-testing-menu' || ! selectedTermData?.name ) {
			return;
		}

		const liveTermName = decodeEntities( selectedTermData.name );
		if ( title !== liveTermName ) {
			setAttributes( { title: liveTermName } );
		}
	}, [ variation, selectedTermData, title, setAttributes ] );

	const onSelectTerm = ( termId ) => {
		if ( ! terms ) {
			return;
		}

		const term = terms.find( ( t ) => t.id === Number( termId ) );

		if ( ! term ) {
			return;
		}

		setAttributes( {
			selectedTerm: term.id,
			title: decodeEntities( term.name ),
			category: decodeEntities( term.slug ),
			termData: {
				count: term.count,
				image: term.meta?.term_image || '',
			},
		} );
	};

	const updateLink = ( index, field, value ) => {
		const updated = [ ...links ];
		updated[ index ] = {
			...updated[ index ],
			[ field ]: value,
		};

		setAttributes( { links: updated } );
	};

	const addLink = () => {
		setAttributes( {
			links: [
				...links,
				{
					label: '',
					url: '',
					target: '',
					rel: '',
				},
			],
		} );
	};

	const removeLink = ( index ) => {
		const updated = links.filter( ( _, i ) => i !== index );
		setAttributes( { links: updated } );
	};

	const VARIANT_CLASS_MAP = {
		'icon-grids': 'info-list__row info-list-block',
		'our-testing-menu': 'item-card',
		'variation-3': 'info-list__col',
		'variation-4': 'icon-grid__item',
	};

	const blockProps = useBlockProps( {
		className: VARIANT_CLASS_MAP[ variation ] || '',
	} );

	// const blockProps = useBlockProps( {
	// 	className: `${
	// 		variation === 'our-testing-menu' ? ' item-card' : 'info-list__col'
	// 	}`,
	// } );
	const selectedTermName = selectedTermData?.name
		? decodeEntities( selectedTermData.name )
		: title;
	const selectedTermLink = selectedTermData?.link || '#';
	const availableTerms = terms
		? terms.filter( ( term ) => ! selectedTermIds.includes( term.id ) )
		: null;
	const hasAvailableTerms = Boolean( availableTerms?.length );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					{ variation === 'our-testing-menu' && (
						<TextControl
							label={ __( 'Button Text', 'ambrygen-web' ) }
							value={ termlinktext }
							onChange={ ( value ) =>
								setAttributes( {
									termlinktext: value || 'View Test',
								} )
							}
							placeholder={ __( 'View Tests', 'ambrygen-web' ) }
						/>
					) }

					{ variation !== 'our-testing-menu' && (
						<>
							<ImageUploader
								url={ icon?.url }
								label="Icon"
								onSelect={ ( media ) =>
									setAttributes( {
										icon: {
											id: media.id,
											url: media.url,
											alt: media.alt || media.title,
											sizes: media.sizes || {},
										},
									} )
								}
								onRemove={ () => setAttributes( { icon: {} } ) }
							/>

							{ links.map( ( link, i ) => (
								<div
									key={
										link._key || link.url || link.label || i
									}
									style={ {
										marginTop: 12,
										padding: 12,
										border: '1px solid #ddd',
										borderRadius: 4,
									} }
								>
									<TextControl
										label={ `Link ${ i + 1 } Label` }
										value={ link.label }
										onChange={ ( val ) =>
											updateLink( i, 'label', val )
										}
									/>

									<LinkControl
										value={ {
											url: link.url || '',
											opensInNewTab:
												link.target === '_blank',
										} }
										onChange={ ( newLink ) => {
											const updated = [ ...links ];

											updated[ i ] = {
												...updated[ i ],
												url: newLink.url,
												target: newLink.opensInNewTab
													? '_blank'
													: '',
												rel: newLink.opensInNewTab
													? 'noopener noreferrer'
													: '',
											};

											setAttributes( { links: updated } );
										} }
									/>

									<Button
										onClick={ () => removeLink( i ) }
										isDestructive
										style={ { marginTop: 8 } }
									>
										Remove Link
									</Button>
								</div>
							) ) }

							<Button
								onClick={ addLink }
								variant="secondary"
								style={ { marginTop: 12 } }
							>
								Add Link
							</Button>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ variation === 'variation-4' && (
					<>
						{ icon?.url && (
							<div className="icon-grid__icon">
								<img src={ icon.url } alt={ icon.alt || '' } />
							</div>
						) }

						<RichText
							tagName="h3"
							className="icon-grid__item-title text-xl-semibold mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder="Add Title..."
						/>

						<div
							className="is-style-gl-s8"
							aria-hidden="true"
						></div>

						<RichText
							tagName="p"
							className="icon-grid__item-description text-md-reg"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder="Add Description..."
						/>

						<div
							className="is-style-gl-s20"
							aria-hidden="true"
						></div>

						{ links?.[ 0 ]?.url && links?.[ 0 ]?.label && (
							<a
								href={ links[ 0 ].url }
								target={ links[ 0 ].target || undefined }
								rel={ links[ 0 ].rel || undefined }
								className="site-btn is-style-site-text-btn has-icon"
								onClick={ ( e ) => e.preventDefault() }
							>
								{ links[ 0 ].label }
							</a>
						) }
					</>
				) }

				{ /* OUR TESTING MENU MODE */ }
				{ variation === 'our-testing-menu' && (
					<>
						{ /* Show Dropdown directly when no term selected */ }
						{ ! selectedTerm && (
							<>
								{ ! terms && <Spinner /> }

								{ availableTerms && (
									<SelectControl
										label="Select Test Type"
										value=""
										options={ [
											...( hasAvailableTerms
												? [
														{
															label: 'Select Test Type',
															value: '',
														},
														...availableTerms.map(
															( term ) => ( {
																label: decodeEntities(
																	term.name
																),
																value: term.id,
															} )
														),
												  ]
												: [
														{
															label: 'No test types available',
															value: '',
														},
												  ] ),
										] }
										disabled={ ! hasAvailableTerms }
										onChange={ ( value ) => {
											onSelectTerm( value );
										} }
									/>
								) }
							</>
						) }

						{ /* Selected Preview */ }
						{ Boolean( selectedTerm ) && (
							<>
								{ imageUrl && (
									<div className="item-card__icon">
										<img src={ imageUrl } alt="" />
									</div>
								) }

								<div className="item-card__content">
									<div className="item-card__info">
										<div className="item-card__category body2-medium">
											{ selectedTermName }
										</div>

										{ selectedTermData?.count !==
											undefined &&
											selectedTermData?.count !==
												null && (
												<div className="item-card__title subtitle2-sbold">
													{ selectedTermData.count }{ ' ' }
													Tests
												</div>
											) }
									</div>
									<a
										className="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
										href={ selectedTermLink }
										onClick={ ( e ) => e.preventDefault() }
									>
										{ termlinktext ||
											__( 'View Tests', 'ambrygen-web' ) }
									</a>
									<div
										className="is-style-gl-s24"
										aria-hidden="true"
									></div>
									<div className="info-list__actions actions-button">
										<Button
											isSecondary
											onClick={ () => {
												setAttributes( {
													selectedTerm: 0,
												} );
											} }
										>
											Change
										</Button>

										<Button
											isDestructive
											onClick={ () =>
												removeBlock( clientId )
											}
										>
											Remove
										</Button>
									</div>
								</div>
							</>
						) }
					</>
				) }

				{ variation === 'variation-3' && (
					<div className="features-tabs__card">
						{ ! attributes.selectedPost || ! selectedPostData ? (
							<div style={ { padding: 20, textAlign: 'center' } }>
								{ ! posts ? <Spinner /> : 'No posts found' }
							</div>
						) : null }

						{ attributes.selectedPost && selectedPostData ? (
							<>
								<div className="features-tabs__content-head">
									<div className="features-tabs__category body2-semibold">
										{ attributes.category || 'Category' }
									</div>
									<div className="heading-5 features-tabs__card-title">
										<RichText
											tagName="span"
											value={
												title ||
												decodeEntities(
													selectedPostData.title
														.rendered
												)
											}
											onChange={ ( value ) =>
												setAttributes( {
													title: value,
												} )
											}
											placeholder="Add Title..."
										/>
										<div
											className={ `badge badge--${
												attributes.badgeColor || 'blue'
											}` }
										>
											<i className="badge__dot"></i>
											<RichText
												tagName="span"
												value={ attributes.badgeText }
												onChange={ ( val ) =>
													setAttributes( {
														badgeText: val,
													} )
												}
												placeholder="Badge Text"
											/>
										</div>
									</div>
								</div>
								<a
									className="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up"
									href={ selectedPostData?.link || '#' }
								>
									View Test
								</a>
								<div
									className="info-list__actions actions-button"
									style={ { marginTop: 16 } }
								>
									<Button
										isDestructive
										onClick={ () =>
											removeBlock( clientId )
										}
									>
										Remove
									</Button>
								</div>
							</>
						) : null }
					</div>
				) }

				{ /* DEFAULT VARIATION MODE */ }
				{ variation !== 'our-testing-menu' &&
					variation !== 'variation-4' &&
					variation !== 'variation-3' && (
						<div className="info-list__card">
							<div className="info-list__image">
								{ icon?.url && (
									<img
										src={ icon.url }
										alt={ icon.alt || '' }
									/>
								) }
							</div>

							<div className="info-list__content">
								<RichText
									tagName="div"
									className="subtitle1-sbold info-list__title"
									value={ title }
									onChange={ ( value ) =>
										setAttributes( { title: value } )
									}
									placeholder={ __(
										'Add Title…',
										'ambrygen-web'
									) }
								/>

								<div className="is-style-gl-s8"></div>

								<RichText
									tagName="p"
									className="info-list__description text-md-reg"
									value={ description }
									onChange={ ( value ) =>
										setAttributes( { description: value } )
									}
									placeholder={ __(
										'Add Description…',
										'ambrygen-web'
									) }
								/>

								<div
									className="is-style-gl-s16"
									aria-hidden="true"
								></div>

								<div className="info-list__links">
									{ links.map(
										( link, i ) =>
											link.label &&
											link.url && (
												<div
													key={
														link._key ||
														link.url ||
														i
													}
													className="info-list__link-col text-md-Semibold"
												>
													<a
														href={ link.url }
														target={
															link.target ||
															undefined
														}
														rel={
															link.rel ||
															undefined
														}
														className="info-list__link"
													>
														{ link.label }
													</a>
												</div>
											)
									) }
								</div>
							</div>
						</div>
					) }
			</div>
		</>
	);
}
