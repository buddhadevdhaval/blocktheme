<?php
/**
 * Render: Hero Section Block
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

/**
 * Block attributes.
 *
 * @var array $attributes
 */
$ambrygen_attributes = is_array( $attributes ) ? $attributes : array();

$ambrygen_slides           = isset( $ambrygen_attributes['slides'] ) && is_array( $ambrygen_attributes['slides'] ) ? $ambrygen_attributes['slides'] : array();
$ambrygen_show_slider_nav  = isset( $ambrygen_attributes['showSliderNav'] ) ? (bool) $ambrygen_attributes['showSliderNav'] : true;
$ambrygen_show_slider_dots = isset( $ambrygen_attributes['showSliderDots'] ) ? (bool) $ambrygen_attributes['showSliderDots'] : true;
$ambrygen_autoplay         = isset( $ambrygen_attributes['autoplay'] ) ? (bool) $ambrygen_attributes['autoplay'] : false;
$ambrygen_autoplay_delay   = isset( $ambrygen_attributes['autoplayDelay'] ) ? absint( $ambrygen_attributes['autoplayDelay'] ) : 5000;
$ambrygen_show_small_image = isset( $ambrygen_attributes['showSmallImage'] ) ? (bool) $ambrygen_attributes['showSmallImage'] : false;
$ambrygen_slides           = array_values(
	array_filter(
		$ambrygen_slides,
		static function ( $ambrygen_slide ) {
			$ambrygen_slide            = is_array( $ambrygen_slide ) ? $ambrygen_slide : array();
			$ambrygen_primary_button   = isset( $ambrygen_slide['primarybutton'] ) && is_array( $ambrygen_slide['primarybutton'] ) ? $ambrygen_slide['primarybutton'] : array();
			$ambrygen_secondary_button = isset( $ambrygen_slide['secondarybutton'] ) && is_array( $ambrygen_slide['secondarybutton'] ) ? $ambrygen_slide['secondarybutton'] : array();
			$ambrygen_has_primary_cta  = ! empty( $ambrygen_primary_button['text'] ) && ! empty( $ambrygen_primary_button['url'] );
			$ambrygen_has_secondary_cta = ! empty( $ambrygen_secondary_button['text'] ) && ! empty( $ambrygen_secondary_button['url'] );

			return ! empty( $ambrygen_slide['backgroundImage'] )
				|| ! empty( $ambrygen_slide['overlayImage1'] )
				|| ! empty( $ambrygen_slide['overlayImage2'] )
				|| ! empty( $ambrygen_slide['eyebrow'] )
				|| ! empty( $ambrygen_slide['heading'] )
				|| ! empty( $ambrygen_slide['content'] )
				|| $ambrygen_has_primary_cta
				|| $ambrygen_has_secondary_cta;
		}
	)
);
$ambrygen_slide_count      = count( $ambrygen_slides );
$ambrygen_has_slider       = $ambrygen_slide_count > 1;
$ambrygen_autoplay_delay   = max( 1000, min( 10000, $ambrygen_autoplay_delay ) );
$ambrygen_autoplay         = $ambrygen_autoplay && $ambrygen_has_slider;
$ambrygen_show_slider_nav  = $ambrygen_show_slider_nav && $ambrygen_has_slider;
$ambrygen_show_slider_dots = $ambrygen_show_slider_dots && $ambrygen_has_slider;

$ambrygen_swiper_config = array(
	'autoplay'   => $ambrygen_autoplay ? array( 'delay' => $ambrygen_autoplay_delay ) : false,
	'navigation' => $ambrygen_show_slider_nav,
	'pagination' => $ambrygen_show_slider_dots,
);

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $ambrygen_show_small_image ? 'hero-section inner-hero-banner' : 'hero-section',
	)
);
$ambrygen_index              = 0;
$ambrygen_slides_region_id   = wp_unique_id( 'hero-section-slides-' );

