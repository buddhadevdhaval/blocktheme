<?php
/**
 * Render: Test Catalog Block
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_eyebrow = isset( $ambrygen_attributes['eyebrow'] ) ? (string) $ambrygen_attributes['eyebrow'] : '';
$ambrygen_title = isset( $ambrygen_attributes['title'] ) ? (string) $ambrygen_attributes['title'] : '';
$ambrygen_subtitle = isset( $ambrygen_attributes['subtitle'] ) ? (string) $ambrygen_attributes['subtitle'] : '';
$ambrygen_tabs = isset( $ambrygen_attributes['selectedTabs'] ) && is_array( $ambrygen_attributes['selectedTabs'] )
	? array_values( $ambrygen_attributes['selectedTabs'] )
	: array();
$ambrygen_heading = isset( $ambrygen_attributes['headingLevel'] ) ? sanitize_key( $ambrygen_attributes['headingLevel'] ) : 'h2';
$ambrygen_edit_variant = isset( $ambrygen_attributes['editVariant'] ) ? sanitize_key( (string) $ambrygen_attributes['editVariant'] ) : 'tabs';
$ambrygen_main_category_id = isset( $ambrygen_attributes['mainCategoryId'] ) ? absint( $ambrygen_attributes['mainCategoryId'] ) : 0;
$ambrygen_sub_category_id = isset( $ambrygen_attributes['subCategoryId'] ) ? absint( $ambrygen_attributes['subCategoryId'] ) : 0;
$ambrygen_single_product_version_id = isset( $ambrygen_attributes['singleProductVersionId'] ) ? absint( $ambrygen_attributes['singleProductVersionId'] ) : 0;
$ambrygen_single_product_version_ids = isset( $ambrygen_attributes['singleProductVersionIds'] ) && is_array( $ambrygen_attributes['singleProductVersionIds'] )
	? array_values( array_map( 'absint', $ambrygen_attributes['singleProductVersionIds'] ) )
	: array();

if ( ! in_array( $ambrygen_heading, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ) {
	$ambrygen_heading = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id'    => $ambrygen_block_id,
		'class' => 'block-layout test-catalog-block',
	)
);

$ambrygen_resolve_genetic_testing_link = static function ( int $ambrygen_post_id ): array {
	$ambrygen_link = array(
		'post_id' => 0,
		'url'     => '',
	);

	if (
		class_exists( Helper::class )
		&& is_callable( array( Helper::class, 'get_genetic_testing_link_by_product_version' ) )
	) {
		$ambrygen_link = Helper::get_genetic_testing_link_by_product_version( $ambrygen_post_id );
	}

	if ( empty( $ambrygen_link['post_id'] ) && empty( $ambrygen_link['url'] ) ) {
		$ambrygen_query = new WP_Query(
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

		if ( ! empty( $ambrygen_query->posts[0] ) ) {
			$ambrygen_linked_id  = absint( $ambrygen_query->posts[0] );
			$ambrygen_linked_url = $ambrygen_linked_id ? get_permalink( $ambrygen_linked_id ) : '';

			$ambrygen_link = array(
				'post_id' => $ambrygen_linked_id,
				'url'     => is_string( $ambrygen_linked_url ) ? $ambrygen_linked_url : '',
			);
		}
	}

	return is_array( $ambrygen_link ) ? $ambrygen_link : array(
		'post_id' => 0,
		'url'     => '',
	);
};

$ambrygen_post_matches_category_filter = static function ( int $ambrygen_post_id ) use ( $ambrygen_main_category_id, $ambrygen_sub_category_id ): bool {
	if ( ! $ambrygen_main_category_id && ! $ambrygen_sub_category_id ) {
		return true;
	}

	$ambrygen_term_ids = wp_get_post_terms( $ambrygen_post_id, 'poster_category', array( 'fields' => 'ids' ) );

	if ( is_wp_error( $ambrygen_term_ids ) || empty( $ambrygen_term_ids ) ) {
		return false;
	}

	$ambrygen_term_ids = array_map( 'absint', $ambrygen_term_ids );

	if ( $ambrygen_sub_category_id && in_array( $ambrygen_sub_category_id, $ambrygen_term_ids, true ) ) {
		return true;
	}

	if ( $ambrygen_main_category_id ) {
		foreach ( $ambrygen_term_ids as $ambrygen_term_id ) {
			if ( $ambrygen_term_id === $ambrygen_main_category_id ) {
				return true;
			}

			$ambrygen_ancestors = get_ancestors( $ambrygen_term_id, 'poster_category', 'taxonomy' );
			if ( in_array( $ambrygen_main_category_id, array_map( 'absint', $ambrygen_ancestors ), true ) ) {
				return true;
			}
		}
	}

	return false;
};

$ambrygen_render_catalog_item = static function ( WP_Post $ambrygen_product_post ) use ( $ambrygen_resolve_genetic_testing_link, $ambrygen_post_matches_category_filter ) {
	$ambrygen_post_id = $ambrygen_product_post->ID;
	if ( ! $ambrygen_post_matches_category_filter( $ambrygen_post_id ) ) {
		return;
	}

	$ambrygen_gene_terms = get_the_terms( $ambrygen_post_id, 'gene' );
	$ambrygen_gene_count = is_array( $ambrygen_gene_terms ) ? count( $ambrygen_gene_terms ) : 0;
	$ambrygen_genetic_testing_link = $ambrygen_resolve_genetic_testing_link( (int) $ambrygen_post_id );
	$ambrygen_linked_post_id = absint( $ambrygen_genetic_testing_link['post_id'] ?? 0 );
	$ambrygen_linked_post = $ambrygen_linked_post_id ? get_post( $ambrygen_linked_post_id ) : null;

	$ambrygen_item_title = get_the_title( $ambrygen_post_id );
	$ambrygen_item_summary = has_excerpt( $ambrygen_post_id )
		? get_the_excerpt( $ambrygen_post_id )
		: wp_trim_words( wp_strip_all_tags( get_the_content( null, false, $ambrygen_post_id ) ), 24 );

	if (
		$ambrygen_linked_post instanceof WP_Post
		&& 'publish' === $ambrygen_linked_post->post_status
		&& $ambrygen_post_matches_category_filter( $ambrygen_linked_post->ID )
	) {
		$ambrygen_item_title = get_the_title( $ambrygen_linked_post );

		if ( has_excerpt( $ambrygen_linked_post ) ) {
			$ambrygen_item_summary = get_the_excerpt( $ambrygen_linked_post );
		} else {
			$ambrygen_item_summary = wp_trim_words(
				wp_strip_all_tags( (string) $ambrygen_linked_post->post_content ),
				24
			);
		}
	} else {
		$ambrygen_genetic_testing_link = array(
			'post_id' => 0,
			'url'     => '',
		);
	}
	?>
	<div class="test-catlouge__item">
		<div class="test-catlouge__item-main">
			<div class="test-catlouge__item-top">
				<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
					<?php echo esc_html( $ambrygen_item_title ); ?>
				</div>

				<?php if ( $ambrygen_gene_count > 0 ) : ?>
					<div class="text-sm-medium test-catlouge__badge">
						<?php
						echo esc_html(
							sprintf(
								/* translators: %d is the number of genes. */
								_n( '%d Gene', '%d Genes', $ambrygen_gene_count, 'ambrygen-web' ),
								$ambrygen_gene_count
							)
						);
						?>
					</div>
				<?php endif; ?>
			</div>

			<?php if ( '' !== trim( (string) $ambrygen_item_summary ) ) : ?>
				<div class="body2-semibold test-catlouge__item-desc">
					<?php echo esc_html( $ambrygen_item_summary ); ?>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_genetic_testing_link['url'] ) ) : ?>
				<div class="test-catlouge__item-btn">
					<a href="<?php echo esc_url( $ambrygen_genetic_testing_link['url'] ); ?>" class="site-btn is-style-site-text-btn has-icon">
						<?php esc_html_e( 'View Test', 'ambrygen-web' ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>
	<?php
};
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="test-catlouge">
		<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_title ) ) ) : ?>
			<div class="test-catlouge__header">
				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_eyebrow ) ) ) : ?>
					<div class="hero-kicker overline-text test-catlouge__eyebrow">
						<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
					</div>
					<div class="is-style-gl-s12"></div>
				<?php endif; ?>

				<<?php echo esc_html( $ambrygen_heading ); ?> class="heading-4 block-title mb-0 test-catlouge__title">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo esc_html( $ambrygen_heading ); ?>>
				<div class="is-style-gl-s12"></div>

				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) ) ) : ?>
					<div class="body1 test-catlouge__subtitle"><?php echo wp_kses_post( $ambrygen_subtitle ); ?></div>
				<?php endif; ?>
			</div>
			<div class="is-style-gl-s32"></div>
		<?php endif; ?>

		<?php if ( 'single' === $ambrygen_edit_variant ) : ?>
			<?php
			$ambrygen_selected_ids = array_values( array_filter( $ambrygen_single_product_version_ids ) );
			if ( empty( $ambrygen_selected_ids ) && $ambrygen_single_product_version_id > 0 ) {
				$ambrygen_selected_ids = array( $ambrygen_single_product_version_id );
			}
			?>

			<?php if ( ! empty( $ambrygen_selected_ids ) ) : ?>
				<div class="test-catlouge__items">
					<?php foreach ( $ambrygen_selected_ids as $ambrygen_selected_id ) : ?>
						<?php
						$ambrygen_selected_post = get_post( $ambrygen_selected_id );
						if (
							! $ambrygen_selected_post instanceof WP_Post
							|| 'product_version' !== $ambrygen_selected_post->post_type
							|| 'publish' !== $ambrygen_selected_post->post_status
						) {
							continue;
						}

						$ambrygen_render_catalog_item( $ambrygen_selected_post );
						?>
					<?php endforeach; ?>
				</div>
			<?php else : ?>
				<div class="test-catlouge__items no-results">
					<p><?php esc_html_e( 'Select a product version in the block settings to show its data.', 'ambrygen-web' ); ?></p>
				</div>
			<?php endif; ?>
		<?php else : ?>
			<div class="tabs tabs-content">
				<?php if ( ! empty( $ambrygen_tabs ) ) : ?>
					<div class="tabs__mobile-nav">
						<select class="tabs__select text-md-sbold" aria-label="<?php esc_attr_e( 'Select test category', 'ambrygen-web' ); ?>">
							<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
								<?php
								$ambrygen_term_slug = isset( $ambrygen_tab['termSlug'] ) ? sanitize_title( (string) $ambrygen_tab['termSlug'] ) : '';
								$ambrygen_label = isset( $ambrygen_tab['text'] ) ? (string) $ambrygen_tab['text'] : '';
								?>
								<option value="<?php echo esc_attr( $ambrygen_term_slug ); ?>" <?php selected( 0, $ambrygen_index ); ?>>
									<?php echo esc_html( $ambrygen_label ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="tabs__nav" role="tablist">
						<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
							<?php
							$ambrygen_term_slug = isset( $ambrygen_tab['termSlug'] ) ? sanitize_title( (string) $ambrygen_tab['termSlug'] ) : '';
							$ambrygen_label = isset( $ambrygen_tab['text'] ) ? (string) $ambrygen_tab['text'] : '';
							$ambrygen_active = 0 === $ambrygen_index ? ' is-active' : '';
							?>
							<button class="tabs__tab text-md-sbold<?php echo esc_attr( $ambrygen_active ); ?>" type="button" data-tab-target="<?php echo esc_attr( $ambrygen_term_slug ); ?>" aria-selected="<?php echo 0 === $ambrygen_index ? 'true' : 'false'; ?>">
								<?php echo esc_html( $ambrygen_label ); ?>
							</button>
						<?php endforeach; ?>
					</div>

					<div class="is-style-gl-s32"></div>

					<div class="tabs__panels">
						<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
							<?php
							$ambrygen_term_id = isset( $ambrygen_tab['termId'] ) ? absint( $ambrygen_tab['termId'] ) : 0;
							$ambrygen_term_slug = isset( $ambrygen_tab['termSlug'] ) ? sanitize_title( (string) $ambrygen_tab['termSlug'] ) : '';
							$ambrygen_excluded_ids = isset( $ambrygen_tab['excludedPostIds'] ) && is_array( $ambrygen_tab['excludedPostIds'] ) ? array_map( 'absint', $ambrygen_tab['excludedPostIds'] ) : array();
							$ambrygen_query = new WP_Query(
								array(
									'post_type'      => 'product_version',
									'post_status'    => 'publish',
									'posts_per_page' => -1,
									'orderby'        => 'title',
									'order'          => 'ASC',
									'post__not_in'   => $ambrygen_excluded_ids,
									'tax_query'      => array(
										array(
											'taxonomy' => 'poster_category',
											'field'    => 'term_id',
											'terms'    => $ambrygen_sub_category_id ? $ambrygen_sub_category_id : ( $ambrygen_main_category_id ? $ambrygen_main_category_id : $ambrygen_term_id ),
											'include_children' => true,
										),
									),
								)
							);
							$ambrygen_active = 0 === $ambrygen_index ? ' is-active' : '';
							?>
							<div class="tabs__panel<?php echo esc_attr( $ambrygen_active ); ?>" id="<?php echo esc_attr( $ambrygen_term_slug ); ?>">
								<?php if ( $ambrygen_query->have_posts() ) : ?>
									<div class="test-catlouge__items">
										<?php
										while ( $ambrygen_query->have_posts() ) :
											$ambrygen_query->the_post();
											$ambrygen_render_catalog_item( get_post() );
										endwhile;
										?>
									</div>
								<?php else : ?>
									<div class="test-catlouge__items no-results">
										<p><?php esc_html_e( 'No product versions found in this category.', 'ambrygen-web' ); ?></p>
									</div>
								<?php endif; ?>
								<?php wp_reset_postdata(); ?>
							</div>
						<?php endforeach; ?>
					</div>
				<?php else : ?>
					<div class="test-catlouge__items no-results">
						<p><?php esc_html_e( 'Add one or more categories in the block settings to build this catalog.', 'ambrygen-web' ); ?></p>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
