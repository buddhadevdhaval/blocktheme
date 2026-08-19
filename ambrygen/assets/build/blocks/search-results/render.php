<?php
/**
 * Render: Search Results Block
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Routes\SearchPageService;

echo SearchPageService::instance()->render_search_results( $attributes ?? array() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
