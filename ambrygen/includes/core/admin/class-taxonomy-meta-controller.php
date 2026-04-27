<?php

namespace Ambrygen\Theme\Core\Admin;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class TaxonomyMetaController
{
    use Singleton;

    private array $taxonomies = [];

    public function __construct(array $taxonomies = [])
    {
        $this->taxonomies = $taxonomies;
        $this->register_hooks();
    }

    /**
     * Set taxonomies with their full definitions.
     *
     * @param array $taxonomies Array of taxonomy definitions keyed by slug, or simple list of slugs.
     */
    public function set_taxonomies(array $taxonomies): void
    {
        $this->taxonomies = [];
        foreach ($taxonomies as $key => $value) {
            if (is_array($value)) {
                $this->taxonomies[$key] = $value;
            } else {
                $this->taxonomies[$value] = ['slug' => $value];
            }
        }
        $this->register_hooks();
    }

    private function register_hooks(): void
    {
        foreach ($this->taxonomies as $slug => $tax) {
            register_term_meta(
                $slug,
                'term_image',
                [
                    'type'              => 'integer',
                    'single'            => true,
                    'show_in_rest'      => true,
                    'sanitize_callback' => 'absint',
                    'auth_callback'     => static function () {
                        return current_user_can('manage_categories');
                    },
                ]
            );

            if ('collaborator' === $slug) {
                register_term_meta(
                    $slug,
                    'link',
                    [
                        'type'              => 'string',
                        'single'            => true,
                        'show_in_rest'      => true,
                        'sanitize_callback' => 'esc_url_raw',
                        'auth_callback'     => static function () {
                            return current_user_can('manage_categories');
                        },
                    ]
                );
            }

            // Register additional meta fields from definition.
            if (! empty($tax['meta_fields'])) {
                foreach ($tax['meta_fields'] as $meta_key => $field) {
                    $type      = $field['type'] ?? 'text';
                    $is_single = ! (! empty($field['multiple']));
                    $meta_type = $is_single ? 'string' : 'array';

                    if ('checkbox' === $type) {
                        $meta_type = 'boolean';
                    }

                    register_term_meta(
                        $slug,
                        $meta_key,
                        [
                            'type'              => $meta_type,
                            'single'            => $is_single,
                            'show_in_rest'      => true,
                            'sanitize_callback' => $this->get_sanitize_callback($field, $is_single),
                            'auth_callback'     => static function () {
                                return current_user_can('manage_categories');
                            },
                        ]
                    );
                }
            }

            add_action($slug . '_add_form_fields', [$this, 'render_add_form_fields']);
            add_action($slug . '_edit_form_fields', [$this, 'render_edit_form_fields'], 10, 2);
            add_action('created_' . $slug, [$this, 'save_term_meta'], 10, 2);
            add_action('edited_' . $slug, [$this, 'save_term_meta'], 10, 2);
        }

        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_notices', [$this, 'render_collaborator_export_notice']);
        add_action('admin_init', [$this, 'handle_collaborator_export']);
    }

    private function get_current_taxonomy_screen(): ?\WP_Screen
    {
        if (! function_exists('get_current_screen')) {
            return null;
        }

        $screen = get_current_screen();
        if (! $screen || 'edit-tags' !== $screen->base) {
            return null;
        }

        return $screen;
    }

    public function render_collaborator_export_notice(): void
    {
        if (! current_user_can('manage_categories')) {
            return;
        }

        $screen = $this->get_current_taxonomy_screen();
        if (! $screen || 'collaborator' !== $screen->taxonomy) {
            return;
        }

        $query_args = [
            'taxonomy'   => 'collaborator',
            'abr_export' => 'csv',
            '_wpnonce'   => wp_create_nonce('abr_export_collaborator_csv'),
        ];

        if (! empty($_GET['post_type'])) {
            $query_args['post_type'] = sanitize_key(wp_unslash($_GET['post_type']));
        }

        $export_url = add_query_arg($query_args, admin_url('edit-tags.php'));

        printf(
            '<div class="notice notice-info"><p><a href="%1$s" class="button button-secondary">%2$s</a></p></div>',
            esc_url($export_url),
            esc_html__('Export Collaborators CSV', 'ambrygen-web')
        );
    }

