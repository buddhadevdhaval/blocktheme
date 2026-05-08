<?php
/**
 * Render: Test Catalog Block
 *
 * @package ambrygen
 */

defined('ABSPATH') || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_get_genetic_testing_link = static function ( int $ambrygen_post_id ): array {
	$ambrygen_link_cache_key       = 'genetic_testing_link_' . $ambrygen_post_id;
	$ambrygen_genetic_testing_link = wp_cache_get( $ambrygen_link_cache_key, 'ambrygen_catalog' );

	if ( false !== $ambrygen_genetic_testing_link ) {
		return is_array( $ambrygen_genetic_testing_link ) ? $ambrygen_genetic_testing_link : array( 'post_id' => 0, 'url' => '' );
	}

	$ambrygen_genetic_testing_link = array( 'post_id' => 0, 'url' => '' );

	if (
		class_exists( Helper::class )
		&& is_callable( array( Helper::class, 'get_genetic_testing_link_by_product_version' ) )
	) {
		$ambrygen_genetic_testing_link = Helper::get_genetic_testing_link_by_product_version( $ambrygen_post_id );
	} else {
		$ambrygen_link_query = new WP_Query(
			array(
				'post_type'      => 'genetic-testing',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'     => 'linked_posts_genetic',
						'value'   => 'i:' . absint( $ambrygen_post_id ) . ';',
						'compare' => 'LIKE',
					),
				),
			)
		);

		if ( ! empty( $ambrygen_link_query->posts[0] ) ) {
			$ambrygen_linked_id  = absint( $ambrygen_link_query->posts[0] );
			$ambrygen_linked_url = $ambrygen_linked_id ? get_permalink( $ambrygen_linked_id ) : '';

			$ambrygen_genetic_testing_link = array(
				'post_id' => $ambrygen_linked_id,
				'url'     => is_string( $ambrygen_linked_url ) ? $ambrygen_linked_url : '',
			);
		}
	}

	if ( ! is_array( $ambrygen_genetic_testing_link ) ) {
		$ambrygen_genetic_testing_link = array( 'post_id' => 0, 'url' => '' );
	}

	wp_cache_set( $ambrygen_link_cache_key, $ambrygen_genetic_testing_link, 'ambrygen_catalog', 12 * HOUR_IN_SECONDS );

	return $ambrygen_genetic_testing_link;
};

$ambrygen_attributes = is_array($attributes ?? null) ? $attributes : array();
$ambrygen_block_id = isset($ambrygen_attributes['blockId']) ? sanitize_html_class($ambrygen_attributes['blockId']) : '';
$ambrygen_eyebrow = isset($ambrygen_attributes['eyebrow']) ? (string) $ambrygen_attributes['eyebrow'] : '';
$ambrygen_title = isset($ambrygen_attributes['title']) ? (string) $ambrygen_attributes['title'] : '';
$ambrygen_subtitle = isset($ambrygen_attributes['subtitle']) ? (string) $ambrygen_attributes['subtitle'] : '';
$ambrygen_tabs = isset($ambrygen_attributes['selectedTabs']) && is_array($ambrygen_attributes['selectedTabs'])
	? array_values($ambrygen_attributes['selectedTabs'])
	: array();
$ambrygen_heading = isset($ambrygen_attributes['headingLevel']) ? sanitize_key($ambrygen_attributes['headingLevel']) : 'h2';
$ambrygen_material_type = isset($ambrygen_attributes['marketingMaterialTypeId']) ? absint($ambrygen_attributes['marketingMaterialTypeId']) : 0;
$ambrygen_edit_variant = isset($ambrygen_attributes['editVariant']) ? sanitize_key((string) $ambrygen_attributes['editVariant']) : 'tabs';
$ambrygen_single_product_version_id = isset($ambrygen_attributes['singleProductVersionId']) ? absint($ambrygen_attributes['singleProductVersionId']) : 0;
$ambrygen_single_product_version_ids = isset($ambrygen_attributes['singleProductVersionIds']) && is_array($ambrygen_attributes['singleProductVersionIds'])
	? array_values(array_map('absint', $ambrygen_attributes['singleProductVersionIds']))
	: array();

