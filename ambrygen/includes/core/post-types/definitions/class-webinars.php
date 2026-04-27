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

	public function slug(): string {
		return 'webinar';
	}

	public function label(): string {
		return __( 'Webinars', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Webinar', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-video-alt3';
	}

	public function meta_fields(): array {
		return array(
			'webinar_authors'   => array(
				'label' => __( 'Webinar Authors', 'ambrygen-web' ),
				'type'  => 'webinar_author_repeater',
			),
			'start_at'          => array(
				'label' => __( 'Start At', 'ambrygen-web' ),
				'type'  => 'date',
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
		);
	}
}
