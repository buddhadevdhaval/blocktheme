<?php
/**
 * Markup & media helper utilities.
 *
 * NOTE:
 * This class intentionally contains BOTH markup allow-lists
 * and image rendering helpers as a consolidated compromise.
 *
 * @package Ambrygen\Theme\Core
 */

namespace Ambrygen\Theme\Core;

use Ambrygen\Theme\Core\Theme_Options;

defined( 'ABSPATH' ) || exit;

final class Helper {

	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_marketing_material_tracking_routes' ) );
		add_action( 'wp_ajax_ambrygen_track_marketing_material_click', array( $this, 'handle_marketing_material_click' ) );
		add_action( 'wp_ajax_nopriv_ambrygen_track_marketing_material_click', array( $this, 'handle_marketing_material_click' ) );
	}

	private const MARKETING_MATERIAL_TRACKING_META_KEY = '_marketing_material_file_tracking';

	/**
	 * Allowed HTML for headings (supports <mark>).
	 *
	 * @return array
	 */
	public static function allowed_heading_html(): array {
		$allowed = array(
			'mark'   => array(
				'class' => true,
				'style' => true,
			),
			'span'   => array(
				'class' => true,
				'data-tooltip' => true,
				'data-tooltip-title' => true,
			),
			'div'    => array(
				'class' => true,
			),
			'br'     => array(),
			'strong' => array(),
			'em'     => array(),
		);

		/**
		 * Filter allowed heading HTML.
		 */
		return apply_filters( 'ambrygen_allowed_heading_html', $allowed );
	}

	/**
	 * Get a validated heading tag.
	 *
	 * @param string $tag      Requested heading tag.
	 * @param string $fallback Fallback heading tag.
	 * @return string
	 */
	public static function get_heading_tag( string $tag, string $fallback = 'h2' ): string {
		$allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
		$fallback     = strtolower( $fallback );
		$fallback     = in_array( $fallback, $allowed_tags, true ) ? $fallback : 'h2';
		$tag          = strtolower( $tag );

		return in_array( $tag, $allowed_tags, true ) ? $tag : $fallback;
	}

	/**
	 * Returns a sanitized <img> element for a given attachment.
	 *
	 * Output is safe to echo without additional escaping:
	 * - SVG path: attributes escaped with esc_url() / esc_attr(), URL via wp_get_attachment_url().
	 * - Raster path: delegates to wp_get_attachment_image(), which is escaped by WordPress core.
	 *
	 * @param int    $image_id Attachment post ID.
	 * @param string $size     Image size slug (default 'large').
	 * @param array  $attrs    Additional HTML attributes merged over defaults.
	 * @return string Safe, pre-escaped <img> HTML, or empty string when $image_id is falsy.
	 */
	public static function image(
		int $image_id,
		string $size = 'large',
		array $attrs = array()
	): string {
		if ( ! $image_id ) {
			return '';
		}

		// Default attributes
		$default_attrs = array(
			'class'    => '',
			'loading'  => 'lazy',
			'decoding' => 'async',
			'alt'      => self::get_image_alt( $image_id ),
		);

		$attrs = array_merge( $default_attrs, $attrs );

		// Enforce width/height for requested size.
		if ( ! isset( $attrs['width'] ) || ! isset( $attrs['height'] ) ) {
			$size_data = self::get_size_dimensions( $size );
			if ( $size_data['width'] > 0 && ! isset( $attrs['width'] ) ) {
				$attrs['width'] = $size_data['width'];
			}
			if ( $size_data['height'] > 0 && ! isset( $attrs['height'] ) ) {
				$attrs['height'] = $size_data['height'];
			}
		}


		// Get the file URL and extension
		$image_url = wp_get_attachment_url( $image_id );
		$file_ext  = pathinfo( $image_url, PATHINFO_EXTENSION );

		// If SVG, return simple <img> without srcset/sizes
		if ( 'svg' === strtolower( $file_ext ) ) {
			$attr_strings = array();
			foreach ( $attrs as $key => $value ) {
				$attr_strings[] = esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
			}

			return sprintf( '<img src="%s" %s />', esc_url( $image_url ), implode( ' ', $attr_strings ) );
		}

		// Default behavior for raster images
		return wp_get_attachment_image(
			$image_id,
			$size,
			false,
			$attrs
		);
	}


	public static function image_with_placeholder(
		int $image_id = 0,
		string $size = 'large',
		array $attrs = array()
	): string {

		// If no image, use global placeholder
		if ( ! $image_id ) {

			$image_id = Theme_Options::get_placeholder_image_id();
		}

		// Still no image → return empty safely
		if ( ! $image_id ) {
			return '';
		}

		// Default attributes
		$default_attrs = array(
			'class'    => '',
			'loading'  => 'lazy',
			'decoding' => 'async',
			'alt'      => self::get_image_alt( $image_id ),
		);

		$attrs = array_merge( $default_attrs, $attrs );

		// Enforce width/height for the requested size if not already set.
		// This ensures consistent layout for SVGs and placeholders.
		if ( ! isset( $attrs['width'] ) || ! isset( $attrs['height'] ) ) {
			$size_data = self::get_size_dimensions( $size );
			if ( $size_data['width'] > 0 && ! isset( $attrs['width'] ) ) {
				$attrs['width'] = $size_data['width'];
			}
			if ( $size_data['height'] > 0 && ! isset( $attrs['height'] ) ) {
				$attrs['height'] = $size_data['height'];
			}
		}

		$image_url = wp_get_attachment_url( $image_id );

		if ( ! $image_url ) {
			return '';
		}

		$file_ext = pathinfo( $image_url, PATHINFO_EXTENSION );

		// SVG handling (no srcset/sizes)
		if ( 'svg' === strtolower( $file_ext ) ) {


			$attr_strings = array();

			foreach ( $attrs as $key => $value ) {
				if ( '' !== $value ) {
					$attr_strings[] = esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
				}
			}

			return sprintf(
				'<img src="%s" %s />',
				esc_url( $image_url ),
				implode( ' ', $attr_strings )
			);
		}

		// Raster images
		return wp_get_attachment_image(
			$image_id,
			$size,
			false,
			$attrs
		);
	}

	/**
	 * Returns a sanitized <img> element from an attachment ID, URL, or placeholder.
	 *
	 * All returned markup is passed through wp_kses_post() so callers can echo
	 * this helper output without wrapping each usage.
	 * URL and attribute values are escaped internally before markup is built.
	 *
	 * @param int    $image_id        Attachment post ID.
	 * @param string $image_url       Image URL fallback.
	 * @param string $size            Image size slug.
	 * @param array  $attrs           Additional HTML attributes.
	 * @param bool   $use_placeholder Whether to render the global placeholder when no image is available.
	 * @param array  $url_attrs       Attributes only used for URL fallback markup.
	 * @return string Safe, pre-escaped <img> HTML, or empty string.
	 */
	public static function image_from_source(
		int $image_id = 0,
		string $image_url = '',
		string $size = 'large',
		array $attrs = array(),
		bool $use_placeholder = false,
		array $url_attrs = array()
	): string {
		$image_url = esc_url( $image_url );
		$attrs     = array_map( 'esc_attr', $attrs );
		$url_attrs = array_map( 'esc_attr', $url_attrs );

		if ( $image_id ) {
			$attachment_attrs = $attrs;

			if ( isset( $attachment_attrs['alt'] ) && '' === trim( (string) $attachment_attrs['alt'] ) ) {
				unset( $attachment_attrs['alt'] );
			}

			$image_html = self::image( $image_id, $size, $attachment_attrs );

			if ( $image_html ) {
				return wp_kses_post( $image_html );
			}
		}

		if ( $image_url ) {
			$default_attrs = array(
				'alt'     => '',
				'loading' => 'lazy',
			);

			$attrs          = array_merge( $default_attrs, $attrs, $url_attrs );
			$attr_strings   = array();
			$attr_strings[] = 'src="' . esc_url( $image_url ) . '"';

			foreach ( $attrs as $key => $value ) {
				if ( null === $value || false === $value || 'src' === $key ) {
					continue;
				}

				$attr_strings[] = esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
			}

			return wp_kses_post( sprintf( '<img %s />', implode( ' ', $attr_strings ) ) );
		}

		if ( $use_placeholder ) {
			$placeholder_attrs = $attrs;

			if ( isset( $placeholder_attrs['alt'] ) && '' === trim( (string) $placeholder_attrs['alt'] ) ) {
				unset( $placeholder_attrs['alt'] );
			}

			return wp_kses_post( self::image_with_placeholder( 0, $size, $placeholder_attrs ) );
		}

		return '';
	}

	/**
	 * Get safe image ALT text with fallback.
	 *
	 * @param int $image_id Attachment ID.
	 * @return string
	 */
	public static function get_image_alt( int $image_id ): string {
		$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );

		if ( '' === trim( $alt ) ) {
			$alt = get_the_title( $image_id );
		}

		return esc_attr( $alt );
	}

	/**
	 * Get iframe embed src for supported video providers.
	 *
	 * Supports:
	 * - YouTube
	 * - Vimeo
	 *
	 * @param string $url Video URL.
	 * @return string
	 */
	public static function get_iframe_src( string $url ): string {
		if ( empty( $url ) ) {
			return '';
		}

		$url = esc_url_raw( $url );

		// YouTube.
		if (
			false !== strpos( $url, 'youtube.com' ) ||
			false !== strpos( $url, 'youtu.be' )
		) {
			if (
				preg_match(
					'%(?:youtube\.com/(?:watch\?v=|embed/)|youtu\.be/)([A-Za-z0-9_-]{11})%',
					$url,
					$matches
				)
			) {
				return 'https://www.youtube.com/embed/' . esc_attr( $matches[1] ) . '?rel=0&modestbranding=1&playsinline=1';
			}
		}

		// Vimeo.
		if ( false !== strpos( $url, 'vimeo.com' ) ) {
			if ( preg_match( '/vimeo\.com\/(?:video\/)?([0-9]+)/', $url, $matches ) ) {
				return 'https://player.vimeo.com/video/' . esc_attr( $matches[1] ) . '?dnt=1';
			}
		}

		return '';
	}

			/**
	 * Get term IDs for a given post ID and taxonomy.
	 *
	 * @param int    $post_id  Post ID.
	 * @param string $taxonomy Taxonomy slug.
	 *
	 * @return int[] Array of term IDs.
	 */
	public static function get_post_term_ids( int $post_id, string $taxonomy ): array {
		if ( ! $post_id || ! taxonomy_exists( $taxonomy ) ) {
			return array();
		}

		$terms = wp_get_post_terms(
			$post_id,
			$taxonomy,
			array(
				'fields' => 'ids', // Only return term IDs
			)
		);

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		return $terms;
	}

		/**
 * Check if a navigation item is active.
 *
 * VIP-safe active state detection.
 *
 * @param array $nav_item Navigation item data.
 * @return bool
 */
	public static function ambrygen_is_nav_item_active( array $nav_item ): bool {

		if ( empty( $nav_item['url'] ) ) {
			return false;
		}

		$item_url = esc_url_raw( $nav_item['url'] );


		// 1️⃣ If pageId exists (BEST METHOD)
		if ( ! empty( $nav_item['pageId'] ) ) {
			return get_queried_object_id() === (int) $nav_item['pageId'];
		}

		// 2️⃣ Front page
		if ( is_front_page() ) {
			return untrailingslashit( home_url( '/' ) ) === untrailingslashit( $item_url );
		}

		// 3️⃣ Blog page
		if ( is_home() && get_option( 'page_for_posts' ) ) {
			return untrailingslashit( get_permalink( get_option( 'page_for_posts' ) ) )
			=== untrailingslashit( $item_url );
		}

		// 4️⃣ Singular (post, page, CPT)
		if ( is_singular() ) {
			return untrailingslashit( get_permalink( get_queried_object_id() ) )
			=== untrailingslashit( $item_url );
		}

		// 5️⃣ Post type archive
		if ( is_post_type_archive() ) {
			$post_type = get_query_var( 'post_type' );
			if ( $post_type ) {
				return untrailingslashit( get_post_type_archive_link( $post_type ) )
				=== untrailingslashit( $item_url );
			}
		}

		// 6️⃣ Taxonomy archive
		if ( is_tax() || is_category() || is_tag() ) {
			$term_link = get_term_link( get_queried_object() );
			if ( ! is_wp_error( $term_link ) ) {
				return untrailingslashit( $term_link )
				=== untrailingslashit( $item_url );
			}
		}

		return false;
	}

	/**
	 * Normalize presentation speakers meta into a clean string array.
	 *
	 * Supports JSON array strings and comma-separated strings.
	 *
	 * @param mixed $raw Speakers meta raw value.
	 * @return string[]
	 */
	public static function parse_speakers( $raw ): array {
		$speakers = array();

		if ( is_array( $raw ) ) {
			$speakers = $raw;
		} elseif ( is_string( $raw ) ) {
			$raw = trim( $raw );
			if ( '' === $raw ) {
				return array();
			}

			$decoded = json_decode( $raw, true );
			if ( JSON_ERROR_NONE === json_last_error() && is_array( $decoded ) ) {
				$speakers = $decoded;
			} else {
				$speakers = preg_split( '/\s*,\s*/', $raw );
			}
		}

		$speakers = array_filter(
			array_map(
				static function ( $speaker ): string {
					return trim( (string) $speaker );
				},
				$speakers
			)
		);

		return array_values( array_unique( $speakers ) );
	}

	/**
	 * Normalize name-list meta into a clean string array.
	 *
	 * Supports JSON array strings and comma-separated strings.
	 *
	 * @param mixed $raw List meta raw value.
	 * @return string[]
	 */
	public static function parse_name_list( $raw ): array {
		return self::parse_speakers( $raw );
	}

	/**
	 * Get normalized speakers for a presentation post.
	 *
	 * @param int $post_id Presentation post ID.
	 * @return string[]
	 */
	public static function get_presentation_speakers( int $post_id ): array {
		if ( $post_id <= 0 ) {
			return array();
		}

		return self::parse_speakers( get_post_meta( $post_id, 'speakers', true ) );
	}

	/**
	 * Get normalized authors for a poster post.
	 *
	 * @param int $post_id Poster post ID.
	 * @return string[]
	 */
	public static function get_poster_authors( int $post_id ): array {
		if ( $post_id <= 0 ) {
			return array();
		}

		return self::parse_name_list( get_post_meta( $post_id, 'authors', true ) );
	}

	/**
	 * Find the first linked conference for a presentation.
	 *
	 * @param int $presentation_id Presentation post ID.
	 * @return int Conference post ID or 0.
	 */
	public static function get_linked_conference_id_by_presentation( int $presentation_id ): int {
		return self::get_linked_conference_id_by_related_post( $presentation_id );
	}

	/**
	 * Find the first linked conference for a related post ID.
	 *
	 * @param int $related_post_id Related post ID (presentation/poster).
	 * @return int Conference post ID or 0.
	 */
	public static function get_linked_conference_id_by_related_post( int $related_post_id ): int {
		if ( $related_post_id <= 0 ) {
			return 0;
		}

		$conference_ids = get_posts(
			array(
				'post_type'      => 'conferences',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_query'     => array(
					'relation' => 'OR',
					array(
						'key'     => 'linked_posts',
						'value'   => '"' . $related_post_id . '"',
						'compare' => 'LIKE',
					),
					array(
						'key'     => 'linked_posts',
						'value'   => (string) $related_post_id,
						'compare' => 'LIKE',
					),
				),
			)
		);

		return ! empty( $conference_ids ) ? (int) $conference_ids[0] : 0;
	}

	/**
	 * Build sidebar filter source data for presentation archive.
	 *
	 * @return array{
	 *   conferences: int[],
	 *   speakers: string[],
	 *   collaborators: array
	 * }
	 */
	public static function get_presentation_filter_data(): array {
		$conferences = get_posts(
			array(
				'post_type'      => 'conferences',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'fields'         => 'ids',
			)
		);

		$presentation_ids = get_posts(
			array(
				'post_type'      => 'presentation',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);

		$speakers = array();
		foreach ( $presentation_ids as $presentation_id ) {
			$speakers = array_merge( $speakers, self::get_presentation_speakers( (int) $presentation_id ) );
		}
		$speakers = array_values( array_unique( $speakers ) );
		sort( $speakers, SORT_NATURAL | SORT_FLAG_CASE );

		$collaborator_ids = array();
		if ( ! empty( $presentation_ids ) ) {
			$collaborator_ids = wp_get_object_terms( $presentation_ids, 'collaborator', array( 'fields' => 'ids' ) );
		}

		$collaborators = array();
		if ( ! empty( $collaborator_ids ) && ! is_wp_error( $collaborator_ids ) ) {
			$collaborators = get_terms(
				array(
					'taxonomy' => 'collaborator',
					'include'  => array_unique( $collaborator_ids ),
					'orderby'  => 'name',
					'order'    => 'ASC',
				)
			);
		}

		if ( is_wp_error( $collaborators ) ) {
			$collaborators = array();
		}

		return array(
			'conferences'   => array_map( 'intval', $conferences ),
			'speakers'      => $speakers,
			'collaborators' => $collaborators,
		);
	}

	/**
	 * Build sidebar filter source data for poster archive.
	 *
	 * @return array{
	 *   conferences: int[],
	 *   authors: string[],
	 *   collaborators: array
	 * }
	 */
	public static function get_poster_filter_data(): array {
		$conferences = get_posts(
			array(
				'post_type'      => 'conferences',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'fields'         => 'ids',
			)
		);

		$poster_ids = get_posts(
			array(
				'post_type'      => 'poster',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);

		$authors = array();
		foreach ( $poster_ids as $poster_id ) {
			$authors = array_merge( $authors, self::get_poster_authors( (int) $poster_id ) );
		}
		$authors = array_values( array_unique( $authors ) );
		sort( $authors, SORT_NATURAL | SORT_FLAG_CASE );

		$collaborator_ids = array();
		if ( ! empty( $poster_ids ) ) {
			$collaborator_ids = wp_get_object_terms( $poster_ids, 'collaborator', array( 'fields' => 'ids' ) );
		}

		$collaborators = array();
		if ( ! empty( $collaborator_ids ) && ! is_wp_error( $collaborator_ids ) ) {
			$collaborators = get_terms(
				array(
					'taxonomy' => 'collaborator',
					'include'  => array_unique( $collaborator_ids ),
					'orderby'  => 'name',
					'order'    => 'ASC',
				)
			);
		}

		if ( is_wp_error( $collaborators ) ) {
			$collaborators = array();
		}

		return array(
			'conferences'   => array_map( 'intval', $conferences ),
			'authors'       => $authors,
			'collaborators' => $collaborators,
		);
	}

	/**
	 * Build sidebar filter source data for publication archive.
	 *
	 * @return array{
	 *   specialty_areas: array,
	 *   topics: array,
	 *   collaborators: array
	 * }
	 */
	public static function get_publication_filter_data(): array {
		$publication_ids = get_posts(
			array(
				'post_type'      => 'publication',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);

		$specialty_ids = array();
		$topic_ids     = array();
		$collab_ids    = array();

		if ( ! empty( $publication_ids ) ) {
			$specialty_ids = wp_get_object_terms( $publication_ids, 'poster_category', array( 'fields' => 'ids' ) );
			$topic_ids     = wp_get_object_terms( $publication_ids, 'post_tag', array( 'fields' => 'ids' ) );
			$collab_ids    = wp_get_object_terms( $publication_ids, 'collaborator', array( 'fields' => 'ids' ) );
		}

		$specialty_areas = array();
		if ( ! empty( $specialty_ids ) && ! is_wp_error( $specialty_ids ) ) {
			$specialty_areas = get_terms(
				array(
					'taxonomy' => 'poster_category',
					'include'  => array_unique( $specialty_ids ),
					'orderby'  => 'name',
					'order'    => 'ASC',
				)
			);
		}

		$topics = array();
		if ( ! empty( $topic_ids ) && ! is_wp_error( $topic_ids ) ) {
			$topics = get_terms(
				array(
					'taxonomy' => 'post_tag',
					'include'  => array_unique( $topic_ids ),
					'orderby'  => 'name',
					'order'    => 'ASC',
				)
			);
		}

		$collaborators = array();
		if ( ! empty( $collab_ids ) && ! is_wp_error( $collab_ids ) ) {
			$collaborators = get_terms(
				array(
					'taxonomy' => 'collaborator',
					'include'  => array_unique( $collab_ids ),
					'orderby'  => 'name',
					'order'    => 'ASC',
				)
			);
		}

		if ( is_wp_error( $specialty_areas ) ) {
			$specialty_areas = array();
		}
		if ( is_wp_error( $topics ) ) {
			$topics = array();
		}
		if ( is_wp_error( $collaborators ) ) {
			$collaborators = array();
		}

		return array(
			'specialty_areas' => $specialty_areas,
			'topics'          => $topics,
			'collaborators'   => $collaborators,
		);
	}

	/**

	 * Get dimensions for a registered image size.
	 *
	 * @param string $size Image size slug.
	 * @return array{width: int, height: int}
	 */
	public static function get_size_dimensions( string $size ): array {
		if ( in_array( $size, array( 'thumbnail', 'medium', 'medium_large', 'large' ), true ) ) {
			return array(
				'width'  => (int) get_option( "{$size}_size_w" ),
				'height' => (int) get_option( "{$size}_size_h" ),
			);
		}

		global $_wp_additional_image_sizes;
		if ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
			return array(
				'width'  => (int) $_wp_additional_image_sizes[ $size ]['width'],
				'height' => (int) $_wp_additional_image_sizes[ $size ]['height'],
			);
		}

		return array(
			'width'  => 0,
			'height' => 0,
		);
	}

	/**
	 * Append a CSS class to a raw HTML attribute string.
	 *
	 * @param string $attributes Existing attributes string.
	 * @param string $class_name Class to append.
	 * @return string
	 */
	public static function append_class_to_html_attributes(string $attributes, string $class_name): string
	{
		if (preg_match('/class=["\']([^"\']*)["\']/i', $attributes, $matches)) {
			$existing_classes = trim($matches[1]);
			$new_classes      = $existing_classes ? $existing_classes . ' ' . $class_name : $class_name;
			return preg_replace('/class=["\']([^"\']*)["\']/i', 'class="' . esc_attr($new_classes) . '"', $attributes);
		}

		return $attributes . ' class="' . esc_attr($class_name) . '"';
	}

	/**
	 * Append or replace an attribute in a raw HTML attribute string.
	 *
	 * @param string $attributes Existing attributes string.
	 * @param string $name       Attribute name.
	 * @param string $value      Attribute value.
	 * @return string
	 */
	public static function append_attribute_to_html_attributes(string $attributes, string $name, string $value): string
	{
		if (preg_match('/' . preg_quote($name, '/') . '=["\']([^"\']*)["\']/i', $attributes)) {
			return preg_replace('/' . preg_quote($name, '/') . '=["\']([^"\']*)["\']/i', $name . '="' . esc_attr($value) . '"', $attributes);
		}

		return $attributes . ' ' . $name . '="' . esc_attr($value) . '"';
	}

	/**
	 * Get all distinct years for past conferences based on end_at meta date.
	 *
	 * @return int[]
	 */
	public static function get_past_conference_years(): array
	{
		$today = date('Y-m-d');

		$args = array(
			'post_type'      => 'conferences',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'     => 'end_at',
					'value'   => $today,
					'compare' => '<',
					'type'    => 'DATE',
				),
			),
		);

		$post_ids = get_posts($args);
		$years    = array();

		foreach ($post_ids as $post_id) {
			$end_at = get_post_meta($post_id, 'end_at', true);
			if ($end_at) {
				$timestamp = strtotime((string) $end_at);
				if ($timestamp) {
					$years[] = (int) date('Y', $timestamp);
				}
			}
		}

		$years = array_unique($years);
		rsort($years);

		if (empty($years)) {
			$years = array((int) date('Y'));
		}

		return $years;
	}

	/**
	 * Get all distinct years for past webinars based on start_at meta date.
	 *
	 * @return int[]
	 */
	public static function get_past_webinar_years(): array
	{
		$today = date('Y-m-d');

		$args = array(
			'post_type'      => 'webinar',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'     => 'start_at',
					'value'   => $today,
					'compare' => '<',
					'type'    => 'DATE',
				),
			),
		);

		$post_ids = get_posts($args);
		$years    = array();

		foreach ($post_ids as $post_id) {
			$start_at = get_post_meta($post_id, 'start_at', true);
			if ($start_at) {
				$ts = strtotime((string) $start_at);
				if ($ts) {
					$years[] = (int) date('Y', $ts);
				}
			}
		}

		$years = array_unique($years);
		rsort($years);

		if (empty($years)) {
			$years = array((int) date('Y'));
		}

		return $years;
	}

	/**
	 * Check if there are any upcoming posts for a specific post type.
	 *
	 * @param string $post_type Post type slug.
	 * @return bool
	 */
	public static function has_today_posts(string $post_type = 'webinar'): bool
	{
		$today    = date('Y-m-d');
		$meta_key = ('webinar' === $post_type) ? 'start_at' : 'end_at';

		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => 1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'     => $meta_key,
					'value'   => $today,
					'compare' => '=',
					'type'    => 'DATE',
				),
			),
		);

		$query = new \WP_Query($args);
		return $query->have_posts();
	}

	/**
	 * Get all tags that have at least one associated conferences post for a given scope.
	 *
	 * @param string $scope 'upcoming', 'past', or empty for all published conferences.
	 * @return \WP_Term[]
	 */
	public static function get_conference_tags(string $scope = ''): array
	{
		$post_ids = self::get_tagged_post_ids_for_scope('conferences', $scope);

		if (empty($post_ids)) {
			return array();
		}

		$terms = get_terms(
			array(
				'taxonomy'   => 'post_tag',
				'object_ids' => $post_ids,
				'hide_empty' => true,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		return is_wp_error($terms) ? array() : (array) $terms;
	}

	/**
	 * Get all terms of 'post_tag' that have at least one associated webinar post for a given scope.
	 *
	 * @param string $scope 'upcoming', 'past', or empty for all published webinars.
	 * @return \WP_Term[]
	 */
	public static function get_webinar_tags(string $scope = ''): array
	{
		$post_ids = self::get_tagged_post_ids_for_scope('webinar', $scope);

		if (empty($post_ids)) {
			return array();
		}

		$terms = get_terms(
			array(
				'taxonomy'   => 'post_tag',
				'object_ids' => $post_ids,
				'hide_empty' => true,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		return is_wp_error($terms) ? array() : (array) $terms;
	}

	/**
	 * Get post IDs for tag lookup based on the requested scope.
	 *
	 * @param string $post_type Post type slug.
	 * @param string $scope     'upcoming', 'past', or empty for all published posts.
	 * @return int[]
	 */
	public static function get_tagged_post_ids_for_scope(string $post_type, string $scope = ''): array
	{
		$today = date('Y-m-d');

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
		);

		if ('conferences' === $post_type) {
			if ('upcoming' === $scope) {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '>',
						'type'    => 'DATE',
					),
				);
			} elseif ('past' === $scope) {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'end_at',
						'value'   => $today,
						'compare' => '<',
						'type'    => 'DATE',
					),
				);
			}
		} elseif ('webinar' === $post_type) {
			if ('upcoming' === $scope) {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '>',
						'type'    => 'DATE',
					),
				);
			} elseif ('past' === $scope) {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '<',
						'type'    => 'DATE',
					),
				);
			}
		}

		$post_ids = get_posts($query_args);
		return array_map('absint', (array) $post_ids);
	}

	/**
	 * Get the newest valid file row from the marketing material repeater.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @return array{url:string,file_id:int}
	 */
	public static function get_marketing_material_latest_file( int $post_id ): array {
		$rows = get_post_meta( $post_id, 'marketing_material_files', true );

		if ( ! is_array( $rows ) || empty( $rows ) ) {
			return array(
				'url'     => '',
				'file_id' => 0,
			);
		}

		$candidates = array();

		foreach ( $rows as $index => $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$file_id = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$status  = isset( $row['status'] ) ? sanitize_key( (string) $row['status'] ) : '';
			$is_active = isset( $row['is_active'] ) ? absint( $row['is_active'] ) : 0;

			if ( $file_id <= 0 || 'disabled_urgent' === $status || 1 !== $is_active ) {
				continue;
			}

			$url = wp_get_attachment_url( $file_id );
			if ( ! $url ) {
				continue;
			}

			$modified = get_post_modified_time( 'U', true, $file_id );
			$created  = get_post_time( 'U', true, $file_id );

			$candidates[] = array(
				'url'      => $url,
				'file_id'  => $file_id,
				'time'     => max( absint( $modified ), absint( $created ) ),
				'rowIndex' => absint( $index ),
			);
		}

		if ( empty( $candidates ) ) {
			return array(
				'url'     => '',
				'file_id' => 0,
			);
		}

		usort(
			$candidates,
			static function ( $a, $b ) {
				if ( $a['time'] === $b['time'] ) {
					return $b['rowIndex'] <=> $a['rowIndex'];
				}

				return $b['time'] <=> $a['time'];
			}
		);

		return array(
			'url'     => (string) $candidates[0]['url'],
			'file_id' => (int) $candidates[0]['file_id'],
		);
	}

	/**
	 * Build a compact label for a marketing material language term.
	 *
	 * @param \WP_Term|null $term Language term.
	 * @return string
	 */
	public static function get_test_catalog_language_label( $term ): string {
		if ( ! $term instanceof \WP_Term ) {
			return __( 'PDF', 'ambrygen-web' );
		}

		$slug = strtoupper( preg_replace( '/[^A-Za-z]/', '', (string) $term->slug ) );
		if ( '' !== $slug && strlen( $slug ) <= 3 ) {
			return $slug;
		}

		$words = preg_split( '/[\s\-_]+/', (string) $term->name );
		$label = '';

		if ( is_array( $words ) ) {
			foreach ( $words as $word ) {
				if ( '' === $word ) {
					continue;
				}
				$label .= strtoupper( substr( $word, 0, 1 ) );
			}
		}

		if ( '' === $label ) {
			$label = strtoupper( substr( (string) $term->name, 0, 2 ) );
		}

		return substr( $label, 0, 3 );
	}

	/**
	 * Fetch latest marketing material download links per language for a gene term.
	 *
	 * @param int   $gene_id      Gene term ID.
	 * @param int   $type_id      Optional marketing material type filter.
	 * @param array $page_context Optional page context for click tracking.
	 * @return array<int,array<string,string>>
	 */
	public static function get_test_catalog_gene_links( int $gene_id, int $type_id = 0, array $page_context = array() ): array {
		static $cache = array();

		$page_cache_key = wp_json_encode(
			array(
				'page_id'    => isset( $page_context['page_id'] ) ? absint( $page_context['page_id'] ) : 0,
				'page_title' => isset( $page_context['page_title'] ) ? sanitize_text_field( (string) $page_context['page_title'] ) : '',
				'page_path'  => isset( $page_context['page_path'] ) ? sanitize_text_field( (string) $page_context['page_path'] ) : '',
			)
		);
		$cache_key = $gene_id . '_' . $type_id . '_' . md5( (string) $page_cache_key );

		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$cache[ $cache_key ] = array();

		if ( $gene_id <= 0 ) {
			return $cache[ $cache_key ];
		}

		$tax_query = array(
			'relation' => 'AND',
			array(
				'taxonomy' => 'gene',
				'field'    => 'term_id',
				'terms'    => $gene_id,
			),
		);

		if ( $type_id > 0 ) {
			$tax_query[] = array(
				'taxonomy' => 'marketing_material_type',
				'field'    => 'term_id',
				'terms'    => $type_id,
			);
		}

		$query = new \WP_Query(
			array(
				'post_type'      => 'marketing_material',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'tax_query'      => $tax_query,
			)
		);

		$latest = array();

		if ( $query->have_posts() ) {
			foreach ( $query->posts as $material_post ) {
				$post_date = strtotime( (string) $material_post->post_date );
				$rows      = get_post_meta( $material_post->ID, 'marketing_material_files', true );

				if ( ! is_array( $rows ) ) {
					continue;
				}

				foreach ( $rows as $row ) {
					if ( ! is_array( $row ) ) {
						continue;
					}

					$file_id   = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
					$status    = isset( $row['status'] ) ? sanitize_key( (string) $row['status'] ) : '';
					$is_active = isset( $row['is_active'] ) ? absint( $row['is_active'] ) : 0;

					if ( $file_id <= 0 || 'disabled_urgent' === $status || 1 !== $is_active ) {
						continue;
					}

					$url = wp_get_attachment_url( $file_id );
					if ( ! $url ) {
						continue;
					}

					$language_id = isset( $row['language_term_id'] ) ? absint( $row['language_term_id'] ) : 0;
					$language    = $language_id > 0 ? get_term( $language_id, 'marketing_material_language' ) : null;
					$label       = self::get_test_catalog_language_label( $language );
					$lang_key    = $language_id ?: 'default';

					if ( ! isset( $latest[ $lang_key ] ) || $post_date > $latest[ $lang_key ]['date'] ) {
						$latest[ $lang_key ] = array(
							'label'       => $label,
							'url'         => $url,
							'raw_url'     => $url,
							'material_id' => (int) $material_post->ID,
							'file_id'     => (int) $file_id,
							'date'        => $post_date,
						);
					}
				}
			}
		}

		wp_reset_postdata();

		foreach ( $latest as $item ) {
			$cache[ $cache_key ][] = array(
				'label'       => (string) $item['label'],
				'url'         => (string) $item['url'],
				'raw_url'     => (string) $item['raw_url'],
				'material_id' => (string) $item['material_id'],
				'file_id'     => (string) $item['file_id'],
			);
		}

		return $cache[ $cache_key ];
	}

	/**
	 * Build a tracked download URL for a marketing material file.
	 *
	 * @param int    $post_id Marketing material post ID.
	 * @param int    $file_id Attachment ID.
	 * @param string $context Tracking context.
	 * @param array  $page_context Optional page context.
	 * @return string
	 */
	public static function get_marketing_material_tracked_url( int $post_id, int $file_id, string $context = 'default', array $page_context = array() ): string {
		$post_id = absint( $post_id );
		$file_id = absint( $file_id );
		$context = sanitize_key( $context );

		if ( $post_id <= 0 || $file_id <= 0 || ! self::marketing_material_has_file( $post_id, $file_id ) ) {
			return '';
		}

		return add_query_arg(
			array(
				'action'           => 'ambrygen_track_marketing_material_click',
				'material_id'      => $post_id,
				'file_id'          => $file_id,
				'context'          => $context ?: 'default',
				'source_page_id'   => isset( $page_context['page_id'] ) ? absint( $page_context['page_id'] ) : 0,
				'source_page_path' => isset( $page_context['page_path'] ) ? rawurlencode( sanitize_text_field( (string) $page_context['page_path'] ) ) : '',
				'source_page'      => isset( $page_context['page_title'] ) ? rawurlencode( sanitize_text_field( (string) $page_context['page_title'] ) ) : '',
			),
			admin_url( 'admin-ajax.php' )
		);
	}

	/**
	 * Get tracking totals for one file row.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @param int $file_id Attachment ID.
	 * @return array{impressions:int,clicks:int,last_impression:string,last_click:string,pages:array<int,array<string,mixed>>}
	 */
	public static function get_marketing_material_tracking( int $post_id, int $file_id ): array {
		$post_id = absint( $post_id );
		$file_id = absint( $file_id );
		$all     = get_post_meta( $post_id, self::MARKETING_MATERIAL_TRACKING_META_KEY, true );

		if ( ! is_array( $all ) ) {
			$all = array();
		}

		$entry = isset( $all[ $file_id ] ) && is_array( $all[ $file_id ] ) ? $all[ $file_id ] : array();

		return array(
			'impressions'     => isset( $entry['impressions'] ) ? absint( $entry['impressions'] ) : 0,
			'clicks'          => isset( $entry['clicks'] ) ? absint( $entry['clicks'] ) : 0,
			'last_impression' => isset( $entry['last_impression'] ) ? sanitize_text_field( (string) $entry['last_impression'] ) : '',
			'last_click'      => isset( $entry['last_click'] ) ? sanitize_text_field( (string) $entry['last_click'] ) : '',
			'pages'           => self::normalize_marketing_material_tracking_pages( $entry['pages'] ?? array() ),
		);
	}

	/**
	 * Build an admin-friendly tracking report for all marketing material files.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @return array<int,array<string,mixed>>
	 */
	public static function get_marketing_material_tracking_report( int $post_id ): array {
		$post_id = absint( $post_id );
		$rows    = get_post_meta( $post_id, 'marketing_material_files', true );

		if ( ! is_array( $rows ) ) {
			return array();
		}

		$report = array();

		foreach ( $rows as $index => $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$file_id      = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$media_lab_id = isset( $row['media_lab_id'] ) ? sanitize_text_field( (string) $row['media_lab_id'] ) : '';

			if ( $file_id <= 0 ) {
				continue;
			}

			$file_post  = get_post( $file_id );
			$file_title = $file_post instanceof \WP_Post ? $file_post->post_title : '';
			$file_url   = wp_get_attachment_url( $file_id );
			$tracking   = self::get_marketing_material_tracking( $post_id, $file_id );
			$used_pages = self::get_marketing_material_used_pages( $post_id );

			$report[] = array(
				'row_index'        => absint( $index ),
				'file_id'          => $file_id,
				'file_title'       => $file_title,
				'file_url'         => $file_url ? (string) $file_url : '',
				'media_lab_id'     => $media_lab_id,
				'impressions'      => $tracking['impressions'],
				'clicks'           => $tracking['clicks'],
				'last_impression'  => $tracking['last_impression'],
				'last_click'       => $tracking['last_click'],
				'pages'            => self::merge_marketing_material_usage_with_tracking_pages(
					$used_pages,
					$tracking['pages'],
					$tracking['impressions'],
					$tracking['clicks']
				),
			);
		}

		return $report;
	}

	/**
	 * Get a list of all published pages/posts where a marketing material can be used.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @return array<int,array<string,mixed>>
	 */
	private static function get_marketing_material_used_pages( int $post_id ): array {
		static $cache = array();

		$post_id = absint( $post_id );
		if ( isset( $cache[ $post_id ] ) ) {
			return $cache[ $post_id ];
		}

		$material_gene_ids = wp_get_object_terms( $post_id, 'gene', array( 'fields' => 'ids' ) );
		$material_type_ids = wp_get_object_terms( $post_id, 'marketing_material_type', array( 'fields' => 'ids' ) );

		$material_gene_ids = is_wp_error( $material_gene_ids ) ? array() : array_map( 'absint', (array) $material_gene_ids );
		$material_type_ids = is_wp_error( $material_type_ids ) ? array() : array_map( 'absint', (array) $material_type_ids );

		if ( empty( $material_gene_ids ) ) {
			$cache[ $post_id ] = array();
			return $cache[ $post_id ];
		}

		$post_types = array_values(
			array_filter(
				get_post_types(
					array(
						'publicly_queryable' => true,
					),
					'names'
				),
				static function ( string $post_type ): bool {
					return ! in_array( $post_type, array( 'attachment', 'marketing_material' ), true );
				}
			)
		);

		$query = new \WP_Query(
			array(
				'post_type'      => $post_types,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);

		$pages = array();

		foreach ( (array) $query->posts as $candidate_id ) {
			$candidate_id = absint( $candidate_id );
			if ( $candidate_id <= 0 || ! has_block( 'ambrygen/test-catalog', $candidate_id ) ) {
				continue;
			}

			$post = get_post( $candidate_id );
			if ( ! $post instanceof \WP_Post ) {
				continue;
			}

			$usage_count = self::count_marketing_material_usage_in_blocks(
				parse_blocks( (string) $post->post_content ),
				$material_gene_ids,
				$material_type_ids
			);

			if ( $usage_count <= 0 ) {
				continue;
			}

			$pages[] = array(
				'page_id'         => $candidate_id,
				'page_title'      => get_the_title( $candidate_id ),
				'page_path'       => (string) wp_parse_url( (string) get_permalink( $candidate_id ), PHP_URL_PATH ),
				'edit_url'        => (string) get_edit_post_link( $candidate_id, '' ),
				'view_url'        => (string) get_permalink( $candidate_id ),
				'usage_count'     => $usage_count,
				'impressions'     => 0,
				'clicks'          => 0,
				'last_impression' => '',
				'last_click'      => '',
			);
		}

		wp_reset_postdata();

		$cache[ $post_id ] = $pages;
		return $cache[ $post_id ];
	}

	/**
	 * Count how many matching test-catalog block instances can surface a material.
	 *
	 * @param array $blocks Parsed blocks.
	 * @param array $material_gene_ids Material gene term IDs.
	 * @param array $material_type_ids Material type term IDs.
	 * @return int
	 */
	private static function count_marketing_material_usage_in_blocks( array $blocks, array $material_gene_ids, array $material_type_ids ): int {
		$count = 0;

		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			$block_name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';
			$attrs      = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();

			if ( 'ambrygen/test-catalog' === $block_name && self::does_test_catalog_block_use_marketing_material( $attrs, $material_gene_ids, $material_type_ids ) ) {
				++$count;
			}

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$count += self::count_marketing_material_usage_in_blocks( $block['innerBlocks'], $material_gene_ids, $material_type_ids );
			}
		}

		return $count;
	}

	/**
	 * Determine whether a specific test-catalog block can surface a marketing material.
	 *
	 * @param array $attrs Block attributes.
	 * @param array $material_gene_ids Material gene term IDs.
	 * @param array $material_type_ids Material type term IDs.
	 * @return bool
	 */
	private static function does_test_catalog_block_use_marketing_material( array $attrs, array $material_gene_ids, array $material_type_ids ): bool {
		$block_type_id = isset( $attrs['marketingMaterialTypeId'] ) ? absint( $attrs['marketingMaterialTypeId'] ) : 0;
		if ( $block_type_id > 0 && ! in_array( $block_type_id, $material_type_ids, true ) ) {
			return false;
		}

		$product_version_ids = self::get_test_catalog_block_product_version_ids( $attrs );
		if ( empty( $product_version_ids ) ) {
			return false;
		}

		foreach ( $product_version_ids as $product_version_id ) {
			$gene_ids = wp_get_object_terms( $product_version_id, 'gene', array( 'fields' => 'ids' ) );
			$gene_ids = is_wp_error( $gene_ids ) ? array() : array_map( 'absint', (array) $gene_ids );

			if ( array_intersect( $material_gene_ids, $gene_ids ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Resolve product version IDs shown by a test-catalog block.
	 *
	 * @param array $attrs Block attributes.
	 * @return array<int>
	 */
	private static function get_test_catalog_block_product_version_ids( array $attrs ): array {
		static $cache = array();

		$cache_key = md5( wp_json_encode( $attrs ) ?: '' );
		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$ids          = array();
		$edit_variant = isset( $attrs['editVariant'] ) ? sanitize_key( (string) $attrs['editVariant'] ) : 'tabs';

		if ( 'single' === $edit_variant ) {
			$ids = isset( $attrs['singleProductVersionIds'] ) && is_array( $attrs['singleProductVersionIds'] )
				? array_map( 'absint', $attrs['singleProductVersionIds'] )
				: array();

			if ( empty( $ids ) && ! empty( $attrs['singleProductVersionId'] ) ) {
				$ids[] = absint( $attrs['singleProductVersionId'] );
			}

			$cache[ $cache_key ] = array_values( array_filter( $ids ) );
			return $cache[ $cache_key ];
		}

		$tabs = isset( $attrs['selectedTabs'] ) && is_array( $attrs['selectedTabs'] ) ? $attrs['selectedTabs'] : array();

		foreach ( $tabs as $tab ) {
			if ( ! is_array( $tab ) ) {
				continue;
			}

			$term_id      = isset( $tab['termId'] ) ? absint( $tab['termId'] ) : 0;
			$excluded_ids = isset( $tab['excludedPostIds'] ) && is_array( $tab['excludedPostIds'] ) ? array_map( 'absint', $tab['excludedPostIds'] ) : array();

			if ( $term_id <= 0 ) {
				continue;
			}

			$query = new \WP_Query(
				array(
					'post_type'      => 'product_version',
					'post_status'    => 'publish',
					'posts_per_page' => -1,
					'fields'         => 'ids',
					'no_found_rows'  => true,
					'post__not_in'   => $excluded_ids,
					'tax_query'      => array(
						array(
							'taxonomy' => 'poster_category',
							'field'    => 'term_id',
							'terms'    => $term_id,
						),
					),
				)
			);

			$ids = array_merge( $ids, array_map( 'absint', (array) $query->posts ) );
		}

		$cache[ $cache_key ] = array_values( array_unique( array_filter( $ids ) ) );
		return $cache[ $cache_key ];
	}

	/**
	 * Merge discovered usage pages with tracked counts.
	 *
	 * @param array $used_pages Usage-discovered pages.
	 * @param array $tracked_pages Tracked pages.
	 * @param int   $total_impressions Total tracked impressions.
	 * @param int   $total_clicks Total tracked clicks.
	 * @return array<int,array<string,mixed>>
	 */
	private static function merge_marketing_material_usage_with_tracking_pages(
		array $used_pages,
		array $tracked_pages,
		int $total_impressions = 0,
		int $total_clicks = 0
	): array {
		$merged = array();

		foreach ( $used_pages as $page ) {
			if ( ! is_array( $page ) ) {
				continue;
			}

			$key = self::get_marketing_material_tracking_page_key( $page );
			if ( '' === $key ) {
				continue;
			}

			$merged[ $key ] = $page;
		}

		foreach ( $tracked_pages as $page ) {
			if ( ! is_array( $page ) ) {
				continue;
			}

			$key = self::get_marketing_material_tracking_page_key( $page );
			if ( '' === $key ) {
				continue;
			}

			if ( ! isset( $merged[ $key ] ) ) {
				$merged[ $key ] = array(
					'page_id'         => isset( $page['page_id'] ) ? absint( $page['page_id'] ) : 0,
					'page_title'      => isset( $page['page_title'] ) ? sanitize_text_field( (string) $page['page_title'] ) : '',
					'page_path'       => isset( $page['page_path'] ) ? sanitize_text_field( (string) $page['page_path'] ) : '',
					'edit_url'        => isset( $page['edit_url'] ) ? esc_url_raw( (string) $page['edit_url'] ) : '',
					'view_url'        => isset( $page['view_url'] ) ? esc_url_raw( (string) $page['view_url'] ) : '',
					'usage_count'     => 0,
					'impressions'     => 0,
					'clicks'          => 0,
					'last_impression' => '',
					'last_click'      => '',
				);
			}

			$merged[ $key ]['impressions']     = isset( $page['impressions'] ) ? absint( $page['impressions'] ) : 0;
			$merged[ $key ]['clicks']          = isset( $page['clicks'] ) ? absint( $page['clicks'] ) : 0;
			$merged[ $key ]['last_impression'] = isset( $page['last_impression'] ) ? sanitize_text_field( (string) $page['last_impression'] ) : '';
			$merged[ $key ]['last_click']      = isset( $page['last_click'] ) ? sanitize_text_field( (string) $page['last_click'] ) : '';
		}

		$sum_impressions = 0;
		$sum_clicks      = 0;

		foreach ( $merged as $page ) {
			$sum_impressions += isset( $page['impressions'] ) ? absint( $page['impressions'] ) : 0;
			$sum_clicks      += isset( $page['clicks'] ) ? absint( $page['clicks'] ) : 0;
		}

		$remaining_impressions = max( 0, absint( $total_impressions ) - $sum_impressions );
		$remaining_clicks      = max( 0, absint( $total_clicks ) - $sum_clicks );

		if ( $remaining_impressions > 0 || $remaining_clicks > 0 ) {
			$merged[] = array(
				'page_id'         => 0,
				'page_title'      => __( 'Legacy / Unattributed Tracking', 'ambrygen-web' ),
				'page_path'       => '',
				'edit_url'        => '',
				'view_url'        => '',
				'usage_count'     => 0,
				'impressions'     => $remaining_impressions,
				'clicks'          => $remaining_clicks,
				'last_impression' => '',
				'last_click'      => '',
			);
		}

		$merged = array_values( $merged );

		usort(
			$merged,
			static function ( array $left, array $right ): int {
				$left_score  = absint( $left['usage_count'] ?? 0 ) + absint( $left['impressions'] ?? 0 ) + absint( $left['clicks'] ?? 0 );
				$right_score = absint( $right['usage_count'] ?? 0 ) + absint( $right['impressions'] ?? 0 ) + absint( $right['clicks'] ?? 0 );
				return $right_score <=> $left_score;
			}
		);

		return $merged;
	}

	/**
	 * Record a marketing material event.
	 *
	 * @param int    $post_id Marketing material post ID.
	 * @param int    $file_id Attachment ID.
	 * @param string $event   Supported: impression|click.
	 * @param array  $page_context Optional page context.
	 * @return bool
	 */
	public static function track_marketing_material_event( int $post_id, int $file_id, string $event, array $page_context = array() ): bool {
		$post_id = absint( $post_id );
		$file_id = absint( $file_id );
		$event   = sanitize_key( $event );

		if ( $post_id <= 0 || $file_id <= 0 || ! in_array( $event, array( 'impression', 'click' ), true ) ) {
			return false;
		}

		if ( ! self::marketing_material_has_file( $post_id, $file_id ) ) {
			return false;
		}

		$tracking = get_post_meta( $post_id, self::MARKETING_MATERIAL_TRACKING_META_KEY, true );
		if ( ! is_array( $tracking ) ) {
			$tracking = array();
		}

		if ( ! isset( $tracking[ $file_id ] ) || ! is_array( $tracking[ $file_id ] ) ) {
			$tracking[ $file_id ] = array(
				'impressions'     => 0,
				'clicks'          => 0,
				'last_impression' => '',
				'last_click'      => '',
				'pages'           => array(),
			);
		}

		$timestamp = current_time( 'mysql' );
		$page_key  = self::get_marketing_material_tracking_page_key( $page_context );

		if ( 'impression' === $event ) {
			$tracking[ $file_id ]['impressions'] = absint( $tracking[ $file_id ]['impressions'] ) + 1;
			$tracking[ $file_id ]['last_impression'] = $timestamp;
		} else {
			$tracking[ $file_id ]['clicks'] = absint( $tracking[ $file_id ]['clicks'] ) + 1;
			$tracking[ $file_id ]['last_click'] = $timestamp;
		}

		if ( '' !== $page_key ) {
			if ( ! isset( $tracking[ $file_id ]['pages'] ) || ! is_array( $tracking[ $file_id ]['pages'] ) ) {
				$tracking[ $file_id ]['pages'] = array();
			}

			if ( ! isset( $tracking[ $file_id ]['pages'][ $page_key ] ) || ! is_array( $tracking[ $file_id ]['pages'][ $page_key ] ) ) {
				$tracking[ $file_id ]['pages'][ $page_key ] = array(
					'page_id'         => isset( $page_context['page_id'] ) ? absint( $page_context['page_id'] ) : 0,
					'page_title'      => isset( $page_context['page_title'] ) ? sanitize_text_field( (string) $page_context['page_title'] ) : '',
					'page_path'       => isset( $page_context['page_path'] ) ? sanitize_text_field( (string) $page_context['page_path'] ) : '',
					'impressions'     => 0,
					'clicks'          => 0,
					'last_impression' => '',
					'last_click'      => '',
				);
			}

			if ( 'impression' === $event ) {
				$tracking[ $file_id ]['pages'][ $page_key ]['impressions'] = absint( $tracking[ $file_id ]['pages'][ $page_key ]['impressions'] ) + 1;
				$tracking[ $file_id ]['pages'][ $page_key ]['last_impression'] = $timestamp;
			} else {
				$tracking[ $file_id ]['pages'][ $page_key ]['clicks'] = absint( $tracking[ $file_id ]['pages'][ $page_key ]['clicks'] ) + 1;
				$tracking[ $file_id ]['pages'][ $page_key ]['last_click'] = $timestamp;
			}
		}

		return false !== update_post_meta( $post_id, self::MARKETING_MATERIAL_TRACKING_META_KEY, $tracking );
	}

	/**
	 * Register REST routes for marketing material tracking.
	 *
	 * @return void
	 */
	public function register_marketing_material_tracking_routes(): void {
		register_rest_route(
			'ambrygen/v1',
			'/marketing-material-impressions',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_marketing_material_impressions_rest' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'ambrygen/v1',
			'/marketing-material-click',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_marketing_material_click_rest' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Handle batched impression tracking requests.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function handle_marketing_material_impressions_rest( \WP_REST_Request $request ): \WP_REST_Response {
		$params       = $request->get_json_params();
		$page_context = array(
			'page_id'    => isset( $params['page_id'] ) ? absint( $params['page_id'] ) : 0,
			'page_title' => isset( $params['page_title'] ) ? sanitize_text_field( (string) $params['page_title'] ) : '',
			'page_path'  => isset( $params['page_path'] ) ? sanitize_text_field( (string) $params['page_path'] ) : '',
		);
		$items        = isset( $params['items'] ) && is_array( $params['items'] ) ? $params['items'] : array();
		$tracked      = 0;

		foreach ( $items as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$post_id = isset( $item['material_id'] ) ? absint( $item['material_id'] ) : 0;
			$file_id = isset( $item['file_id'] ) ? absint( $item['file_id'] ) : 0;

			if ( self::track_marketing_material_event( $post_id, $file_id, 'impression', $page_context ) ) {
				++$tracked;
			}
		}

		return new \WP_REST_Response(
			array(
				'tracked' => $tracked,
			),
			200
		);
	}

	/**
	 * Handle click tracking requests while keeping the public PDF URL unchanged.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function handle_marketing_material_click_rest( \WP_REST_Request $request ): \WP_REST_Response {
		$params       = $request->get_json_params();
		$page_context = array(
			'page_id'    => isset( $params['page_id'] ) ? absint( $params['page_id'] ) : 0,
			'page_title' => isset( $params['page_title'] ) ? sanitize_text_field( (string) $params['page_title'] ) : '',
			'page_path'  => isset( $params['page_path'] ) ? sanitize_text_field( (string) $params['page_path'] ) : '',
		);
		$post_id      = isset( $params['material_id'] ) ? absint( $params['material_id'] ) : 0;
		$file_id      = isset( $params['file_id'] ) ? absint( $params['file_id'] ) : 0;

		if ( self::track_marketing_material_event( $post_id, $file_id, 'click', $page_context ) ) {
			return new \WP_REST_Response( array( 'tracked' => true ), 200 );
		}

		return new \WP_REST_Response( array( 'tracked' => false ), 400 );
	}

	/**
	 * Handle click tracking requests and redirect to the actual file.
	 *
	 * @return void
	 */
	public function handle_marketing_material_click(): void {
		$post_id      = isset( $_GET['material_id'] ) ? absint( wp_unslash( $_GET['material_id'] ) ) : 0;
		$file_id      = isset( $_GET['file_id'] ) ? absint( wp_unslash( $_GET['file_id'] ) ) : 0;
		$page_context = array(
			'page_id'    => isset( $_GET['source_page_id'] ) ? absint( wp_unslash( $_GET['source_page_id'] ) ) : 0,
			'page_title' => isset( $_GET['source_page'] ) ? sanitize_text_field( rawurldecode( wp_unslash( $_GET['source_page'] ) ) ) : '',
			'page_path'  => isset( $_GET['source_page_path'] ) ? sanitize_text_field( rawurldecode( wp_unslash( $_GET['source_page_path'] ) ) ) : '',
		);
		$url          = $file_id > 0 ? wp_get_attachment_url( $file_id ) : '';

		if ( ! $url || ! self::marketing_material_has_file( $post_id, $file_id ) ) {
			wp_die( esc_html__( 'Marketing material file not found.', 'ambrygen-web' ), 404 );
		}

		self::track_marketing_material_event( $post_id, $file_id, 'click', $page_context );

		wp_safe_redirect( $url );
		exit;
	}

	/**
	 * Confirm an attachment belongs to the marketing material repeater rows.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @param int $file_id Attachment ID.
	 * @return bool
	 */
	private static function marketing_material_has_file( int $post_id, int $file_id ): bool {
		$rows = get_post_meta( $post_id, 'marketing_material_files', true );

		if ( ! is_array( $rows ) ) {
			return false;
		}

		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			if ( $file_id === absint( $row['file_id'] ?? 0 ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Normalize stored page analytics rows.
	 *
	 * @param mixed $pages Raw page analytics data.
	 * @return array<int,array<string,mixed>>
	 */
	private static function normalize_marketing_material_tracking_pages( $pages ): array {
		if ( ! is_array( $pages ) ) {
			return array();
		}

		$normalized = array();

		foreach ( $pages as $page ) {
			if ( ! is_array( $page ) ) {
				continue;
			}

			$normalized[] = array(
				'page_id'         => isset( $page['page_id'] ) ? absint( $page['page_id'] ) : 0,
				'page_title'      => isset( $page['page_title'] ) ? sanitize_text_field( (string) $page['page_title'] ) : '',
				'page_path'       => isset( $page['page_path'] ) ? sanitize_text_field( (string) $page['page_path'] ) : '',
				'impressions'     => isset( $page['impressions'] ) ? absint( $page['impressions'] ) : 0,
				'clicks'          => isset( $page['clicks'] ) ? absint( $page['clicks'] ) : 0,
				'last_impression' => isset( $page['last_impression'] ) ? sanitize_text_field( (string) $page['last_impression'] ) : '',
				'last_click'      => isset( $page['last_click'] ) ? sanitize_text_field( (string) $page['last_click'] ) : '',
			);
		}

		usort(
			$normalized,
			static function ( array $left, array $right ): int {
				$left_total  = $left['impressions'] + $left['clicks'];
				$right_total = $right['impressions'] + $right['clicks'];
				return $right_total <=> $left_total;
			}
		);

		return $normalized;
	}

	/**
	 * Build a stable page key for grouped analytics.
	 *
	 * @param array $page_context Optional page context.
	 * @return string
	 */
	private static function get_marketing_material_tracking_page_key( array $page_context ): string {
		$page_id   = isset( $page_context['page_id'] ) ? absint( $page_context['page_id'] ) : 0;
		$page_path = isset( $page_context['page_path'] ) ? sanitize_text_field( (string) $page_context['page_path'] ) : '';

		if ( $page_id > 0 ) {
			return 'id:' . $page_id;
		}

		if ( '' !== $page_path ) {
			return 'path:' . md5( $page_path );
		}

		return '';
	}

	/**
	 * Get the newest valid file per language from the marketing material repeater.
	 *
	 * @param int          $post_id        Marketing material post ID.
	 * @param array        $language_slugs Language slugs to include (e.g. ['en','es']).
	 * @param string       $taxonomy_slug  Language taxonomy slug.
	 * @return array<string,array{url:string,file_id:int,term_id:int}>
	 */
	public static function get_marketing_material_latest_files_by_language(
		int $post_id,
		array $language_slugs = array( 'en', 'es' ),
		string $taxonomy_slug = 'marketing_material_language'
	): array {
		$rows = get_post_meta( $post_id, 'marketing_material_files', true );

		if ( ! is_array( $rows ) || empty( $rows ) ) {
			return array();
		}

		$language_slugs = array_values(
			array_filter(
				array_map(
					static function ( $slug ) {
						return sanitize_key( (string) $slug );
					},
					$language_slugs
				)
			)
		);

		$best_by_slug = array();

		foreach ( $rows as $index => $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}

			$file_id          = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
			$status           = isset( $row['status'] ) ? sanitize_key( (string) $row['status'] ) : '';
			$is_active        = isset( $row['is_active'] ) ? absint( $row['is_active'] ) : 0;
			$language_term_id = isset( $row['language_term_id'] ) ? absint( $row['language_term_id'] ) : 0;

			if ( $file_id <= 0 || 'disabled_urgent' === $status || 1 !== $is_active || $language_term_id <= 0 ) {
				continue;
			}

			$term = get_term( $language_term_id, $taxonomy_slug );
			if ( ! $term || is_wp_error( $term ) ) {
				continue;
			}

			$slug = sanitize_key( (string) $term->slug );
			if ( '' === $slug ) {
				continue;
			}

			if ( ! empty( $language_slugs ) && ! in_array( $slug, $language_slugs, true ) ) {
				continue;
			}

			$url = wp_get_attachment_url( $file_id );
			if ( ! $url ) {
				continue;
			}

			$modified = get_post_modified_time( 'U', true, $file_id );
			$created  = get_post_time( 'U', true, $file_id );

			$candidate = array(
				'url'      => (string) $url,
				'file_id'  => (int) $file_id,
				'term_id'  => (int) $language_term_id,
				'time'     => max( absint( $modified ), absint( $created ) ),
				'rowIndex' => absint( $index ),
			);

			if ( ! isset( $best_by_slug[ $slug ] ) ) {
				$best_by_slug[ $slug ] = $candidate;
				continue;
			}

			$current = $best_by_slug[ $slug ];
			if ( $candidate['time'] > $current['time'] ) {
				$best_by_slug[ $slug ] = $candidate;
				continue;
			}

			if ( $candidate['time'] === $current['time'] && $candidate['rowIndex'] > $current['rowIndex'] ) {
				$best_by_slug[ $slug ] = $candidate;
			}
		}

		$result = array();
		foreach ( $best_by_slug as $slug => $data ) {
			$result[ $slug ] = array(
				'url'     => (string) $data['url'],
				'file_id' => (int) $data['file_id'],
				'term_id' => (int) $data['term_id'],
			);
		}

		return $result;
	}

	/**
	 * Get the first Genetic Testing post linked to a product version.
	 *
	 * Genetic Testing stores related product version IDs in serialized meta under
	 * meta key "linked_posts_genetic" (e.g. "a:2:{i:0;i:35590;i:1;i:35743;}").
	 *
	 * @param int $product_version_id Product version post ID.
	 * @return int Genetic Testing post ID (0 when none found).
	 */
	public static function get_genetic_testing_post_id_by_product_version( int $product_version_id ): int {
		static $cache = array();

		$product_version_id = absint( $product_version_id );
		if ( $product_version_id <= 0 ) {
			return 0;
		}

		if ( array_key_exists( $product_version_id, $cache ) ) {
			return absint( $cache[ $product_version_id ] );
		}

		$cache[ $product_version_id ] = 0;

		// ACF relationship / post object fields are typically stored as serialized ints: "i:123;".
		$query = new \WP_Query(
			array(
				'post_type'      => 'genetic-testing',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'     => 'linked_posts_genetic',
						'value'   => 'i:' . $product_version_id . ';',
						'compare' => 'LIKE',
					),
				),
			)
		);

		if ( ! empty( $query->posts[0] ) ) {
			$cache[ $product_version_id ] = absint( $query->posts[0] );
			return absint( $cache[ $product_version_id ] );
		}

		// Back-compat fallback for sites that store IDs as quoted strings in serialized arrays.
		$fallback = new \WP_Query(
			array(
				'post_type'      => 'genetic-testing',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'     => 'linked_posts_genetic',
						'value'   => '"' . $product_version_id . '"',
						'compare' => 'LIKE',
					),
				),
			)
		);

		if ( ! empty( $fallback->posts[0] ) ) {
			$cache[ $product_version_id ] = absint( $fallback->posts[0] );
		}

		return absint( $cache[ $product_version_id ] );
	}

	/**
	 * Get a Genetic Testing permalink linked to a product version.
	 *
	 * @param int $product_version_id Product version post ID.
	 * @return array{post_id:int,url:string}
	 */
	public static function get_genetic_testing_link_by_product_version( int $product_version_id ): array {
		$post_id = self::get_genetic_testing_post_id_by_product_version( $product_version_id );
		$url     = $post_id ? get_permalink( $post_id ) : '';

		return array(
			'post_id' => absint( $post_id ),
			'url'     => is_string( $url ) ? $url : '',
		);
	}

	/**
	 * Get marketing material posts for a poster category (optionally restricted to selected post IDs).
	 *
	 * @param int   $category_id        Poster category term ID.
	 * @param array $selected_post_ids  Selected post IDs (optional).
	 * @param int   $material_type_id   Marketing material type term ID (optional).
	 * @return array<int,\WP_Post>
	 */
	public static function get_marketing_material_posts_for_category(
		int $category_id,
		array $selected_post_ids = array(),
		int $material_type_id = 0
	): array {
		$category_id = absint( $category_id );
		if ( $category_id <= 0 ) {
			return array();
		}

		$tax_query = array(
			array(
				'taxonomy' => 'poster_category',
				'field'    => 'term_id',
				'terms'    => $category_id,
			),
		);

		$material_type_id = absint( $material_type_id );
		if ( $material_type_id > 0 ) {
			$tax_query[] = array(
				'taxonomy' => 'marketing_material_type',
				'field'    => 'term_id',
				'terms'    => $material_type_id,
			);
		}

		$args = array(
			'post_type'      => 'marketing_material',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'tax_query'      => $tax_query,
		);

		$selected_post_ids = array_values(
			array_filter(
				array_map( 'absint', $selected_post_ids )
			)
		);

		if ( ! empty( $selected_post_ids ) ) {
			$args['post__in'] = $selected_post_ids;
		}

		$posts_query = new \WP_Query( $args );
		$posts       = is_array( $posts_query->posts ) ? $posts_query->posts : array();
		wp_reset_postdata();

		// Preserve the selected order when post__in is used.
		if ( ! empty( $selected_post_ids ) && ! empty( $posts ) ) {
			$order = array_flip( $selected_post_ids );

			usort(
				$posts,
				static function ( $a, $b ) use ( $order ) {
					$a_index = $order[ $a->ID ] ?? PHP_INT_MAX;
					$b_index = $order[ $b->ID ] ?? PHP_INT_MAX;

					return $a_index <=> $b_index;
				}
			);
		}

		return $posts;
	}

	/**
	 * Render a single marketing material item row (download links).
	 *
	 * @param int    $post_id    Marketing material post id.
	 * @param string $post_title Marketing material title.
	 * @return string
	 */
	public static function render_marketing_material_item( int $post_id, string $post_title ): string {
		$post_id = absint( $post_id );
		if ( $post_id <= 0 ) {
			return '';
		}

		$files_by_lang = self::get_marketing_material_latest_files_by_language( $post_id, array( 'en', 'es' ) );

		$links       = array();
		$lang_labels = array(
			'en' => 'EN',
			'es' => 'ES',
		);

		foreach ( $lang_labels as $lang_slug => $lang_label ) {
			if ( empty( $files_by_lang[ $lang_slug ]['url'] ) ) {
				continue;
			}

			$links[] = array(
				'label' => $lang_label,
				'url'   => (string) $files_by_lang[ $lang_slug ]['url'],
			);
		}

		if ( empty( $links ) ) {
			$file = self::get_marketing_material_latest_file( $post_id );
			if ( is_array( $file ) && ! empty( $file['url'] ) ) {
				$links[] = array(
					'label' => '',
					'url'   => (string) $file['url'],
				);
			}
		}

		if ( empty( $links ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="test-catlouge__row">
			<div class="test-catlouge__gene-name">
				<?php echo esc_html( $post_title ); ?>
			</div>
			<div class="test-catlouge__links">
				<?php foreach ( $links as $link ) : ?>
					<a class="test-catlouge__link" href="<?php echo esc_url( $link['url'] ); ?>" target="_blank" rel="noopener noreferrer">
						<?php if ( '' !== $link['label'] ) : ?>
							<span class="test-catlouge__language"> (<?php echo esc_html( $link['label'] ); ?>)</span>
						<?php endif; ?>
						<img
							decoding="async"
							src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/download-icon.svg' ); ?>"
							alt=""
						/>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Parse a comma-separated search string into unique tokens.
	 *
	 * @param string $raw Comma-separated string.
	 * @return array<int,string>
	 */
	public static function parse_comma_separated_tokens( string $raw ): array {
		$raw = trim( $raw );
		if ( '' === $raw ) {
			return array();
		}

		$tokens = preg_split( '/\s*,\s*/', $raw ) ?: array();
		$tokens = array_map( 'trim', $tokens );
		$tokens = array_values( array_filter( $tokens, static fn( $t ) => '' !== $t ) );

		return array_values( array_unique( $tokens ) );
	}

	/**
	 * Find terms matching search tokens by name OR a term meta value (LIKE).
	 *
	 * Useful for "gene symbols" style lookups where the query could match either the term name
	 * or a stored meta field (e.g. `isoform`).
	 *
	 * @param string              $taxonomy  Taxonomy slug.
	 * @param array<int,string>   $tokens    Search tokens.
	 * @param string              $meta_key  Term meta key to search with LIKE.
	 * @param int                 $limit     Max terms returned (after de-dupe).
	 * @return array<int,\WP_Term>
	 */
	public static function get_terms_by_name_or_meta_like( string $taxonomy, array $tokens, string $meta_key = 'isoform', int $limit = 50 ): array {
		$taxonomy = sanitize_key( $taxonomy );
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return array();
		}

		$tokens = array_values(
			array_filter(
				array_map( 'trim', $tokens ),
				static fn( $t ) => '' !== $t
			)
		);
		if ( empty( $tokens ) ) {
			return array();
		}

		$limit = max( 1, absint( $limit ) );
		$found = array();

		foreach ( $tokens as $token ) {
			$by_name = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'number'     => $limit,
					'name__like' => $token,
					'orderby'    => 'name',
					'order'      => 'ASC',
				)
			);

			if ( ! is_wp_error( $by_name ) && ! empty( $by_name ) ) {
				foreach ( $by_name as $term ) {
					$found[ (int) $term->term_id ] = $term;
				}
			}

			$by_meta = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'number'     => $limit,
					'meta_query' => array(
						array(
							'key'     => $meta_key,
							'value'   => $token,
							'compare' => 'LIKE',
						),
					),
					'orderby'    => 'name',
					'order'      => 'ASC',
				)
			);

			if ( ! is_wp_error( $by_meta ) && ! empty( $by_meta ) ) {
				foreach ( $by_meta as $term ) {
					$found[ (int) $term->term_id ] = $term;
				}
			}

			if ( count( $found ) >= $limit ) {
				break;
			}
		}

		$terms = array_values( $found );
		usort(
			$terms,
			static function ( $a, $b ) {
				return strcasecmp( (string) $a->name, (string) $b->name );
			}
		);

		return array_slice( $terms, 0, $limit );
	}
}
