<?php
/**
 * Server-side rendering for Genetic Information block.
 *
 * @package ambrygen
 */
use Ambrygen\Theme\Core\Helper;
 
// Block attributes
$ambrygen_attributes    = $attributes ?? array();
$ambrygen_heading       = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag   = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_description   = $ambrygen_attributes['description'] ?? '';
$ambrygen_video_url     = $ambrygen_attributes['videoUrl'] ?? '';
$ambrygen_video_type    = $ambrygen_attributes['videoType'] ?? 'embed';
$ambrygen_iframe_url    = $ambrygen_attributes['iframeUrl'] ?? '';
$ambrygen_image_url     = $ambrygen_attributes['imageUrl'] ?? '';

$ambrygen_poster_image = isset( $ambrygen_attributes['posterImage'] ) && is_array( $ambrygen_attributes['posterImage'] )
	? $ambrygen_attributes['posterImage']
	: array();

$ambrygen_play_icon  = isset( $ambrygen_attributes['playIcon'] ) && is_array( $ambrygen_attributes['playIcon'] )
	? $ambrygen_attributes['playIcon']
	: array();

$ambrygen_play_icon_id = isset( $ambrygen_play_icon['id'] )
	? (int) $ambrygen_play_icon['id']
	: 0;

$ambrygen_poster_image_id = isset( $ambrygen_poster_image['id'] )
	? (int) $ambrygen_poster_image['id']
	: 0;

$ambrygen_pause_icon = isset( $ambrygen_attributes['pauseIcon'] ) && is_array( $ambrygen_attributes['pauseIcon'] )
	? $ambrygen_attributes['pauseIcon']
	: array();

$ambrygen_poster_url = isset( $ambrygen_poster_image['url'] )
	? esc_url( $ambrygen_poster_image['url'] )
	: '';

$ambrygen_play_url = isset( $ambrygen_play_icon['url'] )
	? esc_url( $ambrygen_play_icon['url'] )
	: '';

$ambrygen_pause_url = isset( $ambrygen_pause_icon['url'] )
	? esc_url( $ambrygen_pause_icon['url'] )
	: '';

$ambrygen_pause_id = isset( $ambrygen_pause_icon['id'] )
	? (int) $ambrygen_pause_icon['id']
	: 0;
$ambrygen_iframe_src  = Helper::get_iframe_src( $ambrygen_iframe_url );

	

// Determine iframe source

// Extract URLs from image objects


?>

<div class="features-media">
	<div class="features-media__header block__rowflex">
		<<?php echo esc_html( $ambrygen_heading_tag ); ?> class="block-title block__rowflex--heading-title heading-2 mb-0">
				<?php echo wp_kses(
										$ambrygen_heading,
										Helper::allowed_heading_html()
									);?>
		</<?php echo esc_html( $ambrygen_heading_tag ); ?>>

		<div class="block__rowflex--block-content subtitle1-reg">
			<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
		</div>
	</div>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<div class="features-media__video media_video">
	<?php if ( 'embed' === $ambrygen_video_type && $ambrygen_iframe_src ) : ?>
			<div class="features-media__video-wrapper features-media__video-wrapper--iframe">
				<iframe
					src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
					title="<?php esc_attr_e( 'Genetic testing video', 'ambrygen' ); ?>"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="features-media__iframe"
				></iframe>

				<?php if ( $ambrygen_play_url || $ambrygen_pause_url ) : ?>
					<div class="play-icon-video">
						<?php if ( $ambrygen_play_icon_id ) : ?>
							<div class="play-icon">
								<?php
								echo Helper::image(
									$ambrygen_play_icon_id,
									'full',
									array(
										'class'   => 'play-icon__img',
										'loading' => 'lazy',
										'alt'     => 'Play Icon',
									)
								);
								?>
							</div>
						<?php endif; ?>

						<?php if ( $ambrygen_pause_id ) : ?>
							<div class="pause-icon">
								<?php
								echo Helper::image(
									$ambrygen_pause_id,
									'full',
									array(
										'class'   => 'pause-icon__img',
										'loading' => 'lazy',
										'alt'     => 'Pause Icon',
									)
								);
								?>
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( 'mp4' === $ambrygen_video_type && $ambrygen_video_url ) : ?>
		<div class="features-media__video-wrapper">
			<video
				class="videos"
				playsinline
				muted
				preload="metadata"
				loop
				poster="<?php echo esc_url( $ambrygen_poster_url ); ?>"
				controls
			>
				<source src="<?php echo esc_url( $ambrygen_video_url ); ?>" type="video/mp4">
				<?php esc_html_e( 'Your browser does not support the video tag.', 'ambrygen' ); ?>
			</video>

			<?php if ( $ambrygen_play_url || $ambrygen_pause_url ) : ?>
				<div class="play-icon-video">
					<?php if ( $ambrygen_play_icon_id ) : ?>
						<div class="play-icon">
							<?php
							echo Helper::image(
								$ambrygen_play_icon_id,
								'full',
								array(
									'class'   => 'play-icon__img',
									'loading' => 'lazy',
									'alt'     => 'Play Icon',
								)
							);
							?>
						</div>
					<?php endif; ?>

					<?php if ( $ambrygen_pause_id ) : ?>
						<div class="pause-icon">
							<?php
							echo Helper::image(
								$ambrygen_pause_id,
								'full',
								array(
									'class'   => 'pause-icon__img',
									'loading' => 'lazy',
									'alt'     => 'Pause Icon',
								)
							);
							?>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	</div>
</div>
