<?php
/**
 * Render: CTA Tiles with 3 Card Block
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

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
$ambrygen_content    = isset( $content ) ? $content : '';
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';

$ambrygen_section_title = isset( $ambrygen_attributes['sectionTitle'] )
	? $ambrygen_attributes['sectionTitle']
	: '';

$ambrygen_heading_tag_default = isset( $block->block_type->attributes['headingTag']['default'] )
	? $block->block_type->attributes['headingTag']['default']
	: 'h2';
$ambrygen_heading_level       = Helper::get_heading_tag(
	$ambrygen_attributes['headingTag'] ?? $ambrygen_heading_tag_default,
	$ambrygen_heading_tag_default
);
$ambrygen_heading_id          = $ambrygen_block_id
	? $ambrygen_block_id . '-heading'
	: wp_unique_id( 'cta-tiles-with-3-card-heading-' );

if ( empty( trim( wp_strip_all_tags( $ambrygen_section_title ) ) ) ) {
	$ambrygen_section_title = '';
}

$ambrygen_wrapper_attributes_array = array(
	'class' => 'cta-tiles-with-3-card',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

if ( $ambrygen_section_title ) {
	$ambrygen_wrapper_attributes_array['role']            = 'region';
	$ambrygen_wrapper_attributes_array['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( $ambrygen_section_title ) : ?>
		<<?php echo tag_escape( $ambrygen_heading_level ); ?>
			class="heading-3 mb-0 block-title js-gsap-fade"
			id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
		>
			<?php
			echo wp_kses(
				$ambrygen_section_title,
				Helper::allowed_heading_html()
			);
			?>
		</<?php echo tag_escape( $ambrygen_heading_level ); ?>>

		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="cta-tiles-with-3-card__container" role="list">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core.
		echo $ambrygen_content;
		?>
	</div>

</div>
