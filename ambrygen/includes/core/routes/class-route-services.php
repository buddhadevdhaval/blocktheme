<?php

namespace Ambrygen\Theme\Core\Routes;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;


final class ConferenceRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('query_loop_block_query_vars', [$this, 'filter_in_progress_query'], 10, 2);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^conference/([^/]+)/([^/]+)$#', $trimmed_path, $matches)
            && ! preg_match('#^conferences/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'conferences';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^conference/([^/]+)/([^/]+)/?$',
            'index.php?post_type=conferences&_old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );

        add_rewrite_rule(
            '^conferences/([^/]+)/([^/]+)/?$',
            'index.php?post_type=conferences&_old_id=$matches[1]&pr_name=$matches[2]',
            'bottom'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('conferences' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_name = sanitize_title($pr_name);

        if (! empty($old_id) && ! empty($pr_name)) {
            $post_link = home_url('/conference/' . $old_id . '/' . $pr_name);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'conferences' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (empty($old_id) || empty($pr_name)) {
            return;
        }

        $matched_posts = get_posts([
            'post_type'      => 'conferences',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_old_id',
                    'value' => $old_id,
                ],
            ],
        ]);

        if (empty($matched_posts)) {
            if (ctype_digit((string) $old_id)) {
                $post_by_id = get_post((int) $old_id);

                if ($post_by_id instanceof \WP_Post && 'conferences' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                    $matched_posts = [$post_by_id->ID];
                }
            }
        }

        if (empty($matched_posts)) {
            $matched_posts = get_posts([
                'post_type'      => 'conferences',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'name'           => sanitize_title((string) $pr_name),
            ]);
        }

        if (empty($matched_posts)) {
            return;
        }

        $matched_post_id = (int) $matched_posts[0];
        $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
        $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

        $query->set('p', $matched_post_id);
        $query->set('post_type', 'conferences');
        $query->set('post_status', 'publish');
        $query->set('name', get_post_field('post_name', $matched_post_id));
        $query->set('_old_id', $old_id);
        $query->set('pr_name', $matched_pr_slug);
        $query->set('posts_per_page', 1);
        $query->is_single = true;
        $query->is_singular = true;
        $query->is_archive = false;
        $query->is_home = false;
        $query->is_post_type_archive = false;
        $query->is_404 = false;
    }

    public function filter_in_progress_query(array $query, \WP_Block $block): array
    {
        if (!isset($block->context['queryId'])) {
            return $query;
        }

        $query_id = (int) $block->context['queryId'];
        $today = date('Y-m-d');

        // 1. In-Progress Conferences
        if (1 === $query_id) {
            $query['posts_per_page'] = -1;
            $query['meta_query'] = [
                'relation' => 'AND',
                [
                    'key' => 'start_at',
                    'value' => $today,
                    'compare' => '<=',
                    'type' => 'DATE',
                ],
                [
                    'key' => 'end_at',
                    'value' => $today,
                    'compare' => '>=',
                    'type' => 'DATE',
                ],
            ];
        }

        // 10. In-Progress Webinars
        if (10 === $query_id) {
            $query['posts_per_page'] = -1;
            $query['meta_query'] = [
                [
                    'key' => 'start_at',
                    'value' => $today,
                    'compare' => '=',
                    'type' => 'DATE',
                ],
            ];
        }

        // 2. Upcoming Conferences
        if (2 === $query_id) {
            $query['meta_query'] = [
                [
                    'key' => 'start_at',
                    'value' => $today,
                    'compare' => '>',
                    'type' => 'DATE',
                ],
            ];
            $query['orderby'] = 'meta_value';
            $query['meta_key'] = 'start_at';
            $query['order'] = 'ASC';
        }

        // 3. Past Conferences
        if (3 === $query_id) {
            $query['meta_query'] = [
                'relation' => 'AND',
                [
                    'key'     => 'end_at',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE',
                ],
            ];

            $query['orderby']  = 'meta_value';
            $query['meta_key'] = 'end_at';
            $query['order']    = 'DESC';

            // Determine Year filter
            $year = 0;
            if (isset($_POST['year']) && 'ambrygen_conference_pagination' === ($_POST['action'] ?? '')) {
                $year = absint($_POST['year']);
            } elseif (! wp_doing_ajax()) {
                // Initial page load: Default to the latest available year
                $years = Helper::get_past_conference_years();
                if (! empty($years)) {
                    $year = $years[0];
                }
            }

            if ($year > 0) {
                $query['meta_query'][] = [
                    'key'     => 'end_at',
                    'value'   => [$year . '-01-01', $year . '-12-31'],
                    'compare' => 'BETWEEN',
                    'type'    => 'DATE',
                ];
            }
        }

        // 20. Upcoming Webinars
        if (20 === $query_id) {
            $query['meta_query'] = [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '>',
                    'type'    => 'DATE',
                ],
            ];
            $query['orderby']  = 'meta_value';
            $query['meta_key'] = 'start_at';
            $query['order']    = 'ASC';
        }

        // 30. Past Webinars
        if (30 === $query_id) {
            $query['meta_query'] = [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE',
                ],
            ];
            $query['orderby']  = 'meta_value';
            $query['meta_key'] = 'start_at';
            $query['order']    = 'DESC';

            // Determine Year filter
            $year = 0;
            if (isset($_POST['year']) && 'ambrygen_webinar_pagination' === ($_POST['action'] ?? '')) {
                $year = absint($_POST['year']);
            } elseif (! wp_doing_ajax()) {
                // Initial page load: Default to current year or latest available
                $years = Helper::get_past_webinar_years();
                if (! empty($years)) {
                    $year = $years[0];
                }
            }

            if ($year > 0) {
                // Use BETWEEN for meta_query on start_at field
                $query['meta_query'][] = [
                    'key'     => 'start_at',
                    'value'   => [$year . '-01-01', $year . '-12-31'],
                    'compare' => 'BETWEEN',
                    'type'    => 'DATE',
                ];
            }
        }

        // Apply tag filter if set
        $tag    = 0;
        $action = $_POST['action'] ?? '';
        if (isset($_POST['tag'])) {
            if ((20 === $query_id || 30 === $query_id) && 'ambrygen_webinar_pagination' === $action) {
                $tag = absint($_POST['tag']);
            } elseif ((2 === $query_id || 3 === $query_id) && 'ambrygen_conference_pagination' === $action) {
                $tag = absint($_POST['tag']);
            }
        }

        if ($tag > 0) {
            if (20 === $query_id || 30 === $query_id) {
                $query['tax_query'] = [
                    [
                        'taxonomy' => 'post_tag',
                        'field'    => 'term_id',
                        'terms'    => [$tag],
                    ],
                ];
            } else {
                $query['tag_id'] = $tag;
            }
        }

        return $query;
    }
}

