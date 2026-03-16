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
$attributes = $attributes ?? [];

$title         = $attributes['title'] ?? 'Our Leadership Team';
$intro         = $attributes['intro'] ?? 'We are proud to be leading the industry that we love and working together.';
$heading_level = $attributes['headingLevel'] ?? 'h2';
$show_navigation = $attributes['showNavigation'] ?? true;

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'our-leadership'
]);
$heading_level = in_array($heading_level, ['h1','h2','h3','h4','h5','h6'], true) ? $heading_level : 'h2';
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="our-leadership__header block__rowflex">
        <<?php echo esc_html($heading_level); ?> class="our-leadership__title block__rowflex--heading-title heading-3 mb-0">
            <?php echo wp_kses_post($title); ?>
        </<?php echo esc_html($heading_level); ?>>
        <div class="our-leadership__intro block__rowflex--block-content subtitle1-reg">
            <?php echo wp_kses_post($intro); ?>
        </div>
    </div>

    <div class="is-style-gl-s50"></div>

  <div class="our-leadership__grid our-leadership-slider swiper"
     data-swiper-config='<?php echo wp_json_encode([
         'autoplay' => $attributes['autoplay'] ?? false,
         'navigation_show' => $attributes['showNavigation'] ?? true
            ]); ?>'>
    <div class="swiper-wrapper">
        <?php
        echo $content;
        ?>
    </div>

    <?php if ($attributes['showNavigation'] ?? true): ?>
    <div class="swiper-buttons">
				<div class="custom-prev"></div>
				<div class="custom-next"></div>
			</div>
    <?php endif; ?>

    <?php if ($attributes['showPagination'] ?? true): ?>
        <div class="swiper-pagination"></div>
    <?php endif; ?>
</div>
</div>
