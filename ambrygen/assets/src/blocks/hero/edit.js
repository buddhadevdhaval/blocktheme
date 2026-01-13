/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { heading, content } = attributes;

	return (
		<div { ...useBlockProps() }>
			<RichText
				tagName="h2"
				value={ heading }
				onChange={ ( value ) => setAttributes( { heading: value } ) }
				placeholder={ __( 'Hero heading…', 'ambrygen-web' ) }
				className="hero-heading"
			/>
			<RichText
				tagName="p"
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Hero content…', 'ambrygen-web' ) }
				className="hero-content"
			/>
		</div>
	);
}
