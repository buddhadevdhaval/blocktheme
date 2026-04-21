<?php
use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined('ABSPATH') || exit;

$post_id = get_the_ID();
if (!$post_id) {
	return;
}

echo BlockRenderService::instance()->render_event_meta_summary($post_id);
