<?php
/**
 * Abstract Post Type Definition.
 *
 * Base class for all post type definitions. Extend this in a definitions
 * file and implement the three required methods. Override any optional
 * method only when the default isn't right for that type.
 *
 * ## File structure
 *
 *   includes/core/post-types/
 *   |-- class-abstractposttype.php   <- this file, never changes
 *   |-- class-posttypes.php          <- engine, never changes
 *   `-- definitions/
 *       |-- class-ourteam.php        <- OurTeam (+ future people types)
 *       |-- class-jobs.php           <- Jobs
 *       |-- class-treadshows.php     <- TreadShows
 *       |-- class-booths.php         <- Booths
 *       `-- class-addresses.php      <- Addresses (+ future location types)
 *
 * ## Adding a new post type
 *
 * 1. Find (or create) the right group file in definitions/.
 * 2. Add a new class extending AbstractPostType inside that file.
 * 3. Register the class in PostTypes::DEFINITIONS.
 *    Done -- no other file needs to change.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes;

defined( 'ABSPATH' ) || exit;

abstract class AbstractPostType {

	// -------------------------------------------------------------------------
	// Required
	// -------------------------------------------------------------------------

	/** Post type slug, e.g. 'our_team'. */
	abstract public function slug(): string;

	/** Plural admin label, e.g. 'Our Team'. */
	abstract public function label(): string;

	/** Singular admin label, e.g. 'Team Member'. */
	abstract public function singular_label(): string;

	// -------------------------------------------------------------------------
	// Optional -- override only when the default is wrong for this type
	// -------------------------------------------------------------------------

	/** Dashicon slug for the admin menu. */
	public function menu_icon(): string {
		return 'dashicons-admin-post';
	}

	/** post_type supports array. */
	public function supports(): array {
		return array( 'title', 'editor', 'thumbnail', 'custom-fields' );
	}

	/** Whether the post type is publicly accessible on the front end. */
	public function public(): bool {
		return true;
	}

	/** Whether the post type has an archive page. */
	public function has_archive(): bool {
		return true;
	}

	/**
	 * Extra args merged directly into register_post_type().
	 * Use sparingly -- prefer the explicit methods above.
	 */
	public function extra_args(): array {
		return array();
	}

	// -------------------------------------------------------------------------
	// Optional -- taxonomy definitions
	// -------------------------------------------------------------------------

	/**
	 * Taxonomies attached to this post type.
	 *
	 * Each item:
	 *   'slug'         (string)  Required.
	 *   'labels'       (array)   Standard WP taxonomy labels.
	 *   'hierarchical' (bool)    Category-like (true) or tag-like (false). Default false.
	 *   'extra_args'   (array)   Merged into register_taxonomy().
	 *
	 * @return array[]
	 */
	public function taxonomies(): array {
		return array();
	}

	// -------------------------------------------------------------------------
	// Optional -- meta field definitions
	// -------------------------------------------------------------------------

	/**
	 * Meta fields shown in the post edit meta box.
	 *
	 * Keyed by meta key:
	 *   'label'    (string)    Required. Label shown in the meta box.
	 *   'type'     (string)    Input type: 'text'|'textarea'|'url'|'number'|'date'. Default 'text'.
	 *   'sanitize' (callable)  Sanitize callback. Default: sanitize_text_field.
	 *
	 * @return array[]
	 */
	public function meta_fields(): array {
		return array();
	}
}
