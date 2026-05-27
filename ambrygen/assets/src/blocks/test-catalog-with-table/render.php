<?php
/**
 * Render: Test Catalog With Table Block
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_search_label = isset( $ambrygen_attributes['searchLabel'] ) ? (string) $ambrygen_attributes['searchLabel'] : '';
$ambrygen_search_placeholder = isset( $ambrygen_attributes['searchPlaceholder'] ) ? (string) $ambrygen_attributes['searchPlaceholder'] : '';
$ambrygen_featured_eyebrow = isset( $ambrygen_attributes['featuredEyebrow'] ) ? (string) $ambrygen_attributes['featuredEyebrow'] : '';
$ambrygen_featured_title = isset( $ambrygen_attributes['featuredTitle'] ) ? (string) $ambrygen_attributes['featuredTitle'] : '';
$ambrygen_featured_description = isset( $ambrygen_attributes['featuredDescription'] ) ? (string) $ambrygen_attributes['featuredDescription'] : '';
$ambrygen_table_eyebrow = isset( $ambrygen_attributes['tableEyebrow'] ) ? (string) $ambrygen_attributes['tableEyebrow'] : '';
$ambrygen_table_title = isset( $ambrygen_attributes['tableTitle'] ) ? (string) $ambrygen_attributes['tableTitle'] : '';
$ambrygen_table_description = isset( $ambrygen_attributes['tableDescription'] ) ? (string) $ambrygen_attributes['tableDescription'] : '';
$ambrygen_hide_table = ! empty( $ambrygen_attributes['hideTable'] );
$ambrygen_heading_level = Helper::get_heading_tag(
	isset( $ambrygen_attributes['headingLevel'] ) ? (string) $ambrygen_attributes['headingLevel'] : 'h2',
	'h2'
);
$ambrygen_tabs = isset( $ambrygen_attributes['selectedTabs'] ) && is_array( $ambrygen_attributes['selectedTabs'] )
	? array_values( $ambrygen_attributes['selectedTabs'] )
	: array();
$ambrygen_wrapper_args = array(
	'class' => 'block-layout test-catalog-with-table-block',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

$ambrygen_all_table_items = array();
$ambrygen_order_url       = home_url( '/providers/ordering-process' );
$ambrygen_has_search_label = '' !== trim( wp_strip_all_tags( $ambrygen_search_label ) );
$ambrygen_has_featured_eyebrow = '' !== trim( wp_strip_all_tags( $ambrygen_featured_eyebrow ) );
$ambrygen_has_featured_title = '' !== trim( wp_strip_all_tags( $ambrygen_featured_title ) );
$ambrygen_has_featured_description = '' !== trim( wp_strip_all_tags( $ambrygen_featured_description ) );
$ambrygen_has_table_eyebrow = '' !== trim( wp_strip_all_tags( $ambrygen_table_eyebrow ) );
$ambrygen_has_table_title = '' !== trim( wp_strip_all_tags( $ambrygen_table_title ) );
$ambrygen_has_table_description = '' !== trim( wp_strip_all_tags( $ambrygen_table_description ) );

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="genes-table catlouge-search">
		<div class="genes-table__search">
			<?php if ( $ambrygen_has_search_label ) : ?>
				<div class="eyebrow kicker-text"><?php echo wp_kses_post( $ambrygen_search_label ); ?></div>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<form method="get" class="genes-table__search-form" onsubmit="return false;">
				<label class="screen-reader-text" for="<?php echo esc_attr( $ambrygen_block_id ?: 'test-catalog-with-table' ); ?>-search">
					<?php esc_html_e( 'Search tests', 'ambrygen-web' ); ?>
				</label>
				<input
					id="<?php echo esc_attr( $ambrygen_block_id ?: 'test-catalog-with-table' ); ?>-search"
					type="search"
					class="genes-table__search-input"
					name="catalog_search"
					value=""
					placeholder="<?php echo esc_attr( $ambrygen_search_placeholder ); ?>"
					autocomplete="off"
				>
				<input type="submit" class="genes-table__search-button" value="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>">
			</form>
			<div class="catlouge-search-results-wrap" hidden>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="catlouge-search-result" aria-live="polite"></div>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="catlouge-search-result-grid cardiology-filter__items-grid"></div>
			</div>
		</div>
	</div>
<div class="is-style-gl-s50" aria-hidden="true"></div>
	<div class="container-1280 bg-primary_25 block-bg">

			<div class="block-layout cardiology-filter__grid">
				<div class="cardiology-filter__header">
					<?php if ( $ambrygen_has_featured_eyebrow ) : ?>
						<div class="eyebrow cardiology-filter__subtitle kicker-text"><?php echo wp_kses_post( $ambrygen_featured_eyebrow ); ?></div>
						<?php if ( $ambrygen_has_featured_title || $ambrygen_has_featured_description ) : ?>
							<div class="is-style-gl-s16" aria-hidden="true"></div>
						<?php endif; ?>
					<?php endif; ?>

					<?php if ( $ambrygen_has_featured_title ) : ?>
						<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0 cardiology-filter__title">
							<?php echo wp_kses_post( $ambrygen_featured_title ); ?>
						</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
						<?php if ( $ambrygen_has_featured_description ) : ?>
							<div class="is-style-gl-s16" aria-hidden="true"></div>
						<?php endif; ?>
					<?php endif; ?>

					<?php if ( $ambrygen_has_featured_description ) : ?>
						<div class="body1 cardiology-filter__desc block-description"><?php echo wp_kses_post( $ambrygen_featured_description ); ?></div>
					<?php endif; ?>
				</div>

				<div class="is-style-gl-s50"></div>
				<?php if ( ! empty( $ambrygen_tabs ) ) : ?>
					<div class="tabs tabs-content">
						<div class="tabs__mobile-nav">
							<select class="tabs__select text-md-sbold" aria-label="<?php esc_attr_e( 'Select test category', 'ambrygen-web' ); ?>">
								<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
									<option value="<?php echo esc_attr( sanitize_title( (string) ( $ambrygen_tab['termSlug'] ?? '' ) ) ); ?>" <?php selected( 0, $ambrygen_index ); ?>>
										<?php echo esc_html( (string) ( $ambrygen_tab['text'] ?? '' ) ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						</div>
						<div class="tabs__nav" role="tablist">
							<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
								<?php $ambrygen_tab_slug = sanitize_title( (string) ( $ambrygen_tab['termSlug'] ?? '' ) ); ?>
								<button class="tabs__tab text-md-sbold<?php echo 0 === $ambrygen_index ? ' is-active' : ''; ?>" type="button" role="tab" data-tab-target="<?php echo esc_attr( $ambrygen_tab_slug ); ?>" aria-controls="<?php echo esc_attr( $ambrygen_tab_slug ); ?>" aria-selected="<?php echo 0 === $ambrygen_index ? 'true' : 'false'; ?>">
									<?php echo esc_html( (string) ( $ambrygen_tab['text'] ?? '' ) ); ?>
								</button>
							<?php endforeach; ?>
						</div>
						<div class="is-style-gl-s32"></div>
						<div class="tabs__panels">
							<?php foreach ( $ambrygen_tabs as $ambrygen_index => $ambrygen_tab ) : ?>
								<?php
								$ambrygen_term_id = absint( $ambrygen_tab['termId'] ?? 0 );
								$ambrygen_tab_slug = sanitize_title( (string) ( $ambrygen_tab['termSlug'] ?? '' ) );
								$ambrygen_sub_term_ids = isset( $ambrygen_tab['subTermIds'] ) && is_array( $ambrygen_tab['subTermIds'] )
									? array_values( array_filter( array_map( 'absint', $ambrygen_tab['subTermIds'] ) ) )
									: array();
								$ambrygen_parent_term_ids = isset( $ambrygen_tab['parentTermIds'] ) && is_array( $ambrygen_tab['parentTermIds'] )
									? array_map( 'absint', $ambrygen_tab['parentTermIds'] )
									: array();
								if ( empty( $ambrygen_parent_term_ids ) ) {
									$ambrygen_term_parent = $ambrygen_term_id ? wp_get_term_taxonomy_parent_id( $ambrygen_term_id, 'poster_category' ) : 0;
									if ( $ambrygen_term_parent > 0 ) {
										$ambrygen_parent_term_ids = array( $ambrygen_term_parent );
									}
								}
								$ambrygen_query_term_ids = array();
								if ( ! empty( $ambrygen_sub_term_ids ) ) {
									foreach ( $ambrygen_sub_term_ids as $ambrygen_sub_term_id ) {
										$ambrygen_query_term_ids = array_merge(
											$ambrygen_query_term_ids,
											Helper::collect_poster_category_descendants( $ambrygen_sub_term_id )
										);
									}
								} elseif ( $ambrygen_term_id > 0 ) {
									$ambrygen_query_term_ids = Helper::collect_poster_category_descendants( $ambrygen_term_id );
								}
								$ambrygen_query_term_ids = array_values( array_unique( array_filter( $ambrygen_query_term_ids ) ) );
								$ambrygen_card_category_name = (string) ( $ambrygen_tab['text'] ?? '' );
								if ( ! empty( $ambrygen_sub_term_ids ) ) {
									$ambrygen_sub_term_names = array();
									foreach ( $ambrygen_sub_term_ids as $ambrygen_sub_term_id ) {
										$ambrygen_sub_term = get_term( $ambrygen_sub_term_id, 'poster_category' );
										if ( $ambrygen_sub_term && ! is_wp_error( $ambrygen_sub_term ) && ! empty( $ambrygen_sub_term->name ) ) {
											$ambrygen_sub_term_names[] = (string) $ambrygen_sub_term->name;
										}
									}
									if ( ! empty( $ambrygen_sub_term_names ) ) {
										$ambrygen_card_category_name = implode( ', ', array_unique( $ambrygen_sub_term_names ) );
									}
								}
								$ambrygen_query_args = array(
									'post_type'      => 'product_version',
									'post_status'    => 'publish',
									'posts_per_page' => -1,
									'no_found_rows'  => true,
									'orderby'        => 'title',
									'order'          => 'ASC',
								);

								if ( ! empty( $ambrygen_query_term_ids ) ) {
									$ambrygen_query_args['tax_query'] = array(
										array(
											'taxonomy'         => 'poster_category',
											'field'            => 'term_id',
											'terms'            => $ambrygen_query_term_ids,
											'include_children' => true,
										),
									);
								} else {
									$ambrygen_query_args['post__in'] = array( 0 );
								}

								$ambrygen_query = new WP_Query( $ambrygen_query_args );
								$ambrygen_items = array_map(
									static function ( $ambrygen_post ) use ( $ambrygen_parent_term_ids ) {
										return Helper::get_test_catalog_with_table_item_data( $ambrygen_post, $ambrygen_parent_term_ids );
									},
									$ambrygen_query->posts
								);
								foreach ( $ambrygen_items as $ambrygen_item ) {
									$ambrygen_all_table_items[ (int) $ambrygen_item['id'] ] = $ambrygen_item;
								}
								$ambrygen_featured_ids = isset( $ambrygen_tab['featuredProductVersionIds'] ) && is_array( $ambrygen_tab['featuredProductVersionIds'] ) ? array_map( 'absint', $ambrygen_tab['featuredProductVersionIds'] ) : array();
								$ambrygen_featured_items = array_values( array_filter( $ambrygen_items, static function ( array $ambrygen_item ) use ( $ambrygen_featured_ids ): bool {
									return in_array( (int) $ambrygen_item['id'], $ambrygen_featured_ids, true );
								} ) );
								?>
								<div class="tabs__panel<?php echo 0 === $ambrygen_index ? ' is-active' : ''; ?>" id="<?php echo esc_attr( $ambrygen_tab_slug ); ?>" role="tabpanel" <?php echo 0 === $ambrygen_index ? '' : 'hidden'; ?>>
									<div class="cardiology-filter__items-grid">
										<?php foreach ( $ambrygen_featured_items as $ambrygen_item ) : ?>
											<div class="cardiology-filter__card" data-search-text="<?php echo esc_attr( $ambrygen_item['search_text'] ); ?>">
												<?php if ( $ambrygen_card_category_name ) : ?><div class="body2-semibold cardiology-filter__card-category"><?php echo esc_html( $ambrygen_card_category_name ); ?></div><div class="is-style-gl-s4"></div><?php endif; ?>
												<div class="cardiology-filter__card-info">
													<div class="subtitle1-sbold cardiology-filter__card-name"><?php echo esc_html( $ambrygen_item['title'] ); ?></div>
													<div class="cardiology-filter__card-badge text-small-medium"><?php echo esc_html( (string) ( $ambrygen_item['gene_badge'] ?? '' ) ); ?></div>
												</div>
												<div class="is-style-gl-s12"></div>
												<?php if ( $ambrygen_item['summary'] ) : ?><div class="body1 cardiology-filter__card-text"><?php echo esc_html( $ambrygen_item['summary'] ); ?></div><?php endif; ?>
												<div class="is-style-gl-s24"></div>
												<div class="cardiology-filter__card-actions">
													<a href="<?php echo esc_url( $ambrygen_order_url ); ?>" class="site-btn has-right-arrow btn-small"><?php esc_html_e( 'Order', 'ambrygen-web' ); ?></a>
													<?php if ( $ambrygen_item['details_url'] ) : ?>
														<a href="<?php echo esc_url( $ambrygen_item['details_url'] ); ?>" class="site-btn is-style-site-tertiary-btn btn-small"><?php esc_html_e( 'Test details', 'ambrygen-web' ); ?></a>
													<?php endif; ?>
												</div>
											</div>
										<?php endforeach; ?>
									</div>
									<?php wp_reset_postdata(); ?>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				<?php else : ?>
					<p><?php esc_html_e( 'Add one or more tabs in the block settings.', 'ambrygen-web' ); ?></p>
				<?php endif; ?>
			</div>

	</div>

	<?php if ( ! $ambrygen_hide_table ) : ?>
		<div class="is-style-gl-s50" aria-hidden="true"></div>

		<div class="container-1280">

				<div class="block-layout catlouge-table-result">
					<div class="catlouge-table-result__header">
						<?php if ( $ambrygen_has_table_eyebrow ) : ?>
							<div class="eyebrow catlouge-table-result__subtitle"><?php echo wp_kses_post( $ambrygen_table_eyebrow ); ?></div>
							<?php if ( $ambrygen_has_table_title || $ambrygen_has_table_description ) : ?>
								<div class="is-style-gl-s12" aria-hidden="true"></div>
							<?php endif; ?>
						<?php endif; ?>

						<?php if ( $ambrygen_has_table_title ) : ?>
							<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="heading-4 mb-0 block-title catlouge-table-result__title">
								<?php echo wp_kses_post( $ambrygen_table_title ); ?>
							</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
							<?php if ( $ambrygen_has_table_description ) : ?>
								<div class="is-style-gl-s12" aria-hidden="true"></div>
							<?php endif; ?>
						<?php endif; ?>

						<?php if ( $ambrygen_has_table_description ) : ?>
							<div class="body1 catlouge-table-result__desc block-description"><?php echo wp_kses_post( $ambrygen_table_description ); ?></div>
						<?php endif; ?>
					</div>

					<div class="is-style-gl-s32"></div>

					<div class="gl-data-table-body">
						<div class="gl-data-table variation-gray25 gl-data-table--cols-6">
							<div class="gl-data-table__grid">
								<div class="gl-data-table__row gl-data-table__row--header">
									<div class="gl-data-table__cell"><?php esc_html_e( 'Code', 'ambrygen-web' ); ?></div>
									<div class="gl-data-table__cell"><?php esc_html_e( 'Test Name', 'ambrygen-web' ); ?></div>
									<div class="gl-data-table__cell"><?php esc_html_e( 'Genes', 'ambrygen-web' ); ?></div>
									<div class="gl-data-table__cell"><?php esc_html_e( 'Gene List (Abbreviated)', 'ambrygen-web' ); ?></div>
									<div class="gl-data-table__cell"><?php esc_html_e( 'Turnaround', 'ambrygen-web' ); ?></div>
									<div class="gl-data-table__cell"></div>
								</div>
								<?php foreach ( array_values( $ambrygen_all_table_items ) as $ambrygen_item ) : ?>
									<div class="gl-data-table__row" data-search-text="<?php echo esc_attr( $ambrygen_item['search_text'] ); ?>">
										<div class="gl-data-table__cell" data-label="Code"><?php echo esc_html( $ambrygen_item['test_code'] ); ?></div>
										<div class="gl-data-table__cell gl-data-table__cell--name" data-label="Test Name">
											<?php echo esc_html( $ambrygen_item['title'] ); ?>
										
										</div>
										<div class="gl-data-table__cell" data-label="Genes"><?php echo esc_html( (string) $ambrygen_item['gene_badge_compact'] ); ?></div>
										<div class="gl-data-table__cell" data-label="Gene List (Abbreviated)"><?php echo wp_kses_post( (string) ( $ambrygen_item['gene_list_excerpt_html'] ?? '' ) ); ?><?php if ( empty( $ambrygen_item['gene_list_excerpt_html'] ) && count( $ambrygen_item['gene_list'] ) > 14 ) : ?>&hellip;<?php endif; ?></div>
										<div class="gl-data-table__cell gl-data-table__cell--highlight" data-label="Turnaround"><?php echo esc_html( $ambrygen_item['turnaround'] ); ?></div>
										<div class="gl-data-table__cell" data-label="Order"><a href="<?php echo esc_url( $ambrygen_order_url ); ?>" class="site-btn has-right-arrow btn-small"><?php esc_html_e( 'Order', 'ambrygen-web' ); ?></a></div>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					</div>
				</div>

		</div>
	<?php endif; ?>
</div>
<?php
wp_reset_postdata();
