<?php
/**
 * Asset loader
 *
 * @package Ambrygen
 * @since 1.0.0
 */

namespace Ambrygen\Theme\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register and enqueue compiled theme assets.
 */
final class Assets {

	use Singleton;

	/**
	 * Log debug messages when WP_DEBUG is enabled.
	 *
	 * @param string $message Message.
	 * @return void
	 */
	private function log_debug( string $message ): void {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[ambrygen-assets] ' . $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}

	/**
	 * Boot hooks on construct.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup WordPress hooks.
	 *
	 * @return void
	 */
	private function setup_hooks(): void {
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ), 5 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_assets' ), 5 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin' ), 10 );
		add_filter( 'style_loader_tag', array( $this, 'defer_non_critical_styles' ), 10, 4 );
		add_action( 'wp_head', array( $this, 'preload_fonts' ), 1 );
	}

	/**
	 * Emit font preload hints so the browser discovers Inter before parsing CSS.
	 */
	public function preload_fonts(): void {
		if ( is_admin() || ! wp_style_is( 'ambrygen-theme-styles', 'enqueued' ) ) {
			return;
		}

		$font_url = esc_url( $this->get_preload_font_url() );
		echo '<link rel="preload" href="' . $font_url . '" as="font" type="font/woff2" crossorigin="anonymous">' . "\n";
	}

	/**
	 * Resolve the compiled Inter font URL so the preload matches the CSS request.
	 *
	 * @return string
	 */
	private function get_preload_font_url(): string {
		$compiled_fonts = glob( AMBRYGEN_BUILD_DIR . '/fonts/Inter-VariableFont_opsz,wght*.woff2' );

		if ( ! empty( $compiled_fonts ) ) {
			$font_file = basename( $compiled_fonts[0] );
			return AMBRYGEN_BUILD_URI . '/fonts/' . $font_file;
		}

		return AMBRYGEN_URI . '/assets/src/fonts/Inter-VariableFont_opsz,wght.woff2';
	}

	/**
	 * Get asset dependencies and version information if an asset map exists.
	 *
	 * @param string $file File path relative to build directory.
	 * @param array  $deps Dependencies to merge.
	 * @param string $ver  Optional version override.
	 *
	 * @return array
	 */
	private function get_asset_meta( string $file, array $deps = array(), $ver = false ): array {
		$asset_meta_file = sprintf(
			'%s/%s.asset.php',
			AMBRYGEN_BUILD_DIR,
			pathinfo( $file, PATHINFO_FILENAME )
		);

		$asset_meta = is_readable( $asset_meta_file )
			? require $asset_meta_file
			: array(
				'dependencies' => array(),
				'version'      => $this->get_file_version( $file, $ver ),
			);

		$asset_meta['dependencies'] = array_merge( $deps, $asset_meta['dependencies'] );

		return $asset_meta;
	}

	/**
	 * Get a version string for a file (mtime fallback).
	 *
	 * @param string          $file File path relative to build directory.
	 * @param string|int|bool $ver  Optional explicit version.
	 * @return string|false
	 */
	private function get_file_version( string $file, $ver = false ) {
		if ( ! empty( $ver ) ) {
			return $ver;
		}

		$file_path = sprintf( '%s/%s', AMBRYGEN_BUILD_DIR, $file );

		return file_exists( $file_path ) ? filemtime( $file_path ) : false;
	}

	/**
	 * Register a script relative to build dir.
	 *
	 * @param string           $handle Handle.
	 * @param string           $file   File relative to build dir.
	 * @param array            $deps   Dependencies.
	 * @param string|bool|null $ver    Version override.
	 * @param bool             $in_footer Enqueue in footer.
	 * @return bool
	 */
	private function register_script( string $handle, string $file, array $deps = array(), $ver = false, bool $in_footer = true ): bool {
		$file_path = sprintf( '%s/%s', AMBRYGEN_BUILD_DIR, $file );
		if ( ! file_exists( $file_path ) ) {
			$this->log_debug( "Skip missing script {$file}" );
			return false;
		}

		$asset_meta = $this->get_asset_meta( $file, $deps, $ver );
		$src        = sprintf( '%s/%s', AMBRYGEN_BUILD_URI, $file );

		$registered = wp_register_script( $handle, $src, $asset_meta['dependencies'], $asset_meta['version'], $in_footer );

		if ( $registered ) {
			wp_script_add_data( $handle, 'strategy', 'defer' );
		}

		return $registered;
	}

	/**
	 * Register a stylesheet relative to build dir.
	 *
	 * @param string           $handle Handle.
	 * @param string           $file   File relative to build dir.
	 * @param array            $deps   Dependencies.
	 * @param string|bool|null $ver    Version override.
	 * @param string           $media  Media.
	 * @return bool
	 */
	private function register_style( string $handle, string $file, array $deps = array(), $ver = false, string $media = 'all' ): bool {
		$file_path = sprintf( '%s/%s', AMBRYGEN_BUILD_DIR, $file );

		if ( ! file_exists( $file_path ) ) {
			$this->log_debug( "Skip missing style {$file}" );
			return false;
		}

		$asset_meta = $this->get_asset_meta( $file, $deps, $ver );
		$src        = sprintf( '%s/%s', AMBRYGEN_BUILD_URI, $file );

		$registered = wp_register_style( $handle, $src, $asset_meta['dependencies'], $asset_meta['version'], $media );

		$rtl_path = preg_replace( '/\.css$/', '-rtl.css', $file );
		if ( $registered && $rtl_path !== $file && file_exists( sprintf( '%s/%s', AMBRYGEN_BUILD_DIR, $rtl_path ) ) ) {
			wp_style_add_data( $handle, 'rtl', 'replace' );
		}

		return $registered;
	}

	/**
	 * Register theme assets.
	 */
	public function register_assets(): void {
		// Frontend bundles.
		$this->register_style( 'ambrygen-theme-styles', 'styles.min.css' );
		$this->register_style( 'ambrygen-scripts-styles', 'scripts.min.css' );
		$this->register_script( 'ambrygen-scripts', 'scripts.min.js' );

		// Editor bundles.
		$this->register_style( 'ambrygen-editor', 'editorStyle.min.css', array( 'wp-edit-blocks' ) );
		$this->register_script( 'ambrygen-editor', 'editor.min.js', array( 'wp-blocks', 'wp-element', 'wp-block-editor' ) );
	}

	/**
	 * Frontend assets
	 */
	public function frontend(): void {
		wp_enqueue_style( 'ambrygen-theme-styles' );
		wp_enqueue_style( 'ambrygen-scripts-styles' );
		wp_enqueue_script( 'ambrygen-scripts' );

			wp_localize_script(
				'ambrygen-scripts',
				'ambrygenAjax',
				array(
					'ajaxUrl' => admin_url( 'admin-ajax.php' ),
					'nonce'   => wp_create_nonce( 'ambrygen-ajax' ),
				)
			);

	}

	/**
	 * Defer non-critical theme stylesheets until after initial paint.
	 *
	 * @param string $html   The link tag markup.
	 * @param string $handle Style handle.
	 * @param string $href   Style URL.
	 * @param string $media  Media attribute.
	 * @return string
	 */
	public function defer_non_critical_styles( string $html, string $handle, string $href, string $media ): string {
		if ( is_admin() ) {
			return $html;
		}

		$deferred_handles = apply_filters(
			'ambrygen_deferred_style_handles',
			array(
				'ambrygen-scripts-styles',
			)
		);

		if ( ! in_array( $handle, $deferred_handles, true ) ) {
			return $html;
		}

		$media_attr = $media ? $media : 'all';

		return sprintf(
			"<link rel='preload' href='%s' as='style' onload=\"this.onload=null;this.rel='stylesheet';this.media='%s'\" />\n<noscript><link rel='stylesheet' id='%s-css' href='%s' media='%s' /></noscript>\n",
			esc_url( $href ),
			esc_attr( $media_attr ),
			esc_attr( $handle ),
			esc_url( $href ),
			esc_attr( $media_attr )
		);
	}

		/**
		 * Frontend assets
		 */
	public function admin(): void {
		// admin globle
		if ( ! $this->register_script( 'ambrygen-admin-scripts', 'admin.min.js', array( 'jquery', 'media-editor' ) ) ) {
			$source_file = AMBRYGEN_DIR . '/assets/src/js/vendors/admin-scripts.js';

			if ( file_exists( $source_file ) ) {
				wp_register_script(
					'ambrygen-admin-scripts',
					AMBRYGEN_URI . '/assets/src/js/vendors/admin-scripts.js',
					array( 'jquery', 'media-editor' ),
					(string) filemtime( $source_file ),
					true
				);
			}
		}

		wp_enqueue_script( 'ambrygen-admin-scripts' );

		wp_localize_script(
			'ambrygen-admin-scripts',
			'ambrygenAdminAjax',
			array(
				'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
				'nonce'         => wp_create_nonce( 'ambrygen_post_search' ),
				'termNonce'     => wp_create_nonce( 'ambrygen_term_search' ),
				'trackingNonce' => wp_create_nonce( 'ambrygen_marketing_material_tracking' ),
			)
		);
	}


	/**
	 * Block editor assets
	 */
	public function editor(): void {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ! $screen || 'post' !== $screen->base ) {
			return;
		}

		wp_enqueue_style( 'ambrygen-editor' );
		wp_enqueue_script( 'ambrygen-editor' );

		// Get image ID from theme options.
		$placeholder_id = Theme_Options::get_placeholder_image_id();

		// Convert ID to URL.
		$placeholder_url = $placeholder_id
			? wp_get_attachment_image_url( $placeholder_id, 'full' )
			: get_template_directory_uri() . '/assets/src/images/default-image.png';

		wp_localize_script(
			'ambrygen-editor',
			'ambrygenAssets',
			array(
				'themeUrl'        => get_template_directory_uri(),
				'defaultImageUrl' => $placeholder_url,
				'defaultImageId'  => $placeholder_id,
			)
		);
	}
}
