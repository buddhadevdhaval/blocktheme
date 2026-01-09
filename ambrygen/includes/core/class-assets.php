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

	public static function init(): void {
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'frontend' ] );
		add_action( 'enqueue_block_editor_assets', [ __CLASS__, 'editor' ] );
	}

	/**
	 * Frontend assets
	 */
	public static function frontend(): void {
		wp_enqueue_style(
			'ambrygen-theme-styles',
			get_theme_file_uri( 'assets/build/styles.css' ),
			[],
			wp_get_theme()->get( 'Version' ),
			'all'
		);
		
		wp_enqueue_script(
			'ambrygen-scripts',
			get_theme_file_uri( 'assets/build/scripts.min.js' ),
			[ 'wp-dom-ready' ],
			wp_get_theme()->get( 'Version' ),
			[ 'strategy' => 'defer', 'in_footer' => true ]
		);
	}
	/**
	 * Block editor assets
	 */
	public static function editor(): void {
		$version = wp_get_theme()->get( 'Version' );

		wp_enqueue_style(
			'ambrygen-editor',
			get_theme_file_uri( 'assets/build/editorStyle.css' ),
			[ 'wp-edit-blocks' ],
			$version,
			'all'
		);

		wp_enqueue_script(
			'ambrygen-editor',
			get_theme_file_uri( 'assets/build/editor.min.js' ),
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$version,
			[ 'strategy' => 'defer', 'in_footer' => true ]
		);
	}
}

