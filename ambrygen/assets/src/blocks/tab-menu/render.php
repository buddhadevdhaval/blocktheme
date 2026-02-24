<?php
/**
 * Server-side rendering for Secondary Sticky Tabs block
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
