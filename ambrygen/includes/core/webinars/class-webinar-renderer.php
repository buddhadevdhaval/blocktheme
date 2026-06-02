<?php

namespace Ambrygen\Theme\Core\Webinars;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class WebinarRenderer
{
    use Singleton;

    private function is_checkbox_enabled(int $post_id, string $meta_key): bool
    {
        $value = (string) get_post_meta($post_id, $meta_key, true);

        return '' !== $value && '0' !== $value && 'false' !== $value;
    }

    /**
     * Resolve webinar post ID for editor preview or front-end rendering.
     * When in editor and no valid post ID, fetch a sample webinar post.
     *
     * @param int $post_id The post ID to resolve.
     * @return int Resolved post ID or 0 if not found.
     */
    private function resolve_webinar_post_id(int $post_id): int
    {
        if ($post_id > 0 && 'webinar' === get_post_type($post_id)) {
            return $post_id;
        }

        $queried_post_id = get_queried_object_id();
        if ($queried_post_id > 0 && 'webinar' === get_post_type($queried_post_id)) {
            return (int) $queried_post_id;
        }

        $is_editor = wp_is_json_request() || (defined('REST_REQUEST') && REST_REQUEST);
        if (!$is_editor) {
            return 0;
        }

        $sample_posts = get_posts(
            array(
                'post_type'      => 'webinar',
                'posts_per_page' => 1,
                'post_status'    => 'publish',
                'fields'         => 'ids',
            )
        );

        if (empty($sample_posts)) {
            return 0;
        }

        return (int) $sample_posts[0];
    }

    /**
     * Check whether the current render is happening in editor preview context.
     *
     * @return bool
     */
    private function is_editor_preview(): bool
    {
        return wp_is_json_request() || (defined('REST_REQUEST') && REST_REQUEST);
    }

    private function get_webinar_author_entries(int $post_id): array
    {
        $rows = get_post_meta($post_id, 'webinar_authors', true);
        $entries = [];

        if (is_array($rows)) {
            foreach ($rows as $row) {
                if (! is_array($row)) {
                    continue;
                }

                $author_id = isset($row['linked_author']) ? absint($row['linked_author']) : 0;
                if ($author_id <= 0) {
                    continue;
                }

                $author_post = get_post($author_id);
                if (! $author_post || 'author' !== $author_post->post_type) {
                    continue;
                }

                $override_image_id = isset($row['image_id']) ? absint($row['image_id']) : 0;
                $designation       = isset($row['designation']) ? sanitize_text_field((string) $row['designation']) : '';
                $bio               = isset($row['bio']) ? wp_kses_post((string) $row['bio']) : '';

                $entries[] = [
                    'author_id'    => $author_id,
                    'title'        => get_the_title($author_id),
                    'designation'  => '' !== $designation ? $designation : (string) get_post_meta($author_id, 'user_designation', true),
                    'excerpt'      => get_the_excerpt($author_id),
                    'content'      => '' !== trim(wp_strip_all_tags($bio)) ? $bio : apply_filters('the_content', $author_post->post_content),
                    'image_id'     => $override_image_id > 0 ? $override_image_id : get_post_thumbnail_id($author_id),
                ];
            }
        }

        if (! empty($entries)) {
            return $entries;
        }

        $author_ids = get_post_meta($post_id, 'linked_author', true);
        if (empty($author_ids)) {
            return [];
        }

        if (! is_array($author_ids)) {
            $author_ids = [$author_ids];
        }

        foreach (array_filter($author_ids) as $author_id) {
            $author_id = absint($author_id);
            if ($author_id <= 0) {
                continue;
            }

            $author_post = get_post($author_id);
            if (! $author_post || 'author' !== $author_post->post_type) {
                continue;
            }

            $entries[] = [
                'author_id'   => $author_id,
                'title'       => get_the_title($author_id),
                'designation' => (string) get_post_meta($author_id, 'user_designation', true),
                'excerpt'     => get_the_excerpt($author_id),
                'content'     => apply_filters('the_content', $author_post->post_content),
                'image_id'    => get_post_thumbnail_id($author_id),
            ];
        }

        return $entries;
    }

