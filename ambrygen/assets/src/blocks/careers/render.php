<?php
use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes       = $attributes ?? array();
$ambrygen_title            = $ambrygen_attributes['title'] ?? 'Title';
$ambrygen_intro            = $ambrygen_attributes['intro'] ?? 'Add intro...';
$ambrygen_heading_level    = $ambrygen_attributes['headingLevel'] ?? 'h2';

$ambrygen_video_array        = $ambrygen_attributes['videoObj'] ?? '';
$ambrygen_video_url        = $ambrygen_video_array['url'] ?? '';



$ambrygen_video_poster = isset( $ambrygen_attributes['videoPoster'] ) && is_array( $ambrygen_attributes['videoPoster'] )
	? $ambrygen_attributes['videoPoster']
	: array();

$ambrygen_video_type       = $ambrygen_attributes['videoType'] ?? 'mp4'; // mp4 | embed


$ambrygen_careers_link_top = isset( $ambrygen_attributes['link'] ) && is_array( $ambrygen_attributes['link'] )
	? $ambrygen_attributes['link']
	: array();

$ambrygen_careers_link_bottom = isset( $ambrygen_attributes['careerslink'] ) && is_array( $ambrygen_attributes['careerslink'] )
	? $ambrygen_attributes['careerslink']
	: array();

$ambrygen_play_icon = isset( $ambrygen_attributes['playIcon'] ) && is_array( $ambrygen_attributes['playIcon'] )
	? $ambrygen_attributes['playIcon']
	: array();

$ambrygen_pause_icon = isset( $ambrygen_attributes['pauseIcon'] ) && is_array( $ambrygen_attributes['pauseIcon'] )
	? $ambrygen_attributes['pauseIcon']
	: array();



$ambrygen_play_icon_url = ! empty( $ambrygen_play_icon['url'] )
	? esc_url( $ambrygen_play_icon['url'] )
	: esc_url( get_theme_file_uri( 'assets/src/images/play-icon.svg' ) );

$ambrygen_pause_icon_url = ! empty( $ambrygen_pause_icon['url'] )
	? esc_url( $ambrygen_pause_icon['url'] )
	: esc_url( get_theme_file_uri( 'assets/src/images/play-icon.svg' ) );

$ambrygen_video_poster_url = ! empty( $ambrygen_video_poster['url'] )
? esc_url( $ambrygen_video_poster['url'] )
: '';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'careers-highlight',
	]
);
$ambrygen_careers_link_bottom_target = ! empty( $ambrygen_careers_link_bottom['target'] )
    ? esc_attr( $ambrygen_careers_link_bottom['target'] )
    : '_self';

$ambrygen_careers_link_top_target = ! empty( $ambrygen_careers_link_top['target'] )
? esc_attr( $ambrygen_careers_link_top['target'] )
: '_self';



if( 'embed' === $ambrygen_video_type ) :
	$ambrygen_iframe_src = $ambrygen_attributes['videoUrl'];
$ambrygen_iframe_src = Helper::get_iframe_src( $ambrygen_iframe_src );
endif;


$ambrygen_heading_level = in_array(
	$ambrygen_heading_level,
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
	true
) ? $ambrygen_heading_level : 'h2';



?>

<div <?php echo $ambrygen_wrapper_attributes; ?>>
	<div class="careers-highlight__header block__rowflex">
		<<?php echo esc_html( $ambrygen_heading_level ); ?> class="careers-highlight__title block__rowflex--heading-title heading-4 mb-0">
			<?php echo wp_kses_post( $ambrygen_title ); ?>
		</<?php echo esc_html( $ambrygen_heading_level ); ?>>

		<div class="careers-highlight__intro block__rowflex--block-content subtitle1-reg">
			<p><?php echo esc_html( $ambrygen_intro ); ?></p>
			<?php if ( ! empty( $ambrygen_careers_link_top ) && ! empty( $ambrygen_careers_link_top['text'] ) ) : ?>
				<div class="block_rowflex-link">
							<a
								href="<?php echo esc_url( $ambrygen_careers_link_top['url'] ); ?>"
								class="site-btn is-style-site-text-btn has-icon"
								target="<?php echo $ambrygen_careers_link_top_target; ?>"
								<?php echo ( '_blank' === $ambrygen_careers_link_top_target ) ? 'rel="noopener noreferrer"' : ''; ?>
							>
						<?php echo esc_html( $ambrygen_careers_link_top['text'] ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="is-style-gl-s50"></div>

	<div class="careers-highlight__row">
		<div class="careers-highlight__left">
			<div class="custom-scroll-jobs">
				<div class="careers-highlight__jobs">
					<?php echo $content; ?>
				</div>
			</div>

			<?php if ( ! empty( $ambrygen_careers_link_bottom['text'] ) && ! empty( $ambrygen_careers_link_bottom['url'] ) ) : ?>
				<div class="block-btn">
					<div class="is-style-gl-s32"></div>
					 <a
						href="<?php echo esc_url( $ambrygen_careers_link_bottom['url'] ); ?>"
						class="site-btn is-style-site-text-btn has-icon"
						target="<?php echo $ambrygen_careers_link_bottom_target; ?>"
						<?php echo ( '_blank' === $ambrygen_careers_link_bottom_target ) ? 'rel="noopener noreferrer"' : ''; ?>
					>
						<?php echo esc_html( $ambrygen_careers_link_bottom['text'] ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>

		<div class="careers-highlight__right">
			<div class="careers-highlight__media   media_video">
				<?php if ( 'mp4' === $ambrygen_video_type && $ambrygen_video_url ) : ?>
					<video class="videos" playsinline muted preload="metadata" loop
						<?php if ( $ambrygen_video_poster_url ) : ?>
							poster="<?php echo esc_url( $ambrygen_video_poster_url ); ?>"
						<?php endif; ?>
					>
						<source src="<?php echo esc_url( $ambrygen_video_url ); ?>" type="video/mp4">
					</video>
				<?php elseif ( 'embed' === $ambrygen_video_type ) : ?>
					<?php if ( $ambrygen_iframe_src ) : ?>
						<div class="careers-highlight__media video-embed   media_video">
							<iframe
								src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
								title="<?php esc_attr_e( 'Video', 'ambrygen' ); ?>"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					<?php else : ?>
						<div class="videos-placeholder"><?php esc_html_e( 'Invalid video URL', 'ambrygen' ); ?></div>
					<?php endif; ?>
				<?php endif; ?>

				<div class="careers-highlight__play-icon-video play-icon-video">
					<div class="careers-highlight__play-icon play-icon">
						<img
							src="<?php echo $ambrygen_play_icon_url; ?>"
							width="24"
							height="24"
							alt="<?php esc_attr_e( 'Play', 'ambrygen' ); ?>"
						/>
						<img
							src="<?php echo $ambrygen_pause_icon_url; ?>"
							width="24"
							height="24"
							alt="<?php esc_attr_e( 'Pause', 'ambrygen' ); ?>"
							class="pause-icon"
						/>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
