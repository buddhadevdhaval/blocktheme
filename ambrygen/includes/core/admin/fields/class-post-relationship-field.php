<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class PostRelationshipField
{
    use Singleton;

    public function render(int $post_id, string $key, array $field): void
    {
        $linked_posts = get_post_meta($post_id, $key, true);

        if (empty($linked_posts)) {
            $linked_posts = [];
        } elseif (! is_array($linked_posts)) {
            $linked_posts = [$linked_posts];
        }

        $multiple           = isset($field['multiple']) && $field['multiple'];
        $allowed_post_types = isset($field['post_types']) ? $field['post_types'] : [];
        $input_name         = $multiple ? $key . '[]' : $key;

        if (empty($allowed_post_types)) {
            $all_post_types     = get_post_types(['public' => true], 'objects');
            $allowed_post_types = array_keys($all_post_types);
        }

        echo '<div class="ambrygen-post-relationship-field" data-input-name="' . esc_attr($key) . '" data-multiple="' . esc_attr($multiple ? '1' : '0') . '" data-post-types="' . esc_attr(wp_json_encode($allowed_post_types)) . '" >';

        if (! empty($linked_posts)) {
            $label = (count($allowed_post_types) === 1 && $allowed_post_types[0] === 'author')
                ? esc_html__('Currently Linked Authors:', 'ambrygen-web')
                : esc_html__('Currently Linked Posts:', 'ambrygen-web');
                
            echo '<div class="ambrygen-linked-posts">';
            echo '<h6>' . $label . '</h4>';
            echo '<ul>';

            foreach ($linked_posts as $linked_post_id) {
                $linked_post = get_post($linked_post_id);

                if ($linked_post) {
                    $post_type_obj   = get_post_type_object($linked_post->post_type);
                    $post_type_label = $post_type_obj ? $post_type_obj->labels->singular_name : $linked_post->post_type;
                    $view_url        = get_permalink($linked_post_id);
                    $edit_url        = get_edit_post_link($linked_post_id, '');
                    $actions         = [];

                    if ($view_url) {
                        $actions[] = sprintf(
                            '<a href="%1$s" target="_blank" rel="noopener">%2$s</a>',
                            esc_url($view_url),
                            esc_html__('View', 'ambrygen-web')
                        );
                    }

                    if ($edit_url) {
                        $actions[] = sprintf(
                            '<a href="%1$s" target="_blank" rel="noopener">%2$s</a>',
                            esc_url($edit_url),
                            esc_html__('Edit', 'ambrygen-web')
                        );
                    }

                    $actions_html = '';
                    if (! empty($actions)) {
                        $actions_html = ' [' . implode(' | ', $actions) . ']';
                    }

                    printf(
                        '<li>%1$s <em>(%2$s)</em>%3$s <a href="#" class="ambrygen-remove-link" data-post-id="%4$s" style="color:#dc3232;text-decoration:none;">[%5$s]</a></li>',
                        esc_html($linked_post->post_title),
                        esc_html($post_type_label),
                        wp_kses_post($actions_html),
                        esc_attr($linked_post_id),
                        esc_html__('Remove', 'ambrygen-web')
                    );
                }
            }

            echo '</ul>';
            echo '</div>';
        }

        $show_post_type_filter = count($allowed_post_types) > 1;

        if ($show_post_type_filter) {
            echo '<div>';
            echo '<label for="' . esc_attr($key) . '_post_type_filter">' . esc_html__('Filter by Post Type:', 'ambrygen-web') . '</label> ';
            echo '<select id="' . esc_attr($key) . '_post_type_filter" class="ambrygen-post-type-filter" >';
            echo '<option value="">' . esc_html__('All Post Types', 'ambrygen-web') . '</option>';

            foreach ($allowed_post_types as $post_type) {
                $post_type_obj = get_post_type_object($post_type);
                if ($post_type_obj) {
                    printf(
                        '<option value="%1$s">%2$s</option>',
                        esc_attr($post_type),
                        esc_html($post_type_obj->labels->name)
                    );
                }
            }

            echo '</select>';
            echo '</div>';
        }

        echo '<div class="ambrygen-add-post-relationship">';
        echo '<input type="text" class="ambrygen-post-search" placeholder="' . esc_attr__('Search for posts to link...', 'ambrygen-web') . '" style="width:300px;margin-right:8px;">';
        echo '<button type="button" class="button ambrygen-search-posts">' . esc_html__('Search', 'ambrygen-web') . '</button>';
        echo '</div>';

        echo '<div class="ambrygen-search-results" style="max-height:250px;overflow-y:auto;display:none;border:1px solid #ddd;padding:20px;background:#f9f9f9;"></div>';

        echo '<div class="ambrygen-selected-posts">';
        foreach ($linked_posts as $linked_post_id) {
            printf(
                '<input type="hidden" name="%1$s" value="%2$s">',
                esc_attr($input_name),
                esc_attr($linked_post_id)
            );
        }
        echo '</div>';

        if (! empty($field['description'])) {
            echo '<div class="info-description body2-medium">' . esc_html($field['description']) . '</div>';
        }

        echo '</div>';
    }
}
