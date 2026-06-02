<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class ProductStatsRepeaterField
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

        echo '<div class="ambrygen-mm-repeater" data-key="' . esc_attr($key) . '">';
        echo '<div class="ambrygen-mm-rows">';
        if (! empty($rows)) {
            foreach ($rows as $index => $row) {
                echo $this->render_row_html($key, (string) $index, $row);
            }
        }
        echo '</div>';
        echo '<p><button type="button" class="button button-secondary ambrygen-mm-add-row">' . esc_html__('Add Stat Card', 'ambrygen-web') . '</button></p>';
        echo '<script type="text/template" class="ambrygen-mm-template">';
        echo $this->render_row_html($key, '__INDEX__', []);
        echo '</script>';
        echo '</div>';
    }

    public function render_row_html(string $key, string $index, array $row): string
    {
        $title           = isset($row['title']) ? sanitize_text_field((string) $row['title']) : '';
        $subtitle        = isset($row['subtitle']) ? sanitize_text_field((string) $row['subtitle']) : '';
        $description     = isset($row['description']) ? sanitize_text_field((string) $row['description']) : '';
        $sub_description = isset($row['sub_description']) ? sanitize_text_field((string) $row['sub_description']) : '';

        ob_start();
        ?>
        <div class="ambrygen-mm-row" style="border:1px solid #dcdcde;padding:12px;margin:0 0 12px 0;background:#fff;">
            <p>
                <label><?php esc_html_e('Title (Value)', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][title]"); ?>" value="<?php echo esc_attr($title); ?>" placeholder="e.g. Up to 93%" />
            </p>
            <p>
                <label><?php esc_html_e('Subtitle (Label)', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][subtitle]"); ?>" value="<?php echo esc_attr($subtitle); ?>" placeholder="e.g. Marfan Syndrome" />
            </p>
            <p>
                <label><?php esc_html_e('Description', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][description]"); ?>" value="<?php echo esc_attr($description); ?>" placeholder="e.g. of patients have a product in the FBN1 gene" />
            </p>
            <p>
                <label><?php esc_html_e('Sub-description (Source)', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][sub_description]"); ?>" value="<?php echo esc_attr($sub_description); ?>" placeholder="e.g. Koniko et al., J Med Genet 2002" />
            </p>

            <p style="margin:0;">
                <button type="button" class="button-link-delete ambrygen-mm-remove-row"><?php esc_html_e('Remove Row', 'ambrygen-web'); ?></button>
            </p>
        </div>
        <?php
        return (string) ob_get_clean();
    }
}
