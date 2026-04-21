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
		<div { ...useBlockProps( { className: 'collaborator-card' } ) }>
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
					<div className="collaborator-card__layout">
						<div className="collaborator-card__media">
							<img
								src={ previewImage }
								alt={ collaboratorName }
								className="collaborator-card__image"
							/>
						</div>

						<div className="collaborator-card__content">
							<div className="collaborator-card__title heading-5 mb-0">
								{ collaboratorName }
							</div>

							{ collaboratorDescription && (
								<div className="collaborator-card__description body1">
									{ collaboratorDescription }
								</div>
							) }

							{ collaboratorWebsite && (
								<div className="collaborator-card__website">
									<a
										href={ collaboratorWebsite }
										onClick={ ( event ) =>
											event.preventDefault()
										}
									>
										{ collaboratorWebsite }
									</a>
								</div>
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
