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
                        <div class="body2-medium mb-0 nav__item--mega-menu__link-title">
							<?php echo wp_kses_post($title); ?>
                        </div>
						<div class="nav__item--mega-menu__links--icon"></div>
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
                                  <div class="menu-drawer-close-button submenu__close-button">
                                    <div class="icon">
                                        <img
											src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/dropdown-arrow.svg' ) ); ?>"
											alt="Back"
										>
                                    </div>
                                    <span
                                        class="label-splus-bold-italic close-title"> <?php echo wp_kses_post($submenu_title); ?></span>
                                </div>

                                <p class="nav__item--mega-menu__submenu-inner--title caption-semi-bold">
                                    <?php echo wp_kses_post($submenu_title); ?>
                                </p>
                            <?php endif; ?>

                            <?php if (!empty($submenu_links)): ?>
                                <div class="nav__item--mega-menu__submenu-inner--links">
                                    <?php
                                    foreach ($submenu_links as $link):
                                        $link_url = isset($link['url']) ? $link['url'] : '#';
                                        $link_icon = isset($link['icon']) ? $link['icon'] : '';
                                        $link_label = isset($link['label']) ? $link['label'] : '';
                                        ?>
                                        <div class="nav__item--mega-menu__submenu-inner--link-wrapper" >
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
                                        </div>
                                    <?php endforeach; ?>
                                </div>
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
