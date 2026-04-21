<?php
/**
 * Render: Collaborator Link Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param \WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

$ambrygen_text   = isset( $attributes['text'] ) ? (string) $attributes['text'] : 'Collaborator Name';
$ambrygen_url    = isset( $attributes['url'] ) ? \esc_url( (string) $attributes['url'] ) : '';
$ambrygen_target = isset( $attributes['linkTarget'] ) ? (string) $attributes['linkTarget'] : '_blank';
$ambrygen_rel    = ( '_blank' === $ambrygen_target ) ? 'noopener noreferrer' : '';

if ( empty( $ambrygen_text ) || empty( $ambrygen_url ) ) {
	return;
}
?>

<li class="collaborator-item h-100">
	<?php if ( ! empty( $ambrygen_url ) ) : ?>
		<a href="<?php echo \esc_url( $ambrygen_url ); ?>" class="collaborator-item__link link1-regular text-primary" <?php echo ! empty( $ambrygen_target ) ? 'target="' . \esc_attr( $ambrygen_target ) . '"' : ''; ?> <?php echo ! empty( $ambrygen_rel ) ? 'rel="' . \esc_attr( $ambrygen_rel ) . '"' : ''; ?>>
			<?php echo \esc_html( $ambrygen_text ); ?>
		</a>
	<?php else : ?>
		<span class="collaborator-item__text link1-regular text-primary">
			<?php echo \esc_html( $ambrygen_text ); ?>
		</span>
	<?php endif; ?>
</li>
