<?php
/**
 * Render: Collaborators List Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param \WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$ambrygen_title    = isset( $attributes['title'] ) ? $attributes['title'] : 'Additional Collaborations';
$ambrygen_is_open  = isset( $attributes['isOpen'] ) ? (bool) $attributes['isOpen'] : true;
$ambrygen_block_id = isset( $attributes['anchor'] ) ? $attributes['anchor'] : 'collaborators-' . \wp_unique_id();
?>

<div class="collaborators-list" id="<?php echo \esc_attr( $ambrygen_block_id ); ?>" data-amb-open="<?php echo $ambrygen_is_open ? 'true' : 'false'; ?>">
	<button class="collaborators-list__header" aria-expanded="<?php echo $ambrygen_is_open ? 'true' : 'false'; ?>" aria-controls="<?php echo \esc_attr( $ambrygen_block_id . '-content' ); ?>">
		<span class="collaborators-list__title subtitle1-sbold">
			<?php echo \esc_html( $ambrygen_title ); ?>
		</span>
	</button>
	<div class="collaborators-list__content-wrapper" id="<?php echo \esc_attr( $ambrygen_block_id . '-content' ); ?>" style="<?php echo $ambrygen_is_open ? '' : 'display: none;'; ?>">
		<ul class="collaborators-list__items">
			<?php echo $content; ?>
		</ul>
	</div>
</div>
