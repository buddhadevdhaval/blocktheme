<?php
/**
 * Patterns class for registering and managing theme blocks.
 *
 * @package Ambrygen\Theme\Core
 */
namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Registers block pattern categories.
 *
 * @package Ambrygen
 */
final class Patterns {

	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->register_categories();
	}

	/**
	 * Register block pattern categories.
	 *
	 * @return void
	 */
	public function register_categories(): void {
		if ( function_exists( 'register_block_pattern_category' ) ) {
			register_block_pattern_category(
				'ambrygen',
				array(
					'label' => __( 'Ambrygen Patterns', 'ambrygen' ),
				)
			);
		}
	}
}
