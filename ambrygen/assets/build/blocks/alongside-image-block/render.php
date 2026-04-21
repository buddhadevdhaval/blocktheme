<?php
/**
 * Render: Alongside Image Block Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

// Prefix all variables with theme/plugin name.
$ambrygen_attributes = $attributes ?? array();

$ambrygen_block_id      = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title         = ! empty( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_iframe        = ! empty( $ambrygen_attributes['iframe'] ) ? $ambrygen_attributes['iframe'] : '';
$ambrygen_heading_level = ! empty( $ambrygen_attributes['headingLevel'] ) ? $ambrygen_attributes['headingLevel'] : 'h2';
$ambrygen_heading_tag   = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_locations = ! empty( $ambrygen_attributes['locations'] ) ? $ambrygen_attributes['locations'] : array();
$ambrygen_locations = array_values(
	array_filter(
		$ambrygen_locations,
		static function ( $ambrygen_location ) {
			return ! empty( $ambrygen_location['name'] )
				&& ! empty( $ambrygen_location['address'] );
		}
	)
);

$ambrygen_iframe_scheme   = wp_parse_url( $ambrygen_iframe, PHP_URL_SCHEME );
$ambrygen_iframe_is_https = ( 'https' === strtolower( (string) $ambrygen_iframe_scheme ) );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
		? array(
			'class' => 'alongside-image-block',
			'id'    => $ambrygen_block_id,
		)
		: array(
			'class' => 'alongside-image-block',
		)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="alongside-image-block__row">

		<!-- Map -->
		<div class="alongside-image-block__media js-gsap-fade" role="region" aria-label="<?php esc_attr_e( 'Interactive Map', 'ambrygen-web' ); ?>">
			<div class="alongside-image-block__image">
				<?php if ( $ambrygen_iframe && $ambrygen_iframe_is_https ) : ?>
					<iframe
						src="<?php echo esc_url( $ambrygen_iframe ); ?>"
						width="600"
						height="450"
						title="<?php esc_attr_e( 'Google Map Preview', 'ambrygen-web' ); ?>"
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
		<div class="alongside-image-block__content js-gsap-fade">

		<?php if ( ! empty( $ambrygen_title ) ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="alongside-image-block__title heading-2 mb-0">
				<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( ! empty( $ambrygen_locations ) ) : ?>
			<div class="alongside-image-block__text">
				<?php foreach ( $ambrygen_locations as $ambrygen_location ) : ?>
					<dl class="location-list">
						<dt class="location-title text-xl-semibold">
							<?php echo wp_kses_post( $ambrygen_location['name'] ); ?>
						</dt>
						<div class="is-style-gl-s4" aria-hidden="true"></div>
						<dd class="location-description text-medium">
							<?php echo wp_kses_post( $ambrygen_location['address'] ); ?>
						</dd>
					</dl>
				<?php endforeach; ?>

			</div>
			<?php endif; ?>

		</div>
	</div>
</div>
