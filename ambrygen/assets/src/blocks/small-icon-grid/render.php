<?php
/**
 * Render: Small Icon Grid
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

$ambrygen_attributes = is_array( $attributes ) ? $attributes : array();

$ambrygen_heading_tag = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
$ambrygen_description = $ambrygen_attributes['description'] ?? '';
$ambrygen_link        = is_array( $ambrygen_attributes['link'] ?? null )
	? $ambrygen_attributes['link']
	: array();
$ambrygen_link_text   = isset( $ambrygen_link['text'] ) ? sanitize_text_field( $ambrygen_link['text'] ) : '';
$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url( $ambrygen_link['url'] ) : '';
$ambrygen_link_target = isset( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';
$ambrygen_link_rel    = isset( $ambrygen_link['rel'] ) ? sanitize_text_field( $ambrygen_link['rel'] ) : '';
$ambrygen_has_cta     = ! empty( $ambrygen_link_text ) && ! empty( $ambrygen_link_url );
$ambrygen_content     = trim( (string) $content );
$ambrygen_is_large    = ! empty( $ambrygen_attributes['isLargeIcon'] );
$ambrygen_large_class = $ambrygen_is_large ? ' style-large-icons' : '';
$ambrygen_has_header  = ! empty( $ambrygen_heading ) || ! empty( $ambrygen_description ) || $ambrygen_has_cta;
$ambrygen_has_items   = '' !== $ambrygen_content;
$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( (string) $ambrygen_attributes['blockId'] )
	: '';

$ambrygen_bg_image    = is_array( $ambrygen_attributes['backgroundImage'] ?? null )
	? $ambrygen_attributes['backgroundImage']
	: array();
$ambrygen_bg_image_id = isset( $ambrygen_bg_image['id'] ) ? absint( $ambrygen_bg_image['id'] ) : 0;
$ambrygen_bg_url      = isset( $ambrygen_bg_image['url'] ) ? esc_url_raw( $ambrygen_bg_image['url'] ) : '';
$ambrygen_bg_alt      = isset( $ambrygen_bg_image['alt'] ) ? sanitize_text_field( $ambrygen_bg_image['alt'] ) : '';

$wrapper_args = array(
	'class' => 'block-layout icon-grid' . $ambrygen_large_class,
);

if ( $ambrygen_block_id ) {
	$wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_main_attributes = get_block_wrapper_attributes( $wrapper_args );

?>

<div <?php echo $ambrygen_main_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $ambrygen_bg_image_id || $ambrygen_bg_url ) : ?>
		<div class="block-bg-image">
			<?php
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
			echo Helper::image_from_source(
				$ambrygen_bg_image_id,
				$ambrygen_bg_url,
				'full',
				array(
					'alt' => $ambrygen_bg_alt,
				)
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	<?php endif; ?>
	<div class="icon-grid-block">
		<div class="icon-grid__header">
			<?php if ( ! empty( $ambrygen_heading ) ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-3 block-title mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<?php if ( ! empty( $ambrygen_heading ) ) : ?>
					<div class="is-style-gl-s20" aria-hidden="true"></div>
				<?php endif; ?>
				<div class="text-xl-reg icon-grid__intro text-center js-gsap-fade">
					<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
				</div>
			<?php endif; ?>
			<?php if ( $ambrygen_has_cta ) : ?>
				<a
					href="<?php echo esc_url( $ambrygen_link_url ); ?>"
					class="site-btn is-style-site-text-btn has-right-arrow text-14"
					<?php if ( $ambrygen_link_target ) : ?>
						target="<?php echo esc_attr( $ambrygen_link_target ); ?>"
					<?php endif; ?>
					<?php if ( $ambrygen_link_rel ) : ?>
						rel="<?php echo esc_attr( $ambrygen_link_rel ); ?>"
					<?php endif; ?>
				>
					<?php echo esc_html( $ambrygen_link_text ); ?>
				</a>
			<?php endif; ?>
			</div>

		<?php if ( $ambrygen_has_header && $ambrygen_has_items ) : ?>
			<div class="is-style-gl-s64" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_items ) : ?>
			<div class="icon-grid__list">
				<?php echo $ambrygen_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>
	</div>
</div>
