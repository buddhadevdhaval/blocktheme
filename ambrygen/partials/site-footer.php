<?php

/**
 * Site footer partial.
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<footer class="site-footer">
	<div class="site-footer__inner">
		<?php if ( has_nav_menu( 'footer' ) ) : ?>
			<nav class="footer-nav" aria-label="<?php esc_attr_e( 'Footer Menu', 'ambrygen' ); ?>">
				<?php
					wp_nav_menu(
						array(
							'theme_location' => 'footer',
							'menu_class'     => 'footer-menu',
							'container'      => false,
							'fallback_cb'    => false,
						)
					);
				?>
			</nav>
		<?php endif; ?>
		<p>
			&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
			<?php bloginfo( 'name' ); ?>
		</p>
	</div>
</footer>
