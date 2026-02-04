/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hooks for performance optimization.
 *
 * @see https://react.dev/reference/react
 */
import { useCallback, createElement } from '@wordpress/element';

/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	PanelBody,
	RadioControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * ContainerWidthControl Component
 *
 * Reusable component for container width selection.
 * Provides options for different container widths following Ambrygen standards.
 *
 * @param {Object}   props          Component properties.
 * @param {string}   props.value    Current container width value.
 * @param {Function} props.onChange Callback when width changes.
 * @return {JSX.Element} ContainerWidthControl component.
 */
function ContainerWidthControl( { value, onChange } ) {
	return (
		<RadioControl
			label={ __( 'Container Width', 'ambrygen-web' ) }
			help={ __(
				'Choose the maximum width for this section container.',
				'ambrygen-web'
			) }
			selected={ value }
			options={ [
				{
					label: __( 'Container 1340px (Default)', 'ambrygen-web' ),
					value: 'container-1340',
				},
				{
					label: __( 'Container 1280px', 'ambrygen-web' ),
					value: 'container-1280',
				},
				{
					label: __( 'Full Width', 'ambrygen-web' ),
					value: 'container-full',
				},
			] }
			onChange={ onChange }
		/>
	);
}

/**
 * BackgroundStyleControl Component
 *
 * Reusable component for background style selection.
 * Provides theme color options and custom background support.
 *
 * @param {Object}   props          Component properties.
 * @param {string}   props.value    Current background style value.
 * @param {Function} props.onChange Callback when style changes.
 * @return {JSX.Element} BackgroundStyleControl component.
 */
function BackgroundStyleControl( { value, onChange } ) {
	return (
		<SelectControl
			label={ __( 'Background Style', 'ambrygen-web' ) }
			help={ __(
				'Select a background style for this section.',
				'ambrygen-web'
			) }
			value={ value }
			options={ [
				{
					label: __( 'None (Transparent)', 'ambrygen-web' ),
					value: '',
				},
				{
					label: __( 'Primary Color', 'ambrygen-web' ),
					value: 'bg-primary',
				},
				{
					label: __( 'Secondary Color', 'ambrygen-web' ),
					value: 'bg-secondary',
				},
				{
					label: __( 'Primary 25 Background', 'ambrygen-web' ),
					value: 'bg-primary_25',
				},
				{
					label: __( 'Primary 800 Background', 'ambrygen-web' ),
					value: 'bg-primary_800',
				},
				{
					label: __(
						'Light Blue Gradient Background',
						'ambrygen-web'
					),
					value: 'bg-lightblue-gradient',
				},
				{
					label: __( 'Blue Gradient Background', 'ambrygen-web' ),
					value: 'bg-blue-gradient',
				},
			] }
			onChange={ onChange }
		/>
	);
}

/**
 * TagNameControl Component
 *
 * Reusable component for HTML tag selection.
 * Provides semantic HTML options for better accessibility and SEO.
 *
 * @param {Object}   props          Component properties.
 * @param {string}   props.value    Current tag name value.
 * @param {Function} props.onChange Callback when tag changes.
 * @return {JSX.Element} TagNameControl component.
 */
function TagNameControl( { value, onChange } ) {
	return (
		<SelectControl
			label={ __( 'HTML Tag', 'ambrygen-web' ) }
			help={ __(
				'Choose the semantic HTML tag for this section.',
				'ambrygen-web'
			) }
			value={ value }
			options={ [
				{
					label: __( '<section> (Default)', 'ambrygen-web' ),
					value: 'section',
				},
				{
					label: __( '<div> (Generic)', 'ambrygen-web' ),
					value: 'div',
				},
				{
					label: __( '<article> (Article Content)', 'ambrygen-web' ),
					value: 'article',
				},
				{
					label: __( '<aside> (Sidebar Content)', 'ambrygen-web' ),
					value: 'aside',
				},
				{
					label: __( '<main> (Main Content)', 'ambrygen-web' ),
					value: 'main',
				},
			] }
			onChange={ onChange }
		/>
	);
}

/**
 * Edit component for the Section Container block.
 *
 * Renders the block interface in the editor with:
 * - Container width controls (1340px, 1280px, full-width)
 * - Background style options (theme colors)
 * - HTML tag selection for semantic markup
 * - InnerBlocks for nested content
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { tagName, containerWidth, backgroundStyle, isFixedBackground } =
		attributes;

	/**
	 * Handles container width change.
	 * Memoized with useCallback for performance.
	 *
	 * @param {string} value New container width value.
	 */
	const handleWidthChange = useCallback(
		( value ) => {
			setAttributes( { containerWidth: value } );
		},
		[ setAttributes ]
	);

	/**
	 * Handles background style change.
	 * Memoized with useCallback for performance.
	 *
	 * @param {string} value New background style value.
	 */
	const handleBackgroundChange = useCallback(
		( value ) => {
			setAttributes( { backgroundStyle: value } );
		},
		[ setAttributes ]
	);

	/**
	 * Handles fixed background toggle.
	 * Memoized with useCallback for performance.
	 *
	 * @param {boolean} value New checked state.
	 */
	const handleFixedBackgroundChange = useCallback(
		( value ) => {
			setAttributes( { isFixedBackground: value } );
		},
		[ setAttributes ]
	);

	/**
	 * Handles HTML tag change.
	 * Memoized with useCallback for performance.
	 *
	 * @param {string} value New tag name value.
	 */
	const handleTagChange = useCallback(
		( value ) => {
			setAttributes( { tagName: value } );
		},
		[ setAttributes ]
	);

	const blockProps = useBlockProps( {
		className: `${ containerWidth } ${ backgroundStyle } ${
			isFixedBackground ? 'bg-fixed' : ''
		}`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Container Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ContainerWidthControl
						value={ containerWidth }
						onChange={ handleWidthChange }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Background Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<BackgroundStyleControl
						value={ backgroundStyle }
						onChange={ handleBackgroundChange }
					/>
					<ToggleControl
						label={ __( 'Fixed Background', 'ambrygen-web' ) }
						help={ __(
							'Fixes the background image/color during scroll.',
							'ambrygen-web'
						) }
						checked={ isFixedBackground }
						onChange={ handleFixedBackgroundChange }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Advanced Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagNameControl
						value={ tagName }
						onChange={ handleTagChange }
					/>
				</PanelBody>
			</InspectorControls>

			{ createElement(
				tagName,
				blockProps,
				<div className="wrapper">
					<InnerBlocks />
				</div>
			) }
		</>
	);
}
