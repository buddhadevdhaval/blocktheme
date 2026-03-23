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

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes )
	? $attributes
	: array();

$ambrygen_title = isset( $ambrygen_attributes['title'] )
	? $ambrygen_attributes['title']
	: '';

$ambrygen_intro = isset( $ambrygen_attributes['intro'] )
	? $ambrygen_attributes['intro']
	: '';

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? sanitize_key( $ambrygen_attributes['headingLevel'] )
	: 'h2';

$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );

if ( ! in_array( $ambrygen_heading_level, $ambrygen_allowed_headings, true ) ) {
	$ambrygen_heading_level = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'our-team',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( ! empty( $ambrygen_title ) ) : ?>

		<div class="our-team__header block__rowflex">

			<<?php echo esc_attr( $ambrygen_heading_level ); ?> class="our-team__title block__rowflex--heading-title heading-3 mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo esc_attr( $ambrygen_heading_level ); ?>>

			<?php if ( ! empty( $ambrygen_intro ) ) : ?>
				<div class="our-team__intro block__rowflex--block-content subtitle1">
					<?php echo wp_kses_post( $ambrygen_intro ); ?>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>

	<?php endif; ?>

	<div class="our-team__grid">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core.
		echo $content;
		?>
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
