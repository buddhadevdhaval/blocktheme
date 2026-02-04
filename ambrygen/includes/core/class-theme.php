<?php
/**
 * Theme core bootstrap.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

final class Theme {

	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup core theme hooks.
	 *
	 * @return void
	 */
	private function setup_hooks(): void {
		/**
		 * Components that hook into admin_menu MUST be loaded early.
		 */
		add_action( 'init', array( $this, 'load_components' ) );

		/**
		 * Theme supports, image sizes, etc.
		 *
		 * Use `after_setup_theme`
		 */
		add_action( 'after_setup_theme', array( $this, 'theme_setup' ) );

		add_filter('upload_mimes', array($this, 'ambry_allow_svg_uploads'));

	}

	
	/**
	 * Allow SVG uploads.
	 *
	 * @param array $mimes Allowed MIME types.
	 * @return array
	 */
	public function ambry_allow_svg_uploads($mimes)
	{
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}


	/**
	 * Load theme components.
	 *
	 * @return void
	 */
	public function load_components(): void {

		// Frontend + shared components.
		Blocks::instance();
		Assets::instance();
		Patterns::instance();
	}

	/**
	 * Theme setup.
	 *
	 * @return void
	 */
	public function theme_setup(): void { }
}
