<?php
/**
 * Render: Card Result Block Item
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes  = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_title       = isset( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h3', 'h3' );
$ambrygen_summary     = isset( $ambrygen_attributes['summary'] ) ? $ambrygen_attributes['summary'] : '';
$ambrygen_description = isset( $ambrygen_attributes['description'] ) ? $ambrygen_attributes['description'] : '';
$ambrygen_inner_content = trim( (string) $content );
$ambrygen_image_url   = isset( $ambrygen_attributes['imageUrl'] ) ? $ambrygen_attributes['imageUrl'] : '';
$ambrygen_image_id    = isset( $ambrygen_attributes['imageId'] ) ? (int) $ambrygen_attributes['imageId'] : 0;
$ambrygen_image_alt   = isset( $ambrygen_attributes['imageAlt'] ) ? $ambrygen_attributes['imageAlt'] : '';
$ambrygen_variant     = isset( $ambrygen_attributes['cardVariant'] ) ? $ambrygen_attributes['cardVariant'] : 'card-bg-green';
$ambrygen_variant     = in_array( $ambrygen_variant, array( 'card-bg-green', 'card-bg-pink', 'card-bg-yellow', 'card-bg-purple' ), true ) ? $ambrygen_variant : 'card-bg-green';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'principles-steps__card principles-steps__card--' . sanitize_html_class( $ambrygen_variant ),
	)
);
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> >
	<?php if ( $ambrygen_image_id || $ambrygen_image_url ) : ?>
		<div class="principles-steps__card-icon">
			<?php if ( $ambrygen_image_id ) : ?>
				<?php
				echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image() returns sanitized image markup.
					$ambrygen_image_id,
					'full',
					array(
						'alt'     => esc_attr( $ambrygen_image_alt ),
						'loading' => 'lazy',
					)
				);
				?>
			<?php elseif ( $ambrygen_image_url ) : ?>
				<img src="<?php echo esc_url( $ambrygen_image_url ); ?>" alt="<?php echo esc_attr( $ambrygen_image_alt ); ?>" loading="lazy" />
			<?php endif; ?>
		</div>
		<div class="is-style-gl-s20" aria-hidden="true"></div>
	<?php endif; ?>
	<div class="principles-steps__card-content">
		<?php if ( '' !== $ambrygen_title ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-5 principles-steps__card-title mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<div class="is-style-gl-s8" aria-hidden="true"></div>
		<?php endif; ?>
		<?php if ( '' !== $ambrygen_summary ) : ?>
			<div class="body1-sbold principles-steps__card-summary">
				<?php echo wp_kses_post( $ambrygen_summary ); ?>
			</div>
			<div class="is-style-gl-s16" aria-hidden="true"></div>
		<?php endif; ?>
		<?php if ( '' !== $ambrygen_inner_content ) : ?>
			<div class="principles-steps__card-description">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php elseif ( '' !== $ambrygen_description ) : ?>
			<div class="body1 principles-steps__card-description">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
