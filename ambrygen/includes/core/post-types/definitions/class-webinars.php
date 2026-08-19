<?php
/**
 * Webinars post type definitions.
 *
 * Groups post types related to webinars.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Webinars -- webinar listings.
 */
class Webinars extends AbstractPostType {

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'webinar';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Webinars', 'ambrygen-web' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Webinar', 'ambrygen-web' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-video-alt3';
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'_old_id'           => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'hidden'   => true,
				'sanitize' => 'absint',
			),
			'pr_name'           => array(
				'label'  => __( 'PR Name', 'ambrygen-web' ),
				'type'   => 'text',
				'hidden' => true,
			),

			'start_at'          => array(
				'label' => __( 'Start At', 'ambrygen-web' ),
				'type'  => 'datetime-local',
			),
			'duration'          => array(
				'label'    => __( 'Duration', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'floatval',
			),
			'ceu'               => array(
				'label' => __( 'CEU', 'ambrygen-web' ),
				'type'  => 'checkbox',
			),
			'pace'              => array(
				'label' => __( 'Pace', 'ambrygen-web' ),
				'type'  => 'checkbox',
			),
			'registration_link' => array(
				'label' => __( 'Registration Link', 'ambrygen-web' ),
				'type'  => 'url',
			),
			'subtitle'          => array(
				'label' => __( 'Subtitle', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'special_speaker'   => array(
				'label' => __( 'Special Speaker', 'ambrygen-web' ),
				'type'  => 'text',
			),
			'webinar_authors'   => array(
				'label' => __( 'Webinar Authors', 'ambrygen-web' ),
				'type'  => 'webinar_author_repeater',
			),
		);
	}
}
