<?php
/**
 * Blocks class for registering and managing theme blocks.
 *
 * @package Ambrygen\Theme\Core
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Blocks class.
 *
 * @since 1.0.0
 */
final class Blocks {

	/**
	 * Initialize block registration.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public static function init(): void {
		// Register blocks immediately.
		self::register_blocks();
	}

	/**
	 * Register all blocks using blocks manifest.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public static function register_blocks(): void {
	
		$blocks_dir = get_template_directory() . '/assets/build/blocks';


		$manifest_file = get_template_directory() . '/assets/build/blocks-manifest.php'; 

		if ( file_exists( $manifest_file ) ) {

			if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			
				wp_register_block_types_from_metadata_collection(
					$blocks_dir,
					$manifest_file
				);
			}
		}
	}
}
