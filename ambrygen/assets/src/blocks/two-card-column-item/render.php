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
$ambrygen_variation     = $block->context['ambrygen/twoCardColumnVariation'] ?? '';

if ( 'variation-2' === $ambrygen_variation ) {
	$ambrygen_is_variation_2 = 'variation-2';
} else {
	$ambrygen_is_variation_2 = false;
}
$ambrygen_inner_content = trim( (string) $content );
$ambrygen_copy_html     = '';
$ambrygen_cta_html      = '';

if ( $ambrygen_is_variation_2 && $ambrygen_inner_content ) {
	$ambrygen_blocks = $block->parsed_block['innerBlocks'] ?? array();

	foreach ( $ambrygen_blocks as $ambrygen_block ) {
		$ambrygen_block_name = $ambrygen_block['blockName'] ?? '';
		$ambrygen_block_html = render_block( $ambrygen_block );

		if ( ! trim( $ambrygen_block_html ) ) {
			continue;
		}

		if ( in_array( $ambrygen_block_name, array( 'core/buttons', 'core/button' ), true ) ) {
			$ambrygen_cta_html .= $ambrygen_block_html;
			continue;
		}

		$ambrygen_copy_html .= $ambrygen_block_html;
	}

	$ambrygen_copy_html = trim( $ambrygen_copy_html );
	$ambrygen_cta_html  = trim( $ambrygen_cta_html );

	if ( $ambrygen_copy_html ) {
		$ambrygen_copy_processor = new WP_HTML_Tag_Processor( $ambrygen_copy_html );

		while ( $ambrygen_copy_processor->next_tag() ) {
			$ambrygen_tag_name = $ambrygen_copy_processor->get_tag();

			if ( 'UL' === $ambrygen_tag_name || 'OL' === $ambrygen_tag_name ) {
				$ambrygen_copy_processor->add_class( 'body1' );
				$ambrygen_copy_processor->add_class( 'ordering-options__card-list' );
			}

			if ( 'P' === $ambrygen_tag_name ) {
				$ambrygen_copy_processor->add_class( 'body1' );
				$ambrygen_copy_processor->add_class( 'ordering-options__card-paragraph' );
			}
		}

		$ambrygen_copy_html = trim( $ambrygen_copy_processor->get_updated_html() );
	}
}

/**
 * Image rendering with attachment ID, URL fallback, and theme placeholder support.
 */
$ambrygen_image_html = Helper::image_from_source(
	$ambrygen_image_id,
	$ambrygen_image_url,
	'large',
	array(
		'class'   => $ambrygen_is_variation_2 ? '' : 'cta-tiles-with-content__image  block-layout',
		'alt'     => $ambrygen_image_alt,
		'loading' => 'lazy',
	)
);

/**
 * Wrapper
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $ambrygen_is_variation_2
			? 'block-layout ordering-options__card js-gsap-fade'
			: 'block-layout cta-tiles-with-content__item js-gsap-fade',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is sanitized by WordPress core. ?>>

	<?php if ( $ambrygen_is_variation_2 && ( $ambrygen_image_id > 0 || ! empty( $ambrygen_image_url ) ) ) : ?>
		<div class="ordering-options__card-image">
			<?php
			// Helper::image_from_source() already returns safe HTML.
			echo $ambrygen_image_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>

	<div class="<?php echo esc_attr( $ambrygen_is_variation_2 ? 'ordering-options__card-body' : 'cta-tiles-with-content__body' ); ?>">
		<?php if ( $ambrygen_is_variation_2 ) : ?>
			<div class="ordering-options__card-content">
		<?php endif; ?>

			<?php if ( ! empty( $ambrygen_section_title ) ) : ?>
				<div class="<?php echo esc_attr( $ambrygen_is_variation_2 ? 'heading-5 ordering-options__card-title mb-0' : 'cta-tiles-with-content__title' ); ?>">
					<?php echo wp_kses( $ambrygen_section_title, Helper::allowed_heading_html() ); ?>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<div class="<?php echo esc_attr( $ambrygen_is_variation_2 ? 'subtitle2-sbold ordering-options__card-subtitle' : 'body2-reg cta-tiles-with-content__desc' ); ?>">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_is_variation_2 && $ambrygen_copy_html ) : ?>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="ordering-options__card-copy">
					<?php echo $ambrygen_copy_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Processed InnerBlocks content is sanitized by WordPress rendering. ?>
				</div>
			<?php endif; ?>

		<?php if ( $ambrygen_is_variation_2 ) : ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_is_variation_2 && $ambrygen_cta_html ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php echo $ambrygen_cta_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is rendered by WordPress core. ?>
		<?php endif; ?>
	</div>

	<?php if ( ! $ambrygen_is_variation_2 && ( $ambrygen_image_id > 0 || ! empty( $ambrygen_image_url ) ) ) : ?>
		<div class="cta-tiles-with-content__image-container">
			<?php
			// Helper::image_from_source() already returns safe HTML.
			echo $ambrygen_image_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>

</div>
