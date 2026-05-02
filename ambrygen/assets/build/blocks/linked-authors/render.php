<?php
/**
 * Render: Genetic Linked Authors
 *
 * @param array $attributes Block attributes.
 * @param string $content Block content.
 * @param WP_Block $block Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$authors_data = array();
$post_id = get_the_ID();
if ( ! $post_id ) {
	return;
}

$blog_renderer = \Ambrygen\Theme\Core\Blog\BlogRenderer::instance();
if ( method_exists( $blog_renderer, 'get_post_authors_data' ) ) {
	$authors_data = $blog_renderer->get_post_authors_data( $post_id );
}

$authors = array();
if ( ! empty( $authors_data ) ) {
	foreach ( $authors_data as $author_data ) {
		$author_id = absint( $author_data['author_id'] ?? 0 );
		$authors[] = array(
			'id'          => $author_id,
			'name'        => $author_data['name'] ?? '',
			'designation' => $author_data['designation'] ?? '',
			'avatar_id'   => $author_data['avatar_id'] ?? 0,
			'excerpt'     => $author_id > 0 ? get_the_excerpt( $author_id ) : '',
		);
	}
} else {
	$linked_posts = get_post_meta( $post_id, 'linked_author', true );
	if ( empty( $linked_posts ) ) {
		$linked_posts = get_post_meta( $post_id, 'linked_authors', true );
	}
	if ( empty( $linked_posts ) ) {
		$linked_posts = get_post_meta( $post_id, 'linked_posts_genetic', true );
	}

	if ( empty( $linked_posts ) ) {
		return;
	}

	// Convert string to array if necessary (depending on how ACF/Relationship stores it)
	if ( is_string( $linked_posts ) ) {
		$linked_posts = json_decode( $linked_posts, true ) ?: array( $linked_posts );
	}

	if ( ! is_array( $linked_posts ) ) {
		return;
	}

	foreach ( $linked_posts as $linked_id ) {
		$linked_id = absint( $linked_id );
		if ( $linked_id <= 0 || 'author' !== get_post_type( $linked_id ) ) {
			continue;
		}

		$authors[] = array(
			'id'          => $linked_id,
			'name'        => get_the_title( $linked_id ),
			'designation' => get_post_meta( $linked_id, 'user_designation', true ),
			'avatar_id'   => get_post_thumbnail_id( $linked_id ),
			'excerpt'     => get_the_excerpt( $linked_id ),
		);
	}
}

if ( empty( $authors ) ) {
	return;
}

$title = $attributes['title'] ?? '';
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'genetic-linked-authors' ) );
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ( $title ) : ?>
		<h4 class="genetic-linked-authors__title heading-5 mb-3"><?php echo esc_html( $title ); ?></h4>
	<?php endif; ?>

	<div class="genetic-linked-authors__list">
		<?php foreach ( $authors as $author ) : ?>
			<?php
			$name        = $author['name'] ?? '';
			$designation = $author['designation'] ?? '';
			$image_id    = absint( $author['avatar_id'] ?? 0 );
			?>
			<div class="author-card mb-4" style="display: flex; gap: 16px; align-items: center;">
				<?php if ( $image_id ) : ?>
					<div class="author-card__avatar" style="flex-shrink: 0; width: 64px; height: 64px; border-radius: 50%; overflow: hidden;">
						<?php echo wp_get_attachment_image( $image_id, 'thumbnail', false, array( 'style' => 'width: 100%; height: 100%; object-fit: cover;' ) ); ?>
					</div>
				<?php endif; ?>
				<div class="author-card__content">
					<div class="author-card__name text-md-semibold"><?php echo esc_html( $name ); ?></div>
					<?php if ( $designation ) : ?>
						<div class="author-card__designation text-sm-regular text-gray-400"><?php echo esc_html( $designation ); ?></div>
					<?php endif; ?>
					<?php if ( ! empty( $attributes['showExcerpt'] ) ) : ?>
						<?php 
							$excerpt = $author['excerpt'] ?? '';
							if ( $excerpt ) : 
						?>
							<div class="author-card__excerpt body2 mt-2 text-gray-400">
								<?php echo wp_kses_post( $excerpt ); ?>
							</div>
						<?php endif; ?>
					<?php endif; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</div>
