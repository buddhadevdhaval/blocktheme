<?php
/**
 * Site header partial.
 *
 * @package Ambrygen
 */

use Ambrygen\Theme\Core\ThemeOptions;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( ThemeOptions::class ) ) {
	return;
}

$theme_options = ThemeOptions::get_instance();
$header_enabled = $theme_options->get( 'show_header', true );
$header_logo_id = $theme_options->get( 'header_logo' );

if ( ! $header_enabled ) {
	return;
}
?>

<header id="header-section" class="header-section" role="banner">

	<div class="header-wrapper header-inner d-flex align-items-center justify-content-between">

		<div class="header-logo logo">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo">
				<?php
				if ( $header_logo_id ) {
					echo wp_get_attachment_image(
						(int) $header_logo_id,
						'admin-landscape',
						false,
						array(
							'class'   => 'site-logo',
							'loading' => 'lazy',
						)
					);
				} else {
					echo esc_html( get_bloginfo( 'name' ) );
				}
				?>
			</a>
		</div>

		<div class="right-header header-navigation">
			<nav class="header-nav" aria-label="<?php esc_attr_e( 'Primary Menu', 'ambrygen' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'fallback_cb'    => false,
						'menu_class'     => 'header-menu',
					)
				);
				?>
			</nav>

			<button class="menu-btn" aria-label="<?php esc_attr_e( 'Toggle menu', 'ambrygen' ); ?>">
				<span></span><span></span><span></span>
			</button>
		</div>

	</div>

</header>
