<?php
/**
 * Render: Multimedia Member Block.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_member_title       = $attributes['title'] ?? '';
$ambrygen_member_block_id    = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_member_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_has_member_title   = '' !== trim( wp_strip_all_tags( (string) $ambrygen_member_title ) );
$ambrygen_member_heading_tag = Helper::get_heading_tag( (string) $ambrygen_member_heading_tag, 'h2' );

$ambrygen_wrapper_args = array(
	'class' => 'multimedia-member',
);

if ( '' !== $ambrygen_member_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_member_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_has_member_title ) : ?>
		<div class="features-media__header block__rowflex">
			<<?php echo tag_escape( $ambrygen_member_heading_tag ); ?> class="block-title block__rowflex--heading-title heading-2 mb-0 js-gsap-fade">
				<?php echo wp_kses( $ambrygen_member_title, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_member_heading_tag ); ?>>
		</div>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="multimedia-member__items">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
	</div>
</div>
