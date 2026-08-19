<?php
/**
 * TreadShows post type definitions.
 *
 * Groups post types related to events and exhibitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Trade Shows -- trade show / event listings.
 */
class TreadShows extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'conferences';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Trade Shows', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Trade Show', 'ambrygen' );
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			// Keep archive/list on plural slug.
			'has_archive' => 'conferences',
			// Use singular slug for single permalink base.
			'rewrite'     => array( 'slug' => 'conference' ),
		);
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'tread_show_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Trade Show Types', 'ambrygen' ),
					'singular_name' => __( 'Trade Show Type', 'ambrygen' ),
					'search_items'  => __( 'Search Trade Show Types', 'ambrygen' ),
					'all_items'     => __( 'All Trade Show Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Trade Show Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Trade Show Type', 'ambrygen' ),
					'menu_name'     => __( 'Trade Show Type', 'ambrygen' ),
				),
			),
			array(
				'slug'         => 'region',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Region', 'ambrygen' ),
					'singular_name' => __( 'Region', 'ambrygen' ),
					'search_items'  => __( 'Search Region', 'ambrygen' ),
					'all_items'     => __( 'All Region', 'ambrygen' ),
					'edit_item'     => __( 'Edit Region', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Region', 'ambrygen' ),
					'menu_name'     => __( 'Region', 'ambrygen' ),
				),
			),
			array(
				'slug'         => 'booth',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Booths', 'ambrygen' ),
					'singular_name' => __( 'Booth', 'ambrygen' ),
					'search_items'  => __( 'Search Booths', 'ambrygen' ),
					'all_items'     => __( 'All Booths', 'ambrygen' ),
					'edit_item'     => __( 'Edit Booth', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Booth', 'ambrygen' ),
					'menu_name'     => __( 'Booth', 'ambrygen' ),
				),
			),
			array(
				'slug'         => 'booth_tag',
				'hierarchical' => false,
				'labels'       => array(
					'name'          => __( 'Booth Tags', 'ambrygen' ),
					'singular_name' => __( 'Booth Tag', 'ambrygen' ),
					'search_items'  => __( 'Search Booth Tags', 'ambrygen' ),
					'all_items'     => __( 'All Booth Tags', 'ambrygen' ),
					'edit_item'     => __( 'Edit Booth Tag', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Booth Tag', 'ambrygen' ),
					'menu_name'     => __( 'Booth Tags', 'ambrygen' ),
				),
			),
		);
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-calendar';
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'description'           => array(
				'label' => __( 'Description', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'start_at'              => array(
				'label' => __( 'Start Date', 'ambrygen' ),
				'type'  => 'date',
			),
			'end_at'                => array(
				'label' => __( 'End Date', 'ambrygen' ),
				'type'  => 'date',
			),
			'show_url'              => array(
				'label' => __( 'Show URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'hotel_reservation_url' => array(
				'label' => __( 'Hotel Reservation URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'floor_plan_url'        => array(
				'label' => __( 'Floor Plan URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'exhibiting_hours'      => array(
				'label' => __( 'Exhibiting Hours', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'hashtags'              => array(
				'label' => __( 'Hashtags', 'ambrygen' ),
				'type'  => 'text',
			),
			'focus'                 => array(
				'label' => __( 'Focus', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_name'               => array(
				'label' => __( 'PR Name', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_sub_heading'        => array(
				'label' => __( 'PR Sub Heading', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_description'        => array(
				'label' => __( 'PR Description', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'contact_us_html'       => array(
				'label' => __( 'Contact Us HTML', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'contact_author_html'   => array(
				'label' => __( 'Contact Author HTML', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'is_registered'         => array(
				'label' => __( 'Is Registered', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_approved'           => array(
				'label' => __( 'Is Approved', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_exhibiting'         => array(
				'label' => __( 'Is Exhibiting', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_public'             => array(
				'label' => __( 'Is Public', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'address_id'            => array(
				'label'    => __( 'Address ID', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'name'                  => array(
				'label' => __( 'Address Name', 'ambrygen' ),
				'type'  => 'text',
			),
			'address_line1'         => array(
				'label' => __( 'Address Line 1', 'ambrygen' ),
				'type'  => 'text',
			),
			'address_line2'         => array(
				'label' => __( 'Address Line 2', 'ambrygen' ),
				'type'  => 'text',
			),
			'city'                  => array(
				'label' => __( 'City', 'ambrygen' ),
				'type'  => 'text',
			),
			'state_or_province'     => array(
				'label' => __( 'State or Province', 'ambrygen' ),
				'type'  => 'text',
			),
			'postal_code'           => array(
				'label' => __( 'Postal Code', 'ambrygen' ),
				'type'  => 'text',
			),
			'country'               => array(
				'label' => __( 'Country', 'ambrygen' ),
				'type'  => 'text',
			),
			'linked_posts'          => array(
				'label'       => __( 'Linked Posts', 'ambrygen' ),
				'type'        => 'post_relationship',
				'description' => __( 'Select posts that are related to this conference.', 'ambrygen' ),
				'multiple'    => true,
				'post_types'  => array(), // Empty array means all post types
			),
		);
	}
}
