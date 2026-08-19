<?php

namespace Ambrygen\Theme\Core\Routes;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Power the front-end search results page and AJAX pagination.
 */
final class SearchPageService {

	use Singleton;

	private const SEARCHABLE_POST_TYPES = array(
		'post',
		'page',
		'webinar',
		'press_release',
		'conferences',
		'presentation',
		'poster',
		'publication',
		'genetic-testing',
	);

	private const GENETIC_TESTING_SEARCH_META_KEYS = array(
		'short_description',
		'intro',
		'when_to_consider_title',
		'when_to_consider_content',
		'why_is_this_important_title',
		'why_is_this_important',
		'test_description',
	);

	/**
	 * Register search page hooks.
	 */
	protected function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register search page filters and AJAX actions.
	 */
	private function register_hooks(): void {
		add_filter( 'query_vars', array( $this, 'register_query_vars' ) );
		add_action( 'pre_get_posts', array( $this, 'filter_search_query' ) );
		add_filter( 'posts_search', array( $this, 'include_extra_genetic_testing_in_search' ), 10, 2 );
		add_filter( 'posts_orderby', array( $this, 'prioritize_genetic_testing_orderby' ), 10, 2 );
		add_action( 'wp_ajax_ambrygen_search_page_results', array( $this, 'handle_ajax_results' ) );
		add_action( 'wp_ajax_nopriv_ambrygen_search_page_results', array( $this, 'handle_ajax_results' ) );
	}

	/**
	 * Register custom search query vars.
	 *
	 * @param array $vars Existing query vars.
	 * @return array
	 */
	public function register_query_vars( array $vars ): array {
		$vars[] = 'search_type';
		return $vars;
	}

	/**
	 * Apply post type filtering to the main search query.
	 *
	 * @param \WP_Query $query Main search query.
	 */
	public function filter_search_query( \WP_Query $query ): void {
		if ( is_admin() || ! $query->is_main_query() || ! $query->is_search() ) {
			return;
		}

		$selected_type = $this->get_selected_type();

		$query->set( 'post_status', 'publish' );
		$query->set( 'ignore_sticky_posts', true );
		$query->set( 'posts_per_page', 10 );
		$query->set(
			'post_type',
			'all' === $selected_type ? self::SEARCHABLE_POST_TYPES : $selected_type
		);

		if ( in_array( $selected_type, array( 'all', 'genetic-testing' ), true ) ) {
			$query->set( 'ambrygen_prioritize_genetic_testing', true );

			$extra_genetic_testing_ids = $this->get_extra_genetic_testing_ids_by_search( (string) $query->get( 's' ) );
			if ( ! empty( $extra_genetic_testing_ids ) ) {
				$query->set( 'ambrygen_extra_genetic_testing_ids', $extra_genetic_testing_ids );
			}
		}

		$gene_query_args = $this->get_gene_genetic_testing_query_args( (string) $query->get( 's' ), $selected_type );
		if ( ! empty( $gene_query_args ) ) {
			foreach ( $gene_query_args as $key => $value ) {
				$query->set( $key, $value );
			}
		}
	}

	/**
	 * Render the search results wrapper.
	 *
	 * @return string
	 */
	public function render_search_results(): string {
		if ( ! is_search() ) {
			return '';
		}

		global $wp_query;

		$search_term   = (string) get_search_query();
		$selected_type = $this->get_selected_type();
		$current_page  = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );
		$view_data     = $this->build_view_data( $wp_query, $search_term, $selected_type, $current_page );

