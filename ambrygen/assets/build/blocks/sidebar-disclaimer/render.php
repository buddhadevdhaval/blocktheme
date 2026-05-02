<?php
/**
 * Render: Sidebar Disclaimer Block
 */

// Restrict to 'post' post type only
if ( get_post_type() !== 'post' ) {
	return;
}

$options = get_option( 'ambrygen_theme_options' );
$title   = $options['blog_disclaimer_title'] ?? '';
$content = $options['blog_disclaimer_content'] ?? '';

// If both title and content are empty, do not render the block.
if ( empty( $title ) && empty( $content ) ) {
	return;
}
?>
<div class="sidebar-widget disclaimer-block">
	<?php if ( ! empty( $title ) ) : ?>
		<p><strong><?php echo esc_html( $title ); ?></strong></p>
	<?php endif; ?>
	
	<?php if ( ! empty( $content ) ) : ?>
		<?php echo wp_kses_post( $content ); ?>
	<?php endif; ?>
</div>
