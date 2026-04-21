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

$ambrygen_block_id      = $attributes['blockId'] ?? '';
$ambrygen_tabs          = $attributes['tabs'] ?? array();
$ambrygen_scroll_offset = 250;
$ambrygen_tab_behavior  = $attributes['tabBehavior'] ?? 'tab-mode';

if ( ! is_array( $ambrygen_tabs ) ) {
	$ambrygen_tabs = array();
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'             => 'secondary-sticky-tabs ',
		'id'                => $ambrygen_block_id,
		'data-offset'       => (string) $ambrygen_scroll_offset,
		'data-tab-behavior' => in_array( $ambrygen_tab_behavior, array( 'scroll', 'tab-mode' ), true ) ? $ambrygen_tab_behavior : 'tab-mode',
	)
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
	<div class="horizontal-tabs">
			<?php foreach ( $ambrygen_tabs as $index => $tab_item ) : ?>
				<?php
				$label       = $tab_item['label'] ?? '';
				$target      = $tab_item['targetId'] ?? '';
				$is_active   = ! empty( $tab_item['isActive'] );
				$button_text = $label ? $label : $target;
				?>
				<button
					type="button"
					class="tab-button tab-menu-section__tab<?php echo $is_active ? ' active' : ''; ?>"
					data-scroll-target="<?php echo esc_attr( $target ); ?>"
				>
					<?php echo esc_html( $button_text ); ?>
				</button>
			<?php endforeach; ?>
	</div>
</div>
