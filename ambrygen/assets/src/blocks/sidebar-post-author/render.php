<?php
/**
 * Render: Sidebar Post Author Block
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

use Ambrygen\Theme\Core\Blog\BlogRenderer;
use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$title = $attributes['title'] ?? __( 'Author', 'ambrygen-web' );

// Restrict to 'post' post type only on the frontend.
if ( ! is_admin() && get_post_type() !== 'post' ) {
	return;
}

$post_id = $block->context['postId'] ?? get_the_ID();
if ( ! $post_id ) {
	global $post;
	$post_id = $post->ID ?? 0;
}

if ( ! $post_id ) {
	return;
}

// Fetch author data using the same method as blog-hero.
$authors_data = BlogRenderer::instance()->get_post_authors_data( $post_id );

if ( empty( $authors_data ) ) {
	return;
}

// Use the first author linked to the post.
$author       = $authors_data[0];
$author_name  = esc_html( $author['name'] );
$designation  = ! empty( $author['designation'] ) ? esc_html( $author['designation'] ) : '';
$display_name = $designation ? $author_name . ', ' . $designation : $author_name;

/*
 * Bio logic (mirrors blog-hero):
 * - If 'bio' (Bio Override from repeater row) is non-empty → use it.
 * - Otherwise fall back to the author's post_content (already resolved
 *   inside get_post_authors_data via apply_filters('the_content')).
 */
$bio = $author['bio'] ?? '';
?>
<div class="sidebar-widget post-author-block">
	<div class="sidebar-widget__title subtitle2-medium"><?php echo esc_html( $title ); ?></div>
	<div class="post-author">
		<div class="post-author__avatar">
			<?php if ( ! empty( $author['avatar_id'] ) ) : ?>
				<?php
				echo Helper::image(
					$author['avatar_id'],
					'thumbnail',
					array(
						'class'  => 'post-author__image',
						'width'  => 100,
						'height' => 100,
						'alt'    => $display_name,
					)
				);
				?>
			<?php else : ?>
				<img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/icn_user_profile.svg' ) ); ?>" alt="" class="post-author__image" width="100" height="100">
			<?php endif; ?>
		</div>
		<div class="post-author__name"><?php echo $display_name; ?></div>
	</div>
	<div class="is-style-gl-s12" aria-hidden="true"></div>
	<?php if ( ! empty( $bio ) ) : ?>
		<div class="post-author__content text-small">
			<?php echo wp_kses_post( $bio ); ?>
		</div>
	<?php endif; ?>
</div>
