<?php

namespace Ambrygen\Theme\Core\Conferences;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;
use WP_Post;

defined('ABSPATH') || exit;

final class ConferenceLinkService
{
    use Singleton;

    public function get_linked_posts_by_type(int $post_id, string $post_type = ''): array
    {
        return ConferenceQueryService::instance()->get_linked_posts_by_type($post_id, $post_type);
    }

    public function get_meet_the_expert_entries(int $post_id): array
    {
        $source_ids = [$post_id];
        $linked_ids = get_post_meta($post_id, 'linked_posts', true);

        if (! empty($linked_ids)) {
            if (! is_array($linked_ids)) {
                $linked_ids = [$linked_ids];
            }

            foreach ($linked_ids as $linked_id) {
                $linked_id = absint($linked_id);
                if ($linked_id > 0 && 'event' === get_post_type($linked_id) && ! in_array($linked_id, $source_ids, true)) {
                    $source_ids[] = $linked_id;
                }
            }
        }

        $entries = [];

        foreach ($source_ids as $source_id) {
            $rows = get_post_meta($source_id, 'meet_the_experts', true);
            $has_valid_rows = false;

            if (is_array($rows)) {
                foreach ($rows as $row) {
                    if (! is_array($row)) {
                        continue;
                    }

                    $session_date = isset($row['session_date']) ? sanitize_text_field((string) $row['session_date']) : '';
                    $session_time = isset($row['session_time']) ? sanitize_text_field((string) $row['session_time']) : '';
                    $members_raw  = isset($row['members']) && is_array($row['members']) ? $row['members'] : [];

                    if (empty($members_raw) && (isset($row['name']) || isset($row['designation']) || isset($row['bio']) || isset($row['image_id']))) {
                        $members_raw = [$row];
                    }

                    $members = [];

                    foreach ($members_raw as $member_row) {
                        if (! is_array($member_row)) {
                            continue;
                        }

                        $name        = isset($member_row['name']) ? sanitize_text_field((string) $member_row['name']) : '';
                        $designation = isset($member_row['designation']) ? sanitize_text_field((string) $member_row['designation']) : '';
                        $bio         = isset($member_row['bio']) ? wp_kses_post((string) $member_row['bio']) : '';
                        $image_id    = isset($member_row['image_id']) ? absint($member_row['image_id']) : 0;

                        if ('' === $name && '' === $designation && '' === trim(wp_strip_all_tags($bio)) && 0 === $image_id) {
                            continue;
                        }

                        $members[] = [
                            'name'        => $name,
                            'designation' => $designation,
                            'bio'         => $bio,
                            'image_html'  => $image_id > 0
                                ? wp_get_attachment_image($image_id, 'medium', false, ['class' => 'speaker-card__image'])
                                : '',
                        ];
                    }

                    if (empty($members) && '' === $session_date && '' === $session_time) {
                        continue;
                    }

                    $entries[] = [
                        'session_date' => $session_date ? gmdate('Y-m-d', strtotime($session_date)) : '',
                        'session_time' => $session_time,
                        'members'      => $members,
                        'content'      => '',
                        'source_id'    => $source_id,
                    ];

                    $has_valid_rows = true;
                }
            }

            if (! $has_valid_rows) {
                $post = get_post($source_id);

                if ($post instanceof WP_Post && '' !== trim($post->post_content)) {
                    $entries[] = [
                        'session_date' => '',
                        'session_time' => '',
                        'members'      => [],
                        'content'      => apply_filters('the_content', $post->post_content),
                        'source_id'    => $source_id,
                    ];
                }
            }
        }

        return $entries;
    }

    public function get_linked_booth_label(int $post_id): string
    {
        $terms = get_the_terms($post_id, 'booth_tag');
        if (! empty($terms) && ! is_wp_error($terms)) {
            $term = reset($terms);
            $name = $term->name;

            if ($name) {
                if (is_numeric($name)) {
                    return sprintf('Booth #%s', $name);
                }
                if (false === stripos($name, 'Booth')) {
                    return sprintf('Booth %s', $name);
                }
                return $name;
            }
        }

        $linked_posts = get_post_meta($post_id, 'linked_posts', false);
        if (empty($linked_posts)) {
            return '';
        }

        foreach ($linked_posts as $linked_id) {
            if ('booths' === get_post_type($linked_id)) {
                $title = get_the_title($linked_id);
                if ($title) {
                    if (is_numeric($title)) {
                        return sprintf('Booth #%s', $title);
                    }
                    if (false === stripos($title, 'Booth')) {
                        return sprintf('Booth %s', $title);
                    }
                    return $title;
                }
            }
        }

        return '';
    }

    public function get_trade_show_booth_tag(int $trade_show_id): string
    {
        if ($trade_show_id <= 0) {
            return '';
        }

        $terms = get_the_terms($trade_show_id, 'booth_tag');
        if (! empty($terms) && ! is_wp_error($terms)) {
            $term = reset($terms);
            if ($term && ! empty($term->name)) {
                $name = (string) $term->name;

                if (is_numeric($name)) {
                    return sprintf('Booth #%s', $name);
                }

                if (false === stripos($name, 'Booth')) {
                    return sprintf('Booth %s', $name);
                }

                return $name;
            }
        }

        return '';
    }

    public function get_linked_event_posts(int $post_id): array
    {
        return $this->get_linked_posts_by_type($post_id, 'event');
    }

    public function format_meta_list_value($value): string
    {
        if (empty($value)) {
            return '';
        }

        if (is_string($value)) {
            return $value;
        }

        if (is_array($value)) {
            return implode(', ', array_filter($value, static function ($item) {
                return ! empty($item);
            }));
        }

        return '';
    }
}