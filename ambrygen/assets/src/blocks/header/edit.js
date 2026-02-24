/**
 * Header Block - Edit Component
 *
 * Renders the header block editor interface with:
 * - Top bar configuration
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

// Shared imports
import { useArrayHandlers, cx, t } from '../_shared/utils';
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
 * @param {Object}                             props
 * @param {Object}                             props.item
 * @param {string}                             props.item.label
 * @param {string}                             props.item.url
 * @param {boolean}                            props.item.hasMegaMenu
 * @param {string}                             props.item.megaMenuId
 * @param {boolean}                            props.item.isSecondLevel
 * @param {number}                             props.index
 * @param {number}                             props.total
 * @param {Function}                           props.onUpdate
 * @param {Function}                           props.onMove
 * @param {Function}                           props.onRemove
 * @param {Array<{label:string,value:string}>} props.menuOptions
 * @return {JSX.Element}
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
				label={ t( 'Label' ) }
				value={ item.label }
				onChange={ ( v ) => onUpdate( index, 'label', v ) }
			/>
			<Field
				label={ t( 'URL' ) }
				value={ item.url }
				onChange={ ( v ) => onUpdate( index, 'url', v ) }
			/>
			<Toggle
				label={ t( 'Has Mega Menu' ) }
				checked={ item.hasMegaMenu }
				onChange={ ( v ) => onUpdate( index, 'hasMegaMenu', v ) }
			/>
			{ item.hasMegaMenu && (
				<>
					<SelectControl
						label={ t( 'Select Mega Menu Instance' ) }
						value={ item.megaMenuId }
						options={ [
							{ label: t( '— Select a Menu —' ), value: '' },
							...menuOptions,
						] }
						onChange={ ( v ) => onUpdate( index, 'megaMenuId', v ) }
						help={ t(
							'Select the specific mega menu to display.'
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
							{ t( 'Unlink Menu' ) }
						</Button>
					) }
					<Toggle
						label={ t( 'Second Level Style' ) }
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
 * Top bar preview component.
 *
 * @param {Object}  props
 * @param {boolean} props.visible
 * @param {string}  props.text
 * @param {string}  props.linkText
 * @return {JSX.Element|null}
 */
