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
 * Import validation utilities
 */
import { validateNumber } from '../../utils/validation.js';

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
		counters,
		imageTop,
		imageTopAlt,
		imageBottom,
		imageBottomAlt,
		logoImage,
		logoImageAlt,
	} = attributes;

	/**
	 * Updates a specific counter in counters array
	 * @param {number} index Counter index
	 * @param {string} field Field name (number, prefix, suffix, label)
	 * @param {string} value New value
	 */
	const updateCounter = ( index, field, value ) => {
		const newCounters = [ ...counters ];
		newCounters[ index ] = { ...newCounters[ index ], [ field ]: value };
		setAttributes( { counters: newCounters } );
	};

	return (
		<div { ...useBlockProps() }>
			<div className="hero-layout">
				{ /* Logo */ }
				<div className="hero-logo">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( {
									logoImage: img.url,
									logoImageId: img.id,
									logoImageAlt: img.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ logoImage
										? 'Change Logo'
										: 'Upload Logo' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ logoImage && (
						<img
							src={ logoImage }
							alt={
								logoImageAlt ||
								__( 'Company logo', 'ambrygen-web' )
							}
						/>
					) }
				</div>

				{ /* Top media */ }
				<div className="hero-image-top">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( {
									imageTop: img.url,
									imageTopId: img.id,
									imageTopAlt: img.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageTop
										? 'Change Image'
										: 'Upload Top Image' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ imageTop && (
						<img
							src={ imageTop }
							alt={
								imageTopAlt ||
								__( 'Hero top image', 'ambrygen-web' )
							}
						/>
					) }
				</div>

				{ /* Bottom media */ }
				<div className="hero-image-bottom">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( img ) =>
								setAttributes( {
									imageBottom: img.url,
									imageBottomId: img.id,
									imageBottomAlt: img.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageBottom
										? 'Change Image'
										: 'Upload Bottom Image' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ imageBottom && (
						<img
							src={ imageBottom }
							alt={
								imageBottomAlt ||
								__( 'Hero bottom image', 'ambrygen-web' )
							}
						/>
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
						placeholder={ __( 'Hero heading…', 'ambrygen-web' ) }
						className="hero-heading"
					/>
					<RichText
						tagName="p"
						value={ content }
						onChange={ ( value ) =>
							setAttributes( { content: value } )
						}
						placeholder={ __( 'Hero content…', 'ambrygen-web' ) }
						className="hero-description"
					/>

					{ /* Dynamic Counters with Prefix/Suffix */ }
					<div className="hero-counters">
						{ counters.map( ( counter, index ) => (
							<CounterItem
								key={ index }
								prefix={ counter.prefix }
								number={ counter.number }
								suffix={ counter.suffix }
								label={ counter.label }
								onChangePrefix={ ( value ) =>
									updateCounter( index, 'prefix', value )
								}
								onChangeNumber={ ( value ) =>
									updateCounter(
										index,
										'number',
										validateNumber( value )
									)
								}
								onChangeSuffix={ ( value ) =>
									updateCounter( index, 'suffix', value )
								}
								onChangeLabel={ ( value ) =>
									updateCounter( index, 'label', value )
								}
							/>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Reusable Counter Item component for the hero block.
 * Includes validation feedback for numeric inputs.
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
	/**
	 * Validates if a number is within reasonable range
	 * @param {string} value Number string to validate
	 * @return {boolean} True if valid range
	 */
	const isValidNumber = ( value ) => {
		if ( ! value ) {
			return true;
		} // Empty is valid
		const num = parseInt( value, 10 );
		return ! isNaN( num ) && num >= 0 && num <= 999999999;
	};

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
					className={ `counter-value ${
						number && ! isValidNumber( number ) ? 'has-error' : ''
					}` }
				/>
				<RichText
					tagName="span"
					value={ suffix }
					onChange={ onChangeSuffix }
					placeholder="+"
					className="counter-suffix"
				/>
			</div>
			{ number && ! isValidNumber( number ) && (
				<small className="counter-error">
					{ __(
						'Please enter a number between 0 and 999,999,999',
						'ambrygen-web'
					) }
				</small>
			) }
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
