<?php
/**
 * Render: Genetic Testing Cards Block
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

$ambrygen_section_title = isset( $ambrygen_attributes['sectionTitle'] )
	? $ambrygen_attributes['sectionTitle']
	: __( 'Why We’re Different', 'ambrygen-web' );

$ambrygen_heading_tag = isset( $ambrygen_attributes['headingTag'] )
	? $ambrygen_attributes['headingTag']
	: 'h2';

$ambrygen_valid_heading_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' );
if ( ! in_array( $ambrygen_heading_tag, $ambrygen_valid_heading_tags, true ) ) {
	$ambrygen_heading_tag = 'h2';
}

$ambrygen_wrapper_attributes_array = array(
	'class' => 'genetic-cards',
	'role'  => 'region',
);

if ( $ambrygen_section_title ) {
	$ambrygen_wrapper_attributes_array['aria-labelledby'] = 'genetic-cards-heading';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
		class="heading-3 mb-0 block-title"
		id="genetic-cards-heading"
	>
		<?php
		// Allow limited HTML for headings, e.g., <span> for styling.

		echo wp_kses(
			$ambrygen_section_title,
			Helper::allowed_heading_html()
		);
		?>
	</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="genetic-cards__container">
		<?php
		// Inner blocks content is already escaped by block renderer
		echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</div>