function TopBar( { visible, text, linkText } ) {
	if ( ! visible ) {
		return null;
	}

	return (
		<div className="top-bar center-align container-1340" id="top-bar-ajax">
			<div className="top-bar__wrapper wrapper">
				<div className="top-bar__row">
					<div className="top-bar__text">
						{ text }
						{ linkText && (
							<span style={ { marginLeft: '5px' } }>
								<a
									href="#"
									className="top-bar__link is-style-link-text-btn"
									onClick={ ( e ) => e.preventDefault() }
								>
									{ linkText }
								</a>
							</span>
						) }
					</div>
					<div className="top-bar__close">
						<span className="top-bar__close-icon">×</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Navigation item in preview.
 *
 * @param {Object}   props
 * @param {Object}   props.item
 * @param {string}   props.item.label
 * @param {boolean}  props.item.hasMegaMenu
 * @param {string}   props.item.megaMenuId
 * @param {boolean}  props.isActive
 * @param {Function} props.onClick
 * @return {JSX.Element}
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
							className="nav__link"
							role="menuitem"
							onClick={ handleClick }
						>
							{ item.label }
						</a>
					</div>
				) : (
					<a
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
 * @param {boolean}     props.topBarVisible
 * @param {string}      props.topBarText
 * @param {string}      props.topBarLinkText
 * @param {Array}       props.navItems
 * @param {string}      props.loginText
 * @param {string|null} props.activeMenu
 * @param {string}      props.logoUrl
 * @param {string}      props.logoAlt
 * @param {Function}    props.onNavClick
 * @return {JSX.Element}
 */
function HeaderPreview( {
	topBarVisible,
	topBarText,
	topBarLinkText,
	navItems,
	loginText,
	activeMenu,
	logoUrl,
	logoAlt,
	onNavClick,
} ) {
	return (
		<>
			<TopBar
				visible={ topBarVisible }
				text={ topBarText }
				linkText={ topBarLinkText }
			/>
			<div className="header container-1340">
				<div className="wrapper">
					<div className="header__inner d-flex justify-content-between">
						{ /* Logo */ }
						<div className="header__logo logo">
							<a href="#" className="header__logo-link">
								<img
									className="header__logo-img header__logo-img--default"
									src={ logoUrl || DEFAULT_LOGO }
									alt={ logoAlt || t( 'Site Logo' ) }
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
										placeholder={ t( 'Search' ) }
										disabled
									/>
									<button
										className="button"
										type="button"
										disabled
									>
										{ t( 'Search' ) }
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
 * @return {JSX.Element}
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		topBarText,
		topBarVisible,
		navItems,
		loginUrl,
		loginText,
		mobileCtaText,
		mobileCtaUrl,
		logoUrl,
		logoAlt,
		topBarLinkText,
		topBarLinkUrl,
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
					label: b.attributes.menuLabel || t( 'Untitled Menu' ),
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
				<PanelBody title={ t( 'Logo Settings' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									logoUrl: media.url,
									logoId: media.id,
									logoAlt:
										media.alt || media.title || 'Site Logo',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ attributes.logoId }
							render={ ( { open } ) => (
								<ImageUploader
									url={ logoUrl }
									onSelect={ ( media ) => {
										setAttributes( {
											logoUrl: media.url,
											logoId: media.id,
											logoAlt:
												media.alt ||
												media.title ||
												'Site Logo',
										} );
									} }
									onRemove={ () =>
										setAttributes( {
											logoUrl: '',
											logoId: 0,
											logoAlt: '',
										} )
									}
									label={ t( 'Logo' ) }
								/>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Top Bar Settings */ }
				<PanelBody title={ t( 'Top Bar' ) } initialOpen={ false }>
					<Toggle
						label={ t( 'Show Top Bar' ) }
						checked={ topBarVisible }
						onChange={ ( v ) =>
							setAttributes( { topBarVisible: v } )
						}
					/>
					{ topBarVisible && (
						<>
							<Field
								label={ t( 'Message' ) }
								value={ topBarText }
								onChange={ ( v ) =>
									setAttributes( { topBarText: v } )
								}
							/>
							<CardDivider />
							<Field
								label={ t( 'Link Label' ) }
								value={ topBarLinkText }
								onChange={ ( v ) =>
									setAttributes( { topBarLinkText: v } )
								}
							/>
							<Field
								label={ t( 'Link URL' ) }
								value={ topBarLinkUrl }
								onChange={ ( v ) =>
									setAttributes( { topBarLinkUrl: v } )
								}
							/>
						</>
					) }
				</PanelBody>

				{ /* Navigation Items */ }
				<PanelBody title={ t( 'Navigation Items' ) } initialOpen>
					<p className="components-base-control__help">
						{ t(
							`Manage navigation items. Current: ${ navItems.length }`
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
						{ t( 'Add Nav Item' ) }
					</Button>
				</PanelBody>

				{ /* Mega Menu Management */ }
				<PanelBody title={ t( 'Manage Mega Menus' ) } initialOpen>
					<p className="description">
						{ t( 'Add new mega menu instances to link to.' ) }
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
							{ t( '+ Add 3-Column Menu' ) }
						</Button>
						<Button
							variant="secondary"
							onClick={ () =>
								addMegaMenu( 'ambrygen/mega-menu-split' )
							}
						>
							{ t( '+ Add Split View Menu' ) }
						</Button>
					</div>
				</PanelBody>

				{ /* CTA Buttons */ }
				<PanelBody title={ t( 'CTA Buttons' ) } initialOpen={ false }>
					<Field
						label={ t( 'Login Text' ) }
						value={ loginText }
						onChange={ ( v ) => setAttributes( { loginText: v } ) }
					/>
					<Field
						label={ t( 'Login URL' ) }
						value={ loginUrl }
						onChange={ ( v ) => setAttributes( { loginUrl: v } ) }
					/>
					<CardDivider />
					<Field
						label={ t( 'Mobile CTA Text' ) }
						value={ mobileCtaText }
						onChange={ ( v ) =>
							setAttributes( { mobileCtaText: v } )
						}
					/>
					<Field
						label={ t( 'Mobile CTA URL' ) }
						value={ mobileCtaUrl }
						onChange={ ( v ) =>
							setAttributes( { mobileCtaUrl: v } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<HeaderPreview
					topBarVisible={ topBarVisible }
					topBarText={ topBarText }
					topBarLinkText={ topBarLinkText }
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
								{ t( 'Editing Menu:' ) }{ ' ' }
								{ megaMenuOptions.find(
									( o ) => o.value === activeMenuId
								)?.label || 'Unknown Menu' }
							</span>
							<button
								type="button"
								className="header-editor__active-header-close"
								onClick={ () => setActiveMenuId( null ) }
							>
								✕ { t( 'Close' ) }
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
									{ t( 'Manage Mega Menu Blocks:' ) }
								</strong>{ ' ' }
								{ t(
									'Use the "Manage Mega Menus" panel in the sidebar to add new menus. Click a menu item above to edit its linked menu.'
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
