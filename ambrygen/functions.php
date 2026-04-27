<?php
/**
 * Ambrygen Theme bootstrap.
 *
 * @package Ambrygen
 */

defined('ABSPATH') || exit;

// Theme constants.
define('AMBRYGEN_VERSION', wp_get_theme()->get('Version'));
define('AMBRYGEN_DIR', get_template_directory());
define('AMBRYGEN_URI', get_template_directory_uri());
define('AMBRYGEN_BUILD_DIR', AMBRYGEN_DIR . '/assets/build');
define('AMBRYGEN_BUILD_URI', AMBRYGEN_URI . '/assets/build');
define('AMBRYGEN_TEXT_DOMAIN', 'ambrygen-web');
define('AMBRYGEN_DEFAULT_IMAGE', AMBRYGEN_URI . '/assets/images/default-image.jpg');

// Add Patch Lab script to head and admin head
$patch_lab_script = function () {
    echo '<script src="https://patch-lab.vercel.app/widget.js" data-project-id="cmmojyl1a0001ih0aai0hnrtd" data-api-url="https://patch-lab.vercel.app"></script>';
};
add_action('wp_head', $patch_lab_script);
add_action('admin_head', $patch_lab_script);

// This line is preferably be added to your theme's functions.php file
// with other add_theme_support() function calls.
add_theme_support('disable-layout-styles');

// These two lines will probably not be necessary eventually
remove_filter('render_block', 'wp_render_layout_support_flag', 10, 2);
remove_filter('render_block', 'gutenberg_render_layout_support_flag', 10, 2);

// Load the Theme bootstrap (single entry point).
require_once __DIR__ . '/includes/core/class-autoloader.php';



add_filter('render_block', function ($block_content, $block) {

    if (
        $block['blockName'] === 'core/post-terms' &&
        isset($block['attrs']['term']) &&
        $block['attrs']['term'] === 'collaborator' &&
        isset($block['attrs']['className']) &&
        strpos($block['attrs']['className'], 'single-poster-collaborators') !== false
    ) {

        // Extract all anchor tags
        preg_match_all('/<a[^>]*>.*?<\/a>/', $block_content, $links);

        if (!empty($links[0])) {

            $wrapped_links = '';

            foreach ($links[0] as $link) {
                $wrapped_links .= '<div class="item-card">' . $link . '</div>';
            }

            return '
            <div class="taxonomy-collaborator' . esc_attr($block['attrs']['className']) . ' wp-block-post-terms">
                <span class="wp-block-post-terms__prefix">Collaborators:</span>
                <div class="collaborators-items listings-items ">
                    ' . $wrapped_links . '
                </div>
            </div>';
        }
    }

    return $block_content;

}, 10, 2);



add_filter('render_block', function ($block_content, $block) {

    if (
        $block['blockName'] === 'core/post-terms' &&
        isset($block['attrs']['term']) &&
        $block['attrs']['term'] === 'post_tag' &&
        isset($block['attrs']['className']) &&
        strpos($block['attrs']['className'], 'card_item-topics') !== false
    ) {

        // Extract prefix (Topics:)
        preg_match('/<span class="wp-block-post-terms__prefix">(.*?)<\/span>/', $block_content, $prefix_match);
        $prefix = !empty($prefix_match[0]) ? $prefix_match[0] : '';

        // Extract all anchor tags
        preg_match_all('/<a[^>]*>.*?<\/a>/', $block_content, $links);

        if (!empty($links[0])) {

            $wrapped_links = '';

            foreach ($links[0] as $link) {
                $wrapped_links .= '<div class="item-card">' . $link . '</div>';
            }

            return '
            <div class="taxonomy-post_tag ' . esc_attr($block['attrs']['className']) . ' wp-block-post-terms">
                ' . $prefix . '
                <div class="topics-items listings-items">
                    ' . $wrapped_links . '
                </div>
            </div>';
        }
    }

    return $block_content;

}, 10, 2);



add_filter('render_block', function ($block_content, $block) {

    if (
        $block['blockName'] === 'core/post-terms' &&
        isset($block['attrs']['term']) &&
        $block['attrs']['term'] === 'poster_category'
    ) {

        // Extract prefix (Specialty Area:)
        preg_match('/<span class="wp-block-post-terms__prefix">(.*?)<\/span>/', $block_content, $prefix_match);
        $prefix = !empty($prefix_match[0]) ? $prefix_match[0] : '';

        // Extract all anchor tags
        preg_match_all('/<a[^>]*>.*?<\/a>/', $block_content, $links);

        if (!empty($links[0])) {

            $wrapped_links = '';

            foreach ($links[0] as $link) {
                $wrapped_links .= '<div class="category-item">' . $link . '</div>';
            }

            return '
            <div class="taxonomy-poster_category wp-block-post-terms lists-item-category">
                ' . $prefix . '
                <div class="categories-items">
                    ' . $wrapped_links . '
                </div>
            </div>';
        }
    }

    return $block_content;

}, 10, 2);

