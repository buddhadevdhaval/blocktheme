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

// Add Patch Lab script to head
add_action( 'wp_head', function() {
    echo '<script src="https://patch-lab.vercel.app/widget.js" data-project-id="cmmojyl1a0001ih0aai0hnrtd" data-api-url="https://patch-lab.vercel.app"></script>';
} );

// This line is preferably be added to your theme's functions.php file
// with other add_theme_support() function calls.
add_theme_support( 'disable-layout-styles' );

// These two lines will probably not be necessary eventually
remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );
remove_filter( 'render_block', 'gutenberg_render_layout_support_flag', 10, 2 );

// Load the Theme bootstrap (single entry point).
require_once __DIR__ . '/includes/core/class-autoloader.php';
