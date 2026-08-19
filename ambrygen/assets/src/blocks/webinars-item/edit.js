import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const formatDuration = ( minutes ) => {
	const totalMins = parseInt( minutes, 10 );
	if ( isNaN( totalMins ) || totalMins <= 0 ) {
		return '';
	}

	const hours = Math.floor( totalMins / 60 );
	const mins = totalMins % 60;
	let display = '';

	if ( hours > 0 ) {
		display = `${ hours } ${
			hours === 1
				? __( 'hour', 'ambrygen-web' )
				: __( 'hours', 'ambrygen-web' )
		}`;
	}

	if ( mins > 0 ) {
		if ( hours > 0 ) {
			display += ` ${ __( 'and', 'ambrygen-web' ) } `;
		}
		display += `${ mins } ${
			mins === 1
				? __( 'minute', 'ambrygen-web' )
				: __( 'minutes', 'ambrygen-web' )
		}`;
	}

	return display;
};

const formatWebinarDate = ( dateString ) => {
	if ( ! dateString ) {
		return '';
	}

	try {
		const date = new Date( dateString );
		if ( Number.isNaN( date.getTime() ) ) {
			return '';
		}

		return date.toLocaleDateString( 'en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC',
		} );
	} catch {
		return '';
	}
};

const formatWebinarTime = ( dateString ) => {
	if ( ! dateString ) {
		return '';
	}

	try {
		const date = new Date( dateString );
		if ( Number.isNaN( date.getTime() ) ) {
			return '';
		}

		return date
			.toLocaleTimeString( 'en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
				timeZone: 'America/Los_Angeles',
				timeZoneName: 'short',
			} )
			.toLowerCase();
	} catch {
		return '';
	}
};

/**
 * Webinar Item Gutenberg editor component.
 *
 * Renders a lightweight search picker backed by server-side queries.
 * On mount it fetches the first 10 webinars by title. When the user
 * types at least 2 characters the component fires a debounced REST search.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @param {string} props.clientId   Block client ID.
 * @return {import('@wordpress/element').WPElement} Editor UI.
 */
export default function Edit( { attributes, clientId } ) {
	const { postId } = attributes;
	const { selectBlock } = useDispatch( 'core/block-editor' );
	const parentClientId = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlockRootClientId( clientId ),
		[ clientId ]
	);

	const selectedWebinar = useSelect(
		( select ) => {
			if ( ! postId ) {
				return null;
			}
			return select( 'core' ).getEntityRecord(
				'postType',
				'webinar',
				postId,
				{ _fields: 'id,title,featured_media,meta' }
			);
		},
		[ postId ]
	);

	const featuredImage = useSelect(
		( select ) => {
			const mediaId = selectedWebinar?.featured_media;
			if ( ! mediaId ) {
				return null;
			}
			const media = select( 'core' ).getMedia( mediaId, {
				_fields: 'id,source_url',
			} );
			return media?.source_url ?? null;
		},
		[ selectedWebinar?.featured_media ]
	);

	const subtitle = selectedWebinar?.meta?.subtitle || '';
	const startAt = selectedWebinar?.meta?.start_at || '';
	const duration = selectedWebinar?.meta?.duration || '';
	const hasCeu =
		selectedWebinar?.meta?.ceu === true ||
		selectedWebinar?.meta?.ceu === '1' ||
		selectedWebinar?.meta?.ceu === 1;
	const hasPace =
		selectedWebinar?.meta?.pace === true ||
		selectedWebinar?.meta?.pace === '1' ||
		selectedWebinar?.meta?.pace === 1;
	const dateDisplay = formatWebinarDate( startAt );
	const timeDisplay = formatWebinarTime( startAt );
	const durationDisplay = formatDuration( duration );

	const blockProps = useBlockProps( { className: 'webinars-item' } );

	if ( ! postId ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="video-alt"
					label={ __( 'Webinar Item', 'ambrygen-web' ) }
					instructions={ __(
						'Choose a webinar from the parent block sidebar panel.',
						'ambrygen-web'
					) }
				/>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			{ ! selectedWebinar ? (
				<Spinner />
			) : (
				<div
					className="webinars-item__preview-card event-carousel__card"
					role="button"
					tabIndex={ 0 }
					style={ { cursor: 'pointer' } }
					onClick={ () => {
						if ( parentClientId ) {
							selectBlock( parentClientId );
						}
					} }
					onKeyDown={ ( event ) => {
						if (
							( event.key === 'Enter' || event.key === ' ' ) &&
							parentClientId
						) {
							event.preventDefault();
							selectBlock( parentClientId );
						}
					} }
					aria-label={ __(
						'Select webinar grid block',
						'ambrygen-web'
					) }
					title={ __(
						'Click to open the webinar grid settings',
						'ambrygen-web'
					) }
				>
					<div className="event-carousel__content">
						{ featuredImage && (
							<div className="event-carousel__image-wrap mb-16">
								<img
									src={ featuredImage }
									alt=""
									style={ {
										width: '100%',
										height: 'auto',
										borderRadius: '8px',
									} }
								/>
							</div>
						) }

						<div className="event-carousel__title-row">
							<div className="text-lg-semibold event-carousel__card-title mb-0">
								{ selectedWebinar.title.rendered }
							</div>
						</div>

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>

						{ !! subtitle && (
							<div className="event-carousel__description text-md-medium">
								{ subtitle }
							</div>
						) }

						<div
							className="is-style-gl-s16"
							aria-hidden="true"
						></div>

						<div className="event-carousel__details flag-details">
							{ !! dateDisplay && (
								<div className="text-md-medium event-carousel__date-info flag-info flag-date-info">
									<span className="event-carousel__meta-list-icon flag-icon"></span>
									{ dateDisplay }
								</div>
							) }
							{ !! timeDisplay && (
								<div className="text-md-medium event-carousel__time-info flag-info flag-time-info">
									<span className="event-carousel__meta-list-icon flag-icon"></span>
									{ timeDisplay }
								</div>
							) }
							{ !! durationDisplay && (
								<div className="text-md-medium event-carousel__duration flag-info flag-duration-info">
									<span className="event-carousel__meta-list-icon flag-icon"></span>
									{ durationDisplay }
								</div>
							) }
							{ hasCeu && (
								<div className="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
									<span className="event-carousel__meta-list-icon flag-icon"></span>
									<span className="event-carousel__meta-label">
										{ __( 'C.E.U.:', 'ambrygen-web' ) }
									</span>
								</div>
							) }
							{ hasPace && (
								<div className="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
									<span className="event-carousel__meta-list-icon flag-icon"></span>
									<span className="event-carousel__meta-label">
										{ __( 'P.A.C.E.:', 'ambrygen-web' ) }
									</span>
								</div>
							) }
						</div>
					</div>
				</div>
			) }
		</div>
	);
}
