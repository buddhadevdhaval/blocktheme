<?php
/**
 * Render template for the Newsletter Form block.
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
 * Build responsive srcset string.
 *
 * @param array $sizes Image sizes object.
 * @return string
 */
if (!function_exists('ambrygen_newsletter_build_srcset')) {
	function ambrygen_newsletter_build_srcset($sizes)
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
$ambrygen_eyebrow = isset($ambrygen_attributes['eyebrow']) ? $ambrygen_attributes['eyebrow'] : __('Newsletter', 'ambrygen-web');
$ambrygen_heading = isset($ambrygen_attributes['heading']) ? $ambrygen_attributes['heading'] : __('Stay Informed', 'ambrygen-web');
$ambrygen_heading_tag = isset($ambrygen_attributes['headingTag']) ? $ambrygen_attributes['headingTag'] : 'h2';
$ambrygen_description = isset($ambrygen_attributes['description'])
	? $ambrygen_attributes['description']
	: __('Subscribe to the Ambry Newsletter and other updates.', 'ambrygen-web');

$ambrygen_image = isset($ambrygen_attributes['image']) ? $ambrygen_attributes['image'] : '';
$ambrygen_image_alt = isset($ambrygen_attributes['imageAlt']) ? $ambrygen_attributes['imageAlt'] : '';
$ambrygen_image_sizes = isset($ambrygen_attributes['imageSizes']) ? $ambrygen_attributes['imageSizes'] : array();

$ambrygen_overlay_top_image = isset($ambrygen_attributes['overlayTopImage']) ? $ambrygen_attributes['overlayTopImage'] : '';
$ambrygen_overlay_bottom_image = isset($ambrygen_attributes['overlayBottomImage']) ? $ambrygen_attributes['overlayBottomImage'] : '';

/**
 * Validate heading tag.
 */
$ambrygen_valid_heading_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div');

if (!in_array($ambrygen_heading_tag, $ambrygen_valid_heading_tags, true)) {
	$ambrygen_heading_tag = 'h2';
}
?>

<div class="newsletter newsletter-signup">

	<!-- Image Section -->
	<div class="newsletter__image-block">
		<?php if (!empty($ambrygen_image)): ?>
			<img src="<?php echo esc_url($ambrygen_image); ?>"
				srcset="<?php echo esc_attr(ambrygen_newsletter_build_srcset($ambrygen_image_sizes)); ?>"
				sizes="(max-width: 768px) 100vw, 600px"
				alt="<?php echo esc_attr($ambrygen_image_alt ? $ambrygen_image_alt : __('Newsletter image', 'ambrygen-web')); ?>"
				class="newsletter__img" loading="lazy" decoding="async" />
		<?php endif; ?>

		<?php if (!empty($ambrygen_overlay_top_image)): ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-top">
				<img src="<?php echo esc_url($ambrygen_overlay_top_image); ?>"
					alt="<?php esc_attr_e('Overlay top', 'ambrygen-web'); ?>" class="overlay__img" loading="lazy"
					decoding="async" />
			</div>
		<?php endif; ?>

		<?php if (!empty($ambrygen_overlay_bottom_image)): ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-bottom">
				<img src="<?php echo esc_url($ambrygen_overlay_bottom_image); ?>"
					alt="<?php esc_attr_e('Overlay bottom', 'ambrygen-web'); ?>" class="overlay__img" loading="lazy"
					decoding="async" />
			</div>
		<?php endif; ?>
	</div>

	<!-- Content Section -->
	<div class="newsletter__content-block">

		<?php if (!empty($ambrygen_eyebrow)): ?>
			<span class="newsletter__content-block__eyebrow-text eyebrow">
				<?php echo wp_kses_post($ambrygen_eyebrow); ?>
			</span>
		<?php endif; ?>

		<div class="is-style-gl-s12"></div>

		<?php if (!empty($ambrygen_heading)): ?>
			<<?php echo tag_escape($ambrygen_heading_tag); ?> class="newsletter__content-block__heading heading-3 mb-0">
				<?php echo wp_kses_post($ambrygen_heading); ?>
			</<?php echo tag_escape($ambrygen_heading_tag); ?>>
		<?php endif; ?>

		<div class="is-style-gl-s12"></div>

		<?php if (!empty($ambrygen_description)): ?>
			<p class="newsletter__content-block__description-text text-medium">
				<?php echo wp_kses_post($ambrygen_description); ?>
			</p>
		<?php endif; ?>

		<div class="newsletter-form-placeholder">
			<?php
			// InnerBlocks output is already filtered by the block renderer.
			echo wp_kses_post($ambrygen_content);
			?>
		</div>

	</div>
</div>