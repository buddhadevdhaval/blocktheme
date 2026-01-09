/**
 * WordPress internationalization utilities.
 * Used for translatable strings in the block editor interface.
 */
import { __ } from '@wordpress/i18n';

/**
 * Core block editor components.
 * useBlockProps: Marks block wrapper element with necessary props.
 * RichText: Rich text content editing component.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * WordPress UI components for form controls.
 */
import { TextControl } from '@wordpress/components';

/**
 * Editor styles for the genetic testing block.
 *
 * @see [https://www.npmjs.com/package/@wordpress/scripts#using-css](https://www.npmjs.com/package/@wordpress/scripts#using-css)
 */
import './editor.scss';

/**
 * Edit function for Genetic Testing block.
 * Renders video embed with YouTube/Vimeo support and content controls.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Update attributes function
 * @return {JSX.Element}                  Editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { heading, description, videoUrl, backgroundColor, style } =
		attributes;

	/**
	 * Returns background color from attribute or inline style.
	 *
	 * @return {string} Background color value
	 */
	const getBackgroundColor = () =>
		backgroundColor || style?.color?.background || '#f8fafc';

	const blockProps = useBlockProps( {
		style: {
			backgroundColor: getBackgroundColor(),
			padding: '60px 40px',
		},
	} );

	/**
	 * Converts YouTube/Vimeo URLs to embed iframe src.
	 *
	 * @param {string} url Video URL
	 * @return {string} Embed iframe src or empty string
	 */
	const getIframeSrc = ( url ) => {
		if ( ! url ) {
			return '';
		}

		// YouTube
		if ( url.includes( 'youtube.com' ) || url.includes( 'youtu.be' ) ) {
			const videoId =
				url.split( 'v=' )[ 1 ]?.split( '&' )[ 0 ] ||
				url.split( 'youtu.be/' )[ 1 ]?.split( '?' )[ 0 ];
			return videoId
				? `https://www.youtube.com/embed/${ videoId }?rel=0&modestbranding=1`
				: '';
		}

		// Vimeo
		if ( url.includes( 'vimeo.com' ) ) {
			const videoId = url.split( '/' ).pop();
			return videoId ? `https://player.vimeo.com/video/${ videoId }` : '';
		}

		return url || '';
	};

	const iframeSrc = getIframeSrc( videoUrl ) || '';

	return (
		<div { ...blockProps }>
			<div className="genetic-testing-block">
				<div className="genetic-content">
					<RichText
						tagName="h2"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __(
							'What is genetic testing?',
							'ambrygen'
						) }
						className="genetic-heading"
					/>
					<RichText
						tagName="div"
						multiline="p"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Genetic testing studies your genes…',
							'ambrygen'
						) }
						className="genetic-description"
					/>
				</div>

				<div className="genetic-video">
					<TextControl
						label={ __( 'Video URL (YouTube/Vimeo)', 'ambrygen' ) }
						value={ videoUrl }
						onChange={ ( value ) =>
							setAttributes( { videoUrl: value || '' } )
						}
						help={ __(
							'Paste YouTube/Vimeo URL - auto embeds',
							'ambrygen'
						) }
						placeholder="https://www.youtube.com/watch?v=..."
					/>

					{ iframeSrc && (
						<div className="video-container">
							<iframe
								src={ iframeSrc }
								title={ __(
									'Genetic testing video',
									'ambrygen'
								) }
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="video-iframe"
							/>
						</div>
					) }
				</div>
			</div>
		</div>
	);
}
