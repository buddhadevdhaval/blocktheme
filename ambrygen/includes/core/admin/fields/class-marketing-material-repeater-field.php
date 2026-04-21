<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class MarketingMaterialRepeaterField
{
    use Singleton;

    public function render(int $post_id, string $key, array $field): void
    {
        $rows = get_post_meta($post_id, $key, true);
        if (! is_array($rows)) {
            $rows = [];
        }

        $rows = array_values(
            array_filter(
                $rows,
                static function ($row): bool {
                    return is_array($row);
                }
            )
        );

        $taxonomy_slug  = isset($field['language_taxonomy']) ? (string) $field['language_taxonomy'] : 'marketing_material_language';
        $language_terms = get_terms(
            [
                'taxonomy'   => $taxonomy_slug,
                'hide_empty' => false,
            ]
        );

        if (is_wp_error($language_terms) || ! is_array($language_terms)) {
            $language_terms = [];
        }

        $status_options = [
            'in_production'   => __('In Production', 'ambrygen-web'),
            'on_staging'      => __('On Staging', 'ambrygen-web'),
            'disabled_urgent' => __('Disabled Urgent', 'ambrygen-web'),
        ];

        echo '<div class="ambrygen-mm-repeater" data-key="' . esc_attr($key) . '">';
        echo '<div class="ambrygen-mm-rows">';
        if (! empty($rows)) {
            foreach ($rows as $index => $row) {
                echo $this->render_row_html($key, (string) $index, $row, $language_terms, $status_options);
            }
        }
        echo '</div>';
        echo '<p><button type="button" class="button button-secondary ambrygen-mm-add-row">' . esc_html__('Add File Row', 'ambrygen-web') . '</button></p>';
        echo '<script type="text/template" class="ambrygen-mm-template">';
        echo $this->render_row_html($key, '__INDEX__', [], $language_terms, $status_options);
        echo '</script>';
        echo '</div>';
    }

    public function render_row_html(string $key, string $index, array $row, array $language_terms, array $status_options): string
    {
        $file_id           = isset($row['file_id']) ? absint($row['file_id']) : 0;
        $media_lab_id      = isset($row['media_lab_id']) ? sanitize_text_field((string) $row['media_lab_id']) : '';
        $status            = isset($row['status']) ? sanitize_key((string) $row['status']) : 'in_production';
        $is_web            = ! empty($row['is_web']);
        $is_print          = ! empty($row['is_print']);
        $is_self_printable = ! empty($row['is_self_printable']);
        $language_term_id  = isset($row['language_term_id']) ? absint($row['language_term_id']) : 0;
        $replacement_date  = isset($row['replacement_date']) ? sanitize_text_field((string) $row['replacement_date']) : '';
        $created_at        = isset($row['created_at']) ? sanitize_text_field((string) $row['created_at']) : '';
        $updated_at        = isset($row['updated_at']) ? sanitize_text_field((string) $row['updated_at']) : '';

        $file_title = '';
        $file_url   = '';
        if ($file_id > 0) {
            $file_post = get_post($file_id);
            $file_url  = wp_get_attachment_url($file_id);
            if ($file_post) {
                $file_title = $file_post->post_title;
            }
        }

        ob_start();
        ?>
        <div class="ambrygen-mm-row">
            <div class="ambrygen-media-file-field">
                <label><?php esc_html_e('File Upload', 'ambrygen-web'); ?></label>
                <input type="hidden" class="widefat ambrygen-media-file-input" name="<?php echo esc_attr("{$key}[{$index}][file_id]"); ?>" value="<?php echo esc_attr($file_id); ?>" />
                <div class="ambrygen-media-file-preview">
                    <?php if ($file_id > 0 && $file_url): ?>
                        <a class="ambrygen-media-file-link" href="<?php echo esc_url($file_url); ?>" target="_blank" rel="noopener"><?php echo esc_html($file_title ?: basename((string) $file_url)); ?></a>
                    <?php else: ?>
                        <span class="ambrygen-media-file-empty"><?php esc_html_e('No file selected.', 'ambrygen-web'); ?></span>
                    <?php endif; ?>
                </div>
                <div class="form-field form-field-button">
                    <button type="button" class="button button-secondary ambrygen-media-file-upload"><?php esc_html_e('Select File', 'ambrygen-web'); ?></button>
                    <button type="button" class="button button-secondary ambrygen-media-file-remove"><?php esc_html_e('Clear', 'ambrygen-web'); ?></button>
                </div>
            </div>

            <p>
                <label><?php esc_html_e('Media Lab ID', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][media_lab_id]"); ?>" value="<?php echo esc_attr($media_lab_id); ?>" />
            </p>

            <p>
                <label><?php esc_html_e('Status', 'ambrygen-web'); ?></label><br />
                <select class="widefat" name="<?php echo esc_attr("{$key}[{$index}][status]"); ?>">
                    <?php foreach ($status_options as $option_key => $option_label): ?>
                        <option value="<?php echo esc_attr($option_key); ?>" <?php selected($status, $option_key); ?>><?php echo esc_html($option_label); ?></option>
                    <?php endforeach; ?>
                </select>
            </p>

            <p>
                <label>
                    <input type="checkbox" name="<?php echo esc_attr("{$key}[{$index}][is_web]"); ?>" value="1" <?php checked($is_web); ?> />
                    <?php esc_html_e('WEB', 'ambrygen-web'); ?>
                </label>
                &nbsp;&nbsp;
                <label>
                    <input type="checkbox" name="<?php echo esc_attr("{$key}[{$index}][is_print]"); ?>" value="1" <?php checked($is_print); ?> />
                    <?php esc_html_e('Print', 'ambrygen-web'); ?>
                </label>
                &nbsp;&nbsp;
                <label>
                    <input type="checkbox" name="<?php echo esc_attr("{$key}[{$index}][is_self_printable]"); ?>" value="1" <?php checked($is_self_printable); ?> />
                    <?php esc_html_e('Self Printable', 'ambrygen-web'); ?>
                </label>
            </p>

            <p>
                <label><?php esc_html_e('Language', 'ambrygen-web'); ?></label><br />
                <select class="widefat" name="<?php echo esc_attr("{$key}[{$index}][language_term_id]"); ?>">
                    <option value=""><?php esc_html_e('Select Language', 'ambrygen-web'); ?></option>
                    <?php foreach ($language_terms as $term): ?>
                        <option value="<?php echo esc_attr((string) $term->term_id); ?>" <?php selected($language_term_id, (int) $term->term_id); ?>>
                            <?php echo esc_html((string) $term->name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </p>

            <p>
                <label><?php esc_html_e('Replacement Date', 'ambrygen-web'); ?></label><br />
                <input type="date" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][replacement_date]"); ?>" value="<?php echo esc_attr($replacement_date); ?>" />
            </p>

            <input type="hidden" name="<?php echo esc_attr("{$key}[{$index}][created_at]"); ?>" value="<?php echo esc_attr($created_at); ?>" />
            <input type="hidden" name="<?php echo esc_attr("{$key}[{$index}][updated_at]"); ?>" value="<?php echo esc_attr($updated_at); ?>" />

            <p>
                <button type="button" class="button-link-delete ambrygen-mm-remove-row"><?php esc_html_e('Remove Row', 'ambrygen-web'); ?></button>
            </p>
        </div>
        <?php
        return (string) ob_get_clean();
    }
}
