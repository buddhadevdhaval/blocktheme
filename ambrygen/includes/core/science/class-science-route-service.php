<?php

namespace Ambrygen\Theme\Core\Science;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class ScienceRouteService
{
    use Singleton;

    private array $post_type_archive_slugs = [
        'publication'  => 'peer-reviewed-publications',
        'presentation' => 'scientific-presentations',
        'poster'       => 'scientific-posters',
    ];

    private array $post_type_single_slugs = [
        'publication'  => 'peer-reviewed-publication',
        'presentation' => 'scientific-presentation',
        'poster'       => 'scientific-poster',
    ];

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrites']);
        add_action('parse_request', [$this, 'parse_request']);
        add_filter('post_type_archive_link', [$this, 'filter_archive_link'], 10, 2);
        add_filter('post_type_link', [$this, 'filter_single_link'], 20, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
    }

    public function parse_request(\WP $wp): void
    {
        $request_path = wp_parse_url((string) wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

        if (! is_string($request_path)) {
            return;
        }

        $trimmed_path = trim($request_path, '/');

        foreach (array_keys($this->post_type_archive_slugs) as $post_type) {
            $archive_path = trim($this->get_archive_path($post_type), '/');
            if ('' === $archive_path) {
                continue;
            }

            if ($trimmed_path === $archive_path) {
                $this->apply_archive_request($wp, $post_type);
                return;
            }

            if (preg_match('#^' . preg_quote($archive_path, '#') . '/page/([0-9]{1,})$#', $trimmed_path, $matches)) {
                $this->apply_archive_request($wp, $post_type, absint($matches[1]));
                return;
            }
        }
    }

    public function register_query_vars(array $vars): array
    {
        $vars = $this->register_presentation_query_vars($vars);
        $vars = $this->register_poster_query_vars($vars);
        $vars = $this->register_publication_query_vars($vars);
        return $vars;
    }

    public function register_rewrites(): void
    {
        $publication_archive = $this->get_archive_path('publication');
        $publication_single  = $this->get_single_base_path('publication');

        if ('' !== $publication_archive) {
            add_rewrite_rule(
                '^' . preg_quote($publication_archive, '#') . '/?$',
                'index.php?post_type=publication',
                'top'
            );
            add_rewrite_rule(
                '^' . preg_quote($publication_archive, '#') . '/page/([0-9]{1,})/?$',
                'index.php?post_type=publication&paged=$matches[1]',
                'top'
            );
        }

        if ('' !== $publication_single) {
            add_rewrite_rule(
                '^' . preg_quote($publication_single, '#') . '/([^/]+)/([^/]+)/?$',
                'index.php?post_type=publication&_old_id=$matches[1]&pr_name=$matches[2]',
                'top'
            );
        }

        $presentation_archive = $this->get_archive_path('presentation');
        $presentation_single  = $this->get_single_base_path('presentation');
        if ('' !== $presentation_archive) {
            add_rewrite_rule(
                '^' . preg_quote($presentation_archive, '#') . '/?$',
                'index.php?post_type=presentation',
                'top'
            );
            add_rewrite_rule(
                '^' . preg_quote($presentation_archive, '#') . '/page/([0-9]{1,})/?$',
                'index.php?post_type=presentation&paged=$matches[1]',
                'top'
            );
        }
        if ('' !== $presentation_single) {
            add_rewrite_rule(
                '^' . preg_quote($presentation_single, '#') . '/([^/]+)/([^/]+)/?$',
                'index.php?post_type=presentation&_old_id=$matches[1]&pr_name=$matches[2]',
                'top'
            );
        }

        $poster_archive = $this->get_archive_path('poster');
        $poster_single  = $this->get_single_base_path('poster');
        if ('' !== $poster_archive) {
            add_rewrite_rule(
                '^' . preg_quote($poster_archive, '#') . '/?$',
                'index.php?post_type=poster',
                'top'
            );
            add_rewrite_rule(
                '^' . preg_quote($poster_archive, '#') . '/page/([0-9]{1,})/?$',
                'index.php?post_type=poster&paged=$matches[1]',
                'top'
            );
        }
        if ('' !== $poster_single) {
            add_rewrite_rule(
                '^' . preg_quote($poster_single, '#') . '/([^/]+)/([^/]+)/?$',
                'index.php?post_type=poster&_old_id=$matches[1]&pr_name=$matches[2]',
                'top'
            );
        }
    }

    public function get_archive_path(string $post_type): string
    {
        if (! isset($this->post_type_archive_slugs[$post_type])) {
            return '';
        }

        return $this->resolve_page_path($this->post_type_archive_slugs[$post_type]);
    }

    public function get_single_base_path(string $post_type): string
    {
        $archive_path = $this->get_archive_path($post_type);
        if ('' === $archive_path) {
            return '';
        }

        if (! isset($this->post_type_single_slugs[$post_type])) {
            return '';
        }

        $parent_path = $this->get_parent_path($archive_path);
        if ('' === $parent_path) {
            return $this->post_type_single_slugs[$post_type];
        }

        return $parent_path . '/' . $this->post_type_single_slugs[$post_type];
    }

    public function filter_archive_link(string $link, string $post_type): string
    {
        $archive_path = $this->get_archive_path($post_type);
        if ('' === $archive_path) {
            return $link;
        }

        return home_url(user_trailingslashit($archive_path));
    }

    public function filter_single_link(string $link, \WP_Post $post): string
    {
        if (! isset($this->post_type_single_slugs[$post->post_type])) {
            return $link;
        }

        $single_base = $this->get_single_base_path($post->post_type);
        if ('' === $single_base) {
            return $link;
        }

        $old_id = get_post_meta($post->ID, '_old_id', true);
        $pr_name = get_post_meta($post->ID, 'pr_name', true);
        $pr_slug = sanitize_title($pr_name ?: $post->post_name);

        if (empty($old_id) || empty($pr_slug)) {
            return $link;
        }

        return home_url(user_trailingslashit($single_base . '/' . $old_id . '/' . $pr_slug));
    }

    private function resolve_page_path(string $slug): string
    {
        $slug = sanitize_title($slug);
        if ('' === $slug) {
            return '';
        }

        $page_ids = get_posts([
            'post_type'      => 'page',
            'post_status'    => 'publish',
            'name'           => $slug,
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
        ]);

        if (empty($page_ids) || ! is_array($page_ids)) {
            return $slug;
        }

        $selected_id = absint($page_ids[0]);
        foreach ($page_ids as $page_id) {
            $page_id = absint($page_id);
            if ($page_id <= 0) {
                continue;
            }

            $parent_id = (int) wp_get_post_parent_id($page_id);
            if ($parent_id > 0) {
                $selected_id = $page_id;
                break;
            }
        }

        $path = trim((string) get_page_uri($selected_id), '/');
        return '' !== $path ? $path : $slug;
    }

    private function get_parent_path(string $path): string
    {
        $parts = array_values(array_filter(explode('/', trim($path, '/'))));
        if (count($parts) <= 1) {
            return '';
        }

        array_pop($parts);
        return implode('/', $parts);
    }

    public function register_presentation_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'conference_id';
        $vars[] = 'speaker';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function register_poster_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'conference_id';
        $vars[] = 'poster_author';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function register_publication_query_vars(array $vars): array
    {
        $vars[] = '_old_id';
        $vars[] = 'pr_name';
        $vars[] = 'specialty_area';
        $vars[] = 'topic';
        $vars[] = 'collaborator';
        return $vars;
    }

    private function apply_archive_request(\WP $wp, string $post_type, int $paged = 0): void
    {
        $wp->query_vars['post_type'] = $post_type;
        unset($wp->query_vars['pagename'], $wp->query_vars['page_id'], $wp->query_vars['name']);

        if ($paged > 1) {
            $wp->query_vars['paged'] = $paged;
        }
    }
}
