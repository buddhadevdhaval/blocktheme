<?php
/**
 * Render template for the Genetic Testing Card block.
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
 */
$ambrygen_attributes = isset($attributes) && is_array($attributes) ? $attributes : array();

$ambrygen_image = isset($ambrygen_attributes['image']) ? $ambrygen_attributes['image'] : '';
$ambrygen_image_alt = isset($ambrygen_attributes['imageAlt']) ? $ambrygen_attributes['imageAlt'] : '';
$ambrygen_image_srcset = isset($ambrygen_attributes['imageSrcSet']) ? $ambrygen_attributes['imageSrcSet'] : '';
$ambrygen_image_sizes = isset($ambrygen_attributes['imageSizes']) ? $ambrygen_attributes['imageSizes'] : '';

$ambrygen_title = isset($ambrygen_attributes['title']) ? $ambrygen_attributes['title'] : '';
$ambrygen_description = isset($ambrygen_attributes['description']) ? $ambrygen_attributes['description'] : '';
$ambrygen_link_text = isset($ambrygen_attributes['linkText'])
	? $ambrygen_attributes['linkText']
	: __('Learn more', 'ambrygen-web');
$ambrygen_link_url = isset($ambrygen_attributes['linkUrl']) ? $ambrygen_attributes['linkUrl'] : '';
$ambrygen_type = isset($ambrygen_attributes['type']) ? $ambrygen_attributes['type'] : 'small';

/**
 * Sanitize type to expected values.
 */
$ambrygen_valid_types = array('small', 'main');

if (!in_array($ambrygen_type, $ambrygen_valid_types, true)) {
	$ambrygen_type = 'small';
}

/**
 * Build wrapper classes safely.
 */
$ambrygen_wrapper_class = 'genetic-cards__card genetic-cards__card--' . $ambrygen_type;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $ambrygen_wrapper_class,
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if (!empty($ambrygen_image)): ?>
		<div class="genetic-cards__image-wrapper genetic-cards__image-wrapper--<?php echo esc_attr($ambrygen_type); ?>">
			<img src="<?php echo esc_url($ambrygen_image); ?>" alt="<?php echo esc_attr($ambrygen_image_alt); ?>"
				loading="lazy" <?php if (!empty($ambrygen_image_srcset)): ?>
					srcset="<?php echo esc_attr($ambrygen_image_srcset); ?>" <?php endif; ?> 	<?php if (!empty($ambrygen_image_sizes)): ?> sizes="<?php echo esc_attr($ambrygen_image_sizes); ?>" <?php endif; ?> />
		</div>
	<?php endif; ?>

	<?php
	$ambrygen_content_class = 'genetic-cards__content';

	if ('main' === $ambrygen_type) {
		$ambrygen_content_class .= ' genetic-cards__content--main';
	}
	?>

	<div class="<?php echo esc_attr($ambrygen_content_class); ?>">

		<?php if (!empty($ambrygen_title)): ?>
			<div class="genetic-cards__title heading-6 mb-0">
				<?php echo wp_kses_post($ambrygen_title); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s8"></div>

		<?php if (!empty($ambrygen_description)): ?>
			<div class="genetic-cards__description body1">
				<?php echo wp_kses_post($ambrygen_description); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s20"></div>

		<?php if (!empty($ambrygen_link_text) && !empty($ambrygen_link_url)): ?>
			<div class="genetic-cards__link">
				<a href="<?php echo esc_url($ambrygen_link_url); ?>" class="site-btn is-style-site-text-btn has-icon"
					aria-label="<?php echo esc_attr($ambrygen_link_text); ?>">
					<?php echo esc_html($ambrygen_link_text); ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</div>