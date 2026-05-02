<?php
/**
 * Render: Supporting Image Block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? array();

$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_anchor      = isset( $ambrygen_attributes['anchor'] )
	? sanitize_html_class( $ambrygen_attributes['anchor'] )
	: '';
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_image_id    = isset( $ambrygen_attributes['imageId'] ) ? absint( $ambrygen_attributes['imageId'] ) : 0;
$ambrygen_image_url   = isset( $ambrygen_attributes['imageUrl'] ) ? (string) $ambrygen_attributes['imageUrl'] : '';
$ambrygen_image_alt   = isset( $ambrygen_attributes['imageAlt'] ) ? sanitize_text_field( $ambrygen_attributes['imageAlt'] ) : '';

$ambrygen_has_image   = $ambrygen_image_id || $ambrygen_image_url;
$ambrygen_has_content = $ambrygen_heading || $ambrygen_description;

if ( ! $ambrygen_has_image && ! $ambrygen_has_content ) {
	return;
}

$ambrygen_wrapper_args = array(
	'class' => 'supporting-image',
);

if ( $ambrygen_anchor || $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_anchor ?: $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<?php if ( $ambrygen_has_image ) : ?>
		<div class="supporting-image__chart-card">
			<div class="supporting-image__chart-image">
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
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_content ) : ?>
		<div class="supporting-image__content">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 supporting-image__heading">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( $ambrygen_description ) : ?>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div class="subtitle1-regular supporting-image__description block-description">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>
