<?php
/**
 * Re‑usable singleton helper.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Simple singleton trait to be used by core classes.
 */
trait Singleton {

	/**
	 * Holds the single instance of the class.
	 *
	 * @var static|null
	 */
	protected static $instance = null;

	/**
	 * Get the singleton instance.
	 *
	 * @return static
	 */
	public static function instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}

		return static::$instance;
	}
}

