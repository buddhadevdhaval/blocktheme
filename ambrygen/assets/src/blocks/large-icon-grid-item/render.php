<?php
/**
 * Render: Large Icon Grid Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = $attributes ?? array();
$ambrygen_title_raw  = $ambrygen_attributes['title'] ?? '';
$ambrygen_title      = wp_strip_all_tags( $ambrygen_title_raw );
$ambrygen_count      = $ambrygen_attributes['count'] ?? '';
$ambrygen_links      = is_array( $ambrygen_attributes['links'] ?? null )
	? $ambrygen_attributes['links']
	: array();
$ambrygen_visible_links = array_values(
	array_filter(
		$ambrygen_links,
		static function ( $ambrygen_link ) {
			return ! empty( $ambrygen_link['label'] ) && ! empty( $ambrygen_link['url'] );
		}
	)
);
$ambrygen_icon       = is_array( $ambrygen_attributes['icon'] ?? null )
	? $ambrygen_attributes['icon']
	: array();
$ambrygen_icon_id    = isset( $ambrygen_icon['id'] ) ? absint( $ambrygen_icon['id'] ) : 0;
$ambrygen_icon_url   = isset( $ambrygen_icon['url'] ) ? esc_url( $ambrygen_icon['url'] ) : '';
$ambrygen_icon_alt   = isset( $ambrygen_icon['alt'] ) ? sanitize_text_field( $ambrygen_icon['alt'] ) : '';
$ambrygen_has_icon   = $ambrygen_icon_id || $ambrygen_icon_url;

if ( ! $ambrygen_icon_url ) {
	$ambrygen_icon_url = esc_url( get_theme_file_uri( 'assets/src/images/logo.png' ) );
}

$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_has_content = ! empty( $ambrygen_title ) || ! empty( $ambrygen_description ) || ! empty( $ambrygen_count ) || ! empty( $ambrygen_visible_links ) || $ambrygen_has_icon;

if ( ! $ambrygen_has_content ) {
	return;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'info-list__col js-gsap-fade',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="info-list__card">
		<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
			<div class="info-list__image">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
				echo Helper::image_from_source(
					$ambrygen_icon_id,
					$ambrygen_icon_url,
					'medium_large',
					array(
						'class'    => 'card-image',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => $ambrygen_icon_id ? $ambrygen_icon_alt ?: $ambrygen_title : '',
					),
					false
				);
				?>
			</div>
		<?php endif; ?>

		<div class="info-list__content">
			<?php if ( $ambrygen_title ) : ?>
				<div class="subtitle1-sbold info-list__title">
					<?php echo wp_kses_post( $ambrygen_title_raw ); ?>
				</div>
				<div class="is-style-gl-s8" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( $ambrygen_count ) : ?>
				<div class="info-list__count subtitle2-sbold">
					<?php
					/* translators: %s: numeric count of tests */
					printf(
						esc_html__( '%s Tests', 'ambrygen-web' ),
						esc_html( $ambrygen_count )
					);
					?>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<?php if ( $ambrygen_title || $ambrygen_count ) : ?>
					<div class="is-style-gl-s8" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="info-list__description text-md-reg">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_visible_links ) ) : ?>
				<div class="info-list__links">
					<div class="is-style-gl-s16" aria-hidden="true"></div>
					<?php
					foreach ( $ambrygen_visible_links as $ambrygen_link ) :
						$ambrygen_link_label  = isset( $ambrygen_link['label'] ) ? sanitize_text_field( $ambrygen_link['label'] ) : '';
						$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
						$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';
						$ambrygen_rel         = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';

						if ( $ambrygen_link_label && $ambrygen_link_url ) :
							?>
							<div class="info-list__link-col">
								<a
									href="<?php echo esc_url( $ambrygen_link_url ); ?>"
									class="info-list__link site-btn is-style-site-text-btn has-right-arrow text-14"
									<?php if ( '_blank' === $ambrygen_link_target ) : ?>
										target="_blank"
									<?php endif; ?>
									<?php if ( $ambrygen_rel ) : ?>
										rel="<?php echo esc_attr( $ambrygen_rel ); ?>"
									<?php endif; ?>
								>
									<?php echo esc_html( $ambrygen_link_label ); ?>
								</a>
							</div>
							<?php
						endif;
					endforeach;
					?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
