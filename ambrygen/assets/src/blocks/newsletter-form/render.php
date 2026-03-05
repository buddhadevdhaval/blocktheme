<?php
/**
 * Render: Newsletter Form Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

/** @var array<string, mixed> $ambrygen_attributes */
$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
/** @var string $ambrygen_content */
$ambrygen_content = $content ?? '';

// Text content.
$ambrygen_eyebrow     = $ambrygen_attributes['eyebrow'] ?? '';
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag = $ambrygen_attributes['headingTag'] ?? 'h2';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

// Validate heading tag.
$ambrygen_allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
if ( ! in_array( $ambrygen_heading_tag, $ambrygen_allowed_tags, true ) ) {
	$ambrygen_heading_tag = 'h2';
}

// Main image handling.
$ambrygen_image_id = absint( $ambrygen_attributes['imageId'] ?? 0 );

// Overlay images.
$ambrygen_overlay_top_id    = absint( $ambrygen_attributes['overlayTopImageId'] ?? 0 );
$ambrygen_overlay_bottom_id = absint( $ambrygen_attributes['overlayBottomImageId'] ?? 0 );

$ambrygen_overlay_top_url    = $ambrygen_attributes['overlayTopImage'] ?? '';
$ambrygen_overlay_bottom_url = $ambrygen_attributes['overlayBottomImage'] ?? '';
$ambrygen_heading_id         = wp_unique_id( 'ambrygen-newsletter-heading-' );

$ambrygen_wrapper_args = array(
	'class' => 'newsletter newsletter-signup',
	'role'  => 'region',
);

if ( $ambrygen_heading ) {
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
} else {
	$ambrygen_wrapper_args['aria-label'] = __( 'Newsletter Form', 'ambrygen-web' );
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<!-- Image Section -->
	<div class="newsletter__image-block">

		<?php
		// Main image or placeholder
		echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$ambrygen_image_id,
			'large',
			array(
				'class'   => 'newsletter__img',
				'loading' => 'lazy',
			)
		);
		?>

		<!-- Top overlay -->
		<?php if ( $ambrygen_overlay_top_id || $ambrygen_overlay_top_url ) : ?>
			<div class="newsletter__image-block__overlay newsletter__image-block__overlay-top" aria-hidden="true">
				<?php
				if ( $ambrygen_overlay_top_id ) {
					echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						$ambrygen_overlay_top_id,
						'full',
						array(
							'class'   => 'overlay__img',
							'loading' => 'lazy',
						)
					);
				} else {
					?>
					<img
						src="<?php echo esc_url( $ambrygen_overlay_top_url ); ?>"
						class="overlay__img"
						loading="lazy"
						alt="<?php esc_attr_e( 'Top image', 'ambrygen-web' ); ?>"
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
					echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						$ambrygen_overlay_bottom_id,
						'full',
						array(
							'class'    => 'overlay__img',
							'loading'  => 'lazy',
							'decoding' => 'async',
						)
					);
				} else {
					?>
					<img
						src="<?php echo esc_url( $ambrygen_overlay_bottom_url ); ?>"
						class="overlay__img"
						loading="lazy"
						decoding="async"
						alt="<?php esc_attr_e( 'Bottom image', 'ambrygen-web' ); ?>"
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

		<?php if ( $ambrygen_heading ) : ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
				id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
				class="newsletter__content-block__heading heading-3 mb-0"
			>
				<?php
				echo wp_kses(
					$ambrygen_heading,
					Helper::allowed_heading_html()
				);
				?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_description ) : ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<div class="newsletter__content-block__description-text text-medium block-description">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_content ) : ?>
		<div class="newsletter-form-placeholder">
			<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php endif; ?>
	</div>
</div>
