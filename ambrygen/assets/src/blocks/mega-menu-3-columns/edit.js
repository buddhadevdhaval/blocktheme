/**
 * Mega Menu 3-Columns Block - Edit Component
 *
 * Renders a 3-column mega menu with image, title, description,
 * and optional submenu links for each column.
 *
 * @package
 */
import {
	useBlockProps,
	RichText,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	Button,
	Tooltip,
	PanelBody,
	CardDivider,
	ToggleControl,
} from '@wordpress/components';
import { plus, trash, chevronUp, chevronDown } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

// Shared imports
import {
	useArrayHandlers,
	generateMenuId,
	ensureArrayItemIds,
} from '../_shared/utils';
import {
	ItemHeader,
	ImageUploader,
	IconPicker,
	PanelItem,
	Field,
	ImagePlaceholder,
} from '../_shared/components';

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const MAX_ITEMS = 3;

const DEFAULT_ITEM = {
	id: generateMenuId(),
	image: '',
	imageId: 0,
	title: 'New Item',
	url: '#',
	text: 'Description here',
	hasSubmenu: false,
	submenuTitle: '',
	submenuLinks: [],
};

const DEFAULT_LINK = {
	id: generateMenuId(),
	label: 'New Link',
	url: '#',
	icon: '',
	opensInNewTab: false,
	target: '',
	rel: '',
};

/* ─────────────────────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────────────────────── */

function SubmenuLink( {
	link,
	itemIndex,
	linkIndex,
	totalLinks,
	onUpdate,
	onRemove,
	onMove,
	onSelectLink,
	isSelected,
} ) {
	return (
		<li
			className="nav__item--mega-menu__submenu-inner--link-wrapper"
			style={ { position: 'relative' } }
		>
			<div style={ { marginBottom: '4px' } }>
				<Button
					icon={ chevronUp }
					size="small"
					disabled={ linkIndex === 0 }
					onClick={ () => onMove( itemIndex, linkIndex, -1 ) }
					label={ __( 'Move Up', 'ambrygen-web' ) }
				/>
				<Button
					icon={ chevronDown }
					size="small"
					disabled={ linkIndex >= totalLinks - 1 }
					onClick={ () => onMove( itemIndex, linkIndex, 1 ) }
					label={ __( 'Move Down', 'ambrygen-web' ) }
				/>
			</div>
			<div className="nav__item--mega-menu__submenu-inner--link">
				<div className="nav__item--mega-menu__submenu-inner--icon">
					<IconPicker
						url={ link.icon }
						onSelect={ ( url ) =>
							onUpdate( itemIndex, linkIndex, 'icon', url )
						}
					/>
				</div>
				<RichText
					tagName="div"
					className="nav__item--mega-menu__submenu-inner--link-title body2-medium"
					value={ link.label }
					onChange={ ( v ) =>
						onUpdate( itemIndex, linkIndex, 'label', v )
					}
				/>
			</div>
			<div style={ { marginTop: '5px', marginBottom: '8px' } }>
				<Field
					value={ link.url || '' }
					onChange={ ( value ) =>
						onUpdate( itemIndex, linkIndex, 'url', value )
					}
					placeholder={ __( 'Paste Link URL', 'ambrygen-web' ) }
				/>
				<Button
					variant="secondary"
					size="small"
					onClick={ () => onSelectLink( itemIndex, linkIndex ) }
					style={ { marginTop: '8px' } }
				>
					{ isSelected
						? __( 'Close Link Picker', 'ambrygen-web' )
						: __( 'Open Link Picker', 'ambrygen-web' ) }
				</Button>
				{ isSelected && (
					<div style={ { marginTop: '8px' } }>
						<URLInput
							value={ link.url || '' }
							onChange={ ( url ) => {
								onUpdate(
									itemIndex,
									linkIndex,
									'url',
									url || ''
								);
							} }
						/>
						<ToggleControl
							label={ __( 'Open in new tab', 'ambrygen-web' ) }
							checked={
								!! link.opensInNewTab ||
								link.target === '_blank'
							}
							onChange={ ( checked ) => {
								onUpdate( itemIndex, linkIndex, {
									opensInNewTab: checked,
									target: checked ? '_blank' : '',
									rel: checked ? 'noopener noreferrer' : '',
								} );
							} }
						/>
					</div>
				) }
			</div>
			<Tooltip text={ __( 'Remove Link', 'ambrygen-web' ) }>
				<Button
					icon={ trash }
					onClick={ () => onRemove( itemIndex, linkIndex ) }
					className="remove-link-btn"
					style={ {
						position: 'absolute',
						right: -30,
						top: 5,
						color: 'red',
					} }
				/>
			</Tooltip>
		</li>
	);
}

