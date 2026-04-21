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
	protected function __construct() {}

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

		$collaborators = get_terms(
			array(
				'taxonomy'   => 'collaborator',
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

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

		$collaborators = get_terms(
			array(
				'taxonomy'   => 'collaborator',
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

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
		$specialty_areas = get_terms(
			array(
				'taxonomy'   => 'poster_category',
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $specialty_areas ) ) {
			$specialty_areas = array();
		}

		$topics = get_terms(
			array(
				'taxonomy'   => 'post_tag',
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $topics ) ) {
			$topics = array();
		}

		$collaborators = get_terms(
			array(
				'taxonomy'   => 'collaborator',
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

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

			if ( $file_id <= 0 || 'disabled_urgent' === $status ) {
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
			$language_term_id = isset( $row['language_term_id'] ) ? absint( $row['language_term_id'] ) : 0;

			if ( $file_id <= 0 || 'disabled_urgent' === $status || $language_term_id <= 0 ) {
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
			<?php foreach ( $links as $link ) : ?>
				<a
					class="test-catlouge__gene-name test-catlouge__link"
					href="<?php echo esc_url( $link['url'] ); ?>"
					target="_blank"
					rel="noopener noreferrer"
				>
					<?php echo esc_html( $post_title ); ?>
					<?php if ( '' !== $link['label'] ) : ?>
						<span class="test-catlouge__language"> (<?php echo esc_html( $link['label'] ); ?>)</span>
					<?php endif; ?>
					<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/download-icon.svg' ); ?>" alt="" />
				</a>
			<?php endforeach; ?>
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
