<?php
/**
 * Render: Video Grid Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes       = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_title            = $ambrygen_attributes['title'] ?? '';
$ambrygen_description      = $ambrygen_attributes['description'] ?? '';
$ambrygen_video_type       = isset( $ambrygen_attributes['videoType'] ) && 'mp4' === $ambrygen_attributes['videoType'] ? 'mp4' : 'embed';
$ambrygen_iframe_url       = isset( $ambrygen_attributes['iframeUrl'] ) ? esc_url_raw( $ambrygen_attributes['iframeUrl'] ) : '';
$ambrygen_video_url        = isset( $ambrygen_attributes['videoUrl'] ) ? esc_url_raw( $ambrygen_attributes['videoUrl'] ) : '';
$ambrygen_poster_image_id  = isset( $ambrygen_attributes['posterImageId'] ) ? absint( $ambrygen_attributes['posterImageId'] ) : 0;
$ambrygen_poster_image_url = isset( $ambrygen_attributes['posterImageUrl'] ) ? esc_url_raw( $ambrygen_attributes['posterImageUrl'] ) : '';
$ambrygen_poster_image_alt = isset( $ambrygen_attributes['posterImageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['posterImageAlt'] ) : '';

$ambrygen_iframe_src       = Helper::get_iframe_src( $ambrygen_iframe_url );
$ambrygen_title_text       = trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_description_text = trim( wp_strip_all_tags( $ambrygen_description ) );
$ambrygen_video_title      = $ambrygen_title_text ? $ambrygen_title_text : __( 'Video player', 'ambrygen-web' );
$ambrygen_poster_src       = $ambrygen_poster_image_id > 0 ? wp_get_attachment_image_url( $ambrygen_poster_image_id, 'large' ) : $ambrygen_poster_image_url;
$ambrygen_poster_alt       = $ambrygen_poster_image_alt ? $ambrygen_poster_image_alt : ( $ambrygen_title_text ? $ambrygen_title_text : __( 'Video thumbnail', 'ambrygen-web' ) );
$ambrygen_has_video        = ( 'embed' === $ambrygen_video_type && ! empty( $ambrygen_iframe_src ) ) || ( 'mp4' === $ambrygen_video_type && ! empty( $ambrygen_video_url ) );
$ambrygen_play_icon_src    = get_theme_file_uri( 'assets/src/images/play-icon.svg' );
$ambrygen_pause_icon_src   = get_theme_file_uri( 'assets/src/images/pause-icon.svg' );

if ( ! $ambrygen_has_video ) {
	return;
}
?>

<div class="videos__cards-item">
	<div
		class="media_video js-gsap-fade open_video_popup"
		data-video-src="<?php echo esc_url( 'embed' === $ambrygen_video_type ? $ambrygen_iframe_src : $ambrygen_video_url ); ?>"
		data-video-type="<?php echo esc_attr( $ambrygen_video_type ); ?>"
		role="button"
		tabindex="0"
		aria-haspopup="dialog"
		aria-expanded="false"
		aria-label="<?php echo esc_attr( sprintf( /* translators: %s: Video title. */ __( 'Play video: %s', 'ambrygen-web' ), $ambrygen_video_title ) ); ?>"
	>
		<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
			<div class="videos__cards-item-thumbnail">
				<?php
					echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper escapes attributes and returns sanitized image HTML.
						$ambrygen_poster_image_id,
						$ambrygen_poster_image_url,
						'large',
						array(
							'class' => 'videos__cards-item-thumbnail-img',
							'alt'   => $ambrygen_poster_alt,
						)
					);
				?>
			</div>
		<?php endif; ?>
		<?php if ( 'embed' === $ambrygen_video_type ) : ?>
			<div class="features-media__video-wrapper--iframe">
				<iframe
					src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
					title="<?php echo esc_attr( $ambrygen_video_title ); ?>"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="features-media__iframe"
					tabindex="-1"
					aria-hidden="true"
				></iframe>
				<div class="play-icon-video">
					<div class="play-icon circle-icon">
						<img decoding="async"
							src="<?php echo esc_url( $ambrygen_play_icon_src ); ?>"
							class="play-icon__img" alt="">
					</div>
					<div class="pause-icon circle-icon" style="display: none;">
						<img decoding="async"
						src="<?php echo esc_url( $ambrygen_pause_icon_src ); ?>"
						class="pause-icon__img" alt="">
					</div>
				</div>
			</div>
		<?php else : ?>
			<div class="features-media__video-wrapper">
				<video
					class="videos"
					playsinline
					preload="metadata"
					<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
						poster="<?php echo esc_url( $ambrygen_poster_src ); ?>"
					<?php endif; ?>
					aria-hidden="true"
					tabindex="-1"
				>
					<source src="<?php echo esc_url( $ambrygen_video_url ); ?>" type="video/mp4">
					<?php esc_html_e( 'Your browser does not support the video tag.', 'ambrygen-web' ); ?>
				</video>
				<div class="play-icon-video">
					<div class="play-icon circle-icon">
						<img decoding="async"
							src="<?php echo esc_url( $ambrygen_play_icon_src ); ?>"
							class="play-icon__img" alt="">
					</div>
					<div class="pause-icon circle-icon" style="display: none;">
						<img decoding="async"
						src="<?php echo esc_url( $ambrygen_pause_icon_src ); ?>"
						class="pause-icon__img" alt="">
					</div>
				</div>
			</div>
		<?php endif; ?>
	</div>
	<?php if ( $ambrygen_title_text || $ambrygen_description_text ) : ?>
		<div class="is-style-gl-s16" aria-hidden="true"></div>
	<?php endif; ?>
	<?php if ( $ambrygen_title_text ) : ?>
		<div class="subtitle2-sbold videos__cards-item-title">
			<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
		</div>
	<?php endif; ?>
	<?php if ( $ambrygen_description_text ) : ?>
		<div class="subtitle2-sbold videos__cards-item-description">
			<?php echo wp_kses_post( $ambrygen_description ); ?>
		</div>
	<?php endif; ?>
</div>
