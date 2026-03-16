<?php
/**
 * Render: Image Gallery Slider Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_title          = $attributes['title'] ?? 'Executive Leadership';
$ambrygen_intro          = $attributes['intro'] ?? '';
$ambrygen_heading_level  = $attributes['headingLevel'] ?? 'h2';

$ambrygen_heading_level = in_array(
	$ambrygen_heading_level,
	array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
	true
) ? $ambrygen_heading_level : 'h2';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'image-gallery-slider',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="image-gallery-slider__header heading-center center-align">
		<<?php echo esc_html( $ambrygen_heading_level ); ?> class="image-gallery-slider__title heading-2 mb-0 block-title">
			<?php echo wp_kses_post( $ambrygen_title ); ?>
		</<?php echo esc_html( $ambrygen_heading_level ); ?>>

		<?php if ( ! empty( $ambrygen_intro ) ) : ?>
			<div class="is-style-gl-s16" aria-hidden="true"></div>
			<div class="image-gallery-slider__intro subtitle1-reg">
				<?php echo wp_kses_post( $ambrygen_intro ); ?>
			</div>
		<?php endif; ?>
	</div>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="image-gallery-slider__items">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
	</div>
</div>
