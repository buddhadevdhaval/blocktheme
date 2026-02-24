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
use Ambrygen\Theme\Core\Helper;

/**
 * Access attributes safely with default values.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Block inner content.
 */
$ambrygen_attributes = isset($attributes) && is_array($attributes) ? $attributes : array();
$ambrygen_content = isset($content) ? $content : '';


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
$ambrygen_mainImageid = isset($ambrygen_attributes['mainImageid']) ? $ambrygen_attributes['mainImageid'] : array();
$ambrygen_secondary_image = isset($ambrygen_attributes['secondaryImage']) ? $ambrygen_attributes['secondaryImage'] : '';
$ambrygen_secondaryImageid = isset($ambrygen_attributes['secondaryImageId']) ? $ambrygen_attributes['secondaryImageId'] : null;
$ambrygen_overlay_image = isset($ambrygen_attributes['overlayImage']) ? $ambrygen_attributes['overlayImage'] : '';
$ambrygen_overlayImageid = isset($ambrygen_attributes['overlayImageId']) ? $ambrygen_attributes['overlayImageId'] : null;


/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-ambrygen-testimonials ambry-testimonials testimonials-slider',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<!-- Overlay Graphics -->
	<div class="ambry-testimonials__graphic-images">

		<?php if (!empty($ambrygen_overlayImageid)): ?>
			<div class="ambry-testimonials__graphic-images__overlay-left ambry-testimonials__graphic-images__img-block">
					<?php
					echo Helper::image(
					$ambrygen_overlayImageid,
						'large',
						array(
							'class'    => 'overlay__img',
							'loading'  => 'lazy',
							'alt='=> 'logo',
						)
					); 
					

					?>
			</div>
		<?php endif; ?>

		<?php if (!empty($ambrygen_secondaryImageid)): ?>
			<div class="ambry-testimonials__graphic-images__overlay-right ambry-testimonials__graphic-images__img-block">
					<?php
					echo Helper::image(
				$ambrygen_secondaryImageid,
						'large',
						array(
							'class'    => 'overlay__img',
							'loading'  => 'lazy',
						)
					); 

					?>
					
			</div>
		<?php endif; ?>

	</div>

	<!-- Heading -->
	<<?php echo tag_escape($ambrygen_heading_tag); ?> class="ambry-testimonials__heading heading-3 mb-0">
		<?php 
			echo wp_kses(
				$ambrygen_heading,
				Helper::allowed_heading_html()
				);
				?>
	</<?php echo tag_escape($ambrygen_heading_tag); ?>>

	<div class="is-style-gl-s32"></div>

	<!-- Layout -->
	<div class="ambry-testimonials__layout">
		<div class="ambry-testimonials__grid">

			<div class="testimonial_slider swiper">
				<div class="swiper-wrapper">
					<?php
					// InnerBlocks output (trusted block HTML).
					echo $ambrygen_content;
					?>
				</div>
				<div class="swiper-buttons">
					<div class="custom-prev">
					</div>
					<div class="custom-next">
					</div>
				</div>
			</div>

		</div>
	</div>

</div>
