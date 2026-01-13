/**
 * Retrieves the translation of text.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/)
 */
import { __ } from '@wordpress/i18n';

/**
 * Core block editor components for building the block interface.
 * useBlockProps: React hook that provides props for the block wrapper element.
 * RichText: Component for rich text content editing.
 * MediaUpload/MediaUploadCheck: Components for media library integration.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#richtext](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#richtext)
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#mediaupload](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#mediaupload)
 */
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * WordPress button component for media upload triggers.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/components/button/](https://developer.wordpress.org/block-editor/reference-guides/components/button/)
 */
import { Button } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see [https://www.npmjs.com/package/@wordpress/scripts#using-css](https://www.npmjs.com/package/@wordpress/scripts#using-css)
 */
import './editor.scss';

/**
 * Edit component for the AI Health Hero block.
 * Renders the block interface in the block editor with media uploads,
 * rich text fields for heading/content, and four configurable counters
 * with prefix, number, suffix, and label support.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit)
 *
 * @param {Object}   props               Block properties
 * @param {Object}   props.attributes    Block attributes containing heading, content, counter data, and image URLs
 * @param {Function} props.setAttributes Function to update block attributes
 * @return {JSX.Element}                 Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		content,
		counter1Number,
		counter1Prefix,
		counter1Suffix,
		counter1Label,
		counter2Number,
		counter2Prefix,
		counter2Suffix,
		counter2Label,
		counter3Number,
		counter3Prefix,
		counter3Suffix,
		counter3Label,
		counter4Number,
		counter4Prefix,
		counter4Suffix,
		counter4Label,
		imageTop,
		imageBottom,
		logoImage,
	} = attributes;

	/**
	 * Utility function to restrict input to numeric values only.
	 *
	 * @param {string} value Input string to filter
	 * @return {string} Numeric-only string
	 */
	const updateNumber = ( value ) => value.replace( /[^0-9]/g, '' );

	return (
		<div { ...useBlockProps() }>
			<div className="hero-layout">
				{ /* Logo */ }
				<div className="hero-logo">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( { logoImage: img.url } )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } isSecondary>
									{ logoImage
										? 'Change Logo'
										: 'Upload Logo' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ logoImage && <img src={ logoImage } alt="Logo" /> }
				</div>

				{ /* Top media */ }
				<div className="hero-image-top">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( { imageTop: img.url } )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } isSecondary>
									{ imageTop
										? 'Change Image'
										: 'Upload Top Image' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ imageTop && <img src={ imageTop } alt="Top Media" /> }
				</div>

				{ /* Bottom media */ }
				<div className="hero-image-bottom">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( { imageBottom: img.url } )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } isSecondary>
									{ imageBottom
										? 'Change Image'
										: 'Upload Bottom Image' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ imageBottom && (
						<img src={ imageBottom } alt="Bottom Media" />
					) }
				</div>

				{ /* Hero content */ }
				<div className="hero-content">
					<RichText
						tagName="h1"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Hero heading…', 'ambrygen' ) }
						className="hero-heading"
					/>
					<RichText
						tagName="p"
						value={ content }
						onChange={ ( value ) =>
							setAttributes( { content: value } )
						}
						placeholder={ __( 'Hero content…', 'ambrygen' ) }
						className="hero-description"
					/>

					{ /* Fixed Counters with Prefix/Suffix */ }
					<div className="hero-counters">
						<CounterItem
							prefix={ counter1Prefix }
							number={ counter1Number }
							suffix={ counter1Suffix }
							label={ counter1Label }
							onChangePrefix={ ( value ) =>
								setAttributes( { counter1Prefix: value } )
							}
							onChangeNumber={ ( value ) =>
								setAttributes( {
									counter1Number: updateNumber( value ),
								} )
							}
							onChangeSuffix={ ( value ) =>
								setAttributes( { counter1Suffix: value } )
							}
							onChangeLabel={ ( value ) =>
								setAttributes( { counter1Label: value } )
							}
						/>
						<CounterItem
							prefix={ counter2Prefix }
							number={ counter2Number }
							suffix={ counter2Suffix }
							label={ counter2Label }
							onChangePrefix={ ( value ) =>
								setAttributes( { counter2Prefix: value } )
							}
							onChangeNumber={ ( value ) =>
								setAttributes( {
									counter2Number: updateNumber( value ),
								} )
							}
							onChangeSuffix={ ( value ) =>
								setAttributes( { counter2Suffix: value } )
							}
							onChangeLabel={ ( value ) =>
								setAttributes( { counter2Label: value } )
							}
						/>
						<CounterItem
							prefix={ counter3Prefix }
							number={ counter3Number }
							suffix={ counter3Suffix }
							label={ counter3Label }
							onChangePrefix={ ( value ) =>
								setAttributes( { counter3Prefix: value } )
							}
							onChangeNumber={ ( value ) =>
								setAttributes( {
									counter3Number: updateNumber( value ),
								} )
							}
							onChangeSuffix={ ( value ) =>
								setAttributes( { counter3Suffix: value } )
							}
							onChangeLabel={ ( value ) =>
								setAttributes( { counter3Label: value } )
							}
						/>
						<CounterItem
							prefix={ counter4Prefix }
							number={ counter4Number }
							suffix={ counter4Suffix }
							label={ counter4Label }
							onChangePrefix={ ( value ) =>
								setAttributes( { counter4Prefix: value } )
							}
							onChangeNumber={ ( value ) =>
								setAttributes( {
									counter4Number: updateNumber( value ),
								} )
							}
							onChangeSuffix={ ( value ) =>
								setAttributes( { counter4Suffix: value } )
							}
							onChangeLabel={ ( value ) =>
								setAttributes( { counter4Label: value } )
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Reusable Counter Item component for the hero block.
 *
 * @param {Object}   props
 * @param {string}   props.prefix         Counter prefix text
 * @param {string}   props.number         Counter number value
 * @param {string}   props.suffix         Counter suffix text
 * @param {string}   props.label          Counter label text
 * @param {Function} props.onChangePrefix Prefix change handler
 * @param {Function} props.onChangeNumber Number change handler
 * @param {Function} props.onChangeSuffix Suffix change handler
 * @param {Function} props.onChangeLabel  Label change handler
 * @return {JSX.Element} Counter item element
 */
function CounterItem( {
	prefix,
	number,
	suffix,
	label,
	onChangePrefix,
	onChangeNumber,
	onChangeSuffix,
	onChangeLabel,
} ) {
	return (
		<div className="counter-item">
			<div className="counter-number">
				<RichText
					tagName="span"
					value={ prefix }
					onChange={ onChangePrefix }
					placeholder="+"
					className="counter-prefix"
				/>
				<RichText
					tagName="strong"
					value={ number }
					onChange={ onChangeNumber }
					placeholder="100"
					className="counter-value"
				/>
				<RichText
					tagName="span"
					value={ suffix }
					onChange={ onChangeSuffix }
					placeholder="+"
					className="counter-suffix"
				/>
			</div>
			<RichText
				tagName="p"
				value={ label }
				onChange={ onChangeLabel }
				placeholder="Counter label"
				className="counter-label"
			/>
		</div>
	);
}
