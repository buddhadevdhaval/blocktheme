<?php
/**
 * Render: Icon Grids
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

$ambrygen_variation = isset($attributes['variation']) ? sanitize_text_field($attributes['variation']) : '';
$ambrygen_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_allowed_heading_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6');

if (!in_array($ambrygen_heading_tag, $ambrygen_allowed_heading_tags, true)) {
	$ambrygen_heading_tag = 'h2';
}

$ambrygen_is_large = $attributes['isLargeIcon'] ?? false;
$ambrygen_large_class = $ambrygen_is_large ? ' style-large-icons' : '';

$ambrygen_class = 'block-layout info-list__row info-list-block';

$ambrygen_link = $attributes['link'] ?? array();
$ambrygen_block_id = $attributes['blockId'] ?? '';

$ambrygen_bg_image = $attributes['backgroundImage'] ?? array();
$ambrygen_bg_url = $ambrygen_bg_image['url'] ?? '';

$ambrygen_main_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'block-layout',
		'id' => $ambrygen_block_id,
	)
);

if ('variation-4' === $ambrygen_variation) {

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'block-layout icon-grid' . $ambrygen_large_class,
			'id' => $ambrygen_block_id,
		)
	);

} elseif ('variation-5' === $ambrygen_variation) {

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'block-layout icon-grid variation-grid-post ' . $ambrygen_large_class,
			'id' => $ambrygen_block_id,
		)
	);

} elseif ('our-testing-menu' === $ambrygen_variation) {
	$ambrygen_class = 'our-testing-menu';

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'block-layout ' . esc_attr($ambrygen_class) . $ambrygen_large_class,
			'id' => $ambrygen_block_id,
		)
	);
} else {
	$ambrygen_wrapper_attr = get_block_wrapper_attributes(
		array(
			'class' => 'info-list__row info-list-block' . $ambrygen_large_class,
		)
	);
}

$ambrygen_content = $content ?? '';

?>

<div <?php echo $ambrygen_main_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ($ambrygen_bg_url): ?>
		<div class="block-bg-image">
			<img src="<?php echo esc_url($ambrygen_bg_url); ?>"
				alt="<?php echo esc_attr($ambrygen_bg_image['alt'] ?? ''); ?>" />
		</div>
	<?php endif; ?>

	<div class="icon-grid-block">
		<?php if ('variation-4' === $ambrygen_variation): ?>
			<div class="icon-grid__header">
				<?php if (!empty($attributes['heading'])): ?>
					<<?php echo tag_escape($ambrygen_heading_tag); ?> class="heading-3 block-title mb-0 js-gsap-fade">
						<?php
						echo wp_kses(
							$attributes['heading'],
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape($ambrygen_heading_tag); ?>>
				<?php endif; ?>

				<div class="is-style-gl-s20" aria-hidden="true"></div>

				<?php if (!empty($attributes['description'])): ?>
					<div class="text-xl-reg icon-grid__intro text-center js-gsap-fade">
						<p><?php echo wp_kses_post($attributes['description']); ?></p>
					</div>
				<?php endif; ?>

				<?php
				if (
					is_array($ambrygen_link) &&
					!empty($ambrygen_link['url']) &&
					!empty($ambrygen_link['text'])
				):
					$ambrygen_target = !empty($ambrygen_link['target']) ? $ambrygen_link['target'] : '';
					$ambrygen_rel = !empty($ambrygen_link['rel']) ? $ambrygen_link['rel'] : '';
					?>
					<div class="is-style-gl-s20" aria-hidden="true"></div>
					<a class="site-btn is-style-site-text-btn has-right-arrow text-14"
						href="<?php echo esc_url($ambrygen_link['url']); ?>" <?php echo $ambrygen_target ? ' target="' . esc_attr($ambrygen_target) . '"' : ''; ?> <?php echo $ambrygen_rel ? ' rel="' . esc_attr($ambrygen_rel) . '"' : ''; ?>>
						<?php echo esc_html($ambrygen_link['text']); ?>
					</a>
				<?php endif; ?>
			</div>

			<div class="is-style-gl-s64" aria-hidden="true"></div>

			<div class="icon-grid__list">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped inner blocks content ?>
			</div>
		</div>
		<?php return; ?>

	<?php endif; ?>

	<?php
	if ('variation-3' === $ambrygen_variation):
		$ambrygen_wrapper_attr = get_block_wrapper_attributes(
			array(
				'class' => 'features-tabs' . $ambrygen_large_class,
			)
		);
		$ambrygen_selected_tabs = isset($attributes['selectedTabs']) && is_array($attributes['selectedTabs']) && !empty($attributes['selectedTabs']) ? $attributes['selectedTabs'] : array(
			array(
				'text' => 'All Tests',
				'termSlug' => 'all',
			),
		);
		?>
		<div <?php echo $ambrygen_wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

			<div class="features-tabs__header block__rowflex">

				<?php if (!empty($attributes['heading'])): ?>
					<<?php echo tag_escape($ambrygen_heading_tag); ?> class="heading-2 block-title mb-0
						block__rowflex--heading-title js-gsap-fade">
						<?php
						echo wp_kses(
							$attributes['heading'],
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape($ambrygen_heading_tag); ?>>
				<?php endif; ?>

				<?php if (!empty($attributes['description'])): ?>
					<div class="block__rowflex--block-content subtitle-1-regular js-gsap-fade">
						<p><?php echo wp_kses_post($attributes['description']); ?></p>
					</div>
				<?php endif; ?>

			</div>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
			<div class="tabs-content">
				<div class="is-style-gl-s20" aria-hidden="true"></div>
				<div class="tabs__nav">
					<?php
					foreach ($ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data):
						$ambrygen_is_active = 0 === $ambrygen_index ? ' is-active' : '';
						?>
						<button type="button"
							class="icon_ajax_tab tabs__tab text-md-Semibold<?php echo esc_attr($ambrygen_is_active); ?>"
							data-tab-target="<?php echo esc_attr($ambrygen_tab_data['termSlug'] ?? ''); ?>">
							<?php echo esc_html($ambrygen_tab_data['text'] ?? ''); ?>
						</button>
					<?php endforeach; ?>
				</div>
				<div class="is-style-gl-s32" aria-hidden="true"></div>

				<div class="tabs__panels">
					<?php
					foreach ($ambrygen_selected_tabs as $ambrygen_index => $ambrygen_tab_data):
						$ambrygen_tab_slug = $ambrygen_tab_data['termSlug'] ?? '';
						$ambrygen_is_active = 0 === $ambrygen_index ? ' is-active' : '';
						$ambrygen_tab_term = ('all' !== $ambrygen_tab_slug && '' !== $ambrygen_tab_slug) ? get_term_by('slug', $ambrygen_tab_slug, 'poster_category') : null;
						$ambrygen_query_args = array(
							'post_type' => 'genetic-testing',
							'posts_per_page' => -1,
							'orderby' => 'date',
							'order' => 'ASC',
						);

						if ($ambrygen_tab_term && !is_wp_error($ambrygen_tab_term)) {
							$ambrygen_query_args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Required for filtering tests by selected taxonomy term.
								array(
									'taxonomy' => 'genetic-testing',
									'field' => 'term_id',
									'terms' => absint($ambrygen_tab_term->term_id),
								),
							);
						} elseif ('all' !== $ambrygen_tab_slug) {
							$ambrygen_query_args['post__in'] = array(0);
						}

						$ambrygen_tests_query = new WP_Query($ambrygen_query_args);
						?>
						<div class="tabs__panel<?php echo esc_attr($ambrygen_is_active); ?>"
							id="<?php echo esc_attr($ambrygen_tab_slug); ?>">
							<div class="features-tabs__grid">
								<?php if ($ambrygen_tests_query->have_posts()): ?>
									<?php
									while ($ambrygen_tests_query->have_posts()):
										$ambrygen_tests_query->the_post();
										?>
										<?php
										$ambrygen_post_title = get_the_title();
										$ambrygen_post_terms = get_the_terms(get_the_ID(), 'poster_category');
										$ambrygen_category = (is_array($ambrygen_post_terms) && !empty($ambrygen_post_terms) && !is_wp_error($ambrygen_post_terms[0]))
											? $ambrygen_post_terms[0]->name
											: '';
										?>
										<div class="features-tabs__card js-gsap-fade">
											<div class="features-tabs__content-head">
												<?php
												if ($ambrygen_category):
													?>
													<div class="features-tabs__category body2-semibold">
														<?php echo esc_html($ambrygen_category); ?>
													</div>
												<?php endif; ?>
												<div class="heading-5 features-tabs__card-title">
													<?php echo esc_html($ambrygen_post_title); ?>
													<div class="badge badge--blue"><i class="badge__dot"></i>Product</div>
												</div>
											</div>
											<a class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow"
												href="<?php the_permalink(); ?>"
												aria-label="<?php echo esc_attr('View test for ' . $ambrygen_post_title); ?>">
												<?php esc_html_e('View Test', 'ambrygen-web'); ?>
											</a>
										</div>
									<?php endwhile; ?>
									<?php wp_reset_postdata(); ?>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>


			</div>
		</div>
		<?php return; ?>
	<?php endif; ?>

	<?php if ('our-testing-menu' === $ambrygen_variation): ?>
		<div class="our-testing-menu__header block__rowflex">
			<?php if (!empty($attributes['heading'])): ?>
				<<?php echo tag_escape($ambrygen_heading_tag); ?> class="block-title block__rowflex--heading-title heading-3
					mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape($ambrygen_heading_tag); ?>>
			<?php endif; ?>

			<?php if (!empty($attributes['description']) || (!empty($ambrygen_link['url']) && !empty($ambrygen_link['text']))): ?>
				<div class="block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php if (!empty($attributes['description'])): ?>
						<p><?php echo wp_kses_post($attributes['description']); ?></p>
					<?php endif; ?>

					<?php
					if (
						is_array($ambrygen_link) &&
						!empty($ambrygen_link['url']) &&
						!empty($ambrygen_link['text'])
					):
						$ambrygen_target = !empty($ambrygen_link['target']) ? $ambrygen_link['target'] : '';
						$ambrygen_rel = !empty($ambrygen_link['rel']) ? $ambrygen_link['rel'] : '';

						if ('_blank' === $ambrygen_target && empty($ambrygen_rel)) {
							$ambrygen_rel = 'noopener noreferrer';
						}
						?>
						<div class="block_rowflex-link js-gsap-fade">
							<a class="site-btn is-style-site-text-btn has-right-arrow text-14"
								href="<?php echo esc_url($ambrygen_link['url']); ?>" <?php echo $ambrygen_target ? ' target="' . esc_attr($ambrygen_target) . '"' : ''; ?> 			<?php echo $ambrygen_rel ? ' rel="' . esc_attr($ambrygen_rel) . '"' : ''; ?>>
								<?php echo esc_html($ambrygen_link['text']); ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s64" aria-hidden="true"></div>

		<div class="our-testing-menu__grid">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped inner blocks content ?>
		</div>
		<?php return; ?>
	<?php endif; ?>


	<div class="info-list-block__header">
		<?php if (!empty($attributes['heading'])): ?>
			<<?php echo tag_escape($ambrygen_heading_tag); ?> class="heading-4 block-title mb-0 js-gsap-fade">
				<?php
				echo wp_kses(
					$attributes['heading'],
					Helper::allowed_heading_html()
				);
				?>
			</<?php echo tag_escape($ambrygen_heading_tag); ?>>
		<?php endif; ?>

		<div class="is-style-gl-s20" aria-hidden="true"></div>

		<?php if (!empty($attributes['description'])): ?>
			<div class="info-list-block__intro subtitle-1-regular js-gsap-fade">
				<p><?php echo wp_kses_post($attributes['description']); ?></p>
			</div>
			<div class="is-style-gl-s64" aria-hidden="true"></div>

		<?php endif; ?>
	</div>


	<div class="info-list__list info-list__row">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pre-escaped inner blocks content ?>
	</div>
</div>
</div>
