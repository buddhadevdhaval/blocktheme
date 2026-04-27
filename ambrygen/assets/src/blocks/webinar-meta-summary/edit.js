import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Format duration minutes into a human-readable string.
 */
const getDurationDisplay = ( minutes ) => {
	const totalMins = parseInt( minutes, 10 );
	if ( isNaN( totalMins ) || totalMins <= 0 ) return '';

	const hours = Math.floor( totalMins / 60 );
	const mins = totalMins % 60;

	let display = '';
	if ( hours > 0 ) {
		display = `${ hours } ${ hours === 1 ? __( 'hour', 'ambrygen-web' ) : __( 'hours', 'ambrygen-web' ) }`;
	}

	if ( mins > 0 ) {
		if ( hours > 0 ) {
			display += ` ${ __( 'and', 'ambrygen-web' ) } `;
		}
		display += `${ mins } ${ mins === 1 ? __( 'minute', 'ambrygen-web' ) : __( 'minutes', 'ambrygen-web' ) }`;
	}

	return display;
};

/**
 * Format date string into "Wednesday, March 25, 2026"
 */
const formatDate = ( dateString ) => {
	if ( ! dateString ) return '';
	try {
		const date = new Date( dateString );
		if ( isNaN( date.getTime() ) ) return dateString;
		
		return date.toLocaleDateString( 'en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		} );
	} catch ( e ) {
		return dateString;
	}
};

/**
 * Format date string into "10:00 am GMT+0000"
 */
const formatTime = ( dateString ) => {
	if ( ! dateString ) return '';
	try {
		const date = new Date( dateString );
		if ( isNaN( date.getTime() ) ) return '';

		const timeStr = date.toLocaleTimeString( 'en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		} ).toLowerCase();

		// timezone part is tricky in JS without libraries, we'll try to get the offset
		const offset = date.getTimezoneOffset();
		const absOffset = Math.abs( offset );
		const hours = Math.floor( absOffset / 60 );
		const minutes = absOffset % 60;
		const tz = `GMT${ offset > 0 ? '-' : '+' }${ hours.toString().padStart( 2, '0' ) }${ minutes.toString().padStart( 2, '0' ) }`;

		return `${ timeStr } ${ tz }`;
	} catch ( e ) {
		return '';
	}
};

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'webinar-meta-summary-editor',
	} );

	const meta = useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
	}, [] );

	const {
		start_at = '',
		duration = '',
		ceu = '',
		pace = '',
	} = meta;

	const dateDisplay = formatDate( start_at );
	const timeDisplay = formatTime( start_at );
	const durationDisplay = getDurationDisplay( duration );

	return (
		<div { ...blockProps }>
			<div className="event-carousel__details flag-details">
				{ ( dateDisplay || ! start_at ) && (
					<div className="text-md-medium event-carousel__date-info flag-info flag-date-info">
						<span className="event-carousel__meta-list-icon flag-icon"></span>
						{ dateDisplay || __( 'Select Date...', 'ambrygen-web' ) }
					</div>
				) }

				{ ( timeDisplay || ! start_at ) && (
					<div className="text-md-medium event-carousel__time-info flag-info flag-time-info">
						<span className="event-carousel__meta-list-icon flag-icon"></span>
						{ timeDisplay || __( 'Set Time...', 'ambrygen-web' ) }
					</div>
				) }

				{ ( durationDisplay || ! duration ) && (
					<div className="text-md-medium event-carousel__duration flag-info flag-duration-info">
						<span className="event-carousel__meta-list-icon flag-icon"></span>
						{ durationDisplay || __( 'Enter Duration...', 'ambrygen-web' ) }
					</div>
				) }

				{ ( ceu || ! ceu ) && (
					<div className="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
						<span className="event-carousel__meta-list-icon flag-icon"></span>
						<span className="event-carousel__meta-label">{ __( 'C.E.U.:', 'ambrygen-web' ) }</span>
						<span className="event-carousel__ceu-text">{ ceu || '0' }</span>
					</div>
				) }

				{ ( pace || ! pace ) && (
					<div className="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
						<span className="event-carousel__meta-list-icon flag-icon"></span>
						<span className="event-carousel__meta-label">{ __( 'P.A.C.E.:', 'ambrygen-web' ) }</span>
						<span className="event-carousel__pace-text">{ pace || '0' }</span>
					</div>
				) }
			</div>
		</div>
	);
}
