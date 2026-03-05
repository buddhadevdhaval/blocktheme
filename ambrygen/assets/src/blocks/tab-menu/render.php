<?php
/**
 * Render: Tab Menu Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
$block_id = $attributes['blockId'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'secondary-sticky-tabs',
		'id'    => $block_id,
	)
);


?>

<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="horizontal-tabs" role="tablist">
		<?php echo wp_kses_post( $content ); ?>
	</div>
</div>
