<?php

use Ambrygen\Theme\Core\Science\ScienceRenderer;

defined('ABSPATH') || exit;

if (!class_exists('\\Ambrygen\\Theme\\Core\\Science\\ScienceRenderer')) {
	return;
}

$post_id = 0;

if (!empty($attributes['previewPostId'])) {
	$post_id = (int) $attributes['previewPostId'];
}

if (!$post_id && isset($block) && isset($block->context['postId'])) {
	$post_id = (int) $block->context['postId'];
}

if (!$post_id) {
	$post_id = (int) get_the_ID();
}

if (!$post_id) {
	return;
}


echo ScienceRenderer::instance()->render_post_meta_fields($post_id);