final class PressReleaseRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^company/press-release/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'press-releases';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^company/press-release/([^/]+)/([^/]+)/?$',
            'index.php?post_type=press-releases&_old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('press-releases' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($pr_slug)) {
            return home_url('/company/press-release/' . $route_id . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'press-releases' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (empty($old_id) || empty($pr_name)) {
            return;
        }

        $matched_posts = get_posts([
            'post_type'      => 'press-releases',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_old_id',
                    'value' => $old_id,
                ],
            ],
        ]);

        if (empty($matched_posts)) {
            if (ctype_digit((string) $old_id)) {
                $post_by_id = get_post((int) $old_id);

                if ($post_by_id instanceof \WP_Post && 'press-releases' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                    $matched_posts = [$post_by_id->ID];
                }
            }
        }

        if (empty($matched_posts)) {
            $matched_posts = get_posts([
                'post_type'      => 'press-releases',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'name'           => sanitize_title((string) $pr_name),
            ]);
        }

        if (empty($matched_posts)) {
            return;
        }

        $matched_post_id = (int) $matched_posts[0];
        $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
        $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

        $query->set('p', $matched_post_id);
        $query->set('post_type', 'press-releases');
        $query->set('post_status', 'publish');
        $query->set('name', get_post_field('post_name', $matched_post_id));
        $query->set('_old_id', $old_id);
        $query->set('pr_name', $matched_pr_slug);
        $query->set('posts_per_page', 1);
        $query->is_single = true;
        $query->is_singular = true;
        $query->is_archive = false;
        $query->is_home = false;
        $query->is_post_type_archive = false;
        $query->is_404 = false;
    }
}

final class PostRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('pre_handle_404', [$this, 'prevent_resolved_single_404'], 10, 2);
        add_action('template_redirect', [$this, 'redirect_to_canonical_permalink']);
        add_action('template_redirect', [$this, 'send_resolved_single_status']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (preg_match('#^([^/]+)/blog/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            $wp->query_vars['post_type']      = 'post';
            $wp->query_vars['category_name']  = sanitize_title($matches[1]);
            $wp->query_vars['_old_id']        = sanitize_text_field($matches[2]);
            $wp->query_vars['pr_name']        = sanitize_title($matches[3]);
            return;
        }

        if (preg_match('#^([^/]+)/blog/([^/]+)$#', $trimmed_path, $matches)) {
            $wp->query_vars['post_type']      = 'post';
            $wp->query_vars['category_name']  = sanitize_title($matches[1]);
            $wp->query_vars['name']           = sanitize_title($matches[2]);
        }
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^([^/]+)/blog/([^/]+)/([^/]+)/?$',
            'index.php?post_type=post&category_name=$matches[1]&_old_id=$matches[2]&pr_name=$matches[3]',
            'top'
        );

        add_rewrite_rule(
            '^([^/]+)/blog/([^/]+)/?$',
            'index.php?post_type=post&category_name=$matches[1]&name=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('post' !== $post->post_type) {
            return $post_link;
        }

        $categories = get_the_category($post->ID);
        if (empty($categories) || ! isset($categories[0]->slug)) {
            return $post_link;
        }

        $category_slug = sanitize_title($categories[0]->slug);
        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($pr_slug)) {
            return home_url('/' . $category_slug . '/blog/' . $route_id . '/' . $pr_slug);
        }

        if (empty($post->post_name)) {
            return $post_link;
        }

        return home_url('/' . $category_slug . '/blog/' . $post->post_name);
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'post' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');
        $category_name = sanitize_title((string) $query->get('category_name'));

        if (empty($category_name)) {
            return;
        }

        if (empty($old_id) || empty($pr_name)) {
            $post_name = sanitize_title((string) $query->get('name'));

            if (empty($post_name)) {
                return;
            }

            $matched_posts = get_posts([
                'name'           => $post_name,
                'post_type'      => 'post',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ]);

            if (empty($matched_posts)) {
                $query->set_404();
                return;
            }

            $matched_post_id = (int) $matched_posts[0];
            if (! has_category($category_name, $matched_post_id)) {
                $query->set_404();
                return;
            }

            $query->set('p', $matched_post_id);
            $query->set('post_type', 'post');
            $query->set('post_status', 'publish');
            $query->set('name', get_post_field('post_name', $matched_post_id));
            $query->set('category_name', '');
            $query->set('cat', '');
            $query->set('posts_per_page', 1);
            $query->is_single = true;
            $query->is_singular = true;
            $query->is_archive = false;
            $query->is_category = false;
            $query->is_home = false;
            $query->is_post_type_archive = false;
            $query->is_404 = false;
            return;
        }

        $matched_posts = get_posts([
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_old_id',
                    'value' => $old_id,
                ],
            ],
        ]);

        if (empty($matched_posts)) {
            if (ctype_digit((string) $old_id)) {
                $post_by_id = get_post((int) $old_id);

                if ($post_by_id instanceof \WP_Post && 'post' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                    $matched_posts = [$post_by_id->ID];
                }
            }
        }

        if (empty($matched_posts)) {
            $matched_posts = get_posts([
                'post_type'      => 'post',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'name'           => sanitize_title((string) $pr_name),
            ]);
        }

        if (empty($matched_posts)) {
            $query->set_404();
            return;
        }

        $matched_post_id = (int) $matched_posts[0];
        $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
        $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

        if (! has_category($category_name, $matched_post_id)) {
            $query->set_404();
            return;
        }

        $query->set('p', $matched_post_id);
        $query->set('post_type', 'post');
        $query->set('post_status', 'publish');
        $query->set('name', get_post_field('post_name', $matched_post_id));
        $query->set('_old_id', $old_id);
        $query->set('pr_name', $matched_pr_slug);
        $query->set('category_name', '');
        $query->set('cat', '');
        $query->set('posts_per_page', 1);
        $query->is_single = true;
        $query->is_singular = true;
        $query->is_archive = false;
        $query->is_category = false;
        $query->is_home = false;
        $query->is_post_type_archive = false;
        $query->is_404 = false;
    }

    public function redirect_to_canonical_permalink(): void
    {
        if (is_admin() || ! is_singular('post')) {
            return;
        }

        $post = get_queried_object();
        if (! $post instanceof \WP_Post || 'post' !== $post->post_type) {
            return;
        }

        $canonical_url = get_permalink($post);
        if (empty($canonical_url)) {
            return;
        }

        $requested_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
        $canonical_path = wp_parse_url($canonical_url, PHP_URL_PATH);

        if (! is_string($requested_path) || ! is_string($canonical_path)) {
            return;
        }

        $requested_path = untrailingslashit($requested_path);
        $canonical_path = untrailingslashit($canonical_path);

        if ($requested_path === $canonical_path) {
            return;
        }

        wp_safe_redirect($canonical_url, 301);
        exit;
    }

    public function prevent_resolved_single_404($preempt, \WP_Query $query)
    {
        if (! $query->is_main_query()) {
            return $preempt;
        }

        if ('post' !== $query->get('post_type')) {
            return $preempt;
        }

        if (! $query->is_singular || (int) $query->get('p') <= 0) {
            return $preempt;
        }

        $query->is_404 = false;

        return true;
    }

    public function send_resolved_single_status(): void
    {
        if (! is_singular('post')) {
            return;
        }

        global $wp_query;

        if (! $wp_query instanceof \WP_Query || (int) $wp_query->get('p') <= 0) {
            return;
        }

        $wp_query->is_404 = false;

        if (! headers_sent()) {
            status_header(200);
        }
    }
}

