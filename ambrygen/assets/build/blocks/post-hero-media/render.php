<?php
/**
 * Render: Post Hero Media
 *
 * Handles MP4 Video, Embed, or Featured Image fallback.
 *
 * @package Ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$post_id = get_the_ID();
if ( ! $post_id && isset( $block ) && ! empty( $block->context['postId'] ) ) {
	$post_id = $block->context['postId'];
}

if ( ! $post_id ) {
	return;
}

$video_type      = get_post_meta( $post_id, 'video_type', true );
$video_url_id    = get_post_meta( $post_id, 'video_url', true );
$iframe_url      = get_post_meta( $post_id, 'iframe_url', true );
$poster_image_id = get_post_meta( $post_id, 'poster_image_id', true );

$wrapper_class = isset( $attributes['className'] ) ? (string) $attributes['className'] : 'hero-featured-image';
$has_media     = false;

echo '<div class="post-hero-media ' . esc_attr( $wrapper_class ) . '">';

if ( ( 'mp4' === $video_type && $video_url_id ) || ( 'embed' === $video_type && $iframe_url ) ) {
	$has_media  = true;
	$poster_url = $poster_image_id ? wp_get_attachment_image_url( $poster_image_id, 'full' ) : get_the_post_thumbnail_url( $post_id, 'full' );
	$video_src  = ( 'mp4' === $video_type ) ? wp_get_attachment_url( $video_url_id ) : Helper::get_iframe_src( $iframe_url );

	if ( $poster_url && $video_src ) {
		?>
		<div class="post-hero-media__container media_video" 
			data-video-modal 
			data-video-url="<?php echo esc_url( $video_src ); ?>"
			data-video-title="<?php echo esc_attr( get_the_title( $post_id ) ); ?>"
		>
			<div class="post-hero-media__poster">
				<img src="<?php echo esc_url( $poster_url ); ?>" alt="<?php echo esc_attr( get_the_title( $post_id ) ); ?>">
				<div class="play-icon-overlay">
					<img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/play-icon.svg' ) ); ?>" alt="Play" />
				</div>
			</div>
		</div>
		<?php
	} else {
		// If we lost the poster but have the video, fall back to basic players
		if ( 'mp4' === $video_type ) {
			?>
			<video controls playsinline poster="<?php echo esc_url( $poster_url ); ?>">
				<source src="<?php echo esc_url( wp_get_attachment_url( $video_url_id ) ); ?>" type="video/mp4">
			</video>
			<?php
		} else {
			?>
			<div class="post-hero-media__embed-fallback">
				<iframe src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allowfullscreen></iframe>
			</div>
			<?php
		}
	}
}

// Fallback to Featured Image if no video is set or valid
if ( ! $has_media ) {
	echo Helper::image_with_placeholder(
		get_post_thumbnail_id( $post_id ),
		'full',
		array(
			'class' => 'hero-featured-image__fallback',
		)
	);
}

echo '</div>';
