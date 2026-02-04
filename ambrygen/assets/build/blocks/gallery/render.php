<?php
/**
 * Render template for the Gallery block.
 *
 * @package Ambrygen
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Access attributes safely with default values.
 *
 * @var array $attributes Block attributes.
 * @var string $content Block inner content.
 */
$attributes = isset($attributes) ? $attributes : array();
$content = isset($content) ? $content : '';

// Retrieve attributes.
$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : array();
$variation = isset($attributes['variation']) ? $attributes['variation'] : 'two-column';
$heading = isset($attributes['heading']) ? $attributes['heading'] : 'Get Started with Ambry';

$class_name = 'image-grid-block variation-' . $variation;
$wrapper_attributes = get_block_wrapper_attributes(array('class' => $class_name));
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="get-started-ambry-block">
		<h2 class="block-title heading-3 mb-0">
			<?php echo wp_kses_post($heading); ?>
		</h2>

		<div class="card-grid-block">
			<?php foreach ($items as $item): ?>
				<?php
				$link = isset($item['link']) ? $item['link'] : '';
				$title = isset($item['title']) ? $item['title'] : '';
				$description = isset($item['description']) ? $item['description'] : '';
				$image_url = isset($item['imageUrl']) ? $item['imageUrl'] : '';
				$image_srcset = isset($item['imageSrcSet']) ? $item['imageSrcSet'] : '';
				$image_sizes = isset($item['imageSizes']) ? $item['imageSizes'] : '';
				$image_alt = isset($item['imageAlt']) ? $item['imageAlt'] : '';
				$heading_tag = isset($item['headingTag']) ? $item['headingTag'] : 'h5';

				// Determine tag.
				$is_link = !empty($link);
				$tag = $is_link ? 'a' : 'div';
				?>

				<<?php echo tag_escape($tag); ?>
					class="card-col"
					<?php if ($is_link): ?>href="
						<?php echo esc_url($link); ?>"
					<?php endif; ?>
					aria-label="
				<?php echo esc_attr($title ? $title : 'Card item'); ?>"
					>
					<?php if (!empty($image_url)): ?>
						<div class="image-block">
							<img src="<?php echo esc_url($image_url); ?>"
								srcset="<?php echo esc_attr($image_srcset); ?>"
								sizes="<?php echo esc_attr($image_sizes); ?>"
								alt="<?php echo esc_attr($image_alt ? $image_alt : ($title ? $title : 'Company logo')); ?>"
								loading="lazy" />
						</div>
					<?php endif; ?>

					<div class="card-info">
						<?php if (!empty($title)): ?>
							<<?php echo tag_escape($heading_tag); ?> class="link-btn mb-0">
								<?php echo wp_kses_post($title); ?>
							</<?php echo tag_escape($heading_tag); ?>>
						<?php endif; ?>

						<?php if (!empty($description)): ?>
							<div class="card-description text-small">
								<?php echo wp_kses_post($description); ?>
							</div>
						<?php endif; ?>
					</div>
				</<?php echo tag_escape($tag); ?>>

			<?php endforeach; ?>
		</div>
	</div>
</section>
