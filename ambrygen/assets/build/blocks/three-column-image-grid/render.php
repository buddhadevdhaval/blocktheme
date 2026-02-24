<?php
/**
 * Render template for the Genetic Testing Cards block.
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
use Ambrygen\Theme\Core\Helper;

/**
 * Render callback for Three Column Image Grid block.
 */

$heading     = $attributes['heading'] ?? '';
$description = $attributes['description'] ?? '';

$block_id = $attributes['blockId'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id' => $block_id,
		'class' => 'our-approach',
	)
);


?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>

	<div class="our-approach__header block__rowflex">

		<?php if ( $heading ) : ?>
			<h2 class="block-title block__rowflex--heading-title heading-3 mb-0">
				<?php 	echo wp_kses(
			$heading,
			Helper::allowed_heading_html()
		); ?>
			</h2>
		<?php endif; ?>

		<?php if ( $description ) : ?>
			<div class="block__rowflex--block-content subtitle1-reg">
				<p><?php echo wp_kses_post( $description ); ?></p>
			</div>
		<?php endif; ?>

	</div>

	<div class="is-style-gl-s32" aria-hidden="true"></div>

	<div class="our-approach__content">
		<?php echo $content; ?>
	</div>

</div>
