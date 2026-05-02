import { useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { getThemeAssetUrl } from '../../utils/assets';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

const getTermLabel = ( terms ) =>
	terms?.map( ( term ) => term.name ).join( ', ' ) || '';

export default function Edit( { attributes, clientId, context } ) {
	const { postId } = attributes;
	const { removeBlock } = useDispatch( 'core/block-editor' );

	const jobTypeIcon =
		context?.[ 'ambrygen/jobtypeicon' ]?.url ||
		getThemeAssetUrl( '/assets/src/images/clock-icon.svg' );

	const jobLocationIcon =
		context?.[ 'ambrygen/joblocationicon' ]?.url ||
		getThemeAssetUrl( '/assets/src/images/marker-pin-icon.svg' );

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

	const jobTypeLabel = useMemo( () => getTermLabel( jobTypeTerms ), [
		jobTypeTerms,
	] );

	const jobLocationLabel = useMemo(
		() => getTermLabel( jobLocationTerms ),
		[ jobLocationTerms ]
	);

	return (
		<div { ...useBlockProps( { className: 'careers-highlight__job' } ) }>
			{ ! postId && (
				<p>{ __( 'Select jobs from the Careers block settings.', 'ambrygen-web' ) }</p>
			) }

			{ postId && selectedPost && (
				<>
					<div className="careers-highlight__job--row">
						<div className="careers-highlight__job-title subtitle2-sbold">
							{ decodeEntities( selectedPost.title.rendered ) }
						</div>
						{ jobTypeLabel && (
							<div className="careers-highlight__job-tag text-small-medium">
								{ jobTypeLabel }
							</div>
						) }
					</div>
					{ ( jobLocationLabel || jobTypeLabel ) && (
						<div className="careers-highlight__job-meta">
							{ jobLocationLabel && (
								<div className="careers-highlight__job-location text-md-medium">
									{ jobLocationIcon && (
										<img
											src={ jobLocationIcon }
											alt=""
											aria-hidden="true"
											style={ { maxWidth: '50px' } }
										/>
									) }
									<span>{ jobLocationLabel }</span>
								</div>
							) }
							{ jobTypeLabel && (
								<div className="careers-highlight__job-type text-md-medium">
									{ jobTypeIcon && (
										<img
											src={ jobTypeIcon }
											alt=""
											aria-hidden="true"
											style={ { maxWidth: '50px' } }
										/>
									) }
									<span>{ jobTypeLabel }</span>
								</div>
							) }
						</div>
					) }
					<div className="is-style-gl-s20"></div>
					<div className="careers-highlight__actions actions-button">
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
