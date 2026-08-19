<?php
/**
 * Render: Dynamic Excerpt
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

$excerpt = '';

if ( $post_id > 0 ) {
	$post = get_post( $post_id );
	if ( $post ) {
		$excerpt = get_the_excerpt( $post );
		if ( $is_editor && empty( $excerpt ) ) {
			$excerpt = wp_trim_words( $post->post_content, 25 );
		}
	}
}

if ( $is_editor && empty( $excerpt ) ) {
	$excerpt = 'Sample excerpt for the editor preview.';
}

if ( empty( $excerpt ) ) {
	$excerpt = 'No excerpt found.';
}

$class = isset( $attributes['className'] ) ? (string) $attributes['className'] : '';
?>
<div class="<?php echo esc_attr( $class ); ?>">
	<?php echo wp_kses_post( $excerpt ); ?>
</div>
