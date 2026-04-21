<?php
/**
 * Authors post type definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined( 'ABSPATH' ) || exit;

/**
 * Authors -- individual author profiles.
 */
class Authors extends AbstractPostType {

	public function slug(): string {
		return 'author';
	}

	public function label(): string {
		return __( 'Authors', 'ambrygen' );
	}

	public function singular_label(): string {
		return __( 'Author', 'ambrygen' );
	}

	public function menu_icon(): string {
		return 'dashicons-admin-users';
	}

	public function supports(): array {
		return array( 'title', 'author', 'thumbnail', 'excerpt', 'custom-fields' );
	}

	public function meta_fields(): array {
		return array(
			'designation' => array(
				'label' => __( 'Designation', 'ambrygen' ),
				'type'  => 'text',
			),
		);
	}
}