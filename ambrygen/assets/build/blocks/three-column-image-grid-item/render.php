<?php
/**
 * Render: Three Column Image Grid Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes  = $attributes ?? array();
$ambrygen_title       = $ambrygen_attributes['sectiontitle'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_image_id    = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_alt   = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_video_title = $ambrygen_attributes['videoTitle'] ?? '';
$ambrygen_video_content = $ambrygen_attributes['videoContent'] ?? '';
$ambrygen_cta         = $ambrygen_attributes['cta'] ?? array();
$ambrygen_files       = $ambrygen_attributes['files'] ?? array();

$ambrygen_cta_text    = $ambrygen_cta['text'] ?? '';
$ambrygen_cta_url     = $ambrygen_cta['url'] ?? '';
$ambrygen_cta_target  = $ambrygen_cta['target'] ?? '';
$ambrygen_cta_rel     = $ambrygen_cta['rel'] ?? '';
$ambrygen_cta_variant = $ambrygen_cta['variant'] ?? 'dark';
$ambrygen_is_popup    = ! empty( $ambrygen_cta['isPopup'] );
$ambrygen_popup_type  = $ambrygen_cta['popupType'] ?? 'video';
$ambrygen_form_title  = $attributes['formTitle'] ?? '';
$ambrygen_form_content = $attributes['formContent'] ?? '';
$ambrygen_variation   = $block->context['ambrygen/threeColumnVariation'] ?? 'default';

$ambrygen_allowed_variations = array( 'default', 'variation-three' );
$ambrygen_variation          = in_array( $ambrygen_variation, $ambrygen_allowed_variations, true ) ? $ambrygen_variation : 'default';
$ambrygen_description_class  = 'variation-three' === $ambrygen_variation ? 'body1' : 'body2-reg';

if ( ! is_array( $ambrygen_files ) ) {
	$ambrygen_files = array();
}

$ambrygen_files            = array_values(
	array_filter(
		$ambrygen_files,
		static function ( $file ) {
			return ! empty( $file['fileUrl'] );
		}
	)
);
$ambrygen_has_text_content = ! empty( $ambrygen_title ) || ! empty( $ambrygen_description ) || ! empty( $ambrygen_files );

/*
|--------------------------------------------------------------------------
| Ensure rel attribute is secure if target=_blank
|--------------------------------------------------------------------------
*/
if ( '_blank' === $ambrygen_cta_target && empty( $ambrygen_cta_rel ) ) {
	$ambrygen_cta_rel = 'noopener noreferrer';
}

$ambrygen_wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'approach-card js-gsap-fade' ) );

// Video specific logic
$ambrygen_video_type = '';
$ambrygen_video_src  = '';

if ( $ambrygen_is_popup && 'video' === $ambrygen_popup_type ) {
	$ambrygen_video_type = $ambrygen_cta['videoType'] ?? 'embed';
	$ambrygen_video_src  = 'mp4' === $ambrygen_video_type 
		? ( $ambrygen_cta['videoUrl'] ?? '' ) 
		: Helper::get_iframe_src( $ambrygen_cta['iframeUrl'] ?? '' );
		
	$ambrygen_video_title_popup = ! empty( $ambrygen_video_title ) 
		? $ambrygen_video_title 
		: ( ! empty( $ambrygen_title ) ? $ambrygen_title : $ambrygen_cta_text );
}
?>

