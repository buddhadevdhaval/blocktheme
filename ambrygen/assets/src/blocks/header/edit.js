/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Button,
	CardDivider,
	SelectControl,
} from '@wordpress/components';
import { plus, trash, chevronUp, chevronDown } from '@wordpress/icons';
import { useState } from '@wordpress/element';

/**
 * Block configuration constants
 */
const ALLOWED_BLOCKS = [
	'ambrygen/mega-menu-patients',
	'ambrygen/mega-menu-providers',
	'ambrygen/mega-menu-solutions',
	'ambrygen/mega-menu-company',
];

const MEGA_MENU_OPTIONS = [
	{ label: __( '— None (Remove) —', 'ambrygen-web' ), value: '' },
	{
		label: __( 'Mega Menu Patients', 'ambrygen-web' ),
		value: 'ambrygen/mega-menu-patients',
	},
	{
		label: __( 'Mega Menu Providers', 'ambrygen-web' ),
		value: 'ambrygen/mega-menu-providers',
	},
	{
		label: __( 'Mega Menu Solutions', 'ambrygen-web' ),
		value: 'ambrygen/mega-menu-solutions',
	},
	{
		label: __( 'Mega Menu Company', 'ambrygen-web' ),
		value: 'ambrygen/mega-menu-company',
	},
];

const TEMPLATE = [
	[ 'ambrygen/mega-menu-patients', {} ],
	[ 'ambrygen/mega-menu-providers', {} ],
	[ 'ambrygen/mega-menu-solutions', {} ],
	[ 'ambrygen/mega-menu-company', {} ],
];

/**
 * Default navigation item structure
 * @type {Object}
 */
const DEFAULT_NAV_ITEM = {
	label: __( 'New Item', 'ambrygen-web' ),
	url: '#',
	hasMegaMenu: false,
	megaMenuBlock: '',
	isSecondLevel: false,
};

/**
 * Navigation Item Component
 *
 * Renders a single navigation item in the sidebar panel.
 *
 * @param {Object}   props            Component props
 * @param {Object}   props.item       Navigation item data
 * @param {number}   props.index      Item index
 * @param {number}   props.totalItems Total number of items
 * @param {Function} props.onUpdate   Update callback
 * @param {Function} props.onRemove   Remove callback
 * @param {Function} props.onMove     Move callback
 * @return {JSX.Element} Navigation item editor component
 */
function NavItemEditor( {
	item,
	index,
	totalItems,
	onUpdate,
	onRemove,
	onMove,
} ) {
	return (
		<div className="header-editor__nav-item-panel">
			{ /* Item Header with Controls */ }
			<div className="header-editor__nav-item-panel-header">
				<span className="header-editor__nav-item-panel-title">
					{ __( 'Item', 'ambrygen-web' ) } { index + 1 }:{ ' ' }
					{ item.label || __( 'Untitled', 'ambrygen-web' ) }
				</span>
				<div className="header-editor__nav-item-panel-controls">
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
						disabled={ index >= totalItems - 1 }
						onClick={ () => onMove( index, 1 ) }
						label={ __( 'Move Down', 'ambrygen-web' ) }
					/>
					<Button
						icon={ trash }
						size="small"
						isDestructive
						disabled={ totalItems <= 1 }
						onClick={ () => onRemove( index ) }
						label={ __( 'Remove Item', 'ambrygen-web' ) }
					/>
				</div>
			</div>

			{ /* Item Fields */ }
			<TextControl
				label={ __( 'Label', 'ambrygen-web' ) }
				value={ item.label }
				onChange={ ( value ) => onUpdate( index, 'label', value ) }
			/>
			<TextControl
				label={ __( 'URL', 'ambrygen-web' ) }
				value={ item.url }
				onChange={ ( value ) => onUpdate( index, 'url', value ) }
			/>
			<ToggleControl
				label={ __( 'Has Mega Menu', 'ambrygen-web' ) }
				checked={ item.hasMegaMenu }
				onChange={ ( value ) =>
					onUpdate( index, 'hasMegaMenu', value )
				}
			/>

			{ /* Mega Menu Options */ }
			{ item.hasMegaMenu && (
				<>
					<SelectControl
						label={ __( 'Mega Menu Block', 'ambrygen-web' ) }
						value={ item.megaMenuBlock }
						options={ MEGA_MENU_OPTIONS }
						onChange={ ( value ) =>
							onUpdate( index, 'megaMenuBlock', value )
						}
					/>
					{ item.megaMenuBlock && (
						<Button
							variant="secondary"
							isDestructive
							onClick={ () =>
								onUpdate( index, 'megaMenuBlock', '' )
							}
						>
							{ __( 'Remove Mega Menu', 'ambrygen-web' ) }
						</Button>
					) }
					<ToggleControl
						label={ __( 'Second Level Style', 'ambrygen-web' ) }
						checked={ item.isSecondLevel }
						onChange={ ( value ) =>
							onUpdate( index, 'isSecondLevel', value )
						}
					/>
				</>
			) }
		</div>
	);
}

