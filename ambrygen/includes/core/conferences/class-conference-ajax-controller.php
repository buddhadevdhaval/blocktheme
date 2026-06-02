<?php

namespace Ambrygen\Theme\Core\Conferences;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class ConferenceAjaxController
{
    use Singleton;

    protected function __construct()
    {
        $this->register_hooks();
    }

    private function register_hooks(): void
    {
        add_action('wp_ajax_ambrygen_conference_pagination', [$this, 'handle_pagination']);
        add_action('wp_ajax_nopriv_ambrygen_conference_pagination', [$this, 'handle_pagination']);
    }

    public function handle_pagination(): void
    {
        check_ajax_referer('ambrygen-ajax', 'nonce');

        $paged     = isset($_POST['paged']) ? absint($_POST['paged']) : 1;
        $scope_raw = isset($_POST['scope']) ? sanitize_text_field(wp_unslash($_POST['scope'])) : '';
        $per_page  = isset($_POST['per_page']) ? absint($_POST['per_page']) : 8;
        $search    = isset($_POST['s']) ? sanitize_text_field(wp_unslash($_POST['s'])) : '';
        $year      = isset($_POST['year']) ? absint($_POST['year']) : 0;
        $tag       = isset($_POST['tag']) ? absint($_POST['tag']) : 0;

        $paged    = $paged > 0 ? $paged : 1;
        $scope    = 'past' === $scope_raw ? 'past' : 'upcoming';
        $per_page = $per_page > 0 ? $per_page : 8;

        $today      = date('Y-m-d');
        $query_args = [
            'post_type'      => 'conferences',
            'posts_per_page' => $per_page,
            'post_status'    => 'publish',
        ];
        if (! empty($search)) {
            $query_args['s'] = $search;
        }

        if ('past' === $scope) {
            $query_args['meta_query'] = [
                'relation' => 'AND',
                [
                    'key'     => 'end_at',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE',
                ],
            ];

            if ($year > 0) {
                $query_args['meta_query'][] = [
                    'key'     => 'end_at',
                    'value'   => [$year . '-01-01', $year . '-12-31'],
                    'compare' => 'BETWEEN',
                    'type'    => 'DATE',
                ];
            }
        } else {
            $query_args['meta_query'] = [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '>',
                    'type'    => 'DATE',
                ],
            ];
        }

        if ($tag > 0) {
            $query_args['tag_id'] = $tag;
        }

        $temp_query  = new \WP_Query($query_args);
        $total_pages = max(1, (int) $temp_query->max_num_pages);
        $total_posts = (int) $temp_query->found_posts;

        if ($paged > $total_pages && $total_pages > 0) {
            $paged = 1;
        }

        $html = $this->render_content_from_template($scope, $paged, $per_page, $search, $total_pages, $total_posts, $year, $tag);

