<?php
/**
 * Render: Our Team Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes )
	? $attributes
	: array();
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';

$ambrygen_title     = $ambrygen_attributes['title'] ?? '';
$ambrygen_intro     = $ambrygen_attributes['intro'] ?? '';
$ambrygen_variation = isset( $ambrygen_attributes['variation'] ) && 'slider-view' === $ambrygen_attributes['variation']
	? 'slider-view'
	: 'grid-view';

$ambrygen_is_slider_view = 'slider-view' === $ambrygen_variation;
$ambrygen_block_class    = $ambrygen_is_slider_view ? 'our-leadership' : 'our-team';

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? sanitize_key( $ambrygen_attributes['headingLevel'] )
	: 'h2';

$ambrygen_heading_level = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_show_navigation = isset( $ambrygen_attributes['showNavigation'] )
	? (bool) $ambrygen_attributes['showNavigation']
	: true;
$ambrygen_show_pagination = isset( $ambrygen_attributes['showPagination'] )
	? (bool) $ambrygen_attributes['showPagination']
	: true;

$ambrygen_team_member_count = 0;

if ( $ambrygen_is_slider_view && '' !== $content ) {
	$ambrygen_team_member_count = preg_match_all( '/class=(["\'])(?:(?!\1).)*\bswiper-slide\b(?:(?!\1).)*\1/', $content );
	$ambrygen_team_member_count = false === $ambrygen_team_member_count ? 0 : $ambrygen_team_member_count;
}

if ( 0 === $ambrygen_team_member_count ) {
	$ambrygen_team_member_count = isset( $block->inner_blocks ) && is_array( $block->inner_blocks )
		? count( $block->inner_blocks )
		: 0;
}

$ambrygen_has_team_members     = 0 < $ambrygen_team_member_count;
$ambrygen_has_multiple_members = 1 < $ambrygen_team_member_count;
$ambrygen_show_navigation      = $ambrygen_show_navigation && $ambrygen_has_multiple_members;
$ambrygen_show_pagination      = $ambrygen_show_pagination && $ambrygen_has_multiple_members;
$ambrygen_swiper_config       = wp_json_encode(
	array(
		'autoplay'        => ! empty( $ambrygen_attributes['autoplay'] ),
		'navigation_show' => $ambrygen_show_navigation,
	)
);
$ambrygen_swiper_config       = false === $ambrygen_swiper_config ? '{}' : $ambrygen_swiper_config;

$ambrygen_wrapper_args = array(
	'class' => $ambrygen_block_class,
);

if ( ! empty( $ambrygen_block_id ) ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
$ambrygen_offcanvas_name_id  = $ambrygen_block_id
	? $ambrygen_block_id . '-team-offcanvas-name'
	: wp_unique_id( 'team-offcanvas-name-' );
$ambrygen_offcanvas_id       = $ambrygen_block_id
	? $ambrygen_block_id . '-team-offcanvas'
	: wp_unique_id( 'team-offcanvas-' );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>

	<?php if ( ! empty( $ambrygen_title ) || ! empty( $ambrygen_intro ) ) : ?>

		<div class="<?php echo esc_attr( $ambrygen_block_class ); ?>__header block__rowflex">
			<?php if ( ! empty( $ambrygen_title ) ) : ?>
				<div class="block__rowflex--col-left">
				<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="<?php echo esc_attr( $ambrygen_block_class ); ?>__title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_intro ) ) : ?>
				<div class="<?php echo esc_attr( $ambrygen_block_class ); ?>__intro block__rowflex--block-content subtitle1-reg js-gsap-fade <?php echo esc_attr( $ambrygen_is_slider_view ? 'subtitle1-reg' : 'subtitle1' ); ?> js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_intro ); ?>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>

	<?php endif; ?>

	<?php if ( $ambrygen_is_slider_view ) : ?>
		<div
			class="our-leadership__grid our-leadership-slider swiper"
			data-swiper-config='<?php echo esc_attr( $ambrygen_swiper_config ); ?>'
			role="region"
			aria-roledescription="<?php esc_attr_e( 'carousel', 'ambrygen-web' ); ?>"
			aria-label="<?php echo esc_attr( $ambrygen_title ? wp_strip_all_tags( $ambrygen_title ) : __( 'Team members', 'ambrygen-web' ) ); ?>"
		>
			<div class="swiper-wrapper" aria-live="polite">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is block-rendered content.
				echo $content;
				?>
			</div>

			<?php if ( $ambrygen_show_navigation ) : ?>
				<div class="swiper-buttons">
					<button
						type="button"
						class="custom-prev"
						aria-label="<?php esc_attr_e( 'Previous slide', 'ambrygen-web' ); ?>"
					></button>
					<button
						type="button"
						class="custom-next"
						aria-label="<?php esc_attr_e( 'Next slide', 'ambrygen-web' ); ?>"
					></button>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_show_pagination ) : ?>
				<div class="swiper-pagination"></div>
			<?php endif; ?>
		</div>
	<?php else : ?>
		<div class="our-team__grid">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is block-rendered content.
			echo $content;
			?>
		</div>
	<?php endif; ?>


		<div
			id="<?php echo esc_attr( $ambrygen_offcanvas_id ); ?>"
			class="offcanvas-sidebar our-team-offcanvas"
			aria-hidden="true"
		>
			<div class="offcanvas-sidebar__overlay"></div>
			<div
				class="offcanvas-sidebar__panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="<?php echo esc_attr( $ambrygen_offcanvas_name_id ); ?>"
				tabindex="-1"
			>
				<button
					type="button"
					class="offcanvas-sidebar__close"
					aria-label="<?php esc_attr_e( 'Close', 'ambrygen-web' ); ?>"
				>
					<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/close-icon.svg' ); ?>" alt="" />
				</button>

				<div class="our-team-offcanvas__header">
					<div class="our-team-offcanvas__image-wrapper">
						<img class="our-team-offcanvas__image" src="" alt="" />
					</div>
					<div class="our-team-offcanvas__meta">
						<div
							id="<?php echo esc_attr( $ambrygen_offcanvas_name_id ); ?>"
							class="our-team-offcanvas__name heading-4 mb-0"
						></div>
						<div class="our-team-offcanvas__role body1" aria-live="polite" aria-hidden="true" hidden></div>
					</div>
				</div>

				<div class="our-team-offcanvas__bio"></div>
			</div>
		</div>
	<?php // endif; ?>

</div>

