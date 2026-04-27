<?php
/**
 * Render: Link List Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_block_id     = $attributes['blockId'] ?? '';
$ambrygen_kicker      = $attributes['kicker'] ?? '';
$ambrygen_title       = $attributes['title'] ?? '';
$ambrygen_heading_tag = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_inner_content = trim( (string) $content );

$ambrygen_slot_blocks = array(
	'content' => array(),
	'items'   => array(),
);

$ambrygen_has_slots = false;

if ( isset( $block ) && $block instanceof WP_Block && ! empty( $block->parsed_block['innerBlocks'] ) ) {
	foreach ( $block->parsed_block['innerBlocks'] as $inner_block ) {
		$slot = $inner_block['attrs']['__experimentalSlotName'] ?? '';
		$block_name = $inner_block['blockName'] ?? '';

		if ( ! $slot ) {
			if ( in_array( $block_name, array( 'core/paragraph', 'core/buttons', 'core/button' ), true ) ) {
				$slot = 'content';
			} else {
				$slot = 'items';
			}
		}

		if ( $slot ) {
			$ambrygen_has_slots = true;
		}

		if ( $slot && isset( $ambrygen_slot_blocks[ $slot ] ) ) {
			$ambrygen_slot_blocks[ $slot ][] = $inner_block;
		} else {
			$ambrygen_slot_blocks['items'][] = $inner_block;
		}
	}
}

/**
 * Render a list of parsed blocks.
 *
 * @param array $blocks Parsed blocks.
 * @return string
 */
$ambrygen_render_blocks = static function ( array $blocks ): string {
	if ( empty( $blocks ) ) {
		return '';
	}

	$output = '';
	foreach ( $blocks as $parsed ) {
		$output .= render_block( $parsed );
	}

	return $output;
};

$wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
	? array(
		'class' => 'download-list',
		'id'    => $ambrygen_block_id,
	)
	: array(
		'class' => 'download-list',
	)
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
<div class="download-list__inner">	
<div class="download-list__header-area mb-24">
		<?php if ( $ambrygen_kicker ) : ?>
			<div class="download-list__kicker hero-kicker">
				<?php echo wp_kses_post( $ambrygen_kicker ); ?>
			</div>
		<?php endif; ?>
		
		<div class="is-style-gl-s12" aria-hidden="true"></div>
		<div class="download-list__content">
		<?php if ( $ambrygen_title ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="download-list__title heading-3 block-title mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
		<?php endif; ?>

		<?php
		$ambrygen_content_html = $ambrygen_has_slots ? $ambrygen_render_blocks( $ambrygen_slot_blocks['content'] ) : '';
		if ( $ambrygen_content_html ) {
			echo $ambrygen_content_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		?>
		</div>
	</div>
<div class='download-list__items'>
	<?php
	if ( $ambrygen_has_slots ) {
		$ambrygen_items_html = $ambrygen_render_blocks( $ambrygen_slot_blocks['items'] );
		if ( $ambrygen_items_html ) {
			echo $ambrygen_items_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	} elseif ( $ambrygen_inner_content ) {
		// Back-compat: before slots existed, everything rendered as items.
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>
	</div>
</div>
</div>
