/**
 * Shared UI Components for Block Editors
 *
 * Reusable components to reduce boilerplate in block editors.
 * Import from: '../_shared/components'
 *
 * @package
 */
import {
	Button,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import {
	MediaUpload,
	MediaUploadCheck,
	LinkControl,
} from '@wordpress/block-editor';
import { trash, chevronUp, chevronDown, upload } from '@wordpress/icons';
import { t } from './utils';

/**
 * Shared global configuration
 *
 * @package
 */

export const DEFAULT_IMAGES = () => ( {
	placeholder: {
		id: window?.ambrygenAssets?.defaultImageId
			? parseInt( window.ambrygenAssets.defaultImageId, 10 )
			: 0,
		url: window?.ambrygenAssets?.defaultImageUrl || '',
		alt: 'Default image',
	},
} );

/* ─────────────────────────────────────────────────────────────
   Item Controls
───────────────────────────────────────────────────────────── */

/**
 * Standard item control buttons.
 *
 * @param {Object}   props              - Component props.
 * @param {number}   props.index        - Current item index.
 * @param {number}   props.total        - Total number of items.
 * @param {Function} props.onMove       - Move handler.
 * @param {Function} props.onRemove     - Remove handler.
 * @param {number}   [props.minCount=1] - Minimum allowed items.
 */
export function ItemControls( {
	index,
	total,
	onMove,
	onRemove,
	minCount = 1,
} ) {
	return (
		<div style={ { display: 'flex', gap: '4px' } }>
			<Button
				icon={ chevronUp }
				size="small"
				disabled={ index === 0 }
				onClick={ () => onMove( index, -1 ) }
				label={ t( 'Move Up' ) }
			/>
			<Button
				icon={ chevronDown }
				size="small"
				disabled={ index >= total - 1 }
				onClick={ () => onMove( index, 1 ) }
				label={ t( 'Move Down' ) }
			/>
			<Button
				icon={ trash }
				size="small"
				isDestructive
				disabled={ total <= minCount }
				onClick={ () => onRemove( index ) }
				label={ t( 'Remove' ) }
			/>
		</div>
	);
}

/**
 * Panel item header with title and controls.
 *
 * @param {Object}   props          - Component props.
 * @param {number}   props.index    - Current index.
 * @param {string}   props.label    - Item label.
 * @param {number}   props.total    - Total items.
 * @param {Function} props.onMove   - Move handler.
 * @param {Function} props.onRemove - Remove handler.
 * @param {number}   props.minCount - Minimum item count.
 */
export function ItemHeader( {
	index,
	label,
	total,
	onMove,
	onRemove,
	minCount,
} ) {
	return (
		<div
			style={ {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: '8px',
			} }
		>
			<strong>
				{ t( 'Item' ) } { index + 1 }: { label || t( 'Untitled' ) }
			</strong>
			<ItemControls
				index={ index }
				total={ total }
				onMove={ onMove }
				onRemove={ onRemove }
				minCount={ minCount }
			/>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────
   Image Components
───────────────────────────────────────────────────────────── */

const imgPreviewStyle = {
	maxWidth: '100%',
	height: 'auto',
	marginBottom: '8px',
	borderRadius: '4px',
};

/**
 * Image upload with preview.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.url      - Image URL.
 * @param {Function} props.onSelect - Select handler.
 * @param {Function} props.onRemove - Remove handler.
 * @param {string}   [props.label]  - Optional label.
 */
export function ImageUploader( { url, onSelect, onRemove, label } ) {
	return (
		<div style={ { marginBottom: '8px' } }>
			{ label && (
				<p style={ { marginBottom: '4px', fontWeight: '500' } }>
					{ label }
				</p>
			) }
			{ url ? (
				<>
					<img src={ url } alt="" style={ imgPreviewStyle } />
					<div style={ { display: 'flex', gap: '8px' } }>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelect }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										size="small"
										onClick={ open }
									>
										{ t( 'Replace' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						<Button
							variant="secondary"
							size="small"
							isDestructive
							onClick={ onRemove }
						>
							{ t( 'Remove' ) }
						</Button>
					</div>
				</>
			) : (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelect }
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<Button
								variant="secondary"
								icon={ upload }
								onClick={ open }
							>
								{ t( 'Upload Image' ) }
							</Button>
						) }
					/>
				</MediaUploadCheck>
			) }
		</div>
	);
}

/**
 * Small clickable icon picker.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.url      - Icon URL.
 * @param {Function} props.onSelect - Select handler.
 */
export function IconPicker( { url, onSelect } ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ ( media ) => onSelect( media.url ) }
				allowedTypes={ [ 'image' ] }
				render={ ( { open } ) => (
					<div
						onClick={ open }
						style={ {
							cursor: 'pointer',
							width: '24px',
							height: '24px',
							background: url ? 'transparent' : '#eee',
						} }
					>
						{ url && (
							<img
								src={ url }
								alt=""
								style={ { width: '100%', height: '100%' } }
							/>
						) }
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}

/* ─────────────────────────────────────────────────────────────
   Panel Components
───────────────────────────────────────────────────────────── */

const panelItemStyle = {
	marginBottom: '16px',
	padding: '12px',
	background: '#f0f0f0',
	borderRadius: '4px',
};

/**
 * Styled panel item container.
 * @param root0
 * @param root0.active
 * @param root0.onClick
 * @param root0.children
 */
export function PanelItem( { active, onClick, children } ) {
	return (
		<div
			style={ {
				...panelItemStyle,
				background: active ? '#e0e7ff' : '#f0f0f0',
			} }
			onClick={ onClick }
		>
			{ children }
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────
   Form Fields
───────────────────────────────────────────────────────────── */

/**
 * Standard TextControl wrapper.
 *
 * @param {Object}   props               - Component props.
 * @param {string}   props.label         - Field label.
 * @param {string}   props.value         - Field value.
 * @param {Function} props.onChange      - Change handler.
 * @param {string}   [props.placeholder] - Placeholder text.
 * @param {string}   [props.help]        - Help text.
 */

export function Field( {
	label,
	value,
	onChange,
	placeholder,
	help,
	...props
} ) {
	return (
		<TextControl
			label={ label }
			value={ value }
			onChange={ onChange }
			placeholder={ placeholder }
			help={ help }
			{ ...props }
		/>
	);
}

/**
 * ToggleControl wrapper.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.label    - Toggle label.
 * @param {boolean}  props.checked  - Toggle state.
 * @param {Function} props.onChange - Change handler.
 */
export function Toggle( { label, checked, onChange } ) {
	return (
		<ToggleControl
			label={ label }
			checked={ checked }
			onChange={ onChange }
		/>
	);
}

/* ─────────────────────────────────────────────────────────────
   Placeholder States
───────────────────────────────────────────────────────────── */
export function ImagePlaceholder( {
	text = t( 'No image set', 'ambrygen' ),
	minHeight = '100px',
} ) {
	const placeholderStyle = {
		color: '#999',
		fontSize: '12px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight,
		background: '#f0f0f0',
	};

	return <span style={ placeholderStyle }>{ text }</span>;
}

/**
 * HTML tag selector.
 *
 * @param {Object}   props                        - Component props.
 * @param {string}   [props.label]                - Label text.
 * @param {string}   props.value                  - Selected tag.
 * @param {Function} props.onChange               - Change handler.
 * @param {boolean}  [props.includeTextTags=true] - Include text tags.
 */
export function TagSelector( {
	label = t( 'HTML Tag' ),
	value = 'h2',
	onChange,
	includeTextTags = true,
} ) {
	const options = [
		{ label: 'H1', value: 'h1' },
		{ label: 'H2', value: 'h2' },
		{ label: 'H3', value: 'h3' },
		{ label: 'H4', value: 'h4' },
		{ label: 'H5', value: 'h5' },
		{ label: 'H6', value: 'h6' },
	];

	if ( includeTextTags ) {
		options.push(
			{ label: t( 'Paragraph' ), value: 'p' },
			{ label: t( 'Div' ), value: 'div' }
		);
	}

	return (
		<SelectControl
			label={ label }
			value={ value }
			options={ options }
			onChange={ onChange }
		/>
	);
}

/**
 * CTA Button field wrapper.
 *
 * @param {Object}   props                    - Component props.
 * @param {string}   [props.label]            - Field label.
 * @param {Object}   props.value              - Link value object.
 * @param {Function} props.onChange           - Change handler.
 * @param {string}   [props.help]             - Help text.
 * @param {boolean}  [props.showText=true]    - Show text field.
 * @param {string}   [props.textLabel]        - Text label.
 * @param {boolean}  [props.showVariant=true] - Show variant selector.
 * @param {string}   [props.variantLabel]     - Variant label.
 */
export function CtaButtonField( {
	label = t( 'Link' ),
	value = {},
	onChange,
	help,
	showText = true,
	textLabel = t( 'Link Text' ),
	showVariant = true,
	variantLabel = t( 'Button Style' ),
} ) {
	const linkValue = {
		url: value?.url || '',
		opensInNewTab: value?.target === '_blank',
	};

	const updateValue = ( updates ) => {
		onChange( {
			...value,
			...updates,
		} );
	};

	return (
		<div style={ { marginBottom: '16px' } }>
			{ label && (
				<p style={ { marginBottom: '6px', fontWeight: '500' } }>
					{ label }
				</p>
			) }

			{ showText && (
				<TextControl
					label={ textLabel }
					value={ value?.text || '' }
					onChange={ ( text ) => updateValue( { text } ) }
				/>
			) }

			{ showVariant && (
				<SelectControl
					label={ variantLabel }
					value={ value?.variant || 'dark' }
					options={ [
						{
							label: t( 'Light' ),
							value: 'is-style-site-tertiary-btn',
						},
						{ label: t( 'Dark' ), value: 'dark' },
					] }
					onChange={ ( variant ) => updateValue( { variant } ) }
				/>
			) }

			<LinkControl
				value={ linkValue }
				onChange={ ( newLink ) => {
					updateValue( {
						url: newLink.url,
						target: newLink.opensInNewTab ? '_blank' : '',
						rel: newLink.opensInNewTab ? 'noopener noreferrer' : '',
					} );
				} }
			/>

			{ help && (
				<p style={ { fontSize: '12px', color: '#666' } }>{ help }</p>
			) }
		</div>
	);
}
