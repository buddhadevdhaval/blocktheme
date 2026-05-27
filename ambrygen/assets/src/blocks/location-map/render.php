<?php
/**
 * Render: Location Map Block
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

$ambrygen_default_iframe_src = 'https://maps.google.com/maps?q=Washington%20DC%2C%20USA&z=15&output=embed';
$ambrygen_anchor        = isset( $ambrygen_attributes['anchor'] ) ? sanitize_html_class( (string) $ambrygen_attributes['anchor'] ) : '';
$ambrygen_block_id      = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( (string) $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title         = ! empty( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_iframe        = ! empty( $ambrygen_attributes['iframe'] ) ? trim( (string) $ambrygen_attributes['iframe'] ) : $ambrygen_default_iframe_src;
$ambrygen_heading_level = ! empty( $ambrygen_attributes['headingLevel'] ) ? $ambrygen_attributes['headingLevel'] : 'h2';
$ambrygen_heading_tag   = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );
$ambrygen_wrapper_id    = $ambrygen_anchor ?: $ambrygen_block_id;

$ambrygen_locations = ! empty( $ambrygen_attributes['locations'] ) ? $ambrygen_attributes['locations'] : array();
$ambrygen_locations = array_values(
	array_filter(
		array_map(
			static function ( $ambrygen_location ) {
				return array(
					'name'    => isset( $ambrygen_location['name'] ) ? sanitize_text_field( (string) $ambrygen_location['name'] ) : '',
					'address' => isset( $ambrygen_location['address'] ) ? sanitize_text_field( (string) $ambrygen_location['address'] ) : '',
				);
			},
			$ambrygen_locations
		),
		static function ( $ambrygen_location ) {
			$ambrygen_name    = isset( $ambrygen_location['name'] ) ? trim( $ambrygen_location['name'] ) : '';
			$ambrygen_address = isset( $ambrygen_location['address'] ) ? trim( $ambrygen_location['address'] ) : '';

			return '' !== $ambrygen_name
				|| '' !== $ambrygen_address;
		}
	)
);

$ambrygen_iframe_src = $ambrygen_iframe;

if ( $ambrygen_iframe && preg_match( '/src=(["\'])(.*?)\1/i', $ambrygen_iframe, $ambrygen_iframe_match ) ) {
	$ambrygen_iframe_src = $ambrygen_iframe_match[2];
}

$ambrygen_iframe_src      = esc_url_raw( $ambrygen_iframe_src );
$ambrygen_iframe_scheme   = wp_parse_url( $ambrygen_iframe_src, PHP_URL_SCHEME );
$ambrygen_iframe_host     = wp_parse_url( $ambrygen_iframe_src, PHP_URL_HOST );
$ambrygen_iframe_path     = wp_parse_url( $ambrygen_iframe_src, PHP_URL_PATH );
$ambrygen_iframe_query    = wp_parse_url( $ambrygen_iframe_src, PHP_URL_QUERY );
$ambrygen_iframe_host     = is_string( $ambrygen_iframe_host ) ? strtolower( $ambrygen_iframe_host ) : '';
$ambrygen_iframe_path     = is_string( $ambrygen_iframe_path ) ? $ambrygen_iframe_path : '';
$ambrygen_iframe_query    = is_string( $ambrygen_iframe_query ) ? $ambrygen_iframe_query : '';
$ambrygen_allowed_hosts   = array( 'www.google.com', 'google.com', 'maps.google.com' );
$ambrygen_query_args      = array();

wp_parse_str( $ambrygen_iframe_query, $ambrygen_query_args );

$ambrygen_is_maps_embed_path   = 0 === strpos( $ambrygen_iframe_path, '/maps/embed' );
$ambrygen_is_maps_output_embed = 0 === strpos( $ambrygen_iframe_path, '/maps' )
	&& isset( $ambrygen_query_args['output'] )
	&& 'embed' === $ambrygen_query_args['output'];
$ambrygen_iframe_is_https = 'https' === strtolower( (string) $ambrygen_iframe_scheme )
	&& in_array( $ambrygen_iframe_host, $ambrygen_allowed_hosts, true )
	&& ( $ambrygen_is_maps_embed_path || $ambrygen_is_maps_output_embed );

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_wrapper_id
		? array(
			'class' => 'location-map',
			'id'    => $ambrygen_wrapper_id,
		)
		: array(
			'class' => 'location-map',
		)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="location-map__row">

		<!-- Map -->
		<div class="location-map__media js-gsap-fade" role="region" aria-label="<?php esc_attr_e( 'Interactive Map', 'ambrygen-web' ); ?>">
			<div class="location-map__image">
				<?php if ( $ambrygen_iframe_src && $ambrygen_iframe_is_https ) : ?>
					<iframe
						src="<?php echo esc_url( $ambrygen_iframe_src ); ?>"
						width="600"
						height="450"
						title="<?php esc_attr_e( 'Google Map Preview', 'ambrygen-web' ); ?>"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade">
					</iframe>
				<?php else : ?>
					<div class="location-map__placeholder">
						<?php esc_html_e( 'No Map Provided', 'ambrygen-web' ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<!-- Content -->
		<div class="location-map__content js-gsap-fade">

		<?php if ( ! empty( $ambrygen_title ) ) : ?>
			<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="location-map__title heading-2 mb-0">
				<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
			</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<div class="is-style-gl-s24" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ( ! empty( $ambrygen_locations ) ) : ?>
			<div class="location-map__text">
				<?php foreach ( $ambrygen_locations as $ambrygen_location ) : ?>
					<dl class="location-list">
						<?php if ( ! empty( $ambrygen_location['name'] ) ) : ?>
							<dt class="location-title text-xl-semibold">
								<?php echo esc_html( $ambrygen_location['name'] ); ?>
							</dt>
						<?php endif; ?>
						<?php if ( ! empty( $ambrygen_location['address'] ) ) : ?>
							<dd class="location-description text-medium">
								<?php echo esc_html( $ambrygen_location['address'] ); ?>
							</dd>
						<?php endif; ?>
					</dl>
				<?php endforeach; ?>

			</div>
			<?php endif; ?>

		</div>
	</div>
</div>
