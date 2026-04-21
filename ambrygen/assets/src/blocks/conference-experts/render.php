<?php
/**
 * Render: Conference Experts Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Conferences\ConferenceRenderer;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( '\\Ambrygen\\Theme\\Core\\Conferences\\ConferenceRenderer' ) ) {
	return;
}

$post_id = get_the_ID();
if ( ! $post_id ) {
	return;
}

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is handled by the conference renderer.
echo ConferenceRenderer::instance()->render_experts( $post_id );