    public function handle_collaborator_export(): void
    {
        if (
            ! is_admin() ||
            ! current_user_can('manage_categories') ||
            empty($_GET['abr_export']) ||
            'csv' !== sanitize_key(wp_unslash($_GET['abr_export'])) ||
            empty($_GET['taxonomy']) ||
            'collaborator' !== sanitize_key(wp_unslash($_GET['taxonomy']))
        ) {
            return;
        }

        check_admin_referer('abr_export_collaborator_csv');

        $terms = get_terms([
            'taxonomy'   => 'collaborator',
            'hide_empty' => false,
        ]);

        if (is_wp_error($terms)) {
            wp_die(esc_html__('Unable to export collaborators.', 'ambrygen-web'));
        }

        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=collaborators-' . gmdate('Y-m-d-H-i-s') . '.csv');

        $output = fopen('php://output', 'w');
        if (false === $output) {
            wp_die(esc_html__('Unable to open export stream.', 'ambrygen-web'));
        }

        fputcsv($output, ['_old_id', 'name']);

        foreach ($terms as $term) {
            fputcsv(
                $output,
                [
                    (string) get_term_meta($term->term_id, '_old_id', true),
                    $term->name,
                ]
            );
        }

        fclose($output);
        exit;
    }

    private function get_sanitize_callback(array $field, bool $is_single): callable
    {
        $sanitize = $field['sanitize'] ?? null;

        if (! $is_single) {
            return [$this, 'sanitize_item_array'];
        }

        if (! $sanitize) {
            return 'sanitize_text_field';
        }

        return $sanitize;
    }

    public function sanitize_item_array($value): array
    {
        if (! is_array($value)) {
            return [];
        }
        return array_map('sanitize_text_field', $value);
    }

    public function render_add_form_fields(): void
    {
        $screen = get_current_screen();
        if (! $screen) {
            return;
        }

        $taxonomy = $screen->taxonomy;
        if (! isset($this->taxonomies[$taxonomy])) {
            return;
        }

        echo '<div class="form-field term-image-wrap">';
        echo '<label>';
        esc_html_e('Image', 'ambrygen-web');
        echo '</label>';
        wp_nonce_field('ambrygen_term_meta', 'ambrygen_term_meta_nonce');
        echo '<img src="" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />';
        echo '<input type="hidden" name="term_image" id="term_image" value="" class="term-image-field" />';
        echo '<button type="button" class="button button-secondary upload-term-image">';
        esc_html_e('Upload Image', 'ambrygen-web');
        echo '</button> ';
        echo '<button type="button" class="button button-secondary remove-term-image">';
        esc_html_e('Remove Image', 'ambrygen-web');
        echo '</button>';
        echo '</div>';

        if ('collaborator' === $taxonomy) {
            echo '<div class="form-field">';
            echo '<label for="link">';
            esc_html_e('Link', 'ambrygen-web');
            echo '</label>';
            echo '<input type="url" name="link" id="link" value="" class="widefat" placeholder="https://example.com" />';
            echo '</div>';
        }
    }

    public function render_edit_form_fields($term): void
    {
        $taxonomy = $term->taxonomy;
        if (! isset($this->taxonomies[$taxonomy])) {
            return;
        }

        $tax_def   = $this->taxonomies[$taxonomy];
        $image_id  = get_term_meta($term->term_id, 'term_image', true);
        $image_url = $image_id ? wp_get_attachment_url($image_id) : '';

        echo '<tr class="form-field term-image-wrap">';
        echo '<th scope="row"><label>';
        esc_html_e('Image', 'ambrygen-web');
        echo '</label></th>';
        echo '<td>';
        wp_nonce_field('ambrygen_term_meta', 'ambrygen_term_meta_nonce');
        printf(
            '<img src="%1$s" class="term_image_prev" style="max-width:100px; display:block; margin-bottom:5px;" />',
            esc_url($image_url)
        );
        printf(
            '<input type="hidden" name="term_image" id="term_image" value="%1$s" class="term-image-field" />',
            esc_attr($image_id)
        );
        echo '<button type="button" class="button button-secondary upload-term-image">';
        esc_html_e('Upload Image', 'ambrygen-web');
        echo '</button> ';
        echo '<button type="button" class="button button-secondary remove-term-image">';
        esc_html_e('Remove Image', 'ambrygen-web');
        echo '</button>';
        echo '</td></tr>';

        if ('collaborator' === $taxonomy) {
            $link_value = get_term_meta($term->term_id, 'link', true);
            echo '<tr class="form-field">';
            echo '<th scope="row"><label for="link">';
            esc_html_e('Link', 'ambrygen-web');
            echo '</label></th>';
            echo '<td>';
            printf(
                '<input type="url" name="link" id="link" value="%1$s" class="widefat" placeholder="https://example.com" />',
                esc_attr($link_value)
            );
            echo '</td></tr>';
        }

        // Render additional meta fields.
        if (! empty($tax_def['meta_fields'])) {
            foreach ($tax_def['meta_fields'] as $key => $field) {
                $value = get_term_meta($term->term_id, $key, true);
                $type  = $field['type'] ?? 'text';

                echo '<tr class="form-field">';
                echo '<th scope="row"><label for="' . esc_attr($key) . '">' . esc_html($field['label']) . '</label></th>';
                echo '<td>';

                if ('textarea' === $type) {
                    printf(
                        '<textarea name="%1$s" id="%1$s" class="widefat" rows="5">%2$s</textarea>',
                        esc_attr($key),
                        esc_textarea($value)
                    );
                } elseif ('wysiwyg' === $type) {
                    wp_editor(
                        $value,
                        $key,
                        [
                            'textarea_name' => $key,
                            'textarea_rows' => 10,
                            'media_buttons' => true,
                        ]
                    );
                } elseif ('checkbox' === $type) {
                    $is_checked  = (bool) $value;
                    $field_value = isset($field['value']) ? $field['value'] : '1';
                    printf(
                        '<input type="checkbox" name="%1$s" id="%1$s" value="%2$s" %3$s>',
                        esc_attr($key),
                        esc_attr($field_value),
                        checked($is_checked, true, false)
                    );
                } elseif ('select' === $type && ! empty($field['options'])) {
                    echo '<select name="' . esc_attr($key) . '" id="' . esc_attr($key) . '" class="postform">';
                    foreach ($field['options'] as $opt_val => $opt_label) {
                        printf(
                            '<option value="%1$s" %2$s>%3$s</option>',
                            esc_attr($opt_val),
                            selected($value, $opt_val, false),
                            esc_html($opt_label)
                        );
                    }
                    echo '</select>';
                } else {
                    // Default to text input.
                    if (is_array($value)) {
                        $value = implode(', ', $value);
                    }
                    printf(
                        '<input type="%1$s" name="%2$s" id="%2$s" value="%3$s" class="widefat" />',
                        esc_attr($type),
                        esc_attr($key),
                        esc_attr($value)
                    );
                }

                if (! empty($field['description'])) {
                    echo '<p class="description">' . esc_html($field['description']) . '</p>';
                }

                echo '</td></tr>';
            }
        }
    }

