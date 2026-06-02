<?php
/**
 * Render: Video Grid Block
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

$ambrygen_attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id     = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_intro        = $ambrygen_attributes['description'] ?? '';
$ambrygen_subheading   = $ambrygen_attributes['subheading'] ?? '';
$ambrygen_heading_tag  = Helper::get_heading_tag( $ambrygen_attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_sub_intro    = $ambrygen_attributes['subDescription'] ?? '';
$ambrygen_variation    = 'variation-features';
$ambrygen_layout_class = 'variation-team';
$ambrygen_modal_id     = $ambrygen_block_id ? $ambrygen_block_id . '-video-modal' : 'video-modal-' . wp_unique_id();
$ambrygen_container_id = $ambrygen_modal_id . '-container';
$ambrygen_title_id     = $ambrygen_modal_id . '-title';
$ambrygen_desc_id      = $ambrygen_modal_id . '-description';
$ambrygen_inner_blocks = $block->inner_blocks ?? array();
$ambrygen_item_count   = count( $ambrygen_inner_blocks );
$ambrygen_grid_columns = $ambrygen_item_count >= 3 ? '3' : '2';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array_filter(
		array(
			'class' => 'block-layout image-grid-block video-grid wp-block-ambrygen-gallery block-' . sanitize_html_class( $ambrygen_variation ) . ' ' . $ambrygen_layout_class . ' grid-column' . $ambrygen_grid_columns,
			'role'  => 'region',
			'id'    => $ambrygen_block_id ?: null,
		)
	)
);
?>

<div
	<?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	aria-label="<?php esc_attr_e( 'Video grid section', 'ambrygen-web' ); ?>"
>
	<div class="two-column-videos block-layout">
		<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
			<div class="is-style-gl-s32" aria-hidden="true"></div>
			<div class="two-column-videos__subheading">
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_subheading ); ?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) && ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
					<div class="is-style-gl-s16" aria-hidden="true"></div>
				<?php endif; ?>
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
					<div class="body1-reg two-column-videos__subheading-description js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_sub_intro ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
			<div class="is-style-gl-s50" aria-hidden="true"></div>
		<?php endif; ?>
		<!-- Video cards -->
		<div class="videos__cards">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
		</div>
	</div>

	<div
		class="modal-popup modal-popup--video"
		id="<?php echo esc_attr( $ambrygen_modal_id ); ?>"
		data-video-modal
		aria-hidden="true"
	>
		<div class="modal-popup__overlay"></div>
		<div
			class="modal-popup__panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="<?php echo esc_attr( $ambrygen_title_id ); ?>"
			aria-describedby="<?php echo esc_attr( $ambrygen_desc_id ); ?>"
		>
			<button type="button" class="modal-popup__close" aria-label="<?php esc_attr_e( 'Close modal', 'ambrygen-web' ); ?>">
				<img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/close-icon.svg' ) ); ?>" alt="" />
			</button>
			<div class="modal-content">
				<div
					id="<?php echo esc_attr( $ambrygen_container_id ); ?>"
					class="modal-content__video-wrapper"
					data-video-modal-container
				>
				</div>
				<div class="is-style-gl-s24" aria-hidden="true"></div>
				<div
					id="<?php echo esc_attr( $ambrygen_title_id ); ?>"
					class="modal-content__title heading-6 mb-0"
					data-video-modal-title
				></div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
				<div
					id="<?php echo esc_attr( $ambrygen_desc_id ); ?>"
					class="modal-content__description"
					data-video-modal-description
				></div>
			</div>
		</div>
	</div>
</div>
