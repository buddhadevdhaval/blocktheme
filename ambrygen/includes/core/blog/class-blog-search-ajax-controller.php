<?php

namespace Ambrygen\Theme\Core\Blog;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class BlogSearchAjaxController
{
    use Singleton;

    protected function __construct()
    {
        $this->register_hooks();
    }

    private function register_hooks(): void
    {
        add_action('wp_ajax_ambrygen_search_posts', [$this, 'handle_search']);
    }

    public function handle_search(): void
    {
        if (! isset($_POST['nonce']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce']), 'ambrygen_post_search'))) {
            wp_send_json_error(__('Invalid nonce.', 'ambrygen-web'));
        }

        if (! current_user_can('edit_posts')) {
            wp_send_json_error(__('Unauthorized.', 'ambrygen-web'));
        }

        $search_term = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])) : '';
        $post_type = isset($_POST['post_type']) ? sanitize_text_field(wp_unslash($_POST['post_type'])) : '';
        $exclude_ids = isset($_POST['exclude_ids']) ? array_map('absint', (array) $_POST['exclude_ids']) : [];

        if (empty($search_term)) {
            wp_send_json_error(__('Search term is required.', 'ambrygen-web'));
        }

        $args = [
            's'              => $search_term,
            'post_status'    => 'publish',
            'posts_per_page' => 20,
            'post__not_in'   => $exclude_ids,
        ];

        if (! empty($post_type)) {
            $args['post_type'] = $post_type;
        } else {
            $args['post_type'] = 'any';
        }

        $query = new \WP_Query($args);
        $posts = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post = get_post();
                $post_type_obj = get_post_type_object($post->post_type);

                $posts[] = [
                    'id'               => $post->ID,
                    'title'            => get_the_title($post),
                    'post_type'        => $post->post_type,
                    'post_type_label'  => $post_type_obj ? $post_type_obj->labels->singular_name : $post->post_type,
                    'view_url'         => get_permalink($post),
                    'edit_url'         => get_edit_post_link($post->ID, ''),
                ];
            }
            wp_reset_postdata();
        }

        wp_send_json_success(['posts' => $posts]);
    }
}
