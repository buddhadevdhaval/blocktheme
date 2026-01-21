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
 * Video validation utilities
 */
import { isValidVideoUrl, getIframeSrc } from '../../utils/validation.js';

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
			padding: '80px 40px', // Consistent with save.js
		},
	} );

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
							'ambrygen-web'
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
							'ambrygen-web'
						) }
						className="genetic-description"
					/>
				</div>

				<div className="genetic-video">
					<TextControl
						label={ __(
							'Video URL (YouTube/Vimeo)',
							'ambrygen-web'
						) }
						value={ videoUrl }
						onChange={ ( value ) =>
							setAttributes( { videoUrl: value || '' } )
						}
						help={
							videoUrl && ! isValidVideoUrl( videoUrl )
								? __(
										'Invalid URL. Please use a valid YouTube or Vimeo URL.',
										'ambrygen-web'
								  )
								: __(
										'Paste YouTube/Vimeo URL - auto embeds',
										'ambrygen-web'
								  )
						}
						placeholder="https://www.youtube.com/watch?v=..."
						className={
							videoUrl && ! isValidVideoUrl( videoUrl )
								? 'has-error'
								: ''
						}
					/>

					{ iframeSrc && (
						<div className="video-container">
							<iframe
								src={ iframeSrc }
								title={ __(
									'Genetic testing video',
									'ambrygen-web'
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
