<?php
/**
 * Server-side rendering for icon-grids parent block
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

$variation = isset( $attributes['variation'] ) ? sanitize_text_field( $attributes['variation'] ) : '';

$ambrygen_class           = 'info-list__row info-list-block';

$ambrygen_link = $attributes['link'];
$ambrygen_main_attributes = '';
$block_id = $attributes['blockId'] ?? '';

if ( 'variation-4' === $variation ) {

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'icon-grid',
			'id'    => $block_id,
		)
	);

	$ambrygen_wrapper_attr = 'class="icon-grid__list"';

}else if ( 'our-testing-menu' === $variation ) {
	$ambrygen_class = 'our-testing-menu';

	$ambrygen_main_attributes = get_block_wrapper_attributes(
		array(
			'class' => ' ' . esc_attr( $ambrygen_class ),
			'id'=> $block_id,
		)
	);

	$ambrygen_wrapper_attr = get_block_wrapper_attributes(
		array(
			'class' => 'our-testing-menu__grid',
			
		)
	);
} else {
	$ambrygen_wrapper_attr = get_block_wrapper_attributes(
		array(
			'class' => 'info-list__row info-list-block',
		)
	);
}

$ambrygen_content = $content ?? '';

?>

<div <?php echo wp_kses_post( $ambrygen_main_attributes ); ?>>
	<?php if ( 'variation-4' === $variation ) : ?>


		<div class="icon-grid__header">

			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?> class="heading-3 block-title mb-0">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?>>
			<?php endif; ?>

			<div class="is-style-gl-s20" aria-hidden="true"></div>

			<?php if ( ! empty( $attributes['description'] ) ) : ?>
				<div class="text-xl-reg icon-grid__intro text-center">
					<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
				</div>
			<?php endif; ?>

		</div>

		<div class="is-style-gl-s64" aria-hidden="true"></div>

		<div class="icon-grid__list">
			<?php echo wp_kses_post( $content ); ?>
		</div>


	<?php return; ?>

<?php endif; ?>

	<?php if ( 'our-testing-menu' === $variation ) : ?>
		<div class="our-testing-menu__header block__rowflex">
			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?> class="block-title block__rowflex--heading-title heading-3 mb-0">
					<?php
					echo wp_kses(
						$attributes['heading'],
						Helper::allowed_heading_html()
					);
					?>
				</<?php echo esc_html( $attributes['headingTag'] ?? 'h2' ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['description'] ) ) : ?>
				<div class="block__rowflex--block-content subtitle1-reg">
					<p><?php echo wp_kses_post( $attributes['description'] ); ?></p>
						<?php if (
						! empty( $ambrygen_link['url'] ) &&
						! empty( $ambrygen_link['text'] )
					) :
						$target = ! empty( $ambrygen_link['target'] ) ? $ambrygen_link['target'] : '';
						$rel    = ! empty( $ambrygen_link['rel'] ) ? $ambrygen_link['rel'] : '';

						// Security: Add noopener when opening in new tab.
						if ( '_blank' === $target && empty( $rel ) ) {
							$rel = 'noopener noreferrer';
						}
						?>
					<div class="block_rowflex-link">
						<a
							class="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
							href="<?php echo esc_url( $ambrygen_link['url'] ); ?>"
							<?php echo $target ? ' target="' . esc_attr( $target ) . '"' : ''; ?>
							<?php echo $rel ? ' rel="' . esc_attr( $rel ) . '"' : ''; ?>
						>
							<?php echo esc_html( $ambrygen_link['text'] ); ?>
						</a>
					</div>
				<?php endif; ?>
									<div class="is-style-gl-s50" aria-hidden="true"></div>

				</div>
			<?php endif; ?>
			
		</div>

		
	<?php endif; ?>

	<div <?php echo wp_kses_post( $ambrygen_wrapper_attr ); ?>>
		<?php
		// InnerBlocks content is already escaped by Gutenberg
		echo wp_kses_post( $ambrygen_content );
		?>
	</div>
</div>
