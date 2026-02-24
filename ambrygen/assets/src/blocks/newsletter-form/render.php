<?php
/**
 * Render template for the Newsletter Form block.
 *
 * @package Ambrygen
 */

use Ambrygen\Theme\Core\Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : [];
$ambrygen_content    = $content ?? '';

/* Text content */
$ambrygen_eyebrow     = $ambrygen_attributes['eyebrow']     ?? __( 'Newsletter', 'ambrygen-web' );
$ambrygen_heading     = $ambrygen_attributes['heading']     ?? __( 'Stay Informed', 'ambrygen-web' );
$ambrygen_heading_tag = $ambrygen_attributes['headingTag']  ?? 'h2';
$ambrygen_description = $ambrygen_attributes['description'] ?? __( 'Subscribe to the Ambry Newsletter and other updates.', 'ambrygen-web' );

/* Validate heading tag */
$ambrygen_allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' );
if ( ! in_array( $ambrygen_heading_tag, $ambrygen_allowed_tags, true ) ) {
	$ambrygen_heading_tag = 'h2';
}

/* Main image handling */
$ambrygen_image_id = absint( $ambrygen_attributes['imageId'] ?? 0 );
if ( ! $ambrygen_image_id && ! empty( $ambrygen_attributes['image'] ) ) {
	$ambrygen_image_id = attachment_url_to_postid( $ambrygen_attributes['image'] );
}

/* Overlay images */
$ambrygen_overlay_top_id    = absint( $ambrygen_attributes['overlayTopImageId'] ?? 0 );
$ambrygen_overlay_bottom_id = absint( $ambrygen_attributes['overlayBottomImageId'] ?? 0 );

$ambrygen_overlay_top_url    = $ambrygen_attributes['overlayTopImage']    ?? get_theme_file_uri( 'assets/src/images/news-latter/overlay-top.svg' );
$ambrygen_overlay_bottom_url = $ambrygen_attributes['overlayBottomImage'] ?? get_theme_file_uri( 'assets/src/images/news-latter/overlay-bottom.svg' );
?>

<div class="newsletter newsletter-signup" role="region" aria-labelledby="ambrygen-newsletter-heading">

	<!-- Image Section -->
	<div class="newsletter__image-block">

		<?php
		// Main image or placeholder
		if ( $ambrygen_image_id ) {
			echo Helper::image(
				$ambrygen_image_id,
				'large',
				array(
					'class'    => 'newsletter__img',
					'loading'  => 'lazy',
				)
			);
		} else {
			// Placeholder image
			echo '<div class="newsletter__img-placeholder">' . esc_html__( 'No newsletter image set', 'ambrygen-web' ) . '</div>';
		}
		?>

		<!-- Top overlay -->
		<?php if ( $ambrygen_overlay_top_id || $ambrygen_overlay_top_url ) : ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-top" aria-hidden="true">
				<?php
				if ( $ambrygen_overlay_top_id ) {
					echo Helper::image(
						$ambrygen_overlay_top_id,
						'full',
						array(
							'class'    => 'overlay__img',
							'loading'  => 'lazy',
							'alt' =>  ""
						)
					);
				} else {
					?>
					<img
						src="<?php echo esc_url( $ambrygen_overlay_top_url ); ?>"
						class="overlay__img"
						loading="lazy"
						decoding="async"
						alt=""

					/>
					<?php
				}
				?>
			</div>
		<?php endif; ?>

		<!-- Bottom overlay -->
		<?php if ( $ambrygen_overlay_bottom_id || $ambrygen_overlay_bottom_url ) : ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-bottom" aria-hidden="true">
				<?php
				if ( $ambrygen_overlay_bottom_id ) {
					echo Helper::image(
						$ambrygen_overlay_bottom_id,
						'full',
						array(
							'class'    => 'overlay__img',
							'loading'  => 'lazy',
							'decoding' => 'async',
							'alt' => ''
						)
					);
				} else {
					?>
					<img
						src="<?php echo esc_url( $ambrygen_overlay_bottom_url ); ?>"
						class="overlay__img"
						loading="lazy"
						decoding="async"
						alt=""
					/>
					<?php
				}
				?>
			</div>
		<?php endif; ?>

	</div>

	<!-- Content Section -->
	<div class="newsletter__content-block">

		<?php if ( $ambrygen_eyebrow ) : ?>
			<div class="newsletter__content-block__eyebrow-text eyebrow">
				<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s12" aria-hidden="true"></div>

		<?php if ( $ambrygen_heading ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
				id="ambrygen-newsletter-heading"
				class="newsletter__content-block__heading heading-3 mb-0"
			>
				<?php
				echo wp_kses(
										$ambrygen_heading,
										Helper::allowed_heading_html()
									);?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<div class="is-style-gl-s12" aria-hidden="true"></div>

		<?php if ( $ambrygen_description ) : ?>
			<div class="newsletter__content-block__description-text text-medium block-description">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<div class="newsletter-form-placeholder">
			<?php echo wp_kses_post( $ambrygen_content ); ?>
		</div>

	</div>
</div>
