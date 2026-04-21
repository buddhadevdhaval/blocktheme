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

	$ambrygen_title         = $attributes['title'] ?? 'Executive Leadership';
	$ambrygen_intro         = $attributes['intro'] ?? '';
	$ambrygen_block_id      = $attributes['blockId'] ?? '';
	$ambrygen_heading_level = $attributes['headingLevel'] ?? 'h2';
	$ambrygen_has_title     = '' !== trim( wp_strip_all_tags( (string) $ambrygen_title ) );
	$ambrygen_has_intro     = '' !== trim( wp_strip_all_tags( (string) $ambrygen_intro ) );
	$ambrygen_has_header    = $ambrygen_has_title || $ambrygen_has_intro;

	$ambrygen_heading_level = in_array(
		$ambrygen_heading_level,
		array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
		true
	) ? $ambrygen_heading_level : 'h2';

	$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'image-gallery-slider',
			'id'    => $ambrygen_block_id,
		)
	);
	?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="features-media__header block__rowflex">
		<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="block-title block__rowflex--heading-title heading-2 mb-0 js-gsap-fade">
			<?php echo wp_kses_post( $ambrygen_title ); ?>
		</<?php echo tag_escape( $ambrygen_heading_level ); ?>>

		<?php if ( ! empty( $ambrygen_intro ) ) : ?>
			<div class="is-style-gl-s16" aria-hidden="true"></div>
			<div class="image-gallery-slider__intro subtitle1-reg js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_intro ); ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( $ambrygen_has_header ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="image-gallery-slider__items">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
	</div>
</div>
