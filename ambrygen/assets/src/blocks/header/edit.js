/**
 * Header Block - Edit Component
 *
 * Renders the header block editor interface with:
 * - Navigation items management
 * - Mega menu block assignments
 *
 * @package
 */
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	Button,
	CardDivider,
	SelectControl,
} from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Shared imports
import { useArrayHandlers, cx } from '../_shared/utils';
import {
	ItemHeader,
	ImageUploader,
	Field,
	Toggle,
} from '../_shared/components';

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const ALLOWED_BLOCKS = [
	'ambrygen/mega-menu-3-columns',
	'ambrygen/mega-menu-split',
];

const TEMPLATE = [
	[ 'ambrygen/mega-menu-3-columns', {} ],
	[ 'ambrygen/mega-menu-split', {} ],
];

const DEFAULT_NAV_ITEM = {
	label: 'New Item',
	url: '#',
	hasMegaMenu: false,
	megaMenuId: '',
	isSecondLevel: false,
};

const DEFAULT_LOGO =
	'/wp-content/themes/ambrygen/assets/src/images/site-logo.svg';

/* ─────────────────────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────────────────────── */

/**
 * Single navigation item editor in sidebar.
 *
 * @param {Object}                             props             The component props.
 * @param {Object}                             props.item        The navigation item.
 * @param {number}                             props.index       Item index.
 * @param {number}                             props.total       Total items.
 * @param {Function}                           props.onUpdate    Update handler.
 * @param {Function}                           props.onMove      Move handler.
 * @param {Function}                           props.onRemove    Remove handler.
 * @param {Array<{label:string,value:string}>} props.menuOptions Menu options.
 * @return {JSX.Element} The rendered element.
 */
function NavItemEditor( {
	item,
	index,
	total,
	onUpdate,
	onMove,
	onRemove,
	menuOptions,
} ) {
	return (
		<div className="header-editor__nav-item-panel">
			<ItemHeader
				index={ index }
				label={ item.label }
				total={ total }
				onMove={ onMove }
				onRemove={ onRemove }
			/>
			<Field
				label={ __( 'Label', 'ambrygen-web' ) }
				value={ item.label }
				onChange={ ( v ) => onUpdate( index, 'label', v ) }
			/>
			<Field
				label={ __( 'URL', 'ambrygen-web' ) }
				value={ item.url }
				onChange={ ( v ) => onUpdate( index, 'url', v ) }
			/>
			<Toggle
				label={ __( 'Has Mega Menu', 'ambrygen-web' ) }
				checked={ item.hasMegaMenu }
				onChange={ ( v ) => onUpdate( index, 'hasMegaMenu', v ) }
			/>
			{ item.hasMegaMenu && (
				<>
					<SelectControl
						label={ __( 'Select Mega Menu Instance', 'ambrygen-web' ) }
						value={ item.megaMenuId }
						options={ [
							{ label: __( '— Select a Menu —', 'ambrygen-web' ), value: '' },
							...menuOptions,
						] }
						onChange={ ( v ) => onUpdate( index, 'megaMenuId', v ) }
						help={ __(
							'Select the specific mega menu to display.',
							'ambrygen-web'
						) }
					/>
					{ item.megaMenuId && (
						<Button
							variant="secondary"
							isDestructive
							onClick={ () =>
								onUpdate( index, 'megaMenuId', '' )
							}
						>
							{ __( 'Unlink Menu', 'ambrygen-web' ) }
						</Button>
					) }
					<Toggle
						label={ __( 'Second Level Style', 'ambrygen-web' ) }
						checked={ item.isSecondLevel }
						onChange={ ( v ) =>
							onUpdate( index, 'isSecondLevel', v )
						}
					/>
				</>
			) }
		</div>
	);
}

/**
 * Navigation item in preview.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.item     The navigation item.
 * @param {boolean}  props.isActive If active.
 * @param {Function} props.onClick  Click handler.
 * @return {JSX.Element} The rendered element.
 */
function NavItem( { item, isActive, onClick } ) {
	const classes = cx(
		'nav__item',
		item.hasMegaMenu &&
			'nav__item--has-children nav__item--menu-has-children',
		isActive && 'nav__item--active'
	);

	const handleClick = ( e ) => {
		e.preventDefault();
		onClick( item );
	};

	return (
		<li className={ classes }>
			<div className="nav__item--angle">
				{ item.hasMegaMenu ? (
					<div className="nav__item--tringle-touch">
						<a
							href={ item.url || '#' }
							className="nav__link"
							role="menuitem"
							onClick={ handleClick }
						>
							{ item.label }
						</a>
					</div>
				) : (
					<a
						href={ item.url || '#' }
						className="nav__link"
						role="menuitem"
						onClick={ handleClick }
					>
						{ item.label }
					</a>
				) }
			</div>
			{ item.hasMegaMenu && <span className="nav__expand" /> }
		</li>
	);
}

