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

	/**
	 * Get the post type slug.
	 *
	 * @return string
	 */
	public function slug(): string {
		return 'press-releases';
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function label(): string {
		return __( 'Press Releases', 'ambrygen' );
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function singular_label(): string {
		return __( 'Press Release', 'ambrygen' );
	}

	/**
	 * Get the admin menu icon.
	 *
	 * @return string
	 */
	public function menu_icon(): string {
		return 'dashicons-media-document';
	}

	/**
	 * Determine whether the post type has an archive.
	 *
	 * @return bool
	 */
	public function has_archive(): bool {
		return true;
	}

	/**
	 * Get additional post type arguments.
	 *
	 * @return array
	 */
	public function extra_args(): array {
		return array(
			'rewrite'     => array(
				'slug' => 'company/press-release',
			),
			'has_archive' => 'company/press-releases',
		);
	}

	/**
	 * Get registered meta fields.
	 *
	 * @return array
	 */
	public function meta_fields(): array {
		return array(
			'_old_id' => array(
				'label'    => __( 'Old ID', 'ambrygen' ),
				'type'     => 'number',
				'hidden'   => true,
				'sanitize' => 'absint',
			),
		);
	}
}