		ob_start();
		?>
		<div class="search-modal__results-main">
			<?php echo $this->render_results_column( $view_data ); ?>
			<div data-search-pagination-wrap>
				<?php echo $this->render_pagination( $view_data ); ?>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Handle AJAX requests for paginated search results.
	 */
	public function handle_ajax_results(): void {
		check_ajax_referer( 'ambrygen-ajax', 'nonce' );

		$search_term   = isset( $_POST['s'] ) ? sanitize_text_field( wp_unslash( $_POST['s'] ) ) : '';
		$selected_type = isset( $_POST['search_type'] ) ? sanitize_key( wp_unslash( $_POST['search_type'] ) ) : 'all';
		$current_page  = isset( $_POST['paged'] ) ? max( 1, absint( $_POST['paged'] ) ) : 1;

		if ( ! in_array( $selected_type, self::SEARCHABLE_POST_TYPES, true ) ) {
			$selected_type = 'all';
		}

		$query = new \WP_Query( $this->get_search_query_args( $search_term, $selected_type, $current_page ) );

		wp_send_json_success(
			array(
				'resultsHtml'    => $this->render_results_column(
					$this->build_view_data( $query, $search_term, $selected_type, $current_page )
				),
				'paginationHtml' => $this->render_pagination(
					$this->build_view_data( $query, $search_term, $selected_type, $current_page )
				),
				'url'            => $this->build_search_url( $search_term, $selected_type, $current_page ),
			)
		);
	}

