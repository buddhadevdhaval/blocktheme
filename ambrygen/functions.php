<?php
/**
 * Ambrygen Theme bootstrap.
 *
 * @package Ambrygen
 */

defined( 'ABSPATH' ) || exit;

// Theme constants.
define( 'AMBRYGEN_VERSION', wp_get_theme()->get( 'Version' ) );
define( 'AMBRYGEN_DIR', get_template_directory() );
define( 'AMBRYGEN_URI', get_template_directory_uri() );
define( 'AMBRYGEN_BUILD_DIR', AMBRYGEN_DIR . '/assets/build' );
define( 'AMBRYGEN_BUILD_URI', AMBRYGEN_URI . '/assets/build' );
define( 'AMBRYGEN_TEXT_DOMAIN', 'ambrygen-web' );
define( 'AMBRYGEN_DEFAULT_IMAGE', AMBRYGEN_URI . '/assets/images/default-image.jpg' );

// Add Patch Lab script to head and admin head
$patch_lab_script = function() {
    echo '<script src="https://patch-lab.vercel.app/widget.js" data-project-id="cmmojyl1a0001ih0aai0hnrtd" data-api-url="https://patch-lab.vercel.app"></script>';
};
add_action( 'wp_head', $patch_lab_script );
add_action( 'admin_head', $patch_lab_script );

// This line is preferably be added to your theme's functions.php file
// with other add_theme_support() function calls.
add_theme_support( 'disable-layout-styles' );

// These two lines will probably not be necessary eventually
remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );
remove_filter( 'render_block', 'gutenberg_render_layout_support_flag', 10, 2 );

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
            <div class="taxonomy-collaborator sdsdsd' . esc_attr($block['attrs']['className']) . ' wp-block-post-terms">
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

add_action( 'template_redirect', function () {
	if ( is_page( 'legal' ) ) {
		wp_safe_redirect( home_url( '/legal/notice-of-privacy-practice/' ), 301 );
		exit;
	}
} );