if ( ! $ambrygen_slide_count ) {
	return;
}
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns pre-sanitized attributes. ?>>
	<div
		class="hero-section__slider swiper container-1340"
		data-swiper-config="<?php echo esc_attr( wp_json_encode( $ambrygen_swiper_config ) ); ?>"
		role="region"
		aria-roledescription="carousel"
		aria-label="<?php esc_attr_e( 'Hero', 'ambrygen-web' ); ?>"
	>
		<div
			class="swiper-wrapper"
			id="<?php echo esc_attr( $ambrygen_slides_region_id ); ?>"
		>
			<?php if ( $ambrygen_autoplay || $ambrygen_has_slider ) : ?>
				<div
					class="screen-reader-text"
					role="status"
					aria-live="polite"
					aria-atomic="true"
					data-slide-announcer
				>
					<?php
					printf(
						/* translators: 1: Current slide number, 2: Total slides. */
						esc_html__( 'Slide %1$d of %2$d', 'ambrygen-web' ),
						1,
						$ambrygen_slide_count
					);
					?>
				</div>
			<?php endif; ?>

			<?php
			foreach ( $ambrygen_slides as $ambrygen_index => $ambrygen_slide ) :
				?>

				<?php

				$ambrygen_background_image_id = isset( $ambrygen_slide['backgroundImageId'] ) ? absint( $ambrygen_slide['backgroundImageId'] ) : 0;
				$ambrygen_background_image    = isset( $ambrygen_slide['backgroundImage'] ) ? esc_url( $ambrygen_slide['backgroundImage'] ) : '';
				$ambrygen_background_alt      = isset( $ambrygen_slide['backgroundImageAlt'] ) ? sanitize_text_field( $ambrygen_slide['backgroundImageAlt'] ) : '';
				$ambrygen_overlay_image_1_id  = isset( $ambrygen_slide['overlayImage1Id'] ) ? absint( $ambrygen_slide['overlayImage1Id'] ) : 0;
				$ambrygen_overlay_image_1     = isset( $ambrygen_slide['overlayImage1'] ) ? esc_url( $ambrygen_slide['overlayImage1'] ) : '';
				$ambrygen_overlay_image_1_alt = isset( $ambrygen_slide['overlayImage1Alt'] ) ? sanitize_text_field( $ambrygen_slide['overlayImage1Alt'] ) : '';
				$ambrygen_overlay_image_2_id  = isset( $ambrygen_slide['overlayImage2Id'] ) ? absint( $ambrygen_slide['overlayImage2Id'] ) : 0;
				$ambrygen_overlay_image_2     = isset( $ambrygen_slide['overlayImage2'] ) ? esc_url( $ambrygen_slide['overlayImage2'] ) : '';
				$ambrygen_overlay_image_2_alt = isset( $ambrygen_slide['overlayImage2Alt'] ) ? sanitize_text_field( $ambrygen_slide['overlayImage2Alt'] ) : '';

				$ambrygen_heading = $ambrygen_slide['heading'] ?? '';
				$ambrygen_content = $ambrygen_slide['content'] ?? '';
				$ambrygen_eyebrow = $ambrygen_slide['eyebrow'] ?? '';



				$ambrygen_button_primary   = $ambrygen_slide['primarybutton'] ?? array();
				$ambrygen_button_secondary = $ambrygen_slide['secondarybutton'] ?? array();

				$ambrygen_button_primary_text    = isset( $ambrygen_button_primary['text'] ) ? sanitize_text_field( $ambrygen_button_primary['text'] ) : '';
				$ambrygen_button_primary_url     = isset( $ambrygen_button_primary['url'] ) ? esc_url( $ambrygen_button_primary['url'] ) : '';
				$ambrygen_button_primary_target  = isset( $ambrygen_button_primary['target'] ) && '_blank' === $ambrygen_button_primary['target'] ? '_blank' : '';
				$ambrygen_button_primary_rel_raw = isset( $ambrygen_button_primary['rel'] ) ? sanitize_text_field( $ambrygen_button_primary['rel'] ) : '';
				$ambrygen_button_primary_rel     = '' !== $ambrygen_button_primary_rel_raw
					? preg_split( '/\s+/', $ambrygen_button_primary_rel_raw, -1, PREG_SPLIT_NO_EMPTY )
					: array();
				$ambrygen_button_primary_variant = ! empty( $ambrygen_button_primary['variant'] ) ? sanitize_html_class( $ambrygen_button_primary['variant'] ) : 'is-style-site-tertiary-btn';
				$ambrygen_allowed_rel_values     = array( 'nofollow', 'noopener', 'noreferrer', 'external', 'sponsored' );

				if ( false === $ambrygen_button_primary_rel ) {
					$ambrygen_button_primary_rel = array();
				}

				$ambrygen_button_primary_rel = array_intersect( $ambrygen_button_primary_rel, $ambrygen_allowed_rel_values );

				if ( '_blank' === $ambrygen_button_primary_target ) {
					$ambrygen_button_primary_rel = array_merge( $ambrygen_button_primary_rel, array( 'noopener', 'noreferrer' ) );
				}

				$ambrygen_button_primary_rel = implode( ' ', array_unique( array_filter( $ambrygen_button_primary_rel ) ) );

				$ambrygen_button_secondary_text    = isset( $ambrygen_button_secondary['text'] ) ? sanitize_text_field( $ambrygen_button_secondary['text'] ) : '';
				$ambrygen_button_secondary_url     = isset( $ambrygen_button_secondary['url'] ) ? esc_url( $ambrygen_button_secondary['url'] ) : '';
				$ambrygen_button_secondary_target  = isset( $ambrygen_button_secondary['target'] ) && '_blank' === $ambrygen_button_secondary['target'] ? '_blank' : '';
				$ambrygen_button_secondary_rel_raw = isset( $ambrygen_button_secondary['rel'] ) ? sanitize_text_field( $ambrygen_button_secondary['rel'] ) : '';
				$ambrygen_button_secondary_rel     = '' !== $ambrygen_button_secondary_rel_raw
					? preg_split( '/\s+/', $ambrygen_button_secondary_rel_raw, -1, PREG_SPLIT_NO_EMPTY )
					: array();
				$ambrygen_button_secondary_variant = ! empty( $ambrygen_button_secondary['variant'] ) ? sanitize_html_class( $ambrygen_button_secondary['variant'] ) : 'dark';

				if ( false === $ambrygen_button_secondary_rel ) {
					$ambrygen_button_secondary_rel = array();
				}

				$ambrygen_button_secondary_rel = array_intersect( $ambrygen_button_secondary_rel, $ambrygen_allowed_rel_values );

				if ( '_blank' === $ambrygen_button_secondary_target ) {
					$ambrygen_button_secondary_rel = array_merge( $ambrygen_button_secondary_rel, array( 'noopener', 'noreferrer' ) );
				}

				$ambrygen_button_secondary_rel = implode( ' ', array_unique( array_filter( $ambrygen_button_secondary_rel ) ) );

				$ambrygen_heading_tag = isset( $ambrygen_slide['headingTag'] )
					? strtolower( $ambrygen_slide['headingTag'] )
					: 'h2';
				$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );

				$ambrygen_heading_tag_escaped = tag_escape( $ambrygen_heading_tag );
				$ambrygen_heading_id          = 'hero-heading-' . $ambrygen_index;
				$ambrygen_content_id          = 'hero-content-' . $ambrygen_index;

				?>

				<div
					class="hero-section__slide swiper-slide"
					role="group"
					aria-roledescription="slide"
					aria-label="<?php echo esc_attr( sprintf( '%1$d of %2$d', $ambrygen_index + 1, $ambrygen_slide_count ) ); ?>"
				>
					<div class="hero-section__background">

						<?php
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
						echo Helper::image_from_source(
							$ambrygen_background_image_id,
							$ambrygen_background_image,
							'hero-desktop',
							array(
								'class'         => 'hero-section__image',
								'alt'           => $ambrygen_background_alt,
								'loading'       => 0 === $ambrygen_index ? 'eager' : 'lazy',
								'decoding'      => 'async',
								'fetchpriority' => 0 === $ambrygen_index ? 'high' : 'auto',
							),
							true
						);
						?>

						<?php if ( $ambrygen_overlay_image_1_id || $ambrygen_overlay_image_1 ) : ?>
							<div class="hero-section__overlay hero-section__overlay--1 hero-section__overlay--top">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
								echo Helper::image_from_source(
									$ambrygen_overlay_image_1_id,
									$ambrygen_overlay_image_1,
									'large',
									array(
										'alt'      => $ambrygen_overlay_image_1_alt,
										'loading'  => 'lazy',
										'decoding' => 'async',
									)
								);
								?>
							</div>
						<?php endif; ?>

						<?php if ( $ambrygen_overlay_image_2_id || $ambrygen_overlay_image_2 ) : ?>
							<div class="hero-section__overlay hero-section__overlay--bottom">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
								echo Helper::image_from_source(
									$ambrygen_overlay_image_2_id,
									$ambrygen_overlay_image_2,
									'large',
									array(
										'alt'      => $ambrygen_overlay_image_2_alt,
										'loading'  => 'lazy',
										'decoding' => 'async',
									)
								);
								?>
							</div>
						<?php endif; ?>

					</div>

					<div class="wrapper">
						<div class="hero-section__content">

							<?php if ( $ambrygen_eyebrow ) : ?>
								<div class="hero__eyebrow hero-kicker js-gsap-fade">
									<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
								</div>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
							<?php endif; ?>
							<?php if ( $ambrygen_heading ) : ?>
								<<?php echo $ambrygen_heading_tag_escaped; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Sanitized with tag_escape(). ?>
									id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
									class="hero-section__heading heading-2 mb-0 js-gsap-fade"
									<?php if ( $ambrygen_content ) : ?>
										aria-describedby="<?php echo esc_attr( $ambrygen_content_id ); ?>"
									<?php endif; ?>
								>
									<?php
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo wp_kses(
										$ambrygen_heading,
										Helper::allowed_heading_html()
									);
									?>
								</<?php echo $ambrygen_heading_tag_escaped; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Sanitized with tag_escape(). ?>>
							<?php endif; ?>
							<?php if ( $ambrygen_content ) : ?>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
								<div
									id="<?php echo esc_attr( $ambrygen_content_id ); ?>"
									class="hero-section__description js-gsap-fade"
								>
									<?php echo wp_kses_post( wpautop( $ambrygen_content ) ); ?>
								</div>
							<?php endif; ?>

							<?php if ( ( $ambrygen_button_primary_text && $ambrygen_button_primary_url ) || ( $ambrygen_button_secondary_text && $ambrygen_button_secondary_url ) ) : ?>
							<div class="is-style-gl-s24" aria-hidden="true"></div>
							<div class="hero-section__actions js-gsap-fade">
								<?php if ( $ambrygen_button_primary_text && $ambrygen_button_primary_url ) : ?>
									<a
										href="<?php echo esc_url( $ambrygen_button_primary_url ); ?>"
										class="hero-section__button site-btn has-right-arrow <?php echo esc_attr( $ambrygen_button_primary_variant ); ?>"
										<?php echo $ambrygen_button_primary_target ? 'target="' . esc_attr( $ambrygen_button_primary_target ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Target is allowlisted above. ?>
										<?php echo $ambrygen_button_primary_rel ? 'rel="' . esc_attr( $ambrygen_button_primary_rel ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rel parts are sanitized above. ?>
									>
										<?php echo esc_html( $ambrygen_button_primary_text ); ?>
									</a>
								<?php endif; ?>

								<?php if ( $ambrygen_button_secondary_text && $ambrygen_button_secondary_url ) : ?>
									<a
										href="<?php echo esc_url( $ambrygen_button_secondary_url ); ?>"
										class="hero-section__button site-btn has-right-arrow <?php echo esc_attr( $ambrygen_button_secondary_variant ); ?>"
										<?php echo $ambrygen_button_secondary_target ? 'target="' . esc_attr( $ambrygen_button_secondary_target ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Target is allowlisted above. ?>
										<?php echo $ambrygen_button_secondary_rel ? 'rel="' . esc_attr( $ambrygen_button_secondary_rel ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rel parts are sanitized above. ?>
									>
										<?php echo esc_html( $ambrygen_button_secondary_text ); ?>
									</a>
								<?php endif; ?>
							</div>
							<?php endif; ?>
						</div>
					</div>
				</div>

			<?php endforeach; ?>

		</div>

		<?php if ( $ambrygen_show_slider_nav ) : ?>
			<div
				class="swiper-buttons"
				role="group"
				aria-label="<?php esc_attr_e( 'Slide navigation', 'ambrygen-web' ); ?>"
			>
				<button
					type="button"
					class="custom-prev"
					aria-label="<?php esc_attr_e( 'Previous slide (Left arrow key)', 'ambrygen-web' ); ?>"
					aria-controls="<?php echo esc_attr( $ambrygen_slides_region_id ); ?>"
					aria-keyshortcuts="ArrowLeft"
				></button>
				<button
					type="button"
					class="custom-next"
					aria-label="<?php esc_attr_e( 'Next slide (Right arrow key)', 'ambrygen-web' ); ?>"
					aria-controls="<?php echo esc_attr( $ambrygen_slides_region_id ); ?>"
					aria-keyshortcuts="ArrowRight"
				></button>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_show_slider_dots ) : ?>
			<div class="swiper-pagination"></div>
		<?php endif; ?>

	</div>
</div>
