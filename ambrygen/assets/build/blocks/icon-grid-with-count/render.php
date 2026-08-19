<?php
/**
 * Render: Icon Grid with Count
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
$ambrygen_has_header  = ! empty( $ambrygen_heading ) || ! empty( $ambrygen_description ) || ( ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) );
$ambrygen_has_items   = '' !== trim( (string) $content );
$ambrygen_block_id    = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( (string) $ambrygen_attributes['blockId'] )
	: '';

$wrapper_args = array(
	'class' => 'block-layout our-testing-menu',
);

if ( $ambrygen_block_id ) {
	$wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_main_attributes = get_block_wrapper_attributes( $wrapper_args );

$ambrygen_bg_image    = is_array( $ambrygen_attributes['backgroundImage'] ?? null )
	? $ambrygen_attributes['backgroundImage']
	: array();
$ambrygen_bg_image_id = isset( $ambrygen_bg_image['id'] ) ? absint( $ambrygen_bg_image['id'] ) : 0;
$ambrygen_bg_url      = isset( $ambrygen_bg_image['url'] ) ? esc_url_raw( $ambrygen_bg_image['url'] ) : '';
$ambrygen_bg_alt      = isset( $ambrygen_bg_image['alt'] ) ? sanitize_text_field( $ambrygen_bg_image['alt'] ) : '';

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
		<div class="our-testing-menu__header block__rowflex">
			<?php if ( ! empty( $ambrygen_heading ) ) : ?>
				<div class='block__rowflex--col-left'>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="block-title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
					<?php
					echo wp_kses(
						$ambrygen_heading,
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_description ) || ( ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) ) ) : ?>
				<div class="block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php if ( ! empty( $ambrygen_description ) ) : ?>
						<p><?php echo wp_kses_post( $ambrygen_description ); ?></p>
					<?php endif; ?>

					<?php
					if ( is_array( $ambrygen_link ) && ! empty( $ambrygen_link['url'] ) && ! empty( $ambrygen_link['text'] ) ) :
						$ambrygen_link_url    = isset( $ambrygen_link['url'] ) ? esc_url_raw( $ambrygen_link['url'] ) : '';
						$ambrygen_link_text   = isset( $ambrygen_link['text'] ) ? sanitize_text_field( $ambrygen_link['text'] ) : '';
						$ambrygen_target      = ! empty( $ambrygen_link['target'] ) ? sanitize_text_field( $ambrygen_link['target'] ) : '';
						$ambrygen_rel         = ! empty( $ambrygen_link['rel'] ) ? sanitize_text_field( $ambrygen_link['rel'] ) : '';
						$ambrygen_opens_blank = '_blank' === $ambrygen_target;

						if ( $ambrygen_opens_blank ) {
							$ambrygen_rel_tokens = preg_split( '/\s+/', trim( $ambrygen_rel ) );
							$ambrygen_rel_tokens = is_array( $ambrygen_rel_tokens ) ? $ambrygen_rel_tokens : array();

							if ( ! in_array( 'noopener', $ambrygen_rel_tokens, true ) ) {
								$ambrygen_rel_tokens[] = 'noopener';
							}

							if ( ! in_array( 'noreferrer', $ambrygen_rel_tokens, true ) ) {
								$ambrygen_rel_tokens[] = 'noreferrer';
							}

							$ambrygen_rel = trim( implode( ' ', array_filter( $ambrygen_rel_tokens ) ) );
						}
						?>
						<div class="block_rowflex-link js-gsap-fade">
							<a class="site-btn is-style-site-text-btn has-right-arrow text-14"
								href="<?php echo esc_url( $ambrygen_link_url ); ?>"
								<?php echo $ambrygen_target ? ' target="' . esc_attr( $ambrygen_target ) . '"' : ''; ?>
								<?php echo $ambrygen_rel ? ' rel="' . esc_attr( $ambrygen_rel ) . '"' : ''; ?>>
								<?php echo esc_html( $ambrygen_link_text ); ?>
								<?php if ( $ambrygen_opens_blank ) : ?>
									<span class="screen-reader-text">
										<?php esc_html_e( '(opens in new tab)', 'ambrygen-web' ); ?>
									</span>
								<?php endif; ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( $ambrygen_has_header && $ambrygen_has_items ) : ?>
			<div class="is-style-gl-s64" aria-hidden="true"></div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_items ) : ?>
			<div class="our-testing-menu__grid">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php endif; ?>
	</div>
</div>
