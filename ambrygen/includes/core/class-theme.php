<?php
/**
 * Theme core bootstrap.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;


defined( 'ABSPATH' ) || exit;

final class Theme {

	/**
	 * Initialize theme.
	 *
	 * @return void
	 */
	public static function init(): void {

		// Load required core classes.
		require_once get_template_directory() . '/includes/core/class-blocks.php';
		require_once get_template_directory() . '/includes/core/class-assets.php';

		add_action( 'init', array( __CLASS__, 'load_components' ) );
	}

	/**
	 * Load theme components.
	 *
	 * @return void
	 */
	public static function load_components(): void {

		Blocks::init();
		Assets::init();
	}
}
