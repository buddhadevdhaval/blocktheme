<?php
/**
 * Render callback for Flexible Content block.
 *
 * @package Ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
use Ambrygen\Theme\Core\Helper;

/*
 * Block attributes.
 */
$ambrygen_heading           = $attributes['heading'] ?? '';
$ambrygen_heading_tag       = $attributes['headingTag'] ?? 'h2';
$ambrygen_content           = $attributes['content'] ?? '';
$ambrygen_image_id          = (int) ( $attributes['imageId'] ?? 0 );
$ambrygen_image_alt         = $attributes['imageAlt'] ?? '';
$ambrygen_image_position    = $attributes['imagePosition'] ?? 'left';
$ambrygen_layout_style      = $attributes['layoutStyle'] ?? '';
$ambrygen_image_size        = $attributes['imageSize'] ?? 'medium';
$ambrygen_content_alignment = $attributes['contentAlignment'] ?? 'left';
$ambrygen_links             = $attributes['links'] ?? array();
$ambrygen_buttons = array();



for ( $i = 1; $i <= 2; $i++ ) {
	$text    = $attributes[ "button{$i}Text" ] ?? '';
	$url     = $attributes[ "button{$i}Url" ] ?? '';
	$new_tab = ! empty( $attributes[ "button{$i}NewTab" ] );

	if ( $text && $url ) {
		$ambrygen_buttons[] = array(
			'text'    => $text,
			'url'     => $url,
			'new_tab' => $new_tab,
		);
	}
}
/*
 * Image size mapping.
 */
$ambrygen_image_size_map = array(
	'small'  => 'medium',
	'medium' => 'large',
	'large'  => 'full',
	'full'   => 'full',
);

$ambrygen_render_image_size =
	$ambrygen_image_size_map[ $ambrygen_image_size ] ?? 'large';

/*
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => trim(
			'iot-block ' .
			$ambrygen_image_position
		),
	)
);
?>

<div <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?>>
			<div class="iot-block__image">

			<?php
				echo Helper::image_with_placeholder(
					$ambrygen_image_id,
					'full',
					array(
						'class' => 'iot-block__img',
					)
				);
				?>
			</div>

	<div class="iot-block__content">
		<div class="iot-block__text">
			<?php if ( $ambrygen_heading ) : ?>
				<<?php echo esc_html( $ambrygen_heading_tag ); ?> class="heading-2 block-title mb-0">
					<?php echo wp_kses_post( $ambrygen_heading ); ?>
				</<?php echo esc_html( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>
			<div class="is-style-gl-s20" aria-hidden="true"></div>
			<?php if ( $ambrygen_content ) : ?>
				<div class="body1 iot-block__description">
					<?php echo wp_kses_post( $ambrygen_content ); ?>
				</div>
			<?php endif; ?>
	</div>
	<div class="is-style-gl-s24" aria-hidden="true"></div>

<?php if ( ! empty( $attributes['buttons'] ) ) : ?>
			<div class="iot-block__button">
				<?php foreach ( $attributes['buttons'] as $button ) : ?>
					<?php if ( ! empty( $button['text'] ) && ! empty( $button['url'] ) ) : ?>
						<a
							class="is-style-site-trailing-icon site-btn <?php echo esc_attr( $button['variant'] ); ?>"
							href="<?php echo esc_url( $button['url'] ); ?>"
						>
							<?php echo esc_html( $button['text'] ); ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		</div>



</div>
