<?php

namespace Ambrygen\Theme\Core\Science;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class ScienceRouteService
{
    use Singleton;

    private array $post_type_archive_slugs = [
        'publication'  => 'peer-reviewed-publication',
        'presentation' => 'scientific-presentations',
        'poster'       => 'scientific-posters',
    ];

    private array $post_type_single_slugs = [
        'presentation' => 'scientific-presentation',
        'poster'       => 'scientific-poster',
    ];

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_rewrites']);
        add_filter('post_type_archive_link', [$this, 'filter_archive_link'], 10, 2);
        add_filter('query_vars', [$this, 'register_query_vars']);
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
            add_rewrite_rule(
                '^' . preg_quote($publication_archive, '#') . '/([^/]+)/?$',
                'index.php?post_type=publication&name=$matches[1]',
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
                'index.php?post_type=presentation&sp_old_id=$matches[1]&sp_slug=$matches[2]',
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
                'index.php?post_type=poster&po_old_id=$matches[1]&po_slug=$matches[2]',
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

        if ('publication' === $post_type) {
            return $archive_path;
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
        $vars[] = 'sp_old_id';
        $vars[] = 'sp_slug';
        $vars[] = 'conference_id';
        $vars[] = 'speaker';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function register_poster_query_vars(array $vars): array
    {
        $vars[] = 'po_old_id';
        $vars[] = 'po_slug';
        $vars[] = 'conference_id';
        $vars[] = 'poster_author';
        $vars[] = 'collaborator';
        return $vars;
    }

    public function register_publication_query_vars(array $vars): array
    {
        $vars[] = 'specialty_area';
        $vars[] = 'topic';
        $vars[] = 'collaborator';
        return $vars;
    }
}