function SubmenuSection( {
	item,
	index,
	onUpdate,
	onUpdateLink,
	onAddLink,
	onRemoveLink,
	onMoveLink,
	onSelectLink,
	selectedSubmenuLink,
} ) {
	if ( ! item.hasSubmenu ) {
		return (
			<div style={ { padding: '10px 0' } }>
				<Button
					variant="secondary"
					onClick={ () => onUpdate( index, 'hasSubmenu', true ) }
					style={ { width: '100%', justifyContent: 'center' } }
				>
					{ __( 'Add Submenu (Links)', 'ambrygen-web' ) }
				</Button>
			</div>
		);
	}

	return (
		<div className="nav__item--mega-menu__submenu-inner">
			<div className="nav__item--mega-menu__submenu-inner--col">
				<div
					style={ {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					} }
				>
					<RichText
						tagName="p"
						className="nav__item--mega-menu__submenu-inner--title caption-semi-bold"
						value={ item.submenuTitle }
						onChange={ ( v ) =>
							onUpdate( index, 'submenuTitle', v )
						}
						placeholder={ __( 'Submenu Title', 'ambrygen-web' ) }
					/>
					<Button
						icon={ trash }
						isSmall
						isDestructive
						onClick={ () => onUpdate( index, 'hasSubmenu', false ) }
						label={ __( 'Remove Section', 'ambrygen-web' ) }
					/>
				</div>
				<ul className="nav__item--mega-menu__submenu-inner--links">
					{ item.submenuLinks.map( ( link, linkIndex ) => (
						<SubmenuLink
							key={ linkIndex }
							link={ link }
							itemIndex={ index }
							linkIndex={ linkIndex }
							totalLinks={ item?.submenuLinks?.length || 0 }
							onUpdate={ onUpdateLink }
							onRemove={ onRemoveLink }
							onMove={ onMoveLink }
							onSelectLink={ onSelectLink }
							isSelected={
								selectedSubmenuLink?.itemIndex === index &&
								selectedSubmenuLink?.linkIndex === linkIndex
							}
						/>
					) ) }
				</ul>
				<Button
					variant="secondary"
					icon={ plus }
					onClick={ () => onAddLink( index ) }
				>
					{ __( 'Add Link', 'ambrygen-web' ) }
				</Button>
			</div>
		</div>
	);
}

/**
 * Single menu item column in the preview.
 *
 * @param {Object}   props          Component properties.
 * @param {Object}   props.item     The menu item data object.
 * @param {number}   props.index    Index of the menu item.
 * @param {Function} props.onUpdate Callback to update item fields.
 */