	/**
	 * Render the search type filter controls.
	 *
	 * @param array  $counts        Post type counts.
	 * @param string $search_term   Search term.
	 * @param string $selected_type Active type filter.
	 * @return string
	 */
	private function render_filters( array $counts, string $search_term, string $selected_type ): string {
		$labels = $this->get_post_type_labels();
		$types  = array_filter(
			array_keys( $counts ),
			static fn( string $type): bool => 'all' === $type || $counts[ $type ] > 0
		);

		if ( empty( $types ) ) {
			$types = array( 'all' );
		}

		ob_start();
		?>
		<div class="search-modal__filters horizontal-tabs is-visible">
			<?php foreach ( $types as $type ) : ?>
				<a
					href="<?php echo esc_url( $this->build_search_url( $search_term, $type ) ); ?>"
					class="tab-button <?php echo $type === $selected_type ? 'active' : ''; ?>"
				>
					<?php echo esc_html( $labels[ $type ] ?? ucfirst( $type ) ); ?>
				</a>
			<?php endforeach; ?>
		</div>

		<div class="tabs__mobile-nav search-modal__filters-mobile is-visible">
			<select class="tabs__select text-md-sbold search-page__filter-select" aria-label="<?php esc_attr_e( 'Select search category', 'ambrygen-web' ); ?>" onchange="if (this.value) { window.location.href = this.value; }">
				<?php foreach ( $types as $type ) : ?>
					<option value="<?php echo esc_url( $this->build_search_url( $search_term, $type ) ); ?>" <?php selected( $selected_type, $type ); ?>>
						<?php echo esc_html( $labels[ $type ] ?? ucfirst( $type ) ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render the results column markup.
	 *
	 * @param array $view_data Search result view data.
	 * @return string
	 */
	private function render_results_column( array $view_data ): string {
		ob_start();
		?>
		<div class="search-modal__results-col" data-search-results-column>
			<div class="search-modal__results-title heading-4 mb-0">
				<?php
				if ( '' !== trim( (string) $view_data['search_term'] ) ) {
					printf(
						/* translators: %s is the search term. */
						esc_html__( 'Search Results for "%s"', 'ambrygen-web' ),
						esc_html( $view_data['search_term'] )
					);
				} else {
					esc_html_e( 'Search Results', 'ambrygen-web' );
				}
				?>
			</div>
			<div class="search-modal__stats body2-reg">
				<span id="search-results-count"><?php echo esc_html( (string) $view_data['total_results'] ); ?></span>
				<?php esc_html_e( 'Results. Page', 'ambrygen-web' ); ?>
				<span id="search-current-page"><?php echo esc_html( (string) $view_data['current_page'] ); ?></span>
				<?php esc_html_e( 'of', 'ambrygen-web' ); ?>
				<span id="search-total-pages"><?php echo esc_html( (string) $view_data['total_pages'] ); ?></span>
			</div>

			<?php echo $this->render_filters( $view_data['counts'], $view_data['search_term'], $view_data['selected_type'] ); ?>

			<div id="search-results-list" class="search-modal__results-list">
				<?php if ( ! empty( $view_data['posts'] ) ) : ?>
					<?php foreach ( $view_data['posts'] as $post_data ) : ?>
						<div class="search-result-card">
							<div class="search-result-card__content">
								<div class="search-result-card__label"><?php echo esc_html( $post_data['post_type_label'] ); ?></div>
								<div class="search-result-card__title heading-6"><?php echo esc_html( $post_data['title'] ); ?></div>
								<div class="search-result-card__excerpt body2-reg">
									<?php echo wp_kses_post( $post_data['excerpt'] ); ?>
								</div>
								<a href="<?php echo esc_url( $post_data['url'] ); ?>" class="site-btn has-right-arrow btn-medium search-result-card__btn"><?php esc_html_e( 'Read More', 'ambrygen-web' ); ?></a>
							</div>
						</div>
					<?php endforeach; ?>
				<?php else : ?>
					<div class="search-modal__no-results"><?php esc_html_e( 'No results found for your search.', 'ambrygen-web' ); ?></div>
				<?php endif; ?>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render pagination controls for search results.
	 *
	 * @param array $view_data Search result view data.
	 * @return string
	 */
	private function render_pagination( array $view_data ): string {
		if ( $view_data['total_pages'] <= 1 ) {
			return '';
		}
		$current_page  = $view_data['current_page'];
		$total_pages   = $view_data['total_pages'];
		$search_term   = $view_data['search_term'];
		$selected_type = $view_data['selected_type'];
		$visible_pages = $this->get_visible_page_numbers( $current_page, $total_pages, 5 );
		$previous_url  = $current_page > 1
			? $this->build_search_url( $search_term, $selected_type, $current_page - 1 )
			: '';
		$next_url      = $current_page < $total_pages
			? $this->build_search_url( $search_term, $selected_type, $current_page + 1 )
			: '';

		ob_start();
		?>
		<div id="search-pagination" class="search-modal__pagination search-page__pagination">
			<div class="pagination-container">
				<div class="desktop-pages">
					<?php if ( $previous_url ) : ?>
						<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
							<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page - 1 ); ?>
							<button
								id="desktopprev"
								class="arrow-btn"
								type="submit"
								aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
							></button>
						</form>
					<?php else : ?>
						<button
							id="desktopprev"
							class="arrow-btn is-disabled"
							type="button"
							disabled
							aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
						></button>
					<?php endif; ?>
					<div id="paginationList-search" class="pagination-list">
						<?php foreach ( $visible_pages as $page ) : ?>
							<form
								method="get"
								action="<?php echo esc_url( home_url( '/' ) ); ?>"
								class="search-page__pagination-form"
							>
								<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $page ); ?>
								<button
									class="page-btn<?php echo $page === $current_page ? ' active' : ''; ?>"
									type="submit"
									<?php echo $page === $current_page ? ' aria-current="page"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								>
									<?php echo esc_html( (string) $page ); ?>
								</button>
							</form>
						<?php endforeach; ?>
					</div>
					<?php if ( $next_url ) : ?>
						<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
							<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page + 1 ); ?>
							<button
								id="desktopnext"
								class="arrow-btn"
								type="submit"
								aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
							></button>
						</form>
					<?php else : ?>
						<button
							id="desktopnext"
							class="arrow-btn is-disabled"
							type="button"
							disabled
							aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
						></button>
					<?php endif; ?>
				</div>

				<div class="mobile-pagination">
					<?php if ( $previous_url ) : ?>
						<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
							<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page - 1 ); ?>
							<button
								id="prevbtn"
								class="arrow-btn"
								type="submit"
								aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
							></button>
						</form>
					<?php else : ?>
						<button
							id="prevbtn"
							class="arrow-btn is-disabled"
							type="button"
							disabled
							aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
						></button>
					<?php endif; ?>
					<span class="page-trigger"><?php echo esc_html( $current_page . '/' . $total_pages ); ?></span>
					<?php if ( $next_url ) : ?>
						<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
							<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page + 1 ); ?>
							<button
								id="nextbtn"
								class="arrow-btn"
								type="submit"
								aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
							></button>
						</form>
					<?php else : ?>
						<button
							id="nextbtn"
							class="arrow-btn is-disabled"
							type="button"
							disabled
							aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
						></button>
					<?php endif; ?>
				</div>

				<div id="paginationPopup-search" class="pagination-popup">
					<div class="popup-body">
						<div id="popupGrid-search" class="popup-grid">
							<?php foreach ( $visible_pages as $page ) : ?>
								<form
									method="get"
									action="<?php echo esc_url( home_url( '/' ) ); ?>"
									class="search-page__pagination-form"
								>
									<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $page ); ?>
									<button
										class="page-btn<?php echo $page === $current_page ? ' active' : ''; ?>"
										type="submit"
										<?php echo $page === $current_page ? ' aria-current="page"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									>
										<?php echo esc_html( (string) $page ); ?>
									</button>
								</form>
							<?php endforeach; ?>
						</div>
						<?php if ( $previous_url ) : ?>
							<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
								<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page - 1 ); ?>
								<button
									id="popupPrev"
									class="arrow-btn"
									type="submit"
									aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
								></button>
							</form>
						<?php else : ?>
							<button
								id="popupPrev"
								class="arrow-btn is-disabled"
								type="button"
								disabled
								aria-label="<?php esc_attr_e( 'Previous page', 'ambrygen-web' ); ?>"
							></button>
						<?php endif; ?>
						<?php if ( $next_url ) : ?>
							<form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-page__pagination-form">
								<?php echo $this->render_pagination_hidden_fields( $search_term, $selected_type, $current_page + 1 ); ?>
								<button
									id="popupNext"
									class="arrow-btn"
									type="submit"
									aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
								></button>
							</form>
						<?php else : ?>
							<button
								id="popupNext"
								class="arrow-btn is-disabled"
								type="button"
								disabled
								aria-label="<?php esc_attr_e( 'Next page', 'ambrygen-web' ); ?>"
							></button>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Render hidden form fields for pagination submissions.
	 *
	 * @param string $search_term   Search term.
	 * @param string $selected_type Active type filter.
	 * @param int    $page          Target page.
	 * @return string
	 */
	private function render_pagination_hidden_fields( string $search_term, string $selected_type, int $page ): string {
		ob_start();
		?>
		<input type="hidden" name="s" value="<?php echo esc_attr( $search_term ); ?>">
		<?php if ( 'all' !== $selected_type ) : ?>
			<input type="hidden" name="search_type" value="<?php echo esc_attr( $selected_type ); ?>">
		<?php endif; ?>
		<?php if ( $page > 1 ) : ?>
			<input type="hidden" name="paged" value="<?php echo esc_attr( (string) $page ); ?>">
		<?php endif; ?>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Get a sliding window of visible page numbers.
	 *
	 * @param int $current_page Current page.
	 * @param int $total_pages  Total pages.
	 * @param int $max_visible  Maximum pages to show.
	 * @return array
	 */
	private function get_visible_page_numbers( int $current_page, int $total_pages, int $max_visible = 5 ): array {
		if ( $total_pages <= $max_visible ) {
			return range( 1, $total_pages );
		}

		$half  = (int) floor( $max_visible / 2 );
		$start = max( 1, $current_page - $half );
		$end   = $start + $max_visible - 1;

		if ( $end > $total_pages ) {
			$end   = $total_pages;
			$start = max( 1, $end - $max_visible + 1 );
		}

		return range( $start, $end );
	}

	/**
	 * Build condensed pagination items with ellipsis markers.
	 *
	 * @param int $current_page Current page.
	 * @param int $total_pages  Total pages.
	 * @return array
	 */
	private function get_pagination_items( int $current_page, int $total_pages ): array {
		if ( $total_pages <= 1 ) {
			return array();
		}

		$pages = array( 1, $total_pages );

		for ( $page = $current_page - 1; $page <= $current_page + 1; $page++ ) {
			if ( $page > 1 && $page < $total_pages ) {
				$pages[] = $page;
			}
		}

		$pages = array_values( array_unique( array_filter( $pages, static fn( int $page): bool => $page >= 1 && $page <= $total_pages ) ) );
		sort( $pages );

		$items         = array();
		$previous_page = null;

		foreach ( $pages as $page ) {
			if ( null !== $previous_page && $page - $previous_page > 1 ) {
				$items[] = array(
					'type' => 'dots',
				);
			}

			$items[] = array(
				'type'    => 'page',
				'page'    => $page,
				'label'   => $page,
				'current' => $page === $current_page,
			);

			$previous_page = $page;
		}

		return $items;
	}

	/**
	 * Build normalized view data from a search query.
	 *
	 * @param \WP_Query $query         Search query.
	 * @param string    $search_term   Search term.
	 * @param string    $selected_type Active type filter.
	 * @param int       $current_page  Current page.
	 * @return array
	 */
	private function build_view_data( \WP_Query $query, string $search_term, string $selected_type, int $current_page ): array {
		$posts = array();

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$posts[] = array(
					'title'           => get_the_title(),
					'url'             => get_permalink(),
					'post_type_label' => $this->get_post_type_label( get_post_type() ),
					'excerpt'         => $this->get_highlighted_excerpt( get_the_excerpt(), $search_term ),
				);
			}
			wp_reset_postdata();
		}

		return array(
			'counts'        => $this->get_post_type_counts( $search_term ),
			'current_page'  => $current_page,
			'posts'         => $posts,
			'search_term'   => $search_term,
			'selected_type' => $selected_type,
			'total_pages'   => max( 1, (int) $query->max_num_pages ),
			'total_results' => (int) $query->found_posts,
		);
	}

	/**
	 * Build WP_Query arguments for search requests.
	 *
	 * @param string $search_term   Search term.
	 * @param string $selected_type Active type filter.
	 * @param int    $current_page  Current page.
	 * @return array
	 */
	private function get_search_query_args( string $search_term, string $selected_type, int $current_page ): array {
		$args = array(
			's'                   => $search_term,
			'paged'               => $current_page,
			'post_status'         => 'publish',
			'posts_per_page'      => 10,
			'ignore_sticky_posts' => true,
			'post_type'           => 'all' === $selected_type ? self::SEARCHABLE_POST_TYPES : $selected_type,
		);

		if ( in_array( $selected_type, array( 'all', 'genetic-testing' ), true ) ) {
			$args['ambrygen_prioritize_genetic_testing'] = true;

			$extra_genetic_testing_ids = $this->get_extra_genetic_testing_ids_by_search( $search_term );
			if ( ! empty( $extra_genetic_testing_ids ) ) {
				$args['ambrygen_extra_genetic_testing_ids'] = $extra_genetic_testing_ids;
			}
		}

		return array_merge( $args, $this->get_gene_genetic_testing_query_args( $search_term, $selected_type ) );
	}

	/**
	 * Include genetic-testing posts found through related search fields in search SQL.
	 *
	 * @param string    $search Search SQL.
	 * @param \WP_Query $query  Search query.
	 * @return string
	 */
	public function include_extra_genetic_testing_in_search( string $search, \WP_Query $query ): string {
		global $wpdb;

		$genetic_testing_ids = $query->get( 'ambrygen_extra_genetic_testing_ids' );
		if ( empty( $search ) || empty( $genetic_testing_ids ) || ! is_array( $genetic_testing_ids ) ) {
			return $search;
		}

		$genetic_testing_ids = array_values( array_filter( array_map( 'absint', $genetic_testing_ids ) ) );
		if ( empty( $genetic_testing_ids ) ) {
			return $search;
		}

		$id_list     = implode( ',', $genetic_testing_ids );
		$search_body = preg_replace( '/^\s*AND\s*/i', '', trim( $search ), 1 );

		return " AND ( {$search_body} OR {$wpdb->posts}.ID IN ({$id_list}) ) ";
	}

	/**
	 * Sort All search results with genetic-testing matches first, newest first.
	 *
	 * @param string    $orderby Order by SQL.
	 * @param \WP_Query $query   Search query.
	 * @return string
	 */
	public function prioritize_genetic_testing_orderby( string $orderby, \WP_Query $query ): string {
		global $wpdb;

		if ( ! $query->get( 'ambrygen_prioritize_genetic_testing' ) ) {
			return $orderby;
		}

		return "CASE WHEN {$wpdb->posts}.post_type = 'genetic-testing' THEN 0 ELSE 1 END ASC, "
			. "{$wpdb->posts}.post_date DESC";
	}

	/**
	 * Get the currently selected search type.
	 *
	 * @return string
	 */
	private function get_selected_type(): string {
		$selected_type = sanitize_key( (string) get_query_var( 'search_type', 'all' ) );

		if ( 'all' === $selected_type || in_array( $selected_type, self::SEARCHABLE_POST_TYPES, true ) ) {
			return $selected_type;
		}

		return 'all';
	}

	/**
	 * Count matching posts by post type for the active search term.
	 *
	 * @param string $search Search term.
	 * @return array
	 */
	private function get_post_type_counts( string $search ): array {
		$counts = array( 'all' => 0 );

		foreach ( self::SEARCHABLE_POST_TYPES as $post_type ) {
			$extra_genetic_testing_ids = 'genetic-testing' === $post_type
				? $this->get_extra_genetic_testing_ids_by_search( $search )
				: array();

			$query_args = array(
				'post_type'                          => $post_type,
				'post_status'                        => 'publish',
				'posts_per_page'                     => 1,
				'fields'                             => 'ids',
				'ambrygen_extra_genetic_testing_ids' => $extra_genetic_testing_ids,
			);

			if ( '' !== trim( $search ) ) {
				$query_args['s'] = $search;
			}

			$query = new \WP_Query(
				array_merge(
					$query_args,
					$this->get_gene_genetic_testing_query_args( $search, $post_type )
				)
			);

			$count = (int) $query->found_posts;
			if ( $count > 0 ) {
				$counts[ $post_type ] = $count;
				$counts['all']       += $count;
			}
		}

		return $counts;
	}

	/**
	 * Get the display label for a post type.
	 *
	 * @param string $post_type Post type slug.
	 * @return string
	 */
	private function get_post_type_label( string $post_type ): string {
		$labels = $this->get_post_type_labels();

		if ( isset( $labels[ $post_type ] ) ) {
			return $labels[ $post_type ];
		}

		$post_type_object = get_post_type_object( $post_type );
		return $post_type_object ? (string) $post_type_object->labels->singular_name : ucfirst( $post_type );
	}

	/**
	 * Get labels for all searchable post types.
	 *
	 * @return array
	 */
	private function get_post_type_labels(): array {
		return array(
			'all'           => __( 'All', 'ambrygen-web' ),
			'post'          => __( 'Blog Post', 'ambrygen-web' ),
			'page'          => __( 'Web Page', 'ambrygen-web' ),
			'webinar'       => __( 'Webinar', 'ambrygen-web' ),
			'press_release' => __( 'Press Release', 'ambrygen-web' ),
			'conferences'   => __( 'Conferences', 'ambrygen-web' ),
			'presentation'  => __( 'Scientific Presentation', 'ambrygen-web' ),
			'poster'        => __( 'Scientific Poster', 'ambrygen-web' ),
			'publication'      => __( 'Peer-Reviewed Publication', 'ambrygen-web' ),
			'genetic-testing' => __( 'Genetic Testing', 'ambrygen-web' ),
		);
	}

	/**
	 * Build query overrides when the search term matches product version gene terms.
	 *
	 * Genetic-testing posts are related to product versions through the
	 * linked_posts_genetic serialized relationship meta, while gene terms live on
	 * product_version posts.
	 *
	 * @param string $search_term   Search term.
	 * @param string $selected_type Active type filter.
	 * @return array
	 */
	private function get_gene_genetic_testing_query_args( string $search_term, string $selected_type ): array {
		if ( '' === trim( $search_term ) || 'genetic-testing' !== $selected_type ) {
			return array();
		}

		$genetic_testing_ids = $this->get_extra_genetic_testing_ids_by_search( $search_term );
		if ( empty( $genetic_testing_ids ) ) {
			return array();
		}

		return array(
			'orderby'   => 'date',
			'order'     => 'DESC',
			'post_type' => 'genetic-testing',
		);
	}

	/**
	 * Get genetic-testing post IDs linked to product versions assigned matching genes.
	 *
	 * @param string $search_term Search term.
	 * @return int[]
	 */
	private function get_genetic_testing_ids_by_gene_search( string $search_term ): array {
		$gene_terms = get_terms(
			array(
				'taxonomy'   => 'gene',
				'hide_empty' => false,
				'name__like' => $search_term,
				'fields'     => 'ids',
			)
		);

		if ( is_wp_error( $gene_terms ) || empty( $gene_terms ) ) {
			return array();
		}

		$product_version_query = new \WP_Query(
			array(
				'post_type'      => 'product_version',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'tax_query'      => array(
					array(
						'taxonomy' => 'gene',
						'field'    => 'term_id',
						'terms'    => array_map( 'absint', $gene_terms ),
					),
				),
			)
		);

		if ( empty( $product_version_query->posts ) ) {
			return array();
		}

		$meta_query = array( 'relation' => 'OR' );
		foreach ( $product_version_query->posts as $product_version_id ) {
			$product_version_id = absint( $product_version_id );
			if ( $product_version_id <= 0 ) {
				continue;
			}

			$meta_query[] = array(
				'key'     => 'linked_posts_genetic',
				'value'   => 'i:' . $product_version_id . ';',
				'compare' => 'LIKE',
			);
			$meta_query[] = array(
				'key'     => 'linked_posts_genetic',
				'value'   => '"' . $product_version_id . '"',
				'compare' => 'LIKE',
			);
		}

		if ( count( $meta_query ) <= 1 ) {
			return array();
		}

		$genetic_testing_query = new \WP_Query(
			array(
				'post_type'      => 'genetic-testing',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'meta_query'     => $meta_query,
			)
		);

		return array_values( array_unique( array_map( 'absint', $genetic_testing_query->posts ) ) );
	}

	/**
	 * Get genetic-testing post IDs matched by gene links or searchable custom fields.
	 *
	 * @param string $search_term Search term.
	 * @return int[]
	 */
	private function get_extra_genetic_testing_ids_by_search( string $search_term ): array {
		return array_values(
			array_unique(
				array_merge(
					$this->get_genetic_testing_ids_by_gene_search( $search_term ),
					$this->get_genetic_testing_ids_by_meta_search( $search_term )
				)
			)
		);
	}

	/**
	 * Get genetic-testing post IDs whose searchable custom fields match the search term.
	 *
	 * @param string $search_term Search term.
	 * @return int[]
	 */
	private function get_genetic_testing_ids_by_meta_search( string $search_term ): array {
		if ( '' === trim( $search_term ) ) {
			return array();
		}

		$meta_query = array( 'relation' => 'OR' );
		foreach ( self::GENETIC_TESTING_SEARCH_META_KEYS as $meta_key ) {
			$meta_query[] = array(
				'key'     => $meta_key,
				'value'   => $search_term,
				'compare' => 'LIKE',
			);
		}

		$query = new \WP_Query(
			array(
				'post_type'      => 'genetic-testing',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'meta_query'     => $meta_query,
			)
		);

		return array_values( array_unique( array_map( 'absint', $query->posts ) ) );
	}

	/**
	 * Build a search results URL.
	 *
	 * @param string $search_term   Search term.
	 * @param string $selected_type Active type filter.
	 * @param int    $page          Target page.
	 * @return string
	 */
	private function build_search_url( string $search_term, string $selected_type, int $page = 1 ): string {
		$args = array( 's' => $search_term );

		if ( 'all' !== $selected_type ) {
			$args['search_type'] = $selected_type;
		}

		if ( $page > 1 ) {
			$args['paged'] = $page;
		}

		return add_query_arg( $args, home_url( '/' ) );
	}

	/**
	 * Highlight the search term inside an excerpt.
	 *
	 * @param string $excerpt     Raw excerpt.
	 * @param string $search_term Search term.
	 * @return string
	 */
	private function get_highlighted_excerpt( string $excerpt, string $search_term ): string {
		$excerpt = wp_trim_words( wp_strip_all_tags( $excerpt ), 25, '...' );
		$excerpt = esc_html( $excerpt );

		if ( '' === trim( $search_term ) ) {
			return $excerpt;
		}

		$pattern = '/' . preg_quote( $search_term, '/' ) . '/i';

		return (string) preg_replace(
			$pattern,
			'<mark class="search-highlight">$0</mark>',
			$excerpt
		);
	}
}
