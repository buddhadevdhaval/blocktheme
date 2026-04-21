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
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
        add_filter('query_loop_block_query_vars', [$this, 'filter_in_progress_query'], 10, 2);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%old_id%', '([^/]+)');
        add_rewrite_tag('%pr_name%', '([^/]+)');

        add_rewrite_rule(
            '^conference/([^/]+)/([^/]+)/?$',
            'index.php?post_type=conferences&old_id=$matches[1]&pr_name=$matches[2]',
            'top'
        );

        add_rewrite_rule(
            '^conferences/([^/]+)/([^/]+)/?$',
            'index.php?post_type=conferences&old_id=$matches[1]&pr_name=$matches[2]',
            'bottom'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'old_id';
        $vars[] = 'pr_name';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('conferences' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, 'old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);

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

        $old_id = $query->get('old_id');
        $pr_name = $query->get('pr_name');

        if (empty($old_id) || empty($pr_name)) {
            return;
        }

        $query->set('post_type', 'conferences');
        $query->set('post_status', 'publish');

        $query->set('meta_query', [
            [
                'key'   => 'old_id',
                'value' => $old_id,
            ],
            [
                'key'   => 'pr_name',
                'value' => $pr_name,
            ],
        ]);
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
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_action('pre_get_posts', [$this, 'filter_query']);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%pr_year%', '([0-9]{4})');
        add_rewrite_tag('%pr_month%', '([0-9]{2})');
        add_rewrite_tag('%pr_slug%', '([^/]+)');

        add_rewrite_rule(
            '^news/([0-9]{4})/([0-9]{2})/([^/]+)/?$',
            'index.php?post_type=press_release&pr_year=$matches[1]&pr_month=$matches[2]&pr_slug=$matches[3]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'pr_year';
        $vars[] = 'pr_month';
        $vars[] = 'pr_slug';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('press_release' !== $post->post_type) {
            return $post_link;
        }

        $post_date = $post->post_date;
        $year = date('Y', strtotime($post_date));
        $month = date('m', strtotime($post_date));
        $slug = $post->post_name;

        return home_url('/news/' . $year . '/' . $month . '/' . $slug);
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        $pr_year = $query->get('pr_year');
        $pr_month = $query->get('pr_month');
        $pr_slug = $query->get('pr_slug');

        if (empty($pr_year) || empty($pr_month) || empty($pr_slug)) {
            return;
        }

        $query->set('post_type', 'press_release');
        $query->set('name', $pr_slug);
    }
}

final class PresentationRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%sp_old_id%', '([^/]+)');
        add_rewrite_tag('%sp_slug%', '([^/]+)');

        add_rewrite_rule(
            '^scientific-presentation/([^/]+)/([^/]+)/?$',
            'index.php?post_type=presentation&sp_old_id=$matches[1]&sp_slug=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'sp_old_id';
        $vars[] = 'sp_slug';
        $vars[] = 'conference_id';
        $vars[] = 'speaker';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('presentation' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, 'old_id', true);
        $slug = $post->post_name;

        if (! empty($old_id)) {
            $post_link = home_url('/scientific-presentation/' . $old_id . '/' . $slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        $sp_old_id = $query->get('sp_old_id');
        $sp_slug = $query->get('sp_slug');

        if (empty($sp_old_id) || empty($sp_slug)) {
            return;
        }

        $query->set('post_type', 'presentation');
        $query->set('name', $sp_slug);

        $query->set('meta_query', [
            [
                'key'   => 'old_id',
                'value' => $sp_old_id,
            ],
        ]);
    }
}

final class PosterRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrite']);
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
    }

    public function register_rewrite(): void
    {
        add_rewrite_tag('%po_old_id%', '([^/]+)');
        add_rewrite_tag('%po_slug%', '([^/]+)');

        add_rewrite_rule(
            '^scientific-poster/([^/]+)/([^/]+)/?$',
            'index.php?post_type=poster&po_old_id=$matches[1]&po_slug=$matches[2]',
            'top'
        );
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'po_old_id';
        $vars[] = 'po_slug';
        $vars[] = 'conference_id';
        $vars[] = 'poster_author';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('poster' !== $post->post_type) {
            return $post_link;
        }

        $old_id = get_post_meta($post->ID, 'old_id', true);
        $slug = $post->post_name;

        if (! empty($old_id)) {
            $post_link = home_url('/scientific-poster/' . $old_id . '/' . $slug);
        }

        return $post_link;
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        $po_old_id = $query->get('po_old_id');
        $po_slug = $query->get('po_slug');

        if (empty($po_old_id) || empty($po_slug)) {
            return;
        }

        $query->set('post_type', 'poster');
        $query->set('name', $po_slug);

        $query->set('meta_query', [
            [
                'key'   => 'old_id',
                'value' => $po_old_id,
            ],
        ]);
    }
}

final class PublicationRouteService
{
    use Singleton;

    public function register_hooks(): void
    {
        add_filter('post_type_link', [$this, 'filter_permalink'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('pre_get_posts', [$this, 'filter_query']);
    }

    public function register_query_vars(array $vars): array
    {
        $vars[] = 'specialty_area';
        $vars[] = 'topic';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function filter_permalink(string $post_link, \WP_Post $post): string
    {
        if ('publication' !== $post->post_type) {
            return $post_link;
        }

        return home_url('/peer-reviewed-publication/' . $post->post_name);
    }

    public function filter_query(\WP_Query $query): void
    {
        if (! $query->is_main_query()) {
            return;
        }

        $specialty_area = $query->get('specialty_area');
        $topic = $query->get('topic');
        $collaborator = $query->get('collaborator');

        if (empty($specialty_area) && empty($topic) && empty($collaborator)) {
            return;
        }

        $tax_query = [];

        if (! empty($specialty_area)) {
            $tax_query[] = [
                'taxonomy' => 'specialty_area',
                'field'    => 'slug',
                'terms'    => $specialty_area,
            ];
        }

        if (! empty($topic)) {
            $tax_query[] = [
                'taxonomy' => 'topic',
                'field'    => 'slug',
                'terms'    => $topic,
            ];
        }

        if (! empty($collaborator)) {
            $tax_query[] = [
                'taxonomy' => 'collaborator',
                'field'    => 'slug',
                'terms'    => $collaborator,
            ];
        }

        if (! empty($tax_query)) {
            $query->set('tax_query', $tax_query);
        }
    }
}