<?php
/**
 * Server-side rendering for icon-grids parent block
 *
 * @package ambrygen
 */

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => '' )
);

$ambrygen_content = $content ?? '';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="info-list__row">
		<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>
