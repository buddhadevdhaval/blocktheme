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

// Load the Theme bootstrap (single entry point).
require_once __DIR__ . '/includes/core/class-autoloader.php';

// Bootstrap the theme via singleton instance.
Ambrygen\Theme\Core\Theme::instance();
