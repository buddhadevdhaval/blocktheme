import apiFetch from '../../blocks/_shared/api-fetch';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useState } from '@wordpress/element';
import {
	Button,
	CheckboxControl,
	Notice,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

const ALLOWED_POST_TYPES = [
	'genetic-testing',
	'marketing_material',
	'product_version',
];
const RESULTS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 400;
const PANEL_NAME = 'ambrygen-gene-selector-panel';
const DEFAULT_PANEL_NAME = 'taxonomy-panel-gene';
const { PluginDocumentSettingPanel } = window?.wp?.editPost || {};

function buildTermsPath( params ) {
	const query = new URLSearchParams();

	Object.entries( params ).forEach( ( [ key, value ] ) => {
		if (
			value === undefined ||
			value === null ||
			value === '' ||
			( Array.isArray( value ) && value.length === 0 )
		) {
			return;
		}

		if ( Array.isArray( value ) ) {
			query.set( key, value.join( ',' ) );
			return;
		}

		query.set( key, String( value ) );
	} );

	return `/wp/v2/gene?${ query.toString() }`;
}

function useDebouncedValue( value, delay ) {
	const [ debouncedValue, setDebouncedValue ] = useState( value );

	useEffect( () => {
		const timerId = window.setTimeout( () => {
			setDebouncedValue( value );
		}, delay );

		return () => window.clearTimeout( timerId );
	}, [ value, delay ] );

	return debouncedValue;
}

function GeneSelectorPanel() {
	const [ searchInput, setSearchInput ] = useState( '' );
	const debouncedSearch = useDebouncedValue(
		searchInput.trim(),
		SEARCH_DEBOUNCE_MS
	);
	const [ page, setPage ] = useState( 1 );
	const [ terms, setTerms ] = useState( [] );
	const [ totalPages, setTotalPages ] = useState( 1 );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState( '' );

	const { editPost } = useDispatch( 'core/editor' );
	const { removeEditorPanel } = useDispatch( 'core/edit-post' );

	const { postType, selectedGeneIds, selectedGenes, isSavingPost } =
		useSelect( ( select ) => {
			const editorStore = select( 'core/editor' );
			const coreStore = select( 'core' );
			const currentPostType = editorStore?.getCurrentPostType?.() || null;
			const editedGeneIds =
				editorStore?.getEditedPostAttribute?.( 'gene' ) || [];
			const normalizedGeneIds = Array.isArray( editedGeneIds )
				? editedGeneIds.map( ( id ) => Number( id ) ).filter( Boolean )
				: [];

			const selectedGeneTerms =
				normalizedGeneIds.length > 0
					? coreStore.getEntityRecords( 'taxonomy', 'gene', {
							include: normalizedGeneIds,
							per_page: normalizedGeneIds.length,
							hide_empty: false,
							_fields: 'id,name',
					  } )
					: [];

			return {
				postType: currentPostType,
				selectedGeneIds: normalizedGeneIds,
				selectedGenes: Array.isArray( selectedGeneTerms )
					? selectedGeneTerms
					: [],
				isSavingPost: editorStore?.isSavingPost?.() || false,
			};
		}, [] );

	useEffect( () => {
		if ( ALLOWED_POST_TYPES.includes( postType ) ) {
			removeEditorPanel?.( DEFAULT_PANEL_NAME );
		}
	}, [ postType, removeEditorPanel ] );

	useEffect( () => {
		setPage( 1 );
	}, [ debouncedSearch ] );

	useEffect( () => {
		if ( ! ALLOWED_POST_TYPES.includes( postType ) ) {
			return;
		}

		if ( ! debouncedSearch ) {
			setTerms( [] );
			setTotalPages( 1 );
			setIsLoading( false );
			setErrorMessage( '' );
			return;
		}

		let isCurrentRequest = true;

		async function loadTerms() {
			setIsLoading( true );
			setErrorMessage( '' );

			try {
				const requestPath = buildTermsPath( {
					per_page: RESULTS_PER_PAGE,
					page,
					hide_empty: false,
					orderby: 'name',
					order: 'asc',
					search: debouncedSearch,
					_fields: 'id,name',
					_locale: 'user',
				} );

				const response = await apiFetch( {
					path: requestPath,
					parse: false,
				} );

				const responseTerms = await response.json();
				const responseTotalPages = Number(
					response.headers.get( 'X-WP-TotalPages' ) || 1
				);

				if ( ! isCurrentRequest ) {
					return;
				}

				setTerms( Array.isArray( responseTerms ) ? responseTerms : [] );
				setTotalPages( Math.max( 1, responseTotalPages ) );
			} catch ( error ) {
				if ( ! isCurrentRequest ) {
					return;
				}

				setTerms( [] );
				setTotalPages( 1 );
				setErrorMessage(
					error?.message ||
						__( 'Unable to load genes right now.', 'ambrygen-web' )
				);
			} finally {
				if ( isCurrentRequest ) {
					setIsLoading( false );
				}
			}
		}

		loadTerms();

		return () => {
			isCurrentRequest = false;
		};
	}, [ debouncedSearch, page, postType ] );

	const selectedGeneMap = useMemo( () => {
		return new Map(
			selectedGenes.map( ( term ) => [ Number( term.id ), term ] )
		);
	}, [ selectedGenes ] );

	const mergedTerms = useMemo( () => {
		const seen = new Set();
		const combined = [];

		selectedGenes.forEach( ( term ) => {
			const id = Number( term.id );
			if ( ! seen.has( id ) ) {
				seen.add( id );
				combined.push( term );
			}
		} );

		terms.forEach( ( term ) => {
			const id = Number( term.id );
			if ( ! seen.has( id ) ) {
				seen.add( id );
				combined.push( term );
			}
		} );

		return combined;
	}, [ selectedGenes, terms ] );

	const toggleGene = ( termId ) => {
		const normalizedId = Number( termId );
		const nextIds = selectedGeneIds.includes( normalizedId )
			? selectedGeneIds.filter( ( id ) => id !== normalizedId )
			: [ ...selectedGeneIds, normalizedId ];

		editPost( { gene: nextIds } );
	};

	const clearSearch = () => {
		setSearchInput( '' );
		setPage( 1 );
	};

	if ( ! ALLOWED_POST_TYPES.includes( postType ) ) {
		return null;
	}

	if ( ! PluginDocumentSettingPanel ) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name={ PANEL_NAME }
			title={ __( 'Genes', 'ambrygen-web' ) }
			className="ambrygen-gene-selector-panel"
		>
			<TextControl
				label={ __( 'Search genes', 'ambrygen-web' ) }
				value={ searchInput }
				onChange={ setSearchInput }
				placeholder={ __(
					'Type a gene symbol like ZNF93',
					'ambrygen-web'
				) }
				help={
					debouncedSearch
						? __( 'Showing server search results.', 'ambrygen-web' )
						: __(
								'Start typing to search genes.',
								'ambrygen-web'
						  )
				}
			/>

			{ errorMessage ? (
				<Notice status="error" isDismissible={ false }>
					{ errorMessage }
				</Notice>
			) : null }

			{ selectedGeneIds.length > 0 ? (
				<div className="ambrygen-gene-selector-panel__selected">
					<div className="ambrygen-gene-selector-panel__label">
						{ __( 'Selected genes', 'ambrygen-web' ) } (
						{ selectedGeneIds.length })
					</div>
					<div className="ambrygen-gene-selector-panel__selected-list">
						{ selectedGeneIds.map( ( geneId ) => {
							const selectedGene = selectedGeneMap.get( geneId );
							const geneLabel = selectedGene?.name
								? decodeEntities( selectedGene.name )
								: `#${ geneId }`;

							return (
								<Button
									key={ geneId }
									variant="secondary"
									size="small"
									onClick={ () => toggleGene( geneId ) }
								>
									{ geneLabel }
								</Button>
							);
						} ) }
					</div>
				</div>
			) : null }

			<div className="ambrygen-gene-selector-panel__results">
				<div className="ambrygen-gene-selector-panel__label">
					{ debouncedSearch
						? __( 'Search results', 'ambrygen-web' )
						: __( 'Find genes', 'ambrygen-web' ) }
				</div>

				{ isLoading ? (
					<div className="ambrygen-gene-selector-panel__loading">
						<Spinner />
					</div>
				) : null }

				{ ! isLoading && mergedTerms.length === 0 ? (
					<p className="ambrygen-gene-selector-panel__empty">
						{ debouncedSearch
							? __(
									'No genes matched this search.',
									'ambrygen-web'
							  )
							: __(
									'Type at least one gene name to load results.',
									'ambrygen-web'
							  ) }
					</p>
				) : null }

				{ ! isLoading && mergedTerms.length > 0 ? (
					<div className="ambrygen-gene-selector-panel__list">
						{ mergedTerms.map( ( term ) => {
							const termId = Number( term.id );

							return (
								<CheckboxControl
									key={ termId }
									label={ decodeEntities( term.name ) }
									checked={ selectedGeneIds.includes(
										termId
									) }
									onChange={ () => toggleGene( termId ) }
								/>
							);
						} ) }
					</div>
				) : null }
			</div>

			{ debouncedSearch && totalPages > 1 ? (
				<div className="ambrygen-gene-selector-panel__pagination">
					<Button
						variant="secondary"
						onClick={ () => setPage( Math.max( 1, page - 1 ) ) }
						disabled={ page <= 1 || isLoading }
					>
						{ __( 'Previous', 'ambrygen-web' ) }
					</Button>
					<span>
						{ __( 'Page', 'ambrygen-web' ) } { page }{ ' ' }
						{ __( 'of', 'ambrygen-web' ) } { totalPages }
					</span>
					<Button
						variant="secondary"
						onClick={ () =>
							setPage( Math.min( totalPages, page + 1 ) )
						}
						disabled={ page >= totalPages || isLoading }
					>
						{ __( 'Next', 'ambrygen-web' ) }
					</Button>
				</div>
			) : null }

			{ debouncedSearch ? (
				<Button
					variant="tertiary"
					onClick={ clearSearch }
					disabled={ isLoading || isSavingPost }
				>
					{ __( 'Clear search', 'ambrygen-web' ) }
				</Button>
			) : null }
		</PluginDocumentSettingPanel>
	);
}

if ( window?.wp?.plugins?.registerPlugin ) {
	window?.wp?.plugins?.registerPlugin?.( 'ambrygen-gene-selector', {
		render: GeneSelectorPanel,
	} );
}