/**
 * Header preview in the editor.
 *
 * @param {Object}      props
 * @param {Array}       props.navItems
 * @param {string}      props.loginText
 * @param {string|null} props.activeMenu
 * @param {string}      props.logoUrl
 * @param {string}      props.logoAlt
 * @param {Function}    props.onNavClick
 * @return {JSX.Element} The rendered element.
 */
function HeaderPreview( {
	navItems,
	loginText,
	activeMenu,
	logoUrl,
	logoAlt,
	onNavClick,
} ) {
	return (
		<>
			<div className="header container-1340">
				<div className="wrapper">
					<div className="header__inner d-flex justify-content-between">
						{ /* Logo */ }
						<div className="header__logo logo">
							<a href="/" className="header__logo-link">
								<img
									className="header__logo-img header__logo-img--default"
									src={ logoUrl || DEFAULT_LOGO }
									alt={ logoAlt || __( 'Site Logo', 'ambrygen-web' ) }
								/>
							</a>
						</div>

						{ /* Right Section */ }
						<div className="header__right">
							<div className="nav">
								<div className="nav__overlay">
									<div className="nav__container">
										<nav className="nav__menu">
											<ul className="nav__list">
												{ navItems.map( ( item, i ) => (
													<NavItem
														key={ i }
														item={ item }
														isActive={
															activeMenu ===
															item.megaMenuId
														}
														onClick={ onNavClick }
													/>
												) ) }
											</ul>
										</nav>
									</div>
								</div>
							</div>
						</div>

						{ /* CTA Buttons */ }
						<div className="header__right--col header__btns--desktop">
							<div className="header__search">
								<form id="header-search-form" role="search">
									<input
										type="text"
										name="s"
										placeholder={ __( 'Search', 'ambrygen-web' ) }
										disabled
									/>
									<button
										className="button"
										type="button"
										disabled
									>
										{ __( 'Search', 'ambrygen-web' ) }
									</button>
								</form>
							</div>
							<div className="header__login">
								<span className="site-btn is-style-site-marker-btn">
									{ loginText }
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

/* ─────────────────────────────────────────────────────────────
   Main Edit Component
───────────────────────────────────────────────────────────── */
/**
 * Edit component for Header block.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {string}   props.clientId
 * @return {JSX.Element} The rendered element.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		navItems,
		loginUrl,
		loginText,
		mobileCtaText,
		mobileCtaUrl,
		logoUrl,
		logoAlt,
	} = attributes;

	// Get inner blocks (mega menus)
	const { innerBlocks } = useSelect(
		( select ) => ( {
			innerBlocks: select( 'core/block-editor' ).getBlocks( clientId ),
		} ),
		[ clientId ]
	);

	const { insertBlock } = useDispatch( 'core/block-editor' );
	const blockProps = useBlockProps( {
		className: 'header-section header-block-editor',
	} );

	// Array handlers for nav items
	const {
		update: updateNav,
		add: addNav,
		remove: removeNav,
		move: moveNav,
	} = useArrayHandlers( setAttributes, 'navItems' );

	const handleAddNav = () => addNav( DEFAULT_NAV_ITEM );

	// Track active mega menu
	const [ activeMenuId, setActiveMenuId ] = useState( null );

	// Generate menu options from inner blocks
	const megaMenuOptions = useMemo(
		() =>
			innerBlocks
				.map( ( b ) => ( {
					label:
						b.attributes.menuLabel ||
						__( 'Untitled Menu', 'ambrygen-web' ),
					value: b.attributes.menuId || '',
				} ) )
				.filter( ( o ) => o.value ),
		[ innerBlocks ]
	);

	// Toggle mega menu visibility
	const handleNavClick = useCallback( ( item ) => {
		if ( item.hasMegaMenu && item.megaMenuId ) {
			setActiveMenuId( ( prev ) =>
				prev === item.megaMenuId ? null : item.megaMenuId
			);
		}
	}, [] );

	// Add new mega menu block
	const addMegaMenu = useCallback(
		( blockName ) => {
			insertBlock(
				createBlock( blockName ),
				innerBlocks.length,
				clientId
			);
		},
		[ innerBlocks.length, clientId, insertBlock ]
	);

	// Find active block for styling
	const activeBlockClientId = useMemo(
		() =>
			innerBlocks.find( ( b ) => b.attributes.menuId === activeMenuId )
				?.clientId,
		[ innerBlocks, activeMenuId ]
	);

	const innerBlocksClass = cx(
		'header-editor__inner-blocks',
		activeMenuId &&
			'header-editor__inner-blocks--has-active header-editor__inner-blocks--filter-active'
	);

	return (
		<>
			<InspectorControls>
				{ /* Logo Settings */ }
				<PanelBody title={ __( 'Logo Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									logoUrl: media.url,
									logoId: media.id,
									logoAlt:
										media.alt ||
										media.title ||
										__( 'Site Logo', 'ambrygen-web' ),
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ attributes.logoId }
							render={ () => (
								<ImageUploader
									url={ logoUrl }
									onSelect={ ( media ) => {
										setAttributes( {
											logoUrl: media.url,
											logoId: media.id,
											logoAlt:
												media.alt ||
												media.title ||
												__( 'Site Logo', 'ambrygen-web' ),
										} );
									} }
									onRemove={ () =>
										setAttributes( {
											logoUrl: '',
											logoId: 0,
											logoAlt: '',
										} )
									}
									label={ __( 'Logo', 'ambrygen-web' ) }
								/>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Navigation Items */ }
				<PanelBody title={ __( 'Navigation Items', 'ambrygen-web' ) } initialOpen>
					<p className="components-base-control__help">
						{ __(
							`Manage navigation items. Current: ${ navItems.length }`,
							'ambrygen-web'
						) }
					</p>
					{ navItems.map( ( item, i ) => (
						<NavItemEditor
							key={ i }
							item={ item }
							index={ i }
							total={ navItems.length }
							onUpdate={ updateNav }
							onRemove={ removeNav }
							onMove={ moveNav }
							menuOptions={ megaMenuOptions }
						/>
					) ) }
					<Button
						variant="primary"
						icon={ plus }
						onClick={ handleAddNav }
						className="header-editor__add-nav-btn"
					>
						{ __( 'Add Nav Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				{ /* Mega Menu Management */ }
				<PanelBody title={ __( 'Manage Mega Menus', 'ambrygen-web' ) } initialOpen>
					<p className="description">
						{ __( 'Add new mega menu instances to link to.', 'ambrygen-web' ) }
					</p>
					<div
						className="header-editor__add-menu-buttons"
						style={ {
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
							marginTop: '10px',
						} }
					>
						<Button
							variant="secondary"
							onClick={ () =>
								addMegaMenu( 'ambrygen/mega-menu-3-columns' )
							}
						>
							{ __( '+ Add 3-Column Menu', 'ambrygen-web' ) }
						</Button>
						<Button
							variant="secondary"
							onClick={ () =>
								addMegaMenu( 'ambrygen/mega-menu-split' )
							}
						>
							{ __( '+ Add Split View Menu', 'ambrygen-web' ) }
						</Button>
					</div>
				</PanelBody>

				{ /* CTA Buttons */ }
				<PanelBody title={ __( 'CTA Buttons', 'ambrygen-web' ) } initialOpen={ false }>
					<Field
						label={ __( 'Login Text', 'ambrygen-web' ) }
						value={ loginText }
						onChange={ ( v ) => setAttributes( { loginText: v } ) }
					/>
					<Field
						label={ __( 'Login URL', 'ambrygen-web' ) }
						value={ loginUrl }
						onChange={ ( v ) => setAttributes( { loginUrl: v } ) }
					/>
					<CardDivider />
					<Field
						label={ __( 'Mobile CTA Text', 'ambrygen-web' ) }
						value={ mobileCtaText }
						onChange={ ( v ) =>
							setAttributes( { mobileCtaText: v } )
						}
					/>
					<Field
						label={ __( 'Mobile CTA URL', 'ambrygen-web' ) }
						value={ mobileCtaUrl }
						onChange={ ( v ) =>
							setAttributes( { mobileCtaUrl: v } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<HeaderPreview
					navItems={ navItems }
					loginText={ loginText }
					activeMenu={ activeMenuId }
					logoUrl={ logoUrl }
					logoAlt={ logoAlt }
					onNavClick={ handleNavClick }
				/>

				<div className="header-editor__mega-menus">
					{ activeMenuId && (
						<div className="header-editor__active-header">
							<span className="header-editor__active-header-title">
								{ __( 'Editing Menu:', 'ambrygen-web' ) }{ ' ' }
								{ megaMenuOptions.find(
									( o ) => o.value === activeMenuId
								)?.label || __( 'Unknown Menu', 'ambrygen-web' ) }
							</span>
							<button
								type="button"
								className="header-editor__active-header-close"
								onClick={ () => setActiveMenuId( null ) }
							>
								✕ { __( 'Close', 'ambrygen-web' ) }
							</button>
						</div>
					) }

					<div className={ innerBlocksClass }>
						{ activeMenuId && activeBlockClientId && (
							<style>{ `
								.header-editor__inner-blocks--filter-active .block-editor-block-list__layout [data-block="${ activeBlockClientId }"] {
									display: grid !important;
								}
							` }</style>
						) }

						{ ! activeMenuId && (
							<p className="header-editor__management-info">
								<strong>
									{ __( 'Manage Mega Menu Blocks:', 'ambrygen-web' ) }
								</strong>{ ' ' }
								{ __(
									'Use the "Manage Mega Menus" panel in the sidebar to add new menus. Click a menu item above to edit its linked menu.',
									'ambrygen-web'
								) }
							</p>
						) }

						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
