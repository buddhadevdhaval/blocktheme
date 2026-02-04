<?php
/**
 * Render template for the Mega Menu Providers block.
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
 * @var string $content Block inner content.
 */
$content = isset($content) ? $content : '';

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>