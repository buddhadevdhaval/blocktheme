<?php

namespace Ambrygen\Theme\Core\Routes;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class SearchPageService
{
    use Singleton;

    private const SEARCHABLE_POST_TYPES = [
        'post',
        'page',
        'webinar',
        'press_release',
        'conferences',
        'presentation',
        'poster',
        'publication',
    ];

    protected function __construct()
    {
        $this->register_hooks();
    }

    private function register_hooks(): void
    {
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_search_query']);
        add_action('wp_ajax_ambrygen_search_page_results', [$this, 'handle_ajax_results']);
        add_action('wp_ajax_nopriv_ambrygen_search_page_results', [$this, 'handle_ajax_results']);
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'search_type';
        return $vars;
    }

    public function filter_search_query(\WP_Query $query): void
    {
        if (is_admin() || ! $query->is_main_query() || ! $query->is_search()) {
            return;
        }

        $selected_type = $this->get_selected_type();

        $query->set('post_status', 'publish');
        $query->set('ignore_sticky_posts', true);
        $query->set('posts_per_page', 10);
        $query->set(
            'post_type',
            'all' === $selected_type ? self::SEARCHABLE_POST_TYPES : $selected_type
        );
    }

    public function render_search_results(): string
    {
        if (! is_search()) {
            return '';
        }

        global $wp_query;

        $search_term   = (string) get_search_query();
        $selected_type = $this->get_selected_type();
        $current_page  = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));
        $view_data     = $this->build_view_data($wp_query, $search_term, $selected_type, $current_page);

        ob_start();
        ?>
        <div class="search-modal__results-main">
            <?php echo $this->render_results_column($view_data); ?>
            <div data-search-pagination-wrap>
                <?php echo $this->render_pagination($view_data); ?>
            </div>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    public function handle_ajax_results(): void
    {
        check_ajax_referer('ambrygen-ajax', 'nonce');

        $search_term   = isset($_POST['s']) ? sanitize_text_field(wp_unslash($_POST['s'])) : '';
        $selected_type = isset($_POST['search_type']) ? sanitize_key(wp_unslash($_POST['search_type'])) : 'all';
        $current_page  = isset($_POST['paged']) ? max(1, absint($_POST['paged'])) : 1;

        if (! in_array($selected_type, self::SEARCHABLE_POST_TYPES, true)) {
            $selected_type = 'all';
        }

        $query = new \WP_Query($this->get_search_query_args($search_term, $selected_type, $current_page));

        wp_send_json_success([
            'resultsHtml'    => $this->render_results_column(
                $this->build_view_data($query, $search_term, $selected_type, $current_page)
            ),
            'paginationHtml' => $this->render_pagination(
                $this->build_view_data($query, $search_term, $selected_type, $current_page)
            ),
            'url'            => $this->build_search_url($search_term, $selected_type, $current_page),
        ]);
    }

    private function render_filters(array $counts, string $search_term, string $selected_type): string
    {
        $labels = $this->get_post_type_labels();
        $types  = array_filter(
            array_keys($counts),
            static fn(string $type): bool => 'all' === $type || $counts[$type] > 0
        );

        if (empty($types)) {
            $types = ['all'];
        }

        ob_start();
        ?>
        <div class="search-modal__filters horizontal-tabs is-visible">
            <?php foreach ($types as $type) : ?>
                <a
                    href="<?php echo esc_url($this->build_search_url($search_term, $type)); ?>"
                    class="tab-button <?php echo $type === $selected_type ? 'active' : ''; ?>"
                >
                    <?php echo esc_html($labels[$type] ?? ucfirst($type)); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="tabs__mobile-nav search-modal__filters-mobile is-visible">
            <select class="tabs__select text-md-sbold search-page__filter-select" aria-label="<?php esc_attr_e('Select search category', 'ambrygen-web'); ?>">
                <?php foreach ($types as $type) : ?>
                    <option value="<?php echo esc_url($this->build_search_url($search_term, $type)); ?>" <?php selected($selected_type, $type); ?>>
                        <?php echo esc_html($labels[$type] ?? ucfirst($type)); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    private function render_results_column(array $view_data): string
    {
        ob_start();
        ?>
        <div class="search-modal__results-col" data-search-results-column>
            <div class="search-modal__results-title heading-4 mb-0"><?php esc_html_e('Search Results', 'ambrygen-web'); ?></div>
            <div class="search-modal__stats body2-reg">
                <span id="search-results-count"><?php echo esc_html((string) $view_data['total_results']); ?></span>
                <?php esc_html_e('Results. Page', 'ambrygen-web'); ?>
                <span id="search-current-page"><?php echo esc_html((string) $view_data['current_page']); ?></span>
                <?php esc_html_e('of', 'ambrygen-web'); ?>
                <span id="search-total-pages"><?php echo esc_html((string) $view_data['total_pages']); ?></span>
            </div>

            <?php echo $this->render_filters($view_data['counts'], $view_data['search_term'], $view_data['selected_type']); ?>

            <div id="search-results-list" class="search-modal__results-list">
                <?php if (! empty($view_data['posts'])) : ?>
                    <?php foreach ($view_data['posts'] as $post_data) : ?>
                        <div class="search-result-card">
                            <div class="search-result-card__content">
                                <div class="search-result-card__label"><?php echo esc_html($post_data['post_type_label']); ?></div>
                                <div class="search-result-card__title heading-6"><?php echo esc_html($post_data['title']); ?></div>
                                <div class="search-result-card__excerpt body2-reg">
                                    <?php echo wp_kses_post($post_data['excerpt']); ?>
                                </div>
                                <a href="<?php echo esc_url($post_data['url']); ?>" class="site-btn has-right-arrow btn-medium search-result-card__btn"><?php esc_html_e('Read More', 'ambrygen-web'); ?></a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <div class="search-modal__no-results"><?php esc_html_e('No results found for your search.', 'ambrygen-web'); ?></div>
                <?php endif; ?>
            </div>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    private function render_pagination(array $view_data): string
    {
        if ($view_data['total_pages'] <= 1) {
            return '';
        }
        $current_page = $view_data['current_page'];
        $total_pages  = $view_data['total_pages'];
        $search_term  = $view_data['search_term'];
        $selected_type = $view_data['selected_type'];
        $visible_pages = $this->get_visible_page_numbers($current_page, $total_pages, 5);
        $previous_url = $current_page > 1
            ? $this->build_search_url($search_term, $selected_type, $current_page - 1)
            : '';
        $next_url = $current_page < $total_pages
            ? $this->build_search_url($search_term, $selected_type, $current_page + 1)
            : '';

        ob_start();
        ?>
        <div id="search-pagination" class="search-modal__pagination search-page__pagination">
            <div class="pagination-container">
                <div class="desktop-pages">
                    <button
                        id="desktopprev"
                        class="arrow-btn<?php echo $previous_url ? '' : ' is-disabled'; ?>"
                        type="button"
                        <?php echo $previous_url ? ' data-url="' . esc_url($previous_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        aria-label="<?php esc_attr_e('Previous page', 'ambrygen-web'); ?>"
                    ></button>
                    <div id="paginationList-search" class="pagination-list">
                        <?php foreach ($visible_pages as $page) : ?>
                            <button
                                class="page-btn<?php echo $page === $current_page ? ' active' : ''; ?>"
                                type="button"
                                data-url="<?php echo esc_url($this->build_search_url($search_term, $selected_type, $page)); ?>"
                                <?php echo $page === $current_page ? ' aria-current="page"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                            >
                                <?php echo esc_html((string) $page); ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                    <button
                        id="desktopnext"
                        class="arrow-btn<?php echo $next_url ? '' : ' is-disabled'; ?>"
                        type="button"
                        <?php echo $next_url ? ' data-url="' . esc_url($next_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        aria-label="<?php esc_attr_e('Next page', 'ambrygen-web'); ?>"
                    ></button>
                </div>

                <div class="mobile-pagination">
                    <button
                        id="prevbtn"
                        class="arrow-btn<?php echo $previous_url ? '' : ' is-disabled'; ?>"
                        type="button"
                        <?php echo $previous_url ? ' data-url="' . esc_url($previous_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        aria-label="<?php esc_attr_e('Previous page', 'ambrygen-web'); ?>"
                    ></button>
                    <span class="page-trigger"><?php echo esc_html($current_page . '/' . $total_pages); ?></span>
                    <button
                        id="nextbtn"
                        class="arrow-btn<?php echo $next_url ? '' : ' is-disabled'; ?>"
                        type="button"
                        <?php echo $next_url ? ' data-url="' . esc_url($next_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        aria-label="<?php esc_attr_e('Next page', 'ambrygen-web'); ?>"
                    ></button>
                </div>

                <div id="paginationPopup-search" class="pagination-popup">
                    <div class="popup-body">
                        <div id="popupGrid-search" class="popup-grid">
                            <?php foreach ($visible_pages as $page) : ?>
                                <button
                                    class="page-btn<?php echo $page === $current_page ? ' active' : ''; ?>"
                                    type="button"
                                    data-url="<?php echo esc_url($this->build_search_url($search_term, $selected_type, $page)); ?>"
                                    <?php echo $page === $current_page ? ' aria-current="page"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                >
                                    <?php echo esc_html((string) $page); ?>
                                </button>
                            <?php endforeach; ?>
                        </div>
                        <button
                            id="popupPrev"
                            class="arrow-btn<?php echo $previous_url ? '' : ' is-disabled'; ?>"
                            type="button"
                            <?php echo $previous_url ? ' data-url="' . esc_url($previous_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                            aria-label="<?php esc_attr_e('Previous page', 'ambrygen-web'); ?>"
                        ></button>
                        <button
                            id="popupNext"
                            class="arrow-btn<?php echo $next_url ? '' : ' is-disabled'; ?>"
                            type="button"
                            <?php echo $next_url ? ' data-url="' . esc_url($next_url) . '"' : ' disabled'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                            aria-label="<?php esc_attr_e('Next page', 'ambrygen-web'); ?>"
                        ></button>
                    </div>
                </div>
            </div>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    private function get_visible_page_numbers(int $current_page, int $total_pages, int $max_visible = 5): array
    {
        if ($total_pages <= $max_visible) {
            return range(1, $total_pages);
        }

        $half = (int) floor($max_visible / 2);
        $start = max(1, $current_page - $half);
        $end = $start + $max_visible - 1;

        if ($end > $total_pages) {
            $end = $total_pages;
            $start = max(1, $end - $max_visible + 1);
        }

        return range($start, $end);
    }

    private function get_pagination_items(int $current_page, int $total_pages): array
    {
        if ($total_pages <= 1) {
            return [];
        }

        $pages = [1, $total_pages];

        for ($page = $current_page - 1; $page <= $current_page + 1; $page++) {
            if ($page > 1 && $page < $total_pages) {
                $pages[] = $page;
            }
        }

        $pages = array_values(array_unique(array_filter($pages, static fn(int $page): bool => $page >= 1 && $page <= $total_pages)));
        sort($pages);

        $items = [];
        $previous_page = null;

        foreach ($pages as $page) {
            if (null !== $previous_page && $page - $previous_page > 1) {
                $items[] = [
                    'type' => 'dots',
                ];
            }

            $items[] = [
                'type'    => 'page',
                'page'    => $page,
                'label'   => $page,
                'current' => $page === $current_page,
            ];

            $previous_page = $page;
        }

        return $items;
    }

    private function build_view_data(\WP_Query $query, string $search_term, string $selected_type, int $current_page): array
    {
        $posts = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = [
                    'title'           => get_the_title(),
                    'url'             => get_permalink(),
                    'post_type_label' => $this->get_post_type_label(get_post_type()),
                    'excerpt'         => $this->get_highlighted_excerpt(get_the_excerpt(), $search_term),
                ];
            }
            wp_reset_postdata();
        }

        return [
            'counts'        => $this->get_post_type_counts($search_term),
            'current_page'  => $current_page,
            'posts'         => $posts,
            'search_term'   => $search_term,
            'selected_type' => $selected_type,
            'total_pages'   => max(1, (int) $query->max_num_pages),
            'total_results' => (int) $query->found_posts,
        ];
    }

    private function get_search_query_args(string $search_term, string $selected_type, int $current_page): array
    {
        return [
            's'                   => $search_term,
            'paged'               => $current_page,
            'post_status'         => 'publish',
            'posts_per_page'      => 10,
            'ignore_sticky_posts' => true,
            'post_type'           => 'all' === $selected_type ? self::SEARCHABLE_POST_TYPES : $selected_type,
        ];
    }

    private function get_selected_type(): string
    {
        $selected_type = sanitize_key((string) get_query_var('search_type', 'all'));

        if ('all' === $selected_type || in_array($selected_type, self::SEARCHABLE_POST_TYPES, true)) {
            return $selected_type;
        }

        return 'all';
    }

    private function get_post_type_counts(string $search): array
    {
        if ('' === trim($search)) {
            return ['all' => 0];
        }

        $counts = ['all' => 0];

        foreach (self::SEARCHABLE_POST_TYPES as $post_type) {
            $query = new \WP_Query([
                's'              => $search,
                'post_type'      => $post_type,
                'post_status'    => 'publish',
                'posts_per_page' => 1,
            ]);

            $count = (int) $query->found_posts;
            if ($count > 0) {
                $counts[$post_type] = $count;
                $counts['all'] += $count;
            }
        }

        return $counts;
    }

    private function get_post_type_label(string $post_type): string
    {
        $labels = $this->get_post_type_labels();

        if (isset($labels[$post_type])) {
            return $labels[$post_type];
        }

        $post_type_object = get_post_type_object($post_type);
        return $post_type_object ? (string) $post_type_object->labels->singular_name : ucfirst($post_type);
    }

    private function get_post_type_labels(): array
    {
        return [
            'all' => __('All', 'ambrygen-web'),
            'post' => __('Blog Post', 'ambrygen-web'),
            'page' => __('Web Page', 'ambrygen-web'),
            'webinar' => __('Webinar', 'ambrygen-web'),
            'press_release' => __('Press Release', 'ambrygen-web'),
            'conferences' => __('Conferences', 'ambrygen-web'),
            'presentation' => __('Scientific Presentation', 'ambrygen-web'),
            'poster' => __('Scientific Poster', 'ambrygen-web'),
            'publication' => __('Peer-Reviewed Publication', 'ambrygen-web'),
        ];
    }

    private function build_search_url(string $search_term, string $selected_type, int $page = 1): string
    {
        $args = ['s' => $search_term];

        if ('all' !== $selected_type) {
            $args['search_type'] = $selected_type;
        }

        if ($page > 1) {
            $args['paged'] = $page;
        }

        return add_query_arg($args, home_url('/'));
    }

    private function get_highlighted_excerpt(string $excerpt, string $search_term): string
    {
        $excerpt = wp_trim_words(wp_strip_all_tags($excerpt), 25, '...');
        $excerpt = esc_html($excerpt);

        if ('' === trim($search_term)) {
            return $excerpt;
        }

        $pattern = '/' . preg_quote($search_term, '/') . '/i';

        return (string) preg_replace(
            $pattern,
            '<mark class="search-highlight">$0</mark>',
            $excerpt
        );
    }
}
