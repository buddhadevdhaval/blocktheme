<?php
/**
 * Render: Genetic Testing Accordion Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$ambrygen_post_id = isset( $attributes['postId'] ) ? absint( $attributes['postId'] ) : 0;

// Render a data comment that the parent block can pick up for grouping logic.
if ( $ambrygen_post_id ) {
	printf( '<!-- GENETIC_TEST_ID: %d -->', $ambrygen_post_id );
}
