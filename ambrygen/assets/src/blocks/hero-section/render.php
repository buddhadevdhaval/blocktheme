<?php
/**
 * Render template for the Hero Section block.
 *
 * @package Ambrygen
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Access attributes safely with default values.
 *
 * @var array $attributes Block attributes.
 */
$attributes = isset($attributes) ? $attributes : array();

$slides = isset($attributes['slides']) && is_array($attributes['slides']) ? $attributes['slides'] : array();
$show_slider_nav = isset($attributes['showSliderNav']) ? (bool) $attributes['showSliderNav'] : true;
$show_slider_dots = isset($attributes['showSliderDots']) ? (bool) $attributes['showSliderDots'] : true;
$autoplay = isset($attributes['autoplay']) ? (bool) $attributes['autoplay'] : false;
$autoplay_delay = isset($attributes['autoplayDelay']) ? absint($attributes['autoplayDelay']) : 5000;

$swiper_config = array(
    'autoplay' => $autoplay ? array('delay' => $autoplay_delay) : false,
    'navigation' => $show_slider_nav,
    'pagination' => $show_slider_dots,
);

$wrapper_attributes = get_block_wrapper_attributes(array('class' => 'hero-section'));
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="hero-section__slider swiper container-1340"
        data-swiper-config="<?php echo esc_attr(wp_json_encode($swiper_config)); ?>">
        <div class="swiper-wrapper">
            <?php
            if (!empty($slides)):
                foreach ($slides as $index => $slide):
                    $background_image = isset($slide['backgroundImage']) ? $slide['backgroundImage'] : '';
                    $background_image_alt = isset($slide['backgroundImageAlt']) ? $slide['backgroundImageAlt'] : '';
                    $overlay_image_1 = isset($slide['overlayImage1']) ? $slide['overlayImage1'] : '';
                    $overlay_image_1_alt = isset($slide['overlayImage1Alt']) ? $slide['overlayImage1Alt'] : '';
                    $overlay_image_2 = isset($slide['overlayImage2']) ? $slide['overlayImage2'] : '';
                    $overlay_image_2_alt = isset($slide['overlayImage2Alt']) ? $slide['overlayImage2Alt'] : '';
                    $heading = isset($slide['heading']) ? $slide['heading'] : '';
                    $content = isset($slide['content']) ? $slide['content'] : '';
                    $tagline = isset($slide['tagline']) ? $slide['tagline'] : '';
                    $button_primary_text = isset($slide['buttonPrimaryText']) ? $slide['buttonPrimaryText'] : '';
                    $button_primary_url = isset($slide['buttonPrimaryUrl']) ? $slide['buttonPrimaryUrl'] : '#';
                    $button_secondary_text = isset($slide['buttonSecondaryText']) ? $slide['buttonSecondaryText'] : '';
                    $button_secondary_url = isset($slide['buttonSecondaryUrl']) ? $slide['buttonSecondaryUrl'] : '#';
                    ?>

                    <div class="hero-section__slide swiper-slide">
                        <div class="hero-section__background">
                            <?php if (!empty($background_image)): ?>
                                <img src="<?php echo esc_url($background_image); ?>"
                                    alt="<?php echo esc_attr($background_image_alt); ?>" class="hero-section__image"
                                    loading="<?php echo 0 === $index ? 'eager' : 'lazy'; ?>" />
                                <?php if (!empty($overlay_image_1)): ?>
                                    <div class="hero-section__overlay hero-section__overlay--1 hero-section__overlay--top">
                                        <img src="<?php echo esc_url($overlay_image_1); ?>"
                                            alt="<?php echo esc_attr($overlay_image_1_alt); ?>" loading="lazy" />
                                    </div>
                                <?php endif; ?>
                                <?php if (!empty($overlay_image_2)): ?>
                                    <div class="hero-section__overlay hero-section__overlay--bottom">
                                        <img src="<?php echo esc_url($overlay_image_2); ?>"
                                            alt="<?php echo esc_attr($overlay_image_2_alt); ?>" loading="lazy" />
                                    </div>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                        <div class="wrapper">
                            <div class="hero-section__content">
                                <?php if (!empty($heading)): ?>
                                    <div class="hero-section__heading heading-2">
                                        <?php echo wp_kses_post($heading); ?>
                                    </div>
                                <?php endif; ?>

                                <?php if (!empty($content)): ?>
                                    <div class="hero-section__description">
                                        <p><?php echo wp_kses_post($content); ?></p>
                                    </div>
                                <?php endif; ?>

                                <?php if (!empty($tagline)): ?>
                                    <div class="hero-section__tagline">
                                        <p><?php echo wp_kses_post($tagline); ?></p>
                                    </div>
                                <?php endif; ?>

                                <div class="hero-section__actions">
                                    <?php if (!empty($button_secondary_text)): ?>
                                        <a href="<?php echo esc_url($button_secondary_url); ?>"
                                            class="hero-section__button site-btn is-style-site-tertiary-btn is-style-site-trailing-icon">
                                            <?php echo esc_html($button_secondary_text); ?>
                                        </a>
                                    <?php endif; ?>

                                    <?php if (!empty($button_primary_text)): ?>
                                        <a href="<?php echo esc_url($button_primary_url); ?>"
                                            class="hero-section__button site-btn is-style-site-trailing-icon">
                                            <?php echo esc_html($button_primary_text); ?>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <?php if ($show_slider_nav): ?>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        <?php endif; ?>
        <?php if ($show_slider_dots): ?>
            <div class="swiper-pagination"></div>
        <?php endif; ?>
    </div>
</div>