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
$ambrygen_video_type       = $ambrygen_attributes['videoType'] ?? 'embed';
$ambrygen_iframe_url       = $ambrygen_attributes['iframeUrl'] ?? '';
$ambrygen_video_url        = $ambrygen_attributes['videoUrl'] ?? '';
$ambrygen_poster_image_id  = isset( $ambrygen_attributes['posterImageId'] ) ? absint( $ambrygen_attributes['posterImageId'] ) : 0;
$ambrygen_poster_image_url = $ambrygen_attributes['posterImageUrl'] ?? '';

$ambrygen_iframe_src       = Helper::get_iframe_src( $ambrygen_iframe_url );
$ambrygen_title_text       = trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_description_text = trim( wp_strip_all_tags( $ambrygen_description ) );
$ambrygen_video_title      = $ambrygen_title_text ? $ambrygen_title_text : __( 'Video player', 'ambrygen-web' );
$ambrygen_poster_src       = $ambrygen_poster_image_id > 0 ? wp_get_attachment_image_url( $ambrygen_poster_image_id, 'large' ) : $ambrygen_poster_image_url;
$ambrygen_poster_alt       = $ambrygen_title_text ? $ambrygen_title_text : __( 'Video thumbnail', 'ambrygen-web' );
$ambrygen_has_video        = ( 'embed' === $ambrygen_video_type && ! empty( $ambrygen_iframe_src ) ) || ( 'mp4' === $ambrygen_video_type && ! empty( $ambrygen_video_url ) );
$ambrygen_play_icon_src    = get_theme_file_uri( 'assets/src/images/play-icon.svg' );
$ambrygen_pause_icon_src   = get_theme_file_uri( 'assets/src/images/pause-icon.svg' );
$ambrygen_variation        = $block->context['ambrygen/videoGridVariation'] ?? 'default';
$ambrygen_is_features      = in_array( $ambrygen_variation, array( 'variation-features', 'variation-3' ), true );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'video-grid-item videos__cards-item js-gsap-fade',
	)
);
?>

<?php if ( $ambrygen_is_features ) : ?>
	<div class="videos__cards-item">
		<div class="media_video js-gsap-fade">
			<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
				<div class="videos__cards-item-thumbnail">
					<?php
						echo wp_kses_post(
							Helper::image(
								$ambrygen_poster_image_id,
								'large',
								array(
									'class' => 'videos__cards-item-thumbnail-img',
								)
							)
						);

					?>
				</div>
			<?php endif; ?>
			<div class="features-media__video-wrapper--iframe">
				<iframe
					src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
					title="<?php echo esc_attr( $ambrygen_video_title ); ?>"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="features-media__iframe"
				></iframe>
				<div class="play-icon-video">
					<div class="play-icon circle-icon" style>
						<img decoding="async"
							src="<?php echo esc_url( $ambrygen_play_icon_src ); ?>"
							class="play-icon__img" alt="<?php esc_attr_e( 'Play Icon', 'ambrygen-web' ); ?>">
					</div>
					<div class="pause-icon circle-icon" style="display: none;">
						<img decoding="async" 
						src="<?php echo esc_url( $ambrygen_pause_icon_src ); ?>" 
						class="pause-icon__img" alt="<?php esc_attr_e( 'Pause Icon', 'ambrygen-web' ); ?>">
					</div>
				</div>
			</div>
		</div>
		<div class="is-style-gl-s16"></div>
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
<?php else : ?>
	<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<div
			class="features-media__video media_video"
			<?php if ( 'embed' === $ambrygen_video_type && ! empty( $ambrygen_iframe_src ) ) : ?>
				data-video-type="embed"
				data-video-src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
			<?php elseif ( 'mp4' === $ambrygen_video_type && ! empty( $ambrygen_video_url ) ) : ?>
				data-video-type="mp4"
				data-video-src="<?php echo esc_url( $ambrygen_video_url ); ?>"
			<?php endif; ?>
			data-video-title="<?php echo esc_attr( $ambrygen_video_title ); ?>"
			data-video-description="<?php echo esc_attr( $ambrygen_description_text ); ?>"
			<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
				data-video-poster="<?php echo esc_url( $ambrygen_poster_src ); ?>"
			<?php endif; ?>
		>
			<?php if ( 'embed' === $ambrygen_video_type && ! empty( $ambrygen_iframe_src ) ) : ?>
				<div class="features-media__video-wrapper features-media__video-wrapper--iframe">
					<iframe
						src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
						title="<?php echo esc_attr( $ambrygen_video_title ); ?>"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						class="features-media__iframe"
					></iframe>
				</div>
			<?php elseif ( 'mp4' === $ambrygen_video_type && ! empty( $ambrygen_video_url ) ) : ?>
				<div class="features-media__video-wrapper">
					<video
						class="videos"
						playsinline
						preload="metadata"
						controls
						<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
							poster="<?php echo esc_url( $ambrygen_poster_src ); ?>"
						<?php endif; ?>
						aria-label="<?php echo esc_attr( $ambrygen_video_title ); ?>"
					>
						<source src="<?php echo esc_url( $ambrygen_video_url ); ?>" type="video/mp4">
						<?php esc_html_e( 'Your browser does not support the video tag.', 'ambrygen-web' ); ?>
					</video>
				</div>
			<?php else : ?>
				<p class="text-small">
					<?php esc_html_e( 'Video not configured yet.', 'ambrygen-web' ); ?>
				</p>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_poster_src ) ) : ?>
				<div class="videos__cards-item-thumbnail">
					<img
						src="<?php echo esc_url( $ambrygen_poster_src ); ?>"
						alt="<?php echo esc_attr( $ambrygen_poster_alt ); ?>"
						class="videos__cards-item-thumbnail-img"
					/>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_video ) : ?>
				<?php /* translators: %s: Video title. */ ?>
				<button type="button" class="play-icon-video" aria-label="<?php echo esc_attr( sprintf( __( 'Open %s', 'ambrygen-web' ), $ambrygen_video_title ) ); ?>">
					<span class="play-icon circle-icon" aria-hidden="true">
						<img src="<?php echo esc_url( $ambrygen_play_icon_src ); ?>" class="play-icon__img" alt="<?php esc_attr_e( 'Play Icon', 'ambrygen-web' ); ?>">
					</span>
					<span class="pause-icon circle-icon" aria-hidden="true" style="display: none;">
						<img src="<?php echo esc_url( $ambrygen_pause_icon_src ); ?>" class="pause-icon__img" alt="<?php esc_attr_e( 'Pause Icon', 'ambrygen-web' ); ?>">
					</span>
				</button>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s16" aria-hidden="true"></div>

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
<?php endif; ?>
