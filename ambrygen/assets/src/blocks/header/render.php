<?php
/**
 * Header Block – Server-side Rendering
 *
 * @package Ambrygen
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content (InnerBlocks).
 * @var WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}
use Ambrygen\Theme\Core\Helper;
/**
 * Normalize attributes.
 */
$ambrygen_attributes = isset($attributes) && is_array($attributes) ? $attributes : array();
$ambrygen_content = isset($content) ? $content : '';

$ambrygen_top_bar_text = isset($ambrygen_attributes['topBarText']) ? $ambrygen_attributes['topBarText'] : '';
$ambrygen_top_bar_link_text = isset($ambrygen_attributes['topBarLinkText']) ? $ambrygen_attributes['topBarLinkText'] : '';
$ambrygen_top_bar_link_url = isset($ambrygen_attributes['topBarLinkUrl']) ? $ambrygen_attributes['topBarLinkUrl'] : '';
$ambrygen_top_bar_visible = isset($ambrygen_attributes['topBarVisible']) ? (bool) $ambrygen_attributes['topBarVisible'] : true;

$ambrygen_nav_items = isset($ambrygen_attributes['navItems']) && is_array($ambrygen_attributes['navItems'])
	? $ambrygen_attributes['navItems']
	: array();

$ambrygen_login_url = isset($ambrygen_attributes['loginUrl']) ? $ambrygen_attributes['loginUrl'] : '#';
$ambrygen_login_text = isset($ambrygen_attributes['loginText']) ? $ambrygen_attributes['loginText'] : __('Login', 'ambrygen-web');

$ambrygen_mobile_cta_text = isset($ambrygen_attributes['mobileCtaText'])
	? $ambrygen_attributes['mobileCtaText']
	: __('See a Demo', 'ambrygen-web');

$ambrygen_mobile_cta_url = isset($ambrygen_attributes['mobileCtaUrl']) ? $ambrygen_attributes['mobileCtaUrl'] : '#';

/**
 * Parse InnerBlocks by menuId.
 */
$ambrygen_inner_blocks_by_id = array();

if (
	isset($block->inner_blocks)
	&& !empty($block->inner_blocks)
) {
	foreach ($block->inner_blocks as $ambrygen_inner_block) {
		// Ensure attributes exist and menuId is set
		if (isset($ambrygen_inner_block->attributes['menuId']) && !empty($ambrygen_inner_block->attributes['menuId'])) {
			$ambrygen_inner_blocks_by_id[$ambrygen_inner_block->attributes['menuId']] = $ambrygen_inner_block->render();
		}
	}
}
?>

<header class="header-section">

	<?php if ($ambrygen_top_bar_visible): ?>
		<div class="top-bar center-align container-1340" id="top-bar-ajax">
			<div class="top-bar__wrapper wrapper">
				<div class="top-bar__row">
					<div class="top-bar__text">
						<?php echo wp_kses_post($ambrygen_top_bar_text); ?>

						<?php if (!empty($ambrygen_top_bar_link_text) && !empty($ambrygen_top_bar_link_url)): ?>
							<a href="<?php echo esc_url($ambrygen_top_bar_link_url); ?>"
								class="top-bar__link  site-btn is-style-site-text-btn has-icon">
								<?php echo esc_html($ambrygen_top_bar_link_text); ?>
							</a>
						<?php endif; ?>
					</div>

					<div class="top-bar__close">
						<span class="top-bar__close-icon">
							<img src="<?php echo esc_url(get_theme_file_uri('assets/src/images/topbar-close-icon.svg')); ?>"
								width="24" height="24" alt="<?php esc_attr_e('Close top bar', 'ambrygen-web'); ?>" />
						</span>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>

	<div class="header container-1340">
		<div class="wrapper">
			<div class="header__inner d-flex justify-content-between">

				<!-- Logo -->
				<div class="header__logo logo">
					<?php
					$ambrygen_logo_url = isset($ambrygen_attributes['logoUrl']) && !empty($ambrygen_attributes['logoUrl'])
						? $ambrygen_attributes['logoUrl']
						: get_theme_file_uri('assets/src/images/site-logo.svg');

					$ambrygen_logo_alt = isset($ambrygen_attributes['logoAlt']) && !empty($ambrygen_attributes['logoAlt'])
						? $ambrygen_attributes['logoAlt']
						: get_bloginfo('name');
					?>
					<a href="<?php echo esc_url(home_url('/')); ?>" class="header__logo-link" 	aria-label="<?php esc_attr_e( 'Ambry Genetics home', 'ambrygen' ); ?>"
