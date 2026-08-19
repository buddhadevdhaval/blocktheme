<?php
/**
 * Events post type definitions.
 *
 * Groups post types related to events.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Events -- event listings with external sync meta fields.
 */
class Events extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'event';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Events', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Event', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-calendar-alt';
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'address_id'        => array(
				'label'    => __( 'Address ID', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'trade_show_id'     => array(
				'label'    => __( 'Trade Show ID', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'updated_at'        => array(
				'label'  => __( 'Updated At', 'ambrygen' ),
				'type'   => 'text',
				'hidden' => true,
			),
			'is_active'         => array(
				'label' => __( 'Is Active', 'ambrygen' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'company'           => array(
				'label' => __( 'Company', 'ambrygen' ),
				'type'  => 'text',
			),
			'type_id'           => array(
				'label'    => __( 'Type ID', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
			'capacity'          => array(
				'label'    => __( 'Capacity', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'start_at'          => array(
				'label' => __( 'Start At', 'ambrygen' ),
				'type'  => 'date',
			),
			'end_at'            => array(
				'label' => __( 'End At', 'ambrygen' ),
				'type'  => 'date',
			),
			'registration_html' => array(
				'label' => __( 'Registration HTML', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'notes'             => array(
				'label' => __( 'Notes', 'ambrygen' ),
				'type'  => 'textarea',
			),
			'meet_the_experts'  => array(
				'label' => __( 'Meet the Expert', 'ambrygen' ),
				'type'  => 'event_meet_expert_repeater',
			),
		);
	}
}
