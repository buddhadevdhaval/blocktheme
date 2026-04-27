<?php
/**
 * Test Description Block Template.
 *
 * @var array $attributes Block attributes.
 * @var string $content Block content.
 * @var WP_Block $block Block instance.
 */

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined( 'ABSPATH' ) || exit;

$post_id = get_the_ID();

if ( ! $post_id ) {
	return;
}

echo BlockRenderService::instance()->render_genetic_testing_description( $post_id );
