<?php
    /**
 * Render: Flexible Content Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
    if (! defined('ABSPATH')) {
    exit;
    }
    use Ambrygen\Theme\Core\Helper;

    /*
 * Block attributes.
 */
    $ambrygen_heading              = $attributes['heading'] ?? '';
    $ambrygen_heading_tag          = $attributes['headingTag'] ?? 'h2';
    $ambrygen_content              = $attributes['content'] ?? '';
    $ambrygen_image_id             = (int) ($attributes['imageId'] ?? 0);
    $ambrygen_image_alt            = $attributes['imageAlt'] ?? '';
    $ambrygen_top_icon_id          = (int) ($attributes['topIconId'] ?? 0);
    $ambrygen_top_icon_url         = $attributes['topIconUrl'] ?? '';
    $ambrygen_top_icon_alt         = $attributes['topIconAlt'] ?? '';
    $ambrygen_image_position       = $attributes['imagePosition'] ?? 'right';
    $ambrygen_layout_style         = $attributes['layoutStyle'] ?? '';
    $ambrygen_image_size           = $attributes['imageSize'] ?? 'medium';
    $ambrygen_content_alignment    = $attributes['contentAlignment'] ?? 'left';
    $ambrygen_links                = $attributes['links'] ?? [];
    $ambrygen_buttons              = [];
    $ambrygen_border_required      = $attributes['borderRequired'] ?? false;
    $ambrygen_image_position_class =
    ('right' === $ambrygen_image_position || 'iot-block__rtl' === $ambrygen_image_position)
    ? 'iot-block__rtl'
    : '';

    for ($i = 1; $i <= 2; $i++) {
    $text    = $attributes["button{$i}Text"] ?? '';
    $url     = $attributes["button{$i}Url"] ?? '';
    $new_tab = ! empty($attributes["button{$i}NewTab"]);

    if ($text && $url) {
        $ambrygen_buttons[] = [
            'text'    => $text,
            'url'     => $url,
            'new_tab' => $new_tab,
        ];
    }
    }
    /*
 * Image size mapping.
 */
    $ambrygen_image_size_map = [
    'small'  => 'medium',
    'medium' => 'large',
    'large'  => 'full',
    'full'   => 'full',
    ];

    $ambrygen_render_image_size =
    $ambrygen_image_size_map[$ambrygen_image_size] ?? 'large';

    /*
 * Wrapper attributes.
 */
    $ambrygen_border_class = $ambrygen_border_required ? 'iot-block--border' : '';
    $ambrygen_wrapper_attributes = get_block_wrapper_attributes(
    [
        'class' => trim(
            'iot-block ' .
            $ambrygen_image_position_class . ' ' .
            $ambrygen_border_class
        ),
    ]
    );
?>

<div <?php echo wp_kses_data($ambrygen_wrapper_attributes); ?>>
			<div class="iot-block__image">

				<?php
					echo Helper::image_with_placeholder(
						$ambrygen_image_id,
						'full',
						[
							'class' => 'iot-block__img',
						]
					);
				?>
			</div>

	<div class="iot-block__content">
		<div class="iot-block__text">
			<?php if ($ambrygen_top_icon_id || $ambrygen_top_icon_url): ?>
				<div class="iot-block__icon">
					<div class="iot-block__icon--wrapper">
						<?php if ($ambrygen_top_icon_id): ?>
							<?php
								echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									$ambrygen_top_icon_id,
									'full',
									[
										'class'   => 'iot-block__top-icon-image',
										'loading' => 'lazy',
									]
								);
							?>
						<?php else: ?>
							<img class="iot-block__top-icon-image" src="<?php echo esc_url($ambrygen_top_icon_url); ?>" alt="<?php echo esc_attr($ambrygen_top_icon_alt); ?>" loading="lazy" />
						<?php endif; ?>
					</div>
				</div>
				<div class="is-style-gl-s16" aria-hidden="true"></div>
			<?php endif; ?>
			<?php if ($ambrygen_heading): ?>
				<<?php echo esc_html($ambrygen_heading_tag); ?> class="heading-2 block-title mb-0">
					<?php echo wp_kses_post($ambrygen_heading); ?>
				</<?php echo esc_html($ambrygen_heading_tag); ?>>
			<?php endif; ?>
			<div class="is-style-gl-s20" aria-hidden="true"></div>
			<?php if ($ambrygen_content): ?>
				<div class="body1 iot-block__description">
					<?php echo wp_kses_post($ambrygen_content); ?>
				</div>
			<?php endif; ?>
	</div>
	<div class="is-style-gl-s24" aria-hidden="true"></div>

<?php if (! empty($attributes['buttons'])): ?>
			<div class="iot-block__button two-btn-row">
				<?php foreach ($attributes['buttons'] as $button): ?>
					<?php if (! empty($button['text']) && ! empty($button['url'])): ?>
						<a
							class="is-style-site-trailing-icon site-btn <?php echo esc_attr($button['variant']); ?>"
							href="<?php echo esc_url($button['url']); ?>"
						>
							<?php echo esc_html($button['text']); ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		</div>



</div>
