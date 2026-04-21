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
$ambrygen_testimonials = is_array($ambrygen_attributes['testimonials'] ?? null) ? $ambrygen_attributes['testimonials'] : array();
$ambrygen_graphic_left_id = isset($ambrygen_attributes['graphicLeftId']) ? absint($ambrygen_attributes['graphicLeftId']) : 0;
$ambrygen_graphic_left_url = isset($ambrygen_attributes['graphicLeftUrl']) ? esc_url($ambrygen_attributes['graphicLeftUrl']) : '';
$ambrygen_graphic_left_alt = isset($ambrygen_attributes['graphicLeftAlt']) ? sanitize_text_field($ambrygen_attributes['graphicLeftAlt']) : '';
$ambrygen_graphic_right_id = isset($ambrygen_attributes['graphicRightId']) ? absint($ambrygen_attributes['graphicRightId']) : 0;
$ambrygen_graphic_right_url = isset($ambrygen_attributes['graphicRightUrl']) ? esc_url($ambrygen_attributes['graphicRightUrl']) : '';
$ambrygen_graphic_right_alt = isset($ambrygen_attributes['graphicRightAlt']) ? sanitize_text_field($ambrygen_attributes['graphicRightAlt']) : '';

$ambrygen_wrapper_args = array(
	'class' => 'testimonial-slider testingsssss',
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
		<?php if (!empty($ambrygen_testimonials)): ?>
			<div class="testimonial-slider__swiper">
				<div class="testimonial-slider-wrapper swiper testimonial-swiper">
					<div class="swiper-wrapper">
						<?php foreach ($ambrygen_testimonials as $ambrygen_testimonial): ?>
							<?php
							$ambrygen_content = isset($ambrygen_testimonial['content']) ? wp_kses_post($ambrygen_testimonial['content']) : '';
							$ambrygen_image_id = isset($ambrygen_testimonial['imageId']) ? absint($ambrygen_testimonial['imageId']) : 0;
							$ambrygen_image_url = isset($ambrygen_testimonial['imageUrl']) ? esc_url($ambrygen_testimonial['imageUrl']) : '';
							$ambrygen_image_alt = isset($ambrygen_testimonial['imageAlt']) ? sanitize_text_field($ambrygen_testimonial['imageAlt']) : '';
							?>
							<div class="swiper-slide">
								<div class="testimonial-slider__card">
									<?php if ($ambrygen_content): ?>
										<div class="testimonial-slider__quote heading-5 mb-0">
											<?php echo $ambrygen_content; ?>
										</div>
									<?php endif; ?>
									<div class="is-style-gl-s24"></div>
									<?php if ($ambrygen_image_id || $ambrygen_image_url): ?>
										<div class="testimonial-slider__logo">
											<?php if ($ambrygen_image_id): ?>
												<?php
												echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
													$ambrygen_image_id,
													'full',
													array(
														'alt' => $ambrygen_image_alt,
														'loading' => 'lazy',
													)
												);
												?>
											<?php elseif ($ambrygen_image_url): ?>
												<img src="<?php echo esc_url($ambrygen_image_url); ?>"
													alt="<?php echo esc_attr($ambrygen_image_alt); ?>" loading="lazy" />
											<?php endif; ?>
										</div>
									<?php endif; ?>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
				<div class="swiper-pagination testimonial-swiper-pagination"></div>
			</div>
		<?php endif; ?>
	</div>
</div>