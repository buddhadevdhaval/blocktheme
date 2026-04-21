<?php
/**
 * Render: Three Column Image Grid Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined('ABSPATH') || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? array();
$ambrygen_eyebrow = $ambrygen_attributes['eyebrow'] ?? '';
$ambrygen_heading = $ambrygen_attributes['heading'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_variation = $ambrygen_attributes['variation'] ?? 'default';
$ambrygen_block_id = $ambrygen_attributes['blockId'] ?? wp_unique_id('three-column-grid-');
$ambrygen_is_header_vertical = $ambrygen_attributes['isHeaderVertical'] ?? false;

$ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_allowed_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
$ambrygen_allowed_variations = array('default', 'variation-three');
$ambrygen_heading_tag = in_array($ambrygen_heading_tag, $ambrygen_allowed_tags, true) ? $ambrygen_heading_tag : 'h2';
$ambrygen_variation = in_array($ambrygen_variation, $ambrygen_allowed_variations, true) ? $ambrygen_variation : 'default';
$ambrygen_variation_class = 'default' !== $ambrygen_variation ? sanitize_html_class($ambrygen_variation) : '';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id' => $ambrygen_block_id,
		'class' => trim('block-layout our-approach ' . $ambrygen_variation_class),
	)
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div
		class="our-approach__header block__rowflex is-<?php echo $ambrygen_is_header_vertical ? 'vertical' : 'horizontal'; ?>">

		<div class="block-title mb-0 block__rowflex--heading-title js-gsap-fade our-approach__header__left">
			<?php if ($ambrygen_eyebrow): ?>
				<div class="hero-kicker js-gsap-fade">
					<?php echo wp_kses_post($ambrygen_eyebrow); ?>
				</div>
			<?php endif; ?>

			<?php if ($ambrygen_eyebrow || $ambrygen_heading): ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ($ambrygen_heading): ?>
				<<?php echo tag_escape($ambrygen_heading_tag); ?> class="heading-3 block-title mb-0 ">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape($ambrygen_heading_tag); ?>>
			<?php endif; ?>
		</div>

		<?php if ($ambrygen_description): ?>
			<div class="heading-content-wrapper">
				<div class="block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php echo wp_kses_post($ambrygen_description); ?>
				</div>
			</div>
		<?php endif; ?>

	</div>

	<?php if ($ambrygen_heading || $ambrygen_description): ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="our-approach__content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>

</div>