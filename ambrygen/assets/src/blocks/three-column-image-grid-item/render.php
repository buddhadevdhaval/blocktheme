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

$ambrygen_attributes    = is_array( $attributes ) ? $attributes : array();
$ambrygen_title         = $ambrygen_attributes['sectiontitle'] ?? '';
$ambrygen_description   = $ambrygen_attributes['description'] ?? '';
$ambrygen_image_id      = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_url     = isset( $ambrygen_attributes['imageUrl'] ) ? esc_url_raw( $ambrygen_attributes['imageUrl'] ) : '';
$ambrygen_image_alt     = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_video_title   = $ambrygen_attributes['videoTitle'] ?? '';
$ambrygen_video_content = isset( $ambrygen_attributes['videoContent'] ) ? wp_kses_post( $ambrygen_attributes['videoContent'] ) : '';
$ambrygen_cta           = isset( $ambrygen_attributes['cta'] ) && is_array( $ambrygen_attributes['cta'] ) ? $ambrygen_attributes['cta'] : array();
$ambrygen_files         = $ambrygen_attributes['files'] ?? array();

$ambrygen_cta_text     = isset( $ambrygen_cta['text'] ) ? sanitize_text_field( $ambrygen_cta['text'] ) : '';
$ambrygen_cta_url      = isset( $ambrygen_cta['url'] ) ? esc_url_raw( $ambrygen_cta['url'] ) : '';
$ambrygen_cta_target   = isset( $ambrygen_cta['target'] ) && '_blank' === $ambrygen_cta['target'] ? '_blank' : '';
$ambrygen_cta_rel      = isset( $ambrygen_cta['rel'] ) ? sanitize_text_field( $ambrygen_cta['rel'] ) : '';
$ambrygen_cta_variant  = isset( $ambrygen_cta['variant'] ) ? sanitize_html_class( $ambrygen_cta['variant'] ) : 'dark';
$ambrygen_is_popup     = ! empty( $ambrygen_cta['isPopup'] );
$ambrygen_popup_type   = isset( $ambrygen_cta['popupType'] ) ? sanitize_text_field( $ambrygen_cta['popupType'] ) : 'video';
$ambrygen_form_title   = isset( $ambrygen_attributes['formTitle'] ) ? sanitize_text_field( $ambrygen_attributes['formTitle'] ) : '';
$ambrygen_form_content = isset( $ambrygen_attributes['formContent'] ) ? wp_kses_post( $ambrygen_attributes['formContent'] ) : '';
$ambrygen_variation    = $block->context['ambrygen/threeColumnVariation'] ?? 'variation-1';

$ambrygen_allowed_variations  = array( 'variation-1', 'variation-2' );
$ambrygen_variation           = in_array( $ambrygen_variation, $ambrygen_allowed_variations, true ) ? $ambrygen_variation : 'variation-1';
$ambrygen_description_class   = 'variation-2' === $ambrygen_variation ? 'body1' : 'body2-reg';
$ambrygen_allowed_popup_types = array( 'video', 'form' );
$ambrygen_popup_type          = in_array( $ambrygen_popup_type, $ambrygen_allowed_popup_types, true ) ? $ambrygen_popup_type : 'video';

if ( ! is_array( $ambrygen_files ) ) {
	$ambrygen_files = array();
}

$ambrygen_files            = array_values(
	array_filter(
		$ambrygen_files,
		static function ( $file ) {
			return is_array( $file ) && ! empty( $file['fileUrl'] );
		}
	)
);
$ambrygen_has_title        = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_description  = '' !== trim( wp_strip_all_tags( $ambrygen_description ) );
$ambrygen_has_text_content = $ambrygen_has_title || $ambrygen_has_description || ! empty( $ambrygen_files );

$ambrygen_cta_rel_parts = $ambrygen_cta_rel ? preg_split( '/\s+/', $ambrygen_cta_rel, -1, PREG_SPLIT_NO_EMPTY ) : array();

if ( '_blank' === $ambrygen_cta_target ) {
	$ambrygen_cta_rel_parts = array_merge( $ambrygen_cta_rel_parts, array( 'noopener', 'noreferrer' ) );
}

$ambrygen_cta_rel      = implode( ' ', array_unique( array_filter( $ambrygen_cta_rel_parts ) ) );
$ambrygen_wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'three-column-card js-gsap-fade' ) );

// Video specific logic.
$ambrygen_video_type        = '';
$ambrygen_video_src         = '';
$ambrygen_video_title_popup = '';

