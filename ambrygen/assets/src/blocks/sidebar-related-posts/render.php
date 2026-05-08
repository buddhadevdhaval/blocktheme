<?php
/**
 * Render: Sidebar Related Posts Block
 *
 * @var array $attributes Block attributes.
 */

$post_id = get_the_ID();

/**
 * 🔥 CRITICAL FIX:
 * In Site Editor / SSR preview, post context may not exist.
 * So we fallback to a recent post.
 */
if ( ! $post_id ) {
	$recent_posts = get_posts( [
		'post_type'      => 'post',
		'posts_per_page' => 1,
		'post_status'    => 'publish',
	] );

	if ( ! empty( $recent_posts ) ) {
		$post_id = $recent_posts[0]->ID;
	}
}

// Still no post → bail
if ( ! $post_id ) {
	return;
}

// Restrict to 'post' post type only
if ( get_post_type( $post_id ) !== 'post' ) {
	return;
}

// Get categories
$category_ids = wp_get_post_categories( $post_id, [ 'fields' => 'ids' ] );

if ( empty( $category_ids ) ) {
	return;
}

// Query related posts
$related_posts = new WP_Query(
	[
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 3,
		'post__not_in'        => [ $post_id ],
		'category__in'        => $category_ids,
		'orderby'             => 'date',
		'order'               => 'DESC',
		'ignore_sticky_posts' => true,
	]
);

if ( ! $related_posts->have_posts() ) {
	wp_reset_postdata();
	return;
}

$title = $attributes['title'] ?? __( 'Related Articles', 'ambrygen-web' );
?>

<div class="sidebar-widget related-posts">
	<div class="sidebar-widget__title subtitle2-medium">
		<?php echo esc_html( $title ); ?>
	</div>

	<div class="related-posts__list">
		<?php while ( $related_posts->have_posts() ) : $related_posts->the_post(); ?>
			<?php
			$related_post_id = get_the_ID();
			$thumbnail_id    = get_post_thumbnail_id( $related_post_id );
			?>
			<a href="<?php echo esc_url( get_permalink( $related_post_id ) ); ?>" class="related-posts__item">
				<div class="related-posts__image-wrap">
					<?php
					echo \Ambrygen\Theme\Core\Helper::image_with_placeholder(
						$thumbnail_id,
						'medium',
						[ 'class' => 'related-posts__image' ]
					);
					?>
				</div>

				<div class="related-posts__content">
					<h3 class="related-posts__heading">
						<?php echo esc_html( get_the_title( $related_post_id ) ); ?>
					</h3>
				</div>
			</a>
		<?php endwhile; ?>
	</div>
</div>

<?php wp_reset_postdata(); ?>