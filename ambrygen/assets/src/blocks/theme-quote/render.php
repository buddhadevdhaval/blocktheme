<?php
    /**
 * Render: Theme Quote
 *
 * @param array $attributes Block attributes.
 *
 * @package ambrygen
 */

    defined('ABSPATH') || exit;

    use Ambrygen\Theme\Core\Helper;

    $ambrygen_attributes = is_array($attributes ?? null) ? $attributes : [];

    $ambrygen_block_id          = isset($ambrygen_attributes['blockId']) ? sanitize_html_class($ambrygen_attributes['blockId']) : '';
    $ambrygen_heading           = $ambrygen_attributes['heading'] ?? '';
    $ambrygen_heading_tag       = Helper::get_heading_tag($ambrygen_attributes['headingTag'] ?? 'h2', 'h2');
    $ambrygen_description       = $ambrygen_attributes['description'] ?? '';
    $ambrygen_quote_attribution = $ambrygen_attributes['quoteAttribution'] ?? '';
    $ambrygen_has_heading       = '' !== trim(wp_strip_all_tags($ambrygen_heading));
    $ambrygen_has_attribution   = '' !== trim(wp_strip_all_tags($ambrygen_quote_attribution));
    $ambrygen_has_description   = '' !== trim(wp_strip_all_tags($ambrygen_description));
    $ambrygen_heading_id        = '';
    $ambrygen_description_id    = $ambrygen_has_description && $ambrygen_block_id ? $ambrygen_block_id . '-desc' : '';
    if ($ambrygen_has_heading) {
    if ($ambrygen_block_id) {
        $ambrygen_heading_id = $ambrygen_block_id . '-heading';
    } elseif (isset($block) && isset($block->parsed_block['id'])) {
        $ambrygen_heading_id = 'theme-quote-heading-' . substr(md5($block->parsed_block['id']), 0, 8);
    }
    }

    if (! $ambrygen_has_heading && ! $ambrygen_has_attribution && ! $ambrygen_has_description) {
    return;
    }

    $ambrygen_heading_clean           = preg_replace('/\s+style=["\'][^"\']*["\']/i', '', $ambrygen_heading);
    $ambrygen_description_clean       = preg_replace('/\s+style=["\'][^"\']*["\']/i', '', $ambrygen_description);
    $ambrygen_quote_attribution_clean = preg_replace('/\s+style=["\'][^"\']*["\']/i', '', $ambrygen_quote_attribution);

    $ambrygen_wrapper_attributes_array = [
    'class' => 'theme-quote',
    'role'  => 'region',
    ];

    if ($ambrygen_block_id) {
    $ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
    }

    if ($ambrygen_heading_id) {
    $ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_heading_id;
    } else {
    $ambrygen_wrapper_attributes_array['aria-label'] = esc_attr__('Theme quote', 'ambrygen-web');
    }

    $ambrygen_wrapper_attributes = get_block_wrapper_attributes($ambrygen_wrapper_attributes_array);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<div class="theme-quote__header block__rowflex">
		<?php if ($ambrygen_has_heading || $ambrygen_has_attribution): ?>
			<div class='block__rowflex--col-left'>
			<div class="block__rowflex--heading-title theme-quote__header-quote">
				<?php if ($ambrygen_has_heading): ?>
					<<?php echo tag_escape($ambrygen_heading_tag); ?>
						id="<?php echo esc_attr($ambrygen_heading_id); ?>"
						<?php if ($ambrygen_description_id): ?>
							aria-describedby="<?php echo esc_attr($ambrygen_description_id); ?>"
						<?php endif; ?>
						class="heading-4 mb-0 js-gsap-fade theme-quote__quote-text">
						<?php echo wp_kses($ambrygen_heading_clean, Helper::allowed_heading_html()); ?>
					</<?php echo tag_escape($ambrygen_heading_tag); ?>>
				<?php endif; ?>

				<?php if ($ambrygen_has_heading && $ambrygen_has_attribution): ?>
					<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ($ambrygen_has_attribution): ?>
					<div class="body2-reg theme-quote__quote-attribution">
						<?php echo wp_kses_post($ambrygen_quote_attribution_clean); ?>
					</div>
				<?php endif; ?>
			</div>
			</div>
		<?php endif; ?>

		<?php if ($ambrygen_has_description): ?>
			<div
				<?php if ($ambrygen_description_id): ?>
					id="<?php echo esc_attr($ambrygen_description_id); ?>"
				<?php endif; ?>
				class="block__rowflex--block-content subtitle1 js-gsap-fade theme-quote__header-description">
				<?php echo wp_kses_post($ambrygen_description_clean); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
