<?php
/**
 * Render template for the Mega Menu Patients block.
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

$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : array();

$wrapper_class = 'nav__item--mega-menu__grid';
$wrapper_attributes = get_block_wrapper_attributes(array('class' => $wrapper_class));
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php
    if (!empty($items)):
        foreach ($items as $index => $item):
            $image = isset($item['image']) ? $item['image'] : '';
            $url = isset($item['url']) ? $item['url'] : '#';
            $title = isset($item['title']) ? $item['title'] : '';
            $text = isset($item['text']) ? $item['text'] : '';
            $has_submenu = isset($item['hasSubmenu']) ? (bool) $item['hasSubmenu'] : false;
            $submenu_title = isset($item['submenuTitle']) ? $item['submenuTitle'] : '';
            $submenu_links = isset($item['submenuLinks']) && is_array($item['submenuLinks']) ? $item['submenuLinks'] : array();
            ?>
            <div class="nav__item--mega-menu__item">
                <div class="nav__item--mega-menu__col">
                    <figure class="nav__item--mega-menu__image">
                        <?php if (!empty($image)): ?>
                            <img src="<?php echo esc_url($image); ?>" alt="" loading="lazy" />
                        <?php endif; ?>
                    </figure>
                    <div class="nav__item--mega-menu__links">
                        <a href="<?php echo esc_url($url); ?>"
                            style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                            <p class="body2-medium mb-0 nav__item--mega-menu__link-title">
                                <?php echo wp_kses_post($title); ?>
                            </p>
                            <div class="nav__item--mega-menu__links--icon"></div>
                        </a>
                    </div>
                    <?php if (!empty($text)): ?>
                        <p class="nav__item--mega-menu__info caption-regular">
                            <?php echo wp_kses_post($text); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <?php if ($has_submenu): ?>
                    <div class="nav__item--mega-menu__submenu-inner">
                        <div class="nav__item--mega-menu__submenu-inner--col">
                            <?php if (!empty($submenu_title)): ?>
                                <p class="nav__item--mega-menu__submenu-inner--title caption-semi-bold">
                                    <?php echo wp_kses_post($submenu_title); ?>
                                </p>
                            <?php endif; ?>

                            <?php if (!empty($submenu_links)): ?>
                                <ul class="nav__item--mega-menu__submenu-inner--links">
                                    <?php
                                    foreach ($submenu_links as $link):
                                        $link_url = isset($link['url']) ? $link['url'] : '#';
                                        $link_icon = isset($link['icon']) ? $link['icon'] : '';
                                        $link_label = isset($link['label']) ? $link['label'] : '';
                                        ?>
                                        <li>
                                            <a href="<?php echo esc_url($link_url); ?>" class="nav__item--mega-menu__submenu-inner--link">
                                                <div class="nav__item--mega-menu__submenu-inner--icon">
                                                    <?php if (!empty($link_icon)): ?>
                                                        <img src="<?php echo esc_url($link_icon); ?>" alt="" loading="lazy" />
                                                    <?php endif; ?>
                                                </div>
                                                <div class="nav__item--mega-menu__submenu-inner--link-title body2-medium">
                                                    <?php echo wp_kses_post($link_label); ?>
                                                </div>
                                            </a>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
            <?php
        endforeach;
    endif;
    ?>
</div>