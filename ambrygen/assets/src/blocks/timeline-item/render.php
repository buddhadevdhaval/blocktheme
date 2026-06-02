<?php
/**
 * Render: Timeline Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_title      = $ambrygen_attributes['title'] ?? '';
$ambrygen_intro      = $ambrygen_attributes['intro'] ?? '';
$ambrygen_image_id   = absint( $ambrygen_attributes['imageId'] ?? 0 );
$ambrygen_image_url  = $ambrygen_attributes['imageUrl'] ?? '';
$ambrygen_image_alt  = $ambrygen_attributes['imageAlt'] ?? '';
$ambrygen_cta        = is_array( $ambrygen_attributes['cta'] ?? null ) ? $ambrygen_attributes['cta'] : array();

$ambrygen_cta_text   = $ambrygen_cta['text'] ?? '';
$ambrygen_cta_url    = $ambrygen_cta['url'] ?? '';
$ambrygen_cta_target = $ambrygen_cta['target'] ?? '';
$ambrygen_cta_rel    = $ambrygen_cta['rel'] ?? '';
$ambrygen_has_title  = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_intro  = '' !== trim( wp_strip_all_tags( $ambrygen_intro ) );
$ambrygen_cta_url    = esc_url_raw( $ambrygen_cta_url );
$ambrygen_cta_label  = $ambrygen_cta_text ?: __( 'Learn more', 'ambrygen-web' );
$ambrygen_parent_tag   = $block->context['ambrygen/timelineHeadingTag'] ?? 'h2';
$ambrygen_parent_level = (int) ltrim( $ambrygen_parent_tag, 'h' );
$ambrygen_item_level   = min( $ambrygen_parent_level + 1, 6 );
$ambrygen_item_tag     = 'h' . $ambrygen_item_level;

if ( '_blank' === $ambrygen_cta_target ) {
	$ambrygen_rel_parts = $ambrygen_cta_rel ? array_filter( array_unique( explode( ' ', $ambrygen_cta_rel ) ) ) : array();
	$ambrygen_cta_rel   = implode( ' ', array_unique( array_merge( $ambrygen_rel_parts, array( 'noopener', 'noreferrer' ) ) ) );
}

$ambrygen_content   = trim( $content );
$ambrygen_has_cta   = '' !== $ambrygen_cta_url;
$ambrygen_has_above = false;
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'timeline-block__item' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="timeline-block__badge-col">
		<div class="timeline-block__badge"></div>
	</div>

	<div class="timeline-block__content-card">
		<div class="timeline-block__image js-gsap-fade">
			<?php
			echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$ambrygen_image_id,
				$ambrygen_image_url,
				'full',
				array(
					'alt'     => $ambrygen_image_alt,
					'loading' => 'lazy',
				),
				true
			);
			?>
		</div>

		<div class="timeline-block__text-content">
			<?php if ( $ambrygen_has_title ) : ?>
				<<?php echo tag_escape( $ambrygen_item_tag ); ?> class="subtitle1-sbold mb-0 timeline-block__text-title js-gsap-fade">
					<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
				</<?php echo tag_escape( $ambrygen_item_tag ); ?>>
				<?php $ambrygen_has_above = true; ?>
			<?php endif; ?>

			<?php if ( $ambrygen_has_intro ) : ?>
				<?php if ( $ambrygen_has_above ) : ?>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="text-md-regular timeline-block__intro js-gsap-fade">
					<?php echo wp_kses_post( wpautop( $ambrygen_intro ) ); ?>
				</div>
				<?php $ambrygen_has_above = true; ?>
			<?php endif; ?>

			<?php if ( $ambrygen_content ) : ?>
				<?php if ( $ambrygen_has_above ) : ?>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="timeline-block__body text-md-regular js-gsap-fade">
					<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
				<?php $ambrygen_has_above = true; ?>
			<?php endif; ?>

			<?php if ( $ambrygen_has_cta ) : ?>
				<?php if ( $ambrygen_has_above ) : ?>
					<div class="is-style-gl-s12" aria-hidden="true"></div>
				<?php endif; ?>
				<a
					class="site-btn is-style-site-text-btn has-right-arrow js-gsap-fade"
					href="<?php echo esc_url( $ambrygen_cta_url ); ?>"
					<?php echo $ambrygen_cta_target ? 'target="' . esc_attr( $ambrygen_cta_target ) . '"' : ''; ?>
					<?php echo $ambrygen_cta_rel ? 'rel="' . esc_attr( $ambrygen_cta_rel ) . '"' : ''; ?>
				>
					<?php echo esc_html( $ambrygen_cta_label ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</div>
