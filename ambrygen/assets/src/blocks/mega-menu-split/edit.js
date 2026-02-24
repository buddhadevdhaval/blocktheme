/**
 * Mega Menu Split Block - Edit Component
 *
 * Renders a split-view mega menu with left column navigation
 * and right side dynamic content that changes on item selection.
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
import { useState, useEffect, useCallback } from '@wordpress/element';

// Shared imports
import { useArrayHandlers, generateMenuId, t } from '../_shared/utils';
import {
	ItemHeader,
	ImageUploader,
	IconPicker,
	PanelItem,
	Field,
} from '../_shared/components';

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const DEFAULT_ITEM = {
	label: 'New Solution',
	url: '#',
	icon: '',
	image: '',
	imageId: 0,
	rightTitle: 'New Solution Title',
	rightText: 'Description',
	rightUrl: '#',
};

/* ─────────────────────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────────────────────── */

/**
 * Left column navigation item for the mega menu.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.item     Menu item data object.
 * @param {number}   props.index    Index of the item.
 * @param {boolean}  props.isActive Whether the item is currently active.
 * @param {Function} props.onSelect Callback fired when item is selected.
 * @param {Function} props.onUpdate Callback fired when item field updates.
 * @param {Function} props.onRemove Callback fired when item is removed.
 * @param {number}   props.total    Total number of items.
 * @return {JSX.Element}                       Rendered list item element.
 */
function LeftListItem( {
	item,
	index,
	isActive,
	onSelect,
	onUpdate,
	onRemove,
	total,
} ) {
	const handleClick = () => onSelect( index );

	return (
		<li
			style={ {
				position: 'relative',
				backgroundColor: isActive ? '#f0f0f0' : 'transparent',
				borderRadius: '4px',
			} }
			onClick={ handleClick }
		>
			<a
				href={ item.url }
				className="nav__item--mega-menu__submenu-inner--link submenu-inner-link"
				onClick={ ( e ) => e.preventDefault() }
			>
				<div className="nav__item--mega-menu__submenu-inner--icon">
					<IconPicker
						url={ item.icon }
						onSelect={ ( url ) => onUpdate( index, 'icon', url ) }
					/>
				</div>
				<RichText
					tagName="div"
					className="nav__item--mega-menu__submenu-inner--link-title body2-medium"
					value={ item.label }
					onChange={ ( v ) => onUpdate( index, 'label', v ) }
				/>
			</a>
			<div style={ { marginTop: '5px', paddingLeft: '32px' } }>
				<Field
					value={ item.url }
					onChange={ ( v ) => onUpdate( index, 'url', v ) }
					placeholder={ t( 'URL' ) }
					onClick={ ( e ) => e.stopPropagation() }
				/>
			</div>
			<Tooltip text="Remove Item">
				<Button
					icon={ trash }
					onClick={ ( e ) => {
						e.stopPropagation();
						onRemove( index );
					} }
					className="remove-link-btn"
					style={ {
						position: 'absolute',
						right: -30,
						top: 5,
						color: 'red',
					} }
					disabled={ total <= 1 }
				/>
			</Tooltip>
		</li>
	);
}

/**
 * Right side content panel displaying the active item's details.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.item     Active menu item object.
 * @param {number}   props.index    Index of the active item.
 * @param {Function} props.onUpdate Callback to update item fields.
 * @return {JSX.Element}             Rendered right panel element.
 */