    public function render_webinar_grid_card(int $post_id): string
    {
        if (!$post_id) {
            return '';
        }

        $title = get_the_title($post_id);
        $permalink = get_permalink($post_id);

        $subtitle = (string) get_post_meta($post_id, 'subtitle', true);
        $start_at = (string) get_post_meta($post_id, 'start_at', true);
        $duration = (string) get_post_meta($post_id, 'duration', true);
        $has_ceu = $this->is_checkbox_enabled($post_id, 'ceu');
        $has_pace = $this->is_checkbox_enabled($post_id, 'pace');
        $registration_link = (string) get_post_meta($post_id, 'registration_link', true);

        $start_ts = $start_at ? strtotime($start_at) : false;
        $date_display = $start_ts ? date_i18n('l, F j, Y', $start_ts) : '';
        
        $time_display = '';
        if ($start_at) {
            try {
                $date = new \DateTime($start_at, new \DateTimeZone('UTC'));
                $date->setTimezone(new \DateTimeZone('America/Los_Angeles'));
                $time_display = $date->format('g:ia T');
            } catch (\Exception $e) {
                $time_display = $start_ts ? date_i18n('g:ia T', $start_ts) : '';
            }
        }
        $day_badge = $start_ts ? date_i18n('jS', $start_ts) : '';
        $month_badge = $start_ts ? strtoupper(date_i18n('M', $start_ts)) : '';

        $duration_mins = (int) $duration;
        $duration_display = '';
        if ($duration_mins > 0) {
            $hours = floor($duration_mins / 60);
            $mins = $duration_mins % 60;

            if ($hours > 0) {
                $duration_display = sprintf(
                    _n('%d hour', '%d hours', $hours, 'ambrygen'),
                    $hours
                );
            }

            if ($mins > 0) {
                if ($hours > 0) {
                    $duration_display .= ' ' . __('and', 'ambrygen') . ' ';
                }
                $duration_display .= sprintf(
                    _n('%d minute', '%d minutes', $mins, 'ambrygen'),
                    $mins
                );
            }
        }

        $tags_html = '';
        $terms = get_the_terms($post_id, 'post_tag');
        ?>

        <?php if (!is_wp_error($terms) && !empty($terms)) {
            $tags_html .= '<div class="categories-items">';
            foreach ($terms as $term) {
                $tags_html .= sprintf(
                    '<div class="category-item"><a href="%1$s" class="event-carousel__tag">%2$s</a></div>',
                    esc_url(get_term_link($term)),
                    esc_html($term->name)
                );
            }
            $tags_html .= '</div>';
        }
        ?>


        <?php ob_start();
        ?>
        <div class="event-carousel__card">
            <div class="event-carousel__content">
                <div class="event-carousel__tags lists-item-category" aria-hidden="true">
                    <?php echo $tags_html; ?>
                </div>
                <div class="is-style-gl-s8" aria-hidden="true"></div>
                <div class="event-carousel__title-row">
                    <a href="<?php echo esc_url($permalink); ?>"
                        class="text-lg-semibold event-carousel__card-title mb-0"><?php echo esc_html($title); ?></a>
                </div>

                <div class="is-style-gl-s16" aria-hidden="true"></div>
                <?php if ('' !== $subtitle): ?>
                    <div class="event-carousel__description text-md-medium">
                        <?php echo wp_kses_post($subtitle); ?>
                    </div>
                <?php endif; ?>
                <div class="is-style-gl-s16" aria-hidden="true"></div>
                <div class="event-carousel__details flag-details">
                    <?php if ('' !== $date_display): ?>
                        <div class="text-md-medium event-carousel__date-info flag-info flag-date-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <?php echo esc_html($date_display); ?>
                        </div>
                    <?php endif; ?>
                    <?php if ('' !== $time_display): ?>
                        <div class="text-md-medium event-carousel__time-info flag-info flag-time-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <?php echo esc_html($time_display); ?>
                        </div>
                    <?php endif; ?>
                    <?php if ('' !== $duration_display): ?>
                        <div class="text-md-medium event-carousel__duration flag-info flag-duration-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <?php echo esc_html($duration_display); ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($has_ceu): ?>
                        <div class="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <span class="event-carousel__meta-label">C.E.U.:</span>
                        </div>
                    <?php endif; ?>
                    <?php if ($has_pace): ?>
                        <div class="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <span class="event-carousel__meta-label">P.A.C.E.:</span>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="is-style-gl-s16" aria-hidden="true"></div>
                <div class="event-carousel__cta-wrap">
                    <?php if (!empty($registration_link)): ?>
                        <a href="<?php echo esc_url($registration_link); ?>"
                            class="event-carousel__cta site-btn is-style-site-trailing-icon btn-small" target="_blank"
                            rel="noopener noreferrer">
                            <?php esc_html_e('Register', 'ambrygen'); ?>
                        </a>
                    <?php else: ?>
                        <a href="<?php echo esc_url($permalink); ?>"
                            class="event-carousel__cta site-btn is-style-site-trailing-icon btn-small">
                            <?php esc_html_e('Details', 'ambrygen'); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_webinar_meta_summary(int $post_id): string
    {
        $post_id = $this->resolve_webinar_post_id($post_id);
        if (!$post_id) {
            return '';
        }

        $start_at = (string) get_post_meta($post_id, 'start_at', true);
        $duration = (string) get_post_meta($post_id, 'duration', true);
        $has_ceu  = $this->is_checkbox_enabled($post_id, 'ceu');
        $has_pace = $this->is_checkbox_enabled($post_id, 'pace');

        $start_ts     = $start_at ? strtotime($start_at) : false;
        $date_display = $start_ts ? date_i18n('l, F j, Y', $start_ts) : '';
        
        $time_display = '';
        if ($start_at) {
            try {
                $date = new \DateTime($start_at, new \DateTimeZone('UTC'));
                $date->setTimezone(new \DateTimeZone('America/Los_Angeles'));
                $time_display = $date->format('g:ia T');
            } catch (\Exception $e) {
                $time_display = $start_ts ? date_i18n('g:ia T', $start_ts) : '';
            }
        }

        $duration_mins = (int) $duration;
        $duration_display = '';
        if ($duration_mins > 0) {
            $hours = floor($duration_mins / 60);
            $mins = $duration_mins % 60;

            if ($hours > 0) {
                $duration_display = sprintf(
                    _n('%d hour', '%d hours', $hours, 'ambrygen-web'),
                    $hours
                );
            }

            if ($mins > 0) {
                if ($hours > 0) {
                    $duration_display .= ' ' . __('and', 'ambrygen-web') . ' ';
                }
                $duration_display .= sprintf(
                    _n('%d minute', '%d minutes', $mins, 'ambrygen-web'),
                    $mins
                );
            }
        }

        ob_start();
        ?>
        <div class="event-carousel__details flag-details">
            <?php if (!empty($date_display)) : ?>
                <div class="text-md-medium event-carousel__date-info flag-info flag-date-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <?php echo esc_html($date_display); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($time_display)) : ?>
                <div class="text-md-medium event-carousel__time-info flag-info flag-time-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <?php echo esc_html($time_display); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($duration_display)) : ?>
                <div class="text-md-medium event-carousel__duration flag-info flag-duration-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <?php echo esc_html($duration_display); ?>
                </div>
            <?php endif; ?>

            <?php if ($has_ceu) : ?>
                <div class="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <span class="event-carousel__meta-label"><?php esc_html_e('C.E.U.:', 'ambrygen-web'); ?></span>
                </div>
            <?php endif; ?>

            <?php if ($has_pace) : ?>
                <div class="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <span class="event-carousel__meta-label"><?php esc_html_e('P.A.C.E.:', 'ambrygen-web'); ?></span>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_share_post(int $post_id): string
    {
        if (!$post_id && !is_admin()) {
            $post_id = (int) get_the_ID();
        }
        if (!$post_id || ('webinar' !== get_post_type($post_id) && 'press-releases' !== get_post_type($post_id))) {
             $resolved_id = $this->resolve_webinar_post_id($post_id);
             if ($resolved_id) {
                 $post_id = $resolved_id;
             }
        }

        if (!$post_id) {
            return '';
        }

        $url   = get_permalink($post_id);
        $title = get_the_title($post_id);
        $theme_url = get_template_directory_uri();

        $facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode($url);
        $twitter_url  = 'https://x.com/intent/tweet?url=' . urlencode($url) . '&text=' . urlencode($title);
        $linkedin_url = 'https://www.linkedin.com/sharing/share-offsite/?url=' . urlencode($url);

        ob_start();
        ?>
        <div class="share-post">
            <div class="share-post__wrapper">
                <span class="share-post__label text-md-medium"><?php esc_html_e('Share:', 'ambrygen-web'); ?></span>
                <div class="share-post__icons">
                    <a href="<?php echo esc_url($facebook_url); ?>" target="_blank" rel="noopener noreferrer" 
                       class="share-post__icon share-post__facebook" aria-label="<?php esc_attr_e('Share on Facebook', 'ambrygen-web'); ?>" title="<?php esc_attr_e('Share on Facebook', 'ambrygen-web'); ?>">
                        <img src="<?php echo esc_url($theme_url); ?>/assets/src/images/social-icons/facebook-icon.svg" alt="" />
                    </a>
                    <a href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener noreferrer" 
                       class="share-post__icon share-post__twitter" aria-label="<?php esc_attr_e('Share on Twitter', 'ambrygen-web'); ?>" title="<?php esc_attr_e('Share on Twitter', 'ambrygen-web'); ?>">
                        <img src="<?php echo esc_url($theme_url); ?>/assets/src/images/social-icons/twitter-icon.svg" alt="" />
                    </a>
                    <a href="<?php echo esc_url($linkedin_url); ?>" target="_blank" rel="noopener noreferrer" 
                       class="share-post__icon share-post__linkedin" aria-label="<?php esc_attr_e('Share on LinkedIn', 'ambrygen-web'); ?>" title="<?php esc_attr_e('Share on LinkedIn', 'ambrygen-web'); ?>">
                        <img src="<?php echo esc_url($theme_url); ?>/assets/src/images/social-icons/linkedin-icon.svg" alt="" />
                    </a>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_webinar_registration_button(int $post_id, array $attributes = []): string
    {
        $post_id = $this->resolve_webinar_post_id($post_id);
        if (!$post_id) {
            return '';
        }

        $registration_link = (string) get_post_meta($post_id, 'registration_link', true);

        if (empty($registration_link)) {
            return '';
        }

        $new_tab = isset($attributes['newTab']) ? (bool) $attributes['newTab'] : true;
        $target  = $new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';

        ob_start();
        ?>
        <div class="banner-btn">
            <a class="site-btn is-style-site-trailing-icon" href="<?php echo esc_url($registration_link); ?>" 
               title="<?php esc_attr_e('Register Now', 'ambrygen-web'); ?>" role="Button"
               aria-label="<?php esc_attr_e('Register Now', 'ambrygen-web'); ?>"<?php echo $target; ?>><?php esc_html_e('Register Now', 'ambrygen-web'); ?></a>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_author_swiper(int $post_id, array $attributes = []): string
    {
        $post_id = $this->resolve_webinar_post_id($post_id);
        if (!$post_id) {
            return '';
        }

        $author_entries = $this->get_webinar_author_entries($post_id);

        if (empty($author_entries)) {
            return '';
        }

        $graphic_left  = !empty($attributes['overlayTopImage']) ? $attributes['overlayTopImage'] : get_theme_file_uri('assets/src/images/graphic-left.svg');
        $graphic_right = !empty($attributes['overlayBottomImage']) ? $attributes['overlayBottomImage'] : get_theme_file_uri('assets/src/images/graphic-right.svg');
        
        // Handle IDs if provided
        if (!empty($attributes['overlayTopImageId'])) {
            $graphic_left = wp_get_attachment_url($attributes['overlayTopImageId']);
        }
        if (!empty($attributes['overlayBottomImageId'])) {
            $graphic_right = wp_get_attachment_url($attributes['overlayBottomImageId']);
        }

        ob_start();
        ?>
        <div class="wp-block-group author-slider-block container-1280 bg-lightblue-gradient">
            <div class="graphic-images" aria-hidden="true">
                <div class="graphic-images__overlay-left graphic-images__img-block">
                    <img decoding="async" src="<?php echo esc_url($graphic_left); ?>" class="overlay__img" loading="lazy" alt="" width="1024" height="1024">
                </div>
                <div class="graphic-images__overlay-right graphic-images__img-block">
                    <img decoding="async" src="<?php echo esc_url($graphic_right); ?>" class="overlay__img" loading="lazy" alt="" width="1024" height="1024">
                </div>
            </div>

            <div class="is-style-gl-s50" aria-hidden="true"></div>

            <div class="author-slider swiper wrapper">
                <div class="swiper-wrapper">
                    <?php foreach ($author_entries as $author_entry) : ?>
                        <div class="swiper-slide">
                            <div class="author-slider__card">
                                <div class="author-slider__media">
                                    <?php if (!empty($author_entry['image_id'])) : ?>
                                        <?php echo \Ambrygen\Theme\Core\Helper::image((int) $author_entry['image_id'], 'large', ['class' => 'author-slider__image']); ?>
                                    <?php else : ?>
                                        <div class="author-slider__image placeholder"></div>
                                    <?php endif; ?>
                                </div>
                                <div class="author-slider__content">
                                    <div class="heading-5 author-slider__name"><?php echo esc_html($author_entry['title']); ?></div>
                                    <div class="is-style-gl-s8" aria-hidden="true"></div>
                                    <div class="text-md-medium author-slider__job-title"><?php echo esc_html($author_entry['designation']); ?></div>
                                    <div class="is-style-gl-s4" aria-hidden="true"></div>
                                    <?php if (!empty($author_entry['excerpt'])) : ?>
                                        <div class="text-sm-regular author-slider__disambiguation"><?php echo esc_html($author_entry['excerpt']); ?></div>
                                    <?php endif; ?>
                                    <div class="is-style-gl-s16" aria-hidden="true"></div>
                                    <div class="text-md-regular author-slider__description">
                                        <?php echo wp_kses_post($author_entry['content']); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <?php if (count($author_entries) > 1) : ?>
                <div class="swiper-buttons author-slider__controls">
                    <button type="button" class="custom-prev author-slider__nav-prev" aria-label="<?php esc_attr_e('Previous slide', 'ambrygen-web'); ?>"></button>
                    <button type="button" class="custom-next author-slider__nav-next" aria-label="<?php esc_attr_e('Next slide', 'ambrygen-web'); ?>"></button>
                </div>
                <?php endif; ?>
            </div>

            <div class="is-style-gl-s50" aria-hidden="true"></div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_webinar_additional_info(int $post_id): string
    {
        $post_id = $this->resolve_webinar_post_id($post_id);
        $options = get_option('ambrygen_theme_options');
        $content = $options['webinar_additional_content'] ?? [];
        $sections = [];

        if ($this->is_checkbox_enabled($post_id, 'ceu') && !empty($content['ceu']) && is_array($content['ceu'])) {
            $sections[] = $content['ceu'];
        }

        if ($this->is_checkbox_enabled($post_id, 'pace') && !empty($content['pace']) && is_array($content['pace'])) {
            $sections[] = $content['pace'];
        }

        if (empty($sections)) {
            return '';
        }

        ob_start();
        ?>
        <div class="webinar-additional-info">
            <div class="webinar-additional-info__grid">
                <?php foreach ($sections as $section) : 
                    $title   = isset($section['title']) ? (string) $section['title'] : '';
                    $logo_id = isset($section['image_id']) ? absint($section['image_id']) : 0;
                    $desc    = isset($section['desc']) ? $section['desc'] : '';
                    if (!$logo_id && '' === trim($title) && empty(trim(wp_strip_all_tags($desc)))) continue;
                ?>
                    <div class="webinar-additional-info__item" style="margin-bottom: 24px;">

                        <?php if ($logo_id) : ?>
                            <div class="webinar-additional-info__logo" style="margin-bottom: 8px;">
                                <?php echo wp_get_attachment_image($logo_id, 'full'); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($desc) : ?>
                            <div class="webinar-additional-info__description text-md-regular">
                                <p><?php echo wp_kses_post($desc); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
