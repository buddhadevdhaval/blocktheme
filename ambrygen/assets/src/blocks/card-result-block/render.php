<?php
/**
 * Render: Card Result Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if (!defined('ABSPATH')) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array($attributes ?? null) ? $attributes : array();
$ambrygen_block_id = isset($ambrygen_attributes['blockId']) ? $ambrygen_attributes['blockId'] : '';
$ambrygen_eyebrow = isset($ambrygen_attributes['eyebrowText']) ? $ambrygen_attributes['eyebrowText'] : '';
$ambrygen_heading = isset($ambrygen_attributes['heading']) ? $ambrygen_attributes['heading'] : '';
$ambrygen_heading_tag = isset($ambrygen_attributes['headingTag']) ? $ambrygen_attributes['headingTag'] : 'h2';
$ambrygen_subtitle = isset($ambrygen_attributes['subtitle']) ? $ambrygen_attributes['subtitle'] : '';
$ambrygen_foot_content = isset($ambrygen_attributes['footContent']) ? $ambrygen_attributes['footContent'] : '';

$ambrygen_heading_tag = in_array($ambrygen_heading_tag, array('h1', 'h2', 'h3', 'h4', 'h5', 'h6'), true) ? $ambrygen_heading_tag : 'h2';
$ambrygen_item_count = 0;

if (isset($block->inner_blocks) && is_array($block->inner_blocks)) {
	foreach ($block->inner_blocks as $ambrygen_inner_block) {
		if (
			isset($ambrygen_inner_block->name) &&
			'ambrygen/card-result-block-item' === $ambrygen_inner_block->name
		) {
			++$ambrygen_item_count;
		}
	}
}

$ambrygen_wrapper_attributes_array = array(
	'class' => 'block-layout card-result-block',
);

if ($ambrygen_block_id) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes($ambrygen_wrapper_attributes_array);
$ambrygen_grid_class = $ambrygen_item_count >= 4
	? 'principles-steps__grid col-4'
	: 'principles-steps__grid';
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="principles-steps">
		<div class="principles-steps__header text-center">
			<?php if ('' !== $ambrygen_eyebrow): ?>
				<div class="overline-text principles-steps__eyebrow hero-kicker">
					<?php echo wp_kses_post($ambrygen_eyebrow); ?>
				</div>
			<?php endif; ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php if ('' !== $ambrygen_heading): ?>
				<<?php echo esc_html($ambrygen_heading_tag); ?> class="heading-4 block-title mb-0 principles-steps__title">
					<?php echo wp_kses($ambrygen_heading, Helper::allowed_heading_html()); ?>
				</<?php echo esc_html($ambrygen_heading_tag); ?>>
			<?php endif; ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php if ('' !== $ambrygen_subtitle): ?>
				<div class="block-description body1 principles-steps__subtitle">
					<?php echo wp_kses_post($ambrygen_subtitle); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>

		<div class="<?php echo esc_attr($ambrygen_grid_class); ?>">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

		<?php if ('' !== $ambrygen_foot_content): ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
			<div class="foot-content text-center">
					<?php echo wp_kses_post($ambrygen_foot_content); ?>
			</div>
		<?php endif; ?>
	</div>
</div>