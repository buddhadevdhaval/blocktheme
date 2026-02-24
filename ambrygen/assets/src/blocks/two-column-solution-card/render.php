<?php
/**
 * CTA Tiles With Content
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
$ambrygen_heading     = $attributes['heading'] ?? '';
$ambrygen_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_description = $attributes['description'] ?? '';
$ambrygen_block_id    = $attributes['blockId'] ?? '';

/**
 * Sanitize block ID
 */
$ambrygen_block_id = $ambrygen_block_id ? sanitize_html_class( $ambrygen_block_id ) : '';

/**
 * Allowed heading tags
 */
$ambrygen_allowed_heading_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );

if ( ! in_array( $ambrygen_heading_tag, $ambrygen_allowed_heading_tags, true ) ) {
	$ambrygen_heading_tag = 'h2';
}

/**
 * Wrapper attributes
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id'    => $ambrygen_block_id ? $ambrygen_block_id : null,
		'class' => 'cta-tiles-with-content',
	)
);

/**
 * ARIA labelledby (only if valid heading + id exist)
 */
$ambrygen_section_labelledby = '';

if ( ! empty( $ambrygen_heading ) && ! empty( $ambrygen_block_id ) ) {
	$ambrygen_section_labelledby = sprintf(
		'aria-labelledby="%s"',
		esc_attr( $ambrygen_block_id . '-title' )
	);
}
?>

<section <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?> <?php echo wp_kses_post( $ambrygen_section_labelledby ); ?>>

	<?php if ( ! empty( $ambrygen_heading ) || ! empty( $ambrygen_description ) ) : ?>
		<div class="cta-tiles-with-content__header block__rowflex">

			<?php if ( ! empty( $ambrygen_heading ) ) : ?>
				<<?php echo esc_html( $ambrygen_heading_tag ); ?>
					<?php if ( ! empty( $ambrygen_block_id ) ) : ?>
						id="<?php echo esc_attr( $ambrygen_block_id . '-title' ); ?>"
					<?php endif; ?>
					class="heading-3 block-title mb-0 block__rowflex--heading-title"
				>
					<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<div class="block__rowflex--block-content subtitle-1-regular">
					<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
				</div>
			<?php endif; ?>

		</div>
	<?php endif; ?>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<div class="cta-tiles-with-content__grid">
		<?php
		// InnerBlocks content is already sanitized by Gutenberg.
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</section>