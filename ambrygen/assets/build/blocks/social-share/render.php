<?php
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

echo BlockRenderService::instance()->render_social_share( $post_id );
