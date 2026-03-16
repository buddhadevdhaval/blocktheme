<?php
/**
 * Render: Tab Menu Section Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$ambrygen_block_id     = $attributes['blockId'] ?? '';
$ambrygen_tabs         = $attributes['tabs'] ?? array();
$ambrygen_scroll_offset = isset( $attributes['scrollOffset'] ) ? (int) $attributes['scrollOffset'] : 250;
$ambrygen_sticky       = ! empty( $attributes['enableSticky'] );

if ( ! is_array( $ambrygen_tabs ) ) {
	$ambrygen_tabs = array();
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'           => 'tab-menu-section',
		'id'              => $ambrygen_block_id,
		'data-offset'     => (string) $ambrygen_scroll_offset,
		'data-is-sticky'  => $ambrygen_sticky ? 'true' : 'false',
	)
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
	<div class="tab-menu-section__inner">
		<div class="tab-menu-section__tabs" role="tablist">
			<?php foreach ( $ambrygen_tabs as $index => $tab ) : ?>
				<?php
				$label    = $tab['label'] ?? '';
				$target   = $tab['targetId'] ?? '';
				$is_active = ! empty( $tab['isActive'] );
				$button_text = $label ? $label : $target;
				?>
				<button
					type="button"
					class="tab-menu-section__tab<?php echo $is_active ? ' active' : ''; ?>"
					data-scroll-target="<?php echo esc_attr( $target ); ?>"
				>
					<?php echo esc_html( $button_text ); ?>
				</button>
			<?php endforeach; ?>
		</div>
	</div>
</div>