$ambrygen_heading = Helper::get_heading_tag( $ambrygen_heading, 'h2' );

$ambrygen_wrapper_args = array(
	'class' => 'block-layout test-catalog-block',
);

if ( ! empty( $ambrygen_block_id ) ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
$ambrygen_source_page_id = get_queried_object_id();
$ambrygen_source_page_title = '';
$ambrygen_source_page_path = isset($_SERVER['REQUEST_URI']) ? wp_parse_url(wp_unslash((string) $_SERVER['REQUEST_URI']), PHP_URL_PATH) : '';

if ($ambrygen_source_page_id > 0) {
	$ambrygen_source_page_title = get_the_title($ambrygen_source_page_id);
}

$ambrygen_test_catalog_page_context = array(
	'page_id' => (int) $ambrygen_source_page_id,
	'page_title' => (string) $ambrygen_source_page_title,
	'page_path' => is_string($ambrygen_source_page_path) ? $ambrygen_source_page_path : '',
);

?>
<div
	<?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	data-track-endpoint="<?php echo esc_url( rest_url( 'ambrygen/v1/marketing-material-impressions' ) ); ?>"
	data-click-endpoint="<?php echo esc_url( rest_url( 'ambrygen/v1/marketing-material-click' ) ); ?>"
	data-page-id="<?php echo esc_attr( (string) $ambrygen_test_catalog_page_context['page_id'] ); ?>"
	data-page-title="<?php echo esc_attr( $ambrygen_test_catalog_page_context['page_title'] ); ?>"
	data-page-path="<?php echo esc_attr( $ambrygen_test_catalog_page_context['page_path'] ); ?>"
>
	<div class="test-catlouge">
		<?php if ('' !== trim(wp_strip_all_tags($ambrygen_title))): ?>
		<div class="test-catlouge__header">
			<?php if ('' !== trim(wp_strip_all_tags($ambrygen_eyebrow))): ?>
				<div class="hero-kicker overline-text test-catlouge__eyebrow">
					<?php echo wp_kses_post($ambrygen_eyebrow); ?>
				</div>
				<div class="is-style-gl-s12"></div>
			<?php endif; ?>

			<?php if ('' !== trim(wp_strip_all_tags($ambrygen_title))): ?>
				<<?php echo tag_escape($ambrygen_heading); ?> class="heading-4 block-title mb-0
					test-catlouge__title"><?php echo wp_kses_post($ambrygen_title); ?></<?php echo tag_escape($ambrygen_heading); ?>>
				<div class="is-style-gl-s12"></div>
			<?php endif; ?>

			<?php if ('' !== trim(wp_strip_all_tags($ambrygen_subtitle))): ?>
				<div class="body1 test-catlouge__subtitle"><?php echo wp_kses_post($ambrygen_subtitle); ?></div>
			<?php endif; ?>
		</div>
		<div class="is-style-gl-s32"></div>
<?php endif; ?>


		<?php if ('single' === $ambrygen_edit_variant): ?>
			<?php
			$ambrygen_selected_ids = array_values(array_filter($ambrygen_single_product_version_ids));
			if (empty($ambrygen_selected_ids) && $ambrygen_single_product_version_id > 0) {
				$ambrygen_selected_ids = array($ambrygen_single_product_version_id);
			}
			?>

			<?php if (!empty($ambrygen_selected_ids)): ?>
				<div class="test-catlouge__items">
					<?php foreach ($ambrygen_selected_ids as $ambrygen_selected_id): ?>
						<?php
						$ambrygen_selected_post = get_post($ambrygen_selected_id);
						if (
							!$ambrygen_selected_post instanceof WP_Post
							|| 'product_version' !== $ambrygen_selected_post->post_type
							|| 'publish' !== $ambrygen_selected_post->post_status
						) {
							continue;
						}

						$GLOBALS['post'] = $ambrygen_selected_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
						setup_postdata($ambrygen_selected_post);

						$ambrygen_post_id = $ambrygen_selected_post->ID;
						$ambrygen_gene_terms = get_the_terms($ambrygen_post_id, 'gene');
						$ambrygen_gene_count = is_array($ambrygen_gene_terms) ? count($ambrygen_gene_terms) : 0;
						$ambrygen_summary = has_excerpt($ambrygen_post_id) ? get_the_excerpt($ambrygen_post_id) : wp_trim_words(wp_strip_all_tags(get_the_content(null, false, $ambrygen_post_id)), 24);
						?>

						<div class="test-catlouge__item">
							<div class="test-catlouge__item-main">
								<div class="test-catlouge__item-top">
									<div class="subtitle1-sbold mb-0 test-catlouge__item-title"><?php the_title(); ?></div>
									<?php if ($ambrygen_gene_count > 0): ?>
										<div class="text-sm-medium test-catlouge__badge">
											<?php
											echo esc_html(
												sprintf(
													/* translators: %d is the number of genes. */
													_n('%d Gene', '%d Genes', $ambrygen_gene_count, 'ambrygen-web'),
													$ambrygen_gene_count
												)
											);
											?>
										</div>
									<?php endif; ?>
								</div>

								<?php if ('' !== $ambrygen_summary): ?>
									<div class="body2-semibold test-catlouge__item-desc">
										<?php echo esc_html($ambrygen_summary); ?>
									</div>
								<?php endif; ?>

								<?php
								$ambrygen_genetic_testing_link = $ambrygen_get_genetic_testing_link( (int) $ambrygen_post_id );
								?>

								<?php if ( ! empty( $ambrygen_genetic_testing_link['url'] ) ) : ?>
									<div class="test-catlouge__item-btn">
										<a href="<?php echo esc_url( $ambrygen_genetic_testing_link['url'] ); ?>" class="site-btn is-style-site-text-btn has-right-arrow">
											<?php esc_html_e( 'View Test', 'ambrygen-web' ); ?>
										</a>
									</div>
								<?php endif; ?>

								<div class="test-catlouge__item-content">
									<div class="test-catlouge__divider"></div>

									<?php if (is_array($ambrygen_gene_terms) && !empty($ambrygen_gene_terms) && !is_wp_error($ambrygen_gene_terms)): ?>
										<div class="test-catlouge__grid test-catlouge__grid--2col">
											<?php foreach ($ambrygen_gene_terms as $ambrygen_gene_term): ?>
												<?php $ambrygen_gene_links = Helper::get_test_catalog_gene_links((int) $ambrygen_gene_term->term_id, $ambrygen_material_type, $ambrygen_test_catalog_page_context); ?>
												<div class="test-catlouge__row">
													<div class="test-catlouge__gene-name gens">
														<?php echo esc_html($ambrygen_gene_term->name); ?>
														<?php echo Helper::render_product_version_gene_static_count((int) $ambrygen_gene_term->term_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
													</div>
													<div class="test-catlouge__links test">
														<?php foreach ($ambrygen_gene_links as $ambrygen_link): ?>
															<a href="<?php echo esc_url($ambrygen_link['url']); ?>"
																class="test-catlouge__link" target="_blank" rel="noopener"
																data-material-id="<?php echo esc_attr($ambrygen_link['material_id'] ?? ''); ?>"
																data-file-id="<?php echo esc_attr($ambrygen_link['file_id'] ?? ''); ?>">
																<?php echo esc_html($ambrygen_link['label']); ?>
																<img src="<?php echo esc_url(get_template_directory_uri() . '/assets/src/images/download-icon.svg'); ?>"
																	alt="" />
															</a>
														<?php endforeach; ?>
													</div>
												</div>
											<?php endforeach; ?>
										</div>
									<?php else: ?>
										<p><?php esc_html_e('No genes assigned for this product version.', 'ambrygen-web'); ?></p>
									<?php endif; ?>
								</div>
							</div>

							<button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
								aria-label="<?php esc_attr_e('Toggle test details', 'ambrygen-web'); ?>">
								<span class="test-catlouge__icon-cross"></span>
							</button>
						</div>
					<?php endforeach; ?>
				</div>
				<?php wp_reset_postdata(); ?>
			<?php else: ?>
				<div class="test-catlouge__items no-results">
					<p><?php esc_html_e('Select a product version in the block settings to show its data.', 'ambrygen-web'); ?></p>
				</div>
			<?php endif; ?>
		<?php else: ?>
			<div class="tabs tabs-content">
				<?php if (!empty($ambrygen_tabs)): ?>
					<div class="tabs__mobile-nav">
						<select class="tabs__select text-md-sbold"
							aria-label="<?php esc_attr_e('Select test category', 'ambrygen-web'); ?>">
							<?php foreach ($ambrygen_tabs as $ambrygen_index => $ambrygen_tab): ?>
								<?php
								$ambrygen_term_slug = isset($ambrygen_tab['termSlug']) ? sanitize_title((string) $ambrygen_tab['termSlug']) : '';
								$ambrygen_label = isset($ambrygen_tab['text']) ? (string) $ambrygen_tab['text'] : '';
								?>
								<option value="<?php echo esc_attr($ambrygen_term_slug); ?>" <?php selected(0, $ambrygen_index); ?>>
									<?php echo esc_html($ambrygen_label); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="tabs__nav" role="tablist">
						<?php foreach ($ambrygen_tabs as $ambrygen_index => $ambrygen_tab): ?>
							<?php
							$ambrygen_term_slug = isset($ambrygen_tab['termSlug']) ? sanitize_title((string) $ambrygen_tab['termSlug']) : '';
							$ambrygen_label = isset($ambrygen_tab['text']) ? (string) $ambrygen_tab['text'] : '';
							$ambrygen_active = 0 === $ambrygen_index ? ' is-active' : '';
							?>
							<button class="tabs__tab text-md-sbold<?php echo esc_attr($ambrygen_active); ?>" type="button"
								data-tab-target="<?php echo esc_attr($ambrygen_term_slug); ?>"
								aria-selected="<?php echo 0 === $ambrygen_index ? 'true' : 'false'; ?>">
								<?php echo esc_html($ambrygen_label); ?>
							</button>
						<?php endforeach; ?>
					</div>

					<div class="is-style-gl-s32"></div>

					<div class="tabs__panels">
						<?php foreach ($ambrygen_tabs as $ambrygen_index => $ambrygen_tab): ?>
							<?php
							$ambrygen_term_id = isset($ambrygen_tab['termId']) ? absint($ambrygen_tab['termId']) : 0;
							$ambrygen_term_slug = isset($ambrygen_tab['termSlug']) ? sanitize_title((string) $ambrygen_tab['termSlug']) : '';
							$ambrygen_excluded_ids = isset($ambrygen_tab['excludedPostIds']) && is_array($ambrygen_tab['excludedPostIds']) ? array_map('absint', $ambrygen_tab['excludedPostIds']) : array();
							$ambrygen_query = new WP_Query(
								array(
									'post_type' => 'product_version',
									'post_status' => 'publish',
									'posts_per_page' => -1,
									'no_found_rows' => true,
									'orderby' => 'title',
									'order' => 'ASC',
									'post__not_in' => $ambrygen_excluded_ids,
									'tax_query' => array(
										array(
											'taxonomy' => 'poster_category',
											'field' => 'term_id',
											'terms' => $ambrygen_term_id,
										),
									),
								)
							);
							$ambrygen_active = 0 === $ambrygen_index ? ' is-active' : '';
							?>
							<div class="tabs__panel<?php echo esc_attr($ambrygen_active); ?>"
								id="<?php echo esc_attr($ambrygen_term_slug); ?>">
								<?php if ($ambrygen_query->have_posts()): ?>
									<div class="test-catlouge__items">
										<?php
										while ($ambrygen_query->have_posts()):
											$ambrygen_query->the_post();
											$ambrygen_post_id = get_the_ID();
											$ambrygen_gene_terms = get_the_terms($ambrygen_post_id, 'gene');
											$ambrygen_gene_count = is_array($ambrygen_gene_terms) ? count($ambrygen_gene_terms) : 0;
											$ambrygen_summary = has_excerpt($ambrygen_post_id) ? get_the_excerpt($ambrygen_post_id) : wp_trim_words(wp_strip_all_tags(get_the_content(null, false, $ambrygen_post_id)), 24);
											?>
											<div class="test-catlouge__item">
												<div class="test-catlouge__item-main">
													<div class="test-catlouge__item-top">
														<div class="subtitle1-sbold mb-0 test-catlouge__item-title"><?php the_title(); ?>
														</div>
														<?php if ($ambrygen_gene_count > 0): ?>
															<div class="text-sm-medium test-catlouge__badge">
																<?php
																echo esc_html(
																	sprintf(
																		/* translators: %d is the number of genes. */
																		_n('%d Gene', '%d Genes', $ambrygen_gene_count, 'ambrygen-web'),
																		$ambrygen_gene_count
																	)
																);
																?>
															</div>
														<?php endif; ?>
													</div>

													<?php if ('' !== $ambrygen_summary): ?>
														<div class="body2-semibold test-catlouge__item-desc">
															<?php echo esc_html($ambrygen_summary); ?>
														</div>
													<?php endif; ?>

													<div class="test-catlouge__item-content">
														<div class="test-catlouge__divider"></div>

														<?php if (is_array($ambrygen_gene_terms) && !empty($ambrygen_gene_terms) && !is_wp_error($ambrygen_gene_terms)): ?>
															<div class="test-catlouge__grid test-catlouge__grid--2col">
																<?php foreach ($ambrygen_gene_terms as $ambrygen_gene_term): ?>
																	<?php $ambrygen_gene_links = Helper::get_test_catalog_gene_links((int) $ambrygen_gene_term->term_id, $ambrygen_material_type, $ambrygen_test_catalog_page_context); ?>
																	<div class="test-catlouge__row">
																		<div class="test-catlouge__gene-name genes">
																			<?php echo esc_html($ambrygen_gene_term->name); ?>
																			<?php echo Helper::render_product_version_gene_static_count((int) $ambrygen_gene_term->term_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
																		</div>
																		<div class="test-catlouge__links">
																			<?php foreach ($ambrygen_gene_links as $ambrygen_link): ?>
																				<a href="<?php echo esc_url($ambrygen_link['url']); ?>"
																					class="test-catlouge__link" target="_blank" rel="noopener"
																					data-material-id="<?php echo esc_attr($ambrygen_link['material_id'] ?? ''); ?>"
																					data-file-id="<?php echo esc_attr($ambrygen_link['file_id'] ?? ''); ?>">
																					<?php echo esc_html($ambrygen_link['label']); ?>
																					<img src="<?php echo esc_url(get_template_directory_uri() . '/assets/src/images/download-icon.svg'); ?>"
																						alt="" />
																				</a>
																			<?php endforeach; ?>
																		</div>
																	</div>
																<?php endforeach; ?>
															</div>
														<?php else: ?>
															<p><?php esc_html_e('No genes assigned for this product version.', 'ambrygen-web'); ?>
															</p>
														<?php endif; ?>
													</div>
												</div>

												<button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
													aria-label="<?php esc_attr_e('Toggle test details', 'ambrygen-web'); ?>">
													<span class="test-catlouge__icon-cross"></span>
												</button>
											</div>
										<?php endwhile; ?>
									</div>
								<?php else: ?>
									<div class="test-catlouge__items no-results">
										<p><?php esc_html_e('No product versions found in this category.', 'ambrygen-web'); ?></p>
									</div>
								<?php endif; ?>
								<?php wp_reset_postdata(); ?>
							</div>
						<?php endforeach; ?>
					</div>
				<?php else: ?>
					<div class="test-catlouge__items no-results">
						<p><?php esc_html_e('Add one or more categories in the block settings to build this catalog.', 'ambrygen-web'); ?>
						</p>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
