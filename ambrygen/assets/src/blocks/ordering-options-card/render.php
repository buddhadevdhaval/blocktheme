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
$ambrygen_copy_html  = '';
$ambrygen_cta_html   = '';
$ambrygen_blocks     = parse_blocks( $content );

foreach ( $ambrygen_blocks as $ambrygen_block ) {
	$ambrygen_block_name = $ambrygen_block['blockName'] ?? '';
	$ambrygen_block_html = render_block( $ambrygen_block );

	if ( ! trim( $ambrygen_block_html ) ) {
		continue;
	}

	if ( in_array( $ambrygen_block_name, array( 'core/buttons', 'core/button' ), true ) ) {
		$ambrygen_cta_html .= $ambrygen_block_html;
		continue;
	}

	$ambrygen_copy_html .= $ambrygen_block_html;
}

$ambrygen_copy_html = trim( $ambrygen_copy_html );
$ambrygen_cta_html  = trim( $ambrygen_cta_html );

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

		<?php if ( $ambrygen_cta_html ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php echo $ambrygen_cta_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is rendered by WordPress. ?>
		<?php endif; ?>
	</div>
</div>
