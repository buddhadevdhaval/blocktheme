<?php
/**
 * Render: Multimedia Assets Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes         = $attributes ?? array();
$ambrygen_heading            = $ambrygen_attributes['heading'] ?? '';
$ambrygen_block_id           = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_heading_tag        = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading_id         = $ambrygen_heading ? wp_unique_id( 'multimedia-assets-heading-' ) : '';

$wrapper_args = array(
	'class' => trim( 'block-layout multimedia-assets our-approach' ),
);

if ( $ambrygen_block_id ) {
	$wrapper_args['id'] = $ambrygen_block_id;
}

if ( $ambrygen_heading_id ) {
	$wrapper_args['role']            = 'region';
	$wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div class="our-approach__header block__rowflex is-vertical">

		<div class="block-title mb-0 block__rowflex--heading-title js-gsap-fade our-approach__header__left">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> id="<?php echo esc_attr( $ambrygen_heading_id ); ?>" class="heading-3 block-title mb-0 ">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>
		</div>

	</div>

	<?php if ( $ambrygen_heading ) : ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="our-approach__content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>

</div>
