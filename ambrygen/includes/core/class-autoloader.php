<?php
/**
 * Theme core bootstrap loader.
 *
 * Single place to load all primary theme classes.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

// Shared traits.
require_once dirname( __DIR__ ) . '/traits/class-singleton.php';

// Core components (order can matter if classes reference each other).
require_once __DIR__ . '/class-assets.php';
require_once __DIR__ . '/class-blocks.php';
require_once __DIR__ . '/class-patterns.php';
require_once __DIR__ . '/class-theme.php';
