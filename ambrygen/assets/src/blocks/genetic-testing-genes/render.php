<?php
/**
 * Genetic Testing Genes Block Template.
 *
 * @var array $attributes Block attributes.
 * @var string $content Block content.
 * @var WP_Block $block Block instance.
 */

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined( 'ABSPATH' ) || exit;

$post_id = isset( $block->context['postId'] ) ? absint( $block->context['postId'] ) : get_the_ID();

if ( ! $post_id ) {
	return;
}

echo BlockRenderService::instance()->render_genetic_testing_genes( $post_id );
