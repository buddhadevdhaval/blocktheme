<?php
/**
 * Render: Two Column Icon Grid Block
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

$ambrygen_block_id    = $attributes['blockId'] ?? '';
$ambrygen_heading     = $attributes['heading'] ?? '';
$ambrygen_heading_tag = $attributes['headingTag'] ?? 'h2';
$ambrygen_description = $attributes['description'] ?? '';
$ambrygen_items       = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : array();
$ambrygen_text_allowed_html = array(
	'br'     => array(),
	'strong' => array(),
	'em'     => array(),
	'span'   => array(
		'class' => true,
	),
);

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
		? array(
			'class' => 'symptoms',
			'id'    => $ambrygen_block_id,
		)
		: array(
			'class' => 'symptoms',
		)
);
?>

<div <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?>>
	<div class="symptoms__grid">
		<div class="symptoms__left">
			<?php foreach ( $ambrygen_items as $ambrygen_item ) : ?>
				<?php
				$ambrygen_icon_id  = isset( $ambrygen_item['iconId'] ) ? absint( $ambrygen_item['iconId'] ) : 0;
				$ambrygen_icon_url = isset( $ambrygen_item['iconUrl'] ) ? esc_url( $ambrygen_item['iconUrl'] ) : '';
				$ambrygen_icon_alt = isset( $ambrygen_item['iconAlt'] ) ? sanitize_text_field( $ambrygen_item['iconAlt'] ) : '';
				$ambrygen_text     = isset( $ambrygen_item['text'] ) ? $ambrygen_item['text'] : '';
				$ambrygen_alt_fallback = trim( wp_strip_all_tags( str_replace( '<br>', ' ', $ambrygen_text ) ) );
				$ambrygen_icon_alt = $ambrygen_icon_alt ? $ambrygen_icon_alt : $ambrygen_alt_fallback;
				?>
				<div class="symptoms__item">
					<?php if ( $ambrygen_icon_id ) : ?>
						<?php
						echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							$ambrygen_icon_id,
							'full',
							array(
								'class'   => 'symptoms__icon',
								'alt'     => $ambrygen_icon_alt,
								'loading' => 'lazy',
							)
						);
						?>
					<?php elseif ( $ambrygen_icon_url ) : ?>
						<img src="<?php echo esc_url( $ambrygen_icon_url ); ?>" alt="<?php echo esc_attr( $ambrygen_icon_alt ); ?>" class="symptoms__icon" loading="lazy" />
					<?php endif; ?>

					<?php if ( $ambrygen_text ) : ?>
						<div class="symptoms__text">
							<?php echo wp_kses( $ambrygen_text, $ambrygen_text_allowed_html ); ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="symptoms__right">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo esc_html( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 symptoms__title">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<div class="is-style-gl-s12" aria-hidden="true"></div>

			<?php if ( $ambrygen_description ) : ?>
				<div class="subtitle1-regular symptoms__desc">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
