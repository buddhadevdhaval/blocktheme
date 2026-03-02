<?php
/**
 * CTA Tiles With Content Item
 *
 * @package Ambrygen
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
$ambrygen_image_url     = $attributes['imageUrl'] ?? '';
$ambrygen_image_alt     = $attributes['imageAlt'] ?? '';


/**
 * Accessibility:
 * If alt not provided → fallback to section title
 */
if ( empty( $ambrygen_image_alt ) && ! empty( $ambrygen_section_title ) ) {
	$ambrygen_image_alt = wp_strip_all_tags( $ambrygen_section_title );
}

/**
 * Image rendering (ID priority)
 */
$ambrygen_image_html = '';


	$ambrygen_image_html = Helper::image_with_placeholder(
		$ambrygen_image_id,
		'large',
		array(
			'class'   => 'cta-tiles-with-content__image',
			'alt'     => esc_attr( $ambrygen_image_alt ),
			'loading' => 'lazy',
		)
	);



	/**
	 * Wrapper
	 */
	$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'cta-tiles-with-content__item',
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
		// Helper::image() already returns safe HTML.
		echo $ambrygen_image_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</div>
