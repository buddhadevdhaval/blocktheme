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
 * Tread Shows -- trade show / event listings.
 */
class TreadShows extends AbstractPostType {

	public function slug(): string {
		return 'conferences';
	}

	public function label(): string {
		return __( 'Tread Shows', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Tread Show', 'ambrygen' );
	}

	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'tread_show_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Tread Show Types', 'ambrygen' ),
					'singular_name' => __( 'Tread Show Type', 'ambrygen' ),
					'search_items'  => __( 'Search Tread Show Types', 'ambrygen' ),
					'all_items'     => __( 'All Tread Show Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Tread Show Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Tread Show Type', 'ambrygen' ),
					'menu_name'     => __( 'Tread Show Type', 'ambrygen' ),
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
		);
	}

	public function menu_icon(): string {
		return 'dashicons-calendar';
	}

	public function meta_fields(): array {
		return array(
			'description'         => array(
				'label' => __( 'Description', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'start_at'            => array(
				'label' => __( 'Start Date', 'ambrygen' ),
				'type'  => 'date',
			),
			'end_at'              => array(
				'label' => __( 'End Date', 'ambrygen' ),
				'type'  => 'date',
			),
			'show_url'            => array(
				'label' => __( 'Show URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'hotel_reservation_url' => array(
				'label' => __( 'Hotel Reservation URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'floor_plan_url'      => array(
				'label' => __( 'Floor Plan URL', 'ambrygen' ),
				'type'  => 'url',
			),
			'exhibiting_hours'    => array(
				'label' => __( 'Exhibiting Hours', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'hashtags'            => array(
				'label' => __( 'Hashtags', 'ambrygen' ),
				'type'  => 'text',
			),
			'focus'               => array(
				'label' => __( 'Focus', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_name'             => array(
				'label' => __( 'PR Name', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_sub_heading'      => array(
				'label' => __( 'PR Sub Heading', 'ambrygen' ),
				'type'  => 'text',
			),
			'pr_description'      => array(
				'label' => __( 'PR Description', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'contact_us_html'     => array(
				'label' => __( 'Contact Us HTML', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'contact_author_html' => array(
				'label' => __( 'Contact Author HTML', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'is_registered'       => array(
				'label' => __( 'Is Registered', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_approved'         => array(
				'label' => __( 'Is Approved', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_exhibiting'       => array(
				'label' => __( 'Is Exhibiting', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'is_public'           => array(
				'label' => __( 'Is Public', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
		);
	}
}
