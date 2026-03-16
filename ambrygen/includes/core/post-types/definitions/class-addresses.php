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

	public function slug(): string {
		return 'addresses';
	}

	public function label(): string {
		return __( 'Addresses', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Address', 'ambrygen' );
	}

	public function menu_icon(): string {
		return 'dashicons-location';
	}
}
