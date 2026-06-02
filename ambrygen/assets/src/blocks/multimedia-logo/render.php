<?php
    /**
 * Render: Logo Section Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

    defined('ABSPATH') || exit;

    use Ambrygen\Theme\Core\Helper;

    $ambrygen_attributes  = is_array($attributes) ? $attributes : [];
    $ambrygen_anchor      = isset($ambrygen_attributes['anchor']) ? sanitize_html_class($ambrygen_attributes['anchor']) : '';
    $ambrygen_block_id    = isset($ambrygen_attributes['blockId']) ? sanitize_html_class($ambrygen_attributes['blockId']) : '';
    $ambrygen_section     = isset($ambrygen_attributes['sectionTitle']) ? $ambrygen_attributes['sectionTitle'] : '';
    $ambrygen_heading_tag = Helper::get_heading_tag(
    $ambrygen_attributes['headingTag'] ?? 'h2',
    'h2'
    );
    $ambrygen_logo_id   = absint($ambrygen_attributes['logoImageId'] ?? 0);
    $ambrygen_logo_url  = isset($ambrygen_attributes['logoImageUrl']) ? esc_url_raw($ambrygen_attributes['logoImageUrl']) : '';
    $ambrygen_logo_alt  = isset($ambrygen_attributes['logoImageAlt']) ? sanitize_text_field($ambrygen_attributes['logoImageAlt']) : '';
    $ambrygen_downloads = is_array($ambrygen_attributes['downloads'] ?? null)
    ? $ambrygen_attributes['downloads']
    : [];
    $ambrygen_second_id     = absint($ambrygen_attributes['secondaryImageId'] ?? 0);
    $ambrygen_second_url    = isset($ambrygen_attributes['secondaryImageUrl']) ? esc_url_raw($ambrygen_attributes['secondaryImageUrl']) : '';
    $ambrygen_second_alt    = isset($ambrygen_attributes['secondaryImageAlt']) ? sanitize_text_field($ambrygen_attributes['secondaryImageAlt']) : '';
    $ambrygen_description   = $ambrygen_attributes['description'] ?? '';
    $ambrygen_inner_content = trim($content ?? '');
    $ambrygen_has_second    = $ambrygen_second_id || '' !== $ambrygen_second_url;
    $ambrygen_has_content   = '' !== $ambrygen_inner_content || '' !== $ambrygen_description;
    $ambrygen_has_heading   = '' !== trim(wp_strip_all_tags($ambrygen_section));
    $ambrygen_heading_id    = wp_unique_id('logo-section-heading-');

    $ambrygen_downloads = array_values(
    array_filter(
        $ambrygen_downloads,
        static function ($ambrygen_item) {
            return ! empty($ambrygen_item['fileUrl']);
        }
    )
    );

    $ambrygen_downloads_web = array_values(
    array_filter(
        $ambrygen_downloads,
        static function ($ambrygen_item) {
            return ($ambrygen_item['group'] ?? '') === 'web';
        }
    )
    );

    $ambrygen_downloads_print = array_values(
    array_filter(
        $ambrygen_downloads,
        static function ($ambrygen_item) {
            return ($ambrygen_item['group'] ?? '') === 'print';
        }
    )
    );

    $ambrygen_wrapper_attributes_array = [
    'class' => 'logo-section block-layout',
    'role'  => 'region',
    ];

    if ($ambrygen_anchor || $ambrygen_block_id) {
    $ambrygen_wrapper_attributes_array['id'] = $ambrygen_anchor ? $ambrygen_anchor : $ambrygen_block_id;
    }

    if ($ambrygen_has_heading) {
    $ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_heading_id;
    } else {
    $ambrygen_wrapper_attributes_array['aria-label'] = __('Multimedia logo', 'ambrygen-web');
    }

    $ambrygen_wrapper_attributes = get_block_wrapper_attributes($ambrygen_wrapper_attributes_array);
?>

<div <?php echo wp_kses_post($ambrygen_wrapper_attributes); ?>>
	<?php if ($ambrygen_section): ?>
		<div class="logo-section__header">
			<<?php echo tag_escape($ambrygen_heading_tag); ?> id="<?php echo esc_attr($ambrygen_heading_id); ?>" class="logo-section__title heading-3 mb-0 js-gsap-fade">
				<?php echo wp_kses($ambrygen_section, Helper::allowed_heading_html()); ?>
			</<?php echo tag_escape($ambrygen_heading_tag); ?>>
		</div>
	<?php endif; ?>

	<?php if ($ambrygen_has_heading): ?>
		<div class="is-style-gl-s50" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="logo-section__top">
		<div class="logo-section__logo js-gsap-fade">
			<?php
                // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
                echo Helper::image_from_source(
                    $ambrygen_logo_id,
                    $ambrygen_logo_url,
                    'full',
                    [
                        'loading' => 'lazy',
                        'alt'     => $ambrygen_logo_alt,
                    ],
                    true
                );
                // phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
            ?>
		</div>

		<div class="logo-section__downloads">
			<div class="logo-section__downloads-group js-gsap-fade">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e('For Web', 'ambrygen-web'); ?>
				</div>

				<div class="logo-section__downloads-list">
					<?php foreach ($ambrygen_downloads_web as $ambrygen_item): ?>
						<?php
                            $ambrygen_file_url   = isset($ambrygen_item['fileUrl']) ? esc_url_raw($ambrygen_item['fileUrl']) : '';
                            $ambrygen_label      = isset($ambrygen_item['label']) ? sanitize_text_field($ambrygen_item['label']) : '';
                            $ambrygen_group_name = isset($ambrygen_item['groupName']) ? sanitize_text_field($ambrygen_item['groupName']) : '';
                            $ambrygen_link_text  = $ambrygen_label ? $ambrygen_label : __('Download file', 'ambrygen-web');
                        ?>
						<?php if ($ambrygen_file_url): ?>
						<div class="logo-section__downloads-item with-icon">
							<a
								class="logo-section__downloads-link text-small"
								href="<?php echo esc_url($ambrygen_file_url); ?>"
								download
							>
								<?php echo esc_html($ambrygen_link_text); ?>
							</a>
						</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>

			</div>

			<div class="logo-section__downloads-group js-gsap-fade">
				<div class="logo-section__downloads-title subtitle2-sbold">
					<?php esc_html_e('For Print', 'ambrygen-web'); ?>
				</div>
            <div class="logo-section__downloads-list">
					<?php foreach ($ambrygen_downloads_print as $ambrygen_item): ?>
						<?php
                            $ambrygen_file_url   = isset($ambrygen_item['fileUrl']) ? esc_url_raw($ambrygen_item['fileUrl']) : '';
                            $ambrygen_label      = isset($ambrygen_item['label']) ? sanitize_text_field($ambrygen_item['label']) : '';
                            $ambrygen_group_name = isset($ambrygen_item['groupName']) ? sanitize_text_field($ambrygen_item['groupName']) : '';
                            $ambrygen_link_text  = $ambrygen_label ? $ambrygen_label : __('Download file', 'ambrygen-web');
                        ?>
						<?php if ($ambrygen_file_url): ?>
							
								<?php if ($ambrygen_group_name): ?>
									<div class="logo-section__downloads-group-name">
										<?php echo esc_html($ambrygen_group_name); ?>
									</div>
								<?php endif; ?>
								<div class="logo-section__downloads-item with-icon">
									<a
										class="logo-section__downloads-link text-small"
										href="<?php echo esc_url($ambrygen_file_url); ?>"
										download
									>
										<?php echo esc_html($ambrygen_link_text); ?>
									</a>
								</div>
						
						<?php endif; ?>
					<?php endforeach; ?>
                    	</div>

			</div>
		</div>
	</div>

	<?php if ($ambrygen_has_second || $ambrygen_has_content): ?>
		<div class="logo-section__divider" aria-hidden="true"></div>

		<div class="logo-section__bottom">
			<?php if ($ambrygen_has_second): ?>
				<div class="logo-section__left">
					<div class="logo-section__guideline-item">
						<div class="logo-section__guideline-images js-gsap-fade">
							<?php
                                if ($ambrygen_second_id || $ambrygen_second_url) {
                                    // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
                                    echo Helper::image_from_source(
                                        $ambrygen_second_id,
                                        $ambrygen_second_url,
                                        'full',
                                        [
                                            'loading' => 'lazy',
                                            'alt'     => $ambrygen_second_alt,
                                        ]
                                    );
                                    // phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
                                }
                            ?>
						</div>
					</div>
				</div>
			<?php endif; ?>

			<?php if ($ambrygen_has_content): ?>
				<div class="logo-section__right">
					<div class="logo-section__right-content">
						<?php if ('' !== $ambrygen_inner_content): ?>
							<div class="logo-section__description js-gsap-fade">
								<?php echo $ambrygen_inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</div>
						<?php elseif ($ambrygen_description): ?>
							<div class="logo-section__description js-gsap-fade">
								<?php echo wp_kses_post($ambrygen_description); ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>
