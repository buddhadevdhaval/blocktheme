<?php
/**
 * Render: Our Team Slider Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$attributes      = is_array( $attributes ) ? $attributes : array();
$block_id        = $attributes['blockId'] ?? '';
$title           = $attributes['title'] ?? 'Our Leadership Team';
$intro           = $attributes['intro'] ?? 'We are proud to be leading the industry that we love and working together.';
$heading_level   = $attributes['headingLevel'] ?? 'h2';
$show_navigation = $attributes['showNavigation'] ?? true;
$show_pagination = $attributes['showPagination'] ?? true;
$swiper_config   = wp_json_encode(
	array(
		'autoplay'        => ! empty( $attributes['autoplay'] ),
		'navigation_show' => $show_navigation,
	)
);

$wrapper_attributes = get_block_wrapper_attributes(
	$block_id
		? array(
			'class' => 'our-leadership',
			'id'    => $block_id,
		)
		: array(
			'class' => 'our-leadership',
		)
);
$allowed_heading_levels = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
$heading_level          = in_array( $heading_level, $allowed_heading_levels, true ) ? $heading_level : 'h2';
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="our-leadership__header block__rowflex">
		<<?php echo esc_html( $heading_level ); ?> class="our-leadership__title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
			<?php echo wp_kses_post( $title ); ?>
		</<?php echo esc_html( $heading_level ); ?>>
		<div class="our-leadership__intro block__rowflex--block-content subtitle1-reg js-gsap-fade">
			<?php echo wp_kses_post( $intro ); ?>
		</div>
	</div>

	<div class="is-style-gl-s50"></div>

	<div
		class="our-leadership__grid our-leadership-slider swiper"
		data-swiper-config='<?php echo esc_attr( $swiper_config ); ?>'
	>
		<div class="swiper-wrapper">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core.
			echo $content;
			?>
		</div>

		<?php if ( $show_navigation ) : ?>
			<div class="swiper-buttons">
				<div class="custom-prev"></div>
				<div class="custom-next"></div>
			</div>
		<?php endif; ?>

		<?php if ( $show_pagination ) : ?>
			<div class="swiper-pagination"></div>
		<?php endif; ?>
	</div>

	<!-- Offcanvas Panel -->
	<div class="offcanvas-sidebar our-team-offcanvas" aria-hidden="true">
		<div class="offcanvas-sidebar__overlay"></div>
		<div
			class="offcanvas-sidebar__panel"
			role="dialog"
			aria-modal="true"
			aria-label="<?php esc_attr_e( 'Team Member Details', 'ambrygen-web' ); ?>"
		>
			<button
				type="button"
				class="offcanvas-sidebar__close"
				aria-label="<?php esc_attr_e( 'Close', 'ambrygen-web' ); ?>"
			>
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/close-icon.svg' ); ?>" alt="Close" />
			</button>

			<div class="our-team-offcanvas__header">
				<div class="our-team-offcanvas__image-wrapper">
					<img class="our-team-offcanvas__image" src="" alt="" />
				</div>
				<div class="our-team-offcanvas__meta">
					<div class="our-team-offcanvas__name heading-4 mb-0"></div>
					<div class="our-team-offcanvas__role body1"></div>
				</div>
			</div>

			<div class="our-team-offcanvas__bio"></div>
		</div>
	</div>

</div>
