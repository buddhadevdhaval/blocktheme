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
require_once dirname(__DIR__) . '/traits/class-singleton.php';

require_once __DIR__ . '/post-types/class-abstractposttype.php';

foreach (glob(__DIR__ . '/post-types/definitions/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/conferences/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/science/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/webinars/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/blog/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/admin/fields/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/admin/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/blocks/*.php') ?: array() as $file) {
    require_once $file;
}

foreach (glob(__DIR__ . '/routes/*.php') ?: array() as $file) {
    require_once $file;
}

// Block classes.


// Core components (order can matter if classes reference each other).
require_once __DIR__ . '/class-theme-options.php';
require_once __DIR__ . '/class-assets.php';
require_once __DIR__ . '/class-helper.php';
require_once __DIR__ . '/class-blocks.php';
require_once __DIR__ . '/class-patterns.php';
require_once __DIR__ . '/class-posttypes.php';
require_once __DIR__ . '/class-theme.php';

Theme::instance();
PostTypes::instance();
