<?php
/**
 * Render: Poster Category List
 */

defined( 'ABSPATH' ) || exit;

$post_id = 0;
if ( ! empty( $attributes['previewPostId'] ) ) {
	$post_id = (int) $attributes['previewPostId'];
}
if ( ! $post_id && isset( $block ) && isset( $block->context['postId'] ) ) {
	$post_id = (int) $block->context['postId'];
}
if ( ! $post_id ) {
	$post_id = get_the_ID();
}

$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin();

// For editor preview, if we don't have a valid post or terms, show the static placeholder the user requested
$terms = get_the_terms( $post_id, 'poster_category' );

$prefix = isset( $attributes['prefix'] ) ? (string) $attributes['prefix'] : '';

if ( $is_editor && ( empty( $terms ) || is_wp_error( $terms ) ) ) {
	?>
	<div class="taxonomy-poster_category wp-block-post-terms lists-item-category">
		<?php
		if ( $prefix ) :
			?>
			<span class="wp-block-post-terms__prefix"><?php echo esc_html( $prefix ); ?></span><?php endif; ?>
		<div class="categories-items">
			<div class="category-item"><a href="#" style="pointer-events: none;" rel="tag">Oncology</a></div>
		</div>
	</div>
	<?php
	return;
}

if ( empty( $terms ) || is_wp_error( $terms ) ) {
	return;
}

?>
<div class="taxonomy-poster_category wp-block-post-terms lists-item-category">
	<?php
	if ( $prefix ) :
		?>
		<span class="wp-block-post-terms__prefix"><?php echo esc_html( $prefix ); ?></span><?php endif; ?>
	<div class="categories-items">
		<?php foreach ( $terms as $term ) : ?>
			<div class="category-item">
				<a 
					href="<?php echo $is_editor ? '#' : esc_url( get_term_link( $term ) ); ?>" 
					<?php echo $is_editor ? 'style="pointer-events: none;"' : ''; ?>
					rel="tag"
				>
					<?php echo esc_html( $term->name ); ?>
				</a>
			</div>
		<?php endforeach; ?>
	</div>
</div>
