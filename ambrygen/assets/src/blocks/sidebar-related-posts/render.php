<?php
/**
 * Render: Sidebar Related Posts Block
 *
 * @var array $attributes Block attributes.
 */

$post_id = get_the_ID();
if ( ! $post_id ) {
	return;
}

$category_ids = wp_get_post_categories( $post_id, array( 'fields' => 'ids' ) );
if ( empty( $category_ids ) ) {
	return;
}

$related_posts = new WP_Query(
	array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 3,
		'post__not_in'        => array( $post_id ),
		'category__in'        => $category_ids,
		'orderby'             => 'date',
		'order'               => 'DESC',
		'ignore_sticky_posts' => true,
	)
);

if ( ! $related_posts->have_posts() ) {
	wp_reset_postdata();
	return;
}

$title = $attributes['title'] ?? __( 'Related Articles', 'ambrygen-web' );

// Restrict to 'post' post type only
if ( get_post_type() !== 'post' ) {
	return;
}
?>
<div class="sidebar-widget related-posts">
	<div class="sidebar-widget__title subtitle2-medium"><?php echo esc_html( $title ); ?></div>
	<div class="related-posts__list">
		<?php
		while ( $related_posts->have_posts() ) :
			$related_posts->the_post();
			$related_post_id = get_the_ID();
			$thumbnail_id    = get_post_thumbnail_id( $related_post_id );
			?>
			<a href="<?php echo esc_url( get_permalink( $related_post_id ) ); ?>" class="related-posts__item">
				<div class="related-posts__image-wrap">
					<?php
					echo \Ambrygen\Theme\Core\Helper::image_with_placeholder(
						$thumbnail_id,
						'medium',
						array( 'class' => 'related-posts__image' )
					);
					?>
				</div>
				<div class="related-posts__content">
					<h3 class="related-posts__heading"><?php echo esc_html( get_the_title( $related_post_id ) ); ?></h3>
				</div>
			</a>
		<?php endwhile; ?>
	</div>
</div>
<?php wp_reset_postdata(); ?>