/**
 * Header Preview Component
 *
 * Renders the visual header preview in the editor.
 *
 * @param {Object}   props                Component props
 * @param {boolean}  props.topBarVisible  Top bar visibility
 * @param {string}   props.topBarText     Top bar text
 * @param {Array}    props.navItems       Navigation items
 * @param {string}   props.loginText      Login button text
 * @param {string}   props.activeMenu     Active mega menu block
 * @param {string}   props.logoUrl        Logo URL
 * @param {string}   props.logoAlt        Logo Alt text
 * @param {string}   props.topBarLinkText Link text for top bar
 * @param {string}   props.topBarLinkUrl  Link URL for top bar
 * @param {Function} props.onNavClick     Nav item click handler
 * @return {JSX.Element} Header preview component
 */
function HeaderPreview( {
	topBarVisible,
	topBarText,
	navItems,
	loginText,
	activeMenu,
	logoUrl,
	logoAlt,
	topBarLinkText,
	topBarLinkUrl,
	onNavClick,
} ) {
	return (
		<>
			{ /* Top Bar Preview - Matches render.php structure */ }
			{ topBarVisible && (
				<div
					className="top-bar center-align container-1340"
					id="top-bar-ajax"
				>
					<div className="top-bar__wrapper wrapper">
						<div className="top-bar__row">
							<div className="top-bar__text">
								{ topBarText }
								{ topBarLinkText && (
									<span style={ { marginLeft: '5px' } }>
										<a
											href="#"
											className="top-bar__link  is-style-link-text-btn"
											onClick={ ( e ) =>
												e.preventDefault()
											}
										>
											{ topBarLinkText }
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
			) }

			{ /* Main Header - Matches render.php structure */ }
			<div className="header container-1340">
				<div className="wrapper">
					<div className="header__inner d-flex justify-content-between">
						{ /* Logo */ }
						<div className="header__logo logo">
							<a href="#" className="header__logo-link">
								<img
									className="header__logo-img header__logo-img--default"
									src={
										logoUrl ||
										'/wp-content/themes/ambrygen/assets/src/images/site-logo.svg'
									}
									alt={
										logoAlt ||
										__( 'Site Logo', 'ambrygen-web' )
									}
								/>
							</a>
						</div>

						{ /* Right Section */ }
						<div className="header__right">
							{ /* Navigation */ }
							<div className="nav">
								<div className="nav__overlay">
									<div className="nav__container">
										<nav className="nav__menu">
											<ul className="nav__list">
												{ navItems.map(
													( item, index ) => {
														const isActive =
															activeMenu ===
															item.megaMenuBlock;
														const itemClasses = [
															'nav__item',
															item.hasMegaMenu
																? 'nav__item--has-children nav__item--menu-has-children'
																: '',
															isActive
																? 'nav__item--active'
																: '',
														]
															.filter( Boolean )
															.join( ' ' );

														return (
															<li
																key={ index }
																className={
																	itemClasses
																}
															>
																<div className="nav__item--angle">
																	{ item.hasMegaMenu ? (
																		<div className="nav__item--tringle-touch">
																			<a
																				type="button"
																				className="nav__link"
																				role="menuitem"
																				onClick={ (
																					e
																				) => {
																					e.preventDefault();
																					onNavClick(
																						item,
																						index
																					);
																				} }
																			>
																				{
																					item.label
																				}
																			</a>
																		</div>
																	) : (
																		<a
																			type="button"
																			className="nav__link"
																			role="menuitem"
																			onClick={ (
																				e
																			) => {
																				e.preventDefault();
																				onNavClick(
																					item,
																					index
																				);
																			} }
																		>
																			{
																				item.label
																			}
																		</a>
																	) }
																</div>
																{ item.hasMegaMenu && (
																	<span className="nav__expand"></span>
																) }
															</li>
														);
													}
												) }
											</ul>
										</nav>
									</div>
								</div>
							</div>
						</div>

						{ /* Search Box */ }
						<div className="header__right--col header__btns--desktop">
							<div className="header__search">
								<form id="header-search-form" role="search">
									<input
										type="text"
										name="s"
										placeholder={ __(
											'Search',
											'ambrygen-web'
										) }
										disabled
									/>
									<input
										type="hidden"
										name="search-type"
										value=""
										className="search-type-field"
									/>
									<input
										type="hidden"
										name="learn-type"
										value=""
										className="learn-type-field"
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

/**
 * Edit component for the Header block.
 *
 * Renders the block interface in the editor with:
 * - Top bar configuration
 * - Navigation items management
 * - Mega menu block assignments
 * - CTA button settings
 *
 * @param {Object}   props               Block props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Block editor interface
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		topBarText,
		topBarVisible,
		navItems,
		loginUrl,
		loginText,
		mobileCtaText,
		mobileCtaUrl,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'header-section header-block-editor',
	} );

	// Track which mega menu is currently active/expanded
	const [ activeMenu, setActiveMenu ] = useState( null );

	/**
	 * Updates a navigation item property
	 * @param {number} index - Item index
	 * @param {string} key   - Property key
	 * @param {*}      value - New value
	 */
	const updateNavItem = ( index, key, value ) => {
		const newItems = [ ...navItems ];
		newItems[ index ] = { ...newItems[ index ], [ key ]: value };
		setAttributes( { navItems: newItems } );
	};

	/**
	 * Adds a new navigation item
	 */
	const addNavItem = () => {
		setAttributes( { navItems: [ ...navItems, { ...DEFAULT_NAV_ITEM } ] } );
	};

	/**
	 * Removes a navigation item
	 * @param {number} index - Item index to remove
	 */
	const removeNavItem = ( index ) => {
		if ( navItems.length <= 1 ) {
			return;
		}
		setAttributes( {
			navItems: navItems.filter( ( _, i ) => i !== index ),
		} );
	};

	/**
	 * Moves a navigation item up or down
	 * @param {number} index     - Item index
	 * @param {number} direction - Move direction (-1 up, 1 down)
	 */
	const moveNavItem = ( index, direction ) => {
		const newIndex = index + direction;
		if ( newIndex < 0 || newIndex >= navItems.length ) {
			return;
		}
		const newItems = [ ...navItems ];
		[ newItems[ index ], newItems[ newIndex ] ] = [
			newItems[ newIndex ],
			newItems[ index ],
		];
		setAttributes( { navItems: newItems } );
	};

	/**
	 * Handles navigation item click - toggles mega menu visibility
	 * @param {Object} item - Navigation item
	 */
	const handleNavItemClick = ( item ) => {
		if ( item.hasMegaMenu && item.megaMenuBlock ) {
			setActiveMenu(
				activeMenu === item.megaMenuBlock ? null : item.megaMenuBlock
			);
		}
	};

	// Build inner blocks container class
	const innerBlocksClass = [
		'header-editor__inner-blocks',
		activeMenu
			? 'header-editor__inner-blocks--has-active header-editor__inner-blocks--filter-active'
			: '',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<>
			{ /* Sidebar Inspector Controls */ }
			<InspectorControls>
				{ /* Logo Settings */ }
				<PanelBody
					title={ __( 'Logo Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => {
								setAttributes( {
									logoUrl: media.url,
									logoId: media.id,
									logoAlt:
										media.alt || media.title || 'Site Logo',
								} );
							} }
							allowedTypes={ [ 'image' ] }
							value={ attributes.logoId }
							render={ ( { open } ) => (
								<div className="editor-logo-controls">
									{ attributes.logoUrl && (
										<div style={ { marginBottom: '10px' } }>
											<img
												src={ attributes.logoUrl }
												alt={ attributes.logoAlt }
												style={ {
													maxWidth: '100%',
													height: 'auto',
													display: 'block',
												} }
											/>
										</div>
									) }
									<div
										style={ {
											display: 'flex',
											gap: '10px',
										} }
									>
										<Button
											onClick={ open }
											variant="secondary"
										>
											{ attributes.logoUrl
												? __(
														'Replace Logo',
														'ambrygen-web'
												  )
												: __(
														'Upload Logo',
														'ambrygen-web'
												  ) }
										</Button>
										{ attributes.logoUrl && (
											<Button
												onClick={ () =>
													setAttributes( {
														logoUrl: '',
														logoId: 0,
														logoAlt: '',
													} )
												}
												variant="link"
												isDestructive
											>
												{ __(
													'Remove',
													'ambrygen-web'
												) }
											</Button>
										) }
									</div>
								</div>
							) }
						/>
					</MediaUploadCheck>
					<div style={ { marginTop: '10px' } }>
						<p className="description">
							{ __(
								'If no logo is selected, the default theme logo will be used.',
								'ambrygen-web'
							) }
						</p>
					</div>
				</PanelBody>

				{ /* Top Bar Settings */ }
				<PanelBody
					title={ __( 'Top Bar', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show Top Bar', 'ambrygen-web' ) }
						checked={ topBarVisible }
						onChange={ ( value ) =>
							setAttributes( { topBarVisible: value } )
						}
					/>
					{ topBarVisible && (
						<>
							<TextControl
								label={ __( 'Top Bar Text', 'ambrygen-web' ) }
								value={ topBarText }
								onChange={ ( value ) =>
									setAttributes( { topBarText: value } )
								}
							/>
							<CardDivider />
							<TextControl
								label={ __(
									'Top Bar Link Text',
									'ambrygen-web'
								) }
								value={ attributes.topBarLinkText }
								onChange={ ( value ) =>
									setAttributes( { topBarLinkText: value } )
								}
							/>
							<TextControl
								label={ __(
									'Top Bar Link URL',
									'ambrygen-web'
								) }
								value={ attributes.topBarLinkUrl }
								onChange={ ( value ) =>
									setAttributes( { topBarLinkUrl: value } )
								}
							/>
						</>
					) }
				</PanelBody>

				{ /* Navigation Items */ }
				<PanelBody
					title={ __( 'Navigation Items', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<p className="components-base-control__help">
						{ __(
							`Manage navigation items. Current: ${ navItems.length }`,
							'ambrygen-web'
						) }
					</p>

					{ navItems.map( ( item, index ) => (
						<NavItemEditor
							key={ index }
							item={ item }
							index={ index }
							totalItems={ navItems.length }
							onUpdate={ updateNavItem }
							onRemove={ removeNavItem }
							onMove={ moveNavItem }
						/>
					) ) }

					<Button
						variant="primary"
						icon={ plus }
						onClick={ addNavItem }
						className="header-editor__add-nav-btn"
					>
						{ __( 'Add Nav Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				{ /* CTA Buttons Settings */ }
				<PanelBody
					title={ __( 'CTA Buttons', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Login Text', 'ambrygen-web' ) }
						value={ loginText }
						onChange={ ( value ) =>
							setAttributes( { loginText: value } )
						}
					/>
					<TextControl
						label={ __( 'Login URL', 'ambrygen-web' ) }
						value={ loginUrl }
						onChange={ ( value ) =>
							setAttributes( { loginUrl: value } )
						}
					/>
					<CardDivider />
					<TextControl
						label={ __( 'Mobile CTA Text', 'ambrygen-web' ) }
						value={ mobileCtaText }
						onChange={ ( value ) =>
							setAttributes( { mobileCtaText: value } )
						}
					/>
					<TextControl
						label={ __( 'Mobile CTA URL', 'ambrygen-web' ) }
						value={ mobileCtaUrl }
						onChange={ ( value ) =>
							setAttributes( { mobileCtaUrl: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Block Content */ }
			<div { ...blockProps }>
				{ /* Header Preview */ }
				<HeaderPreview
					topBarVisible={ topBarVisible }
					topBarText={ topBarText }
					navItems={ navItems }
					loginText={ loginText }
					activeMenu={ activeMenu }
					logoUrl={ attributes.logoUrl }
					logoAlt={ attributes.logoAlt }
					topBarLinkText={ attributes.topBarLinkText }
					topBarLinkUrl={ attributes.topBarLinkUrl }
					onNavClick={ handleNavItemClick }
				/>

				{ /* Mega Menu Blocks Container */ }
				<div className="header-editor__mega-menus">
					{ /* Active Menu Header */ }
					{ activeMenu && (
						<div className="header-editor__active-header">
							<span className="header-editor__active-header-title">
								{ __( 'Editing:', 'ambrygen-web' ) }{ ' ' }
								{ activeMenu
									.replace( 'ambrygen/', '' )
									.replace( /-/g, ' ' )
									.toUpperCase() }
							</span>
							<button
								type="button"
								className="header-editor__active-header-close"
								onClick={ () => setActiveMenu( null ) }
							>
								✕ { __( 'Close', 'ambrygen-web' ) }
							</button>
						</div>
					) }

					{ /* InnerBlocks Container */ }
					<div className={ innerBlocksClass }>
						{ /* Dynamic CSS for filtering active menu */ }
						{ activeMenu && (
							<style>
								{ `
									.header-editor__inner-blocks--filter-active > .block-editor-inner-blocks > .block-editor-block-list__layout > .wp-block[data-type="${ activeMenu }"] {
										display: grid;
									}
								` }
							</style>
						) }

						{ /* Management Instructions */ }
						{ ! activeMenu && (
							<p className="header-editor__management-info">
								<strong>
									{ __(
										'Manage Mega Menu Blocks:',
										'ambrygen-web'
									) }
								</strong>{ ' ' }
								{ __(
									'Click a block to edit, or use the toolbar to remove. Click + to add new blocks.',
									'ambrygen-web'
								) }
							</p>
						) }

						{ /* Inner Blocks */ }
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>

				{ /* Help Text */ }
				{ ! activeMenu && (
					<p className="header-editor__help-text">
						{ __(
							'Click on a menu item to open and edit its mega menu',
							'ambrygen-web'
						) }
					</p>
				) }
			</div>
		</>
	);
}
