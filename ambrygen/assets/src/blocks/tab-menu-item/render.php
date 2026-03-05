<?php
/**
 * Render: Tab Menu Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
$label     = $attributes['label'] ?? '';
$target_id = $attributes['targetId'] ?? '';
$is_active = ! empty( $attributes['is_active_tab'] );
$classes = 'tab-button';
if ( $is_active ) {
	$classes .= ' active';
}
if ( empty( $target_id ) ) {
	return;
}

?>

<button
	type="button"
	class="<?php echo esc_attr( $classes ); ?>"
	data-scroll-target="<?php echo esc_attr( $target_id ); ?>"
	role="tab"
>
	<?php echo esc_html( $label ); ?>
</button>
