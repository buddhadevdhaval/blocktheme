<?php
/**
 * Render template for the Genetic Testing Cards block.
 *
 * @package Ambrygen
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Access attributes safely with default values.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Block inner content.
 */
$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
$ambrygen_content    = isset( $content ) ? $content : '';

$ambrygen_section_title = isset( $ambrygen_attributes['sectionTitle'] )
	? $ambrygen_attributes['sectionTitle']
	: __( 'Why We’re <span>Different</span>', 'ambrygen-web' );

$ambrygen_heading_tag = isset( $ambrygen_attributes['headingTag'] )
	? $ambrygen_attributes['headingTag']
	: 'h2';

/**
 * Validate heading tag.
 */
$ambrygen_valid_heading_tags = array(
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'p',
	'div',
);

if ( ! in_array( $ambrygen_heading_tag, $ambrygen_valid_heading_tags, true ) ) {
	$ambrygen_heading_tag = 'h2';
}

/**
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'genetic-cards',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
		class="heading-2 mb-0 block-title"
	>
		<?php echo wp_kses_post( $ambrygen_section_title ); ?>
	</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>

	<div class="is-style-gl-s32"></div>

	<div class="genetic-cards__container">
		<?php
		// Inner blocks content is already escaped by the block renderer.
		echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>

</div>
