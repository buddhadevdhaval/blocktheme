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
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { trash, chevronUp, chevronDown, upload } from '@wordpress/icons';

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
				label={ __( 'Move Up', 'ambrygen-web' ) }
			/>
			<Button
				icon={ chevronDown }
				size="small"
				disabled={ index >= total - 1 }
				onClick={ () => onMove( index, 1 ) }
				label={ __( 'Move Down', 'ambrygen-web' ) }
			/>
			<Button
				icon={ trash }
				size="small"
				isDestructive
				disabled={ total <= minCount }
				onClick={ () => onRemove( index ) }
				label={ __( 'Remove', 'ambrygen-web' ) }
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
			className="reorder-controls"
			style={ {
				justifyContent: 'space-between',
				marginBottom: '8px',
			} }
		>
			<strong>
				{ __( 'Item', 'ambrygen-web' ) } { index + 1 }:{ ' ' }
				{ label || __( 'Untitled', 'ambrygen-web' ) }
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
										{ __( 'Replace', 'ambrygen-web' ) }
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
							{ __( 'Remove', 'ambrygen-web' ) }
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
								{ __( 'Upload Image', 'ambrygen-web' ) }
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
					<button
						type="button"
						onClick={ open }
						style={ {
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							width: '24px',
							height: '24px',
							background: url ? 'transparent' : '#eee',
							border: 'none',
							padding: 0,
						} }
					>
						{ url && (
							<img
								src={ url }
								alt=""
								style={ { width: '100%', height: '100%' } }
							/>
						) }
					</button>
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
 *
 * @param {Object}   props          - Component props.
 * @param {boolean}  props.active   - Active state.
 * @param {Function} props.onClick  - Click handler.
 * @param {Object}   props.children - Child content.
 */
export function PanelItem( { active, onClick, children } ) {
	return (
		<button
			type="button"
			style={ {
				...panelItemStyle,
				background: active ? '#e0e7ff' : '#f0f0f0',
				border: 'none',
				width: '100%',
				textAlign: 'left',
			} }
			onClick={ onClick }
		>
			{ children }
		</button>
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
	text = __( 'No image set', 'ambrygen-web' ),
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
 * @param {Object}   props          - Component props.
 * @param {string}   [props.label]  - Label text.
 * @param {string}   props.value    - Selected tag.
 * @param {Function} props.onChange - Change handler.
 * @param {string}   [props.type]   - Tag type (heading | text | all).
 */
export function TagSelector( {
	label = __( 'HTML Tag', 'ambrygen-web' ),
	value = 'h2',
	onChange,
	type = 'all',
} ) {
	let options = [];

	const headingTags = [
		{ label: 'H1', value: 'h1' },
		{ label: 'H2', value: 'h2' },
		{ label: 'H3', value: 'h3' },
		{ label: 'H4', value: 'h4' },
		{ label: 'H5', value: 'h5' },
		{ label: 'H6', value: 'h6' },
	];

	const textTags = [
		{ label: __( 'Paragraph', 'ambrygen-web' ), value: 'p' },
		{ label: __( 'Div', 'ambrygen-web' ), value: 'div' },
	];

	if ( type === 'heading' ) {
		options = headingTags;
	} else if ( type === 'text' ) {
		options = textTags;
	} else {
		options = [ ...headingTags, ...textTags ];
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
 * @param {string}   [props.textPlaceholder]  - Text field placeholder.
 * @param {boolean}  [props.showVariant=true] - Show variant selector.
 * @param {string}   [props.variantLabel]     - Variant label.
 */

export function CtaButtonField( {
    label = __( 'Link', 'ambrygen-web' ),
    value = {},
    onChange,
    help,
    showText = true,
    textLabel = __( 'Link Text', 'ambrygen-web' ),
    textPlaceholder = '',
    showVariant = true,
    variantLabel = __( 'Button Style', 'ambrygen-web' ),
} ) {
 
    const updateValue = ( updates ) => {
        onChange( {
            ...value,
            ...updates,
        } );
    };
 
    const clearLink = () => {
        updateValue( {
            url: '',
            target: '',
            rel: '',
        } );
    };
 
    const linkValue = useMemo(
        () => ( {
            url: value?.url || '',
            title: value?.text || '',
            opensInNewTab: value?.target === '_blank',
        } ),
        [ value?.url, value?.text, value?.target ]
    );
 
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
                    placeholder={ textPlaceholder }
                    onChange={ ( text ) => updateValue( { text } ) }
                />
            ) }
 
            { showVariant && (
                <SelectControl
                    label={ variantLabel }
                    value={ value?.variant || 'dark' }
                    options={ [
                        {
                            label: __( 'Light', 'ambrygen-web' ),
                            value: 'is-style-site-tertiary-btn',
                        },
                        { label: __( 'Dark', 'ambrygen-web' ), value: 'dark' },
                    ] }
                    onChange={ ( variant ) => updateValue( { variant } ) }
                />
            ) }
 
            <LinkControl
                key={ `${ label }-${ value?.url || 'empty' }-${ value?.target || 'same-tab' }` }
                value={ linkValue }
                settings={ [] }
                onRemove={ value?.url ? clearLink : undefined }
                onChange={ ( newLink ) => {
                    updateValue( {
                        url: newLink?.url || '',
                        target: newLink.opensInNewTab ? '_blank' : '',
                        rel: newLink.opensInNewTab ? 'noopener noreferrer' : '',
                    } );
                } }
            />
 
            <ToggleControl
                label={ __( 'Open in new tab', 'ambrygen-web' ) }
                checked={ value?.target === '_blank' }
                onChange={ ( opensInNewTab ) =>
                    updateValue( {
                        target: opensInNewTab ? '_blank' : '',
                        rel: opensInNewTab ? 'noopener noreferrer' : '',
                    } )
                }
            />
 
            { help && (
                <p style={ { fontSize: '12px', color: '#666' } }>{ help }</p>
            ) }
        </div>
    );
}