>
						<img class="header__logo-img header__logo-img--default"
							src="<?php echo esc_url($ambrygen_logo_url); ?>"
							alt="<?php echo esc_attr($ambrygen_logo_alt); ?>" />
					</a>
				</div>

				<!-- Right Section -->
				<div class="header__navigation">

					<!-- Navigation -->
					<nav class="nav" aria-label="<?php esc_attr_e('Primary navigation', 'ambrygen-web'); ?>">
						<div class="nav__overlay">
							<div class="nav__container">
								<div class="nav__menu" aria-label="Primary navigation">
									<ul class="nav__list">
										<?php 
										foreach ($ambrygen_nav_items as $ambrygen_item): ?>
											<?php
											$ambrygen_has_mega_menu = !empty($ambrygen_item['hasMegaMenu']);
											$ambrygen_is_second_lvl = !empty($ambrygen_item['isSecondLevel']);
											$ambrygen_item_classes = 'nav__item';

											if ($ambrygen_has_mega_menu) {
												$ambrygen_item_classes .= ' nav__item--has-children nav__item--menu-has-children';
											}
											$ambrygen_is_active =  Helper::ambrygen_is_nav_item_active( $ambrygen_item );

												if ( $ambrygen_is_active ) {
													$ambrygen_item_classes .= ' active current-menu-item';
												}

											?>
											<li class="<?php echo esc_attr($ambrygen_item_classes); ?>">

												<div class="nav__item--angle">
                                                    <div class="nav__item--tringle-touch">
                                                        <a href="<?php echo esc_url($ambrygen_item['url']); ?>" class="nav__link">
															<?php echo esc_html($ambrygen_item['label']); ?>
														</a>
                                                    </div>
                                                </div>
												<span class="nav__expand"></span>


												<?php if ($ambrygen_has_mega_menu): ?>
													<div class="nav__item--mega-menu mega-menu--platform menu-two-column ">
															<div class="menu-drawer-close-button main-drawer-close-button">
															<div class="icon">
																<img
																	src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/dropdown-arrow.svg' ) ); ?>"
																	alt="Back"
																>
																<!-- <img src="../assets/src/images/dropdown-arrow.svg" alt="left arrow icon"> -->
															</div>
															<span class="label-splus-bold-italic close-title"><?php echo esc_html($ambrygen_item['label']); ?></span>
														</div>

														<div
															class="nav__item--mega-menu__wrapper<?php echo $ambrygen_is_second_lvl ? ' nav__item--mega-menu__second-level' : ''; ?>">
															<?php
															$ambrygen_menu_id = isset($ambrygen_item['megaMenuId'])
																? $ambrygen_item['megaMenuId']
																: '';

															if (
																$ambrygen_menu_id
																&& isset($ambrygen_inner_blocks_by_id[$ambrygen_menu_id])
															) {
																echo $ambrygen_inner_blocks_by_id[$ambrygen_menu_id]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
															}
															?>
														</div>



													</div>
												<?php endif; ?>
											</li>
										<?php endforeach; ?>
									</ul>
								</div>
								<div class="header__search">
									<!-- <div class="search-toggle">
										<img src="<?php echo esc_url(get_theme_file_uri('assets/src/images/search-icon-primary.svg')); ?>"
										width="24" height="24" alt="<?php esc_attr_e('Search', 'ambrygen-web'); ?>" />
									</div> -->
									<form id="header-search-form" role="search" method="get"
										action="<?php echo esc_url(home_url('/')); ?>">
										<input type="text" name="s" aria-label="<?php esc_attr_e( 'Search for:', 'ambrygen-web' ); ?>"  placeholder="<?php esc_attr_e('Search', 'ambrygen-web'); ?>">
										<button class="button" type="submit">
											<?php esc_html_e('Search', 'ambrygen-web'); ?>
										</button>
									</form>
								</div>
							</div>
						</div>
					</nav>

				</div>

				<!-- Desktop CTA -->
				<div class="header__right--col header__btns--desktop">
					<div class="header__search">
						<!-- <div class="search-toggle">
							<img src="<?php echo esc_url(get_theme_file_uri('assets/src/images/search-icon-primary.svg')); ?>"
							width="24" height="24" alt="<?php esc_attr_e('Search', 'ambrygen-web'); ?>" />
						</div> -->
						<form id="header-search-form" role="search" method="get"
							action="<?php echo esc_url(home_url('/')); ?>">
							<input type="text" name="s" aria-label="<?php esc_attr_e( 'Search for:', 'ambrygen-web' ); ?>" placeholder="<?php esc_attr_e('Search', 'ambrygen-web'); ?>">
							<button class="button" type="submit">
								<?php esc_html_e('Search', 'ambrygen-web'); ?>
							</button>
						</form>
					</div>

					<div class="header__login">
						<div class="user-icon">
							<button class="user-icon-click">
								<img
									src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/icn_user_profile.svg' ) ); ?>"
									alt="User profile"
								>
												</button>
						</div>
					</div>

					<div class="nav__menu-btn">
						<span class="nav__menu-btn-line"></span>
						<span class="nav__menu-btn-line nav__menu-btn-line--middle"></span>
						<span class="nav__menu-btn-line"></span>
					</div>

				</div>


			</div>
		</div>
	</div>

</header>
