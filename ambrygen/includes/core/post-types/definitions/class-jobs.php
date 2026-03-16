<?php
/**
 * Jobs post type definitions.
 *
 * Groups post types related to job listings.
 * Currently: Jobs.
 * Future examples: Internships, Freelance Roles -- add them here.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Jobs -- job listing posts with type, location, and preference taxonomies.
 */
class Jobs extends AbstractPostType {

	public function slug(): string {
		return 'jobs';
	}

	public function label(): string {
		return __( 'Jobs', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Job', 'ambrygen' );
	}

	public function menu_icon(): string {
		return 'dashicons-briefcase';
	}

	public function taxonomies(): array {
		return array(
			array(
				'slug'         => 'job_type',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Job Types', 'ambrygen' ),
					'singular_name' => __( 'Job Type', 'ambrygen' ),
					'search_items'  => __( 'Search Job Types', 'ambrygen' ),
					'all_items'     => __( 'All Job Types', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Type', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Type', 'ambrygen' ),
					'menu_name'     => __( 'Job Type', 'ambrygen' ),
				),
			),
			array(
				'slug'         => 'job_location',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Job Locations', 'ambrygen' ),
					'singular_name' => __( 'Job Location', 'ambrygen' ),
					'search_items'  => __( 'Search Job Locations', 'ambrygen' ),
					'all_items'     => __( 'All Job Locations', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Location', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Location', 'ambrygen' ),
					'menu_name'     => __( 'Job Location', 'ambrygen' ),
				),
			),
			array(
				'slug'         => 'job_preferences',
				'hierarchical' => true,
				'labels'       => array(
					'name'          => __( 'Job Preferences', 'ambrygen' ),
					'singular_name' => __( 'Job Preference', 'ambrygen' ),
					'search_items'  => __( 'Search Job Preferences', 'ambrygen' ),
					'all_items'     => __( 'All Job Preferences', 'ambrygen' ),
					'edit_item'     => __( 'Edit Job Preference', 'ambrygen' ),
					'add_new_item'  => __( 'Add New Job Preference', 'ambrygen' ),
					'menu_name'     => __( 'Job Preference', 'ambrygen' ),
				),
			),
		);
	}
}
