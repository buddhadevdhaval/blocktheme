<?php

namespace Ambrygen\Theme\Core\Blog;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class BlogAjaxController
{
    use Singleton;

    protected function __construct()
    {
        add_action('wp_ajax_ambrygen_blog_pagination', [$this, 'handle_pagination']);
        add_action('wp_ajax_nopriv_ambrygen_blog_pagination', [$this, 'handle_pagination']);
    }

    /**
     * AJAX handler for blog pagination.
     */
    public function handle_pagination(): void
    {
        check_ajax_referer('ambrygen-ajax', 'nonce');

        $paged    = isset($_POST['paged']) ? absint($_POST['paged']) : 1;
        $per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 6;
        $search   = isset($_POST['s']) ? sanitize_text_field(wp_unslash($_POST['s'])) : '';

        $tag      = isset($_POST['tag']) ? absint($_POST['tag']) : 0;
        $category = isset($_POST['category']) ? absint($_POST['category']) : 0;

        $paged    = $paged > 0 ? $paged : 1;
        $per_page = $per_page > 0 ? $per_page : 6;

        $query_args = [
            'post_type'      => 'post',
            'posts_per_page' => $per_page,
            'post_status'    => 'publish',
            'paged'          => $paged,
        ];

        if ($search !== '') {
            $query_args['s'] = $search;
        }

        if ($tag > 0) {
            $query_args['tag_id'] = $tag;
        }

        if ($category > 0) {
            $query_args['cat'] = $category;
        }

        $temp_query  = new \WP_Query($query_args);
        $total_pages = max(1, (int) $temp_query->max_num_pages);
        $total_posts = (int) $temp_query->found_posts;

        if ($paged > $total_pages && $total_pages > 0) {
            $paged = 1;
        }

        $scope = isset($_POST['scope']) ? sanitize_text_field(wp_unslash($_POST['scope'])) : '';

        if ($scope === 'latest-blog') {
            $html = BlogRenderer::instance()->render_latest_blog_content($temp_query);
        } else {
            $html = BlogRenderer::instance()->render_ajax_content($paged, $per_page, $search, $tag, $category, $total_pages, $total_posts);
        }

        wp_send_json_success(
            [
                'html'        => $html,
                'current'     => $paged,
                'per_page'    => $per_page,
                'total_pages' => $total_pages,
            ]
        );
    }
}
