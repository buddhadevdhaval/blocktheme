<?php
$label     = $attributes['label'] ?? '';
$menu_slug = $attributes['menuSlug'] ?? '';

if ( empty( $label ) || empty( $menu_slug ) ) {
	return '';
}

$theme_slug = get_stylesheet();

/**
 * Correct template part ID
 * Format: theme-slug//template-part-slug
 */
$template_id = sprintf(
	'%s//%s',
	$theme_slug,
	sanitize_key( $menu_slug )
);

/**
 * Resolve template part safely
 */
$template_part = get_block_template(
	$template_id,
	'wp_template_part'
);

if ( ! $template_part || empty( $template_part->content ) ) {
	return '';
}
?>

<div class="wp-block-navigation-item has-mega-menu">
	<button class="wp-block-navigation-item__content">
		<?php echo esc_html( $label ); ?>
	</button>

	<div class="mega-menu__panel">
		<?php echo do_blocks( $template_part->content ); ?>
	</div>
</div>