<div <?php echo $ambrygen_wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="approach-card__inner">

		<div class="approach-card__image-wrapper">
			<div class="approach-card__image">
				<?php
				echo wp_kses_post(
					Helper::image_with_placeholder(
						$ambrygen_image_id,
						'medium_large',
						array(
							'class'   => 'card-image',
							'loading' => 'lazy',
							'alt'     => $ambrygen_image_alt ? $ambrygen_image_alt : wp_strip_all_tags( $ambrygen_title ),
						)
					)
				);
				?>
			</div>
			<?php if ( $ambrygen_has_text_content ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>
				<div class="approach-card__text-content">
					<?php if ( ! empty( $ambrygen_title ) ) : ?>
						<h3 class="approach-card__title heading-5 mb-0">
							<?php
							echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
							?>
						</h3>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_description ) ) : ?>
						<div class="approach-card__description <?php echo esc_attr( $ambrygen_description_class ); ?>">
							<?php echo wp_kses_post( $ambrygen_description ); ?>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_files ) ) : ?>
						<div class="approach-card__files download-link has-downloads">
							<div class="approach-card__files-list download-link__files-list">
								<?php foreach ( $ambrygen_files as $file ) : ?>
									<?php
									$file_url       = $file['fileUrl'] ?? '';
									$file_name      = $file['fileName'] ?? '';
									$file_size_type = $file['sizeType'] ?? '';
									$file_label     = $file_name ? $file_name : wp_basename( $file_url );
									?>
									<?php if ( $file_url ) : ?>
										<div class="approach-card__files-item download-link__files-item">
											<a
												class="approach-card__files-link download-link__files-link"
												href="<?php echo esc_url( $file_url ); ?>"
												download
											>
												<?php if ( $file_size_type ) : ?>
														<?php echo esc_html( $file_size_type ); ?>
												<?php endif; ?>
											</a>
										</div>
									<?php endif; ?>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endif; ?>
			</div>
		</div>

		<?php if ( $ambrygen_cta_text && $ambrygen_has_text_content ) : ?>
			<div class="is-style-gl-s32" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( $ambrygen_cta_text ) : ?>
			<div class="approach-card__cta-wrapper">
				<?php if ( $ambrygen_is_popup && 'video' === $ambrygen_popup_type ) : ?>
					<button
						type="button"
						class="approach-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?> is-style-site-trailing-icon has-video-arrow"
						data-video-type="<?php echo esc_attr( $ambrygen_video_type ); ?>"
						data-video-src="<?php echo esc_url( $ambrygen_video_src ); ?>"
						data-video-title="<?php echo esc_attr( $ambrygen_video_title_popup ); ?>"
						data-video-content="<?php echo esc_attr( $ambrygen_video_content ); ?>"
					>
						<?php echo esc_html( $ambrygen_cta_text ); ?>
					</button>

					<div style="display: none;" aria-hidden="true">
						<?php if ( ! empty( $ambrygen_video_title ) ) : ?>
							<div class="subtitle2-sbold videos__cards-item-title">
								<?php echo wp_kses( $ambrygen_video_title, Helper::allowed_heading_html() ); ?>
							</div>
						<?php endif; ?>
						<?php if ( ! empty( $ambrygen_video_content ) ) : ?>
							<div class="subtitle2-sbold videos__cards-item-description">
								<?php echo wp_kses_post( $ambrygen_video_content ); ?>
							</div>
						<?php endif; ?>
					</div>
				<?php elseif ( $ambrygen_is_popup && 'form' === $ambrygen_popup_type ) : ?>
					<button
						type="button"
						class="approach-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?> is-style-site-trailing-icon has-form-arrow"
						data-form-title="<?php echo esc_attr( $ambrygen_form_title ); ?>"
						data-form-content="<?php echo esc_attr( $ambrygen_form_content ); ?>"
					>
						<?php echo esc_html( $ambrygen_cta_text ); ?>
					</button>
				<?php elseif ( $ambrygen_cta_url ) : ?>
					<a
						href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
						class="approach-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?>"
						<?php echo $ambrygen_cta_target ? ' target="' . esc_attr( $ambrygen_cta_target ) . '"' : ''; ?>
						<?php echo $ambrygen_cta_rel ? ' rel="' . esc_attr( $ambrygen_cta_rel ) . '"' : ''; ?>
					>
						<?php echo esc_html( $ambrygen_cta_text ); ?>
						<?php if ( '_blank' === $ambrygen_cta_target ) : ?>
							<span class="screen-reader-text"><?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?></span>
						<?php endif; ?>
					</a>
				<?php endif; ?>
			</div>
		<?php endif; ?>

	</div>
</div>
