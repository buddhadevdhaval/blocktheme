<?php
/**
 * Booths post type definitions.
 *
 * Groups post types related to events and exhibitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Booths -- exhibition booth listings, typically linked to a Tread Show.
 */
class Booths extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'booths';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Booths', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Booth', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-tickets-alt';
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'booth_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Booth Types', 'ambrygen' ),
					'singular_name' => __( 'Booth Type', 'ambrygen' ),
					'search_items'  => __( 'Search Booth Types', 'ambrygen' ),
					'all_items'     => __( 'All Booth Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Booth Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Booth Type', 'ambrygen' ),
					'menu_name'     => __( 'Booth Type', 'ambrygen' ),
				),
			),
		);
	}
}
