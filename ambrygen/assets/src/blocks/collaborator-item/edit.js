import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { Button, ComboboxControl, Spinner } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { DEFAULT_IMAGES } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { termId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const defaults = DEFAULT_IMAGES();
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ isSearching, setIsSearching ] = useState( false );
	const [ searchInput, setSearchInput ] = useState( '' );

	// Fetch terms based on search input
	useEffect( () => {
		if ( searchInput.length < 2 ) {
			setSearchResults( [] );
			return;
		}

		let isMounted = true;
		const timeoutId = setTimeout( async () => {
			setIsSearching( true );
			try {
				const fetchedTerms = await apiFetch( {
					path: `/wp/v2/collaborator?context=edit&search=${ encodeURIComponent(
						searchInput
					) }&per_page=20&orderby=name&order=asc`,
				} );

				if ( isMounted ) {
					setSearchResults( fetchedTerms );
				}
			} catch ( error ) {
				console.error( 'Error fetching collaborators:', error );
			} finally {
				if ( isMounted ) {
					setIsSearching( false );
				}
			}
		}, 300 ); // 300ms debounce

		return () => {
			isMounted = false;
			clearTimeout( timeoutId );
		};
	}, [ searchInput ] );

	// Fetch the selected term's data specifically if it's not in current results
	const { selectedTerm, hasResolved } = useSelect(
		( select ) => {
			if ( ! termId ) {
				return { selectedTerm: null, hasResolved: true };
			}
			const { getEntityRecord, hasFinishedResolution } = select( 'core' );
			return {
				selectedTerm: getEntityRecord(
					'taxonomy',
					'collaborator',
					termId
				),
				hasResolved: hasFinishedResolution( 'getEntityRecord', [
					'taxonomy',
					'collaborator',
					termId,
				] ),
			};
		},
		[ termId ]
	);

	const selectedIds = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const parentId = blockEditor.getBlockRootClientId( clientId );
			const siblings = blockEditor.getBlocks( parentId );

			return siblings
				.map( ( block ) => Number( block.attributes?.termId || 0 ) )
				.filter( ( id ) => id > 0 && id !== Number( termId || 0 ) );
		},
		[ clientId, termId ]
	);

	const postTypeArchives = useSelect( ( select ) => {
		const { getPostType } = select( 'core' );
		const postTypes = [
			{
				slug: 'publication',
				label: __(
					'View our Peer-Reviewed Publications',
					'ambrygen-web'
				),
			},
			{
				slug: 'presentation',
				label: __( 'View our Scientific Presentations', 'ambrygen-web' ),
			},
			{
				slug: 'poster',
				label: __( 'View our Scientific Posters', 'ambrygen-web' ),
			},
		];

		return postTypes
			.map( ( postType ) => {
				const record = getPostType( postType.slug );

				if ( ! record?.viewable || ! record?.slug ) {
					return null;
				}

				return {
					label: postType.label,
					url: `/${ record.slug }/?collaborator=${ selectedTerm?.slug || '' }`,
				};
			} )
			.filter( Boolean );
	}, [ selectedTerm?.slug ] );

	const imageUrl = useSelect(
		( select ) => {
			if ( ! selectedTerm?.meta?.term_image ) {
				return '';
			}
			const media = select( 'core' ).getMedia(
				selectedTerm.meta.term_image
			);
			return media?.source_url || '';
		},
		[ selectedTerm ]
	);

	// Combine search results with currently selected term to ensure it's always an option
	const allAvailableTerms = [ ...searchResults ];
	if ( selectedTerm && ! allAvailableTerms.find( ( t ) => t.id === selectedTerm.id ) ) {
		allAvailableTerms.push( selectedTerm );
	}

	const options = allAvailableTerms
		.filter( ( term ) => ! selectedIds.includes( term.id ) )
		.map( ( term ) => ( {
			label: decodeEntities( term.name ),
			value: String( term.id ),
		} ) );

	const collaboratorName = selectedTerm?.name
		? decodeEntities( selectedTerm.name )
		: '';

	const collaboratorDescription = selectedTerm?.description
		? decodeEntities( selectedTerm.description )
		: '';

	const collaboratorWebsite = selectedTerm?.meta?.link
		? selectedTerm.meta.link
		: '';
	const previewImage = imageUrl || defaults?.placeholder?.url || '';

	return (
		<div
			{ ...useBlockProps( {
				className: 'timeline-block__item collaborator-card',
			} ) }
		>
			{ ! hasResolved && <Spinner /> }

			{ ! termId && (
				<ComboboxControl
					label={ __( 'Select Collaborator', 'ambrygen-web' ) }
					value=""
					options={ [
						{
							label: __(
								'Search for a collaborator...',
								'ambrygen-web'
							),
							value: '',
						},
						...options,
					] }
					onFilterValueChange={ ( value ) => setSearchInput( value ) }
					help={
						(() => {
							if ( isSearching ) {
								return (
									<div style={ { display: 'flex', gap: '8px', alignItems: 'center' } }>
										<Spinner />
										{ __( 'Searching...', 'ambrygen-web' ) }
									</div>
								);
							}
							if ( searchInput.length === 0 ) {
								return __( 'Type a name to search for collaborators...', 'ambrygen-web' );
							}
							if ( searchInput.length < 2 ) {
								return __( 'Please type at least 2 characters to search.', 'ambrygen-web' );
							}
							return undefined;
						})()
					}
					onChange={ ( value ) =>
						setAttributes( {
							termId: parseInt( value, 10 ) || null,
						} )
					}
				/>
			) }

			{ termId && selectedTerm && (
				<>
					<div className="timeline-block__badge-col collaborator-card__badge-col">
						<div className="timeline-block__badge"></div>
					</div>

					<div className="timeline-block__content-card collaborator-card__layout">
						<div className="timeline-block__image collaborator-card__media">
							<img
								src={ previewImage }
								alt={ collaboratorName }
								className="timeline-block__image-element collaborator-card__image"
							/>
						</div>

						<div className="timeline-block__text-content collaborator-card__content">
							<div className="subtitle1-sbold mb-0 timeline-block__text-title collaborator-card__title">
								{ collaboratorName }
							</div>

							{ collaboratorDescription && (
								<>
									<div
										className="is-style-gl-s12"
										aria-hidden="true"
									></div>
									<div className="text-md-regular collaborator-card__description">
									{ collaboratorDescription }
									</div>
								</>
							) }

							{ postTypeArchives.length > 0 && (
								<>
									<div
										className="is-style-gl-s12"
										aria-hidden="true"
									></div>
									<ul className="collaborator-card__links">
										{ postTypeArchives.map( ( link ) => (
											<li key={ link.label }>
												<a
													href={ link.url }
													className="site-btn is-style-site-text-btn has-right-arrow"
													onClick={ ( event ) =>
														event.preventDefault()
													}
												>
													{ link.label }
												</a>
											</li>
										) ) }
									</ul>
								</>
							) }

							{ collaboratorWebsite && (
								<>
									<div
										className="is-style-gl-s12"
										aria-hidden="true"
									></div>
									<div className="collaborator-card__website">
										<a
											href={ collaboratorWebsite }
											className="site-btn is-style-site-text-btn has-right-arrow"
											onClick={ ( event ) =>
												event.preventDefault()
											}
										>
											{ collaboratorWebsite }
										</a>
									</div>
								</>
							) }

						</div>
					</div>

					<div className="collaborator-card__actions actions-button">
						<Button
							isSecondary
							onClick={ () => setAttributes( { termId: null } ) }
						>
							{ __( 'Change Collaborator', 'ambrygen-web' ) }
						</Button>

						<Button
							isDestructive
							onClick={ () => removeBlock( clientId ) }
						>
							{ __( 'Remove Collaborator', 'ambrygen-web' ) }
						</Button>
					</div>
				</>
			) }
		</div>
	);
}
