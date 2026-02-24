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
} from '@wordpress/block-editor';
import { Button, Tooltip, PanelBody, CardDivider } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';

// Shared imports
import { useArrayHandlers, generateMenuId, t } from '../_shared/utils';
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
	image: '',
	imageId: 0,
	title: 'New Item',
	url: '#',
	text: 'Description here',
	hasSubmenu: false,
	submenuTitle: '',
	submenuLinks: [],
};

const DEFAULT_LINK = { label: 'New Link', url: '#', icon: '' };

/* ─────────────────────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────────────────────── */

/**
 * Submenu link editor with icon, label, URL, and remove button.
 * @param root0
 * @param root0.link
 * @param root0.itemIndex
 * @param root0.linkIndex
 * @param root0.onUpdate
 * @param root0.onRemove
 */
function SubmenuLink( { link, itemIndex, linkIndex, onUpdate, onRemove } ) {
	return (
		<li
			className="nav__item--mega-menu__submenu-inner--link-wrapper"
			style={ { position: 'relative' } }
		>
			<a
				href={ link.url }
				className="nav__item--mega-menu__submenu-inner--link"
				onClick={ ( e ) => e.preventDefault() }
			>
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
			</a>
			<div style={ { marginTop: '5px' } }>
				<Field
					value={ link.url }
					onChange={ ( v ) =>
						onUpdate( itemIndex, linkIndex, 'url', v )
					}
					placeholder={ t( 'Paste Link URL' ) }
				/>
			</div>
			<Tooltip text="Remove Link">
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

/**
 * Submenu section with title, links, and add button.
 * @param root0
 * @param root0.item
 * @param root0.index
 * @param root0.onUpdate
 * @param root0.onUpdateLink
 * @param root0.onAddLink
 * @param root0.onRemoveLink
 */
function SubmenuSection( {
	item,
	index,
	onUpdate,
	onUpdateLink,
	onAddLink,
	onRemoveLink,
} ) {
	if ( ! item.hasSubmenu ) {
		return (
			<div style={ { padding: '10px 0' } }>
				<Button
					variant="secondary"
					onClick={ () => onUpdate( index, 'hasSubmenu', true ) }
					style={ { width: '100%', justifyContent: 'center' } }
				>
					{ t( 'Add Submenu (Links)' ) }
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
						placeholder={ t( 'Submenu Title' ) }
					/>
					<Button
						icon={ trash }
						isSmall
						isDestructive
						onClick={ () => onUpdate( index, 'hasSubmenu', false ) }
						label={ t( 'Remove Section' ) }
					/>
				</div>
				<ul className="nav__item--mega-menu__submenu-inner--links">
					{ item.submenuLinks.map( ( link, linkIndex ) => (
						<SubmenuLink
							key={ linkIndex }
							link={ link }
							itemIndex={ index }
							linkIndex={ linkIndex }
							onUpdate={ onUpdateLink }
							onRemove={ onRemoveLink }
						/>
					) ) }
				</ul>
				<Button
					variant="secondary"
					icon={ plus }
					onClick={ () => onAddLink( index ) }
				>
					{ t( 'Add Link' ) }
				</Button>
			</div>
		</div>
	);
}

/**
 * Single menu item column in the preview.
 * @param root0
 * @param root0.item
 * @param root0.index
 * @param root0.onUpdate
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
						placeholder={ t( 'Title' ) }
					/>
				</div>
				<RichText
					tagName="p"
					className="nav__item--mega-menu__info caption-regular"
					value={ item.text }
					onChange={ ( v ) => onUpdate( index, 'text', v ) }
					placeholder={ t( 'Description' ) }
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
			links[ linkIndex ] = { ...links[ linkIndex ], [ key ]: value };
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
				<PanelBody title={ t( 'Menu Settings' ) } initialOpen>
					<Field
						label={ t( 'Menu Name' ) }
						value={ menuLabel }
						onChange={ ( v ) => setAttributes( { menuLabel: v } ) }
						help={ t(
							'Name this menu to easily find it in the Header settings.'
						) }
					/>
					<Field
						label={ t( 'Menu ID (System)' ) }
						value={ menuId }
						readOnly
						help={ t(
							'Unique ID used for linking (do not change).'
						) }
					/>
				</PanelBody>

				{ /* Menu Items */ }
				<PanelBody title={ t( 'Menu Items' ) } initialOpen>
					<p
						className="components-base-control__help"
						style={ { marginBottom: '12px' } }
					>
						{ t(
							`Manage up to ${ MAX_ITEMS } menu items. Current: ${ items.length }/${ MAX_ITEMS }`
						) }
					</p>

					{ items.map( ( item, index ) => (
						<PanelItem key={ index }>
							<ItemHeader
								index={ index }
								label={ item.title }
								total={ items.length }
								onMove={ move }
								onRemove={ remove }
							/>
							<ImageUploader
								url={ item.image }
								label={ t( 'Image' ) }
								onSelect={ ( media ) =>
									updateImage( index, media )
								}
								onRemove={ () => updateImage( index, null ) }
							/>
							<Field
								label={ t( 'Title' ) }
								value={ item.title }
								onChange={ ( v ) =>
									update( index, 'title', v )
								}
							/>
							<Field
								label={ t( 'URL' ) }
								value={ item.url }
								onChange={ ( v ) => update( index, 'url', v ) }
							/>
							<Field
								label={ t( 'Description' ) }
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
							{ t( 'Add Item' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ items.map( ( item, index ) => (
					<div key={ index } className="nav__item--mega-menu__item">
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
						/>
					</div>
				) ) }
			</div>
		</>
	);
}
