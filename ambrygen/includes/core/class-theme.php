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

		/**
		 * Components that hook into admin_menu MUST be loaded early.
		 */
		add_action( 'init', array( __CLASS__, 'load_components' ) );

		/**
		 * Theme supports, patterns, etc.
		 */
		//add_action( 'after_setup_theme', array( __CLASS__, 'theme_setup' ) );

		add_action( 'wp', array( __CLASS__, 'theme_setup' ) );
	}

	/**
	 * Load theme components.
	 *
	 * @return void
	 */
	public static function load_components(): void {

		// Frontend + shared components.
		Blocks::init();
		Assets::init();
		Patterns::init();
	}

	/**
	 * Theme setup.
	 *
	 * @return void
	 */
	public static function theme_setup(): void { }
}
