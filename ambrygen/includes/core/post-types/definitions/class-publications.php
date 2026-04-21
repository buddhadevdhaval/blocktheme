<?php
/**
 * Publications post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Publications -- peer-reviewed publication listings.
 */
class Publications extends AbstractPostType {

	public function slug(): string {
		return 'publication';
	}

	public function label(): string {
		return __( 'Publications', 'ambrygen-web' );
	}

	public function singular_label(): string {
		return __( 'Publication', 'ambrygen-web' );
	}

	public function menu_icon(): string {
		return 'dashicons-media-document';
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'peer-reviewed-publication',
			),
		);
	}

	public function meta_fields(): array {
		return array(
			'_old_id' => array(
				'label'    => __( 'Old ID', 'ambrygen-web' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
		);
	}
}