function MenuItem( { item, index, onUpdate } ) {
	return (
		<div className="nav__item--mega-menu__item">
			<div className="nav__item--mega-menu__col">
				<figure className="nav__item--mega-menu__image">
					{ item.image ? (
						<img src={ item.image } alt="" />
					) : (
						<ImagePlaceholder />
					) }
				</figure>
				<div className="nav__item--mega-menu__links">
					<RichText
						tagName="p"
						className="body2-medium mb-0 nav__item--mega-menu__link-title"
						value={ item.title }
						onChange={ ( v ) => onUpdate( index, 'title', v ) }
						placeholder={ __( 'Title', 'ambrygen-web' ) }
					/>
				</div>
				<RichText
					tagName="p"
					className="nav__item--mega-menu__info caption-regular"
					value={ item.text }
					onChange={ ( v ) => onUpdate( index, 'text', v ) }
					placeholder={ __( 'Description', 'ambrygen-web' ) }
				/>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────
   Main Edit Component
───────────────────────────────────────────────────────────── */

export default function Edit( { attributes, setAttributes } ) {
	const { items, menuId, menuLabel } = attributes;
	const [ selectedSubmenuLink, setSelectedSubmenuLink ] = useState( null );

	// Auto-generate menu ID
	useEffect( () => {
		if ( ! menuId ) {
			setAttributes( { menuId: generateMenuId() } );
		}
	}, [ menuId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'nav__item--mega-menu__grid',
	} );

	// Array handlers for items
	const { update, add, remove, move } = useArrayHandlers(
		setAttributes,
		'items'
	);

	useEffect( () => {
		let hasChanges = false;
		const normalizedItems = ensureArrayItemIds( items ).items.map(
			( item ) => {
				const normalizedLinks = ensureArrayItemIds(
					item.submenuLinks || []
				);

				if ( ! item.id || normalizedLinks.hasChanges ) {
					hasChanges = true;
				}

				return normalizedLinks.hasChanges
					? { ...item, submenuLinks: normalizedLinks.items }
					: item;
			}
		);

		if ( hasChanges ) {
			setAttributes( { items: normalizedItems } );
		}
	}, [ items, setAttributes ] );

	const handleAdd = () => {
		if ( items.length < MAX_ITEMS ) {
			add( DEFAULT_ITEM );
		}
	};

	// Submenu link handlers
	const updateSubmenuLink = ( itemIndex, linkIndex, key, value ) => {
		setAttributes( ( prev ) => {
			const newItems = [ ...prev.items ];
			const links = [ ...newItems[ itemIndex ].submenuLinks ];
			const updates =
				typeof key === 'object' && key !== null
					? key
					: { [ key ]: value };
			links[ linkIndex ] = { ...links[ linkIndex ], ...updates };
			newItems[ itemIndex ] = {
				...newItems[ itemIndex ],
				submenuLinks: links,
			};
			return { items: newItems };
		} );
	};

	const addSubmenuLink = ( itemIndex ) => {
		setAttributes( ( prev ) => {
			const newItems = [ ...prev.items ];
			newItems[ itemIndex ] = {
				...newItems[ itemIndex ],
				submenuLinks: [
					...newItems[ itemIndex ].submenuLinks,
					{ ...DEFAULT_LINK },
				],
			};
			return { items: newItems };
		} );
	};

	const removeSubmenuLink = ( itemIndex, linkIndex ) => {
		setAttributes( ( prev ) => {
			const newItems = [ ...prev.items ];
			newItems[ itemIndex ] = {
				...newItems[ itemIndex ],
				submenuLinks: newItems[ itemIndex ].submenuLinks.filter(
					( _, i ) => i !== linkIndex
				),
			};
			return { items: newItems };
		} );
		setSelectedSubmenuLink( null );
	};

	const moveSubmenuLink = ( itemIndex, fromIndex, direction ) => {
		const toIndex = fromIndex + direction;
		if ( fromIndex === toIndex ) {
			return;
		}
		setAttributes( ( prev ) => {
			const newItems = [ ...prev.items ];
			const links = [ ...newItems[ itemIndex ].submenuLinks ];
			if ( toIndex < 0 || toIndex >= links.length ) {
				return prev;
			}
			const [ movedLink ] = links.splice( fromIndex, 1 );
			links.splice( toIndex, 0, movedLink );
			newItems[ itemIndex ] = {
				...newItems[ itemIndex ],
				submenuLinks: links,
			};
			return { items: newItems };
		} );
	};

	// Image update helper
	const updateImage = ( index, media ) => {
		setAttributes( ( prev ) => {
			const newItems = [ ...prev.items ];
			newItems[ index ] = {
				...newItems[ index ],
				image: media?.url || '',
				imageId: media?.id || 0,
			};
			return { items: newItems };
		} );
	};

	return (
		<>
			<InspectorControls>
				{ /* Menu Settings */ }
				<PanelBody
					title={ __( 'Menu Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<Field
						label={ __( 'Menu Name', 'ambrygen-web' ) }
						value={ menuLabel }
						onChange={ ( v ) => setAttributes( { menuLabel: v } ) }
						help={ __(
							'Name this menu to easily find it in the Header settings.',
							'ambrygen-web'
						) }
					/>
					<Field
						label={ __( 'Menu ID (System)', 'ambrygen-web' ) }
						value={ menuId }
						readOnly
						help={ __(
							'Unique ID used for linking (do not change).',
							'ambrygen-web'
						) }
					/>
				</PanelBody>

				{ /* Menu Items */ }
				<PanelBody
					title={ __( 'Menu Items', 'ambrygen-web' ) }
					initialOpen
				>
					<p
						className="components-base-control__help"
						style={ { marginBottom: '12px' } }
					>
						{ sprintf(
							/* translators: 1: maximum menu items allowed, 2: current item count. */
							__(
								'Manage up to %1$d menu items. Current: %2$d/%1$d',
								'ambrygen-web'
							),
							MAX_ITEMS,
							items.length
						) }
					</p>

					{ items.map( ( item, index ) => (
						<PanelItem key={ item.id || item.title || item.url }>
							<ItemHeader
								index={ index }
								label={ item.title }
								total={ items.length }
								onMove={ move }
								onRemove={ remove }
							/>
							<ImageUploader
								url={ item.image }
								label={ __( 'Image', 'ambrygen-web' ) }
								onSelect={ ( media ) =>
									updateImage( index, media )
								}
								onRemove={ () => updateImage( index, null ) }
							/>
							<Field
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ item.title }
								onChange={ ( v ) =>
									update( index, 'title', v )
								}
							/>
							<Field
								label={ __( 'URL', 'ambrygen-web' ) }
								value={ item.url }
								onChange={ ( v ) => update( index, 'url', v ) }
							/>
							<Field
								label={ __( 'Description', 'ambrygen-web' ) }
								value={ item.text }
								onChange={ ( v ) => update( index, 'text', v ) }
							/>
							{ index < items.length - 1 && <CardDivider /> }
						</PanelItem>
					) ) }

					{ items.length < MAX_ITEMS && (
						<Button
							variant="primary"
							icon={ plus }
							onClick={ handleAdd }
							style={ {
								width: '100%',
								justifyContent: 'center',
							} }
						>
							{ __( 'Add Item', 'ambrygen-web' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ items.map( ( item, index ) => (
					<div
						key={ item.id || item.title || item.url }
						className="nav__item--mega-menu__item"
					>
						<MenuItem
							item={ item }
							index={ index }
							onUpdate={ update }
						/>
						<SubmenuSection
							item={ item }
							index={ index }
							onUpdate={ update }
							onUpdateLink={ updateSubmenuLink }
							onAddLink={ addSubmenuLink }
							onRemoveLink={ removeSubmenuLink }
							onMoveLink={ moveSubmenuLink }
							onSelectLink={ ( itemIndex, linkIndex ) =>
								setSelectedSubmenuLink( ( prev ) => {
									if (
										prev?.itemIndex === itemIndex &&
										prev?.linkIndex === linkIndex
									) {
										return null;
									}
									return {
										itemIndex,
										linkIndex,
									};
								} )
							}
							selectedSubmenuLink={ selectedSubmenuLink }
						/>
					</div>
				) ) }
			</div>
		</>
	);
}
