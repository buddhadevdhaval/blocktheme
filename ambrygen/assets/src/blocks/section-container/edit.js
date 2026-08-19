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
import { ImageUploader } from '../_shared/components';

/**
 * ContainerWidthControl Component
 *
 * Reusable component for container width selection.
 * Provides options for different container widths following Ambrygen standards.
 *
 * @param {Object}   props          Component properties.
 * @param {string}   props.value    Current container width value.
 * @param {Function} props.onChange Callback when width changes.
 * @return {import('@wordpress/element').WPElement} ContainerWidthControl component.
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
					label: __( 'Container 828px', 'ambrygen-web' ),
					value: 'container-768',
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
 * @return {import('@wordpress/element').WPElement} BackgroundStyleControl component.
 */
function BackgroundStyleControl( { value, onChange } ) {
	return (
		<SelectControl
			label={ __( 'Container Background Color', 'ambrygen-web' ) }
			help={ __(
				'Select a background color for this section.',
				'ambrygen-web'
			) }
			value={ value }
			options={ [
				{
					label: __( 'None (Transparent)', 'ambrygen-web' ),
					value: '',
				},
				{
					label: __( 'Primary 25 Background', 'ambrygen-web' ),
					value: 'bg-primary_25',
				},
				{
					label: __( 'Primary 700 Background', 'ambrygen-web' ),
					value: 'bg-primary_700',
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
				{
					label: __( 'Gradient One Background', 'ambrygen-web' ),
					value: 'bg-gradient1',
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
 * @param {string}   props.className     Additional CSS classes.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {import('@wordpress/element').WPElement} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes, className = '' } ) {
	const {
		containerWidth = 'container-1340',
		backgroundStyle = '',
		backgroundImageUrl = '',
		isFixedBackground = false,
	} = attributes;
	const hasInsideBackground = isFixedBackground === true;
	const hasBackgroundImage = Boolean( backgroundImageUrl );

	const customClasses = className
		.split( ' ' )
		.filter( Boolean )
		.filter( ( value ) => value !== 'block-bg' );

	const classes = [
		...customClasses,
		containerWidth,
		backgroundStyle,
		hasInsideBackground ? 'block-bg' : '',
	]
		.filter( Boolean )
		.join( ' ' );

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
	 * Handles background image selection.
	 *
	 * @param {Object} media Selected media object.
	 */
	const handleBackgroundImageSelect = useCallback(
		( media ) => {
			if ( ! media?.url ) {
				return;
			}

			setAttributes( {
				backgroundImageId: media.id || 0,
				backgroundImageUrl: media.url,
			} );
		},
		[ setAttributes ]
	);

	/**
	 * Removes the selected background image.
	 */
	const handleBackgroundImageRemove = useCallback( () => {
		setAttributes( {
			backgroundImageId: 0,
			backgroundImageUrl: '',
		} );
	}, [ setAttributes ] );

	/**
	 * Handles Inside background toggle.
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

	const blockProps = useBlockProps( {
		className: classes || undefined,
		style: hasBackgroundImage
			? {
					'--section-container-bg-image': `url(${ backgroundImageUrl })`,
			  }
			: undefined,
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
					<ImageUploader
						label={ __( 'Background Image', 'ambrygen-web' ) }
						url={ backgroundImageUrl }
						onSelect={ handleBackgroundImageSelect }
						onRemove={ handleBackgroundImageRemove }
					/>
					<ToggleControl
						label={ __( 'Inside Background', 'ambrygen-web' ) }
						help={ __(
							'Fixes the background image/color during scroll.',
							'ambrygen-web'
						) }
						checked={ isFixedBackground }
						onChange={ handleFixedBackgroundChange }
					/>
				</PanelBody>
			</InspectorControls>

			{ createElement(
				'section',
				blockProps,
				<div className="wrapper">
					<InnerBlocks />
				</div>
			) }
		</>
	);
}
