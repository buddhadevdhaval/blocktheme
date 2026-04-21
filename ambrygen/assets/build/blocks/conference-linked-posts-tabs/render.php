<?php
use Ambrygen\Theme\Core\Blocks\BlockRenderService;
defined( 'ABSPATH' ) || exit;

$post_id = get_the_ID();

echo $post_id ? BlockRenderService::instance()->render_conference_linked_posts_tabs( (int) $post_id ) : '';
