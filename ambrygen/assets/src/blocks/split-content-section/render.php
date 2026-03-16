<?php
/**
 * Render: heading Content Section Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined('ABSPATH') || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? array();

$ambrygen_title       = $ambrygen_attributes['title'] ?? '';
$ambrygen_title_tag   = $ambrygen_attributes['titleTag'] ?? 'h2';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';

$ambrygen_allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_title_tag    = in_array( $ambrygen_title_tag, $ambrygen_allowed_tags, true )
	? $ambrygen_title_tag
	: 'h2';

$ambrygen_background_image_id  = isset( $ambrygen_attributes['backgroundImageId'] ) ? absint( $ambrygen_attributes['backgroundImageId'] ) : 0;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'heading-content-section wp-block-ambrygen-split-content-section',
	)
);
?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>
	<?php if ( $ambrygen_background_image_id ): ?>
		<div class="block-bg-image">
			<?php
			echo wp_kses_post(
				Helper::image(
					$ambrygen_background_image_id,
					'medium'
				)
			);
			?>
		</div>
	<?php endif; ?>
	<div class="heading-content-section__inner block__rowflex">
		<?php if ( ! empty( $ambrygen_title ) ): ?>
			<<?php echo esc_attr( $ambrygen_title_tag ); ?> class="heading-content-section__title heading-3 block-title mb-0 block__rowflex--heading-title">
				<?php
				echo wp_kses(
					$ambrygen_title,
					Helper::allowed_heading_html()
				);
				?>
			</<?php echo esc_attr( $ambrygen_title_tag ); ?>>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_description ) ): ?>
			<div class="heading-content-section__description block__rowflex--block-content block-description">
				<?php echo wp_kses_post( $ambrygen_description ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
