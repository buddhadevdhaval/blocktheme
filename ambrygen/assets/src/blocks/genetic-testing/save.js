/**
 * Block editor save components
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Video validation utilities
 */
import { getIframeSrc } from '../../utils/validation.js';

export default function Save( { attributes } ) {
	const { heading, description, videoUrl, backgroundColor, style } =
		attributes;

	const getBackgroundColor = () =>
		backgroundColor || style?.color?.background || '#f8fafc';

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
				{ /* Only render content section if there's heading or description */ }
				{ ( heading || description ) && (
					<div className="genetic-content">
						{ heading && (
							<RichText.Content
								tagName="h2"
								value={ heading }
								className="genetic-heading"
								id="genetic-testing-heading"
							/>
						) }
						{ description && (
							<RichText.Content
								tagName="div"
								value={ description }
								className="genetic-description"
								role="group"
								aria-labelledby={
									heading ? 'genetic-testing-heading' : null
								}
							/>
						) }
					</div>
				) }

				{ /* Only render video section if there's a valid iframe */ }
				{ iframeSrc && (
					<div
						className="genetic-video"
						role="region"
						aria-label="Genetic testing video"
					>
						<div className="video-container">
							<iframe
								src={ iframeSrc }
								title="Genetic testing video"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								loading="lazy"
								className="video-iframe"
								role="application"
								aria-label="Video player"
							/>
						</div>
					</div>
				) }
			</div>
		</div>
	);
}
