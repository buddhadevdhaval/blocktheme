<?php
    /**
 * Render: Genetic Testing Grid
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    $content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

    if (! defined('ABSPATH')) {
    exit;
    }

    use Ambrygen\Theme\Core\Helper;

    $ambrygen_attributes = is_array($attributes) ? $attributes : [];

    $ambrygen_heading_tag = Helper::get_heading_tag($ambrygen_attributes['headingTag'] ?? 'h2', 'h2');
    $ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
    $ambrygen_description = $ambrygen_attributes['description'] ?? '';
    $ambrygen_block_id    = isset($ambrygen_attributes['blockId'])
    ? sanitize_html_class((string) $ambrygen_attributes['blockId'])
    : '';

    $ambrygen_bg_image = is_array($ambrygen_attributes['backgroundImage'] ?? null)
    ? $ambrygen_attributes['backgroundImage']
    : [];
    $ambrygen_bg_image_id = isset($ambrygen_bg_image['id']) ? absint($ambrygen_bg_image['id']) : 0;
    $ambrygen_bg_url      = isset($ambrygen_bg_image['url']) ? esc_url_raw($ambrygen_bg_image['url']) : '';
    $ambrygen_bg_alt      = isset($ambrygen_bg_image['alt']) ? sanitize_text_field($ambrygen_bg_image['alt']) : '';

    $wrapper_args = [
    'class' => 'block-layout',
    ];

    if ($ambrygen_block_id) {
    $wrapper_args['id'] = $ambrygen_block_id;
    }

    $ambrygen_wrapper_attr  = get_block_wrapper_attributes($wrapper_args);
    $ambrygen_selected_tabs = isset($ambrygen_attributes['selectedTabs']) && is_array($ambrygen_attributes['selectedTabs']) && ! empty($ambrygen_attributes['selectedTabs'])
    ? $ambrygen_attributes['selectedTabs']
    : [
    [
        'id'       => '',
        'text'     => 'All Tests',
        'termSlug' => 'all',
    ],
    ];

    $ambrygen_initial_visible_tests = 12;
    $ambrygen_taxonomy              = 'poster_category';
    $ambrygen_tabs_uid              = $ambrygen_block_id ? $ambrygen_block_id : wp_unique_id('genetic-testing-grid-');

    $ambrygen_has_heading = '' !== trim(wp_strip_all_tags($ambrygen_heading));
    $ambrygen_has_desc    = '' !== trim(wp_strip_all_tags($ambrygen_description));
    $ambrygen_has_header  = $ambrygen_has_heading || $ambrygen_has_desc;
?>

<div <?php echo $ambrygen_wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ($ambrygen_bg_image_id || $ambrygen_bg_url): ?>
		<div class="block-bg-image">
			<?php
                // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
                echo Helper::image_from_source(
                    $ambrygen_bg_image_id,
                    $ambrygen_bg_url,
                    'full',
                    [
                        'alt' => $ambrygen_bg_alt,
                    ]
                );
                // phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
            ?>
		</div>
	<?php endif; ?>

	<div class="icon-grid-block">
		<div class="features-tabs">
			<?php if ($ambrygen_has_header): ?>
			<div class="features-tabs__header block__rowflex">
				<?php if (! empty($ambrygen_heading)): ?>
					<div class="block__rowflex--col-left">
						<<?php echo tag_escape($ambrygen_heading_tag); ?> class="heading-2 block-title mb-0 block__rowflex--heading-title js-gsap-fade">
							<?php
								echo wp_kses(
									$ambrygen_heading,
									Helper::allowed_heading_html()
								);
							?>
						</<?php echo tag_escape($ambrygen_heading_tag); ?>>
					</div>
				<?php endif; ?>

				<?php if (! empty($ambrygen_description)): ?>
					<div class="block__rowflex--block-content subtitle-1-regular js-gsap-fade">
						<p><?php echo wp_kses_post($ambrygen_description); ?></p>
					</div>
				<?php endif; ?>
			</div>
			<?php endif; ?>

			<?php if ($ambrygen_has_header): ?>
				<div class="is-style-gl-s50" aria-hidden="true"></div>
			<?php endif; ?>

			<div class="tabs-content bg-gradient1">
				<div class="is-style-gl-s20" aria-hidden="true"></div>
				<div class="tabs__nav" role="tablist" aria-label="<?php esc_attr_e('Testing categories', 'ambrygen-web'); ?>">
					<?php foreach ($ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data): ?>
						<?php
                            $ambrygen_is_active = 0 === $ambrygen_index ? ' is-active' : '';
                            $ambrygen_tab_slug  = isset($ambrygen_tab_data['termSlug']) ? sanitize_title((string) $ambrygen_tab_data['termSlug']) : '';
                            $ambrygen_tab_id    = 'all' === $ambrygen_tab_slug || '' === $ambrygen_tab_slug ? 'all' : $ambrygen_tab_slug;
                            $ambrygen_tab_uid   = $ambrygen_tabs_uid . '-tab-' . $ambrygen_index;
                            $ambrygen_panel_id  = $ambrygen_tabs_uid . '-panel-' . $ambrygen_index . '-' . $ambrygen_tab_id;
                            $ambrygen_tab_text  = isset($ambrygen_tab_data['text']) ? sanitize_text_field($ambrygen_tab_data['text']) : '';
                        ?>
						<button type="button"
							role="tab"
							id="<?php echo esc_attr($ambrygen_tab_uid); ?>"
							aria-selected="<?php echo esc_attr(0 === $ambrygen_index ? 'true' : 'false'); ?>"
							aria-controls="<?php echo esc_attr($ambrygen_panel_id); ?>"
							class="icon_ajax_tab tabs__tab text-md-Semibold<?php echo esc_attr($ambrygen_is_active); ?>"
							data-tab-target="<?php echo esc_attr($ambrygen_panel_id); ?>"
							data-term-slug="<?php echo esc_attr($ambrygen_tab_id); ?>">
							<?php echo esc_html($ambrygen_tab_text); ?>
						</button>
					<?php endforeach; ?>
				</div>
				<?php if (! empty($ambrygen_selected_tabs)): ?>
					<div class="is-style-gl-s32" aria-hidden="true"></div>
				<?php endif; ?>

				<div class="tabs__panels">
					<?php foreach ($ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data): ?>
						<?php
                            $ambrygen_tab_slug   = isset($ambrygen_tab_data['termSlug']) ? sanitize_title((string) $ambrygen_tab_data['termSlug']) : '';
                            $ambrygen_tab_id     = 'all' === $ambrygen_tab_slug || '' === $ambrygen_tab_slug ? 'all' : $ambrygen_tab_slug;
                            $ambrygen_tab_uid    = $ambrygen_tabs_uid . '-tab-' . $ambrygen_index;
                            $ambrygen_panel_id   = $ambrygen_tabs_uid . '-panel-' . $ambrygen_index . '-' . $ambrygen_tab_id;
                            $ambrygen_term_id    = isset($ambrygen_tab_data['termId']) ? absint($ambrygen_tab_data['termId']) : 0;
                            $ambrygen_is_active  = 0 === $ambrygen_index ? ' is-active' : '';
                            $ambrygen_tab_term   = null;
                            $ambrygen_query_args = [
                                'post_type'      => 'genetic-testing',
                                'post_status'    => 'publish',
                                'posts_per_page' => -1,
                                'no_found_rows'  => true,
                                'orderby'        => 'date',
                                'order'          => 'ASC',
                            ];

                            if ($ambrygen_term_id) {
                                $ambrygen_term_cache_key = 'gtg_term_id_' . $ambrygen_taxonomy . '_' . $ambrygen_term_id;
                                $ambrygen_tab_term       = wp_cache_get($ambrygen_term_cache_key, 'ambrygen_blocks');

                                if (false === $ambrygen_tab_term) {
                                    $ambrygen_tab_term = get_term($ambrygen_term_id, $ambrygen_taxonomy);
                                    wp_cache_set($ambrygen_term_cache_key, $ambrygen_tab_term, 'ambrygen_blocks', HOUR_IN_SECONDS);
                                }
                            } elseif ('all' !== $ambrygen_tab_id) {
                                $ambrygen_term_cache_key = 'gtg_term_slug_' . $ambrygen_taxonomy . '_' . md5($ambrygen_tab_id);
                                $ambrygen_tab_term       = wp_cache_get($ambrygen_term_cache_key, 'ambrygen_blocks');

                                if (false === $ambrygen_tab_term) {
                                    $ambrygen_tab_term = get_term_by('slug', $ambrygen_tab_id, $ambrygen_taxonomy);
                                    wp_cache_set($ambrygen_term_cache_key, $ambrygen_tab_term, 'ambrygen_blocks', HOUR_IN_SECONDS);
                                }
                            }

                            if ($ambrygen_tab_term && ! is_wp_error($ambrygen_tab_term)) {
                                $ambrygen_query_args['tax_query'] = [
                                    [
                                        'taxonomy' => $ambrygen_taxonomy,
                                        'field'    => 'term_id',
                                        'terms'    => absint($ambrygen_tab_term->term_id),
                                    ],
                                ];
                            } elseif ('all' !== $ambrygen_tab_id) {
                                $ambrygen_query_args['post__in'] = [0];
                            }

                            $ambrygen_cache_key = 'gtg_tab_posts_' . md5(serialize($ambrygen_query_args));
                            $ambrygen_cached    = wp_cache_get($ambrygen_cache_key, 'ambrygen_blocks');

                            if (false === $ambrygen_cached) {
                                $ambrygen_tests_query = new WP_Query($ambrygen_query_args);
                                wp_cache_set($ambrygen_cache_key, $ambrygen_tests_query, 'ambrygen_blocks', HOUR_IN_SECONDS);
                            } else {
                                $ambrygen_tests_query = $ambrygen_cached;
                            }

                            $ambrygen_total_tests = (int) $ambrygen_tests_query->post_count;
                        ?>
						<div class="tabs__panel<?php echo esc_attr($ambrygen_is_active); ?>"
							id="<?php echo esc_attr($ambrygen_panel_id); ?>"
							role="tabpanel"
							aria-labelledby="<?php echo esc_attr($ambrygen_tab_uid); ?>"
							data-term-slug="<?php echo esc_attr($ambrygen_tab_id); ?>">
							<div class="features-tabs__grid">
								<?php if ($ambrygen_tests_query->have_posts()): ?>
									<?php $ambrygen_post_index = 0; ?>
									<?php while ($ambrygen_tests_query->have_posts()): ?>
										<?php
                                            $ambrygen_tests_query->the_post();
                                            $ambrygen_post_title = get_the_title();
                                            $ambrygen_post_terms = get_the_terms(get_the_ID(), $ambrygen_taxonomy);
                                            $ambrygen_category   = (is_array($ambrygen_post_terms) && ! empty($ambrygen_post_terms) && ! is_wp_error($ambrygen_post_terms[0]))
                                                ? $ambrygen_post_terms[0]->name
                                                : '';
                                            $ambrygen_is_extra_test = $ambrygen_post_index >= $ambrygen_initial_visible_tests;
                                        ?>
										<div class="features-tabs__card<?php echo esc_attr($ambrygen_is_extra_test ? ' features-tabs__card--is-extra is-view-all-hidden' : ' js-gsap-fade'); ?>"
											aria-hidden="<?php echo esc_attr($ambrygen_is_extra_test ? 'true' : 'false'); ?>"
											<?php echo $ambrygen_is_extra_test ? 'style="display:none;"' : ''; ?>
											data-view-all-card="<?php echo esc_attr($ambrygen_is_extra_test ? '1' : '0'); ?>">
											<div class="features-tabs__content-head">
												<?php if ($ambrygen_category): ?>
													<div class="features-tabs__category body2-semibold">
														<?php echo esc_html($ambrygen_category); ?>
													</div>
												<?php endif; ?>
												<div class="features-tabs__card-title">
													<?php echo esc_html($ambrygen_post_title); ?>
													<div class="badge badge--blue"><i class="badge__dot"></i><?php esc_html_e('Product', 'ambrygen-web'); ?></div>
												</div>
											</div>
											<a class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow"
												href="<?php echo esc_url(get_permalink()); ?>"
												aria-label="<?php echo esc_attr('View test for ' . $ambrygen_post_title); ?>">
												<?php esc_html_e('View Test', 'ambrygen-web'); ?>
											</a>
										</div>
										<?php ++$ambrygen_post_index; ?>
									<?php endwhile; ?>
									<?php wp_reset_postdata(); ?>
								<?php else: ?>
									<p><?php esc_html_e('No Test found for this tab.', 'ambrygen-web'); ?></p>
								<?php endif; ?>
							</div>
							<?php if ($ambrygen_total_tests > $ambrygen_initial_visible_tests): ?>
								<div class="features-tabs__footer">
									<button type="button"
										class="site-btn is-style-site-trailing-icon has-right-arrow features-tabs__view-all"
										aria-expanded="false">
										<?php esc_html_e('View All Tests', 'ambrygen-web'); ?>
									</button>
								</div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>
</div>
