<?php
/**
 * Render: Small Icon Grid Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_richtext_allowed = array(
	'span'   => array(
		'class'              => true,
		'title'              => true,
		'data-tooltip'       => true,
		'data-tooltip-title' => true,
		'data-tooltip-b64'   => true,
		'data-tooltip-id'    => true,
	),
	'mark'   => array(
		'class' => true,
		'style' => true,
	),
	'br'     => array(),
	'strong' => array(),
	'em'     => array(),
	'a'      => array(
		'href'   => true,
		'title'  => true,
		'target' => true,
		'rel'    => true,
		'class'  => true,
	),
);

$ambrygen_attributes = $attributes ?? array();
$ambrygen_title_raw  = $ambrygen_attributes['title'] ?? '';
$ambrygen_title      = wp_strip_all_tags( $ambrygen_title_raw );
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

// Keep the pre-fallback flag for the empty-block early return, but always render
// a fallback logo for cards that have other content and no explicit icon selected.
if ( ! $ambrygen_icon_url ) {
	$ambrygen_icon_url = esc_url( get_theme_file_uri( 'assets/src/images/logo.png' ) );
}

$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_has_content = ! empty( $ambrygen_title ) || ! empty( $ambrygen_description ) || ! empty( $ambrygen_visible_links ) || $ambrygen_has_icon;
$ambrygen_has_link    = ! empty( $ambrygen_visible_links[0]['label'] ) && ! empty( $ambrygen_visible_links[0]['url'] );

if ( ! $ambrygen_has_content ) {
	return;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'icon-grid__item js-gsap-fade',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_icon_id || $ambrygen_icon_url ) : ?>
		<div class="icon-grid__icon">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() returns escaped image markup.
			echo Helper::image_from_source(
				$ambrygen_icon_id,
				$ambrygen_icon_url,
				'medium_large',
				array(
					'loading'  => 'lazy',
					'decoding' => 'async',
					'alt'      => $ambrygen_icon_id ? $ambrygen_icon_alt ?: $ambrygen_title : '',
				),
				false
			);
			?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_title ) : ?>
		<h3 class="icon-grid__item-title text-xl-semibold mb-0">
			<?php echo wp_kses( $ambrygen_title_raw, $ambrygen_richtext_allowed ); ?>
		</h3>
	<?php endif; ?>

	<?php if ( ! empty( $ambrygen_attributes['description'] ) ) : ?>
		<?php if ( $ambrygen_title ) : ?>
			<div class="is-style-gl-s8" aria-hidden="true"></div>
		<?php endif; ?>
		<div class="icon-grid__item-description text-md-reg">
			<?php echo wp_kses_post( $ambrygen_attributes['description'] ); ?>
		</div>
	<?php endif; ?>

	<?php
	if ( $ambrygen_has_link ) :
		if ( $ambrygen_title || ! empty( $ambrygen_attributes['description'] ) ) :
			?>
			<div class="is-style-gl-s20" aria-hidden="true"></div>
			<?php
		endif;
		$ambrygen_link_label  = sanitize_text_field( $ambrygen_visible_links[0]['label'] );
		$ambrygen_link_url    = esc_url( $ambrygen_visible_links[0]['url'] );
		$ambrygen_link_target = ! empty( $ambrygen_visible_links[0]['target'] ) ? sanitize_text_field( $ambrygen_visible_links[0]['target'] ) : '';
		$ambrygen_rel         = '_blank' === $ambrygen_link_target ? 'noopener noreferrer' : '';
		?>
		<a
			class="site-btn is-style-site-text-btn has-right-arrow"
			href="<?php echo esc_url( $ambrygen_link_url ); ?>"
			<?php if ( '_blank' === $ambrygen_link_target ) : ?>
				target="_blank"
			<?php endif; ?>
			<?php if ( $ambrygen_rel ) : ?>
				rel="<?php echo esc_attr( $ambrygen_rel ); ?>"
			<?php endif; ?>
		>
			<?php echo esc_html( $ambrygen_link_label ); ?>
		</a>
	<?php endif; ?>
</div>
