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
			'span'   => array( 'class' => true ),
			'br'     => array(),
			'strong' => array(),
			'em'     => array(),
		);

		/**
		 * Filter allowed heading HTML.
		 */
		return apply_filters( 'ambrygen_allowed_heading_html', $allowed );
	}

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
}
