<?php
/**
 * Render template for the Mega Menu Solutions block.
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

$left_title = isset($attributes['leftTitle']) ? $attributes['leftTitle'] : 'Solutions';
$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : array();

$wrapper_class = 'nav__item--mega-menu__grid ';
$wrapper_attributes = get_block_wrapper_attributes(array('class' => $wrapper_class));
?>

<!-- <div class="variation_two-column"> -->
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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
                    <div class="nav__item--mega-menu__submenu-inner--links">
                        <?php foreach ($items as $index => $item): ?>
                            <?php
                            $label     = isset($item['label']) ? $item['label'] : '';
                            $url       = isset($item['url']) ? $item['url'] : '#';
                            $icon      = isset($item['icon']) ? $item['icon'] : '';
                            $sub_items = isset($item['subItems']) && is_array($item['subItems']) ? $item['subItems'] : array();
                            $has_sub   = !empty($sub_items);
                            $panel_id  = 'level3-panel-' . esc_attr($index);
                            $wrapper_cls = 'nav__item--submenu-link-wrapper' . ($has_sub ? ' has-submenu' : '');
                            ?>
                            <div class="<?php echo esc_attr($wrapper_cls); ?>"
                                 data-connected-item="<?php echo esc_attr($index); ?>"
                                 <?php if ($has_sub): ?>data-level3-target="<?php echo $panel_id; ?>"<?php endif; ?>>

                                <?php if ($has_sub): ?>
                                    <?php /* Trigger div — clicking opens Level 3 panel */ ?>
                                    <div class="nav__item--mega-menu__submenu-inner--link submenu-inner-link">
                                        <?php if (!empty($icon)): ?>
                                            <div class="nav__item--mega-menu__submenu-inner--icon">
                                                <img src="<?php echo esc_url($icon); ?>" alt="" loading="lazy" />
                                            </div>
                                        <?php endif; ?>
                                        <div class="nav__item--mega-menu__submenu-inner--link-title body2-medium">
                                            <?php echo wp_kses_post($label); ?>
                                        </div>
                                    </div>
                                <?php else: ?>
                                    <?php /* Normal anchor link */ ?>
                                    <a href="<?php echo esc_url($url); ?>"
                                        class="nav__item--mega-menu__submenu-inner--link submenu-inner-link">
                                        <?php if (!empty($icon)): ?>
                                            <div class="nav__item--mega-menu__submenu-inner--icon">
                                                <img src="<?php echo esc_url($icon); ?>" alt="" loading="lazy" />
                                            </div>
                                        <?php endif; ?>
                                        <div class="nav__item--mega-menu__submenu-inner--link-title body2-medium">
                                            <?php echo wp_kses_post($label); ?>
                                        </div>
                                    </a>
                                <?php endif; ?>

                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

            </div>
        </div>
    </div>

    <!-- Right Column -->
    <div class="nav__item--mega-menu__cl-right">
        <div class="nav__item--mega-menu__category-submenu-row " >
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
                        <a href="<?php echo esc_url($right_url); ?>" class="cat-submenu-link">
                            <div class="nav__item--mega-menu__category-submenu-lists--links">
                                <div class="body2-medium mb-0 nav__item--mega-menu__link-title">
                                    <?php echo wp_kses_post($right_title); ?>
                                </div>
                                <div class="nav__item--mega-menu__links--icon"></div>
                            </div>
                            <?php if (!empty($right_text)): ?>
                                <p class="nav__item--mega-menu__info caption-regular">
                                    <?php echo wp_kses_post($right_text); ?>
                                </p>
                            <?php endif; ?>
                        </a>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <?php
    /* =====================================================================
     * LEVEL 3 PANELS
     * Placed here as siblings of the columns, still inside .nav__item--mega-menu__grid.
     * The grid itself has no position, so these panels position relative to
     * .nav__item--mega-menu (position:absolute, inset:0, z-index:2),
     * filling the full overlay — exactly matching the L1→L2 slide pattern.
     * ===================================================================== */
    foreach ($items as $index => $item):
        $sub_items = isset($item['subItems']) && is_array($item['subItems']) ? $item['subItems'] : array();
        if (empty($sub_items)) continue;
        $label    = isset($item['label']) ? $item['label'] : '';
        $panel_id = 'level3-panel-' . $index;
    ?>
        <div class="nav__item--level3-panel" id="<?php echo esc_attr($panel_id); ?>">
            <button class="nav__level3-close-button" type="button" aria-label="<?php esc_attr_e('Back', 'ambrygen-web'); ?>">
                <div class="icon">
                    <img src="<?php echo esc_url(get_theme_file_uri('assets/src/images/dropdown-arrow.svg')); ?>" alt="Back" />
                </div>
                <span class="label-splus-bold-italic close-title"><?php echo esc_html($label); ?></span>
            </button>
            <ul class="nav__level3-items">
                <?php foreach ($sub_items as $sub_item): ?>
                    <?php
                    $sub_label = isset($sub_item['label']) ? $sub_item['label'] : '';
                    $sub_url   = isset($sub_item['url']) ? $sub_item['url'] : '#';
                    ?>
                    <li>
                        <a href="<?php echo esc_url($sub_url); ?>">
                            <?php echo wp_kses_post($sub_label); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endforeach; ?>

</div>
<!-- </div> -->
