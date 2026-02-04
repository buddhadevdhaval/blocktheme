<?php
/**
 * Render template for the Testimonials block.
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
 * @var array  $attributes Block attributes.
 * @var string $content    Block inner content.
 */
$ambrygen_attributes = isset($attributes) && is_array($attributes) ? $attributes : array();
$ambrygen_content = isset($content) ? $content : '';

/**
 * Helper to build srcset string.
 *
 * @param array $sizes Image sizes.
 * @return string
 */
if (!function_exists('ambrygen_testimonials_build_srcset')) {
	function ambrygen_testimonials_build_srcset($sizes)
	{
		if (empty($sizes) || !is_array($sizes)) {
			return '';
		}

		$srcset = array();

		foreach ($sizes as $size) {
			if (isset($size['url'], $size['width'])) {
				$srcset[] = esc_url($size['url']) . ' ' . absint($size['width']) . 'w';
			}
		}

		return implode(', ', $srcset);
	}
}

/**
 * Retrieve attributes with defaults.
 */
$ambrygen_heading = isset($ambrygen_attributes['heading'])
	? $ambrygen_attributes['heading']
	: __('Read About Ambry’s Impact on Patient Lives', 'ambrygen-web');

$ambrygen_heading_tag = isset($ambrygen_attributes['headingTag'])
	? $ambrygen_attributes['headingTag']
	: 'h2';

if (!in_array($ambrygen_heading_tag, array('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'), true)) {
	$ambrygen_heading_tag = 'h2';
}

$ambrygen_main_image = isset($ambrygen_attributes['mainImage']) ? $ambrygen_attributes['mainImage'] : '';
$ambrygen_main_image_sizes = isset($ambrygen_attributes['mainImageSizes']) ? $ambrygen_attributes['mainImageSizes'] : array();
$ambrygen_secondary_image = isset($ambrygen_attributes['secondaryImage']) ? $ambrygen_attributes['secondaryImage'] : '';
$ambrygen_secondary_sizes = isset($ambrygen_attributes['secondaryImageSizes']) ? $ambrygen_attributes['secondaryImageSizes'] : array();
$ambrygen_overlay_image = isset($ambrygen_attributes['overlayImage']) ? $ambrygen_attributes['overlayImage'] : '';
$ambrygen_overlay_sizes = isset($ambrygen_attributes['overlayImageSizes']) ? $ambrygen_attributes['overlayImageSizes'] : array();

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-ambrygen-testimonials ambry-testimonials',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<!-- Overlay Graphics -->
	<div class="ambry-testimonials__graphic-images">

		<?php if (!empty($ambrygen_overlay_image)): ?>
			<div class="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
				<img src="<?php echo esc_url($ambrygen_overlay_image); ?>"
					srcset="<?php echo esc_attr(ambrygen_testimonials_build_srcset($ambrygen_overlay_sizes)); ?>"
					class="overlay__img" alt="" loading="lazy" decoding="async" />
			</div>
		<?php endif; ?>

		<?php if (!empty($ambrygen_secondary_image)): ?>
			<div class="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
				<img src="<?php echo esc_url($ambrygen_secondary_image); ?>"
					srcset="<?php echo esc_attr(ambrygen_testimonials_build_srcset($ambrygen_secondary_sizes)); ?>"
					class="overlay__img" alt="" loading="lazy" decoding="async" />
			</div>
		<?php endif; ?>

	</div>

	<!-- Heading -->
	<<?php echo tag_escape($ambrygen_heading_tag); ?> class="ambry-testimonials__heading heading-3 mb-0">
		<?php echo wp_kses_post($ambrygen_heading); ?>
	</<?php echo tag_escape($ambrygen_heading_tag); ?>>

	<div class="is-style-gl-s32"></div>

	<!-- Layout -->
	<div class="ambry-testimonials__layout">
		<div class="ambry-testimonials__grid">

			<?php if (!empty($ambrygen_main_image)): ?>
				<div class="ambry-testimonials__top-inner__image-block">
					<img src="<?php echo esc_url($ambrygen_main_image); ?>"
						srcset="<?php echo esc_attr(ambrygen_testimonials_build_srcset($ambrygen_main_image_sizes)); ?>"
						class="ambry-testimonials__main-image" alt="" loading="lazy" decoding="async" />
				</div>
			<?php endif; ?>

			<?php
			// InnerBlocks output (trusted block HTML).
			echo wp_kses_post($ambrygen_content);
			?>

		</div>
	</div>

</div>