<?php

namespace Ambrygen\Theme\Core\Routes;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

/**
 * Global Search AJAX Route Handler
 */
final class GlobalSearchRoute
{
    use Singleton;

    protected function __construct()
    {
        $this->register_hooks();
    }

    private function register_hooks(): void
    {
        add_action('wp_ajax_ambrygen_global_search', [$this, 'handle_search']);
        add_action('wp_ajax_nopriv_ambrygen_global_search', [$this, 'handle_search']);
    }

    /**
     * Handle the AJAX search request
     */
    public function handle_search(): void
    {
        check_ajax_referer('ambrygen-ajax', 'nonce');

        $search = isset($_POST['s']) ? sanitize_text_field(wp_unslash($_POST['s'])) : '';
        $post_type = isset($_POST['post_type']) ? sanitize_text_field(wp_unslash($_POST['post_type'])) : 'all';
        $paged = isset($_POST['paged']) ? absint($_POST['paged']) : 1;

        if (empty($search)) {
            wp_send_json_success([
                'results' => [],
                'counts' => ['all' => 0],
                'total' => 0,
                'total_pages' => 0,
            ]);
        }

        $query_args = [
            's' => $search,
            'posts_per_page' => 10,
            'paged' => $paged,
            'post_status' => 'publish',
        ];

        if ($post_type === 'all' || empty($post_type)) {
            $query_args['post_type'] = ['post', 'page', 'webinar', 'press_release', 'conferences', 'presentation', 'poster', 'publication'];
        } else {
            $query_args['post_type'] = $post_type;
        }

        $query = new \WP_Query($query_args);
        $results = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $results[] = [
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'excerpt' => wp_trim_words(get_the_excerpt(), 25, '...'),
                    'url' => get_permalink(),
                    'post_type' => get_post_type(),
                    'post_type_label' => $this->get_post_type_label(get_post_type()),
                ];
            }
            wp_reset_postdata();
        }

        $counts = $this->get_post_type_counts($search);

        wp_send_json_success([
            'results' => $results,
            'counts' => $counts,
            'total' => $query->found_posts,
            'total_pages' => $query->max_num_pages,
            'current_page' => $paged,
        ]);
    }

    /**
     * Get human-readable label for a post type
     */
    private function get_post_type_label(string $post_type): string
    {
        $obj = get_post_type_object($post_type);
        if (!$obj) {
            return ucfirst($post_type);
        }
        
        switch ($post_type) {
            case 'post':
                return __('Blog Post', 'ambrygen-web');
            case 'press_release':
                return __('Press Release', 'ambrygen-web');
            default:
                return $obj->labels->singular_name;
        }
    }

    /**
     * Get counts for each post type for the given search term
     */
    private function get_post_type_counts(string $search): array
    {
        $post_types = ['post', 'page', 'webinar', 'press_release', 'conferences', 'presentation', 'poster', 'publication'];
        $counts = ['all' => 0];

        foreach ($post_types as $pt) {
            $q = new \WP_Query([
                's' => $search,
                'post_type' => $pt,
                'posts_per_page' => -1,
                'fields' => 'ids',
                'post_status' => 'publish',
            ]);
            $count = $q->found_posts;
            if ($count > 0) {
                $counts[$pt] = $count;
                $counts['all'] += $count;
            }
        }

        return $counts;
    }
}