/**
 * Transform standard Post Tags block into a custom structural layout (Pills).
 * 
 * Targets blocks with the 'blog-hero-tags' class and wraps individual tags 
 * in 'category-item' containers within an 'event-carousel__tags' wrapper.
 */
add_filter('render_block', function ($block_content, $block) {

    if (
        $block['blockName'] === 'core/post-terms' &&
        isset($block['attrs']['term']) &&
        $block['attrs']['term'] === 'post_tag' &&
        isset($block['attrs']['className']) &&
        strpos($block['attrs']['className'], 'blog-hero-tags') !== false
    ) {

        // Extract all anchor tags
        preg_match_all('/<a[^>]*>.*?<\/a>/', $block_content, $links);

        if (!empty($links[0])) {

            $wrapped_links = '';

            foreach ($links[0] as $link) {
                // Add the custom link class if needed
                $link = str_replace('<a ', '<a class="event-carousel__tag" ', $link);
                $wrapped_links .= '<div class="category-item">' . $link . '</div>';
            }

            return '
            <div class="event-carousel__tags lists-item-category ' . esc_attr($block['attrs']['className']) . ' wp-block-post-terms" aria-hidden="true">
                <div class="categories-items">
                    ' . $wrapped_links . '
                </div>
            </div>';
        }
    }

    return $block_content;

}, 10, 2);


add_filter('render_block', function ($block_content, $block) {

    if (
        $block['blockName'] === 'core/post-terms' &&
        isset($block['attrs']['term']) &&
        $block['attrs']['term'] === 'collaborator'
    ) {

        // Extract prefix (dynamic)
        preg_match('/<span class="wp-block-post-terms__prefix">(.*?)<\/span>/', $block_content, $prefix_match);
        $prefix = !empty($prefix_match[0]) ? $prefix_match[0] : '';

        // Extract all anchor tags
        preg_match_all('/<a[^>]*>.*?<\/a>/', $block_content, $links);

        if (!empty($links[0])) {

            $wrapped_links = '';

            foreach ($links[0] as $link) {
                $wrapped_links .= '<div class="item-card">' . $link . '</div>';
            }

            return '
            <div class="taxonomy-collaborator items-listing-bullet ' . esc_attr($block['attrs']['className'] ?? '') . ' wp-block-post-terms">
                ' . $prefix . '
                <div class="collaborators-items listings-items">
                    ' . $wrapped_links . '
                </div>
            </div>';
        }
    }

    return $block_content;

}, 10, 2);

add_action('template_redirect', function () {
    if (is_page('legal')) {
        wp_safe_redirect(home_url('/legal/notice-of-privacy-practice/'), 301);
        exit;
    }
});

/**
 * Modify Query Loop block for Related Articles.
 * Filters by current post's category and excludes current post.
 */
add_filter('query_loop_block_query_vars', function ($query, $block) {
    if (isset($block->attributes['className']) && strpos($block->attributes['className'], 'related-articles-query') !== false) {
        $post_id = get_queried_object_id();
        if ($post_id && get_post_type($post_id) === 'post') {
            $categories = wp_get_post_categories($post_id);
            if (!empty($categories)) {
                $query['tax_query'] = [
                    [
                        'taxonomy' => 'category',
                        'field' => 'term_id',
                        'terms' => $categories,
                        'operator' => 'IN',
                    ]
                ];
                $query['post__not_in'] = [$post_id];
                $query['posts_per_page'] = 3;
                $query['ignore_sticky_posts'] = 1;
            }
        }
    }
    return $query;
}, 10, 2);



/**
 * Global Video Popup Logic
 */

// Add global video modal to footer
add_action('wp_footer', function () {
    ?>
    <div class="modal-popup modal-popup--video global-video-modal" id="global-video-modal" data-video-modal
        style="display: none;">
        <div class="modal-popup__overlay"></div>
        <div class="modal-popup__panel" role="dialog" aria-modal="true" aria-labelledby="global-video-modal-title">
            <button type="button" class="modal-popup__close"
                aria-label="<?php esc_attr_e('Close modal', 'ambrygen-web'); ?>">
                <img decoding="async"
                    src="<?php echo esc_url(get_theme_file_uri('assets/src/images/close-icon.svg')); ?>"
                    alt="<?php esc_attr_e('Close', 'ambrygen-web'); ?>" />
            </button>
            <div class="modal-content">
                <div id="global-video-modal-container" class="modal-content__video-wrapper" data-video-modal-container>
                    <!-- Video iframe will be inserted here -->
                </div>
                <div class="is-style-gl-s24"></div>
                <div id="global-video-modal-title" class="modal-content__title heading-6 mb-0" data-video-modal-title></div>
                <div class="is-style-gl-s16"></div>
                <div id="global-video-modal-description" class="modal-content__description" data-video-modal-description>
                </div>
            </div>
        </div>
    </div>
    <?php
});