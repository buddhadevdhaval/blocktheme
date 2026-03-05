<?php
/**
 * Render: Get In Touch Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

// Prefix all variables with theme/plugin name
$ambrygen_attributes    = $attributes ?? array();
$ambrygen_block_content = $block_content ?? '';

$ambrygen_title         = $ambrygen_attributes['title'] ?? '';
$ambrygen_content       = $ambrygen_attributes['content'] ?? '';
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';

$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading_level    = in_array( $ambrygen_heading_level, $ambrygen_allowed_headings, true )
	? $ambrygen_heading_level
	: 'h2';

$ambrygen_heading_id         = wp_unique_id( 'contact-heading-' );
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'contact-form-block' )
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div class="heading-center center-align">
		<?php if ( $ambrygen_title ) : ?>
			<<?php echo esc_attr( $ambrygen_heading_level ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-3 block-title mb-0">
				<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
			</<?php echo esc_attr( $ambrygen_heading_level ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_content ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<div class="heading-content text-md-regular">
				<?php echo wp_kses_post( $ambrygen_content ); ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( ! empty( $ambrygen_block_content ) ) : ?>
		<section class="contact-form-block__form"
			<?php if ( $ambrygen_title ) : ?>
				aria-labelledby="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
			<?php else : ?>
				aria-label="<?php echo esc_attr__( 'Contact Form', 'ambrygen-web' ); ?>"
			<?php endif; ?>
		>
			<?php echo $ambrygen_block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</section>
	<?php endif; ?>

</div>
