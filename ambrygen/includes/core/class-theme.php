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

		// phpcs:ignore WordPressVIPMinimum.Hooks.RestrictedHooks.upload_mimes
		add_filter( 'upload_mimes', array( $this, 'ambry_allow_svg_uploads' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'ambry_fix_ico_upload' ), 10, 3 );
	}

	
	/**
	 * Allow SVG uploads.
	 *
	 * @param array $mimes Allowed MIME types.
	 * @return array
	 */
	public function ambry_allow_svg_uploads( $mimes ) {
		$mimes['svg'] = 'image/svg+xml';
		$mimes['ico'] = 'image/x-icon';

		return $mimes;
	}
	public function ambry_fix_ico_upload( $data, $file, $filename ) {

		if ( 'ico' === strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) ) ) {
			return array(
				'ext'             => 'ico',
				'type'            => 'image/x-icon',
				'proper_filename' => $filename,
			);
		}

		return $data;
	}

	/**
	 * Load theme components.
	 *
	 * @return void
	 */
	public function load_components(): void {

		// Frontend + shared components.
		Helper::instance();
		Blocks::instance();
		Assets::instance();
		Patterns::instance();

		// Custom Post Types
		Post_Types::instance();
		Theme_Options::instance();
	}

	/**
	 * Theme setup.
	 *
	 * @return void
	 */
	public function theme_setup(): void {

		// Load translations.
		load_theme_textdomain(
			AMBRYGEN_TEXT_DOMAIN,
			get_template_directory() . '/languages'
		);

		// Add custom image sizes.
		add_image_size( 'hero-desktop', 1905, 0, false );
	}
}