        wp_send_json_success([
            'html'        => $html,
            'current'     => $paged,
            'per_page'    => $per_page,
            'total_pages' => $total_pages,
            'year'        => $year,
        ]);
    }

    private function render_content_from_template(string $scope, int $paged, int $per_page = 8, string $s = '', int $total_pages = 1, int $total_posts = 0, int $year = 0, int $tag = 0): string
    {
        $part = 'past' === $scope ? 'parts/past-conferences.html' : 'parts/upcoming-conferences.html';

        $template_path = locate_template($part);
        if (! $template_path || ! file_exists($template_path)) {
            return '';
        }

        $contents = file_get_contents($template_path);
        if (false === $contents || '' === $contents) {
            return '';
        }

        $blocks            = parse_blocks($contents);
        $query_block       = $this->find_first_query_block($blocks);
        $pagination_block  = $this->find_first_block_by_name($blocks, 'ambrygen/conference-archive-pagination');
        if (! $query_block) {
            return '';
        }

        if (! isset($query_block['attrs']['query'])) {
            $query_block['attrs']['query'] = [];
        }

        $query_block['attrs']['query']['perPage'] = $per_page;
        $query_block['attrs']['query']['offset']  = 0;

        if (! empty($s)) {
            $query_block['attrs']['query']['search'] = $s;
        }

        if ($tag > 0) {
            $query_block['attrs']['query']['tagId'] = $tag;
        }

        $query_id = isset($query_block['attrs']['queryId']) ? absint($query_block['attrs']['queryId']) : 0;
        if ($query_id > 0) {
            $_GET['query-' . $query_id . '-page'] = (string) $paged;
        }

        if ($total_posts === 0) {
            return '<div class="no-results-message text-center no-result-alert">No conferences found</div>';
        }

        $html = render_block($query_block);

        if ($pagination_block) {
            $html .= '<div style="height:64px" class="wp-block-spacer is-style-gl-s64" aria-hidden="true"></div>';
            $html .= render_block($pagination_block);
        }

        if ($query_id > 0) {
            unset($_GET['query-' . $query_id . '-page']);
        }

        $html = $this->replace_static_pagination_with_dynamic($html, $paged, $total_pages, $per_page, $scope, $total_posts, $year, $tag);

        return (string) $html;
    }

    private function find_first_query_block(array $blocks): ?array
    {
        foreach ($blocks as $block) {
            if (! is_array($block)) {
                continue;
            }

            if (isset($block['blockName']) && 'core/query' === $block['blockName']) {
                return $block;
            }

            if (! empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $found = $this->find_first_query_block($block['innerBlocks']);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }

    private function find_first_block_by_name(array $blocks, string $block_name): ?array
    {
        foreach ($blocks as $block) {
            if (! is_array($block)) {
                continue;
            }

            if (isset($block['blockName']) && $block_name === $block['blockName']) {
                return $block;
            }

            if (! empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $found = $this->find_first_block_by_name($block['innerBlocks'], $block_name);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }

    private function replace_static_pagination_with_dynamic(string $html, int $paged, int $total_pages, int $per_page, string $scope, int $total_posts, int $year = 0, int $tag = 0): string
    {
        $suffix = 'past' === $scope ? '-past' : '-upcoming';

        $pagination_list_html = $this->generate_pagination_list_html($paged, $total_pages);
        $html                 = preg_replace(
            '/(<div[^>]*id="paginationList' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
            '$1' . $pagination_list_html . '$2',
            $html
        );

        $page_trigger_text = sprintf('%d/%d', $paged, max(1, $total_pages));
        $html              = preg_replace(
            '/(<button[^>]*id="pagetrigger' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/button>)/is',
            '$1' . $page_trigger_text . '$2',
            $html
        );

        $popup_grid_html = $this->generate_popup_grid_html($paged, $total_pages);
        $html            = preg_replace(
            '/(<div[^>]*id="popupGrid' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
            '$1' . $popup_grid_html . '$2',
            $html
        );

        $html = $this->update_per_page_dropdown($html, $per_page, $suffix);

        if ('past' === $scope) {
            $html = $this->update_year_dropdown($html, $year);
        }

        $html = $this->update_tabs($html, $scope, $tag);

        return $html;
    }

    private function generate_pagination_list_html(int $paged, int $total_pages): string
    {
        if ($total_pages <= 1) {
            return '<button class="page-btn active">1</button>';
        }

        $html      = '';
        $range     = 1;
        $show_dots = false;

        for ($i = 1; $i <= $total_pages; $i++) {
            if ($i == 1 || $i == $total_pages || ($i >= $paged - $range && $i <= $paged + $range)) {
                $active     = ($i == $paged) ? ' active' : '';
                $html      .= '<button class="page-btn' . $active . '">' . $i . '</button>';
                $show_dots  = true;
            } elseif ($show_dots) {
                $html      .= '<span class="dots">...</span>';
                $show_dots  = false;
            }
        }

        return $html;
    }

    private function generate_popup_grid_html(int $paged, int $total_pages): string
    {
        $html = '';
        for ($i = 1; $i <= max(1, $total_pages); $i++) {
            $active  = ($i == $paged) ? ' active' : '';
            $html   .= '<button class="page-btn' . $active . '">' . $i . '</button>';
        }
        return $html;
    }

    private function update_per_page_dropdown(string $html, int $per_page, string $suffix): string
    {
        $toggle_id      = 'category-dropdown-btn' . $suffix . '-perpage';
        $toggle_pattern = '/(<button[^>]*id="' . preg_quote($toggle_id, '/') . '"[^>]*>)\K.*?(?=<\/button>)/is';

        $html = preg_replace(
            $toggle_pattern,
            (int) $per_page . ' / page',
            $html
        );

        $options      = [8, 16, 24];
        $menu_id      = 'category-dropdown-menu' . $suffix . '-perpage';
        $menu_pattern = '/(<ul[^>]*id="' . preg_quote($menu_id, '/') . '"[^>]*>)(.*?)(<\/ul>)/is';

        if (preg_match($menu_pattern, $html, $matches)) {
            $menu_content = $matches[2];
            $menu_content = preg_replace('/\s*aria-current="page"/i', '', $menu_content);

            foreach ($options as $opt) {
                if ((int) $opt === (int) $per_page) {
                    $opt_link_pattern = '/<a([^>]*)>(' . preg_quote((string) $opt, '/') . '\s*\/\s*page)<\/a>/is';
                    $menu_content     = preg_replace($opt_link_pattern, '<a$1 aria-current="page">$2</a>', $menu_content);
                }
            }

            $html = str_replace($matches[2], $menu_content, $html);
        }

        return $html;
    }

    private function update_year_dropdown(string $html, int $year): string
    {
        $current_year = (int) date('Y');
        $years        = range($current_year - 10, $current_year + 1);
        rsort($years);

        $dropdown_id = 'category-dropdown-btn-past-year';
        $dropdown_pattern = '/(<button[^>]*id="' . preg_quote($dropdown_id, '/') . '"[^>]*>)\K.*?(?=<\/button>)/is';

        $year_label = $year > 0 ? (string) $year : 'All Years';
        $html = preg_replace($dropdown_pattern, $year_label, $html);

        $menu_id = 'category-dropdown-menu-past-year';
        $menu_pattern = '/(<ul[^>]*id="' . preg_quote($menu_id, '/') . '"[^>]*>)(.*?)(<\/ul>)/is';

        if (preg_match($menu_pattern, $html, $matches)) {
            $menu_content = $matches[2];
            $menu_content = preg_replace('/\s*aria-current="page"/i', '', $menu_content);

            foreach ($years as $yr) {
                if ((int) $yr === (int) $year) {
                    $yr_link_pattern = '/<a([^>]*)>(' . preg_quote((string) $yr, '/') . ')<\/a>/is';
                    $menu_content = preg_replace($yr_link_pattern, '<a$1 aria-current="page">$2</a>', $menu_content);
                }
            }

            $html = str_replace($matches[2], $menu_content, $html);
        }

        return $html;
    }

    private function update_tabs(string $html, string $scope, int $tag): string
    {
        return $html;
    }
}
