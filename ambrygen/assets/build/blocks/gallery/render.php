<?php
/**
 * Render: Gallery Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_heading      = $attributes['heading'] ?? '';
$ambrygen_description  = $attributes['description'] ?? '';
$ambrygen_heading_tag  = $attributes['headingTag'] ?? 'h2';
$ambrygen_variation    = $attributes['variation'] ?? '';
$ambrygen_top_image_id = isset( $attributes['topImageID'] ) ? (int) $attributes['topImageID'] : 0;
$ambrygen_grid_columns = $attributes['gridColumns'] ?? '2';

/**
 * Auto-adjust grid columns based on number of items
 */
$inner_blocks = $block->inner_blocks ?? array();
$item_count = count( $inner_blocks );
$grid_map = array(
	1 => '1',
	2 => '2',
	3 => '3',
	4 => '4',
);
$ambrygen_grid_columns = $grid_map[ $item_count ] ?? '3';

/**
 * Set context for inner blocks
 */
$block->context['ambrygen/galleryGridColumns'] = $ambrygen_grid_columns;

/**
 * WCAG: Prevent empty content containers
 */
if ( empty( trim( $content ) ) ) {
	return;
}

/**
 * WCAG 2.1 AA: Heading tag validation (1.3.1)
 */
$allowed_heading_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading_tag = in_array( $ambrygen_heading_tag, $allowed_heading_tags, true )
	? $ambrygen_heading_tag
	: 'h2';
$tab_block_id = $attributes['blockId'] ?? '';
/**
 * WCAG: Prevent empty headings being announced
 */
if ( empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) ) {
	$ambrygen_heading = '';
}

/**
 * WCAG 2.1 AA: Accessible block labeling (2.4.6)
 */
$block_id = 'image-grid-' . wp_unique_id();

/**
 * Block wrapper attributes (no HTML change)
 */


$amb_class="";
if($ambrygen_variation === "variation-features" ||  $ambrygen_variation === "image-content-grid"){
	$amb_class="variation-team";
}else{
	$amb_class="";
}



$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'            => 'image-grid-block  block-' . sanitize_html_class( $ambrygen_variation ) .' '.$amb_class .' grid-column'.$ambrygen_grid_columns,
		'aria-labelledby'  => $ambrygen_heading ? esc_attr( $block_id ) : '',
		'id' => $tab_block_id,
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; ?>>
	<div class="get-started-block">

		<?php if ( 'image-content-grid' === $ambrygen_variation ) : ?>

		<div class="our-approach__header logo-title-section">
			<?php if ( $ambrygen_top_image_id ) : ?>

					<div class="logo-title-section__icon">
					<?php
					/**
					 * WCAG 1.1.1: Always provide alt text
					 */
					echo Helper::image(
						$ambrygen_top_image_id,
						'large',
						array(
							'class'   => 'logo-title-section__logo',
							'loading' => 'lazy',
							'alt'     => $ambrygen_heading
								? wp_strip_all_tags( $ambrygen_heading )
								: '',
						)
					);
					?>
					</div>
					<div class="is-style-gl-s50" aria-hidden="true"></div>

			<?php endif; ?>
			<div class="logo-title-section__content">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo esc_html( $ambrygen_heading_tag ); ?>
					class="heading-2 block-title mb-0"
					id="<?php echo esc_attr( $block_id ); ?>">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( $ambrygen_description ) : ?>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div class="body1-reg logo-title-section__description">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>
			</div>
			</div>

		<?php elseif ( 'variation-features' === $ambrygen_variation ) : ?>
			<div class="our-approach__header block__rowflex">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo esc_html( $ambrygen_heading_tag ); ?>
					class="block-title block__rowflex--heading-title heading-3 mb-0"
					id="<?php echo esc_attr( $block_id ); ?>">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( $ambrygen_description ) : ?>
				<div class="block__rowflex--block-content subtitle1-reg">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>

			</div>



		<?php elseif ( $ambrygen_heading ) : ?>

			<<?php echo esc_html( $ambrygen_heading_tag ); ?>
				class="block-title heading-3 mb-0"
				id="<?php echo esc_attr( $block_id ); ?>">
				<?php
				echo wp_kses(
					$ambrygen_heading,
					Helper::allowed_heading_html()
				);
				?>
			</<?php echo esc_html( $ambrygen_heading_tag ); ?>>

		<?php endif; ?>

		<div class="card-grid-block" role="list">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

	</div>
</div>
