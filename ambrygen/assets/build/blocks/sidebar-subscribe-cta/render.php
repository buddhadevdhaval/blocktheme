<?php
/**
 * Render: Sidebar Subscribe CTA Block
 *
 * @var array $attributes Block attributes.
 */

$title    = $attributes['title'] ?? __( 'Love this article?', 'ambrygen-web' );
$subtitle = $attributes['subtitle'] ?? __( 'Get stories just like it, delivered right to you.', 'ambrygen-web' );

// Restrict to 'post' post type only
if ( get_post_type() !== 'post' ) {
	return;
}
?>
<div class="sidebar-widget subscribe-card-cta">
	<div class="subscribe-card-cta__content">
		<div class="subscribe-card-cta__title heading-5 mb-0"><?php echo esc_html( $title ); ?></div>
		<div class="subscribe-card-cta__subtitle"><?php echo esc_html( $subtitle ); ?></div>
	</div>
	<!-- <form class="subscribe-card-cta__form">
		<input type="email" class="subscribe-card-cta__input" placeholder="olivia@xyz.com" aria-label="<?php // esc_attr_e( 'Email address', 'ambrygen-web' ); ?>">
		<button type="submit" class="subscribe-card-cta__submit site-btn"><?php // esc_html_e( 'Sign Up Now', 'ambrygen-web' ); ?></button>
	</form> -->
	<a href="/contact-us" class="subscribe-card-cta__submit site-btn">
		<?php esc_html_e( 'Contact Us', 'ambrygen-web' ); ?>
	</a>
</div>
