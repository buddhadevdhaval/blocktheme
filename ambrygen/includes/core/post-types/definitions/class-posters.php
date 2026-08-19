<?php
/**
 * Posters post type definitions.
 *
 * Groups post types related to posters.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Posters -- poster listings.
 */
class Posters extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'poster';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Posters', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Poster', 'ambrygen-web' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-format-image';
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'     => array(
				'slug' => 'scientific-posters',
			),
			'has_archive' => 'scientific-posters',
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'_old_id'                => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'hidden'   => true,
				'sanitize' => 'absint',
			),
			'poster_pdf_files'       => array(
				'label' => __( '', 'ambrygen-web' ),
				'type'  => 'poster_pdf_repeater',
			),
			'lis_active'             => array(
				'label' => __( 'LIS Active', 'ambrygen-web' ),
				'type'  => 'checkbox',
				'value' => '1',
			),
			'name'                   => array(
				'label' => __( 'Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'description'            => array(
				'label' => __( 'Description', 'ambrygen-web' ),
				'type'  => 'textarea',
			),
			'slug'                   => array(
				'label' => __( 'Slug', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'launch_id'              => array(
				'label'    => __( 'Launch ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
			'start_at'               => array(
				'label' => __( 'Start Date & Time', 'ambrygen-web' ),
				'type'  => 'datetime-local',
			),
			'end_at'                 => array(
				'label' => __( 'End Date & Time', 'ambrygen-web' ),
				'type'  => 'datetime-local',
			),
			'pr_name'                => array(
				'label' => __( 'PR Name', 'ambrygen-web' ),
				'type'  => 'text',
			),
			// 'authors'               => array(
			// 'label' => __( 'Authors', 'ambrygen-web' ),
			// 'type'  => 'textarea',
			// ),
			'linked_author'          => array(
				'label'       => __( 'Linked Authors', 'ambrygen-web' ),
				'type'        => 'post_relationship',
				'post_types'  => array( 'author' ),
				'multiple'    => true,
				'description' => __( 'Select matching author profiles for this poster.', 'ambrygen-web' ),
			),
			'session_id'             => array(
				'label'    => __( 'Session ID', 'ambrygen-web' ),
				'type'     => 'text',
				'sanitize' => 'sanitize_text_field',
			),
			'search_score'           => array(
				'label'    => __( 'Search Score', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'floatval',
				'hidden'   => true,
			),
			'launch_deactivation_id' => array(
				'label'    => __( 'Launch Deactivation ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
				'hidden'   => true,
			),
		);
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array();
	}
}
