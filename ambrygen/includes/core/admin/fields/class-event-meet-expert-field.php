<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class EventMeetExpertRepeaterField
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

        echo '<div class="ambrygen-meet-expert-repeater" data-key="' . esc_attr($key) . '">';
        echo '<div class="ambrygen-meet-expert-rows">';
        if (! empty($rows)) {
            foreach ($rows as $index => $row) {
                echo $this->render_session_row_html($key, (string) $index, $row);
            }
        }
        echo '</div>';
        echo '<p><button type="button" class="button button-secondary ambrygen-meet-expert-add-session">' . esc_html__('Add Session', 'ambrygen-web') . '</button></p>';
        echo '<script type="text/template" class="ambrygen-meet-expert-template">';
        echo $this->render_session_row_html($key, '__INDEX__', []);
        echo '</script>';
        echo '<script type="text/template" class="ambrygen-meet-expert-member-template">';
        echo $this->render_member_row_html($key, '__SESSION_INDEX__', '__MEMBER_INDEX__', []);
        echo '</script>';
        echo '</div>';
    }

    public function render_session_row_html(string $key, string $index, array $row): string
    {
        $session_date = isset($row['session_date']) ? sanitize_text_field((string) $row['session_date']) : '';
        $session_time = isset($row['session_time']) ? sanitize_text_field((string) $row['session_time']) : '';
        $members      = isset($row['members']) && is_array($row['members']) ? $row['members'] : [];
        if (empty($members) && (isset($row['name']) || isset($row['designation']) || isset($row['bio']) || isset($row['image_id']))) {
            $members = [$row];
        }

        ob_start();
        ?>
        <div class="ambrygen-meet-expert-session-row" style="border:1px solid #dcdcde;padding:12px;margin:0 0 12px 0;background:#fff;">
            <p style="margin-bottom:12px;">
                <label><?php esc_html_e('Session Date', 'ambrygen-web'); ?></label><br />
                <input type="date" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][session_date]"); ?>" value="<?php echo esc_attr($session_date); ?>" />
            </p>

            <p style="margin-bottom:12px;">
                <label><?php esc_html_e('Session Time', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$index}][session_time]"); ?>" value="<?php echo esc_attr($session_time); ?>" placeholder="<?php esc_attr_e('e.g. 12:00 PM - 1:00 PM', 'ambrygen-web'); ?>" />
            </p>

            <div class="ambrygen-meet-expert-member-rows" style="margin-top:12px;">
                <?php
                if (! empty($members)) {
                    foreach ($members as $member_index => $member_row) {
                        echo $this->render_member_row_html($key, $index, (string) $member_index, $member_row);
                    }
                }
                ?>
            </div>

            <p style="margin-bottom:12px;">
                <button type="button" class="button button-secondary ambrygen-meet-expert-add-member"><?php esc_html_e('Add Member', 'ambrygen-web'); ?></button>
            </p>

            <p style="margin:0;">
                <button type="button" class="button-link-delete ambrygen-meet-expert-remove-session"><?php esc_html_e('Remove Session', 'ambrygen-web'); ?></button>
            </p>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function render_member_row_html(string $key, string $session_idx, string $member_idx, array $row): string
    {
        $name        = isset($row['name']) ? sanitize_text_field((string) $row['name']) : '';
        $designation = isset($row['designation']) ? sanitize_text_field((string) $row['designation']) : '';
        $bio         = isset($row['bio']) ? wp_kses_post((string) $row['bio']) : '';
        $image_id    = isset($row['image_id']) ? absint($row['image_id']) : 0;
        $image_url   = $image_id > 0 ? wp_get_attachment_image_url($image_id, 'thumbnail') : '';
        $editor_id   = sanitize_key("{$key}_{$session_idx}_{$member_idx}_bio");

        ob_start();
        ?>
        <div class="ambrygen-meet-expert-member-row" style="border:1px dashed #dcdcde;padding:12px;margin:0 0 12px 0;background:#fdfdfd;">
            <div class="ambrygen-single-image-field" style="margin-bottom:12px;">
                <label><?php esc_html_e('Image', 'ambrygen-web'); ?></label>
                <input type="hidden" class="widefat ambrygen-single-image-input" name="<?php echo esc_attr("{$key}[{$session_idx}][members][{$member_idx}][image_id]"); ?>" value="<?php echo esc_attr($image_id); ?>" />
                <div class="ambrygen-single-image-preview" style="margin:8px 0;">
                    <?php if ($image_url): ?>
                        <img src="<?php echo esc_url($image_url); ?>" alt="" style="width:96px;height:96px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />
                    <?php else: ?>
                        <span class="ambrygen-single-image-empty"><?php esc_html_e('No image selected.', 'ambrygen-web'); ?></span>
                    <?php endif; ?>
                </div>
                <div class="form-field form-field-button">
                    <button type="button" class="button button-secondary ambrygen-single-image-upload"><?php esc_html_e('Select Image', 'ambrygen-web'); ?></button>
                    <button type="button" class="button button-secondary ambrygen-single-image-remove"><?php esc_html_e('Clear', 'ambrygen-web'); ?></button>
                </div>
            </div>

            <p style="margin-bottom:12px;">
                <label><?php esc_html_e('Name', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$session_idx}][members][{$member_idx}][name]"); ?>" value="<?php echo esc_attr($name); ?>" />
            </p>

            <p style="margin-bottom:12px;">
                <label><?php esc_html_e('Designation', 'ambrygen-web'); ?></label><br />
                <input type="text" class="widefat" name="<?php echo esc_attr("{$key}[{$session_idx}][members][{$member_idx}][designation]"); ?>" value="<?php echo esc_attr($designation); ?>" />
            </p>

            <div style="margin-bottom:12px;">
                <label for="<?php echo esc_attr($editor_id); ?>"><?php esc_html_e('Bio', 'ambrygen-web'); ?></label>
                <textarea class="widefat wp-editor-area ambrygen-meet-expert-bio" id="<?php echo esc_attr($editor_id); ?>" name="<?php echo esc_attr("{$key}[{$session_idx}][members][{$member_idx}][bio]"); ?>" rows="6"><?php echo esc_textarea($bio); ?></textarea>
            </div>

            <p style="margin:0;">
                <button type="button" class="button-link-delete ambrygen-meet-expert-remove-member"><?php esc_html_e('Remove Member', 'ambrygen-web'); ?></button>
            </p>
        </div>
        <?php
        return (string) ob_get_clean();
    }
}
