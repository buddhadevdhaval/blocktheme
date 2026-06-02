import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	FormTokenField,
	Notice,
	PanelBody,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import {
	CtaButtonField,
	ItemHeader,
	TagSelector,
} from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		title,
		headingTag,
		variation = 'split-view',
		selectAllCollaborators = true,
		collaboratorIds = [],
	} = attributes;
	const {
		insertBlock,
		removeBlocks,
		replaceInnerBlocks,
		updateBlockAttributes,
	} = useDispatch( 'core/block-editor' );

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `link-list-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const collaboratorQuery = useMemo(
		() => ( {
			per_page: 100,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
			_fields: 'id,name,meta',
		} ),
		[]
	);

	const { collaboratorTerms, isResolvingTerms, hasResolvedTerms } = useSelect(
		( select ) => {
			if ( variation !== 'grid-view' ) {
				return {
					collaboratorTerms: [],
					isResolvingTerms: false,
					hasResolvedTerms: true,
				};
			}

			const core = select( 'core' );

			return {
				collaboratorTerms:
					core.getEntityRecords(
						'taxonomy',
						'collaborator',
						collaboratorQuery
					) || [],
				isResolvingTerms: core.isResolving( 'getEntityRecords', [
					'taxonomy',
					'collaborator',
					collaboratorQuery,
				] ),
				hasResolvedTerms: core.hasFinishedResolution(
					'getEntityRecords',
					[ 'taxonomy', 'collaborator', collaboratorQuery ]
				),
			};
		},
		[ variation, collaboratorQuery ]
	);
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	const variantPreviewItems = useMemo(
		() => [
			{
				label: __( 'Split View', 'ambrygen-web' ),
				value: 'split-view',
				image: `data:image/svg+xml;utf8,${ encodeURIComponent(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 180"><rect width="280" height="180" rx="16" fill="#f4f7f8"/><rect x="20" y="24" width="90" height="12" rx="6" fill="#8aa6b8"/><rect x="20" y="46" width="104" height="26" rx="8" fill="#0e5f7f"/><rect x="20" y="90" width="92" height="10" rx="5" fill="#b7c8d3"/><rect x="20" y="108" width="98" height="10" rx="5" fill="#b7c8d3"/><rect x="150" y="28" width="110" height="22" rx="10" fill="#ffffff"/><rect x="150" y="60" width="110" height="22" rx="10" fill="#ffffff"/><rect x="150" y="92" width="110" height="22" rx="10" fill="#ffffff"/><rect x="150" y="124" width="110" height="22" rx="10" fill="#ffffff"/></svg>'
				) }`,
			},
			{
				label: __( 'Grid View', 'ambrygen-web' ),
				value: 'grid-view',
				image: `data:image/svg+xml;utf8,${ encodeURIComponent(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 180"><rect width="280" height="180" rx="16" fill="#f4f7f8"/><rect x="20" y="24" width="90" height="12" rx="6" fill="#8aa6b8"/><rect x="20" y="46" width="104" height="26" rx="8" fill="#0e5f7f"/><rect x="20" y="90" width="112" height="26" rx="10" fill="#ffffff"/><rect x="148" y="90" width="112" height="26" rx="10" fill="#ffffff"/><rect x="20" y="124" width="112" height="26" rx="10" fill="#ffffff"/><rect x="148" y="124" width="112" height="26" rx="10" fill="#ffffff"/></svg>'
				) }`,
			},
		],
		[]
	);

	const collaboratorOptions = collaboratorTerms || [];
	const linkedCollaboratorTerms = collaboratorOptions.filter(
		( term ) => typeof term?.meta?.link === 'string' && term.meta.link.trim()
	);
	const visibleCollaboratorTerms =
		variation === 'grid-view' && selectAllCollaborators
			? linkedCollaboratorTerms.filter(
					( term ) => ! collaboratorIds.includes( term.id )
			  )
			: variation === 'grid-view' && collaboratorIds.length
			? linkedCollaboratorTerms.filter( ( term ) =>
					collaboratorIds.includes( term.id )
			  )
			: [];
	const suggestions = linkedCollaboratorTerms.map( ( term ) => term.name );
	const linkItemBlocks = innerBlocks.filter(
		( block ) => block.name === 'ambrygen/link-item'
	);
	const selectedCollaboratorNames = collaboratorIds
		.map( ( id ) => {
			const term = linkedCollaboratorTerms.find(
				( item ) => item.id === id
			);
			return term ? term.name : null;
		} )
		.filter( Boolean );

	const onCollaboratorsChange = ( names ) => {
		const newIds = names
			.map( ( name ) => {
				const term = linkedCollaboratorTerms.find(
					( item ) => item.name === name
				);
				return term ? term.id : null;
			} )
			.filter( Boolean );

		setAttributes( { collaboratorIds: newIds } );
	};

	const addLinkItem = () => {
		insertBlock(
			createBlock( 'ambrygen/link-item', {
				cta: {
					text: '',
					url: '',
					target: '',
					rel: '',
				},
			} ),
			undefined,
			clientId,
			false
		);
	};

	const updateLinkItem = ( blockClientId, cta ) => {
		updateBlockAttributes( blockClientId, { cta } );
	};

	const removeLinkItem = ( blockClientId ) => {
		if ( linkItemBlocks.length <= 1 ) {
			return;
		}

		removeBlocks( blockClientId, false );
	};

	const moveLinkItem = ( index, direction ) => {
		const nextIndex = index + direction;

		if ( nextIndex < 0 || nextIndex >= linkItemBlocks.length ) {
			return;
		}

		const reorderedItems = [ ...linkItemBlocks ];
		[ reorderedItems[ index ], reorderedItems[ nextIndex ] ] = [
			reorderedItems[ nextIndex ],
			reorderedItems[ index ],
		];

		replaceInnerBlocks(
			clientId,
			[
				...innerBlocks.filter(
					( block ) => block.name !== 'ambrygen/link-item'
				),
				...reorderedItems,
			],
			false
		);
	};

	const blockProps = useBlockProps( {
		className: [
			'block-layout download-list',
			variation === 'grid-view' ? 'variation-grid-view' : '',
		]
			.filter( Boolean )
			.join( ' ' ),
		id: anchor || blockId,
	} );

	const ITEMS_ALLOWED_BLOCKS = [
		'ambrygen/link-item',
		// 'core/paragraph',
		'core/buttons',
		'core/button',
		'core/spacer',
	];

	const ITEMS_TEMPLATE = [
		[ 'ambrygen/link-item' ],
	];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<div className="layout-variant-selector">
						{ variantPreviewItems.map( ( item ) => (
							<button
								key={ item.value }
								type="button"
								className={ `variant-button ${
									variation === item.value ? 'is-selected' : ''
								}` }
								aria-pressed={ variation === item.value }
								onClick={ () =>
									setAttributes( { variation: item.value } )
								}
							>
								<img src={ item.image } alt="" />
								<span>{ item.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
						onChange={ ( val ) => setAttributes( { headingTag: val } ) }
					/>
				</PanelBody>

				{ variation === 'split-view' && (
					<PanelBody
						title={ __( 'Links', 'ambrygen-web' ) }
						initialOpen={ true }
					>
						{ linkItemBlocks.map( ( block, index ) => (
							<div
								key={ block.clientId }
								className="link-list__inspector-link"
							>
								<ItemHeader
									index={ index }
									label={ block.attributes?.cta?.text }
									total={ linkItemBlocks.length }
									prefix={ __( 'LINK', 'ambrygen-web' ) }
									onMove={ ( itemIndex, direction ) =>
										moveLinkItem( itemIndex, direction )
									}
									onRemove={ ( itemIndex ) =>
										removeLinkItem(
											linkItemBlocks[ itemIndex ].clientId
										)
									}
									minCount={ 1 }
								/>

								<CtaButtonField
									label=""
									value={ block.attributes?.cta || {} }
									onChange={ ( newValue ) =>
										updateLinkItem(
											block.clientId,
											{
												...( block.attributes?.cta || {} ),
												...newValue,
											}
										)
									}
									showVariant={ false }
									textLabel={ __( 'Link Text', 'ambrygen-web' ) }
								/>
							</div>
						) ) }

						<Button variant="primary" onClick={ addLinkItem }>
							{ __( 'Add New Link', 'ambrygen-web' ) }
						</Button>
					</PanelBody>
				) }

				{ variation === 'grid-view' && (
					<PanelBody
						title={ __( 'Collaborators', 'ambrygen-web' ) }
						initialOpen={ true }
					>
						<ToggleControl
							label={ __( 'Select all collaborators', 'ambrygen-web' ) }
							checked={ selectAllCollaborators }
							onChange={ ( value ) =>
								setAttributes( {
									selectAllCollaborators: value,
									collaboratorIds: [],
								} )
							}
						/>
						{ selectAllCollaborators ? (
							<FormTokenField
								label={ __( 'Remove collaborators', 'ambrygen-web' ) }
								value={ selectedCollaboratorNames }
								suggestions={ suggestions }
								onChange={ onCollaboratorsChange }
								placeholder={ __(
									'Remove collaborators...',
									'ambrygen-web'
								) }
							/>
						) : (
							<FormTokenField
								label={ __( 'Collaborators', 'ambrygen-web' ) }
								value={ selectedCollaboratorNames }
								suggestions={ suggestions }
								onChange={ onCollaboratorsChange }
								placeholder={ __(
									'Select collaborators...',
									'ambrygen-web'
								) }
							/>
						) }
					</PanelBody>
				) }

			</InspectorControls>

			<div className="download-list__inner">
				<div className="download-list__header-area mb-24">
					<RichText
						tagName={ headingTag }
						className="download-list__title heading-3 block-title mb-0"
						value={ title }
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</div>

				<div className="download-list__items">
					{ variation === 'grid-view' ? (
						isResolvingTerms ? (
							<Spinner />
						) : visibleCollaboratorTerms.length ? (
							visibleCollaboratorTerms.map( ( term ) => (
								<div
									key={ term.id }
									className="download-list__grid-item"
								>
									<a
										href={ term.meta.link }
										className="download-list__grid-link"
										target="_blank"
										rel="noopener noreferrer"
										aria-label={ sprintf(
											/* translators: %s: collaborator name. */
											__(
												'%s (opens in a new tab)',
												'ambrygen-web'
											),
											term.name
										) }
										onClick={ ( event ) => event.preventDefault() }
									>
										{ term.name }
									</a>
								</div>
							) )
						) : hasResolvedTerms ? (
							<Notice status="warning" isDismissible={ false }>
								{ __( 'No collaborator terms found.', 'ambrygen-web' ) }
							</Notice>
						) : (
							<Spinner />
						)
					) : (
						<InnerBlocks
							allowedBlocks={ ITEMS_ALLOWED_BLOCKS }
							template={ ITEMS_TEMPLATE }
							templateLock={ false }
							renderAppender={ false }
						/>
					) }
				</div>
			</div>
		</div>
	);
}
