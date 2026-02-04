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
 * Parse InnerBlocks by block name (for mega menus).
 */
$ambrygen_inner_blocks_by_type = array();

if (
	isset($block->inner_blocks)
	&& !empty($block->inner_blocks)
) {
	foreach ($block->inner_blocks as $ambrygen_inner_block) {
		if (!empty($ambrygen_inner_block->name)) {
			$ambrygen_inner_blocks_by_type[$ambrygen_inner_block->name] = $ambrygen_inner_block->render();
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
						<?php echo esc_html($ambrygen_top_bar_text); ?>

						<?php if (!empty($ambrygen_top_bar_link_text) && !empty($ambrygen_top_bar_link_url)): ?>
							<a href="<?php echo esc_url($ambrygen_top_bar_link_url); ?>"
								class="top-bar__link is-style-link-text-btn">
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
					<a href="<?php echo esc_url(home_url('/')); ?>" class="header__logo-link">
						<img class="header__logo-img header__logo-img--default"
							src="<?php echo esc_url($ambrygen_logo_url); ?>"
							alt="<?php echo esc_attr($ambrygen_logo_alt); ?>" />
					</a>
				</div>

				<!-- Right Section -->
				<div class="header__right">

					<!-- Navigation -->
					<nav class="nav" aria-label="<?php esc_attr_e('Primary navigation', 'ambrygen-web'); ?>">
						<div class="nav__overlay">
							<div class="nav__container">
								<div class="nav__menu">
									<ul class="nav__list">
										<?php foreach ($ambrygen_nav_items as $ambrygen_item): ?>
											<?php
											$ambrygen_has_mega_menu = !empty($ambrygen_item['hasMegaMenu']);
											$ambrygen_is_second_lvl = !empty($ambrygen_item['isSecondLevel']);
											$ambrygen_item_classes = 'nav__item';

											if ($ambrygen_has_mega_menu) {
												$ambrygen_item_classes .= ' nav__item--has-children nav__item--menu-has-children';
											}
											?>
											<li class="<?php echo esc_attr($ambrygen_item_classes); ?>">
												<a href="<?php echo esc_url($ambrygen_item['url']); ?>" class="nav__link">
													<?php echo esc_html($ambrygen_item['label']); ?>
												</a>

												<?php if ($ambrygen_has_mega_menu): ?>
													<div class="nav__item--mega-menu mega-menu--platform">
														<div
															class="nav__item--mega-menu__wrapper<?php echo $ambrygen_is_second_lvl ? ' nav__item--mega-menu__second-level' : ''; ?>">
															<?php
															$ambrygen_block_name = isset($ambrygen_item['megaMenuBlock'])
																? $ambrygen_item['megaMenuBlock']
																: '';

															if (
																$ambrygen_block_name
																&& isset($ambrygen_inner_blocks_by_type[$ambrygen_block_name])
															) {
																echo $ambrygen_inner_blocks_by_type[$ambrygen_block_name]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
															} elseif ($ambrygen_block_name) {
																echo wp_kses_post(
																	do_blocks(
																		'<!-- wp:' . esc_attr($ambrygen_block_name) . ' /-->'
																	)
																);
															}
															?>
														</div>
													</div>
												<?php endif; ?>
											</li>
										<?php endforeach; ?>
									</ul>
								</div>
							</div>
						</div>
					</nav>

					<!-- Mobile CTA -->
					<div class="header__btns header__btns--mobile" style="display: none;">
						<a href="<?php echo esc_url($ambrygen_mobile_cta_url); ?>"
							class="site-btn is-style-site-marker-btn">
							<?php echo esc_html($ambrygen_mobile_cta_text); ?>
						</a>
					</div>

					<!-- <button class="menu-toggle" type="button" aria-label="<?php //esc_attr_e( 'Toggle menu', 'ambrygen-web' ); ?>">
						<span class="menu-toggle__line"></span>
						<span class="menu-toggle__line"></span>
						<span class="menu-toggle__line"></span>
					</button> -->

				</div>

				<!-- Desktop CTA -->
				<div class="header__right--col header__btns--desktop">
					<div class="header__search">
						<form id="header-search-form" role="search" method="get"
							action="<?php echo esc_url(home_url('/')); ?>">
							<input type="text" name="s" placeholder="<?php esc_attr_e('Search', 'ambrygen-web'); ?>">
							<button class="button" type="submit">
								<?php esc_html_e('Search', 'ambrygen-web'); ?>
							</button>
						</form>
					</div>

					<div class="header__login">
						<a href="<?php echo esc_url($ambrygen_login_url); ?>" class="site-btn is-style-site-marker-btn">
							<?php echo esc_html($ambrygen_login_text); ?>
						</a>
					</div>
				</div>

			</div>
		</div>
	</div>

</header>