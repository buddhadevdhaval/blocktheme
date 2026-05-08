<?php
/**
 * Render: Large Icon Grid
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

$ambrygen_attributes = is_array( $attributes ) ? $attributes : array();

$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_content     = trim( (string) $content );
$ambrygen_has_header  = ! empty( $ambrygen_heading ) || ! empty( $ambrygen_description );
$ambrygen_has_items   = '' !== $ambrygen_content;
$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( (string) $ambrygen_attributes['blockId'] )
	: '';

$ambrygen_bg_image    = is_array( $ambrygen_attributes['backgroundImage'] ?? null )
	? $ambrygen_attributes['backgroundImage']
	: array();
$ambrygen_bg_image_id = isset( $ambrygen_bg_image['id'] ) ? absint( $ambrygen_bg_image['id'] ) : 0;
$ambrygen_bg_url      = isset( $ambrygen_bg_image['url'] ) ? esc_url_raw( $ambrygen_bg_image['url'] ) : '';
$ambrygen_bg_alt      = isset( $ambrygen_bg_image['alt'] ) ? sanitize_text_field( $ambrygen_bg_image['alt'] ) : '';

$wrapper_args = array(
	'class' => 'block-layout icon-grid variation-grid-post style-large-icons',
);

if ( $ambrygen_block_id ) {
	$wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_main_attributes = get_block_wrapper_attributes( $wrapper_args );

?>

<div <?php echo $ambrygen_main_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_bg_image_id || $ambrygen_bg_url ) : ?>
		<div class="block-bg-image">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_bg_image_id,
				$ambrygen_bg_url,
				'full',
				array(
					'alt' => $ambrygen_bg_alt,
				)
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>
	<div class="icon-grid-block">
		<div class="info-list-block__header">
			<?php if ( ! empty( $ambrygen_heading ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<?php if ( ! empty( $ambrygen_heading ) ) : ?>
					<div class="is-style-gl-s20" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="info-list-block__intro subtitle-1-regular js-gsap-fade">
					<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
				</div>
			<?php endif; ?>
			</div>

		<?php if ( $ambrygen_has_header && $ambrygen_has_items ) : ?>
			<div class="is-style-gl-s64" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_items ) : ?>
			<div class="info-list__list info-list__row">
				<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>
	</div>
</div>
