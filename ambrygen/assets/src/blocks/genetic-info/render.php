<?php
    /**
 * Render: Genetic Info Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
    use Ambrygen\Theme\Core\Helper;

    // Block attributes
    $ambrygen_attributes  = $attributes ?? [];
    $ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
    $ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
    $ambrygen_description = $ambrygen_attributes['description'] ?? '';
    $ambrygen_show_description = isset($ambrygen_attributes['showDescription']) ? (bool) $ambrygen_attributes['showDescription'] : true;
    $ambrygen_video_url   = $ambrygen_attributes['videoUrl'] ?? '';
    $ambrygen_video_type  = $ambrygen_attributes['videoType'] ?? 'embed';
    $ambrygen_iframe_url  = $ambrygen_attributes['iframeUrl'] ?? '';
    $ambrygen_image_url   = $ambrygen_attributes['imageUrl'] ?? '';
    $ambrygen_image_id    = absint($ambrygen_attributes['imageId'] ?? 0);
    $ambrygen_show_image  = ! empty($ambrygen_attributes['showImage']);

    $ambrygen_poster_image = isset($ambrygen_attributes['posterImage']) && is_array($ambrygen_attributes['posterImage'])
    ? $ambrygen_attributes['posterImage']
    : [];

    $ambrygen_poster_image_id = isset($ambrygen_poster_image['id'])
    ? (int) $ambrygen_poster_image['id']
    : 0;

    $ambrygen_poster_url = isset($ambrygen_poster_image['url'])
    ? esc_url($ambrygen_poster_image['url'])
    : '';

    $ambrygen_iframe_src = Helper::get_iframe_src($ambrygen_iframe_url);

    // Determine iframe source

    // Extract URLs from image objects

?>

<div class="features-media">
	<div class="features-media__header block__rowflex">
		<<?php echo esc_html($ambrygen_heading_tag); ?> class="block-title block__rowflex--heading-title heading-2 mb-0">
				<?php
                    echo wp_kses(
                        $ambrygen_heading,
                        Helper::allowed_heading_html()
                    );
                ?>
		</<?php echo esc_html($ambrygen_heading_tag); ?>>
		<?php if($ambrygen_show_description && $ambrygen_description) : ?>
		<div class="block__rowflex--block-content subtitle1-reg">
			<p><?php echo wp_kses_post($ambrygen_description); ?></p>
		</div>
		<?php endif; ?>
	</div>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<!-- <div class="features-media__video media_video"> -->
	<?php if ($ambrygen_show_image): ?>
		<div class="features-media has-image">
			<?php
                echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    $ambrygen_image_id,
                    'full',
                    [
                        'class'   => 'features-media__image',
                        'loading' => 'lazy',
                    ]
                );

            ?>
		</div>
	<?php endif; ?>
	<?php if (! $ambrygen_show_image && ('embed' === $ambrygen_video_type && $ambrygen_iframe_src) or ('mp4' === $ambrygen_video_type && $ambrygen_video_url)): ?>

	<div class="features-media__video media_video">
		<?php if (! $ambrygen_show_image && 'embed' === $ambrygen_video_type && $ambrygen_iframe_src): ?>
			<div class="features-media__video-wrapper features-media__video-wrapper--iframe">
					<iframe
						src="<?php echo esc_url($ambrygen_iframe_src); ?>"
						title="<?php esc_attr_e('Genetic testing video', 'ambrygen'); ?>"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						class="features-media__iframe"
					></iframe>

					<div class="play-icon-video">
							<div class="play-icon circle-icon">
								<img src="/wp-content/uploads/2026/02/play-icon1.svg" class="play-icon__img" alt="Play Icon">
							</div>
							<div class="pause-icon circle-icon">
								<img src="/wp-content/uploads/2026/02/pause-icon.svg" class="pause-icon__img" alt="Pause Icon">
							</div>
					</div>
			</div>
		<?php endif; ?>

		<?php if (! $ambrygen_show_image && 'mp4' === $ambrygen_video_type && $ambrygen_video_url): ?>
			<div class="features-media__video-wrapper">
				<video
					class="videos"
					playsinline
					muted
					preload="metadata"
					loop
					poster="<?php echo esc_url($ambrygen_poster_url); ?>"
					controls
				>
					<source src="<?php echo esc_url($ambrygen_video_url); ?>" type="video/mp4">
					<?php esc_html_e('Your browser does not support the video tag.', 'ambrygen'); ?>
				</video>

					<div class="play-icon-video">
							<div class="play-icon circle-icon">
								<img src="/wp-content/uploads/2026/02/play-icon1.svg" class="play-icon__img" alt="Play Icon">
							</div>
							<div class="pause-icon circle-icon">
								<img src="/wp-content/uploads/2026/02/pause-icon.svg" class="pause-icon__img" alt="Pause Icon">
							</div>
					</div>
			</div>
		<?php endif; ?>
	</div>
	<?php endif; ?>
</div>
