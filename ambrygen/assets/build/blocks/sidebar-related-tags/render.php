<?php
/**
 * Render: Sidebar Related Tags Block
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

$title = $attributes['title'] ?? __( 'Find Articles by Tags', 'ambrygen-web' );

// Restrict to 'post' post type only on the frontend.
if ( ! is_admin() && get_post_type() !== 'post' ) {
	return;
}

// Fetch only tags that have at least one published post attached.
$tags = get_terms(
	array(
		'taxonomy'   => 'post_tag',
		'hide_empty' => true,
		'orderby'    => 'name',
		'order'      => 'ASC',
	)
);

if ( is_wp_error( $tags ) || empty( $tags ) ) {
	return;
}
?>
<div class="sidebar-widget related-tags">
	<div class="sidebar-widget__title subtitle2-medium"><?php echo esc_html( $title ); ?></div>
	<div class="related-tags__list">
		<?php foreach ( $tags as $tag ) : ?>
			<a href="<?php echo esc_url( get_term_link( $tag ) ); ?>" class="related-tags__item">
				<?php echo esc_html( $tag->name ); ?>
			</a>
		<?php endforeach; ?>
	</div>
</div>
