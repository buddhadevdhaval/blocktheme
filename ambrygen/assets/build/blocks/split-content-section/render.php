<?php
/**
 * Render: heading Content Section Block
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

$ambrygen_block_id = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title = $ambrygen_attributes['title'] ?? '';
$ambrygen_title_tag = $ambrygen_attributes['titleTag'] ?? 'h2';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_primary_button = $ambrygen_attributes['primarybutton'] ?? array();
$ambrygen_secondary_button = $ambrygen_attributes['secondarybutton'] ?? array();
$ambrygen_is_medium = $ambrygen_attributes['isMediumText'] ?? false;

$ambrygen_allowed_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
$ambrygen_title_tag = in_array($ambrygen_title_tag, $ambrygen_allowed_tags, true)
	? $ambrygen_title_tag
	: 'h2';

$ambrygen_background_image_id = isset($ambrygen_attributes['backgroundImageId']) ? absint($ambrygen_attributes['backgroundImageId']) : 0;

$ambrygen_primary_button_text = $ambrygen_primary_button['text'] ?? '';
$ambrygen_primary_button_url = $ambrygen_primary_button['url'] ?? '#';
$ambrygen_primary_button_target = $ambrygen_primary_button['target'] ?? '';
$ambrygen_primary_button_variant = $ambrygen_primary_button['variant'] ?? '';

$ambrygen_secondary_button_text = $ambrygen_secondary_button['text'] ?? '';
$ambrygen_secondary_button_url = $ambrygen_secondary_button['url'] ?? '#';
$ambrygen_secondary_button_target = $ambrygen_secondary_button['target'] ?? '';
$ambrygen_secondary_button_variant = $ambrygen_secondary_button['variant'] ?? '';

$ambrygen_wrapper_attributes_array = array(
	'class' => 'heading-content-section wp-block-ambrygen-split-content-section' . ($ambrygen_is_medium ? ' variation-medium-text' : ''),
);

if ($ambrygen_block_id) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes($ambrygen_wrapper_attributes_array);

$ambrygen_richtext_allowed = array(
	'span' => array(
		'class' => true,
		'data-tooltip' => true,
		'data-tooltip-title' => true,
	),
	'div' => array(
		'class' => true,
	),
	'mark' => array(
		'class' => true,
		'style' => true,
	),
	'br' => array(),
	'strong' => array(),
	'em' => array(),
	'a' => array(
		'href' => true,
		'title' => true,
		'target' => true,
		'rel' => true,
		'class' => true,
	),
);
?>

<div <?php echo wp_kses_post($ambrygen_wrapper_attributes); ?>>
	<?php if ($ambrygen_background_image_id): ?>
		<div class="block-bg-image">
			<?php
			echo wp_kses_post(
				Helper::image(
					$ambrygen_background_image_id,
					'medium'
				)
			);
			?>
		</div>
	<?php endif; ?>
	<div class="heading-content-section__inner block__rowflex">
		<?php if (!empty($ambrygen_title)): ?>
			<<?php echo esc_attr($ambrygen_title_tag); ?> class="heading-content-section__title heading-3 block-title mb-0
				block__rowflex--heading-title js-gsap-fade">
				<?php
				echo wp_kses($ambrygen_title, $ambrygen_richtext_allowed);
				?>
			</<?php echo esc_attr($ambrygen_title_tag); ?>>
		<?php endif; ?>

		<div class="heading-content-wrapper">
			<?php if (!empty($ambrygen_description)): ?>
				<div
					class="heading-content-section__description block__rowflex--block-content block-description js-gsap-fade">
					<?php echo wp_kses($ambrygen_description, $ambrygen_richtext_allowed); ?>
				</div>

			<?php endif; ?>

			<?php if (trim($content)): ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="heading-content-section__content js-gsap-fade">
					<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ($ambrygen_primary_button_text || $ambrygen_secondary_button_text): ?>
			<div class="heading-content-section__actions js-gsap-fade">
				<?php if ($ambrygen_primary_button_text): ?>
					<a href="<?php echo esc_url($ambrygen_primary_button_url); ?>"
						class="site-btn <?php echo esc_attr($ambrygen_primary_button_variant); ?>" <?php echo !empty($ambrygen_primary_button_target) ? 'target="' . esc_attr($ambrygen_primary_button_target) . '"' : ''; ?> 		<?php echo '_blank' === $ambrygen_primary_button_target ? ' rel="noopener noreferrer"' : ''; ?>>
						<?php echo esc_html($ambrygen_primary_button_text); ?>
					</a>
				<?php endif; ?>

				<?php if ($ambrygen_secondary_button_text): ?>
					<a href="<?php echo esc_url($ambrygen_secondary_button_url); ?>"
						class="site-btn <?php echo esc_attr($ambrygen_secondary_button_variant); ?>" <?php echo !empty($ambrygen_secondary_button_target) ? 'target="' . esc_attr($ambrygen_secondary_button_target) . '"' : ''; ?> 		<?php echo '_blank' === $ambrygen_secondary_button_target ? ' rel="noopener noreferrer"' : ''; ?>>
						<?php echo esc_html($ambrygen_secondary_button_text); ?>
					</a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>