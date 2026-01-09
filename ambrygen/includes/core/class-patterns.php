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
	/**
	 * Bootstraps hooks.
	 *
	 * @return void
	 */
	public static function init(): void {
		self::register_categories();
	}

	/**
	 * Register block pattern categories.
	 *
	 * @return void
	 */
	public static function register_categories(): void {
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
