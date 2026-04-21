<?php

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined('ABSPATH') || exit;

try {
	$result = BlockRenderService::instance()->render_presentation_meta();
	echo $result;
} catch (Exception $e) {
	echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
