<?php
/**
 * Render: Three Column Image Grid Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes  = $attributes ?? array();
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_block_id    = $ambrygen_attributes['blockId'] ?? wp_unique_id( 'three-column-grid-' );

$ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading_tag  = in_array( $ambrygen_heading_tag, $ambrygen_allowed_tags, true ) ? $ambrygen_heading_tag : 'h2';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id'    => $ambrygen_block_id,
		'class' => 'our-approach',
	)
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div class="our-approach__header block__rowflex">

		<?php if ( $ambrygen_heading ) : ?>
			<<?php echo esc_html( $ambrygen_heading_tag ); ?> class="block-title block__rowflex--heading-title heading-3 mb-0">
				<?php
				echo wp_kses(
					$ambrygen_heading,
					Helper::allowed_heading_html()
				);
				?>
			</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_description ) : ?>
			<div class="block__rowflex--block-content subtitle1-reg">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

	</div>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="our-approach__content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>

</div>
