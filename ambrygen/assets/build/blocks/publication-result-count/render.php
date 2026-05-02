<?php

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
	$result = BlockRenderService::instance()->render_publication_result_count($post_id);
	echo $result;
} catch (Exception $e) {
	echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