if ( $ambrygen_is_popup && 'video' === $ambrygen_popup_type ) {
	$ambrygen_video_type = isset( $ambrygen_cta['videoType'] ) ? sanitize_text_field( $ambrygen_cta['videoType'] ) : 'embed';
	$ambrygen_video_type = in_array( $ambrygen_video_type, array( 'embed', 'mp4' ), true ) ? $ambrygen_video_type : 'embed';
	$ambrygen_video_src  = 'mp4' === $ambrygen_video_type
		? esc_url_raw( $ambrygen_cta['videoUrl'] ?? '' )
		: Helper::get_iframe_src( $ambrygen_cta['iframeUrl'] ?? '' );

	$ambrygen_video_title_popup = ! empty( $ambrygen_video_title )
		? $ambrygen_video_title
		: ( ! empty( $ambrygen_title ) ? $ambrygen_title : $ambrygen_cta_text );
}
?>

<div <?php echo $ambrygen_wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="three-column-card__inner">

		<div class="three-column-card__image-wrapper">
			<div class="three-column-card__image">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
				echo Helper::image_from_source(
					$ambrygen_image_id,
					$ambrygen_image_url,
					'medium_large',
					array(
						'class'    => 'card-image',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_image_alt,
					),
					true
				);
				?>
			</div>
			<?php if ( $ambrygen_has_text_content ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>
				<div class="three-column-card__text-content">
					<?php if ( $ambrygen_has_title ) : ?>
						<h3 class="three-column-card__title heading-5 mb-0">
							<?php
							echo wp_kses(
								$ambrygen_title,
								Helper::allowed_heading_html()
							);
							?>
						</h3>
					<?php endif; ?>

					<?php if ( $ambrygen_has_description ) : ?>
						<div class="three-column-card__description <?php echo esc_attr( $ambrygen_description_class ); ?>">
							<?php echo wp_kses_post( $ambrygen_description ); ?>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_files ) ) : ?>
						<div class="three-column-card__files download-link has-downloads">
							<div class="three-column-card__files-list download-link__files-list">
								<?php foreach ( $ambrygen_files as $file ) : ?>
									<?php
									$file_url       = isset( $file['fileUrl'] ) ? esc_url_raw( $file['fileUrl'] ) : '';
									$file_name      = isset( $file['fileName'] ) ? sanitize_text_field( $file['fileName'] ) : '';
									$file_size_type = isset( $file['sizeType'] ) ? sanitize_text_field( $file['sizeType'] ) : '';
									$file_label     = $file_name ? $file_name : wp_basename( $file_url );
									?>
									<?php if ( $file_url ) : ?>
										<div class="three-column-card__files-item download-link__files-item">
											<a
												class="three-column-card__files-link download-link__files-link"
												href="<?php echo esc_url( $file_url ); ?>"
												download
											>
												<?php echo esc_html( $file_label ); ?>
												<?php if ( $file_size_type ) : ?>
													<span class="download-link__size">(<?php echo esc_html( $file_size_type ); ?>)</span>
												<?php endif; ?>
												<span class="screen-reader-text"><?php esc_html_e( ' - download', 'ambrygen-web' ); ?></span>
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
			<div class="three-column-card__cta-wrapper">
				<?php if ( $ambrygen_is_popup && 'video' === $ambrygen_popup_type ) : ?>
					<button
						type="button"
						class="three-column-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?> site-btn has-video-arrow"
						aria-haspopup="dialog"
						aria-expanded="false"
						aria-controls="ambry-global-video-modal"
						data-video-type="<?php echo esc_attr( $ambrygen_video_type ); ?>"
						data-video-title="<?php echo esc_attr( $ambrygen_video_title_popup ); ?>"
						<?php if ( $ambrygen_video_src ) : ?>
							data-video-src="<?php echo esc_url( $ambrygen_video_src ); ?>"
						<?php endif; ?>
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
						class="three-column-card__cta <?php echo esc_attr( $ambrygen_cta_variant ); ?> site-btn has-form-arrow has-right-arrow"
						aria-haspopup="dialog"
						aria-expanded="false"
						aria-controls="ambry-global-video-modal"
						data-form-title="<?php echo esc_attr( $ambrygen_form_title ); ?>"
						data-form-content="<?php echo esc_attr( $ambrygen_form_content ); ?>"
					>
						<?php echo esc_html( $ambrygen_cta_text ); ?>
					</button>
				<?php elseif ( $ambrygen_cta_url ) : ?>
					<a
						href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
						class="three-column-card__cta site-btn has-right-arrow <?php echo esc_attr( $ambrygen_cta_variant ); ?>"
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
