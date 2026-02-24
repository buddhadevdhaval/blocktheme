<?php
/**
 * Render template for the Hero Section block.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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

$ambrygen_allowed_heading_tags = array(
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'p',
	'span',
	'div',
);

$ambrygen_swiper_config = array(
	'autoplay'   => $ambrygen_autoplay ? array( 'delay' => $ambrygen_autoplay_delay ) : false,
	'navigation' => $ambrygen_show_slider_nav,
	'pagination' => $ambrygen_show_slider_dots,
);

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hero-section',
	)
);
$ambrygen_index = 0;
?>

<div <?php echo $ambrygen_wrapper_attributes; ?>>
	<div
		class="hero-section__slider swiper container-1340"
		data-swiper-config="<?php echo esc_attr( wp_json_encode( $ambrygen_swiper_config ) ); ?>"
		role="group"
		aria-roledescription="slide"
		aria-label="<?php echo esc_attr( sprintf( 'Slide %d of %d', $ambrygen_index + 1, count( $ambrygen_slides ) ) ); ?>"
	>
		<div class="swiper-wrapper">

			<?php
				// echo '<pre>';
				// print_r($ambrygen_slides);
				// echo '</pre>';


			foreach ( $ambrygen_slides as $ambrygen_index => $ambrygen_slide ) : ?>

				<?php

				$ambrygen_background_image_id = isset( $ambrygen_slide['backgroundImageId'] ) ? absint( $ambrygen_slide['backgroundImageId'] ) : 0;
				$ambrygen_overlay_image_1_id  = isset( $ambrygen_slide['overlayImage1Id'] ) ? absint( $ambrygen_slide['overlayImage1Id'] ) : 0;
				$ambrygen_overlay_image_2_id  = isset( $ambrygen_slide['overlayImage2Id'] ) ? absint( $ambrygen_slide['overlayImage2Id'] ) : 0;

				$ambrygen_heading = $ambrygen_slide['heading'] ?? '';
				$ambrygen_content = $ambrygen_slide['content'] ?? '';
				$ambrygen_tagline = $ambrygen_slide['tagline'] ?? '';
				$ambrygen_eyebrow = $ambrygen_slide['eyebrow'] ?? '';

			

				$ambrygen_button_primary    = $ambrygen_slide['primarybutton'] ?? array();
				$ambrygen_button_secondary   = $ambrygen_slide['secondarybutton'] ?? array();

				$ambrygen_button_primary_text   = $ambrygen_button_primary['text'] ?? '';
				$ambrygen_button_primary_url    = $ambrygen_button_primary['url'] ?? '#';
				$ambrygen_button_primary_target    = $ambrygen_button_primary['target'] ?? '';
				$ambrygen_button_primary_variant    = $ambrygen_button_primary['variant'] ?? '#';

				$ambrygen_button_target_attr = ! empty( $ambrygen_button_primary_target )
				? ' target="' . esc_attr( $ambrygen_button_primary_target ) . '" rel="noopener noreferrer"'
				: '';

				$ambrygen_button_secondary_text = $ambrygen_button_secondary['text'] ?? '';
				$ambrygen_button_secondary_url  = $ambrygen_button_secondary['url'] ?? '#';
				$ambrygen_button_secondary_target  = $ambrygen_button_secondary['target'] ?? '#';
				$ambrygen_button_secondary_variant  = $ambrygen_button_secondary['variant'] ?? '';

				$ambrygen_secondary_button_target_attr = ! empty( $ambrygen_button_secondary_target )
				? ' target="' . esc_attr( $ambrygen_button_secondary_target ) . '" rel="noopener noreferrer"'
				: '';

				$ambrygen_heading_tag = isset( $ambrygen_slide['headingTag'] )
					? strtolower( $ambrygen_slide['headingTag'] )
					: 'h2';

				if ( ! in_array( $ambrygen_heading_tag, $ambrygen_allowed_heading_tags, true ) ) {
					$ambrygen_heading_tag = 'h2';
				}

				if(count( $ambrygen_slides ) == 1){
					$ambrygen_heading_tag_escaped = tag_escape( $ambrygen_heading_tag );
				}else{
					$ambrygen_heading_tag_escaped = "div";

				}

				?>

				<div class="hero-section__slide swiper-slide">
					<div class="hero-section__background">

						<?php
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped HTML returned by Helper::image().
						echo Helper::image_with_placeholder(
							$ambrygen_background_image_id,
							'hero-desktop',
							array(
								'class'   => 'hero-section__image',
								'loading' => 0 === $ambrygen_index ? 'eager' : 'lazy',
							)
						);
						?>

						<?php if ( $ambrygen_overlay_image_1_id ) : ?>
							<div class="hero-section__overlay hero-section__overlay--1 hero-section__overlay--top">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped HTML returned by Helper::image().
								echo Helper::image(
									$ambrygen_overlay_image_1_id,
									'large',
									array(
										'loading' => 'lazy',
									)
								);
								?>
							</div>
						<?php endif; ?>

						<?php if ( $ambrygen_overlay_image_2_id ) : ?>
							<div class="hero-section__overlay hero-section__overlay--bottom">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped HTML returned by Helper::image().
								echo Helper::image(
									$ambrygen_overlay_image_2_id,
									'large',
									array(
										'loading' => 'lazy',
									)
								);
								?>
							</div>
						<?php endif; ?>

					</div>

					<div class="wrapper">
						<div class="hero-section__content">

							<?php if ( $ambrygen_eyebrow ) : ?>
								<div class="hero__eyebrow hero-kicker">
									<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
								</div>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
							<?php endif; ?>
							<?php if ( $ambrygen_heading ) : ?>
								<<?php echo $ambrygen_heading_tag_escaped; ?>
									id="<?php echo esc_attr( 'hero-heading-' . $ambrygen_index ); ?>"
									class="hero-section__heading heading-2 mb-0"
								>
									<?php
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo wp_kses(
										$ambrygen_heading,
										Helper::allowed_heading_html()
									);
									?>
								</<?php echo $ambrygen_heading_tag_escaped; ?>>
							<?php endif; ?>
							<div class="is-style-gl-s24" aria-hidden="true"></div>
							<?php if ( $ambrygen_content ) : ?>
								<div class="hero-section__description">
									<?php echo wp_kses_post( wpautop( $ambrygen_content ) ); ?>
								</div>
							<?php endif; ?>

							<?php if ( $ambrygen_tagline ) : ?>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
								<div class="hero-section__tagline">
									<?php echo wp_kses_post( wpautop( $ambrygen_tagline ) ); ?>
								</div>
							<?php endif; ?>
							<?php if ( $ambrygen_button_primary_text  && $ambrygen_button_secondary_text ) : ?>
							<div class="is-style-gl-s24" aria-hidden="true"></div>
							<div class="hero-section__actions">
								<?php if ( $ambrygen_button_primary_text ) : ?>
									<a
										href="<?php echo esc_url( $ambrygen_button_primary_url ); ?>"
										class="hero-section__button site-btn is-style-site-trailing-icon <?php echo $ambrygen_button_primary_variant; ?>"
										<?php echo $ambrygen_button_target_attr; ?>
									>
										<?php echo esc_html( $ambrygen_button_primary_text ); ?>
									</a>
								<?php endif; ?>

								<?php if ( $ambrygen_button_secondary_text ) : ?>
									<a
										href="<?php echo esc_url( $ambrygen_button_secondary_url ); ?>"
										class="hero-section__button site-btn is-style-site-trailing-icon <?php echo $ambrygen_button_secondary_variant; ?>"
										<?php echo $ambrygen_secondary_button_target_attr; ?>
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
			<div class="swiper-buttons">
				<div class="custom-prev"></div>
				<div class="custom-next"></div>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_show_slider_dots ) : ?>
			<div class="swiper-pagination"></div>
		<?php endif; ?>

	</div>
</div>
