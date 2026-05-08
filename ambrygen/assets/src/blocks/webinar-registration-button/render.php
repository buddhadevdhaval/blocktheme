<?php
/**
 * Webinar Registration Button Block Template.
 *
 * @var array $attributes Block attributes.
 * @var string $content Block content.
 * @var WP_Block $block Block instance.
 */

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined( 'ABSPATH' ) || exit;

$post_id = 0;

if ( ! empty( $attributes['previewPostId'] ) ) {
	$post_id = (int) $attributes['previewPostId'];
}

if ( ! $post_id && isset( $block ) && isset( $block->context['postId'] ) ) {
	$post_id = (int) $block->context['postId'];
}

if ( ! $post_id ) {
	$post_id = get_the_ID();
}

echo BlockRenderService::instance()->render_webinar_registration_button( $post_id, $attributes ?? [] );
