<?php
/**
 * People post type definitions.
 *
 * Groups post types related to people.
 * Currently: OurTeam.
 * Future examples: Speakers, Authors, Advisors -- add them here.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Our Team -- individual team member profiles.
 */
class OurTeam extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'our_team';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Our Team', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Team Member', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-groups';
	}

	/**
	 * Get supported post features.
	 *
	 * @return array
	 */
	public function supports(): array {
		return array( 'title', 'thumbnail', 'custom-fields' );
	}

	/**
	 * Get registered taxonomies.
	 *
	 * @return array
	 */
	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'member_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Member Types', 'ambrygen' ),
					'singular_name' => __( 'Member Type', 'ambrygen' ),
					'search_items'  => __( 'Search Member Types', 'ambrygen' ),
					'all_items'     => __( 'All Member Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Member Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Member Type', 'ambrygen' ),
					'menu_name'     => __( 'Member Type', 'ambrygen' ),
				),
			),
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'designation'  => array(
				'label' => __( 'Designation', 'ambrygen' ),
				'type'  => 'text',
			),
			'image_gallry' => array(
				'label' => __( 'Image Gallery', 'ambrygen' ),
				'type'  => 'media_gallery',
			),
			'small_image'  => array(
				'label'    => __( 'Small Image', 'ambrygen' ),
				'type'     => 'media_file',
				'sanitize' => 'absint',
			),
			'large_image'  => array(
				'label'    => __( 'Large Image', 'ambrygen' ),
				'type'     => 'media_file',
				'sanitize' => 'absint',
			),
		);
	}
}
