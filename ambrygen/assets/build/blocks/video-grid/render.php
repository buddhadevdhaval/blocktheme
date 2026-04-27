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
$ambrygen_block_id     = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_heading      = $ambrygen_attributes['heading'] ?? '';
$ambrygen_intro        = $ambrygen_attributes['description'] ?? '';
$ambrygen_subheading   = $ambrygen_attributes['subheading'] ?? '';
$ambrygen_sub_intro    = $ambrygen_attributes['subDescription'] ?? '';
$ambrygen_quote_byline = $ambrygen_attributes['quoteAttribution'] ?? '';
$ambrygen_variation    = $ambrygen_attributes['variation'] ?? 'variation-features';
$ambrygen_heading_tag  = $ambrygen_attributes['headingTag'] ?? 'h2';

$ambrygen_allowed_heading_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$ambrygen_heading_tag          = in_array( $ambrygen_heading_tag, $ambrygen_allowed_heading_tags, true ) ? $ambrygen_heading_tag : 'h2';

$ambrygen_allowed_variations = array( 'variation-features', 'variation-3' );
$ambrygen_variation          = in_array( $ambrygen_variation, $ambrygen_allowed_variations, true ) ? $ambrygen_variation : 'variation-features';

$ambrygen_amb_class    = in_array( $ambrygen_variation, array( 'variation-features', 'variation-3' ), true ) ? 'variation-team' : '';
$ambrygen_heading_id   = 'video-grid-heading-' . wp_unique_id();
$ambrygen_modal_id     = 'video-modal-' . wp_unique_id();
$ambrygen_container_id = $ambrygen_modal_id . '-container';
$ambrygen_title_id     = $ambrygen_modal_id . '-title';
$ambrygen_desc_id      = $ambrygen_modal_id . '-description';
$ambrygen_inner_blocks = $block->inner_blocks ?? array();
$ambrygen_item_count   = count( $ambrygen_inner_blocks );
$ambrygen_grid_columns = $ambrygen_item_count >= 3 ? '3' : '2';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'image-grid-block video-grid wp-block-ambrygen-gallery block-' . sanitize_html_class( $ambrygen_variation ) . ' ' . $ambrygen_amb_class . ' grid-column' . $ambrygen_grid_columns,
		'id'    => $ambrygen_block_id ? sanitize_html_class( $ambrygen_block_id ) : null,
	)
);
?>

<div
	<?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) ) : ?>
		aria-labelledby="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
	<?php else : ?>
		aria-label="<?php esc_attr_e( 'Video grid section', 'ambrygen-web' ); ?>"
	<?php endif; ?>
>
	<div class="two-column-videos<?php echo 'variation-3' === $ambrygen_variation ? ' row-videos' : ''; ?>">
		<!-- <div class="is-style-gl-s50"></div> -->

		<!-- Header: quote + description -->
		<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_quote_byline ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_intro ) ) ) ) : ?>
			<div class="two-column-videos__header block__rowflex">
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_quote_byline ) ) ) ) : ?>
					<div class="block__rowflex--heading-title two-column-videos__header-quote">
						<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) ) : ?>
							<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 mb-0 js-gsap-fade two-column-videos__quote-text" id="<?php echo esc_attr( $ambrygen_heading_id ); ?>">
								<?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?>
							</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
						<?php endif; ?>

						<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_heading ) ) ) && ! empty( trim( wp_strip_all_tags( $ambrygen_quote_byline ) ) ) ) : ?>
							<div class="is-style-gl-s16"></div>
						<?php endif; ?>

						<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_quote_byline ) ) ) ) : ?>
							<div class="body2-reg two-column-videos__quote-attribution">
								<?php echo wp_kses_post( $ambrygen_quote_byline ); ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_intro ) ) ) ) : ?>
					<div class="block__rowflex--block-content subtitle-1-regular js-gsap-fade two-column-videos__header-description">
						<?php echo wp_kses_post( $ambrygen_intro ); ?>
					</div>
				<?php endif; ?>
			</div>
			<!-- <div class="is-style-gl-s50"></div> -->
		<?php endif; ?>

		<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) || ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
			<!-- Section subheading -->
			 <div class="is-style-gl-s32" aria-hidden="true"></div>
			<div class="two-column-videos__subheading">
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) ) : ?>
					<h2 class="heading-4 block-title mb-0">
						<?php echo wp_kses_post( $ambrygen_subheading ); ?>
					</h2>
				<?php endif; ?>
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_subheading ) ) ) && ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
					<div class="is-style-gl-s16"></div>
				<?php endif; ?>
				<?php if ( ! empty( trim( wp_strip_all_tags( $ambrygen_sub_intro ) ) ) ) : ?>
					<div class="body1-reg two-column-videos__subheading-description">
						<?php echo wp_kses_post( $ambrygen_sub_intro ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<div class="is-style-gl-s50"></div>
		<!-- Video cards -->
		<div class="videos__cards">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
		</div>

		<!-- <div class="is-style-gl-s50"></div> -->
	</div>

	<div
		class="modal-popup modal-popup--video"
		id="<?php echo esc_attr( $ambrygen_modal_id ); ?>"
		data-video-modal
	>
		<div class="modal-popup__overlay"></div>
		<div
			class="modal-popup__panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="<?php echo esc_attr( $ambrygen_title_id ); ?>"
		>
			<button type="button" class="modal-popup__close" aria-label="<?php esc_attr_e( 'Close modal', 'ambrygen-web' ); ?>">
				<img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/close-icon.svg' ) ); ?>" alt="<?php esc_attr_e( 'Close', 'ambrygen-web' ); ?>" />
			</button>
			<div class="modal-content">
				<div
					id="<?php echo esc_attr( $ambrygen_container_id ); ?>"
					class="modal-content__video-wrapper"
					data-video-modal-container
				>
					<!-- Video iframe will be inserted here -->
				</div>
				<div class="is-style-gl-s24"></div>
				<div
					id="<?php echo esc_attr( $ambrygen_title_id ); ?>"
					class="modal-content__title heading-6 mb-0"
					data-video-modal-title
				></div>
				<div class="is-style-gl-s16"></div>
				<div
					id="<?php echo esc_attr( $ambrygen_desc_id ); ?>"
					class="modal-content__description"
					data-video-modal-description
				></div>
			</div>
		</div>
	</div>
				</div>
