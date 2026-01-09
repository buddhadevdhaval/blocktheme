<?php
/**
 * Core class loader.
 *
 * Loads all primary theme classes.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

// Core dependencies.
require_once __DIR__ . '/class-assets.php';
require_once __DIR__ . '/class-blocks.php';
require_once __DIR__ . '/class-patterns.php';
require_once __DIR__ . '/class-theme.php';
