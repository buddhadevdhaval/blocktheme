<?php
/**
 * Render: Testimonials Slider Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

/**
 * Block attributes passed to the block render callback.
 *
 * @var array<string, mixed> $ambrygen_attributes
 */
$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title = $ambrygen_attributes['title'] ?? '';
$ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_content = isset( $content ) ? trim( (string) $content ) : '';
$ambrygen_graphic_left_id = isset( $ambrygen_attributes['graphicLeftId'] ) ? absint( $ambrygen_attributes['graphicLeftId'] ) : 0;
$ambrygen_graphic_left_url = isset( $ambrygen_attributes['graphicLeftUrl'] ) ? (string) $ambrygen_attributes['graphicLeftUrl'] : '';
$ambrygen_graphic_left_alt = isset( $ambrygen_attributes['graphicLeftAlt'] ) ? sanitize_text_field( $ambrygen_attributes['graphicLeftAlt'] ) : '';
$ambrygen_graphic_right_id = isset( $ambrygen_attributes['graphicRightId'] ) ? absint( $ambrygen_attributes['graphicRightId'] ) : 0;
$ambrygen_graphic_right_url = isset( $ambrygen_attributes['graphicRightUrl'] ) ? (string) $ambrygen_attributes['graphicRightUrl'] : '';
$ambrygen_graphic_right_alt = isset( $ambrygen_attributes['graphicRightAlt'] ) ? sanitize_text_field( $ambrygen_attributes['graphicRightAlt'] ) : '';
$ambrygen_has_title = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_left_graphic = $ambrygen_graphic_left_id || '' !== $ambrygen_graphic_left_url;
$ambrygen_has_right_graphic = $ambrygen_graphic_right_id || '' !== $ambrygen_graphic_right_url;
$ambrygen_has_graphics = $ambrygen_has_left_graphic || $ambrygen_has_right_graphic;
$ambrygen_inner_blocks = array();

if ( isset( $block->inner_blocks ) && is_array( $block->inner_blocks ) ) {
	$ambrygen_inner_blocks = $block->inner_blocks;
} elseif ( isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] ) ) {
	$ambrygen_inner_blocks = $block->parsed_block['innerBlocks'];
}

$ambrygen_slide_count = count( $ambrygen_inner_blocks );
$ambrygen_has_multiple_slides = $ambrygen_slide_count > 1;
$ambrygen_slider_label = $ambrygen_has_title ? wp_strip_all_tags( $ambrygen_title ) : __( 'Testimonials', 'ambrygen-web' );
$ambrygen_show_navigation = array_key_exists( 'showNavigation', $ambrygen_attributes ) ? (bool) $ambrygen_attributes['showNavigation'] : true;
$ambrygen_show_pagination = array_key_exists( 'showPagination', $ambrygen_attributes ) ? (bool) $ambrygen_attributes['showPagination'] : true;
$ambrygen_autoplay = ! empty( $ambrygen_attributes['autoplay'] );

$ambrygen_wrapper_args = array(
	'class' => 'testimonial-slider',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

$ambrygen_heading_tag = in_array( $ambrygen_heading_tag, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $ambrygen_heading_tag : 'h2';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_has_graphics ) : ?>
		<div class="graphic-images" aria-hidden="true">
			<?php if ( $ambrygen_has_left_graphic ) : ?>
				<div class="graphic-images__overlay-left graphic-images__img-block">
					<?php if ( $ambrygen_graphic_left_id ) : ?>
						<?php
						echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							$ambrygen_graphic_left_id,
							'full',
							array(
								'class'   => 'overlay__img',
								'alt'     => $ambrygen_graphic_left_alt,
								'loading' => 'lazy',
							)
						);
						?>
					<?php elseif ( $ambrygen_graphic_left_url ) : ?>
						<img src="<?php echo esc_url( $ambrygen_graphic_left_url ); ?>" class="overlay__img" alt="<?php echo esc_attr( $ambrygen_graphic_left_alt ); ?>" loading="lazy" decoding="async" />
					<?php endif; ?>
				</div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_right_graphic ) : ?>
				<div class="graphic-images__overlay-right graphic-images__img-block">
					<?php if ( $ambrygen_graphic_right_id ) : ?>
						<?php
						echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							$ambrygen_graphic_right_id,
							'full',
							array(
								'class'   => 'overlay__img',
								'alt'     => $ambrygen_graphic_right_alt,
								'loading' => 'lazy',
							)
						);
						?>
					<?php elseif ( $ambrygen_graphic_right_url ) : ?>
						<img src="<?php echo esc_url( $ambrygen_graphic_right_url ); ?>" class="overlay__img" alt="<?php echo esc_attr( $ambrygen_graphic_right_alt ); ?>" loading="lazy" decoding="async" />
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	<div class="testimonial-slider__inner">
		<div class="testimonial-slider__header">
			<?php if ( $ambrygen_has_title ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-3 block-title mb-0">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>
		</div>
		<?php if ( $ambrygen_has_title ) : ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
		<?php endif; ?>
		<?php if ( '' !== $ambrygen_content ) : ?>
			<div class="testimonial-slider__swiper">
				<div
					class="testimonial-slider-wrapper swiper testimonial-swiper"
					role="region"
					aria-roledescription="<?php esc_attr_e( 'carousel', 'ambrygen-web' ); ?>"
					aria-label="<?php echo esc_attr( $ambrygen_slider_label ); ?>"
					data-slides-per-view="1"
					data-autoplay="<?php echo $ambrygen_autoplay ? 'true' : 'false'; ?>"
				>
					<div class="swiper-wrapper">
						<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				</div>
				<?php if ( $ambrygen_show_navigation && $ambrygen_has_multiple_slides ) : ?>
					<div class="swiper-buttons">
						<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous testimonial', 'ambrygen-web' ); ?>"></button>
						<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next testimonial', 'ambrygen-web' ); ?>"></button>
					</div>
				<?php endif; ?>
				<?php if ( $ambrygen_show_pagination && $ambrygen_has_multiple_slides ) : ?>
					<div class="swiper-pagination testimonial-swiper-pagination"></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
