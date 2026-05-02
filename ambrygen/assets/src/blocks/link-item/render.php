<?php
/**
 * Render: Link Item block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined('ABSPATH') || exit;

$ambrygen_cta = $attributes['cta'] ?? array();
$ambrygen_text = $ambrygen_cta['text'] ?? '';
$ambrygen_url = $ambrygen_cta['url'] ?? '#';
$ambrygen_target = $ambrygen_cta['target'] ?? '';
$ambrygen_rel = $ambrygen_cta['rel'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(array('class' => 'download-list__item'));
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<a class="download-list__item-link" href="<?php echo esc_url($ambrygen_url); ?>" <?php if ($ambrygen_target)
		   echo 'target="' . esc_attr($ambrygen_target) . '"'; ?> <?php if ($ambrygen_rel)
					  echo 'rel="' . esc_attr($ambrygen_rel) . '"'; ?>> <span class="download-list__item-text">
		<?php echo esc_html($ambrygen_text); ?>
		</span>
	</a>
</div>