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

defined('ABSPATH') || exit;

/**
 * Block attributes passed to the block render callback.
 *
 * @var array<string, mixed> $ambrygen_attributes
 */
$ambrygen_attributes = is_array($attributes ?? null) ? $attributes : array();

$ambrygen_block_id = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title = $ambrygen_attributes['title'] ?? 'Words from the Team';
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_content = isset($content) ? trim((string) $content) : '';
$ambrygen_graphic_left_id = isset($ambrygen_attributes['graphicLeftId']) ? absint($ambrygen_attributes['graphicLeftId']) : 0;
$ambrygen_graphic_left_url = isset($ambrygen_attributes['graphicLeftUrl']) ? esc_url($ambrygen_attributes['graphicLeftUrl']) : '';
$ambrygen_graphic_left_alt = isset($ambrygen_attributes['graphicLeftAlt']) ? sanitize_text_field($ambrygen_attributes['graphicLeftAlt']) : '';
$ambrygen_graphic_right_id = isset($ambrygen_attributes['graphicRightId']) ? absint($ambrygen_attributes['graphicRightId']) : 0;
$ambrygen_graphic_right_url = isset($ambrygen_attributes['graphicRightUrl']) ? esc_url($ambrygen_attributes['graphicRightUrl']) : '';
$ambrygen_graphic_right_alt = isset($ambrygen_attributes['graphicRightAlt']) ? sanitize_text_field($ambrygen_attributes['graphicRightAlt']) : '';

$ambrygen_wrapper_args = array(
	'class' => 'testimonial-slider ',
);

if ($ambrygen_block_id) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes($ambrygen_wrapper_args);

$ambrygen_heading_level = in_array($ambrygen_heading_level, array('h1', 'h2', 'h3', 'h4', 'h5', 'h6'), true) ? $ambrygen_heading_level : 'h2';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="graphic-images" aria-hidden="true">
		<div class="graphic-images__overlay-left graphic-images__img-block">
			<?php if ($ambrygen_graphic_left_id): ?>
				<?php
				echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					$ambrygen_graphic_left_id,
					'full',
					array(
						'class' => 'overlay__img',
						'alt' => $ambrygen_graphic_left_alt,
						'loading' => 'lazy',
					)
				);
				?>
			<?php elseif ($ambrygen_graphic_left_url): ?>
				<img src="<?php echo esc_url($ambrygen_graphic_left_url); ?>" class="overlay__img"
					alt="<?php echo esc_attr($ambrygen_graphic_left_alt); ?>" loading="lazy" />
			<?php endif; ?>
		</div>
		<div class="graphic-images__overlay-right graphic-images__img-block">
			<?php if ($ambrygen_graphic_right_id): ?>
				<?php
				echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					$ambrygen_graphic_right_id,
					'full',
					array(
						'class' => 'overlay__img',
						'alt' => $ambrygen_graphic_right_alt,
						'loading' => 'lazy',
					)
				);
				?>
			<?php elseif ($ambrygen_graphic_right_url): ?>
				<img src="<?php echo esc_url($ambrygen_graphic_right_url); ?>" class="overlay__img"
					alt="<?php echo esc_attr($ambrygen_graphic_right_alt); ?>" loading="lazy" />
			<?php endif; ?>
		</div>
	</div>
	<div class="testimonial-slider__inner">
		<div class="testimonial-slider__header">
			<?php if ('' !== trim(wp_strip_all_tags($ambrygen_title))): ?>
				<<?php echo esc_html($ambrygen_heading_level); ?> class="heading-3 block-title mb-0">
					<?php echo wp_kses_post($ambrygen_title); ?>
				</<?php echo esc_html($ambrygen_heading_level); ?>>
			<?php endif; ?>
		</div>
		<div class="is-style-gl-s50"></div>
		<?php if ('' !== $ambrygen_content): ?>
			<div class="testimonial-slider__swiper">
				<div
					class="testimonial-slider-wrapper swiper testimonial-swiper"
					data-slides-per-view="<?php echo esc_attr(max(1, (int) ($ambrygen_attributes['slidesPerView'] ?? 1))); ?>"
					data-autoplay="<?php echo !empty($ambrygen_attributes['autoplay']) ? 'true' : 'false'; ?>"
				>
					<div class="swiper-wrapper">
						<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				</div>
				<?php if (!empty($ambrygen_attributes['showNavigation'])): ?>
					<div class="swiper-buttons">
						<button type="button" class="custom-prev" aria-label="<?php esc_attr_e('Previous testimonial', 'ambrygen-web'); ?>"></button>
						<button type="button" class="custom-next" aria-label="<?php esc_attr_e('Next testimonial', 'ambrygen-web'); ?>"></button>
					</div>
				<?php endif; ?>
				<?php if (!empty($ambrygen_attributes['showPagination'])): ?>
					<div class="swiper-pagination testimonial-swiper-pagination"></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