final class WebinarRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('pre_handle_404', [$this, 'prevent_resolved_single_404'], 10, 2);
        add_action('template_redirect', [$this, 'send_resolved_single_status']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^providers/webinar/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'webinar';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^providers/webinar/([^/]+)/([^/]+)/?$',
            'index.php?post_type=webinar&_old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('webinar' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($pr_slug)) {
            return home_url('/providers/webinar/' . $route_id . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'webinar' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (empty($old_id) || empty($pr_name)) {
            return;
        }

        $matched_posts = get_posts([
            'post_type'      => 'webinar',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_old_id',
                    'value' => $old_id,
                ],
            ],
        ]);

        if (empty($matched_posts) && ctype_digit((string) $old_id)) {
            $post_by_id = get_post((int) $old_id);

            if ($post_by_id instanceof \WP_Post && 'webinar' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                $matched_posts = [$post_by_id->ID];
            }
        }

        if (empty($matched_posts)) {
            $matched_posts = get_posts([
                'post_type'      => 'webinar',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'name'           => sanitize_title((string) $pr_name),
            ]);
        }

        if (empty($matched_posts)) {
            return;
        }

        $matched_post_id = (int) $matched_posts[0];
        $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
        $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

        $query->set('p', $matched_post_id);
        $query->set('post_type', 'webinar');
        $query->set('post_status', 'publish');
        $query->set('name', get_post_field('post_name', $matched_post_id));
        $query->set('_old_id', $old_id);
        $query->set('pr_name', $matched_pr_slug);
        $query->set('posts_per_page', 1);
        $query->is_single = true;
        $query->is_singular = true;
        $query->is_archive = false;
        $query->is_home = false;
        $query->is_post_type_archive = false;
        $query->is_404 = false;
    }

    public function prevent_resolved_single_404($preempt, \WP_Query $query)
    {
        if (! $query->is_main_query()) {
            return $preempt;
        }

        if ('webinar' !== $query->get('post_type')) {
            return $preempt;
        }

        if (! $query->is_singular || ! $query->get('p')) {
            return $preempt;
        }

        $query->is_404 = false;

        return true;
    }

    public function send_resolved_single_status(): void
    {
        if (! is_singular('webinar')) {
            return;
        }

        global $wp_query;

        if (! $wp_query instanceof \WP_Query || ! $wp_query->get('p')) {
            return;
        }

        $wp_query->is_404 = false;

        if (! headers_sent()) {
            status_header(200);
        }
    }
}

final class GeneticTestingRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('pre_handle_404', [$this, 'prevent_resolved_single_404'], 10, 2);
        add_action('template_redirect', [$this, 'send_resolved_single_status']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^providers/genetic-testing/([^/]+)/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type']      = 'genetic-testing';
        $wp->query_vars['_old_id']        = sanitize_text_field($matches[1]);
        $wp->query_vars['childtaxonomy']  = sanitize_title($matches[2]);
        $wp->query_vars['pr_name']        = sanitize_title($matches[3]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%childtaxonomy%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^providers/genetic-testing/([^/]+)/([^/]+)/([^/]+)/?$',
            'index.php?post_type=genetic-testing&_old_id=$matches[1]&childtaxonomy=$matches[2]&pr_name=$matches[3]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'childtaxonomy';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('genetic-testing' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = $this->get_genetic_testing_slug($post);
        $childtaxonomy = $this->get_genetic_testing_term_slug($post->ID);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($childtaxonomy) && ! empty($pr_slug)) {
            return home_url('/providers/genetic-testing/' . $route_id . '/' . $childtaxonomy . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'genetic-testing' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $childtaxonomy = sanitize_title((string) $query->get('childtaxonomy'));
        $pr_name = $query->get('pr_name');

        if (empty($old_id) || empty($childtaxonomy) || empty($pr_name)) {
            return;
        }

        $matched_posts = get_posts([
            'post_type'      => 'genetic-testing',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'   => '_old_id',
                    'value' => $old_id,
                ],
            ],
        ]);

        if (empty($matched_posts)) {
            if (ctype_digit((string) $old_id)) {
                $post_by_id = get_post((int) $old_id);

                if ($post_by_id instanceof \WP_Post && 'genetic-testing' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                    $matched_posts = [$post_by_id->ID];
                }
            }
        }

        if (empty($matched_posts)) {
            $matched_posts = get_posts([
                'post_type'      => 'genetic-testing',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'name'           => sanitize_title((string) $pr_name),
            ]);
        }

        if (empty($matched_posts)) {
            return;
        }

        $matched_post_id = (int) $matched_posts[0];
        $matched_post = get_post($matched_post_id);
        if (! $matched_post instanceof \WP_Post) {
            return;
        }

        $matched_pr_slug = $this->get_genetic_testing_slug($matched_post);
        $matched_term_slug = $this->get_genetic_testing_term_slug($matched_post_id);

        if ($matched_term_slug !== $childtaxonomy) {
            return;
        }

        $query->set('p', $matched_post_id);
        $query->set('post_type', 'genetic-testing');
        $query->set('post_status', 'publish');
        $query->set('name', get_post_field('post_name', $matched_post_id));
        $query->set('_old_id', $old_id);
        $query->set('childtaxonomy', $matched_term_slug);
        $query->set('pr_name', $matched_pr_slug);
        $query->set('posts_per_page', 1);
        $query->is_single = true;
        $query->is_singular = true;
        $query->is_archive = false;
        $query->is_home = false;
        $query->is_post_type_archive = false;
        $query->is_404 = false;
    }

    public function prevent_resolved_single_404($preempt, \WP_Query $query)
    {
        if (! $query->is_main_query()) {
            return $preempt;
        }

        if ('genetic-testing' !== $query->get('post_type')) {
            return $preempt;
        }

        if (! $query->is_singular || ! $query->get('p')) {
            return $preempt;
        }

        $query->is_404 = false;

        return true;
    }

    public function send_resolved_single_status(): void
    {
        if (! is_singular('genetic-testing')) {
            return;
        }

        global $wp_query;

        if (! $wp_query instanceof \WP_Query || ! $wp_query->get('p')) {
            return;
        }

        if (! headers_sent()) {
            status_header(200);
        }
    }

    private function get_genetic_testing_term_slug(int $post_id): string
    {
        $terms = get_the_terms($post_id, 'poster_category');
        if (! is_array($terms) || empty($terms)) {
            return '';
        }

        $preferred_term = null;
        foreach ($terms as $term) {
            if (! $term instanceof \WP_Term) {
                continue;
            }

            if ($term->parent > 0) {
                $preferred_term = $term;
                break;
            }

            if (null === $preferred_term) {
                $preferred_term = $term;
            }
        }

        if (! $preferred_term instanceof \WP_Term) {
            return '';
        }

        return sanitize_title($preferred_term->slug);
    }

    private function get_genetic_testing_slug(\WP_Post $post): string
    {
        $pr_name = (string) get_post_meta($post->ID, 'pr_name', true);
        $slug_source = '' !== $pr_name ? $pr_name : $post->post_title;

        $slug_source = str_replace(
            ['®', '™', '(R)', '(TM)'],
            '',
            $slug_source
        );

        $slug = sanitize_title($slug_source);
        if ('' !== $slug) {
            return $slug;
        }

        return sanitize_title($post->post_name);
    }
}

