import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { getThemeAssetUrl } from '../../utils/assets';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );

	const jobTypeIcon =
		context?.[ 'ambrygen/jobtypeicon' ]?.url ||
		getThemeAssetUrl( '/assets/src/images/clock-icon.svg' );

	const jobLocationIcon =
		context?.[ 'ambrygen/joblocationicon' ]?.url ||
		getThemeAssetUrl( '/assets/src/images/marker-pin-icon.svg' );

	// Fetch all jobs
	const jobs = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'jobs', {
				per_page: -1,
				post_status: 'publish',
				order: 'asc',
			} ),
		[]
	);

	// Fetch the selected post
	const selectedPost = useSelect(
		( select ) =>
			postId
				? select( 'core' ).getEntityRecord(
						'postType',
						'jobs',
						postId,
						{ _embed: true }
				  )
				: null,
		[ postId ]
	);

	// Get term IDs assigned to this post
	const jobTypeTermIds = useMemo(
		() => selectedPost?.job_type || [],
		[ selectedPost?.job_type ]
	);
	const jobLocationTermIds = useMemo(
		() => selectedPost?.job_location || [],
		[ selectedPost?.job_location ]
	);

	// Fetch full term objects for job_type
	const jobTypeTerms = useSelect(
		( select ) => {
			if ( ! jobTypeTermIds?.length ) {
				return [];
			}
			return select( 'core' ).getEntityRecords( 'taxonomy', 'job_type', {
				include: jobTypeTermIds,
				per_page: -1,
			} );
		},
		[ jobTypeTermIds ]
	);

	// Fetch full term objects for job_location
	const jobLocationTerms = useSelect(
		( select ) => {
			if ( ! jobLocationTermIds?.length ) {
				return [];
			}
			return select( 'core' ).getEntityRecords(
				'taxonomy',
				'job_location',
				{
					include: jobLocationTermIds,
					per_page: -1,
				}
			);
		},
		[ jobLocationTermIds ]
	);

	// Get post IDs already used in other blocks
	const selectedIds = useSelect(
		( select ) => {
			const rootClientId =
				select( 'core/block-editor' ).getBlockRootClientId( clientId );
			const siblingBlocks =
				select( 'core/block-editor' ).getBlocks( rootClientId );

			return siblingBlocks
				.map( ( b ) => b.attributes?.postId )
				.filter( ( id ) => id && id !== postId );
		},
		[ clientId, postId ]
	);

	// Job options for SelectControl
	const options = jobs
		? jobs
				.filter( ( j ) => ! selectedIds.includes( j.id ) )
				.map( ( j ) => ( {
					label: decodeEntities( j.title.rendered ),
					value: j.id,
				} ) )
		: [];

	return (
		<div { ...useBlockProps( { className: 'careers-highlight__job' } ) }>
			{ ! postId && (
				<SelectControl
					label={ __( 'Select Job', 'ambrygen-web' ) }
					value=""
					options={ [
						{
							label: __( 'Select a Job', 'ambrygen-web' ),
							value: '',
						},
						...options,
					] }
					onChange={ ( value ) =>
						setAttributes( {
							postId: value ? Number( value ) : null,
						} )
					}
				/>
			) }

			{ postId && selectedPost && (
				<>
					<div className="careers-highlight__job--row">
						<div className="careers-highlight__job-title subtitle2-sbold">
							{ decodeEntities( selectedPost.title.rendered ) }
						</div>
						<div className="careers-highlight__job-tag text-small-medium">
							{ jobTypeTerms
								?.map( ( t ) => t.name )
								.join( ', ' ) || __( 'Job Type', 'ambrygen-web' ) }
						</div>
					</div>
					<div className="careers-highlight__job-meta">
						<div className="ccareers-highlight__job-location text-md-medium">
							{ jobLocationIcon && (
								<img
									src={ jobLocationIcon }
									alt={ __( 'Job Location', 'ambrygen-web' ) }
									style={ { maxWidth: '50px' } }
								/>
							) }
							<span>
								{ jobLocationTerms
									?.map( ( t ) => t.name )
									.join( ', ' ) ||
									__( 'Job location', 'ambrygen-web' ) }
							</span>
						</div>
						<div className="careers-highlight__job-type text-md-medium">
							{ jobTypeIcon && (
								<img
									src={ jobTypeIcon }
									alt={ __( 'Job Type Icon', 'ambrygen-web' ) }
									style={ { maxWidth: '50px' } }
								/>
							) }
							<span>
								{ jobTypeTerms
									?.map( ( t ) => t.name )
									.join( ', ' ) || __( 'Job Type', 'ambrygen-web' ) }
							</span>
						</div>
					</div>
					<div className="is-style-gl-s20"></div>
					<div className="careers-highlight__actions actions-button">
						<Button
							variant="secondary"
							onClick={ () => setAttributes( { postId: null } ) }
						>
							{ __( 'Change Job', 'ambrygen-web' ) }
						</Button>
						<Button
							isDestructive
							onClick={ () => removeBlock( clientId ) }
						>
							{ __( 'Remove Job', 'ambrygen-web' ) }
						</Button>
					</div>
				</>
			) }
		</div>
	);
}
