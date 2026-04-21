<?php
/**
 * Render: Ordering Options Block
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

$ambrygen_heading_text = $ambrygen_attributes['headingText'] ?? '';
$ambrygen_heading = trim($ambrygen_heading_text);
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_subtitle = $ambrygen_attributes['subtitle'] ?? '';
$ambrygen_eyebrow = $ambrygen_attributes['eyebrow'] ?? '';

$ambrygen_options = is_array($ambrygen_attributes['options'] ?? null) ? $ambrygen_attributes['options'] : array();
$ambrygen_cards_content = trim($content);
$ambrygen_block_id = !empty($ambrygen_attributes['blockId'])
	? sanitize_html_class($ambrygen_attributes['blockId'])
	: wp_unique_id('ordering-options-');

$ambrygen_allowed_heading_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6');

if (!in_array($ambrygen_heading_level, $ambrygen_allowed_heading_tags, true)) {
	$ambrygen_heading_level = 'h2';
}

$ambrygen_heading_id = '';

if (!empty($ambrygen_heading)) {
	$ambrygen_heading_id = $ambrygen_block_id . '-title';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id' => $ambrygen_block_id,
		'class' => 'block-layout ordering-options',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php if ($ambrygen_heading_id): ?> aria-labelledby="<?php echo esc_attr($ambrygen_heading_id); ?>" <?php else: ?>
		aria-label="<?php echo esc_attr__('Ordering options', 'ambrygen-web'); ?>" <?php endif; ?>>
	<?php if ($ambrygen_heading || $ambrygen_subtitle || $ambrygen_eyebrow): ?>
		<div class="ordering-options__header">
			<?php if ($ambrygen_eyebrow): ?>
				<div class="hero-kicker ordering-options__eyebrow">
					<?php echo wp_kses_post($ambrygen_eyebrow); ?>
				</div>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ($ambrygen_heading): ?>
				<<?php echo tag_escape($ambrygen_heading_level); ?>
					<?php if ($ambrygen_heading_id): ?>
						id="<?php echo esc_attr($ambrygen_heading_id); ?>"
					<?php endif; ?>
					class="heading-4 block-title mb-0"
					>
					<?php echo wp_kses_post($ambrygen_heading); ?>
				</<?php echo tag_escape($ambrygen_heading_level); ?>>
			<?php endif; ?>

			<?php if ($ambrygen_subtitle): ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<div class="body1 ordering-options__subtitle">
					<?php echo wp_kses_post($ambrygen_subtitle); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s24" aria-hidden="true"></div>
	<?php endif; ?>

	<?php if ($ambrygen_cards_content || !empty($ambrygen_options)): ?>
		<div class="ordering-options__cards">
			<?php if ($ambrygen_cards_content): ?>
				<?php echo $ambrygen_cards_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php else: ?>
				<?php foreach ($ambrygen_options as $ambrygen_option): ?>
					<?php
					$ambrygen_image_id = absint($ambrygen_option['imageId'] ?? 0);
					$ambrygen_image_url = $ambrygen_option['imageUrl'] ?? '';
					$ambrygen_image_alt = $ambrygen_option['imageAlt'] ?? '';
					$ambrygen_title = $ambrygen_option['title'] ?? '';
					$ambrygen_option_subtitle = $ambrygen_option['subtitle'] ?? '';
					$ambrygen_items = is_array($ambrygen_option['items'] ?? null) ? $ambrygen_option['items'] : array();
					$ambrygen_footnote = $ambrygen_option['footnote'] ?? '';
					$ambrygen_cta = is_array($ambrygen_option['cta'] ?? null) ? $ambrygen_option['cta'] : array();
					$ambrygen_cta_text = $ambrygen_cta['text'] ?? '';
					$ambrygen_cta_url = $ambrygen_cta['url'] ?? '';
					$ambrygen_cta_target = $ambrygen_cta['target'] ?? '';
					$ambrygen_cta_rel = $ambrygen_cta['rel'] ?? '';
					$ambrygen_cta_rel_parts = $ambrygen_cta_rel
						? array_filter(array_unique(explode(' ', $ambrygen_cta_rel)))
						: array();

					if ('_blank' === $ambrygen_cta_target) {
						$ambrygen_cta_rel_parts = array_unique(
							array_merge($ambrygen_cta_rel_parts, array('noopener', 'noreferrer'))
						);
					}

					$ambrygen_cta_rel = implode(' ', $ambrygen_cta_rel_parts);
					?>
					<div class="ordering-options__card">

						<?php if ($ambrygen_image_id): ?>
							<div class="ordering-options__card-image">
								<?php
								echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
									$ambrygen_image_id,
									'large',
									array(
										'alt' => esc_attr($ambrygen_image_alt),
										'loading' => 'lazy',
									)
								);
								?>
							</div>
						<?php endif; ?>


						<div class="ordering-options__card-body">
							<div class="ordering-options__card-content">
								<?php if ($ambrygen_title): ?>
									<h3 class="heading-5 ordering-options__card-title mb-0">
										<?php echo wp_kses_post($ambrygen_title); ?>
									</h3>
								<?php endif; ?>

								<?php if ($ambrygen_option_subtitle): ?>
									<div class="subtitle2-sbold ordering-options__card-subtitle">
										<?php echo wp_kses_post($ambrygen_option_subtitle); ?>
									</div>
								<?php endif; ?>

								<?php if (!empty($ambrygen_items)): ?>
									<div class="is-style-gl-s16" aria-hidden="true"></div>
									<ul class="body1 ordering-options__card-list">
										<?php foreach ($ambrygen_items as $ambrygen_item): ?>
											<?php if (!empty($ambrygen_item['text'])): ?>
												<li><?php echo wp_kses_post($ambrygen_item['text']); ?></li>
											<?php endif; ?>
										<?php endforeach; ?>
									</ul>
								<?php endif; ?>

								<?php if ($ambrygen_footnote): ?>
									<div class="is-style-gl-s16" aria-hidden="true"></div>
									<div class="body-2-regular ordering-options__card-footnote">
										<?php echo wp_kses_post($ambrygen_footnote); ?>
									</div>
								<?php endif; ?>
							</div>

							<?php if ($ambrygen_cta_text && $ambrygen_cta_url): ?>
								<div class="is-style-gl-s24" aria-hidden="true"></div>
								<div class="ordering-options__card-cta">
									<a href="<?php echo esc_url($ambrygen_cta_url); ?>" class="site-btn is-style-site-trailing-icon"
										<?php if (!empty($ambrygen_cta_target)): ?>
											target="<?php echo esc_attr($ambrygen_cta_target); ?>" <?php endif; ?> 				<?php if (!empty($ambrygen_cta_rel)): ?> rel="<?php echo esc_attr($ambrygen_cta_rel); ?>" <?php endif; ?>>
										<?php echo esc_html($ambrygen_cta_text); ?>
										<?php if ('_blank' === $ambrygen_cta_target): ?>
											<span class="screen-reader-text">
												<?php echo esc_html__('(opens in new tab)', 'ambrygen-web'); ?>
											</span>
										<?php endif; ?>
									</a>
								</div>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>