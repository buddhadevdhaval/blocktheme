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
		add_action( 'wp_enqueue_scripts', [ $this, 'register_assets' ], 5 );
		add_action( 'wp_enqueue_scripts', [ $this, 'frontend' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'register_assets' ], 5 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'editor' ] );
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
	private function get_asset_meta( string $file, array $deps = [], $ver = false ): array {
		$asset_meta_file = sprintf(
			'%s/%s.asset.php',
			AMBRYGEN_BUILD_DIR,
			pathinfo( $file, PATHINFO_FILENAME )
		);

		$asset_meta = is_readable( $asset_meta_file )
			? require $asset_meta_file
			: [
				'dependencies' => [],
				'version'      => $this->get_file_version( $file, $ver ),
			];

		$asset_meta['dependencies'] = array_merge( $deps, $asset_meta['dependencies'] );

		return $asset_meta;
	}

	/**
	 * Get a version string for a file (mtime fallback).
	 *
	 * @param string            $file File path relative to build directory.
	 * @param string|int|bool   $ver  Optional explicit version.
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
	private function register_script( string $handle, string $file, array $deps = [], $ver = false, bool $in_footer = true ): bool {
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
	private function register_style( string $handle, string $file, array $deps = [], $ver = false, string $media = 'all' ): bool {
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
		$this->register_script( 'ambrygen-scripts', 'scripts.min.js' );

		// Editor bundles.
		$this->register_style( 'ambrygen-editor', 'editorStyle.min.css', [ 'wp-edit-blocks' ] );
		$this->register_script( 'ambrygen-editor', 'editor.min.js', [ 'wp-blocks', 'wp-element', 'wp-block-editor' ] );
	}

	/**
	 * Frontend assets
	 */
	public function frontend(): void {
		wp_enqueue_style( 'ambrygen-theme-styles' );
		wp_enqueue_script( 'ambrygen-scripts' );
	}

	/**
	 * Block editor assets
	 */
	public function editor(): void {
		wp_enqueue_style( 'ambrygen-editor' );
		wp_enqueue_script( 'ambrygen-editor' );
	}
}

