<?php
/**
 * Press Release post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * PressRelease -- press release listings.
 */
class PressRelease extends AbstractPostType {

	public function slug(): string {
		return 'press-releases';
	}

	public function label(): string {
		return __( 'Press Releases', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Press Release', 'ambrygen' );
	}

	public function menu_icon(): string {
		return 'dashicons-media-document';
	}

	public function has_archive(): bool {
		return true;
	}

	public function extra_args(): array {
		return array(
			'rewrite' => array(
				'slug' => 'company/press-release',
			),
			'has_archive' => 'company/press-releases',
		);
	}

	public function meta_fields(): array {
		return array(
			'_old_id' => array(
				'label'    => __( 'Old ID', 'ambrygen' ),
				'type'     => 'number',
				'sanitize' => 'absint',
			),
		);
	}
}
