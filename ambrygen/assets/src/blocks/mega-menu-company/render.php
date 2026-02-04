<?php
/**
 * Render template for the Mega Menu Company block.
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

$left_title = isset($attributes['leftTitle']) ? $attributes['leftTitle'] : 'Company';
$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : array();

$wrapper_class = 'nav__item--mega-menu__grid';
$wrapper_attributes = get_block_wrapper_attributes(array('class' => $wrapper_class));
?>

<div <?php echo $wrapper_attributes; ?>>
    <!-- Left Column -->
    <div class="nav__item--mega-menu__cl-left">
        <div class="nav__item--mega-menu__submenu-inner nav__item--mega-menu__second-level--submenu-inner">
            <div class="nav__item--mega-menu__submenu-inner--col">
                <?php if (!empty($left_title)): ?>
                    <p class="nav__item--mega-menu__submenu-inner--title caption-semi-bold">
                        <?php echo wp_kses_post($left_title); ?>
                    </p>
                <?php endif; ?>

                <?php if (!empty($items)): ?>
                    <ul class="nav__item--mega-menu__submenu-inner--links">
                        <?php foreach ($items as $index => $item): ?>
                            <?php
                            $label = isset($item['label']) ? $item['label'] : '';
                            $url = isset($item['url']) ? $item['url'] : '#';
                            ?>
                            <li data-connected-item="<?php echo esc_attr($index); ?>">
                                <a href="<?php echo esc_url($url); ?>"
                                    class="nav__item--mega-menu__submenu-inner--link submenu-inner-link">
                                    <div class="nav__item--mega-menu__submenu-inner--link-title body2-medium">
                                        <?php echo wp_kses_post($label); ?>
                                    </div>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Right Column -->
    <div class="nav__item--mega-menu__cl-right">
        <div class="nav__item--mega-menu__category-submenu-row">
            <?php if (!empty($items)): ?>
                <?php foreach ($items as $index => $item): ?>
                    <?php
                    $image = isset($item['image']) ? $item['image'] : '';
                    $right_url = isset($item['rightUrl']) ? $item['rightUrl'] : '#';
                    $right_title = isset($item['rightTitle']) ? $item['rightTitle'] : '';
                    $right_text = isset($item['rightText']) ? $item['rightText'] : '';
                    ?>
                    <div class="nav__item--mega-menu__category-submenu-lists category-submenu-lists"
                        data-connected-item="<?php echo esc_attr($index); ?>">
                        <div class="nav__item--mega-menu__category-submenu-lists--image">
                            <figure>
                                <?php if (!empty($image)): ?>
                                    <img src="<?php echo esc_url($image); ?>" alt="" loading="lazy" />
                                <?php endif; ?>
                            </figure>
                        </div>
                        <div class="nav__item--mega-menu__category-submenu-lists--links">
                            <a href="<?php echo esc_url($right_url); ?>" class="nav__item--mega-menu__submenu-inner--link">
                                <p class="body2-medium mb-0 nav__item--mega-menu__link-title">
                                    <?php echo wp_kses_post($right_title); ?>
                                </p>
                                <div class="nav__item--mega-menu__links--icon"></div>
                            </a>
                        </div>
                        <?php if (!empty($right_text)): ?>
                            <p class="nav__item--mega-menu__info caption-regular">
                                <?php echo wp_kses_post($right_text); ?>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>