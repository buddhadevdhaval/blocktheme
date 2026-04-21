<?php

namespace Ambrygen\Theme\Core\Webinars;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class WebinarQueryService
{
    use Singleton;

    public function get_upcoming_webinars(int $per_page = 8, int $paged = 1, string $search = '', int $year = 0, int $tag = 0): \WP_Query
    {
        $today = date('Y-m-d');
        $query_args = [
            'post_type'      => 'webinar',
            'posts_per_page' => $per_page,
            'post_status'    => 'publish',
            'paged'          => $paged,
            'meta_query'     => [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '>',
                    'type'    => 'DATE',
                ],
            ],
        ];

        if (! empty($search)) {
            $query_args['s'] = $search;
        }

        if ($year > 0) {
            $query_args['meta_query'][] = [
                'key'     => 'start_at',
                'value'   => [$year . '-01-01', $year . '-12-31'],
                'compare' => 'BETWEEN',
                'type'    => 'DATE',
            ];
        }

        if ($tag > 0) {
            $query_args['tax_query'] = [
                [
                    'taxonomy' => 'post_tag',
                    'field'    => 'term_id',
                    'terms'    => [$tag],
                ],
            ];
        }

        return new \WP_Query($query_args);
    }

    public function get_past_webinars(int $per_page = 8, int $paged = 1, string $search = '', int $year = 0, int $tag = 0): \WP_Query
    {
        $today = date('Y-m-d');
        $query_args = [
            'post_type'      => 'webinar',
            'posts_per_page' => $per_page,
            'post_status'    => 'publish',
            'paged'          => $paged,
            'meta_query'     => [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE',
                ],
            ],
        ];

        if (! empty($search)) {
            $query_args['s'] = $search;
        }

        if ($year > 0) {
            $query_args['meta_query'][] = [
                'key'     => 'start_at',
                'value'   => [$year . '-01-01', $year . '-12-31'],
                'compare' => 'BETWEEN',
                'type'    => 'DATE',
            ];
        }

        if ($tag > 0) {
            $query_args['tax_query'] = [
                [
                    'taxonomy' => 'post_tag',
                    'field'    => 'term_id',
                    'terms'    => [$tag],
                ],
            ];
        }

        return new \WP_Query($query_args);
    }

    public function has_in_progress_webinars(): bool
    {
        $today = date('Y-m-d');
        $query = new \WP_Query([
            'post_type'      => 'webinar',
            'posts_per_page' => 1,
            'post_status'    => 'publish',
            'meta_query'     => [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '=',
                    'type'    => 'DATE',
                ],
            ],
        ]);

        return $query->have_posts();
    }

    public function get_past_years(): array
    {
        global $wpdb;

        $results = $wpdb->get_col(
            $wpdb->prepare(
                "SELECT DISTINCT YEAR(meta_value) as year 
                FROM {$wpdb->postmeta} 
                WHERE meta_key = %s 
                AND meta_value <= %s
                ORDER BY year DESC",
                'start_at',
                date('Y-m-d')
            )
        );

        return array_map('intval', array_filter($results));
    }

    public function get_tags(string $scope = ''): array
    {
        $args = [
            'post_type'      => 'webinar',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ];

        $today = date('Y-m-d');
        if ('upcoming' === $scope) {
            $args['meta_query'] = [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '>',
                    'type'    => 'DATE',
                ],
            ];
        } elseif ('past' === $scope) {
            $args['meta_query'] = [
                [
                    'key'     => 'start_at',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE',
                ],
            ];
        }

        $query = new \WP_Query($args);
        $post_ids = $query->posts;

        if (empty($post_ids)) {
            return [];
        }

        $terms = wp_get_object_terms($post_ids, 'post_tag');
        if (is_wp_error($terms)) {
            return [];
        }

        return $terms;
    }
}
