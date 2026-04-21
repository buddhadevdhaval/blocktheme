<?php

namespace Ambrygen\Theme\Core\Webinars;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class WebinarRenderer
{
    use Singleton;

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
        $ceu = (string) get_post_meta($post_id, 'ceu', true);
        $pace = (string) get_post_meta($post_id, 'pace', true);
        $registration_link = (string) get_post_meta($post_id, 'registration_link', true);

        $start_ts = $start_at ? strtotime($start_at) : false;
        $date_display = $start_ts ? date_i18n('l, F j, Y', $start_ts) : '';
        $time_display = $start_ts ? date_i18n('g:i a T', $start_ts) : '';
        $day_badge = $start_ts ? date_i18n('jS', $start_ts) : '';
        $month_badge = $start_ts ? strtoupper(date_i18n('M', $start_ts)) : '';

        $duration_mins = (int) $duration;
        $duration_display = '';
        if ($duration_mins > 0) {
            if ($duration_mins < 60) {
                $duration_display = $duration_mins . ' ' . _n('minute', 'minutes', $duration_mins, 'ambrygen');
            } else {
                $duration_hours = $duration_mins / 60;
                if ($duration_hours == (int) $duration_hours) {
                    $duration_label = (1 === (int) $duration_hours) ? __('hour', 'ambrygen') : __('hours', 'ambrygen');
                    $duration_display = (int) $duration_hours . ' ' . $duration_label;
                } else {
                    $duration_display = $duration_hours . ' ' . __('hours', 'ambrygen');
                }
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
                    <?php if ('' !== $ceu): ?>
                        <div class="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <span class="event-carousel__meta-label">C.E.U.:</span>
                            <span class="event-carousel__ceu-text"><?php echo esc_html($ceu); ?></span>
                        </div>
                    <?php endif; ?>
                    <?php if ('' !== $pace): ?>
                        <div class="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
                            <span class="event-carousel__meta-list-icon flag-icon"></span>
                            <span class="event-carousel__meta-label">P.A.C.E.:</span>
                            <span class="event-carousel__pace-text"><?php echo esc_html($pace); ?></span>
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
        if (!$post_id) {
            return '';
        }

        $start_at = (string) get_post_meta($post_id, 'start_at', true);
        $duration = (string) get_post_meta($post_id, 'duration', true);
        $ceu      = (string) get_post_meta($post_id, 'ceu', true);
        $pace     = (string) get_post_meta($post_id, 'pace', true);

        $start_ts     = $start_at ? strtotime($start_at) : false;
        $date_display = $start_ts ? date_i18n('l, F j, Y', $start_ts) : '';
        $time_display = $start_ts ? date_i18n('g:i a T', $start_ts) : '';

        $duration_mins    = (int) $duration;
        $duration_display = '';
        if ($duration_mins > 0) {
            if ($duration_mins < 60) {
                $duration_display = $duration_mins . ' ' . _n('minute', 'minutes', $duration_mins, 'ambrygen-web');
            } else {
                $duration_hours = $duration_mins / 60;
                if ($duration_hours == (int) $duration_hours) {
                    $duration_label   = (1 === (int) $duration_hours) ? __('hour', 'ambrygen-web') : __('hours', 'ambrygen-web');
                    $duration_display = (int) $duration_hours . ' ' . $duration_label;
                } else {
                    $duration_display = $duration_hours . ' ' . __('hours', 'ambrygen-web');
                }
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

            <?php if (!empty($ceu)) : ?>
                <div class="text-md-medium event-carousel__ceu-row flag-info flag-book-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <span class="event-carousel__meta-label"><?php esc_html_e('C.E.U.:', 'ambrygen-web'); ?></span>
                    <span class="event-carousel__ceu-text"><?php echo esc_html($ceu); ?></span>
                </div>
            <?php endif; ?>

            <?php if (!empty($pace)) : ?>
                <div class="text-md-medium event-carousel__pace-row flag-info flag-flask-info">
                    <span class="event-carousel__meta-list-icon flag-icon"></span>
                    <span class="event-carousel__meta-label"><?php esc_html_e('P.A.C.E.:', 'ambrygen-web'); ?></span>
                    <span class="event-carousel__pace-text"><?php echo esc_html($pace); ?></span>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_share_post(int $post_id): string
    {
        if (!$post_id) {
            return '';
        }

        $url   = get_permalink($post_id);
        $title = get_the_title($post_id);
        $theme_url = get_template_directory_uri();

        $facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode($url);
        $twitter_url  = 'https://twitter.com/intent/tweet?url=' . urlencode($url) . '&text=' . urlencode($title);
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

    public function render_author_swiper(int $post_id, array $attributes = []): string
    {
        if (!$post_id) {
            return '';
        }

        $author_ids = get_post_meta($post_id, 'linked_author', true);
        
        // Ensure we have a valid array of IDs
        if (empty($author_ids)) {
            return '';
        }

        if (!is_array($author_ids)) {
            $author_ids = [$author_ids];
        }
        
        // Filter out any zero or empty values
        $author_ids = array_filter($author_ids);
        
        if (empty($author_ids)) {
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
        <div class="wp-block-group author-slider-block container-1280">
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
                    <?php foreach ($author_ids as $author_id) : ?>
                        <?php 
                        $author_post = get_post($author_id);
                        if (!$author_post || 'author' !== $author_post->post_type) {
                            continue;
                        }

                        $title       = get_the_title($author_id);
                        $designation = get_post_meta($author_id, 'designation', true);
                        $excerpt     = get_the_excerpt($author_id);
                        $content     = apply_filters('the_content', $author_post->post_content);
                        $image_id    = get_post_thumbnail_id($author_id);
                        ?>
                        <div class="swiper-slide">
                            <div class="author-slider__card">
                                <div class="author-slider__media">
                                    <?php if ($image_id) : ?>
                                        <?php echo \Ambrygen\Theme\Core\Helper::image($image_id, 'large', ['class' => 'author-slider__image']); ?>
                                    <?php else : ?>
                                        <div class="author-slider__image placeholder"></div>
                                    <?php endif; ?>
                                </div>
                                <div class="author-slider__content">
                                    <div class="heading-5 author-slider__name"><?php echo esc_html($title); ?></div>
                                    <div class="is-style-gl-s8" aria-hidden="true"></div>
                                    <div class="text-md-medium author-slider__job-title"><?php echo esc_html($designation); ?></div>
                                    <div class="is-style-gl-s4" aria-hidden="true"></div>
                                    <?php if (!empty($excerpt)) : ?>
                                        <div class="text-sm-regular author-slider__disambiguation"><?php echo esc_html($excerpt); ?></div>
                                    <?php endif; ?>
                                    <div class="is-style-gl-s16" aria-hidden="true"></div>
                                    <div class="text-md-regular author-slider__description">
                                        <?php echo wp_kses_post($content); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="swiper-buttons author-slider__controls">
                    <button type="button" class="custom-prev author-slider__nav-prev" aria-label="<?php esc_attr_e('Previous slide', 'ambrygen-web'); ?>"></button>
                    <button type="button" class="custom-next author-slider__nav-next" aria-label="<?php esc_attr_e('Next slide', 'ambrygen-web'); ?>"></button>
                </div>
            </div>

            <div class="is-style-gl-s50" aria-hidden="true"></div>
        </div>
        <?php
        return ob_get_clean();
    }
}
