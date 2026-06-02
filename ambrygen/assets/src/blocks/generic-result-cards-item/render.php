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

$ambrygen_attributes         = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_title              = isset( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_heading_tag        = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h3', 'h3' );
$ambrygen_summary            = isset( $ambrygen_attributes['summary'] ) ? $ambrygen_attributes['summary'] : '';
$ambrygen_inner_content      = trim( (string) $content );
$ambrygen_inner_content_text = trim(
	html_entity_decode(
		wp_strip_all_tags( $ambrygen_inner_content ),
		ENT_QUOTES,
		'UTF-8'
	)
);
$ambrygen_image_url          = isset( $ambrygen_attributes['imageUrl'] ) ? (string) $ambrygen_attributes['imageUrl'] : '';
$ambrygen_image_id           = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_alt          = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';
$ambrygen_variant            = isset( $ambrygen_attributes['cardVariant'] ) ? $ambrygen_attributes['cardVariant'] : 'card-bg-green';
$ambrygen_variant            = in_array( $ambrygen_variant, array( 'card-bg-green', 'card-bg-pink', 'card-bg-yellow', 'card-bg-purple' ), true ) ? $ambrygen_variant : 'card-bg-green';
$ambrygen_has_image          = $ambrygen_image_id || '' !== $ambrygen_image_url;
$ambrygen_has_title          = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_summary        = '' !== trim( wp_strip_all_tags( $ambrygen_summary ) );
$ambrygen_has_description    = '' !== $ambrygen_inner_content_text;

if ( ! $ambrygen_has_image && ! $ambrygen_has_title && ! $ambrygen_has_summary && ! $ambrygen_has_description ) {
	return '';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'principles-steps__card  js-gsap-fade principles-steps__card--' . sanitize_html_class( $ambrygen_variant ),
		'role'  => 'listitem',
	)
);
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> >
	<?php if ( $ambrygen_has_image ) : ?>
		<div class="principles-steps__card-icon">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_image_id,
				$ambrygen_image_url,
				'full',
				array(
					'alt'     => $ambrygen_image_alt,
					'loading' => 'lazy',
				)
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
		<div class="is-style-gl-s20" aria-hidden="true"></div>
	<?php endif; ?>
	<div class="principles-steps__card-content">
		<?php if ( $ambrygen_has_title ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-5 principles-steps__card-title mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>
		<?php if ( $ambrygen_has_title && $ambrygen_has_summary ) : ?>
			<div class="is-style-gl-s8" aria-hidden="true"></div>
		<?php endif; ?>
		<?php if ( $ambrygen_has_summary ) : ?>
			<div class="body1-sbold principles-steps__card-summary">
				<?php echo wp_kses_post( $ambrygen_summary ); ?>
			</div>
		<?php endif; ?>
		<?php if ( $ambrygen_has_summary && $ambrygen_has_description ) : ?>
			<div class="is-style-gl-s16" aria-hidden="true"></div>
		<?php endif; ?>
		<?php if ( '' !== $ambrygen_inner_content_text ) : ?>
			<div class="principles-steps__card-description">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>
	</div>
</div>