    public function save_term_meta(int $term_id): void
    {
        if (
            empty($_POST['ambrygen_term_meta_nonce']) ||
            ! wp_verify_nonce(
                sanitize_text_field(wp_unslash($_POST['ambrygen_term_meta_nonce'])),
                'ambrygen_term_meta'
            )
        ) {
            return;
        }

        $term = get_term($term_id);
        if (! $term || is_wp_error($term)) {
            return;
        }

        $taxonomy = $term->taxonomy;
        if (! isset($this->taxonomies[$taxonomy])) {
            return;
        }

        $tax_def = $this->taxonomies[$taxonomy];

        // Save Image.
        if (isset($_POST['term_image']) && ! empty($_POST['term_image'])) {
            update_term_meta($term_id, 'term_image', intval($_POST['term_image']));
        } else {
            delete_term_meta($term_id, 'term_image');
        }

        // Save Collaborator Link.
        if ('collaborator' === $taxonomy) {
            if (isset($_POST['link']) && '' !== trim((string) wp_unslash($_POST['link']))) {
                update_term_meta(
                    $term_id,
                    'link',
                    esc_url_raw(wp_unslash($_POST['link']))
                );
            } else {
                delete_term_meta($term_id, 'link');
            }
        }

        // Save additional meta fields.
        if (! empty($tax_def['meta_fields'])) {
            foreach ($tax_def['meta_fields'] as $key => $field) {
                $type     = $field['type'] ?? 'text';
                $sanitize = $field['sanitize'] ?? 'sanitize_text_field';
                $multiple = ! empty($field['multiple']);

                if (! isset($_POST[$key])) {
                    if ('checkbox' === $type) {
                        update_term_meta($term_id, $key, 0);
                    } elseif ($multiple) {
                        delete_term_meta($term_id, $key);
                    }
                    continue;
                }

                $raw_val = wp_unslash($_POST[$key]);

                if ($multiple) {
                    if (! is_array($raw_val)) {
                        $raw_val = array_map('trim', explode(',', (string) $raw_val));
                    }

                    if (is_callable($sanitize) && 'sanitize_text_field' !== $sanitize) {
                        $sanitized = array_map($sanitize, $raw_val);
                    } else {
                        $sanitized = array_map('sanitize_text_field', $raw_val);
                    }
                    $sanitized = array_filter($sanitized);
                    update_term_meta($term_id, $key, array_values($sanitized));
                } else {
                    update_term_meta($term_id, $key, call_user_func($sanitize, $raw_val));
                }
            }
        }
    }

    public function enqueue_scripts(): void
    {
        wp_enqueue_media();
        wp_enqueue_script('media-editor');
        wp_enqueue_script('media-views');
    }
}
