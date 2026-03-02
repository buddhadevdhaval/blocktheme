<?php
/**
 * Render template for the Testimonials block.
 *
 * @package Ambrygen
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
use Ambrygen\Theme\Core\Helper;

/**
 * Access attributes safely with default values.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Block inner content.
 */
$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
$ambrygen_content    = isset( $content ) ? $content : '';


/**
 * Retrieve attributes with defaults.
 */
$ambrygen_heading = isset( $ambrygen_attributes['heading'] )
	? $ambrygen_attributes['heading']
	: __( 'Read About Ambry’s Impact on Patient Lives', 'ambrygen-web' );

$ambrygen_heading_tag = isset( $ambrygen_attributes['headingTag'] )
	? $ambrygen_attributes['headingTag']
	: 'h2';

if ( ! in_array( $ambrygen_heading_tag, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ), true ) ) {
	$ambrygen_heading_tag = 'h2';
}

$ambrygen_secondary_image_id = isset( $ambrygen_attributes['secondaryImageId'] ) ? $ambrygen_attributes['secondaryImageId'] : null;
$ambrygen_overlay_image_id   = isset( $ambrygen_attributes['overlayImageId'] ) ? $ambrygen_attributes['overlayImageId'] : null;

/**
 * Generate a unique ID for the heading to be used in aria-labelledby.
 */
$ambrygen_id         = wp_unique_id();
$ambrygen_heading_id = 'testimonials-heading-' . $ambrygen_id;

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'           => 'wp-block-ambrygen-testimonials ambry-testimonials testimonials-slider',
		'aria-labelledby' => $ambrygen_heading_id,
	)
);
?>

<section <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<!-- Overlay Graphics -->
	<div class="ambry-testimonials__graphic-images" aria-hidden="true">

		<?php if ( ! empty( $ambrygen_overlay_image_id ) ) : ?>
			<div class="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
					<?php
					echo wp_kses_post(
						Helper::image(
							$ambrygen_overlay_image_id,
							'large',
							array(
								'class'   => 'overlay__img',
								'loading' => 'lazy',
								'alt'     => '',
							)
						)
					);
					

					?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_secondary_image_id ) ) : ?>
			<div class="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
					<?php
					echo wp_kses_post(
						Helper::image(
							$ambrygen_secondary_image_id,
							'large',
							array(
								'class'   => 'overlay__img',
								'loading' => 'lazy',
								'alt'     => '',
							)
						)
					);

					?>
					
			</div>
		<?php endif; ?>

	</div>

	<!-- Heading -->
	<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="ambry-testimonials__heading heading-3 mb-0">
		<?php
			echo wp_kses(
				$ambrygen_heading,
				Helper::allowed_heading_html()
			);
			?>
	</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>

	<div class="is-style-gl-s32"></div>

	<!-- Layout -->
	<div class="ambry-testimonials__layout">
		<div class="ambry-testimonials__grid">

			<div class="testimonial_slider swiper" role="region" aria-roledescription="carousel" aria-label="<?php esc_attr_e( 'Patient Testimonials', 'ambrygen-web' ); ?>">
				<div class="swiper-wrapper">
					<?php
					// InnerBlocks output (trusted block HTML).
					echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					?>
				</div>
				<div class="swiper-buttons">
					<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous testimonial', 'ambrygen-web' ); ?>">
					</button>
					<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next testimonial', 'ambrygen-web' ); ?>">
					</button>
				</div>
			</div>

		</div>
	</div>
</section>
