<?php
/**
 * Render: Ordering Options Card Block
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_image_id   = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_url  = $ambrygen_attributes['imageUrl'] ?? '';
$ambrygen_image_alt  = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_title      = $ambrygen_attributes['title'] ?? '';
$ambrygen_subtitle   = $ambrygen_attributes['subtitle'] ?? '';
$ambrygen_footnote   = $ambrygen_attributes['footnote'] ?? '';
$ambrygen_cta        = is_array( $ambrygen_attributes['cta'] ?? null ) ? $ambrygen_attributes['cta'] : array();
$ambrygen_cta_text   = $ambrygen_cta['text'] ?? '';
$ambrygen_cta_url    = $ambrygen_cta['url'] ?? '';
$ambrygen_cta_target = $ambrygen_cta['target'] ?? '';
$ambrygen_cta_rel    = $ambrygen_cta['rel'] ?? '';
$ambrygen_copy_html  = trim( $content );

if ( $ambrygen_copy_html ) {
	$ambrygen_copy_processor = new WP_HTML_Tag_Processor( $ambrygen_copy_html );

	while ( $ambrygen_copy_processor->next_tag() ) {
		$tag_name = $ambrygen_copy_processor->get_tag();

		if ( 'UL' === $tag_name || 'OL' === $tag_name ) {
			$ambrygen_copy_processor->add_class( 'body1' );
			$ambrygen_copy_processor->add_class( 'ordering-options__card-list' );
			$ambrygen_copy_html = $ambrygen_copy_processor->get_updated_html();
		}

		if ( 'P' === $tag_name ) {
			$ambrygen_copy_processor->add_class( 'body1' );
			$ambrygen_copy_processor->add_class( 'ordering-options__card-paragraph' );
			$ambrygen_copy_html = $ambrygen_copy_processor->get_updated_html();
		}
	}
}

$ambrygen_cta_rel_parts = $ambrygen_cta_rel
	? array_filter( array_unique( explode( ' ', $ambrygen_cta_rel ) ) )
	: array();

if ( '_blank' === $ambrygen_cta_target ) {
	$ambrygen_cta_rel_parts = array_unique(
		array_merge( $ambrygen_cta_rel_parts, array( 'noopener', 'noreferrer' ) )
	);
}

$ambrygen_cta_rel = implode( ' ', $ambrygen_cta_rel_parts );

// Avoid undefined variable notices when CTA/video is not configured.
$ambrygen_is_video   = false;
$ambrygen_video_type = '';
$ambrygen_video_src  = '';
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'ordering-options__card' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	
		<?php if ( $ambrygen_image_id ) : ?>
			<div class="ordering-options__card-image">
			<?php
			echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized HTML.
				$ambrygen_image_id,
				'large',
				array(
					'alt'     => esc_attr( $ambrygen_image_alt ),
					'loading' => 'lazy',
				)
			);
			?>
			</div>
		<?php endif; ?>

	<div class="ordering-options__card-body">
		<div class="ordering-options__card-content">
			<?php if ( $ambrygen_title ) : ?>
				<h3 class="heading-5 ordering-options__card-title mb-0">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</h3>
			<?php endif; ?>

			<?php if ( $ambrygen_subtitle ) : ?>
				<div class="subtitle2-sbold ordering-options__card-subtitle">
					<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_copy_html ) : ?>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php echo $ambrygen_copy_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>

			<?php if ( $ambrygen_footnote ) : ?>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="body-2-regular ordering-options__card-footnote">
					<?php echo wp_kses_post( $ambrygen_footnote ); ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( $ambrygen_cta_text && ( $ambrygen_cta_url || ! empty( $ambrygen_cta['isVideo'] ) ) ) : 
			$ambrygen_is_video = ! empty( $ambrygen_cta['isVideo'] );

			if ( $ambrygen_is_video ) {
				$ambrygen_video_type = $ambrygen_cta['videoType'] ?? 'embed';
				$ambrygen_video_src  = 'mp4' === $ambrygen_video_type 
					? ( $ambrygen_cta['videoUrl'] ?? '' ) 
					: Helper::get_iframe_src( $ambrygen_cta['iframeUrl'] ?? '' );
			}
		?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<div class="ordering-options__card-cta">
				<a
					href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
					class="site-btn is-style-site-trailing-icon"
					<?php if ( ! empty( $ambrygen_cta_target ) ) : ?>
						target="<?php echo esc_attr( $ambrygen_cta_target ); ?>"
					<?php endif; ?>
					<?php if ( ! empty( $ambrygen_cta_rel ) ) : ?>
						rel="<?php echo esc_attr( $ambrygen_cta_rel ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_cta_text ); ?>
					<?php if ( '_blank' === $ambrygen_cta_target ) : ?>
						<span class="screen-reader-text">
							<?php echo esc_html__( '(opens in new tab)', 'ambrygen-web' ); ?>
						</span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</div>
