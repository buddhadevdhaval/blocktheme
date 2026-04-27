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

$ambrygen_title = $ambrygen_attributes['title'] ?? '';
$ambrygen_intro = $ambrygen_attributes['intro'] ?? '';

$ambrygen_heading_level = isset( $ambrygen_attributes['headingLevel'] )
	? sanitize_key( $ambrygen_attributes['headingLevel'] )
	: 'h2';

$ambrygen_heading_level = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_wrapper_args = array(
	'class' => 'our-team',
);

if ( ! empty( $ambrygen_block_id ) ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
$ambrygen_offcanvas_name_id  = $ambrygen_block_id
	? $ambrygen_block_id . '-team-offcanvas-name'
	: wp_unique_id( 'team-offcanvas-name-' );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( ! empty( $ambrygen_title ) ) : ?>

		<div class="our-team__header block__rowflex">

			<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="our-team__title block__rowflex--heading-title heading-3 mb-0 js-gsap-fade">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo tag_escape( $ambrygen_heading_level ); ?>>

			<?php if ( ! empty( $ambrygen_intro ) ) : ?>
				<div class="our-team__intro block__rowflex--block-content subtitle1 js-gsap-fade">
					<?php echo wp_kses_post( $ambrygen_intro ); ?>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>

	<?php endif; ?>

	<div class="our-team__grid">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is block-rendered content.
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
			aria-labelledby="<?php echo esc_attr( $ambrygen_offcanvas_name_id ); ?>"
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
					<div class="our-team-offcanvas__role body1"></div>
				</div>
			</div>

			<div class="our-team-offcanvas__bio"></div>
		</div>
	</div>

</div>
