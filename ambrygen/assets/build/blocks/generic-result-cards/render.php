<?php
/**
 * Render: Card Result Block
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
$ambrygen_block_id           = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_eyebrow            = isset( $ambrygen_attributes['eyebrowText'] ) ? $ambrygen_attributes['eyebrowText'] : '';
$ambrygen_heading            = isset( $ambrygen_attributes['heading'] ) ? $ambrygen_attributes['heading'] : '';
$ambrygen_heading_tag        = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_subtitle           = isset( $ambrygen_attributes['subtitle'] ) ? $ambrygen_attributes['subtitle'] : '';
$ambrygen_foot_content       = isset( $ambrygen_attributes['footContent'] ) ? $ambrygen_attributes['footContent'] : '';
$ambrygen_item_count         = 0;
$ambrygen_has_eyebrow        = '' !== trim( wp_strip_all_tags( $ambrygen_eyebrow ) );
$ambrygen_has_heading        = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );
$ambrygen_has_subtitle       = '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) );
$ambrygen_has_foot_content   = '' !== trim( wp_strip_all_tags( $ambrygen_foot_content ) );
$ambrygen_has_header_content = $ambrygen_has_eyebrow || $ambrygen_has_heading || $ambrygen_has_subtitle;
$ambrygen_heading_id         = $ambrygen_has_heading
	? ( $ambrygen_block_id ? $ambrygen_block_id . '-heading' : wp_unique_id( 'generic-result-cards-heading-' ) )
	: '';

if ( isset( $block->inner_blocks ) && is_array( $block->inner_blocks ) ) {
	foreach ( $block->inner_blocks as $ambrygen_inner_block ) {
		if (
			isset( $ambrygen_inner_block->name ) &&
			'ambrygen/generic-result-cards-item' === $ambrygen_inner_block->name
		) {
			++$ambrygen_item_count;
		}
	}
}

$ambrygen_wrapper_attributes_array = array(
	'class' => 'block-layout card-result-block',
	'role'  => 'region',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

if ( $ambrygen_has_heading ) {
	$ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_heading_id;
} else {
	$ambrygen_wrapper_attributes_array['aria-label'] = __( 'Generic result cards', 'ambrygen-web' );
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
$ambrygen_grid_class         = $ambrygen_item_count >= 4
	? 'principles-steps__grid col-4'
	: 'principles-steps__grid';
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="principles-steps">
		<div class="principles-steps__header text-center">
			<?php if ( $ambrygen_has_eyebrow ) : ?>
				<div class="overline-text principles-steps__eyebrow hero-kicker js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_eyebrow ); ?>
				</div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_eyebrow && $ambrygen_has_heading ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-4 block-title mb-0 principles-steps__title js-gsap-fade">
					<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>
			<?php if ( ( $ambrygen_has_eyebrow || $ambrygen_has_heading ) && $ambrygen_has_subtitle ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_subtitle ) : ?>
				<div class="block-description body1 principles-steps__subtitle js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
					<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( $ambrygen_has_header_content ) : ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
		<?php endif; ?>

		<div class="<?php echo esc_attr( $ambrygen_grid_class ); ?>" role="list">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

		<?php if ( $ambrygen_has_foot_content ) : ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
			<div class="foot-content text-center js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_foot_content ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
