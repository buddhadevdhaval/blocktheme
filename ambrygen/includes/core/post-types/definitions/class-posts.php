<?php
/**
 * Post (default) definitions.
 *
 * @package Ambrygen
 */

namespace Ambrygen\Theme\Core\PostTypes\Definitions;

use Ambrygen\Theme\Core\PostTypes\AbstractPostType;

defined('ABSPATH') || exit;

/**
 * Posts -- default WordPress posts.
 */
class Posts extends AbstractPostType
{

	public function slug(): string
	{
		return 'post';
	}

	public function label(): string
	{
		return __('Posts', 'ambrygen');
	}

	public function singular_label(): string
	{
		return __('Post', 'ambrygen');
	}

	public function supports(): array
	{
		return array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields', 'revisions');
	}

	public function has_archive(): bool
	{
		return false;
	}

	public function meta_fields(): array
	{
		return array(
			'media_type' => array(
				'label' => __('Media Type', 'ambrygen'),
				'type' => 'select',
				'options' => array(
					'image' => __('Featured Image', 'ambrygen'),
					'video' => __('Video', 'ambrygen'),
				),
			),
			'video_type' => array(
				'label' => __('Video Type', 'ambrygen'),
				'type' => 'select',
				'options' => array(
					'embed' => __('YouTube / Vimeo', 'ambrygen'),
					'mp4' => __('Self Hosted (MP4)', 'ambrygen'),
				),
			),
			'iframe_url' => array(
				'label' => __('Video URL', 'ambrygen'),
				'type' => 'text',
				'description' => __('Paste YouTube/Vimeo or iframe embed URL.', 'ambrygen'),
			),
			'video_url' => array(
				'label' => __('Self Hosted URL', 'ambrygen'),
				'type' => 'media_file',
				'description' => __('Upload or select an MP4 file from the media library.', 'ambrygen'),
			),
			'poster_image_id' => array(
				'label' => __('Thumbnail / Poster Image', 'ambrygen'),
				'type' => 'media_file',
				'description' => __('Image to show before the video plays.', 'ambrygen'),
			),
		);
	}
}
