<?php
/**
 * Render: Careers Block
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

$ambrygen_attributes    = $attributes ?? array();
$ambrygen_block_id      = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title         = isset( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_intro         = isset( $ambrygen_attributes['intro'] ) ? $ambrygen_attributes['intro'] : '';
$ambrygen_heading_level = Helper::get_heading_tag( $ambrygen_attributes['headingLevel'] ?? 'h2', 'h2' );

$ambrygen_video_array = isset( $ambrygen_attributes['videoObj'] ) && is_array( $ambrygen_attributes['videoObj'] )
	? $ambrygen_attributes['videoObj']
	: array();
$ambrygen_video_url   = isset( $ambrygen_video_array['url'] ) ? (string) $ambrygen_video_array['url'] : '';

$ambrygen_video_poster = isset( $ambrygen_attributes['videoPoster'] ) && is_array( $ambrygen_attributes['videoPoster'] )
	? $ambrygen_attributes['videoPoster']
	: array();

$ambrygen_video_type = isset( $ambrygen_attributes['videoType'] ) ? sanitize_key( $ambrygen_attributes['videoType'] ) : 'embed'; // mp4 | embed.

if ( ! in_array( $ambrygen_video_type, array( 'mp4', 'embed' ), true ) ) {
	$ambrygen_video_type = 'embed';
}

$ambrygen_careers_link_top = isset( $ambrygen_attributes['link'] ) && is_array( $ambrygen_attributes['link'] )
	? $ambrygen_attributes['link']
	: array();

$ambrygen_careers_link_bottom = isset( $ambrygen_attributes['careerslink'] ) && is_array( $ambrygen_attributes['careerslink'] )
	? $ambrygen_attributes['careerslink']
	: array();

$ambrygen_video_poster_url = ! empty( $ambrygen_video_poster['url'] )
	? (string) $ambrygen_video_poster['url']
	: '';

$ambrygen_careers_link_bottom_target = ! empty( $ambrygen_careers_link_bottom['target'] ) && '_blank' === $ambrygen_careers_link_bottom['target']
	? '_blank'
	: '';

$ambrygen_careers_link_top_target = ! empty( $ambrygen_careers_link_top['target'] ) && '_blank' === $ambrygen_careers_link_top['target']
	? '_blank'
	: '';

$ambrygen_iframe_src = '';

if ( 'embed' === $ambrygen_video_type ) {
	$ambrygen_iframe_src = Helper::get_iframe_src( $ambrygen_attributes['videoUrl'] ?? '' );
}

$ambrygen_top_link_rel = ! empty( $ambrygen_careers_link_top['rel'] )
	? sanitize_text_field( $ambrygen_careers_link_top['rel'] )
	: '';

if ( '_blank' === $ambrygen_careers_link_top_target ) {
	$ambrygen_top_link_rel_parts = preg_split( '/\s+/', trim( $ambrygen_top_link_rel ) );
	$ambrygen_top_link_rel_parts = array_filter( is_array( $ambrygen_top_link_rel_parts ) ? $ambrygen_top_link_rel_parts : array() );
	$ambrygen_top_link_rel       = implode( ' ', array_unique( array_merge( $ambrygen_top_link_rel_parts, array( 'noopener', 'noreferrer' ) ) ) );
}

$ambrygen_bottom_link_rel = ! empty( $ambrygen_careers_link_bottom['rel'] )
	? sanitize_text_field( $ambrygen_careers_link_bottom['rel'] )
	: '';

if ( '_blank' === $ambrygen_careers_link_bottom_target ) {
	$ambrygen_bottom_link_rel_parts = preg_split( '/\s+/', trim( $ambrygen_bottom_link_rel ) );
	$ambrygen_bottom_link_rel_parts = array_filter( is_array( $ambrygen_bottom_link_rel_parts ) ? $ambrygen_bottom_link_rel_parts : array() );
	$ambrygen_bottom_link_rel       = implode( ' ', array_unique( array_merge( $ambrygen_bottom_link_rel_parts, array( 'noopener', 'noreferrer' ) ) ) );
}

$ambrygen_has_title          = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_intro          = '' !== trim( wp_strip_all_tags( $ambrygen_intro ) );
$ambrygen_has_top_link       = ! empty( $ambrygen_careers_link_top['text'] ) && ! empty( $ambrygen_careers_link_top['url'] );
$ambrygen_has_bottom_link    = ! empty( $ambrygen_careers_link_bottom['text'] ) && ! empty( $ambrygen_careers_link_bottom['url'] );
$ambrygen_has_video          = ( 'mp4' === $ambrygen_video_type && $ambrygen_video_url ) || ( 'embed' === $ambrygen_video_type && $ambrygen_iframe_src );
$ambrygen_has_header_content = $ambrygen_has_title || $ambrygen_has_intro || $ambrygen_has_top_link;
$ambrygen_heading_id         = $ambrygen_has_title ? ( $ambrygen_block_id ? $ambrygen_block_id . '-heading' : wp_unique_id( 'careers-highlight-heading-' ) ) : '';
$ambrygen_video_modal_id     = $ambrygen_has_video ? ( $ambrygen_block_id ? $ambrygen_block_id . '-video-modal' : wp_unique_id( 'careers-video-modal-' ) ) : '';
$ambrygen_iframe_label       = $ambrygen_has_title
	? wp_strip_all_tags( $ambrygen_title )
	: __( 'Video', 'ambrygen-web' );
$ambrygen_wrapper_args       = array(
	'class' => 'careers-highlight block-layout',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

if ( $ambrygen_heading_id ) {
	$ambrygen_wrapper_args['role']            = 'region';
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

$ambrygen_play_icon_src  = get_theme_file_uri( 'assets/src/images/play-icon.svg' );
$ambrygen_pause_icon_src = get_theme_file_uri( 'assets/src/images/pause-icon.svg' );

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated by get_block_wrapper_attributes(). ?>>
	<?php if ( $ambrygen_has_header_content ) : ?>
		<div class="careers-highlight__header block__rowflex">
			<?php if ( $ambrygen_has_title ) : ?>
				<div class="block__rowflex--col-left">
				<<?php echo tag_escape( $ambrygen_heading_level ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="careers-highlight__title block__rowflex--heading-title heading-4 mb-0 js-gsap-fade block-title">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_intro || $ambrygen_has_top_link ) : ?>
				<div class="careers-highlight__intro block__rowflex--block-content subtitle1-reg js-gsap-fade block-description">
					<?php if ( $ambrygen_has_intro ) : ?>
						<p><?php echo wp_kses_post( $ambrygen_intro ); ?></p>
					<?php endif; ?>
					<?php if ( $ambrygen_has_top_link ) : ?>
						<div class="block_rowflex-link">
							<a
								href="<?php echo esc_url( $ambrygen_careers_link_top['url'] ); ?>"
								class="site-btn is-style-site-text-btn has-right-arrow"
								<?php if ( $ambrygen_careers_link_top_target ) : ?>
									target="<?php echo esc_attr( $ambrygen_careers_link_top_target ); ?>"
								<?php endif; ?>
								<?php if ( $ambrygen_top_link_rel ) : ?>
									rel="<?php echo esc_attr( $ambrygen_top_link_rel ); ?>"
								<?php endif; ?>
							>
								<?php echo esc_html( $ambrygen_careers_link_top['text'] ); ?>
								<?php if ( '_blank' === $ambrygen_careers_link_top_target ) : ?>
									<span class="screen-reader-text"><?php esc_html_e( ' (opens in a new tab)', 'ambrygen-web' ); ?></span>
								<?php endif; ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_header_content ) : ?>
		<div class="is-style-gl-s50" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="careers-highlight__row">
		<div class="careers-highlight__left">
			<div class="custom-scroll-jobs">
				<div class="careers-highlight__jobs">
					<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is rendered by WordPress. ?>
				</div>
			</div>

			<?php if ( $ambrygen_has_bottom_link ) : ?>
				<div class="block-btn js-gsap-fade">
					<div class="is-style-gl-s32" aria-hidden="true"></div>
					<a
						href="<?php echo esc_url( $ambrygen_careers_link_bottom['url'] ); ?>"
						class="site-btn is-style-site-text-btn has-right-arrow"
						<?php if ( $ambrygen_careers_link_bottom_target ) : ?>
							target="<?php echo esc_attr( $ambrygen_careers_link_bottom_target ); ?>"
						<?php endif; ?>
						<?php if ( $ambrygen_bottom_link_rel ) : ?>
							rel="<?php echo esc_attr( $ambrygen_bottom_link_rel ); ?>"
						<?php endif; ?>
					>
						<?php echo esc_html( $ambrygen_careers_link_bottom['text'] ); ?>
						<?php if ( '_blank' === $ambrygen_careers_link_bottom_target ) : ?>
							<span class="screen-reader-text"><?php esc_html_e( ' (opens in a new tab)', 'ambrygen-web' ); ?></span>
						<?php endif; ?>
					</a>
				</div>
			<?php endif; ?>
		</div>

		<div class="careers-highlight__right">
			<div class="careers-highlight__media media_video js-gsap-fade">
				<?php if ( 'mp4' === $ambrygen_video_type && $ambrygen_video_url ) : ?>
					<video class="videos" playsinline muted preload="metadata" loop
						<?php if ( $ambrygen_video_poster_url ) : ?>
							poster="<?php echo esc_url( $ambrygen_video_poster_url ); ?>"
						<?php endif; ?>
					>
						<source src="<?php echo esc_url( $ambrygen_video_url ); ?>" type="video/mp4">
					</video>
				<?php elseif ( 'embed' === $ambrygen_video_type ) : ?>
					<?php if ( $ambrygen_iframe_src ) : ?>
						<div class="careers-highlight__media media_video video-embed">
							<iframe
								src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
								title="<?php echo esc_attr( $ambrygen_iframe_label ); ?>"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					<?php else : ?>
						<div class="videos-placeholder"><?php esc_html_e( 'Invalid video URL', 'ambrygen-web' ); ?></div>
					<?php endif; ?>
				<?php endif; ?>
				<?php if ( $ambrygen_has_video ) : ?>
					<button
						type="button"
						class="play-icon-video"
						aria-label="<?php esc_attr_e( 'Open video', 'ambrygen-web' ); ?>"
						aria-expanded="false"
						aria-controls="<?php echo esc_attr( $ambrygen_video_modal_id ); ?>"
					>
						<span class="play-icon circle-icon" aria-hidden="true">
							<img src="<?php echo esc_url( $ambrygen_play_icon_src ); ?>" class="play-icon__img" alt="" aria-hidden="true">
						</span>
						<span class="pause-icon circle-icon" aria-hidden="true">
							<img src="<?php echo esc_url( $ambrygen_pause_icon_src ); ?>" class="pause-icon__img" alt="" aria-hidden="true">
						</span>
					</button>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
