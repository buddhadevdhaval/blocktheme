<?php
/**
 * Render: Testimonials Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
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
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';


/**
 * Retrieve attributes with defaults.
 */
$ambrygen_heading = isset( $ambrygen_attributes['heading'] )
	? $ambrygen_attributes['heading']
	: '';
$ambrygen_has_heading = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );

$ambrygen_heading_tag = isset( $ambrygen_attributes['headingTag'] )
	? $ambrygen_attributes['headingTag']
	: 'h2';

$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_heading_tag, 'h2' );

$ambrygen_secondary_image_id  = isset( $ambrygen_attributes['secondaryImageId'] ) ? absint( $ambrygen_attributes['secondaryImageId'] ) : 0;
$ambrygen_secondary_image_url = isset( $ambrygen_attributes['secondaryImage'] ) ? esc_url_raw( $ambrygen_attributes['secondaryImage'] ) : '';
$ambrygen_secondary_image_alt = isset( $ambrygen_attributes['secondaryImageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['secondaryImageAlt'] ) : '';
$ambrygen_overlay_image_id    = isset( $ambrygen_attributes['overlayImageId'] ) ? absint( $ambrygen_attributes['overlayImageId'] ) : 0;
$ambrygen_overlay_image_url   = isset( $ambrygen_attributes['overlayImage'] ) ? esc_url_raw( $ambrygen_attributes['overlayImage'] ) : '';
$ambrygen_overlay_image_alt   = isset( $ambrygen_attributes['overlayImageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['overlayImageAlt'] ) : '';

/**
 * Generate a unique ID for the heading to be used in aria-labelledby.
 */
$ambrygen_id         = wp_unique_id();
$ambrygen_heading_id = $ambrygen_has_heading ? 'testimonials-heading-' . $ambrygen_id : '';
$ambrygen_status_id  = 'testimonials-status-' . $ambrygen_id;

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes_array = array(
	'class'                             => 'block-layout wp-block-ambrygen-testimonials ambry-testimonials  testimonials-slider',
	'data-testimonials-status-id'       => $ambrygen_status_id,
	'data-testimonials-prev-label'      => __( 'Previous testimonial', 'ambrygen-web' ),
	'data-testimonials-next-label'      => __( 'Next testimonial', 'ambrygen-web' ),
	'data-testimonials-status-template' => __( 'Slide %1$d of %2$d', 'ambrygen-web' ),
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

if ( $ambrygen_has_heading ) {
	$ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div class="ambry-testimonials__graphic-images" aria-hidden="true">

		<?php if ( $ambrygen_overlay_image_id || $ambrygen_overlay_image_url ) : ?>
			<div class="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
				echo Helper::image_from_source(
					$ambrygen_overlay_image_id,
					$ambrygen_overlay_image_url,
					'large',
					array(
						'class'    => 'overlay__img',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_overlay_image_alt,
					)
				);
				?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_secondary_image_id || $ambrygen_secondary_image_url ) : ?>
			<div class="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
				echo Helper::image_from_source(
					$ambrygen_secondary_image_id,
					$ambrygen_secondary_image_url,
					'large',
					array(
						'class'    => 'overlay__img',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_secondary_image_alt,
					)
				);
				?>
			</div>
		<?php endif; ?>

	</div>

	<?php if ( $ambrygen_has_heading ) : ?>
		<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="js-gsap-fade ambry-testimonials__heading heading-3 mb-0">
			<?php
				echo wp_kses(
					$ambrygen_heading,
					Helper::allowed_heading_html()
				);
			?>
		</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>

		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="ambry-testimonials__layout">
		<div class="ambry-testimonials__grid">

			<div class="testimonial_slider swiper" role="region" aria-roledescription="carousel" aria-label="<?php esc_attr_e( 'Patient Testimonials', 'ambrygen-web' ); ?>">
				<div class="swiper-wrapper">
					<?php
					// InnerBlocks output (trusted block HTML).
					echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					?>
				</div>
				<div class="screen-reader-text" aria-live="polite" aria-atomic="true" id="<?php echo esc_attr( $ambrygen_status_id ); ?>">
					<?php
					/* translators: %1$d: current slide, %2$d: total slides */
					printf( esc_html__( 'Slide %1$d of %2$d', 'ambrygen-web' ), 1, 0 );
					?>
				</div>
				<div class="swiper-buttons">
					<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous testimonial', 'ambrygen-web' ); ?>" aria-controls="<?php echo esc_attr( $ambrygen_status_id ); ?>">
					</button>
					<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next testimonial', 'ambrygen-web' ); ?>" aria-controls="<?php echo esc_attr( $ambrygen_status_id ); ?>">
					</button>
				</div>
			</div>

		</div>
	</div>
</div>
