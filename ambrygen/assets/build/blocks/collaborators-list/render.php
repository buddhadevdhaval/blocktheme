<?php
/**
 * Render: Collaborators List Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param \WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_title    = isset( $attributes['title'] ) ? $attributes['title'] : 'Additional Collaborations';
$ambrygen_subtitle = isset( $attributes['subtitle'] ) ? (string) $attributes['subtitle'] : '';
$ambrygen_is_open  = isset( $attributes['isOpen'] ) ? (bool) $attributes['isOpen'] : true;
$ambrygen_mode     = isset( $attributes['selectionMode'] ) ? (string) $attributes['selectionMode'] : 'manual';
$ambrygen_block_id = isset( $attributes['anchor'] ) ? $attributes['anchor'] : 'collaborators-' . \wp_unique_id();

$ambrygen_items_markup = $content;
$ambrygen_heading_tag  = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );

if ( 'link-all' === $ambrygen_mode ) {
	$ambrygen_terms = \get_terms(
		array(
			'taxonomy'   => 'collaborator',
			'hide_empty' => true,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	$ambrygen_items_markup = '';

	if ( ! \is_wp_error( $ambrygen_terms ) && ! empty( $ambrygen_terms ) ) {
		foreach ( $ambrygen_terms as $ambrygen_term ) {
			$ambrygen_link = \get_term_meta( $ambrygen_term->term_id, 'link', true );

			if ( empty( $ambrygen_link ) ) {
				continue;
			}

			$ambrygen_items_markup .= sprintf(
				'<div class="download-list__item wp-block-ambrygen-collaborators-item"><a href="%1$s" target="_blank" rel="noopener noreferrer"><span class="download-list__item-text">%2$s</span></a></div>',
				\esc_url( $ambrygen_link ),
				\esc_html( $ambrygen_term->name )
			);
		}
	}
}
?>

<div class="download-list collaborators-list" id="<?php echo \esc_attr( $ambrygen_block_id ); ?>" data-amb-open="<?php echo $ambrygen_is_open ? 'true' : 'false'; ?>">
	<div class="download-list__inner">
		<div class="download-list__header-area mb-24">
			<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) ) ) : ?>
				<div class="download-list__kicker hero-kicker">
					<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
				</div>
			<?php endif; ?>
			<div class="is-style-gl-s12" aria-hidden="true"></div>
			<div class="download-list__content">
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="download-list__title heading-3 block-title mb-0">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			</div>
		</div>
		<div class="download-list__items" id="<?php echo \esc_attr( $ambrygen_block_id . '-content' ); ?>" style="<?php echo $ambrygen_is_open ? '' : 'display: none;'; ?>">
			<?php echo $ambrygen_items_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</div>
