<?php
/**
 * Render: Alongside Image Block
 *
 * @package ambrygen
 */

// Prefix all variables with theme/plugin name
$ambrygen_attributes    = $attributes ?? array();

$ambrygen_title         = ! empty( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : 'Our Locations';
$ambrygen_iframe        = ! empty( $ambrygen_attributes['iframe'] ) ? $ambrygen_attributes['iframe'] : '';
$ambrygen_heading_level = ! empty( $ambrygen_attributes['headingLevel'] ) ? $ambrygen_attributes['headingLevel'] : 'h2';
$ambrygen_locations     = ! empty( $ambrygen_attributes['locations'] ) ? $ambrygen_attributes['locations'] : array();

// Allowed inline formatting for RichText (text color, bold, italic)
$ambrygen_allowed_tags = array(
	'span' => array(
		'style' => true,
		'class' => true,
	),
	'strong' => array(),
	'em'     => array(),
);
?>

<div class="alongside-image-block">
	<div class="alongside-image-block__row">

		<!-- Map -->
		<div class="alongside-image-block__media">
			<div class="alongside-image-block__image">
				<?php if ( $ambrygen_iframe ) : ?>
					<iframe
						src="<?php echo esc_url( $ambrygen_iframe ); ?>"
						width="600"
						height="450"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade">
					</iframe>
				<?php else : ?>
					<div class="alongside-image-block__placeholder">
						<?php esc_html_e( 'No Map Provided', 'ambrygen-web' ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<!-- Content -->
		<div class="alongside-image-block__content">

			<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="alongside-image-block__title heading-2 mb-0">
				<?php echo wp_kses( $ambrygen_title, $ambrygen_allowed_tags ); ?>
			</<?php echo tag_escape( $ambrygen_heading_level ); ?>>

			<div class="alongside-image-block__text">
		<?php foreach ( $ambrygen_locations as $ambrygen_location ) : ?>
	<div class="location-list">
		<div class="location-title text-xl-semibold">
			<?php echo esc_html( $ambrygen_location['name'] ?? '' ); ?>
		</div>
		<div class="is-style-gl-s4"></div>
		<div class="text-medium">
			<?php echo esc_html( $ambrygen_location['address'] ?? '' ); ?>
		</div>
	</div>
<?php endforeach; ?>

			</div>

		</div>
	</div>
</div>
