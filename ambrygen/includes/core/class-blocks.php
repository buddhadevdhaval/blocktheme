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

	use Singleton;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function setup_hooks(): void {
		$this->register_block_category();
		$this->register_blocks();
	}

	/**
	 * Register custom block category.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_block_category(): void {
		add_filter( 'block_categories_all', function ( $categories, $post ) {
	
			return array_merge(
				[
					[
						'slug'  => 'ambrygen',
						'title' => __( 'Ambrygen Blocks', 'ambrygen-web' ),
					]
				],
				$categories
			);
		}, 10, 2 );
	}

	/**
	 * Register all blocks using blocks manifest.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_blocks(): void {

		$blocks_dir = get_template_directory() . '/assets/build/blocks';


		$manifest_file = $blocks_dir . '/blocks-manifest.php'; 

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
