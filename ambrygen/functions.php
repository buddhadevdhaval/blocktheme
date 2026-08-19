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

/**
 * Filter VIP image resize quality settings.
 *
 * @param array $args Resize arguments.
 * @return array
 */
function my_image_quality_filter( $args ) {
	$args['quality'] = 75; // Set the quality to 75 (you can adjust this value as needed).
	return $args;
}
add_filter( 'vip_go_image_resize_pre_args', 'my_image_quality_filter', 999 );


// This line is preferably be added to your theme's functions.php file
// with other add_theme_support() function calls.
add_theme_support( 'disable-layout-styles' );

// These two lines will probably not be necessary eventually
remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );
remove_filter( 'render_block', 'gutenberg_render_layout_support_flag', 10, 2 );

// Load core block styles only when those blocks render on the page.
add_filter( 'should_load_separate_core_block_assets', '__return_true' );

// Load the Theme bootstrap (single entry point).
require_once __DIR__ . '/includes/core/class-autoloader.php';
