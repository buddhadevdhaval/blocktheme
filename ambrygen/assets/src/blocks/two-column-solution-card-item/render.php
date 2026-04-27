<?php
/**
 * Render: Two Column Solution Card Item Block
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
 * Attributes
 */
$ambrygen_section_title = $attributes['sectiontitle'] ?? '';
$ambrygen_description   = $attributes['description'] ?? '';
$ambrygen_image_id      = isset( $attributes['imageId'] ) ? absint( $attributes['imageId'] ) : 0;
$ambrygen_image_url     = isset( $attributes['imageUrl'] ) ? esc_url_raw( $attributes['imageUrl'] ) : '';
$ambrygen_image_alt     = isset( $attributes['imageAlt'] ) ? sanitize_text_field( $attributes['imageAlt'] ) : '';

/**
 * Image rendering with attachment ID, URL fallback, and theme placeholder support.
 */
$ambrygen_image_html = Helper::image_from_source(
	$ambrygen_image_id,
	$ambrygen_image_url,
	'large',
	array(
		'class'   => 'cta-tiles-with-content__image',
		'alt'     => $ambrygen_image_alt,
		'loading' => 'lazy',
	),
	true
);

/**
 * Wrapper
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'cta-tiles-with-content__item js-gsap-fade',
	)
);
?>

<div <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?>>

	<div class="cta-tiles-with-content__body">

		<?php if ( ! empty( $ambrygen_section_title ) ) : ?>
			<div class="cta-tiles-with-content__title">
				<?php echo wp_kses( $ambrygen_section_title, Helper::allowed_heading_html() ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ) : ?>
			<div class="body2-reg cta-tiles-with-content__desc">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

	</div>

	<div class="cta-tiles-with-content__image-container">
		<?php
		// Helper::image_from_source() already returns safe HTML.
		echo $ambrygen_image_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</div>
