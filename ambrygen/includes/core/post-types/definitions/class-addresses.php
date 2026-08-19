<?php
/**
 * Locations post type definitions.
 *
 * Groups post types related to physical places and addresses.
 * Currently: Addresses.
 * Future examples: Venues, Offices, Warehouses -- add them here.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Addresses -- physical address / location records.
 */
class Addresses extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'addresses';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Addresses', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Address', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-location';
	}
}
