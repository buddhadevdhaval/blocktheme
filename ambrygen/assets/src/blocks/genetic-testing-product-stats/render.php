<?php
/**
 * Product Stats block render template.
 *
 * @var array    $attributes The block attributes.
 * @var string   $content    The block content.
 * @var WP_Block $block      The block object.
 */

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined('ABSPATH') || exit;

try {
    $post_id = 0;

    if (!empty($attributes['previewPostId'])) {
        $post_id = (int) $attributes['previewPostId'];
    }

    if (!$post_id && isset($block) && isset($block->context['postId'])) {
        $post_id = (int) $block->context['postId'];
    }

    if (!$post_id) {
        $post_id = get_the_ID();
    }

    echo BlockRenderService::instance()->render_genetic_testing_product_stats((int) $post_id);
} catch (Exception $e) {
    echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
