<?php
/**
 * Render: Icon Card Grid Block
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

$ambrygen_block_id          = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_tagline          = $attributes['tagline'] ?? '';
$ambrygen_heading          = $attributes['heading'] ?? '';
$ambrygen_heading_level    = $attributes['headingLevel'] ?? 'h2';
$ambrygen_description      = $attributes['description'] ?? '';
$ambrygen_cards_content    = trim( $content );
$ambrygen_heading_tag      = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_has_tagline     = '' !== trim( wp_strip_all_tags( $ambrygen_tagline ) );
$ambrygen_has_heading     = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );
$ambrygen_has_description = '' !== trim( wp_strip_all_tags( $ambrygen_description ) );
$ambrygen_has_header      = $ambrygen_has_tagline || $ambrygen_has_heading || $ambrygen_has_description;
$ambrygen_has_cards       = '' !== $ambrygen_cards_content;

$ambrygen_wrapper_attributes_array = array(
	'class' => 'icon-card-grid',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_attributes_array['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_attributes_array );
?>

<?php if ( $ambrygen_has_header || $ambrygen_has_cards ) : ?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( $ambrygen_has_header ) : ?>
		<!-- Section Header -->
		<div class="icon-card-grid__header">
			<?php if ( $ambrygen_has_tagline ) : ?>
				<div class="hero-kicker icon-card-grid__tagline"><?php echo esc_html( $ambrygen_tagline ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_tagline && ( $ambrygen_has_heading || $ambrygen_has_description ) ) : ?>
				<div class="is-style-gl-s12"></div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="heading-4 block-title mb-0 icon-card-grid__heading"><?php echo wp_kses( $ambrygen_heading, Helper::allowed_heading_html() ); ?></<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( $ambrygen_has_heading && $ambrygen_has_description ) : ?>
				<div class="is-style-gl-s12"></div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_description ) : ?>
				<div class="body1 icon-card-grid__desc"><?php echo wp_kses_post( $ambrygen_description ); ?></div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_header && $ambrygen_has_cards ) : ?>
		<div class="is-style-gl-s32"></div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_cards ) : ?>
		<!-- Cards Grid -->
		<div class="icon-card-grid__grid">
			<?php echo $ambrygen_cards_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-escaped by WordPress core. ?>
		</div>
	<?php endif; ?>

</div>
<?php endif; ?>
