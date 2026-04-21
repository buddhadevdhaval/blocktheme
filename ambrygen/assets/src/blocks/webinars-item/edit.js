import { useBlockProps } from '@wordpress/block-editor';
import { Spinner, Button, Placeholder, TextControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { postId } = attributes;
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const { removeBlock } = useDispatch( 'core/block-editor' );

	const webinars = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'webinar', {
			per_page: -1,
			orderby: 'title',
			post_status: 'publish',
			_embed: true,
		} );
	}, [] );

	// Filter webinars based on search term
	const filteredWebinars = useMemo( () => {
		if ( ! webinars ) return [];
		if ( ! searchTerm ) return webinars.slice( 0, 10 ); // Show first 10 by default
		return webinars.filter( ( post ) =>
			post.title.rendered.toLowerCase().includes( searchTerm.toLowerCase() )
		).slice( 0, 10 ); // Limit results for performance
	}, [ webinars, searchTerm ] );

	// Get selected webinar details
	const selectedWebinar = useSelect(
		( select ) => {
			if ( ! postId ) return null;
			return select( 'core' ).getEntityRecord( 'postType', 'webinar', postId, { _embed: true } );
		},
		[ postId ]
	);

	const blockProps = useBlockProps( { className: 'webinars-item' } );
	const featuredImage = selectedWebinar?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url;

	return (
		<div { ...blockProps }>
			{ ! webinars && <Spinner /> }

			{ webinars && ! postId && (
				<Placeholder
					icon="video-alt"
					label={ __( 'Webinar Search', 'ambrygen-web' ) }
					instructions={ __( 'Type to find a webinar and click to select.', 'ambrygen-web' ) }
				>
					<div className="webinars-search-container" style={{ width: '100%', minWidth: '300px' }}>
						<TextControl
							label={ __( 'Search Webinar Title', 'ambrygen-web' ) }
							value={ searchTerm }
							onChange={ setSearchTerm }
							placeholder={ __( 'e.g. Genetics...', 'ambrygen-web' ) }
							autoComplete="off"
						/>
						<div className="webinars-search-results" style={{ 
							maxHeight: '150px', 
							overflowY: 'auto', 
							border: '1px solid #ccc', 
							borderRadius: '4px',
							marginTop: '8px'
						}}>
							{ filteredWebinars.length === 0 && (
								<div style={{ padding: '8px', color: '#666' }}>{ __( 'No results found.', 'ambrygen-web' ) }</div>
							) }
							{ filteredWebinars.map( ( post ) => (
								<Button
									key={ post.id }
									isTertiary
									style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left', padding: '8px', height: 'auto', borderBottom: '1px solid #eee' }}
									onClick={ () => setAttributes( { postId: post.id } ) }
								>
									{ post.title.rendered }
								</Button>
							) ) }
						</div>
					</div>
				</Placeholder>
			) }

			{ postId && selectedWebinar && (
				<div className="webinars-item__preview-card event-carousel__card" style={{ cursor: 'default' }}>
					<div className="event-carousel__content">
						{ featuredImage && (
							<div className="event-carousel__image-wrap mb-16">
								<img src={ featuredImage } alt="" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
							</div>
						) }
						<div className="event-carousel__title-row">
							<h3 className="text-lg-semibold event-carousel__card-title mb-0">
								{ selectedWebinar.title.rendered }
							</h3>
						</div>
						<div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
							<Button isSmall variant="secondary" onClick={ () => { setAttributes( { postId: null } ); setSearchTerm(''); } }>
								{ __( 'Change', 'ambrygen-web' ) }
							</Button>
							<Button isSmall variant="tertiary" onClick={ () => removeBlock( clientId ) }>
								{ __( 'Remove', 'ambrygen-web' ) }
							</Button>
						</div>
					</div>
				</div>
			) }

			{ postId && ! selectedWebinar && <Spinner /> }
		</div>
	);
}