function RightPanel( { item, index, onUpdate } ) {
	if ( ! item ) {
		return (
			<p>
				{ t(
					'Add an item on the left to configure right-side content.'
				) }
			</p>
		);
	}

	return (
		<div className="nav__item--mega-menu__category-submenu-lists category-submenu-lists">
			{ /* Image */ }
			<div className="nav__item--mega-menu__category-submenu-lists--image">
				<figure
					style={ {
						minHeight: '200px',
						background: '#f0f0f0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					} }
				>
					{ item.image ? (
						<img src={ item.image } alt="" />
					) : (
						<span style={ { color: '#999', fontSize: '12px' } }>
							{ t( 'No image set - use sidebar to upload' ) }
						</span>
					) }
				</figure>
			</div>

			{ /* Title */ }
			<div className="cat-submenu-link">
				<RichText
					tagName="div"
					className="body2-medium mb-0 nav__item--mega-menu__link-title"
					value={ item.rightTitle }
					onChange={ ( v ) => onUpdate( index, 'rightTitle', v ) }
					placeholder={ t( 'Right Side Title' ) }
				/>
				<div className="nav__item--mega-menu__links--icon" />
			</div>

			{ /* URL */ }
			<div style={ { margin: '10px 0' } }>
				<Field
					label={ t( 'Right Side URL' ) }
					value={ item.rightUrl || '' }
					onChange={ ( v ) => onUpdate( index, 'rightUrl', v ) }
					placeholder="https://..."
				/>
			</div>

			{ /* Description */ }
			<RichText
				tagName="p"
				className="nav__item--mega-menu__info caption-regular"
				value={ item.rightText }
				onChange={ ( v ) => onUpdate( index, 'rightText', v ) }
				placeholder={ t( 'Right Side Description' ) }
			/>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────
   Main Edit Component
───────────────────────────────────────────────────────────── */

export default function Edit( { attributes, setAttributes } ) {
	const { leftTitle, items, menuId, menuLabel } = attributes;

	// Auto-generate menu ID
	useEffect( () => {
		if ( ! menuId ) {
			setAttributes( { menuId: generateMenuId() } );
		}
	}, [ menuId, setAttributes ] );

	const [ activeIndex, setActiveIndex ] = useState( 0 );
	const blockProps = useBlockProps( {
		className:
			'nav__item--mega-menu__grid nav__item--mega-menu__second-level',
	} );

	// Array handlers
	const { update, add, remove, move } = useArrayHandlers(
		setAttributes,
		'items'
	);

	// Select item and scroll to it in sidebar
	const handleSelect = useCallback( ( index ) => {
		setActiveIndex( index );
		setTimeout( () => {
			document
				.getElementById( `mega-menu-solutions-item-${ index }` )
				?.scrollIntoView( {
					behavior: 'smooth',
					block: 'center',
				} );
		}, 50 );
	}, [] );

	const handleAdd = () => add( DEFAULT_ITEM );

	const handleRemove = ( index ) => {
		remove( index );
		setActiveIndex( ( prev ) => Math.max( 0, prev - 1 ) );
	};

	// Select last item when adding
	useEffect( () => {
		if ( items.length > 0 ) {
			setActiveIndex( items.length - 1 );
		}
	}, [ items.length ] );

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

	const activeItem = items[ activeIndex ] || null;

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

				{ /* Solution Items */ }
				<PanelBody title={ t( 'Solution Items' ) } initialOpen>
					<p
						className="components-base-control__help"
						style={ { marginBottom: '12px' } }
					>
						{ t(
							`Manage solution items. Current: ${ items.length } items`
						) }
					</p>

					{ items.map( ( item, index ) => (
						<PanelItem
							key={ index }
							active={ activeIndex === index }
							onClick={ () => setActiveIndex( index ) }
						>
							<div id={ `mega-menu-solutions-item-${ index }` }>
								<ItemHeader
									index={ index }
									label={ item.label }
									total={ items.length }
									onMove={ ( i, dir ) => {
										move( i, dir );
									} }
									onRemove={ handleRemove }
								/>
								<ImageUploader
									url={ item.image }
									label={ t( 'Right Side Image' ) }
									onSelect={ ( media ) =>
										updateImage( index, media )
									}
									onRemove={ () =>
										updateImage( index, null )
									}
								/>
								<Field
									label={ t( 'Label' ) }
									value={ item.label }
									onChange={ ( v ) =>
										update( index, 'label', v )
									}
									onClick={ ( e ) => e.stopPropagation() }
								/>
								<Field
									label={ t( 'URL' ) }
									value={ item.url }
									onChange={ ( v ) =>
										update( index, 'url', v )
									}
									onClick={ ( e ) => e.stopPropagation() }
								/>
								<Field
									label={ t( 'Right Title' ) }
									value={ item.rightTitle }
									onChange={ ( v ) =>
										update( index, 'rightTitle', v )
									}
									onClick={ ( e ) => e.stopPropagation() }
								/>
								<Field
									label={ t( 'Right URL' ) }
									value={ item.rightUrl || '' }
									onChange={ ( v ) =>
										update( index, 'rightUrl', v )
									}
									onClick={ ( e ) => e.stopPropagation() }
								/>
								{ index < items.length - 1 && <CardDivider /> }
							</div>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						icon={ plus }
						onClick={ handleAdd }
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ t( 'Add Item' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ /* Left Column */ }
				<div className="nav__item--mega-menu__cl-left">
					<div className="nav__item--mega-menu__submenu-inner nav__item--mega-menu__second-level--submenu-inner">
						<div className="nav__item--mega-menu__submenu-inner--col">
							<RichText
								tagName="p"
								className="nav__item--mega-menu__submenu-inner--title caption-semi-bold"
								value={ leftTitle }
								onChange={ ( v ) =>
									setAttributes( { leftTitle: v } )
								}
								placeholder={ t( 'Title' ) }
							/>
							<ul className="nav__item--mega-menu__submenu-inner--links">
								{ items.map( ( item, index ) => (
									<LeftListItem
										key={ index }
										item={ item }
										index={ index }
										isActive={ activeIndex === index }
										onSelect={ handleSelect }
										onUpdate={ update }
										onRemove={ handleRemove }
										total={ items.length }
									/>
								) ) }
							</ul>
							<Button
								variant="secondary"
								icon={ plus }
								onClick={ handleAdd }
							>
								{ t( 'Add Item' ) }
							</Button>
						</div>
					</div>
				</div>

				{ /* Right Column */ }
				<div className="nav__item--mega-menu__cl-right">
					<div className="nav__item--mega-menu__category-submenu-row">
						{ items.length > 0 ? (
							<RightPanel
								item={ activeItem }
								index={ activeIndex }
								onUpdate={ update }
							/>
						) : (
							<p>
								{ t(
									'Add an item on the left to configure right-side content.'
								) }
							</p>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
