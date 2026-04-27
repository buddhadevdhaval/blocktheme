<?php
/**
 * Render: Two Column Solution Card Block
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
$ambrygen_heading     = $attributes['heading'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_description = $attributes['description'] ?? '';
$ambrygen_block_id    = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_heading_id  = '';

/**
 * Wrapper attributes
 */
$ambrygen_wrapper_args = array(
	'class' => 'cta-tiles-with-content',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

if ( ! empty( $ambrygen_heading ) ) {
	$ambrygen_heading_id                      = $ambrygen_block_id
		? $ambrygen_block_id . '-title'
		: wp_unique_id( 'two-column-solution-card-title-' );
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
} else {
	$ambrygen_wrapper_args['aria-label'] = __( 'Two column solution card', 'ambrygen-web' );
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<section <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( ! empty( $ambrygen_heading ) || ! empty( $ambrygen_description ) ) : ?>
		<div class="cta-tiles-with-content__header block__rowflex">

			<?php if ( ! empty( $ambrygen_heading ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
					<?php if ( ! empty( $ambrygen_heading_id ) ) : ?>
						id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
					<?php endif; ?>
					class="heading-3 block-title mb-0 block__rowflex--heading-title js-gsap-fade"
				>
					<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<div class="block__rowflex--block-content subtitle-1-regular js-gsap-fade">
					<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="cta-tiles-with-content__grid">
		<?php
		// InnerBlocks content is already sanitized by Gutenberg.
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</section>
