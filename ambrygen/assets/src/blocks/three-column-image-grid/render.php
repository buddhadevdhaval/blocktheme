<?php
    /**
 * Render: Three Column Image Grid Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

    defined('ABSPATH') || exit;

    use Ambrygen\Theme\Core\Helper;

    $ambrygen_attributes = is_array($attributes) ? $attributes : [];
    $ambrygen_anchor     = isset($ambrygen_attributes['anchor'])
    ? sanitize_html_class((string) $ambrygen_attributes['anchor'])
    : '';
    $ambrygen_eyebrow     = $ambrygen_attributes['eyebrow'] ?? '';
    $ambrygen_heading     = $ambrygen_attributes['heading'] ?? '';
    $ambrygen_description = $ambrygen_attributes['description'] ?? '';
    $ambrygen_variation   = $ambrygen_attributes['variation'] ?? 'variation-1';
    $ambrygen_block_id    = isset($ambrygen_attributes['blockId'])
    && '' !== trim((string) $ambrygen_attributes['blockId'])
    ? sanitize_html_class((string) $ambrygen_attributes['blockId'])
    : sanitize_html_class(
    'three-column-grid-' . substr(
        md5((string) wp_json_encode($ambrygen_attributes) . '|' . $content),
        0,
        12
    )
    );
    $ambrygen_heading_tag         = Helper::get_heading_tag($ambrygen_attributes['headingTag'] ?? 'h2', 'h2');
    $ambrygen_allowed_variations  = ['variation-1', 'variation-2'];
    $ambrygen_variation           = in_array($ambrygen_variation, $ambrygen_allowed_variations, true) ? $ambrygen_variation : 'variation-1';
    $ambrygen_variation_class_map = [
    'variation-1' => '',
    'variation-2' => 'is-variation-2',
    ];
    $ambrygen_variation_class    = $ambrygen_variation_class_map[$ambrygen_variation] ?? '';
    $ambrygen_is_variation_one   = 'variation-2' !== $ambrygen_variation;
    $ambrygen_show_eyebrow       = $ambrygen_is_variation_one;
    $ambrygen_is_header_vertical = $ambrygen_is_variation_one;

    $ambrygen_has_heading     = '' !== trim(wp_strip_all_tags($ambrygen_heading));
    $ambrygen_has_description = '' !== trim(wp_strip_all_tags($ambrygen_description));
    $ambrygen_has_eyebrow     = '' !== trim(wp_strip_all_tags($ambrygen_eyebrow));
    $ambrygen_heading_id      = $ambrygen_has_heading ? $ambrygen_block_id . '-heading' : '';

    $wrapper_args = [
    'class' => trim('block-layout three-column-image-grid ' . $ambrygen_variation_class),
    ];

    if ($ambrygen_anchor || $ambrygen_block_id) {
    $wrapper_args['id'] = $ambrygen_anchor ?: $ambrygen_block_id;
    }

    if ($ambrygen_heading_id) {
    $wrapper_args['role']            = 'region';
    $wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
    }

    $wrapper_attributes = get_block_wrapper_attributes($wrapper_args);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<div
		class="three-column-image-grid__header block__rowflex is-<?php echo esc_attr($ambrygen_is_header_vertical ? 'vertical' : 'horizontal'); ?>">

		<div class="block__rowflex--col-left">

		<div class="block-title mb-0 block__rowflex--heading-title js-gsap-fade three-column-image-grid__header__left">
			   <?php if ($ambrygen_show_eyebrow && $ambrygen_has_eyebrow): ?>
				<div class="hero-kicker js-gsap-fade">
					<?php echo wp_kses_post($ambrygen_eyebrow); ?>
				</div>
			<?php endif; ?>

			   <?php if ($ambrygen_show_eyebrow && $ambrygen_has_eyebrow && $ambrygen_has_heading): ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ($ambrygen_has_heading): ?>
				<<?php echo tag_escape($ambrygen_heading_tag); ?> id="<?php echo esc_attr($ambrygen_heading_id); ?>" class="heading-3 block-title mb-0 ">
					<?php
                        echo wp_kses(
                            $ambrygen_heading,
                            Helper::allowed_heading_html()
                        );
                    ?>
				</<?php echo tag_escape($ambrygen_heading_tag); ?>>
			<?php endif; ?>
		</div>
		</div>

		<?php if ($ambrygen_has_description): ?>
			<div class="heading-content-wrapper">
				<div class="block__rowflex--block-content subtitle1-reg js-gsap-fade">
					<?php echo wp_kses_post($ambrygen_description); ?>
				</div>
			</div>
		<?php endif; ?>

	</div>

	<?php if ($ambrygen_has_heading || $ambrygen_has_description): ?>
		<div class="is-style-gl-s32" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="three-column-image-grid__content grid-content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is escaped by WordPress core. ?>
	</div>

</div>
