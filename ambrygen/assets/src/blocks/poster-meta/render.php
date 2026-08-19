<?php

use Ambrygen\Theme\Core\Blocks\BlockRenderService;

defined( 'ABSPATH' ) || exit;

try {
	$preview_post_id = isset( $attributes['previewPostId'] ) ? (int) $attributes['previewPostId'] : 0;
	$result          = BlockRenderService::instance()->render_poster_meta( $preview_post_id );
	echo $result;
} catch ( Exception $e ) {
	echo '<!-- Error: ' . $e->getMessage() . ' -->';
}
