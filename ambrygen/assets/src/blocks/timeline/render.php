<?php
/**
 * Render: Timeline Block
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes  = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_anchor      = isset( $ambrygen_attributes['anchor'] )
	? sanitize_html_class( (string) $ambrygen_attributes['anchor'] )
	: '';
$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( (string) $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_wrapper_id  = $ambrygen_anchor ?: $ambrygen_block_id;

$ambrygen_wrapper_args = array(
	'class' => 'block-layout timeline-block',
);

if ( $ambrygen_wrapper_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_wrapper_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="timeline-block__header">
		<?php if ( $ambrygen_title ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-3 block-title mb-0 js-gsap-fade">
				<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php if ( $ambrygen_description ) : ?>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<div class="text-md-regular block-description js-gsap-fade">
				<?php echo wp_kses_post( wpautop( $ambrygen_description ) ); ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( trim( $content ) ) : ?>
		<div class="is-style-gl-s24" aria-hidden="true"></div>
		<div class="timeline-block__items">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	<?php endif; ?>
</div>
