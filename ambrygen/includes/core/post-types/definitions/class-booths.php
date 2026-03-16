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

	public function slug(): string {
		return 'booths';
	}

	public function label(): string {
		return __( 'Booths', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Booth', 'ambrygen' );
	}

	public function menu_icon(): string {
		return 'dashicons-tickets-alt';
	}

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
