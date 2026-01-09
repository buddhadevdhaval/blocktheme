/**
 * Block editor save components
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { heading, description, videoUrl, backgroundColor, style } =
		attributes;

	const getBackgroundColor = () =>
		backgroundColor || style?.color?.background || '#f8fafc';

	const getIframeSrc = ( url ) => {
		if ( ! url ) {
			return '';
		}

		try {
			// YouTube
			if ( url.includes( 'youtube.com' ) || url.includes( 'youtu.be' ) ) {
				const videoId =
					url.split( 'v=' )[ 1 ]?.split( '&' )[ 0 ] ||
					url.split( 'youtu.be/' )[ 1 ]?.split( '?' )[ 0 ];
				return videoId
					? `https://www.youtube.com/embed/${ videoId }?rel=0&modestbranding=1&playsinline=1`
					: '';
			}

			// Vimeo
			if ( url.includes( 'vimeo.com' ) ) {
				const parts = url.split( '/' );
				const videoId = parts.pop() || parts.pop();
				return videoId
					? `https://player.vimeo.com/video/${ videoId }?dnt=1`
					: '';
			}

			return url;
		} catch ( error ) {
			return '';
		}
	};

	const iframeSrc = getIframeSrc( videoUrl );
	const blockProps = useBlockProps.save( {
		style: {
			backgroundColor: getBackgroundColor(),
			padding: '80px 40px',
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="genetic-testing-block">
				<div className="genetic-content">
					{ heading && (
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="genetic-heading"
						/>
					) }
					{ description && (
						<RichText.Content
							tagName="div"
							value={ description }
							className="genetic-description"
						/>
					) }
				</div>

				{ iframeSrc && (
					<div className="genetic-video">
						<div className="video-container">
							<iframe
								src={ iframeSrc }
								title="Genetic testing video"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								loading="lazy"
								className="video-iframe"
							/>
						</div>
					</div>
				) }
			</div>
		</div>
	);
}
