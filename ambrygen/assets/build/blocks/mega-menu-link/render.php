<?php
/**
 * Render template for the Mega Menu Link block.
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

$label = isset($attributes['label']) ? $attributes['label'] : '';
$url = isset($attributes['url']) ? $attributes['url'] : '#';
$icon_url = isset($attributes['iconUrl']) ? $attributes['iconUrl'] : '';

$wrapper_attributes = get_block_wrapper_attributes();
?>

<li <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <a href="<?php echo esc_url($url); ?>"
        class="nav__item--mega-menu__submenu-inner--link submenu-inner-link hover-active">
        <?php if (!empty($icon_url)): ?>
            <div class="nav__item--mega-menu__submenu-inner--icon">
                <img src="<?php echo esc_url($icon_url); ?>" alt="" />
            </div>
        <?php endif; ?>

        <?php if (!empty($label)): ?>
            <div class="nav__item--mega-menu__submenu-inner--link-title body2-medium">
                <?php echo wp_kses_post($label); ?>
            </div>
        <?php endif; ?>
    </a>
</li>