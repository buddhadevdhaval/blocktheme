<?php
/**
 * Render: Dynamic Post Date
 */

defined( 'ABSPATH' ) || exit;

$post_id = 0;
if ( isset( $block->context['postId'] ) ) {
	$post_id = (int) $block->context['postId'];
}
if ( ! $post_id ) {
	$post_id = get_the_ID();
}

$attributes = $attributes ?? array();
$is_editor  = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();
$format     = ! empty( $attributes['format'] ) ? $attributes['format'] : 'F j, Y';

$date_string = '';
$iso_date    = '';

if ( $post_id > 0 ) {
	$post = get_post( $post_id );
	if ( $post ) {
		$date_string = get_the_date( $format, $post );
		$iso_date    = get_the_date( 'c', $post );
	}
}

// Fallback for editor
if ( $is_editor && empty( $date_string ) ) {
	$date_string = date_i18n( $format );
	$iso_date    = date( 'c' );
}

if ( empty( $date_string ) ) {
	return;
}

$class = isset( $attributes['className'] ) ? (string) $attributes['className'] : '';
?>
<div class="<?php echo esc_attr( $class ); ?> wp-block-post-date">
	<time datetime="<?php echo esc_attr( $iso_date ); ?>"><?php echo esc_html( $date_string ); ?></time>
</div>
