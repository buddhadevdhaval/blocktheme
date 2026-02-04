<?php
/**
 * Render: Get In Touch Block
 *
 * @package ambrygen
 */

// Prefix all variables with theme/plugin name
$ambrygen_attributes    = $attributes ?? array();
$ambrygen_block_content = $block_content ?? '';

$ambrygen_title         = $ambrygen_attributes['title'] ?? 'Get in';
$ambrygen_highlight     = $ambrygen_attributes['highlightText'] ?? 'Touch';
$ambrygen_content       = $ambrygen_attributes['content'] ?? '';
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';

$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading_level    = in_array( $ambrygen_heading_level, $ambrygen_allowed_headings, true ) 
	? $ambrygen_heading_level 
	: 'h2';
?>

<div class="contact-form-block">

	<div class="heading-center center-align">
		<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="heading-3 block-title mb-0">
			<?php echo esc_html( $ambrygen_title ); ?>
			<span><?php echo esc_html( $ambrygen_highlight ); ?></span>
		</<?php echo tag_escape( $ambrygen_heading_level ); ?>>

		<div class="is-style-gl-s24"></div>

		<div class="heading-content text-md-regular">
			<?php echo wp_kses_post( wpautop( $ambrygen_content ) ); ?>
		</div>
	</div>

	<?php if ( ! empty( $ambrygen_block_content ) ) : ?>
		<div class="contact-form-block__form">
			<?php echo $ambrygen_block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	<?php endif; ?>

</div>
