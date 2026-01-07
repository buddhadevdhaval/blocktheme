<?php
/**
 * Ambrygen Theme bootstrap.
 *
 * @package Ambrygen
 */

defined( 'ABSPATH' ) || exit;

// Load the Theme bootstrap (single entry point).
require_once __DIR__ . '/includes/core/class-theme.php';

// Initialize theme.
Ambrygen\Theme\Core\Theme::init();
