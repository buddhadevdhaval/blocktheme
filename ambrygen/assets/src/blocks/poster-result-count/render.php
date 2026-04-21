<?php

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined('ABSPATH') || exit;

try {
	$result = BlockRenderService::instance()->render_poster_result_count();
	echo $result;
} catch (Exception $e) {
	echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
