<?php

namespace Ambrygen\Theme\Core\Science;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class ScienceRenderer
{
    use Singleton;

    public function render_presentation_filters(): string
    {
        if (! is_post_type_archive('presentation')) {
            return '';
        }

        $data = Helper::get_presentation_filter_data();

        $current_search       = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
        $current_conference   = isset($_GET['conference_id']) ? absint(wp_unslash($_GET['conference_id'])) : 0;
        $current_speaker      = isset($_GET['speaker']) ? sanitize_text_field(wp_unslash($_GET['speaker'])) : '';
        $current_collaborator = isset($_GET['collaborator']) ? sanitize_text_field(wp_unslash($_GET['collaborator'])) : '';

        $archive_url = get_post_type_archive_link('presentation');

        ob_start();
        ?>
        <form method="get" action="<?php echo esc_url($archive_url); ?>" class="presentation-filters-form cs-wp-filters-form">
            <div class="presentation-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="presentation-search"
                        class="facetwp-label"><?php esc_html_e('Search', 'ambrygen-web'); ?></label></div>
                <input id="presentation-search" type="search" name="s" value="<?php echo esc_attr($current_search); ?>"
                    placeholder="<?php esc_attr_e('Search Presentations', 'ambrygen-web'); ?>">
            </div>

            <div class="presentation-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="presentation-conference"
                        class="facetwp-label"><?php esc_html_e('Conference', 'ambrygen-web'); ?></label></div>
                <select id="presentation-conference" name="conference_id">
                    <option value=""><?php esc_html_e('Select a Conference', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['conferences'] as $conference_id): ?>
                        <option value="<?php echo esc_attr($conference_id); ?>" <?php selected($current_conference, (int) $conference_id); ?>>
                            <?php echo esc_html(mb_strimwidth(get_the_title((int) $conference_id), 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="presentation-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="presentation-speaker"
                        class="facetwp-label"><?php esc_html_e('Speakers', 'ambrygen-web'); ?></label></div>
                <select id="presentation-speaker" name="speaker">
                    <option value=""><?php esc_html_e('Choose a Speaker', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['speakers'] as $speaker_name): ?>
                        <option value="<?php echo esc_attr($speaker_name); ?>" <?php selected($current_speaker, $speaker_name); ?>>
                            <?php echo esc_html(mb_strimwidth($speaker_name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="presentation-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="presentation-collaborator"
                        class="facetwp-label"><?php esc_html_e('Collaborators', 'ambrygen-web'); ?></label></div>
                <select id="presentation-collaborator" name="collaborator">
                    <option value=""><?php esc_html_e('Select a Collaborator', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['collaborators'] as $collaborator_term): ?>
                        <option value="<?php echo esc_attr($collaborator_term->slug); ?>" <?php selected($current_collaborator, (string) $collaborator_term->slug); ?>>
                            <?php echo esc_html(mb_strimwidth($collaborator_term->name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="presentation-filters-form__actions cs-wp-filters-form__actions">
                <button type="submit" class="site-btn"><?php esc_html_e('Apply Filters', 'ambrygen-web'); ?></button>
                <a href="<?php echo esc_url($archive_url); ?>"
                    class="site-btn is-style-site-tertiary-btn"><?php esc_html_e('Clear', 'ambrygen-web'); ?></a>
            </div>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    public function render_presentation_result_count(): string
    {
        if (! is_post_type_archive('presentation')) {
            return '';
        }

        global $wp_query;
        if (! $wp_query instanceof \WP_Query) {
            return '';
        }

        return sprintf(
            '<p class="text-md-Semibold">%s</p>',
            esc_html(
                sprintf(
                    __('Showing %1$d of %2$d Results', 'ambrygen-web'),
                    (int) $wp_query->post_count,
                    (int) $wp_query->found_posts
                )
            )
        );
    }

    public function render_presentation_meta(): string
    {
        $post_id = get_the_ID();
        if (! $post_id || 'presentation' !== get_post_type($post_id)) {
            return '';
        }

        $session_id = (string) get_post_meta($post_id, 'session_id', true);
        $start_at   = (string) get_post_meta($post_id, 'start_at', true);

        $speakers      = Helper::get_presentation_speakers((int) $post_id);
        $speaker_label = ! empty($speakers) ? implode(', ', $speakers) : '--';

        $conference_id   = Helper::get_linked_conference_id_by_presentation((int) $post_id);
        $conference_html = '--';
        if ($conference_id > 0) {
            $conference_html = sprintf(
                '<a href="%1$s">%2$s</a>',
                esc_url(get_permalink($conference_id)),
                esc_html(get_the_title($conference_id))
            );
        }

        $display_date = get_the_date('F j, Y', $post_id);
        if ('' !== $start_at) {
            $timestamp = strtotime($start_at);
            if (false !== $timestamp) {
                $display_date = wp_date('F j, Y g:ia', $timestamp);
            }
        }

        ob_start();
        ?>
        <div class="ambrygen-presentation-meta listing-archive__item-meta flag-details">
            <?php if ('' !== $session_id): ?>
                <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
                    <div class="listing-archive__item-meta__row__label flag-label">Session:</div> <?php echo esc_html('#' . $session_id); ?>
                </div>
            <?php endif; ?>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
                <div class="listing-archive__item-meta__row__label flag-label">Speakers:</div> <?php echo esc_html($speaker_label); ?>
            </div>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-conference-info">
                <span class="event-carousel__meta-list-icon flag-icon"></span>
                <div class="listing-archive__item-meta__row__label">Conference:</div> <?php echo wp_kses_post($conference_html); ?>
            </div>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-date-info">
                <span class="event-carousel__meta-list-icon flag-icon"></span>
                <!-- <div class="listing-archive__item-meta__row__label">Date:</div> -->
                <?php echo esc_html($display_date); ?>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function render_poster_filters(): string
    {
        if (! is_post_type_archive('poster')) {
            return '';
        }

        $data = Helper::get_poster_filter_data();

        $current_search       = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
        $current_conference   = isset($_GET['conference_id']) ? absint(wp_unslash($_GET['conference_id'])) : 0;
        $current_author       = isset($_GET['poster_author']) ? sanitize_text_field(wp_unslash($_GET['poster_author'])) : '';
        $current_collaborator = isset($_GET['collaborator']) ? sanitize_text_field(wp_unslash($_GET['collaborator'])) : '';

        $archive_url = get_post_type_archive_link('poster');

        ob_start();
        ?>
        <form method="get" action="<?php echo esc_url($archive_url); ?>" class="poster-filters-form cs-wp-filters-form">
            <div class="poster-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="poster-search"
                        class="facetwp-label"><?php esc_html_e('Search', 'ambrygen-web'); ?></label></div>
                <input id="poster-search" type="search" name="s" value="<?php echo esc_attr($current_search); ?>"
                    placeholder="<?php esc_attr_e('Search Posters', 'ambrygen-web'); ?>">
            </div>

            <div class="poster-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="poster-conference"
                        class="facetwp-label"><?php esc_html_e('Conference', 'ambrygen-web'); ?></label></div>
                <select id="poster-conference" name="conference_id">
                    <option value=""><?php esc_html_e('Select a Conference', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['conferences'] as $conference_id): ?>
                        <option value="<?php echo esc_attr($conference_id); ?>" <?php selected($current_conference, (int) $conference_id); ?>>
                            <?php echo esc_html(mb_strimwidth(get_the_title((int) $conference_id), 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="poster-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="poster-author"
                        class="facetwp-label"><?php esc_html_e('Authors', 'ambrygen-web'); ?></label></div>
                <select id="poster-author" name="poster_author">
                    <option value=""><?php esc_html_e('Choose an Author', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['authors'] as $author_name): ?>
                        <option value="<?php echo esc_attr($author_name); ?>" <?php selected($current_author, $author_name); ?>>
                            <?php echo esc_html(mb_strimwidth($author_name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="poster-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="poster-collaborator"
                        class="facetwp-label"><?php esc_html_e('Collaborators', 'ambrygen-web'); ?></label></div>
                <select id="poster-collaborator" name="collaborator">
                    <option value=""><?php esc_html_e('Select a Collaborator', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['collaborators'] as $collaborator_term): ?>
                        <option value="<?php echo esc_attr($collaborator_term->slug); ?>" <?php selected($current_collaborator, (string) $collaborator_term->slug); ?>>
                            <?php echo esc_html(mb_strimwidth($collaborator_term->name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="poster-filters-form__actions cs-wp-filters-form__actions">
                <button type="submit" class="site-btn"><?php esc_html_e('Apply Filters', 'ambrygen-web'); ?></button>
                <a href="<?php echo esc_url($archive_url); ?>"
                    class="site-btn is-style-site-tertiary-btn"><?php esc_html_e('Clear', 'ambrygen-web'); ?></a>
            </div>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    public function render_poster_result_count(): string
    {
        if (! is_post_type_archive('poster')) {
            return '';
        }

        global $wp_query;
        if (! $wp_query instanceof \WP_Query) {
            return '';
        }

        return sprintf(
            '<p class="text-md-Semibold">%s</p>',
            esc_html(
                sprintf(
                    __('Showing %1$d of %2$d Results', 'ambrygen-web'),
                    (int) $wp_query->post_count,
                    (int) $wp_query->found_posts
                )
            )
        );
    }

    public function render_poster_meta(): string
    {
        $post_id = get_the_ID();
        if (! $post_id || 'poster' !== get_post_type($post_id)) {
            return '';
        }

        $session_id = (string) get_post_meta($post_id, 'session_id', true);
        $start_at   = (string) get_post_meta($post_id, 'start_at', true);

        $authors      = Helper::get_poster_authors((int) $post_id);
        $author_label = ! empty($authors) ? implode(', ', $authors) : '--';

        $conference_id   = Helper::get_linked_conference_id_by_related_post((int) $post_id);
        $conference_html = '--';
        if ($conference_id > 0) {
            $conference_html = sprintf(
                '<a href="%1$s">%2$s</a>',
                esc_url(get_permalink($conference_id)),
                esc_html(get_the_title($conference_id))
            );
        }

        $display_date = get_the_date('F j, Y', $post_id);
        if ('' !== $start_at) {
            $timestamp = strtotime($start_at);
            if (false !== $timestamp) {
                $display_date = wp_date('F j, Y g:ia', $timestamp);
            }
        }

        ob_start();
        ?>
        <div class="ambrygen-poster-meta listing-archive__item-meta flag-details">
            <?php if ('' !== $session_id): ?>
                <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info">
                    <div class="listing-archive__item-meta__row__label flag-label">Session:</div> <?php echo esc_html('#' . $session_id); ?>
                </div>
            <?php endif; ?>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-date-info">
                <div class="listing-archive__item-meta__row__label flag-label">
                    <div class="event-carousel__meta-list-icon flag-icon"></div>Date:
                </div>
                <?php echo esc_html($display_date); ?>
            </div>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-conference-info">
                <div class="listing-archive__item-meta__row__label flag-label">
                    <div class="event-carousel__meta-list-icon flag-icon"></div>Conference:
                </div>
                <?php echo wp_kses_post($conference_html); ?>
            </div>
            <div class="listing-archive__item-meta__row text-md-regular mb-0 flag-info flag-author-info">
                <div class="listing-archive__item-meta__row__label flag-label">
                    <div class="event-carousel__meta-list-icon flag-icon"></div>Authors:
                </div> <?php echo esc_html($author_label); ?>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function render_publication_filters(): string
    {
        if (! is_post_type_archive('publication')) {
            return '';
        }

        $data = Helper::get_publication_filter_data();

        $current_search         = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
        $current_specialty_area = isset($_GET['specialty_area']) ? sanitize_text_field(wp_unslash($_GET['specialty_area'])) : '';
        $current_topic          = isset($_GET['topic']) ? sanitize_text_field(wp_unslash($_GET['topic'])) : '';
        $current_collaborator   = isset($_GET['collaborator']) ? sanitize_text_field(wp_unslash($_GET['collaborator'])) : '';

        $archive_url = get_post_type_archive_link('publication');

        ob_start();
        ?>
        <form method="get" action="<?php echo esc_url($archive_url); ?>" class="publication-filters-form cs-wp-filters-form">
            <div class="publication-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="publication-search"
                        class="facetwp-label"><?php esc_html_e('Search', 'ambrygen-web'); ?></label></div>
                <input id="publication-search" type="search" name="s" value="<?php echo esc_attr($current_search); ?>"
                    placeholder="<?php esc_attr_e('Search Publications', 'ambrygen-web'); ?>">
            </div>

            <div class="publication-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="publication-specialty"
                        class="facetwp-label"><?php esc_html_e('Specialty Area', 'ambrygen-web'); ?></label></div>
                <select id="publication-specialty" name="specialty_area">
                    <option value=""><?php esc_html_e('Select Specialty Area', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['specialty_areas'] as $term): ?>
                        <option value="<?php echo esc_attr($term->slug); ?>" <?php selected($current_specialty_area, (string) $term->slug); ?>>
                            <?php echo esc_html(mb_strimwidth($term->name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="publication-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="publication-topic"
                        class="facetwp-label"><?php esc_html_e('Topics', 'ambrygen-web'); ?></label></div>
                <select id="publication-topic" name="topic">
                    <option value=""><?php esc_html_e('Select Topic', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['topics'] as $term): ?>
                        <option value="<?php echo esc_attr($term->slug); ?>" <?php selected($current_topic, (string) $term->slug); ?>>
                            <?php echo esc_html(mb_strimwidth($term->name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="publication-filters-form__field cs-wp-filters-form__field">
                <div class="text-md-regular mb-0"><label for="publication-collaborator"
                        class="facetwp-label"><?php esc_html_e('Collaborators', 'ambrygen-web'); ?></label></div>
                <select id="publication-collaborator" name="collaborator">
                    <option value=""><?php esc_html_e('Select a Collaborator', 'ambrygen-web'); ?></option>
                    <?php foreach ($data['collaborators'] as $term): ?>
                        <option value="<?php echo esc_attr($term->slug); ?>" <?php selected($current_collaborator, (string) $term->slug); ?>>
                            <?php echo esc_html(mb_strimwidth($term->name, 0, 45, '...')); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="publication-filters-form__actions cs-wp-filters-form__actions">
                <button type="submit" class="site-btn"><?php esc_html_e('Apply Filters', 'ambrygen-web'); ?></button>
                <a href="<?php echo esc_url($archive_url); ?>"
                    class="site-btn is-style-site-tertiary-btn"><?php esc_html_e('Clear', 'ambrygen-web'); ?></a>
            </div>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    public function render_publication_result_count(): string
    {
        if (! is_post_type_archive('publication')) {
            return '';
        }

        global $wp_query;
        if (! $wp_query instanceof \WP_Query) {
            return '';
        }

        return sprintf(
            '<p class="text-md-Semibold">%s</p>',
            esc_html(
                sprintf(
                    __('Showing %1$d of %2$d Results', 'ambrygen-web'),
                    (int) $wp_query->post_count,
                    (int) $wp_query->found_posts
                )
            )
        );
    }

    public function render_publication_meta(): string
    {
        $post_id = get_the_ID();
        if (! $post_id || 'publication' !== get_post_type($post_id)) {
            return '';
        }

        $date_label = get_the_date('F Y', $post_id);

        ob_start();
        ?>
        <div class="ambrygen-publication-meta listing-archive__item-meta flag-details">
            <div class="listing-archive__item-meta__row text-md-regular flag-info flag-date-info">
				<span class="flag-icon"></span>
                <?php echo esc_html($date_label); ?>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function render_post_meta_fields(int $post_id): string
    {
        if (! $post_id) {
            return '';
        }

        $post_type = get_post_type($post_id);
        if (! $post_type) {
            return '';
        }

        $meta_fields = [];

        switch ($post_type) {
            case 'publication':
                return $this->render_publication_meta();
            case 'presentation':
                return $this->render_presentation_meta();
            case 'poster':
                return $this->render_poster_meta();
            default:
                return '';
        }
    }
}