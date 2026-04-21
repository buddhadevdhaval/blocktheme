<?php
use Ambrygen\Theme\Core\Helper;
defined( 'ABSPATH' ) || exit;
$post_id = 0;

if ( ! empty( $attributes['previewPostId'] ) ) {
	$post_id = (int) $attributes['previewPostId'];
}

if ( ! $post_id && isset( $block ) && isset( $block->context['postId'] ) ) {
	$post_id = (int) $block->context['postId'];
}

if ( ! $post_id ) {
	$post_id = (int) get_the_ID();
}

if ( ! $post_id ) {
	return;
}

$size = isset($attributes['sizeSlug']) ? (string) $attributes['sizeSlug'] : 'full';
$class = isset($attributes['className']) ? (string) $attributes['className'] : '';
$is_link = ! empty($attributes['isLink']);

$image_html = Helper::image_with_placeholder(
	get_post_thumbnail_id($post_id),
	$size,
	array(
		'class' => $class,
	)
);

if (! $is_link) {
	echo $image_html;
	return;
}

$permalink = get_permalink($post_id);
if (! $permalink) {
	echo $image_html;
	return;
}

echo '<a href="' . esc_url($permalink) . '">' . $image_html . '</a>';
