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
			'video_type' => array(
				'label' => __('Video Type', 'ambrygen'),
				'type' => 'select',
				'options' => array(
					'' => __('None', 'ambrygen'),
					'mp4' => __('MP4 File', 'ambrygen'),
					'embed' => __('YouTube/Vimeo Embed', 'ambrygen'),
				),
			),
			'video_url' => array(
				'label' => __('MP4 Video URL', 'ambrygen'),
				'type' => 'media_file',
				'description' => __('Upload or select an MP4 file from the media library.', 'ambrygen'),
			),
			'iframe_url' => array(
				'label' => __('Iframe Embed URL', 'ambrygen'),
				'type' => 'text',
				'description' => __('YouTube or Vimeo embed link.', 'ambrygen'),
			),
			'poster_image_id' => array(
				'label' => __('Video Poster/Thumbnail', 'ambrygen'),
				'type' => 'media_file',
				'description' => __('Image to show before the video plays.', 'ambrygen'),
			),
		);
	}
}