final class PresentationRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('query_loop_block_query_vars', [$this, 'filter_archive_query_loop_vars'], 10, 2);
        add_filter('pre_handle_404', [$this, 'prevent_resolved_single_404'], 10, 2);
        add_action('template_redirect', [$this, 'send_resolved_single_status']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^science/scientific-presentation/([^/]+)/([^/]+)$#', $trimmed_path, $matches)
            && ! preg_match('#^scientific-presentation/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'presentation';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^scientific-presentation/([^/]+)/([^/]+)/?$',
            'index.php?post_type=presentation&_old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'conference_id';
        $vars[] = 'speaker';
        $vars[] = 'collaborator';
        $vars[] = 'presentation-search';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('presentation' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($pr_slug)) {
            $post_link = home_url('/science/scientific-presentation/' . $route_id . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'presentation' !== $query->get('post_type')) {
            return;
        }

        $_old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (! empty($_old_id) && ! empty($pr_name)) {
            $matched_posts = get_posts([
                'post_type'      => 'presentation',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'meta_query'     => [
                    [
                        'key'   => '_old_id',
                        'value' => $_old_id,
                    ],
                ],
            ]);

            if (empty($matched_posts)) {
                if (ctype_digit((string) $_old_id)) {
                    $post_by_id = get_post((int) $_old_id);

                    if ($post_by_id instanceof \WP_Post && 'presentation' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                        $matched_posts = [$post_by_id->ID];
                    }
                }
            }

            if (empty($matched_posts)) {
                $matched_posts = get_posts([
                    'post_type'      => 'presentation',
                    'post_status'    => 'publish',
                    'posts_per_page' => 1,
                    'fields'         => 'ids',
                    'name'           => sanitize_title((string) $pr_name),
                ]);
            }

            if (empty($matched_posts)) {
                return;
            }

            $matched_post_id = (int) $matched_posts[0];
            $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
            $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

            $query->set('p', $matched_post_id);
            $query->set('post_type', 'presentation');
            $query->set('post_status', 'publish');
            $query->set('name', get_post_field('post_name', $matched_post_id));
            $query->set('_old_id', $_old_id);
            $query->set('pr_name', $matched_pr_slug);
            $query->set('posts_per_page', 1);
            $query->is_single = true;
            $query->is_singular = true;
            $query->is_archive = false;
            $query->is_home = false;
            $query->is_post_type_archive = false;
            $query->is_404 = false;
            return;
        }

        if ($query->is_post_type_archive('presentation') || ('presentation' === $query->get('post_type') && ! $_old_id && ! $pr_name)) {
            $this->apply_presentation_archive_filters_to_query($query);
        }
    }

    public function filter_archive_query_loop_vars(array $query, \WP_Block $block): array
    {
        $post_type = isset($query['postType']) ? (string) $query['postType'] : (isset($query['post_type']) ? (string) $query['post_type'] : '');
        if ('presentation' !== $post_type || ! is_post_type_archive('presentation')) {
            return $query;
        }

        return $this->apply_presentation_archive_filters_to_query_vars($query);
    }

    private function apply_presentation_archive_filters_to_query(\WP_Query $query): void
    {
        $search_term   = sanitize_text_field((string) $query->get('s'));
        $conference_id = absint($query->get('conference_id'));
        $speaker       = sanitize_text_field((string) $query->get('speaker'));
        $collaborator  = sanitize_text_field((string) $query->get('collaborator'));

        if ('' === $search_term && isset($_GET['presentation-search'])) {
            $search_term = sanitize_text_field(wp_unslash($_GET['presentation-search']));
            if ('' !== $search_term) {
                $query->set('s', $search_term);
            }
        }

        if ($conference_id <= 0 && isset($_GET['conference_id'])) {
            $conference_id = absint(wp_unslash($_GET['conference_id']));
        }

        if ('' === $speaker && isset($_GET['speaker'])) {
            $speaker = sanitize_text_field(wp_unslash($_GET['speaker']));
        }

        if ('' === $collaborator && isset($_GET['collaborator'])) {
            $collaborator = sanitize_text_field(wp_unslash($_GET['collaborator']));
        }

        $matching_post_ids = $this->get_filtered_presentation_ids($conference_id, $speaker, $collaborator);
        if (null === $matching_post_ids) {
            $this->apply_presentation_archive_sorting_to_query($query);
            return;
        }

        $query->set('post__in', ! empty($matching_post_ids) ? $matching_post_ids : [0]);
        $this->apply_presentation_archive_sorting_to_query($query);
    }

    private function apply_presentation_archive_filters_to_query_vars(array $query): array
    {
        if (isset($_GET['presentation-search'])) {
            $query['search'] = sanitize_text_field(wp_unslash($_GET['presentation-search']));
        }

        $conference_id = isset($_GET['conference_id']) ? absint(wp_unslash($_GET['conference_id'])) : 0;
        $speaker       = isset($_GET['speaker']) ? sanitize_text_field(wp_unslash($_GET['speaker'])) : '';
        $collaborator  = isset($_GET['collaborator']) ? sanitize_text_field(wp_unslash($_GET['collaborator'])) : '';

        $matching_post_ids = $this->get_filtered_presentation_ids($conference_id, $speaker, $collaborator);
        if (null === $matching_post_ids) {
            return $this->apply_presentation_archive_sorting_to_query_vars($query);
        }

        $query['post__in'] = ! empty($matching_post_ids) ? $matching_post_ids : [0];

        return $this->apply_presentation_archive_sorting_to_query_vars($query);
    }

    private function apply_presentation_archive_sorting_to_query(\WP_Query $query): void
    {
        $query->set('meta_key', 'start_at');
        $query->set('orderby', [
            'meta_value' => 'DESC',
            'date'       => 'DESC',
        ]);
        $query->set('meta_type', 'DATE');
        $query->set('order', 'DESC');
    }

    private function apply_presentation_archive_sorting_to_query_vars(array $query): array
    {
        $query['meta_key']  = 'start_at';
        $query['orderby']   = [
            'meta_value' => 'DESC',
            'date'       => 'DESC',
        ];
        $query['meta_type'] = 'DATE';
        $query['order']     = 'DESC';

        return $query;
    }

    /**
     * @return int[]|null
     */
    private function get_filtered_presentation_ids(int $conference_id, string $speaker, string $collaborator): ?array
    {
        $has_conference_filter = $conference_id > 0;
        $has_speaker_filter    = '' !== $speaker;
        $has_collab_filter     = '' !== $collaborator;

        if (! $has_conference_filter && ! $has_speaker_filter && ! $has_collab_filter) {
            return null;
        }

        $matching_sets = [];

        if ($has_conference_filter) {
            $matching_sets[] = $this->get_presentation_ids_by_conference($conference_id);
        }

        if ($has_speaker_filter) {
            $matching_sets[] = $this->get_presentation_ids_by_speaker($speaker);
        }

        if ($has_collab_filter) {
            $matching_sets[] = $this->get_presentation_ids_by_collaborator_slug($collaborator);
        }

        if (empty($matching_sets)) {
            return null;
        }

        $matching_post_ids = array_shift($matching_sets);
        foreach ($matching_sets as $matching_set) {
            $matching_post_ids = array_values(array_intersect($matching_post_ids, $matching_set));
        }

        return array_values(array_unique(array_filter(array_map('absint', $matching_post_ids))));
    }

    public function prevent_resolved_single_404($preempt, \WP_Query $query)
    {
        if (! $query->is_main_query()) {
            return $preempt;
        }

        if ('presentation' !== $query->get('post_type')) {
            return $preempt;
        }

        if (! $query->is_singular || (int) $query->get('p') <= 0) {
            return $preempt;
        }

        $query->is_404 = false;

        return true;
    }

    public function send_resolved_single_status(): void
    {
        if (! is_singular('presentation')) {
            return;
        }

        global $wp_query;

        if (! $wp_query instanceof \WP_Query || (int) $wp_query->get('p') <= 0) {
            return;
        }

        $wp_query->is_404 = false;

        if (! headers_sent()) {
            status_header(200);
        }
    }

    /**
     * @return int[]
     */
    private function get_presentation_ids_by_conference(int $conference_id): array
    {
        if ($conference_id <= 0 || 'conferences' !== get_post_type($conference_id)) {
            return [];
        }

        $linked_post_ids = get_post_meta($conference_id, 'linked_posts', true);
        if (empty($linked_post_ids)) {
            return [];
        }

        if (! is_array($linked_post_ids)) {
            $linked_post_ids = [$linked_post_ids];
        }

        $matching_post_ids = [];
        foreach ($linked_post_ids as $linked_post_id) {
            $linked_post_id = absint($linked_post_id);
            if ($linked_post_id > 0 && 'presentation' === get_post_type($linked_post_id)) {
                $matching_post_ids[] = $linked_post_id;
            }
        }

        return array_values(array_unique($matching_post_ids));
    }

    /**
     * @return int[]
     */
    private function get_presentation_ids_by_speaker(string $speaker): array
    {
        $speaker = trim($speaker);
        if ('' === $speaker) {
            return [];
        }

        $presentation_ids = get_posts([
            'post_type'      => 'presentation',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);
        if (! is_array($presentation_ids) || empty($presentation_ids)) {
            return [];
        }

        $matching_post_ids = [];
        foreach ($presentation_ids as $presentation_id) {
            $presentation_id = absint($presentation_id);
            if ($presentation_id <= 0) {
                continue;
            }

            $speakers = Helper::get_presentation_speakers($presentation_id);
            if (in_array($speaker, $speakers, true)) {
                $matching_post_ids[] = $presentation_id;
            }
        }

        return array_values(array_unique($matching_post_ids));
    }

    /**
     * @return int[]
     */
    private function get_presentation_ids_by_collaborator_slug(string $collaborator_slug): array
    {
        $collaborator_slug = sanitize_title($collaborator_slug);
        if ('' === $collaborator_slug) {
            return [];
        }

        $presentation_ids = get_posts([
            'post_type'      => 'presentation',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'tax_query'      => [
                [
                    'taxonomy' => 'collaborator',
                    'field'    => 'slug',
                    'terms'    => [$collaborator_slug],
                ],
            ],
        ]);

        return array_values(array_unique(array_filter(array_map('absint', is_array($presentation_ids) ? $presentation_ids : []))));
    }
}

final class PosterRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('pre_handle_404', [$this, 'prevent_resolved_single_404'], 10, 2);
        add_action('template_redirect', [$this, 'send_resolved_single_status']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^science/scientific-poster/([^/]+)/([^/]+)$#', $trimmed_path, $matches)
            && ! preg_match('#^scientific-poster/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'poster';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%_old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^scientific-poster/([^/]+)/([^/]+)/?$',
            'index.php?post_type=poster&_old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'conference_id';
        $vars[] = 'poster_author';
        $vars[] = 'collaborator';
        $vars[] = 'poster-search';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('poster' !== $post->post_type) {
            return $post_link;
        }

        // New manually created posters often have no legacy ID yet.
        // Fall back to the real post ID so the custom single route still resolves.
        $old_id = get_post_meta($post->ID, '_old_id', true);
        $old_id = '' !== (string) $old_id ? $old_id : (string) $post->ID;
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);

        if (! empty($old_id) && ! empty($pr_slug)) {
            $post_link = home_url('/science/scientific-poster/' . $old_id . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        // Keep front-end archive/single routing logic from altering wp-admin post lists.
        if (is_admin()) {
            return;
        }

        if ($query->get('post_type') && 'poster' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (! empty($old_id) && ! empty($pr_name)) {
            $matched_posts = get_posts([
                'post_type'      => 'poster',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'meta_query'     => [
                    [
                        'key'   => '_old_id',
                        'value' => $old_id,
                    ],
                ],
            ]);

            if (empty($matched_posts)) {
                if (ctype_digit((string) $old_id)) {
                    $post_by_id = get_post((int) $old_id);

                    if ($post_by_id instanceof \WP_Post && 'poster' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                        $matched_posts = [$post_by_id->ID];
                    }
                }
            }

            if (empty($matched_posts)) {
                $matched_posts = get_posts([
                    'post_type'      => 'poster',
                    'post_status'    => 'publish',
                    'posts_per_page' => 1,
                    'fields'         => 'ids',
                    'name'           => sanitize_title((string) $pr_name),
                ]);
            }

            if (empty($matched_posts)) {
                return;
            }

            $matched_post_id = (int) $matched_posts[0];
            $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
            $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

            $query->set('p', $matched_post_id);
            $query->set('post_type', 'poster');
            $query->set('post_status', 'publish');
            $query->set('name', get_post_field('post_name', $matched_post_id));
            $query->set('_old_id', $old_id);
            $query->set('pr_name', $matched_pr_slug);
            $query->set('posts_per_page', 1);
            $query->is_single = true;
            $query->is_singular = true;
            $query->is_archive = false;
            $query->is_home = false;
            $query->is_post_type_archive = false;
            $query->is_404 = false;
            return;
        }

        $is_poster_archive_request = $query->is_post_type_archive('poster')
            || (
                'poster' === $query->get('post_type')
                && ! $old_id
                && ! $pr_name
                && ! $query->is_singular()
                && ! $query->is_single()
                && ! $query->get('name')
                && (int) $query->get('p') <= 0
            );

        if ($is_poster_archive_request) {
            $this->apply_poster_archive_filters_to_query($query);
        }
    }

    public function prevent_resolved_single_404($preempt, \WP_Query $query)
    {
        if (! $query->is_main_query()) {
            return $preempt;
        }

        if ('poster' !== $query->get('post_type')) {
            return $preempt;
        }

        if (! $query->is_singular('poster') && ! $query->is_single()) {
            return $preempt;
        }

        if ((int) $query->get('p') <= 0) {
            return $preempt;
        }

        $query->is_404 = false;
        status_header(200);

        return true;
    }

    public function send_resolved_single_status(): void
    {
        if (! is_singular('poster')) {
            return;
        }

        global $wp_query;

        if (! $wp_query instanceof \WP_Query) {
            return;
        }

        if ((int) $wp_query->get('p') <= 0) {
            return;
        }

        $wp_query->is_404 = false;
        status_header(200);
    }

    public function filter_archive_query_loop_vars(array $query, \WP_Block $block): array
    {
        $post_type = isset($query['postType']) ? (string) $query['postType'] : (isset($query['post_type']) ? (string) $query['post_type'] : '');
        if ('poster' !== $post_type || !is_post_type_archive('poster')) {
            return $query;
        }

        $query = $this->apply_poster_archive_filters_to_query_vars($query);

        return $query;
    }

    private function apply_poster_archive_filters_to_query(\WP_Query $query): void
    {
        $search_term = sanitize_text_field((string) $query->get('s'));

        if ('' === $search_term && isset($_GET['poster-search'])) {
            $search_term = sanitize_text_field(wp_unslash($_GET['poster-search']));
            if ('' !== $search_term) {
                $query->set('s', $search_term);
            }
        }

        $matching_post_ids = $this->get_filtered_poster_ids(
            absint($query->get('conference_id')),
            absint($query->get('poster_author')),
            sanitize_text_field((string) $query->get('collaborator'))
        );

        if (null === $matching_post_ids) {
            $this->apply_poster_archive_sorting_to_query($query);
            return;
        }

        $query->set('post__in', !empty($matching_post_ids) ? $matching_post_ids : [0]);
        $this->apply_poster_archive_sorting_to_query($query);
    }

    private function apply_poster_archive_filters_to_query_vars(array $query): array
    {
        if (isset($_GET['poster-search'])) {
            $query['search'] = sanitize_text_field(wp_unslash($_GET['poster-search']));
        }

        $conference_id = isset($_GET['conference_id']) ? absint(wp_unslash($_GET['conference_id'])) : 0;
        $poster_author = isset($_GET['poster_author']) ? absint(wp_unslash($_GET['poster_author'])) : 0;
        $collaborator  = isset($_GET['collaborator']) ? sanitize_text_field(wp_unslash($_GET['collaborator'])) : '';

        $matching_post_ids = $this->get_filtered_poster_ids($conference_id, $poster_author, $collaborator);
        if (null === $matching_post_ids) {
            return $this->apply_poster_archive_sorting_to_query_vars($query);
        }

        $query['post__in'] = !empty($matching_post_ids) ? $matching_post_ids : [0];

        return $this->apply_poster_archive_sorting_to_query_vars($query);
    }

    private function apply_poster_archive_sorting_to_query(\WP_Query $query): void
    {
        $query->set('meta_key', 'start_at');
        $query->set('orderby', [
            'meta_value' => 'DESC',
            'date'       => 'DESC',
        ]);
        $query->set('meta_type', 'DATE');
        $query->set('order', 'DESC');
    }

    private function apply_poster_archive_sorting_to_query_vars(array $query): array
    {
        $query['meta_key']  = 'start_at';
        $query['orderby']   = [
            'meta_value' => 'DESC',
            'date'       => 'DESC',
        ];
        $query['meta_type'] = 'DATE';
        $query['order']     = 'DESC';

        return $query;
    }

    /**
     * @return int[]|null
     */
    private function get_filtered_poster_ids(int $conference_id, int $poster_author, string $collaborator): ?array
    {
        $has_conference_filter = $conference_id > 0;
        $has_author_filter     = $poster_author > 0;
        $has_collab_filter     = '' !== $collaborator;

        if (!$has_conference_filter && !$has_author_filter && !$has_collab_filter) {
            return null;
        }

        $matching_sets = [];

        if ($has_conference_filter) {
            $matching_sets[] = $this->get_poster_ids_by_conference($conference_id);
        }

        if ($has_author_filter) {
            $matching_sets[] = $this->get_poster_ids_by_linked_author($poster_author);
        }

        if ($has_collab_filter) {
            $matching_sets[] = $this->get_poster_ids_by_collaborator_slug($collaborator);
        }

        if (empty($matching_sets)) {
            return null;
        }

        $matching_post_ids = array_shift($matching_sets);
        foreach ($matching_sets as $matching_set) {
            $matching_post_ids = array_values(array_intersect($matching_post_ids, $matching_set));
        }

        return array_values(array_unique(array_filter(array_map('absint', $matching_post_ids))));
    }

    /**
     * @return int[]
     */
    private function get_poster_ids_by_linked_author(int $author_id): array
    {
        if ($author_id <= 0) {
            return [];
        }

        $poster_ids = get_posts([
            'post_type'      => 'poster',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);
        if (!is_array($poster_ids) || empty($poster_ids)) {
            return [];
        }

        $matching_post_ids = [];
        foreach ($poster_ids as $poster_id) {
            $poster_id = absint($poster_id);
            if ($poster_id <= 0) {
                continue;
            }

            $linked_author_ids = get_post_meta($poster_id, 'linked_author', true);
            if (empty($linked_author_ids)) {
                continue;
            }

            if (!is_array($linked_author_ids)) {
                $linked_author_ids = [$linked_author_ids];
            }

            $linked_author_ids = array_values(array_unique(array_filter(array_map('absint', $linked_author_ids))));
            if (in_array($author_id, $linked_author_ids, true)) {
                $matching_post_ids[] = $poster_id;
            }
        }

        return array_values(array_unique($matching_post_ids));
    }

    /**
     * @return int[]
     */
    private function get_poster_ids_by_conference(int $conference_id): array
    {
        if ($conference_id <= 0 || 'conferences' !== get_post_type($conference_id)) {
            return [];
        }

        $linked_post_ids = get_post_meta($conference_id, 'linked_posts', true);
        if (empty($linked_post_ids)) {
            return [];
        }

        if (!is_array($linked_post_ids)) {
            $linked_post_ids = [$linked_post_ids];
        }

        $matching_post_ids = [];
        foreach ($linked_post_ids as $linked_post_id) {
            $linked_post_id = absint($linked_post_id);
            if ($linked_post_id > 0 && 'poster' === get_post_type($linked_post_id)) {
                $matching_post_ids[] = $linked_post_id;
            }
        }

        return array_values(array_unique($matching_post_ids));
    }

    /**
     * @return int[]
     */
    private function get_poster_ids_by_collaborator_slug(string $collaborator_slug): array
    {
        $collaborator_slug = sanitize_title($collaborator_slug);
        if ('' === $collaborator_slug) {
            return [];
        }

        $poster_ids = get_posts([
            'post_type'      => 'poster',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'tax_query'      => [
                [
                    'taxonomy' => 'collaborator',
                    'field'    => 'slug',
                    'terms'    => [$collaborator_slug],
                ],
            ],
        ]);

        return array_values(array_unique(array_filter(array_map('absint', is_array($poster_ids) ? $poster_ids : []))));
    }
}

final class PublicationRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('query_loop_block_query_vars', [$this, 'filter_archive_query_loop_vars'], 10, 2);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        if (! preg_match('#^science/peer-reviewed-publication/([^/]+)/([^/]+)$#', $trimmed_path, $matches)) {
            return;
        }

        $wp->query_vars['post_type'] = 'publication';
        $wp->query_vars['_old_id']   = sanitize_text_field($matches[1]);
        $wp->query_vars['pr_name']   = sanitize_title($matches[2]);
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'specialty_area';
        $vars[] = 'topic';
        $vars[] = 'publication_author';
        $vars[] = 'collaborator';
        $vars[] = 'publication-search';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('publication' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);
        $route_id = ! empty($old_id) ? $old_id : $post->ID;

        if (! empty($route_id) && ! empty($pr_slug)) {
            $post_link = home_url('/science/peer-reviewed-publication/' . $route_id . '/' . $pr_slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') && 'publication' !== $query->get('post_type')) {
            return;
        }

        $old_id = $query->get('_old_id');
        $pr_name = $query->get('pr_name');

        if (! empty($old_id) && ! empty($pr_name)) {
            $matched_posts = get_posts([
                'post_type'      => 'publication',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'meta_query'     => [
                    [
                        'key'   => '_old_id',
                        'value' => $old_id,
                    ],
                ],
            ]);

            if (empty($matched_posts)) {
                if (ctype_digit((string) $old_id)) {
                    $post_by_id = get_post((int) $old_id);

                    if ($post_by_id instanceof \WP_Post && 'publication' === $post_by_id->post_type && 'publish' === $post_by_id->post_status) {
                        $matched_posts = [$post_by_id->ID];
                    }
                }
            }

            if (empty($matched_posts)) {
                $matched_posts = get_posts([
                    'post_type'      => 'publication',
                    'post_status'    => 'publish',
                    'posts_per_page' => 1,
                    'fields'         => 'ids',
                    'name'           => sanitize_title((string) $pr_name),
                ]);
            }

            if (empty($matched_posts)) {
                return;
            }

            $matched_post_id = (int) $matched_posts[0];
            $matched_pr_name = (string) get_post_meta($matched_post_id, 'pr_name', true);
            $matched_pr_slug = sanitize_title($matched_pr_name ?: get_post_field('post_name', $matched_post_id));

            $query->set('p', $matched_post_id);
            $query->set('post_type', 'publication');
            $query->set('post_status', 'publish');
            $query->set('name', get_post_field('post_name', $matched_post_id));
            $query->set('_old_id', $old_id);
            $query->set('pr_name', $matched_pr_slug);
            $query->set('posts_per_page', 1);
            $query->is_single = true;
            $query->is_singular = true;
            $query->is_archive = false;
            $query->is_home = false;
            $query->is_post_type_archive = false;
            $query->is_404 = false;
            return;
        }

        if ($query->is_post_type_archive('publication') || ('publication' === $query->get('post_type') && ! $old_id && ! $pr_name)) {
            $this->apply_publication_archive_filters_to_query($query);
        }
    }

    public function filter_archive_query_loop_vars(array $query, \WP_Block $block): array
    {
        $post_type = isset($query['postType']) ? (string) $query['postType'] : (isset($query['post_type']) ? (string) $query['post_type'] : '');
        if ('publication' !== $post_type || ! is_post_type_archive('publication')) {
            return $query;
        }

        return $this->apply_publication_archive_filters_to_query_vars($query);
    }

    private function apply_publication_archive_filters_to_query(\WP_Query $query): void
    {
        $search_term        = sanitize_text_field((string) $query->get('s'));
        $specialty_area     = sanitize_title((string) $query->get('specialty_area'));
        $topic              = sanitize_title((string) $query->get('topic'));
        $publication_author = absint($query->get('publication_author'));
        $collaborator       = sanitize_title((string) $query->get('collaborator'));

        if ('' === $search_term && isset($_GET['publication-search'])) {
            $search_term = sanitize_text_field(wp_unslash($_GET['publication-search']));
            if ('' !== $search_term) {
                $query->set('s', $search_term);
            }
        }

        $matching_post_ids = $this->get_filtered_publication_ids($specialty_area, $topic, $publication_author, $collaborator);
        if (null === $matching_post_ids) {
            $this->apply_publication_archive_sorting_to_query($query);
            return;
        }

        $query->set('post__in', ! empty($matching_post_ids) ? $matching_post_ids : [0]);
        $this->apply_publication_archive_sorting_to_query($query);
    }

    private function apply_publication_archive_filters_to_query_vars(array $query): array
    {
        if (isset($_GET['publication-search'])) {
            $query['search'] = sanitize_text_field(wp_unslash($_GET['publication-search']));
        }

        $specialty_area     = isset($_GET['specialty_area']) ? sanitize_title(wp_unslash($_GET['specialty_area'])) : '';
        $topic              = isset($_GET['topic']) ? sanitize_title(wp_unslash($_GET['topic'])) : '';
        $publication_author = isset($_GET['publication_author']) ? absint(wp_unslash($_GET['publication_author'])) : 0;
        $collaborator       = isset($_GET['collaborator']) ? sanitize_title(wp_unslash($_GET['collaborator'])) : '';

        $matching_post_ids = $this->get_filtered_publication_ids($specialty_area, $topic, $publication_author, $collaborator);
        if (null === $matching_post_ids) {
            return $this->apply_publication_archive_sorting_to_query_vars($query);
        }

        $query['post__in'] = ! empty($matching_post_ids) ? $matching_post_ids : [0];

        return $this->apply_publication_archive_sorting_to_query_vars($query);
    }

    private function apply_publication_archive_sorting_to_query(\WP_Query $query): void
    {
        $query->set('orderby', [
            'date'  => 'DESC',
            'title' => 'ASC',
        ]);
        $query->set('order', 'DESC');
        $query->set('post_status', 'publish');
    }

    private function apply_publication_archive_sorting_to_query_vars(array $query): array
    {
        $query['orderby'] = [
            'date'  => 'DESC',
            'title' => 'ASC',
        ];
        $query['order'] = 'DESC';
        $query['post_status'] = 'publish';

        return $query;
    }

    /**
     * @return int[]|null
     */
    private function get_filtered_publication_ids(string $specialty_area, string $topic, int $publication_author, string $collaborator): ?array
    {
        $has_specialty_filter = '' !== $specialty_area;
        $has_topic_filter     = '' !== $topic;
        $has_author_filter    = $publication_author > 0;
        $has_collab_filter    = '' !== $collaborator;

        if (! $has_specialty_filter && ! $has_topic_filter && ! $has_author_filter && ! $has_collab_filter) {
            return null;
        }

        $matching_sets = [];

        if ($has_specialty_filter) {
            $matching_sets[] = $this->get_publication_ids_by_term_slug('poster_category', $specialty_area);
        }

        if ($has_topic_filter) {
            $matching_sets[] = $this->get_publication_ids_by_term_slug('post_tag', $topic);
        }

        if ($has_author_filter) {
            $matching_sets[] = $this->get_publication_ids_by_linked_author($publication_author);
        }

        if ($has_collab_filter) {
            $matching_sets[] = $this->get_publication_ids_by_term_slug('collaborator', $collaborator);
        }

        if (empty($matching_sets)) {
            return null;
        }

        $matching_post_ids = array_shift($matching_sets);
        foreach ($matching_sets as $matching_set) {
            $matching_post_ids = array_values(array_intersect($matching_post_ids, $matching_set));
        }

        return array_values(array_unique(array_filter(array_map('absint', $matching_post_ids))));
    }

    /**
     * @return int[]
     */
    private function get_publication_ids_by_linked_author(int $author_id): array
    {
        if ($author_id <= 0) {
            return [];
        }

        $publication_ids = get_posts([
            'post_type'      => 'publication',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);
        if (! is_array($publication_ids) || empty($publication_ids)) {
            return [];
        }

        $matching_post_ids = [];
        foreach ($publication_ids as $publication_id) {
            $publication_id = absint($publication_id);
            if ($publication_id <= 0) {
                continue;
            }

            $linked_author_ids = get_post_meta($publication_id, 'linked_author', true);
            if (empty($linked_author_ids)) {
                continue;
            }

            if (! is_array($linked_author_ids)) {
                $linked_author_ids = [$linked_author_ids];
            }

            $linked_author_ids = array_values(array_unique(array_filter(array_map('absint', $linked_author_ids))));
            if (in_array($author_id, $linked_author_ids, true)) {
                $matching_post_ids[] = $publication_id;
            }
        }

        return array_values(array_unique($matching_post_ids));
    }

    /**
     * @return int[]
     */
    private function get_publication_ids_by_term_slug(string $taxonomy, string $term_slug): array
    {
        $term_slug = sanitize_title($term_slug);
        if ('' === $term_slug) {
            return [];
        }

        $publication_ids = get_posts([
            'post_type'      => 'publication',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'tax_query'      => [
                [
                    'taxonomy' => $taxonomy,
                    'field'    => 'slug',
                    'terms'    => [$term_slug],
                ],
            ],
        ]);

        return array_values(array_unique(array_filter(array_map('absint', is_array($publication_ids) ? $publication_ids : []))));
    }
}
